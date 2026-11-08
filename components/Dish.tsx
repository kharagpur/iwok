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
export function Price({ item }: { item: MenuItem }) {
  if (item.sizes) {
    return (
      <span className="text-sm font-bold text-chili">
        {item.sizes.map((s) => `${s.label[0]} ${formatPrice(s.price)}`).join(" · ")}
      </span>
    );
  }
  if (item.price === undefined) {
    return <span className="text-sm font-semibold text-clay">Call for price</span>;
  }
  return <span className="font-bold text-chili">{formatPrice(item.price)}</span>;
}

export function dishTitle(item: MenuItem) {
  return item.code ? `${item.code} · ${item.name}` : item.name;
}

/** Responsive dish photo: 320 px file for small spots, 640 px on sharp screens. */
export function DishPhoto({
  item,
  className,
  sizes,
  eager = false,
}: {
  item: MenuItem;
  className: string;
  sizes: string;
  eager?: boolean;
}) {
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
      height={240}
      alt={item.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
