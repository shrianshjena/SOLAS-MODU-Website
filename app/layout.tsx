import type { Metadata, Viewport } from "next";
import { generalSans, jetbrainsMono } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://solasmodu.net"),
  title: {
    default: "SOLAS MODU Marine Services | Marine Surveys, NDT & Survival Systems",
    template: "%s · SOLAS MODU Marine Services",
  },
  description:
    "SOLAS MODU Marine Services Pvt. Ltd. delivers marine surveys and certifications, advanced NDT, survival systems, ship design and repair, and broking services for the marine and offshore oil and gas industries.",
};

export const viewport: Viewport = {
  themeColor: "#081020",
  width: "device-width",
  initialScale: 1,
};

// every route must prerender statically; a dynamic API sneaking in fails the build
export const dynamic = "error";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* suppressHydrationWarning is scoped to each element's OWN attributes:
       browser extensions (Grammarly et al) stamp data-* attributes on <body>
       before React hydrates, and LoaderGate strips the is-loading class from
       <html> at runtime; both are expected top-level mismatches, and children
       still hydrate strictly */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${generalSans.variable} ${jetbrainsMono.variable} is-loading`}
    >
      <body suppressHydrationWarning>
        <JsonLd data={organizationLd()} />
        <noscript>
          <style>{`html.is-loading, html.is-loading body { overflow: auto !important; } [data-preloader] { display: none !important; }`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
