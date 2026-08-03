/**
 * Branded scope-of-work PDF generator: `npm run docs`.
 *
 * Renders each entry of scripts/docs.config.mjs through an inline HTML
 * template (site palette + self-hosted General Sans / JetBrains Mono) and
 * prints it to a one-page A4 PDF with Playwright Chromium. Outputs land at
 * SOURCE_ROOT/Derived/Scope Docs/<slug>.pdf, where scripts/build-certs.mjs
 * picks them up like any other certificate source.
 *
 * These documents are PUBLISHED summaries that replace confidential
 * commercial contracts on the certificates page (client decision
 * 2026-07-30): scope, methods, and outcome only; never contract values,
 * bank details, GEM references, or vessel names.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { SOURCE_ROOT } from "./assets.config.mjs";
import { scopeDocs } from "./docs.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(SOURCE_ROOT, "Derived", "Scope Docs");

const fontUrl = (p) => pathToFileURL(path.join(root, p)).href;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function docHtml(doc) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "General Sans";
    src: url("${fontUrl("public/fonts/GeneralSans-Variable.woff2")}") format("woff2");
    font-weight: 200 700;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url("${fontUrl("scripts/fonts/JetBrainsMono-Regular.woff2")}") format("woff2");
    font-weight: 400;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url("${fontUrl("scripts/fonts/JetBrainsMono-Medium.woff2")}") format("woff2");
    font-weight: 500;
  }
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 210mm; height: 297mm; }
  body {
    font-family: "General Sans", sans-serif;
    color: #304860;
    background: #ffffff;
    padding: 16mm 16mm 14mm;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .rule { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #1d5bd8; }
  .mono { font-family: "JetBrains Mono", monospace; }
  header { display: flex; justify-content: space-between; align-items: flex-start; }
  .wordmark { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; color: #082030; }
  .wordmark-sub { margin-top: 3px; font-size: 6.5px; letter-spacing: 0.24em; color: #607890; font-weight: 500; }
  .ref { text-align: right; }
  .ref-no { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; color: #1d5bd8; }
  .ref-kind { margin-top: 4px; font-size: 6.5px; letter-spacing: 0.24em; color: #607890; }
  .meta {
    margin-top: 9mm;
    display: grid;
    grid-template-columns: 1.4fr 0.8fr 0.8fr 1.2fr;
    border: 1px solid rgba(120, 176, 240, 0.45);
  }
  .meta div { padding: 3.2mm 4mm; border-right: 1px solid rgba(120, 176, 240, 0.3); }
  .meta div:last-child { border-right: none; }
  .meta .label { display: block; font-size: 6px; letter-spacing: 0.2em; color: #607890; margin-bottom: 1.6mm; }
  .meta .value { display: block; font-size: 9.5px; color: #082030; font-weight: 500; }
  .location { margin-top: 3mm; font-size: 7px; letter-spacing: 0.14em; color: #607890; }
  h1 { margin-top: 8mm; font-size: 16.5px; font-weight: 500; line-height: 1.25; letter-spacing: -0.005em; color: #082030; }
  .divider { margin-top: 4mm; height: 1px; background: rgba(120, 176, 240, 0.4); position: relative; }
  .divider::before { content: ""; position: absolute; left: 0; top: 0; width: 22mm; height: 1px; background: #1d5bd8; }
  .scope { margin-top: 6mm; }
  .scope p { font-size: 9.5px; line-height: 1.75; margin-bottom: 3.4mm; max-width: 158mm; }
  .services-head { margin-top: 4mm; font-size: 6.5px; letter-spacing: 0.22em; color: #607890; }
  .services { margin-top: 3.5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm 8mm; list-style: none; }
  .services li { font-size: 8.8px; color: #304860; padding-left: 5mm; position: relative; }
  .services li::before { content: ""; position: absolute; left: 0; top: 1.4mm; width: 1.6mm; height: 1.6mm; background: #1d5bd8; }
  footer { margin-top: auto; padding-top: 4mm; border-top: 1px solid rgba(120, 176, 240, 0.35); display: flex; justify-content: space-between; gap: 10mm; }
  footer .disclaimer { font-size: 6.3px; line-height: 1.7; letter-spacing: 0.06em; color: #8098b0; max-width: 120mm; }
  footer .site { font-size: 6.5px; letter-spacing: 0.2em; color: #607890; white-space: nowrap; }
</style></head>
<body>
  <div class="rule"></div>
  <header>
    <div>
      <div class="wordmark">SOLAS MODU</div>
      <div class="wordmark-sub mono">MARINE SERVICES PVT. LTD. &middot; MUMBAI, INDIA</div>
    </div>
    <div class="ref">
      <div class="ref-no mono">${esc(doc.docRef)}</div>
      <div class="ref-kind mono">SCOPE OF WORK SUMMARY</div>
    </div>
  </header>

  <div class="meta mono">
    <div><span class="label">CLIENT</span><span class="value">${esc(doc.client)}</span></div>
    <div><span class="label">PERIOD</span><span class="value">${esc(doc.period)}</span></div>
    <div><span class="label">STATUS</span><span class="value">${esc(doc.status)}</span></div>
    <div><span class="label">DISCIPLINE</span><span class="value">${esc(doc.discipline)}</span></div>
  </div>
  <div class="location mono">STATION &middot; ${esc(doc.location).toUpperCase()}</div>

  <h1>${esc(doc.title)}</h1>
  <div class="divider"></div>

  <div class="scope">
    ${doc.scopeParagraphs.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
  </div>

  <div class="services-head mono">SERVICES PERFORMED</div>
  <ul class="services">
    ${doc.services.map((s) => `<li>${esc(s)}</li>`).join("\n    ")}
  </ul>

  <footer>
    <div class="disclaimer mono">
      PUBLISHED SUMMARY. THE UNDERLYING COMMERCIAL AGREEMENT AND ITS TERMS ARE
      CONFIDENTIAL; ORIGINAL COMPLETION RECORDS ARE AVAILABLE FOR VERIFICATION
      ON REQUEST. SOLAS MODU MARINE SERVICES PVT. LTD.
    </div>
    <div class="site mono">SOLASMODU.NET</div>
  </footer>
</body></html>`;
}

const started = Date.now();
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const doc of scopeDocs) {
    await page.setContent(docHtml(doc), { waitUntil: "load" });
    // without this Chromium snapshots fallback glyphs into the PDF
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: path.join(OUT_DIR, `${doc.slug}.pdf`),
      format: "A4",
      printBackground: true,
    });
    console.log(`[docs] ${doc.slug}`);
  }
} finally {
  await browser.close();
}

console.log(`[docs] ${scopeDocs.length} documents in ${((Date.now() - started) / 1000).toFixed(1)}s`);
