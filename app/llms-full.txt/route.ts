// /llms-full.txt — the whole menu as plain text for AI assistants, written at build time from data/menu.ts.
import { llmsFullTxt } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
