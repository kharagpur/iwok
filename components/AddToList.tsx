"use client";

import type { MenuItem } from "@/data/menu";
import { change, dishName, pickSize, useList } from "@/lib/list";
import { MinusIcon, PlusIcon, TrashIcon } from "./icons";

/**
 * Order list controls on a dish (see lib/list.ts). Sized to sit quietly in the text-first menu: a 28 px ring (+)
 * and, once added, a 28 px red − 1 + pill in the same spot. Red fill means "in your list", like the section bar's
 * current chip. Every button still has a 40 px tap area: the button is 40 px, the visible shape inside it is smaller.
 * Dishes with sizes (soups, plain rice) ask for the size first; each size gets its own pill under the name.
 */

/** Adds one of the dish, or asks for a size. `wide` is the labelled button for the photo cards and popup. */
function AddButton({ item, wide = false, className = "" }: { item: MenuItem; wide?: boolean; className?: string }) {
  if (!item.code) return null;
  const code = item.code;
  const add = () => (item.sizes ? pickSize(code) : change(code, 1));
  return wide ? (
    <button
      type="button"
      onClick={add}
      aria-label={`Add to order list: ${dishName(code)}`}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border-2 border-chili px-4 text-sm font-semibold text-ember hover:bg-blush ${className}`}
    >
      <PlusIcon className="size-4" /> Add to order list
    </button>
  ) : (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${dishName(code)} to order list`}
      className={`group -my-1.5 -mr-1.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full ${className}`}
    >
      <span className="inline-flex size-7 items-center justify-center rounded-full border-[1.5px] border-ember text-ember group-hover:bg-blush">
        <PlusIcon className="size-4" />
      </span>
    </button>
  );
}

/** The − button; at 1 it's a trash can that takes the dish off the list (as in the delivery apps). */
function LessButton({ name, qty, onClick, className, face, icon }: { name: string; qty: number; onClick: () => void; className: string; face: string; icon: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={qty === 1 ? `Remove ${name}` : `One less ${name}`} className={className}>
      <span className={face}>{qty === 1 ? <TrashIcon className={icon} /> : <MinusIcon className={icon} />}</span>
    </button>
  );
}

/** − quantity + for one line of the list: a 28 px pill whose buttons reach 40 px tall for tapping. */
export function Stepper({ code, size, qty, className = "" }: { code: string; size?: string; qty: number; className?: string }) {
  const name = size ? `${dishName(code)}, ${size}` : dishName(code);
  const button = "group -my-1.5 inline-flex h-10 w-8 items-center justify-center";
  const face = "inline-flex size-7 items-center justify-center rounded-full group-hover:bg-chili-press";
  return (
    <span role="group" aria-label={`${name} in order list`} className={`inline-flex h-7 shrink-0 items-center rounded-full bg-chili text-white ${className}`}>
      <LessButton name={name} qty={qty} onClick={() => change(code, -1, size)} className={button} face={face} icon="size-3.5" />
      <span className="min-w-4 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button type="button" onClick={() => change(code, 1, size)} aria-label={`One more ${name}`} className={button}>
        <span className={face}>
          <PlusIcon className="size-3.5" />
        </span>
      </button>
    </span>
  );
}

/** The pills of a dish already in the list; sizes (soups, plain rice) are labelled. */
function Pills({ item, className = "" }: { item: MenuItem; className?: string }) {
  const { lines } = useList();
  const mine = lines.filter((l) => l.code === item.code);
  if (!mine.length) return null;
  return (
    <span className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      {mine.map((l) => (
        <span key={l.size ?? ""} className="inline-flex items-center gap-1.5">
          {l.size && <span className="text-xs font-semibold text-stone">{l.size}</span>}
          <Stepper code={l.code} size={l.size} qty={l.qty} />
        </span>
      ))}
    </span>
  );
}

/** Under a menu dish's name: the size pills of a soup or plain rice in the list (the + stays on the right). */
export function SizePills({ item }: { item: MenuItem }) {
  return item.sizes ? <Pills item={item} className="pt-1" /> : null;
}

/**
 * A full-width − 1 + bar (just the number, like the menu's pill and the delivery apps): what the "Add to order list" button turns into on a Most ordered card (40 px)
 * and in the photo popup (48 px, as tall as Call to order). The menu's red pill, at the button's size and in its place.
 */
function WideStepper({ code, qty, tall = false }: { code: string; qty: number; tall?: boolean }) {
  const name = dishName(code);
  const button = `group inline-flex ${tall ? "size-12" : "size-10"} shrink-0 items-center justify-center`;
  const face = "inline-flex size-8 items-center justify-center rounded-full group-hover:bg-chili-press";
  return (
    <span role="group" aria-label={`${name} in order list`} className={`flex w-full items-center justify-between rounded-full bg-chili text-white ${tall ? "h-12" : "h-10"}`}>
      <LessButton name={name} qty={qty} onClick={() => change(code, -1)} className={button} face={face} icon="size-4" />
      <span className="text-base font-bold tabular-nums">{qty}</span>
      <button type="button" onClick={() => change(code, 1)} aria-label={`One more ${name}`} className={button}>
        <span className={face}>
          <PlusIcon className="size-4" />
        </span>
      </button>
    </span>
  );
}

/**
 * The dish's control. In a menu row (`row`): the + or the pill, in the same spot (dishes with sizes always show the +).
 * On a Most ordered card (`card`) and in the photo popup (`popup`): the full-width "Add to order list" button, which
 * turns into the full-width − 1 + bar. Dishes with sizes keep the button (for another size), with their size pills under it.
 */
export function DishControl({ item, layout, className = "" }: { item: MenuItem; layout: "row" | "card" | "popup"; className?: string }) {
  const { lines } = useList();
  if (!item.code) return null;
  const mine = lines.filter((l) => l.code === item.code);
  if (layout === "row") {
    if (item.sizes || mine.length === 0) return <AddButton item={item} className={className} />;
    return <Stepper code={item.code} qty={mine[0].qty} className={className} />;
  }
  const tall = layout === "popup";
  if (!item.sizes && mine.length) return <WideStepper code={item.code} qty={mine[0].qty} tall={tall} />;
  return (
    <span className="flex flex-col gap-2">
      <AddButton item={item} wide className={`w-full ${tall ? "min-h-12" : ""}`} />
      <Pills item={item} />
    </span>
  );
}
