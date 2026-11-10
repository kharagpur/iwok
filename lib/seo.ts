// What search engines and AI assistants read about Indian Wok (R13, R20).
// Everything is built from data/site.ts, data/menu.ts and data/faq.ts, so it always matches the page.
import { faq } from "@/data/faq";
import { formatPrice, menu, type MenuItem } from "@/data/menu";
import { googleReviews, site } from "@/data/site";

const offer = (price: number, name?: string) => ({
  "@type": "Offer",
  ...(name ? { name } : {}),
  price: price.toFixed(2),
  priceCurrency: "CAD",
});

function menuItem(item: MenuItem, glutenFree: boolean) {
  const offers = item.sizes
    ? item.sizes.map((s) => offer(s.price, s.label))
    : item.price !== undefined
      ? offer(item.price)
      : undefined;
  const notes = [item.spice !== "none" ? `Spice: ${item.spice}.` : "", item.containsNuts ? "Contains nuts." : ""]
    .filter(Boolean)
    .join(" ");
  const diets = [
    ...(glutenFree ? ["https://schema.org/GlutenFreeDiet"] : []),
    ...(item.vegetarian ? ["https://schema.org/VegetarianDiet"] : []),
  ];
  return {
    "@type": "MenuItem",
    name: item.code ? `${item.code}. ${item.name}` : item.name,
    ...(notes ? { description: notes } : {}),
    ...(item.photo ? { image: `${site.url}/images/dishes/${item.photo}-640.webp` } : {}),
    ...(offers ? { offers } : {}),
    ...(diets.length ? { suitableForDiet: diets.length === 1 ? diets[0] : diets } : {}),
  };
}

/** schema.org data for the page: the restaurant with its full menu, and the FAQ. */
export function structuredData() {
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    description: site.description,
    url: site.url,
    image: [`${site.url}/images/og.jpg`, `${site.url}/images/hero-dish-960.webp`],
    logo: `${site.url}/images/logo-720.webp`,
    telephone: site.phone.schema,
    email: site.email,
    servesCuisine: ["Indian-Chinese", "Indo-Chinese", "Hakka", "Chinese", "Indian"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: ["Burnaby", "Vancouver", "Metro Vancouver"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.openingHours.days,
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
    ],
    hasMap: site.mapUrl,
    subjectOf: { "@type": "NewsArticle", headline: site.press.title, url: site.press.url, publisher: { "@type": "Organization", name: site.press.outlet } },
    acceptsReservations: false,
    sameAs: [...site.social.map((s) => s.href), site.mapUrl],
    hasMenu: {
      "@type": "Menu",
      name: "Indian Wok menu",
      url: `${site.url}/#menu`,
      inLanguage: "en-CA",
      hasMenuSection: menu.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        hasMenuItem: c.items.map((i) => menuItem(i, c.id === "gluten-free")),
      })),
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return [restaurant, faqPage];
}

function priceText(item: MenuItem) {
  if (item.sizes) return item.sizes.map((s) => `${s.label} ${formatPrice(s.price)}`).join(", ");
  return item.price !== undefined ? formatPrice(item.price) : "call for price";
}

function itemLine(item: MenuItem) {
  const notes = [item.spice !== "none" ? `${item.spice} spice` : "", item.containsNuts ? "contains nuts" : ""].filter(Boolean);
  return `- ${item.code ? `${item.code}. ` : ""}${item.name}: ${priceText(item)}${notes.length ? ` (${notes.join(", ")})` : ""}`;
}

/** llms.txt: a short, plain summary for AI assistants (llmstxt.org). */
export function llmsTxt() {
  return `# ${site.name}

> ${site.description}

## Key facts
- Address: ${site.address.street}, ${site.address.city}, ${site.address.region}, Canada (${site.address.landmark}, ${site.address.area})
- Parking: ${site.parking.short}
- Phone: ${site.phone.display}
- Email: ${site.email}
- Hours: ${site.hours[0].days} ${site.hours[0].time}; closed ${site.hours[1].days}. Dinner only.
- Cuisine: Indian-Chinese (Hakka and Calcutta-style)
- Ordering: call for pickup (${site.pickupOffer.toLowerCase()}), or delivery on ${site.delivery.map((d) => d.name).join(", ")}
- Seating: small restaurant, walk-ins welcome; bigger groups call a couple of days ahead
- Catering: for special events, by phone
- Google rating: ${googleReviews.rating} from ${googleReviews.countLabel} reviews
- Family history: ${site.story}

## Menu
- [Full menu with prices](${site.url}/llms-full.txt): every dish, spice level and price as plain text
- [Menu on the website](${site.url}/#menu)

## Questions
${faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## Links
- [Website](${site.url})
- [Google Maps and reviews](${site.mapUrl})
- [${site.press.outlet}: ${site.press.title}](${site.press.url})
${site.delivery.map((d) => `- [${d.name}](${d.href})`).join("\n")}
${site.social.map((s) => `- [${s.name}](${s.href})`).join("\n")}
`;
}

/** llms-full.txt: the whole menu as plain text. */
export function llmsFullTxt() {
  return `# ${site.name}: full menu

> ${site.address.street}, ${site.address.city} (${site.address.area}) · ${site.phone.display} · ${site.hours[0].days} ${site.hours[0].time}, closed ${site.hours[1].days}. Prices in Canadian dollars. For any dish listed as "call for price", call the restaurant.

${menu.map((c) => `## ${c.name}\n${c.items.map(itemLine).join("\n")}`).join("\n\n")}
`;
}
