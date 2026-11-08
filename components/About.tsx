import { site } from "@/data/site";
import { PhoneIcon } from "./icons";

/** Their story (R8), and groups and catering (R9, R10). */
export function About() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-12 sm:px-6 md:grid-cols-2 md:items-start md:pt-16">
      <section aria-labelledby="story-h">
        <h2 id="story-h" className="font-display text-[28px] font-extrabold md:text-4xl">
          Our story
        </h2>
        <p className="mt-3 max-w-prose text-lg leading-relaxed">{site.story}</p>
      </section>

      <section aria-labelledby="groups-h" className="rounded-3xl bg-leaf p-5 text-white sm:p-7">
        <h2 id="groups-h" className="font-display text-2xl font-extrabold">
          Groups &amp; catering
        </h2>
        <p className="mt-2 leading-relaxed">
          Walk-ins welcome; it’s a small room with limited seating. Coming as a bigger group? Call a couple of days
          ahead. Catering for special events: call us to talk it through.
        </p>
        <a
          href={site.phone.href}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-leaf hover:bg-turmeric-soft"
        >
          <PhoneIcon /> Call {site.phone.display}
        </a>
      </section>
    </div>
  );
}
