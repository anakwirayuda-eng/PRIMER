# M12 Visual Pass - Kunjungan Rumah

**Status:** implemented in the lab build on 2026-07-20  
**Scope:** 27 visit scenes, 16 families, and 24 speaking residents  
**Runtime boundary:** renderer-only; no scoring, content-release, save, or engine revision change

## 1. Purpose

M12 replaces the single repeated house illustration and initial-only avatars in
the UKM home-visit loop. Its visual role is not decoration alone: the scene must
support observation, distinguish each family, show change across repeat visits,
and keep the conversation's current speaker unambiguous.

## 2. Art direction

- Original documentary-realistic Indonesian environments with warm natural
  light, restrained color, and lived-in socioeconomic detail.
- Residents are portrayed naturally and respectfully, without caricature.
- No named artist, studio, game franchise, or licensed asset pack was imitated.
- Images contain no answer labels, captions, watermarks, or intentionally
  readable generated text. Gameplay labels remain authored HTML text.
- Clues are present as environmental details; hotspot coordinates and accessible
  names remain separate UI layers so the engine contract stays unchanged.

## 3. Coverage

Seven 2x2 environment atlases cover all 27 scenarios. The first four establish
the 16 family homes; three follow-up atlases show changed evidence for the 11
repeat visits. No repeat visit reuses its preceding scene plate.

| Atlas | Scenes |
|---|---|
| `homes-a.webp` | Wulan 1, Santoso 1, Ketut 1, Dewi 1 |
| `homes-b.webp` | Musa 1, Raharjo 1, Asih 1, Slamet 1 |
| `homes-c.webp` | Yani 1, Prapto, Marni, Gunawan 1 |
| `homes-d.webp` | Lastri, Bagyo, Endah, Karsa |
| `visits-e.webp` | Wulan 2, Santoso 2, Ketut 2, Dewi 2 |
| `visits-f.webp` | Musa 2, Raharjo 2, Asih 2, Asih 3 |
| `visits-g.webp` | Slamet 2, Yani 2, Gunawan 2, reserve plate |

Six 2x2 portrait atlases cover 24 residents. Speaker overrides are explicit per
dialog node for households where a spouse, grandparent, or adult child answers.
The speaker's name is shown both before and after the player's response.

## 4. Asset provenance

The raster artwork was generated with OpenAI image generation through Codex on
2026-07-20. Lossless source PNGs are retained outside the repository at:

`C:\Users\HP\.codex\generated_images\019f2533-808e-7bc3-97e3-c7c340043355`

The runtime copies are high-quality WebP (`quality=88`) in
`src/renderer/src/assets/m12/`. Original source file names are recorded below.

### Environment sources

- `exec-a854b237-c4b1-4459-ac10-aeebb889c7b3.png` -> `homes-a.webp`
- `exec-15e5a8d0-8aa1-4dbe-a1c5-dbb502c99f22.png` -> `homes-b.webp`
- `exec-439a6431-ce81-4f52-9dd7-4d89cdddd46a.png` -> `homes-c.webp`
- `exec-5c3ac3ca-a94a-4e37-9642-8dd052bda9b6.png` -> `homes-d.webp`
- `exec-173540a8-d761-4f36-860d-62c1ad1e1088.png` -> `visits-e.webp`
- `exec-63bc42a9-8cc7-46b9-a9d0-c7bc86823256.png` -> `visits-f.webp`
- `exec-6c8fee7e-7cd9-4b02-9ece-4d4ababacd78.png` -> `visits-g.webp`

### Portrait sources

- `exec-2230ad03-091e-4511-af37-e1e2077cd627.png` -> `people-a.webp`
- `exec-08e773e0-5759-4d16-9fcf-c076c6438681.png` -> `people-b.webp`
- `exec-caf5cdf8-3ab1-45ab-b66a-de98d7e45705.png` -> `people-c.webp`
- `exec-f93da304-97c8-4c2f-9b5d-e2227532206b.png` -> `people-d.webp`
- `exec-bd4959bf-3385-4e4c-b98e-fe1bf49277dd.png` -> `people-e.webp`
- `exec-5c4aa549-8e9e-4c43-a4bd-1e9df7c7f8d2.png` -> `people-f.webp`

## 5. Runtime and accessibility rules

- The 16:9 scene plate and hotspot layer share the same container-relative
  dimensions, preventing coordinate drift or image stretching.
- All 123 hotspots have renderer-side coordinates anchored to their M12 scene.
  Legacy content coordinates remain untouched for engine/fingerprint stability.
- Discovered markers and observation cards share a stable number. Cards remain
  in discovery order, and pointer/keyboard focus highlights the paired marker.
- Letterboxing is preferable to cropping evidence out of view.
- Dark mode uses a mild brightness/saturation adjustment; clue markers retain
  their independent contrast and keyboard focus state.
- Every scene has a neutral accessible name. Hidden clues are not exposed in
  that name before discovery.
- Portraits are decorative because the adjacent visible speaker name carries
  the semantic identity.
- At low viewport height, spacing and side-note width compact without changing
  the observation target or dialogue order.

## 6. Regression gates

`visualProfiles.test.tsx` fails when:

- any family or visit scenario lacks an explicit scene;
- a repeat visit reuses the preceding scene plate;
- any scenario lacks a portrait profile;
- any authored hotspot lacks an explicit M12 coordinate or leaves the visible
  scene bounds;
- a known multi-speaker handoff loses its explicit override; or
- the renderer falls back to the old initials-only presentation;
- marker/card numbering or discovery order loses its one-to-one pairing.

These tests protect coverage, not clinical correctness. Clinical and UKM content
continue to be governed by their existing evidence and adjudication gates.
