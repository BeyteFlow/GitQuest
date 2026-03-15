using GitQuest.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GitQuest.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GitQuestContext _context;

    public UsersController(GitQuestContext context) => _context = context;

    // GET: api/users/leaderboard
    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard()
    {
        var topUsers = await _context.Users
            .OrderByDescending(u => u.ExperiencePoints)
            .Take(10)
            .Select(u => new { u.GitHubUsername, u.AvatarUrl, u.ExperiencePoints, u.CurrentStreak })
            .ToListAsync();

        return Ok(topUsers);
    }

    // GET: api/users/profile/{username}
    [HttpGet("profile/{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        var user = await _context.Users
            .Include(u => u.Contributions)
            .ThenInclude(c => c.Issue)
            .FirstOrDefaultAsync(u => u.GitHubUsername == username);

        if (user == null) return NotFound();

        var profile = new
        {
            user.GitHubUsername,
            user.AvatarUrl,
            user.ExperiencePoints,
            user.CurrentStreak,
            user.LastContributionDate,
            Contributions = user.Contributions.Select(c => new
            {
                c.CompletedAt,
                c.PullRequestUrl,
                Issue = c.Issue == null ? null : new
                {
                    c.Issue.Title,
                    c.Issue.RepoFullName,
                    c.Issue.IssueUrl,
                    c.Issue.Difficulty,
                    c.Issue.XPReward
                }
            })
        };

        return Ok(profile);
    }
}