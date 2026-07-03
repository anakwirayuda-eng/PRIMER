# Avatar Renderer Overhaul — Session Log
> Date: 2026-03-27 | Status: **FROZEN** (DiceBear Lorelei active, Vanguard parked)

## Timeline

### Phase A: Art Direction & Concept Art (2026-03-26)
- Created `ART_DIRECTION_BIBLE.md` — full technical spec (proportions, shadow engine, stacking order)
- Generated 3 concept art references (Male, Female, Hijab) → saved to `docs/art-direction/`
- Established "Vanguard Medical Operator" aesthetic

### Phase B: Component-by-Component Rewrite via DT (2026-03-26 → 03-27)
- **Phase 1 (VanguardHead):** Angular jaw, compound ears, cheek shadow, under-chin separation
- **Phase 2 (VanguardFace):** Jewel iris engine, 5-mood expressions, thick upper eyelid
- **Phase 3 (VanguardHair):** 8 styles, back/front layer logic, hijab evenodd compound path
- **Phase 4 (VanguardOutfit):** Lab coat + teal shirt, scrubs + raglan seams, casual
- **Phase 5 (VanguardAccessories):** Half-rim glasses, medical stethoscope
- **Phase 6 (Main Renderer):** Assembly, normalizeAvatar(), Painter's Algorithm stacking

### Phase C: Assembly & Testing (2026-03-27 07:21)
- All 6 phases assembled into `AvatarRenderer.jsx` (498 lines)
- `npx vite build` → **Exit 0** ✅
- Browser visual test: 3 avatars rendered successfully
- **Verdict:** Functional but visual gap vs concept art is significant

### Phase D: Decision Point (2026-03-27 11:31)
- User: "masih jauh dari gambar referensinya"
- Options discussed:
  1. ~~Iterasi koordinat manual~~ (diminishing returns)
  2. **Trace di Figma/Inkscape** → export SVG paths (BEST for accuracy)
  3. **Hybrid PNG+SVG** approach (detail faces + dynamic outfits)
  4. Accept cel-shade flat style as-is
- **Decision: FREEZE Vanguard, switch to DiceBear for showcase deadline**

### Phase E: DiceBear Lorelei Integration (2026-03-27 11:36)
- Archived Vanguard → `src/components/avatar/_frozen_vanguard/`
- Installed `@dicebear/core` + `@dicebear/collection` (includes `@dicebear/lorelei`)
- Rewrote `AvatarRenderer.jsx` (95 lines) using DiceBear Lorelei style
- Fixed import path: `@dicebear/lorelei` (not `@dicebear/collection/lib/...`)
- `npx vite build` → **Exit 0** ✅
- Avatar preview confirmed working in PlayerSetup

### Known Issue
- PlayerSetup options (Pigmentasi, Folikel Rambut, Topologi Rambut) are **misleading**
  with DiceBear — they change the seed (different face) but don't literally map to
  skin/hair appearance. Acceptable for showcase, should be cleaned up later.

---

## File Map

| File | Status | Notes |
|------|--------|-------|
| `src/components/AvatarRenderer.jsx` | ACTIVE | DiceBear Lorelei (95 lines) |
| `src/components/avatar/_frozen_vanguard/AvatarRenderer_vanguard.jsx` | FROZEN | Full 498-line Vanguard engine |
| `src/components/avatar/_frozen_vanguard/README.md` | FROZEN | Resume instructions |
| `src/components/avatar/constants.js` | ACTIVE | Skin tones, hair colors, style enums |
| `src/TestAvatar.jsx` | UNUSED | Test harness (can delete) |

## Resume Plan (When Ready)
1. Open Figma/Inkscape
2. Import concept art as background layer
3. Trace SVG paths over the art (head, face, hair, outfit)
4. Export paths → inject into `_frozen_vanguard/AvatarRenderer_vanguard.jsx`
5. Optionally: hybrid approach — PNG for face detail, SVG for outfit/accessory switching
6. Swap back `AvatarRenderer.jsx` from DiceBear to Vanguard
