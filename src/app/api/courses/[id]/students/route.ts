/**
 * /api/courses/[id]/students — List enrolled students
 *
 * GET: Returns enrolled student count and IDs
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { CourseModel } from "@/models/Course";

export async function GET(
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

    const course = await CourseModel.findById(id)
      .select("enrolledStudents teacherId")
      .lean();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.teacherId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      totalStudents: course.enrolledStudents?.length || 0,
      students: course.enrolledStudents || [],
    });
  } catch (error) {
    console.error("[API] GET /api/courses/[id]/students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
