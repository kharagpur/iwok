import { menu } from "@/data/menu";
import { DishPhoto, Price, Spice, dishTitle } from "./Dish";

const shortName: Record<string, string> = {
  "Tofu and Paneer": "Tofu & Paneer",
  "Rice Dishes": "Rice",
  "Gluten-Free Dishes": "Gluten-free",
  "Side Orders": "Sides",
};

const dishCount = menu.reduce((n, c) => n + c.items.length, 0);

/** The full menu: a sticky bar of sections, then every dish from data/menu.ts. */
export function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-h" className="pt-8 md:pt-12">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between px-4 sm:px-6">
        <h2 id="menu-h" className="font-display text-[26px] font-bold text-leaf md:text-3xl">
          Menu
        </h2>
        <span className="text-[13px] text-clay">{dishCount} dishes · prices may change</span>
      </div>

      <nav aria-label="Menu sections" className="sticky top-0 z-10 mt-3 border-b border-line bg-cream/95 backdrop-blur">
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {menu.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                className="inline-flex min-h-10 items-center rounded-full border border-sand bg-white px-3.5 text-sm font-semibold whitespace-nowrap hover:border-chili hover:text-chili"
              >
                {shortName[c.name] ?? c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {menu.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-16 pt-6">
            <h3 id={`${c.id}-h`} className="font-display text-xl font-medium md:text-2xl">
              {c.name}
            </h3>
            <ul className="mt-1 grid lg:grid-cols-2 lg:gap-x-10">
              {c.items.map((item) => (
                <li key={item.code ?? item.name} className="flex items-center gap-3 border-b border-line py-2.5">
                  <DishPhoto item={item} sizes="64px" className="h-12 w-16 shrink-0 rounded-lg" />
                  <div className="flex min-w-0 grow flex-col gap-1">
                    <span className="text-[15px] leading-snug font-semibold">{dishTitle(item)}</span>
                    {(item.spice !== "none" || item.containsNuts) && (
                      <span className="flex flex-wrap gap-1.5">
                        <Spice item={item} />
                        {item.containsNuts && (
                          <span className="rounded-full border border-sand px-2 py-0.5 text-xs font-semibold text-clay">
                            Contains nuts
                          </span>
                        )}
                      </span>
                    )}
                    {/* Dishes with sizes (soups, plain rice) show their prices under the name. */}
                    {item.sizes && <Price item={item} />}
                  </div>
                  {!item.sizes && (
                    <span className="shrink-0 text-right">
                      <Price item={item} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
