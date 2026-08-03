"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { registerGsap, gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { delay, fontsReady, imagesReady } from "@/lib/assetLoading";
import { getHeroProgress, heroReady } from "@/lib/heroReadiness";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { site } from "@/content/site";

const VISITED_KEY = "sm-visited";
const FULL_MS = 7000;
const SHORT_MS = 2500;
const SECTORS = 24;

/** deterministic PRNG so SSR and client render identical ping fields */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Ping {
  x: number;
  y: number;
  sector: number;
  pass1: boolean;
}

/** point cloud of a semi-submersible rig: pontoons, columns, deck, derrick */
function buildRig(): Ping[] {
  const rand = mulberry32(19_2072); // LAT/LON seed
  const pings: Ping[] = [];
  const boxes: Array<[number, number, number, number, number]> = [
    // x, y, w, h, count
    [58, 128, 84, 8, 60], // lower pontoon
    [66, 112, 10, 18, 16], // columns
    [90, 112, 10, 18, 16],
    [114, 112, 10, 18, 16],
    [58, 92, 88, 20, 90], // deck box
    [88, 60, 26, 32, 40], // derrick body (narrowing handled below)
  ];
  for (const [bx, by, bw, bh, count] of boxes) {
    for (let i = 0; i < count; i += 1) {
      let x = bx + rand() * bw;
      const y = by + rand() * bh;
      // taper the derrick toward the top
      if (by === 60) {
        const t = (y - 60) / 32;
        const half = 3 + t * 10;
        x = 101 + (rand() * 2 - 1) * half;
      }
      const angle = ((Math.atan2(y - 100, x - 100) * 180) / Math.PI + 450) % 360;
      pings.push({ x, y, sector: Math.floor(angle / (360 / SECTORS)), pass1: rand() < 0.34 });
    }
  }
  return pings;
}

/**
 * "Sonar Acquisition" preloader. Full ~7s sequence on the first hard load of
 * the session, ~2.5s on repeats (sessionStorage), gated on real asset
 * readiness (fonts, poster, hero feed), every promise timeout-raced so the
 * site can never stay locked. Exits through an iris (a growing mask hole)
 * onto the already-playing hero. Reduced motion: static instrument, brief
 * hold, fade.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [done, setDone] = useState(false);
  const { reveal } = useLoaderGate();
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  // frozen at first render: the loader is a run-once overlay whose effect
  // captures isHome once, and a browser back/forward during the preload
  // window must not remove/recreate the counter node under its driver
  const [counterHome] = useState(isHome);
  const pings = useMemo(buildRig, []);

  useEffect(() => {
    // run-once guard: StrictMode double-invokes effects in dev; reverting a
    // mid-flight timeline on the synthetic unmount would freeze the loader
    if (startedRef.current) return;
    startedRef.current = true;
    registerGsap();

    const root = rootRef.current;
    if (!root) {
      reveal();
      setDone(true);
      return;
    }

    // counter driver handle: assigned after the gate promises exist; nulled
    // declaration keeps the reduced-motion branch (which returns early) safe
    let counterTick: (() => void) | null = null;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (counterTick) gsap.ticker.remove(counterTick); // driver never outlives the loader
      reveal();
      setDone(true);
    };

    if (reduced) {
      // static instrument, brief hold, fade; the counter shows its final
      // state immediately (no driver, no tween)
      const count = root.querySelector<HTMLElement>("[data-pl-count]");
      if (count) count.textContent = "100";
      const gate = Promise.all([fontsReady(3000), delay(1200)]).catch(() => undefined);
      gate.then(() => {
        gsap.to(root, { opacity: 0, duration: 0.5, ease: EASE.soft, onComplete: finish });
      });
      return;
    }

    let short = false;
    try {
      short = sessionStorage.getItem(VISITED_KEY) === "1";
      sessionStorage.setItem(VISITED_KEY, "1");
    } catch {
      /* storage unavailable: treat as first visit */
    }
    // the full cinematic sequence is reserved for the landing page; subpage
    // hard-loads and repeat visits get the compressed acquisition
    const minMs = short || !isHome ? SHORT_MS : FULL_MS;
    const scale = minMs / FULL_MS;

    const q = (sel: string) => root.querySelectorAll(sel);
    const one = (sel: string) => root.querySelector(sel) as HTMLElement | null;

    // --- status rows tied to real promises (timeout-raced) ---
    const setStatus = (key: string, ok: boolean) => {
      const el = one(`[data-status="${key}"]`);
      if (el) el.textContent = ok ? "OK" : "···";
    };
    const fonts = fontsReady(4000).then(() => setStatus("fonts", true));
    const imagery = imagesReady([site.heroVideo.poster], 4000).then(() =>
      setStatus("imagery", true),
    );
    // 28s cap: the single full-quality hero source (~30 MB) must genuinely be
    // waited for on slow links (client decision 2026-07-25, quality over
    // speed); the race + catch still guarantee the loader can never hang, and
    // fast connections exit on canplaythrough long before the cap
    const feed = (isHome ? heroReady(28000) : delay(200)).then(() => setStatus("feed", true));

    // --- 0-100 counter: real weighted progress, home only (round 5) ---
    // fonts 10% + poster 10% + hero buffering 68% + the min-duration ramp 12%
    // (the gate genuinely waits on delay(minMs), so time IS progress). Every
    // term is monotonic, so the target never decreases; the displayed integer
    // lerps toward it each frame and is clamped monotone anyway. 100 belongs
    // exclusively to the exit.
    let fontsDone = 0;
    let posterDone = 0;
    void fonts.then(() => {
      fontsDone = 1;
    });
    void imagery.then(() => {
      posterDone = 1;
    });
    const counterEl = one("[data-pl-count]");
    const t0 = performance.now();
    let displayed = 0;
    if (isHome && counterEl) {
      const tick = () => {
        const target =
          100 *
          Math.min(
            0.99,
            0.1 * fontsDone +
              0.1 * posterDone +
              0.68 * getHeroProgress() +
              0.12 * Math.min((performance.now() - t0) / minMs, 1),
          );
        const dt = gsap.ticker.deltaRatio(60) / 60;
        const next = displayed + (target - displayed) * Math.min(1, dt * 4) + dt * 1.5;
        displayed = Math.max(displayed, Math.min(target, next));
        counterEl.textContent = String(Math.floor(displayed)).padStart(3, "0");
      };
      counterTick = tick;
      gsap.ticker.add(tick);
    }

    const ctx = gsap.context(() => {
      // Anime.js owns the polar grid draw-in (SVG strokes)
      animate(q("[data-pl-ring]"), {
        strokeDashoffset: [1, 0],
        duration: 900 * Math.max(scale, 0.5),
        delay: stagger(90 * scale),
        ease: "outExpo",
      });
      animate(q("[data-pl-bearing]"), {
        strokeDashoffset: [1, 0],
        duration: 700 * Math.max(scale, 0.5),
        delay: stagger(40 * scale, { start: 200 * scale }),
        ease: "outExpo",
      });

      // GSAP owns the master timeline
      const tl = gsap.timeline();
      const sweep = one("[data-pl-sweep]");
      const rotation = { deg: 0 };
      let lastSector = -1;

      const revealSector = (sector: number, pass: 1 | 2) => {
        q(`[data-sector="${sector}"]`).forEach((el) => {
          const isPass1 = (el as HTMLElement).dataset.pass1 === "1";
          if (pass === 1 ? isPass1 : true) {
            (el as HTMLElement).style.opacity = "1";
          }
        });
      };

      tl.fromTo(
        "[data-pl-eyebrow]",
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6 * scale, ease: EASE.expo },
        0.1 * scale,
      );
      tl.fromTo(
        "[data-pl-title]",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 * scale },
        0.5 * scale,
      );
      tl.to(
        "[data-pl-title]",
        {
          scrambleText: {
            text: "SONAR ACQUISITION",
            chars: "▪01·/-+<>#",
            speed: 0.4,
          },
          duration: 0.7 * scale,
        },
        0.6 * scale,
      );

      // two sweep passes revealing the rig silhouette sector by sector
      tl.to(
        rotation,
        {
          deg: 720,
          duration: 4.4 * scale,
          ease: EASE.mech,
          onUpdate: () => {
            if (sweep) gsap.set(sweep, { rotation: rotation.deg });
            const sector = Math.floor((rotation.deg % 360) / (360 / SECTORS));
            if (sector !== lastSector) {
              lastSector = sector;
              revealSector(sector, rotation.deg < 360 ? 1 : 2);
            }
          },
        },
        1.2 * scale,
      );

      // depth counter
      const depth = { m: 0 };
      const depthEl = one("[data-pl-depth]");
      tl.to(
        depth,
        {
          m: 3800,
          duration: 4.2 * scale,
          ease: "power1.inOut",
          snap: { m: 10 },
          onUpdate: () => {
            if (depthEl) depthEl.textContent = `${String(Math.round(depth.m)).padStart(4, "0")} M`;
          },
        },
        1.3 * scale,
      );

      // coordinate lock
      tl.to(
        "[data-pl-coords]",
        {
          scrambleText: { text: "18°55′N · 72°50′E", chars: "0123456789°′·", speed: 0.3 },
          duration: 1.2 * scale,
        },
        4.6 * scale,
      );

      // lock-on: crosshair converge + single flare flash
      tl.fromTo(
        "[data-pl-lock-h]",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5 * scale, ease: EASE.expo },
        5.6 * scale,
      );
      tl.fromTo(
        "[data-pl-lock-v]",
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.5 * scale, ease: EASE.expo },
        5.65 * scale,
      );
      tl.fromTo(
        "[data-pl-reticle]",
        { borderColor: "rgba(232,98,44,0)" },
        {
          borderColor: "rgba(232,98,44,0.9)",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
        },
        5.9 * scale,
      );
      tl.to(
        "[data-pl-depth-label]",
        { textContent: "HOLDING", duration: 0.01 },
        6.1 * scale,
      );

      // settle: instrument dims slightly and idles
      tl.to(
        "[data-pl-instrument]",
        { scale: 0.98, opacity: 0.85, duration: 0.5 * scale, ease: EASE.soft },
        6.3 * scale,
      );

      // ---- gate + exit ----
      const gate = Promise.all([fonts, imagery, feed, delay(minMs)]);
      let exited = false;
      const exit = () => {
        if (exited) return;
        exited = true;
        // the exit owns the counter's landing on exactly 100: remove the
        // driver SYNCHRONOUSLY first so only one writer ever touches the node
        if (counterTick) {
          gsap.ticker.remove(counterTick);
          counterTick = null;
          if (counterEl) {
            const c = { v: displayed };
            gsap.to(c, {
              v: 100,
              duration: 0.35,
              ease: "power2.out",
              snap: { v: 1 },
              onUpdate: () => {
                counterEl.textContent = String(Math.round(c.v)).padStart(3, "0");
              },
            });
          }
        }
        // idle sweep continues while the iris opens
        const idle = gsap.to(rotation, {
          deg: "+=360",
          duration: 8,
          repeat: -1,
          ease: EASE.mech,
          onUpdate: () => {
            if (sweep) gsap.set(sweep, { rotation: rotation.deg });
          },
        });
        gsap.to(root, {
          "--iris": "150%",
          duration: 0.9,
          ease: EASE.io,
          onComplete: () => {
            idle.kill();
            finish();
          },
        });
      };
      gate.then(exit).catch(exit);
    }, root);

    return () => {
      // intentionally NOT reverting the context here: run-once loader owns its
      // lifecycle and unmounts itself via `done`
      void ctx;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      role="status"
      aria-label="Loading SOLAS MODU Marine Services"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink"
      style={{
        ["--iris" as string]: "0%",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 52%, transparent var(--iris), black calc(var(--iris) + 0.5%))",
        maskImage:
          "radial-gradient(circle at 50% 52%, transparent var(--iris), black calc(var(--iris) + 0.5%))",
      }}
    >
      <span className="sr-only">Loading</span>

      <div
        data-pl-instrument
        className="relative aspect-square w-[min(72vw,520px)]"
        aria-hidden
      >
        {/* polar grid */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          {[25, 50, 75, 98].map((r, i) => (
            <circle
              key={r}
              data-pl-ring
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={i === 3 ? "rgba(120,176,240,0.3)" : "rgba(120,176,240,0.16)"}
              strokeWidth="0.6"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={reduced ? 0 : 1}
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => (
            <line
              key={deg}
              data-pl-bearing
              x1="100"
              y1="6"
              x2="100"
              y2="16"
              stroke="rgba(120,176,240,0.28)"
              strokeWidth="0.7"
              transform={`rotate(${deg} 100 100)`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={reduced ? 0 : 1}
            />
          ))}
          {/* rig silhouette ping field */}
          {pings.map((p, i) => (
            <circle
              key={i}
              data-sector={p.sector}
              data-pass1={p.pass1 ? "1" : "0"}
              cx={p.x}
              cy={p.y}
              r="0.9"
              fill={i % 37 === 0 ? "rgba(29,91,216,0.95)" : "rgba(120,176,240,0.8)"}
              style={{ opacity: reduced ? 1 : 0, transition: "opacity 0.3s" }}
            />
          ))}
        </svg>

        {/* sweep wedge */}
        <div
          data-pl-sweep
          className="absolute inset-[1%] rounded-full will-change-transform"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(29,91,216,0.25), rgba(29,91,216,0.06) 45deg, transparent 60deg)",
          }}
        />

        {/* lock-on crosshair + reticle */}
        <div
          data-pl-lock-h
          className="absolute left-[20%] right-[20%] top-1/2 h-px origin-center bg-accent/70 opacity-0"
        />
        <div
          data-pl-lock-v
          className="absolute bottom-[20%] top-[20%] left-1/2 w-px origin-center bg-accent/70 opacity-0"
        />
        <div
          data-pl-reticle
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent"
        />
      </div>

      {/* readout chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-8 flex flex-col items-center gap-2 px-6 text-center">
        <span className="overflow-hidden">
          <span
            data-pl-eyebrow
            className="block font-mono text-[0.625rem] uppercase tracking-[0.3em] text-steel"
          >
            SOLAS MODU · MARINE SERVICES PVT. LTD.
          </span>
        </span>
        <span
          data-pl-title
          className="font-mono text-[0.6875rem] uppercase tracking-[0.25em] text-white/85 opacity-0"
        >
          ···
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-6 right-6 flex items-end justify-between font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta sm:left-10 sm:right-10">
        <div className="flex flex-col gap-1 text-left">
          <span>
            FONTS <span data-status="fonts">···</span>
          </span>
          <span>
            IMAGERY <span data-status="imagery">···</span>
          </span>
          <span>
            FEED <span data-status="feed">···</span>
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span data-pl-coords>--°--′- · --°--′-</span>
          <span>
            <span data-pl-depth>0000 M</span> · <span data-pl-depth-label>SOUNDING</span>
          </span>
          {counterHome && (
            <span className="text-[0.8125rem] tracking-[0.2em] text-white/85">
              <span data-pl-count className="tabular-nums">
                000
              </span>{" "}
              / 100
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
