"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

/**
 * Dark/Light theme toggle with a cinematic circular reveal transition.
 *
 * When toggling, a radial clip-path animation emanates from the sun/moon icon,
 * simulating "switching off the sun" — darkness (or light) radiates outward
 * from the toggle position to fill the screen.
 *
 * Uses the View Transition API where supported, with an instant fallback.
 */
export function ThemeToggle({ className }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    if (isAnimating) return;

    const isDarkNow = theme === "dark";
    const nextTheme = isDarkNow ? "light" : "dark";
    const button = buttonRef.current;

    // Get the center of the toggle button — the origin of the radial wipe
    if (!button) {
      setTheme(nextTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the maximum radius needed to cover the entire viewport
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check for View Transition API support
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    setIsAnimating(true);

    // Signal direction to CSS for correct z-index layering
    document.documentElement.dataset.themeDirection = isDarkNow ? "to-light" : "to-dark";

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      if (!isDarkNow) {
        // ─── Going DARK: darkness radiates outward from the toggle ───
        // Animate the NEW (dark) view expanding from a point to full screen
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      } else {
        // ─── Going LIGHT: sun absorbs the darkness inward ───
        // Animate the OLD (dark) view collapsing into the toggle point
        document.documentElement.animate(
          {
            clipPath: [
              `circle(${maxRadius}px at ${x}px ${y}px)`,
              `circle(0px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-old(root)",
          }
        );
      }
    });

    transition.finished.then(() => {
      setIsAnimating(false);
      delete document.documentElement.dataset.themeDirection;
    });
  }, [theme, setTheme, isAnimating]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-glass-border bg-bg-elevated",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "theme-toggle-btn relative flex h-9 w-9 items-center justify-center rounded-lg border border-glass-border bg-bg-elevated text-text-secondary transition-all duration-200 hover:bg-bg-hover hover:text-text-primary overflow-hidden",
        isAnimating && "pointer-events-none",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun icon — visible in dark mode (click to bring light) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      >
        <Sun className="h-4 w-4" />
      </span>

      {/* Moon icon — visible in light mode (click to bring darkness) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          !isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      >
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}
