"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Medal, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getLeaderboard } from "@/lib/api";

const languages = ["All Languages", "TypeScript", "JavaScript", "Python", "Rust", "Go"];
const timeframes = ["All Time", "This Month", "This Week", "Today"];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-amber-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-slate-300" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{rank}</span>;
  }
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return "border-amber-400/50 bg-amber-400/5";
    case 2:
      return "border-slate-300/50 bg-slate-300/5";
    case 3:
      return "border-amber-600/50 bg-amber-600/5";
    default:
      return "border-border";
  }
}

interface LeaderboardUser {
  gitHubUsername: string;
  avatarUrl: string | null;
  experiencePoints: number;
  currentStreak: number;
}

export function Leaderboard() {
  const [language, setLanguage] = useState("All Languages");
  const [timeframe, setTimeframe] = useState("All Time");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getLeaderboard();
        
        if (response.error) {
          setError(response.error.message);
        } else {
          setUsers(response.data || []);
        }
      } catch (err) {
        setError("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topThree = users.slice(0, 3);
  const restOfLeaderboard = users.slice(3);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Top contributors in the open source community
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-44 bg-card border-border">
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
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-36 bg-card border-border">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((tf) => (
              <SelectItem key={tf} value={tf}>
                {tf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load leaderboard: {error}</p>
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
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <Tabs defaultValue="xp" className="w-full">
          <TabsList className="bg-card border border-border mb-8">
            <TabsTrigger value="xp" className="gap-2">
              <Star className="h-4 w-4" />
              By XP
            </TabsTrigger>
            <TabsTrigger value="streak" className="gap-2">
              <Flame className="h-4 w-4" />
              By Streak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xp">
            {users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No users found on the leaderboard
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                {topThree.length >= 3 && (
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {/* Second Place */}
                    <div className="order-2 md:order-1 md:mt-8">
                      <TopThreeCard user={topThree[1]} rank={2} />
                    </div>
                    
                    {/* First Place */}
                    <div className="order-1 md:order-2">
                      <TopThreeCard user={topThree[0]} rank={1} />
                    </div>
                    
                    {/* Third Place */}
                    <div className="order-3 md:order-3 md:mt-8">
                      <TopThreeCard user={topThree[2]} rank={3} />
                    </div>
                  </div>
                )}

                {/* Rest of Leaderboard */}
                <div className="space-y-3">
                  {restOfLeaderboard.map((user, index) => (
                    <LeaderboardRow key={user.gitHubUsername} user={user} rank={index + 4} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="streak">
            {users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No users found on the leaderboard
              </div>
            ) : (
              <div className="space-y-3">
                {[...users]
                  .sort((a, b) => b.currentStreak - a.currentStreak)
                  .map((user, index) => (
                    <LeaderboardRow key={user.gitHubUsername} user={user} rank={index + 1} sortBy="streak" />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function TopThreeCard({ user, rank }: { user: LeaderboardUser; rank: number }) {
  const isFirst = rank === 1;
  
  return (
    <Card className={`bg-card ${getRankStyle(rank)} transition-all hover:scale-[1.02]`}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          {getRankIcon(rank)}
        </div>
        <Link href={`/profile/${user.gitHubUsername}`}>
          <Avatar className={`mx-auto mb-3 border-4 ${
            isFirst ? "h-24 w-24 border-amber-400/50" : "h-20 w-20 border-border"
          }`}>
            <AvatarImage src={user.avatarUrl || ""} alt={user.gitHubUsername} />
            <AvatarFallback>{user.gitHubUsername[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/profile/${user.gitHubUsername}`} className="block hover:text-accent transition-colors">
          <h3 className={`font-bold ${isFirst ? "text-xl" : "text-lg"}`}>
            {user.gitHubUsername}
          </h3>
          <p className="text-sm text-muted-foreground">@{user.gitHubUsername}</p>
        </Link>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            <span className="font-bold text-lg">{user.experiencePoints.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm">XP</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {user.currentStreak} days
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ 
  user, 
  rank, 
  sortBy = "xp" 
}: { 
  user: LeaderboardUser; 
  rank: number;
  sortBy?: "xp" | "streak";
}) {
  return (
    <Card className={`bg-card ${getRankStyle(rank)} hover:border-accent/50 transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center shrink-0">
            {getRankIcon(rank)}
          </div>
          
          <Link href={`/profile/${user.gitHubUsername}`}>
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={user.avatarUrl || ""} alt={user.gitHubUsername} />
              <AvatarFallback>{user.gitHubUsername[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.gitHubUsername}`} className="block hover:text-accent transition-colors">
              <h4 className="font-semibold truncate">{user.gitHubUsername}</h4>
              <p className="text-sm text-muted-foreground">@{user.gitHubUsername}</p>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 shrink-0">
            {sortBy === "xp" ? (
              <>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="font-bold">{user.experiencePoints.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{user.currentStreak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-bold">{user.currentStreak}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="font-semibold">{user.experiencePoints.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}