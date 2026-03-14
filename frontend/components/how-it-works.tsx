"use client";

import { Github, Search, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Connect Your GitHub",
    description: "Sign in with your GitHub account to personalize your experience and sync your contributions.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find Issues That Match Your Skills",
    description: "Browse AI-curated issues filtered by your preferred languages, frameworks, and difficulty level.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Contributing & Build Your Profile",
    description: "Make your first contribution, earn XP, and build your reputation in the open source community.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started with GitQuest in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Step number & Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
                    <step.icon className="w-10 h-10 text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
