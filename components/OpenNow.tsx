"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

// "Open now" badge, worked out in the browser on Burnaby time (the built page is static, so the
// answer can't be baked in at build time). Uses site.openingHours, so changing the hours there is enough.

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "am" : "pm"}`;
};

function status(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Vancouver",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = dayNames.indexOf(get("weekday"));
  const time = Number(get("hour")) * 60 + Number(get("minute"));

  const { days, opens, closes } = site.openingHours;
  const openOn = (d: number) => days.includes(dayNames[d % 7]);

  if (openOn(day) && time >= minutes(opens) && time < minutes(closes)) {
    const soon = minutes(closes) - time <= 30;
    return { open: true, head: soon ? "Closing soon" : "Open now", detail: soon ? `closes at ${clock(closes)}` : `until ${clock(closes)}` };
  }
  if (openOn(day) && time < minutes(opens)) return { open: false, head: "Closed", detail: `opens at ${clock(opens)} today` };
  for (let i = 1; i <= 7; i++) {
    if (openOn(day + i)) {
      const when = i === 1 ? "tomorrow" : dayNames[(day + i) % 7].slice(0, 3);
      return { open: false, head: "Closed", detail: `opens ${when} at ${clock(opens)}` };
    }
  }
  return null;
}

export function OpenNow({ className = "" }: { className?: string }) {
  const [state, setState] = useState<ReturnType<typeof status>>(null);

  useEffect(() => {
    const update = () => setState(status(new Date()));
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
