import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const ROUTES = [
  "/",
  "/surveys",
  "/ndt",
  "/survival",
  "/shipdesign",
  "/broking",
  "/collaboration",
  "/certificates",
  "/gallery",
  "/careers",
  "/privacy",
  "/terms",
] as const;

/** Footer-only legal routes carry the lowest crawl priority. */
const LEGAL_ROUTES: readonly string[] = ["/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority:
      path === "/"
        ? 1
        : LEGAL_ROUTES.includes(path)
          ? 0.3
          : path.startsWith("/certificates")
            ? 0.6
            : 0.8,
  }));
}
