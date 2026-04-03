<div align="center">

# 🗺️ GitQuest

### *Turn open-source contributions into an epic adventure*

**Discover real GitHub issues, claim quests, earn XP, and level up your developer journey — all in one place.**

[![Stars](https://img.shields.io/github/stars/BeyteFlow/GitQuest?style=for-the-badge&logo=github&color=FFD700)](https://github.com/BeyteFlow/GitQuest/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/BeyteFlow/GitQuest?style=for-the-badge&color=informational)](https://github.com/BeyteFlow/GitQuest/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blueviolet?style=for-the-badge)](https://github.com/BeyteFlow/GitQuest/pulls)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com)

<br/>

> 🚀 **Open source feels overwhelming?** GitQuest breaks the barrier — it surfaces the right issues for your skill level so you can start contributing *today*, not someday.

<br/>

![GitQuest Demo](https://placehold.co/900x480/1a1a2e/ffffff?text=GitQuest+–+Gamified+Open+Source+Contributions)

</div>

---

## ✨ Features

- 🔍 **Quest Discovery** — Browse 30+ real GitHub issues filtered by programming language and difficulty level  
- 🏆 **Gamification System** — Earn XP, track streaks, and climb the global leaderboard
- 🎯 **Skill-Matched Levels** — Issues tagged as *Beginner*, *Intermediate*, or *Expert* so you always find the right challenge
- 🔐 **GitHub OAuth** — One-click sign in with your existing GitHub account; no extra account needed
- 📊 **Contribution Dashboard** — A personal profile showing your completed quests, XP, and contribution streak
- 🥇 **Live Leaderboard** — Compete with other contributors and see where you rank globally with real-time data
- 🗂️ **Project Explorer** — Discover open-source projects looking for contributors like you
- ⚡ **Real-Time Integration** — Live data from GitHub API, no mock data

---

## 🖼️ Preview

| Discover Quests | Leaderboard | Your Profile |
|:-:|:-:|:-:|
| ![Discover](https://placehold.co/280x180/0f172a/94a3b8?text=Discover+Page) | ![Leaderboard](https://placehold.co/280x180/0f172a/94a3b8?text=Leaderboard) | ![Profile](https://placehold.co/280x180/0f172a/94a3b8?text=User+Profile) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn/ui |
| **Backend** | ASP.NET Core 8, C#, Entity Framework Core |
| **Database** | SQL Server with Entity Framework migrations |
| **Auth** | GitHub OAuth 2.0 + JWT Bearer Tokens (HTTP-only cookies) |
| **API** | RESTful endpoints with Swagger/OpenAPI documentation |
| **Integration** | Live GitHub API, Real-time data synchronization |

---

## 🚀 Current Status

**✅ Fully Integrated & Operational**
- Frontend-backend integration complete with real GitHub API data
- OAuth authentication working end-to-end  
- Live leaderboard with real user rankings
- 30+ real GitHub issues loaded dynamically
- Security: JWT tokens in HTTP-only cookies, secrets in user secrets
- CORS configured between frontend (3000) ↔ backend (5198)

**🎯 Ready to Use:**
Both services are fully functional and can be started with the provided PowerShell script or manual commands above.

---

## ⚡ Quick Start

> **Prerequisites:** [Node.js 18.18+](https://nodejs.org), [.NET 8 SDK](https://dotnet.microsoft.com/download), [SQL Server](https://www.microsoft.com/en-us/sql-server), a [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

**🚀 Easy Setup with PowerShell Script:**
```powershell
# 1. Clone and navigate to repository
git clone https://github.com/BeyteFlow/GitQuest.git
cd GitQuest

# 2. Run the integrated startup script (starts both services)
.\start-gitquest.ps1
```

**OR Manual Setup:**
```bash
# 1. Backend (Terminal 1)
cd Backend/Backend
dotnet restore && dotnet run
# API available at http://localhost:5198 | Swagger UI at http://localhost:5198/swagger

# 2. Frontend (Terminal 2) 
cd frontend
npm install && npm run dev
# App available at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub — that's it! 🎉

---

## 📦 Installation & Configuration

### 🔧 Backend Setup

```bash
cd Backend/Backend
dotnet restore
```

**Configure GitHub OAuth (Required):**

1. **Create GitHub OAuth App** at [GitHub Developer Settings](https://github.com/settings/developers)
   - **Application name**: `GitQuest Local`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

2. **Set User Secrets (Secure - Recommended):**
```bash
# Initialize user secrets
dotnet user-secrets init

# Set GitHub OAuth credentials
dotnet user-secrets set "GitHub:ClientSecret" "your_github_oauth_client_secret"
```

3. **Configure appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=GitQuestDB;Trusted_Connection=True;"
  },
  "JwtSettings": {
    "Key": "Your_Super_Secret_Key_At_Least_32_Chars_Long!",
    "Issuer": "GitQuestBackend",
    "Audience": "GitQuestFrontend",
    "DurationInMinutes": 1440
  },
  "GitHub": {
    "ClientId": "your_github_oauth_client_id",
    "CallbackUrl": "http://localhost:3000/api/auth/callback/github"
  }
}
```

4. **Initialize Database:**
```bash
dotnet ef database update
dotnet run
```

### 🌐 Frontend Setup

```bash
cd frontend
npm install
```

**Configure Environment Variables:**
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5198
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_client_id
```

**Start Development Server:**
```bash
npm run dev      # Development (http://localhost:3000)
npm run build    # Production build
npm start        # Production server
```

---

## 🎮 Usage

### 1. 🔐 Sign In
Click **"Sign in with GitHub"** on the home page. GitQuest uses secure GitHub OAuth — no password required.

### 2. 🔍 Discover Real Quests  
Navigate to **Discover**, filter by your favorite programming language, and browse 30+ real GitHub issues refreshed live.

```http
GET /api/issues/discover?language=typescript
```

### 3. 🎯 Claim a Quest
Found an issue you like? Hit **"Claim Quest"** to lock it in and start working.

```http  
POST /api/issues/{issueId}/claim
Authorization: Bearer <JWT_TOKEN>
```

### 4. 🏆 Complete & Earn XP
Open a pull request on GitHub and link it to your quest. Once merged, XP is awarded automatically and your streak counter grows.

### 5. 🥇 Check the Live Leaderboard
Head to `/leaderboard` to see real-time rankings of contributors globally.

---

## 💡 Why GitQuest?

Contributing to open source for the first time is **hard**. Finding the right issue, understanding the codebase, and getting started all take time. Most beginners give up before they even open their first PR.

GitQuest changes that by:

- **Surfacing beginner-friendly issues** so you don't waste hours searching
- **Adding game mechanics** (XP, streaks, leaderboards) that keep you motivated
- **Tracking your journey** so every contribution feels meaningful and visible

Whether you're a student looking to build your portfolio or a seasoned dev wanting to explore new projects, GitQuest makes open-source contribution accessible, rewarding, and fun.

---

## 🤝 Contributing

Contributions are what make the open-source community amazing — and GitQuest itself is a great first project to contribute to!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** — we review promptly!

Please read our [Contributing Guidelines](CONTRIBUTING.md) and follow the [Code of Conduct](CODE_OF_CONDUCT.md) if present.

> 💡 **Tip:** Check the [Issues tab](https://github.com/BeyteFlow/GitQuest/issues) for tasks labelled `good first issue` or `help wanted` — those are perfect starting points.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

Made with ❤️ by [BeyteFlow](https://github.com/BeyteFlow) and the open-source community

⭐ **If GitQuest helped you, give it a star — it means the world!** ⭐

</div>