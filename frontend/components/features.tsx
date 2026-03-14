"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Sparkles, 
  Filter, 
  User, 
  Trophy, 
  Github 
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Open-Source Issues",
    description: "Browse thousands of curated GitHub issues from popular repositories across the open source ecosystem.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Recommendations",
    description: "Get personalized issue recommendations based on your skills, interests, and contribution history.",
  },
  {
    icon: Filter,
    title: "Filter by Language & Difficulty",
    description: "Find issues that match your expertise with powerful filters for programming languages and difficulty levels.",
  },
  {
    icon: User,
    title: "Developer Profiles",
    description: "Build your open source profile and track your contributions across projects and technologies.",
  },
  {
    icon: Trophy,
    title: "Gamified Leaderboard",
    description: "Earn XP for contributions, climb the leaderboard, and showcase your achievements to the community.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Seamlessly connect with GitHub for one-click issue access, PR tracking, and contribution sync.",
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything You Need to Start Contributing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            GitQuest provides all the tools to discover, track, and make meaningful open source contributions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-card/50 border-border hover:border-accent/50 transition-all duration-300 hover:bg-card"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
