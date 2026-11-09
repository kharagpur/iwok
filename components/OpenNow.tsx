"use client";

import { useEffect, useState } from "react";
import { openStatus } from "@/lib/hours";

// "Open now" badge; the rules live in lib/hours.ts.

export function OpenNow({ className = "" }: { className?: string }) {
  const [state, setState] = useState<ReturnType<typeof openStatus>>(null);

  useEffect(() => {
    const update = () => setState(openStatus(new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  // Space is kept for the badge so nothing jumps when it appears.
  return (
    <p className={`min-h-[2.75rem] text-sm leading-snug font-semibold md:min-h-6 ${className}`} aria-live="polite">
      {state && (
        <span className={`inline-flex items-start gap-1.5 ${state.open ? "text-leaf" : "text-chili-dark"}`}>
          <span
            aria-hidden
            className={`mt-[5px] size-2.5 shrink-0 rounded-full ${state.open ? "bg-leaf" : "bg-chili"}`}
          />
          <span>
            {state.head}
            <span className="hidden md:inline"> · </span>
            <br className="md:hidden" />
            <span className="font-normal md:font-semibold">{state.detail}</span>
          </span>
        </span>
      )}
    </p>
  );
}
