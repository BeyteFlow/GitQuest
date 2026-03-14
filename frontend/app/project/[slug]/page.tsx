import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectDetail } from "@/components/project/project-detail";

export const metadata: Metadata = {
  title: "Project Details - GitQuest",
  description: "Explore project details and find issues to contribute to.",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 pb-16">
        <ProjectDetail slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
