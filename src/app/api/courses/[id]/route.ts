/**
 * /api/courses/[id] — Single course CRUD
 *
 * GET:    Get course by ID
 * PUT:    Update course (teacher only, must own the course)
 * DELETE: Delete course (teacher only, must own the course)
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

    const course = await CourseModel.findById(id).lean();
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[API] GET /api/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
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

    const body = await request.json();
    const { title, description, category, difficulty, thumbnail, modules } =
      body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (difficulty !== undefined) course.difficulty = difficulty;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (modules !== undefined) course.modules = modules;

    await course.save();

    return NextResponse.json(course.toObject());
  } catch (error) {
    console.error("[API] PUT /api/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await CourseModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
