import { About } from "@/components/About";
import { FindUs } from "@/components/FindUs";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Popular } from "@/components/Popular";
import { site } from "@/data/site";

// Tells Google and other search engines what this place is (R13): a restaurant, where, when it's open.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/images/og.jpg`,
  logo: `${site.url}/images/logo-480.webp`,
  telephone: "+1-604-428-2673",
  email: site.email,
  servesCuisine: ["Indian-Chinese", "Hakka", "Indo-Chinese"],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: site.openingHours,
  hasMap: site.mapUrl,
  hasMenu: `${site.url}/#menu`,
  acceptsReservations: false,
  sameAs: site.social.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div id="top">
        <Header />
        <main>
          <Hero />
          <Popular />
          <Menu />
          <About />
          <FindUs />
        </main>
      </div>
    </>
  );
}
