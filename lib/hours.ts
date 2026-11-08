import { site } from "@/data/site";

// "Open now" status on Burnaby time, from site.openingHours. Used by the badge (components/OpenNow.tsx)
// and tested in tests/data.spec.ts. Worked out in the browser: the built page is static, so the answer
// can't be baked in at build time.

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "am" : "pm"}`;
};

export function openStatus(now: Date) {
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
