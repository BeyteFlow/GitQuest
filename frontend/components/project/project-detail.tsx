"use client";

import { ExternalLink, Star, GitFork, Eye, Users, Clock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockProject = {
  name: "next.js",
  fullName: "vercel/next.js",
  description:
    "The React Framework for the Web. Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features.",
  repoUrl: "https://github.com/vercel/next.js",
  stars: 124500,
  forks: 26800,
  watchers: 1420,
  language: "TypeScript",
  topics: ["react", "nextjs", "javascript", "typescript", "ssr", "static-site-generator"],
  openIssues: 2340,
  contributors: [
    { name: "timneutkens", avatar: "https://github.com/timneutkens.png" },
    { name: "leerob", avatar: "https://github.com/leerob.png" },
    { name: "shuding", avatar: "https://github.com/shuding.png" },
    { name: "ijjk", avatar: "https://github.com/ijjk.png" },
    { name: "styfle", avatar: "https://github.com/styfle.png" },
  ],
  issues: [
    {
      id: 1,
      title: "Add dark mode support for dashboard",
      difficulty: "Beginner",
      labels: ["good first issue", "enhancement"],
      createdAt: "2 days ago",
      isRecommended: true,
    },
    {
      id: 2,
      title: "Improve error handling in API routes",
      difficulty: "Intermediate",
      labels: ["bug", "help wanted"],
      createdAt: "5 days ago",
      isRecommended: true,
    },
    {
      id: 3,
      title: "Add support for custom server middleware",
      difficulty: "Advanced",
      labels: ["feature request"],
      createdAt: "1 week ago",
      isRecommended: false,
    },
    {
      id: 4,
      title: "Documentation improvements for App Router",
      difficulty: "Beginner",
      labels: ["documentation", "good first issue"],
      createdAt: "3 days ago",
      isRecommended: false,
    },
    {
      id: 5,
      title: "Fix hydration mismatch in development",
      difficulty: "Intermediate",
      labels: ["bug"],
      createdAt: "4 days ago",
      isRecommended: false,
    },
  ],
  recentActivity: [
    { type: "issue_closed", title: "Fixed build error", user: "timneutkens", date: "1 hour ago" },
    { type: "pr_merged", title: "Update dependencies", user: "leerob", date: "3 hours ago" },
    { type: "issue_opened", title: "New feature request", user: "shuding", date: "5 hours ago" },
    { type: "pr_opened", title: "Add new middleware", user: "ijjk", date: "1 day ago" },
  ],
};

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Intermediate":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Advanced":
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export function ProjectDetail({ slug }: { slug: string }) {
  const project = mockProject;

  return (
    <div className="container mx-auto px-4">
      {/* Back Button */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      {/* Project Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.fullName}</h1>
            <p className="text-muted-foreground max-w-2xl">{project.description}</p>
          </div>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="font-medium">{formatNumber(project.stars)}</span>
            <span className="text-muted-foreground">stars</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <GitFork className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(project.forks)}</span>
            <span className="text-muted-foreground">forks</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(project.watchers)}</span>
            <span className="text-muted-foreground">watching</span>
          </div>
          <Badge variant="outline" className="border-border">
            {project.language}
          </Badge>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {project.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="issues">Open Issues ({project.openIssues})</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4">
              {project.issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
              <Button variant="outline" className="w-full border-border">
                Load More Issues
              </Button>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4">
              {project.issues
                .filter((issue) => issue.isRecommended)
                .map((issue) => (
                  <IssueRow key={issue.id} issue={issue} />
                ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contributors */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.contributors.map((contributor) => (
                  <a
                    key={contributor.name}
                    href={`https://github.com/${contributor.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-accent transition-colors">
                      <AvatarImage src={contributor.avatar} alt={contributor.name} />
                      <AvatarFallback>{contributor.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div>
                    <p className="text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user} · {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function IssueRow({ issue }: { issue: (typeof mockProject.issues)[0] }) {
  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-medium group-hover:text-accent transition-colors">
              {issue.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={getDifficultyColor(issue.difficulty)}>
                {issue.difficulty}
              </Badge>
              {issue.labels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Opened {issue.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {issue.isRecommended && (
              <span className="flex items-center gap-1 text-xs text-accent">
                <Sparkles className="h-3 w-3" />
              </span>
            )}
            <Button size="sm" variant="outline" className="border-border">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
