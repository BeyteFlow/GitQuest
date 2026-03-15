using System.ComponentModel.DataAnnotations;

namespace GitQuest.Backend.Models;

public class Project
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string HtmlUrl { get; set; } = string.Empty;

    public string? OwnerAvatarUrl { get; set; }

    public int Stars { get; set; }

    // AI analysis of the project's health or tech stack
    public string? TechStackSummary { get; set; }
}