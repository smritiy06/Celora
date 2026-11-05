export const CATEGORIES = [
  { id: "ai-ml", label: "AI & Machine Learning" },
  { id: "web-dev", label: "Web Development" },
  { id: "dsa", label: "Data Structures & Algorithms" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "electronics", label: "Electronics" },
  { id: "data-science", label: "Data Science" },
  { id: "app-dev", label: "App Development" },
] as const;

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [string, ...string[]];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export const LEARNING_GOALS = [
  { id: "career-switch", label: "Change careers", hint: "Build job-ready skills in a new field" },
  { id: "exam-prep", label: "Prepare for an exam", hint: "Practise and find the gaps before test day" },
  { id: "portfolio", label: "Build a portfolio", hint: "Learn by making things you can show" },
  { id: "curiosity", label: "Learn out of interest", hint: "Explore at your own pace" },
] as const;

export function goalLabel(id: string | null | undefined): string | null {
  return LEARNING_GOALS.find((g) => g.id === id)?.label ?? null;
}

export const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 300 },
  { level: 4, xpRequired: 600 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 1500 },
  { level: 7, xpRequired: 2200 },
  { level: 8, xpRequired: 3000 },
  { level: 9, xpRequired: 4000 },
  { level: 10, xpRequired: 5500 },
] as const;

export const XP_PER_LESSON = 10;
export const XP_COURSE_BONUS = 50;
export const XP_PER_CORRECT_ANSWER = 10;
