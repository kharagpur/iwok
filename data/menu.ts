// The one menu source for the whole site (R15): every section reads names, prices and photos from here.
// Taken from the current site (github.com/kharagpur/iwok, index.html, full-menu section) on 2026-11-07;
// spice levels, six new dishes and the most-ordered list checked against the delivery apps on 2026-11-08.
// Prices, dish names, sizes and new entries supplied by the user on 2026-11-08.
// Existing photos and spice levels retained; F8 was absent from the supplied list.
// Items with a `check` note have an open question for the owner; they're listed in the project notes too.

export type Spice = "none" | "mild" | "medium" | "hot";

export type MenuItem = {
  /** Menu code like "C1"; side orders have none. */
  code?: string;
  name: string;
  spice: Spice;
  /** Price in dollars. Missing when the current site shows none. */
  price?: number;
  /** For soups and plain rice, which come in sizes. */
  sizes?: { label: string; price: number }[];
  containsNuts?: boolean;
  /** Vegetarian (no meat, fish or egg), from the dish names and sections; confirm with the restaurant. */
  vegetarian?: boolean;
  /** Base name of the dish photo: public/images/dishes/<photo>-320.webp and -640.webp (4:3, made by scripts/resize-photos.mjs). */
  photo?: string;
  /** Open question to settle before launch. */
  check?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const pricesArePlaceholders = false;

export const spiceLabel: Record<Spice, string> = {
  none: "",
  mild: "Mild",
  medium: "Medium",
  hot: "Hot",
};

/** 15.5 -> "$15.50" */
export function formatPrice(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

export const menu: MenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      { code: "A1", name: "Vegetarian Spring Roll (2 pcs)", spice: "none", vegetarian: true, price: 6.14, photo: "a1" },
      { code: "A2", name: "Vegetarian Tofu Lettuce Wrap", spice: "mild", vegetarian: true, price: 18.99 },
      { code: "A3", name: "Vegetable Pakora", spice: "mild", vegetarian: true, price: 11.65, photo: "a3" },
      { code: "A4", name: "Chili Garlic Vegetarian Dumplings (6 pcs)", spice: "mild", vegetarian: true, price: 8.99 },
      { code: "A5", name: "Papadum (Crispy Flatbread)", spice: "none", vegetarian: true, price: 4.74, photo: "a5" },
      { code: "A6", name: "Chicken Lettuce Wrap", spice: "mild", price: 19.49, photo: "a6" },
      { code: "A7", name: "Chili Garlic Wings", spice: "mild", price: 9.74, photo: "a7" },
      { code: "A8", name: "Chili Garlic Chicken Dumplings (6 pcs)", spice: "mild", price: 8.99, photo: "a8" },
      { code: "A9", name: "Combo Pakora (Chicken/Fish)", spice: "mild", price: 14.49, photo: "a9" },
      { code: "A10", name: "Dry Chili Chicken", spice: "hot", price: 21.25, photo: "a10" },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    items: [
      { code: "S1", name: "Vegetable Hot and Sour Soup", spice: "mild", vegetarian: true, sizes: [{ label: "Small", price: 4.90 }, { label: "Medium", price: 7.90 }, { label: "Large", price: 11.95 }] },
      { code: "S2", name: "Vegetable Cream Corn Soup", spice: "none", vegetarian: true, sizes: [{ label: "Small", price: 4.90 }, { label: "Medium", price: 7.90 }, { label: "Large", price: 11.95 }] },
      { code: "S3", name: "Chicken Hot and Sour Soup", spice: "mild", sizes: [{ label: "Small", price: 5.90 }, { label: "Medium", price: 8.90 }, { label: "Large", price: 13.40 }], photo: "s3" },
      { code: "S4", name: "Chicken Cream Corn Soup", spice: "none", sizes: [{ label: "Small", price: 5.90 }, { label: "Medium", price: 8.90 }, { label: "Large", price: 13.40 }] },
      { code: "S5", name: "Chicken Wonton Soup (Medium: 6 pcs; Large: 12 pcs)", spice: "none", sizes: [{ label: "Medium", price: 9.99 }, { label: "Large", price: 14.99 }], photo: "s5" },
      { code: "S6", name: "Chicken Clear Egg Drop Soup", spice: "none", sizes: [{ label: "Small", price: 5.40 }, { label: "Medium", price: 8.40 }, { label: "Large", price: 13.15 }], photo: "s6" },
    ],
  },
  {
    id: "fish",
    name: "Fish",
    items: [
      { code: "F1", name: "Bombay Style Garlic Fish", spice: "mild", price: 19.98, photo: "f1" },
      { code: "F2", name: "Chili Fish", spice: "hot", price: 19.98, photo: "f2" },
      { code: "F3", name: "Stir-Fried Szechuan Fish", spice: "medium", price: 22.49, photo: "f3" },
      { code: "F4", name: "Sweet and Sour Fish", spice: "none", price: 19.98, photo: "f4" },
      { code: "F5", name: "Fish with Black Bean Sauce", spice: "mild", price: 19.98, photo: "f5" },
      { code: "F6", name: "Masala Fish (Dry)", spice: "medium", price: 21.98, photo: "f6" },
      { code: "F7", name: "Hot and Spicy Squid (Dry)", spice: "medium", price: 21.99, photo: "f7" },
      { code: "F8", name: "Dry Chili Fish", spice: "hot", check: "Absent from the supplied menu (2026-11-08); confirm availability and price." },
    ],
  },
  {
    id: "chicken",
    name: "Chicken",
    items: [
      { code: "C1", name: "Manchurian Chicken", spice: "medium", price: 19.98, photo: "c1" },
      { code: "C2", name: "Spicy Green Beans with Chicken", spice: "mild", price: 19.98, photo: "c2" },
      { code: "C3", name: "Masala Chicken", spice: "medium", price: 21.99, photo: "c3" },
      { code: "C4", name: "Chili Chicken", spice: "hot", price: 19.98, photo: "c4" },
      { code: "C5", name: "Tangerine Chicken", spice: "mild", price: 19.98, photo: "c5" },
      { code: "C6", name: "Chicken with Black Bean Sauce", spice: "mild", price: 19.98 },
      { code: "C7", name: "Chicken with Mixed Vegetables", spice: "mild", price: 19.98 },
      { code: "C8", name: "Butter Chicken", spice: "none", price: 21.25, containsNuts: true, photo: "c8" },
      { code: "C9", name: "Sweet and Sour Chicken", spice: "none", price: 19.35, photo: "c9" },
      { code: "C10", name: "Lemon Chicken", spice: "none", price: 19.98 },
      { code: "C11", name: "Honey Garlic Chicken", spice: "none", price: 19.98, photo: "c11" },
      { code: "C12", name: "Szechuan Chicken", spice: "medium", price: 19.98, photo: "c12" },
      { code: "C13", name: "General Tso's Chicken", spice: "mild", price: 19.98, photo: "c13" },
      { code: "C14", name: "Dai Ching Chicken", spice: "hot", price: 21.99, photo: "c14" },
      { code: "C15", name: "Boneless Chicken Curry", spice: "mild", price: 19.98, photo: "c15" },
      { code: "C16", name: "Dry Manchurian Chicken", spice: "medium", price: 21.25 },
    ],
  },
  {
    id: "beef",
    name: "Beef",
    items: [
      { code: "B1", name: "Beef with Spicy Eggplant and Green Beans", spice: "mild", price: 20.98, photo: "b1" },
      { code: "B2", name: "Ginger Beef", spice: "mild", price: 20.98, photo: "b2" },
      { code: "B3", name: "Beef with Broccoli", spice: "mild", price: 20.98, photo: "b3" },
      { code: "B4", name: "Szechuan Beef", spice: "medium", price: 20.98, photo: "b4" },
      { code: "B5", name: "Chili Beef", spice: "hot", price: 20.98, photo: "b5" },
      { code: "B6", name: "Curry Beef", spice: "mild", price: 20.98, photo: "b6" },
      { code: "B7", name: "Beef with Black Bean Sauce", spice: "mild", price: 20.98 },
      { code: "B8", name: "Dry Chili Beef", spice: "hot", price: 21.49 },
    ],
  },
  {
    id: "prawn",
    name: "Prawns",
    items: [
      { code: "P1", name: "Bombay Style Garlic Prawns", spice: "mild", price: 21.98 },
      { code: "P2", name: "Szechuan Prawns", spice: "medium", price: 21.98 },
      { code: "P3", name: "Masala Prawns (Dry)", spice: "medium", price: 21.98, photo: "p3" },
      { code: "P4", name: "Curry Prawns", spice: "mild", price: 21.98, photo: "p4" },
      { code: "P5", name: "Hot and Spicy Prawns (Dry)", spice: "medium", price: 21.98, photo: "p5" },
    ],
  },
  {
    id: "tofu-paneer",
    name: "Tofu and Paneer",
    items: [
      { code: "T1", name: "Tofu with Mixed Vegetables", spice: "mild", vegetarian: true, price: 18.98, photo: "t1" },
      { code: "T2", name: "Hot and Spicy Tofu (Dry, No Sauce)", spice: "medium", vegetarian: true, price: 19.98, photo: "t2" },
      { code: "T3", name: "Tofu with Broccoli and Baby Corn", spice: "mild", vegetarian: true, price: 18.98 },
      { code: "T4", name: "Tofu Eggplant in Black Bean Sauce", spice: "mild", vegetarian: true, price: 18.98, photo: "t4" },
      { code: "T5", name: "Chili Garlic Paneer (Soft Paneer with Sauce)", spice: "hot", vegetarian: true, price: 20.98, photo: "t5" },
      { code: "T6", name: "Hot and Spicy Paneer (Dry, No Sauce)", spice: "medium", vegetarian: true, price: 21.98, photo: "t6" },
      { code: "T7", name: "Butter Paneer", spice: "none", vegetarian: true, price: 20.98, containsNuts: true },
      { code: "T8", name: "Chili Tofu", spice: "hot", vegetarian: true, price: 19.98 },
    ],
  },
  {
    id: "vegetable",
    name: "Vegetable",
    items: [
      { code: "V1", name: "Vegetable Manchurian", spice: "medium", vegetarian: true, price: 17.50, photo: "v1" },
      { code: "V2", name: "Gobi Manchurian with Tofu (Cauliflower)", spice: "medium", vegetarian: true, price: 18.89 },
      { code: "V3", name: "Spicy Eggplant and Green Beans", spice: "mild", vegetarian: true, price: 17.50, photo: "v3" },
      { code: "V4", name: "Spicy Green Beans", spice: "medium", vegetarian: true, price: 17.50, photo: "v4" },
      { code: "V5", name: "Stir-Fry Mixed Vegetables (With Mushrooms)", spice: "mild", vegetarian: true, price: 17.50, photo: "v5" },
      { code: "V6", name: "Sautéed Broccoli", spice: "mild", vegetarian: true, price: 17.50 },
      { code: "V7", name: "Spicy Green Beans and Broccoli", spice: "mild", vegetarian: true, price: 17.50 },
      { code: "V8", name: "Dry Veggie Manchurian", spice: "medium", vegetarian: true, price: 18.99 },
      { code: "V9", name: "Vegetable Curry", spice: "mild", vegetarian: true, price: 17.99 },
      { code: "V10", name: "Bombay Style Sweet and Sour Vegetables", spice: "mild", vegetarian: true, price: 17.50, photo: "v10" },
      { code: "V11", name: "Dry Gobi Manchurian with Tofu", spice: "medium", vegetarian: true, price: 20.75 },
    ],
  },
  {
    id: "noodles",
    name: "Noodles",
    items: [
      { code: "N1", name: "Calcutta Vegetarian Hakka Chow Mein", spice: "none", vegetarian: true, price: 16.50, photo: "n1" },
      { code: "N2", name: "Vegetarian Shanghai Chow Mein", spice: "mild", vegetarian: true, price: 16.50 },
      { code: "N3", name: "Vegetarian Szechuan Chow Mein", spice: "medium", vegetarian: true, price: 17.50, photo: "n3" },
      { code: "N4", name: "Vegetarian Manchurian Noodle", spice: "medium", vegetarian: true, price: 18.50, photo: "n4" },
      { code: "N5", name: "Vegetarian American Chop Suey", spice: "mild", vegetarian: true, price: 18.50, photo: "n5" },
      { code: "N6", name: "Pan-Fried Noodles with Vegetables", spice: "mild", vegetarian: true, price: 18.50, photo: "n6" },
      { code: "N7", name: "Calcutta Chicken Hakka Chow Mein", spice: "mild", price: 17.50, photo: "n7" },
      { code: "N8", name: "Chicken Shanghai Chow Mein", spice: "mild", price: 17.50, photo: "n8" },
      { code: "N9", name: "Chicken Szechuan Chow Mein", spice: "medium", price: 18.50, photo: "n9" },
      { code: "N10", name: "Chicken Manchurian Noodle", spice: "medium", price: 19.50, photo: "n10" },
      { code: "N11", name: "Chicken American Chop Suey", spice: "mild", price: 19.50 },
      { code: "N12", name: "Crispy Noodles with Chicken and Vegetables", spice: "mild", price: 19.50 },
      { code: "N13", name: "Egg Calcutta Hakka Chow Mein", spice: "none", price: 18.25 },
      { code: "N14", name: "Pan-Fried Noodles with Chicken", spice: "none", price: 20.50 },
    ],
  },
  {
    id: "rice",
    name: "Rice Dishes",
    items: [
      { code: "R1", name: "Vegetarian Fried Rice", spice: "mild", vegetarian: true, price: 15.50, photo: "r1" },
      { code: "R2", name: "Vegetarian Masala Rice", spice: "medium", vegetarian: true, price: 15.98 },
      { code: "R3", name: "Vegetarian Szechuan Rice", spice: "medium", vegetarian: true, price: 15.98, photo: "r3" },
      { code: "R4", name: "Vegetarian Manchurian Rice", spice: "medium", vegetarian: true, price: 15.98, photo: "r4" },
      { code: "R5", name: "Chicken Fried Rice", spice: "mild", price: 16.98, photo: "r5" },
      { code: "R6", name: "Chicken Masala Rice", spice: "medium", price: 17.50, photo: "r6" },
      { code: "R7", name: "Chicken Szechuan Rice", spice: "medium", price: 17.50, photo: "r7" },
      { code: "R8", name: "Chicken Manchurian Rice", spice: "medium", price: 17.50, photo: "r8" },
      { code: "R9", name: "Beef Fried Rice", spice: "mild", price: 18.50 },
      { code: "R10", name: "Egg Fried Rice", spice: "mild", price: 16.75 },
      { code: "R11", name: "Shrimp Fried Rice", spice: "none", price: 18.75 },
    ],
  },
  {
    id: "gluten-free",
    name: "Gluten-Free Dishes",
    items: [
      { code: "G1", name: "Gluten-Free Chicken with Broccoli", spice: "mild", price: 20.95, photo: "g1" },
      { code: "G2", name: "Gluten-Free Chicken with Pineapple (Sweet and Sour Sauce)", spice: "none", price: 20.95, photo: "g2" },
      { code: "G3", name: "Gluten-Free Vegetarian Vermicelli Noodles", spice: "mild", vegetarian: true, price: 19.95, photo: "g3" },
      { code: "G4", name: "Gluten-Free Vegetarian Fried Rice", spice: "mild", vegetarian: true, price: 17.75 },
      { code: "G5", name: "Gluten-Free Chicken Vermicelli Noodles", spice: "mild", price: 20.95 },
      { code: "G6", name: "Gluten-Free Chicken Fried Rice", spice: "mild", price: 18.75 },
    ],
  },
  {
    id: "special-combos",
    name: "Special Combos",
    items: [
      { code: "CMB1", name: "Veg Rice with Veg Manchurian (8 pcs)", spice: "medium", vegetarian: true, price: 13.99 },
      { code: "CMB2", name: "Veg Rice with Chicken Manchurian", spice: "medium", price: 14.99 },
      { code: "CMB3", name: "Veg Chow Mein with Veg Manchurian (8 pcs)", spice: "medium", vegetarian: true, price: 13.99 },
      { code: "CMB4", name: "Veg Chow Mein with Chicken Manchurian", spice: "medium", price: 14.99 },
    ],
  },
  {
    id: "sides",
    name: "Side Orders",
    items: [
      { code: "J1", name: "Plain Rice", spice: "none", vegetarian: true, sizes: [{ label: "Small", price: 3.74 }, { label: "Medium", price: 6.24 }, { label: "Large", price: 7.45 }] },
      { code: "J4", name: "Naan", spice: "none", vegetarian: true, price: 4.49, photo: "naan" },
      { code: "J5", name: "Chicken & Fries", spice: "none", price: 8.74 },
      { code: "J6", name: "Fries", spice: "none", vegetarian: true, price: 5.74 },
    ],
  },
];

/** Most ordered, from DoorDash and Uber Eats (2026-11-08). Prices come from the menu above, so they can't disagree. */
export const popularCodes = ["R7", "N1", "C1", "A10", "R5", "C14", "C4", "N7", "A8"] as const;

export function findItem(code: string): MenuItem | undefined {
  for (const category of menu) {
    const item = category.items.find((i) => i.code === code);
    if (item) return item;
  }
  return undefined;
}

export const popularItems: MenuItem[] = popularCodes.map((code) => {
  const item = findItem(code);
  if (!item) throw new Error(`Popular item ${code} is not on the menu`);
  return item;
});
