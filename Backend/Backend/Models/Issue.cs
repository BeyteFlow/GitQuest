using System.ComponentModel.DataAnnotations;

namespace GitQuest.Backend.Models;

public class Issue
{
    [Key]
    public int Id { get; set; }

    [Required]
    public long GitHubIssueId { get; set; } // External ID from GitHub API

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string RepoFullName { get; set; } = string.Empty; // e.g., "dotnet/aspnetcore"

    public string? Language { get; set; }

    public string Difficulty { get; set; } = "Beginner"; // Beginner, Intermediate, Expert

    public int XPReward { get; set; } = 10;

    public string IssueUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}