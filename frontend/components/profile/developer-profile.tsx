"use client";

import { ExternalLink, Flame, Trophy, Star, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const mockProfile = {
  username: "johndoe",
  name: "John Doe",
  avatar: "https://github.com/shadcn.png",
  bio: "Full-stack developer passionate about open source. TypeScript & React enthusiast.",
  githubUrl: "https://github.com/johndoe",
  xp: 12450,
  level: 24,
  nextLevelXp: 15000,
  rank: 42,
  streak: 15,
  longestStreak: 45,
  joinedDate: "January 2024",
  stats: {
    issuesResolved: 87,
    pullRequests: 124,
    projectsContributed: 23,
    linesOfCode: 45200,
  },
  badges: [
    { name: "First Contribution", icon: "🎯", earned: true },
    { name: "Bug Hunter", icon: "🐛", earned: true },
    { name: "Documentation Pro", icon: "📚", earned: true },
    { name: "Team Player", icon: "🤝", earned: true },
    { name: "Night Owl", icon: "🦉", earned: false },
    { name: "Speed Demon", icon: "⚡", earned: false },
  ],
  contributions: [
    {
      id: 1,
      title: "Fix hydration mismatch in SSR",
      repo: "vercel/next.js",
      type: "bug",
      date: "2 days ago",
      xp: 150,
    },
    {
      id: 2,
      title: "Add TypeScript types for new API",
      repo: "trpc/trpc",
      type: "feature",
      date: "5 days ago",
      xp: 200,
    },
    {
      id: 3,
      title: "Update installation guide",
      repo: "shadcn-ui/ui",
      type: "docs",
      date: "1 week ago",
      xp: 75,
    },
    {
      id: 4,
      title: "Improve error messages",
      repo: "prisma/prisma",
      type: "enhancement",
      date: "2 weeks ago",
      xp: 125,
    },
    {
      id: 5,
      title: "Add dark mode support",
      repo: "tailwindlabs/tailwindcss",
      type: "feature",
      date: "3 weeks ago",
      xp: 175,
    },
  ],
  topProjects: [
    { name: "vercel/next.js", contributions: 15, language: "TypeScript" },
    { name: "prisma/prisma", contributions: 12, language: "TypeScript" },
    { name: "trpc/trpc", contributions: 8, language: "TypeScript" },
    { name: "shadcn-ui/ui", contributions: 6, language: "TypeScript" },
  ],
  languages: [
    { name: "TypeScript", percentage: 65 },
    { name: "JavaScript", percentage: 20 },
    { name: "Python", percentage: 10 },
    { name: "Other", percentage: 5 },
  ],
};

function getTypeColor(type: string) {
  switch (type) {
    case "bug":
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    case "feature":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "docs":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "enhancement":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function DeveloperProfile({ username }: { username: string }) {
  const profile = mockProfile;

  return (
    <div className="container mx-auto px-4">
      {/* Back Button */}
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Avatar className="h-28 w-28 border-4 border-accent/30">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="text-3xl">{profile.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-border">
                <ExternalLink className="h-4 w-4 mr-2" />
                View GitHub
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground mb-4 max-w-xl">{profile.bio}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <span className="font-semibold">{profile.xp.toLocaleString()}</span>
              <span className="text-muted-foreground">XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{profile.streak}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span className="font-semibold">#{profile.rank}</span>
              <span className="text-muted-foreground">rank</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="bg-card border-border mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {profile.level}</span>
            <span className="text-sm text-muted-foreground">
              {profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <Progress
            value={(profile.xp / profile.nextLevelXp) * 100}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {(profile.nextLevelXp - profile.xp).toLocaleString()} XP to next level
          </p>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{profile.stats.issuesResolved}</p>
                    <p className="text-xs text-muted-foreground">Issues Resolved</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{profile.stats.pullRequests}</p>
                    <p className="text-xs text-muted-foreground">Pull Requests</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{profile.stats.projectsContributed}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{(profile.stats.linesOfCode / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Lines of Code</p>
                  </CardContent>
                </Card>
              </div>

              {/* Badges */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {profile.badges.map((badge) => (
                      <div
                        key={badge.name}
                        className={`text-center p-3 rounded-lg border ${
                          badge.earned
                            ? "border-accent/30 bg-accent/5"
                            : "border-border bg-muted/30 opacity-50"
                        }`}
                      >
                        <span className="text-2xl">{badge.icon}</span>
                        <p className="text-xs mt-1 text-muted-foreground">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Contributions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Recent Contributions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.contributions.slice(0, 3).map((contribution) => (
                    <ContributionRow key={contribution.id} contribution={contribution} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions" className="space-y-4">
              {profile.contributions.map((contribution) => (
                <ContributionRow key={contribution.id} contribution={contribution} />
              ))}
              <Button variant="outline" className="w-full border-border">
                Load More
              </Button>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {profile.topProjects.map((project) => (
                <Card key={project.name} className="bg-card border-border hover:border-accent/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.contributions} contributions
                      </p>
                    </div>
                    <Badge variant="outline" className="border-border">
                      {project.language}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Languages */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Top Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <Progress value={lang.percentage} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Member Since */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member since</p>
                  <p className="text-sm text-muted-foreground">{profile.joinedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Longest Streak */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Longest Streak</p>
                  <p className="text-sm text-muted-foreground">{profile.longestStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContributionRow({ contribution }: { contribution: (typeof mockProfile.contributions)[0] }) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="space-y-1">
        <p className="font-medium text-sm">{contribution.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{contribution.repo}</span>
          <Badge variant="outline" className={`text-xs ${getTypeColor(contribution.type)}`}>
            {contribution.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{contribution.date}</p>
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-medium text-accent">+{contribution.xp} XP</span>
      </div>
    </div>
  );
}
