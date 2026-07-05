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

---

## 9. RESPONS BUILDER — ronde audit 2026-07-04 (jangan re-report tanpa regresi)

CODEX mengembalikan 9 temuan atas dossier ini. Triase & tindakan (commit
`c088bf5` integritas + `80c9e54` security/UX/kontras):

| # | Temuan | Status |
|---|---|---|
| 1 | Reroll paket ujian (seed dari Date.now) | ✅ FIX: mode ujian seed = `hashSeed('ujian', nama)` deterministik (store.ts) — restart tak bisa memancing paket; karier tetap variatif |
| 2 | Engine terima aksi klinik lompat-fase via dispatch manual | ⏸ DICATAT: engine permisif by-design (invariant "UI membatasi"); skor merefleksikan kerja yang dilewati; exploit praktis butuh DevTools → dinetralkan #5. Guard fase penuh di engine = follow-up (butuh rewrite `clinic.test` yang sengaja permisif) |
| 3 | `sidikJariPack` tak sensitif isi (clue/harga/tatalaksana) | ✅ FIX: kini hash ISI penentu skor per kasus/obat/lab/IGD/skdi (verifikasi.ts); REVISI_ENGINE 2→3 |
| 4 | Identitas/paket bisa dipalsu bila HMAC dihitung ulang | ✅ FIX (sebagian): ikatan nama→seed ujian + banding paketUjian/seedKurikulum hasil replay → swap nama/paket ketahuan. NIM murni (tak memengaruhi replay) tetap tak terikat kriptografis — kontrol prosedural dosen (dokumentasi M6) |
| 5 | DevTools produksi belum dimatikan | ✅ FIX: blokir F12/Ctrl+Shift+I/J/C + hard-reload, tolak devtools-opened, `Menu.setApplicationMenu(null)`; gated `!DEV` (main/index.ts) |
| 6 | Jalan buntu diagnosis (lewati → disposisi disable) | ✅ FIX: tombol "lewati tanpa diagnosis" dihapus; nota SUSPEK (DeckDiagnosis.tsx) |
| 7 | Kontras rendah aksen mode gelap | ✅ FIX: remap aksen malam terang ≥5.5:1, chip latar-gelap, tombol teks-gelap, title selalu 'pagi' (tokens/base.css, App.tsx) |
| 8 | Nol test UI komponen | ⏸ DIAKUI gap tracked (butuh harness jsdom+RTL; follow-up terpisah) |
| 9 | Celah laten edukasi kosong | ✅ FIX: `validasiPack` tolak edukasi wajib kosong (pack.ts) |

Guard test baru: deteksi swap-nama & swap-paket dossier (m6verifikasi.test.ts).
Sisa yang SENGAJA ditunda (butuh keputusan/effort lebih): #2 engine phase-guard,
#8 UI component test harness. 199 test hijau, tsc 0, build OK.

## 10. RESPONS BUILDER — ronde audit ke-3 2026-07-04 (konten/EBM, alat lain)

CODEX (alat/instance terpisah) mengaudit ulang dan mengembalikan 5 temuan level
konten/EBM, di luar 9 temuan §9. Semua diverifikasi manual terhadap kode/konten
sebelum diubah — commit `dbde633`:

| # | Temuan | Status |
|---|---|---|
| 1 | `mm_hipertensi_urgensi` diberi ICD I10 (esensial), padahal narasinya krisis hipertensi | ✅ FIX: I10 → I16.0. Investigasi lanjutan menemukan bug arsitektur lebih besar: `namaDiagnosis()` mengecek skdi144 SEBELUM kode kasus sendiri → 27 kasus salah tampil label generik SKDI utk jawaban benarnya sendiri. Dibalik + guard test baru (util.ts, util.test.ts) |
| 2 | Tifoid: `obatSalahUmum` menjebak amoksisilin, padahal klinis juga valid utk tifoid tanpa komplikasi (kontradiksi klue) | ✅ FIX: dipindah ke `obatAlternatif` (kasusInfeksi.ts) |
| 3 | Gout, OA lutut, LBP, hipertensi urgensi: hubungan terapi "ATAU" dimodelkan sebagai "DAN" wajib di `obatBenar` | ✅ FIX: 3 kasus (gout, LBP, hipertensi urgensi) dikonversi ke `obatAlternatif`; OA lutut disederhanakan jadi parasetamol-dulu (klue menyatakan sekuensial, bukan OR) (kasusMetabolikMsk.ts) |
| 4 | `simvastatin_20` tak punya `golonganAlergi` → firewall alergi (poka-yoke) tak pernah memblokirnya walau `alergiTrap` kasus menarget obat itu utk skor "salah" | ✅ FIX: tambah `golonganAlergi: 'statin'` (katalogM3.ts) |
| 5 | Label SKDI dengue/gastroenteritis "rawan ambigu" | ⏸ DITOLAK: CODEX sendiri menilai ini defensible/prioritas rendah; tak diubah |

Bug tak dilaporkan CODEX, ditemukan solo saat playtest: (a) diagnosis banding
dobel nama (D50.9/O99.0, lihat §7 e97286b) sudah beres di ronde sebelumnya;
(b) hasil lab kosong utk lab di luar daftar kasus (reducer.ts, sudah beres
4da3161); (c) lab dengue (igm_dengue) & HbA1c hilang dari kasus masing-masing
→ ditambahkan (kasusInfeksi.ts, kasusKronis.ts).

E2E smoke test manual (bukan otomatis — masih bagian dari gap #8): boot →
kunjungan rumah penuh (wawancara→diagnosis_perilaku→resep_sosial→selesai) →
Kegiatan/Posyandu → Tentang & Kredit → LaporanAkhir + ekspor Dossier Mahasiswa
(blob diverifikasi berformat `primer-dossier` valid). Nol error konsol di
semua layar, kontras mode gelap diperiksa via screenshot (legible). 200 test
hijau, tsc 0, build + pack OK.

## 11. RESPONS BUILDER — ronde audit ke-5 2026-07-04 (kontras gelap lanjutan + 4 bug fungsional)

Dua laporan CODEX terpisah (alat berbeda) — satu audit kontras mode gelap
lanjutan (root cause dari §7 belum tuntas), satu bug hunt umum. Commit `a526fc0`:

**Kontras mode gelap (root cause tunggal, 10 lokasi):** `--daun-50` &
`--kunyit-100` adalah token LATAR yang tak ikut diremap gelap di §7 — hanya
token TEKS/aksen (`--daun-700/800`, `--kunyit-600/700`) yang diremap terang.
Kombinasi latar-terang-tak-berubah + teks-diremap-terang jatuh ke ~1.1–2:1.
✅ FIX: wash rgba tembus pandang per lokasi (pola sama `.chip--daun/kunyit`
yang sudah benar) — `klinik-banding--aktif`, `klinik-tinta-pilih__opsi--aktif`,
`hud__tab--aktif`, `igd__opsi--rjp`, `kunjungan-stepper__langkah--aktif`,
`kunjungan-intervensi--terpilih`, `peta-roster-item--aktif`,
`kegiatan__opsi--benar/salah`, `sisrute-rs__kartu--dipilih`,
`dexskdi-detail__clue-teks`, `laporan__badge--raih`. `hud__badge` (teks gelap)
dan `.folder` (`--kertas-300` → `--bg-sunken`, token yang SAMA nilainya di
siang tapi sudah benar diremap gelap) dapat fix lebih sederhana.

| # | Temuan (laporan bug hunt) | Status |
|---|---|---|
| 1 | `window.__game` terekspos di renderer | ⏸ BASI: sudah tak ada di HEAD saat audit — sisa debug hook sesi kerja sebelumnya yang lupa dihapus sebelum snapshot diambil, bukan kode yang di-commit |
| 2 | `obatAlternatif` tak "exactly one" — polifarmasi tak dihukum | ✅ FIX SEBAGIAN: tambah penalti −20 khusus bila ≥2 ANTIBIOTIK dari satu grup diresepkan sekaligus (tifoid). Kombo amlodipin+kaptopril (hipertensi urgensi) SENGAJA tak dihukum — dua antihipertensi oral bertahap klinis wajar, beda dari polifarmasi antibiotik tanpa manfaat tambahan |
| 3 | Prosedur klinis (Epley/ekstraksi serumen/tampon epistaksis/nebulisasi) ada di konten+katalog tapi tak ada UI/scoring | ⏸ DIAKUI gap nyata — field `prosedur` divalidasi tapi tak ada deck/aksi/skor. Butuh desain UI+engine baru (bukan tambal cepat), follow-up terpisah spt #2/#8 di §9 |
| 4 | Dex SKDI baca `SKDI144` mentah, bukan `PACK.skdi144` (versi auto-tautan ICD) | ✅ FIX: 23 entri dulu permanen "???" walau kasusnya sudah ditangani (dikonfirmasi: raw 129 tanpa kasusId vs PACK.skdi144 106 tanpa kasusId = selisih 23, persis klaim CODEX) |
| 5 | Rapor/LaporanAkhir angka tak konsisten | ✅ FIX: Rapor hardcode "dari 90"/"Hari 91" di mode ujian (30 hari) → pakai `HARI_STASE[mode]`, kalender musim disembunyikan di ujian. LaporanAkhir hitung ulang akurasi dari `diagnosisBenar/totalPasien` (beda dari formula resmi scoring.ts yg penyebutnya +`autoBermasalah`) → pakai `skor.rincian.akurasiDiagnosis` |
| 6 | Kontras mode gelap | ✅ FIX — lihat di atas |
| 7 | Seed ujian bisa "dipilih" lewat variasi ejaan nama (NIM opsional) | ⏸ DITUNDA: sudah ada mitigasi (ikatan nama→seed di verifikasi §9 #4 mendeteksi swap), tapi murni "coba-coba ejaan sebelum submit resmi" belum dicegah. Butuh keputusan kebijakan (wajib NIM di awal? kunci nama setelah hari 1?) — bukan bug murni kode |

Verifikasi: 201 test hijau (2 baru: penalti polifarmasi antibiotik +
non-regresi redundansi aman), tsc 0, build+pack OK. Fix kontras diverifikasi
via computed style langsung (bukan cuma visual) + reload penuh (hindari
salah baca krn HMR stale). Fix Rapor diverifikasi di kedua mode (karier 90h
+ ujian 30h) — tak ada regresi silang.

## 12. Follow-up #2 & #8 (§9) TUNTAS — phase-guard + harness test komponen

Dua item yang sejak §9 sengaja ditunda ("butuh keputusan/effort lebih")
sekarang dikerjakan (commit `8b76c25`, `ac42251`):

**#2 Engine phase-guard.** `aksiKlinik` (clinic.ts) dulu menerima aksi
kategori manapun di fase manapun — TANYA/UKUR_VITAL/PERIKSA/PESAN_LAB/
KOMIT_DIAGNOSIS/TAMBAH_OBAT dkk semua bisa di-dispatch langsung dari fase
`anamnesis` tanpa pernah lewat `LANJUT_FASE`. UI (DeckAksi) sudah membatasi
lewat rendering, tapi engine sendiri permisif — dispatch manual (headless/
API) bisa melompat fase. Kini tiap kategori aksi dijaga `bukanFase()`: hanya
sah di fase kanoniknya (anamnesis/pemeriksaan/diagnosis/terapi), ditolak
ERROR_AKSI di fase lain. DISPOSISI (reducer.ts) dapat guard serupa —
sekarang menolak walau diagnosis sudah di-komit bila fase belum `disposisi`.
Efek samping: banyak test lama SENGAJA permisif (dispatch aksi terapi/
diagnosis langsung dari fase anamnesis default) — ditulis ulang memakai
`buatEncounterFase()` (fast-forward test) atau `LANJUT_FASE` eksplisit utk
sequence yang meniru playthrough asli (termasuk test "permainan asal-asalan"
yang tetap harus lewat transisi fase, cuma skip datanya). 38 test baru
mengunci matriks lengkap (9 kategori aksi × 4 fase salah).

**#8 Harness test komponen.** Nol test UI React otomatis sejak awal proyek
— semua verifikasi manual lewat preview tools (Claude Preview), tak
berulang di CI. Setup @testing-library/react + jest-dom + user-event +
jsdom; `environmentMatchGlobs` di vitest.config.ts memisahkan test komponen
(*.test.tsx → jsdom) dari test engine/content (*.test.ts → node, tetap
secepat sebelumnya). 2 test komponen ditulis dan DIBUKTIKAN bertaring —
sengaja dikembalikan ke versi bug lalu dipastikan test merah, baru
dikembalikan ke versi fix:
- `DexSkdi.test.tsx` — regresi langsung utk bug §11 #4 (baca SKDI144 mentah)
  memakai entri auto-tautan nyata.
- `Hud.test.tsx` — total hari per-mode (kelas bug sama dgn §11 #5 Rapor),
  wiring klik→dispatch, guard navigasi terkunci saat encounter aktif.

247 test hijau total (46 baru), tsc 0, build OK. Follow-up lanjutan (kalau
mau memperluas cakupan #8): tulis test serupa utk layar besar lain
(Klinik/Kunjungan/LaporanAkhir) — pola & harness sudah berdiri, tinggal
diulang per layar.

## 13. RESPONS BUILDER — ronde audit ke-7 2026-07-04 (bug hunt pasca phase-guard)

CODEX mengaudit ulang setelah §12 (phase-guard + harness), read-only, dan
mengembalikan 10 temuan. Commit `be3f08d` (engine/integritas) + `c972992` (UI):

| # | Temuan | Status |
|---|---|---|
| 1 | `PESAN_LAB` yang ditolak phase-guard tetap membakar kapitasi & membuat jadwal hasil lab | ✅ FIX P1 KRITIS: reducer.ts mengecek `enc.labDipesan` (state SEBELUM aksiKlinik), bukan `hasil.enc.labDipesan` (SESUDAH) — penolakan clinic.ts tak pernah terlihat. Repro CODEX (3× PESAN_LAB fase salah → kapitasi tetap berubah) direproduksi persis via git-stash-lalu-test sebelum fix, lalu dipastikan hijau sesudah |
| 2 | Test m3sisrute masih merah pasca phase-guard | ⏸ BASI: sudah 8/8 pass di HEAD — CODEX mengaudit snapshot sebelum commit `8b76c25` selesai, bukan kode ter-commit |
| 3 | `REVISI_ENGINE` tak naik walau phase-guard mengubah semantik replay | ✅ FIX: 3→4, histori dicatat |
| 4 | `sidikJariPack` tak sensitif thd pemeriksaanFisik/oldcarts/distraktor/rumahSakit/arc keluarga — probe CODEX menunjukkan hash tak berubah walau field itu diubah | ✅ FIX: semua field itu kini ikut di-hash. 4 test regresi baru, masing-masing dibuktikan merah dulu terhadap versi lama |
| 5 | Prosedur klinis (Epley/serumen/tampon/nebulisasi) belum playable/scored | ⏸ DIAKUI, sudah tercatat §11/§12 — perlu desain UI+engine baru, bukan tambalan |
| 6 | `obatAlternatif` cuma menghukum polifarmasi ANTIBIOTIK; kombo amlodipin+kaptopril (hipertensi urgensi) masih bebas penalti | ⏸ DITOLAK dgn alasan (sudah dijawab §11 #2): kombo dua antihipertensi oral bertahap klinis wajar, beda dari antibiotik stacking tanpa manfaat tambahan — bukan bug, keputusan desain sengaja |
| 7 | Identitas ujian nama-only, NIM opsional | ⏸ DITUNDA (sudah tercatat §11/§12): keputusan kebijakan, bukan bug kode |
| 8 | LaporanAkhir grade B pakai `stempel--daun`, kelas yang tak ada di CSS | ✅ FIX: disamakan dgn `WARNA_STEMPEL` di Rapor.tsx (B → `stempel--biru`) |
| 9 | Reduced motion (toggle + OS) tak menghentikan `requestAnimationFrame`/`setTimeout` di LaporanAkhir | ✅ FIX: `useMotionDikurangi()` (gabung toggle manual + `prefers-reduced-motion`) — count-up lompat ke target, babak lompat ke akhir tanpa jeda dramatis |
| 10 | Sisa kontras gelap: `.kunjungan-hotspot--ketemu` & `.kunjungan-potret` (~1.9:1) | ✅ FIX: pola sama `.tombol--utama` — teks gelap saat latar `--daun-600/700` diremap terang |

Verifikasi: setiap fix P1 (#1, #3, #4) dan #8/#9/#10 diverifikasi dgn
git-stash-kembalikan-versi-lama → pastikan test/computed-style memang gagal
sesuai klaim CODEX → kembalikan fix → pastikan hijau lagi (bukan cuma
"test baru lolos", tapi benar-benar dibuktikan test itu punya taring).
9 test baru (5 engine + 4 sidik jari). 252 test hijau, tsc 0, build+pack OK,
exe di-redeploy ke D:\Games.

## 14. RESPONS BUILDER — ronde audit ke-9 2026-07-04 (save/load defensif)

CODEX mengaudit save/load & ekonomi setelah §13, read-only. Commit `b7fb115`:

| # | Temuan | Status |
|---|---|---|
| 1 | `save.ts` cuma cek LEVEL-ATAS `gudang`/`keuanganBulan` sbg objek — isinya bisa tetap rusak (`gudang={}` throw di backfill; `gudang.stok[id]="banyak"` → NaN saat resep; `keuanganBulan={}` → NaN belanjaObat) | ✅ FIX: sanitasi ISI (bukan cuma bentuk) sebelum backfill lama jalan — entri rusak dibuang, field keuangan direset 0 |
| 2 | `klinik.aktif` dgn kasusId yg sudah hilang dari pack → soft-lock permanen (semua aksi klinik + LANJUTKAN gagal, tanpa jalan keluar) | ✅ FIX: pola sama persis dgn pemulihan IGD yang sudah ada — dibuang otomatis + surat kompensasi saat deserialize |
| 3 | `PESAN_OBAT`: perbandingan `< 5 \|\| > 50` selalu false utk NaN — lolos gerbang, meracuni kapitasi | ✅ FIX: tambah `Number.isFinite()` sebelum `Math.round` |
| 4 | Aksi manajemen (PESAN_OBAT/TETAPKAN_PROGRAM/PILIH_BINAAN/LEPAS_BINAAN/TULIS_REFLEKSI) tak memicu autosave (events:[]) — bisa hilang kalau app ditutup sebelum event autosave besar berikutnya | ✅ FIX: `AKSI_AUTOSAVE` berbasis action.type utk aksi jarang-tapi-bermakna ini |
| 5 | Prosedur klinis belum playable/scored | ⏸ DIAKUI, sudah tercatat §11/§12/§13 |
| 6 | Identitas ujian/NIM belum benar-benar terikat | ⏸ DITUNDA, sudah tercatat §11/§12/§13 — keputusan kebijakan |

Verifikasi: git-stash-kembalikan-versi-lama utk save.ts+reducer.ts →
pastikan 6 test save.test.ts baru + 1 test m4ekonomi.test.ts baru gagal
persis sesuai klaim CODEX → kembalikan fix → hijau lagi. 259 test hijau,
tsc 0, build+pack OK, exe di-redeploy ke D:\Games.

## 15. RESPONS BUILDER — ronde audit ke-10 2026-07-04 (5 temuan; 2 keputusan desain user)

CODEX mengaudit lagi read-only (baseline 259 test). Semua 5 temuan NYATA & ditriage.
Untuk #4 & #5 (bukan bug tapi keputusan scope/kebijakan) user memilih via AskUserQuestion:
"wire prosedur jadi mekanik ternilai" + "ikat NIM sekarang". Commit `055feac` (#1-3),
`994c458` (#5), `8ed8d19` (#4).

| # | Temuan | Status |
|---|---|---|
| 1 | Slot lapangan siang bisa dipakai 2×: `MULAI_KUNJUNGAN` cuma cek `hasilKunjunganHariIni`, tak cek `lapanganTerpakai` (di-set kegiatan) → posyandu/prolanis/KLB LALU kunjungan lolos di siang sama | ✅ FIX: guard `lapanganTerpakai \|\| hasilKunjunganHariIni` di reducer + cermin PetaDesa.tsx (cekSlotKegiatan sudah benar) |
| 2 | Sidik jari dossier tak sensitif isi IGD (cuma daftar ID), kader (ketelitian/bias), RW (jarak/totalKk) — padahal semua penentu skor/replay | ✅ FIX: hash isi IGD (pilihan-benar/efek/disposisi) + kader + RW; REVISI_ENGINE 4→5 |
| 3 | `deserialize` masih loloskan nested rusak: `klinik={}`/`antrian=null` → LANJUTKAN throw; `desa.rw={}` → day-advance throw; `prolanis={}` → MULAI_PROLANIS throw; `program.fokus` invalid → throw | ✅ FIX: backfill klinik.antrian/selesaiHariIni/autoHariIni; prolanis.roster; buang program.fokus tak dikenal; desa.rw korup → tolak null (no-autosave bersih) |
| 4 | Prosedur klinis (field mati, 4 kasus) tak playable/scored | ✅ WIRE (keputusan user): aksi TAMBAH/HAPUS_TINDAKAN + EncounterState.tindakan + skoring (slot terapi + penalti tindakan di luar) + tab "Tindakan" di DeckTerapi; REVISI_ENGINE 6→7 |
| 5 | Identitas ujian nama-only, NIM opsional | ✅ IKAT (keputusan user): seed ujian = hashSeed('ujian', nim), GameState.nim, TitleScreen wajib NIM, verifier cek NIM; REVISI_ENGINE 5→6 |

Verifikasi: tiap fix git-stash-bergigi (revert → test merah persis gejala → pop → hijau).
#1 teeth halus: pakai keluarga_santoso (visitable) + stamina penuh + assert pesan "Slot
lapangan" agar bukan green-palsu dari alasan lain. #4 test pakai fixture mock lokal
(clinic.test.ts sengaja tanpa konten nyata) — tambah KASUS_PROSEDUR + tindakan mock.
Smoke browser: tab Tindakan render di terapi (8 chip, toggle+counter), field NIM muncul di
mode ujian (submit-gating), nol error konsol. 279 test hijau, tsc 0.

Sisa deprecation minor (belum diapa-apakan, bukan bug): `environmentMatchGlobs` deprecated
di vitest.config.ts — warning, bukan breakage; migrasi ke `test.projects` ditunda (berisiko
mengganggu split jsdom/node yang sudah jalan).

## 16. RESPONS BUILDER — ronde audit ke-11 2026-07-04 (5 temuan; kegiatan lapangan bocor)

CODEX read-only lagi (baseline 275 test). Commit `94722ad`.

| # | Temuan | Status |
|---|---|---|
| 1 | Sesi kegiatan (posyandu/prolanis/KLB) aktif tak menahan navigasi: `PINDAH_LAYAR` tak guard `state.kegiatan`, HUD tak disable tab, `LANJUTKAN` tak menahannya — pemain klik tab HUD keluar lalu lanjut hari, sesi lenyap tanpa skor (`hariBaru` reset `kegiatan` tanpa syarat) | ✅ FIX: guard engine-authoritative di PINDAH_LAYAR + LANJUTKAN (pola sama kunjungan/klinik/igd) + Hud.tsx disable semua tab |
| 2 | `lapanganTerpakai` baru true SETELAH kegiatan selesai, bukan saat mulai → celah ini (sebelum #1 ditutup) izinkan `MULAI_KUNJUNGAN` lolos SAMBIL kegiatan berjalan (serentak) | ✅ FIX: `MULAI_KUNJUNGAN` cek `s.kegiatan` (simetris `cekSlotKegiatan`) + cermin PetaDesa.tsx |
| 3 | `desa.keluarga=null` lolos objek-check `desa` → THROW di hariBaru; entri `desa.rw` non-objek → THROW backfill bonusIks (strict-mode ESM); `layar` tak pernah divalidasi → App.tsx render kosong tanpa throw | ✅ FIX: `desa.keluarga` divalidasi (tolak spt tally korup); entri `desa.rw` non-objek → tolak seluruh save; `layar` tak dikenal dipulihkan derive dari sesi aktif (igd>kunjungan>kegiatan>klinik.aktif>'meja') — bukan asal 'meja', cegah kunci baru |
| 4 | `Kegiatan.tsx`/`Igd.tsx` `return null` diam-diam saat sesi hilang — luput ErrorBoundary (no throw) | ✅ FIX: panel pemulihan (pesan+tombol) di kedua layar (Igd.tsx punya defek identik, dibereskan sekalian meski CODEX cuma flag Kegiatan) |
| 5 | `environmentMatchGlobs` deprecated (vitest) | ⏸ dicatat, bukan bug, ditunda (sudah tercatat §15) |

Verifikasi-bergigi: revert reducer.ts → 3 test merah; revert Hud.tsx → 1 test merah;
revert save.ts → 5/6 test merah (1 non-regresi tetap hijau, sesuai harapan). Smoke
browser: boot bersih ke Peta Desa hari 2 (konten asli, bukan mock), nol error
konsol — day-15-kegiatan-aktif sendiri diverifikasi via engine+jsdom (bukan klik
manual 40+ hari; trade-off disengaja, dicatat eksplisit ke user). 289 test hijau,
tsc 0.

## 17. RESPONS BUILDER — ronde audit ke-12 2026-07-04 (save.ts lanjutan + temuan region ganda)

CODEX read-only lagi (baseline 289 test). Commit `074e24f`.

| # | Temuan | Status |
|---|---|---|
| 1 | `flags=null`/`refleksi=null` tak divalidasi → THROW di hariBaru/render MejaKerja; `desa.kader='rusak'` (string) lolos objek-check → THROW di kader.ts sort; `prolanis.roster` entri non-shape lolos → narasi "undefined" ke pemain | ✅ FIX: flags/refleksi backfill `{}` (recovery); desa.kader tolak seperti rw/keluarga (entangled skor PIS-PK); prolanis.roster disaring per-shape |
| 2 | `.find()` di clinic.ts (PERIKSA) DAN LembarPeriksa.tsx (SOAP-sheet) sama-sama cuma ambil entri pemeriksaanFisik PERTAMA saat kasus punya ≥2 entri region SAMA (BPPV/Bell's palsy/glaukoma/hordeolum/serumen dll, 16+ kasus) — entri kedua permanen tak terlihat, meski skoring tak terdampak | ✅ FIX: `temuanUntukRegion()` (exported clinic.ts) menggabung semua temuan region — dipakai di KEDUA titik (bukan cuma satu) |
| 3 | `.klinik-regio__chip--sudah`/`.klinik-eduk__chip--dipilih` pakai `--daun-100` tanpa override malam → ~1.35:1 | ✅ FIX: pola persis `.klinik-banding--aktif` (rgba translusen, precedent 5x di file lain) |
| 4 | skabies/mm_dislipidemia tanpa RPS esensial, kia_kb_konseling cuma 1 dimensi OLDCARTS | ⏸ dicatat, TIDAK diubah (judgment konten/klinis, bukan bug — sama pola dgn anamnesis rebalance yg sudah dijadwalkan) |
| SKDI144 duplikat ICD (N76.0/B35.0/S00-S09) | CODEX sendiri: "bukan bug blocker", layak review taksonomi | ⏸ dicatat, tak diapa-apakan |

Ditemukan SAMBIL kerja (di luar laporan CODEX, bukan bug yg sama): warna teks
kedua chip di atas ternyata TAK resolve ke `--daun-800` yang dimaksud —
`base.css .chip { color: var(--tinta-lembut) }` menang di cascade (spesifisitas
sama, urutan bundle menang) — di KEDUA mode, bukan cuma malam. Terpisah dari
kontras latar yang baru difix. **Di-spawn_task terpisah** (task_69f2c7e7),
TIDAK difix di ronde ini (butuh investigasi urutan import/spesifisitas
tersendiri, di luar scope temuan CODEX kali ini).

Verifikasi-bergigi: revert save.ts → 4 test merah; revert clinic.ts → 4 test
merah. Smoke browser: background rgba terkonfirmasi via preview_inspect
(warna teks itu sendiri bukan bagian klaim CODEX #3, hanya insidental
ditemukan). 297 test hijau, tsc 0.

## 18. RESPONS BUILDER — triase DeepThink kode 2026-07-04 (5 blind spot skoring & flow)

Ini triase pertama DeepThink terhadap KODE (bukan strategi/design) — sebelumnya
DeepThink hanya mereview dokumen desain. Tetap dicatat di dossier yang sama
demi satu jejak audit kontinu. Commit `7a373e1`.

| # | Temuan | Status |
|---|---|---|
| 1 | `menungguLabBesok` tak cek RELEVANSI lab (bisa pesan lab apa saja demi proteksi skor 70); DAN reducer.ts mengecualikan observasi-menunggu-lab dari SEMUA jadwal kembali — pasien LENYAP permanen dari game | ✅ FIX: wajib lab relevan di clinic.ts+reducer.ts (sinkron); jadwalkan kembali besok pagi utk evaluasi hasil (netral) |
| 2 | Klik distraktor SETELAH sabar habis tak tercatat di `ditanya` (disengaja, cegah kredit palsu) tapi jadi lolos TANPA penalti apa pun — spam gratis | ✅ FIX: field baru `ditanyaKetus` — distraktor pasca-ketus tetap dihukum, esensial pasca-ketus tetap tanpa kredit (fix lama dipertahankan) |
| 3 | `antibiotikTanpaIndikasi` dihitung tapi cuma masuk tally, tak pernah memotong `skorTerapi` sendiri | ✅ FIX: −25 di formula skorTerapi, bertumpuk di atas obatDiLuar (pola sama obatBerbahaya) |
| 4 | SBAR: isi 1 kolom lalu copy-paste ke 4 kolom S-B-A-R meloloskan panjang+angka tanpa berpikir klinis | ✅ FIX (dgn koreksi): deteksi duplikat antar kolom TERISI saja → −50; dua kolom kosong "sama" bukan copas |
| 5 | Pasien di-skip di antrian pagi lalu "bermasalah" cuma angka statistik (autoBermasalah) — min-maxer bisa hitung skip lebih aman drpd periksa & berisiko salah | ✅ FIX: pasien skip+bermasalah (kasus punya konsekuensi) dijadwalkan kembali dgn kondisi memburuk — kelalaian jadi nyata |

Dua koreksi terhadap kode yang diusulkan DeepThink (bukan sekadar tempel apa
adanya): (a) fix #2 semula diusulkan `ditanya` SELALU bertambah (fix satu-baris)
— ini AKAN meregresi fix CODEX sebelumnya (esensial pasca-ketus dapat kredit
palsu lagi); dipakai desain 2-array agar penalti & kredit bisa dibedakan tanpa
regresi. (b) fix #4 semula `isianUnik.size < isian.length` tanpa filter kosong
— akan menghukum GANDA mahasiswa yang sekadar belum isi 2 kolom (bukan copas);
ditambah filter hanya bandingkan kolom terisi.

REVISI_ENGINE 7→8. Verifikasi-bergigi: revert clinic.ts → 8 test merah (4
regresi-guard tetap hijau by design, bukti fix tak overreach); revert
reducer.ts → 3 test merah (1 regresi-guard hijau). 311 test hijau, tsc 0.
Tak ada file .tsx/.css tersentuh — murni engine, browser-verify dilewati.

## 19. RESPONS BUILDER — triase DeepThink ronde-2, 2 laporan gabungan (10 temuan) 2026-07-04

Dua laporan DeepThink berturut-turut (masing-masing 5 "blind spot"), semua
diverifikasi terhadap kode SAAT INI (bukan diterima mentah) sebelum diputuskan
FIX/STALE/REJECTED/FLAGGED. Commit fix: `4af90f0`.

**Laporan 1 (5 temuan):**

| # | Temuan | Status |
|---|---|---|
| 1 | "Polifarmasi Halal": stacking NSAID/analgesik dalam satu grup `obatAlternatif` lolos penalti + naikkan kapitasi | ❌ REJECTED: audit penuh semua grup `obatAlternatif` konten nyata — tiap grup 2-item memasangkan kelas obat BERBEDA (kombinasi terapi sah), satu-satunya grup 3-item semua-antibiotik sudah dicek existing. Nol instance exploitable di konten nyata. |
| 2 | "Lubang Hitam Observasi": pasien lenyap pasca observasi+lab-besok | ⏸️ STALE: sudah fix di `7a373e1` (§18 #1) |
| 3 | "Triase Anggaran Harian": `TETAPKAN_PROGRAM` lock cuma cek `fokus`, `rwFokus` bisa diganti harian | ✅ FIX: guard kini cek fokus DAN rwFokus (lihat commit di atas) |
| 4 | "Hukum Kemalasan LANJUTKAN": pasien di-skip cuma statistik | ⏸️ STALE: sudah fix di `7a373e1` (§18 #5) |
| 5 | "Eksploitasi SBAR Copy-Paste" | ⏸️ STALE: sudah fix di `7a373e1` (§18 #4) |

Plus pujian `director.ts` pity-timer — tak ada aksi, sudah dianggap solid.

**Laporan 2 (5 temuan + 1 bonus):**

| # | Temuan | Status |
|---|---|---|
| 1 | "Hukum Bilangan Kecil": `rasioKunjungan`/`kualitasMi` pakai `Math.max(1,total)` — 1 kunjungan sukses = rasio 100% selamanya | ✅ FIX: lantai `EKSPEKTASI_KUNJUNGAN_KARIER`(24)/`_UJIAN`(8) sbg penyebut (lihat commit) |
| 2 | "Arbitrase Akurasi via Lab Shotgunning": pesan semua lab menjamin akurasi diagnosis krn penalti cuma di Manajemen (dimensi kecil) | ❌ REJECTED (misconceived): `diagnosisBenar` dihitung dari kecocokan ICD yg dikomit vs `diagnosisBanding`/rencana kasus — TIDAK bergantung mekanis pada jumlah lab dipesan. Lab shotgun menambah `labTakRelevan` (penalti Manajemen) tapi tak menaikkan akurasi sama sekali. |
| 3 | "Boikot Rujukan": berhenti merujuk setelah 2 kesalahan menghindari guillotine `rujukanTotal≥3`, cuma kena penalti cowboy linear yg lebih kecil | 🚩 FLAGGED: tegangan nyata dgn keputusan desain eksplisit (guillotine butuh sampel ≥3 demi proteksi sampel-kecil — lihat §18 area terkait). Analisis order-2: interaksi `nilai.cowboy` × `pantasKonsekuensi` melemahkan klaim "boikot selalu lebih aman" drpd analisis scoring.ts-terisolasi DeepThink, tapi tegangan desainnya tetap sah. Perlu keputusan user: perketat cowboy-linear, atau terima trade-off sbg harga proteksi sampel-kecil? |
| 4 | "Mesin Waktu Offline": save-file backup/restore exploit; DeepThink usulkan telemetri wall-clock deltaMs | 🚩 FLAGGED: pertanyaan arsitektur — engine ini sengaja deterministik (tanpa wall-clock/Math.random) demi replay verifier (§ M6). Menambah wall-clock telemetry adalah perubahan filosofi, bukan bug fix. Perlu keputusan user. |
| 5 | "Subsidi Kepengecutan": stempel SUSPEK dgn kredit parsial utk diagnosis salah-tapi-berlindung dituduh mendorong hedging permanen | ❌ REJECTED: dihitung ambang break-even akurasi (~80%) scr aljabar — ini "kalibrasi epistemik" yg DISENGAJA (TEGAK/SUSPEK dual-stamp menghargai kejujuran kepercayaan diri diagnostik, bukan bug). Fitur berfungsi sesuai desain. |
| Bonus | UI answer-shuffle pakai `rngFlavor` utk gagalkan walkthrough WhatsApp mekanis | 🚩 FLAGGED: fitur baru substansial (bukan bug fix), perlu sign-off scope dari user. |

REVISI_ENGINE 8→9 (kedua fix mengubah semantik replay/skor — dossier lama
kini bisa mereplay ke ERROR_AKSI atau UKM berbeda, harus jatuh ke "tidak
dapat diverifikasi", bukan TIDAK SAH palsu).

Verifikasi-bergigi: revert reducer.ts → 1 test rwFokus-lock merah (1
regresi-guard tetap hijau); revert scoring.ts → 3 test lantai-kunjungan
merah (1 regresi-guard "volume tinggi" tetap hijau). 317 test hijau, tsc 0.
Tak ada file .tsx/.css tersentuh — murni engine, browser-verify dilewati.

3 pertanyaan kebijakan (temuan 2#3, 2#4, bonus) diajukan ke user, tak
diputuskan sepihak — lihat percakapan sesi ini utk jawabannya.

## 20. RESPONS BUILDER — triase CODEX ronde-13 (save.ts NaN/entri korup + defense render + UX save) 2026-07-04

Laporan CODEX baru (P1/P2/P3 + konten/UI), semua diverifikasi terhadap kode
saat ini sebelum diputuskan. Commit fix: `e276812`.

| # | Temuan | Prioritas | Status |
|---|---|---|---|
| 1 | Kunci tally (mis. `tegakBenar`) hilang SELURUHNYA lolos deserialize — `Object.values(tally)` cuma cek nilai kunci yg ADA, bukan yg hilang → `t.tegakBenar += 1` di reducer meracuni NaN permanen | P1 | ✅ FIX: daftar eksplisit `KUNCI_TALLY`, semua field SkorTally wajib finite ≥0 |
| 2 | `dex.x = null` / `desa.keluarga.x = null` lolos container-check, THROW di hari baru (pelunturan bintang / follow-up mangkir) | P1 | ✅ FIX: validasi tiap entri, pola sama desa.rw — tolak seluruh save |
| 3 | `hari` pecahan (1.5) & `seed` non-finite (`1e999`→`Infinity`) lolos validasi | P2 | ✅ FIX: `hari` wajib integer; `seed` wajib finite (konsisten dgn seedKurikulum) |
| 4 | Render crash sesi aktif korup: `kg.kartu`/`kartu.pilihan` (Kegiatan.tsx), `igd.jawaban` (Igd.tsx), `kj.hotspotDitemukan` (Kunjungan.tsx) null — guard "sesi ada?" komponen induk tak menjangkau field nested | P2 | ✅ FIX: guard diperluas / null-check di titik akses masing-masing |
| 5 | `SURAT_META[m.jenis]` surat berjenis asing (inbox tak divalidasi per-entri) crash `.chip` di MejaKerja.tsx | P2/P3 | ✅ FIX: helper `metaSurat()` dgn fallback |
| 6 | `simpanKeSlot`/`muatDariSlot` tak melapor gagal — beda dgn autosave (`simpan()`) yg sudah try/catch, & beda dgn `imporArsip` yg sudah alert-on-fail | P3 | ✅ FIX: `simpanKeSlot` kini `Promise<boolean>` + try/catch; UI slot manual, muat-arsip, impor JSON kini alert saat gagal |
| 7 | `DexSkdi.test.tsx` klik-entri makan 4,5-4,6s dari batas 5s (`userEvent` default `pointerEventsCheck` mahal di jsdom dgn 144 entri) | P1 (flake CI) | ✅ FIX: `pointerEventsCheck: 0` → turun ke ~1,6-2,3s |
| — | Auto mode-malam hanya trigger `blok==='sore'`, bukan IGD/pagi | UI risk | ❌ TAK PERLU FIX: disengaja (identitas "Puskesmas Pagi"); override manual sudah ada sejak M7.31 (Pengaturan → Mode Tampilan) |
| — | Opacity 0.45 tombol disabled "berisiko" di mode gelap | UI risk | ❌ TAK PERLU FIX: WCAG mengecualikan kontrol NONAKTIF dari syarat rasio kontras; dipakai seragam terang/gelap, sudah masuk cakupan pass kontras M7 (task #18) |
| — | 3 ICD SKDI dobel (N76.0, B35.0, S00-S09) — defensible tapi disarankan explicit-allowlist | Konten, opsional | 📋 DICATAT, tak dieksekusi — hardening opsional, bukan bug (validasiPack bersih, sudah ada allowlist test utk 3 mismatch generik lain) |

Verifikasi-bergigi: revert save.ts (5 fix sekaligus) → 5 test merah (5
regresi-guard tetap hijau); revert 4 file render → 5 test komponen merah;
revert store.ts → 3 test merah (termasuk kasus unhandled-rejection asli).
332 test hijau (dari 317), tsc 0. Tak ada REVISI_ENGINE bump — semua fix
defensif/UX (validasi save & guard render), tak mengubah semantik
replay/skor utk state yang VALID.

Tak ada pertanyaan kebijakan baru dari ronde ini — semua temuan P1/P2/P3
jelas bug (fix) atau jelas bukan (reject dgn alasan terdokumentasi), tak ada
trade-off desain yang perlu keputusan user.

## 21. Keputusan user atas 3 temuan FLAGGED §19 — cowboy, telemetri, acak-urutan (2026-07-04)

Ketiga temuan yang di-flag di §19 (bukan diputuskan sepihak) dijawab user
via AskUserQuestion, semua "kerjakan" — bukan "biarkan":

**1. "Boikot Rujukan" — commit `5d09521`.** Dijelaskan dulu dgn contoh angka
konkret: guillotine (rujukanTotal≥3) gerbang kali-nol (RRNS buruk sampel
besar → UKP=0 total), sedangkan cowboy dulu cuma potongan flat −2/kejadian
— boikot-total-setelah-2-salah lolos guillotine lalu cowboy-kan sisa kasus
wajib-rujuk jauh lebih murah (UKP≈19,5 vs 0). User pilih: naikkan penalti
cowboy (bukan ubah ambang sampel≥3, itu tetap proteksi sah). cowboy −2→−5.
REVISI_ENGINE 9→10.

**2. "Mesin Waktu Offline" (save-scumming) — commit `a9bf7bc`.** User pilih
tambah telemetri wall-clock meski itu perubahan filosofi (engine sengaja
deterministik murni). Desain ditulis dulu (`docs/TELEMETRI_WALLCLOCK.md`,
pola M4.5/M6): log forensik TERPISAH dari save slot (`telemetri.jsonl`,
append-only) — `Date.now()` HANYA di satu titik (store.ts, bukan engine).
Deteksi hari-mundur/jejak-menyusut tanpa tanda sesi-baru → peringatan
OPSIONAL di UI dosen (TitleScreen), berdampingan dgn (bukan mengganti)
vonis SAH/TIDAK SAH `verifikasiDossier`. Tak ada REVISI_ENGINE bump — di
luar GameState/replay/skor sepenuhnya.

**3. Bonus UI acak-urutan jawaban — commit `d167e88`.** User pilih kerjakan
sbg fitur baru. Scope: IGD (langkah keputusan turn-based) + Kegiatan
lapangan (kartu posyandu/prolanis/KLB) — target paling rentan walkthrough
"klik posisi ke-N". Reuse arsitektur dual-seed M4.5: `state.seed` (rngFlavor
per-mahasiswa) mengacak urutan TAMPIL via `Rng.shuffle` (pola sama
Kunjungan.tsx intervensiAcak, tapi ditambah seed per-siswa — yang lama cuma
seed skenario, sama utk semua orang). Dispatch tetap by pilihanId, skor tak
tersentuh. Tak ada REVISI_ENGINE bump.

Semua 3 diverifikasi-bergigi & tercakup test baru. 348 test hijau (dari
332 di akhir §20), tsc 0.

## 22. DeepThink strategis — 2 dari 4 polish dieksekusi: cari Lab, game juice (2026-07-04)

DeepThink kirim pesan strategis merekomendasikan feature-freeze mekanik +
4 item "last-mile polish": (a) telemetri deltaMs, (b) standardisasi
Laci/Cari, (c) onboarding railroaded, (d) game juice. Ditanya trade-off
deltaMs lebih detail dulu (lihat §21 poin 2 — sudah dikerjakan sbg
telemetri wall-clock, bukan deltaMs harfiah). Untuk 4 item polish, user
pilih multi: cari Lab + onboarding railroaded + game juice (commit ini
mengerjakan 2 yg lebih murah; onboarding ditunda ke §23 krn investasi
lebih besar).

Verifikasi dulu thd kode aktual sebelum eksekusi — 2 dari 4 usulan
DeepThink ternyata SUDAH ada (Obat sudah punya pencarian). Genuine gap yg
dikerjakan (commit `240b4e4`):

1. **Pencarian Lab** — `DeckPemeriksaan.tsx` satu-satunya dari 3 daftar
   pilihan klinik (Obat/Edukasi/Lab) tanpa pencarian. `cocokLab()` baru di
   `util.ts` (pola sama `cocokObat`/`cocokEdukasi`), 14 item lab kini bisa
   disaring.
2. **Game juice** — Kode Hitam (konsekuensi terberat) dulu memakai
   `sfxBuzzer` yang SAMA dgn kesalahan rutin (firewall alergi/diusir).
   Kini: `sfxKodeHitam()` (drone turun berat, distinct) + `duckBgm()`
   (redam musik sesaat) + getar layar `.app-frame--kode-hitam` (CSS
   keyframe, tunduk reduce-motion). Surat kabar-buruk (teguran_kapus/
   karma/igd) kini pakai buzzer, bukan bel ceria surat rutin.
3. **Mendung RW** (IKS Tidak Sehat) — `mendungPetak()` baru di
   `petaUtil.ts`: overlay awan SVG di atas warna choropleth existing,
   metafora visual "cuaca desa memburuk".

Verifikasi-bergigi: revert seluruh logic → 7 test merah tepat (2
regresi-guard tetap hijau) → restore → hijau. Verifikasi manual browser:
pencarian Lab dicoba end-to-end (ketik "darah rutin" → filter tepat 1
hasil). 360 test hijau (dari 348 di akhir §21), tsc 0. Tak ada
REVISI_ENGINE bump — semua perubahan murni presentasional/audio.

## 23. DeepThink strategis (lanjutan §22) — keputusan user: onboarding railroaded (2026-07-04)

Item ke-3 dari prioritas §22 (cari Lab + game juice sudah tuntas di sana):
**onboarding railroaded**. Ditanya scope-nya sendiri via AskUserQuestion
(opsi ringan "cuma sorotan" vs berat "kunci penuh + imunitas penalti") —
user pilih opsi TERBERAT, sambil sama-sama sadar ini kontradiksi saran
DeepThink sendiri ("stop nambah mekanik"): fitur ini genuinely mekanik
baru, bukan polish murni. Dikerjakan sesuai instruksi eksplisit user,
bukan rekomendasi DeepThink.

**Desain**: pasien PERTAMA tiap stase baru (karier maupun ujian) dipaksa jadi
kasus tetap `ispa_common_cold` (paling sederhana: tanpa rujukan, tanpa lab
relevan, 1 obat) via override antrian di `init.ts` — defensif, hanya jika
`pack.kasus[KASUS_TUTORIAL]` ada (fixture test custom yg tak punya kasus ini
tetap jalan, cuma tak dapat sorotan). Field baru `GameState.tutorialAktif`
(`true` sejak `buildInitialState`) menandai encounter itu KEBAL skor total:
`reducer.ts` case `DISPOSISI` tetap menjalankan seluruh logika skor SEPERTI
BIASA (tak disentuh sama sekali secara internal — terlalu berisiko mengubah
handler 300+ baris yang sudah battle-tested), lalu SATU gerbang di titik
`return` akhir memilih antara hasil hitungan "sungguhan" vs nilai
`s.*` sebelum encounter, tergantung `tutorialAktif`. Flag dimatikan
unconditional (sekali pakai). Save lama di-backfill `tutorialAktif: false`
(save.ts) — tak retroaktif kebal, disengaja.

UI (5 komponen Deck: Anamnesis/Pemeriksaan/Diagnosis/Terapi/Disposisi)
menerima prop `tutorialAktif`, menyorot (glow CSS `klinik-sorot-tutorial`)
SATU tombol benar berikutnya via konstanta engine-layer
(`ANAMNESIS_PERTAMA_TUTORIAL='q_keluhan'`, `REGION_PERTAMA_TUTORIAL='umum'`,
`OBAT_PERTAMA_TUTORIAL='paracetamol_500'`, `kasus.icd10`), sisanya
`disabled`. `DeckAksi.tsx` menampilkan banner instruksional per-fase.
Konstanta tinggal di `engine/tutorial.ts` (bukan renderer) krn `init.ts`
butuh `KASUS_TUTORIAL`; renderer re-export via `screens/klinik/tutorialKlinik.ts`.

REVISI_ENGINE 10→11 (lihat riwayat di `verifikasi.ts`) — `tutorialAktif`
mengubah semantik replay DISPOSISI pertama.

**Jebakan determinisme replay yang tertangkap saat menulis test**: fixture
`m6verifikasi.test.ts` semula di-override manual `tutorialAktif: false` pada
objek state test (pola yg dipakai sukses di m1bridge/m4ekonomi/selfplay).
Ini MEMATAHKAN 2 test yang tadinya hijau ("dossier asli → SAH", "nama
tampilan diubah tak memutus identitas") — sebab `verifikasiDossier()` TIDAK
memakai ulang objek state test; ia mereplay dari `buildInitialState()`-nya
sendiri (yg akan selalu punya `tutorialAktif: true` sungguhan), lalu
membandingkan tally itu vs tally "klaim". Override manual menciptakan
divergensi klaim-vs-replay yang irreconcilable — persis kelas bug yang
sedang dijaga sejak M6 (skor TIDAK dipercaya dari klaim, dihitung ulang dari
jejak). Perbaikan: bukan override, tapi mainkan DUA pasien sungguhan
(`tanganiPasienAktif` diekstrak jadi helper, dipanggil 2×) — pasien #1
tutorial (dikonsumsi wajar, tak disupresi), pasien #2 dipakai semua
assersi tally. Nol manipulasi state eksternal, replay-safe secara alami.

Verifikasi-bergigi: stash `reducer.ts`+`init.ts` → 5/6 test tutorial baru
merah tepat sesuai simtom (1 tetap hijau: klaim "pasien kedua tak ikut
dipaksa" krn itu memang tak menyentuh kode yg distash) → restore → hijau
semua. Verifikasi manual di browser (preview): banner + sorotan tampil
tepat 1 tombol per fase di seluruh 5 Deck, jalur lengkap
anamnesis→pemeriksaan→diagnosis→terapi→disposisi selesai tanpa galat,
"ENCOUNTER SELESAI" muncul dgn diagnosis BENAR. 366 test hijau (dari 348 di
akhir §21: +4 `tutorial.test.ts`, +2 `Klinik.tutorial.test.tsx`, +12 dari
fixture existing yg kini mainkan 2 pasien bukan 1 di beberapa suite), tsc 0.

## 24. Rebrand resmi: PRIMER → PRIMERA v1.0 (2026-07-04, commit `f3f916b`)

Instruksi eksplisit user: proyek ini sekarang resmi **PRIMERA v1.0 — Primary
Care Simulator & Arena**, menyatukan `primer-desktop` (simulator single-
player, sekarang code-complete) dengan `primer-arena` (versi battle kelas,
M8) di bawah satu identitas — nama "Arena" langsung menjelaskan huruf "A".
Ditanya scope (AskUserQuestion): user pilih opsi TERBERAT — bukan cuma
string tampilan, tapi juga rename folder proyek.

**Dikerjakan**: `git mv primer-desktop primera-desktop` + `git mv
primer-arena primera-arena` (riwayat git terjaga sbg rename, bukan
delete+add — `git log --follow`/`blame` tetap utuh); `.claude/launch.json`
cwd disesuaikan; `package.json` kedua proyek (name/description); versi
primera-desktop **0.1.0-slice → 1.0.0** (mature, main harian, kini "v1.0"
sungguhan) — primera-arena TETAP 0.1.0 (masih vertical-slice, Supabase
belum dibuat, bukan v1.0 sungguhan meski satu keluarga produk); build
config `productName`+`nsis.shortcutName` → "PRIMERA - Puskesmas Pagi";
string tampilan in-app (TitleScreen h1, window title Electron, `<title>`
kedua proyek, TentangModal, disklaimerMedis, komentar header CSS,
JoinScreen/GMConsole Arena, localStorage resume-key Arena — aman diubah
krn Arena belum pernah dideploy, nol data pemain nyata).

**Sengaja TIDAK diubah** (identifier data/legal, beda kelas dari branding):
`metadata.ts` `judulTerdaftar`/`haki` — nama & nomor pencatatan HKI
(EC002026019623, Kemenkumham RI) yg SUNGGUHAN terdaftar tetap "PRIMER:
Primary Care Manager Simulator" verbatim; hanya `judul` (merek tampilan)
yg jadi PRIMERA, ditampilkan berdampingan di TentangModal (nama besar +
cetak-kecil registrasi asli) — pola yg sama sekali tak perlu diubah krn
struktur data sudah memisahkan keduanya sejak awal. `FORMAT_DOSSIER`/
`KUNCI_TTD` (verifikasi.ts) — tag format file & bahan derivasi kunci HMAC
yg persisten di tiap dossier mahasiswa yg diekspor; ini kontrak data
setara REVISI_ENGINE, BUKAN string kosmetik — mengubahnya akan
membatalkan verifikasi dossier lama tanpa alasan fungsional. Hanya pesan
error prosa (bahasa manusia, bukan tag format) yg diperbarui. `PRIMER_DEV`/
`PRIMER_SHOT` (env var internal developer, main/index.ts) — tak
user-facing, dibiarkan. Dossier historis ini sendiri & DEEPTHINK_EDUKASI_UX.md
— catatan kronologis, sengaja TAK ditulis ulang agar akurat sesuai nama yg
berlaku saat tiap keputusan lampau dibuat.

Verifikasi: typecheck+test suite BERSIH kedua proyek pasca-rename
(primera-desktop 366/366, primera-arena 6/6 — folder rename nol dampak krn
semua import relatif); `package-lock.json` disinkron ulang (`npm install
--package-lock-only`); verifikasi browser live kedua proyek (title tab +
H1 + disclaimer primera-desktop, JoinScreen+tab title primera-arena) —
ketemu 1 miss di ronde pertama (`primera-arena/index.html <title>` masih
"PRIMER Arena", terlewat dari grep pertama krn regex lookahead yg dipakai
tak didukung ripgrep default — diperbaiki, grep ulang polos konfirmasi
bersih). Deploy (exe/installer primera-desktop, Supabase primera-arena)
DIBAHAS terpisah dgn user — lihat respons chat, bukan dossier ini (bukan
keputusan desain engine).

## 25. CODEX ronde-14 — triase 6 temuan tutorial+konten (2026-07-04, commit `2ce8608`)

Laporan CODEX read-only baru, 6 temuan atas fitur tutorial (§23) + 2 temuan
konten pra-eksisting tak terkait. **3 dari 6 STALE** — laporan CODEX
menyebut path `primer-desktop/...` (nama folder SEBELUM rebrand §24) dan
menjelaskan simtom yang persis cocok dengan status "kepotong tadi" di
tengah sesi sebelumnya (prop belum ditambah, file belum di-commit, CSS
belum ditulis) — CODEX jelas mengaudit checkout/snapshot dari titik itu,
BUKAN state saat ini. Diverifikasi ulang satu per satu thd kode aktual:

1. **STALE** — `tutorialAktif` prop hilang di `DeckTerapi`/`DeckDisposisi`
   Props → diverifikasi ADA di kedua file (`tutorialAktif?: boolean`,
   commit `b1bbf9e`). `npm run typecheck` bersih, 0 error.
2. **STALE** — `tutorial.ts`/`tutorialKlinik.ts` untracked → `git ls-files`
   konfirmasi KEDUANYA tracked, `git status` bersih.
3. **STALE** — CSS `.klinik-sorot-tutorial`/`.klinik-tutorial-banner` tak
   ada → diverifikasi ADA di `Klinik.css:258,273` termasuk varian
   `[data-mode='malam']`.
4. **CONFIRMED, DIPERBAIKI** — imunitas tutorial membekukan STATE
   (`dex`/`inbox`) tapi TIDAK memfilter `events` yang dipancarkan di
   `reducer.ts` case DISPOSISI: `DEX_BERTAMBAH` (baris 303) dan
   `SURAT_MASUK` (baris 501) dipancarkan TANPA SYARAT sebelum gerbang
   imunitas (`kebalTutorial`, baris 519) sempat dihitung. `Toaster.tsx`
   membaca `events`, bukan state — jadi toast "Buku Saku diperbarui (★1)"
   MUNCUL sungguhan meski `s.dex` tak berubah sama sekali. **Bukti
   independen**: gejala ini SUDAH terlihat sendiri di verifikasi browser
   §23 sebelumnya ("Buku Saku diperbarui (★1)" muncul di snapshot), tapi
   waktu itu tak disadari sebagai bug krn fokus verifikasi ada di
   sorotan/lock UI, bukan toast. Fix: filter `eventsFinal` di titik
   gerbang yang sama (`kebalTutorial ? events.filter(e => e.type !==
   'DEX_BERTAMBAH' && e.type !== 'SURAT_MASUK') : events`) — `STEMPEL`/
   `ENCOUNTER_SELESAI` tetap lolos (debrief narasi memang harus tetap
   tampil, sudah benar by design). Events TIDAK masuk kontrak M6 replay
   (`grep events verifikasi.ts` kosong) — tak ada REVISI_ENGINE bump.
   Verifikasi-bergigi: test baru merah tepat (`expect(...DEX_BERTAMBAH...
   ).toBe(false)` gagal dgn `true`) → fix → hijau; ulang stash/restore
   reducer.ts → merah/hijau lagi. Verifikasi browser end-to-end: mainkan
   pasien tutorial penuh sampai PULANGKAN, `document.body.innerText.
   includes('Buku Saku diperbarui')` → `false` (dulu `true`). 367 test
   (dari 366 — +1 `tutorial.test.ts`), tsc 0.
5. **CONFIRMED (skrip verifikasi ditulis, angka akurat), FLAGGED KE
   USER** — 29 dari 67 kasus playable TAK tertaut entri `skdi144`
   (auto-link `content/index.ts:62` hanya cocok ICD-10 PERSIS; 29 kasus
   ini kodenya lebih spesifik/beda dari entri SKDI144 manapun). Akibat:
   Dex/Buku Saku (`DexSkdi.tsx`, hanya menghitung entri BER-`kasusId`)
   tak pernah menunjukkan progres utk 29 kompetensi ini meski sudah
   ditangani berkali-kali — contoh dikonfirmasi: `stroke_iskemik`,
   `ppok_eksaserbasi`, `apendisitis_akut`, `jiwa_skizofrenia`, dll (daftar
   lengkap di respons chat). BUKAN bug dari fitur tutorial — pra-eksisting
   sejak M7, tak disentuh sesi ini. TAK difix langsung: perbaikan
   sungguhan butuh keputusan KURIKULUM (kasus mana map ke nomor
   kompetensi SKDI mana), bukan sekadar kode — mekanisme SUDAH mendukung
   override manual (`if (entri.kasusId) return entri` di baris 61), yang
   belum ada adalah SIAPA yang mengisi 29 pemetaan itu. Diserahkan ke
   user sbg keputusan konten terpisah, bukan diputuskan sepihak.
6. **CONFIRMED, FLAGGED KE USER** — mode `ujian` (30 hari, "setiap
   keputusan dinilai" per surat sambutan `init.ts`) IKUT dapat pasien
   tutorial kebal-skor di hari pertama, sama seperti karier —
   `buildInitialState` set `tutorialAktif: true` tanpa syarat mode.
   Ini bukan bug (tak ada crash/korupsi data), tapi TENSION desain:
   surat sambutan ujian eksplisit bilang "yang dinilai adalah caramu
   berpikir, TERCATAT DI SETIAP KEPUTUSAN" — klaim ini secara harfiah
   salah untuk pasien pertama. Opsi yg mungkin (belum dipilih): (a)
   biarkan seragam kedua mode (aman kalau mahasiswa bisa langsung pilih
   ujian tanpa pernah main karier dulu), (b) tutorial HANYA di karier,
   ujian selalu langsung dinilai penuh, (c) biarkan tutorial di ujian tapi
   ubah teks surat sambutan mengakui pengecualian pasien pertama. Ini
   keputusan fairness/naratif akademik (game ini dipakai utk nilai
   sungguhan ~50 mahasiswa FK September 2026) — diserahkan ke user.

Pola penting utk audit berikutnya: **selalu cek nama folder di path yang
disebut laporan** (`primer-desktop` vs `primera-desktop`) sbg sinyal cepat
apakah laporan itu pra- atau pasca-rebrand §24 — perbedaan itu sendiri
sudah cukup utk menduga snapshot lama sebelum baca detail lain.

**Keputusan user atas 2 temuan flagged (2026-07-04)**:
- **Temuan #6 (tutorial di mode ujian)**: user pilih **biarkan seragam** —
  tutorial tetap tampil di kedua mode karier & ujian, tanpa perubahan kode.
  Alasan: jaga-jaga mahasiswa yang langsung pilih Ujian tanpa pernah coba
  Karier dulu; aman krn tak mengubah skor, cuma 1 pasien gratis di awal.
  Ditutup — bukan bug, keputusan desain final.
- **Temuan #5 (29/67 kasus tak tertaut Dex/SKDI144)**: user PUNYA dokumen
  SKDI resmi (PDF) dan akan menyerahkannya utk dibaca — pemetaan 29 kasus
  ke nomor kompetensi SKDI yang tepat akan ditentukan sendiri (bukan
  ditanya satu-satu ke user, bukan pula heuristik longgar prefix ICD-10
  yang berisiko salah-taut). Status: MENUNGGU dokumen, belum dikerjakan.

## 26. Temuan #5 dieksekusi — audit 29 kasus vs dokumen SKDI resmi (2026-07-04)

User memberi PDF resmi: **Standar Kompetensi Dokter Indonesia, Konsil
Kedokteran Indonesia, Edisi Kedua 2012** (`SKDI_Perkonsil_11_maret_131.pdf`,
100 halaman). **Temuan metodologi penting SEBELUM triase**: dokumen ini
BUKAN sumber yang sama dgn "KMK No. HK.01.07/MENKES/1186/2022" yang
disebut di header `skdi144.ts` sbg asal daftar 144 — SKDI 2012 adalah
kerangka kompetensi UMUM lintas semua level (1/2/3A/3B/4A, ~700+ penyakit,
target KELULUSAN dokter), sedangkan 144-FKTP adalah daftar KURASI lebih
baru & lebih sempit (penyakit yang secara PRAKTIK wajib tuntas di
Puskesmas). Dua dokumen berbeda tujuan → level kompetensi di SKDI 2012
TIDAK otomatis = "termasuk/tidak dalam 144", tapi tetap sumber otoritatif
utk mengecek level kompetensi akademis tiap penyakit (dipakai sbg bukti
pendukung, bukan sbg daftar 144 itu sendiri — keterbatasan ini didisclosekan
eksplisit, bukan dipoles seolah pasti).

Ekstraksi teks PDF via PyMuPDF (Python `fitz`, poppler tak terpasang di
mesin ini) → `Lampiran-3 Daftar Penyakit` (baris 3162-6433 hasil ekstrak).
Silang-cek 29 kasus (nama, ICD-10 kasus, `skdi`/`harusDirujuk` self-report)
vs entri resmi:

**7 kasus — DITAUTKAN sekarang (commit ini)**: penyakit SAMA dgn entri
skdi144.ts yang SUDAH ada, kasus cuma pakai ICD-10 lebih spesifik dari kode
generik entri lama — kompetensi 4A dikonfirmasi PDF utk semua:
`disentri_basiler`→`dysentery`(A03.9 vs A03), `hemoroid_grade1`→
`hemorrhoid_12`(K64.0 vs I84 — CATATAN terpisah: I84 kode SKDI yg benar,
K64 tampak seperti kode ICD-11 nyasar, tapi di luar cakup linking ini),
`saraf_migrain`→`migraine`(G43.0 vs G43.9), `saraf_vertigo_bppv`→
`vertigo_bppv`(H81.1 vs R42 — H81.1 sebenarnya kode yg LEBIH tepat dari
R42 simtomatik generik entri lama, tapi tak diubah krn di luar cakup),
`kia_anc_kehamilan_normal`→`normal_pregnancy`(Z34.0 vs Z34),
`kia_malaria_falsiparum`→`malaria_vivax`(B50.9 vs B54 unspesifik),
`kia_isk_kehamilan`→`uti`(O23.4 vs N39.0 — ISK dalam kehamilan = penyakit
sama, kehamilan cuma konteks). Ditambahkan ke allowlist
`GENERIK_SENGAJA` (pack.test.ts) dgn komentar per-item. Test baru
`pack.test.ts` mengunci total tertaut 38→**45** dari 67 playable.
Verifikasi-bergigi: stash skdi144.ts → test merah tepat → restore → hijau.
368 test (dari 367), tsc 0.

**11 kasus — TETAP TAK TERTAUT, dgn TEMUAN SAMPINGAN penting**: 15 dari 29
kasus semula memang level <4A/wajib-rujuk (stroke_iskemik dkk, SUDAH
dikonfirmasi §25 lewat `skdi`/`harusDirujuk` self-report). Tapi audit PDF
ini MENEMUKAN **5 kasus yang self-report levelnya SENDIRI ternyata KELIRU**
dibanding dokumen resmi — bukan cuma "belum tertaut", tapi salah label:
- `kulit_dermatitis_kontak` (self-report 4A) — PDF: "Dermatitis kontak
  alergika" = **3A**, bukan 4A.
- `tht_rinosinusitis_akut` (self-report 4A) — PDF: "Sinusitis" = **3A**
  (varian akut spesifik malah level 2).
- `mm_osteoartritis_lutut` (self-report 4A) — PDF: "Artritis,
  osteoarthritis" (satu entri gabungan) = **3A**.
- `jiwa_gangguan_cemas` (self-report 4A) — PDF: "Gangguan cemas
  menyeluruh" = **3A**.
- `jiwa_depresi_ringan` (self-report 4A) — PDF: "Depresi endogen, episode
  tunggal dan rekuran" = **level 2** (bahkan bukan 3A — cuma "mengenali
  dan merujuk", TANPA penatalaksanaan awal sama sekali).

**PENTING — bukan berarti 5 kasus ini otomatis SALAH tatalaksana dalam
game**: level SKDI 2012 mengukur kompetensi LULUSAN (akademis, konservatif),
bukan standar praktik FKTP riil 2020-an (mis. integrasi kesehatan jiwa
Puskesmas menjadikan GAD/depresi ringan lazim ditangani mandiri di
lapangan meski akademis "cuma" level 2-3A). Ini DIDOKUMENTASIKAN sbg
temuan utk diketahui user (apakah `harusDirujuk`/`skdi` kasus tsb perlu
dikoreksi, keputusan klinis user, BUKAN saya putuskan sepihak) — TAK
diubah kode kasusnya di commit ini (di luar cakup temuan #5 linking).

**3 kasus — TIDAK DITEMUKAN di Daftar Penyakit SKDI sama sekali**:
`dispepsia_fungsional`, `mm_low_back_pain`, `mm_mialgia` — ketiganya
kemungkinan diklasifikasi sbg "Daftar Masalah" (keluhan/simtom) bukan
"Daftar Penyakit" (diagnosis definitif) di taksonomi SKDI (mis. "Nyeri
pinggang" & "Gangguan otot, nyeri otot" muncul di Lampiran-1 Daftar
Masalah, bukan Lampiran-3). `mm_gout_artritis_akut` juga tak ketemu
eksplisit (kemungkinan tergabung dlm entri "Artritis, osteoarthritis"
umum, sama spt osteoartritis di atas). Tak bisa dipastikan tanpa dokumen
144-FKTP asli (Kepmenkes 1186/2022) yang TIDAK dimiliki sesi ini.

**1 kasus — pertanyaan arsitektur, bukan linking**: `kia_kb_konseling`
(Konseling KB) bukan "penyakit" sama sekali — ini LAYANAN preventif/
konseling, di luar cakupan Dex berbasis-penyakit sepenuhnya; tak relevan
dicarikan entri SKDI144.

**1 kasus — kompetensi sudah dipakai kasus lain**: `mata_konjungtivitis_alergi`
(H10.1) — slot 144 "Konjungtivitis" (H10.9) sudah tertaut ke
`konjungtivitis_bakterial`. `kasusId` bertipe `string` tunggal (bukan
array) — kalau mau kedua varian (bakterial & alergika) sama-sama
memberi kredit Dex utk SATU kompetensi "Konjungtivitis", perlu ubah tipe
jadi `string[]` (perubahan arsitektur kecil, di luar cakup commit ini,
diserahkan ke user apakah worth dikerjakan).

Ringkasan status: 45/67 tertaut (dari 38), 11 correctly-excluded (rujuk/
level rendah, sah), 5 kasus dgn self-report level SALAH (didokumentasikan,
tak diubah), 3+1 kasus tak terverifikasi tanpa dokumen 144-FKTP asli, 1
kasus butuh keputusan arsitektur `kasusId` array. Tak ada REVISI_ENGINE
bump (Dex/SKDI144 di luar kontrak skor/replay M6).

## 27. CODEX ronde-15 — triase 8 temuan lanjutan (2026-07-04)

Laporan CODEX baru, read-only, 8 temuan. **3 CONFIRMED & DIPERBAIKI**, **2
STALE** (sudah beres di ronde-14, §25-26), **2 REJECTED-WITH-REASONING**
(salah paham desain / kode mati di luar cakupan), **1 SUDAH DIPUTUSKAN**
user sebelumnya (§25, tak perlu aksi baru).

1. **CONFIRMED & DIPERBAIKI — PPOK eksaserbasi, clue minta antibiotik tapi
   tak ada slot antibiotik benar.** `kasusRespGi.ts` clue eksplisit: "ketiganya
   ada (Anthonisen) → antibiotik terindikasi", `obatSalahUmum` sudah
   menghukum kloramfenikol sbg antibiotik SALAH — tapi `obatBenar`/
   `obatAlternatif` tak punya SATUPUN antibiotik BENAR, jadi pemain bisa
   full-score terapi tanpa memberi antibiotik yang justru diminta clue-nya
   sendiri. Fix: tambah grup alternatif ketiga `['amoxiclav_625',
   'azitromisin_500', 'doksisiklin_100']` (3 pilihan lini pertama GOLD 2025
   utk eksaserbasi purulen, "pilih salah satu" sama seperti pola tifoid).
   Verifikasi-bergigi: test baru (`pack.test.ts`) merah tepat sebelum fix,
   hijau sesudah; stash/restore kasusRespGi.ts mengonfirmasi ulang.
   `sidikJariPack` meng-hash `tatalaksana` → dossier lama otomatis
   terdeteksi beda konten saat replay (bukan disalahi diam-diam), tak perlu
   REVISI_ENGINE bump.

2. **CONFIRMED & DIPERBAIKI (lebih luas dari laporan) — kunci tutorial
   pemeriksaan bisa dilompati, DUA jalur bukan satu.** CODEX cuma
   melaporkan `FigurTubuh.tsx` (figur SVG) yang tak menerima info kunci
   sama sekali. Investigasi lebih dalam menemukan `DeckPemeriksaan.tsx`
   SENDIRI juga bocor: `dikunci = tutorialAktif && !enc.vitalDiukur` cuma
   mengunci SEMUA chip regio SEBELUM vital diukur — begitu vital terukur,
   SEMUA 10 chip regio kebuka sekaligus (bukan cuma regio target), lubang
   yang SAMA persis dgn figur SVG, cuma di komponen berbeda. Fix: formula
   dikoreksi jadi `tutorialAktif && !disorot` (terkunci KECUALI regio yang
   sedang disorot — konsisten sepanjang SEMUA tahap tutorial, bukan cuma
   gerbang "vital sudah/belum"), plus `FigurTubuh` diberi prop `terkunci`
   opsional yg mengabaikan klik pada regio non-target + CSS kunci visual
   (cursor default, hover dinetralkan via `:not()`). Verifikasi-bergigi: 3
   test baru (`Klinik.tutorial.test.tsx`) — semua-terkunci sebelum vital,
   hanya-target-terbuka sesudah vital, klik SVG non-target tak mendispatch
   PERIKSA — merah tepat sebelum fix, hijau sesudah; stash/restore
   mengonfirmasi ulang. Verifikasi browser end-to-end: 10/10 chip & 10/10
   region SVG terkunci sebelum vital; tepat 1/10 terbuka (chip DAN SVG)
   sesudah vital.

3. **CONFIRMED & DIPERBAIKI — debrief tutorial tetap tampil grade D
   "Perlu pembinaan" walau pemain 100% mengikuti sorotan.** Tuntunan
   tutorial sengaja minimal (1 pertanyaan, 1 regio, tanpa edukasi) — skor
   SOAP MENTAH dari jalur itu (dihitung apa adanya oleh `nilaiEncounter`,
   terlepas dari imunitas state) jatuh ke grade D. State sungguhan SUDAH
   kebal (reducer.ts, §23), tapi `PanelHasil.tsx` menampilkan penilaian
   MENTAH itu — kontradiksi dgn maksud desain "kunci penuh + imunitas
   penalti" (harus terasa 100% aman, bukan seperti gagal). Fix: field baru
   `PenilaianEncounter.tutorialLatihan?: boolean`, di-set di reducer.ts pada
   `penilaianTampil` (di titik gerbang `kebalTutorial` yang sama, dipatch
   ke `events` ENCOUNTER_SELESAI DAN `klinik.selesaiHariIni` sekaligus —
   sebelumnya event & log historis pakai objek `nilai`/`penilaianFinal`
   yang beda referensi tapi kontennya sama). `PanelHasil.tsx` menyembunyikan
   huruf grade + rincian 4 skor SOAP + bendera penalti saat
   `tutorialLatihan`, ganti dgn ikon 🎓 + teks "Latihan pertama tuntas —
   ini tak memengaruhi skor." — diagnosis BENAR/SUSPEK & mutiara klinis EBM
   TETAP tampil (nilai pedagogis, bukan penalti). Verifikasi-bergigi: test
   baru (`PanelHasil.test.tsx`, unit langsung di komponen presentasional)
   merah→hijau; stash/restore mengonfirmasi. Verifikasi browser: debrief
   pasien tutorial kini tampil 🎓 + pesan netral, bukan huruf D.

4. **STALE — mode ujian ikut dapat tutorial.** Sudah diputuskan user di
   §25: "biarkan seragam", ditutup sbg keputusan final, bukan bug. Tak ada
   aksi baru.

5. **STALE — Dex/SKDI "26/29 belum termap".** Angka CODEX (26 FKTP144 +
   29 total) adalah snapshot SEBELUM ronde-14 (§26, commit `ba8c09d`) yang
   sudah menautkan 7 kasus. Angka aktual sekarang: **22 tak tertaut** dari
   67 (45 sudah tertaut) — dikonfirmasi ulang via skrip fresh. Sisa 22 sudah
   dikategorikan detail di §26 (11 correctly-excluded, 5 self-report keliru,
   3+1 tak terverifikasi, 1 arsitektur `kasusId` array) — tak perlu triase
   ulang.

6. **REJECTED-WITH-REASONING — "metadata EBM (`guideline`) tak konsisten,
   10 kasus tanpa itu".** Salah paham desain dua-lapis yang disengaja:
   `clue` (WAJIB, semua 67 kasus) adalah pembawa universal rujukan EBM
   free-text di debrief (`clue` di-tag komentar types.ts sbg "Mutiara klinis
   ber-tag guideline") — `konsekuensi.guideline` adalah field TERSTRUKTUR
   tambahan, HANYA relevan utk kasus yang punya arc konsekuensi (dipakai
   generator narasi follow-up), bukan satu-satunya tempat sumber EBM hidup.
   Diverifikasi: `skabies` (salah satu dari 10 kasus "tanpa guideline")
   TETAP punya clue lengkap dgn sitasi ("...OBATI SEMUA KONTAK SERUMAH
   serentak + cuci seprai/handuk air panas (CDC/IACS)."). `validasiPack`
   sudah benar TIDAK mewajibkan `guideline` krn itu opsional-kontekstual,
   bukan celah cakupan.

7. **STALE/SUDAH DITINJAU 2× — duplikat ICD SKDI144 (N76.0/B35.0/
   S00-S09).** Temuan yang SAMA persis sudah tercatat di dossier ini DUA
   kali sebelumnya (baris 881 & 980, ronde-ronde CODEX lampau) — kedua kali
   simpulannya sama: "bukan bug blocker, hardening opsional (explicit-
   allowlist), tak dieksekusi". Tak ada info baru dari CODEX kali ini.

8. **REJECTED — root test runner (`npm test` di root worktree, bukan
   `primera-desktop/`) gagal.** Root `package.json` name: `"primer-game"`
   — proyek WEB LAMA yang eksplisit ditinggalkan (lihat memori sesi:
   redesign total ke Puskesmas Pagi, "user menyerah pada UKM/peta/kunjungan
   rumah lama"). `src/store/useGameStore.js` & sensus test yang CODEX
   sebut adalah bagian kode MATI, tak dikembangkan lagi, di luar cakupan
   proyek aktif (`primera-desktop/`+`primera-arena/`). Tak dieksekusi.

Verifikasi keseluruhan: 374 test hijau, tsc 0 — 3 fix ronde ini menambah
1 test PPOK (`pack.test.ts`), 3 test lock-pemeriksaan
(`Klinik.tutorial.test.tsx`), dan file baru `PanelHasil.test.tsx` (2 test).

## 28. M9.1 — investigasi solo pola bug berulang, tutup kunci tutorial menyeluruh (2026-07-04)

User mengamati tiga ronde CODEX beruntun (§25-27) terus menemukan bug di
klaster yang SAMA (kunci UI tutorial, SKDI/ICD-10, tatalaksana vs clue) dan
bertanya apakah perlu milestone tersendiri (M9) utk audit sekali-jalan
alih-alih tambal-sulam per-ronde. Rencana M9 disetujui (4 sub-inisiatif:
M9.1 kunci tutorial, M9.2 audit SKDI otoritatif, M9.3 sapuan tatalaksana
vs clue, M9.4 dokumentasi tensi mode-ujian) — bagian ini melaporkan **M9.1**,
dikerjakan pertama krn mandiri (tanpa dependensi eksternal).

**Investigasi solo (bukan CODEX) sebelum menulis kode**: membaca 5 komponen
Deck (Anamnesis/Pemeriksaan/Diagnosis/Terapi/Disposisi) sejajar menemukan
akar masalah — TIAP komponen menulis ULANG logika "kunci semua kecuali
target" sendiri-sendiri dengan variabel & kondisi sedikit beda, dan TIDAK
ADA satu test yang memverifikasi invarian itu di SELURUH layar Klinik
sekaligus. Ditemukan **2 celah baru SEBELUM implementasi** (belum pernah
dilaporkan CODEX):
- `DeckDiagnosis.tsx`: toggle TEGAK/SUSPEK tak pernah dikunci sama sekali.
- `DeckDisposisi.tsx`: tombol PULANGKAN cuma bergantung `!punyaDiagnosis`,
  benar krn KEBETULAN `KASUS_TUTORIAL` selalu `harusDirujuk:false` — bukan
  krn gerbang eksplisit, asumsi implisit yang rapuh.

**Metodologi baru**: satu test invarian MENYELURUH (bukan per-titik) di
`Klinik.tutorial.test.tsx` — mem-play seluruh alur (anamnesis→pemeriksaan→
diagnosis→terapi→disposisi) via KLIK (bukan dispatch mentah, krn diagnosis/
terapi bergantung `useState` lokal komponen), assert TEPAT 1 tombol aktif
di region "Deck aksi klinik" di SETIAP langkah. Test ini sendiri, LEBIH DARI
2 celah yang diduga, menemukan **5 total** (ditulis merah dulu, dibenahi
satu-satu sampai hijau — bukan hipotesis di atas kertas):

1. **`DeckAnamnesis.tsx`** — begitu 1 pertanyaan ditanya, `sorotPertanyaan`
   jadi `null` (persyaratan minimal terpenuhi), dan formula lama
   `sorotPertanyaan !== null && !disorot` jadi vakum-benar utk SEMUA
   pertanyaan lain (bukan cuma "Selesai" yg menyala) — 8 tombol aktif
   sekaligus, bukan 1. Fix: `tutorialAktif && !disorot`.
2. **`DeckDiagnosis.tsx`** — toggle TEGAK/SUSPEK sama sekali tak dikunci.
   Fix: dikunci `disabled={tutorialAktif}` kedua tombol, `jenis` di-default
   paksa ke `'tegak'` selama tutorial (bukan `'suspek'` spt biasanya).
3. **`DeckDiagnosis.tsx`** (celah kedua, KELAS SAMA persis dgn #1) — opsi
   banding yg SUDAH dipilih tetap bisa diklik ulang (`!aktif` di formula
   lama jadi satu-satunya penjaga begitu `sorotOpsi` vakum jadi false).
   Fix: `tutorialAktif && !disorot` (drop `&& !aktif`).
4. **`DeckDisposisi.tsx`** — PULANGKAN diberi gerbang eksplisit
   `disabled={!punyaDiagnosis || (tutorialAktif && kasus.harusDirujuk)}`
   (perlu meneruskan prop `kasus` baru dari `DeckAksi.tsx`, sebelumnya tak
   diteruskan).
5. **`DeckTerapi.tsx`** — tab "Resep" (default aktif) tak pernah dikunci
   sama sekali (Edukasi/Tindakan sudah, Resep terlewat) — secara fungsional
   tak berbahaya (klik ulang tab yg sudah aktif = no-op) tapi tetap
   melanggar invarian "tepat 1 aktif". Fix: `disabled={tutorialAktif}`.

Verifikasi-bergigi: stash SEMUA 5 file produksi sekaligus → test invarian
merah tepat (8 tombol aktif di langkah anamnesis-kedua, cocok simtom #1)
→ restore → hijau. Verifikasi browser end-to-end penuh: TEGAK/SUSPEK
terkunci, opsi banding terpilih ikut terkunci, tab Resep/Edukasi/Tindakan
bertiga terkunci, PULANGKAN aktif sementara OBSERVASI/RUJUK terkunci,
debrief akhir menampilkan stempel TEGAK (sesuai default paksa baru) +
framing 🎓 latihan. 375 test (dari 374 — +1 test invarian menyeluruh
menggantikan kebutuhan test titik-per-titik tambahan ke depan), tsc 0.
Tak ada REVISI_ENGINE bump (murni UI/presentasi tutorial, di luar kontrak
skor/replay M6 — imunitas skor sendiri sudah diverifikasi terpisah §23).

**Pelajaran metodologi utk M9.2-M9.4**: investigasi manual (baca kode
sejajar) MENEMUKAN pola & 2 celah sebelum test ditulis, tapi test invarian
generik MENEMUKAN 3 celah tambahan yang investigasi manual sendiri
terlewat. Kombinasi keduanya (bukan salah satu saja) yang efektif — pola
ini kemungkinan berlaku juga utk M9.2 (audit SKDI) & M9.3 (sapuan
tatalaksana): investigasi manual dulu utk memahami akar masalah, LALU
tulis pemeriksaan otomatis yang cakupannya lebih luas dari yang bisa
diverifikasi manual satu-satu.

## 29. M9.3 — sapuan heuristik tatalaksana vs `clue`, permanen (2026-07-04)

Lanjutan rencana M9 (§28): sapuan seluruh 67 kasus playable mencari pola
YANG SAMA dgn bug PPOK (`ppok_eksaserbasi`, §27) — `clue` (teks bebas EBM)
menjanjikan tatalaksana yang tak tercermin struktural. Skrip eksploratif
(dibuang setelah dipakai) mencari 3 pola kata kunci: "antibiotik",
"kortikosteroid/steroid sistemik/oral", dan frasa rujuk-kuat ("rujuk
segera", "wajib rujuk", dst.) — dgn deteksi negasi PROXIMITY (jendela ±45
karakter di sekitar kata kunci, bukan cuma frasa exact) supaya "antibiotik
TIDAK diindikasikan" tak salah-tangkap sbg janji yang harus dipenuhi.

**Ronde 1 (frasa negasi exact-match sempit)**: 4 kandidat palsu ditemukan
(`asma_ringan`, `apendisitis_akut`, `kulit_veruka_vulgaris`,
`mata_konjungtivitis_alergi`) — semua ternyata negasi dgn kata order
berbeda dari list awal (mis. "Antibiotik rutin **tidak** diindikasikan"
— negasi SESUDAH kata kunci, bukan sebelum). Diperbaiki jadi deteksi
proximity dua-arah.

**Ronde 2 (proximity, kata kunci antibiotik + rujuk-kuat)**: **0 kandidat**
— PPOK memang satu-satunya instance kelas ini di seluruh 67 kasus.

**Ronde 3 (kata kunci steroid sistemik)**: 1 kandidat palsu
(`ppok_eksaserbasi` sendiri!) — ternyata bug di SKRIP saya sendiri (cek
`kelas.includes('kortikosteroid')` case-sensitive, padahal katalog
menyimpan `'Kortikosteroid sistemik'` berhuruf besar). Diperbaiki
(`.toLowerCase()`), hasil jadi bersih (0) — `prednison_5` yg sudah
ditambahkan §27 memang sudah memenuhi janji clue.

**Hasil**: sapuan BERSIH di seluruh 3 pola — PPOK adalah satu-satunya
instance kelas bug ini, sudah diperbaiki §27. Diubah dari skrip sekali-
pakai jadi **test permanen** `src/content/tatalaksanaClue.test.ts` (3
`it()`, satu per pola) — kasus BARU yang menulis clue serupa tanpa
tatalaksana yang cocok akan gagal otomatis di sini, tanpa menunggu ronde
audit berikutnya menemukannya manual (persis tujuan M9: pagar permanen,
bukan tambal reaktif).

Verifikasi-bergigi khusus: krn fix PPOK sudah ter-commit sebelumnya (tak
ada lagi utk di-stash), celah disimulasikan manual — hapus grup
antibiotik dari `kasusRespGi.ts` sementara, konfirmasi test BARU ini
menangkapnya (merah tepat dgn `pelanggar: ['ppok_eksaserbasi']`),
kembalikan (diff kosong dikonfirmasi via `git diff`). 378 test (dari 375
— +3 test baru), tsc 0. Tak ada REVISI_ENGINE bump (test murni, nol
perubahan kode produksi).

## 30. M9.2 — audit SKDI/ICD-10 thd dokumen OTORITATIF Kepmenkes 1186/2022 (2026-07-04)

Blocker sejak §26/§28 akhirnya lepas: user memberi PDF resmi Kepmenkes
No. HK.01.07/MENKES/1186/2022 ("Panduan Praktik Klinis Bagi Dokter di
Fasilitas Pelayanan Kesehatan Tingkat Pertama", 1379 halaman) — dokumen
INI, bukan SKDI 2012 umum yang dibaca §26, yang jadi rujukan kurasi
"144 penyakit FKTP" yang mendasari `skdi144.ts`. Diekstrak via PyMuPDF ke
teks (poppler tak tersedia di mesin ini) utk digrep.

**Sasaran audit**: 22 kasus playable yang MASIH tak tertaut Dex/SKDI144
sisa dari §26 (38→45 dari 67), dicek satu-per-satu thd bab per-penyakit
Kepmenkes 1186/2022 (tiap bab bertag "No. ICPC-2 / No. ICD-10 / Tingkat
Kemampuan").

**Hasil #1 — `mm_gout_artritis_akut` (M10.9) kini TERTAUT** ke entri
`hyperuricemia` (E79.0) yang SUDAH ADA di `skdi144.ts` (sebelumnya tanpa
`kasusId`): bab Kepmenkes 1186/2022 menggabungkan "Hiperurisemia-Gout
Arthritis" sbg SATU kompetensi 4A (E79.0 + M10) — bukan dua entri
terpisah. Fix murni linking (tambah `kasusId` ke entri lama, TAK
menambah entri baru — TEPAT 144 terjaga), + `pack.test.ts` allowlist
`GENERIK_SENGAJA` (kode kompetensi E79.0 generik vs kasus M10.9 lebih
spesifik) + test baru total tertaut 46 (dari 45).

**Hasil #2 — Rinosinusitis, diusulkan lalu DIBATALKAN (koreksi penting,
dipicu langsung oleh user)**: Kepmenkes 1186/2022 punya bab "Rinosinusitis
Akut" bertag "Tingkat Kemampuan 4A" — sepintas terlihat sbg entri
ke-145 yang hilang dari `skdi144.ts` (144 entri tetap, tak ada
Rinosinusitis). Diajukan ke user via AskUserQuestion sbg "tambah 145
(Recommended)" vs "biarkan 144". **User menolak reasoning ini dan
meminta verifikasi hitung ulang yang sebenarnya** ("kok aneh gak 144
... ini kan matematika dasar lo claude, ayolah") — bukan menerima/menolak
opsi, tapi mengoreksi metodologi.

Verifikasi ulang yang benar (dikerjakan langsung, bukan diasumsikan):
1. Hitung mentah semua occurrence "Tingkat Kemampuan 4A" di seluruh
   Kepmenkes 1186/2022 → hanya **110-111**, BUKAN 144 — membuktikan
   struktur bab dokumen ini TAK memetakan 1:1 ke "144 penyakit" (sebagian
   bab menggabungkan >1 penyakit sekaligus, spt kasus gout di atas).
2. Kembali ke SKDI 2012 (Perkonsil 11/2012) — sumber yang literally
   DIKUTIP Kepmenkes 1186/2022 sendiri di halaman 8 sbg asal angka
   "144 dari 736" — dan hitung PERSIS baris Daftar Penyakit (Lampiran-3)
   yang berakhiran murni "4A": hasilnya **TEPAT 144**. Ini konfirmasi
   `skdi144.ts` sudah benar sejak awal; SKDI 2012 Lampiran-3, BUKAN
   Kepmenkes 1186/2022, adalah sumber otoritatif utk "apakah penyakit X
   satu dari 144".
3. Cek Sinusitis scr spesifik di SKDI 2012 asli: entri #93-96 levelnya
   3A/2/2/3A — TAK ADA yang 4A. Kesimpulan: Rinosinusitis Akut BUKAN
   bagian dari 144 yang asli; tag "4A" di Kepmenkes 1186/2022 adalah
   penilaian klinis 2022 yang lebih baru & TERPISAH dari daftar 144
   SKDI 2012 — dua dokumen ini py tujuan berbeda (kurasi FKTP 2022 vs
   kompetensi lulusan 2012) dan TAK bisa saling menggantikan sbg sumber
   "144" tsb.
4. Proposal 145 dibatalkan sepenuhnya — tak ada kode yang sempat diubah
   (baru tahap pertanyaan), jadi tak ada revert yang diperlukan. Exclusion
   `tht_rinosinusitis_akut` dari §26/§27 dikonfirmasi tetap BENAR.
5. Cross-check fix gout (#1 di atas) thd standar rigor yang sama:
   Hiperurisemia = entri #31 di Daftar Penyakit SKDI 2012 asli, dikonfirmasi
   4A di sana juga — fix ini TETAP BENAR, tak perlu direvert.

**Hasil #3 — re-konfirmasi 7 exclusion §26 lainnya** thd dokumen
Kepmenkes 1186/2022 yang kini tersedia (`dispepsia_fungsional`,
`mm_low_back_pain`, `mm_mialgia`, `kulit_dermatitis_kontak`,
`mm_osteoartritis_lutut`, `jiwa_gangguan_cemas`, `jiwa_depresi_ringan`):
semua tetap correctly-excluded — baik krn tak muncul sbg bab
tersendiri (dispepsia/LBP/mialgia — kemungkinan Daftar Masalah/simtom,
bukan Daftar Penyakit) maupun krn level kompetensinya scr resmi bukan 4A
di kedua dokumen (bukan cuma di SKDI 2012, dikonfirmasi ulang di
Kepmenkes 1186/2022 jg).

**Pelajaran metodologi penting (bukan cuma utk M9, utk SEMUA audit
konten SKDI ke depan)**: dua dokumen resmi yang MEMBAHAS kompetensi
sama sekali TIDAK otomatis interchangeable sbg sumber utk klaim
angka spesifik ("apakah X termasuk 144 penyakit ini") — walau salah
satu MENGUTIP yang lain sbg rujukan scope. Selalu hitung EXACT count
thd sumber yang literally didefinisikan sbg otoritatif utk klaim
tsb (di sini: SKDI 2012 Lampiran-3, bukan Kepmenkes 1186/2022 independen),
BUKAN infer dari dokumen yang sekadar terkait/mengutip. Kesalahan yang
nyaris terjadi di sini murni krn saya berhenti di 1 sinyal ("ada tag 4A
di dokumen baru") tanpa hitung total scr menyeluruh dulu — koreksi user
persis menunjuk ini.

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **379
test** (dari 378 — +1 test M9.2), 36 file test. Verifikasi browser:
mulai stase baru, buka Buku Saku (Dex), konfirmasi "0/144" (denominator
144 tetap utuh, layar render normal pasca link gout-hiperurisemia). Tak
ada REVISI_ENGINE bump (konten/linking murni, di luar kontrak skor/replay
M6 — `sidikJariPack` sudah otomatis sensitif thd perubahan `tatalaksana`
per-kasus tanpa perlu bump manual).

Dengan ini **M9 (M9.1+M9.2+M9.3+M9.4) selesai penuh** sesuai rencana yang
disetujui user di awal sesi.

## 31. CODEX ronde-16 — audit read-only atas state `08fa634` (2026-07-04)

Ronde baru masuk TEPAT setelah M9 ditutup — user bertanya "kok masih ada
lagi ya" (bug klaster yang sama terus muncul walau sudah M9). Laporan ini
BEDA dari pola sebelumnya: bukan tutorial/SKDI/tatalaksana lagi, tapi area
BARU (verifier dossier M6, metadata konten, aksesibilitas). 6 temuan,
semua diverifikasi manual thd kode aktual sebelum bertindak — 4 FIXED, 1
FIXED (kosmetik), 1 REJECTED dgn bukti.

**[P1 FIXED] Verifier dossier tak pernah menghitung ulang `klaim.badge`**
— `verifikasiDossier()` (verifikasi.ts) membandingkan tally/skor/hari/
paket/tamat hasil replay vs klaim, TAPI TIDAK PERNAH memanggil
`hitungBadge(akhir)` utk dibandingkan. Diverifikasi dulu apakah ini
genuinely eksploitable atau cuma redundan dgn cek lain: `hitungBadge`
bergantung tally (SUDAH dicek penuh) + skor.grade (SUDAH dicek) TAPI JUGA
`desa.keluarga[].arcSelesai` (badge `sahabat_desa`), `state.dex[].bintang`
(badge `kolektor_dex`), dan `state.akreditasi` (badge `paripurna`) — TIGA
field yang TIDAK dicek di manapun lain dalam verifier. Artinya badge
`kolektor_dex`/`sahabat_desa` bisa dipalsukan (state dimanipulasi sebelum
`susunDossier` menandatangani ulang) tanpa terdeteksi sama sekali; hanya
`paripurna` yg kebetulan aman krn `akreditasi` MEMANG ikut mempengaruhi
`hitungSkor` (jadi tertangkap tak langsung lewat cek skor).

Test merah dibuat dulu (`m6verifikasi.test.ts`): fabrikasi `state.dex`
25-entri bintang3 (badge `kolektor_dex` palsu) yg tak mempengaruhi tally/
skor sama sekali → sebelum fix, `verifikasiDossier` tetap vonis `sah`
(gejala persis klaim CODEX). Fix: tambah `hitungBadge(akhir)` dibanding
`d.klaim.badge` (sorted, krn urutan tak bermakna) di titik banding yang
sama dgn tally/skor. Stash/restore mengonfirmasi merah tepat → hijau.
23/23 test verifikasi lolos (+1 baru). Tak ada REVISI_ENGINE bump —
`hitungBadge` sendiri tak berubah, utk dossier JUJUR yang sudah ada
`hitungBadge(akhir)` akan selalu = `klaim.badge` (replay deterministik
mereproduksi state yg sama); ini menutup celah verifikasi, bukan mengubah
apa yang dianggap "benar".

**[P2 FIXED] `fktp144` per-kasus kontradiksi internal dgn `skdi` sendiri**
— CODEX bilang "21 kasus tak masuk progres Dex, 18 di antaranya
`fktp144:true`" — diverifikasi: klaim benar scr angka, TAPI kesimpulan yg
tersirat (harusnya masuk Dex) salah paham arsitektur. `fktp144` (field
per-kasus, comment "termasuk daftar 144 penyakit wajib TUNTAS FKTP") sama
sekali TAK dipakai di runtime manapun (grep: nol referensi di luar
fixture test) — linking Dex sungguhan dikendalikan `skdi144.ts` +
auto-link ICD-10 (index.ts), independen total dari field ini. Tapi
ditemukan bug NYATA yg beda: 8 kasus (`ppok_eksaserbasi`,
`apendisitis_akut`, `mm_hipertensi_urgensi`, `mm_gagal_jantung_kongestif`,
`kia_preeklampsia_berat`, `kia_abortus_iminens`, `mm_artritis_reumatoid`,
`jiwa_skizofrenia`) menyatakan `fktp144:true` padahal `skdi` mereka SENDIRI
3A/3B — kontradiksi definisional (3A/3B = butuh rujuk = TAK MUNGKIN "wajib
tuntas", independen dari dokumen otoritatif manapun, murni dua field
self-report yang saling bertentangan). Diperbaiki `fktp144:false` utk
ke-8. Test-first: `pack.test.ts` assert kontradiksi kosong, merah dgn 8
pelanggar persis → fix per-file → hijau. Dicek juga 3 kasus 4A lain
(`mata_konjungtivitis_alergi`, `kia_kb_konseling`, dan `tht_rinosinusitis_
akut` yg sudah dikonfirmasi §30 bukan 4A) thd SKDI 2012 — konjungtivitis
alergi TAK dapat entri Dex terpisah krn SKDI 2012 cuma py SATU entri
generik "Konjungtivitis" (4A, sudah dipakai `conjunctivitis_bacterial`);
KB konseling ternyata masuk daftar KETERAMPILAN klinis (lampiran lain),
bukan Daftar Penyakit — keduanya correctly-excluded, bukan bug.

**[P2 FIXED, kosmetik] Nama Dex "Hiperurisemia" tak cerminkan kompetensi
gabungan** — sejak M9.2 menautkan `mm_gout_artritis_akut` ke entri
`hyperuricemia`, nama tampilan Dex masih "Hiperurisemia" saja, padahal
kompetensi resminya (dikonfirmasi §30 langsung dari teks Kepmenkes
1186/2022) berjudul "Hiperurisemia-Gout Arthritis". Diganti persis sesuai
judul bab resmi. Tak ada test/kode lain bergantung nama string ini
(digrep, aman).

**[P3 FIXED] `aria-hidden` kebalik di stempel grade `PanelHasil.tsx`** —
`aria-hidden={!tutorial}` pada wrapper stempel berarti utk encounter
NORMAL (mayoritas kasus), grade stamp (huruf besar A/B/C/D) DISEMBUNYIKAN
dari screen reader, sementara ikon 🎓 dekoratif (tutorial) yg justru
terekspos. Test merah dibuat (`PanelHasil.test.tsx`, cek atribut
`aria-hidden` langsung via `container.querySelector`, bukan cuma teks DOM
spt test lama yg tak bisa menangkap ini) → 2/2 merah persis. Fix:
wrapper tak lagi `aria-hidden` sama sekali; emoji 🎓 (tutorial) dibungkus
`<span aria-hidden="true">` sendiri (memang dekoratif, teks di sebelahnya
sudah menjelaskan); stempel grade (normal) diberi `aria-label="Grade X"`
eksplisit (bukan cuma huruf telanjang). Diverifikasi browser end-to-end:
pasien tutorial → wrapper tak `aria-hidden`, 🎓 ber-`aria-hidden="true"`;
pasien kedua (real) → wrapper tak `aria-hidden`, stempel `aria-label=
"Grade D"` (dikonfirmasi via `preview_eval` baca `outerHTML` langsung,
dua alur penuh via klik sungguhan bukan cuma unit test). 4/4 test lolos.

**[P3 FIXED] `adaNegasiDekat` (tatalaksanaClue.test.ts) berhenti di
kemunculan negasi PERTAMA** — komentar fungsi sendiri sudah menjanjikan
"cek SETIAP kemunculan", tapi implementasi `return true` begitu SATU
kemunculan kata kunci ternegasi, walau kemunculan LAIN kata yang sama tak
ternegasi (janji nyata terlewat). Contoh gagal: clue campuran "antibiotik
tidak diperlukan di awal, tapi... antibiotik wajib diberikan" — versi
lama vonis "aman" (skip) krn berhenti di kemunculan pertama. Test merah
dibuat dulu (2 kasus: campuran vs semua-ternegasi) → fix jadi "SEMUA
kemunculan wajib ternegasi baru dianggap aman" (bukan OR pada kemunculan
pertama) → hijau. CODEX sendiri mencatat tak ada kasus gameplay NYATA yg
kena ini hari ini — dikonfirmasi benar (0 pelanggar di 3 test sweep lama
setelah fix, konsisten dgn catatan CODEX).

**[P3 FIXED, pagar preventif] ICD-10 duplikat antar-entri `skdi144.ts`
tak didokumentasikan** — 3 pasangan (`vaginitis`/`bacterial_vaginosis`
N76.0, `tinea_capitis`/`tinea_barbae` B35.0, `blunt_trauma`/`sharp_trauma`
S00-S09) — auto-link (index.ts) mencocokkan ICD per-ENTRI independen,
jadi kalau kelak ada kasus baru dgn salah satu kode ini, KEDUA entri
skdi144 akan diam-diam tertaut ke kasus yg SAMA sekaligus (belum terjadi
hari ini — nol kasus playable pakai ketiga kode ini, makanya CODEX sendiri
bilang "belum berdampak runtime"). Ditambah test permanen dgn allowlist
eksplisit (pola sama `GENERIK_SENGAJA`) yg menjaring ICD duplikat BARU yg
tak didaftar, sekaligus menjaring kalau allowlist membusuk (entri
terdaftar tapi duplikatnya sudah hilang dari konten). Diverifikasi-bergigi:
sabotase sementara satu key allowlist → merah persis (nama pasangan
duplikat di pesan) → restore → hijau.

**[REJECTED, terverifikasi] "6 kasus slot terapi kosong" bukan bug** —
`stroke_iskemik`, `mm_obesitas`, `kia_abortus_iminens`, `kia_kb_konseling`,
`jiwa_depresi_ringan`, `jiwa_insomnia` diperiksa satu-satu (clue +
harusDirujuk + skdi): SEMUA manajemen non-farmakologis yang memang lini
pertama scr EBM (stroke akut FKTP = stabilisasi-rujuk tanpa obat penurun
tensi; obesitas = intervensi gaya hidup dulu; abortus iminens = tirah
baring+rujuk; KB konseling = edukasi murni; depresi ringan = keputusan
sudah eksplisit dari ronde CODEX jauh sebelumnya, `obatBenar:[]` disengaja;
insomnia = CBT-I lini pertama, bukan obat). Semua py `edukasi.length`
2-4 (dimensi `skorEdukasi` SUDAH menilai modalitas non-farmakologis ini
scr eksplisit) — CODEX sendiri menghedge temuan ini ("blindspot BILA
ingin dinilai eksplisit", bukan klaim ada yg salah). Tak ada perubahan.

Verifikasi total: `npm run typecheck` bersih, `npm test -- --run` → **386
test** (dari 379 — +7 test baru: 1 badge, 1 fktp144-konsistensi, 1 ICD-
duplikat, 2 negasi, 2 PanelHasil a11y), 36 file. Tak ada REVISI_ENGINE
bump (semua fix menutup celah verifikasi/konten/a11y, nol perubahan
semantik skor/replay utk state valid). Verifikasi browser end-to-end utk
fix P3 aksesibilitas (satu-satunya yg observable visual/DOM).

## 32. Follow-up sempit (verifier-completeness + a11y sweep) + CODEX ronde-17 (2026-07-05)

Dua langkah pendek yang diminta user pasca-§31 ("small scoped follow-up"),
lalu satu ronde CODEX baru masuk tepat setelahnya.

**Verifier-completeness sweep**: menelusuri SEMUA field yang ditampilkan
layar verifikasi dosen (`TitleScreen.tsx`) balik ke apa yang benar-benar
dibanding `verifikasiDossier` — namaDokter/nim/mode/paketUjian/hari/tamat/
seed/skorKlaim/skorReplay. Satu hipotesis diuji serius: bisakah `mode`/
`seedKurikulum` dipalsukan (mis. ujian→karier) utk lolos gerbang ikatan
NIM (yang cuma berlaku `mode==='ujian'`)? Ternyata TIDAK — `seedKurikulum`
menentukan pasien apa yang di-generate director saat replay
(`Rng(seedKurikulum,'director',1)`), jadi memalsukan field itu membuat
replay men-generate pasien BEDA dari yang direkam `jejak`, otomatis
menabrak perbandingan tally yang SUDAH ada. Tak ada celah kedua ditemukan
— badge (§31) tetap satu-satunya lubang nyata.

**A11y sweep**: grep semua 18 penggunaan `aria-hidden` di renderer — HANYA
`PanelHasil.tsx` yang pernah memakai pola kondisional (`aria-hidden=
{ekspresi}`); sisanya semua statis pada elemen dekoratif (ikon, radio
dot, panah tab) dan sudah benar. Icon-only button (mute, gear pengaturan,
✕ modal) semua sudah ber-`aria-label`. Tak ada perubahan kode — sweep
bersih, mengonfirmasi bug §31 adalah kejadian tunggal bukan pola berulang.

**CODEX ronde-17**: laporan BARU (beda dari §31), 3 temuan — semua
diverifikasi thd kode SEBELUM bertindak:

1. **STALE (bukan bug baru)** — "10 kasus `fktp144:true` masih belum
   tertaut Dex". Angka ini benar scr matematis (18 unlinked-fktp144:true
   dari §31 dikurangi 8 yang sudah diperbaiki ke `false` = 10 sisa), tapi
   SEMUA 10 sudah diinvestigasi tuntas di §26/§30/§31: `dispepsia_
   fungsional`/`mm_low_back_pain`/`mm_mialgia` bukan entri Daftar Penyakit
   (kemungkinan Daftar Masalah); `kia_kb_konseling` masuk Daftar
   Keterampilan Klinis, bukan Daftar Penyakit; `mata_konjungtivitis_
   alergi` — SKDI 2012 cuma py SATU entri generik "Konjungtivitis" (4A),
   sudah diklaim `conjunctivitis_bacterial`, arsitektur skdi144 tak
   mendukung 2 kasus per entri; `kulit_dermatitis_kontak`/`mm_
   osteoartritis_lutut`/`jiwa_gangguan_cemas`/`jiwa_depresi_ringan`/`tht_
   rinosinusitis_akut` — self-report `skdi:'4A'` TERBUKTI KELIRU dibanding
   dokumen resmi (dikonfirmasi ulang §30 langsung dari teks SKDI 2012).
   **Keputusan yang masih menggantung** (bukan bug, keputusan kurikulum):
   apakah 5 kasus terakhir itu perlu dikoreksi field `skdi`-nya sendiri
   biar cocok dokumen resmi — sudah diflag sejak §26, user belum pernah
   diminta memutuskan scr eksplisit.

2. **PARTIALLY VALID** — "gap desain skoring manajemen non-obat" (klaim
   umum CODEX, menyebut 3 kasus: `kia_kb_konseling`, `jiwa_depresi_
   ringan`, `jiwa_insomnia`). Diverifikasi SATU-SATU (bukan pukul rata
   spt §31 kemarin): `jiwa_depresi_ringan` (`manajemen_stres`/
   `aktivitas_fisik`/`kontrol_rutin`) dan `jiwa_insomnia` (`higiene_
   tidur`/`manajemen_stres`/`aktivitas_fisik`) topik edukasinya SUDAH
   selaras dgn clue masing-masing — REJECTED utk keduanya, klaim CODEX
   tak berlaku di sana. TAPI `kia_kb_konseling` ternyata **memang
   bermasalah nyata**: clue-nya 100% soal PEMILIHAN METODE KB aman saat
   menyusui (non-hormonal/progestin-only, hindari kombinasi estrogen),
   tapi `tatalaksana.edukasi` lama (`asi_eksklusif`/`kontrol_rutin`/
   `gizi_seimbang`) sama sekali generik pasca-persalinan — TAK SATUPUN
   dari 69 topik edukasi di seluruh katalog menyentuh pemilihan metode KB.
   Ini kelas bug PERSIS yang diburu M9.3 (clue menjanjikan X, tatalaksana
   tak mencerminkannya) tapi di SUMBU BEDA (edukasi, bukan obat) yang
   sweep M9.3 tak pernah cek. **Fix**: topik baru `kb_aman_menyusui`
   ("[KB] Metode aman saat menyusui — hindari estrogen kombinasi",
   kategori `kia`) ditambah ke `katalogM3.ts`, MENGGANTIKAN `gizi_
   seimbang` (bukan cuma ditambah) di `kia_kb_konseling` — penting krn
   `KAPASITAS_EDUKASI=3` pas dgn total wajib lama (3): kalau cuma
   ditambah jadi 4 wajib, `edukasiTarget=min(3,4)=3` tetap tercapai
   tanpa pernah menyentuh topik baru, jadi HARUS mengganti bukan menambah
   agar topik krusial ini benar2 wajib dipilih. Verifikasi-bergigi: test
   baru `nilaiEncounter` bandingkan 2-topik-lama vs +topik-baru → merah
   tepat (`toContain` gagal) sebelum fix, hijau sesudah. Diverifikasi
   browser: cari "estrogen" di tab Edukasi pasien manapun → laci "Ibu &
   Anak (KIA)" tampilkan nama topik penuh, tanpa error konsol.
   **REJECTED** klaim umum "butuh slot tindakan konseling/CBT-I baru
   sbg mekanik terpisah" — `rasioTerapi=1` saat totalSlot=0 SUDAH benar
   (obat di luar rencana tetap kena `obatDiLuar`/`obatBerbahaya` independen
   dari totalSlot; "tak meresepkan apa-apa" utk kasus tanpa indikasi obat
   memang tindakan BENAR, bukan celah) — mekanisme yang sudah ada
   (`skorEdukasi` terpisah) cukup, SELAMA topik edukasi kasusnya sendiri
   akurat (itulah kenapa fix di atas menyasar KONTEN, bukan ENGINE).

3. **FIXED (dokumentasi)** — komentar `skdi144.ts:14-16` masih bilang
   "15 dari 16 kasus slice" (peninggalan era vertical-slice M0/M1, sebelum
   67 kasus & 46 tertaut hari ini) — diperbarui + ditaut ke §26/§30/§31.

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **387 test**
(dari 386, +1), 36 file. Tak ada REVISI_ENGINE bump (konten/dokumentasi
murni).

## 33. CODEX ronde-18 — 5 temuan multidimensi, 3 dikerjakan + 1 diverifikasi jadi M10 (2026-07-05)

Ronde baru (beda lagi dari §32), dipicu pertanyaan strategis user: "apa
masih ada bangunan yang layak M10 sendiri?" Semua 5 temuan diverifikasi
dulu thd kode sebelum diputuskan skala responsnya.

**[FIXED] Prosedur/tindakan klinis tak dibebankan ke kapitasi** —
katalog tindakan (nebulisasi 40rb, Epley 25rb, dst.) punya `biaya` sejak
jadi mekanik ternilai (CODEX ronde-10), tapi `reducer.ts` case DISPOSISI
cuma looping `encFinal.resep` (obat) utk memotong kapitasi — `encFinal.
tindakan` tak pernah disentuh. Prosedur jadi gratis & tak terlihat di kas
maupun ringkasan biaya UI (`DeckDisposisi.tsx` cuma tampilkan lab+obat).
Fix: loop tindakan ditambah (pola sama obat — BPJS membebani kapitasi,
umum bayar retribusi; tindakan cuma py SATU field `biaya`, beda dari obat
yg beli/jual terpisah) + baris "Tindakan" ditambah ke ringkasan biaya UI.
Test-first (`m4ekonomi.test.ts` M4.22): drive `ppok_eksaserbasi`→
`nebulisasi` via `buatPasienDariKasus` + reducer sungguhan sampai
DISPOSISI, merah tepat (kapitasi tak berubah) → hijau. **REVISI_ENGINE
11→12** — jejak lama dgn TAMBAH_TINDAKAN kini mereplay ke kapitasi (dan
skor Manajemen via ambang kas) berbeda dari yang tercatat.

**[FIXED, bareng rev 12] `sidikJariPack` tak pernah hash `pack.tindakan`**
— beda dari obat/lab yang sudah hash isi, katalog tindakan SAMA SEKALI
tak tersentuh sidik jari (bukan cuma "hash ID doang" spt edukasi — nol
sentuhan). Sebelum fix billing di atas, ini belum jadi lubang AKTIF krn
`biaya` belum score-affecting; begitu billing diperbaiki, field ini jadi
genuinely tak terlindungi. Ditambah hash isi (`id`+`biaya`) di titik yang
sama dgn obat/lab. Test baru: ubah `biaya` satu tindakan → fingerprint
berubah.

**[FIXED, konten] `mm_gagal_jantung_kongestif` pakai topik edukasi
`minum_air_cukup`** (sinonim ISK/hidrasi — anjuran MINUM LEBIH BANYAK)
padahal manajemen gagal jantung kongestif justru butuh RESTRIKSI cairan
(kebalikan) — mismatch internal antara clue sendiri (dekongesti/hati-hati
cairan) dan topik edukasi wajibnya. Diganti topik baru `restriksi_cairan_
gagal_jantung` ("Batasi cairan & pantau berat badan harian"). Kelas bug
yang SAMA persis dgn `kia_kb_konseling` §32 (clue vs edukasi mismatch) —
makin menguatkan bahwa sumbu ini (bukan cuma obat) perlu perhatian.

**[STALE]** "metadata SKDI masih menggantung" — sama persis dgn item
terbuka §26/§30/§31/§32: 5 kasus self-report `skdi:'4A'` yang terbukti
keliru dibanding dokumen resmi, belum ada keputusan eksplisit user apakah
field itu perlu dikoreksi. Tak ada aksi baru — sudah dicatat berulang.

**[DIVERIFIKASI, direkomendasikan jadi M10]** "Edukasi >3 topik wajib bisa
full-score walau melewatkan topik paling kritis" — probe CODEX (dengue_df
skor 100 tanpa `tanda_bahaya`+`cairan_oralit`; tb_paru skor 100 tanpa
`minum_oat_tuntas`) dikonfirmasi AKURAT: formula `edukasiTarget = min(
KAPASITAS_EDUKASI(3), edukasiWajib.length)` di `clinic.ts:549` memang
menilai penuh dari topik MANA SAJA, tanpa membedakan topik yang klinis
kritis (tanda bahaya, kepatuhan obat) dari yang suportif (istirahat,
kompres). Ini KEPUTUSAN SADAR era M7 ("kasus komorbid wajib>3 tetap bisa
100" — komentar kode sendiri), bukan oversight — tapi audit skala penuh
menemukan **32 dari 67 kasus (48%) py edukasiWajib.length > 3**, jauh
lebih luas dari yang diasumsikan saat M7. Efek cross-cutting terverifikasi
konkret: `skorEdukasi` masuk `rmLengkap` (rekam medis lengkap, ambang ≥50)
yang menentukan `state.akreditasi`, yang lalu masuk dimensi Manajemen
`hitungSkor` — jadi gaming pola ini BUKAN cuma kosmetik "Edukasi" per-
encounter, ikut menggelembungkan skor Manajemen keseluruhan. **Tak
ditemukan** dampak langsung ke peta/UKM (dugaan awal user) — dimensi UKM
digerakkan `kunjungan`/kader/RW, jalur terpisah dari edukasi klinik.
Memperbaiki ini dgn benar (bukan tambal satu kasus) butuh: field konten
baru (mis. `edukasiKritis?: string[]` per-kasus), formula skor baru yang
membedakan wajib-kritis vs wajib-suportif, REVISI_ENGINE bump, DAN
keputusan kurikulum per-kasus utk semua 32 kasus (topik mana yang benar2
tak-bisa-dilewatkan). Direkomendasikan sbg M10 tersendiri, TIDAK dikerjakan
sesi ini (skala 32-kasus + keputusan desain butuh persetujuan user
eksplisit dulu, bukan tambal reaktif).

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **390 test**
(dari 387, +3: M4.22 billing, sidikJariPack tindakan, gagal-jantung
konten), 36 file. **REVISI_ENGINE 11→12**. Browser: ringkasan biaya
DeckDisposisi kini tampilkan baris "Tindakan", nol error konsol.

## 34. Bug LIVE ditemukan user main langsung di build desktop (2026-07-05)

Beda dari 34 entri sebelumnya (semua audit read-only CODEX): ini ditemukan
user main SUNGGUHAN via `npm run dev` (jendela Electron nyata, bukan
preview browser otomatis) — banner tutorial fase Terapi bilang "Tambahkan
obat yang menyala ke resep", tapi user tak bisa menemukan obat mana yang
menyala di layar. Tanya balik: "mana obat yang menyala?"

**Akar masalah**: target sorotan tutorial adalah `paracetamol_500`
(`OBAT_PERTAMA_TUTORIAL`, `engine/tutorial.ts`), tapi formularium
(`DeckTerapi.tsx`) terurut ALFABETIS dan panjang (~69 obat) — "Paracetamol"
(huruf P) jauh di bawah viewport awal yang cuma menampilkan obat berhuruf
A. Tak ada `scrollIntoView` atau indikasi visual apa pun bahwa target ada
di bawah — CSS glow (`.klinik-sorot-tutorial`) sudah benar diterapkan ke
tombol yang tepat, tapi kalau tak kelihatan di layar, glow itu tak berguna.

**Kenapa lolos semua test/audit sebelumnya**: jsdom (lingkungan test
komponen) tak mengimplementasikan scroll/layout sungguhan — test invarian
M9.1 yang mem-verifikasi "tepat 1 tombol aktif" tak pernah butuh mengecek
APAKAH tombol itu kelihatan di viewport, cuma apakah `disabled`-nya benar.
Kelas bug ini (offscreen tanpa scroll) HANYA kelihatan saat manusia main
di layar sungguhan dgn ukuran viewport terbatas — bukti nyata kenapa
verifikasi browser otomatis (preview tools) masih belum cukup gantikan
playtest manusia utk sebagian kelas bug UX.

Fix: `useEffect` baru di `DeckTerapi.tsx` — begitu tab Resep aktif & obat
target belum masuk resep (`sorotObat`), `document.querySelector('.klinik-
obat .klinik-sorot-tutorial')?.scrollIntoView({block:'center', behavior:
'smooth'})`. Test-first: `DeckTerapi.test.tsx` baru, render komponen dgn
`tutorialAktif=true`, assert `scrollIntoView` terpanggil (di-mock via
`vi.fn()` krn jsdom tak implementasikan method ini sama sekali — merah
persis "not called" sebelum fix, hijau sesudah). Efek samping: perlu stub
global `Element.prototype.scrollIntoView` di `vitest.setup.ts` (dijaga
`typeof Element !== 'undefined'` krn file ini juga dimuat test .test.ts
di environment NODE tanpa DOM) — TANPA ini, test lain yang merender
`DeckTerapi` dgn tutorial aktif (mis. `Klinik.tutorial.test.tsx` M9.1)
ikut gagal krn jsdom throw "not implemented" begitu `scrollIntoView`
sungguhan dipanggil tanpa mock.

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **391 test**
(dari 390, +1), 37 file. Diverifikasi via HMR di jendela Electron yang
sama yang dipakai user main (`npm run dev`, bukan cuma preview browser).
Tak ada REVISI_ENGINE bump (UI/presentasi tutorial murni, di luar kontrak
skor/replay).

## 35. Bug LIVE kedua — lab "Asam Urat" beri hasil generik pada kasus gout (2026-07-05)

Ditemukan user LAGI sambil main (setelah §34) — kali ini di layar Lembar
Periksa: kasus `mm_gout_artritis_akut` (podagra klasik: MTP-1 edema/eritema/
nyeri) tapi hasil lab "Asam Urat" muncul `[normal]` — "Dalam batas normal,
tidak ada temuan bermakna." User curiga ini salah (asam urat SEHARUSNYA
tinggi pada gout) dan tanya balik utk dicek, bukan diterima mentah.

**Akar masalah dikonfirmasi read-only dulu** thd kode: kasus ini py entri
lab `asam_urat_darah` dgn narasi spesifik — "Asam urat 9.2 mg/dL (tinggi).
Catatan: kadar dapat normal saat serangan akut, diagnosis tetap klinis."
(`kasusMetabolikMsk.ts:120` — CATATAN ini sendiri sudah EBM-akurat: asam
urat SERUM memang bisa normal/rendah saat serangan akut gout, klasik
diajarkan di kedokteran, jadi kasusnya SUDAH benar secara klinis). Tapi
katalog lab (`katalog.ts`) py entri KEDUA, `asam_urat` ("Asam Urat" —
tanpa "Darah"), YATIM (grep: nol kasus manapun mereferensikannya di array
`lab`-nya) — near-duplikat nama yg gampang salah pilih saat pesan lab.
Mekanisme fallback (`reducer.ts:1299`, dipakai utk SEMUA lab yg dipesan
tapi tak relevan/tak ada di kasus): "Hasil pemeriksaan {nama}: dalam batas
rujukan — tidak menunjukkan kelainan bermakna untuk kasus ini." — persis
cocok gejala yg dilihat user. User memesan `asam_urat` (bukan `asam_urat_
darah`), sistem KERJA SESUAI DESAIN (anti-shotgun: lab tak-relevan dpt
pesan generik ini) — TAPI karena kedua entri nyaris identik nama, ini jadi
JEBAKAN bukan cuma "salah pesan lab lain" biasa (spt Kolesterol utk kasus
gout, yg jelas beda & tak membingungkan).

**Diperluas jadi audit orphan lab menyeluruh** (bukan cuma tambal 1
instance): skrip sementara `Object.values(PACK.kasus).lab[].id` vs
`Object.keys(PACK.lab)` → **2 entri yatim total**: `asam_urat` (di atas)
dan `mikroskopis_bta` (nama tampilan "Mikroskopis Gram/KOH" — SAMA SEKALI
tak terkait BTA). Ditemukan tambahan: `cocokLab` (util.ts) mencocokkan
query pencarian thd `nama` DAN `id` — jadi mencari "BTA" (mis. utk kasus
TB, entri sungguhan `bta_sputum`) ikut menjaring `mikroskopis_bta` yang
tak relevan, murni krn id-nya kebetulan mengandung substring "bta" walau
namanya tak menyebutnya sama sekali.

**Fix**: `asam_urat` DIHAPUS dari katalog.ts (100% redundan dgn
`asam_urat_darah`, bukan kasus "2 kode beda kompetensi digabung sengaja"
spt duplikat ICD skdi144 — di sini benar-benar sama, tak layak allowlist).
`mikroskopis_bta` → `mikroskopis_gram_koh` (id diganti biar tak nyangkut
pencarian "BTA", nama & isi entri tetap sama). Test-first: 2 test baru di
`pack.test.ts` (assert entri lama hilang, entri benar ada) — merah tepat
sebelum fix (entri lama masih ada), hijau sesudah.

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **393 test**
(dari 391, +2), 37 file. Diverifikasi via HMR di jendela Electron yang
sama (`npm run dev`) — perubahan konten ter-propagate (log HMR cascade
`@content/index` ke seluruh layar yg mengimpornya). Tak ada REVISI_ENGINE
bump (konten katalog murni, tak mengubah semantik skor — narasi/flag lab
per-kasus yg menentukan skor tak tersentuh, cuma entri KATALOG yatim yg
dihapus/di-rename).

**Pola sesi ini yang layak dicatat**: dua bug BERUNTUN (§34, §35) kali ini
ditemukan lewat GAMEPLAY SUNGGUHAN (user main di `npm run dev`), bukan
audit CODEX read-only — keduanya kelas bug yang TAK TERJANGKAU test
otomatis (scroll/viewport nyata; kebetulan penamaan yang membingungkan
manusia tapi tak "salah" scr teknis). Memperkuat pelajaran §34: playtest
manusia tetap perlu, di luar apa pun yang audit otomatis/browser-preview
bisa jangkau.

## 36. CODEX ronde M10 (pertama) — thd `docs/M10_AUDIT_BRIEF.md` (2026-07-05)

Ronde pertama menjalankan brief M10 (§ terakhir). 4 temuan, semua
diverifikasi thd kode aktual sebelum bertindak — brief BEKERJA (CODEX
tak mengulang satu pun item di daftar "DO NOT RE-REPORT"-nya).

**[SUDAH DIKETAHUI, bukan temuan baru] Skor edukasi >3 topik**
(`clinic.ts:541`, 32/67 kasus) — CODEX menambah 3 contoh konkret baru
(`dengue_df` bisa skip `tanda_bahaya`, `tb_paru` bisa skip `minum_oat_
tuntas`, `diare_akut_anak` bisa skip `cairan_oralit`) dgn reasoning
klinis per-kasus — nilai tambah nyata utk scoping nanti, TAPI ini bukan
temuan baru scr substansi (sudah dikonfirmasi §33, sudah jadi butir
utama M10 sejak awal). Belum dikerjakan — tetap butuh keputusan desain
(field `edukasiKritis?` baru + formula + REVISI_ENGINE bump + keputusan
kurikulum per-kasus utk 32 kasus) sebelum bisa di-tambal, scope terlalu
besar utk triase reaktif.

**[FIXED sebagian, P2] Karma (jembatan UKM→UKP) inject demografi yg
tak cocok kasusId-nya di 3 keluarga** — persis pertanyaan yang diajukan
brief §4.2 (belum diverifikasi lanjut saat itu), kini terjawab dgn 3
instance konkret:
- `keluarga_yani` → Nayla (bayi 3 bulan, `usia:0`) dijadwalkan ke
  `diare_akut_anak` (demografi 3-5 TAHUN). Diverifikasi: konten kasus
  ini (popok, "jajan es dan gorengan di depan sekolah") ditulis KHUSUS
  utk balita — melebarkan demografi ke bayi akan merusak akurasi kasus
  yg sudah ada utk balita. **TIDAK diperbaiki** — butuh kasus diare-bayi
  baru atau karma dialihkan, keputusan konten bukan tambal numerik.
- `keluarga_gunawan` → Dimas (usia 7, `kondisi:['asma_anak']`)
  dijadwalkan ke `asma_ringan` (demografi 15-40, anamnesis first-person
  dewasa "napas SAYA..."). Diverifikasi: TAK ADA kasus asma pediatrik di
  katalog sama sekali (grep seluruh `kasus/*.ts`). **TIDAK diperbaiki**
  — sama, butuh konten baru.
- `keluarga_lastri` → Mbah Lastri (usia 71) dijadwalkan ke `mm_
  hipertensi_urgensi` (demografi 45-70). Beda kelas dari 2 di atas — ini
  murni batas numerik 1 tahun, KONTEN kasus (anamnesis dewasa/lansia
  first-person) tak keberatan usia 71. **DIPERBAIKI**: `usiaMax` 70→80
  (hipertensi urgensi lansia >70 tahun realistis secara klinis, tak ada
  alasan medis membatasi tepat di 70).

Ditambah **test invarian MENYELURUH** (bukan cuma titik yg CODEX
laporkan manual — pola sama M9.1): `pack.test.ts` kini mengecek SEMUA
keluarga ber-karma, bukan cuma 3 yg dilaporkan — memvalidasi usia+jenis
kelamin anggota yg dijadwalkan vs demografi kasusId-nya, dgn allowlist
eksplisit `DIKETAHUI_BELUM_DIPERBAIKI` utk 2 kasus yang butuh konten baru
(pola sama `GENERIK_SENGAJA`) — regresi/kasus baru manapun yg tak
terdaftar akan GAGAL otomatis.

**[FIXED, P3] `DexSkdi.test.tsx` timeout flaky di suite penuh** — CODEX
benar: file ini sendiri selalu hijau cepat (~1,2-1,6s) saat direrun
terisolasi, TAPI run suite PENUH (37 file, kemungkinan kontensi resource
antar-worker paralel) pernah benar2 memicu timeout di batas 5000ms
default — bukan regresi logika (fix `pointerEventsCheck:0` ronde-13
tetap bekerja), murni risiko timing di bawah beban. Timeout eksplisit
dilonggarkan ke 15000ms utk test ini sbg headroom.

**[FIXED, P3] `sidikJariPack` belum hash isi topik edukasi**
(`nama`/`kategori`/`sinonim`) — cuma daftar ID (beda dari obat yg sudah
hash `kelas` walau field itu sendiri tak dipakai formula skor manapun —
konvensi codebase ini memang hash lebih dari yg strict-perlu skor demi
kelengkapan audit). Ditambah hash isi topik edukasi, konsisten dgn
precedent obat. Tak perlu REVISI_ENGINE bump: field ini tak pernah
memengaruhi `skorEdukasi` (murni ID membership) — menutup blindspot
audit, bukan mengubah semantik replay/skor.

Verifikasi: `npm run typecheck` bersih, `npm test -- --run` → **395
test** (dari 393, +2: karma-demografi invarian, sidikJariPack-edukasi),
37 file. Tak ada REVISI_ENGINE bump (semua fix konten/verifier-
completeness murni). 2 dari 4 temuan (edukasi>3-topik, 2 dari 3 karma
mismatch) DISENGAJA belum ditutup — butuh keputusan user (scope besar
atau konten baru), dikomunikasikan eksplisit, bukan ditambal diam-diam.

## 37. DeepThink triangulasi — `edukasiKritis` implementasi (2026-07-05)

Menindaklanjuti §36's "SUDAH DIKETAHUI, belum dikerjakan": menulis
`docs/DEEPTHINK_EDUKASI_KRITIS.md` (dossier 6 pertanyaan strategis),
lalu men-triase verdict DeepThink yg dikembalikan user thd kode aktual
sebelum implementasi — pola sama seperti setiap ronde CODEX sesi ini.

**Koreksi thd verdict DeepThink (diverifikasi sebelum implementasi):**
- **Daftar batch-1 (6 kasus) berisi 2 entri tak valid.** `pneumonia_
  balita` memang ada, TAPI cuma py 3 topik edukasi wajib
  (`KAPASITAS_EDUKASI=3` = seluruh wajib) — pemain SECARA MATEMATIS tak
  bisa skip satupun & tetap 100%, jadi bug ini tak menyentuhnya sama
  sekali. `"asma_bronkial_eksaserbasi"` TIDAK PERNAH ADA di kodebase
  (grep seluruh `kasus/*.ts` nihil; satu-satunya kasus asma adalah
  `asma_ringan`, dewasa 15-40, ID berbeda) — DeepThink berhalusinasi
  nama kasus ini. Batch diperkecil ke **5 kasus terverifikasi**:
  `dengue_df`, `tb_paru`, `diare_akut_anak`, `hipertensi_esensial`,
  `dm_tipe2` — masing2 dicek py >3 topik wajib (baru rentan bug) DAN
  py teks `konsekuensi.narasi`/EBM yg eksplisit menunjuk 1 topik
  tunggal paling kritis.
- **Klaim Q5 "`obatBerbahaya` pola yg sama dgn `vitalDiukur` cap" keliru.**
  Verifikasi `clinic.ts`: `obatBerbahaya` adalah **penalti linear per-
  instance** (`25 * obatBerbahaya` dikurangkan dari `skorTerapi`), BUKAN
  hard ceiling cap spt `vitalDiukur → min(skorPemeriksaan, 50)`. Tak
  membatalkan rekomendasi O1 (yg memang menunjuk `vitalDiukur`, bukan
  `obatBerbahaya`, sbg preseden pola) — tapi klaim "Terapi sudah py pola
  fatal-flaw yg sama" tidak akurat sbg pernyataan berdiri sendiri.
- **Risiko "fairness antar-paket ujian" (§3) bersifat spekulatif,
  ditest empiris.** Simulasi 8 paket × 30 hari (skrip sekali-pakai,
  dihapus stlh dipakai) menunjukkan variasi NYATA tapi SEDANG (9-16
  kemunculan gabungan 5 kasus per paket) — bukan skenario dramatis
  "15 vs 2" yg dispekulasikan. Semua 5 kasus batch-1 berstatus
  `prevalensi:'tinggi'` (bobot ×3 di RNG director), jadi muncul
  berulang di paket manapun — meredam ketimpangan secara alami.
- **Q6 ("tunda REVISI_ENGINE bump ke akhir milestone") ditolak,
  dgn alasan teknis.** `REVISI_ENGINE` di-hash LANGSUNG ke dalam
  `sidikJariPack` (`verifikasi.ts:143` area) — menunda bump berarti
  fingerprint build lama & baru IDENTIK walau semantik skor berbeda,
  membuka celah dossier JUJUR lama divonis **TIDAK SAH** (bukan "tidak
  dapat diverifikasi") persis kegagalan yg mekanisme REVISI_ENGINE
  dirancang mencegah. Precedent 12 riwayat rev sebelumnya: SEMUA bump
  terjadi di commit YANG SAMA dgn perubahan semantik, tak ada preseden
  bump tertunda. Bump dilakukan SEKARANG (rev 12→13), menyimpang dari
  saran literal DeepThink demi integritas mekanisme itu sendiri.

**Diimplementasi (O1 + O6, setelah triase di atas):**
- `types.ts`: `Tatalaksana.edukasiKritis?: string[]` — subset opsional
  dari `edukasi` wajib; kasus tanpa field ini (mayoritas, 62/67)
  berperilaku identik spt sebelumnya.
- `clinic.ts` (`nilaiEncounter`): topik `edukasiKritis` yg terlewat →
  `skorEdukasi` di-cap `min(skorEdukasi, 50)`, meniru pola
  `vitalDiukur→skorPemeriksaan` PERSIS. Ditambah field balik
  `edukasiKritisTerlewat: string[]` di return `PenilaianEncounter`.
- `state.ts`: `PenilaianEncounter.edukasiKritisTerlewat: string[]`
  (wajib) — 2 situs konstruksi objek literal (`director.test.ts`,
  `PanelHasil.test.tsx` fixture) diupdate, terdeteksi via typecheck.
- `pack.ts` (`validasiPack`): guard baru — `edukasiKritis` WAJIB subset
  murni dari `edukasi` (kritis yg bukan anggota wajib tak pernah bisa
  "tercakup", celah logika senyap kalau tak dicegah).
- Konten ditandai (dgn justifikasi per-kasus dari `konsekuensi.narasi`
  atau guideline EBM, bukan tebakan): `dengue_df→tanda_bahaya` (DSS),
  `diare_akut_anak→cairan_oralit` (syok hipovolemik, tekstual eksplisit
  di `konsekuensi.narasi`), `tb_paru→minum_oat_tuntas` (jalur ke MDR-TB),
  `hipertensi_esensial→kepatuhan_obat` (krisis hipertensi, tekstual
  eksplisit), `dm_tipe2→kepatuhan_obat` (PERKENI, komplikasi kronis).
- `PanelHasil.tsx` (O6): debrief kini menyebut EKSPLISIT nama topik
  kritis yg terlewat (via `PACK.edukasi[id].nama`), bukan cuma angka
  skor yg di-cap — konsisten dgn debrief sbg formative assessment
  PASCA-skor-terkunci (preseden `clue`/rincian skor yg sudah post-hoc).
- `verifikasi.ts`: `REVISI_ENGINE` 12→13 (lihat justifikasi Q6 di atas).
  `sidikJariPack` TAK butuh perubahan kode terpisah — `tx: k.tatalaksana`
  sudah hash seluruh objek wholesale, `edukasiKritis` otomatis tercakup;
  dikonfirmasi (bukan diasumsikan) via test baru di `m6verifikasi.test.ts`.

Verifikasi-bergigi: test clinic.ts (3 baru) merah→hijau sblm/sesudah
formula fix; test pack.ts (6 baru: 1 validasi-subset + 5 `it.each`
konten) merah (undefined) sblm tagging → hijau sesudah; test PanelHasil
(2 baru) — stash `PanelHasil.tsx`, konfirmasi MERAH persis pd assertion
teks topik kritis, restore, konfirmasi HIJAU. `npm run typecheck` bersih.
`npm test -- --run` → **407 test**, 37 file, semua hijau (dari 395 §36
+ 3 clinic + 6 pack + 2 PanelHasil + 1 sidikJariPack).
