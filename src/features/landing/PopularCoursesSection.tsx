"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Bot, Brain, Cpu, BookOpen } from "lucide-react";

/**
 * Popular Courses Section — 4-card horizontal grid.
 *
 * Each card: colored icon circle, title, difficulty tag, star rating.
 * Header includes "Popular Courses" + "View all courses →".
 */
const courses = [
  {
    title: "Python for AI",
    level: "Beginner friendly",
    rating: 4.8,
    reviews: "2.4k",
    icon: Bot,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    title: "Machine Learning Fundamentals",
    level: "Beginner friendly",
    rating: 4.9,
    reviews: "3.1k",
    icon: Brain,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Deep Learning with PyTorch",
    level: "Intermediate",
    rating: 4.9,
    reviews: "1.8k",
    icon: Cpu,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
  {
    title: "LLM & Prompt Engineering",
    level: "Advanced",
    rating: 4.8,
    reviews: "1.2k",
    icon: BookOpen,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PopularCoursesSection() {
  return (
    <section className="py-12 md:py-20" id="courses">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            Popular Courses
          </h2>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            View all courses
            <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

        {/* Course Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {courses.map((course) => (
            <motion.div key={course.title} variants={cardVariants}>
              <div className="group h-full cursor-pointer rounded-2xl border border-glass-border bg-bg-elevated p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-card-hover">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${course.iconBg}`}
                  >
                    <course.icon className={`h-5 w-5 ${course.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-3 text-sm font-bold leading-snug text-text-primary group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="mb-5 text-xs font-medium text-text-muted">
                      {course.level}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-semibold text-text-primary">
                        {course.rating}
                      </span>
                      <span className="text-text-muted">
                        ({course.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
