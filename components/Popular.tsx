import { popularItems } from "@/data/menu";
import { DishPhoto, Price, Spice, dishTitle } from "./Dish";

/** Popular items: prices come from the one menu file, so they always match. */
export function Popular() {
  return (
    <section aria-labelledby="popular-h" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <h2 id="popular-h" className="font-display text-[26px] font-bold text-leaf md:text-3xl">
        Popular items
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popularItems.map((item) => (
          <li key={item.code} className="flex overflow-hidden rounded-2xl border border-line bg-white">
            <DishPhoto item={item} sizes="128px" className="h-24 w-32 shrink-0" />
            <div className={`flex min-w-0 flex-col justify-center gap-1 py-2 ${item.photo ? "px-3" : "min-h-24 px-4"}`}>
              <h3 className="text-[15px] leading-snug font-semibold">{dishTitle(item)}</h3>
              <div>
                <Spice item={item} />
              </div>
              <Price item={item} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
