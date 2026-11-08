// Restaurant facts used across the page. The menu lives in data/menu.ts.
// Source: the current site (kharagpur/iwok) and the Indian Wok – Requirements note.

export const site = {
  name: "Indian Wok",
  url: "https://indianwok.ca",
  tagline: "Hakka & Calcutta-style Indian-Chinese in Burnaby",
  description:
    "Family-run Indian-Chinese restaurant at 5212 Kingsway, Burnaby (Kingsway and Royal Oak). Hakka and Calcutta-style dishes, dinner Tuesday to Sunday. Order for pickup, or on DoorDash, Uber Eats and SkipTheDishes.",

  phone: { display: "604-428-2673", href: "tel:+16044282673" },
  email: "indianwokca@gmail.com",

  address: {
    street: "5212 Kingsway",
    city: "Burnaby",
    region: "BC",
    country: "CA",
    landmark: "Corner of Kingsway and Royal Oak",
  },
  geo: { lat: 49.2246744, lng: -122.9884601 },
  mapUrl:
    "https://www.google.com/maps/place/Indian+Wok/@49.2246744,-122.9884601,17z/data=!4m12!1m6!3m5!1s0x548676500bcc2711:0x2edae4a746bb718e!2sIndian+Wok!8m2!3d49.2246744!4d-122.9884601!3m4!1s0x548676500bcc2711:0x2edae4a746bb718e!8m2!3d49.2246744!4d-122.9884601",

  // Tuesday to Sunday 4:30–9:30 pm, closed Monday (Google Maps, 2026-11-07).
  hours: [
    { days: "Tuesday – Sunday", time: "4:30 – 9:30 pm" },
    { days: "Monday", time: "Closed" },
  ],
  // Same hours for search engines (schema.org format).
  openingHours: ["Tu-Su 16:30-21:30"],

  pickupOffer: "10% off in-store pickup",

  delivery: [
    {
      name: "DoorDash",
      href: "https://www.doordash.com/business/36831/?utm_source=partner-link&utm_medium=website&utm_campaign=36831&utm_content=red-l",
    },
    { name: "Uber Eats", href: "https://www.ubereats.com/ca/store/indian-wok/VvVHiMUwV5uqOOpdugoI9w" },
    { name: "SkipTheDishes", href: "https://www.skipthedishes.com/indian-wok-kingsway" },
  ],

  social: [
    { name: "Instagram", href: "https://www.instagram.com/indian.wok/" },
    { name: "Facebook", href: "https://www.facebook.com/indianwokcanada/" },
    { name: "Yelp", href: "https://www.yelp.ca/biz/indian-wok-burnaby" },
  ],
};

// Featured Google reviews (R12). The section stays hidden until reviews are added here.
// Each: { quote: "…", author: "First name or name as shown on Google" }
export const reviews: { quote: string; author: string }[] = [];
