import { site } from "@/data/site";
import { BagIcon, PhoneIcon } from "./icons";
import { OpenNow } from "./OpenNow";

/** The red band: headline, Call and Order, and a round dish photo that echoes the logo's dragon circle. */
export function Hero() {
  return (
    <>
      <section className="bg-chili text-white">
        <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-[150px] sm:px-6 md:grid md:grid-cols-[1.25fr_1fr] md:gap-10 md:pt-16 md:pb-20">
          <div className="relative z-10">
            <h1 className="font-display text-[46px] leading-[0.98] font-extrabold tracking-[-0.02em] md:text-7xl">
              {site.headline}
            </h1>
            <p className="mt-4 max-w-[19rem] text-[17px] leading-snug md:max-w-md md:text-xl">
              Family-run on Kingsway at Royal Oak, Burnaby. Dinner Tuesday to Sunday.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={site.phone.href}
                className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-white px-6 font-bold text-chili hover:bg-turmeric-soft"
              >
                <PhoneIcon /> Call to order
              </a>
              <a
                href="#order"
                className="inline-flex min-h-[50px] items-center gap-2 rounded-full border-2 border-white px-6 font-bold text-white hover:bg-white hover:text-chili"
              >
                <BagIcon /> Order delivery
              </a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-dish-640.webp"
            srcSet="/images/hero-dish-640.webp 640w, /images/hero-dish-960.webp 960w"
            sizes="(min-width: 768px) 440px, 250px"
            width={640}
            height={640}
            alt="Masala Chicken"
            fetchPriority="high"
            className="absolute right-[-24px] bottom-[-110px] size-[250px] rounded-full border-8 border-white object-cover md:right-6 md:bottom-[-120px] md:size-[440px]"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <section aria-labelledby="hours-h" className="max-w-[150px] pt-6 md:max-w-none md:pt-10">
          <h2 id="hours-h" className="font-display text-xl font-extrabold">
            Hours
          </h2>
          <p className="mt-1 leading-relaxed">
            {site.hours[0].short} <strong className="whitespace-nowrap">{site.hours[0].time}</strong>
            <br />
            <span className="text-stone">Closed {site.hours[1].days}</span>
          </p>
          <OpenNow className="mt-2" />
        </section>

        <p className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-turmeric-soft px-4 py-3.5 md:mt-6">
          <span className="font-display text-[28px] font-extrabold">10%</span>
          <span className="leading-snug">off when you pick up in store. Call ahead and it’s ready when you arrive.</span>
        </p>
      </div>
    </>
  );
}
