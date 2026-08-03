/**
 * Browser verification via local Playwright (the MCP bridge is unavailable).
 * Runs against a PROD server (next start) so console assertions are not
 * poisoned by HMR noise and the production CSP applies.
 *
 * Usage: node scripts/verify-browser.mjs [baseUrl] [shotDir]
 * Defaults: http://localhost:3100, <repo>/.verify-shots
 *
 * Passes:
 *  1. matrix: 10 routes x 3 viewports, seeded short preloader, screenshots,
 *     console/pageerror/requestfailed collection, single-h1 assert
 *  2. preloader: one unseeded home load must reveal within 15s
 *  3. loop: 40s hero watch asserting >=2 crossfades (currentTime reset with
 *     an opacity ramp, poster hidden, video never paused)
 *  4. reduced-motion: no <video> on home; no in-viewport section stuck at
 *     opacity 0 after settle
 *  5. keyboard: menu ESC, gallery lightbox focus trap + ESC + focus return
 *  6. careers form: transport stubbed via page.route (never hits /api/submit or Resend),
 *     empty submit -> errors, valid submit -> stubbed request with subject
 *  7. improvement round: hero fits the initial viewport (bottom bar visible at
 *     scrollY 0), nav shows dark links + surface glass over the hero-light
 *     home hero and flips to white + ink glass over dark sections, EVERY
 *     viewport streams the single byte-identical hero.mp4 (client decision
 *     2026-07-25; the mobile encode is retired), no request for the retired
 *     hero.webm / hero-mobile.mp4, custom cursor engages on fine pointers and
 *     stays off under reduced motion
 *  8. round-3 regressions: navbar wordmark reads exactly "SOLAS MODU" and
 *     clicking it after scrolling glides back to top; the operations-log
 *     timeline line has a real background color (the /16 opacity class must
 *     generate); the TrustedBy logo marquee actually translates while in
 *     view; the service-hero instrument rail renders the LOG ENTRY fact and
 *     the SCROLL cue
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3100";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = process.argv[3] ?? path.join(root, ".verify-shots");
mkdirSync(OUT, { recursive: true });

const ROUTES = ["/", "/surveys", "/ndt", "/survival", "/shipdesign", "/broking",
  "/collaboration", "/certificates", "/gallery", "/careers", "/privacy", "/terms"];
const VIEWPORTS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "tablet", w: 834, h: 1112 },
  { name: "mobile", w: 390, h: 844 },
];

const failures = [];
const consoleLog = [];
const fail = (scope, msg) => {
  failures.push(`${scope}: ${msg}`);
  console.error(`[verify-browser] FAIL ${scope}: ${msg}`);
};
const ok = (scope, msg = "") => console.log(`[verify-browser] OK ${scope} ${msg}`);

const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  // autoplay refusals surface as caught promise noise in some builds
  /play\(\) request was interrupted/i,
  // 404s are re-checked precisely via the response listener below, which
  // exempts only the by-design /rive/ + /spline/ HEAD probes (fallback-first
  // slots probe for assets that intentionally do not ship yet)
  /Failed to load resource.*404/i,
  // headless-GPU driver chatter (ANGLE/SwiftShader performance hints emitted
  // when a WebGL canvas mounts, e.g. "GPU stall due to ReadPixels"); browser
  // internals, not application console output
  /GL Driver Message/i,
];

/** paths whose 404s are the designed fallback-probe state, not failures */
const EXPECTED_404 = [/\/rive\//, /\/spline\//];

async function newPage(browser, vp, { seed = true, reduced = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  if (seed) await ctx.addInitScript(() => sessionStorage.setItem("sm-visited", "1"));
  const page = await ctx.newPage();
  if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  page.on("console", (m) => {
    if (!["error", "warning"].includes(m.type())) return;
    if (IGNORED_CONSOLE.some((re) => re.test(m.text()))) return;
    consoleLog.push({ where: page.url(), type: m.type(), text: m.text() });
  });
  page.on("pageerror", (e) => consoleLog.push({ where: page.url(), type: "pageerror", text: e.message }));
  page.on("requestfailed", (r) => {
    // aborted requests during nav are normal; real failures matter
    if (r.failure()?.errorText === "net::ERR_ABORTED") return;
    consoleLog.push({ where: page.url(), type: "requestfailed", text: `${r.url()} ${r.failure()?.errorText}` });
  });
  page.on("response", (res) => {
    if (res.status() !== 404) return;
    const url = res.url();
    if (EXPECTED_404.some((re) => re.test(url))) return;
    consoleLog.push({ where: page.url(), type: "unexpected-404", text: url });
  });
  return { ctx, page };
}

async function settle(page, timeout = 15000) {
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("is-loading"),
    undefined,
    { timeout },
  );
  await page.waitForTimeout(800);
}

const browser = await chromium.launch();

// ---- pass 1: matrix ----
for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const { ctx, page } = await newPage(browser, vp);
    try {
      await page.goto(`${BASE}${route === "/" ? "" : route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await settle(page);
      const h1 = await page.locator("h1").count();
      if (h1 !== 1) fail(`matrix ${route}@${vp.name}`, `h1 count ${h1}`);
      const slug = route === "/" ? "home" : route.slice(1);
      await page.screenshot({ path: path.join(OUT, `${slug}-${vp.name}.png`), fullPage: true });
      ok(`matrix ${route}@${vp.name}`);
    } catch (e) {
      fail(`matrix ${route}@${vp.name}`, e instanceof Error ? e.message : String(e));
    } finally {
      await ctx.close();
    }
  }
}

// ---- pass 2: full preloader (unseeded) + the 0-100 counter contract ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0], { seed: false });
  try {
    // record every counter write before app code runs: textContent replaces
    // the text node (a childList mutation), so the observer sees each value
    // even though the loader unmounts after reveal
    await ctx.addInitScript(() => {
      window.__plCounts = [];
      // observe `document` itself: init scripts run before documentElement
      // exists, and document is already a valid Node at that point
      new MutationObserver(() => {
        const el = document.querySelector("[data-pl-count]");
        const v = el?.textContent ?? null;
        if (v !== null && v !== window.__plCounts[window.__plCounts.length - 1])
          window.__plCounts.push(v);
      }).observe(document, { subtree: true, childList: true, characterData: true });
    });
    const started = Date.now();
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page, 16000);
    const took = ((Date.now() - started) / 1000).toFixed(1);
    if (Date.now() - started > 16000) fail("preloader", `did not reveal in time (${took}s)`);
    else ok("preloader", `revealed in ${took}s`);

    // counter: animated, strictly non-decreasing, lands on exactly 100
    const counts = (await page.evaluate(() => window.__plCounts ?? []))
      .map((v) => parseInt(v, 10))
      .filter((n) => Number.isFinite(n));
    const decreasing = counts.some((n, i) => i > 0 && n < counts[i - 1]);
    if (counts.length < 10) fail("preloader-counter", `only ${counts.length} counter samples recorded`);
    else if (decreasing) fail("preloader-counter", `counter decreased: [${counts.join(",")}]`);
    else if (counts[counts.length - 1] !== 100)
      fail("preloader-counter", `terminal value ${counts[counts.length - 1]}, expected 100`);
    else ok("preloader-counter", `${counts.length} samples, monotonic, landed on 100`);
  } catch (e) {
    fail("preloader", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 3: hero loop watch (40s) ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    // sample INSIDE the page (100ms cadence) so RPC jitter can never straddle
    // the 0.6s crossfade window; a reset is any large backwards time jump
    const report = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const samples = [];
          const timer = setInterval(() => {
            samples.push(
              [...document.querySelectorAll("video")].map((v) => ({
                t: v.currentTime,
                o: Number(getComputedStyle(v).opacity),
                paused: v.paused,
              })),
            );
          }, 100);
          setTimeout(() => {
            clearInterval(timer);
            let resets = 0;
            let sawRamp = false;
            let pausedWhileVisible = 0;
            for (let i = 1; i < samples.length; i += 1) {
              for (let vi = 0; vi < samples[i].length; vi += 1) {
                const prev = samples[i - 1][vi];
                const cur = samples[i][vi];
                if (prev && cur && prev.t - cur.t > 5) resets += 1;
                if (prev && cur && cur.o > 0.15 && cur.o < 0.85 && cur.o !== prev.o)
                  sawRamp = true;
              }
              const visible = samples[i].find((v) => v.o > 0.5);
              if (visible?.paused) pausedWhileVisible += 1;
            }
            resolve({ count: samples.length, videos: samples[0]?.length ?? 0, resets, sawRamp, pausedWhileVisible });
          }, 40000);
        }),
      );
    if (report.videos === 0) {
      fail("loop", "no video elements found");
    } else {
      if (report.resets < 2) fail("loop", `only ${report.resets} loop resets observed in 40s (expected >=2)`);
      else ok("loop", `${report.resets} resets`);
      if (!report.sawRamp) fail("loop", "no opacity ramp observed around crossfade (hard-swap suspected)");
      else ok("loop", "crossfade opacity ramp observed");
      if (report.pausedWhileVisible > 5) fail("loop", `visible video paused in ${report.pausedWhileVisible} samples`);
    }
  } catch (e) {
    fail("loop", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 4: reduced motion ----
for (const route of ["/", "/ndt", "/gallery"]) {
  const { ctx, page } = await newPage(browser, VIEWPORTS[0], { reduced: true });
  try {
    await page.goto(`${BASE}${route === "/" ? "" : route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    if (route === "/") {
      const videos = await page.locator("video").count();
      if (videos !== 0) fail("reduced /", `${videos} video elements mounted (expected 0)`);
      else ok("reduced /", "poster-only hero");
    }
    const stuck = await page.evaluate(() => {
      const els = [...document.querySelectorAll("main h1, main h2, main p")];
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.top < innerHeight && r.bottom > 0 && r.height > 0;
        return inView && Number(getComputedStyle(el).opacity) === 0;
      }).length;
    });
    if (stuck > 0) fail(`reduced ${route}`, `${stuck} in-viewport text elements at opacity 0`);
    else ok(`reduced ${route}`, "nothing stuck invisible");
  } catch (e) {
    fail(`reduced ${route}`, e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 5: keyboard ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(`${BASE}/gallery`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    // tiles live inside [data-shot]; a bare "main button" would hit a filter chip
    const firstTile = page.locator("main [data-shot] button").first();
    await firstTile.scrollIntoViewIfNeeded();
    await firstTile.click();
    const dialog = page.locator("[role=dialog]");
    await dialog.waitFor({ state: "visible", timeout: 5000 });
    // focus trap: tab 12 times, focus stays inside the dialog
    let inside = true;
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      inside = await page.evaluate(() => {
        const d = document.querySelector("[role=dialog]");
        return !!d && d.contains(document.activeElement);
      });
      if (!inside) break;
    }
    if (!inside) fail("keyboard lightbox", "focus escaped the dialog");
    else ok("keyboard lightbox", "focus trapped");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 5000 });
    const focusReturned = await page.evaluate(() => document.activeElement?.tagName === "BUTTON");
    if (!focusReturned) fail("keyboard lightbox", "focus did not return to a trigger button");
    else ok("keyboard lightbox", "ESC closed + focus returned");
  } catch (e) {
    fail("keyboard", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 6: careers form (stubbed transport) ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  const stubbed = [];
  try {
    // forms POST same-origin /api/submit since round 5; the stub keeps the
    // handler (and Resend) out of the loop entirely
    await page.route("**/api/submit", async (route) => {
      stubbed.push({ url: route.request().url(), body: route.request().postData() ?? "" });
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto(`${BASE}/careers`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);

    // empty submit -> validation errors, no network
    await page.locator("button[type=submit]").click();
    await page.waitForTimeout(600);
    const alerts = await page.locator("[role=alert]").count();
    if (alerts === 0) fail("careers empty", "no validation errors rendered");
    else ok("careers empty", `${alerts} field errors`);
    if (stubbed.length > 0) fail("careers empty", "request fired despite invalid form");

    // fill valid + small file, submit (min-fill-time already elapsed)
    await page.fill('input[name="name"]', "Verification Run");
    await page.fill('input[name="email"]', "verify@example.com");
    const select = page.locator('select[name="position"]');
    if (await select.count()) await select.selectOption({ index: 1 });
    const message = page.locator('textarea[name="message"]');
    if (await message.count()) await message.fill("Automated verification message, please ignore.");
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count()) {
      await fileInput.setInputFiles({
        name: "resume.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4 verification stub"),
      });
    }
    await page.waitForTimeout(2200); // clear MIN_FILL_MS
    await page.locator("button[type=submit]").click();
    await page.waitForTimeout(1500);
    // subjects moved server-side with the Resend migration: the client
    // payload now carries the kind discriminator + fields + the resume part
    const body = stubbed[0]?.body ?? "";
    if (stubbed.length === 0) {
      fail("careers submit", "no request reached the stubbed transport");
    } else if (!body.includes('name="kind"') || !body.includes("application")) {
      fail("careers submit", "kind=application missing from the multipart payload");
    } else if (!body.includes("verify@example.com") || !body.includes('filename="resume.pdf"')) {
      fail("careers submit", "fields or resume part missing from the multipart payload");
    } else {
      ok("careers submit", "multipart payload carried kind=application + fields + resume");
    }
  } catch (e) {
    fail("careers", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 6b: /api/submit handler direct probes (no browser, no Resend) ----
// LOCALHOST ONLY: against a deployed target with RESEND_API_KEY configured,
// the valid-payload probe would relay a REAL email to the client's inbox and
// burn the 100/day cap. Note the two requests per run also count toward the
// handler's 5-per-10-min rate limit, so rapid dev loops can 429 themselves.
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(BASE)) {
  ok("api probes", "skipped (non-local target; live probes would send real email)");
} else {
  try {
    // honeypot: filled hidden field -> fake success, nothing relayed
    const honey = new FormData();
    honey.append("kind", "inquiry");
    honey.append("_honey", "bot-was-here");
    const honeyRes = await fetch(`${BASE}/api/submit`, { method: "POST", body: honey });
    const honeyJson = await honeyRes.json().catch(() => null);
    if (honeyRes.status !== 200 || honeyJson?.ok !== true)
      fail("api honeypot", `expected 200 {ok:true}, got ${honeyRes.status} ${JSON.stringify(honeyJson)}`);
    else ok("api honeypot", "fake success returned, nothing sent");

    // unconfigured: next start runs without RESEND_API_KEY locally, so a
    // valid submission must degrade to 503 unconfigured (mailto fallback path)
    const valid = new FormData();
    valid.append("kind", "inquiry");
    valid.append("name", "Verification Run");
    valid.append("email", "verify@example.com");
    valid.append("message", "Automated verification message, please ignore.");
    const validRes = await fetch(`${BASE}/api/submit`, { method: "POST", body: valid });
    const validJson = await validRes.json().catch(() => null);
    if (process.env.RESEND_API_KEY) {
      ok("api unconfigured", "skipped (RESEND_API_KEY present in this environment)");
    } else if (validRes.status !== 503 || validJson?.reason !== "unconfigured") {
      fail("api unconfigured", `expected 503 unconfigured, got ${validRes.status} ${JSON.stringify(validJson)}`);
    } else {
      ok("api unconfigured", "503 unconfigured without RESEND_API_KEY");
    }
  } catch (e) {
    fail("api submit", e instanceof Error ? e.message : String(e));
  }
}

// ---- pass 7: improvement round (hero fit, nav theme, webm gone, cursor) ----
for (const vp of [VIEWPORTS[0], VIEWPORTS[2]]) {
  const { ctx, page } = await newPage(browser, vp);
  const requested = [];
  try {
    page.on("request", (r) => requested.push(r.url()));
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);

    // hero fills exactly one viewport; the instrument bar is visible unscrolled
    const fit = await page.evaluate(() => {
      const hero = document.querySelector("main section");
      const bar = document.querySelector("[data-hero-bar]");
      return {
        heroBottom: hero?.getBoundingClientRect().bottom ?? -1,
        barBottom: bar?.getBoundingClientRect().bottom ?? -1,
        vh: innerHeight,
      };
    });
    if (fit.barBottom < 0) fail(`fit@${vp.name}`, "hero bottom bar not found");
    else if (Math.abs(fit.heroBottom - fit.vh) > 2 || fit.barBottom > fit.vh + 1)
      fail(`fit@${vp.name}`, `heroBottom=${fit.heroBottom.toFixed(1)} barBottom=${fit.barBottom.toFixed(1)} vh=${fit.vh}`);
    else ok(`fit@${vp.name}`, "hero + bottom bar inside the initial viewport");

    if (requested.some((u) => u.includes("hero.webm") || u.includes("hero-mobile.mp4")))
      fail(`webm@${vp.name}`, "a retired hero encode (webm / mobile) was requested");
    else ok(`webm@${vp.name}`, "no retired encode requested");
    // quality guarantee v2 (client decision 2026-07-25): ONE byte-identical
    // source for every device; any viewport streaming anything but hero.mp4
    // is a regression
    const src = await page.evaluate(() => document.querySelector("video")?.currentSrc ?? "");
    if (!/\/hero\.mp4$/.test(src))
      fail(`src@${vp.name}`, `expected the single hero.mp4 source, got ${src}`);
    else ok(`src@${vp.name}`, "byte-identical hero.mp4 confirmed");
  } catch (e) {
    fail(`fit@${vp.name}`, e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const linkSel = "header nav a";
    const colorAt = () =>
      page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).color : "";
      }, linkSel);

    // the home hero is now hero-light: dark links + surface glass at the top
    const heroColor = await colorAt();
    const heroBg = await page.evaluate(() => getComputedStyle(document.querySelector("header")).backgroundColor);
    // active links render navy (8,32,48), inactive slate (48,72,96); both are the dark state
    if (!/48, 72, 96|8, 32, 48/.test(heroColor)) fail("nav-theme", `expected dark link over hero-light, got ${heroColor}`);
    else if (!/240, 240, 248/.test(heroBg)) fail("nav-theme", `expected surface bar over hero-light, got ${heroBg}`);
    else ok("nav-theme", "hero-light bar verified at top");

    // scroll into the dark services band (untagged -> dark default) and expect white links + ink glass
    await page.evaluate(() => {
      const dark = document.getElementById("services");
      if (dark) window.scrollTo(0, dark.getBoundingClientRect().top + scrollY + 200);
    });
    await page.waitForTimeout(1500);
    const darkColor = await colorAt();
    const darkBg = await page.evaluate(() => getComputedStyle(document.querySelector("header")).backgroundColor);
    if (!/255, 255, 255/.test(darkColor)) fail("nav-theme", `expected white link over dark section, got ${darkColor}`);
    else if (!/8, 16, 32/.test(darkBg)) fail("nav-theme", `expected ink header bg over dark section, got ${darkBg}`);
    else ok("nav-theme", "dark flip verified");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const backColor = await colorAt();
    if (!/48, 72, 96|8, 32, 48/.test(backColor)) fail("nav-theme", `did not return to dark links at top, got ${backColor}`);
    else ok("nav-theme", "returned to hero-light at top");
  } catch (e) {
    fail("nav-theme", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    await page.mouse.move(700, 400);
    await page.mouse.move(720, 420);
    await page.waitForTimeout(500);
    const engaged = await page.evaluate(() => ({
      cls: document.documentElement.classList.contains("has-custom-cursor"),
      bodyCursor: getComputedStyle(document.body).cursor,
    }));
    if (!engaged.cls) fail("cursor", "has-custom-cursor class missing after pointer move");
    else if (engaged.bodyCursor !== "none") fail("cursor", `native cursor still ${engaged.bodyCursor}`);
    else ok("cursor", "custom cursor engaged, native cursor hidden");
  } catch (e) {
    fail("cursor", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0], { reduced: true });
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    await page.mouse.move(700, 400);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => document.documentElement.classList.contains("has-custom-cursor"));
    if (cls) fail("cursor reduced", "custom cursor engaged under reduced motion");
    else ok("cursor reduced", "custom cursor stays off");
  } catch (e) {
    fail("cursor reduced", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 8: round-3 regressions (wordmark, timeline line, marquee, fact rail) ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);

    // navbar wordmark reads exactly "SOLAS MODU" (secondary line removed)
    const wordmark = await page.evaluate(() =>
      (document.querySelector("header a[aria-label]")?.textContent ?? "").trim(),
    );
    if (wordmark !== "SOLAS MODU") fail("wordmark", `expected "SOLAS MODU", got "${wordmark}"`);
    else ok("wordmark", "navbar brand is the bare wordmark");

    // the /16 opacity step must generate: the timeline hairline carries a real
    // background color (production shipped it transparent before round 3)
    const lineBg = await page.evaluate(() => {
      const line = document.querySelector("[data-timeline-line]");
      return line ? getComputedStyle(line).backgroundColor : "";
    });
    if (!lineBg || lineBg === "rgba(0, 0, 0, 0)")
      fail("timeline-line", `computed background is ${lineBg || "missing"} (opacity /16 class not generating?)`);
    else ok("timeline-line", `hairline background ${lineBg}`);

    // TrustedBy logo marquee must actually translate while in view, AND must
    // survive a wheel tick fired between samples: the round-1..3 freeze was a
    // GSAP scroll-skew tween with overwrite: true killing the loop tween on
    // the user's first scroll, which a scroll-free probe can never catch.
    // The mouse stays at (0,0) so the hover-pause state never engages.
    await page.evaluate(() => {
      document.querySelector('img[src*="clients/"]')?.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(2000);
    const x1 = await page.evaluate(
      () => document.querySelector('img[src*="clients/"]')?.getBoundingClientRect().x ?? null,
    );
    await page.waitForTimeout(1500);
    const x2 = await page.evaluate(
      () => document.querySelector('img[src*="clients/"]')?.getBoundingClientRect().x ?? null,
    );
    if (x1 === null || x2 === null) fail("marquee", "no client logo found");
    else if (Math.abs(x1 - x2) < 1) fail("marquee", `logo track frozen at x=${x1.toFixed(1)}`);
    else ok("marquee", `track moving (${(x2 - x1).toFixed(1)}px over 1.5s)`);

    // the killer scenario: one wheel tick down and back while the strip is in
    // view, then sample again after the old skew tween would have settled
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(1800);
    const x3 = await page.evaluate(
      () => document.querySelector('img[src*="clients/"]')?.getBoundingClientRect().x ?? null,
    );
    await page.waitForTimeout(1500);
    const x4 = await page.evaluate(
      () => document.querySelector('img[src*="clients/"]')?.getBoundingClientRect().x ?? null,
    );
    if (x3 === null || x4 === null) fail("marquee-wheel", "client logo lost after wheel tick");
    else if (Math.abs(x3 - x4) < 1)
      fail("marquee-wheel", `track frozen at x=${x3.toFixed(1)} after a wheel tick (the 3-round killer)`);
    else ok("marquee-wheel", `track still moving after wheel tick (${(x4 - x3).toFixed(1)}px over 1.5s)`);

    // wordmark click after scrolling glides back to top (same-route scroll)
    await page.evaluate(() => window.scrollBy(0, -200)); // scroll up so the auto-hiding bar returns
    await page.waitForTimeout(700);
    await page.locator("header a[aria-label]").click();
    await page.waitForTimeout(2000);
    const backToTop = await page.evaluate(() => window.scrollY);
    if (backToTop > 60) fail("wordmark-scroll", `still at scrollY=${backToTop} after wordmark click`);
    else ok("wordmark-scroll", "wordmark click returned to top");
  } catch (e) {
    fail("round3", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    await page.goto(`${BASE}/surveys`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const rail = await page.evaluate(() => {
      const hero = document.querySelector("main section");
      const text = hero?.textContent ?? "";
      return {
        hasLabel: text.includes("LOG ENTRY"),
        hasFact: /80 percent/.test(text), // sr-only real text is always present
        hasCue: text.includes("SCROLL"),
      };
    });
    if (!rail.hasLabel) fail("fact-rail", "LOG ENTRY label missing from the surveys hero");
    else if (!rail.hasFact) fail("fact-rail", "verified fact text missing from the surveys hero");
    else if (!rail.hasCue) fail("fact-rail", "SCROLL cue missing from the surveys hero");
    else ok("fact-rail", "LOG ENTRY fact + SCROLL cue present on /surveys");
  } catch (e) {
    fail("fact-rail", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

// ---- pass 9: round-4 regressions (favicon, footer AIS, EmergencyStrip,
//      globe labels, certificate modal, gallery re-tile, careers backdrop) ----
{
  const { ctx, page } = await newPage(browser, VIEWPORTS[0]);
  try {
    // favicon: the S-monogram SVG must be THE icon link (icon.png retired)
    await page.goto(`${BASE}/privacy`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const iconHref = await page.evaluate(
      () => document.querySelector('link[rel="icon"]')?.getAttribute("href") ?? "",
    );
    if (!iconHref.includes("icon.svg")) fail("favicon", `rel=icon points at "${iconHref}", expected icon.svg`);
    else ok("favicon", "icon.svg is the favicon link");

    // footer AIS line must RESOLVE at the page bottom (it rendered as a
    // blank space sitewide before the "top bottom" trigger fix)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    const ais = await page.evaluate(() => {
      const targets = document.querySelectorAll("footer [data-decode-target]");
      return (targets[0]?.textContent ?? "").trim();
    });
    if (!ais.includes("LAT")) fail("footer-ais", `footer AIS line did not resolve (got "${ais}")`);
    else ok("footer-ais", `footer AIS resolved: "${ais.slice(0, 40)}..."`);

    // EmergencyStrip on every page (was deliberately absent on five routes)
    for (const route of ["/careers", "/gallery", "/certificates", "/privacy", "/terms"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await settle(page);
      const hasStrip = await page.evaluate(
        () => !!document.querySelector('[class*="bg-flare"]'),
      );
      if (!hasStrip) fail("emergency-strip", `no EmergencyStrip on ${route}`);
      else ok("emergency-strip", `strip present on ${route}`);
    }

    // gallery: 58 frames since the round-5 archive prepends, and the
    // understated imagery disclaimer renders in the hero
    await page.goto(`${BASE}/gallery`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const gallery = await page.evaluate(() => document.body.textContent ?? "");
    if (!gallery.includes("58 FRAMES")) fail("gallery", "expected the 58 FRAMES readout after the prepends");
    else ok("gallery", "58 frames in the deck log");
    if (!gallery.includes("enhanced with external tools and AI"))
      fail("gallery-note", "imagery disclaimer missing from the gallery hero");
    else ok("gallery-note", "imagery disclaimer present");

    // collaboration globe legend: geographic labels only, eight stations.
    // Scoped to the [data-station] rows: the proof band elsewhere on the page
    // legitimately cites the Zanzibar/SKANReg certificate issuers by name.
    await page.goto(`${BASE}/collaboration`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const legend = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-station]"))
        .map((el) => el.textContent ?? "")
        .join(" | "),
    );
    const stationCount = legend ? legend.split(" | ").length : 0;
    if (legend.includes("Maritime Authority") || legend.includes("Registry"))
      fail("globe-legend", "organisation names still present in the globe legend");
    else if (stationCount !== 8)
      fail("globe-legend", `expected 8 legend stations, found ${stationCount}`);
    else if (!legend.includes("Basseterre") || !legend.includes("Uran, Maharashtra") || !legend.includes("Thoothukudi"))
      fail("globe-legend", "expected geographic station labels missing");
    else ok("globe-legend", "eight geographic stations, no organisation names");

    // certificates: the new ABS approval leads the ledger and opens a modal image
    await page.goto(`${BASE}/certificates`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const certText = await page.evaluate(() => document.body.textContent ?? "");
    if (!certText.includes("Recognized Service Supplier, Nondestructive Inspection"))
      fail("certificates", "new ABS NDT approval missing from the ledger");
    else ok("certificates", "current ABS/IRS approvals lead the ledger");
    const opened = await page.evaluate(async () => {
      const row = Array.from(document.querySelectorAll("button")).find((b) =>
        (b.textContent ?? "").includes("Recognized Service Supplier, Nondestructive Inspection"),
      );
      if (!row) return "no-row-button";
      row.click();
      await new Promise((r) => setTimeout(r, 1200));
      const img = Array.from(document.querySelectorAll("img")).find((i) =>
        i.currentSrc.includes("/images/certs/"),
      );
      return img ? "modal-image" : "no-image";
    });
    if (opened !== "modal-image") fail("cert-modal", `viewer modal did not show a certs raster (${opened})`);
    else ok("cert-modal", "certificate opens in the viewer modal with a page-1 raster");

    // careers: the application band carries the animated backdrop layer
    await page.goto(`${BASE}/careers`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const hasBackdrop = await page.evaluate(() => !!document.querySelector("#apply svg"));
    if (!hasBackdrop) fail("careers-backdrop", "no backdrop device inside #apply");
    else ok("careers-backdrop", "careers form backdrop mounted");
  } catch (e) {
    fail("round4", e instanceof Error ? e.message : String(e));
  } finally {
    await ctx.close();
  }
}

await browser.close();

if (consoleLog.length > 0) {
  console.error(`[verify-browser] ${consoleLog.length} console finding(s):`);
  for (const c of consoleLog.slice(0, 30)) console.error(`  [${c.type}] ${c.where} :: ${c.text}`);
  failures.push(`${consoleLog.length} console findings`);
}

if (failures.length > 0) {
  console.error(`[verify-browser] ${failures.length} failure group(s)`);
  process.exit(1);
}
console.log(`[verify-browser] all passes green; screenshots in ${OUT}`);
