import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DeveloperProfile } from "@/components/profile/developer-profile";

export const metadata: Metadata = {
  title: "Developer Profile - GitQuest",
  description: "View developer contributions and achievements.",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 pb-16">
        <DeveloperProfile username={username} />
      </main>
      <Footer />
    </div>
  );
}
