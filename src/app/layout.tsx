import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celora — Learn Smarter with AI",
  description:
    "AI-powered learning platform with personalized courses, smart quizzes, an intelligent tutor, and community learning. Master tech skills faster.",
  keywords: ["learning", "AI", "courses", "quizzes", "tutor", "education", "programming"],
  authors: [{ name: "Celora" }],
  openGraph: {
    title: "Celora — Learn Smarter with AI",
    description: "AI-powered learning platform for mastering tech skills.",
    type: "website",
    url: "https://celora.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ThemeProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
