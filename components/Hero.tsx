import { site } from "@/data/site";
import { PhoneIcon, PinIcon } from "./icons";

/** Headline, Call and Directions, then Order (with the pickup offer) and Hours. */
export function Hero() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pt-7 pb-5 sm:px-6 md:grid-cols-2 md:items-center md:gap-10 md:py-12">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-[34px] leading-[1.1] font-bold text-leaf md:text-5xl">{site.tagline}</h1>
          <p className="text-clay md:text-lg">
            {site.address.street} at Royal Oak · Family-run · Dinner Tuesday to Sunday
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:max-w-md">
            <a
              href={site.phone.href}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-chili font-semibold text-white hover:bg-chili-dark"
            >
              <PhoneIcon /> Call to order
            </a>
            <a
              href={site.mapUrl}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-leaf font-semibold text-leaf hover:bg-leaf hover:text-white"
            >
              <PinIcon /> Directions
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-960.webp"
          srcSet="/images/hero-960.webp 960w, /images/hero-1920.webp 1920w"
          sizes="(min-width: 768px) 50vw, 100vw"
          width={960}
          height={532}
          alt="A spread of Indian Wok dishes"
          fetchPriority="high"
          className="h-[210px] w-full rounded-2xl object-cover sm:h-72 md:h-auto"
        />
      </section>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-[2fr_1fr]">
        <section id="order" aria-labelledby="order-h" className="flex scroll-mt-4 flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="order-h" className="font-display text-[22px] font-bold">
              Order
            </h2>
            <span className="inline-flex min-h-[30px] items-center rounded-full bg-turmeric px-3 text-[13px] font-bold">
              {site.pickupOffer}
            </span>
          </div>
          <p className="text-sm text-clay">
            Call ahead and pick up at the restaurant, or order delivery:
          </p>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {site.delivery.map((d) => (
              <a
                key={d.name}
                href={d.href}
                rel="noopener"
                className="flex min-h-12 items-center justify-center rounded-xl border border-sand font-semibold hover:border-chili hover:text-chili"
              >
                {d.name}
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="hours-h" className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 sm:p-5">
          <h2 id="hours-h" className="font-display text-[22px] font-bold">
            Hours
          </h2>
          {site.hours.map((h) => (
            <div key={h.days} className={`flex justify-between gap-4 ${h.time === "Closed" ? "text-clay" : ""}`}>
              <span>{h.days}</span>
              <span className={h.time === "Closed" ? "" : "font-bold"}>{h.time}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
