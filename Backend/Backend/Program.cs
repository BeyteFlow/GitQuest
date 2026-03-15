using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using GitQuest.Backend.Models;
using GitQuest.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Enhanced Swagger with correct Bearer Token UI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GitQuest API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http, // Changed to Http for better Swagger UI integration
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token (no need to type 'Bearer ' manually in this box)"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// 2. Database
builder.Services.AddDbContext<GitQuestContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Infrastructure
builder.Services.AddHttpClient();
builder.Services.AddScoped<GitHubService>();

// 4. JWT Auth
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Key"];
if (string.IsNullOrEmpty(secretKey))
    throw new InvalidOperationException("JwtSettings:Key is not configured. Set it via environment variable or user secrets.");
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true, // Ensure this matches your AuthService
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true, // Ensure this matches your AuthService
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Removes the default 5-minute grace period
    };
});

builder.Services.AddAuthorization();

// 5. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("GitQuestPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 6. Pipeline - CRITICAL ORDER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("GitQuestPolicy");

// Authentication MUST come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();