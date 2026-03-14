"use client";

import { useState } from "react";
import { Trophy, Flame, Star, Medal, Crown } from "lucide-react";
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

const languages = ["All Languages", "TypeScript", "JavaScript", "Python", "Rust", "Go"];
const timeframes = ["All Time", "This Month", "This Week", "Today"];

const mockLeaderboard = [
  {
    rank: 1,
    username: "sarahcoder",
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    xp: 45200,
    streak: 67,
    issuesResolved: 234,
    topLanguage: "TypeScript",
  },
  {
    rank: 2,
    username: "devmaster",
    name: "Alex Rivera",
    avatar: "https://i.pravatar.cc/150?u=alex",
    xp: 42150,
    streak: 45,
    issuesResolved: 198,
    topLanguage: "Python",
  },
  {
    rank: 3,
    username: "rustacean",
    name: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?u=mike",
    xp: 38900,
    streak: 52,
    issuesResolved: 176,
    topLanguage: "Rust",
  },
  {
    rank: 4,
    username: "webwizard",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=emma",
    xp: 35600,
    streak: 38,
    issuesResolved: 165,
    topLanguage: "JavaScript",
  },
  {
    rank: 5,
    username: "pythonista",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/150?u=david",
    xp: 32400,
    streak: 29,
    issuesResolved: 142,
    topLanguage: "Python",
  },
  {
    rank: 6,
    username: "gopher",
    name: "Lisa Zhang",
    avatar: "https://i.pravatar.cc/150?u=lisa",
    xp: 28700,
    streak: 33,
    issuesResolved: 128,
    topLanguage: "Go",
  },
  {
    rank: 7,
    username: "fullstack",
    name: "James Brown",
    avatar: "https://i.pravatar.cc/150?u=james",
    xp: 25300,
    streak: 21,
    issuesResolved: 115,
    topLanguage: "TypeScript",
  },
  {
    rank: 8,
    username: "codequeen",
    name: "Anna Martinez",
    avatar: "https://i.pravatar.cc/150?u=anna",
    xp: 22100,
    streak: 18,
    issuesResolved: 98,
    topLanguage: "JavaScript",
  },
  {
    rank: 9,
    username: "opensourcer",
    name: "Tom Anderson",
    avatar: "https://i.pravatar.cc/150?u=tom",
    xp: 19800,
    streak: 25,
    issuesResolved: 87,
    topLanguage: "TypeScript",
  },
  {
    rank: 10,
    username: "bugfixer",
    name: "Sophie Lee",
    avatar: "https://i.pravatar.cc/150?u=sophie",
    xp: 17500,
    streak: 14,
    issuesResolved: 76,
    topLanguage: "Python",
  },
];

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

export function Leaderboard() {
  const [language, setLanguage] = useState("All Languages");
  const [timeframe, setTimeframe] = useState("All Time");

  const topThree = mockLeaderboard.slice(0, 3);
  const restOfLeaderboard = mockLeaderboard.slice(3);

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
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Second Place */}
            <div className="order-2 md:order-1 md:mt-8">
              <TopThreeCard user={topThree[1]} />
            </div>
            {/* First Place */}
            <div className="order-1 md:order-2">
              <TopThreeCard user={topThree[0]} isFirst />
            </div>
            {/* Third Place */}
            <div className="order-3 md:mt-12">
              <TopThreeCard user={topThree[2]} />
            </div>
          </div>

          {/* Rest of Leaderboard */}
          <div className="space-y-3">
            {restOfLeaderboard.map((user) => (
              <LeaderboardRow key={user.username} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streak">
          {/* Sorted by streak */}
          <div className="space-y-3">
            {[...mockLeaderboard]
              .sort((a, b) => b.streak - a.streak)
              .map((user, index) => (
                <LeaderboardRow key={user.username} user={{ ...user, rank: index + 1 }} showStreak />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TopThreeCard({ user, isFirst = false }: { user: (typeof mockLeaderboard)[0]; isFirst?: boolean }) {
  return (
    <Card className={`bg-card ${getRankStyle(user.rank)} transition-all hover:scale-[1.02]`}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          {getRankIcon(user.rank)}
        </div>
        <Link href={`/profile/${user.username}`}>
          <Avatar className={`mx-auto mb-3 border-4 ${
            isFirst ? "h-24 w-24 border-amber-400/50" : "h-20 w-20 border-border"
          }`}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/profile/${user.username}`} className="block hover:text-accent transition-colors">
          <h3 className={`font-bold ${isFirst ? "text-xl" : "text-lg"}`}>{user.name}</h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </Link>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            <span className="font-bold text-lg">{user.xp.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm">XP</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {user.streak} days
            </span>
            <Badge variant="outline" className="border-border">
              {user.topLanguage}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ user, showStreak = false }: { user: (typeof mockLeaderboard)[0]; showStreak?: boolean }) {
  return (
    <Card className={`bg-card ${getRankStyle(user.rank)} hover:border-accent/50 transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center shrink-0">
            {getRankIcon(user.rank)}
          </div>
          <Link href={`/profile/${user.username}`} className="shrink-0">
            <Avatar className="h-12 w-12 border-2 border-border hover:border-accent transition-colors">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.username}`} className="hover:text-accent transition-colors">
              <h3 className="font-semibold truncate">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className={showStreak ? "font-bold text-foreground" : ""}>{user.streak} days</span>
            </span>
            <span className="text-muted-foreground">
              {user.issuesResolved} issues
            </span>
            <Badge variant="outline" className="border-border">
              {user.topLanguage}
            </Badge>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-accent" />
              <span className={`font-bold ${!showStreak ? "text-lg" : ""}`}>
                {user.xp.toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
