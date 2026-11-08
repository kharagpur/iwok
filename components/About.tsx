import { reviews, site } from "@/data/site";
import { PhoneIcon } from "./icons";

/** Their story (R8), groups and catering (R9, R10), and featured reviews (R12). */
export function About() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-7 px-4 pt-8 sm:px-6 md:grid-cols-2 md:items-start md:pt-14">
        <section aria-labelledby="story-h" className="flex flex-col gap-2.5">
          <h2 id="story-h" className="font-display text-[26px] font-bold text-leaf md:text-3xl">
            Our story
          </h2>
          <p className="leading-relaxed md:text-lg">
            The owners are of Chinese descent, born and raised in India. They cooked Indian-Chinese food in
            their own restaurant in Austria for about thirty years before bringing those recipes to Burnaby.
          </p>
        </section>

        <section aria-labelledby="groups-h" className="flex flex-col gap-2.5 rounded-2xl bg-leaf p-4 text-white sm:p-6">
          <h2 id="groups-h" className="font-display text-[22px] font-bold">
            Groups &amp; catering
          </h2>
          <p className="text-[15px] leading-relaxed">
            Walk-ins welcome; it’s a small room with limited seating. Coming as a bigger group? Call a couple of
            days ahead. Catering for special events: call us to talk it through.
          </p>
          <a
            href={site.phone.href}
            className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white font-bold text-leaf hover:bg-cream sm:max-w-xs"
          >
            <PhoneIcon /> Call {site.phone.display}
          </a>
        </section>
      </div>

      {reviews.length > 0 && (
        <section aria-labelledby="reviews-h" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-14">
          <h2 id="reviews-h" className="font-display text-[26px] font-bold text-leaf md:text-3xl">
            What guests say
          </h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.author} className="rounded-2xl border border-line bg-white p-4">
                <blockquote className="leading-relaxed">“{r.quote}”</blockquote>
                <p className="mt-2 text-sm font-semibold text-clay">{r.author}, on Google</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
