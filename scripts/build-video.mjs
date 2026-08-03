/**
 * Hero video encode pipeline (ffmpeg must be on PATH).
 * Source: "SOLAS MODU Hero Animation 2.0.mp4" at the repo root
 * (15.04s, 1936x1068, 24fps, H.264 16.2Mbps, no audio).
 *
 * Outputs to public/video/:
 *   hero.mp4        STREAM COPY remux, zero re-encode (~30 MB; client decisions
 *                   2026-07-19 + 2026-07-25: original quality over transfer
 *                   size, and ONE byte-identical source for every device; the
 *                   960w mobile encode is retired, do not reintroduce it)
 *   hero-poster.jpg / hero-poster.webp  first frame (must match loop start)
 *
 * The 0.6s crossfade loop is implemented in-component (HeroLoopVideo); these
 * outputs only need faststart and a clean cut. `--baked-loop` can produce
 * hero-baked-loop.mp4 (xfade of tail over head, 14.44s) as a QA escape hatch;
 * it is not shipped (nothing loads it at runtime).
 */
import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "SOLAS MODU Hero Animation 2.0.mp4");
const outDir = path.join(root, "public", "video");

const DURATION = 15.04;
const CROSS = 0.6;
const LOOP_AT = DURATION - CROSS; // 14.44

async function ffmpeg(args, label) {
  console.log(`[video] ${label}...`);
  const started = Date.now();
  await run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], {
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });
  console.log(`[video] ${label} done in ${((Date.now() - started) / 1000).toFixed(0)}s`);
}

async function report(file) {
  const s = await stat(path.join(outDir, file));
  console.log(`[video]   ${file}: ${(s.size / 1024 / 1024).toFixed(2)} MB`);
  // Cloudflare Pages rejects files over 25 MiB; see MEMORY.md before hosting
  if (s.size > 25 * 1024 * 1024) {
    console.warn(`[video]   WARNING: ${file} exceeds the 25 MiB Cloudflare Pages file limit`);
  }
}

await stat(src);
await mkdir(outDir, { recursive: true });

await ffmpeg(
  ["-i", src, "-an", "-c", "copy", "-movflags", "+faststart",
    path.join(outDir, "hero.mp4")],
  "desktop mp4 (stream copy remux)",
);
await report("hero.mp4");

await ffmpeg(
  ["-i", src, "-frames:v", "1", "-q:v", "3", path.join(outDir, "hero-poster.jpg")],
  "poster jpg",
);
await ffmpeg(
  ["-i", src, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82",
    path.join(outDir, "hero-poster.webp")],
  "poster webp",
);
await report("hero-poster.jpg");

if (process.argv.includes("--baked-loop")) {
  await ffmpeg(
    ["-i", src, "-i", src, "-filter_complex",
      `[0:v]trim=0:${LOOP_AT},setpts=PTS-STARTPTS[main];` +
      `[1:v]trim=${LOOP_AT}:${DURATION},setpts=PTS-STARTPTS[tail];` +
      `[tail][main]xfade=transition=fade:duration=${CROSS}:offset=0,` +
      `format=yuv420p[v]`,
      "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
      "-movflags", "+faststart",
      path.join(outDir, "hero-baked-loop.mp4")],
    "baked seamless loop (fallback asset)",
  );
  await report("hero-baked-loop.mp4");
}

console.log("[video] all encodes complete");
