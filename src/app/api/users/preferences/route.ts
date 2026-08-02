/**
 * /api/users/preferences — Update user onboarding preferences
 *
 * PUT: Save preferences from onboarding flow
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
    const { goal, level, style, interests } = body;

    await connectDB();

    const user = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          "preferences.goal": goal ?? null,
          "preferences.level": level ?? null,
          "preferences.style": style ?? null,
          "preferences.interests": interests ?? [],
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      },
      { new: true, lean: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API] PUT /api/users/preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
