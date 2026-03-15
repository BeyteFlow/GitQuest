namespace GitQuest.Backend.Models;

public class UserContribution
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int IssueId { get; set; }
    public Issue Issue { get; set; } = null!;

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public string? PullRequestUrl { get; set; } // Proof of work
}