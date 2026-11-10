// The order list: dishes a diner picks while reading the menu, to read out to the server or over the phone.
// Not an order: nothing is sent anywhere. The list lives in this browser only (localStorage) and keeps
// just codes, sizes and quantities, so names and prices always come from data/menu.ts.

import { useSyncExternalStore } from "react";
import { formatPrice, menu, type MenuItem } from "@/data/menu";
import { site } from "@/data/site";

export type Line = { code: string; size?: string; qty: number };

type State = {
  lines: Line[];
  /** Last change, read out by screen readers. */
  note: string;
  /** Code of a dish with sizes waiting for the diner to pick one. */
  picking: string | null;
  /** Set to open the list screen (the bar and other buttons ask for it). */
  open: number;
};

const KEY = "iwok-my-list";
const MAX = 99;

// Every dish by code, with where it sits on the menu, so the list reads in menu order.
const dishes = new Map<string, { item: MenuItem; section: string; order: number }>();
menu.forEach((c) => c.items.forEach((item) => item.code && dishes.set(item.code, { item, section: c.name, order: dishes.size })));

export const dish = (code: string) => dishes.get(code);

const empty: State = { lines: [], note: "", picking: null, open: 0 };
let state = empty;
let loaded = false;
const listeners = new Set<() => void>();

/** Keeps only lines for dishes (and sizes) still on the menu. */
function clean(data: unknown): Line[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((l) => {
    const d = typeof l?.code === "string" ? dishes.get(l.code) : undefined;
    const qty = Math.min(MAX, Math.floor(Number(l?.qty)));
    if (!d || !(qty >= 1)) return [];
    if (d.item.sizes) {
      if (!d.item.sizes.some((s) => s.label === l.size)) return [];
      return [{ code: l.code, size: l.size as string, qty }];
    }
    return [{ code: l.code, qty }];
  });
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) state = { ...state, lines: clean(JSON.parse(saved)) };
  } catch {
    // Private windows or blocked storage: the list still works until the page closes.
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  if (next.lines) {
    try {
      if (state.lines.length) localStorage.setItem(KEY, JSON.stringify(state.lines));
      else localStorage.removeItem(KEY);
    } catch {
      // See load().
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  load();
  return state;
}

/** The list, kept in step across every part of the page. Empty in the built HTML. */
export function useList() {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}

const same = (l: Line, code: string, size?: string) => l.code === code && l.size === size;
export const dishName = (code: string) => `${code} ${dishes.get(code)?.item.name ?? ""}`.trim();
const lineName = (code: string, size?: string) => (size ? `${dishName(code)}, ${size}` : dishName(code));

/** Adds or removes `by` of a dish (a size, for soups and plain rice). */
export function change(code: string, by: number, size?: string) {
  const current = state.lines.find((l) => same(l, code, size));
  const qty = Math.max(0, Math.min(MAX, (current?.qty ?? 0) + by));
  const lines = current
    ? qty === 0
      ? state.lines.filter((l) => l !== current)
      : state.lines.map((l) => (l === current ? { ...l, qty } : l))
    : qty > 0
      ? [...state.lines, { code, size, qty }]
      : state.lines;
  const total = count(lines);
  const what = by > 0 ? (current ? `${lineName(code, size)}: ${qty}` : `Added ${lineName(code, size)}`) : qty ? `${lineName(code, size)}: ${qty}` : `Removed ${lineName(code, size)}`;
  set({ lines, note: `${what}. ${total} ${total === 1 ? "dish" : "dishes"} in your order list.` });
}

export function remove(code: string, size?: string) {
  const line = state.lines.find((l) => same(l, code, size));
  if (line) change(code, -line.qty, size);
}

export function clear() {
  set({ lines: [], note: "Your order list is cleared." });
}

/** For a dish with sizes: asks which size (the size picker in components/OrderList.tsx). */
export function pickSize(code: string | null) {
  set({ picking: code });
}

export function openList() {
  set({ open: state.open + 1 });
}

export const count = (lines: Line[]) => lines.reduce((n, l) => n + l.qty, 0);

/** Price of one of this line's dish; undefined when the menu says "Call for price". */
export function unitPrice(l: Line) {
  const item = dishes.get(l.code)?.item;
  return l.size ? item?.sizes?.find((s) => s.label === l.size)?.price : item?.price;
}

/** Estimated total of the dishes with a price, and how many dishes still need a price. */
export function totals(lines: Line[]) {
  let sum = 0;
  let unpriced = 0;
  for (const l of lines) {
    const p = unitPrice(l);
    if (p === undefined) unpriced += l.qty;
    else sum += p * l.qty;
  }
  return { dishes: count(lines), sum: Math.round(sum * 100) / 100, unpriced };
}

/** Lines in menu order (and size order), grouped by menu section. */
export function bySection(lines: Line[]) {
  const sizeOrder = (l: Line) => dishes.get(l.code)?.item.sizes?.findIndex((s) => s.label === l.size) ?? 0;
  const sorted = [...lines].sort((a, b) => dishes.get(a.code)!.order - dishes.get(b.code)!.order || sizeOrder(a) - sizeOrder(b));
  const groups: { section: string; lines: Line[] }[] = [];
  for (const l of sorted) {
    const section = dishes.get(l.code)!.section;
    if (groups.at(-1)?.section !== section) groups.push({ section, lines: [] });
    groups.at(-1)!.lines.push(l);
  }
  return groups;
}

/** The list as plain text, for sharing or copying. */
export function listText(lines: Line[]) {
  const t = totals(lines);
  const rows = bySection(lines).flatMap((g) =>
    g.lines.map((l) => {
      const p = unitPrice(l);
      return `${l.qty} × ${lineName(l.code, l.size)} — ${p === undefined ? "price to confirm" : formatPrice(p * l.qty)}`;
    }),
  );
  return [
    `${site.name} order list`,
    ...rows,
    `Estimated total: ${formatPrice(t.sum)} before tax${t.unpriced ? ` (+ ${t.unpriced} to confirm)` : ""}.`,
    `${site.name} · ${site.phone.display}`,
  ].join("\n");
}
