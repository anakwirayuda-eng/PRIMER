# CODEX AUDIT DOSSIER — PRIMER: Puskesmas Pagi (Desktop Rebuild)

> **Untuk:** CODEX (auditor eksternal, deep-check)
> **Mode:** **READ-ONLY MUTLAK** — lihat Aturan §0
> **Tanggal briefing:** 2026-07-03 (refresh M3b) · Basis: HEAD branch `claude/vigorous-bose-f66bc6`
> **Lokasi kode:** `primer-desktop/` (JANGAN tersesat ke root repo — itu game web LAMA yang berbeda)
>
> **PERUBAHAN SEJAK BRIEFING M0:** proyek kini sampai **M3b**. Yang bertambah & BELUM
> pernah diaudit CODEX (fokuskan ke sini): M1 bridge UKM↔UKP (`surveilans.ts`, drift,
> KBK, follow-up, SDOH armor di `reducer.ts`), M2 program terjadwal (`kegiatan.ts`:
> Posyandu/Prolanis/KLB + Lokakarya Mini), M3a rujukan berjenjang (`reducer.ts` blok
> SISRUTE + PRB, `scoring.ts` confidence-tag, `content/rumahSakit.ts`), **67 kasus
> klinis** (bukan 16 lagi — `content/kasus/*.ts` 7 file) + `content/katalogM3.ts`
> (56 obat/10 lab/19 edukasi/8 tindakan), dan M3b **IGD** (`igd.ts` engine + `content/igd.ts`
> 5 kasus) + kalender musiman (`reducer.ts` EVENT_KALENDER). Kasus asli 16 + 12
> skenario kunjungan SUDAH diaudit medis internal (nol P0) — boleh skim, fokus ke yang baru.

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
│   ├── surveilans.ts        ★M1 kluster balik UKP→UKM (14 hari, ambang DBD/diare/ISPA)
│   ├── kegiatan.ts          ★M2 mesin sesi Posyandu/Prolanis/KLB (dek kartu keputusan)
│   ├── igd.ts               ★M3b mesin IGD turn-based (stabilitas, Kode Biru, RJP)
│   ├── katalog.ts           36 obat / 14 lab / 18 edukasi (inti)
│   ├── katalogM3.ts         ★M3 +56 obat / +10 lab / +19 edukasi / +8 tindakan (Fornas)
│   ├── rumahSakit.ts        ★M3a jejaring rujukan SISRUTE (4 RS kelas D/C/B)
│   ├── igd.ts (content)     ★M3b 5 kasus gawat darurat
│   ├── kasus/*.ts           ★67 kasus (kasusInfeksi/Kronis + RespGi/Kulit/SarafMataTht/
│   │                          MetabolikMsk/KiaJiwa) — 12 wajib-rujuk ber-spesialisRujukan
│   ├── skdi144.ts           144 penyakit FKTP (Dex; auto-tautkan kasusId via ICD-10)
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

- **M0 (review internal 32 temuan diperbaiki):** kebocoran jawaban diagnosis, obatSalahUmum
  tanpa gigi, autosave melompati layar judul, identitas karma hilang, guillotine denominator
  kecil, arc gagal di-undo, apathy dead-code, save-scum, cherry-picking auto-resolve, lab
  dobel bakar biaya, provenance karma bocor, OAT-sebelum-BTA, edukasi shotgun, SBAR panjang.
- **M3a (audit medis internal 5 dokter, nol P0, 9 P1/P2 diperbaiki):** 51 kasus baru sudah
  diperiksa untuk dosis/indikasi/kontraindikasi/ICD/SKDI. Yang sudah dibetulkan: hemoroid
  (laksatif→pelunak), rinitis (alasan trap), epilepsi (diazepam rektal + fktp144), glaukoma
  (fktp144), ISK/dislipidemia/CHF (alergiTrap), malaria (edukasi+primakuin), permetrin clue.
  **Boleh spot-check regresi, tapi jangan audit ulang 51 kasus itu dari nol.**

## 4. FOKUS AUDITMU (deep-check yang BELUM tersentuh)

**P0 — Integritas medis konten BARU** (kamu = dokter auditor):
1. **5 kasus IGD** (`content/igd.ts`) — BELUM diaudit medis sama sekali. Verifikasi tiap
   `LangkahIgd`: apakah pilihan `benar:true` benar-benar tindakan lini pertama (anafilaksis→
   adrenalin IM, kejang→diazepam rektal + posisi, asma→nebul+steroid, hipoglikemia→D40 IV
   bukan insulin, DSS→kristaloid bukan antibiotik)? Apakah `efekStabilitas` proporsional
   (kesalahan fatal seperti "insulin pada hipoglikemia" harus paling negatif)? `disposisiBenar`
   & `spesialisRujukan` tepat? `clue` tidak menyesatkan?
2. **Kasus IGD vs poli**: adakah tumpang-tindih/kontradiksi tata laksana antara `content/igd.ts`
   dan kasus poli serupa (mis. dengue_df poli vs igd_dengue_syok)?
3. `katalogM3.ts`: 56 obat baru — dosis/kelas/golonganAlergi benar? (mis. `nitrofurantoin_100`
   golongan benar, `diazepam_rektal_10` sediaan tepat, `primakuin_15` gametosidal.)

**P1 — Integritas asesmen mekanik BARU (M1/M2/M3):**
4. **SISRUTE** (`reducer.ts` blok DISPOSISI rujuk, ~baris 190-320): adakah jalur di mana
   rujukan yang KLINIS BENAR terhitung salah, atau boomerang/PRB salah menjadwalkan pasien
   ganda? PRB: apakah `nilaiEncounter` (`clinic.ts`) benar menilai pasien `prb:true`
   (pulang=tepat, rujuk-ulang=RRNS)? Confidence-tag `bonusRujukanTepat` bisa di-exploit?
5. **IGD scoring** (`scoring.ts` efekIgd + `reducer.ts` DISPOSISI_IGD/RJP_IGD): Kode Hitam
   `-3` UKP vs stabil `+0.5` — adakah strategi menghindari IGD (mis. tak pernah maju hari)?
   RJP peluang 0.7/0.25 deterministik dari `Rng(seed,'rjp',hari,kasusId)` — bisa di-scum?
6. **M2 program**: Posyandu `bonusIks` (cap 0.3) — bisa di-farm ulang tiap 30 hari untuk
   IKS palsu? Prolanis `driftProlanis` (`kegiatan.ts`) — jawaban benar selalu menurunkan
   parameter? KLB `klbTuntas` menghapus surveilans — bisa disalahgunakan?
7. **M1 bridge** (`reducer.ts` hariBaru): drift keluarga rawan (cap 2/pekan) — benar tak
   pernah menyalahi cap? KBK bulanan (`hari % 30 === 1`) — bisa dobel? Surveilans kluster
   flag `cluster_*` — pernah re-fire?

**P1 — Exploit formula skor & determinisme** (tetap relevan):
8. Strategi degenerate: semua-SUSPEK selamanya (kalibrasi 0.9/0.4), `rujukanTotal>=3` gate
   guillotine (merujuk 2× bebas?), `autoBermasalah`, Manajemen lantai.
9. Determinisme: iterasi `Object.keys/values/entries` di engine yang urutannya memengaruhi
   konsumsi Rng (drift replay) — PERHATIAN KHUSUS: blok M1/M2/M3 baru di `reducer.ts`
   `hariBaru` (loop keluarga untuk drift & follow-up, loop kluster, loop RS SISRUTE).

**P2 — Ketahanan:**
10. Save/load: field M1/M2/M3 baru di `save.ts` (surveilans, drift, prolanis, program,
    igd, igdHariIni, tally baru) — migrasi-lite benar? `igd`/`kegiatan`/`kunjungan` yang
    tersimpan mid-sesi lalu di-load dengan PACK berubah?
11. UI-engine mirror: layar `igd`/`kegiatan` — tombol enabled padahal reducer menolak.

## 5. CARA MENJALANKAN BUKTI (read-only)

```bash
cd primer-desktop
npx tsc --noEmit -p tsconfig.json   # harus 0 error
npx vitest run                       # harus 114+ pass (m1bridge/m2program/m3sisrute/m3igd)
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
