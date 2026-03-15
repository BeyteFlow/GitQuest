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

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID in token.");

        // Verify the issue exists in our database and is still active
        var issue = await _context.Issues.FirstOrDefaultAsync(i => i.GitHubIssueId == id);
        if (issue == null || !issue.IsActive) return NotFound("Issue not found or no longer active.");

        var existingQuest = await _context.Quests
            .FirstOrDefaultAsync(q => q.UserId == userId && q.GitHubIssueId == id && q.Status == "In Progress");

        if (existingQuest != null) return Conflict("Quest already active.");

        var quest = new Quest
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GitHubIssueId = id,
            Status = "In Progress",
            CreatedAt = DateTime.UtcNow
        };

        _context.Quests.Add(quest);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // Unique constraint violation: another concurrent request already claimed this quest
            return Conflict("Quest already active.");
        }

        return Ok(new { message = "Quest claimed!", questId = quest.Id });
    }

    [HttpGet("my-active-quests")]
    public async Task<IActionResult> GetMyQuests()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized("User ID missing from token.");

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID in token.");
        var quests = await _context.Quests
            .Where(q => q.UserId == userId && q.Status == "In Progress")
            .ToListAsync();
        return Ok(quests);
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitQuest(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized("User ID missing from token.");
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID in token.");

        var quest = await _context.Quests
            .FirstOrDefaultAsync(q => q.UserId == userId && q.GitHubIssueId == id && q.Status == "In Progress");

        if (quest == null) return NotFound("Quest not found.");

        // Resolve the XP reward from the stored Issue record
        var issue = await _context.Issues.FirstOrDefaultAsync(i => i.GitHubIssueId == id);
        if (issue == null || !issue.IsActive) return BadRequest("Issue is no longer available.");

        quest.Status = "Completed";
        quest.CompletedAt = DateTime.UtcNow;

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("User account not found.");

        user.ExperiencePoints += issue.XPReward;

        // Update streak based on contribution dates (once per day)
        var today = DateTime.UtcNow.Date;
        if (user.LastContributionDate.HasValue)
        {
            var lastDate = user.LastContributionDate.Value.Date;
            if (lastDate == today)
            {
                // Already contributed today – do not increment streak
            }
            else if (lastDate == today.AddDays(-1))
            {
                // Contributed yesterday – extend streak
                user.CurrentStreak += 1;
            }
            else
            {
                // Gap in contributions – reset streak
                user.CurrentStreak = 1;
            }
        }
        else
        {
            user.CurrentStreak = 1;
        }

        user.LastContributionDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"{issue.XPReward} XP Awarded!", totalXp = user.ExperiencePoints });
    }
}