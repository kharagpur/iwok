import { findItem } from "@/data/menu";
import { googleReviews } from "@/data/site";
import { StarIcon } from "./icons";

/** Google rating, what guests say (in our words) and a link to read every review (R12). */
export function Reviews() {
  const loved = googleReviews.mostLoved.map((code) => findItem(code)?.name).filter(Boolean);
  return (
    <section id="reviews" aria-labelledby="reviews-h" className="mt-14 bg-mist py-10 md:mt-20 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <h2 id="reviews-h" className="font-display text-[28px] font-extrabold md:text-4xl">
            What guests say
          </h2>
          <p className="mt-3 flex items-center gap-3">
            <span className="font-display text-5xl font-extrabold">{googleReviews.rating}</span>
            <span className="flex flex-col">
              <span className="flex text-turmeric" aria-hidden="true">
                {/* Four full stars and a faded fifth, for 4.4. */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} className={i < Math.floor(googleReviews.rating) ? "size-5" : "size-5 opacity-35"} />
                ))}
              </span>
              <span className="text-sm text-stone">{googleReviews.countLabel} Google reviews</span>
            </span>
          </p>
          <a
            href={googleReviews.url}
            rel="noopener"
            className="mt-4 inline-flex min-h-12 items-center rounded-full border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-paper"
          >
            Read the reviews on Google
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <ul className="grid gap-5 sm:grid-cols-3">
            {googleReviews.themes.map((t) => (
              <li key={t.title}>
                <h3 className="font-display text-lg font-extrabold">{t.title}</h3>
                <p className="mt-1 leading-relaxed text-stone">{t.text}</p>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">
            <strong>Most talked about:</strong> {loved.join(", ")}.
          </p>
        </div>
      </div>
    </section>
  );
}
