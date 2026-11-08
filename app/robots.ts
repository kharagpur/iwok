import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Everyone may read the site, including AI assistants' crawlers (R20).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
