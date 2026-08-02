/**
 * /api/users — User profile CRUD
 *
 * POST: Create or update user profile (upsert by clerkId)
 * GET:  Get current user profile
 */

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await UserModel.findOne({ clerkId: userId }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API] GET /api/users error:", error);
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

    const clerkUser = await currentUser();
    const body = await request.json().catch(() => ({}));

    await connectDB();

    const user = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      {
        $setOnInsert: {
          clerkId: userId,
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
          name:
            body.name ||
            clerkUser?.firstName
              ? `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim()
              : "User",
          createdAt: new Date(),
        },
        $set: {
          ...(body.role && { role: body.role }),
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true, lean: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API] POST /api/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
