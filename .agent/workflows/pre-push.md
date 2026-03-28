---
description: Pre-push checklist — gate sebelum commit/push/deploy PRIMER
---

# Pre-Push Checklist PRIMER

> Jalankan checklist ini **sebelum setiap push ke origin**. Urutan penting.

## 1. Build Gate
// turbo
```
npx vite build 2>&1 | tail -5
```
- Harus exit 0. Kalau gagal, STOP. Jangan push.

## 2. Lint Target Files
// turbo
```
npx eslint --no-warn-ignored src/components/emr/ src/store/slices/ src/game/ --quiet
```
- Harus 0 errors. Warnings boleh, errors tidak.

## 3. Test Suite
// turbo
```
npx vitest run --reporter=verbose 2>&1 | tail -20
```
- Semua test harus pass. Kalau ada failure, STOP.

## 4. Git Discipline
- `git diff --stat` → pastikan hanya file yang relevan dengan tema commit
- **JANGAN** campur refactor fondasi + polish UI dalam satu commit
- Commit message harus deskriptif: `fix(emr):`, `feat(village):`, `refactor(store):`

## 5. Quick Smoke Test (Manual — 60 detik)
Buka `http://localhost:5174` dan cek:
- [ ] Dashboard load tanpa error console
- [ ] Buka EMR → klik pasien → semua tab load (Anamnesis, PF, Lab, Diagnosa, Obat)
- [ ] PhysicalExamTab: body map nodes muncul, accordion bisa buka/tutup
- [ ] Rotate/resize browser → accordion sync otomatis

## 6. Push & Deploy
```
git push origin master
```
- Vercel auto-deploy dari push ke master
- Cek deploy status di https://vercel.com/dashboard

---

## Kapan TIDAK boleh push:
- Build gagal
- Lint error > 0
- Test failure
- File yang berubah di luar scope commit message
- Sedang ada parallel edit dari agent lain (Codex) yang belum di-merge

## Tips dari Codex:
- Commit kecil, satu tema
- Satu owner per lane
- Contract tests untuk boundary penting (patient shape, exam suggestions, slice canonical)
- Runtime/UX bugs sering lolos build — selalu smoke test
