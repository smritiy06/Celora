/** Course-related types */
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  totalLessons: number;
  completedLessons: number;
  rating: number;
  totalRatings: number;
  enrolledCount: number;
  tags: string[];
  price: number;
  isFree: boolean;
  isEnrolled: boolean;
  progress: number; // 0-100
  updatedAt: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  duration: number;
  lessons: Lesson[];
  isCompleted: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz" | "practice";
  duration: number;
  isCompleted: boolean;
  videoUrl?: string;
  content?: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  totalStudents: number;
}

export interface CourseResource {
  id: string;
  title: string;
  type: "pdf" | "link" | "code" | "file";
  url: string;
  size?: string;
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CourseFilters {
  search: string;
  category: string;
  difficulty: string;
  sortBy: "popular" | "newest" | "rating" | "price";
  priceRange: "all" | "free" | "paid";
}
