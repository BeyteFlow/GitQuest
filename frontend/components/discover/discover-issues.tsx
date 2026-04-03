"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Sparkles, ExternalLink, Loader2 } from "lucide-react";
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
import { discoverIssues, GitHubIssue } from "@/lib/api";

const languages = ["All", "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java"];
const difficulties = ["All", "Beginner", "Intermediate", "Expert"];
const sortOptions = ["Most Recent", "Most Stars", "Most Forks"];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Intermediate":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Expert":
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
  const [language, setLanguage] = useState("TypeScript");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("Most Recent");
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch issues when language changes
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const languageQuery = language === "All" ? "typescript" : language.toLowerCase();
        const response = await discoverIssues(languageQuery);
        
        if (response.error) {
          setError(response.error.message);
        } else {
          setIssues(response.data || []);
        }
      } catch (err) {
        setError("Failed to fetch issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [language]);

  // Filter issues based on search and difficulty
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.repoFullName.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === "All" || issue.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Get recommended issues (first 3 for display)
  const recommendedIssues = filteredIssues.slice(0, 3);

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

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load issues: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-border"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-muted-foreground">Loading issues...</p>
        </div>
      )}

      {/* AI Recommended Section */}
      {!loading && !error && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">AI-Recommended for You</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedIssues.length > 0 ? (
              recommendedIssues.map((issue) => (
                <IssueCard key={issue.gitHubIssueId} issue={issue} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No recommended issues available
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Issues */}
      {!loading && !error && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            All Issues ({filteredIssues.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.gitHubIssueId} issue={issue} />
            ))}
          </div>
          {filteredIssues.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No issues found matching your criteria
            </div>
          )}
        </section>
      )}

      {/* Load More */}
      {!loading && !error && filteredIssues.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-border">
            Load More Issues
          </Button>
        </div>
      )}
    </div>
  );
}

function IssueCard({ issue }: { issue: GitHubIssue }) {
  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {issue.title}
          </CardTitle>
          <a
            href={issue.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 hover:bg-accent/10 rounded transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
        <a
          href={`https://github.com/${issue.repoFullName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          {issue.repoFullName}
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={getDifficultyColor(issue.difficulty)}>
            {issue.difficulty}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {issue.xpReward} XP
          </Badge>
        </div>
        
        {/* Description preview */}
        {issue.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {issue.description.slice(0, 100)}...
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {issue.language && (
            <Badge variant="outline" className="text-xs border-border">
              {issue.language}
            </Badge>
          )}
          <span className="text-xs text-accent font-medium">
            {issue.xpReward} XP Reward
          </span>
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => {
            // TODO: Implement claim functionality
            window.open(issue.issueUrl, '_blank');
          }}
        >
          View Issue
        </Button>
      </CardContent>
    </Card>
  );
}
