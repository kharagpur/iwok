"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { menu, type MenuItem } from "@/data/menu";
import { site } from "@/data/site";
import { DishPhoto, Price, Spice } from "./Dish";
import { CameraIcon, CloseIcon, LeafIcon, PhoneIcon } from "./icons";

const shortName: Record<string, string> = {
  "Tofu and Paneer": "Tofu & Paneer",
  "Rice Dishes": "Rice",
  "Gluten-Free Dishes": "Gluten-free",
  "Side Orders": "Sides",
};

// Filters (the owner, 2026-11-08). Gluten-free means the gluten-free section; vegetarian comes from data/menu.ts.
const filters = [
  { id: "veg", label: "Vegetarian", test: (i: MenuItem) => !!i.vegetarian },
  { id: "gf", label: "Gluten-free", test: (_: MenuItem, cat: string) => cat === "gluten-free" },
  { id: "nospice", label: "No spice", test: (i: MenuItem) => i.spice === "none" },
] as const;
type FilterId = (typeof filters)[number]["id"];

const dishCount = menu.reduce((n, c) => n + c.items.length, 0);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The full menu, text-first. Every dish is in the built HTML (for search engines and no-JS visitors);
 * in the browser it adds filters, highlights the section you're reading, and opens dish photos.
 */
export function Menu() {
  const [on, setOn] = useState<FilterId[]>([]);
  const [active, setActive] = useState<string>(menu[0].id);
  const [photo, setPhoto] = useState<MenuItem | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  // Before the browser measures the bar (first paint, or no JavaScript), the active button paints its own red.
  const [measured, setMeasured] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shown = menu
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => filters.every((f) => !on.includes(f.id) || f.test(i, c.id))),
    }))
    .filter((c) => c.items.length > 0);
  const shownCount = shown.reduce((n, c) => n + c.items.length, 0);
  const shownIds = shown.map((c) => c.id).join(" ");

  // Highlight the section that's under the sticky bar.
  useEffect(() => {
    const sections = shownIds.split(" ").map((id) => document.getElementById(id));
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-72px 0px -65% 0px" },
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [shownIds]);

  // The red "goo" pill behind the section bar (the owner, 2026-11-08: option 3, "Goo blob"). A pill and a slower
  // tail blob share an SVG blur filter, so they stretch and melt together as the highlight moves to the next
  // section. It moves to wherever `active` points; reduced-motion visitors get an instant switch.
  const moved = useRef(false);
  useLayoutEffect(() => {
    const bar = navRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!chip) return;
    const animate = moved.current && !reducedMotion();
    const place = (el: HTMLDivElement | null, transition: string) => {
      if (!el) return;
      el.style.transition = animate ? transition : "none";
      el.style.transform = `translateX(${chip.offsetLeft}px)`;
      el.style.width = `${chip.offsetWidth}px`;
      el.style.top = `${chip.offsetTop}px`;
      el.style.height = `${chip.offsetHeight}px`;
    };
    place(pillRef.current, "transform 320ms cubic-bezier(.5,0,.2,1), width 320ms ease");
    place(tailRef.current, "transform 620ms cubic-bezier(.5,0,.2,1) 60ms, width 620ms ease 60ms");
    moved.current = true;
    setMeasured(true);
  }, [active, shownIds]);

  // Re-measure without animating when the bar's size changes (rotating a phone, fonts loading).
  useEffect(() => {
    const bar = navRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(() => {
      const chip = bar.querySelector<HTMLElement>("[aria-current]");
      [pillRef.current, tailRef.current].forEach((el) => {
        if (!el || !chip) return;
        el.style.transition = "none";
        el.style.transform = `translateX(${chip.offsetLeft}px)`;
        el.style.width = `${chip.offsetWidth}px`;
      });
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  // Keep the highlighted section's button in view in the scrolling bar.
  useEffect(() => {
    const bar = navRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!bar || !chip) return;
    bar.scrollTo({
      left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  }, [active]);

  useEffect(() => {
    if (photo) dialogRef.current?.showModal();
  }, [photo]);

  const toggle = (id: FilterId) => setOn((cur) => (cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id]));

  return (
    <section id="menu" aria-labelledby="menu-h" className="pt-12 md:pt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 id="menu-h" className="font-display text-[28px] font-extrabold md:text-4xl">
            Menu
          </h2>
          <span className="text-[13px] text-stone">
            <span aria-live="polite">{on.length ? `${shownCount} of ${dishCount} dishes` : `${dishCount} dishes · prices may change`}</span>
            {on.length > 0 && (
              <button type="button" onClick={() => setOn([])} className="ml-2 min-h-10 font-semibold text-chili underline underline-offset-2">
                Clear filters
              </button>
            )}
          </span>
        </div>

        <div role="group" aria-label="Show only" className="mt-3 flex flex-wrap items-center gap-2">
          <span aria-hidden className="hidden text-sm text-stone sm:inline">Show only</span>
          {filters.map((f) => {
            const pressed = on.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggle(f.id)}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 px-3 text-sm font-semibold sm:px-3.5 ${
                  pressed ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                }`}
              >
                {f.id === "veg" && <LeafIcon />}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <nav aria-label="Menu sections" className="sticky top-0 z-10 mt-3 border-b border-line bg-white/95 backdrop-blur">
        <svg aria-hidden width="0" height="0" className="absolute">
          <defs>
            <filter id="menu-goo" x="-20%" y="-60%" width="140%" height="220%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <ul ref={navRef} className="no-scrollbar relative isolate mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-6">
          <li aria-hidden className="pointer-events-none absolute inset-0 z-[1] [filter:url(#menu-goo)]">
            <div ref={tailRef} className="absolute left-0 rounded-full bg-chili motion-reduce:hidden" />
            <div ref={pillRef} className="absolute left-0 rounded-full bg-chili" />
          </li>
          {shown.map((c) => {
            const current = c.id === active;
            return (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  data-section={c.id}
                  aria-current={current ? "true" : undefined}
                  className="group relative inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold whitespace-nowrap"
                >
                  {/* The button face sits under the pill (grey), or is the red highlight itself until the pill is measured. */}
                  <span
                    aria-hidden
                    className={`absolute inset-0 z-0 rounded-full ${current && !measured ? "bg-chili" : "bg-mist group-hover:bg-blush"}`}
                  />
                  <span
                    className={`relative z-[2] transition-colors delay-100 duration-200 motion-reduce:transition-none ${
                      current ? "text-white" : "text-ink"
                    }`}
                  >
                    {shortName[c.name] ?? c.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {shown.length === 0 && (
          <p className="pt-8 text-stone">
            No dishes match all of those.{" "}
            <button type="button" onClick={() => setOn([])} className="font-semibold text-chili underline underline-offset-2">
              Clear the filters
            </button>
          </p>
        )}
        {shown.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-16 pt-7">
            <h3 id={`${c.id}-h`} className="font-display text-xl font-semibold md:text-2xl">
              {c.name}
            </h3>
            <ul className="mt-1 grid lg:grid-cols-2 lg:gap-x-12">
              {c.items.map((item) => (
                <li key={item.code ?? item.name} className="flex items-baseline gap-2.5 border-b border-line py-3">
                  <span className="w-8 shrink-0 text-xs font-bold text-stone">{item.code}</span>
                  <div className="flex min-w-0 grow flex-col gap-1">
                    {item.photo ? (
                      <button
                        type="button"
                        onClick={() => setPhoto(item)}
                        aria-haspopup="dialog"
                        className="group w-fit text-left text-[15px] leading-snug font-semibold"
                      >
                        <PhotoLabel name={item.name} />
                      </button>
                    ) : (
                      <span className="text-[15px] leading-snug font-semibold">{item.name}</span>
                    )}
                    {(item.spice !== "none" || item.containsNuts || item.vegetarian) && (
                      <span className="flex flex-wrap gap-1.5">
                        {item.vegetarian && <VegTag />}
                        <Spice item={item} />
                        {item.containsNuts && (
                          <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-semibold text-stone">Contains nuts</span>
                        )}
                      </span>
                    )}
                    {/* Dishes with sizes (soups, plain rice) show their prices under the name. */}
                    {item.sizes && <Price item={item} />}
                  </div>
                  {!item.sizes && <Price item={item} className="shrink-0" />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Dish photo: a native dialog, so Esc, focus and the back gesture work as people expect. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="photo-h"
        onClose={() => setPhoto(null)}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[min(92vw,440px)] overflow-hidden rounded-3xl bg-white p-0 text-ink backdrop:bg-ink/70"
      >
        {photo && (
          <div>
            <div className="relative">
              <DishPhoto item={photo} sizes="(min-width: 480px) 440px, 92vw" className="aspect-square w-full" />
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-white text-ink shadow"
              >
                <CloseIcon />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 id="photo-h" className="font-display text-xl leading-tight font-extrabold">
                  {photo.name}
                </h3>
                <Price item={photo} className="shrink-0 text-chili" />
              </div>
              <span className="flex flex-wrap gap-1.5">
                {photo.vegetarian && <VegTag />}
                <Spice item={photo} />
              </span>
              <a
                href={site.phone.href}
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-chili px-6 font-bold text-white hover:bg-chili-dark"
              >
                <PhoneIcon /> Call to order
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

function VegTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-xs font-semibold text-leaf">
      <LeafIcon className="size-3" />
      Veg<span className="sr-only">etarian</span>
    </span>
  );
}

/** Dish name with a camera mark; the last word and the mark stay together so the mark never sits alone on a line. */
function PhotoLabel({ name }: { name: string }) {
  const cut = name.lastIndexOf(" ");
  return (
    <span className="decoration-chili/40 underline-offset-4 group-hover:underline">
      {name.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {name.slice(cut + 1)}
        <CameraIcon className="ml-1.5 inline size-4 align-[-2px] text-chili" />
      </span>
      <span className="sr-only">: see photo</span>
    </span>
  );
}
