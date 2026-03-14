"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 blur-3xl rounded-full" />
          
          <div className="relative z-10 bg-card border border-border rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Find Your Next Open Source Contribution
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of developers who are building their skills and reputation through meaningful open source contributions.
            </p>
            <Button size="lg" className="gap-2 px-10 h-14 text-lg">
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
