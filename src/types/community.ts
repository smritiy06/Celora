/** Community types */
export interface DiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  language: string;
  submissions: number;
  successRate: number;
  xpReward: number;
  tags: string[];
}

export interface ProjectShowcaseItem {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  thumbnail: string;
  techStack: string[];
  likes: number;
  views: number;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  category: string;
  isJoined: boolean;
  avatar: string;
  nextSessionAt?: string;
}
