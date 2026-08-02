/**
 * Course Model — MongoDB/Mongoose
 *
 * Teacher-created courses with modules/lessons structure.
 */

import mongoose, { Schema, type Document } from "mongoose";

export interface ICourseLesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz" | "practice";
  content: string;
  duration: number;
  order: number;
}

export interface ICourseModule {
  id: string;
  title: string;
  order: number;
  lessons: ICourseLesson[];
}

export interface ICourse extends Document {
  teacherId: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  isPublished: boolean;
  modules: ICourseModule[];
  enrolledStudents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseLessonSchema = new Schema<ICourseLesson>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "article", "quiz", "practice"],
      default: "article",
    },
    content: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: { type: [CourseLessonSchema], default: [] },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    teacherId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "programming" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    thumbnail: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    modules: { type: [CourseModuleSchema], default: [] },
    enrolledStudents: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const CourseModel =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
