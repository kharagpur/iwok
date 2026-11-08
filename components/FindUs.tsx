import { site } from "@/data/site";
import { PinIcon } from "./icons";

/** Map, address and contact (R7, R13), then the footer with social links. */
export function FindUs() {
  return (
    <>
      <section id="find-us" aria-labelledby="find-h" className="mx-auto grid max-w-6xl scroll-mt-4 gap-4 px-4 pt-8 sm:px-6 md:grid-cols-2 md:items-center md:gap-10 md:pt-14">
        <a href={site.mapUrl} className="block overflow-hidden rounded-2xl border border-line" aria-label="Open Indian Wok in Google Maps">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/map-640.webp"
            srcSet="/images/map-640.webp 640w, /images/map-1280.webp 1280w"
            sizes="(min-width: 768px) 50vw, 100vw"
            width={640}
            height={406}
            alt="Map showing Indian Wok at Kingsway and Royal Oak"
            loading="lazy"
            decoding="async"
            className="h-48 w-full object-cover md:h-72"
          />
        </a>
        <div className="flex flex-col gap-3">
          <h2 id="find-h" className="font-display text-[26px] font-bold text-leaf md:text-3xl">
            Find us
          </h2>
          <address className="leading-relaxed not-italic md:text-lg">
            {site.address.street}, {site.address.city}, {site.address.region}
            <br />
            {site.address.landmark}
          </address>
          <p>
            <a href={site.phone.href} className="font-semibold text-chili hover:underline">
              {site.phone.display}
            </a>
            {" · "}
            <a href={`mailto:${site.email}`} className="text-chili hover:underline">
              {site.email}
            </a>
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:max-w-md">
            <a
              href={site.mapUrl}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-leaf font-semibold text-leaf hover:bg-leaf hover:text-white"
            >
              <PinIcon /> Directions
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-leaf font-semibold text-leaf hover:bg-leaf hover:text-white"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-leaf text-white md:mt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-[22px] font-bold">{site.name}</p>
            <p className="text-[15px]">
              {site.address.street}, {site.address.city} ·{" "}
              <a href={site.phone.href} className="underline-offset-2 hover:underline">
                {site.phone.display}
              </a>
            </p>
          </div>
          <ul className="flex gap-5 text-[15px]">
            {site.social.map((s) => (
              <li key={s.name}>
                <a href={s.href} rel="noopener" className="inline-flex min-h-11 items-center underline underline-offset-2">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
