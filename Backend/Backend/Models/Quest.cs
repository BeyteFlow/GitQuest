using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GitQuest.Backend.Models;

public class Quest
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public long GitHubIssueId { get; set; } // Links to the Issue.GitHubIssueId

    [Required]
    public string Status { get; set; } = "In Progress"; // In Progress, Completed, Abandoned

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation properties (Optional, but helpful for EF Core)
    [ForeignKey("UserId")]
    public User? User { get; set; }
}