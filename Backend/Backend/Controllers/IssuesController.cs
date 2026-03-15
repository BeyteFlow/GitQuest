using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GitQuest.Backend.Services;
using GitQuest.Backend.Models;

namespace GitQuest.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
// This forces the controller to use the JWT scheme we defined in Program.cs
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class IssuesController : ControllerBase
{
    private readonly GitHubService _githubService;
    private readonly GitQuestContext _context;

    public IssuesController(GitHubService githubService, GitQuestContext context)
    {
        _githubService = githubService;
        _context = context;
    }

    [HttpGet("discover")]
    [AllowAnonymous]
    public async Task<IActionResult> GetIssues([FromQuery] string language = "typescript")
    {
        var issues = await _githubService.GetSuggestedIssues(language);
        if (issues == null) return BadRequest("Could not fetch issues.");
        return Ok(issues);
    }

    [HttpPost("{id}/claim")]
    public async Task<IActionResult> ClaimQuest(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("User ID missing from token.");

        var userId = Guid.Parse(userIdClaim);

        var existingQuest = await _context.Quests
            .FirstOrDefaultAsync(q => q.UserId == userId && q.GitHubIssueId == id && q.Status == "In Progress");

        if (existingQuest != null) return BadRequest("Quest already active.");

        var quest = new Quest
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GitHubIssueId = id,
            Status = "In Progress",
            CreatedAt = DateTime.UtcNow
        };

        _context.Quests.Add(quest);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Quest claimed!", questId = quest.Id });
    }

    [HttpGet("my-active-quests")]
    public async Task<IActionResult> GetMyQuests()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var quests = await _context.Quests.Where(q => q.UserId == userId).ToListAsync();
        return Ok(quests);
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitQuest(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();
        var userId = Guid.Parse(userIdClaim);

        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.UserId == userId && q.GitHubIssueId == id && q.Status == "In Progress");

        if (quest == null) return NotFound("Quest not found.");

        quest.Status = "Completed";
        quest.CompletedAt = DateTime.UtcNow;

        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.ExperiencePoints += 30;
            user.CurrentStreak += 1;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "30 XP Awarded!", totalXp = user?.ExperiencePoints });
    }
}