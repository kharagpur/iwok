import { site } from "@/data/site";
import { PinIcon } from "./icons";
import { LocationMap } from "./LocationMap";
import { Footer } from "./Footer";

/** Map (where we are, parking at the back), address and contact (R7, R13), then the footer (components/Footer.tsx). */
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
            <a href={site.phone.href} className="font-semibold text-ember hover:underline">
              {site.phone.display}
            </a>
            {" · "}
            <a href={`mailto:${site.email}`} className="text-ember hover:underline">
              {site.email}
            </a>
          </p>
          <a
            href={site.mapUrl}
            rel="noopener"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-chili hover:text-white"
          >
            <PinIcon /> Directions
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
