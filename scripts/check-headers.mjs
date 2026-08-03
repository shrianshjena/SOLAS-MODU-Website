/**
 * Pre-build sanity check: the production security headers exist in BOTH
 * next.config.mjs and public/_headers (the static-host mirror), and the two
 * Content-Security-Policy values have not drifted apart.
 *
 * Deploy-agnostic rule: any CSP change must be made in both files.
 * next.config.mjs computes its CSP from a directive array, so this script
 * compares directive sets rather than raw strings.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function fail(message) {
  console.error(`[check-headers] ${message}`);
  process.exit(1);
}

function parseCsp(value) {
  return new Set(
    value
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean),
  );
}

const headersFile = await readFile(path.join(root, "public", "_headers"), "utf8").catch(() =>
  fail("public/_headers is missing"),
);

const cspLine = headersFile
  .split(/\r?\n/)
  .map((l) => l.trim())
  .find((l) => l.startsWith("Content-Security-Policy:"));
if (!cspLine) fail("public/_headers has no Content-Security-Policy line");
const mirrorCsp = parseCsp(cspLine.slice("Content-Security-Policy:".length));

// Recover the production CSP from next.config.mjs source: the config builds it
// from a directive array with dev-only branches (isDev interpolations), so we
// parse the array and keep only the production entries.
const configSource = await readFile(path.join(root, "next.config.mjs"), "utf8").catch(() =>
  fail("next.config.mjs is missing"),
);
const arrayMatch = configSource.match(/value:\s*\[((?:.|\r?\n)*?)\]\.join\("; "\)/);
if (!arrayMatch) fail("could not locate the CSP directive array in next.config.mjs");

const prodCsp = new Set();
for (const rawLine of arrayMatch[1].split(/\r?\n/)) {
  const line = rawLine.trim().replace(/,$/, "");
  if (!line || line.startsWith("//")) continue;
  // spread of prod-only entries: ...(isDev ? [] : ["upgrade-insecure-requests"])
  const spread = line.match(/^\.\.\.\(isDev \? \[\] : \[(.*)\]\)$/);
  if (spread) {
    for (const entry of spread[1].split(",")) {
      const cleaned = entry.trim().replace(/^["'`]|["'`]$/g, "");
      if (cleaned) prodCsp.add(cleaned);
    }
    continue;
  }
  const literal = line.match(/^["'`](.*)["'`]$/);
  if (!literal) continue;
  const value = literal[1]
    // template interpolations are dev-only additions; production drops them
    .replace(/\$\{[^}]*\}/g, "")
    .trim();
  if (value) prodCsp.add(value);
}

const missingInMirror = [...prodCsp].filter((d) => !mirrorCsp.has(d));
const extraInMirror = [...mirrorCsp].filter((d) => !prodCsp.has(d));

if (missingInMirror.length || extraInMirror.length) {
  if (missingInMirror.length)
    console.error(`[check-headers] in next.config.mjs but not _headers: ${missingInMirror.join(" | ")}`);
  if (extraInMirror.length)
    console.error(`[check-headers] in _headers but not next.config.mjs: ${extraInMirror.join(" | ")}`);
  fail("CSP drift between next.config.mjs and public/_headers");
}

console.log(`[check-headers] OK: ${prodCsp.size} CSP directives match across both files`);
