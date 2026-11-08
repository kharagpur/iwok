// /llms.txt — a plain summary for AI assistants (llmstxt.org), written at build time from the data files.
import { llmsTxt } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
