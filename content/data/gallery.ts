import type { GalleryItem } from "../types";

/**
 * Deck Log registry, rendered in array order (the order IS the display
 * order; GalleryGrid derives filter chips from first appearance). Round 4
 * (2026-07-30): twelve frames retired at the client's direction and nineteen
 * curated frames added from the round-4 image repository (captions and alts
 * from the provenance-checked vision catalog; "free-fall" is never used for
 * the davit-launched boats, and the aerial platform is captioned as the
 * fixed production platform it actually shows). Round 5 (2026-08-03): six
 * archive photographs prepended in the client's exact order, used as-is by
 * explicit decision; 58 frames total.
 */
export const galleryItems: GalleryItem[] = [
  // Round-5 archive prepends, in the client's exact order (2026-08-03; used
  // as-is per explicit decision, burned-in captions included; alts and
  // captions still follow house rules and never name vessels or people)
  {
    key: "project-office",
    alt: "Shore based project office with a marine services manager at a desk during a planning session",
    caption: "Shore Support Office",
    category: "offshore-operations",
  },
  {
    key: "fabrication-yard-team",
    alt: "Client and contractor project team assembled at an offshore fabrication yard in front of a unit under construction",
    caption: "Project Team at the Fabrication Yard",
    category: "offshore-operations",
  },
  {
    key: "jack-up-crew",
    alt: "Offshore crew assembled on the pipe deck of a jack-up drilling rig during an operations and maintenance campaign",
    caption: "Operations Crew on a Jack-Up Rig",
    category: "offshore-operations",
  },
  {
    key: "davit-maintenance-team",
    alt: "Rig crew lined up beside a lifeboat davit winch assembly during survival craft maintenance offshore",
    caption: "Davit Maintenance Team Offshore",
    category: "survival-systems",
  },
  {
    key: "davit-load-test",
    alt: "Water filled proof load test bags suspended from a lifeboat davit over open sea during offshore load testing",
    caption: "Davit Proof Load Testing at Sea",
    category: "survival-systems",
  },
  {
    key: "platform-load-test",
    alt: "Two offshore technicians on a platform deck beside a lifeboat davit during witnessed load testing",
    caption: "Witnessed Load Testing Offshore",
    category: "offshore-operations",
  },

  // Offshore operations
  {
    key: "oil-rig",
    alt: "Offshore drilling rig standing in open sea under a clear sky",
    caption: "Offshore Drilling Rig on Station",
    category: "offshore-operations",
  },
  {
    key: "oil-rig-sunset",
    alt: "Offshore oil rig silhouetted against an orange sunset sky",
    caption: "Rig Silhouette at Sunset",
    category: "offshore-operations",
  },
  {
    key: "jack-up-rig-evening",
    alt: "Jack-up drilling rig with legs elevated, photographed in evening light",
    caption: "Jack-Up Rig at Dusk",
    category: "offshore-operations",
  },
  {
    key: "production-platform",
    alt: "Aerial view of an offshore production platform flaring gas from its flare boom at sea",
    caption: "Offshore Production Platform",
    category: "offshore-operations",
  },
  {
    key: "worlds-largest-semi-submersible",
    alt: "The world's largest semi-submersible drilling platform at sea",
    caption: "World's Largest Semi-Submersible",
    category: "offshore-operations",
  },
  {
    key: "rigs-cluster",
    alt: "Semi submersible drilling rigs laid up in a coastal anchorage under a cloudy sky",
    caption: "Semi-Submersibles in Lay-Up",
    category: "offshore-operations",
  },
  {
    key: "rig-fleet",
    alt: "Fixed offshore production platforms spread across a calm sea toward the horizon",
    caption: "Offshore Production Field",
    category: "offshore-operations",
  },
  {
    key: "maritime-inspection",
    alt: "Cargo piping and hose handling cranes along the main deck of a tanker at sea",
    caption: "Tanker Deck Pipework",
    category: "offshore-operations",
  },
  {
    key: "main-engine-room",
    alt: "Main engine cylinder heads and railed walkways inside a ship's engine room",
    caption: "Main Engine Room",
    category: "offshore-operations",
  },
  {
    key: "industrial-offshore-oil-rig-workers",
    alt: "Crew members in coveralls and hard hats working on an offshore rig deck",
    caption: "Deck Crew at Work",
    category: "offshore-operations",
  },
  {
    key: "oil-and-gas-crew",
    alt: "Oil and gas crew gathered on an offshore platform in full protective gear",
    caption: "Platform Crew on Shift",
    category: "offshore-operations",
  },
  {
    key: "crew-aesthetic",
    alt: "Two offshore workers in orange coveralls and hard hats at a platform railing looking out over a grey sea",
    caption: "Offshore Crew on Watch",
    category: "offshore-operations",
  },
  {
    key: "crew-cargo-ship",
    alt: "Crew members hosing down the red deck of a cargo ship at sea under clear skies",
    caption: "Deck Maintenance Underway",
    category: "offshore-operations",
  },
  {
    key: "worker-offshore-oil-platform",
    alt: "Worker in safety gear on the deck of an offshore oil platform",
    caption: "On the Platform Deck",
    category: "offshore-operations",
  },

  // Survival systems
  {
    key: "solas-modu-lifeboat-deployment",
    alt: "SOLAS MODU technicians deploying a lifeboat during a service operation",
    caption: "Lifeboat Deployment in Progress",
    category: "survival-systems",
  },
  {
    key: "lifeboat-at-sea",
    alt: "Enclosed orange lifeboat afloat at sea after launch",
    caption: "Lifeboat Afloat After Launch",
    category: "survival-systems",
  },
  {
    key: "davit-lifeboats",
    alt: "Orange davit launched totally enclosed lifeboats stowed on gravity davits along a ship's side",
    caption: "Davit-Launched Enclosed Lifeboats",
    category: "survival-systems",
  },
  {
    key: "lifeboat",
    alt: "Orange enclosed lifeboat secured in its davit cradle",
    caption: "Enclosed Lifeboat on Station",
    category: "survival-systems",
  },
  {
    key: "lifeboat-profile",
    alt: "Davit launched totally enclosed lifeboat stowed at a ship's side with its hatch open",
    caption: "Enclosed Lifeboat on Davit",
    category: "survival-systems",
  },
  {
    key: "lifeboat-fleet",
    alt: "White partially enclosed lifeboats with orange covers hanging from davits on a passenger ship's boat deck",
    caption: "Passenger Ship Lifeboats",
    category: "survival-systems",
  },
  {
    key: "first-lifeboat",
    alt: "Enclosed lifeboat photographed during an early SOLAS MODU servicing project",
    caption: "An Early Lifeboat Project",
    category: "survival-systems",
  },
  {
    key: "workers-lifeboat-service",
    alt: "Service technicians working on a lifeboat during scheduled maintenance",
    caption: "Lifeboat Under Service",
    category: "survival-systems",
  },
  {
    key: "free-fall-lifeboat-davit-repairs",
    alt: "Repair work underway on a free-fall lifeboat davit system",
    caption: "Free-Fall Lifeboat Davit Repairs",
    category: "survival-systems",
  },
  {
    key: "flag-state-review",
    alt: "Inspectors in hard hats and lifejackets observing a davit launched enclosed lifeboat during a shipboard drill",
    caption: "Lifeboat Davit Inspection",
    category: "survival-systems",
  },
  {
    key: "inflatable-life-rafts",
    alt: "Inflatable life rafts opened up for inspection at a service station",
    caption: "Life Rafts Under Inspection",
    category: "survival-systems",
  },
  {
    key: "immersion-suits",
    alt: "Immersion suits laid out for inspection and testing",
    caption: "Immersion Suit Inspection",
    category: "survival-systems",
  },
  {
    key: "flag-state-surveys",
    alt: "Deck locker stenciled life jackets for life raft holding orange lifejackets with reflective tape",
    caption: "Lifejacket Stowage Check",
    category: "survival-systems",
  },
  {
    key: "lifebuoy",
    alt: "Orange lifebuoy mounted on a vessel railing",
    caption: "Lifebuoy at the Ready",
    category: "survival-systems",
  },
  {
    key: "lifebuoy-2",
    alt: "Lifebuoy with reflective tape secured on deck",
    caption: "Deck-Mounted Lifebuoy",
    category: "survival-systems",
  },
  {
    key: "lifebuoy-3",
    alt: "Lifebuoy stationed along a ship's rail with the sea beyond",
    caption: "Lifebuoy on the Rail",
    category: "survival-systems",
  },
  {
    key: "epirb-2",
    alt: "Float free EPIRB stowed in its hydrostatic release bracket on a ship railing beside the EPIRB station sign",
    caption: "Float-Free EPIRB Station",
    category: "survival-systems",
  },
  {
    key: "scba",
    alt: "Self-contained breathing apparatus sets arranged for servicing",
    caption: "SCBA Sets Ready for Service",
    category: "survival-systems",
  },
  {
    key: "co2-fire-extinguishers",
    alt: "Rack of CO2 fire extinguishers awaiting inspection",
    caption: "CO2 Extinguisher Inspection",
    category: "survival-systems",
  },
  {
    key: "fire-extinguishers",
    alt: "Row of red portable fire extinguishers with pressure gauges and discharge hoses",
    caption: "Serviced Fire Extinguishers",
    category: "survival-systems",
  },
  {
    key: "ffe-servicing",
    alt: "Six portable fire extinguishers of different types including foam, powder, water, wet chemical and carbon dioxide",
    caption: "Portable Extinguisher Types",
    category: "survival-systems",
  },
  {
    key: "ffe-training",
    alt: "Folded red fire hoses with chrome couplings hanging in a shipboard rack",
    caption: "Fire Hose Station",
    category: "survival-systems",
  },
  {
    key: "maritime-safety-equipment",
    alt: "Assorted maritime safety equipment prepared for inspection",
    caption: "Safety Equipment Lineup",
    category: "survival-systems",
  },
  {
    key: "workers-in-gas-masks-3",
    alt: "Team in gas masks and coveralls during a hazard-area task",
    caption: "Hazard-Area Task in Progress",
    category: "survival-systems",
  },

  // NDT & welding
  {
    key: "ndt-closeup",
    alt: "Technician taking ultrasonic thickness readings on shipyard steel with a portable flaw detector",
    caption: "Ultrasonic Thickness Gauging",
    category: "ndt-welding",
  },
  {
    key: "lrut-testing",
    alt: "Guided wave testing collar clamped around a pipeline with a portable instrument displaying signal data",
    caption: "Guided Wave Pipeline Screening",
    category: "ndt-welding",
  },
  {
    key: "srut-testing",
    alt: "Technicians screening an excavated pipeline with a segmented ultrasonic transducer ring and a field laptop",
    caption: "Pipeline Screening in the Field",
    category: "ndt-welding",
  },
  {
    key: "submerged-arc-welding",
    alt: "Submerged arc welding in progress with flux covering the weld seam",
    caption: "Submerged Arc Welding",
    category: "ndt-welding",
  },
  {
    key: "marine-engineer-confined-space",
    alt: "Marine engineer carrying out an inspection inside a confined space",
    caption: "Confined Space Inspection",
    category: "ndt-welding",
  },

  // Spill response
  {
    key: "oil-spill-boom",
    alt: "Floating containment boom deployed across the water",
    caption: "Containment Boom Deployed",
    category: "spill-response",
  },
  {
    key: "oil-spill-containment",
    alt: "Oil spill containment operation with booms encircling the affected area",
    caption: "Spill Containment Operation",
    category: "spill-response",
  },
  {
    key: "oil-skimmer",
    alt: "Oil skimmer recovering surface oil from the water",
    caption: "Skimmer Recovering Surface Oil",
    category: "spill-response",
  },
  {
    key: "tarantula-oil-skimmer",
    alt: "Tarantula oil skimmer unit operating on the water surface",
    caption: "Tarantula Skimmer in Action",
    category: "spill-response",
  },
  {
    key: "dispersant-spray-arm",
    alt: "Vessel-mounted spray arm applying dispersant over the water",
    caption: "Dispersant Spray Arm in Operation",
    category: "spill-response",
  },

  // Aviation
  {
    key: "helicopter",
    alt: "Helicopter parked on an offshore helideck",
    caption: "Helideck Arrival",
    category: "aviation",
  },
  {
    key: "helicopter-2",
    alt: "Helicopter approaching an offshore installation",
    caption: "Inbound Over the Water",
    category: "aviation",
  },
  {
    key: "helicopter-3-landing-officer",
    alt: "Helicopter landing officer signaling a helicopter on the helideck",
    caption: "Helicopter Landing Officer on Duty",
    category: "aviation",
  },
  {
    key: "helicopter-4",
    alt: "Helicopter in flight over open sea",
    caption: "Over Open Water",
    category: "aviation",
  },
];
