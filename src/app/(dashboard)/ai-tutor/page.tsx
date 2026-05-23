"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Mic, Plus, MessageSquare, Code, FileText, Lightbulb, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockChatHistory } from "@/data/testimonials";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const suggestedPrompts = [
  { icon: Code, text: "Explain React Server Components", category: "Web Dev" },
  { icon: Lightbulb, text: "How does backpropagation work?", category: "AI/ML" },
  { icon: FileText, text: "Generate study notes on SQL joins", category: "Database" },
  { icon: BookOpen, text: "Quiz me on data structures", category: "DSA" },
];

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! I'm your AI tutor. I can explain concepts, help debug code, generate quizzes, and create study notes. What would you like to learn today? 🎓", timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great question! Here's what I can tell you about "${content.slice(0, 50)}":\n\nThis is a simulated response from the AI tutor. In production, this would be connected to an AI API (OpenAI, Gemini, etc.) to provide detailed explanations, code examples, and personalized learning assistance.\n\n**Key Points:**\n- The concept relates to fundamental principles\n- Practice exercises are available in the Quiz Arena\n- Related courses are available in your learning path\n\nWould you like me to elaborate on any specific aspect? 🤔`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-7rem)] gap-4">
        {/* Chat Sidebar */}
        <div className="hidden w-64 shrink-0 flex-col lg:flex">
          <GlassCard variant="elevated" padding="sm" className="flex h-full flex-col">
            <button className="mb-3 flex w-full items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors">
              <Plus className="h-4 w-4" /> New Chat
            </button>
            <div className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
              {mockChatHistory.map((chat) => (
                <button key={chat.id} className="w-full rounded-lg px-3 py-2 text-left hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <span className="text-xs font-medium text-text-secondary truncate">{chat.title}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-text-muted truncate pl-5">{chat.lastMessage}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Main Area */}
        <div className="flex flex-1 flex-col">
          <GlassCard variant="elevated" padding="sm" className="flex flex-1 flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.length === 1 && (
                <div className="mb-6">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt.text}
                        onClick={() => sendMessage(prompt.text)}
                        className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-left hover:bg-white/[0.06] transition-colors"
                      >
                        <prompt.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" />
                        <div>
                          <p className="text-xs font-medium text-text-primary">{prompt.text}</p>
                          <p className="text-[10px] text-text-muted">{prompt.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white/[0.05] border border-white/[0.08] text-text-secondary rounded-bl-md"
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-text-muted">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="h-2 w-2 rounded-full bg-primary/60" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                  <span className="text-xs">AI is thinking...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-end gap-2">
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-muted transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ask anything..."
                    rows={1}
                    className="w-full resize-none rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-muted transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-40 transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
