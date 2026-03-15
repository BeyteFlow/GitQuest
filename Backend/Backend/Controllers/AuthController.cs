using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GitQuest.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json;

namespace GitQuest.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly GitQuestContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(IConfiguration config, GitQuestContext context, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("github-login")]
    public async Task<IActionResult> GitHubLogin([FromBody] string code)
    {
        // 1. Exchange Code for GitHub Access Token
        var githubToken = await GetGitHubAccessToken(code);
        if (string.IsNullOrEmpty(githubToken)) return Unauthorized("Invalid GitHub Code");

        // 2. Get User Info from GitHub
        var githubUser = await GetGitHubUser(githubToken);
        if (githubUser is null) return BadRequest("Could not fetch GitHub profile");

        // 3. Sync with Database
        var user = await _context.Users.FirstOrDefaultAsync(u => u.GitHubId == githubUser.id.ToString());

        if (user == null)
        {
            user = new User     
            {
                Id = Guid.NewGuid(),
                GitHubId = githubUser.id.ToString(),
                GitHubUsername = githubUser.login,
                AvatarUrl = githubUser.avatar_url,
                ExperiencePoints = 0
            };
            _context.Users.Add(user);
        }
        else
        {
            user.GitHubUsername = githubUser.login;
            user.AvatarUrl = githubUser.avatar_url;
        }

        await _context.SaveChangesAsync();

        // 4. Generate our own JWT
        var token = GenerateJwtToken(user);

        return Ok(new { token, user });
    }

    private async Task<string?> GetGitHubAccessToken(string code)
    {
        var client = _httpClientFactory.CreateClient();
        var requestData = new Dictionary<string, string>
        {
            { "client_id", _config["GitHub:ClientId"]! },
            { "client_secret", _config["GitHub:ClientSecret"]! },
            { "code", code },
            { "redirect_uri", _config["GitHub:RedirectUri"] ?? "" }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token")
        {
            Content = new FormUrlEncodedContent(requestData)
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        try
        {
            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            var result = await response.Content.ReadFromJsonAsync<GitHubTokenResponse>();
            return result?.access_token;
        }
        catch (HttpRequestException)
        {
            return null;
        }
        catch (TaskCanceledException)
        {
            return null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private async Task<GitHubUserResponse?> GetGitHubUser(string token)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.UserAgent.ParseAdd("GitQuest-App");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        try
        {
            var response = await client.GetAsync("https://api.github.com/user");
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<GitHubUserResponse>();
        }
        catch (HttpRequestException)
        {
            return null;
        }
        catch (TaskCanceledException)
        {
            return null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.GitHubUsername),
            new Claim("avatar", user.AvatarUrl ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(double.Parse(_config["JwtSettings:DurationInMinutes"] ?? "1440")),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record GitHubTokenResponse(string access_token);

public record GitHubUserResponse(long id, string login, string avatar_url);