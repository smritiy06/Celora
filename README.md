# 🚀 Celora: AI Learning Platform

Celora is an AI-powered learning platform designed to help students study smarter through personalized learning roadmaps, AI-generated quizzes, and smart analytics. It features a modern, glassmorphic UI and a robust dual-role system for both Students and Teachers.

## ✨ Core Features

### 🎓 For Students
- **Personalized Learning Roadmaps:** Generate customized learning paths based on chosen goals (e.g., AI/ML Engineer, Full Stack Developer).
- **AI Quiz Generator & Arena:** Take dynamic quizzes with varying difficulty levels to test knowledge.
- **AI Tutor Assistant:** Get instant explanations, summaries, and doubt-solving support.
- **Performance Analytics:** Track study streaks, XP, quiz scores, and weak topics.

### 👩‍🏫 For Teachers (Creator Portal)
- **Course Management:** Create, edit, and publish multi-module courses.
- **Student Tracking:** View enrolled students and track their progress.
- **Teacher Dashboard:** High-level analytics on published courses, drafts, and overall enrollments.

---

## 🛠 Tech Stack

**Frontend:**  
Next.js (App Router) • React • TailwindCSS • Framer Motion • Zustand

**Backend (Currently migrating to full cloud database):**  
Next.js API Routes • MongoDB Atlas (Mongoose) • Clerk (Authentication)

---

## 🚧 Current Status: Database Migration

We are currently transitioning the platform from client-side mock data to a fully persistent cloud backend using **MongoDB Atlas**. 

**What we've completed so far:**
- ✅ **Authentication:** Clerk integration for secure sign-ups, logins, and route protection.
- ✅ **User Profiles & Roles:** MongoDB integration for storing user roles (Student vs. Teacher) and onboarding preferences.
- ✅ **Teacher Portal:** Full CRUD (Create, Read, Update, Delete) for courses saved directly to MongoDB.

**What is currently using Mock Data (The "Fake Data"):**
Currently, some student-facing features are still reading from local placeholder files so we could build out the UI. These include:
- 🚧 Learning Goals & Roadmaps
- 🚧 Quizzes & Daily Challenges
- 🚧 Student Learning Paths & Progress Tracking

---

## 🚀 What's Coming Next (Future Roadmap)

1. **Migrating Remaining Features to MongoDB:** 
   - Moving Roadmaps, Checkpoints, and Quizzes to the database so all student progress is saved permanently.
2. **AI Integration:** 
   - Connecting the OpenAI/Gemini API to dynamically generate course content, notes, and personalized quiz questions in real-time.
3. **Advanced Analytics:** 
   - Replacing placeholder charts with real-time data visualization for both student performance and teacher course metrics.
4. **Interactive Practice Environments:** 
   - Embedding code editors and practice environments directly into lessons.

---

## 💻 Getting Started (Local Development)

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env.local`:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

   # MongoDB Atlas Database
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/celora?retryWrites=true&w=majority
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
