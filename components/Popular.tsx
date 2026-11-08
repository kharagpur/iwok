import { popularItems } from "@/data/menu";
import { site } from "@/data/site";
import { DishPhoto, Price, Spice } from "./Dish";
import { ChiliIcon } from "./icons";

/** The most-ordered dishes as a swipeable row of big photos, then the delivery apps. */
export function Popular() {
  return (
    <>
      <section aria-labelledby="popular-h" className="pt-10 md:pt-14">
        <h2 id="popular-h" className="mx-auto max-w-6xl px-5 font-display text-[28px] font-extrabold tracking-[-0.01em] sm:px-6 md:text-4xl">
          Most ordered
        </h2>
        <ul
          className="no-scrollbar mx-auto mt-3 flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-6 sm:px-6 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-7 md:overflow-visible lg:grid-cols-5"
          tabIndex={0}
          aria-label="Most ordered dishes"
        >
          {popularItems.map((item) => (
            <li key={item.code} className="w-[200px] shrink-0 snap-start md:w-auto">
              {item.photo ? (
                <DishPhoto item={item} sizes="(min-width: 1024px) 220px, (min-width: 768px) 33vw, 200px" className="aspect-square w-full rounded-[20px]" />
              ) : (
                <div aria-hidden="true" className="flex aspect-square w-full items-center justify-center rounded-[20px] bg-mist text-chili">
                  <ChiliIcon className="size-12" />
                </div>
              )}
              <h3 className="mt-2 text-[15px] leading-snug font-semibold">
                <span className="text-stone">{item.code}</span> {item.name}
              </h3>
              <div className="mt-1 flex items-center justify-between gap-2">
                <Spice item={item} />
                <Price item={item} className="ml-auto text-chili" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="order" aria-labelledby="order-h" className="mx-auto max-w-6xl scroll-mt-4 px-5 pt-10 sm:px-6 md:pt-14">
        <h2 id="order-h" className="font-display text-[28px] font-extrabold md:text-4xl">
          Delivery
        </h2>
        <div className="mt-3 grid max-w-xl grid-cols-3 gap-2">
          {site.delivery.map((d) => (
            <a
              key={d.name}
              href={d.href}
              rel="noopener"
              className="flex min-h-12 items-center justify-center rounded-xl bg-mist px-2 text-center text-sm font-semibold hover:bg-blush hover:text-chili-dark sm:text-base"
            >
              {d.name}
            </a>
          ))}
        </div>
        <p className="mt-2 text-sm text-stone">
          Or call{" "}
          <a href={site.phone.href} className="font-semibold text-chili hover:underline">
            {site.phone.display}
          </a>{" "}
          and pick up: {site.pickupOffer.toLowerCase()}.
        </p>
      </section>
    </>
  );
}
