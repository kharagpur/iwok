import { Fragment } from "react";
import { formatPrice, spiceLabel, type MenuItem } from "@/data/menu";
import { ChiliIcon } from "./icons";

const chilies = { none: 0, mild: 1, medium: 2, hot: 3 } as const;

/** Spice level in words and chilies (never colour alone). */
export function Spice({ item }: { item: MenuItem }) {
  const count = chilies[item.spice];
  if (count === 0) return null;
  const hot = item.spice === "hot";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        hot ? "bg-chili text-white" : "bg-blush text-chili-dark"
      }`}
    >
      {Array.from({ length: count }, (_, i) => (
        <ChiliIcon key={i} />
      ))}
      <span className="ml-0.5">{spiceLabel[item.spice]}</span>
    </span>
  );
}

/** Price, sizes (soups, plain rice) or a call-for-price note. */
export function Price({ item, className = "" }: { item: MenuItem; className?: string }) {
  // Dishes with sizes (soups, plain rice): one size per line, small to large, the prices lined up on the right.
  if (item.sizes) {
    return (
      <span className={`grid grid-cols-[auto_auto] items-baseline justify-end gap-x-1.5 text-right ${className}`}>
        {item.sizes.map((s) => (
          <Fragment key={s.label}>
            <span className="text-xs font-semibold text-stone">
              {s.label[0]}
              <span className="sr-only">{s.label.slice(1)}</span>
            </span>
            <span className="font-bold tabular-nums">{formatPrice(s.price)}</span>
          </Fragment>
        ))}
      </span>
    );
  }
  if (item.price === undefined) {
    return <span className={`text-sm font-semibold text-stone ${className}`}>Call for price</span>;
  }
  return <span className={`font-bold ${className}`}>{formatPrice(item.price)}</span>;
}

/** Square dish photo: the 320 px file for small spots, 640 px on sharp screens. */
export function DishPhoto({ item, className, sizes }: { item: MenuItem; className: string; sizes: string }) {
  if (!item.photo) return null;
  const src = `/images/dishes/${item.photo}`;
  return (
    // Plain <img>: photos are already resized (static export has no image server).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${src}-320.webp`}
      srcSet={`${src}-320.webp 320w, ${src}-640.webp 640w`}
      sizes={sizes}
      width={320}
      height={320}
      alt={item.name}
      loading="lazy"
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
