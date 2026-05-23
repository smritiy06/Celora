/** Unified ChatMessage type for the AI Tutor */
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  content: string;
  codeSnippet?: string;
}

/** Chat session metadata */
export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}
