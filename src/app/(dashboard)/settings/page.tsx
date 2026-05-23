"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Bell, Shield, Globe, Link2, Moon, Sun, Monitor } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "theme", label: "Theme", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "language", label: "Language", icon: Globe },
  { id: "connections", label: "Connections", icon: Link2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("theme");
  const [theme, setTheme] = useState("dark");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-sm text-text-muted">Customize your Celora experience</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Settings Tabs */}
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", activeTab === tab.id ? "bg-primary/10 text-primary-light" : "text-text-muted hover:bg-white/[0.04] hover:text-text-secondary")}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === "theme" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard variant="elevated" padding="md">
                  <h2 className="mb-4 text-lg font-semibold text-text-primary">Appearance</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
                      { id: "light", label: "Light", icon: Sun, desc: "Classic bright" },
                      { id: "system", label: "System", icon: Monitor, desc: "Match OS" },
                    ].map((t) => (
                      <button key={t.id} onClick={() => setTheme(t.id)} className={cn("rounded-xl p-4 text-center transition-all border", theme === t.id ? "bg-primary/10 border-primary/30" : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]")}>
                        <t.icon className={cn("mx-auto mb-2 h-6 w-6", theme === t.id ? "text-primary-light" : "text-text-muted")} />
                        <p className="text-sm font-medium text-text-primary">{t.label}</p>
                        <p className="text-[10px] text-text-muted">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard variant="elevated" padding="md">
                  <h2 className="mb-4 text-lg font-semibold text-text-primary">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Course updates", desc: "Get notified about new lessons and content", default: true },
                      { label: "Quiz reminders", desc: "Daily quiz challenge reminders", default: true },
                      { label: "Streak alerts", desc: "Don't lose your learning streak", default: true },
                      { label: "Community activity", desc: "Replies to your posts and mentions", default: false },
                      { label: "AI suggestions", desc: "Personalized learning recommendations", default: true },
                      { label: "Marketing emails", desc: "Product updates and announcements", default: false },
                    ].map((n) => (
                      <div key={n.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{n.label}</p>
                          <p className="text-xs text-text-muted">{n.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" defaultChecked={n.default} className="peer sr-only" />
                          <div className="h-5 w-9 rounded-full bg-white/[0.08] peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/60 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white" />
                        </label>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard variant="elevated" padding="md">
                  <h2 className="mb-4 text-lg font-semibold text-text-primary">Privacy & Security</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Show profile publicly", desc: "Others can view your profile and achievements", default: true },
                      { label: "Show on leaderboard", desc: "Appear in quiz and community leaderboards", default: true },
                      { label: "Share progress", desc: "Allow friends to see your learning progress", default: false },
                      { label: "Two-factor authentication", desc: "Add an extra layer of security", default: false },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{p.label}</p>
                          <p className="text-xs text-text-muted">{p.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" defaultChecked={p.default} className="peer sr-only" />
                          <div className="h-5 w-9 rounded-full bg-white/[0.08] peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/60 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white" />
                        </label>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "language" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard variant="elevated" padding="md">
                  <h2 className="mb-4 text-lg font-semibold text-text-primary">Language & Region</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-secondary">Language</label>
                      <select className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50">
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text-secondary">Timezone</label>
                      <select className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50">
                        <option>Asia/Kolkata (IST)</option>
                        <option>America/New_York (EST)</option>
                        <option>Europe/London (GMT)</option>
                        <option>Asia/Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "connections" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard variant="elevated" padding="md">
                  <h2 className="mb-4 text-lg font-semibold text-text-primary">Connected Accounts</h2>
                  <div className="space-y-3">
                    {[
                      { name: "Google", connected: true, email: "smriti@gmail.com" },
                      { name: "GitHub", connected: false, email: "" },
                      { name: "LinkedIn", connected: false, email: "" },
                    ].map((acc) => (
                      <div key={acc.name} className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{acc.name}</p>
                          <p className="text-xs text-text-muted">{acc.connected ? acc.email : "Not connected"}</p>
                        </div>
                        <button className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", acc.connected ? "bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20" : "bg-primary/10 text-primary-light hover:bg-primary/20")}>
                          {acc.connected ? "Disconnect" : "Connect"}
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
