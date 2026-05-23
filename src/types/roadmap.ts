/** Roadmap types */
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  estimatedDuration: string;
  totalCheckpoints: number;
  completedCheckpoints: number;
  progress: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  enrolledCount: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  isActive: boolean;
  checkpoints: SkillCheckpoint[];
}

export interface SkillCheckpoint {
  id: string;
  title: string;
  description: string;
  type: "learn" | "practice" | "project" | "quiz";
  isCompleted: boolean;
  resourceUrl?: string;
  estimatedTime: string;
}
