/** Domain types shared by the server (models, API routes) and the client. */

export type Role = "student" | "teacher";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonType = "article" | "video";

export interface Streak {
  current: number;
  longest: number;
  /** YYYY-MM-DD in the learner's own time zone. */
  lastActiveDate: string | null;
}

export interface UserPreferences {
  goal: string | null;
  level: Difficulty | null;
  interests: string[];
}

export interface User {
  clerkId: string;
  email: string;
  name: string;
  bio: string;
  role: Role;
  onboardingCompleted: boolean;
  preferences: UserPreferences;
  xp: number;
  streak: Streak;
  showOnLeaderboard: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonResource {
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Markdown. Rendered without raw HTML. */
  content: string;
  videoUrl: string;
  /** Minutes. */
  duration: number;
  resources: LessonResource[];
  check: LessonCheck | null;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  outcomes: string[];
  category: string;
  difficulty: Difficulty;
  thumbnail: string;
  isPublished: boolean;
  modules: CourseModule[];
  enrolledStudents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastLessonId: string | null;
  enrolledAt: string;
  lastActivityAt: string;
  completedAt: string | null;
}

export interface CourseProgress {
  percent: number;
  completedCount: number;
  lastLessonId: string | null;
  completedAt: string | null;
}

/** A course as listed in the catalog: never includes lesson content. */
export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  thumbnail: string;
  teacherName: string;
  moduleCount: number;
  lessonCount: number;
  durationMinutes: number;
  learnerCount: number;
  updatedAt: string;
  progress: CourseProgress | null;
}

export interface OutlineLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
}

export interface CourseOutline extends CourseSummary {
  outcomes: string[];
  modules: { id: string; title: string; lessons: OutlineLesson[] }[];
  enrollment: Enrollment | null;
  isOwner: boolean;
}

export interface GoalMilestone {
  id: string;
  title: string;
  done: boolean;
}

export interface LearningGoal {
  id: string;
  title: string;
  category: string | null;
  targetDate: string | null;
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonNote {
  id: string;
  courseId: string;
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
  content: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface Quiz {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  isPublished: boolean;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  teacherName: string;
  timeLimitMinutes: number;
  questionCount: number;
  bestScore: number | null;
}

/** What a learner receives before submitting: no answers or explanations. */
export interface QuizForAttempt extends QuizSummary {
  questions: { id: string; prompt: string; options: string[]; topic: string }[];
}

export interface AnswerInput {
  questionId: string;
  selectedIndex: number | null;
}

export interface ReviewItem {
  questionId: string;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  explanation: string;
  topic: string;
  isCorrect: boolean;
}

export interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  percent: number;
}

export interface QuizGrade {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  scorePercent: number;
  review: ReviewItem[];
  topics: TopicScore[];
}

export interface QuizAttempt extends QuizGrade {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  category: string;
  durationSeconds: number;
  xpEarned: number;
  submittedAt: string;
}

export interface ActivityDay {
  date: string;
  lessons: number;
  quizzes: number;
  xp: number;
  minutes: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isYou: boolean;
}

export interface AttemptSummary {
  id: string;
  quizId: string;
  quizTitle: string;
  scorePercent: number;
  submittedAt: string;
}

export interface DashboardData {
  user: User;
  today: string;
  todayActivity: ActivityDay | null;
  inProgress: CourseSummary[];
  recommended: CourseSummary[];
  recentAttempts: AttemptSummary[];
  weakTopics: TopicScore[];
  activity: ActivityDay[];
  dailyQuiz: QuizSummary | null;
  rank: number;
}

export interface ProgressData {
  user: User;
  activity: ActivityDay[];
  topics: TopicScore[];
  attempts: AttemptSummary[];
  coursesCompleted: CourseSummary[];
  coursesInProgress: CourseSummary[];
  totalMinutes: number;
  averageScore: number | null;
}

export interface CourseLearner {
  userId: string;
  name: string;
  percent: number;
  lastActivityAt: string;
  completedAt: string | null;
}

export interface CourseInsights {
  course: { id: string; title: string };
  learners: CourseLearner[];
  completionRate: number;
  averageProgress: number;
  lessonFunnel: { lessonId: string; title: string; completed: number }[];
}
