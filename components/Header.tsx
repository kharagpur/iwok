import { site } from "@/data/site";
import { PhoneIcon } from "./icons";

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <a href="#top" className="shrink-0" aria-label="Indian Wok, back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-240.webp"
            srcSet="/images/logo-240.webp 240w, /images/logo-480.webp 480w"
            sizes="80px"
            width={240}
            height={191}
            alt="Indian Wok"
            className="h-auto w-[74px] sm:w-20"
          />
        </a>
        <nav aria-label="Main" className="flex items-center gap-1">
          <a href="#menu" className="inline-flex min-h-11 items-center px-3 font-semibold hover:text-chili">
            Menu
          </a>
          <a href="#order" className="hidden min-h-11 items-center px-3 font-semibold hover:text-chili sm:inline-flex">
            Order
          </a>
          <a href="#find-us" className="hidden min-h-11 items-center px-3 font-semibold hover:text-chili sm:inline-flex">
            Find us
          </a>
          <a
            href={site.phone.href}
            className="ml-1 inline-flex size-11 items-center justify-center gap-2 rounded-full bg-chili font-semibold text-white hover:bg-chili-dark sm:w-auto sm:px-5"
          >
            <PhoneIcon />
            <span className="sr-only sm:not-sr-only">{site.phone.display}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
