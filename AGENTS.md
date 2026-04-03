# GitQuest Agent Development Guide

This guide provides essential information for AI agents working on the GitQuest codebase - a full-stack GitHub-integrated platform with Next.js frontend and ASP.NET Core backend.

## Project Architecture

### Frontend (Next.js 16 + TypeScript)
- **Location**: `/frontend`
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State**: React hooks + HTTP-only cookies for auth
- **API Client**: Custom wrapper in `lib/api.ts`

### Backend (ASP.NET Core 8)
- **Location**: `/Backend/Backend` 
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: GitHub OAuth + JWT Bearer tokens
- **API**: RESTful endpoints with Swagger documentation

## Build/Lint/Test Commands

### Frontend Development
```bash
cd frontend
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm run start           # Run production build
npm run lint            # Run ESLint
```

### Backend Development
```bash
cd Backend/Backend
dotnet restore          # Restore NuGet packages
dotnet build            # Compile application
dotnet run              # Start dev server (http://localhost:5198)
dotnet watch run        # Run with hot reload
```

### Running Both Services
```powershell
# Use the provided startup script
.\start-gitquest.ps1
```

### Testing
```bash
# No formal testing framework currently implemented
# Use .http files for API testing:
# - Backend/Backend/test-login.http
# - Manual OAuth flow testing via browser

# For single endpoint testing:
# Use VS Code REST Client with .http files
```

## Code Style Guidelines

### TypeScript/Frontend Conventions

**Imports and Path Mapping**:
```typescript
// Use absolute imports with @ alias
import { Component } from "@/components/ui/component"
import { api } from "@/lib/api"

// Type-only imports
import type { ApiResponse, GitHubIssue } from "@/lib/api"

// External dependencies
import { Analytics } from '@vercel/analytics/next'
```

**Component Structure**:
```typescript
// Use function components with TypeScript
interface ComponentProps {
  id: string;
  isActive?: boolean;
}

export function Component({ id, isActive = false }: ComponentProps) {
  return <div>...</div>
}
```

**Naming Conventions**:
- Components: `PascalCase` (e.g., `DiscoverIssues`)
- Files: `kebab-case` for components (e.g., `discover-issues.tsx`)
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- API routes: `/api/kebab-case`

### C#/Backend Conventions

**Namespace and Usings**:
```csharp
// File-scoped namespaces
namespace GitQuest.Backend.Controllers;

// System usings first, then third-party, then project
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GitQuest.Backend.Models;
```

**Controller Structure**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class ExampleController : ControllerBase
{
    private readonly GitQuestContext _context;
    
    public ExampleController(GitQuestContext context) => _context = context;
    
    [HttpGet("action")]
    public async Task<IActionResult> GetExample()
    {
        // Implementation
    }
}
```

**Naming Conventions**:
- Classes/Methods/Properties: `PascalCase`
- Parameters/Variables: `camelCase`
- Private fields: `_camelCase`
- Constants: `PascalCase`

## Error Handling Patterns

### Frontend Error Handling
```typescript
// Use structured error responses
interface ApiResponse<T> {
  data: T | null;
  error: { message: string; status: number } | null;
}

// Wrap API calls with try-catch
const { data, error } = await api.getIssues();
if (error) {
  console.error('API Error:', error.message);
  return;
}
```

### Backend Error Handling
```csharp
// Use proper HTTP status codes
public async Task<IActionResult> GetUser(string username)
{
    if (string.IsNullOrEmpty(username))
        return BadRequest("Username is required");
        
    var user = await _context.Users.FirstOrDefaultAsync(u => u.GitHubUsername == username);
    if (user == null)
        return NotFound($"User '{username}' not found");
        
    return Ok(user);
}
```

## Authentication & Security

### JWT Token Handling
- Tokens stored in HTTP-only cookies (secure)
- JWT validation on protected endpoints
- GitHub OAuth flow: `Frontend → GitHub → Backend → JWT → Frontend`

### CORS Configuration
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5198`
- Production URLs should be configured in `appsettings.json`

## Database Patterns

### Entity Framework Conventions
```csharp
// Use async/await for all database operations
var users = await _context.Users
    .Where(u => u.ExperiencePoints > 0)
    .OrderByDescending(u => u.ExperiencePoints)
    .Take(10)
    .ToListAsync();
```

### Migration Commands
```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update
```

## API Design Patterns

### RESTful Routes
- `GET /api/issues/discover` - Get GitHub issues
- `GET /api/users/leaderboard` - Get top users
- `POST /api/auth/github` - OAuth login
- `GET /api/users/{username}` - Get specific user

### Request/Response Format
```csharp
// Use record types for DTOs
public record GitHubLoginRequest(string Code);
public record AuthResponse(string Token, UserDto User);
```

## Environment Configuration

### Development Setup
1. Backend: Set user secrets for GitHub OAuth
   ```bash
   dotnet user-secrets set "GitHub:ClientSecret" "your_secret"
   ```

2. Frontend: Create `.env.local`
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5198
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
   ```

## Key Dependencies

### Frontend
- **Next.js 16**: React framework
- **Shadcn/ui**: Component library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Date-fns**: Date utilities

### Backend
- **ASP.NET Core 8**: Web framework
- **Entity Framework Core**: ORM
- **JWT Bearer**: Authentication
- **Swashbuckle**: API documentation

## Development Workflow

1. **Feature Development**: Create feature branch from `main`
2. **API First**: Define backend endpoints before frontend integration
3. **Type Safety**: Use TypeScript interfaces matching backend models
4. **Testing**: Test API endpoints with .http files
5. **Security**: Never commit secrets, use user secrets or environment variables
6. **Documentation**: Update this guide when adding new patterns

## Common Pitfalls

- **OAuth Format**: Backend expects `{code: "value"}`, not raw string
- **CORS**: Ensure both services run on correct ports (3000/5198)
- **Authentication**: Protected endpoints require valid JWT token
- **Database**: Always use async/await with Entity Framework
- **Types**: Maintain consistency between frontend/backend models

Remember: This is a real-time application integrating with GitHub's API. Always test OAuth flow end-to-end and ensure proper error handling for external API failures.