"use client";

import { useEffect, useRef, useState } from "react";
import { menu, type MenuItem, type Spice as SpiceLevel } from "@/data/menu";
import { site } from "@/data/site";
import { DishControl, SizePills } from "./AddToList";
import { DishPhoto, Price, Spice, warmPhoto } from "./Dish";
import { CameraIcon, ChiliIcon, CloseIcon, LeafIcon, NutIcon, PhoneIcon } from "./icons";

const shortName: Record<string, string> = {
  "Tofu and Paneer": "Tofu & Paneer",
  "Rice Dishes": "Rice",
  "Gluten-Free Dishes": "Gluten-free",
  "Side Orders": "Sides",
};

// Filters, in two groups. Diet: a dish must match every button that's on (gluten-free means the
// gluten-free section; vegetarian comes from data/menu.ts). Spice: a dish matches if its level is any
// of the levels that are on, so Mild + Medium shows both. The two groups combine: Vegetarian + Hot =
// vegetarian dishes that are hot.
const diet = [
  { id: "veg", label: "Vegetarian", test: (i: MenuItem) => !!i.vegetarian },
  { id: "gf", label: "Gluten-free", test: (_: MenuItem, cat: string) => cat === "gluten-free" },
] as const;
type DietId = (typeof diet)[number]["id"];
const levels: { id: SpiceLevel; label: string; chilies: number }[] = [
  { id: "none", label: "No spice", chilies: 0 },
  { id: "mild", label: "Mild", chilies: 1 },
  { id: "medium", label: "Medium", chilies: 2 },
  { id: "hot", label: "Hot", chilies: 3 },
];

// The photo popup is 440 px wide, or 92% of a phone screen; warmPhoto() uses the same, so the files match.
const popupSizes = "(min-width: 480px) 440px, 92vw";

const dishCount = menu.reduce((n, c) => n + c.items.length, 0);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The full menu, text-first. Every dish is in the built HTML (for search engines and no-JS visitors);
 * in the browser it adds filters, highlights the section you're reading, and opens dish photos.
 */
export function Menu() {
  const [dietOn, setDietOn] = useState<DietId[]>([]);
  const [spiceOn, setSpiceOn] = useState<SpiceLevel[]>([]);
  const filtered = dietOn.length + spiceOn.length > 0;
  const clear = () => {
    setDietOn([]);
    setSpiceOn([]);
  };
  const [active, setActive] = useState<string>(menu[0].id);
  const [photo, setPhoto] = useState<MenuItem | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  // Set while the page scrolls to a section that was tapped in the bar; cleared once scrolling stops,
  // so the highlight goes straight to the tapped section instead of visiting every section on the way.
  const tapped = useRef<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shown = menu
    .map((c) => ({
      ...c,
      items: c.items.filter(
        (i) => diet.every((f) => !dietOn.includes(f.id) || f.test(i, c.id)) && (spiceOn.length === 0 || spiceOn.includes(i.spice)),
      ),
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
        if (hit && !tapped.current) setActive(hit.target.id);
      },
      { rootMargin: "-72px 0px -65% 0px" },
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [shownIds]);

  // The highlighted section "pops": its red face springs in and the old one fades (CSS only, see
  // .menu-chip in app/globals.css). A tap moves the highlight straight to the tapped section.
  const goTo = (id: string) => {
    tapped.current = id;
    setActive(id);
    let timer = window.setTimeout(release, 150);
    function release() {
      tapped.current = null;
      window.removeEventListener("scroll", onScroll);
    }
    function onScroll() {
      window.clearTimeout(timer);
      timer = window.setTimeout(release, 150);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  };
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
    if (!photo) return;
    dialogRef.current?.showModal();
    // Focus on the dish name, not the Close button (see components/OrderList.tsx): no amber ring on a tap.
    dialogRef.current?.querySelector<HTMLElement>("#photo-h")?.focus({ preventScroll: true });
  }, [photo]);

  const toggle = <T,>(id: T) => (cur: T[]) => (cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id]);

  return (
    <section id="menu" aria-labelledby="menu-h" className="pt-12 md:pt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <h2 id="menu-h" className="font-display text-[28px] font-extrabold md:text-4xl">
            Menu
          </h2>
          <span className="text-[13px] text-stone">
            <span aria-live="polite">{filtered ? `${shownCount} of ${dishCount} dishes` : `${dishCount} dishes`}</span>
            {filtered && (
              <button type="button" onClick={clear} className="ml-2 min-h-10 font-semibold text-ember underline underline-offset-2">
                Clear filters
              </button>
            )}
          </span>
        </div>

        {/* Two labelled rows: Diet (buttons as before) and Spice, one joined bar that reads as a heat scale.
            Phones under 360 px put each label above its row so the bar keeps the full width. */}
        <div
          role="group"
          aria-label="Show only"
          className="mt-3 grid grid-cols-1 items-center gap-x-2 gap-y-1.5 min-[360px]:grid-cols-[3.25rem_1fr] min-[360px]:gap-y-2.5"
        >
          <span aria-hidden className="text-sm text-stone">
            Diet
          </span>
          <div role="group" aria-label="Diet" className="flex flex-wrap gap-2">
            {diet.map((f) => {
              const pressed = dietOn.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setDietOn(toggle(f.id))}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 px-3 text-sm font-semibold sm:px-3.5 ${
                    pressed ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"
                  }`}
                >
                  {f.id === "veg" && <LeafIcon />}
                  {f.label}
                </button>
              );
            })}
          </div>
          <span aria-hidden className="text-sm text-stone">
            Spice
          </span>
          <div role="group" aria-label="Spice level" className="flex w-full max-w-sm overflow-hidden rounded-2xl border-2 border-line">
            {levels.map((l, n) => {
              const pressed = spiceOn.includes(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setSpiceOn(toggle(l.id))}
                  className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[13px] leading-tight font-semibold max-[359px]:text-xs ${
                    n > 0 ? "border-l-2 border-line" : ""
                  } ${pressed ? "bg-chili text-white" : "bg-paper hover:bg-mist"}`}
                >
                  <span aria-hidden className={`flex h-3.5 items-center -space-x-0.5 ${pressed ? "" : l.chilies ? "text-ember" : "text-stone"}`}>
                    {l.chilies ? Array.from({ length: l.chilies }, (_, k) => <ChiliIcon key={k} />) : "–"}
                  </span>
                  <span className="whitespace-nowrap">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Only some dishes are marked; kitchens share pans and oil, so anyone with an allergy should check with us. */}
        <p className="mt-3 text-sm text-stone">
          Food allergy?{" "}
          <a href={site.phone.href} className="font-semibold text-ember underline underline-offset-2">
            Call us
          </a>{" "}
          and we&apos;ll check before you order.
        </p>
      </div>

      <nav aria-label="Menu sections" className="sticky top-0 z-10 mt-3 border-b border-line bg-paper/95 backdrop-blur">
        <ul ref={navRef} className="no-scrollbar mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-6">
          {shown.map((c) => {
            const current = c.id === active;
            return (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  onClick={() => goTo(c.id)}
                  data-section={c.id}
                  aria-current={current ? "true" : undefined}
                  className="menu-chip relative inline-flex min-h-10 items-center rounded-full bg-mist px-3.5 text-sm font-semibold whitespace-nowrap hover:bg-blush"
                >
                  {shortName[c.name] ?? c.name}
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
            <button type="button" onClick={clear} className="font-semibold text-ember underline underline-offset-2">
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
                <li key={item.code ?? item.name} className="flex min-w-0 items-baseline gap-2.5 border-b border-line py-3">
                  <span className="w-8 shrink-0 text-xs font-bold text-stone">{item.code}</span>
                  <div className="flex min-w-0 grow flex-col gap-1">
                    {item.photo ? (
                      <button
                        type="button"
                        onClick={() => setPhoto(item)}
                        onPointerDown={() => warmPhoto(item, popupSizes)}
                        onMouseEnter={() => warmPhoto(item, popupSizes)}
                        onFocus={() => warmPhoto(item, popupSizes)}
                        aria-haspopup="dialog"
                        className="group relative w-fit text-left text-[15px] leading-snug font-semibold before:absolute before:-inset-x-2 before:-inset-y-3 before:content-['']"
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
                        {item.containsNuts && <NutTag />}
                      </span>
                    )}
                    <SizePills item={item} />
                  </div>
                  {/* Price, then the order list's + (or − 1 +); on the narrowest phones (under 360 px) it sits under the price. */}
                  <div className="flex shrink-0 items-baseline gap-2.5 max-[359px]:flex-col max-[359px]:items-end max-[359px]:gap-1.5">
                    <Price item={item} />
                    <DishControl item={item} layout="row" className="self-center max-[359px]:self-end" />
                  </div>
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
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(92vw,440px)] no-scrollbar overflow-y-auto rounded-3xl bg-paper p-0 text-ink backdrop:bg-black/70 [@media(max-height:520px)]:w-[min(92vw,640px)]"
      >
        {/* Phones held sideways: photo on the left, name and Call button on the right, so nothing is cut off. */}
        {photo && (
          <div className="[@media(max-height:520px)]:flex [@media(max-height:520px)]:items-center">
            <div className="relative [@media(max-height:520px)]:w-[min(45%,calc(100dvh-1.5rem))] [@media(max-height:520px)]:shrink-0">
              <DishPhoto item={photo} sizes={popupSizes} eager className="aspect-square w-full" />
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-paper text-ink shadow"
              >
                <CloseIcon />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 p-5 [@media(max-height:520px)]:grow">
              <div className="flex items-baseline justify-between gap-3">
                <h3 id="photo-h" tabIndex={-1} className="font-display text-xl leading-tight font-extrabold outline-none">
                  {photo.name}
                </h3>
                <Price item={photo} className="shrink-0 text-ember" />
              </div>
              <span className="flex flex-wrap gap-1.5">
                {photo.vegetarian && <VegTag />}
                <Spice item={photo} />
                {photo.containsNuts && <NutTag />}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="min-w-0 grow basis-40">
                  <DishControl item={photo} layout="popup" />
                </div>
                <a
                  href={site.phone.href}
                  className="inline-flex min-h-12 grow basis-40 items-center justify-center gap-2 rounded-full bg-chili px-6 font-bold text-white hover:bg-chili-press"
                >
                  <PhoneIcon /> Call to order
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

/**
 * Allergy tag: a nut icon and the words, never the icon alone. Amber so it stands out from the green Veg and red spice
 * tags. A generic nut, not a peanut: peanut and tree-nut allergies are different, and these dishes' nuts aren't confirmed.
 */
function NutTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-turmeric-soft px-2 py-0.5 text-xs font-semibold text-ink">
      <NutIcon className="size-3" />
      Contains nuts
    </span>
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
    <span className="decoration-ember/40 underline-offset-4 group-hover:underline">
      {name.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {name.slice(cut + 1)}
        <CameraIcon className="ml-1.5 inline size-4 align-[-2px] text-ember" />
      </span>
      <span className="sr-only">: see photo</span>
    </span>
  );
}
