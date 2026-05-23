"use client";

import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Logo size="lg" className="mb-10" />
          {children}
        </div>
      </div>

      {/* Right: Illustration side (hidden on mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-bg-secondary to-accent-cyan/20" />
        <div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-accent-cyan/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        {/* Content on illustration side */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="mb-8 text-6xl">🚀</div>
          <h2 className="mb-4 text-3xl font-bold text-text-primary">
            Learn Smarter with <span className="gradient-text">AI</span>
          </h2>
          <p className="max-w-sm text-text-muted">
            Join thousands of learners mastering tech skills with personalized AI-powered courses and quizzes.
          </p>

          {/* Floating cards */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
            {[
              { emoji: "🤖", label: "AI Tutor", desc: "24/7 Help" },
              { emoji: "🏆", label: "Quizzes", desc: "Earn XP" },
              { emoji: "📊", label: "Analytics", desc: "Track Growth" },
              { emoji: "🗺️", label: "Roadmaps", desc: "Career Paths" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] p-4 text-center animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="mb-1 text-2xl">{item.emoji}</div>
                <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
