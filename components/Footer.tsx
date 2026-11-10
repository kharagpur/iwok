import { site } from "@/data/site";
import { BagIcon, PhoneIcon, PinIcon } from "./icons";
import { ThemeSwitch } from "./Theme";

const year = new Date().getFullYear();

/**
 * The page's end: a red "Hungry?" band that echoes the hero, then the green footer with the logo, hours and contact.
 * Phones skip what's already on screen there: the band's buttons (the Call / Order bar has them) and the Visit
 * column (Find us, just above, has the address and Directions).
 */
export function Footer() {
  return (
    <footer className="mt-14 text-white md:mt-20">
      <div className="bg-band">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-9 sm:px-6 md:flex-row md:items-center md:justify-between md:py-10">
          <p className="font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.01em] md:text-[40px]">
            Hungry?
            <span className="block text-[19px] font-semibold tracking-normal md:text-2xl">
              Dinner {site.hours[0].short}, {site.hours[0].time}
            </span>
          </p>
          <div className="hidden flex-wrap gap-2.5 md:flex">
            <a
              href={site.phone.href}
              className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-cream px-6 font-bold text-band hover:bg-[#fdf1d6]"
            >
              <PhoneIcon /> Call to order
            </a>
            <a
              href="#order"
              className="inline-flex min-h-[50px] items-center gap-2 rounded-full border-2 border-white px-6 font-bold hover:bg-cream hover:text-band"
            >
              <BagIcon /> Order delivery
            </a>
          </div>
        </div>
      </div>

      {/* Phones: room at the bottom so the Call / Order / Directions bar never covers the last line. */}
      <div className="bg-forest pb-28 md:pb-0">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-6 sm:px-6 md:pt-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.2fr_1.3fr_1fr_1.1fr]">
            <div>
              {/* The logo on the same cream plate the header uses at night: its green letters need a light background. */}
              <a href="#top" aria-label="Indian Wok, back to top" className="inline-block rounded-2xl bg-[#f6efe6] px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-240.webp" width={240} height={191} alt="" loading="lazy" decoding="async" className="h-auto w-[92px]" />
              </a>
              <p className="mt-3 max-w-[17rem] text-[15px] leading-snug text-sage">{site.heritage.line}</p>
            </div>

            <FooterColumn title="Visit" className="hidden md:block">
              <span>
                {site.address.street}, {site.address.city}
              </span>
              <span className="text-sage">{site.address.landmark}</span>
              <span className="text-sage">{site.parking.short}</span>
              <a href={site.mapUrl} rel="noopener" className="mt-1 inline-flex min-h-11 w-fit items-center gap-1.5 font-semibold underline underline-offset-4">
                <PinIcon className="size-4" /> Directions
              </a>
            </FooterColumn>

            <FooterColumn title="Hours">
              {site.hours.map((h, i) => (
                <span key={h.days} className={`flex justify-between gap-4 sm:max-w-[13rem] ${i ? "text-sage" : ""}`}>
                  <span>{h.short}</span>
                  <span className={i ? "" : "font-semibold"}>{h.time}</span>
                </span>
              ))}
              <span className="mt-2 w-fit rounded-full bg-turmeric-soft px-3 py-1 text-sm font-bold text-ink">{site.pickupOffer}</span>
            </FooterColumn>

            <FooterColumn title="Say hello">
              <a href={site.phone.href} className="inline-flex min-h-10 w-fit items-center font-semibold hover:underline">
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-10 w-fit items-center break-all text-sage hover:underline">
                {site.email}
              </a>
              <ul className="mt-2 flex flex-wrap gap-2">
                {site.social.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      rel="noopener"
                      className="inline-flex min-h-11 items-center rounded-full border-2 border-white/30 px-4 text-sm font-semibold hover:border-white"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-sage">
              © {year} {site.name} · {site.address.city}, {site.address.region}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#top" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline underline-offset-4">
                Back to top <span aria-hidden>↑</span>
              </a>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className={className}>
      <h2 className="text-[13px] font-bold tracking-[0.12em] text-turmeric uppercase">{title}</h2>
      <div className="mt-2 flex flex-col gap-1 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
