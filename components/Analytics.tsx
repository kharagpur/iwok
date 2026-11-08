import Script from "next/script";
import { site } from "@/data/site";

/**
 * Google Analytics 4 (the same property as the 2021 site, so the history continues).
 * Loads after the page is interactive, so it doesn't slow the first paint.
 */
export function Analytics() {
  const id = site.analytics.googleId;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
