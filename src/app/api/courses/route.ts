/**
 * /api/courses — Course list and creation
 *
 * GET:  List courses (filtered by teacherId for teacher view)
 * POST: Create a new course (teacher only)
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CourseModel } from "@/models/Course";
import { UserModel } from "@/models/User";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teacherOnly = searchParams.get("teacherOnly") === "true";

    await connectDB();

    let query = {};
    if (teacherOnly) {
      query = { teacherId: userId };
    } else {
      // Students see only published courses
      query = { isPublished: true };
    }

    const courses = await CourseModel.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[API] GET /api/courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify user is a teacher
    const user = await UserModel.findOne({ clerkId: userId }).lean();
    if (!user || user.role !== "teacher") {
      return NextResponse.json(
        { error: "Only teachers can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, difficulty, thumbnail, modules } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: "Course title is required" },
        { status: 400 }
      );
    }

    const course = await CourseModel.create({
      teacherId: userId,
      title,
      description: description || "",
      category: category || "programming",
      difficulty: difficulty || "beginner",
      thumbnail: thumbnail || "",
      isPublished: false,
      modules: modules || [],
      enrolledStudents: [],
    });

    return NextResponse.json(course.toObject(), { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
