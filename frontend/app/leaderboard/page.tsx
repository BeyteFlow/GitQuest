import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Leaderboard } from "@/components/leaderboard/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard - GitQuest",
  description: "See top contributors and their achievements in the open source community.",
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 pb-16">
        <Leaderboard />
      </main>
      <Footer />
    </div>
  );
}
