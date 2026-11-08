import { defineConfig, devices } from "@playwright/test";

// Tests for the website (`npm test` builds the site, then runs them all; see README "Tests").
// - data:     menu, hours, FAQ and search-engine text — no browser needed.
// - desktop:  the whole page on a laptop-sized Chrome (links, images, Google data, 404 page).
// - phones and tablets: the same checks on popular devices, in Safari's engine (WebKit) for
//   iPhones and iPads and Chrome's engine for Android. One-time setup: `npm run test:setup`.
// The site under test is the built copy in out/, served the way GitHub Pages serves it.

const port = 4173;

// Popular screens (the owner, 2026-11-08: "mobile-friendly based on all popular devices… behaviors are all the same").
const iphones = ["iPhone SE", "iPhone 15 Pro", "iPhone 15 Pro Max landscape", "iPad Mini"] as const;
const androids = ["Pixel 7", "Galaxy S24", "Galaxy S9+", "Galaxy Tab S9"] as const;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx serve out -l ${port} --no-port-switching`,
    url: `http://localhost:${port}`,
    env: { NO_UPDATE_CHECK: "1" },
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "data", testMatch: /data\.spec\.ts/ },
    { name: "desktop", testMatch: /(site|devices)\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    ...iphones.map((name) => ({ name, testMatch: /devices\.spec\.ts/, use: { ...devices[name] } })),
    ...androids.map((name) => ({ name, testMatch: /devices\.spec\.ts/, use: { ...devices[name] } })),
    {
      // The narrowest phone screen in use: the Galaxy Fold's cover screen, 280 px wide.
      name: "Galaxy Fold cover",
      testMatch: /devices\.spec\.ts/,
      use: { ...devices["Pixel 7"], viewport: { width: 280, height: 653 } },
    },
  ],
});
