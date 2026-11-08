// Frequently asked questions: shown on the page and given to search engines and AI assistants
// (FAQ structured data and llms.txt). Facts come from data/site.ts and data/menu.ts so they can't drift.
import { menu } from "./menu";
import { site } from "./site";

const vegetarianCount = menu.reduce((n, c) => n + c.items.filter((i) => i.vegetarian).length, 0);
const glutenFree = menu.find((c) => c.id === "gluten-free")?.items.map((i) => i.name) ?? [];
const nutDishes = menu.flatMap((c) => c.items).filter((i) => i.containsNuts).map((i) => i.name);
const delivery = site.delivery.map((d) => d.name);

export const faq: { q: string; a: string }[] = [
  {
    q: "When is Indian Wok open?",
    a: `Dinner only: ${site.hours[0].days}, ${site.hours[0].time}. Closed on Mondays.`,
  },
  {
    q: "Where is Indian Wok?",
    a: `${site.address.street}, ${site.address.city}, ${site.address.region}, at the corner of Kingsway and Royal Oak in ${site.address.area}.`,
  },
  {
    q: "Is there parking?",
    a: `Yes. ${site.parking.text}`,
  },
  {
    q: "Who runs Indian Wok?",
    a: `The owners, a family of Chinese descent born and raised in India. It's a second-generation family restaurant: the family's first was ${site.heritage.first}, over 50 years ago. The owners then ran their own Indian-Chinese restaurant in Austria for about thirty years before opening Indian Wok in Burnaby.`,
  },
  {
    q: "What is Indian-Chinese (Hakka) food?",
    a: "Chinese cooking adapted to Indian tastes by the Hakka Chinese community in Kolkata (Calcutta): bold, spicy and saucy dishes like chili chicken, Manchurian and Hakka chow mein.",
  },
  {
    q: "Do you have gluten-free dishes?",
    a: `Yes, a gluten-free section: ${glutenFree.join(", ")}.`,
  },
  {
    q: "Do you have vegetarian dishes?",
    a: `Yes, ${vegetarianCount} of them: vegetable, tofu and paneer dishes, vegetarian noodles and fried rice, vegetarian appetizers and soups. They’re marked Vegetarian on the menu, and you can filter for them. Vegan? Call and tell us what you need.`,
  },
  {
    q: "Do any dishes contain nuts?",
    a: `${nutDishes.join(" and ")} contain nuts. Tell us about any allergy when you order.`,
  },
  {
    q: "Do you deliver?",
    a: `Yes, through ${delivery.slice(0, -1).join(", ")} and ${delivery.at(-1)}. Or call ${site.phone.display} and pick up: ${site.pickupOffer.toLowerCase()}.`,
  },
  {
    q: "Do I need a reservation?",
    a: "No, walk-ins are welcome; the restaurant is small with limited seating. For a bigger group, call a couple of days ahead.",
  },
  {
    q: "Do you cater events?",
    a: `Yes, for special events. Call ${site.phone.display} to talk it through.`,
  },
];
