/**
 * /api/courses/[id]/publish — Toggle course publish status
 *
 * PUT: Toggle isPublished
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CourseModel } from "@/models/Course";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const course = await CourseModel.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.teacherId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    return NextResponse.json(course.toObject());
  } catch (error) {
    console.error("[API] PUT /api/courses/[id]/publish error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
