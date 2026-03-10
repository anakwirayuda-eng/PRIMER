# Roadmap Pengembangan PRIMER Game

## ✅ Phase 1: Core Gameplay (DONE)
- Patient Generation, Clinical Workflow, Financial System
- Energy/Time/Day Loop, Reputation, Navigation

## ✅ Phase 2: Community & Outreach (DONE)
- Wilayah Map & PIS-PK, Posyandu, Prolanis, PRB
- Staff Management, Quest System, Facility Upgrades, SISRUTE

## ✅ Phase 3: Advanced Integration (DONE)
- Outbreak System, Accreditation Progression
- Pharmacy Logistics, XP System Unification, Save/Load Fix

---

## 🔴 Phase 4: Polish & Stability (Feb-Mar 2026)
- [ ] Tutorial/Onboarding untuk mahasiswa baru
- [ ] Gameplay balance testing (XP, energy, difficulty curve)
- [ ] UI/UX polish (animasi, feedback visual)
- [ ] Kompres aset gambar ke WebP
- [ ] Victory Condition (kapan "menang"?)
- [ ] Random Events (musim, kunjungan Dinkes)
- [ ] Tambah variasi kasus penyakit

## 🟡 Phase 5: Scoring & Competition (Apr-Mei 2026)
- [ ] Scoring system (rumus skor akhir)
- [ ] Export/Import save file
- [ ] Achievement system

## 🔵 Phase 6: Cloud & Multiplayer (Mei 2026)
Target: 50 mahasiswa per sesi, bisa main di rumah, lomba performance

### Frontend (sudah ada)
- React + Vite (semua yang sudah dibangun)

### Backend (baru)
- **Platform**: Supabase (gratis)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Login dengan NIM mahasiswa
- **API**: Supabase REST API (otomatis dari database)

### Fitur Cloud:
- [ ] Login NIM + profil mahasiswa
- [ ] Cloud save (progress tersimpan di server)
- [ ] Leaderboard real-time antar mahasiswa
- [ ] Dashboard dosen (lihat ranking semua mahasiswa)
- [ ] Sync progress antar device (lab ↔ rumah)

### Hosting:
- **Frontend**: Vercel (gratis, 100GB bandwidth/bulan)
- **Backend**: Supabase (gratis, 50K requests/bulan)

---

> **Target Juni 2026**: Game siap dipakai di lab komputer dengan 50 mahasiswa, leaderboard aktif, dosen bisa monitor performa.
