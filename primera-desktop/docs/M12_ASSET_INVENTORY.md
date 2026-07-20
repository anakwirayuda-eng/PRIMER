# M12 Asset Inventory and Art Bible

**Status:** implementation wave, 2026-07-20
**Runtime boundary:** renderer-only
**Gameplay identity:** systemic primary-care simulator with state-conditioned storylets
**Canonical visual source directory:** `src/renderer/src/assets/m12/`

## 1. Executive decision

PRIMERA benefits from visual assets when they do one of four jobs: establish a
place, keep a person recognizable, make system work legible, or give a compact
narrative consequence emotional weight. It does not benefit from adding an
illustration to every form, drug, diagnosis, or administrative panel.

The M12 target is therefore **selective visual continuity**, not maximal image
count. The game remains a simulator whose state and decisions drive the story.
Its 44 deterministic nightly fragments already constitute a storylet system:
small narrative units become eligible from actual state, rotate without early
repetition, and never claim a referral, program, or family event that did not
happen. M12 makes this structure visible without turning PRIMERA into a linear
visual novel.

## 2. Art bible

- Documentary-realistic Indonesian primary-care environments and people.
- Natural light, restrained cream and muted green, wood, rain-blue, and soft
  earth tones. Color remains varied enough to avoid a one-note brown palette.
- Ordinary Puskesmas and village material culture; no private-hospital glamour.
- Residents are dignified and specific, without poverty spectacle, caricature,
  or illness stereotypes.
- Generated images contain no readable labels, logos, watermarks, answer text,
  or diagnostic captions. Semantic labels remain authored HTML.
- Clinical portraits remain diagnosis-neutral. Symptoms, wounds, medicines,
  devices, pregnancy cues, and other answer leakage are deliberately absent.
- Stable atlas dimensions prevent layout shifts. Images are supporting context,
  never the sole carrier of a required answer.
- Dark mode receives a mild brightness/saturation correction; text and markers
  retain independent contrast.

## 3. Runtime inventory

| Surface | Coverage | Status | Gameplay purpose |
|---|---:|---|---|
| UKM family environments | 16 homes | Active | Place memory and household distinction |
| UKM visit scenes | 27/27 scenarios | Active | Visible continuity across repeat visits |
| Named UKM residents | 24 portraits | Active | Speaker identity and relationship memory |
| UKM observation targets | 123/123 | Active | Scene-aligned evidence discovery |
| Poli/IGD patients | 40 demographic variants | Active | Patient continuity without diagnosis leakage |
| UKM program activities | 4 scenes | Active | Posyandu, Prolanis, KLB, and Lokmin identity |
| Nightly system storylets | 4 thematic scenes | Active | Clinic-referral-family-community continuity |
| Player/doctor avatars | 9 presets | Reserve | Optional identity after a separate UX/save decision |

The five patient atlases are selected deterministically from patient identity,
age, and gender only. They never receive `kasusId` or diagnosis as an input.
The same patient therefore keeps the same face in the waiting room, encounter,
and emergency context while two diseases cannot be distinguished by artwork.

## 4. Asset manifest and provenance

All artwork below was generated with the built-in OpenAI image generation tool
through Codex on 2026-07-20. Source PNGs remain untouched at:

`C:\Users\HP\.codex\generated_images\019f2533-808e-7bc3-97e3-c7c340043355`

Runtime derivatives use WebP quality 88. The generated source is not deleted.

| Source PNG | Runtime WebP | Layout | Prompt brief |
|---|---|---|---|
| `exec-45ee2225-66dd-453b-b701-dc47dc0acd46.png` | `clinic-infant.webp` | 2x2 square | Indonesian infant/toddler patients with caregivers; neutral clinic portrait; no diagnostic cues |
| `exec-055eab92-ef31-4b35-b33e-c3e425fa1f54.png` | `clinic-youth.webp` | 3x3 square | Ages 5-17, balanced girls/boys, same Puskesmas waiting area, neutral expressions |
| `exec-3e8126d5-c940-474d-b20b-415b31d3e638.png` | `clinic-women.webp` | 3x3 square | Adult women ages about 20-57, balanced hijab/non-hijab, ordinary clinic clothing |
| `exec-7cdc7414-aec3-4e89-8bae-b6837fd50035.png` | `clinic-men.webp` | 3x3 square | Adult men ages about 20-57, varied faces and grooming, diagnosis-neutral |
| `exec-c8dd83aa-dcba-4e0e-ade5-54de9ad63a96.png` | `clinic-older.webp` | 3x3 square | Mixed older adults ages about 60-88, dignity and autonomy, no frailty stereotype |
| `exec-a1290293-2ad9-4cc3-ae00-c28cced71a73.png` | `activities-a.webp` | 2x2 wide | Posyandu ILP, Prolanis, KLB field investigation, and Lokmin continuity meeting |
| `exec-6ac5326e-38aa-45f2-bcc2-fe325103d63a.png` | `storylets-a.webp` | 2x2 wide | After-hours data review, referral callback, rainy follow-up planning, community dialogue |
| `exec-8c1dfd60-946b-4f30-8fcd-8c2c319da46e.png` | `doctor-presets.webp` | 3x3 square | Nine diverse Indonesian primary-care doctors, approachable and non-heroic |

Every generation prompt explicitly requested documentary editorial realism,
Indonesian primary-care context, consistent M12 colors, no readable generated
text, no logos, no diagnosis cues, no decorative graphics, and no imitation of
a named artist, studio, or franchise. Existing M12 atlases were supplied as
style references.

## 5. Player avatar decision

An avatar can improve ownership and make later rapor or storylet moments feel
personal. A single mandatory doctor face would do the opposite: it would assign
gender, appearance, and identity to the player without consent and crowd the
already dense HUD.

M12 therefore supplies nine balanced presets but does not activate them in
`GameState` or save data. A future lightweight avatar decision should meet all
of these conditions:

1. selection is optional and includes a no-portrait choice;
2. it appears at profile creation or settings, not during clinical reasoning;
3. it is shown sparingly, such as on the title dossier and periodic rapor;
4. save migration and cohort-build behavior are specified before activation;
5. no preset changes scoring, dialogue, patient response, or clinical content.

## 6. Deliberately deferred or rejected

| Candidate | Decision | Reason |
|---|---|---|
| One portrait per diagnosis | Reject | Expensive, repetitive, and leaks diagnostic identity |
| Images inside formulary, gudang, and data tables | Reject | Reduces scan speed and raises cognitive load |
| AI-generated lesion/radiology reference images | Reject for M12 | Clinical fidelity and licensing need a separate authoritative image review |
| Animated facial emotion for every response | Defer | High content cost and risk of stereotyping or false emotional certainty |
| Activity success/failure image variants | Consider after playtest | Valuable only if players notice and understand the base activity scenes |
| Map weather/season bitmap variants | Defer | Existing map state and contrast fixes carry higher information density |
| Dedicated Puskesmas establishing scene | Optional polish | Useful for title/transition, not a current gameplay gap |

## 7. Cognitive-load rules

- One major image per decision surface; no image mosaics during reasoning.
- Portraits stay small and decorative beside an already visible identity.
- Activity art appears once above the card deck and does not change per answer.
- Nightly storylets use one thumbnail plus one short paragraph.
- No animation is required to notice a clue or understand an outcome.
- Images may strengthen recall, but authored text remains sufficient for all
  required decisions and screen-reader use.

## 8. Regression gates

Automated tests protect the following invariants:

- 40 patient variants span infant/toddler, youth, adult women, adult men, and
  older-adult pools;
- patient selection is deterministic and independent of diagnosis;
- all atlas coordinates stay within the intended 2x2 or 3x3 grid;
- Posyandu, Prolanis, KLB, and Lokmin cannot exchange atlas cells silently;
- storylet text remains backward-compatible while all four visual themes are
  reachable; and
- nine unique doctor presets remain available without entering runtime save.

Clinical correctness, UKM evidence, and storylet causal truth remain governed
by their existing content, evidence-binding, and adjudication tests. M12 does
not use visual polish to bypass those gates.

## 9. Closure verification

The integrated patient surfaces were checked in the production renderer at the
application's supported minimum window size (`1200x760`) in both light and dark
mode. Waiting-room and encounter portraits remained stable, no horizontal
overflow or element collision was detected, and the browser console reported
no warnings or errors. The deliberately unsupported 390-pixel mobile viewport
was not treated as a release target because Electron enforces `minWidth: 1200`
and `minHeight: 760`.

Release closure requires the complete Vitest suite, TypeScript typecheck,
renderer bundle budget, NSIS packaging, and SHA-256 installer checksum. The
exact final counts and checksum are recorded in the accompanying commit report.
