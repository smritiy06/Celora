"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { GlassCard } from "@/components/shared/GlassCard";
import { categories } from "@/constants/categories";

export function CategoriesSection() {
  return (
    <section id="categories" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-sm font-semibold text-primary-light uppercase tracking-wider">
              Categories
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Explore Learning <span className="gradient-text">Categories</span>
            </h2>
            <p className="mx-auto max-w-2xl text-text-muted text-lg">
              From AI to cybersecurity — find your path and start building expertise.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 0.08}>
              <GlassCard className="group cursor-pointer text-center" padding="md">
                <div className={`mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br ${cat.color} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-text-primary">{cat.label}</h3>
                <p className="text-xs text-text-muted">{cat.courseCount} courses</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
