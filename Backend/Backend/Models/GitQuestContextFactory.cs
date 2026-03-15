using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace GitQuest.Backend.Models;

public class GitQuestContextFactory : IDesignTimeDbContextFactory<GitQuestContext>
{
    public GitQuestContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<GitQuestContext>();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=(localdb)\\mssqllocaldb;Database=GitQuestDB;Trusted_Connection=True;";

        optionsBuilder.UseSqlServer(connectionString);
        return new GitQuestContext(optionsBuilder.Options);
    }
}
