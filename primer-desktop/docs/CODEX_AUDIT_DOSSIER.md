# CODEX AUDIT DOSSIER — PRIMER: Puskesmas Pagi (REFRESH TOTAL, M0→M7)

> **Untuk:** CODEX (auditor eksternal, deep-check, read-only)
> **Tanggal briefing:** 2026-07-03 · Basis: HEAD branch `claude/vigorous-bose-f66bc6`
> (commit terakhir saat ditulis: `602b576`)
> **Lokasi kode:** `primer-desktop/` (JANGAN tersesat ke root repo — itu game web LAMA berbeda,
> dikerjakan tim/alat lain, arsitektur beda total)
>
> **INI DOSSIER REFRESH TOTAL** — bukan penambahan kecil. Sejak audit CODEX terakhir
> (ronde 3, fokus anamnesis/UX), proyek maju **M3c → M4 → M4.5 → M5 → M6 → M7**,
> plus tiga ronde audit medis solo dan satu ronde UX/DeepThink. Permukaan yang
> BELUM PERNAH dilihat auditor eksternal kini besar: seluruh M4 ekonomi, M4.5 dual-
> seed ujian, M5 endgame, **M6 verifier+dossier kriptografis**, dan **seluruh M7**
> (Pengaturan, Onboarding, BGM, UX edukasi baru). Dossier ini meminta audit **penuh,
> semua aspek** — bukan hanya delta — dengan penekanan khusus pada **checklist E2E
> per-titik** (§6) yang harus ditelusuri satu per satu, bukan disampling.

---

## 0. ATURAN KERAS UNTUK AUDITOR

1. **Dilarang menulis/mengubah/menghapus file apa pun di repo.** Output audit = SATU
   laporan markdown yang kamu kembalikan sebagai teks (bukan file), format di §8.
2. Dilarang menjalankan perintah yang mengubah state (git commit/checkout/reset,
   npm install yang menulis lockfile baru tanpa perlu, penulisan file save).
   **Boleh (read-only/build-only):** membaca file, `npx tsc --noEmit`, `npx vitest run`,
   `npm run build`, `git log/diff/show` read-only, menjalankan app via `npm run dev`
   atau exe hasil `npm run pack` untuk observasi manual (jangan commit apa pun yang
   dihasilkannya).
3. Setiap temuan WAJIB menyertakan `file:baris` + kutipan kode + skenario pemicu
   konkret (langkah pemain persis). **Tanpa bukti kode/langkah = jangan laporkan.**
   Beri tag keyakinan: `[V]` terverifikasi (kamu jalankan/telusuri buktinya sendiri),
   `[A]` analisis kuat (baca kode, belum dieksekusi), `[D]` opini desain (bukan bug).
4. Prioritas audit (urutan TIDAK boleh dibalik): **integritas medis (EBM) >
   integritas asesmen/anti-kecurangan > integritas engine/determinisme >
   keamanan (save/IPC) > UX/aksesibilitas > performa > gaya kode.**
5. **Jangan mengaudit ulang** butir-butir di §3 (riwayat) kecuali kamu punya alasan
   konkret menduga REGRESI (kutip commit/diff yang mencurigakan). Anggaran waktu
   auditmu paling berharga di §4 (belum pernah disentuh) dan §6 (E2E per-titik).
6. Bila kamu punya kemampuan menjalankan aplikasi (dev server / exe hasil pack) —
   **gunakan itu untuk memverifikasi §6 secara langsung**, bukan hanya membaca kode.
   Kalau tidak bisa, telusuri kode dan tandai `[A]` dengan jelas mana yang perlu
   verifikasi manusia.

---

## 1. KONTEKS 90 DETIK

PRIMER: Puskesmas Pagi = game desktop Electron, *"Football Manager-nya kedokteran
komunitas dengan hati Harvest Moon"*. Pemain = dokter fresh-grad, stase **90 hari
Karier** (bebas nilai) atau **30 hari Ujian** (satu-satunya yang dinilai formal,
seed kurikulum dari salah satu dari 8 paket rotasi) di Puskesmas Desa Sukamaju.
Pemakai akhir: ±50 mahasiswa FK yang **DINILAI dari skor game** untuk redeploy
±September 2026 → integritas asesmen adalah kepentingan produk inti, bukan
nice-to-have. Dev = solo (dr. Wirayuda) + AI builder (Claude), bekerja **mono**
(tanpa sub-agent) sepanjang proyek — semua audit sebelumnya juga dikerjakan solo
lalu diverifikasi eksternal (CODEX, DeepThink).

**Baca dulu (urutan disarankan):** `docs/GDD.md` (desain + pilar), `docs/BUILD_SPECS.md`
(kontrak modul), `docs/ROADMAP.md` (riwayat milestone LENGKAP M0→M7 + apa yang
SENGAJA belum ada — jangan laporkan sebagai bug), `docs/M45_MODE_UJIAN.md` (arsitektur
dual-seed), `docs/M6_KELAS_DOSEN.md` (desain verifier+dossier), `docs/AUDIT_EBM_KASUS.md`
(3 ronde audit medis — 72 kasus sudah ditelaah, jangan diulang tanpa alasan).

**Status milestone (2026-07-03):** M0–M7 selesai (M7 minus playtest manusia & ganti
BGM berlisensi). 195 test hijau di 18 file test (`src/{engine,content,renderer}/**`),
`tsc --noEmit` 0 error, `npm run build` sukses.

---

## 2. PETA ARSITEKTUR (DIPERBARUI — termasuk seluruh M4–M7)

```
primer-desktop/
├── src/main/index.ts          Electron main TIPIS: window + IPC save atomik (userData/saves)
│                                sanitizeSlot regex-whitelist; PRIMER_SHOT=path.png → screenshot headless
├── src/preload/index.ts       contextBridge `window.primer` — SATU-SATUNYA API renderer↔OS
├── src/engine/                ★ ENGINE MURNI — NOL React/DOM/Electron/Math.random
│   ├── state.ts               Kontrak GameState (sumber kebenaran bentuk data) + JejakAksi (M6)
│   ├── actions.ts              Union Action (38 varian) — satu-satunya cara mengubah state
│   ├── events.ts                GameEvent (25 varian) — keluaran samping untuk UI juice
│   ├── reducer.ts               advance(state,action,pack)→{state,events}; catat() append log+jejak
│   ├── init.ts                   buildInitialState (dual-seed M4.5) + penjadwalan karma sejak H1
│   ├── clinic.ts                 Encounter klinik + nilaiEncounter; KAPASITAS_EDUKASI=3 (M7)
│   ├── kunjungan.ts               Match engine kunjungan 4 babak + gerbang kejujuran
│   ├── kegiatan.ts (engine)         Posyandu/Prolanis/KLB — dek kartu keputusan (M2)
│   ├── igd.ts                        Mesin IGD turn-based (M3b): langkah/kode_biru/disposisi
│   ├── director.ts                    Antrian harian: Leitner + bias 4A + musim + dual-seed
│   ├── kader.ts                        Scout harian: sensus + bias data + surat laporan
│   ├── surveilans.ts                    Kluster balik UKP→UKM (M1, 14 hari)
│   ├── pispk.ts                          IKS kanonik Permenkes 39/2016
│   ├── paketUjian.ts                     ★M4.5 8 paket rotasi (seedKurikulum tetap) + HARI_STASE
│   ├── badge.ts                           ★M5 9 badge pure + hitungBadge
│   ├── scoring.ts                          Skor 4 dimensi (SATU formula) + Referral Guillotine
│   ├── verifikasi.ts                        ★M6 susunDossier/verifikasiDossier — replay+HMAC
│   ├── save.ts                               Amplop {v:1,state} + migrasi-lite tiap milestone
│   └── core/rng.ts                            Rng deterministik (mulberry32+FNV-1a) — SATU sumber acak
├── src/content/                ★ KONTEN BERTIPE (TS strict, ~5900 baris kasus)
│   ├── types.ts                 Skema kasus/keluarga/skenario/edukasi — kontrak konten;
│   │                              Persona doc-comment (gaya bahasa pasien, M7 34c)
│   ├── pack.ts + index.ts        ContentPack + validasiPack (fail-fast anti-drift id)
│   ├── kasus/*.ts (7 file)         67 kasus poli (4A + wajib-rujuk 3A/3B/2)
│   ├── igd.ts (content)             5 kasus gawat darurat
│   ├── keluarga/*.ts (6 file)         16 keluarga binaan ber-arc (desaA–F)
│   ├── katalog.ts + katalogM3.ts       92 obat/24 lab/37 edukasi(M7 kategori+sinonim)/8 tindakan
│   ├── icd10.ts                         ★kamus ~130 nama ICD-10 (fix "Kode X" telanjang)
│   ├── rumahSakit.ts                     Jejaring rujukan SISRUTE (4 RS kelas D/C/B)
│   ├── skdi144.ts                         144 penyakit FKTP (Dex)
│   └── metadata.ts                         HKI resmi EC002026019623 — JANGAN diubah
└── src/renderer/src/            UI React 19, zustand tipis (store.ts — NOL logika skor)
    ├── screens/                  TitleScreen, MejaKerja, Klinik(+klinik/*), PetaDesa,
    │                               Kunjungan, Kegiatan, Igd, DexSkdi, Rapor, LaporanAkhir
    ├── components/                Hud, Toaster, Pengaturan★M7, Onboarding★M7, TentangModal★M7
    ├── audio/                      synth.ts (WebAudio FM SFX), bgm.ts★M7 (musik file per-konteks),
    │                                useAudio.ts, MuteButton.tsx
    ├── settings.ts★M7               Preferensi non-React (persist localStorage+subscribe)
    ├── usePengaturan.ts★M7            Hook React utk settings.ts
    └── store.ts                        useGame — satu-satunya pemilik GameState di renderer
```

Invarian yang HARUS tetap benar (uji ulang di §6, bukan cuma percaya komentar):
- **Determinisme:** seed+seedKurikulum+urutan aksi sama → state byte-identik
  (test: `selfplay.test.ts`, `soak.test.ts`, `m6verifikasi.test.ts` replay).
- **Action-log = sumber skor:** UI tak pernah menghitung aturan; `state.jejak`
  (M6, `Action[]` penuh, termasuk yang DITOLAK) adalah sumber kebenaran replay.
- **"Setiap angka diperoleh":** UI tak boleh menampilkan data ber-`sumber:'belum'`,
  vital sebelum diukur, atau bocoran jawaban (opsi diagnosis semua bernama setara
  — lihat `icd10.ts` + guard `pack.test.ts`; alergiTrap wajib discoverable —
  guard sama).
- **Firewall alergi class-based** memblokir resep kontraindikasi (poka-yoke).
- **Kuota edukasi (M7):** `TAMBAH_EDUKASI` ke-4 DITOLAK di `clinic.ts` (engine),
  bukan hanya UI — konsistensi wajib dengan replay M6.
- **Engine permisif, UI membatasi** — tapi reducer WAJIB menolak aksi ilegal
  (jangan percaya UI; coba dispatch aksi "mustahil" langsung ke `advance()`).
- **Dossier M6:** skor TIDAK PERNAH dipercaya dari klaim file — `verifikasiDossier`
  mereplay jejak dari `buildInitialState` dan membandingkan; HMAC hanya
  deterrent (kunci ada di app pemain), pertahanan sejati = replay.

---

## 3. RIWAYAT AUDIT — JANGAN DIULANG (kecuali dugaan regresi konkret)

| # | Ronde | Fokus | Hasil | Commit |
|---|---|---|---|---|
| 1 | Review internal M0 | 32 temuan (kebocoran jawaban, autosave, karma, guillotine, dll) | Semua diperbaiki | (pra-M1) |
| 2 | Audit medis internal 5 dokter (M3a) | 51 kasus baru: dosis/indikasi/kontraindikasi | Nol P0, 9 P1/P2 diperbaiki | (M3a) |
| 3 | **CODEX ronde 1** (M0–M3b) | 8 temuan (5 P1+3 P2): IGD disposisi-keliru dihargai sama, rujuk-tanpa-diagnosis, Prolanis farm harian, IGD bocor diagnosis, save mid-IGD macet, validasiPack cuma warn | Semua diperbaiki+diverifikasi | `e6cc04d` |
| 4 | DeepThink strategis (M3b) | 6 pertanyaan (durasi, validitas mekanik baru, cakupan kurikulum, dll) → 4 keputusan konkret | M4 tetap penuh, Mode Ujian M4.5 baru, rebalance ditunda-nunggu-data, Curriculum Director dibangun | `32bd9dc` |
| 5 | **Audit EBM solo** (72 kasus, satu-satu) | 2 fix substantif: asma wajib ICS (GINA), mekanisme `obatAlternatif` (grup pilih-satu) | Diperbaiki | `6e09b52` |
| 6 | **CODEX ronde 2** (EBM eksternal) | 7 temuan medis: apendisitis analgesia (mitos masking), PPOK bundel GOLD, hipoglikemia disposisi, depresi ringan, anafilaksis bifasik, gout ACR 2020, edukasi migrain id-salah | Semua diperbaiki | `8e33d79` |
| 7 | **CODEX ronde 3** (anamnesis/UX) | 7 temuan: ICD banding tanpa nama, cari obat gagal ejaan EN, alergiTrap tak discoverable, skor sabar-habis dapat kredit, 6 kasus tanpa q_alergi, insomnia tanpa safety screen, komentar drift | Semua diperbaiki + guard test baru | `79795df` |
| 8 | **CODEX review UI** (kontras/motion/overlap) | Kontras WCAG token, `prefers-reduced-motion`, bug sistemik mode-malam (tinta gelap di panel gelap 1.24:1), overlay HKI menimpa panel | Semua diperbaiki | `e80fd43`, `453a0e0` |
| 9 | **DeepThink UX edukasi** (2 ronde, tembok 38 chip) | Verdikt Q1–Q6 diterima+2 koreksi (kuota di-engine bukan UI-saja; interceptor-truncate log lama ditolak) | Dieksekusi: taksonomi+tab+baki+formula | `7ac5015` |
| 10 | **Audit bahasa pasien solo** (79 varian) | SEMUA di persona `terpelajar` — jargon dokter di mulut pasien | Ditulis ulang + guard test permanen | `83ce310` |

**Kesimpulan:** integritas medis & UX-anamnesis sudah ditelaah berkali-kali dan
berlapis (internal + CODEX + DeepThink). Nilai marjinal tertinggi audit BARU ada
di §4 — permukaan yang belum pernah dilihat mata eksternal sama sekali.

---

## 4. FOKUS UTAMA — BELUM PERNAH DIAUDIT EKSTERNAL

Urutan sesuai prioritas §0.4, bukan urutan pengerjaan.

### P0/P1 — Integritas asesmen & keamanan mekanisme BARU (M4.5, M6, M7)

1. **[KANDIDAT TERVERIFIKASI — MOHON KONFIRMASI/BANTAH] Seed paket ujian bisa
   di-"reroll" bebas sebelum ada aksi mengikat.**
   - `src/renderer/src/store.ts:78-84` (`mulaiGameBaru`): `seed = hashSeed(namaDokter, Date.now())`.
   - `src/engine/paketUjian.ts:36-38` (`pilihPaket`): `PAKET_UJIAN[Math.abs(seedFlavor) % 8]`.
   - Skenario: mahasiswa pilih mode Ujian, klik "Mulai Stase". Surat sambutan
     (`init.ts` `suratSambutan`) langsung menyebut nama paket di MejaKerja. Bila
     mahasiswa tak suka paket yang didapat (atau justru MENCARI paket tertentu
     yang kuncinya beredar di grup angkatan), tidak ada apa pun yang mencegahnya
     kembali ke layar judul dan memulai lagi dengan nama sama/beda — `Date.now()`
     baru → hash baru → kemungkinan modulo-8 berbeda. Tidak ada "commit lock"
     antara pembuatan seed dan keputusan pemain untuk melanjutkan/mengulang.
   - **Verifikasi yang diminta:** (a) apakah ada mitigasi di alur kelas yang
     TIDAK terlihat dari kode (mis. instruktur assign nama+waktu manual, satu
     kesempatan submit dossier per NIM di sisi dosen — lihat M6 dashboard belum
     dibangun)? (b) apakah reroll benar-benar mengubah paket secara praktis
     (hitung distribusi modulo-8 dari beberapa `Date.now()` berurutan — apakah
     mahasiswa bisa dengan mudah "menyasar" satu paket spesifik lewat trial cepat,
     atau prakteknya acak-tak-terkendali sehingga risikonya rendah)?
   - **Dampak bila dikonfirmasi:** melemahkan asumsi inti M4.5 "rotasi 8 paket
     = anti-walkthrough" — pertahanannya jebol kalau pemain bisa memilih paket.

2. **`verifikasi.ts` (M6) — audit kriptografi & replay belum pernah dilihat mata
   eksternal.** Baca penuh `src/engine/verifikasi.ts` + `src/engine/m6verifikasi.test.ts`
   + `docs/M6_KELAS_DOSEN.md`. Yang perlu ditelusuri:
   - Apakah `stringifyKanonik` benar-benar deterministik untuk SEMUA bentuk data
     yang mungkin ada di `GameState` (mis. `undefined` di dalam array, `NaN`,
     `-0`, nested `Map`/`Set` — GameState tak punya Map/Set setahu penulis, tapi
     verifikasi ini penting)?
   - `sidikJariPack` (FNV-1a atas daftar id konten) — apakah SEMUA perubahan
     konten yang memengaruhi replay benar-benar mengubah sidik jari (mis. bila
     nilai `obatBenar` sebuah kasus diedit TANPA mengubah id kasus/obat itu
     sendiri, sidik jari sama padahal replay lama vs pack baru bisa beda hasil)?
   - `REVISI_ENGINE` (const manual, saat ini `2`) — apakah developer/CI punya
     pengingat untuk menaikkannya tiap kali formula skor/reducer berubah?
     (Saat ini murni disiplin manual — cek commit histori apakah pernah lupa.)
   - Skenario serangan: mahasiswa yang PAHAM kode (mahasiswa FK zaman sekarang
     bisa baca JS) membuka DevTools/console game (apakah build produksi
     mengizinkan ini?), memanggil `verifikasi.ts` punya export `susunDossier`
     yang bisa dipanggil ulang dengan `state` yang sudah dimodifikasi di memory
     sebelum diekspor (bukan file JSON yang diedit setelah ekspor, tapi state
     JS yang dimodifikasi SEBELUM `susunDossier` dipanggil). Apakah ini
     tertangkap oleh replay (karena `jejak` juga berasal dari state yang sama
     yang dimodifikasi)? **Ini beda dari skenario yang sudah diuji test
     (`m6verifikasi.test.ts` menguji tamper SETELAH susunDossier)** — cek apakah
     tamper SEBELUM ekspor (langsung ubah `state.tally` di console lalu ekspor)
     tertangkap juga (harusnya ya, karena replay dari `jejak` independen dari
     `tally` yang disimpan — tapi VERIFIKASI ini secara eksplisit, jangan asumsi).
   - Apakah devtools/console bisa diakses di build produksi (`npm run pack`)?
     Cek `src/main/index.ts` — tidak ada `webContents.openDevTools()` eksplisit,
     tapi cek apakah shortcut default Electron (F12/Ctrl+Shift+I) masih aktif
     di window produksi (`autoHideMenuBar` disetel tapi menu bisa saja masih
     merespons shortcut). Bila devtools bisa dibuka mahasiswa, apakah ada
     eksploitasi lain selain tamper-dossier (mis. langsung memanggil `dispatch`
     dengan aksi yang tak mungkin dari UI, seperti `TAMBAH_EDUKASI` berkali-kali
     memutar `HAPUS_EDUKASI`+`TAMBAH_EDUKASI` untuk trial-error jawaban)?

3. **M7 kuota edukasi — konsistensi engine vs UI.** `clinic.ts` (`TAMBAH_EDUKASI`)
   menolak slot ke-4; `DeckTerapi.tsx` mem-disable chip saat baki penuh. Cek:
   apakah ada jalur lain untuk menambah edukasi melewati kuota (mis. dispatch
   langsung, atau race-condition dari klik cepat berturut sebelum re-render)?
   Cek juga formula `edukasiTarget > 0 ? ... : 1` di `nilaiEncounter` (`clinic.ts`):
   kasus dengan `tatalaksana.edukasi` kosong akan otomatis `skorEdukasi=100`.
   **Builder sudah cek (`[V]`): SAAT INI nol dari 72 kasus punya `edukasi: []`**
   (`grep -rc "edukasi: \[\]" src/content/kasus/*.ts` = 0 semua file) — jadi
   BUKAN celah aktif hari ini. Tapi verifikasi: apakah `validasiPack` atau
   guard test manapun MENCEGAH konten baru menambah kasus ber-edukasi-kosong
   di masa depan (kalau tidak ada guard, celah laten tetap ada untuk kontributor
   konten berikutnya)?

4. **M4.5 dual-seed — cross-contamination antar-mahasiswa via cheat sederhana.**
   Karena `seedKurikulum` sama untuk semua pemegang paket yang sama, dan
   `Director` (`director.ts`) menentukan urutan pasien dari `seedKurikulum`,
   **dua mahasiswa paket sama akan bertemu kasus yang SAMA PERSIS urut-urutan
   harinya**. Apakah nama pasien/persona (dari `seed` flavor) cukup berbeda
   sehingga membandingkan hasil dua mahasiswa TIDAK trivial mengungkap paket
   mereka sama (mis. lewat obrolan "pasienku hari 3 namanya Budi keluhan
   apa")? Ini bukan bug kode, tapi **verifikasi desain**: apakah dua mahasiswa
   paket sama yang duduk bersebelahan bisa saling mencontek REAL-TIME (bukan
   walkthrough tertulis) karena urutan kasusnya identik? Baca `docs/M45_MODE_UJIAN.md`
   apakah risiko ini sudah dibahas & diterima, atau luput.

### P1 — Modul yang seluruhnya belum disentuh audit eksternal

5. **M4 ekonomi penuh** (`reducer.ts` blok `PESAN_OBAT`/`PEMULIHAN`, gudang stok,
   `LEAD_TIME_OBAT=3`, `OPERASIONAL_BULANAN`, `AMBANG_TEGURAN_KAS`, akreditasi
   D60 dari `rmLengkap`) — **CODEX ronde 3 fokus ke anamnesis, bukan ke modul
   ini.** Cek: exploit finansial (kapitasi tak pernah negatif tapi bisa
   di-drain sengaja untuk menghindari `teguranDinkes`? stok obat bisa dipesan
   berlebih tanpa penalti selain uang?), determinisme loop harian baru
   (iterasi `Object.entries(state.gudang.stok)` dsb — urutan memengaruhi
   konsumsi Rng?).
6. **M5 endgame & badge** (`badge.ts`, pacing `faseStase`/`jumlahPasienHarian`/
   `peluangIgd` di `director.ts`, `LaporanAkhir.tsx`) — port pacing ke Mode
   Ujian (kurva dipadatkan 3×) belum divalidasi eksternal. Cek 9 badge:
   apakah kriterianya bisa dipenuhi TANPA benar-benar berkompeten (badge
   sebagai proxy skill yang bisa di-farm)?
7. **`pispk.ts`** (formula IKS Permenkes 39/2016, status N/A demografis) —
   belum pernah diaudit CODEX/eksternal sejak ditulis. Cek kesesuaian formula
   dengan Permenkes asli (dev BUKAN ahli kesmas — potensi salah interpretasi
   bobot 12 indikator).
8. **Seluruh M7 UI baru — ZERO prior external eyes**: `Pengaturan.tsx`,
   `Onboarding.tsx`, `TentangModal.tsx`, `settings.ts`, `usePengaturan.ts`,
   `audio/bgm.ts`. Cek: preferensi tersimpan bertahan lintas restart app (bukan
   cuma reload dev)? `ukuranTeks` ekstrem (0.9 atau 1.4) merusak layout layar
   manapun (overflow, teks terpotong, tombol tumpang tindih)? `modeMalam:'malam'`
   dipaksa di Title Screen sebelum `state` ada — cek kontras token malam di
   SEMUA elemen title, bukan cuma yang sudah diverifikasi builder.

### P2 — Ketahanan & gap struktural

9. **NOL test otomatis untuk 15 layar/komponen React** (`Klinik.tsx`,
   `MejaKerja.tsx`, `PetaDesa.tsx`, `Kunjungan.tsx`, `Kegiatan.tsx`, `Igd.tsx`,
   `DexSkdi.tsx`, `Rapor.tsx`, `LaporanAkhir.tsx`, `TitleScreen.tsx`,
   `Pengaturan.tsx`, `Onboarding.tsx`, `TentangModal.tsx`, `Hud.tsx`, `Toaster.tsx`).
   `find src -name "*.test.tsx"` → 0 hasil (satu-satunya `util.test.ts` menguji
   fungsi murni, bukan komponen). **Semua 195 test yang ada murni engine/content
   — tak satu pun memverifikasi UI benar-benar merender & merespons interaksi
   sesuai state.** Tiga bug playtest minggu ini (ICD kode telanjang, cari obat
   gagal, overlay HKI menimpa panel) SEMUA di lapisan UI dan SEMUA hanya
   ketemu lewat pemain manusia bermain — bukan tertangkap CI. Ini gap
   struktural, bukan satu bug.
10. **Save/load migrasi lintas SEMUA versi skema** (`save.ts`): field baru
    tiap milestone (M1 surveilans/drift, M2 program/prolanis, M3 igd, M4
    gudang/keuangan, M4.5 mode/seedKurikulum/paketUjian, M6 jejak). Simulasikan
    save PALING TUA yang masih ada test-nya (`director.test.ts`/`kunjungan.test.ts`
    fixture manual) dimuat oleh `deserialize` versi kode SEKARANG — apakah semua
    lapis migrasi-lite (`if (!Array.isArray(...)) ... = []` dst.) benar-benar
    dilalui berurutan tanpa saling menimpa?
11. **UI-engine mirror**: layar mana pun yang tombolnya enabled padahal reducer
    akan menolak (sebelum M7 kuota edukasi diverifikasi bebas race — lihat #3).
    Periksa `Igd.tsx`, `Kegiatan.tsx` (delegasi kader, tetapkan program terkunci
    bulanan) untuk pola sama.
12. **Performa**: bundle renderer `index-*.js` ≈1,8 MB (satu file, tanpa
    code-splitting — lihat output `npm run build`). Untuk target *"lab FK spek
    rendah"* (ROADMAP butir 33/36) — apakah ini masalah nyata di PC lama? Beri
    rekomendasi (lazy-load layar per-route?) atau nyatakan tak masalah untuk
    ukuran ini.

---

## 5. YANG SUDAH DIVERIFIKASI AMAN (builder, bukan CODEX — boleh spot-check saja)

- **IPC/save security** (`main/index.ts`, `preload/index.ts`): `sanitizeSlot`
  regex-whitelist `[a-z0-9_-]{1,64}` mencegah path traversal; write atomik
  tmp→rename; `contextIsolation:true`+`nodeIntegration:false`; tak ada
  `dangerouslySetInnerHTML`/`eval`/`innerHTML` di seluruh `src/` (grep nol hasil).
  **Spot-check saja**, jangan audit ulang dari nol — TAPI verifikasi klaim
  "devtools tak bisa dibuka di build produksi" di §4.2 karena builder belum
  memverifikasi ini secara eksplisit.
- **Lisensi BGM**: SUDAH ditandai developer sendiri (bukan temuan baru) —
  `public/bgm/CATATAN_LISENSI.txt`, `ROADMAP.md` butir 32/36 checklist wajib,
  `TentangModal.tsx` menampilkan peringatan. Cukup verifikasi peringatan ini
  tidak hilang/luput bila ada refactor UI Tentang.

---

## 6. CHECKLIST E2E PER-TITIK — TELUSURI SATU-SATU (bukan sampling)

Setiap butir = satu langkah pemain + hasil yang DIHARAPKAN. Tandai tiap butir
PASS / FAIL / TAK-TERUJI(alasan) di laporanmu. Gunakan `npm run dev` (hot reload,
bisa `preview_eval`-style console) atau exe hasil `npm run pack` bila kamu bisa
menjalankan Electron. Bila hanya bisa membaca kode, telusuri path kode persis
sesuai urutan di bawah dan tandai `[A]`.

### A. Boot & Layar Judul
1. Buka app pertama kali (tanpa autosave) → tampil `TitleScreen`, tanpa tombol
   "Lanjutkan", form nama+mode terlihat, mode default `Karier`.
2. Ketik nama kosong/spasi-saja → tombol "Mulai Stase" tidak melakukan apa-apa
   (`namaBersih.length === 0`).
3. Pilih mode "Ujian" → klik Mulai Stase → surat pertama menyebut nama paket
   spesifik (`paket_a`..`paket_h`) dan durasi 30 hari.
4. Tutup app (atau reload) di tengah Hari 1 → buka lagi → tombol "Lanjutkan"
   muncul dengan nama+hari benar; form "mulai baru" masih ada dengan peringatan
   "Stase baru menimpa arsip dr. X".
5. Klik "Impor arsip JSON" dengan file BUKAN JSON valid → alert error, tidak
   crash, tidak mengubah state.
6. Klik "Impor arsip JSON" dengan JSON valid tapi versi skema salah
   (`versi !== 1`) → ditolak dengan alert, bukan diterima diam-diam.
7. Klik "Verifikasi Dossier — untuk dosen" dengan file dossier ASLI (hasil
   ekspor LaporanAkhir) → panel stempel **SAH** hijau, ringkasan skor klaim=replay.
8. Ulangi dengan dossier yang isinya diedit manual (mis. ubah satu angka skor)
   TANPA menghitung ulang ttd → **TIDAK SAH** merah, alasan menyebut "tanda tangan".
9. Ulangi dengan file JSON acak/bukan dossier → **TAK DAPAT DIVERIFIKASI** kunyit,
   alasan jelas ("bukan berkas Dossier Mahasiswa").
10. Slot manual (jika ada slot tersimpan dari sesi lalu): tombol slot menampilkan
    nama/hari/mode benar; klik memuat state itu, bukan autosave.
11. Klik gigi Pengaturan dari Title Screen → modal terbuka, SEMUA slider &
    toggle berfungsi (lihat §N), tutup modal tak memengaruhi form nama yang
    sedang diisi.

### B. Onboarding (Hari 1 pagi, instalasi pertama)
12. Mulai game baru → overlay onboarding muncul OTOMATIS sebelum pemain bisa
    berinteraksi dengan MejaKerja di baliknya (verifikasi z-index benar-benar
    memblokir klik ke belakang, bukan cuma visual).
13. Klik "Lanjut" 5× berturut sampai kartu terakhir → tombol berubah jadi
    "Mulai bertugas →"; klik → overlay hilang, flag `primer.onboarding.selesai=1`
    tersimpan.
14. Reload/mulai game baru LAGI (nama beda) → onboarding TIDAK muncul lagi
    (flag per-instalasi, bukan per-playthrough — verifikasi ini keputusan
    desain yang diinginkan, bukan bug).
15. Klik "Lewati" di kartu manapun (mis. kartu ke-2) → overlay langsung hilang
    DAN flag tetap tersimpan (tak perlu menonton semua kartu untuk "lulus").
16. Tombol "Kembali" berfungsi mundur tanpa mereset progres kartu berikutnya.

### C. Loop Harian Generik (HUD + LANJUTKAN)
17. HUD menampilkan Hari/90 (atau /30 Ujian) + label blok (PAGI/SIANG/SORE)
    + musim + navigasi layar dengan indikator terkunci (🔒) sebelum
    `HARI_BUKA_PETA`/dst.
18. Klik `LANJUTKAN` di blok pagi TANPA menyentuh antrian klinik sama sekali
    → tetap bisa lanjut ke siang (tak ada pasien wajib ditangani sebelumnya)
    — atau JUSTRU diblokir? Verifikasi perilaku aktual vs ekspektasi desain
    (auto-resolve pasien terlewat harus tercatat `autoBermasalah`).
19. Blok siang: HANYA satu dari (Kunjungan ATAU Kegiatan) bisa dipakai per hari
    (`lapanganTerpakai`) — coba akses keduanya, yang kedua harus ditolak/terkunci.
20. Blok sore selalu di MejaKerja; `TULIS_REFLEKSI` di luar blok sore ditolak
    (`err(s, 'Refleksi ditulis di meja kerja, sore hari.')`) — coba dispatch
    manual di blok lain bila memungkinkan.
21. `LANJUTKAN` di sore → hari bertambah, `HARI_BARU` event, IGD subuh bisa
    muncul (`igdHariIni` reset) SEBELUM pemain bisa ke klinik pagi baru.
22. Setelah `HARI_STASE[mode]` terlampaui → `tamat` terset, surat penutup
    masuk, `PINDAH_LAYAR` ke `laporan` baru diizinkan (sebelumnya ditolak
    `err` "Laporan Akhir terbit saat stase berakhir").
23. Setelah tamat, coba `LANJUTKAN`/aksi klinik apa pun → semua ditolak dengan
    pesan "Stase sudah berakhir — skor terkunci".

### D. Meja Kerja
24. Inbox menampilkan surat baru dengan badge jumlah belum-dibaca; klik surat
    → `dibaca:true`, badge berkurang.
25. Gudang Obat (bila ada stok ≤5) menampilkan tombol pesan; `PESAN_OBAT`
    dengan `kapitasi` tak cukup → ditolak; cukup → pesanan masuk antrian
    `tibaHari = hari + LEAD_TIME_OBAT`, muncul lagi tepat 3 hari kemudian.
26. `PEMULIHAN` (akhir pekan) tiap jenis (istirahat/olahraga/keluarga) hanya
    bisa 1× per pekan — coba dispatch dua kali di hari yang sama/pekan sama.
27. `TETAPKAN_PROGRAM` (fokus wilayah) terkunci BULANAN — coba ganti fokus di
    tengah bulan yang sama, harus ditolak; di awal bulan baru, diizinkan.
28. Lokakarya Mini (D31/D61) modal muncul otomatis, `TUTUP_LOKMIN` menutupnya
    permanen untuk sesi itu (tak muncul ulang di hari yang sama).
29. Rekap pekan pertama (`HARI_REKAP_SLICE`) — `TUTUP_REKAP` set flag,
    tak muncul ulang.

### E. Klinik — Lembar Periksa (per-fase, paling kritis)
30. `PANGGIL_PASIEN` saat antrian kosong → ditolak dengan pesan jelas (tak
    crash, tak membuat encounter kosong).
31. Fase Anamnesis: `TANYA` pertanyaan esensial vs distraktor — gauge Sabar
    turun lebih cepat untuk distraktor (verifikasi visual + `sabar` di state).
32. `TANYA` pertanyaan yang SAMA dua kali → tak dobel-hitung di `ditanya`
    (idempoten).
33. Sabar mencapai 0 → jawaban berikutnya adalah `JAWABAN_KETUS`, dan
    pertanyaan itu **TIDAK** masuk `ditanya` (regresi guard: CODEX ronde 3
    P1 — pastikan MASIH benar sekarang, bukan cuma waktu diperbaiki).
34. `LANJUT_FASE` dari anamnesis → pemeriksaan; `UKUR_VITAL` sebelum `LANJUT_FASE`
    berikutnya menampilkan vital (bukan `—`); `PERIKSA` region yang TIDAK
    relevan tetap tercatat sebagai "diperiksa" tapi tak memberi info tambahan
    (SOAP menampilkan "tidak ada temuan bermakna" bukan kosong).
35. `PESAN_LAB`: yang `hasilBesok:true` TIDAK muncul hasilnya hari yang sama
    (harus tampil "menunggu hasil besok"); esok hari hasil baru muncul di
    lembar periksa pasien yang SAMA (bila masih ada) — cek apakah lab lintas-
    hari benar-benar terikat ke pasien yang benar (bukan tertukar).
36. Fase Diagnosis: opsi diagnosis banding SEMUA bernama (regresi guard —
    coba beberapa kasus acak, pastikan TAK ADA "Kode X" telanjang).
37. `KOMIT_DIAGNOSIS` dengan `jenis:'tegak'` vs `'suspek'` pada ICD SALAH
    vs BENAR — 4 kombinasi tercatat ke tally yang tepat (`tegakBenar/tegakSalah/
    suspekBenar/suspekSalah`).
38. Fase Terapi — tab `Resep`: `TAMBAH_OBAT` yang golongan alerginya cocok
    `alergiTrap` pasien → `FIREWALL_ALERGI` event + stempel KONTRAINDIKASI,
    obat TIDAK masuk resep. Cari obat dengan ejaan Inggris (paracetamol,
    amoxicillin) → ketemu (regresi guard ronde 3).
39. Tab `Edukasi`: baki 3 slot; tambah topik ke-4 → **ditolak** (kuota M7,
    lihat §4.3) DAN chip lain di laci menjadi disabled saat baki penuh; hapus
    satu slot → kuota terbuka lagi. Kotak cari mengetik nama topik/sinonim →
    laci yang cocok AUTO-TERBUKA; laci lain tetap tertutup default.
40. `LANJUT_FASE` ke Disposisi TANPA mengisi diagnosis → ditolak (diagnosis
    wajib untuk SEMUA disposisi termasuk rujuk — regresi guard CODEX ronde 1).
41. `DISPOSISI` jenis `rujuk` TANPA `sbar` lengkap → cek apakah SBAR kosong
    diterima (seharusnya memengaruhi `sbarSkor`, bukan diblokir total — cek
    formula `sbarSkor` di `clinic.ts`).
42. `DISPOSISI` jenis `rujuk` DENGAN `rumahSakitId` spesifik vs kosong (auto-pilih)
    → kedua jalur menghasilkan `rujukanTotal` yang benar & tak dobel-hitung.
43. Pasien PRB (`prb:true`) — disposisi `pulang`/`observasi` = tepat; `rujuk`
    ulang = `rujukanNonSpesialistik` (RRNS) naik (regresi guard M3a).
44. Setelah `ENCOUNTER_SELESAI`, `PANGGIL_PASIEN` berikutnya me-reset SEMUA
    field encounter (tak ada sisa resep/edukasi pasien sebelumnya bocor ke
    pasien baru — race-condition check).

### F. Peta Desa & Roster Binaan
45. `PILIH_BINAAN` saat roster sudah `MAKS_BINAAN` (16) → ditolak dengan pesan
    jelas.
46. `LEPAS_BINAAN` keluarga yang arc-nya BELUM selesai → cek apakah ada
    penalti/peringatan (bukan silent, karena bisa jadi jalan pintas
    menghindari karma).
47. Klik kartu keluarga di peta → transisi ke `Kunjungan` HANYA bila keluarga
    itu ada di roster binaan & slot siang belum terpakai; selain itu → tak
    ada aksi / pesan jelas kenapa terkunci.
48. Choropleth RW menampilkan warna sesuai `iks` — bandingkan angka asli di
    `state.desa.rw[i].iks` dengan warna yang dirender (tak terbalik/off-by-one).

### G. Kunjungan Rumah (4 babak)
49. `MULAI_KUNJUNGAN` → fase `observasi`; `KLIK_HOTSPOT` pada hotspot yang
    SUDAH diklik → tak dobel-hitung; hotspot yang TAK ADA di skenario →
    ditolak (bukan crash).
50. `LANJUT_BABAK` sebelum semua hotspot wajib diklik → cek apakah diizinkan
    (mungkin memang boleh, tapi verifikasi ini keputusan sadar, bukan celah).
51. Fase wawancara: `PILIH_DIALOG` node demi node — pilihan ber-gaya
    `konfrontasi` vs tidak memengaruhi `efekTrust` secara berbeda; warga bisa
    `bohong:true` di beberapa node (event `WARGA_BICARA` dgn flag bohong) —
    verifikasi UI TIDAK membocorkan flag ini ke pemain (harus tersembunyi,
    itulah "gerbang kejujuran").
52. `KOMIT_HAMBATAN` dengan hipotesis yang SALAH vs BENAR → `miTepat`/`miTotal`
    tercatat benar; SDOH armor (keluarga miskin) memangkas kenaikan trust 50%
    bila hipotesis meleset — verifikasi angka pemangkasan persis.
53. `PILIH_INTERVENSI` yang TIDAK `cocokUntuk` hambatan yang di-komit →
    diizinkan tapi hasilnya lebih buruk (bukan diblokir) — verifikasi feedback
    tidak instan/membocorkan sebelum hasil akhir kunjungan.
54. `DIUSIR` — kondisi apa yang memicu (trust terlalu rendah? pilihan
    konfrontatif berturut?) dan efeknya ke arc keluarga (arc GAGAL, jam pasir
    karma dipercepat) — telusuri kondisi pemicu persis di kode.
55. Arc keluarga dengan >1 babak (mis. `keluarga_asih` 3-babak) — kunjungan
    kedua dimulai dari `arcIndex` yang benar (bukan mengulang skenario pertama).

### H. Kegiatan Lapangan (Posyandu/Prolanis/KLB)
56. `MULAI_POSYANDU` sebelum `HARI_BUKA_POSYANDU` (D15) → ditolak; RW yang
    masih dalam `COOLDOWN_POSYANDU` (30 hari) → ditolak.
57. `JAWAB_KEGIATAN` kartu demi kartu, lalu `DELEGASI_KEGIATAN` di tengah sesi
    (sisa kartu dijawab kader, error rate 20%) → verifikasi kader BENAR-BENAR
    bisa salah (bukan selalu benar meski "20% error" tertulis) dan hasilnya
    memengaruhi skor kegiatan secara proporsional.
58. `MULAI_PROLANIS` sebelum D30 → ditolak; roster otomatis dari warga kronis
    — verifikasi warga yang muncul benar-benar berpenyakit kronis (bukan
    sembarang KK).
59. 2 sesi Prolanis "tak-terkontrol" berturut → komplikasi bernama muncul di
    antrian poli (bridge UKM→UKP) — verifikasi identitas pasien yang muncul
    cocok dengan warga Prolanis yang gagal dikontrol (bukan pasien acak).
60. `MULAI_KLB` dipicu kluster surveilans → 3 kartu 5W1H; tuntas (≥66%)
    menghapus entri surveilans terkait (dan HANYA yang terkait, bukan semua
    kluster lain yang kebetulan aktif).

### I. IGD (interrupt turn-based)
61. IGD tiba SUBUH (sebelum blok pagi bisa diakses) → `igdHariIni=true`,
    LANJUTKAN/navigasi lain terblokir sampai IGD selesai (`err` di reducer).
62. `AKSI_IGD` pilihan SALAH vs BENAR di tiap langkah → `efekStabilitas`
    memengaruhi arah kasus (mendekati Kode Biru bila salah berturut).
63. Kode Biru → `RJP_IGD` dengan `berkualitas:true/false` → peluang keberhasilan
    deterministik dari `Rng(seed,'rjp',hari,kasusId)` — jalankan 2× dengan
    seed SAMA persis → hasil identik (determinisme); seed BEDA → variatif.
64. `DISPOSISI_IGD` jenis `rujuk` (dgn `rumahSakitId` opsional) vs `pulang` —
    disposisi keliru TERCATAT terpisah (`igdSalahDisposisi`) dan TETAP
    diberi skor (bukan dihargai sama dengan yang tepat — regresi guard CODEX
    ronde 1 finding #1).
65. Kode Hitam (meninggal) → `igdMeninggal` naik, `efekIgd` di `scoring.ts`
    memberi penalti besar (`-3` per kasus) — verifikasi angka ini di formula
    MASIH `-3` (bukan berubah tanpa dokumentasi).
66. Setelah IGD selesai (disposisi apa pun), `igdHariIni` reset di hari
    berikutnya (bukan permanen terkunci).

### J. Dex SKDI
67. 144 entri tampil, terkunci/terbuka sesuai `dex[id]` yang sudah pernah
    ditemui; bintang Leitner 0–3, meluruh setelah `LUNTUR_BINTANG_HARI` (14
    hari) tanpa dilatih ulang — verifikasi peluruhan benar-benar terjadi
    (cek `terakhirHari` vs `hari` sekarang).
68. Entri non-4A (wajib-rujuk) dihitung "dikuasai" bila dikenali-DAN-dirujuk-
    benar (bukan harus ditatalaksana tuntas) — verifikasi kriteria ini di kode
    `director.ts`/`clinic.ts` sesuai klaim.

### K. Rapor
69. 4 dimensi (UKP/UKM/Manajemen/Resiliensi) live-update sesuai `hitungSkor`
    — bandingkan angka di layar dengan hasil manual `hitungSkor(state)` dari
    console/test untuk state yang sama (tak ada drift UI vs engine).
70. Grade huruf (A/B/C/D) sesuai ambang `gradeDariTotal` — cek batas persis
    (mis. total=85.0 vs 84.99 harus beda grade).

### L. Laporan Akhir & Dossier
71. Layar hanya bisa dibuka setelah `state.tamat` ada (coba akses paksa via
    `PINDAH_LAYAR` sebelum tamat → ditolak — sudah dicek di #22, verifikasi
    ulang dari sisi layar ini).
72. Babak sinematik: stempel grade jatuh → count-up 4 dimensi → statistik+
    badge+epilog keluarga — urutan animasi tak memblokir tombol aksi muncul
    terlalu cepat/lambat (race dengan `setTimeout` di komponen).
73. "Ekspor Arsip Save (JSON)" menghasilkan file yang BISA dimuat lagi via
    "Impor arsip JSON" di Title Screen (round-trip).
74. "Ekspor Dossier Mahasiswa" dengan NIM diisi vs kosong — keduanya
    menghasilkan file valid; field `nim` muncul di ringkasan verifikasi hanya
    bila diisi.
75. Epilog keluarga: keluarga dengan `arcSelesai:'berhasil'` tampil beda dari
    `'gagal'` (chip warna + teks epilog benar sesuai `konten.arc.epilogBerhasil`
    vs `epilogGagal`, bukan tertukar).

### M. Save/Load/Slot/Import/Export (lintas layar)
76. Autosave terpicu HANYA pada event tertentu (`HARI_BARU`,
    `ENCOUNTER_SELESAI`, `KUNJUNGAN_SELESAI`, `BLOK_BERGANTI`) — dispatch
    aksi LAIN (mis. `TANYA`) tak memicu tulis-disk berulang (verifikasi
    lewat log/network tab bila memungkinkan, hemat I/O).
77. 3 slot manual (`simpanKeSlot`) independen dari autosave — menyimpan ke
    slot1 tak menimpa autosave atau slot2/3.
78. Slot META (badge+dex lintas-playthrough) — selesaikan satu playthrough
    (atau simulasikan `TAMAT` event), mulai playthrough baru → badge lama
    TETAP muncul di layar judul (`meta.badges`) meski state game baru kosong.
79. Muat save yang di-corrupt manual (edit satu karakter JSON jadi rusak) →
    `deserialize` mengembalikan `null`, UI menampilkan "arsip tidak valid",
    TIDAK crash seluruh app.

### N. Pengaturan & Tentang
80. Slider Volume Musik ke 0 → musik benar-benar senyap (bukan cuma UI angka
    0% tapi audio tetap terdengar) TANPA menghentikan lagu (tetap main di
    volume 0, siap naik lagi) — cek juga interaksi dengan tombol Mute terpisah
    (dua mekanisme berbeda: mute global vs volume 0 — pastikan tak konflik).
81. Slider Volume SFX ke 0 → `sfxStempel`/`sfxBel`/dst tak terdengar; ubah
    lagi ke >0 → SFX berikutnya terdengar TANPA reload.
82. Ukuran Teks ke ekstrem 140% → cek SEMUA layar (bukan cuma Title) untuk
    overflow/tombol terpotong/teks tumpang-tindih — ini yang paling mungkin
    belum diuji builder di semua layar.
83. Mode Tampilan "Gelap" dipaksa saat blok bukan sore → SEMUA token warna
    tetap kontras (bukan cuma yang sudah diverifikasi builder di beberapa
    elemen) — cek Klinik/PetaDesa/Kunjungan/dll dalam mode paksa-gelap siang
    hari (kombinasi yang mungkin belum pernah dicoba: konten "siang" dengan
    palet "malam").
84. "Kurangi Gerak" ON → SEMUA animasi CSS berhenti (grep semua `@keyframes`
    di `src/renderer/src/**/*.css` dan cek satu-satu apakah tercakup selector
    `.kurangi-gerak` global, atau ada yang luput karena scoping CSS).
85. "Kembalikan Default" mereset SEMUA field ke `PENGATURAN_DEFAULT` sekaligus
    (bukan sebagian).
86. Modal Tentang menampilkan HKI+disclaimer+peringatan musik; tombol tutup
    berfungsi dari overlay klik-luar maupun tombol ✕.

### O. Mode Ujian — Perilaku Khusus
87. Skor terkunci tepat di hari `HARI_STASE.ujian` (30) — bandingkan dengan
    Karier yang berjalan sampai 90 (regresi test `soak.test.ts` sudah
    memverifikasi via headless; verifikasi ULANG lewat UI manual bahwa surat
    penutup & layar Laporan Akhir konsisten dengan itu).
88. `paketUjian` tercetak di HUD/surat/dossier secara konsisten di semua
    tempat yang menampilkannya (tak ada satu layar yang lupa update label
    setelah refactor UI).
89. Lihat lagi temuan #1 (seed reroll) — ini KATEGORI TERPISAH dari poin
    teknis lain, prioritas tertinggi untuk diverifikasi/dibantah.

### P. Lintas-Layar / Window / Sistem
90. Resize window ke `minWidth:1200 minHeight:760` (batas minimum di
    `main/index.ts`) → tak ada elemen terpotong/overflow horizontal di layar
    TERPADAT (Klinik dengan resep+edukasi terbuka, Rapor, LaporanAkhir).
91. Buka DevTools (F12/Ctrl+Shift+I) di build **produksi** (`npm run pack`,
    BUKAN `npm run dev`) — apakah berhasil terbuka? (Lihat §4.2 — ini
    verifikasi keamanan konkret, bukan sekadar UX.)
92. Klik link eksternal (jika ada, mis. rujukan guideline) → membuka browser
    OS (`shell.openExternal`), BUKAN window baru di dalam app.
93. Tutup app paksa (Alt+F4 / kill process) di tengah encounter klinik aktif
    → buka lagi → autosave terakhir sebelum encounter itu termuat, TIDAK
    macet di layar kosong/setengah-encounter (regresi guard CODEX ronde 1
    finding "save mid-IGD" — verifikasi pola sama berlaku utk mid-encounter
    klinik biasa, bukan cuma IGD).

---

## 7. CARA MENJALANKAN BUKTI

```bash
cd primer-desktop
npm run typecheck        # tsc --noEmit -p tsconfig.json — harus 0 error
npx vitest run            # harus 195+ pass di 18 file test
npm run build              # electron-vite build — harus sukses, cek ukuran bundle
npm run dev                  # server dev interaktif (hot reload) untuk §6 manual
npm run pack                   # dist/win-unpacked/*.exe — build PRODUKSI utk §6 #91
# Screenshot headless dari exe (lihat main/index.ts):
#   PRIMER_SHOT=C:\path\out.png "dist\win-unpacked\PRIMER - Puskesmas Pagi.exe"
```

Jangan jalankan `npm run dist` (installer NSIS) kecuali perlu — cukup `pack`
untuk audit. Jangan menyentuh `D:\Games\` (salinan main developer) atau folder
save di `%APPDATA%\primer-desktop` (progres developer sungguhan).

---

## 8. FORMAT LAPORAN YANG DIMINTA

```
## Ringkasan eksekutif (≤12 baris — termasuk berapa dari 93 butir §6 PASS/FAIL/TAK-TERUJI)
## Temuan (urut severity, §0.4)
### [P0|P1|P2][V|A|D] Judul singkat
- Lokasi: file:baris
- Bukti: kutipan kode / hasil test / hasil observasi manual
- Skenario pemicu: langkah konkret pemain (rujuk nomor §6 bila relevan)
- Dampak: medis / asesmen / engine / keamanan / UX
- Saran fix (1-3 kalimat, TANPA menulis kodenya ke repo)
## Checklist §6 — hasil per-butir (tabel: No. | Deskripsi singkat | PASS/FAIL/TAK-TERUJI | Catatan)
## Yang dicek dan BERSIH (agar tidak diaudit ulang ronde berikutnya)
```

---

*Dossier ini bagian dari alur triangulasi PRIMER (Claude builder solo · CODEX
auditor eksternal · DeepThink reviewer strategis). Hak Cipta terdaftar: Surat
Pencatatan Ciptaan Kemenkumham RI No. EC002026019623, Nomor Pencatatan
001104039 — © 2026 Anak Agung Bagus Wirayuda MD PhD.*
