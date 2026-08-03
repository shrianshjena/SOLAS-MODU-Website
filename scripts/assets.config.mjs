/**
 * Explicit asset manifest. Source filenames contain spaces, ampersands, and a
 * U+2019 curly apostrophe, so the pipeline NEVER globs the source tree: every
 * shipped asset is enumerated here with its web-safe slug.
 *
 * Rule: whenever an `_enhanced` variant exists, it is the one listed here.
 * Output categories map to public/images/<category>/.
 */
import { certDocuments } from "./certs.config.mjs";

export const SOURCE_ROOT = "C:/Users/Admin/SOLAS MODU";

const PHOTO_WIDTHS = [480, 960, 1600];

const photo = (src, slug, widths = PHOTO_WIDTHS) => ({
  src,
  slug,
  category: "photos",
  widths,
});

const client = (src, slug) => ({
  src: `Client Logos/${src}`,
  slug,
  category: "clients",
  widths: [320],
  // preserve transparency for PNG marks; JPEG sources have no alpha
  alpha: /\.png$/i.test(src),
});

export const images = [
  // ---- brand ----
  {
    src: "SOLAS MODU Logo/SOLAS MODU Final Logo Circle_enhanced.png",
    slug: "logo-circle",
    category: "brand",
    widths: [192, 512],
    alpha: true,
  },
  {
    src: "SOLAS MODU Logo/SOLAS MODU Final Logo Rectangle_enhanced.png",
    slug: "logo-rectangle",
    category: "brand",
    widths: [240, 480],
    alpha: true,
  },

  // ---- client logos (16) ----
  // _dark variants: the source marks are pure white on transparency and
  // vanish on the white marquee plates; a one-shot sharp pass tints the
  // artwork to ink with alpha preserved (originals untouched)
  client("ABS_dark.png", "abs"),
  // _clean variants: baked fake-transparency checkerboards keyed to white
  client("Bureau Veritas_clean.png", "bureau-veritas"),
  client("GAIL.png", "gail"),
  client("IADC Member_clean.png", "iadc-member"),
  client("Indian Coast Guard.png", "indian-coast-guard"),
  client("Indian Oil Corporation Limited.png", "indian-oil"),
  client("Indian Register of Shipping_dark.png", "irs"),
  client("Jagson International Limited.png", "jagson"),
  client("Mazagon Dock Shipbuilders Limited.png", "mazagon-dock"),
  client("ONGC.jpg", "ongc"),
  // _clean: near-white card background flooded to pure white so the plate merges
  client("Pipavav Defence and Offshore Engineering Company Limited_clean.jpg", "pipavav"),
  client("Registro Italiano Navale Services SPA.png", "rina"),
  client("Reliance Industries Limited.png", "reliance-industries"),
  client("Reliance Naval and Engineering Limited.jpeg", "reliance-naval"),
  client("Swan Energy.png", "swan-energy"),
  client("Wartsila India Limited.png", "wartsila"),

  // ---- ISO certificates (PNG renditions) ----
  {
    src: "SOLAS MODU ISO Certifications/ISO 9001-2015 Certificate_Quality Management_2022-2025.png",
    slug: "iso-9001",
    category: "iso",
    widths: [640, 1200],
  },
  {
    src: "SOLAS MODU ISO Certifications/ISO 14001-2015 Certificate_Environmental Management_2022-2025.png",
    slug: "iso-14001",
    category: "iso",
    widths: [640, 1200],
  },
  {
    src: "SOLAS MODU ISO Certifications/ISO 45001-2018 Certificate_Occupational Health and Safety_2022-2025.png",
    slug: "iso-45001",
    category: "iso",
    widths: [640, 1200],
  },

  // ---- photography: enhanced variants preferred ----
  photo("Bikram 3_enhanced.jpg", "bikram-portrait"),
  photo("CO2 Fire Extinguishers_enhanced.jpeg", "co2-fire-extinguishers"),
  photo("Dispersant Spray Arm Electrical_enhanced.jpg", "dispersant-spray-arm"),
  photo("Free-Fall Lifeboat Davit Repairs_enhanced.jpg", "free-fall-lifeboat-davit-repairs"),
  photo("Helicopter 2_enhanced.jpg", "helicopter-2"),
  photo("Helicopter 3 Landing Officer_enhanced.jpg", "helicopter-3-landing-officer"),
  photo("Helicopter 4_enhanced.jpg", "helicopter-4"),
  photo("Immersion Suits_enhanced.png", "immersion-suits"),
  photo("Industrial Offshore Oil Rig Workers_enhanced.jpg", "industrial-offshore-oil-rig-workers"),
  photo("Inflatable Life Rafts_enhanced.jpg", "inflatable-life-rafts"),
  photo("Jack Up Rig Evening_enhanced.png", "jack-up-rig-evening"),
  photo("Lifeboat At Sea_enhanced.jpg", "lifeboat-at-sea"),
  photo("Lifebuoy_enhanced.jpg", "lifebuoy"),
  photo("Lifebuoy 2_enhanced.jpg", "lifebuoy-2"),
  photo("Lifebuoy 3_enhanced.jpg", "lifebuoy-3"),
  photo("Marine Engineer Confined Space_enhanced.jpg", "marine-engineer-confined-space"),
  photo("Oil And Gas Crew_enhanced.jpg", "oil-and-gas-crew"),
  photo("Oil Rig_enhanced.jpg", "oil-rig"),
  photo("Oil Rig Sunset_enhanced.jpeg", "oil-rig-sunset"),
  photo("Oil Skimmer_enhanced.jpg", "oil-skimmer"),
  photo("Oil Spill Boom_enhanced.jpg", "oil-spill-boom"),
  photo("Oil Spill Containment_enhanced.jpg", "oil-spill-containment"),
  photo("Self-Contained Breathing Apparatus_enhanced.png", "scba"),
  photo("SOLAS MODU Lifeboat Deployment_enhanced.png", "solas-modu-lifeboat-deployment"),
  photo("Submerged Arc Welding_enhanced.jpg", "submerged-arc-welding"),
  photo("Tarantula Oil Skimmer_enhanced.jpg", "tarantula-oil-skimmer"),
  photo("Worker Offshore Oil Platform_enhanced.jpg", "worker-offshore-oil-platform"),
  photo("Workers In Gas Masks_enhanced.jpg", "workers-in-gas-masks"),
  photo("Workers In Gas Masks 3_enhanced.jpg", "workers-in-gas-masks-3"),
  photo("World’s Largest Semi-Submersible Floated_enhanced.jpg", "worlds-largest-semi-submersible"),

  // ---- photography: base-only sources (no enhanced variant exists) ----
  // (round 4 pruned nine keys that left the gallery and had no other
  // consumer: sunset-offshore-jack-up-rig, offshore-jack-up-rig-sunset,
  // co2-fire-extinguishers-2/-3, lifeboat-deployment, workers-arc-flash-suits,
  // worker-scba, industrial-team-meeting-2, workers-in-gas-masks-2)
  photo("First Lifeboat SOLAS MODU.jpg", "first-lifeboat"),
  photo("Workers Lifeboat Service.jpg", "workers-lifeboat-service"),
  photo("Offshore Jack Up Rig.jpg", "offshore-jack-up-rig"),
  photo("Oil Rig On Sea With Tanker Ship.jpg", "oil-rig-tanker-ship"),
  photo("Helicopter.jpg", "helicopter"),
  photo("Maritime Safety Equipment.jpg", "maritime-safety-equipment"),
  photo("Lifeboat.jpg", "lifeboat"),
  photo("Ultrasonic Testing.png", "ultrasonic-testing"),
  photo("Sunset.jpg", "sunset"),
  photo("Bikram 2.jpg", "bikram-2"),
  photo("Shri_Vessel Pluto.png", "vessel-pluto"),

  // ---- round-4 image repository (client-supplied, licensing pre-cleared) ----
  // Curated by the 2026-07-30 vision catalog. Excluded and why:
  //   twinfall (third-party hull branding), flag-state-inspection (visible
  //   callsign A8KR2), Boat Building Diagram (third-party published
  //   illustration), Corrosion-Scanner-Navic (legible Eddyfi branding),
  //   EPIRB.png (AI render, garbled labels), NDT Service (AI artifacts +
  //   baked graphic band), underwater-rov-inspection (AI render artifacts),
  //   oil-and-gas-exploration + ships-sunset (stock watermarks),
  //   maritime-giants-float (672px + AI tells), the duplicate Sunset.
  // Note: "Jack-Up Rig.png" shows a FIXED production platform (slugged and
  // captioned accordingly), and "free-fall-lifeboats.jpg" shows
  // DAVIT-LAUNCHED boats (copy must never say free-fall).
  photo("SOLAS MODU_CARLTSOLAS_Website Images/FLAG-STATE-SURVEYS.jpg", "flag-state-surveys"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/FLAG-STATE-INSPECTION-YATAY.jpeg", "main-engine-room"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Maritime Inspection.jpg", "maritime-inspection"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/FSI.jpg", "flag-state-review"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/LRUT.jpg", "lrut-testing"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/SRUT.jpg", "srut-testing"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/PECT.jpg", "pect-testing"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/NDT.jpg", "ndt-closeup"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Hull Inspection.jpg", "hull-inspection"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/FFE.jpg", "ffe-servicing"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Fire_Extinguishers.jpg", "fire-extinguishers"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Ships_SOLAS_Training_FFE.jpg", "ffe-training"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/free-fall-lifeboats.jpg", "davit-lifeboats"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/life-boats.jpg", "lifeboat-fleet"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Lifeboat.jpeg", "lifeboat-profile"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/EPIRB-2.jpg", "epirb-2"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Jack-Up Rig.png", "production-platform"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Rigs.jpg", "rigs-cluster"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/rigs_yale.jpg", "rig-fleet"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Crew Cargo Ship.jpg", "crew-cargo-ship"),
  photo("SOLAS MODU_CARLTSOLAS_Website Images/Crew Aesthetic.jpg", "crew-aesthetic"),

  // ---- round-5 archive photos (client decision 2026-08-03: used exactly
  //      AS-IS, burned-in project captions included, after the concerns were
  //      raised and overruled; low-res masters, no-upscale keeps them honest) ----
  photo("Image 2.png", "project-office"),
  photo("Image 1.png", "fabrication-yard-team"),
  photo("Picture1.jpg", "jack-up-crew"),
  photo("Picture2.jpg", "davit-maintenance-team"),
  photo("Picture3.jpg", "davit-load-test"),
  photo("Picture4.jpg", "platform-load-test"),

  // ---- certificate page-1 rasters (masters written by `npm run certs`;
  //      doc quality keeps fine print legible; keys are `cert-<slug>`) ----
  ...certDocuments
    .filter((d) => d.raster !== false)
    .map((d) => ({
      src: `Derived/Cert Pages/${d.slug}.png`,
      slug: `cert-${d.slug}`,
      category: "certs",
      widths: [640, 1600],
      doc: true,
    })),
];

// PDF copying/extraction moved to scripts/build-certs.mjs (certs.config.mjs
// is the single manifest for certificate documents since round 4).
