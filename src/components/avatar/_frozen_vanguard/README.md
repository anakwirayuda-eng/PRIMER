# Frozen Vanguard Avatar Engine
# Status: FROZEN (2026-03-27)
# Reason: Avatar quality gap between SVG math paths and concept art references.
#          Deadline approaching — switching to DiceBear for showcase.
#
# Resume Plan (Opsi 2+3 dari diskusi):
#   1. Trace concept art di Figma/Inkscape → export SVG paths
#   2. Hybrid: embed PNG untuk wajah detail, SVG paths untuk outfit switching
#   3. Re-integrate traced paths ke VanguardHead/Face/Hair components
#
# Files:
#   - AvatarRenderer_vanguard.jsx  → Complete 498-line assembled engine
#   - ../constants.js              → Skin tones, hair colors, style enums (masih dipakai)
#
# Reference Docs (di brain artifacts):
#   - art_direction_bible.md       → Technical spec & Bible
#   - vanguard_male_reference.png  → Concept art male
#   - vanguard_female_reference.png → Concept art female
#   - vanguard_hijab_reference.png → Concept art hijab
#
# DT Staging (di /tmp/avatar_rewrite/):
#   - phase1_head.jsx through phase5_accessories.jsx
