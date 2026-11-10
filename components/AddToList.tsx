"use client";

import type { MenuItem } from "@/data/menu";
import { change, dishName, pickSize, useList } from "@/lib/list";
import { MinusIcon, PlusIcon } from "./icons";

/**
 * "My list" controls on a dish (see lib/list.ts). A dish not yet in the list shows a + button; once added,
 * a − 2 + control. Dishes with sizes (soups, plain rice) ask for the size first, and each size gets its own control.
 */

/** Adds one of the dish, or asks for a size. `wide` is the labelled button for the photo cards and popup. */
export function AddButton({ item, wide = false, className = "" }: { item: MenuItem; wide?: boolean; className?: string }) {
  if (!item.code) return null;
  const code = item.code;
  const add = () => (item.sizes ? pickSize(code) : change(code, 1));
  return wide ? (
    <button
      type="button"
      onClick={add}
      aria-label={`Add to my list: ${dishName(code)}`}
      className={`relative inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 border-chili px-4 text-sm font-bold text-ember hover:bg-blush ${className}`}
    >
      <PlusIcon className="size-4" /> Add to my list
    </button>
  ) : (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${dishName(code)} to my list`}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-chili text-ember hover:bg-blush ${className}`}
    >
      <PlusIcon className="size-5" />
    </button>
  );
}

/** − quantity + for one line of the list. */
export function Stepper({ code, size, qty, className = "" }: { code: string; size?: string; qty: number; className?: string }) {
  const name = size ? `${dishName(code)}, ${size}` : dishName(code);
  return (
    <span role="group" aria-label={`${name} in my list`} className={`inline-flex items-center rounded-full bg-chili text-white ${className}`}>
      <button type="button" onClick={() => change(code, -1, size)} aria-label={`One less ${name}`} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chili-press">
        <MinusIcon className="size-4" />
      </button>
      <span className="min-w-6 text-center font-bold tabular-nums">{qty}</span>
      <button type="button" onClick={() => change(code, 1, size)} aria-label={`One more ${name}`} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chili-press">
        <PlusIcon className="size-4" />
      </button>
    </span>
  );
}

/** The dish's place in the list: steppers (one per size), or the add button when it isn't in the list. */
export function DishControl({ item, layout }: { item: MenuItem; layout: "row" | "card" | "popup" }) {
  const { lines } = useList();
  if (!item.code) return null;
  const mine = lines.filter((l) => l.code === item.code);
  const wide = layout !== "row";
  if (mine.length === 0) return <AddButton item={item} wide={wide} className={wide ? "w-full" : ""} />;
  return (
    <span className={`relative flex flex-wrap items-center gap-x-3 gap-y-1.5 ${layout === "popup" ? "justify-center" : ""}`}>
      {mine.map((l) => (
        <span key={l.size ?? ""} className="inline-flex items-center gap-2">
          {l.size && <span className="text-sm font-semibold text-stone">{l.size}</span>}
          <Stepper code={l.code} size={l.size} qty={l.qty} />
        </span>
      ))}
      {item.sizes && mine.length < item.sizes.length && (
        <button
          type="button"
          onClick={() => pickSize(item.code!)}
          className="relative inline-flex min-h-10 items-center gap-1 rounded-full px-2 text-sm font-semibold text-ember underline underline-offset-2"
        >
          <PlusIcon className="size-4" /> Size<span className="sr-only"> of {dishName(item.code)}</span>
        </button>
      )}
      {layout !== "row" && <span className="sr-only">In my list</span>}
    </span>
  );
}
