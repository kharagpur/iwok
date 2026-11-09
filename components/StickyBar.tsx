import { site } from "@/data/site";
import { BagIcon, PhoneIcon, PinIcon } from "./icons";

/** Phones only: Call, Order and Directions stay one tap away at the bottom of the screen. */
export function StickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-line bg-paper/95 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
    >
      <a href={site.phone.href} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-chili font-bold text-white">
        <PhoneIcon className="size-4" /> Call
      </a>
      <a href="#order" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-mist font-bold">
        <BagIcon className="size-4" /> Order
      </a>
      <a href={site.mapUrl} rel="noopener" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-mist font-bold">
        <PinIcon className="size-4" /> Directions
      </a>
    </nav>
  );
}
