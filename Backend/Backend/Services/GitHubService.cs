using System.Net.Http.Json;
using System.Text.Json.Serialization;
using GitQuest.Backend.Models;
using Microsoft.Extensions.Configuration;

namespace GitQuest.Backend.Services;

public class GitHubService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public GitHubService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "GitQuest-API");
    }

    // --- NEW: OAuth Methods ---

    public async Task<string?> GetAccessToken(string code)
    {
        var section = _config.GetSection("GitHub");

        var payload = new
        {
            client_id = section["ClientId"],
            client_secret = section["ClientSecret"],
            code = code,
            redirect_uri = section["RedirectUri"] // Ensure this matches GitHub settings
        };

        var response = await _httpClient.PostAsJsonAsync("https://github.com/login/oauth/access_token", payload);

        // GitHub returns this as form-url-encoded by default unless we ask for JSON
        _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

        var result = await response.Content.ReadFromJsonAsync<GitHubTokenResponse>();
        return result?.AccessToken;
    }

    public async Task<GitHubUserResponse?> GetGitHubUser(string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<GitHubUserResponse>();
    }

    // --- Existing: Issue Discovery ---

    public async Task<List<Issue>> GetSuggestedIssues(string language)
    {
        var query = $"language:{language}+state:open+label:\"good first issue\",\"help wanted\"";
        var url = $"https://api.github.com/search/issues?q={query}&sort=created&order=desc";

        var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode) return new List<Issue>();

        var data = await response.Content.ReadFromJsonAsync<GitHubSearchResponse>();

        return data?.Items.Select(item => new Issue
        {
            GitHubIssueId = item.Id,
            Title = item.Title,
            Description = item.Body,
            RepoFullName = ExtractRepoName(item.RepositoryUrl),
            Language = language,
            IssueUrl = item.HtmlUrl,
            Difficulty = item.Labels.Any(l => l.Name.Contains("good first issue")) ? "Beginner" : "Intermediate",
            XPReward = item.Labels.Any(l => l.Name.Contains("good first issue")) ? 15 : 30,
            IsActive = true
        }).ToList() ?? new List<Issue>();
    }

    private string ExtractRepoName(string url) => url.Replace("https://api.github.com/repos/", "");
}

// --- DTOs ---

public record GitHubTokenResponse([property: JsonPropertyName("access_token")] string AccessToken);

public record GitHubUserResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("login")] string Login,
    [property: JsonPropertyName("avatar_url")] string AvatarUrl,
    [property: JsonPropertyName("email")] string? Email
);

public record GitHubSearchResponse([property: JsonPropertyName("items")] List<GitHubIssueItem> Items);

public record GitHubIssueItem(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("body")] string Body,
    [property: JsonPropertyName("html_url")] string HtmlUrl,
    [property: JsonPropertyName("repository_url")] string RepositoryUrl,
    [property: JsonPropertyName("labels")] List<GitHubLabel> Labels
);

public record GitHubLabel([property: JsonPropertyName("name")] string Name);