"use client";

import { useState } from "react";
import { Search, Filter, Sparkles, ExternalLink, Star, GitFork, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = ["All", "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
const sortOptions = ["Most Recent", "Most Stars", "Most Forks"];

const mockIssues = [
  {
    id: 1,
    title: "Add dark mode support for dashboard",
    repo: "vercel/next.js",
    repoUrl: "https://github.com/vercel/next.js",
    difficulty: "Beginner",
    labels: ["good first issue", "enhancement", "ui"],
    stars: 124500,
    forks: 26800,
    language: "TypeScript",
    createdAt: "2 days ago",
    isRecommended: true,
  },
  {
    id: 2,
    title: "Improve error handling in API routes",
    repo: "trpc/trpc",
    repoUrl: "https://github.com/trpc/trpc",
    difficulty: "Intermediate",
    labels: ["bug", "help wanted"],
    stars: 32400,
    forks: 1150,
    language: "TypeScript",
    createdAt: "5 days ago",
    isRecommended: true,
  },
  {
    id: 3,
    title: "Add Python 3.12 support",
    repo: "pallets/flask",
    repoUrl: "https://github.com/pallets/flask",
    difficulty: "Intermediate",
    labels: ["enhancement", "python"],
    stars: 66200,
    forks: 16100,
    language: "Python",
    createdAt: "1 week ago",
    isRecommended: false,
  },
  {
    id: 4,
    title: "Fix memory leak in async operations",
    repo: "tokio-rs/tokio",
    repoUrl: "https://github.com/tokio-rs/tokio",
    difficulty: "Advanced",
    labels: ["bug", "performance"],
    stars: 24800,
    forks: 2280,
    language: "Rust",
    createdAt: "3 days ago",
    isRecommended: false,
  },
  {
    id: 5,
    title: "Update documentation for new features",
    repo: "facebook/react",
    repoUrl: "https://github.com/facebook/react",
    difficulty: "Beginner",
    labels: ["documentation", "good first issue"],
    stars: 220000,
    forks: 45100,
    language: "JavaScript",
    createdAt: "1 day ago",
    isRecommended: true,
  },
  {
    id: 6,
    title: "Implement rate limiting middleware",
    repo: "gin-gonic/gin",
    repoUrl: "https://github.com/gin-gonic/gin",
    difficulty: "Intermediate",
    labels: ["feature request", "middleware"],
    stars: 75400,
    forks: 7850,
    language: "Go",
    createdAt: "4 days ago",
    isRecommended: false,
  },
];

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

export function DiscoverIssues() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("Most Recent");

  const recommendedIssues = mockIssues.filter((issue) => issue.isRecommended);
  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.repo.toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = language === "All" || issue.language === language;
    const matchesDifficulty = difficulty === "All" || issue.difficulty === difficulty;
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Issues</h1>
        <p className="text-muted-foreground">
          Find open source issues that match your skills and interests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues or repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {diff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="border-border">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* AI Recommended Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">AI-Recommended for You</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* All Issues */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Issues</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
        {filteredIssues.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No issues found matching your criteria
          </div>
        )}
      </section>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="border-border">
          Load More Issues
        </Button>
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: (typeof mockIssues)[0] }) {
  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {issue.title}
          </CardTitle>
          <a
            href={issue.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 hover:bg-accent/10 rounded transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
        <a
          href={issue.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          {issue.repo}
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={getDifficultyColor(issue.difficulty)}>
            {issue.difficulty}
          </Badge>
          {issue.labels.slice(0, 2).map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(issue.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {formatNumber(issue.forks)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {issue.createdAt}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs border-border">
            {issue.language}
          </Badge>
          {issue.isRecommended && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <Sparkles className="h-3 w-3" />
              Recommended
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
