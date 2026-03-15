using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace GitQuest.Backend.Models;

public class GitQuestContext : DbContext
{
    public GitQuestContext(DbContextOptions<GitQuestContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Issue> Issues { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<UserContribution> Contributions { get; set; }
    public DbSet<Quest> Quests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GitHubUsername)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.GitHubId)
            .IsUnique();

        modelBuilder.Entity<Issue>()
            .HasIndex(i => i.GitHubIssueId)
            .IsUnique();

        // Prevent duplicate active quests for the same user/issue (TOCTOU protection)
        modelBuilder.Entity<Quest>()
            .HasIndex(q => new { q.UserId, q.GitHubIssueId, q.Status })
            .HasFilter("[Status] = 'In Progress'")
            .IsUnique()
            .HasDatabaseName("IX_Quests_UserId_GitHubIssueId_ActiveStatus");
    }
}