/**
 * Security headers, also mirrored in `public/_headers` for Cloudflare Pages.
 * CSP uses 'unsafe-inline' because the current static build has no per-request
 * nonce (Next injects inline bootstrap scripts and next/font injects inline
 * styles). Tightening to nonce-based CSP is a future step that needs SSR
 * middleware. Do not remove entries without checking the site still renders.
 */
// Next.js dev mode relies on eval (HMR runtime, dev source maps) and a websocket,
// which a strict CSP blocks. Relax those in development only; the production CSP
// below is unchanged (no 'unsafe-eval', no ws:, keeps upgrade-insecure-requests).
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'wasm-unsafe-eval' is required by the self-hosted Rive/Spline runtimes
      `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // blob: lets the hero share one fetched encode between its two <video> elements
      "media-src 'self' blob:",
      "font-src 'self'",
      // forms POST to the same-origin /api/submit route since round 5; the
      // Resend relay is server-to-server and never appears in browser CSP
      `connect-src 'self'${isDev ? " ws:" : ""}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // no dev-tools badge overlay, even in dev preview sessions (client request)
  devIndicators: false,
  // hide implementation details from the public surface
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // deploy-agnostic: images are pre-optimized at build time by scripts/build-assets.mjs
  // (avif/webp variants served via components/ui/Pic), never by a host image optimizer
  images: { unoptimized: true },
  compiler: {
    // strip console.* in production (keep console.error) to reduce info leakage
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
