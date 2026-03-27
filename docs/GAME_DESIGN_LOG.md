# 🎮 PRIMER Game Design Log

> Catatan keputusan desain gameplay. Format: `[YYYY-MM-DD HH:mm]` per entry.

---

### 2026-03-27 05:17 — Village Population Scaling Decision

**Konteks**: 30 KK (~115 warga) habis dalam 4 hari game. Kasus poli cepat repetitif.

**Keputusan**:
- Target: **200 KK (~800 jiwa)**, 4-5 RW dengan pocket dioramas
- 70-80% pasien dari warga inti, 20-30% outsiders (garbage-collected)
- Kapitasi header tampilkan "34.520 jiwa" sebagai ilusi skala (Frostpunk trick)
- RW unlock sebagai campaign progression

**Sumber**: Deepthink Village Scaling (3 rounds), `deepthink_village_triage.md`

---

### 2026-03-27 05:38 — DEADLINE TARGET HARI INI

**Target**: Selesaikan pipeline penuh dalam 1 hari:

```
1. Store Slicing CP2       ← extract action slices (navSlice → clinicalSlice)
     ↓
2. Patient Factory         ← konsolidasi single canonical generator
     ↓
3. Village Expansion       ← 30 KK → 200 KK (~800 jiwa), 4-5 RW, pocket dioramas
     ↓
4. Living Village          ← villageLedger feedback loop dari discharge
```

**Tambahan**: Perbaiki dashboard/panel Poliklinik EMR:
- UX harus intuitif sebagai simulasi EMR untuk mahasiswa FK
- **Mobile responsiveness** — saat ini sama sekali tidak mobile-friendly
- Harus representatif dan enak dipakai

**Pengingat angka**: Target populasi = **200 KK (~800 jiwa)**

---

### 2026-03-27 05:50 — VISI EKSPANSI & EXHIBITION SHOWCASE

**Catatan demografi**: 800 jiwa/desa WAJAR — desa kecil Indonesia biasanya 1.000-3.000 jiwa. 800 cocok untuk desa pelosok. Puskesmas cover beberapa desa → outsiders = warga desa tetangga.

**Halaman Sensus**: Perlu diperbaharui seiring village expansion (200 KK). Pagination, filter per RW, profil keluarga.

**Map 2D Blueprint (BARU)**:
- Buat versi **2D blueprint/denah** side-by-side dengan 3D diorama
- Alasan: kalau 3D tidak dibuka → load/render ringan, pemain bisa fokus strategic gameplay
- 2D mode = peta top-down ala SimCity/blueprint, interaktif
- 3D mode = diorama immersive (opsional, bisa toggle)

**Level-Based Map Expansion**:
- Seiring level naik → unlock RW baru → keluarga baru dikunjungi
- Lebih banyak wilayah = budget kapitasi makin besar
- Pemasukan Puskesmas bertambah seiring ekspansi
- Gameplay loop: Level Up → Unlock RW → More Families → More Kapitasi → Better Upgrades

**UKM Exhibition Showcase** 🎯:
- **Tujuan**: Showcase community medicine di Indonesia untuk civitas kampus luar
- **Audience**: FKK ITS ingin pamer di kegiatan akademik/pameran
- **Gameplay section UKM**: Lengkap dengan visual, fitur, dan tech yang memukau
- **Standar**: Inovatif secara gameplay, UI/UX, dan visual art design
- **Harus**: Lengkap, memukau, dan layak pamer sebagai "mini exhibition"
- Fitur UKM yang bisa ditambahkan di map yang meluas:
  - Posyandu, Posbindu, Poskesdes, STBM, IKM, Jentik, Fogging
  - Kerjasama lintas sektor (Camat, PKK, Kader)
  - Data epidemiologi per RW
  - Program promosi kesehatan

**Status**: Target masa depan (setelah pipeline hari ini selesai)

---
