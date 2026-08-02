/**
 * User Model — MongoDB/Mongoose
 *
 * Stores user profile data synced with Clerk authentication.
 * Clerk handles auth; this stores roles, preferences, and onboarding state.
 */

import mongoose, { Schema, type Document } from "mongoose";

export interface IUserPreferences {
  goal: string | null;
  level: string | null;
  style: string | null;
  interests: string[];
}

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  role: "student" | "teacher";
  onboardingCompleted: boolean;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    goal: { type: String, default: null },
    level: { type: String, default: null },
    style: { type: String, default: null },
    interests: { type: [String], default: [] },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], default: "student" },
    onboardingCompleted: { type: Boolean, default: false },
    preferences: { type: UserPreferencesSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
