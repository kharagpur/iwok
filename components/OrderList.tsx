"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/data/menu";
import { site } from "@/data/site";
import { bySection, change, clear, dish, dishName, listText, pickSize, openList, remove, totals, unitPrice, useList } from "@/lib/list";
import { Stepper } from "./AddToList";
import { CloseIcon, ListIcon, PhoneIcon, ShareIcon } from "./icons";

const dishes = (n: number) => `${n} ${n === 1 ? "dish" : "dishes"}`;

/**
 * The order list (lib/list.ts): the bar that appears once a dish is added, the list screen to read out to the
 * server or over the phone, and the size picker for soups and plain rice. Nothing here is sent anywhere.
 */
export function OrderList() {
  const { lines, note, picking, open } = useList();
  const listRef = useRef<HTMLDialogElement>(null);
  const sizeRef = useRef<HTMLDialogElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [shared, setShared] = useState("");
  const t = totals(lines);

  useEffect(() => {
    if (open) listRef.current?.showModal();
  }, [open]);
  useEffect(() => {
    if (picking) sizeRef.current?.showModal();
  }, [picking]);
  // Room at the end of the page for the bar (app/globals.css).
  useEffect(() => {
    if (t.dishes) document.documentElement.dataset.list = "";
    else delete document.documentElement.dataset.list;
  }, [t.dishes]);
  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const share = async () => {
    const text = listText(lines);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${site.name} order list`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShared("Copied. Paste it in a message.");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setShared("Couldn't share from this browser.");
    }
  };

  const pickingItem = picking ? dish(picking)?.item : undefined;

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {note}
      </div>

      {t.dishes > 0 && (
        <div className="list-bar fixed inset-x-3 z-20 md:inset-x-auto md:right-5">
          <button
            type="button"
            onClick={openList}
            aria-haspopup="dialog"
            className="flex min-h-12 w-full items-center gap-2.5 rounded-full bg-ink py-1.5 pr-5 pl-2 text-left font-bold text-paper shadow-lg md:w-auto md:min-w-80"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-chili text-white">
              <ListIcon className="size-5" />
            </span>
            <span className="grow">
              Order list<span className="font-semibold"> · {dishes(t.dishes)}</span>
            </span>
            <span className="tabular-nums">{formatPrice(t.sum)}</span>
          </button>
        </div>
      )}

      {/* The list screen: a native dialog, so Esc, focus and the back gesture work as people expect. */}
      <dialog
        ref={listRef}
        aria-labelledby="list-h"
        onClose={() => {
          setConfirming(false);
          setShared("");
        }}
        onClick={(e) => e.target === listRef.current && listRef.current?.close()}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(94vw,520px)] no-scrollbar overflow-y-auto overscroll-contain rounded-3xl bg-paper p-0 text-ink backdrop:bg-black/70"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3">
          <h2 id="list-h" className="font-display text-2xl font-extrabold">
            Order list
          </h2>
          <button
            type="button"
            onClick={() => listRef.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-full bg-mist"
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="px-5 pt-4 pb-5">
          <p className="rounded-2xl bg-turmeric-soft px-4 py-3 text-[15px]">
            <strong>This isn&apos;t sent to the restaurant.</strong> Read it to your server, or call it in.
          </p>

          {lines.length === 0 ? (
            <p className="py-8 text-center text-stone">Your order list is empty. Tap + next to a dish to add it.</p>
          ) : (
            <>
              {bySection(lines).map((g) => (
                <section key={g.section} aria-label={g.section} className="pt-4">
                  <h3 className="text-sm font-bold text-stone">{g.section}</h3>
                  <ul>
                    {g.lines.map((l) => {
                      const p = unitPrice(l);
                      return (
                        <li key={l.code + (l.size ?? "")} className="border-b border-line py-3">
                          <div className="flex items-baseline gap-3">
                            <p className="grow text-[17px] leading-snug">
                              <span className="font-extrabold tabular-nums">{l.qty} ×</span>{" "}
                              <span className="font-bold text-stone">{l.code}</span> <span className="font-semibold">{dish(l.code)?.item.name}</span>
                              {l.size && <span className="font-semibold"> ({l.size})</span>}
                            </p>
                            <span className={`shrink-0 font-bold tabular-nums ${p === undefined ? "text-sm text-stone" : ""}`}>
                              {p === undefined ? "Price to confirm" : formatPrice(p * l.qty)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <Stepper code={l.code} size={l.size} qty={l.qty} />
                            {/* At 1, the pill's trash can removes the dish, so this link only shows from 2 up. */}
                            {l.qty > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(l.code, l.size)}
                                className="relative min-h-10 px-2 text-sm font-semibold text-ember underline underline-offset-2"
                              >
                                Remove<span className="sr-only"> {dishName(l.code)}{l.size ? `, ${l.size}` : ""}</span>
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              <div className="pt-4">
                <p className="flex items-baseline justify-between gap-3 text-lg font-extrabold">
                  <span>Estimated total</span>
                  <span className="tabular-nums">{formatPrice(t.sum)}</span>
                </p>
                <p className="mt-1 text-sm text-stone">
                  {dishes(t.dishes)} · before tax
                  {t.unpriced > 0 && <>; plus {dishes(t.unpriced)} with the price to confirm</>}
                </p>
              </div>
            </>
          )}

          <div className="mt-5 grid gap-2.5">
            <a
              href={site.phone.href}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-chili px-6 font-bold text-white hover:bg-chili-press"
            >
              <PhoneIcon /> Call to order · {site.phone.display}
            </a>
            {lines.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={share} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-mist px-4 font-bold">
                  <ShareIcon className="size-4" /> Share list
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirming) return setConfirming(true);
                    clear();
                    setConfirming(false);
                  }}
                  className={`inline-flex min-h-12 items-center justify-center rounded-full px-4 font-bold ${confirming ? "bg-ink text-paper" : "bg-mist"}`}
                >
                  {confirming ? "Tap again to clear" : "Clear list"}
                </button>
              </div>
            )}
            <p aria-live="polite" className="text-center text-sm text-stone empty:hidden">
              {shared}
            </p>
            <button
              type="button"
              onClick={() => listRef.current?.close()}
              className="min-h-11 font-semibold text-ember underline underline-offset-2"
            >
              Back to the menu
            </button>
          </div>
        </div>
      </dialog>

      {/* Soups and plain rice: which size? */}
      <dialog
        ref={sizeRef}
        aria-labelledby="size-h"
        onClose={() => pickSize(null)}
        onClick={(e) => e.target === sizeRef.current && sizeRef.current?.close()}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(92vw,380px)] no-scrollbar overflow-y-auto rounded-3xl bg-paper p-5 text-ink backdrop:bg-black/70"
      >
        {pickingItem?.sizes && (
          <>
            <h2 id="size-h" className="font-display text-xl leading-tight font-extrabold">
              Which size?
            </h2>
            <p className="mt-1 text-[15px]">
              <span className="font-bold text-stone">{pickingItem.code}</span> {pickingItem.name}
            </p>
            <ul className="mt-4 grid gap-2">
              {pickingItem.sizes.map((s) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => {
                      change(pickingItem.code!, 1, s.label);
                      sizeRef.current?.close();
                    }}
                    className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 font-semibold hover:border-chili"
                  >
                    <span>{s.label}</span>
                    <span className="font-bold tabular-nums">{formatPrice(s.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => sizeRef.current?.close()}
              className="mt-3 min-h-11 w-full font-semibold text-ember underline underline-offset-2"
            >
              Cancel
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
