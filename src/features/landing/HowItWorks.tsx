"use client";

import { BookOpen, Brain, BarChart3, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const steps = [
  { icon: BookOpen, title: "Learn", description: "Access expertly crafted courses with video lessons, articles, and hands-on projects.", color: "from-violet-500 to-purple-600" },
  { icon: Brain, title: "Practice", description: "Reinforce concepts with AI-generated quizzes, coding challenges, and flashcards.", color: "from-cyan-500 to-blue-600" },
  { icon: BarChart3, title: "Analyze", description: "Track your progress with detailed analytics, heatmaps, and performance insights.", color: "from-emerald-500 to-green-600" },
  { icon: TrendingUp, title: "Improve", description: "Get AI recommendations to focus on weak areas and accelerate your growth.", color: "from-amber-500 to-orange-600" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-bg-secondary/30">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-sm font-semibold text-primary-light uppercase tracking-wider">How It Works</span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Four Steps to <span className="gradient-text">Mastery</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.15}>
              <div className="relative text-center">
                {/* Step number */}
                <div className="mb-4 text-6xl font-black text-white/[0.03]">0{i + 1}</div>
                <div className={`mx-auto -mt-10 mb-4 inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-4 shadow-lg`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
