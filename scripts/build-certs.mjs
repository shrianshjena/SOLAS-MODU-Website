/**
 * Certificate document pipeline: `npm run certs`.
 *
 * For every entry in scripts/certs.config.mjs:
 *  1. resolve the source PDF (SOURCE_ROOT, or public/certs for legacy files);
 *  2. when firstPageOnly: extract page 1 with pdf-lib (pure JS) so trailing
 *     pages (contract terms, registration annexures) never ship;
 *  3. copy/write the PDF to public/certs/<slug>.pdf unless copy: false;
 *  4. rasterize page 1 with mupdf (WASM, no native deps) to a ~2000px-wide
 *     PNG master at SOURCE_ROOT/Derived/Cert Pages/<slug>.png, which
 *     scripts/assets.config.mjs feeds through the image pipeline as
 *     ImageKey `cert-<slug>` (so every document opens in the viewer modal).
 *
 * Run order when sources change: npm run docs -> npm run certs ->
 * npm run assets -> npm run build. Outputs are committed like every other
 * generated asset.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as mupdf from "mupdf";
import { PDFDocument } from "pdf-lib";
import { SOURCE_ROOT } from "./assets.config.mjs";
import { certDocuments } from "./certs.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CERTS_DIR = path.join(root, "public", "certs");
const RASTER_DIR = path.join(SOURCE_ROOT, "Derived", "Cert Pages");
/** page-1 raster master width; the pipeline re-encodes down to 640/1600 */
const RASTER_WIDTH = 2000;

function resolveSrc(doc) {
  return doc.fromRepo ? path.join(CERTS_DIR, doc.src) : path.join(SOURCE_ROOT, doc.src);
}

async function extractFirstPage(bytes) {
  const src = await PDFDocument.load(bytes);
  if (src.getPageCount() <= 1) return bytes;
  const out = await PDFDocument.create();
  const [page] = await out.copyPages(src, [0]);
  out.addPage(page);
  return Buffer.from(await out.save());
}

function rasterFirstPage(bytes) {
  const doc = mupdf.Document.openDocument(bytes, "application/pdf");
  try {
    const page = doc.loadPage(0);
    const [x0, , x1] = page.getBounds();
    const zoom = RASTER_WIDTH / (x1 - x0);
    const pixmap = page.toPixmap(mupdf.Matrix.scale(zoom, zoom), mupdf.ColorSpace.DeviceRGB, false);
    const png = pixmap.asPNG();
    pixmap.destroy();
    return Buffer.from(png);
  } finally {
    doc.destroy();
  }
}

const started = Date.now();
await mkdir(CERTS_DIR, { recursive: true });
await mkdir(RASTER_DIR, { recursive: true });

for (const doc of certDocuments) {
  const srcPath = resolveSrc(doc);
  let bytes = await readFile(srcPath); // fails fast on a stale manifest path
  if (doc.firstPageOnly) bytes = await extractFirstPage(bytes);

  const publishPdf = doc.copy !== false || doc.firstPageOnly;
  if (publishPdf) await writeFile(path.join(CERTS_DIR, `${doc.slug}.pdf`), bytes);

  if (doc.raster !== false) {
    await writeFile(path.join(RASTER_DIR, `${doc.slug}.png`), rasterFirstPage(bytes));
  }
  console.log(
    `[certs] ${doc.slug}${doc.firstPageOnly ? " (page 1 only)" : ""}${doc.raster === false ? "" : " +raster"}`,
  );
}

console.log(`[certs] ${certDocuments.length} documents in ${((Date.now() - started) / 1000).toFixed(1)}s`);
