"use client";

import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlassCard } from "@/components/shared/GlassCard";
import { mockTestimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-sm font-semibold text-primary-light uppercase tracking-wider">Testimonials</span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Loved by <span className="gradient-text">Learners</span>
            </h2>
            <p className="mx-auto max-w-2xl text-text-muted text-lg">See what our community has to say about their Celora experience.</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockTestimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <GlassCard className="h-full" variant="elevated">
                <Quote className="mb-3 h-5 w-5 text-primary/40" />
                <p className="mb-4 text-sm text-text-secondary leading-relaxed">{t.content}</p>
                <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-cyan text-xs font-bold text-white">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
