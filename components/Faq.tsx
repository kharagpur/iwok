import { faq } from "@/data/faq";
import { PlusIcon } from "./icons";

/** Questions and answers (R20): readable by people, Google and AI assistants. No JavaScript needed. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="mx-auto max-w-6xl px-5 pt-12 sm:px-6 md:pt-16">
      <h2 id="faq-h" className="font-display text-[28px] font-extrabold md:text-4xl">
        Questions
      </h2>
      <div className="mt-3 max-w-3xl border-t border-line">
        {faq.map((f) => (
          <details key={f.q} className="border-b border-line">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-[17px] font-semibold">
              {f.q}
              <PlusIcon className="faq-plus size-5 shrink-0 text-ember transition-transform motion-reduce:transition-none" />
            </summary>
            <p className="pb-4 leading-relaxed text-stone">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
