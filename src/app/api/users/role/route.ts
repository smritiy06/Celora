/**
 * /api/users/role — Update user role
 *
 * PUT: Switch user role between student and teacher
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["student", "teacher"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student' or 'teacher'" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      { $set: { role, updatedAt: new Date() } },
      { new: true, lean: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API] PUT /api/users/role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
