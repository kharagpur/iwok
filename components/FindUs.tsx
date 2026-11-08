import { site } from "@/data/site";
import { PinIcon } from "./icons";
import { LocationMap } from "./LocationMap";

/** Map (where we are, parking at the back), address and contact (R7, R13), then the footer with social links. */
export function FindUs() {
  return (
    <>
      <section id="find-us" aria-labelledby="find-h" className="mx-auto grid max-w-6xl scroll-mt-4 gap-5 px-5 pt-12 sm:px-6 md:grid-cols-2 md:items-center md:gap-12 md:pt-16">
        <div className="order-2 md:order-1">
          <LocationMap />
        </div>
        <div className="order-1 flex flex-col gap-3 md:order-2">
          <h2 id="find-h" className="font-display text-[28px] font-extrabold md:text-4xl">
            Find us
          </h2>
          <address className="text-lg leading-relaxed not-italic">
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
          <a
            href={site.mapUrl}
            rel="noopener"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white hover:bg-chili"
          >
            <PinIcon /> Directions
          </a>
        </div>
      </section>

      <footer className="mt-14 bg-leaf pb-24 text-white md:mt-20 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-9 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-extrabold">{site.name}</p>
            <p className="mt-1 text-[15px]">
              {site.address.street}, {site.address.city} ·{" "}
              <a href={site.phone.href} className="underline-offset-2 hover:underline">
                {site.phone.display}
              </a>
              <br />
              {site.hours[0].short} {site.hours[0].time} · Closed {site.hours[1].days}
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
