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
        // Many-to-Many Configuration or specific indexing
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GitHubUsername)
            .IsUnique();

        modelBuilder.Entity<Issue>()
            .HasIndex(i => i.GitHubIssueId)
            .IsUnique();
    }
}