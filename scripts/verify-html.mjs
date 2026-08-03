/**
 * SSR/HTML verification: fetches every route from a running server and asserts
 * status, single h1, canonical link, per-route marker strings, and parseable
 * JSON-LD blocks. Usage: node scripts/verify-html.mjs [baseUrl]
 * (default http://localhost:3100, the prod-mode verification server).
 */
const BASE = process.argv[2] ?? "http://localhost:3100";

const ROUTES = [
  // home asserts both the brand-stack H1 text and the #contact anchor target
  { path: "/", marker: "Private Limited", markers: ["id=\"contact\""], ldMin: 1 },
  // service routes also assert their hero LOG ENTRY fact (sr-only real text)
  { path: "/surveys", marker: "Surveys", markers: ["80 percent"], ldMin: 1 },
  { path: "/ndt", marker: "Advanced NDT", markers: ["5,900 metres"], ldMin: 1 },
  { path: "/survival", marker: "Survival Systems", markers: ["1914"], ldMin: 1 },
  // shipdesign: <title> carries "Ship & Boat Design" since round 4 (never "and Repair")
  { path: "/shipdesign", marker: "Ship &amp; Boat Design", markers: ["24,000 containers"], ldMin: 1 },
  { path: "/broking", marker: "Broking", markers: ["1744"], ldMin: 1 },
  // collaboration: round-4 globe legend is geographic (no organisation names)
  {
    path: "/collaboration",
    marker: "Partnerships",
    markers: ["116,000 vessels", "Basseterre", "Uran, Maharashtra"],
    ldMin: 1,
  },
  // certificates: round-4 ledger leads with the current ABS/IRS approvals
  {
    path: "/certificates",
    marker: "Certificates",
    markers: ["Recognized Service Supplier, Nondestructive Inspection", "Royal Assessments"],
    ldMin: 1,
  },
  { path: "/gallery", marker: "Gallery", ldMin: 1 },
  { path: "/careers", marker: "Join", ldMin: 1 },
  { path: "/privacy", marker: "Privacy", ldMin: 1 },
  { path: "/terms", marker: "Terms", ldMin: 1 },
];

let failures = 0;
const fail = (route, msg) => {
  failures += 1;
  console.error(`[verify-html] FAIL ${route}: ${msg}`);
};

for (const { path, marker, markers = [], ldMin } of ROUTES) {
  const url = `${BASE}${path === "/" ? "" : path}`;
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    fail(path, `fetch error: ${e instanceof Error ? e.message : e}`);
    continue;
  }
  if (res.status !== 200) {
    fail(path, `status ${res.status}`);
    continue;
  }
  const html = await res.text();

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(path, `h1 count ${h1Count} (expected 1)`);

  for (const m of [marker, ...markers]) {
    if (!html.includes(m)) fail(path, `marker "${m}" missing`);
  }

  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  if (!canonical) fail(path, "canonical link missing");

  const ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
  if (ldBlocks.length < ldMin) fail(path, `json-ld blocks ${ldBlocks.length} < ${ldMin}`);
  for (const block of ldBlocks) {
    const body = block.replace(/<script[^>]*>/, "").replace("</script>", "");
    try {
      JSON.parse(body);
    } catch {
      fail(path, "json-ld block failed to parse");
    }
  }

  if (html.includes('href="/contact"')) fail(path, "regression: link to nonexistent /contact");

  console.log(`[verify-html] OK ${path} (h1=1, ld=${ldBlocks.length})`);
}

// sitemap + robots
for (const extra of ["/sitemap.xml", "/robots.txt"]) {
  const res = await fetch(`${BASE}${extra}`).catch(() => null);
  if (!res || res.status !== 200) fail(extra, `status ${res ? res.status : "unreachable"}`);
  else console.log(`[verify-html] OK ${extra}`);
}

if (failures > 0) {
  console.error(`[verify-html] ${failures} failure(s)`);
  process.exit(1);
}
console.log("[verify-html] all checks passed");
