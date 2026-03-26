# 🐛 PRIMER Bug Triage Log

> Ringkasan bug/regresi besar dan solusinya. Format: `[YYYY-MM-DD HH:mm]` per entry.

---

### 2026-03-27 04:30 — CP1 Store Slicing Regressions

**Bug 1 — `normalizeSkillList` ReferenceError**
- Gejala: `unlockSkill()` crash, storeProphylaxis test merah (37/38)
- Akar: Helper dipindah ke `playerHelpers.js` tapi tidak di-export/import
- Fix: Export dari `playerHelpers.js` + import di `useGameStore.js`
- Commit: `8a66c1f`

**Bug 2 — Prolanis discharge tidak commit ke state**
- Gejala: Setelah discharge via EMR, queue tetap 1, roster tidak update
- Akar: `get().publicHealthActions.completeProlanisVisit()` dipanggil di dalam `withTransaction` → nested `set()` ditimpa outer commit
- Fix: Inline logic langsung ke draft state
- Commit: `71c1db1`

**Bug 3 — PRB queue split-brain**
- Gejala: PRB pasien "terbuat" tapi tidak muncul di UI
- Akar: Ditulis ke `publicHealth.prbQueue`, UI baca `clinical.prbQueue`
- Fix: Ganti ke `clinical.prbQueue` (canonical)
- Commit: `71c1db1`

**Bug 4 — `prolanisData.history` TypeError**
- Gejala: Crash saat spread `...member.prolanisData.history` pada legacy roster member
- Fix: Guard `...(member.prolanisData?.history || [])`
- Commit: `71c1db1`

---
