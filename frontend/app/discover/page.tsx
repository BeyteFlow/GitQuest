import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DiscoverIssues } from "@/components/discover/discover-issues";

export const metadata: Metadata = {
  title: "Discover Issues - GitQuest",
  description: "Find open source issues that match your skills and start contributing today.",
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 pb-16">
        <DiscoverIssues />
      </main>
      <Footer />
    </div>
  );
}
