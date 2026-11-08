// Restaurant facts used across the page, the structured data and llms.txt. The menu lives in data/menu.ts.
// Source: the current site (kharagpur/iwok), Google Maps, and the Indian Wok – Requirements note.

export const site = {
  name: "Indian Wok",
  url: "https://indianwok.ca",
  title: "Indian Wok | Hakka & Indian-Chinese food in Burnaby, Metro Vancouver",
  headline: "Hakka & Calcutta-style Indian-Chinese",
  description:
    "Family-run Indian-Chinese restaurant at 5212 Kingsway, Burnaby (Metro Vancouver), at Royal Oak. Hakka and Calcutta-style dishes like chili chicken, Manchurian and Hakka noodles, with vegetarian and gluten-free choices. Dinner Tuesday to Sunday; 10% off pickup; delivery on DoorDash, Uber Eats and SkipTheDishes.",

  phone: { display: "604-428-2673", href: "tel:+16044282673", schema: "+1-604-428-2673" },
  email: "indianwokca@gmail.com",

  address: {
    street: "5212 Kingsway",
    city: "Burnaby",
    region: "BC",
    country: "CA",
    area: "Metro Vancouver",
    landmark: "Corner of Kingsway and Royal Oak",
  },
  geo: { lat: 49.2246744, lng: -122.9884601 },
  mapUrl:
    "https://www.google.com/maps/place/Indian+Wok/@49.2246744,-122.9884601,17z/data=!4m12!1m6!3m5!1s0x548676500bcc2711:0x2edae4a746bb718e!2sIndian+Wok!8m2!3d49.2246744!4d-122.9884601!3m4!1s0x548676500bcc2711:0x2edae4a746bb718e!8m2!3d49.2246744!4d-122.9884601",

  // Tuesday to Sunday 4:30–9:30 pm, closed Monday (Google Maps, 2026-11-07).
  hours: [
    { days: "Tuesday – Sunday", short: "Tue–Sun", time: "4:30 – 9:30 pm" },
    { days: "Monday", short: "Mon", time: "Closed" },
  ],
  openingHours: {
    days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "16:30",
    closes: "21:30",
  },

  pickupOffer: "10% off in-store pickup",

  // Parking (the owner, 2026-11-08): only behind Indian Wok and the bank on the corner; entrance from Royal Oak Ave.
  parking: {
    text: "Parking is at the back, behind Indian Wok and the bank on the corner: drive in from Royal Oak Ave, just south of Kingsway.",
    short: "Parking at the back, behind Indian Wok and the corner bank; entrance on Royal Oak Ave",
  },

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

  // Press: Burnaby Now's feature on the restaurant (linked only; no text copied).
  press: {
    outlet: "Burnaby Now",
    title: "Fusing flavours in Burnaby",
    url: "https://www.burnabynow.com/local-business/fusing-flavours-in-burnaby-2985598",
  },

  story:
    "The owners are of Chinese descent, born and raised in India. They cooked Indian-Chinese food in their own restaurant in Austria for about thirty years before bringing those recipes to Burnaby.",
};

// Google reviews (R12): rating, count and what guests say, written in our own words.
// Checked on Google Maps on 2026-11-08; update `rating` and `count` now and then.
export const googleReviews = {
  rating: 4.4,
  count: 1019,
  countLabel: "1,000+",
  url: site.mapUrl,
  themes: [
    { title: "Feels like family", text: "Guests say the owners make them feel like guests in their own home." },
    { title: "Worth the drive", text: "Regulars come in from as far as Chilliwack for the Hakka cooking." },
    { title: "Vegetarian-friendly", text: "Plenty of vegetarian dishes, and a kitchen that adjusts dishes for vegans." },
  ],
  // The dishes guests mention most (Google's review topics).
  mostLoved: ["V1", "S1", "C4"],
};
