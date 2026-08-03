"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMotionHold } from "@/components/providers/MotionHold";

/**
 * GPU particle ocean behind the contact section. Imports three/R3F directly,
 * so it must only ever be loaded through next/dynamic({ ssr: false })
 * (ContactSection does this). All wave motion lives in the vertex shader;
 * the R3F frame loop is the only engine touching this scene.
 */

const GRID = 160; // 160 x 160 = 25,600 points
const PLANE = 44; // world units, square, centered on origin
const MAX_DELTA = 0.05;
const POINTER_ACTIVE_MS = 1500;
const RIPPLE_STRENGTH = 0.45;
const EASE_RATE = 3;
const COLOR_NEAR = "#78b0f0"; // steel
const COLOR_FAR = "#081020"; // ink: additive blending fades far points out

interface PointerTarget {
  x: number;
  z: number;
  lastMove: number;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vFade;

  void main() {
    vec3 pos = position;
    float phase = aSeed * 6.2831;

    // Gerstner-style swell: horizontal circular motion + vertical sine, three trains
    vec2 d1 = vec2(0.82, 0.57);
    float p1 = dot(pos.xz, d1) * 0.28 + uTime * 0.7;
    pos.xz += d1 * cos(p1) * 0.22;
    float y = sin(p1) * 0.35;

    vec2 d2 = vec2(-0.45, 0.89);
    float p2 = dot(pos.xz, d2) * 0.5 + uTime * 1.1 + phase * 0.2;
    pos.xz += d2 * cos(p2) * 0.1;
    y += sin(p2) * 0.2;

    y += sin(dot(pos.xz, vec2(0.2, -0.98)) * 0.9 + uTime * 1.6) * 0.12;

    // pointer ripple
    float dist = distance(pos.xz, uPointer);
    y += sin(dist * 6.0 - uTime * 3.0) * exp(-dist * 0.55) * uPointerStrength;

    pos.y = y;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.2 + aSeed * 1.1) * uPixelRatio * (24.0 / -mv.z);
    vFade = 1.0 - smoothstep(10.0, 36.0, -mv.z);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorNear;
  uniform vec3 uColorFar;
  varying float vFade;

  void main() {
    float alpha = smoothstep(0.5, 0.12, length(gl_PointCoord - 0.5));
    if (alpha < 0.01) discard;
    vec3 col = mix(uColorFar, uColorNear, vFade);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function OceanPoints({
  pointerRef,
  paused,
}: {
  pointerRef: RefObject<PointerTarget>;
  paused: boolean;
}) {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const count = GRID * GRID;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let i = 0;
    for (let ix = 0; ix < GRID; ix++) {
      for (let iz = 0; iz < GRID; iz++) {
        positions[i * 3] = (ix / (GRID - 1) - 0.5) * PLANE;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (iz / (GRID - 1) - 0.5) * PLANE;
        seeds[i] = Math.random();
        i++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPointerStrength: { value: 0 },
          uPixelRatio: { value: 1 },
          uColorNear: { value: new THREE.Color(COLOR_NEAR) },
          uColorFar: { value: new THREE.Color(COLOR_FAR) },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uPixelRatio.value = dpr;
  }, [material, dpr]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (paused) return;
    const d = Math.min(delta, MAX_DELTA);
    const u = material.uniforms;
    u.uTime.value += d;

    const target = pointerRef.current;
    const ease = 1 - Math.exp(-d * EASE_RATE);
    const pointer = u.uPointer.value as THREE.Vector2;
    pointer.x += (target.x - pointer.x) * ease;
    pointer.y += (target.z - pointer.y) * ease;

    const wantsRipple = performance.now() - target.lastMove < POINTER_ACTIVE_MS;
    const strength = wantsRipple ? RIPPLE_STRENGTH : 0;
    u.uPointerStrength.value += (strength - u.uPointerStrength.value) * ease;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export function OceanParticles({
  onLive,
  onContextLost,
}: {
  onLive?: () => void;
  onContextLost?: () => void;
}) {
  const { held } = useMotionHold();
  const [docHidden, setDocHidden] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerTarget>({ x: 0, z: 0, lastMove: 0 });
  const rectRef = useRef<DOMRect | null>(null);
  const contextCleanupRef = useRef<(() => void) | null>(null);

  // latest callbacks for the once-only onCreated closure and context events
  const onLiveRef = useRef(onLive);
  const onContextLostRef = useRef(onContextLost);
  useEffect(() => {
    onLiveRef.current = onLive;
    onContextLostRef.current = onContextLost;
  }, [onLive, onContextLost]);

  useEffect(() => {
    const update = () => setDocHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // frameloop flips to "never" whenever the section leaves the viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // pointer listener only exists while in view; bounds come from a cached
  // rect (refreshed on scroll/resize and on each IO re-entry), so document-
  // wide pointer moves never trigger a layout read here
  useEffect(() => {
    if (!inView) return;
    const el = wrapRef.current;
    if (!el) return;
    const refreshRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    refreshRect();
    const onMove = (e: globalThis.PointerEvent) => {
      const rect = rectRef.current;
      if (!rect || !rect.width || !rect.height) return;
      // only feed the ripple while the pointer is over the section
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const nz = (e.clientY - rect.top) / rect.height - 0.5;
      const target = pointerRef.current;
      target.x = nx * PLANE * 0.85;
      target.z = nz * PLANE * 0.4 + 3;
      target.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
    };
  }, [inView]);

  // context listeners registered in onCreated are removed on unmount
  useEffect(() => {
    return () => {
      contextCleanupRef.current?.();
      contextCleanupRef.current = null;
    };
  }, []);

  const active = inView && !held && !docHidden;

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
        camera={{ position: [0, 5.5, 13], fov: 55, near: 0.1, far: 60 }}
        frameloop={active ? "always" : "never"}
        fallback={null}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleLost = (e: Event) => {
            e.preventDefault();
            onContextLostRef.current?.();
          };
          const handleRestored = () => onLiveRef.current?.();
          canvas.addEventListener("webglcontextlost", handleLost);
          canvas.addEventListener("webglcontextrestored", handleRestored);
          contextCleanupRef.current = () => {
            canvas.removeEventListener("webglcontextlost", handleLost);
            canvas.removeEventListener("webglcontextrestored", handleRestored);
          };
          onLiveRef.current?.();
        }}
      >
        <OceanPoints pointerRef={pointerRef} paused={!active} />
      </Canvas>
    </div>
  );
}
