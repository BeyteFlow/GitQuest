using System.ComponentModel.DataAnnotations;

namespace GitQuest.Backend.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string GitHubId { get; set; } = string.Empty; // Unique ID from GitHub (e.g., "823456")

    [Required]
    public string GitHubUsername { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? AvatarUrl { get; set; }

    // Gamification Stats
    public int ExperiencePoints { get; set; } = 0;
    public int CurrentStreak { get; set; } = 0;
    public DateTime? LastContributionDate { get; set; }

    public ICollection<UserContribution> Contributions { get; set; } = new List<UserContribution>();
}