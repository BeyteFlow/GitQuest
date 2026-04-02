"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Flame, Trophy, Star, Calendar, ArrowLeft, Loader2, Target, BookOpen, Bug, Zap } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type UserProfile = NonNullable<
  Awaited<ReturnType<typeof getUserProfile>>["data"]
>;

export function DeveloperProfile({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      // Note: Passing null/undefined for token if viewing public profile
      const { data, error } = await getUserProfile(username);
      
      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, [username]);

  if (loading) return <ProfileSkeleton />;
  if (error || !profile) return <div className="text-center py-20 text-red-400">Error: {error ?? "User not found"}</div>;

  // Level Logic: 100 XP per level
  const currentLevel = Math.floor(profile.experiencePoints / 100) + 1;
  const xpInCurrentLevel = profile.experiencePoints % 100;
  const progressToNextLevel = xpInCurrentLevel; // Out of 100

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl animate-in fade-in duration-500">
      {/* Navigation */}
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-accent/20 shadow-2xl">
            <AvatarImage src={profile.avatarUrl ?? ""} alt={profile.gitHubUsername} />
            <AvatarFallback className="text-4xl bg-secondary">{profile.gitHubUsername[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full px-3 py-1 text-xs font-bold shadow-lg border-2 border-background">
            LVL {currentLevel}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{profile.gitHubUsername}</h1>
              <p className="text-muted-foreground text-lg">Open Source Contributor</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="rounded-full px-6">
                <a href={`https://github.com/${profile.gitHubUsername}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" /> GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <StatItem icon={<Star className="text-accent fill-accent" />} value={profile.experiencePoints} label="Total XP" />
            <StatItem icon={<Flame className="text-orange-500" />} value={profile.currentStreak} label="Day Streak" />
            <StatItem icon={<Trophy className="text-amber-400" />} value="Top 1%" label="Rank" />
          </div>
        </div>
      </div>

      {/* Leveling Card */}
      <Card className="mb-10 overflow-hidden border-none bg-gradient-to-br from-secondary/50 to-background shadow-inner border border-white/5">
        <CardContent className="p-8">
          <div className="flex justify-between items-end mb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Progress to Level {currentLevel + 1}</h3>
              <p className="text-2xl font-bold">{100 - xpInCurrentLevel} XP Remaining</p>
            </div>
            <span className="text-sm font-mono text-accent">{xpInCurrentLevel}%</span>
          </div>
          <Progress value={progressToNextLevel} className="h-3 bg-secondary" />
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-secondary/30 p-1">
              <TabsTrigger value="activity" className="rounded-lg">Recent Activity</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-lg">Achievements</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg">Detailed Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6 space-y-4">
              {/* This would map over profile.quests or contributions if you added them to the User model */}
              <ContributionItem title="Fixed Hydration Mismatch" repo="vercel/next.js" xp={30} type="bug" />
              <ContributionItem title="Updated Documentation" repo="facebook/react" xp={30} type="docs" />
              <p className="text-center text-sm text-muted-foreground py-4 italic">Showing your latest verified quests</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-md">
            <CardHeader><CardTitle className="text-sm font-semibold">Tech Stack</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "Tailwind"].map(tech => (
                <Badge key={tech} variant="secondary" className="bg-secondary/50 hover:bg-accent hover:text-white transition-colors cursor-default">
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-md p-6">
             <div className="flex items-center gap-4">
               <Calendar className="h-5 w-5 text-accent" />
               <div>
                 <p className="text-xs text-muted-foreground uppercase">Member Since</p>
                 <p className="font-medium text-sm">March 2026</p>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for Cleanliness ---

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-secondary/50 rounded-lg">{icon}</div>
      <div>
        <div className="text-xl font-bold leading-none">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

function ContributionItem({ title, repo, xp, type }: { title: string, repo: string, xp: number, type: 'bug' | 'docs' | 'feat' }) {
  const icons = { bug: <Bug className="h-4 w-4" />, docs: <BookOpen className="h-4 w-4" />, feat: <Zap className="h-4 w-4" /> };
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-white/5 hover:border-accent/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-background rounded-full text-accent">{icons[type as keyof typeof icons]}</div>
        <div>
          <h4 className="font-medium text-sm group-hover:text-accent transition-colors">{title}</h4>
          <p className="text-xs text-muted-foreground">{repo}</p>
        </div>
      </div>
      <div className="text-sm font-bold text-accent">+{xp} XP</div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-8 animate-pulse">
      <div className="flex gap-8 items-center">
        <div className="h-32 w-32 bg-secondary rounded-full" />
        <div className="flex-1 space-y-4">
          <div className="h-10 w-48 bg-secondary rounded" />
          <div className="h-6 w-32 bg-secondary rounded" />
        </div>
      </div>
      <div className="h-32 w-full bg-secondary rounded-xl" />
    </div>
  );
}