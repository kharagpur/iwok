"use client";

import { useEffect, useState } from "react";
import { themeKey, type ThemeChoice } from "@/lib/theme";

// The theme controls: a sun/moon button in the header and Light / Dark / Auto in the footer. Both read
// and write the same choice, so they always agree. Colours themselves live in app/globals.css.

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

function readChoice(): ThemeChoice {
  try {
    const c = localStorage.getItem(themeKey);
    return c === "light" || c === "dark" ? c : "auto";
  } catch {
    return "auto";
  }
}

function saveChoice(choice: ThemeChoice) {
  try {
    if (choice === "auto") localStorage.removeItem(themeKey);
    else localStorage.setItem(themeKey, choice);
  } catch {
    // Private browsing can refuse storage; the theme still changes for this visit.
  }
}

function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      const c = readChoice();
      const d = c === "dark" || (c === "auto" && darkQuery().matches);
      document.documentElement.dataset.theme = d ? "dark" : "light";
      setChoice(c);
      setDark(d);
    };
    sync();
    const query = darkQuery();
    query.addEventListener("change", sync);
    window.addEventListener("themechange", sync);
    window.addEventListener("storage", sync);
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("themechange", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const choose = (c: ThemeChoice) => {
    saveChoice(c);
    window.dispatchEvent(new Event("themechange"));
  };
  return { choice, dark, choose };
}

/** Header: one tap switches between light and dark (and stops following the phone). */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { dark, choose } = useTheme();
  return (
    <button
      type="button"
      onClick={() => choose(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`inline-flex size-11 items-center justify-center rounded-full hover:bg-mist ${className}`}
    >
      {dark ? (
        <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

const options: { id: ThemeChoice; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "auto", label: "Auto" },
];

/** Footer: Light, Dark or Auto (follows the phone; the default). */
export function ThemeSwitch() {
  const { choice, choose } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex w-fit gap-1 rounded-full bg-white/10 p-1">
      {options.map((o) => {
        const on = choice === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => choose(o.id)}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold ${
              on ? "bg-white text-forest" : "text-white hover:bg-white/15"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
