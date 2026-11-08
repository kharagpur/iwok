import type { NextConfig } from "next";

// Static export for GitHub Pages: `npm run build` writes plain HTML, CSS and JS to out/.
// No server features (API routes reading requests, rewrites, redirects, headers, proxy).
const nextConfig: NextConfig = {
  output: "export",
  // Photos are resized ahead of time, so the default image optimizer (which needs a server) is off.
  images: { unoptimized: true },
};

export default nextConfig;
