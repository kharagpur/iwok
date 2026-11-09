import { site } from "@/data/site";
import { PhoneIcon } from "./icons";
import { ThemeToggle } from "./Theme";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#find-us", label: "Find us" },
];

/** The logo with a small menu. Phones: logo big, centred under the links; desktop: a compact bar, small logo beside the links. */
export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-2 pb-6 sm:px-6 md:flex-row md:items-center md:justify-between md:py-3">
      <nav aria-label="Main" className="flex self-stretch justify-end gap-1 md:order-2 md:self-auto md:items-center">
        <ThemeToggle className="mr-auto md:mr-1" />
        {links.map((l) => (
          <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center px-3 font-semibold hover:text-ember">
            {l.label}
          </a>
        ))}
        <a
          href={site.phone.href}
          className="ml-2 hidden min-h-11 items-center gap-2 rounded-full bg-chili px-5 font-semibold text-white hover:bg-chili-press md:inline-flex"
        >
          <PhoneIcon /> {site.phone.display}
        </a>
      </nav>
      {/* At night the logo sits on a cream "signboard" plate: its dark-green letters would vanish on the dark page. */}
      <a
        href="#top"
        className="block md:order-1 dark:rounded-[28px] dark:bg-[#f6efe6] dark:px-[22px] dark:py-[14px] md:dark:rounded-xl md:dark:px-2 md:dark:py-1.5"
        aria-label="Indian Wok, back to top"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-480.webp"
          srcSet="/images/logo-480.webp 480w, /images/logo-720.webp 720w"
          sizes="(min-width: 768px) 72px, 250px"
          width={480}
          height={383}
          alt="Indian Wok"
          className="h-auto w-[250px] md:w-[72px]"
        />
      </a>
    </header>
  );
}
