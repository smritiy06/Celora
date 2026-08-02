/** Teacher course types (client-side) */

export interface TeacherCourseLesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz" | "practice";
  content: string;
  duration: number;
  order: number;
}

export interface TeacherCourseModule {
  id: string;
  title: string;
  order: number;
  lessons: TeacherCourseLesson[];
}

export interface TeacherCourse {
  _id: string;
  teacherId: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  isPublished: boolean;
  modules: TeacherCourseModule[];
  enrolledStudents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherCourseFormData {
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  modules: TeacherCourseModule[];
}

export interface TeacherStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
}
