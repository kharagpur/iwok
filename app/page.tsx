import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { FindUs } from "@/components/FindUs";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Popular } from "@/components/Popular";
import { Reviews } from "@/components/Reviews";
import { StickyBar } from "@/components/StickyBar";
import { structuredData } from "@/lib/seo";

export default function Home() {
  return (
    <>
      {/* The restaurant, its full menu and the FAQ, for Google and AI assistants (lib/seo.ts). */}
      {structuredData().map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <div id="top">
        <Header />
        <main>
          <Hero />
          <Popular />
          <Menu />
          <Reviews />
          <About />
          <Faq />
          <FindUs />
        </main>
        <StickyBar />
      </div>
    </>
  );
}
