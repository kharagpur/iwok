import { site } from "@/data/site";
import { PhoneIcon } from "./icons";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#find-us", label: "Find us" },
];

/** The logo, big (R19), with a small menu. Phones: logo centred under the links; desktop: side by side. */
export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-2 pb-6 sm:px-6 md:flex-row md:items-center md:justify-between md:py-6">
      <nav aria-label="Main" className="flex self-stretch justify-end gap-1 md:order-2 md:self-auto md:items-center">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center px-3 font-semibold hover:text-chili">
            {l.label}
          </a>
        ))}
        <a
          href={site.phone.href}
          className="ml-2 hidden min-h-11 items-center gap-2 rounded-full bg-chili px-5 font-semibold text-white hover:bg-chili-dark md:inline-flex"
        >
          <PhoneIcon /> {site.phone.display}
        </a>
      </nav>
      <a href="#top" className="md:order-1" aria-label="Indian Wok, back to top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-480.webp"
          srcSet="/images/logo-480.webp 480w, /images/logo-720.webp 720w"
          sizes="(min-width: 768px) 220px, 250px"
          width={480}
          height={383}
          alt="Indian Wok"
          className="h-auto w-[250px] md:w-[220px]"
        />
      </a>
    </header>
  );
}
