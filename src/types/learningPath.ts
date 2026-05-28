/** Learning Path types — replaces the old Course types */
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  totalModules: number;
  completedModules: number;
  tags: string[];
  progress: number; // 0-100
  updatedAt: string;
  modules: PathModule[];
  aiGenerated: boolean;
  createdBy: "ai" | "system" | "mentor";
  goalId?: string;
  icon?: string;
}

export interface PathModule {
  id: string;
  title: string;
  duration: number;
  lessons: ModuleLesson[];
  isCompleted: boolean;
  order: number;
  aiNotes?: string;
}

export interface ModuleLesson {
  id: string;
  title: string;
  type: "learn" | "article" | "quiz" | "practice" | "project";
  duration: number;
  isCompleted: boolean;
  content?: string;
}

export interface PathFilters {
  search: string;
  category: string;
  difficulty: string;
  sortBy: "recent" | "progress" | "duration";
}
