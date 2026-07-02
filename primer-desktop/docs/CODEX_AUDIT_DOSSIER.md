# CODEX AUDIT DOSSIER — PRIMER: Puskesmas Pagi (Desktop Rebuild)

> **Untuk:** CODEX (auditor eksternal, deep-check)
> **Mode:** **READ-ONLY MUTLAK** — lihat Aturan §0
> **Tanggal briefing:** 2026-07-02 · Commit basis: `0f2d84d` (branch `claude/vigorous-bose-f66bc6`)
> **Lokasi kode:** `primer-desktop/` (JANGAN tersesat ke root repo — itu game web LAMA yang berbeda)

---

## 0. ATURAN KERAS UNTUK AUDITOR

1. **Dilarang menulis/mengubah/menghapus file apa pun.** Output audit = SATU laporan
   markdown yang kamu kembalikan sebagai teks (bukan file), format di §6.
2. Dilarang menjalankan perintah yang mengubah state (git commit/checkout, npm install,
   penulisan file). **Boleh:** membaca file, `npx tsc --noEmit -p primer-desktop/tsconfig.json`,
   `npx vitest run` (di dalam `primer-desktop/`), `git log/diff` read-only.
3. Setiap temuan WAJIB menyertakan `file:baris` + kutipan kode + skenario pemicu konkret.
   Tanpa bukti kode = jangan laporkan. Beri tag keyakinan `[V]` (terverifikasi kode) /
   `[A]` (analisis kuat) / `[D]` (opini desain).
4. Prioritas audit (urutan tidak boleh dibalik): **integritas medis > integritas asesmen >
   integritas engine/determinisme > UX > gaya kode**. Gaya kode hanya bila fatal.

## 1. KONTEKS 60 DETIK

PRIMER dibangun ulang dari nol sebagai **game desktop Electron** (sebelumnya web/React
di root repo). Identitas: *Football Manager-nya kedokteran komunitas, dengan hati Harvest
Moon*. Pemain = dokter penanggung jawab darbin, stase 90 hari di Desa Sukamaju (slice
saat ini: Hari 1–7 playable penuh). Pemakai akhir: ±50 mahasiswa FK yang DINILAI dari
skor game → **integritas asesmen adalah kepentingan produk**, bukan nice-to-have.

Dokumen wajib dibaca sebelum audit (urutan): `docs/GDD.md` (desain + pilar),
`docs/BUILD_SPECS.md` (kontrak modul & formula), `docs/ROADMAP.md` (apa yang SENGAJA
belum ada — jangan laporkan sebagai bug).

## 2. PETA ARSITEKTUR

```
primer-desktop/
├── src/main/index.ts        Electron main TIPIS: window + IPC save atomik (userData/saves)
├── src/preload/index.ts     contextBridge `window.primer` (satu-satunya pintu keluar renderer)
├── src/engine/              ★ ENGINE MURNI — nol React/DOM/Electron/Math.random
│   ├── state.ts             Kontrak GameState (SUMBER KEBENARAN bentuk data)
│   ├── actions.ts           Union Action — satu-satunya cara mengubah state
│   ├── events.ts            GameEvent — keluaran samping untuk UI juice
│   ├── reducer.ts           advance(state, action, pack) → {state, events}; alur hari 3 blok
│   ├── init.ts              buildInitialState + penjadwalan karma sejak Hari 1
│   ├── clinic.ts            Encounter klinik + nilaiEncounter (skoring per pasien)
│   ├── kunjungan.ts         Match engine kunjungan 4 babak + gerbang kejujuran
│   ├── pispk.ts             IKS kanonik Permenkes 39/2016 (N/A demografis)
│   ├── kader.ts             Scout harian: sensus + bias data + surat laporan
│   ├── director.ts          Antrian harian: Leitner + bias 4A minggu-1 + musim
│   ├── scoring.ts           Skor 4 dimensi + Referral Guillotine (SATU-SATUNYA formula)
│   ├── save.ts              Amplop {v:1,state} + validasi defensif
│   └── core/rng.ts          Rng deterministik (mulberry32 + FNV-1a) — SATU sumber acak
├── src/content/             ★ KONTEN BERTIPE (TS strict)
│   ├── types.ts             Skema kasus/keluarga/skenario — kontrak konten
│   ├── pack.ts              ContentPack + validasiPack (fail-fast anti-drift id)
│   ├── kasus/               16 kasus klinis (8 infeksi + 8 kronis/berat)
│   ├── keluarga/            6 keluarga binaan ber-arc + 8 kader + 8 RW
│   ├── katalog.ts           36 obat / 14 lab / 18 edukasi
│   ├── skdi144.ts           144 penyakit FKTP (Dex)
│   └── metadata.ts          HKI resmi (EC002026019623) — JANGAN diubah
└── src/renderer/src/        UI React (layar per file di screens/), store.ts zustand tipis
```

Invarian yang harus tetap benar:
- **Determinisme:** seed + urutan aksi sama → state byte-identik (ada test selfplay).
- **Action-log = sumber skor:** UI tidak pernah menghitung aturan; tally hanya diisi reducer.
- **"Setiap angka diperoleh":** UI tidak boleh menampilkan data ber-`sumber:'belum'`,
  vital sebelum diukur, atau bocoran jawaban (urutan opsi, penanda benar, dsb).
- **Firewall alergi class-based** memblokir resep kontraindikasi (poka-yoke).
- **Engine permisif, UI membatasi** — tapi reducer tetap wajib menolak aksi ilegal
  (jangan percaya UI).

## 3. YANG SUDAH DIAUDIT (jangan duplikasi — kecuali kamu menemukan regresi)

Review multi-dimensi internal telah menemukan **38 temuan → 32 terkonfirmasi → semuanya
diperbaiki** di commit basis, antara lain: kebocoran jawaban diagnosis (posisi pertama),
`obatSalahUmum` tanpa gigi (ibuprofen pada DBD), autosave melompati layar judul, identitas
pasien karma hilang (Bu Wulan jadi warga acak), guillotine meledak di denominator kecil,
arc gagal bisa di-undo, apathy dead-code, save-scum harian, cherry-picking auto-resolve,
lab dobel bakar biaya, provenance karma bocor sejak Hari 1, OAT-sebelum-BTA dihukum,
edukasi shotgun, SBAR dinilai panjang karakter.

## 4. FOKUS AUDITMU (deep-check yang BELUM tersentuh)

**P0 — Integritas medis konten** (kamu = dokter auditor):
1. Audit klinis 16 kasus di `src/content/kasus/*.ts` baris per baris: kebenaran ICD-10,
   tatalaksana vs guideline (PERKENI/JNC-8/WHO/Kemenkes), dosis & sediaan di
   `katalog.ts`, kewajaran `diagnosisBanding`, kebenaran `harusDirujuk` vs SKDI,
   `konsekuensi` yang masuk akal patofisiologis, `clue` yang tidak menyesatkan.
2. Audit 12 skenario kunjungan (`keluarga/*.ts`): teknik MI benar? label `tepat` pada
   pilihan dialog sesuai kaidah OARS? `hambatanSebenarnya` (COM-B) konsisten dengan
   narasi? Indikator `indikatorAwal` N/A demografis sesuai Permenkes 39/2016?
3. `skdi144.ts` vs KMK 1186/2022: id/nama/ICD yang salah atau tertukar.

**P1 — Dua temuan lama yang BELUM terverifikasi** (verifikatornya mati kuota):
4. *Grinding trust*: skenario kunjungan gagal bisa diulang tiap hari dengan dialog
   identik — apakah `trustDelta` bertumpuk tanpa diminishing return? (`kunjungan.ts`
   `terapkanHasil`, `reducer.ts` MULAI_KUNJUNGAN: arcIndex hanya maju saat berhasil.)
5. *Stabilisasi-rujuk tanpa diagnosis*: `DISPOSISI rujuk` diizinkan tanpa `KOMIT_DIAGNOSIS`
   — bagaimana `nilaiEncounter` menghitungnya (default 'suspek')? Adakah jalur di mana
   keputusan yang KLINIS BENAR (rujuk cepat kasus gawat) terhitung `suspekSalah`?

**P1 — Exploit hunting formula skor** (`scoring.ts` + `clinic.ts`):
6. Cari strategi dominan degenerate yang lolos: mis. semua-SUSPEK selamanya (kalibrasi
   0.9/0.4 — apakah TEGAK pernah lebih menguntungkan?), spam kunjungan keluarga yang
   sama, manipulasi `autoBermasalah`, batas `rujukanTotal >= 3` (merujuk 2× bebas
   guillotine?), Manajemen yang tidak bisa turun di bawah X.
7. Determinisme: cari iterasi `Object.keys/values/entries` di engine yang urutannya
   memengaruhi konsumsi Rng (drift replay).

**P2 — Ketahanan:**
8. Save/load: field yang hilang dari validasi `save.ts`; `kunjungan`/`klinik.aktif`
   yang tersimpan mid-sesi lalu di-load (skenario hilang? PACK berubah?).
9. UI-engine mirror: tombol yang enabled padahal reducer menolak (dan sebaliknya).

## 5. CARA MENJALANKAN BUKTI (read-only)

```bash
cd primer-desktop
npx tsc --noEmit -p tsconfig.json   # harus 0 error
npx vitest run                       # harus 82+ pass
```

## 6. FORMAT LAPORAN YANG DIMINTA

```
## Ringkasan eksekutif (≤10 baris)
## Temuan (urut severity)
### [P0|P1|P2][V|A|D] Judul singkat
- Lokasi: file:baris
- Bukti: kutipan kode / hasil test
- Skenario pemicu: langkah konkret pemain
- Dampak: medis / asesmen / engine
- Saran fix (1-3 kalimat, TANPA menulis kodenya ke repo)
## Yang dicek dan BERSIH (agar tidak diaudit ulang)
```

---

*Dossier ini bagian dari alur triangulasi PRIMER (Claude builder · CODEX auditor).
Hak Cipta terdaftar: Surat Pencatatan Ciptaan Kemenkumham RI No. EC002026019623,
Nomor Pencatatan 001104039 — © 2026 Anak Agung Bagus Wirayuda MD PhD.*
