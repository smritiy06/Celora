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
  /** Running totals kept by the reviews model, so the catalog can sort by rating. */
  ratingSum?: number;
  ratingCount?: number;
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
  rating: RatingSummary | null;
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

export interface RatingSummary {
  average: number;
  count: number;
}

export interface CourseReview {
  id: string;
  courseId: string;
  authorName: string;
  rating: number;
  text: string;
  isYou: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReviews {
  summary: RatingSummary;
  /** How many reviews gave 1 to 5 stars, at index 0 to 4. */
  distribution: number[];
  reviews: CourseReview[];
  mine: CourseReview | null;
  canReview: boolean;
}

export interface DiscussionPost {
  id: string;
  courseId: string;
  lessonId: string;
  parentId: string | null;
  authorName: string;
  isTeacher: boolean;
  isYou: boolean;
  canDelete: boolean;
  reportedByYou: boolean;
  body: string;
  createdAt: string;
  replies: DiscussionPost[];
}

export type NotificationType = "reply" | "question" | "review" | "enrollment" | "completion";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export interface TutorContext {
  courseId: string;
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
}

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  /** True when the learner stopped the answer before it finished. */
  stopped?: boolean;
  createdAt: string;
}

export interface TutorChatSummary {
  id: string;
  title: string;
  context: TutorContext | null;
  updatedAt: string;
}

export interface TutorChat extends TutorChatSummary {
  messages: TutorMessage[];
}

export interface TutorStatus {
  available: boolean;
  remainingToday: number;
  dailyLimit: number;
}

/** Newline-delimited JSON events streamed by the tutor route. */
export type TutorEvent =
  | { type: "messageStart"; chatId: string; title: string }
  | { type: "delta"; text: string }
  | { type: "messageComplete" }
  | { type: "error"; message: string };

export interface Certificate {
  id: string;
  learnerName: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  lessonCount: number;
  durationMinutes: number;
  completedAt: string;
}
