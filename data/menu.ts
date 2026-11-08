// The one menu source for the whole site (R15): every section reads names, prices and photos from here.
// Taken from the current site (github.com/kharagpur/iwok, index.html, full-menu section) on 2026-11-07.
// PRICES ARE PLACEHOLDERS until the restaurant's current menu arrives.
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

export const pricesArePlaceholders = true;

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
      { code: "A1", name: "Vegetarian Spring Roll (2 pcs)", spice: "none", price: 4.96, photo: "a1", check: "Price $4.96 looks like a typo for $4.95 (popular items said $4.50). Keep until the restaurant's menu." },
      { code: "A2", name: "Vegetarian Tofu Lettuce Wrap", spice: "mild", price: 15.50 },
      { code: "A3", name: "Vegetable Pakora", spice: "none", price: 8.95, photo: "a3" },
      { code: "A4", name: "Chili Garlic Vegetarian Dumplings (6 pcs)", spice: "mild", price: 6.75 },
      { code: "A5", name: "Papadum (crispy flatbread)", spice: "none", price: 2.75, photo: "a5" },
      { code: "A6", name: "Chicken Lettuce Wrap", spice: "mild", price: 15.50, photo: "a6" },
      { code: "A7", name: "Chili Garlic Wings", spice: "medium", price: 7.50, photo: "a7", check: "Label says Medium Spicy but shows one chili (mild). Which is right?" },
      { code: "A8", name: "Chili Garlic Chicken Dumplings (6 pcs)", spice: "medium", price: 6.75, photo: "a8" },
      { code: "A9", name: "Combo Pakora (Chicken/Fish)", spice: "none", price: 11.95, photo: "a9" },
      { code: "A10", name: "Dry Chili Chicken", spice: "hot", price: 16.00, photo: "a10" },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    items: [
      { code: "S1", name: "Vegetable Hot and Sour Soup", spice: "mild", sizes: [{ label: "Small", price: 2.95 }, { label: "Medium", price: 5.95 }, { label: "Large", price: 9.95 }] },
      { code: "S2", name: "Vegetable Cream Corn Soup", spice: "none", sizes: [{ label: "Small", price: 2.95 }, { label: "Medium", price: 5.95 }, { label: "Large", price: 9.95 }] },
      { code: "S3", name: "Chicken Hot and Sour Soup", spice: "mild", sizes: [{ label: "Small", price: 3.95 }, { label: "Medium", price: 6.95 }, { label: "Large", price: 11.95 }], photo: "s3" },
      { code: "S4", name: "Chicken Cream Corn Soup", spice: "none", sizes: [{ label: "Small", price: 3.95 }, { label: "Medium", price: 6.95 }, { label: "Large", price: 11.95 }] },
      { code: "S5", name: "Chicken Wonton Soup (6/12 Pcs)", spice: "none", sizes: [{ label: "Small", price: 3.95 }, { label: "Medium", price: 6.95 }, { label: "Large", price: 11.95 }], photo: "s5" },
      { code: "S6", name: "Chicken Clear Egg Drop Soup", spice: "none", sizes: [{ label: "Small", price: 3.50 }, { label: "Medium", price: 6.25 }, { label: "Large", price: 11.50 }], photo: "s6" },
    ],
  },
  {
    id: "fish",
    name: "Fish",
    items: [
      { code: "F1", name: "Bombay Style Garlic Fish", spice: "mild", price: 15.50, photo: "f1" },
      { code: "F2", name: "Chili Fish", spice: "medium", price: 15.50, photo: "f2" },
      { code: "F3", name: "Stir-Fried Szechuan Fish", spice: "hot", price: 17.50, photo: "f3" },
      { code: "F4", name: "Sweet and Sour Fish", spice: "none", price: 15.50, photo: "f4" },
      { code: "F5", name: "Fish With Black Bean Sauce", spice: "mild", price: 15.50, photo: "f5" },
      { code: "F6", name: "Masala Fish", spice: "medium", price: 16.50, photo: "f6" },
      { code: "F7", name: "Hot and Spicy Squid (Dry)", spice: "medium", price: 17.50, photo: "f7" },
    ],
  },
  {
    id: "chicken",
    name: "Chicken",
    items: [
      { code: "C1", name: "Manchurian Chicken", spice: "medium", price: 15.50, photo: "c1" },
      { code: "C2", name: "Spicy Green Bean With Chicken", spice: "mild", price: 15.50, photo: "c2" },
      { code: "C3", name: "Masala Chicken", spice: "medium", price: 17.50, photo: "c3" },
      { code: "C4", name: "Chili Chicken", spice: "hot", price: 15.50, photo: "c4" },
      { code: "C5", name: "Tangerine Chicken", spice: "mild", price: 15.50, photo: "c5" },
      { code: "C6", name: "Chicken With Black Bean Sauce", spice: "mild", price: 15.50 },
      { code: "C7", name: "Chicken With Mixed Vegetables", spice: "mild", price: 15.50, check: "Missing from the August 2026 redesign branch: still on the menu?" },
      { code: "C8", name: "Butter Chicken", spice: "none", price: 16.95, containsNuts: true, photo: "c8" },
      { code: "C9", name: "Sweet and Sour Chicken", spice: "none", price: 14.95, photo: "c9" },
      { code: "C10", name: "Lemon Chicken", spice: "none", price: 15.50, check: "Missing from the August 2026 redesign branch: still on the menu?" },
      { code: "C11", name: "Honey Garlic Chicken", spice: "none", price: 16.50, photo: "c11" },
      { code: "C12", name: "Szechuan Chicken", spice: "medium", price: 15.50, photo: "c12" },
      { code: "C13", name: "General Tso's Chicken", spice: "mild", price: 15.50, photo: "c13" },
      { code: "C14", name: "Dai Ching Chicken", spice: "hot", price: 17.50, photo: "c14" },
      { code: "C15", name: "Boneless Chicken Curry", spice: "mild", price: 15.50, photo: "c15" },
      { code: "C16", name: "Dry Manchurian Chicken", spice: "medium", check: "No price on the current site." },
    ],
  },
  {
    id: "beef",
    name: "Beef",
    items: [
      { code: "B1", name: "Beef with Spicy Eggplant and Green Beans", spice: "mild", price: 16.50, photo: "b1" },
      { code: "B2", name: "Ginger Beef", spice: "mild", price: 16.50, photo: "b2" },
      { code: "B3", name: "Beef with Broccoli", spice: "mild", price: 16.50, photo: "b3" },
      { code: "B4", name: "Szechuan Beef", spice: "medium", price: 16.50, photo: "b4" },
      { code: "B5", name: "Chili Beef", spice: "hot", price: 16.50, photo: "b5" },
      { code: "B6", name: "Curry Beef", spice: "mild", price: 16.50, photo: "b6" },
      { code: "B7", name: "Beef with Black Bean Sauce", spice: "mild", price: 16.50 },
    ],
  },
  {
    id: "prawn",
    name: "Prawn",
    items: [
      { code: "P1", name: "Bombay Style Garlic Prawns", spice: "mild", price: 17.95 },
      { code: "P2", name: "Szechuan Prawns", spice: "medium", price: 17.50 },
      { code: "P3", name: "Masala Prawns (Dry)", spice: "medium", price: 17.50, photo: "p3" },
      { code: "P4", name: "Curry Prawns", spice: "mild", price: 17.50, photo: "p4" },
      { code: "P5", name: "Hot and Spicy Prawns (Dry)", spice: "medium", price: 17.95, photo: "p5" },
    ],
  },
  {
    id: "tofu-paneer",
    name: "Tofu and Paneer",
    items: [
      { code: "T1", name: "Tofu with Mixed Vegetables", spice: "mild", price: 13.95, photo: "t1", check: "Missing from the August 2026 redesign branch: still on the menu?" },
      { code: "T2", name: "Hot and Spicy Tofu (Dry)", spice: "medium", price: 14.95, photo: "t2" },
      { code: "T3", name: "Tofu with Broccoli and Baby Corn", spice: "mild", price: 13.95 },
      { code: "T4", name: "Tofu Eggplant in Black Bean Sauce", spice: "mild", price: 13.50, photo: "t4" },
      { code: "T5", name: "Chili Garlic Paneer", spice: "hot", price: 15.50, photo: "t5" },
      { code: "T6", name: "Dry Hot and Spicy Paneer (Dry)", spice: "medium", price: 15.50, photo: "t6" },
      { code: "T7", name: "Butter Paneer", spice: "none", price: 15.95, containsNuts: true },
    ],
  },
  {
    id: "vegetable",
    name: "Vegetable",
    items: [
      { code: "V1", name: "Vegetable Manchurian", spice: "medium", price: 13.50, photo: "v1" },
      { code: "V2", name: "Gobi Manchurian with Tofu (Cauliflower)", spice: "medium", price: 14.50 },
      { code: "V3", name: "Spicy Eggplant and Green Beans", spice: "mild", price: 13.50, photo: "v3" },
      { code: "V4", name: "Spicy Green Beans", spice: "medium", price: 13.50, photo: "v4" },
      { code: "V5", name: "Stir-Fried Mixed Vegetables (With Mushrooms)", spice: "mild", price: 13.50, photo: "v5" },
      { code: "V6", name: "Sautéed Broccoli", spice: "medium", price: 13.50 },
      { code: "V7", name: "Spicy Green Beans and Broccoli", spice: "mild", price: 13.50 },
      { code: "V8", name: "Vegetable Manchurian (Dry)", spice: "medium", check: "No price on the current site." },
      { code: "V9", name: "Vegetable Curry", spice: "mild", price: 13.50 },
      { code: "V10", name: "Bombay Style Sweet and Sour Vegetable", spice: "mild", price: 13.50, photo: "v10" },
    ],
  },
  {
    id: "noodles",
    name: "Noodles",
    items: [
      { code: "N1", name: "Calcutta Vegetarian Hakka Chow Mein", spice: "none", price: 11.95 },
      { code: "N2", name: "Vegetarian Shanghai Chow Mein", spice: "mild", price: 11.95 },
      { code: "N3", name: "Vegetarian Szechuan Chow Mein", spice: "medium", price: 12.95, photo: "n3" },
      { code: "N4", name: "Vegetarian Manchurian Noodle (With Sauce)", spice: "mild", price: 13.95, photo: "n4" },
      { code: "N5", name: "Vegetarian American Chopsuey", spice: "mild", price: 13.95, photo: "n5" },
      { code: "N6", name: "Pan-Fried Noodles with Vegetables", spice: "mild", price: 13.95 },
      { code: "N7", name: "Calcutta Chicken Hakka Chow Mein", spice: "mild", price: 12.95, photo: "n7" },
      { code: "N8", name: "Chicken Shanghai Chow Mein", spice: "mild", price: 12.95, photo: "n8" },
      { code: "N9", name: "Chicken Szechuan Chow Mein", spice: "medium", price: 13.95, photo: "n9" },
      { code: "N10", name: "Chicken Manchurian Noodle (With Sauce)", spice: "medium", price: 14.95, photo: "n10" },
      { code: "N11", name: "Chicken American Chop Suey", spice: "mild", price: 14.95 },
      { code: "N12", name: "Crispy Noodles with Chicken and Vegetables", spice: "mild", price: 14.95 },
    ],
  },
  {
    id: "rice",
    name: "Rice Dishes",
    items: [
      { code: "R1", name: "Vegetarian Fried Rice", spice: "mild", price: 10.95, photo: "r1" },
      { code: "R2", name: "Vegetarian Masala Rice", spice: "medium", price: 11.50 },
      { code: "R3", name: "Vegetarian Szechuan Rice", spice: "medium", price: 11.50, photo: "r3" },
      { code: "R4", name: "Vegetarian Manchurian Rice (No Veg Balls Included)", spice: "medium", price: 11.50, photo: "r4" },
      { code: "R5", name: "Chicken Fried Rice", spice: "mild", price: 12.95, photo: "r5" },
      { code: "R6", name: "Chicken Masala Rice", spice: "medium", price: 12.95, photo: "r6" },
      { code: "R7", name: "Chicken Szechuan Rice", spice: "medium", price: 12.95, photo: "r7" },
      { code: "R8", name: "Chicken Manchurian Rice (No Veg Balls Included)", spice: "medium", price: 12.95, photo: "r8" },
      { code: "R9", name: "Beef Fried Rice", spice: "mild", price: 13.95 },
      { code: "R10", name: "Egg Fried Rice", spice: "mild", price: 11.95 },
    ],
  },
  {
    id: "gluten-free",
    name: "Gluten-Free Dishes",
    items: [
      { code: "G1", name: "Gluten-Free Chicken with Broccoli", spice: "mild", price: 16.95, photo: "g1" },
      { code: "G2", name: "Gluten-Free Chicken with Pineapple (in Sweet and Sour Sauce)", spice: "none", price: 16.95, photo: "g2" },
      { code: "G3", name: "Gluten-Free Vegetarian Vermicelli Noodles", spice: "mild", price: 15.99, photo: "g3" },
      { code: "G4", name: "Gluten-Free Vegetarian Fried Rice", spice: "mild", price: 13.95 },
      { code: "G5", name: "Gluten-Free Chicken Vermicelli Noodles", spice: "mild", price: 16.99 },
      { code: "G6", name: "Gluten-Free Chicken Fried Rice", spice: "mild", price: 14.95 },
    ],
  },
  {
    id: "sides",
    name: "Side Orders",
    items: [
      { name: "Plain Rice", spice: "none", sizes: [{ label: "Small", price: 1.95 }, { label: "Medium", price: 3.95 }, { label: "Large", price: 5.25 }] },
      { name: "Naan", spice: "none", price: 2.50, photo: "naan" },
      { name: "Chicken And Fries", spice: "none", price: 5.95 },
      { name: "Fries", spice: "none", price: 3.75 },
    ],
  },
];

/** Popular items, in the order the current site shows them. Prices come from the menu above, so they can't disagree. */
export const popularCodes = ["N1", "R7", "A4", "N7", "A8", "C4", "N3", "A1", "C1"] as const;

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
