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

## 38. Bug LIVE ketiga — toast Toaster menutupi/mengunci tombol modal & scene (2026-07-06)

User menemukan (screenshot langsung dari game): toast "Surat baru: ..."
menimpa teks dialog kunjungan rumah, membuatnya sulit terbaca — dan
melaporkan pola ini "acapkali" terjadi ("ada tombolisasi dll yang
saling bertumpuk/bertindihan dan mengganggu navigasi"). Diminta
diperiksa & dicarikan solusi; audit UI/UX serupa diminta dimasukkan
ke lingkup M10 ke depan (dicatat di memori, lihat bawah).

**Akar masalah, dikonfirmasi via kode SEBELUM menyentuh apa pun:**
`Toaster.tsx` (notifikasi event global — Dex bertambah, surat masuk,
dst.) di-render `position:fixed; bottom/right` dgn `z-index:
var(--z-toast)=400` — LEBIH TINGGI dari `--z-modal=300`. Konkretnya:
`DEX_BERTAMBAH` (toast "Buku Saku diperbarui") dipancarkan reducer.ts
di SETIAP `DISPOSISI` (`reducer.ts:314`) — yaitu TEPAT PADA SAAT
`PanelHasil` (modal debrief encounter) terbuka, HAMPIR SETIAP encounter
klinik. Tombol "Pasien Berikutnya →" PanelHasil duduk di pojok
kanan-bawah modal (`.klinik-hasil__aksi`, spacer `.tumbuh` mendorong
ke kanan) — geometri PERSIS bertabrakan dgn area render toast
(`bottom:var(--sp-5); right:var(--sp-5)`), dan modal (`max-width:
min(920px,92vw)`, centered) pada lebar window wajar menyisakan margin
kanan yg jatuh persis di rentang horizontal toast. Toast juga tak
py `pointer-events:none` — artinya bila posisinya kebetulan menimpa
sebuah tombol (modal ATAU scene, mis. "Mulai Berbincang →" Kunjungan),
klik pemain akan tertangkap toast (elemen teratas di titik itu),
BUKAN tombol di baliknya — bukan sekadar gangguan visual, tapi
literal memblokir progres bermain.

**Fix (2 baris CSS, sengaja minimal, keduanya independen):**
1. `tokens.css`: `--z-toast` turun dari 400 → **250** (di bawah
   `--z-modal=300`, tetap di atas `--z-hud=100`/`--z-drawer=200`) —
   toast kini SELALU tertutup/teredam oleh backdrop modal yg sedang
   terbuka, bukan menimpanya.
2. `Toaster.css`: tambah `pointer-events: none` pada `.toaster` — toast
   TAK PERNAH punya `onClick` (murni informatif, dicek di Toaster.tsx),
   jadi ini tanpa kompromi fungsional: klik pada titik manapun yg
   *kebetulan* ditimpa toast kini otomatis diteruskan ke elemen di
   baliknya, di scene ATAU modal manapun — bukan hanya kasus PanelHasil
   yg diverifikasi konkret.

**Verifikasi-bergigi via browser SUNGGUHAN** (harness `puskesmas-pagi-
preview` @ `vite.preview.config.ts`, sudah ada dari sesi sebelumnya
— renderer murni tanpa shell Electron, port 5199): dimainkan end-to-
end lewat store Zustand asli (`TANYA`→`LANJUT_FASE`→`PERIKSA`→
`KOMIT_DIAGNOSIS`→`TAMBAH_OBAT`→`TAMBAH_EDUKASI`→`DISPOSISI`) atas
kasus `kulit_dermatitis_kontak` sungguhan dari `PACK` — dikonfirmasi
`DEX_BERTAMBAH` MEMANG dipancarkan bersamaan `ENCOUNTER_SELESAI`
persis seperti dianalisis. Setelah fix: `getComputedStyle` pada
`.toaster` sungguhan mengonfirmasi `pointerEvents:'none'` DAN
`--z-toast` token bernilai `'250'` (bukan cache lama). Dipaksa kasus
terburuk (toast diposisikan PERSIS di atas tombol "Pasien Berikutnya")
dan `document.elementFromPoint()` + `MouseEvent` sungguhan pada titik
itu dikonfirmasi mendarat di TOMBOL, bukan toast — screenshot
mengonfirmasi tombol bersih tak tertutup visual sama sekali (toast
kini teredam di balik backdrop modal). Ini melampaui verifikasi CSS
biasa di codebase ini (jsdom tak memproses CSS asli, jadi fix CSS
murni historisnya diverifikasi via alasan kode + playtest user) —
sesi ini kebetulan menemukan harness preview browser yg sudah
dikonfigurasi lebih awal, memungkinkan bukti empiris langsung.
`npm run typecheck` bersih (perubahan CSS-only, tanpa TS tersentuh).

Scope disengaja SEMPIT: fix ini menutup SATU pola konkret & terverifikasi
(Toaster vs modal/scene manapun). Audit lebih luas utk pola
"tombolisasi bertumpuk" LAIN di layar lain (yg belum tentu ada, belum
diperiksa) sengaja TIDAK dikerjakan sekarang — user eksplisit minta
ini masuk lingkup M10 ke depan (dicatat di memori sesi).

## 39. M10.a — sapuan layering UI/UX sistematis, dimensi 4 M10 (2026-07-06)

M10 resmi dimulai (greenlight user, mono-agentic, CODEX menyusul dari
belakang). Urutan yang dipilih: M10.a layering UI/UX dulu — dimensi yang
CODEX (auditor read-only, tak bisa menjalankan game) paling lemah,
sementara harness browser `puskesmas-pagi-preview` sudah siap dari §38.

**Metode**: inventaris SEMUA `position:fixed/absolute` + `z-index` di
renderer (grep menyeluruh, 18 titik), triase jinak vs berisiko, lalu
verifikasi empiris tiap kandidat di ukuran window Electron MINIMUM
1200×760 (`main/index.ts` minWidth/minHeight) via hit-test
`document.elementsFromPoint` pada game yang benar2 dimainkan lewat
store Zustand asli — bukan tebakan geometri di atas kertas.

**Temuan 1 (P1, memblokir konten): kartu Catatan Observasi menelan
klik hotspot kunjungan.** `.kunjungan-temuan` (absolute kanan-atas,
lebar min(280px,34%), TUMBUH ke bawah per temuan — sampai 91% tinggi
scene dgn 3 temuan) di-render SETELAH lapis hotspot → menimpa hotspot
ber-x tinggi. Empiris di 1200×760: `wulan_k1` — temukan 3 hotspot kiri
dulu (urutan yang wajar), lalu `wk1_h3` (x88/y55, panci rebusan jamu —
temuan yang justru paling sentral utk hambatan-motivasi Bu Wulan)
hit-test ke `<p>` DI DALAM kartu, bukan tombol: TAK BISA DIKLIK sama
sekali. Konten ber-x≥75 ada di semua file desa (x=88/85/82/80/78...) —
kelas bug, bukan titik. Fix: `z-index:1` pada `.kunjungan-hotspot`
(tombol terangkat di atas kartu; kartu tetap scrollable di luar titik
36px; denyut yang tampak "di atas kertas" = sinyal jujur masih ada
temuan). Diverifikasi: hit-test balik ke BUTTON + `MouseEvent` sungguhan
pada titik yang tadinya terblokir sukses mendaftarkan `KLIK_HOTSPOT`.

**Temuan 2 (P2, zona-mati klik): tombol melayang mute+gigi menimpa
kartu Dex.** Sapuan 6 layar (meja/klinik/peta/dex/rapor/kunjungan) di
1200×760: di Buku Saku, KEDUA tombol fixed kiri-bawah (z-hud 100)
duduk PERSIS di atas `dexskdi-kartu` yang bisa diklik — dua zona mati
34px. Layar lain hanya tertimpa visual (teks/section non-interaktif).
Akar masalah struktural: tombol melayang `position:fixed` di atas SEMUA
layar — layar apa pun yang kontennya interaktif sampai pojok kiri-bawah
pasti kena, sekarang atau nanti. Fix menutup KELAS-nya: mute+gigi
DIDOK ke bilah HUD (prop `dok` + varian CSS `--dok` position:static,
render di ujung `hud__kanan`) — HUD selalu ada di semua layar in-game;
TitleScreen (tanpa HUD, pojok kosong) tetap versi melayang. Diverifikasi
browser: floating=0 in-game, dok di dalam rect HUD, klik gigi membuka
modal & mute toggle `aria-pressed` normal, titik pojok yang dulu
tertelan kini hit-test ke kartu Dex; TitleScreen tetap `position:fixed`.

**Titik lain diperiksa & jinak**: `.klinik-sorot-tutorial` (z:1
relative, glow), `.folder::before` / `.dexskdi-kartu__pin` (dekorasi),
badge HUD, lapisan dekoratif TitleScreen, `.kunjungan-scene--redup::
after` (sudah pointer-events:none), overlay modal/onboarding/pengaturan
(z-modal seragam, urutan DOM menentukan — Onboarding di-render terakhir
di App, benar krn dia gerbang hari-1). Token `--z-drawer` yatim (tak
dipakai siapa pun) — dibiarkan, bukan bug.

**Pagar permanen baru**: `src/renderer/src/styles/lapisan.test.ts` (4
test) — jsdom tak memproses CSS (alasan kelas bug ini selalu lolos
suite), jadi pagar bekerja di LEVEL SUMBER (pola tatalaksanaClue.test.ts):
urutan token z (hud<drawer<toast<modal), `.toaster` pointer-events:none
(§38), `.kunjungan-hotspot` z-index, varian `--dok` + kehadiran
`<MuteButton dok />`/`<Pengaturan dok />` di Hud.tsx (kalau dicabut dari
HUD tanpa sadar, versi melayang TIDAK kembali otomatis — pemain
kehilangan akses audio/pengaturan in-game). Verifikasi-bergigi: stash
7 file fix → 2 assertion terikat-fix MERAH persis (2 assertion §38 yang
sudah committed tetap hijau) → pop → hijau semua.

Verifikasi: typecheck bersih; `npm test -- --run` → **411 test** (dari
407, +4 lapisan), 38 file, hijau. Tak ada REVISI_ENGINE bump (murni
presentasional, nol semantik skor/replay). Layar kegiatan/IGD tak
di-sweep khusus utk tombol melayang — temuan 2 menghapus tombol
melayang dari SEMUA layar in-game sekaligus, termasuk keduanya.

## 40. CODEX ronde-2 (thd brief `M10_AUDIT_BRIEF_R2.md`) — 2 temuan, keduanya diterima sebagian (2026-07-06)

Ronde pertama CODEX menjalankan brief R2 (§39 sebelumnya). Dua temuan,
semua diverifikasi thd kode aktual sebelum ditindak (baca file:baris
persis, konfirmasi kutipan cocok) — brief BEKERJA (nol re-report dari
DO-NOT-RE-REPORT §36-39).

**[P2, DITERIMA 6/8 + 1 dikoreksi] Kasus lain skor Edukasi 100% walau
lewatkan topik yang konsekuensinya sendiri sebut kritis.** CODEX
mengusulkan 8 kandidat perluasan `edukasiKritis` (§37). Diverifikasi
satu-satu thd `konsekuensi.narasi` (bukan diterima mentah):

- **6 diterima langsung** (konsekuensi eksplisit menamai kegagalan
  edukasi sbg trigger tekstual): `faringitis_akut`→`kepatuhan_obat`
  ("antibiotik tak dituntaskan 10 hari → demam rematik"),
  `tonsilitis_akut`→`kepatuhan_obat` (pola identik),
  `demam_tifoid`→`kepatuhan_obat` ("tak dituntaskan → perforasi usus"),
  `kia_isk_kehamilan`→`kepatuhan_obat` ("tak tuntas → pielonefritis/
  kontraksi prematur" — risiko janin, bukan cuma ibu),
  `disentri_basiler`→`cairan_oralit` ("dehidrasi memberat...mengancam
  jiwa"), `kulit_morbili`→`tanda_bahaya` (`kondisiKembali` eksplisit
  "napas cepat, tarikan dinding dada" — red flag pneumonia persis yg
  `tanda_bahaya` ajarkan).
- **1 diterima dgn nuansa**: `mm_gagal_jantung_kongestif`→
  `restriksi_cairan_gagal_jantung`. Konsekuensi teksnya sendiri
  sebenarnya berbicara soal dekongesti+rujuk (aksi KLINIS), BUKAN
  kegagalan edukasi pasien secara langsung — beda kelas dari 6 di atas.
  Tetap ditandai krn `restriksi_cairan` adalah topik KHAS-CHF (vs 3
  topik lain yg generik penyakit kronis manapun) dan kegagalan readmisi
  CHF di dunia nyata memang klasik disebabkan pasien tak membatasi
  cairan di rumah — penalaran klinis independen, bukan makna tekstual
  konsekuensi.narasi.
- **1 DITOLAK**: `ppok_eksaserbasi` — CODEX sendiri melabelinya "kandidat
  sedang" (bukan kuat), dan setelah dibaca ulang, alasannya jelas:
  konsekuensinya ("tidak segera dirujuk...gagal napas hiperkapnik")
  murni soal KETERLAMBATAN RUJUKAN DOKTER (disposisi, bukan patient
  self-care) — tak satu pun dari 4 topik edukasinya (berhenti_merokok/
  teknik_inhaler/tanda_bahaya/kontrol_rutin) jadi trigger tekstual
  outcome buruknya. Mekanik `edukasiKritis` menilai kegagalan EDUKASI
  PASIEN, bukan keterlambatan keputusan dokter — beda sumbu sama sekali.
- **Usulan tambahan CODEX** (topik edukasi baru utk "wajib lapor PD3I"
  pada `kulit_morbili`) DITOLAK sbg category error: pelaporan surveilans
  PD3I adalah kewajiban REGULATORIS petugas kesehatan (lapor ke dinkes),
  bukan sesuatu yg diajarkan KE PASIEN/keluarga — tak pernah cocok masuk
  `tatalaksana.edukasi` (yg semuanya topik utk pasien) sama sekali,
  independen dari ada/tidaknya celah `edukasiKritis`.

7 kasus ditandai (6 diterima + 1 bernuansa), REVISI_ENGINE **TIDAK** perlu
bump — formula cap-50 sudah ada sejak §37, ini murni konten baru mengisi
mekanik lama (sama seperti menambah kasus baru ke pack, bukan mengubah
semantik skor).

**[P3, DITERIMA PENUH] Karma di kunjungan selain indeks-0 lolos
validasi tapi tak pernah dijadwalkan — footgun konten masa depan.**
`karma?` (types.ts, field pada `SkenarioKunjungan`) secara tipe tak
dibatasi ke kunjungan pertama, dan `validasiPack` (pack.ts, SEBELUM fix)
memvalidasi kasusId/anggotaIndex di SEMUA posisi kunjungan — tapi
`init.ts` (`jadwalKarma`) HANYA membaca `arc.kunjungan[0]`. Saat ini 0
instance aktif (dikonfirmasi: 9 karma real semua di index 0 — termasuk
`keluarga_wulan` yg sempat disangka index 1 saat menyusun test, tapi
ternyata karma-nya tetap di dalam objek `kunjungan[0]` yg panjang).
Bukan bug aktif, tapi jebakan senyap murni bagi penulis konten masa
depan: taruh karma di kunjungan ke-2/3 → lolos validasi → diam-diam
tak pernah terjadi di gameplay. Fix: `validasiPack` kini menolak eksplisit
karma di `kunjungan[i]` untuk `i>0` dgn pesan yg menjelaskan KENAPA
(bukan cuma "invalid"). Tak ada REVISI_ENGINE bump (guard konten,
bukan perubahan skor/replay).

Verifikasi-bergigi: 8 assertion baru (7 `it.each` edukasiKritis + 1 test
karma-posisi) merah persis sblm fix (undefined/[] kosong) → hijau
sesudah. `npm run typecheck` bersih. `npm test -- --run` → **419 test**
(dari 411), 38 file, hijau.

## 41. M10.a ronde-2 — sudut lanjutan layering, satu per satu (2026-07-06)

Melengkapi §39 (yang menguji 6 layar utama pada keadaan default): user
minta M10.a diteruskan "satu per satu berbagai sudut". Metodologi
DIPERKUAT dari §39 — bukan lagi cek titik manual, tapi **probe
menyeluruh per layar**: (a) inventaris SEMUA elemen `fixed`/`absolute`
yang benar2 ter-render (computed style, bukan grep sumber), (b) untuk
SETIAP elemen interaktif yang tampak (button/input/select/a),
`elementFromPoint` di titik tengahnya WAJIB mengenai dirinya sendiri —
elemen yang "dicuri" elemen lain otomatis terdaftar, (c) saat overlay
terbuka, scope probe = elemen DI DALAM overlay teratas saja (konten
latar yang tertutup backdrop modal adalah PERILAKU BENAR, bukan
temuan — pelajaran interpretasi ronde ini), (d) cek scroll horizontal
dokumen. Semua di window minimum 1200×760, game dimainkan sungguhan
lewat store (hari 15, IGD interrupt diselesaikan di jalan).

Sudut yang diperiksa & hasil:

- **IGD (sesi aktif)** — hanya 2 `hud__badge` (absolute, jinak, di
  dalam tab); nol tombol tertutup. BERSIH.
- **Kegiatan (sesi posyandu aktif, 4 kartu)** — 1 badge; nol tertutup;
  prolanis/KLB berbagi layar+CSS yang sama sehingga satu varian cukup
  utk audit layering. BERSIH.
- **MejaKerja + Lokakarya Mini (`mk__rekap`, auto-buka hari 15)** —
  dalam-modal nol tertutup. Temuan metodologis penting: probe naif
  awalnya melaporkan 7 elemen "tertutup" — SEMUANYA konten latar di
  belakang backdrop modal (tombol program PSN 3M dkk milik layar meja,
  bukan milik modal) = false-positive kelas "modal bekerja sebagaimana
  mestinya". Probe direvisi (scope dalam-overlay) sebelum menyimpulkan.
- **MejaKerja + surat terbuka** — surat dibaca INLINE (bukan modal);
  nol tertutup di kedua keadaan. BERSIH.
- **Pengaturan + TentangModal BERTUMPUK** (dua overlay `z-modal` sama,
  urutan DOM menentukan) — Tentang di-render setelah `set-overlay` →
  terkonfirmasi paint di atas (hit-test tengah modal kena
  `.tentang-modal`); dalam-modal nol tertutup di KEDUA lapis. BERSIH.
- **PanelHasil (debrief klinik)** — dalam-modal nol tertutup (§38 baru
  menguji vs toast; ini melengkapi sisi dalam-modalnya). BERSIH.
- **Skala teks 140%** (`ukuranTeks:1.4`, maksimum M7.31; riwayat: skala
  font pernah bikin overlay HKI TitleScreen bermasalah, CODEX ronde-4)
  — root 22.4px terkonfirmasi; HUD melebar ke 86px (wrap 2 baris,
  rapi); mute+gigi dok TETAP di dalam bilah HUD; nol scroll horizontal;
  probe klinik & dex nol tertutup. BERSIH. Skala dikembalikan ke 100%
  setelah uji.
- **Dilewati dgn alasan eksplisit**: kunjungan di 140% (fix z-index
  hotspot §39 scale-independent — tombol di ATAS kartu berapa pun
  ukuran teks); LaporanAkhir (nol elemen fixed/absolute di CSS-nya —
  tak ada lapisan utk bertabrakan); Onboarding (overlay tunggal
  di-render TERAKHIR di App.tsx by design sbg gerbang hari-1, §39).

**Hasil: NOL temuan baru.** Dua fix §38-39 (toast z-index/pointer-events,
hotspot z-index, dok mute/gigi) terkonfirmasi menahan semua sudut ini.
Tak ada perubahan kode — ronde verifikasi murni, didokumentasikan
supaya ronde audit berikutnya (CODEX/DeepThink/solo) tak mengulang
sudut yang sama. Probe menyeluruh (b) di atas layak diangkat jadi
utilitas e2e permanen bila playwright harness (test:e2e) diaktifkan
kembali — dicatat sbg kandidat, bukan dikerjakan sekarang.

M10.a kini benar2 tuntas dua ronde (empiris §39 + sudut lanjutan §41);
sisa dimensi-4 yang murni level-sumber sudah diserahkan ke CODEX via
brief R2 (dan ronde-2 CODEX §40 memang tak menemukan layering baru).

## 42. CODEX ronde-3 (M10.a) — Onboarding satu2nya kartu dialog tanpa batas tinggi/overflow (2026-07-06)

**[P3, DITERIMA & DIPERBAIKI]** CODEX menemukan `.onb-kartu` (Onboarding,
satu2nya gerbang wajib Hari 1) adalah SATU-SATUNYA kartu dialog
fixed-overlay tanpa `max-height`+`overflow` — beda dari `.modal`
(base.css), `.set-modal` (Pengaturan), `.tentang-modal` (TentangModal)
yang semua sudah scroll-safe. Krn `html/body` dikunci `overflow:hidden`
global ("game desktop: satu viewport, tanpa scroll dokumen"), TIDAK ADA
fallback scroll dokumen — kalau kartu Onboarding melebihi viewport,
tombol Lewati/Lanjut/Mulai bisa terkunci di luar jangkauan TANPA jalan
scroll manapun. Ini SUDAH tepat sasaran §41 — ronde M10.a sebelumnya
menguji skala teks 140% di HUD/Klinik/Dex tapi SENGAJA melewati
Onboarding (alasan yg dicatat saat itu keliru: "render order", bukan
"scroll-safety" — CODEX menangkap sudut yg genuinely terlewat).

Diverifikasi EMPIRIS (bukan cuma dibaca), termasuk mereproduksi kondisi
overflow sungguhan: viewport 1200×340 + `ukuranTeks:1.4` (maksimum
M7.31) + kartu ke-5 (paragraf terpanjang, "Tuntas di sini, atau rujuk")
→ `kartu.scrollHeight` (486) > `clientHeight` (304), tombol "Lanjut"
terkonfirmasi START di luar area kartu yg terlihat SEBELUM fix. Fix:
`.onb-kartu` diberi `max-height: min(90vh, 620px); overflow-y: auto;`
— pola PERSIS `.set-modal`/`.tentang-modal`. Setelah fix, kondisi
overflow YANG SAMA direproduksi ulang: scroll kartu ke bawah membuat
tombol terlihat & `MouseEvent` sungguhan berhasil pindah ke kartu
berikutnya, dan alur penuh sampai "Mulai" (menutup onboarding +
`localStorage` tersimpan) terkonfirmasi bekerja. Di ukuran normal
(1200×760, teks 100%) kartu tak overflow sama sekali — nol regresi
visual.

Pagar baru: `lapisan.test.ts` — satu test generik memeriksa SEMUA 4
kelas kartu dialog (`.modal`/`.set-modal`/`.tentang-modal`/`.onb-kartu`)
punya `max-height`+`overflow(-y)`, bukan cuma Onboarding — modal ke-5
di masa depan yang lupa pola ini otomatis tertangkap. Verifikasi-bergigi:
merah persis pada assertion `.onb-kartu` sblm fix, hijau stlh; stash/pop
dikonfirmasi ulang. Tak ada REVISI_ENGINE bump (CSS murni). `npm test
-- --run` → **420 test** (dari 419), typecheck bersih.

## 43. M10.b — audit bridge UKP↔UKM + konsistensi identitas NPC/warga (2026-07-06)

Dimensi 2+3 M10, dikerjakan mono. Metode: telusuri SEMUA jalur "orang
yang sama muncul lagi" end-to-end di kode (9 situs penjadwalan
`pasien_kembali` + karma + prolanis + PRB + kader), verifikasi tiap
klaim thd kode aktual, temuan diuji test-first sebelum di-fix.

### Temuan (5, semua di-fix — commit ini, REVISI_ENGINE 13→14)

**F1 [P2] Pasien yang KEMBALI di-roll ulang bpjs & persona-nya.**
Seluruh 9 situs penjadwalan membawa nama/usia/JK/rw (dijaga sejak M1)
tapi TIDAK `bpjs` & `persona` — `buatPasienDariKasus` me-roll ulang
keduanya saat pasien kembali: orang yang sama bisa berganti status
pembiayaan antar-kunjungan (umum bayar retribusi ke kas vs BPJS
membakar kapitasi — dampak skor Manajemen via ambang kas) dan berganti
"suara" (persona menyetir variasi dialog anamnesis). Fix: `JadwalItem`
+`bpjs?`+`persona?`, dibawa di semua situs, diteruskan sampai override
`buatPasienDariKasus`.

**F2 [P2] Persona pasien inject dihitung dari usia roll yang DIBUANG.**
`buatPasienDariKasus` me-roll usia dari demografi kasus, hitung
persona, BARU merge override: pasien karma/prolanis (usia inject
sungguhan dari konten keluarga) mendapat persona dari usia acak yang
tak pernah dipakai. Terbukti empiris di test: Bu Wulan (58, karma
stroke) mendapat persona 'lansia' dari roll demografi stroke_iskemik
>=60. Fix: `pilihPersona(override?.usia ?? usia, rng)` — persona dari
usia EFEKTIF; override.persona (pasien kembali, F1) tetap menang.

**F3 [P3] 4 situs SISRUTE (boomerang/tolak-spesialis/tolak-bed/PRB)
membuang `keluargaId`** — beda dari situs konsekuensi/terlantar/karma
yang membawanya; anggota binaan yang dirujuk kehilangan tautan
keluarganya saat kembali. Ditambah roster prolanis kini menyimpan
`keluargaId` (field baru opsional, save-compat) — komplikasi prolanis
bisa dirunut balik ke keluarga binaan. Catatan jujur: `keluargaId`
pada pasien klinik saat ini TIDAK dibaca UI/skor mana pun (kartu
konteks keluarga adalah fitur PRIMER web lama, bukan primera-desktop)
— ini konsistensi identitas + fondasi masa depan, bukan gameplay aktif.

**F4 [P2-desain] bpjs pasien karma & prolanis mengabaikan realitas
keluarganya.** Karma: keluarga berkartu-JKN-mati (indikator `jkn:
'tidak'`, kelas cerita Bu Marni) anggotanya bisa datang sbg pasien BPJS
(roll 70%). Fix: bpjs pasien karma dari `indikator.jkn.statusSebenarnya`
keluarga SAAT karma menyala — arc yang sempat memperbaiki JKN sebelum
jatuh tempo pun terhormati. Prolanis: program BPJS by definition, tapi
30% komplikasinya datang sbg pasien umum — kini selalu `bpjs: true`.

**F5 [P3] Pool NAMA_WARGA tumpang tindih 17 nama dgn anggota keluarga
binaan** (termasuk identitas karma "Lastri"/"Painem", dan 10 nama polos
identik: Joko/Dewi/Siti/...) — pasien acak klinik bisa bernama persis
anggota binaan aktif, dua "orang" tak berhubungan berbagi identitas.
Tak ada guard; murni untung-untungan RNG (jawaban utk pertanyaan brief
R1 §5.5). Fix: 17 nama pool diganti (pool tetap 42/42), + guard
permanen di pack.test.ts (pool vs nama-anggota, dgn & tanpa honorifik,
WAJIB disjoint). Guard langsung membuktikan nilainya: pengganti pertama
saya ('Tumini') ternyata bentrok dgn "Bu Tumini" keluarga_slamet —
tertangkap test, diganti 'Warsiti'. Pool marga `namaWarga.keluarga`
TIDAK disentuh: data mati (tak dipakai runtime mana pun), didokumentasi.

### Yang diaudit & BERSIH (jangan re-audit tanpa alasan baru)

- **Karma tak dobel-hitung**: daftar kasus pasien-kembali diteruskan
  ke `susunAntrianHarian` sbg `kecuali` (dikeluarkan dari kandidat
  director), BUKAN ditambahkan dua kali.
- **Override identitas survive ke UI**: `{...dasar, ...override}` di
  buatPasienDariKasus — nama/usia/JK/rw/keluargaId inject utuh sampai
  antrian/encounter (kecuali persona/bpjs, F1/F2 di atas — kini fixed).
- **kader.ts**: bias SELALU salah di indikatornya + teledor
  (100-ketelitian)% di sisanya — mekanik persis label; IKS RW
  diagregasi ulang HARIAN dari state keluarga terkini (bukan snapshot);
  kader punya kehadiran naratif (surat harian + slip bias 40% +
  persona 30%) — menjawab brief R1 §5.3.
- **KBK**: pengali (0.8/1.0/1.3) dihitung saat tutup-bulan dari
  `desa.rw` TERKINI. (Brief R1 menyebut "x0.5-x1.3" — angka aktual
  0.8/1.0/1.3; brief yang tak akurat, bukan kode.)
- **`AnggotaKeluarga.kondisi[]` BUKAN metadata mati** (pertanyaan
  terbuka brief R1/R2): dibaca `bentukRosterProlanis` — anggota
  ber-kondisi hipertensi/dm membentuk roster Prolanis. Jembatan
  keluarga-prolanis-komplikasi-poli memakai identitas anggota
  SUNGGUHAN.
- **PRB hanya terjadwal pada rujukan DITERIMA** (cabang `diterima`
  SISRUTE) — status PRB konsisten dgn riwayat rujukan nyata.
- **rmLengkap** hanya dari encounter klinik — by design (kunjungan
  rumah tak punya konsep SOAP-lengkap), didokumentasikan.
- **Kredit Dex utk encounter kedua** (pasien kembali ditangani ulang):
  jalur DISPOSISI meng-update dex tanpa syarat — konsisten.
- **`karma_igd` adalah misnomer historis**: jenis jadwal bernama
  `_igd` tapi pasiennya masuk ANTRIAN KLINIK pagi (surat "menunggumu
  di antrian pagi ini" konsisten dgn perilaku) — bukan bug, dicatat
  supaya audit berikutnya tak bingung.
- **Diterima sbg gap kecil yang disengaja**: `bonusTrust` tidak dibawa
  saat pasien kembali (display-only, nol dampak skor).

Verifikasi-bergigi: 8 test baru (file baru `m10bridge.test.ts`: 7 —
identitas konsekuensi-kembali penuh, karma jkn-bpjs + persona dewasa,
roster prolanis keluargaId, 3x persona-override, 1 regresi non-override;
+1 guard pool nama di pack.test.ts) MERAH persis sebelum fix (stash
5 file fix = 7 merah; pop = hijau semua). REVISI_ENGINE 13-14 (bpjs
mengubah arah pembayaran lab/obat -> kapitasi -> Manajemen; konsumsi
RNG pilihPersona bergeser utk pasien inject lintas ambang usia — jejak
lama dgn pasien kembali/karma/prolanis bisa mereplay ke kapitasi
berbeda, dossier lama wajib jatuh ke "tidak dapat diverifikasi").
`npm run typecheck` bersih; `npm test -- --run` = **428 test** (dari
420), 39 file, hijau — termasuk soak 90-hari & verifier M6 dgn
semantik baru.

## 44. M10.a ronde-4 — kebocoran fokus keyboard tembus modal/overlay (2026-07-06)

**[P2, DITERIMA & DIPERBAIKI]** CODEX menemukan: sapuan M10.a (§39/§41)
kuat utk pointer/mouse (hit-testing) tapi TAK PERNAH menguji jalur
KEYBOARD. `Onboarding` (gerbang wajib Hari 1) tak py `autoFocus`,
focus-trap, atau `aria-modal` — dan `Hud` (berisi navigasi
layar+mute+gigi Pengaturan sejak M10.a §39) tetap dirender TANPA
`disabled` tambahan saat Onboarding terbuka (guard `disabled` HUD sama
sekali tak tahu soal Onboarding, krn Onboarding murni state React lokal
App.tsx, bukan bagian `GameState`).

**Diverifikasi EMPIRIS sebelum menyentuh kode** (browser sungguhan,
bukan cuma baca sumber): tombol "Klinik" di HUD, saat Onboarding
terbuka menutupinya TOTAL secara visual, tetap `document.activeElement`
via `.focus()` (`fokusDapat:true`, `disabledAttr:false`) DAN `.click()`
sungguhan memindahkan `state.layar` 'meja'→'klinik' diam-diam di
belakang overlay. Diperdalam: gigi Pengaturan (didok ke HUD sejak §39)
jugaTeraktivasi via fokus+klik yg sama, membuka `.set-overlay` KEDUA
bertumpuk dgn `.onb-overlay` — skenario nested-modal membingungkan yg
CUMA bisa dipicu keyboard, tak pernah lewat mouse (M10.a §39/§41 sudah
membuktikan mouse aman).

**Temuan kedua [P3, diterima]: 7 titik modal/overlay tak konsisten
semantik ARIA.** 4 titik (Onboarding/Pengaturan/Tentang/PanelHasil)
py `role="dialog"` TANPA `aria-modal`; 3 titik (MejaKerja rekap+lokmin,
PetaDesa hasil-kunjungan) TANPA `role="dialog"` sama sekali.

**Fix — hook `useFocusTrap` baru** (`src/renderer/src/useFocusTrap.ts`),
dipasang di SEMUA 7 titik + `role="dialog"`+`aria-modal="true"`
konsisten di semua titik:
- Jebak Tab/Shift+Tab dalam kontainer modal (capture-phase keydown di
  `document`, menyalip SEBELUM browser memindah fokus native ke latar).
- Fokus awal otomatis ke elemen focusable pertama di dalam modal saat
  mount — menutup akar masalah literal CODEX ("Tab pertama masuk ke
  HUD"): begitu Onboarding mount, fokus SUDAH di "Lewati" sebelum
  pemain sempat menekan Tab sama sekali.
- Fokus dikembalikan ke elemen sebelumnya saat modal ditutup.
- `onEscape` OPSIONAL — modal wajib-diselesaikan (Rekap/Lokmin
  MejaKerja, satu tombol "Lanjutkan Stase →", TANPA backdrop-dismiss)
  SENGAJA tak diberi `onEscape`: menghormati desain "harus selesai",
  bukan menambah jalan keluar yg penulis sengaja tiadakan. 5 titik lain
  (semua py backdrop-dismiss existing) diberi `onEscape` yg sama persis
  dgn aksi backdrop-klik-nya.
- BUKAN `inert`: Pengaturan (& MuteButton) hidup NESTED di dalam pohon
  `Hud` sejak §39 (didok, bukan portal ke root) — menandai leluhur
  `inert` akan ikut mematikan modal ITU SENDIRI. Trap berbasis
  event-listener portable independen dari kedalaman nesting.
- **Kasus nested tunggal ditangani eksplisit**: Pengaturan→TentangModal
  (satu-satunya 2 modal yg bisa hidup bersamaan di codebase ini) — trap
  Pengaturan NONAKTIF selama `tentang` true (`buka && !tentang`), krn
  dua trap aktif bersamaan akan rebutan wrap-Tab. Tak digeneralisasi ke
  multi-level modal stack (tak dibutuhkan di tempat lain).

**Batasan verifikasi, didisclosekan jujur**: `.focus()`+`.click()`
IMPERATIF via script (bukan Tab key sungguhan) tetap bisa memaksa fokus
ke elemen latar — trap tak bisa & tak dirancang mencegah itu (setara
`inert` diperlukan utk itu, dan tabrakan struktural di atas mencegahnya
di sesi ini). TAPI itu bukan vektor yg bisa dipicu manusia menekan Tab
sungguhan — verifikasi browser dgn `KeyboardEvent('keydown',{key:'Tab'})`
sungguhan (menembus listener capture-phase produksi yg sama, bukan
`.focus()` manual) mengonfirmasi: fokus yg TERLANJUR di luar modal
ditarik balik ke "Lewati" pada Tab BERIKUTNYA — dan fokus-awal-otomatis
berarti skenario "Tab pertama masuk HUD" literal CODEX kini mustahil
(fokus sudah di dalam modal SEBELUM Tab pertama ditekan). Escape
sungguhan dikonfirmasi menutup Onboarding + tersimpan localStorage.

Pagar baru: `useFocusTrap.test.tsx` (8 test — BEDA dari bug layering
§38/39/42 yg murni CSS-painting/tak bisa diuji jsdom, kebocoran
KEYBOARD adalah perilaku DOM/event murni yg jsdom implementasikan
PENUH, jadi diuji SUNGGUHAN via RTL+userEvent nyata, bukan cuma grep
sumber): fokus-awal, Tab-wrap maju/mundur, celah-asli (fokus dipaksa
keluar lalu Tab menariknya balik), Escape dgn/tanpa `onEscape`,
trap-nonaktif (dipakai Pengaturan saat Tentang terbuka), restore-fokus
saat tutup. Verifikasi-bergigi: stub no-op sementara → 6/8 merah persis
→ restore → hijau. Plus `lapisan.test.ts` diperluas (generic, 7 titik):
role="dialog"+aria-modal berdampingan di semua modal — pola sama §42
(cek KELAS, bukan instans; titik ke-8 di masa depan yg lupa pola ini
otomatis tertangkap).

`npm run typecheck` bersih; `npm test -- --run` → **437 test** (dari
428), 40 file, hijau. Tak ada REVISI_ENGINE bump (murni UI/aksesibilitas,
nol semantik skor/replay).

## 45. Bug live ketiga — peta desa kontras kolaps di mode malam (2026-07-06)

User main langsung (screenshot mode malam layar Peta Desa): kartu pos SVG
choropleth py teks nyaris tak terbaca — "DESA SUKAMAJU · 8 RW" (cartouche)
& label tiap petak RW ("RW 1 · Kampung Kenanga" dkk) tampil pudar/nyaris
menyatu dgn latar.

**Root cause, dikonfirmasi thd tokens.css sebelum menyentuh apa pun**:
kanvas SVG peta (`--kertas-050`/`--daun-50`/`--daun-100`/`--kertas-200`/400
— "kartu pos kertas") SENGAJA tak py varian gelap (pola sama TitleScreen
selalu 'pagi', identitas visual tetap), TAPI 10 token BERSAMA yg dipakai
teks/aksen di dalamnya (`--tinta`, `--tinta-lembut`, `--tinta-pudar`,
`--daun-600/700/800`, `--kunyit-600/700`, `--tinta-merah`, `--tinta-biru`,
`--border-halus/tegas/tinta`) DIREMAP TERANG di `[data-mode='malam']` utk
konteks lain (HUD/klinik, latar sungguhan gelap). Kombinasi "teks
terang-utk-gelap + kanvas kertas yg tetap terang" → kontras kolaps —
KELAS bug yg SAMA persis dgn `.peta-roster-item--aktif` (CODEX P2 audit
2026-07-04, sudah ditambal) tapi luput di kanvas SVG-nya sendiri sampai
user menemukannya main langsung.

**Fix**: `[data-mode='malam'] .peta-svg { ...kunci ulang 10 token ke nilai
mode-terang... }` (PetaDesa.css) — custom property CSS di-redeklarasi
pada elemen `<svg className="peta-svg">` itu sendiri; SEMUA `var(--x)`
dipakai elemen di dalamnya (rect/polygon/path/text/circle) resolve ke
nilai yg dikunci ulang ini, tanpa menyentuh `warnaPetak()`/JSX sama sekali.
Diverifikasi EMPIRIS (bukan cuma baca sumber): `getComputedStyle` pada
`.peta-cartouche`/`.peta-label`/`.peta-petak__bidang` sungguhan
dikonfirmasi TETAP resolve ke nilai mode-terang PERSIS (`rgb(10,92,71)`
dkk) walau `data-mode="malam"` aktif di `.app-frame`; toggle balik ke
'pagi' dikonfirmasi tak berubah (nol regresi).

**Pagar generik baru** (`modeMalam.test.ts`, BUKAN 3 assertion titik
tapi 1 invarian KELAS): parse SEMUA token yg diremap `[data-mode='malam']`
tokens.css, parse SEMUA `var(--x)` dipakai PetaSvg.tsx, assert tiap
irisannya WAJIB terkunci-ulang di `.peta-svg`. Test ini LANGSUNG
membuktikan nilainya: draft fix pertama saya cuma mengunci 10 dari 13
token yg sebenarnya perlu — `--tinta-pudar` (stroke sungai), `--border-
tinta` (outline petak nonaktif), `--daun-700` (ikon rumah Puskesmas)
luput dari pembacaan manual, tertangkap test SEBELUM commit. Verifikasi-
bergigi: stash fix → 2/2 merah persis → restore → hijau.

`npm run typecheck` bersih; `npm test -- --run` → **439 test** (dari
437), 41 file, hijau. Tak ada REVISI_ENGINE bump (CSS murni).

## 46. CODEX ronde-5 — laporan STALE (kebocoran fokus, sudah fixed §44) (2026-07-06)

CODEX kembali melaporkan temuan yang PERSIS SAMA (kata-per-kata, file:baris
sama) dgn §44 — "Onboarding tanpa focus-trap/aria-modal, HUD Tab-able di
belakangnya; 3 modal tanpa role=dialog". Diverifikasi thd kode AKTUAL
sebelum menjawab (bukan diasumsikan stale): `grep` mengonfirmasi
`useFocusTrap` SUDAH terpasang & `role="dialog" aria-modal="true"` SUDAH
ada di seluruh 7 titik yang disebut (Onboarding.tsx:82, MejaKerja.tsx:
284-285/749/829, PetaDesa.tsx:40/292-293) — commit `e2ffeca` (§44) SUDAH
ada di riwayat cabang ini, 3 commit sebelum HEAD saat ronde ini masuk.

**Kesimpulan: STALE murni** — CODEX mengaudit snapshot SEBELUM commit
`e2ffeca` mendarat (kemungkinan audit dimulai sblm fix di-commit, laporan
baru kembali sesudahnya). Tak ada tindakan; tak ada perubahan kode.
Dicatat di sini semata agar ronde berikutnya (atau CODEX sendiri bila
diminta ulang) tak bingung melihat laporan identik muncul dua kali —
lihat §44 utk detail fix+verifikasi lengkap.

## 47. M10.c — sapuan konsistensi pipeline 67 kasus (dimensi 1) (2026-07-06)

Dimensi terakhir M10, dikerjakan HIBRID (user izinkan multi-agent terbatas):
3 agent pembaca membagi 7 file kasus (infeksi+kronis / respgi+kulit /
saraf+msk+kia) utk 5 sumbu yg butuh penilaian klinis-tekstual (edukasi-vs-
clue, flag relevan, kandidat edukasiKritis, vital-vs-demografi, konsistensi
fakta antar-persona); Claude sendiri mengerjakan sapuan DETERMINISTIK
sekali-jalan (skrip throwaway) utk yg bisa di-script (ICD tabrakan,
integritas alergiTrap, rentang konsekuensi, near-duplicate katalog). SEMUA
temuan agent DIVERIFIKASI manual thd kode aktual sebelum fix — disiplin
sama laporan CODEX (agent = alat baca, bukan sumber kebenaran).

### Sapuan deterministik (Claude) — 1 fix + 2 pagar

**[P2 FIXED] Obat yatim `garam_oralit_zinc` ("Paket Oralit + Zinc (program)")**
— kelas bug SAMA lab asam_urat (§35), sisi obat: nol referensi kasus/engine
DAN kembaran `oralit`+`zinc_20` yg dipakai kasus diare. Lebih berbahaya dari
sekadar yatim: clue diare eksplisit "ORALIT + ZINC" → paket gabungan tampak
pilihan PALING benar di pencarian, tapi meresepkannya dihitung obat-di-luar
(−15). Dihapus, dijaga test.

**[Pagar] validasiPack + 3 invariant alergiTrap** (hari ini 0 pelanggaran di
6 kasus trap — pagar konten depan): (a) obatTerlarang wajib sekelas trap
(kalau tidak, firewall tak memblokirnya); (b) obat benar/alternatif sekelas
trap wajib ada di obatTerlarang (kalau tidak, slot mustahil dipenuhi saat
trap nyala — firewall memblokir resepnya, skor tetap menuntut); (c)
alternatifBenar tak boleh sekelas trap (alternatif yg diblokir firewall
sendiri). Plus guard rentang konsekuensi (min≤max, min≥0). Semua diuji via
pack rusak buatan (merah→hijau).

**Diaudit BERSIH (deterministik)**: nol ICD tabrakan kasus-vs-kasus, nol
alergiTrap melanggar, nol konsekuensi terbalik, nol vital gross-outlier
(anak/dewasa norma masuk akal), nol skdi-vs-harusDirujuk kontradiksi
internal. Katalog near-duplicate lain (paracetamol/sirup, amoxicillin/
klavulanat, amlodipin 5/10, dst) = varian sediaan SAH (bukan yatim), tak
disentuh.

### Sapuan agent (3 pembaca) — 10 fix konten clue-vs-edukasi + 1 persona

Pola dominan (kelas bug kia_kb_konseling/CHF §32/§33): kasus memakai topik
edukasi yg NAMA/maknanya off-target atau KONTRADIKTIF dgn clue, krn katalog
tak py topik presisi & penulis meraih topik generik terdekat. 6 topik baru
dibuat (pola kb_aman_menyusui/restriksi_cairan: konsep inti clue tanpa
padanan → entri baru), 10 kasus diperbaiki:

- **KONTRADIKSI langsung (kelas CHF)**: tinea_korporis & kandidiasis_kutis
  `jaga_kelembapan_kulit` (MELEMBAPKAN) vs clue "jaga area KERING" —
  konsekuensi tinea bahkan sebut "kelembapan tak dikoreksi memicu kekambuhan"
  (topik lama menyuruh persis penyebab kambuh) → `jaga_area_kering` (baru).
  konjungtivitis_alergi `kompres_mata` bernama "Kompres HANGAT" (hordeolum)
  vs clue "kompres DINGIN" → `kompres_dingin_mata` (baru).
- **OFF-TARGET (topik salah domain)**: rinitis_alergi `jaga_kelembapan_kulit`
  (topik KULIT di kasus HIDUNG) → dibuang; rinosinusitis `minum_air_cukup`
  (identitas ISK "jangan menahan kencing") → `bilas_salin_hidung` (baru);
  malaria `psn_3m` (PSN 3M jentik Aedes/DBD — vektor & metode SALAH, malaria
  = Anopheles/kelambu) → `cegah_malaria_kelambu` (baru); bells_palsy
  `kompres_mata` (hangat) → `proteksi_kornea` (baru, clue "air mata buatan +
  tutup mata saat tidur").
- **TOPIK PRESISI TERSEDIA TAPI TAK DIPAKAI**: skabies clue KAPITAL "OBATI
  SEMUA KONTAK SERUMAH" + "cuci seprai air panas" tapi pakai `cuci_tangan`
  (lemah utk tungau) → `obati_kontak_serumah` (baru) + `cuci_seprai_panas`
  (sudah ada, bertag [Skabies/kutu]!); asma clue eksplisit "ajarkan teknik
  inhaler" + KEDUA obat inhaler tapi `teknik_inhaler` (SUDAH ADA) absen →
  ditambahkan; gastritis `gizi_seimbang` (generik) → `diet_lambung` (sudah ada).
- **2 edukasiKritis baru** (naik 12→14 total): asma_ringan→`teknik_inhaler`
  (teknik salah = obat tak sampai paru, terapi GINA tak bekerja sama sekali —
  penalaran kelas mm_gagal_jantung), rinosinusitis→`tanda_bahaya`
  (konsekuensi eksplisit komplikasi orbita/intrakranial "gawat").
- **1 fix konsistensi persona**: jiwa_insomnia variasi lansia dulu "sering
  kebangun tengah malam" (insomnia MAINTENANCE) padahal baku+2 persona lain
  = "susah MEMULAI tidur" (ONSET) — variasi mengubah SUBTIPE klinis (fakta
  anamnesis), bukan sekadar gaya bahasa. Diselaraskan ke onset.

**Ditolak/diverifikasi-bersih dari laporan agent** (tak semua diterima):
- `gizi_seimbang`/`minum_air_cukup` pada bbrp kasus demam/napas (bronkitis,
  tonsilitis, hemoroid) — komponen hidrasi wajar klinis, TIDAK kontradiktif
  (beda dari CHF) → dibiarkan.
- `dm_tipe2` edukasiKritis tanpa anchor konsekuensi.narasi — pilihan topik
  tetap defensibel (PERKENI), justifikasi via clue umum → dibiarkan.
- pneumonia sianosis `relevan:false`, asma rinitis-alergi `relevan:false`,
  diare mukosa-kering `relevan:false` — semua severity/dehidrasi SUDAH
  dikredit di entri lain (umum/kulit/toraks relevan:true), jadi inkonsistensi
  KATEGORISASI minor tanpa dampak skor → tak diubah (keyakinan agent rendah,
  konfirmasi).
- herpes zoster & rinosinusitis warna-ingus variasi persona (dada/pinggang,
  hijau/kuning) — longgar tapi tak mengubah fakta klinis penentu → tak diubah.

REVISI_ENGINE 14→15 (perubahan daftar `tatalaksana.edukasi` 10 kasus +
2 edukasiKritis baru → skorEdukasi replay bergeser utk jejak lama). Verifikasi-
bergigi: 15 assertion konten baru + 3 assertion validasiPack + 1 orphan +
1 persona MERAH persis sblm fix (stash 7 file → 15 merah; pop → hijau).
`npm run typecheck` bersih; `npm test -- --run` → **456 test** (dari 439),
41 file, hijau — termasuk soak 90-hari & verifier M6 dgn semantik baru.

**M10 (semua 4 dimensi) kini TUNTAS**: §36-47 — pipeline (dim 1, §47),
bridge/NPC (dim 2+3, §43), UI/UX layering (dim 4, §38-46).

## 48. CODEX ronde-baru (audit M10 total, 2 subagent) — 13 temuan, semua ditriase, BELUM diperbaiki (2026-07-09)

CODEX menjalankan audit read-only dibantu 2 subagent di HEAD `2002f28` (SEBELUM komit `080b465`
M10.c selesai — laporan sendiri mencatat worktree berubah oleh proses lain selama audit
berjalan; ini menjelaskan "444 lulus, 6 gagal" yang dilaporkan — itu snapshot M10.c
PERTENGAHAN-edit, BUKAN kegagalan riil. Status sekarang: 456/456 lulus, typecheck bersih).
Semua 13 temuan diverifikasi Claude satu-satu thd kode aktual (baca file:baris langsung,
bukan percaya ringkasan). Berikut verdict — **SEMUA CONFIRMED masih OPEN, belum ada
perbaikan dibuat** (giliran ini murni triase + dokumentasi, fix menyusul ronde berikutnya).

### P1 — CONFIRMED (4/4)

1. **Fingerprint keluarga tak mencakup `anggota[]`/`rw`** — verifikasi.ts:253-255
   hash keluarga hanya `{id, ekonomi, indikator, arc}`; `KeluargaBinaan.anggota`/`rw` (types.ts:330,334)
   sama sekali tak ikut. Ganti nama/usia/kondisi/JK anggota atau RW keluarga TAK mengubah
   fingerprint padahal keduanya menyetir identitas karma, roster Prolanis (`bentukRosterProlanis`
   membaca `kel.anggota`/`kel.rw` LANGSUNG dari `pack.keluarga`), dan bridge surveilans RW.
   CONFIRMED — celah integritas dossier nyata.

2. **Save tak simpan provenance revisi engine** — save.ts:11 amplop cuma
   `{v:1, state}`, `v` adalah versi SKEMA save (migrasi field), BUKAN `REVISI_ENGINE` (versi
   semantik skor). Save yang dimulai di rev-N, dilanjutkan setelah app update ke rev-N+1, lalu
   diekspor: `susunDossier` men-cap fingerprint rev-N+1 (kode YANG SEDANG JALAN), tapi sebagian
   `jejak` terekam saat rev-N. Berbeda dari kasus "dossier lama diverifikasi verifier baru" (yang
   sudah ditangani — jatuh ke tidak_dapat_diverifikasi): ini save yang STRADDLE dua revisi lalu
   diekspor FRESH, sehingga verifier tak py cara mendeteksi itu straddle. CONFIRMED — celah desain
   nyata tapi sempit (butuh app UPDATE di tengah satu save berjalan, bukan tiap REVISI_ENGINE bump
   dalam sejarah dev).

3. **Bridge positif bikin "anggota keluarga" fiktif + RW acak** — director.ts:270-284
   `susunAntrianHarian` menempel `{keluargaId, bonusTrust:true}` ke pasien yang SUDAH dibuat acak
   (nama/usia/RW/bpjs semua dari roll `buatPasienDariKasus` independen) — bukan pasien yang
   benar2 berasal dari `kel.anggota`. UI melabeli "Keluarga binaanmu" (RuangTunggu.tsx:84)
   seolah identitas warga sungguhan. Bila kasus menular, RW ACAK ini masuk surveilans
   (reducer.ts:540) — kluster UKM bisa menyala di RW yang bukan RW
   keluarga sungguhan. CONFIRMED — kontradiksi dgn seluruh premis M10.b (identitas NPC harus
   konsisten): jalur INI tak pernah disentuh sapuan M10.b krn bukan situs `jenis:'pasien_kembali'`.

4. **Bu Marni auto-Prolanis walau JKN nonaktif** — desaE.ts:358
   (`kondisi:['dm_tipe2']`) + desaE.ts:371 (`jkn:'tidak'`)
   + arc `mk1_i1` (desaE.ts:622) eksplisit narasi "jadwalkan
   Bu Marni masuk Prolanis BEGITU KARTU AKTIF" (mengasumsikan gate). Tapi `bentukRosterProlanis`
   (reducer.ts:1795-1819) membangun roster dari `pack.keluarga`
   (konten statis) murni berdasar `kondisi` ht/dm — nol pembacaan `indikatorAwal.jkn` atau status
   arc runtime. Bu Marni masuk roster Prolanis sejak `MULAI_PROLANIS` pertama, sebelum arc-nya
   selesai. CONFIRMED — kontradiksi konten-vs-mekanik, dan secara pedagogis salah (Prolanis
   adalah program BPJS, peserta non-JKN mustahil terdaftar di realita).

### P2 — CONFIRMED (4/4 dari kode; #9 tetap hipotesis)

5. **No. RM berubah tiap pasien kembali** — director.ts:71
   `buatPasienDariKasus` selalu bikin `id: p_${kasusId}_${rng.int(1000,9999)}` BARU. `JadwalItem.pasienId`
   (state.ts:383) memang ada dan DIISI di 4 situs penjadwalan
   (reducer.ts:218/344/373/1189), tapi interface lokal `PasienJatuhTempo` (reducer.ts:1293-1305)
   TAK punya field itu, dan konversi jadwal→pasienKembali (reducer.ts:1332-1344) tak pernah
   membacanya — id lama tak pernah diteruskan ke override. UI menyebutnya "No. RM"
   (LembarPeriksa.tsx:67) — dalam
   realita, nomor rekam medis WAJIB stabil per-pasien seumur hidup. CONFIRMED.

6. **Persona NPC tak stabil lintas karma/Prolanis** — jalur karma (reducer.ts:1359-1368)
   dan materialisasi komplikasi Prolanis (reducer.ts:1085-1099)
   SAMA-SAMA tak pernah menyertakan `persona` saat push ke jadwal/pasienKembali — beda dari 8
   situs `pasien_kembali` LAIN yang M10.b (§43) sudah perbaiki utk field ini. Karena `buatPasienDariKasus`
   re-roll `pilihPersona(usia, rng)` bila `override.persona` kosong, NPC bernama yang sama (mis.
   peserta Prolanis atau korban karma) bisa bicara dgn persona BERBEDA tiap kemunculan. CONFIRMED
   — celah SISA persis di domain yang M10.b klaim tuntas, luput krn karma/Prolanis materialize
   lewat jalur push langsung yang beda dari sisa 8 situs yang disapu.

7. **Pak Musa (DM+HT) direduksi jadi HT saja** — desaB.ts:517
   `kondisi:['dm_tipe2','hipertensi_esensial']` (KEDUANYA). `bentukRosterProlanis`
   (reducer.ts:1800-1803): `const jenis = ht ? 'ht' : 'dm'` — ht
   dicek LEBIH DULU, jadi komorbid apa pun yg py hipertensi otomatis jatuh ke 'ht', DM-nya lenyap
   dari mekanik (kartu Prolanis selamanya cuma lacak SBP, tak pernah GDS/metformin/HbA1c walau
   narasi arc menekankan itu). CONFIRMED — bug pemilihan kondisi (urutan cek `? :`), bukan cuma
   kelemahan cakupan string-match yg sudah diketahui M10.b §2.4.

8. **Pemilihan RW Peta Desa mouse-only** — PetaSvg.tsx:81-85
   `<g onClick>` polos: tanpa `tabIndex`, `role="button"`, atau handler Enter/Space. Instruksi
   layar saat roster kosong cuma "Klik petak RW" (PetaDesa.tsx:159).
   CONFIRMED — pemain keyboard-only tak bisa memulai UKM sama sekali dari peta (beda kelas dari
   fokus-trap M10.a yang menjaga MODAL; ini soal kontrol utama layar yang TAK PERNAH `focusable`).

9. **Hipotesis scroll-ke-bawah modal panjang** — useFocusTrap.ts:36
   `.focus()` tanpa `{preventScroll:true}` memang benar secara kode (scroll-into-view adalah
   default browser). CODEX SENDIRI menandai ini "hipotesis kuat, perlu browser live" — belum
   Claude verifikasi runtime (butuh mensimulasikan Rekap/Lokmin/PanelHasil dgn window kecil +
   ukuran teks 140%). **BELUM DIVERIFIKASI LANGSUNG** — status tetap PLAUSIBLE, bukan CONFIRMED,
   sampai ada pengecekan browser nyata.

### P3 — CONFIRMED (3/4), 1 REJECTED sebagian

10. **Restore-focus PanelHasil tak efektif** — useFocusTrap.ts:30
    (`fokusSebelumnya.current = document.activeElement`) dieksekusi di dalam efek PanelHasil, yang
    mount PERSIS di commit React yang SAMA dgn unmount tombol DISPOSISI pemicunya (`state.klinik.aktif`
    jadi `undefined` & `hasil` jadi terisi dalam satu dispatch — Klinik.tsx:28-36).
    Elemen fokus dibuang dari DOM men-shift `document.activeElement` ke `document.body` SEBELUM efek
    PanelHasil sempat membaca — restore-on-close jadi no-op (mengembalikan fokus ke body, bukan ke
    tombol asal). CONFIRMED, severity rendah (degradasi anggun, tak merusak fungsi).

11. **Radiogroup pakai tombol `aria-pressed`, bukan `role="radio"` + navigasi panah** —
    Pengaturan.tsx:80-88 `role="radiogroup"`
    membungkus `<button aria-pressed>` — mismatch semantik ARIA (radiogroup sungguhan butuh
    `role="radio"`+`aria-checked`+navigasi panah kiri/kanan, bukan toggle-button). CONFIRMED,
    P3 murni (screen reader tetap bisa mengaktifkan tiap tombol, cuma pola navigasi tak sesuai
    ekspektasi APG).
    Setengah lain temuan #11 ("Pengaturan tak dibuat `inert` saat Tentang di atasnya") —
    **REJECTED-WITH-REASONING**: `useFocusTrap.ts` baris 10-13 SUDAH mendokumentasikan eksplisit
    kenapa `inert` sengaja dihindari (modal nested dlm pohon HUD, bukan portal — inert leluhur
    akan ikut mematikan modal itu sendiri). Ini tradeoff desain YANG SUDAH dipikirkan & ditulis,
    bukan kealpaan. Diakui sbg keterbatasan terdokumentasi, tak perlu fix.

12. **Onboarding: fokus awal ke "Lewati", tanpa `aria-live`/`aria-current`** —
    Onboarding.tsx:99 tombol "Lewati" adalah
    elemen focusable PERTAMA di DOM (baris 98-108, sebelum Kembali/Lanjut/Mulai) — `useFocusTrap`
    memfokuskannya otomatis saat kartu dibuka, jadi keyboard/screen-reader user default diarahkan
    ke tombol SKIP, bukan tombol lanjut (aksi primer/diharapkan). Tak ada `aria-live`/`aria-current`
    saat `i` berubah — pergantian kartu tak diumumkan ke pembaca layar. CONFIRMED.

13. **Label peta SVG `13px` absolut, tak ikut ukuran teks 90-140%** —
    PetaDesa.css:49 `font-size:13px` (px, bukan
    `em`/`rem`). Pengaturan ukuran teks skala `root.style.fontSize` (App.tsx:76)
    — HANYA memengaruhi elemen `rem`-relative; SVG `<text>` dgn px absolut tak ikut. CONFIRMED,
    P3 kosmetik.

### Sudah Bersih — diverifikasi ulang, akurat

Jumlah situs `jenis:'pasien_kembali'` = 8, `jenis:'karma_igd'` = 1 (dikonfirmasi grep ulang,
cocok persis klaim CODEX). 7 modal fokus/Escape/backdrop, layering HUD/drawer/toast/modal,
kontras Peta siang/malam (§38-46) tetap benar — tak ada regresi baru ditemukan di area itu.

### Yang BELUM difix

Giliran ini murni triase + dokumentasi (sesuai permintaan: siapkan dossier total dulu). 13 temuan
di atas (12 CONFIRMED + 1 PLAUSIBLE-belum-live-verified) adalah **OPEN ITEMS** untuk ronde
perbaikan berikutnya — lihat `M10_TOTAL_AUDIT_BRIEF.md` utk daftar lengkap + konteks CODEX
audit lanjutan.

## 49. Sapuan M10 multiagen (12 lensa + verifikasi adversarial) — 21 temuan unik, SEMUA diverifikasi ulang manual, BELUM diperbaiki (2026-07-10)

User mengizinkan multiagentics utk ronde ini ("boleh multiagentics tapi hanya beberapa" bukan
lagi berlaku ketat — user eksplisit bilang "boleh multiagentics ... cari dari berbagai sisi
multi dimensi multi perspektif secara teliti"). Dijalankan via Workflow: **12 agent finder**
(masing-masing lensa berbeda: clue-vs-therapy, exam/lab/vital, konsekuensi/dxBanding/alergiTrap,
persona-vs-fakta, identity-attach, materialization-bypass, fingerprint-gap, baked-vs-live
patch-reachability, keyboard-a11y-nonmodal, layering/font-scale, aria-semantics, replay-
determinism) → **tiap temuan diverifikasi agent SKEPTIS terpisah** (default REFUTED kecuali
terbukti; cek by-design; cek duplikat thd 13 known + DO-NOT-RE-REPORT) → sintesis dedup+ranking.
Hasil mentah: 38 temuan, 30 lolos verifikasi adversarial (0 plausible-only, 6 refuted, 2
duplicate), dedup jadi **21 unik** (1 P1, 9 P2, 11 P3; 9 dibuang saat dedup — 8 dari klaster
fingerprint-gap yg sama akar, 1 radiogroup TitleScreen dilaporkan dobel).

**Claude memverifikasi ULANG semua 21 secara manual thd kode aktual** (bukan percaya sintesis
agent) — P1 + seluruh 9 P2 dibaca penuh langsung; 6 dari 11 P3 dibaca langsung (DeckDiagnosis
icd10-guard, DeckDisposisi/TitleScreen/FigurTubuh instance-baru, 3 font-size px), sisanya
diterima dgn confidence lebih rendah krn cocok pola kelas yg SUDAH diverifikasi kuat di tempat
lain (mis. rinosinusitis persona-warna sama kelasnya dgn malaria persona-periodisitas yg sudah
dibaca penuh). **Semua 21 CONFIRMED — nol yang saya tolak setelah baca ulang**, tingkat akurasi
lebih tinggi dari ronde CODEX biasa (kemungkinan krn lapis verifikasi adversarial ganda: agent
skeptis + saya).

### P1 (1) — celah fingerprint SISTEMIK di sisi kasus poli

`sidikJariPack` per-kasus (verifikasi.ts:203-214) hash `{id, icd, rujuk, trap, tx, lab, pf,
anamnesis}` — **melewatkan 6 field top-level yg terbukti dibaca LIVE saat replay**: `demografi`
(director.ts:56,59 — roll usia/gender, menggeser stream RNG director-flavor→bpjs→kapitasi→skor
Manajemen), `prevalensi` (director.ts:148 `bobotKasus` — bobot RNG seleksi antrian harian),
`konsekuensi.kembaliHariMin/Max` (reducer.ts:337,1182 — jadwal pasien_kembali via `rng.int`),
`spesialisRujukan` (reducer.ts:400,406-407,450,466 — pencocokan RS SISRUTE→rujukanDitolak/
rujukanTepat→skor). Bukti ini KEALPAAN bukan desain: `kasusIgd.spesialisRujukan` (verifikasi.ts:233)
dan `rumahSakit.spesialisasi` (verifikasi.ts:252) SUDAH di-hash utk perbandingan SISRUTE yg SAMA
— sisi kasus poli-nya tidak. Kelas identik known-#1 (keluarga.anggota/rw) — brief §2#1 eksplisit
minta hunt ini, dan ketemu. Edit konten ke salah satu 6 field TANPA bump REVISI_ENGINE →
fingerprint identik → verifier lolos gate → replay menyimpang → dossier jujur bisa divonis
`tidak_sah` palsu. **Diverifikasi Claude langsung** (baca verifikasi.ts:199-274 + grep pemakaian
tiap field di director.ts/reducer.ts) — akurat.

### P2 (9) — didominasi konten menghukum/tak mengkredit tindakan klinis BENAR

1. **Apendisitis: clue anjurkan "pasang jalur IV" tapi scoring hukum `pasang_infus` sbg
   tindakanDiLuar (−15)** (kasusRespGi.ts:1137-1145, clinic.ts:476-521). `tatalaksana` tanpa
   field `prosedur` → `prosedurBenar=[]`; `pasang_infus` (katalogM3.ts:265) real tindakan tapi
   otomatis masuk `tindakanDiLuar` bila dilakukan → `-15`. Mahasiswa yg PATUH clue dihukum aktif.
2. **Hordeolum: clue bilang antibiotik topikal "opsional" + terapi utama kompres hangat, tapi
   `obatBenar` cuma 1 slot (antibiotiknya) → rasioTerapi 0 bila tak diresepkan**
   (kasusSarafMataTht.ts:776-783, `totalSlot=1`). Menghukum stewardship yg direward di kasus lain.
3. **Faringitis darah_rutin `relevan:false` vs tonsilitis (sister-case identik) `relevan:true`**
   (kasusInfeksi.ts:221 vs kasusRespGi.ts:345) — leukositosis sama, flag beda → penalti
   `labTakRelevan` arbitrer antara dua kasus setara secara klinis.
4. **Malaria: variasi persona "terpelajar" bilang demam "pola teratur" kontradiksi q_pola baku
   "tidak teratur betul"** (kasusKiaJiwa.ts:1053 vs 1071) — periodisitas = fakta pembeda spesies,
   berubah krn persona (kelas sama fix insomnia-lansia M10.c, instance baru sumbu "pola gejala").
5. **KLB skabies/konjungtivitis (kontak) diajarkan respons droplet (masker/etika batuk) sbg
   benar** (kegiatan.ts:232-236) — `polaDariKasus` default ke 'droplet' utk apa pun selain
   dengue/diare/tifoid; komentar sendiri sadar "skabies (kontak)" tapi kartu tetap droplet-spesifik.
6. **Epistaksis usiaMin:12 + TD 150/90 "hipertensi kronik, obat sering putus" — inkoheren utk
   anak 12-14** (kasusSarafMataTht.ts:912,948,977) — kontradiksi langsung klaim M10.c §47
   "nol vital gross-outlier" (lolos krn cek ujung dewasa, buta ujung usia-12).
7. **Konjungtivitis usiaMin:5 + TD 118/76 dilabel "tanda vital dalam batas normal"**
   (kasusInfeksi.ts:829-830,900) — hipertensif utk balita, counterexample kedua klaim M10.c.
8. **Surat hasil lab tindak-lanjut tak pernah sebut nama pasien** (reducer.ts:213-220 producer
   tanpa field nama/catatan → 1321 konsumen fallback `?? "pasien kemarin"` SELALU terpicu). Dua
   lab besok di hari sama → dua surat berjudul identik, tautan hasil↔pasien putus. Beda dari
   known-#5 (No.RM) — ini artefak SURAT, bukan pasien. `reachesOldSaves: butuh-migrasi`.
9. **Jadwal karma_igd di-bake sekali di init.ts:104-125 dari `pack.keluarga` — rename `kasusId`
   di masa depan bikin korban tak pernah datang TAPI efek karma (tally, surat, arcSelesai:'gagal')
   sudah terjadi lebih dulu** (reducer.ts:1345-1369 jalan sebelum filter `pasienKembaliValid`
   di 1644 diam-diam buang entrinya). `save.ts` py recovery rename utk IGD/klinik-aktif (300/325)
   tapi NOL utk jadwal karma. `reachesOldSaves: butuh-migrasi`.

### P3 (11) — a11y berulang (pola copy-paste) + font-noscale + 1 defense-in-depth

Kelas **aria-role-mismatch/keyboard-a11y** muncul di ≥6 komponen: `TitleScreen.tsx:170`
(radiogroup+aria-pressed, instance kedua persis known-#11), `DeckDisposisi.tsx:262` (SISRUTE
picker aria-pressed TANPA wrapper role sama sekali — lebih parah dari #11),
`DeckDiagnosis.tsx:57-96` (diagnosis banding + toggle tinta TEGAK/SUSPEK nol state ARIA sama
sekali, hanya CSS), `FigurTubuh.tsx:48-122` (10 `<g onClick>` mouse-only, instance kedua persis
known-#8 PetaSvg — dimitigasi P2→P3 krn `DeckPemeriksaan.tsx` py chip `<button>` cermin yg
tetap keyboard-accessible). Kelas **font-noscale** (instance baru di luar known-#13):
`PetaDesa.css:60,67,79` (cartouche+seru+sub-label, selector TERPISAH dari fix #13 di baris 49 —
fix #13 TAK menyentuh ini), `Kunjungan.css:69` (angka stepper 12px), `Hud.css:98,108` (badge
11px). Baru: **`Toaster.tsx:67` nol `aria-live`/`role=status`** — toast keselamatan
(KONTRAINDIKASI alergi, Kode Hitam, IGD tiba) tak diumumkan screen reader, kelas sama known-#12
tapi taruhan lebih tinggi (konfirmasi langsung: kode dibaca ulang di §terkait). **Defense-in-depth**:
`DeckDiagnosis.tsx` nol guard `kasus.icd10 ∈ diagnosisBanding` (validasiPack tak cek ini) — 0
pelanggaran di 67 kasus HARI INI, tapi kealpaan penulis di masa depan bisa bikin skorDiagnosis
mustahil/softlock tutorial tanpa terdeteksi. Dua instance vital-vs-demografi tambahan berdampak
lebih kecil (skabies/serumen_prop, kasusInfeksi.ts:725 — TD dewasa tapi tak diskor, murni
naratif) dan satu persona-changes-fact tambahan (rinosinusitis warna ingus kuning-vs-hijau,
kasusSarafMataTht.ts:1029 — dampak Dx rendah, kuning&hijau sama-sama mukopurulen).

### Pola lintas-temuan (nilai lebih dari instance tunggal)

1. **fingerprint-gap sistemik** — separuh field score-affecting di-hash, separuh tidak, konsisten
   di berbagai kategori pack (keluarga known-#1, kasus §49-P1) — kealpaan berulang, bukan sekali.
2. **clue-vs-therapy meluas ke prosedur/tindakan & arah opsional-vs-wajib** — guard permanen
   `tatalaksanaClue.test` HANYA scan kata kunci obat (antibiotik/steroid/rujuk), buta prosedur.
3. **vital-vs-demografi: sapuan deterministik M10.c hanya tangkap gross-outlier, buta ujung usia
   band** — 4+ situs (epistaksis/konjungtivitis/skabies/serumen) semua di usia anak termuda yg
   diizinkan demografinya, dgn narasi/vital dewasa.
4. **a11y copy-paste**: aria-pressed-bukan-radio dan `<g onClick>` mouse-only masing2 muncul di
   ≥3 komponen independen — pola arsitektural (tim menyalin dari 1 komponen ke komponen lain),
   bukan kebetulan.
5. **"bersih" itu bersyarat pada METODOLOGI sapuan** — M10.a/b/c berkali-kali klaim "nol temuan"
   di suatu sudut, lalu ronde independen berikutnya (dgn lensa BEDA) menemukan celah nyata di
   sudut yg SAMA. Pola ini sekarang terjadi ≥5× (M9→M10 lahir, M10.a ronde-4, brief M10.b, §48,
   §49 ini) — cukup konsisten utk dianggap properti proyek ini, bukan kebetulan.

### Yang BELUM difix

Giliran ini SEKALI LAGI murni audit + triase (permintaan user: sapuan dulu, "diteliti"). 21
temuan di atas — SEMUA CONFIRMED oleh Claude, NOL yang perlu verifikasi lanjut — adalah **OPEN
ITEMS menunggu keputusan fix**. Beberapa (apendisitis, hordeolum) py 2 opsi fix yg saling
eksklusif (ubah konten vs ubah clue) yg butuh keputusan, bukan tambal mekanis — cocok didiskusikan
dgn user sebelum eksekusi massal.

## 50. Fix batch §49 — 21 temuan sapuan multiagen DIPERBAIKI (2026-07-10, commit `4e79ffe`)

User: "semua Sapuan M10 multiagen sebelumnya tolong di fix ya se enak, se comfortable,
se esensial dan sekreatif mungkin". Seluruh 21 temuan §49 diperbaiki solo (workflow verifikasi
CODEX terpisah tetap jalan di latar). Test-first + verifikasi-bergigi. **476 test** (dari 463,
+13 baru di `m10sweep49.test.ts`), typecheck bersih. **REVISI_ENGINE 15→16**.

### Integritas (P1)
`sidikJariPack` per-kasus kini meng-hash 6 field yang dibaca LIVE saat replay (demografi,
prevalensi, kategori, skdi, konsekuensi, spesialisRujukan) + `keluarga.anggota/rw/jarakMenit`
(menutup §48#1 sekalian). Test membuktikan: ubah prevalensi/demografi/spesialisRujukan/nama-anggota
→ hash berubah. Ini juga otomatis menutup **CODEX P1.3** (DUP_49) dari ronde verifikasi paralel.

### Mekanik baru
- **`obatOpsional`** (types.ts): obat sah-tapi-tak-wajib (clue "opsional"). Semantik skor
  (clinic.ts): tak buka slot terapi, tak dihitung obat-di-luar, tak picu antibiotik-tanpa-indikasi.
  Hordeolum kasus perdana — terapi konservatif (kompres tanpa antibiotik) dulu rasioTerapi 0,
  kini 100 (test membuktikan). `validasiPack` menjaga disjoint-set + `tatalaksanaClue.test`
  diperluas mengakui obatOpsional (guard "clue janji antibiotik" tak lagi false-positive hordeolum).
- **KLB pola `kontak`** (kegiatan.ts): skabies & konjungtivitis_bakterial dapat aksi benar
  "obati kontak serumah + dekontaminasi" (dulu jatuh ke droplet: masker/etika batuk utk wabah
  tungau). Distraktor ditukar (fogging/isolasi). Guard regresi: ISPA tetap droplet.

### Konten (P2)
apendisitis +prosedur `pasang_infus` (clue wajibkan jalur IV, dulu −15 tindakan-di-luar);
faringitis darah_rutin relevan false→true (samakan sister-case tonsilitis, hapus penalti arbitrer);
epistaksis usiaMin 12→35 (premis HT kronik dewasa); konjungtivitis/skabies/serumen TD diturunkan
ke nilai normal lintas-usia (105/68, 108/70); malaria variasi "pola teratur" dihapus (kontradiksi
q_pola), rinosinusitis ingus "kekuningan"→"kehijauan" (samakan q_ingus).

### Identitas & patch-safety
surat hasil_lab kini bawa NAMA pasien (dulu selalu "pasien kemarin"; dua lab sehari → dua surat
identik); karma_igd guard `pack.kasus[kasusId]` — bila kasus di-rename patch, efek karma tak
meledak tanpa korban (jejak yatim).

### A11y (P3)
`useRadioGroup` hook (role=radio + aria-checked + roving tabindex + navigasi panah) → TitleScreen
(menutup **CODEX A.5** parsial) + Pengaturan (menutup **known-#11**) dgn roving penuh, + DeckDisposisi
RS. DeckDiagnosis banding/tinta dapat role=radio+aria-checked TANPA roving (sengaja: hindari bypass
kunci tutorial via panah). FigurTubuh SVG `aria-hidden` (chip DeckPemeriksaan sudah jalur keyboard
penuh — hindari 20 tabstop utk 10 aksi; keputusan LEBIH BAIK dari fixHint agent yang tak sadar chip
paralel). Toaster `role=status`+`aria-live=assertive` (menutup **CODEX A.2** parsial — sisa: timer
toast basi). font-noscale→rem: label SVG peta (+§48#13 sekalian), angka stepper Kunjungan, badge/
gembok HUD (ikut skala teks 90-140%, diverifikasi browser 13→18.2px @140%). Defense-in-depth:
`validasiPack` menjaga `icd10 ∈ diagnosisBanding`.

**Diverifikasi browser**: radiogroup roving+panah bekerja, SVG font menskala, peta utuh 17 label.
FigurTubuh/Toaster/Deck via test+baca-kode.

**M10 §49 TUNTAS.** Sisa OPEN: temuan CODEX ronde-verifikasi (lihat §51) — mayoritas butuh
adjudikasi user (medis/desain), tidak auto-fix.

## 51. CODEX full-sweep M10 (ronde-verifikasi) — 37 temuan ditriase via workflow verifikasi, BELUM difix (2026-07-10)

CODEX menjalankan full-sweep M10 (a/b/c + save/replay/scoring/impor) di snapshot `8066704`,
melaporkan 37 temuan. Diverifikasi via Workflow: 37 agent skeptis (satu per temuan) membaca kode
aktual + dedup thd §48/§49/known-13, lalu sintesis. **Verdict**: 12 CONFIRMED_BARU, 19
PERLU_ADJUDIKASI (fakta-kode benar, vonis "bug" butuh keputusan medis/desain manusia), 3 DUP
(P1.3→§49, B.3→§48#5, A.7→§48#9), 3 REFUTED (B.2 bonusTrust by-design §43; B.8 IGD granular
by-design; C.13 gout — nuansa ACR justru SUDAH ada di clue, klaim tak akurat). Catatan penting:
NOL P1 di antara CONFIRMED_BARU — keempat celah save-integrity (P1.1/2/4/5) dikoreksi verifier ke
P2 (bersyarat/self-heal); satu-satunya P1 tersisa (P1.6 "ujian tak menilai proses klinis") =
PERLU_ADJUDIKASI (murni keputusan edukator).

### 3 batch fix (rekomendasi sintesis)

**Batch 1 — MEKANIS-AMAN** (robustness/kontradiksi internal, bisa langsung; TAK butuh vonis
medis/desain): `B.5` guard `jadwal:[null]` di save.ts:69 (pola sama dex/keluarga/rw); `B.6`
recovery `st.kunjungan` yatim di deserialize (pola st.igd/klinik); `A.2` Toaster timer per-toast
(sekarang satu timer bersama → event baru batalkan dismissal batch sebelumnya, toast bisa menetap
selamanya) — CATATAN: bagian `role=status` A.2 SUDAH difix di §50, sisa timer-nya di sini; `A.5`
DeckTerapi lengkapi pola WAI-ARIA Tabs (role=tab ada, tapi nol tabpanel/aria-controls/roving/
panah); `C.11-gout` PF string "serangan pertama"→"saat ini" (anamnesis sebut serangan sebelumnya);
`C.3-tinea` mikonazol→obatAlternatif (clue namai sbg sah, dulu −15).

**Batch 2 — BUTUH-KEPUTUSAN-DESAIN** (engineering/UX, usul opsi A/B ke user dulu): `P1.1`
autosave melewatkan outcome ireversibel (KODE_HITAM/DISPOSISI_IGD/KEGIATAN_SELESAI/PEMULIHAN/TAMAT
tak di EVENT_AUTOSAVE — quit-setelah-outcome bisa batalkan kematian IGD/hasil kegiatan di Ujian
ternilai; + double-meta playthroughs); `P1.2` autosave race pada `autosave.json.tmp` bersama tanpa
serialisasi per-slot; `P1.4` sidikJariPack sort per-id tapi `susunAntrianHarian` baca
`Object.values` tanpa sort (refactor urutan key ubah RNG tanpa ubah hash); `P1.5` skor MI
campur-satuan (miTotal per-pilihan-dialog, floor pakai target kunjungan 8/24 → 1 kunjungan sempurna
= 50% target Ujian); `C.6` fakta anamnesis statis tak ikut demografi (apendisitis-L ditanya haid,
DM-L jawab "keputihan", tifoid-10th "waktu SMA"); `A.1` fokus jatuh ke body pasca aksi + balon
jawaban nol aria-live (DeckAnamnesis/IGD/Kegiatan/Kunjungan); `A.3` `--tinta-pudar` gagal kontras
AA (3.3-4.34 siang, 4.11 malam <4.5:1) pada teks 0.72rem; `A.4` RumahIlustrasi SVG terang di mode
malam (--kertas-050/200/300 tak diremap); `A.6` tagline TitleScreen "Sembilan puluh hari" abai mode
Ujian-30 + tab Peta locked-but-enabled; `B.1` Prolanis tak ikut drift JKN runtime; `B.4` stok obat
BPJS tampak dibebankan 2× (arus kas); `B.7` verifier bisa beku pd dossier besar (cap ukuran input);
`C.9` konsekuensi 90-180 hari (dislipidemia/obesitas) tak pernah muncul dlm karier 90 hari.

**Batch 3 — BUTUH-PENILAIAN-MEDIS (Dr. Wirayuda)** (auditor & Claude TAK boleh vonis; fakta-kode
solid, keputusan klinis milik user): `P1.6` ujian nilai proses klinis?; `P1.7`/`C.7` gate
tes-konfirmasi utk skor diagnosis (malaria/TB/DM)?; `P1.8` floor terapi dengue observasi-lab
prematur pantas kebal-konsekuensi? (WHO: pilih tes per hari-onset); `P1.9` edukasiKritis terlewat
boleh tetap rmLengkap?; `C.1` wajibkan stabilisasi hands-on kasus rujuk berat?; `C.2`
tinea/impetigo wajib kombinasi topikal+sistemik (AND)?; `C.4` **primakuin + gender-acak + nol
skrining hamil** (Kemenkes: primakuin kontraindikasi hamil) — POTENSI SALAH-AJAR, jangan sentuh
tanpa dokter; `C.5` clue urgensi kutip target 25% jam-pertama (PNPK: itu utk emergency) — potensi
teaching-error; `C.8` alergi jadi kriteria rmLengkap wajib? (40/61 kasus tanpa pertanyaan alergi);
`C.10` edisi ICD target (K35.80 CM vs K35.8/9 WHO); `C.11-disentri/veruka` zinc dewasa, bedak
salisilat 2%; `C.12` abortus iminens tirah baring (Cochrane/NICE — kandidat M11).

**Peringatan sintesis**: tiap edit konten (Batch 1 C.3/C.11, Batch 3 apa pun) menggeser
`sidikJariPack` tx-hash → koordinasikan dgn bump REVISI_ENGINE. Batch 3 JANGAN diubah tanpa
persetujuan medis eksplisit. **Semua 37 didokumentasikan sbg OPEN** menunggu keputusan user per-batch;
detail per-temuan + reasoning verifier tersimpan di task output `w1fx200z3`.

## 52. CODEX Batch-1 (mekanis-aman) DIPERBAIKI — 6 fix (2026-07-10, commit setelah §51)

User: "Batch 1 — aman-mekanis hajar dulu sampai habis". Seluruh 6 item Batch-1 (dari triase §51)
diperbaiki solo, test-first. **484 test** (dari 476, +8), typecheck bersih. TANPA REVISI_ENGINE
bump (konten C.3/C.11 tercakup pack tx-hash → dossier lama otomatis "tidak_dapat_diverifikasi";
B.5/B.6 = save-validation, A.2/A.5 = UI — semua non-scoring-formula).

- **B.5** (save.ts): guard entri `jadwal` — `[null]`/hari-non-numerik ditolak (dulu lolos
  `Array.isArray` lalu crash `j.hari` di day-advance). Pola dex/keluarga. Test: 3 (tolak null,
  tolak hari non-numerik, valid-init lolos utuh).
- **B.6** (save.ts): recovery `st.kunjungan` yatim — keluarga/skenario aktif hilang pasca-update
  konten dulu bikin LANJUTKAN menolak selamanya (soft-lock hari tak maju; layar Kunjungan hanya
  bisa PINDAH_LAYAR tanpa mengosongkan st.kunjungan). Kini dibuang + surat kompensasi + betulkan
  layar. Pola igd/klinik (save.ts:300/325). Test: 3 (keluarga-hantu, skenario-hantu, valid-utuh).
- **A.2** (Toaster): timer per-batch — dulu SATU timer di-`clearTimeout` saat effect re-run
  (event baru) → penghapusan batch SEBELUMNYA batal → toast menetap selamanya. Kini ref timer,
  cleanup HANYA saat unmount. (bagian `role=status` sudah di §50.)
- **A.5** (DeckTerapi): lengkapi WAI-ARIA Tabs — `id`+`aria-controls`+roving-tabindex+navigasi-panah
  + `role=tabpanel`/`aria-labelledby` pada 3 panel (dulu role=tab+aria-selected ada tapi nol sisanya).
- **C.11** (gout): PF "serangan pertama ini"→"saat ini" (anamnesis q_riwayat sebut serangan
  setahun lalu — kontradiksi internal).
- **C.3** (tinea): antijamur topikal jadi grup pilih-salah-satu `[ketokonazol|mikonazol]` — clue
  namai keduanya setara, dulu mikonazol (yg clue sahkan) dihukum −15 obat-di-luar. Test: skor
  mikonazol == ketokonazol == 100.

**Batch 2 (butuh-keputusan-desain) & Batch 3 (butuh-penilaian-medis) tetap OPEN** menunggu
keputusan user per-item (lihat §51).

## 53. CODEX Batch-2 (keputusan desain) DIPERBAIKI — 13 item, keputusan didelegasikan (2026-07-10)

User: "silakan kamu putuskan yang paling optimal, paling user-oriented di masa depan, paling
sustainable-resilien utk jangka panjang. Mono agentic." Semua 13 item Batch-2 selesai solo,
test-first. **502 test** (dari 484, +18), typecheck bersih. **REVISI_ENGINE 16→17** (5
perubahan semantik replay, terdokumentasi di verifikasi.ts). Keputusan per-item:

- **P1.1 autosave outcome**: EVENT_AUTOSAVE += KEGIATAN_SELESAI/KODE_HITAM/PEMULIHAN_SELESAI/
  TAMAT; AKSI_AUTOSAVE += DISPOSISI_IGD (level-aksi, event STEMPEL ambigu dgn diagnosis
  klinik). rekamMeta idempoten via staseTamat[] (sidik seed:seedKurikulum) — playthroughs tak
  dobel. Kedua set di-export + test pin-konfigurasi. Menutup vektor curang quit-undo di Ujian.
- **P1.2 race autosave**: antrean promise PER-SLOT di main process + nama tmp unik ber-counter.
  Ordering terjamin (tulisan terakhir menang), kontrak fire-and-forget renderer tak berubah.
- **P1.4 order-dependence**: kandidat Director di-SORT by id — determinisme thd ISI pack, bukan
  bentuk penulisannya. (Ambang test prevalensi m3sisrute dilonggarkan 2x -> 1.8x: realisasi
  draw bergeser; invarian "jauh lebih sering" tetap, empiris 355 vs 187 = 1.9x.)
- **P1.5 satuan MI**: tally per-KUNJUNGAN (miTotal+=1; miTepat+=kualitas 0..1, pecahan sah) —
  konsisten dgn floor EKSPEKTASI_KUNJUNGAN, nol konstanta ajaib, kebal perubahan bentuk konten.
  1 kunjungan sempurna kini 12.5% target Ujian (dulu 50%).
- **C.6 fakta-vs-demografi**: mekanik BARU hanyaUntuk 'L'/'P' pd PertanyaanAnamnesis — UI
  menyembunyikan & skor mengecualikan dari denominator bila gender pasien tak cocok. Konten:
  apendisitis q_haid -> P; DM "keputihan" -> dinetralkan "gatal selangkangan/lipatan" (tanda
  klasik DM lintas gender — poin ajar dipertahankan utk semua); tifoid "waktu SMA" ->
  "beberapa tahun lalu". Mekanik vs teks dipilih per-kasus: apakah PERTANYAANNYA inheren
  ber-gender atau cuma jawabannya.
- **B.1 Prolanis-JKN runtime**: kartu sesi hanya utk peserta ber-JKN aktif saat MULAI_PROLANIS
  (hanya 'tidak' eksplisit menyaring); tanpa-kartu TIDAK di-drift (dulu dianggap salah ->
  memburuk); roster+param persisten. SEKALIGUS menutup §48#4 Bu Marni: tersaring saat kartu
  mati, otomatis ikut lagi begitu arc perbaiki JKN — nol migrasi save.
- **B.4 kas obat dobel**: kas keluar = saat PENGADAAN. Dispense BPJS dari stok = nol kas;
  stok HABIS = beli darurat -hargaBeli (backstop anti-eksploit + realistis). Umum: +hargaJual
  (stok habis: -hargaBeli juga). Label laporan -> "Belanja obat darurat (stok kosong)".
- **B.7 verifier freeze**: cap 8 MB di pintu masuk (dossier sah ~ratusan KB, >10x headroom) ->
  tidak_dapat_diverifikasi cepat. Test: <2 detik utk berkas 8.1 MB.
- **C.9 konsekuensi tak terjangkau**: dislipidemia & obesitas 90-180 -> 45-80 hari (konvensi
  kompresi-waktu game spt Prolanis bulanan; horizon nyata bertahun -> kandidat EBM-nuance M11).
- **A.1 fokus/live-region**: DeckAnamnesis balon jawaban role=status aria-live + tabIndex -1
  + menerima fokus pasca-klik (dulu fokus jatuh ke body); Kunjungan respons ber-aria-live +
  fokus ke "Lanjut"; IGD & Kegiatan live-region (fokus tak hilang di sana: tombol persisten).
- **A.3 kontras**: tinta-pudar siang #6e7a70 -> #5e6b62 (~5.1:1), malam #7d8f84 -> #93a79b
  (~5.4:1). Pagar HIDUP: test menghitung rasio WCAG langsung dari hex tokens.css (>=4.5
  kedua mode) — regresi token masa depan tertangkap otomatis.
- **A.4 rumah terang di malam**: filter brightness(0.8) saturate(0.9) pd .kunjungan-rumah di
  mode malam — ilustrasi = karya utuh (interior siang), meredupkan lembut > bedah token.
- **A.6 polish**: tagline TitleScreen reaktif mode ("Tiga puluh hari..." saat Ujian —
  diverifikasi live) + tab Peta terkunci kini benar-benar disabled.

Test baru: m10batch2.test.ts (12), store.test.tsx (+2 pin autosave), modeMalam.test.ts (+2
kontras WCAG komputasional). 2 test lama diperbarui utk semantik baru (selfplay MI-unit;
m3sisrute ambang) — keduanya berkomentar alasan.

**Sisa OPEN dari ronde CODEX: hanya Batch-3** (12 item butuh penilaian medis Dr. Wirayuda —
primakuin/skrining hamil, target HT urgensi, gate tes-konfirmasi, alergi-vs-rmLengkap, edisi
ICD, dll; lihat §51).

## 54. M10 Batch-3 (keputusan medis) — implementasi hasil riset (2026-07-10)

Setelah riset multi-agen (dokumen keputusan `docs/M10_BATCH3_MEDIS.md`), Dr. Wirayuda memutuskan.
Diimplementasikan: **all-3 fix faktual + C.4 opsi B + C.2 & C.12; C.8 → M11; 4 item desain
(P1.6/P1.7/P1.9/C.1) → M11.** Test-first, **512 test** (dari 502, +10 di `m10batch3.test.ts`),
typecheck bersih. TANPA REVISI_ENGINE bump (semua perubahan konten tercakup pack tx/anamnesis-hash
+ reuse mekanik `obatOpsional`/`hanyaUntuk` yang sudah ada — dossier lama otomatis
"tidak_dapat_diverifikasi", tak ada semantik engine baru).

- **C.5 (game-salah)** — clue HT urgensi: hapus "target ~25% dalam jam pertama" (itu angka
  EMERGENSI); ganti "turunkan PERLAHAN oral 24–48 jam, kontrol ~1 minggu" + kontras eksplisit
  "≤25% jam pertama = target EMERGENSI, BUKAN urgensi" (ACC/AHA 2017, ESC/ESH 2023, InaSH-PERHI).
- **C.10 (game-salah)** — apendisitis `K35.80` (ICD-10-CM Amerika) → **K35.8** (WHO ICD-10 2016,
  yang diikat Indonesia via Permenkes 76/2016) di icd10 + diagnosisBanding.
- **C.11c (game-salah)** — veruka: katalog `asam_salisilat_bedak` (Bedak Salisilat 2% = produk
  miliaria) DIHAPUS (yatim+decoy, pola §47), diganti `asam_salisilat_kolodion` (Asam Salisilat 17%
  Kolodion) sbg obatBenar.
- **C.11a (game-salah)** — disentri basiler (pasien DEWASA 15–50): `zinc_20` dipindah obatBenar →
  `obatOpsional` (zinc = terapi baku hanya anak <5, WHO/UNICEF/LINTAS DIARE); clue ditambah "zinc
  hanya untuk anak <5". Antibiotik disentri (sudah benar) dipertahankan.
- **C.4 (keselamatan, opsi B)** — malaria: tambah anamnesis esensial `q_kehamilan`
  (`hanyaUntuk:'P'` — reuse mekanik Batch-2) → skrining kehamilan hanya muncul/dihitung utk pasien
  perempuan; clue ditambah kontraindikasi primakuin pada hamil & bayi <6 bln + "G6PD tak wajib
  dites utk dosis tunggal falsiparum" (WHO 2023/2025 + Buku Saku Malaria Kemenkes 2023).
- **C.2 (kondisional)** — tinea: `griseofulvin_500` oral dipindah obatBenar → `obatOpsional`
  (topikal = lini pertama lesi terbatas; oral hanya bila luas — sesuai clue); topikal-saja kini
  skor penuh. Impetigo: `gentamisin_krim` → `mupirosin_krim` (lini pertama IDSA 2014/Perdoski;
  katalog +mupirosin_krim), `cefadroxil_500` oral → obatOpsional (hanya bila luas).
- **C.12 (kondisional)** — abortus iminens: "tirah baring" → "istirahat wajar/pembatasan aktivitas
  (BUKAN tirah baring total — tak terbukti, Cochrane CD003576/POGI; risiko VTE)"; konsekuensi.narasi
  diubah dari kausalitas "aktivitas→keguguran" ke natural history (kelainan kromosom); +konseling
  "keguguran umumnya bukan akibat aktivitas ibu". Inti (rujuk USG) dipertahankan.
- **P1.8 (game-benar)** — tak diubah (timing tes dengue sudah akurat).

**Dipindah ke M11** (dossier tak ubah kode): C.8 (mekanik keselamatan skrining alergi) + 4 item
desain/skoring P1.6/P1.7/P1.9/C.1. **Seluruh ronde CODEX audit M10 (§48–§54) kini TUNTAS** di sisi
M10; sisanya adalah pekerjaan M11 yang terdokumentasi.


## 55. M11 Fase-1 — lapisan pengayaan debrief (mutiaraEbm + catatanRealita) (2026-07-10)

Awal eksekusi M11 (user: "silakan lanjut ke M11 to the max, boleh multi agentics").
Dibangun lapisan display BARU di PanelHasil debrief, DUA field opsional pada `KasusKlinis`:

- **`mutiaraEbm?`** — mutiara "temuan klasik yang bisa MENYESATKAN" (jebakan EBM: lab
  false-negative, presentasi atipikal, mimicker). Kotak kunyit "💡 Waspada — Temuan Bisa
  Menyesatkan".
- **`catatanRealita?`** — catatan "idealis vs realita FKTP Indonesia" (obat tak masuk
  Fornas/sering kosong, alat/lab tak tersedia, realita rujukan). Kotak daun "🏥 Realita FKTP".

**Invarian kunci (kenapa TANPA bump REVISI_ENGINE):** keduanya MURNI display — dibaca
langsung dari PACK oleh komponen, TIDAK memengaruhi skor & TIDAK ikut `sidikJariPack`.
Aman diedit tanpa REVISI, langsung menjangkau save lama & dossier lama tetap sah. Kelasnya
sama dengan `clue` (yang juga tak di-hash). Dijaga `src/engine/m11pengayaan.test.ts`: mutasi
& penghapusan kedua field TAK menggeser sidik jari dan TAK menyentuh skor — bila kelak keliru
dimasukkan ke hash, test merah memaksa keputusan REVISI sadar (mencegah kelas bug §49 P1
"field display diam-diam menggeser replay").

Kasus **perintis**: `mm_gout_artritis_akut` — mutiaraEbm (asam urat serum bisa NORMAL/rendah
saat serangan akut, diagnosis tetap klinis) + catatanRealita (kolkisin tak selalu ada di rak
Puskesmas → NSAID/natrium diklofenak tumpuan). Ini menjawab ide asal user (colchicine gout).

**Riset konten (in-flight):** Workflow multi-agen `m11-pengayaan-riset` (7 finder per-file →
verifikasi WebSearch per kandidat vs guideline WHO/Kemenkes/PPK/Fornas + konteks FKTP nyata)
menyapu 67 kasus untuk kandidat mutiaraEbm/catatanRealita bertingkat keyakinan + sitasi. Sesuai
disiplin: hasil = dokumen keputusan untuk adjudikasi Dr. Wirayuda; TIDAK diterapkan otomatis.

Commit: `5766355` (5 file, 145 insertion, 516/516 test hijau, typecheck bersih).


## 56. DeepThink triase diterima PENUH → milestone M10.5/M11a diformalkan (2026-07-10)

DeepThink me-review dossier `DEEPTHINK_TRIANGULASI_M11.md` (8 pertanyaan strategis pasca dua
audit besar: 118 kandidat pengayaan M11 + 14 temuan CODEX terverifikasi). Dr. Wirayuda menerima
peta jalannya PENUH. Keputusan kunci:

- **M10.5 "Fidelitas Engine & Medis"** = SEMUA item ber-REVISI / koreksi keselamatan-medis →
  Golden Master TUNGGAL akhir Agustus 2026 → SATU `REVISI_ENGINE` bump → hard-freeze mesin skor
  saat semester mulai. **M11a "Pengayaan Live-Ops"** = display murni, silent patch pasca-Sept.
- Dosis obat (Q1 O2/O3) DITOLAK — pertahankan abstraksi tanpa-dosis (O1), dokumentasikan sbg
  batasan simulasi disengaja.
- Rencana lengkap + inventaris 14 temuan (dipilah jalur cepat-P0 / desain-engine / keputusan-medis
  / mekanis-aman) + tabel firewall alergi (Q1a) + 5 keputusan skoring (P1.6/P1.7/P1.9/C.1/C.8) +
  temuan Q7 terkoreksi + urutan Golden Master: **`docs/M10_5_FIDELITAS.md`** (sumber tunggal M10.5).

**4 quick-win Fase-1 dimulai (perintah user):** (a) Q1a firewall alergi — tabel 11 antibiotik
disodorkan utk adjudikasi; terbukti AMAN (alergiTrap kasus saat ini hanya nsaid/penisilin/statin/
sulfa → tag kelas baru tak bisa memblokir obat benar mana pun; +tag mengubah sidikJariPack tapi
TANPA REVISI bump). (b) Q7 otonomi — hasil baca kode: kedua arc (Dewi/Karsa) ternyata depiksi
SENGAJA hambatan nyata (game mem-problem-kan, bukan endorse); titik genuinely lintas-batas HANYA
`desaF:995` (Fe Bu Painah "lewat persetujuan suami" — membundel obat pribadi dgn izin pasangan).
(c) Q8 audit ICD-10 67 kasus — workflow multi-agen `audit-icd10-satusehat` jalan (vs WHO ICD-10
2010/SATUSEHAT). (d) 5 keputusan skoring — dok keputusan disiapkan di M10_5_FIDELITAS §3.

**Blind spot DeepThink (dicatat):** saat memaksa eskalasi kasus gawat (Q2), kalibrasi ulang
Referral Guillotine SERENTAK — jangan tebas mahasiswa yang merujuk BENAR per EBM terbaru.

## 57. Audit UI/UX read-only (HEAD 6ee5932) — verifikasi 30 temuan, Batch-1 P1 DIPERBAIKI (2026-07-10)

CODEX audit read-only UI/UX menyerahkan 25 temuan bernomor (6 P1 + 19 P2) + 5 item P3 polish.
Diverifikasi via workflow 10-agen paralel (baca kode langsung, bukan percaya laporan mentah) —
hasil: **24 confirmed, 5 sudah-benar-tapi-detail-berbeda dari klaim, 2 butuh-keputusan-desain
(bukan bug)**. Nol false-positive murni. Detail lengkap tiap verdict: `docs/references/
codex_verify_full.json`. Prinsip verifikasi (pelajaran sesi-sesi sebelumnya): baca cukup luas
sebelum memvonis "confirmed", jangan simpulkan dari satu field/baris tanpa cek sibling/efek lain.

**Batch-1 (P1, klaster save/dead-end) — DIPERBAIKI test-first, 550/550 test hijau + typecheck bersih:**
1. **Kegiatan lapangan korup mengunci navigasi** — `save.ts` tak punya blok pemulihan utk
   `kegiatan` (beda dari igd/kunjungan yang sudah ada); `reducer.ts:112` menolak PINDAH_LAYAR
   selama `s.kegiatan` truthy tanpa cek validitas → dead-end permanen bila kartu/pilihan korup.
   Fix: tambah blok pemulihan kegiatan di `save.ts` (pola sama igd/kunjungan) + surat kompensasi
   `surat_pemulihan_kegiatan_*`.
2. **IGD `langkahIndex` di luar batas → badan kosong + HUD terkunci** — kasusId bisa valid tapi
   index melebihi `kasus.langkah.length` (versi konten berubah); `Igd.tsx` hanya render fase
   'langkah' bila `langkah[index]` ada. Fix: perluas pemulihan IGD `save.ts` cek bounds juga.
3. **3 jalur overwrite tanpa konfirmasi** (mulai stase baru, impor JSON, timpa slot manual) — semua
   langsung dispatch tanpa jeda; Enter di form nama pun submit HTML biasa. Fix: `window.confirm()`
   sebelum ketiganya (TitleScreen.tsx ×2, MejaKerja.tsx ×1) — HANYA muncul bila memang ada arsip
   yang akan tertimpa (tak mengganggu kasus save-kosong).
4. **`muatDariSlot` tak memicu autosave** — beda dari `imporArsip` yg sudah benar; sesi baru dimuat
   cuma hidup in-memory, tutup app sebelum aksi lain memicu autosave = boot berikut baca save lama.
   Fix: `void get().simpan()` setelah `set(...)`, konsisten dgn `imporArsip`.
5. **`KartuHasil` kegiatan praktis tak pernah tampil** — `selesaikanKegiatan` pindah `layar:'peta'`
   DALAM transisi state yang sama dgn event `KEGIATAN_SELESAI`; React unmount `Kegiatan.tsx` before
   useEffect-nya sempat menangkap event. Fix: hapus `layar:'peta'` dari reducer — layar tetap
   'kegiatan' sampai pemain klik "Kembali" di `KartuHasil` sendiri (yang kini berhasil krn
   `s.kegiatan` sudah `undefined`).
6. **Autosave gagal 100% diam-diam** — `simpan()` cuma `console.error`; `save:read` menyamakan
   SEMUA error (ENOENT/EACCES/disk rusak) jadi null (gagal-baca disamakan "memang belum ada save");
   tak ada `before-quit` menunggu antrean tulis. Fix 3 lapis: (a) `statusSimpan` state baru
   ('idle'/'menyimpan'/'gagal') + indikator "⚠ Gagal menyimpan" di Hud; (b) `save:read` main
   process bedakan ENOENT (null, sah) vs error lain (throw, ditangkap+dilaporkan renderer);
   (c) `app.on('before-quit')` menunggu `Promise.allSettled(antreanTulis)` sebelum benar-benar quit.
   Catatan: perubahan main/index.ts tak punya test otomatis (tak ada harness test utk proses main
   Electron di codebase ini) — diverifikasi via typecheck + baca-ulang manual, bukan test-first
   penuh spt sisi renderer/engine.

**2 item ditandai butuh-keputusan-desain (BUKAN bug, tak diauto-fix):**
- **#9 Keputusan besar tanpa konfirmasi** (kunci Program Wilayah bulanan, PULANGKAN/OBSERVASI) —
  ternyata mekanik SENGAJA (M2.10/DeepThink Q4: "tanpa kunci sebulan penuh, program cuma daftar
  centang tanpa ongkos oportunitas nyata"), sudah didokumentasikan & sudah ada teks peringatan
  permanen di UI. Bukan diperbaiki.
- **#21b Kanvas peta tak ikut mode malam** — SENGAJA ("kartu pos abadi siang hari", didokumentasikan
  di `PetaDesa.css:206-229`), tapi alasan pembanding "sama seperti TitleScreen" kurang pas (TitleScreen
  fullscreen tanpa chrome gelap bersebelahan, peta disisipkan di shell gelap) — DeepThink/Dr. Wirayuda
  perlu memutuskan eksplisit apakah dipertahankan atau dikasih varian temaram.

**Batch-2 (2 fix mekanis-aman tambahan, sama sesi):**
- **#19 Modal panjang tergulir ke bawah** — `useFocusTrap.ts` fokus awal (+ wrap Tab) kini pakai
  `.focus({ preventScroll: true })` — modal `overflow-y:auto` (Onboarding dkk) tak lagi ter-scroll
  ke tombol paling bawah begitu dibuka.
- **#6/P3 text-xs Dex tak ikut skala teks** — `DexSkdi.css` dua label (`.dexskdi__legenda-pin`,
  `.dexskdi-kartu__pin`) diganti dari `9px`/`10px` mati ke `0.5625rem`/`0.625rem` (nilai identik
  di 100%, tapi kini ikut skala slider "Ukuran Teks").

**Batch-3 (resize/reflow #6 utama + debrief-hilang #7/#8), diverifikasi live di browser preview:**
- **#6 utama — grid `.mk` clipping senyap saat viewport sempit** — `MejaKerja.css` `.mk` diganti
  dari `overflow:hidden` penuh jadi `overflow-y:hidden; overflow-x:auto` — dites langsung di browser
  (resize ke 500px lebar): `scrollWidth 624 > clientWidth 500` kini muncul scrollbar horizontal,
  bukan potongan senyap tanpa jalan keluar.
- **#6 utama — garis-buku textarea refleksi tak sinkron dgn line-height saat teks diskalakan** —
  `repeating-linear-gradient` interval diganti dari px mati (27px/28px) ke `calc(1.3em - 1px)/1.3em`
  (matching line-height aktual dari `.tulis-tangan` yang menang cascade) — dites: pada 100% garis
  di 25-26px (=line-height 26px), pada 140% di 35.4-36.4px (=line-height 36.4px), selalu presisi sinkron.
- **#7c — feedback IGD lenyap seketika saat transisi ke kode_biru/disposisi** — `ResponsTerakhir`
  dipindah dari dalam blok fase==='langkah' ke luar ketiga blok fase, sehingga tetap dirender lintas
  transisi. **Bonus temuan tersembunyi**: memindahkan ini mengaktifkan bug laten — guard lama
  `langkahIndex === 0` (dulu selalu redundan dgn `jawaban.length===0` selama komponen HANYA dirender
  di fase langkah) jadi AKTIF KELIRU utk fase kode_biru yang dipicu tepat di langkah pertama (langkahIndex
  tetap 0 di jalur itu, igd.ts:50) — guard itu dihapus, cukup andalkan `jawaban.length`.
- **#7a/#7b — sudah dinilai TIDAK perlu fix** (sesuai temuan verifikasi "sudah-benar-berbeda"):
  penutupan PanelHasil via Escape/backdrop SENGAJA (per kebijakan `useFocusTrap.ts` sendiri — modal
  wajib-selesai tak diberi `onEscape`, PanelHasil BUKAN kelas itu); dan `PenilaianEncounter` lengkap
  genuinely PERSISTEN via `state.klinik.selesaiHariIni` + sudah ditampilkan ulang di Debrief Malam —
  klaim "lastEvents reset saat reload" akurat tapi menyesatkan soal dampaknya (data utuh, cuma
  affordance buka-ulang MODAL yang hilang, bukan datanya).
- **#8 — DIPUTUSKAN tidak perlu fix**: mekanisme sebenarnya (bukan cuma transkrip chat, tapi SELURUH
  progres kunjungan hilang bila crash mid-sesi) memang benar, TAPI ini konsisten dgn pola desain yang
  SAMA dipakai encounter klinik (`EVENT_AUTOSAVE` cuma memuat event PENUTUP — `ENCOUNTER_SELESAI`/
  `KUNJUNGAN_SELESAI` — bukan tiap langkah kecil), bukan gap unik kunjungan. Jalur pemicu (crash proses
  — satu-satunya jalur reload nyata di app produksi) genuinely jarang & recovery-nya ringan (ulangi
  1 kunjungan rumah, bukan kehilangan hari/stase). Tak diubah — konsisten > "fix" yang justru membuat
  kunjungan beda perlakuan dari encounter klinik tanpa alasan kuat.

555/555 test hijau, typecheck bersih.

**Sisa 13 P2/P3 (nomor #10-18/#20 aksesibilitas/kontras, #22-25 UX misc, polish P3 lain) belum
diperbaiki** — dilanjutkan batch berikutnya, prioritas: keyboard/focus → kontras → polish.

## 58. Batch-4 CODEX — klaster Peta Desa: keyboard nav + label + warna DIPERBAIKI (2026-07-10, commit `80aaac1`)

Melanjutkan §57, klaster peta desa (3 dari 13 sisa P2/P3):

- **#10 — petak RW `<g onClick>` polos tak terjangkau keyboard** — tak ada di tab order, tak ada
  semantik aktivasi; satu-satunya jalur lain (tombol roster) cuma mencakup keluarga yang SUDAH
  binaan, jadi keyboard-only tak bisa memulai eksplorasi RW baru sama sekali. Fix: `PetaSvg.tsx`
  tiap petak RW dapat `role="button"` + `tabIndex={0}` + `aria-label` deskriptif (nomor, nama
  dusun, jarak, IKS/status tersurvei) + `onKeyDown` (Enter/Space memicu `onPilih`, sama pola tombol
  native). `PetaDesa.css` tambah `:focus-visible` ring pada `.peta-petak__bidang` (SVG `<g>` tak
  dapat outline browser bawaan yang layak, harus digambar manual pada elemen anak).
- **#11 — label RW bertabrakan dgn tetangga di zoom normal** — label lama `"RW N · Nama Dusun
  Panjang"` pada RW berdekatan (mis. RW6/RW8) tumpang-tindih scara visual. Fix: label VISUAL
  disederhanakan jadi `"RW N"` saja; nama dusun lengkap tetap ada di `aria-label`/`<title>`
  (hover/screen reader) dan panel detail kanan (`PetaDesa.tsx:202`, sudah menampilkan nama penuh
  sebelum fix ini).
- **#12 — warna choropleth peta tak cocok klasifikasi resmi 3-kelas** — `warnaPetak()` lama pakai
  5 pita warna manual (>0.8/≥0.65/≥0.5/≥0.35/else) yg TAK SINKRON dgn `klasifikasiIks()`
  (`engine/pispk.ts`, 3 kelas: sehat/pra_sehat/tidak_sehat) yang dipakai legenda peta & chip
  klasifikasi panel detail RW — akibatnya RW "Pra-Sehat" (0.65-0.8) bisa tampak HIJAU (mirip
  "Sehat"), RW "Tidak Sehat" (0.35-0.5) bisa tampak KUNYIT (mirip "Pra-Sehat"). Fix: `petaUtil.ts`
  `warnaPetak()` kini memanggil `klasifikasiIks()` langsung dan map 1:1 ke 3 warna legenda — satu
  sumber kebenaran, tak ada lagi skala warna kedua yang bisa drift.

**Test-first**: `PetaSvg.test.tsx` baru (5 test: role/tabIndex/aria-label, Enter memicu `onPilih`,
Space memicu `onPilih`, label visual hanya "RW N", nama lengkap tetap di aria-label) + `petaUtil.
test.ts` (+4 test: zona pra-sehat bukan hijau, zona tidak-sehat bukan kunyit, regresi sehat/belum-
tersurvei, sapuan 0.00-1.00 tiap 0.01 assert `warnaPetak` selalu cocok `klasifikasiIks`). Semua
dikonfirmasi MERAH sebelum fix (`git stash` file produksi, re-run, `git stash pop`) — termasuk
sapuan gagal tepat di iks≈0.35 (batas pita 5-warna lama) sebelum fix. 564/564 test hijau + typecheck
bersih sesudah.

**Diverifikasi visual di browser** (ekstensi Chrome MCP, save Hari 2 mode malam): Tab dari tombol
mute mendarat di petak RW 1 dgn ring fokus biru-putus terlihat jelas di sekeliling bentuk petak;
`document.activeElement` mengonfirmasi `<g role="button" aria-label="RW 1 — Kampung Kauman (jarak
dekat). IKS agregat 71.">`; Enter membuka panel detail RW 1 menampilkan "IKS agregat 71 · Pra-Sehat"
— warna kunyit di peta cocok dgn label kelas di panel; label visual pada semua 8 petak tampil
"RW N" tanpa nama dusun, tanpa tabrakan antar-petak berdekatan.

**Sisa 10 P2/P3** (dialog-konten #13/#14, nama-kontrol #15, aria-state #16-18, kontras-darkmode
#20/#22, ux-misc #23-25, polish P3) — dilanjutkan batch berikutnya, prioritas sama: keyboard/focus
→ kontras → polish. §57's #21b tetap OPEN sbg keputusan-desain (bukan bug), tak dihitung dlm sisa.

## 59. Batch-5 CODEX — klaster dialog-konten Kunjungan: aria-label hotspot + kutip ganda DIPERBAIKI (2026-07-10, commit `e2048fe`)

Melanjutkan §58, klaster dialog-konten (2 dari 10 sisa P2/P3):

- **#13 — hotspot belum-ditemukan berbagi SATU aria-label identik** — `Kunjungan.tsx:206` selalu
  hardcode `'Amati lebih dekat'` utk kelima hotspot yang belum diklik, tak dibedakan berdasarkan
  posisi/urutan. Ini memang sengaja meniru pola anti-bocor-jawaban (identitas objek `h.label`/
  `h.narasi` tak boleh bocor sebelum diklik), TAPI pengaburan identitas tak mengharuskan pengaburan
  LOKASI juga — pemain sighted sudah bisa membedakan kelima hotspot dari posisi visual (x/y),
  sedangkan keyboard/screen-reader sama sekali tak bisa (5 tombol benar-benar tak terbedakan sampai
  diklik satu-satu membabi-buta). Fix: tambah index `i` ke `.map()`, aria-label jadi `` `Amati lebih
  dekat (titik ${i+1} dari ${skenario.hotspot.length})` `` saat belum ditemukan — info urutan yang
  SUDAH publik dari posisi visual, tanpa membocorkan identitas objek sama sekali.
- **#14 — kutip ganda bersarang di teks dialog** — `Kunjungan.tsx` membungkus `p.teks`/`dokterTerakhir`
  dengan tanda kutip “ ” tambahan di 2 titik (gema "Kamu: ..." baris 253, tombol pilihan baris 283),
  padahal `PilihanDialog.teks` di KONTEN sudah membawa tanda kutip lurus sendiri di awal/akhir string
  (mis. `'"Jadi Ibu berhenti minum obat..."'`). Klaim CODEX asli ("58 pilihan, 2 file") diverifikasi
  jauh di bawah kenyataan: audit ulang menghitung SEMUA 246 entri `PilihanDialog.teks` di keenam file
  `src/content/keluarga/desa{A-F}.ts` — 246/246 (100%) sudah berkutip (239 langsung, 7 sisanya berkutip
  setelah keterangan-panggung dalam kurung) — CODEX-nya sendiri kemungkinan hanya menangkap pola
  satu-baris literal, melewatkan gaya penulisan multi-baris bersambung yang dominan di desaA/C/D/E/F.
  Fix: render `{p.teks}`/`{dokterTerakhir}` polos tanpa bungkus “ ” tambahan — konten yang menentukan
  kutipnya sendiri.
- **SENGAJA TIDAK diubah**: baris 256 (`responsAktif`, sumber field `respons`/`responsBohong`, BUKAN
  `teks`) tetap dibungkus “ ” seperti semula. Audit independen atas 270 entri `respons`/`responsBohong`
  di seluruh 6 file desa menemukan field ini KELAS BERBEDA: hanya 129/270 (48%) berawalan kutip, 141
  sisanya narasi-campur-dialog (mis. `'Wajah Bu Wulan mengeras. Ia menuang teh... "Ya... Dokter kan
  belajarnya begitu." Ia mengalihkan pandangan ke jendela.'` — quote HANYA di tengah, bukan di batas
  string). Menyamaratakan fix `teks` ke `respons` berisiko regresi utk 141 entri itu, dan finding CODEX
  #14 yang diverifikasi eksplisit hanya menghitung `teks` — di luar cakupan yang diaudit, jadi tak
  disentuh sesi ini (kandidat audit terpisah bila diperlukan nanti).

**Test-first**: `Kunjungan.test.tsx` baru (5 test, pakai konten `PACK` asli + store/dispatch asli via
`buildInitialState`+`useGame.setState` — bukan mock, mengikuti pola `Igd.responsTerakhir.test.tsx`):
3 test aria-label (unik per-hotspot, tak membocorkan identitas, hotspot-sudah-ditemukan tetap pakai
label asli) + 2 test kutip (tombol pilihan render `p.teks` apa adanya, gema "Kamu: ..." tanpa kutip
tambahan setelah klik nyata via `userEvent` + dispatch `PILIH_DIALOG` sungguhan). Dikonfirmasi MERAH
dulu (3/5 gagal persis di title label-unik + 2 test kutip; 2 test lain incidentally sudah lolos krn
tak bergantung fix), HIJAU sesudah. 569/569 suite penuh + typecheck bersih.

**Verifikasi browser**: TIDAK dilakukan sesi ini — kunjungan hanya bisa dimulai pada periode "siang"
(gate waktu-hari, gerbang di luar bug ini), dan save aktif sedang di fase "sore"; mencapai siang
butuh menuntaskan antrean 3 pasien poli pagi terlebih dulu (tak terkait bug). Diverifikasi via tier
component-test dgn konten & store ASLI (bukan mock) sbg gantinya — pola sama yg dipakai memverifikasi
fix IGD di §57 Batch-3.

**Sisa 8 P2/P3** (nama-kontrol #15, aria-state #16-18, kontras-darkmode #20/#22, ux-misc #23-25,
polish P3) — lanjut batch berikutnya.

## 60. Batch-6 CODEX — nama kontrol jelas di 4 kartu berulang DIPERBAIKI (2026-07-10, commit `57e33e4`)

Melanjutkan §59, klaster nama-kontrol (#15, satu-satunya finding grup ini):

- **#15 — 4 kontrol berulang berbagi accessible name generik** — tombol Pesan lab
  (`DeckPemeriksaan.tsx:136`), +Resep obat (`DeckTerapi.tsx:236`), coret resep (`LembarPeriksa.tsx:
  248-254`, TANPA nama obat bahkan di `title`), dan aksi kartu keluarga Lepas/Jadikan Binaan/Kunjungi
  (`KartuKeluarga.tsx:143-163`, tak menyebut `content.namaKeluarga` sama sekali) semua memakai teks
  visible identik di setiap baris/kartu sejenis — nama objek (lab/obat/keluarga) hanya ada di `title`
  hover atau teks node saudara, bukan di accessible name tombol itu sendiri. Screen reader/scan cepat
  tak bisa membedakan kontrol sejenis di layar yang sama.
  Fix (aditif, teks visible pendek TIDAK diubah — layout kompak utuh):
  - `DeckPemeriksaan.tsx`: `aria-label={dipesan ? `${item.nama} sudah dipesan` : `Pesan ${item.nama}`}`.
  - `DeckTerapi.tsx`: `aria-label` 3-cabang (`Tambah ${o.nama} ke resep` / `${o.nama} sudah di resep` /
    `${o.nama} stok habis`).
  - `LembarPeriksa.tsx`: `title` yang tadinya statis "Coret dari resep" DIGANTI sekaligus dgn
    `aria-label`, keduanya kini `Coret ${o?.nama ?? id} dari resep`.
  - `KartuKeluarga.tsx`: `aria-label` pada ketiga tombol menyebut `content.namaKeluarga`.

**Test-first**: 4 file test (`DeckPemeriksaan.test.tsx` baru, `LembarPeriksa.test.tsx` baru,
`KartuKeluarga.test.tsx` baru, `DeckTerapi.test.tsx` diperluas) — 8 test baru total, pakai konten
`PACK` asli + `buatEncounter`/`buatPasienDariKasus`/`buildInitialState` (bukan mock). Dikonfirmasi
MERAH dulu (`git stash` 4 file produksi sekaligus, 7/8 gagal PERSIS di titik yang diubah — 1 test lama
yang tak bergantung fix tetap hijau, membuktikan stash tak merusak apa pun di luar target), HIJAU
sesudah `stash pop`. 576/576 suite penuh + typecheck bersih.

**Diverifikasi browser** (HMR live, Hari 3, encounter "Daeng Kanang"): aria-label lab "Pesan Asam Urat
Darah"/"Pesan BTA Sputum (sewaktu-pagi)" dkk tampil benar di tab Pemeriksaan; setelah menambah "Air
Mata Buatan (Hipromelosa)" ke resep di tab Terapi, tombol tambah berubah jadi aria-label "Air Mata
Buatan (Hipromelosa) sudah di resep" dan tombol coret di Lembar Periksa menampilkan "Coret Air Mata
Buatan (Hipromelosa) dari resep" pada `title` maupun `aria-label`. `KartuKeluarga.tsx` tak sempat
direplay live (di luar alur poli yang sedang berjalan) — diverifikasi via 2 test component dgn konten
asli sbg gantinya.

**Sisa 7 P2/P3** (aria-state #16-18, kontras-darkmode #20/#22, ux-misc #23-25, polish P3) — lanjut
batch berikutnya.

## 61. Batch-7 CODEX — SISA 7 P2/P3 SELESAI, audit UI/UX 30-temuan (2026-07-10 s/d 2026-07-11) TUNTAS

Dikerjakan via workflow paralel (14 paket fix, satu agen per file yang tak tumpang tindih) + review
adversarial 3-lensa (korektnes ARIA, risiko-regresi/konsistensi, kontras WCAG) sebelum commit —
pendekatan berbeda dari Batch 1-6 (solo sekuensial) krn skala (14 file lepas file) memungkinkan
paralelisasi aman. Review menemukan 2 REGRESI nyata sebelum sempat ter-commit, keduanya diperbaiki:
(a) `aria-pressed` dipakai keliru utk kartu single-select murni di Kunjungan.tsx/DexSkdi.tsx (bukan
toggle button — klik ulang tak meng-un-press), dikoreksi ke pola `role=radio`+`aria-checked` (sama
konvensi `useRadioGroup` yg batch INI SENDIRI baru pakai benar di MejaKerja.tsx) / `aria-current`; (b)
`--kunyit-800` token baru dipakai fix kontras tapi TAK diremap di blok `[data-mode='malam']` tokens.css
— membuat mode gelap LEBIH BURUK drpd sebelum fix (~2.3:1, gagal AA parah), ditambahkan remap
`#f5c478` + 3 test baru mengunci kontras mode-malam. Detail lengkap tiap fix: 4 commit terpisah per
tema (lihat commit log `git log --oneline` "Batch 7a-7d").

**Batch 7a — aria-state (#16a-g, #17, #18)**, commit `5871151`: aria-current pada tab HUD + 2 stepper
(Kunjungan/DeckAksi); fokus keyboard dipindah ke `<main>`/`<section>` (bukan `<body>`) tiap
layar/fase berganti (Deck anak di-unmount total tiap transisi fase, tombol yg tadi diklik lenyap
tanpa jejak fokus); Program Wilayah (MejaKerja) & kartu intervensi (Kunjungan, dikoreksi review) jadi
`role=radio`+`aria-checked`; kartu Dex (dikoreksi review) & chip edukasi/tindakan (DeckTerapi, sudah
benar dari awal) dapat `aria-current`/`aria-pressed` sesuai semantiknya masing-masing; KartuKeluarga
`disabled` native → `aria-disabled`+guard onClick (title/aria-label kini terjangkau keyboard). Riders
yang ikut satu file yg sama: P3 tombol "Tidur" duplikat MejaKerja dihapus; Polish#2a reduced-motion utk
scrollIntoView tutorial (hook baru `useMotionDikurangi.ts`, diekstrak dari LaporanAkhir.tsx); Polish#3a
pencarian ditambah ke Dex (144 entri).

**Batch 7b — kontras WCAG AA + ErrorBoundary (#20, #21-partial, #22)**, commit `6685e85`: hover
tombol-utama/kunyit & `.chip` dasar & 2 heading `.judul-seksi` di atas `.folder` diganti ke shade token
lebih gelap (lolos AA, dihitung ulang dari hex asli); `@media (forced-colors: active)` baru; chip klik
Edukasi/Tindakan dapat `min-height:24px` (target-size). ErrorBoundary: `data-mode="pagi"` tak lagi
dipaksa pada varian `layar` (mewarisi tema leluhur); semua warna hex hardcode → token; retry dibatasi
2× (cegah boot-loop diam); `keJudul` kini panggil ulang `muatAutosave()` (tombol "Lanjutkan" tak lagi
hilang keliru pasca crash-recovery); stack trace kini bisa diseleksi/disalin.

**Batch 7c — ux-misc (#23, #24, #25)**, commit `f45a6cd`: Rapor Hari-1 (tally nol) tak lagi tampilkan
stempel grade A-D prematur, diganti badge netral "belum ada data"; Onboarding dapat tombol replay
manual di Pengaturan + urutan fokus awal diperbaiki (CTA progresi, bukan "Lewati"); Toaster live-region
dipindah dari wrapper bersama ke tiap toast individual (aria-atomic tak lagi salah-sasaran).

**Batch 7d — polish (Polish#3b)**, commit `3534023`: 3 file-input TitleScreen dapat styling
`::file-selector-button` selaras `.tombol` (sebelumnya kontrol OS mentah tak konsisten).

**Verifikasi**: test-first penuh di semua 14 paket (TDD tanpa git-stash — ditulis dulu thd kode lama
lalu diperbaiki, krn 14 agen berjalan paralel di direktori kerja git yang SAMA, git-stash konkuren akan
bentrok); 621/621 suite penuh + typecheck bersih SETELAH kedua regresi review dikoreksi. Diverifikasi
visual langsung di browser (server dev sempat mati di tengah sesi — di-restart via `preview_start`,
kemungkinan penyebab: proses lama ditinggal terlalu lama tanpa aktivitas): kontras `--kunyit-800` mode
gelap dikonfirmasi via `getComputedStyle` (`#f5c478`, bukan `#7a410c` yg bocor), Program Wilayah
`role=radiogroup`+`role=radio`+`aria-checked` dikonfirmasi via DOM query langsung, tombol "Tidur"
duplikat dikonfirmasi hilang (hanya 1 tombol tersisa di panel debrief sore), tombol "Tampilkan panduan
lagi" & styling file-input TitleScreen dikonfirmasi tampil.

**Ini menuntaskan SELURUH 30 temuan audit CODEX UI/UX read-only 2026-07-10** (§57-61): 6 P1 (Batch-1),
19 P2 + 5 P3 (Batch-2 s/d 7d), 2 keputusan-desain dibiarkan (Program Wilayah lock, peta mode-malam —
§57), nol temuan tersisa yang belum ditriase atau diperbaiki.

## 62. Audit CODEX read-only baru (HEAD `d325766`) — 31 temuan, dibagi tugas dgn dokter (2026-07-11)

Dokter mengerjakan sendiri 17 temuan PNPK + 5 item M10.5 secara paralel; sesi ini menggarap laporan
CODEX 31-temuan (Temuan Kritis #1-6, UKM&Kebijakan #7-15, UKP&Konten #16-22, UI/UX #23-28,
Rilis&Reliabilitas #29-31) — hanya bagian yang murni mekanis/tanpa trade-off klinis-desain dikerjakan
langsung; sisanya (keputusan lisensi musik, hardening Electron lanjutan, filosofi anti-cheat,
model-data Prolanis/KBK, rubrik skor sbar/lab-lantai) dikembalikan ke dokter sbg keputusan, beberapa
di antaranya sudah tumpang-tindih dgn `M10_5_FIDELITAS.md` (Q6/Asih, #7c DM-Prolanis) — diarahkan ke
dok yg sama, bukan tiket baru.

Diverifikasi lewat workflow paralel (10 klaster + adversarial-verify pada 5 klaster berisiko tinggi:
security-legal, karma-mi, diare-planB, surveilans-KLB, ukp-konten-2), lalu didigest satu agen pembaca
transkrip penuh krn keluaran workflow (~1.1 jt token) tak muat dibaca langsung — digest itu jadi
referensi eksekusi.

**Fix mekanis-aman yang DIPERBAIKI (tanpa keputusan desain/medis baru):**
- **#1 (lisensi BGM)** — `scripts/check-bgm-license.js` baru: gerbang `pack`/`dist` gagal kecuali
  `ALLOW_UNLICENSED_BGM=1` selama 7 file OST Square Enix masih ada di `public/bgm/` (keputusan
  ganti/lisensi tetap milik dokter — ini cuma pagar agar tak ke-ship diam-diam).
- **#2 (hardening Electron)** — `main/index.ts`: `DEV` kini juga men-gate `app.isPackaged` (build
  produksi tak lagi bisa nyasar ke URL dev); `sandbox: true`; guard `will-navigate` (blokir navigasi ke
  origin luar file://); `setPermissionRequestHandler` tolak semua permintaan native (kamera/mic/dll);
  `loadURL`/`loadFile` di-gate eksplisit oleh `app.isPackaged`.
- **#31d (telemetri sebelum quit)** — `telemetriPending` promise-chain: `before-quit` kini menunggu
  tulisan telemetri yang sedang jalan, bukan cuma save-game.
- **#17 (antibiotik tanpa indikasi lolos deteksi)** — `engine/clinic.ts`: deteksi diubah dari level-KASUS
  (meleset jika kasus punya *sembarang* antibiotik di jawaban benar) ke level-OBAT-per-resep.
- **#19a (gerbang SBAR UI tak sinkron nilai skor)** — `DeckDisposisi.tsx`: ambang tombol submit disamakan
  eksplisit (`AMBANG_SBAR_ISI = 20`) dgn ambang skor yg sudah dipakai `clinic.ts`.
- **#21 (regresi narasi dengue non-bolus)** — `content/igd.ts`: narasi d2 disamakan dgn d1 (infus
  kristaloid, bukan "bolus") — sisa dari fix sesi sebelumnya yg belum menjalar ke d2.
- **#22 (invarian fase save rusak tak terdeteksi)** — `engine/save.ts`: validasi baru — `fase` harus
  salah satu dari 6 nilai `FaseEncounter` sah DAN `diagnosis` wajib ada bila fase
  terapi/disposisi/selesai; jika tidak, `klinik.aktif` dipulihkan + surat kompensasi (pola sama blok
  pemulihan igd/kunjungan/kegiatan yg sudah ada).
- **#12a/#12b (label Posyandu menyesatkan)** — `engine/kegiatan.ts`: BGM vs gagal-tumbuh dibedakan
  eksplisit; TD tunggal kader tak lagi diklaim "hipertensi" pasti, jadi "tersangka (perlu konfirmasi)".
- **#5b (karma partial tak pernah kedaluwarsa)** — `state.ts`+`reducer.ts`: `karmaAktif.partialDitunda`
  + `BATAS_PARTIAL_KARMA = 2` — penundaan +3 hari kini berhenti setelah 2×, tak bisa ditunda selamanya.
- **#11b (drift menimpa data terverifikasi dokter)** — `reducer.ts`: kandidat drift kini disaring
  `sumber === 'kader'` (bukan `!== 'belum'`), shg data berlabel `'dokter'` tak lagi ikut di-drift.
- **#12c (bonus IKS lantai 0.02 di skor nol)** — `reducer.ts`: formula `0.04 * skor` (lantai dihapus —
  sesi Posyandu skor nol tak lagi dapat bonus).
- **#14/#28b (tabrakan nama pasien harian + rw keluarga karma tak ikut)** — `engine/director.ts`:
  generator antrian harian kini hindari nama kembar (set `namaTerpakaiHariIni`, max 20 percobaan); blok
  karma-bridge kini ikut mewariskan `rw` keluarga (bukan cuma `keluargaId`/`bonusTrust`) — identitas
  nama/usia/JK SENGAJA tak disentuh (butuh keputusan match-identitas penuh, dicatat sbg technical debt,
  bukan bug).
- **#29a (exe launcher salah nama)** — `MULAI PRIMER.bat`: `PRIMER - ...exe` → `PRIMERA - ...exe` (cocok
  `productName` electron-builder aktual).
- **#18 (atribusi ucapan wali/pendamping tampak seolah pasien)** — `content/types.ts` field baru
  `keluhanUtamaOlehPendamping?: boolean`; label "Dituturkan pendamping:" dirender kondisional di 3 layar
  (`RuangTunggu`, `LembarPeriksa`, `MejaKerja`); di-set `true` pada 10 kasus anak/kondisi pembatas-bicara
  (diare, impetigo, pedikulosis, campak, OMA, pneumonia balita, askariasis, epilepsi, skizofrenia,
  stroke) — teks keluhan/klinis/skor TAK berubah, murni label tampilan.
- **#23/#25b (label peta desa kekecilan & buram)** — `PetaDesa.css` `.peta-label--sub`: 0.6875rem→0.75rem
  + `stroke-width: 1.5px` (halo 3px yg diwarisi dari `.peta-label` induk proporsinya kebesaran utk teks
  sekecil ini, bikin buram).
- **#26b/#27 (file-picker native berbahasa Inggris + 2 alat dosen menempel)** — `TitleScreen.tsx`: 3
  `<input type="file">` kini disembunyikan visual (`.title__file-input-tersembunyi`, pola
  visually-hidden standar — tetap fungsional & fokus-keyboard via `<label>` pembungkus), nama file
  bawaan browser ("No file chosen") diganti span Indonesia sendiri yg di-update `onChange`; pemisah
  `<hr>` bertitik ditambah antara blok Verifikasi Dossier & Impor Telemetri.

**Verifikasi CLEAN — dilaporkan CODEX tapi TERBUKTI TAK BERMASALAH setelah re-cek adversarial**
(termasuk 3 titik regresi-dugaan dari fix sesi sebelumnya: common-cold/bronkitis ambroxol,
penamaan ICD `mm_hipertensi_urgensi`, TB TCM/HIV — semua bersih, bukan regresi).

**#24 dikoreksi**: bukan temuan/defek, melainkan catatan LULUS dari CODEX sendiri (kontras dark-mode
teruji, terendah ~4.66:1) — tak perlu ronde verifikasi tambahan.

**Belum dieksekusi (keputusan/risiko lebih tinggi, dikembalikan ke dokter)**: bump versi Electron
`^37.2.0`→`^38.8.6` (devDependency) — melompat major version, butuh smoke-test manual (window/DevTools
lock/save-IPC) yg tak bisa diverifikasi headless di sesi ini; keputusan lisensi musik pengganti;
sisa hardening yg berimplikasi UX (mis. anti-cheat lanjutan); model-data Prolanis/KBK (tumpang-tindih
`M10_5_FIDELITAS.md` #7c); rubrik skor sbar/lab-lantai.

**Verifikasi**: 652/652 test + typecheck bersih setelah SELURUH fix mekanis di atas (dua kali checkpoint
selama pengerjaan, lalu sekali final).

## 63. DeepThink adjudikasi 13 keputusan sisa (docs/DEEPTHINK_CODEX31_KEPUTUSAN.md) — dieksekusi sebagian (2026-07-11)

DeepThink menjawab seluruh 13 item + Addendum Q6/Asih dengan tag [Kuat]/[Sedang] (memo lengkap
ditempel dokter ke chat). Claude men-triase tiap rekomendasi terhadap kode SAAT INI sebelum eksekusi
(disiplin baku proyek) — dua konflik nyata ditemukan dan DITAHAN, sisanya dieksekusi langsung.

**DIEKSEKUSI (kode berubah, 652/652 test + typecheck bersih, `npm audit`: 0 kerentanan):**
- **CODEX#14 (O-B, best-effort match)** — `director.ts` blok karma-bridge positif (binaanAkrab): RW
  SELALU ditimpa RW keluarga asli (sudah dari sesi sebelumnya); nama/usia/jenisKelamin kini ditimpa
  dari anggota keluarga sungguhan HANYA bila ada yg usianya cocok rentang demografi kasus yg sudah
  terpilih — kurikulum/epidemiologi tetap penentu pemilihan kasus. Bridge negatif (`karma_igd`, di
  `reducer.ts:1464-1494`) TERNYATA sudah benar sejak awal (identitas dari `content.anggota` via
  `init.ts`) — DeepThink minta cakupan ke jalur negatif juga, tapi verifikasi menunjukkan tak ada yg
  perlu diubah di sana.
- **CODEX#28a (O-B, gating tampilan)** — `karmaTerlihat(kel, hari)` di `petaUtil.ts` kini juga
  mensyaratkan `hari >= HARI_BUKA_KUNJUNGAN`; signature + 4 pemanggil diupdate (`PetaDesa.tsx` ×2,
  `KartuKeluarga.tsx` — prop `hari` baru, `MejaKerja.tsx`). Test `KartuKeluarga.test.tsx` (8 render)
  diupdate menambahkan prop `hari={3}`.
- **CODEX#10 (O-C, label-saja)** — `reducer.ts` notifikasi kapitasi bulanan: "KBK ×N" → "proksi PIS-PK
  ×N", teks isi eksplisit menyebut ini BUKAN formula KBK BPJS riil (AK/RRNS/RPPT). Matematika
  pengali/masukan TAK disentuh.
- **CODEX#19b (O-C, lucuti anti-cheat)** — `clinic.ts` `sbarSkor`: dihapus penalti -20 "wajib data
  numerik" dan -50 "copy-paste antar-kolom" (sudah terbukti #19b: skor ini tak pernah masuk
  `nilaiTotal`/tally/konsekuensi apa pun, murni chip `PanelHasil.tsx`) — dipertahankan hanya
  panjang≥20/kolom + bonus sebut-diagnosis. Test copy-paste (`clinic.test.ts`) diupdate: ekspektasi
  30→80 (refleksi "tak lagi dihukum").
- **CODEX#30a (O-A→ditingkatkan)** — `package.json` `electron`: `^37.2.0`→`^43.1.0`. **PENTING**: draf
  CODEX/DeepThink menyasar `^38.8.6` ("menutup CVE HIGH terdekat, lompatan minimal") — tapi `npm audit`
  yg dijalankan ULANG sesi ini menunjukkan rentang kerentanan sebenarnya `<=39.8.4` (advisory BARU:
  use-after-free offscreen paint/texture callback, crash clipboard.readImage, window.open target
  scoping), bukan `<38.8.6` seperti tercatat di dossier lama. `^38.8.6` TERPASANG dan DIUJI dulu →
  `npm audit` MASIH melapor 1 high-severity → di-upgrade lagi ke `^43.1.0` (rilis stabil terbaru saat
  itu) → `npm audit`: **0 kerentanan**. Smoke-test: `npm run pack` sukses, `.exe` dijalankan via
  PowerShell `Start-Process`, window termuat benar ("PRIMERA: Puskesmas Pagi"), 4 proses (main+
  renderer+GPU+utility) semua `Responding:True` selama 5 detik, shutdown bersih (semua proses exit
  saat main di-`Stop-Process`). Klik-tuntas manual (F12-lock, save/load IPC sungguhan) TETAP disarankan
  ke dokter sebelum benar-benar dipercaya utk Golden Master — smoke-test ini bukan pengganti QA manual
  penuh.

**DITAHAN saat triase awal, KEMUDIAN DISELESAIKAN setelah dokter memberi keputusan klinis/mekanisme
(sama sesi, commit terpisah) — bukan blind-execute DeepThink, tapi juga bukan macet permanen:**
- **CODEX#16 (floor skor terapi 70) — SELESAI.** DeepThink pilih O-B (`enc.resep.length > 0`); Claude
  awalnya menerapkan `rasioTerapi > 0` (menutup blind-spot yg DeepThink SENDIRI tandai). **Keduanya GAGAL
  test yg sudah ada** ("DeepThink #1: observasi + lab hasilBesok RELEVAN tetap dapat proteksi skor 70")
  — kasus SINTETIS generik dgn `resep=[]` yg SENGAJA diverifikasi ronde DeepThink SEBELUMNYA sbg perilaku
  legitimate (tunda OAT sampai BTA). Dokter memutuskan: **hanya TB yg layak floor** (BTA-sebelum-OAT =
  textbook-benar); Tifoid (Widal lambat/tak akurat, praktik umum mulai antibiotik empiris), Dengue
  (suportif, bukan antibiotik-ditunda), DM/GAD (HbA1c/TSH bukan gerbang tunda-terapi) TIDAK layak.
  Diimplementasi via field baru `ItemLab.bolehTundaTerapi?: boolean` (`types.ts`) — hanya `bta_sputum`
  di-set `true` (`katalog.ts`); `clinic.ts` floor kini cek `pack.lab[id]?.bolehTundaTerapi` (bukan
  `hasilBesok` generik). `sidikJariPack` (`verifikasi.ts`) diupdate ikut hash field baru ini —
  **REVISI_ENGINE 20→21**. Test baru: widal (relevan+hasilBesok, TANPA bolehTundaTerapi) tak lagi
  floor ke 70; bta_sputum tetap floor (regresi lama terjaga).
- **Addendum Q6/Asih (formula `berhasil` generik) — SELESAI.** DeepThink jawab SCOPE (Jalur Generik,
  bukan allowlist) tapi tak menspesifikasi MEKANISME. Dokter memutuskan: **syarat `kualitasMi >= 50`**
  ditambahkan ke formula `berhasil` (`kunjungan.ts`, konstanta `AMBANG_KUALITAS_MI_BERHASIL`) — dipilih
  drpd opsi "tag eskalasi per-kartu" krn `kualitasMi` SUDAH dihitung (tak perlu konten kartu baru),
  langsung menutup celah asli CODEX#4 (berhasil murni tebakan struktural, kualitas dialog MI diabaikan).
  `hipotesisBenar && intervensiCocok` TAPI `kualitasMi<50` kini jatuh ke `tingkat:'partial'` (bukan
  penalti penuh 'gagal' — struktur sudah benar, cuma dialognya asal-tebak). Berlaku ke SEMUA 16 keluarga
  (formula bersama, sesuai keputusan generik) — **REVISI_ENGINE bump SAMA** dgn #16 (21, satu batch).
  Test baru: hipotesis+kartu benar + 0/3 dialog tepat → `berhasil=false, tingkat='partial'` (dulu:
  `berhasil=true`).

**DIPUTUSKAN, NOL KODE (adjudikasi DeepThink diterima, dicatat sbg keputusan final — tak perlu
dibahas ulang):** CODEX#6 (diare — biarkan naratif, O-C), CODEX#2c (PRIMER_DEV — terima risiko, O-C),
CODEX#3c (anti-joki — proctoring fisik saja, O-B), CODEX#13b (Prolanis komorbid — utang teknis
terdokumentasi, O-A), CODEX#30b (code signing — tolak sertifikat + instruksi lab, O-B+O-C), CODEX#31b
(rotasi log — abaikan, O-A).

**Verifikasi**: 654/654 test + typecheck bersih setelah SELURUH perubahan di atas (termasuk #16 dan
Addendum Q6, diselesaikan sesi yang sama setelah dokter memutuskan). `npm audit`: 0 kerentanan (naik
dari 1 high-severity sebelum sesi ini). **REVISI_ENGINE 20→21.**

## 64. Audit CODEX read-only baru (HEAD `7a74ed7`) — 18 temuan, 11 DIPERBAIKI + regresi terkunci (2026-07-11)

CODEX audit ronde baru di HEAD `7a74ed7` (setelah §63): 1 P0, 10 P1, 7 P2 — 18 total. Tiap klaim
diverifikasi ulang thd kode aktual (disiplin baku: CODEX pernah meleset detail) sebelum eksekusi;
dokter mendelegasikan verify-then-fix via paste laporan, tanpa instruksi verbal tambahan (pola sesi
yang sudah mapan). Prioritas yang diminta dokter: #1–#5, lalu #7–#11 dan #17–#18.

**DIPERBAIKI (11 item, kode + test regresi, 675/675 test + typecheck bersih):**
- **#1 (P0, quit-loop regresi)** — `main/index.ts`: guard `sedangKeluar` hilang tak sengaja saat
  `telemetriPending` ditambah ke array `tertunda` (commit sebelumnya) — array itu jadi tak-pernah-
  kosong, jadi guard lama `if (tertunda.length===0) return` tak lagi berfungsi. Ditambah flag
  `sedangKeluar` eksplisit + early-return, memulihkan semantik guard.
- **#2 (P1, celah stewardship antibiotik pada floor skor terapi)** — `clinic.ts`: floor skor-terapi
  70 (dari #16 sesi sebelumnya, §63) TIDAK mensyaratkan `!antibiotikTanpaIndikasi` — resep antibiotik
  salah + observasi + lab `bolehTundaTerapi` masih lolos floor. Ditambah syarat. Test baru:
  observasi+eritromisin-salah+bta_sputum → `antibiotikTanpaIndikasi=true`, `skorTerapi` TETAP 0
  (floor tak berlaku).
- **#3 (P1, gerbang konsekuensi tak sinkron dgn gerbang skor)** — `reducer.ts` `observasiMenungguLab`
  masih pakai `hasilBesok` generik, padahal `clinic.ts` sudah diperketat ke `bolehTundaTerapi` (#16,
  §63) — pasien Widal/Tifoid bisa lolos KONSEKUENSI (dijadwalkan balik tanpa karma) meski skornya
  sudah benar dihukum. Disamakan ke `bolehTundaTerapi`. Fixture test `deepthinkKlinik.test.ts`
  (`lab_besok_relevan`) diberi `bolehTundaTerapi: true` eksplisit (mewakili mekanisme generik lama).
- **#4 (P1, identity bridge abaikan gender)** — `director.ts` `anggotaCocok` (karma-bridge positif,
  #14 §63) cuma cocokkan usia — kasus ber-`demografi.jenisKelamin` (mis. bumil, HANYA 'P') bisa
  ditimpa jadi anggota keluarga laki-laki yg usianya kebetulan cocok. Diverifikasi independen via 2
  agen adversarial: **85 pasangan tak cocok** (match presis klaim CODEX). Ditambah syarat gender
  (fallback ke roll lama tetap ada bila tak ada yg cocok gender+usia). Test baru
  (`director.test.ts`): kasus bumil (P, 20-35) + keluarga hanya beranggota laki-laki cocok-usia →
  identitas TAK ditimpa across 200 seed.
- **#5 (P1, 4 celah validasi nested-null save.ts)** — `save.ts` tak memvalidasi (a) `desa.binaan`
  sama sekali (bisa `null`/non-array → THROW di `director.ts`/`reducer.ts`), (b) entri
  `desa.surveilans[]` (entri non-objek/`hari` non-numerik → THROW di `pangkasSurveilans`), (c) entri
  `desa.kader{}` (entri korup → THROW saat sort di `kader.ts`), (d) `keluarga[id].indikator` (field
  hilang/kunci PIS-PK kurang → THROW di `hitungIksKeluarga`). Keempatnya ditambah validasi
  reject-whole-save, pola sama `dex`/`desa.keluarga`/`desa.rw` yg sudah ada. 9 test regresi baru.
- **#7 (P1, validasi struktur dossier tak lengkap)** — `verifikasi.ts` `verifikasiDossier`: cek
  struktur lama cuma pastikan `d.stase`/`d.klaim` sendiri objek — `d.klaim.skor` hilang/`d.klaim.badge`
  bukan array lolos lalu THROW (`d.klaim.skor.total` / spread `[...d.klaim.badge]`) saat menyusun
  pesan alasan atau replay-banding. Ditambah cek `stase.mode`/`stase.hari`/`klaim.skor.total`/
  `klaim.skor.grade`/`klaim.tally`/`Array.isArray(klaim.badge)`. 5 test regresi baru
  (`m6verifikasi.test.ts`). Fixture `m14integritas.test.ts` (2 tes cap-jejak-raksasa) diupdate —
  placeholder `skor:{}` kini `skor:{total:0,grade:'D'}` supaya tetap menguji gerbang jejak, bukan
  tersandung gerbang struktur yg lebih ketat.
- **#8 (P1, race condition pemilihan file dossier)** — `TitleScreen.tsx`: memilih dossier B sebelum
  verifikasi dossier A selesai bisa membuat hasil A yg telat resolve menimpa hasil B di layar (dosen
  melihat vonis berkas salah). Ditambah token counter (`useRef`) + `.catch()` yg tadinya hilang di
  handler ini (satu-satunya dari 3 `<input type="file">` di layar ini tanpa penangan gagal-baca). 1
  test regresi baru (`TitleScreen.dossierRace.test.tsx`, mock `verifikasiDossier` dgn resolve-order
  terbalik).
- **#9 (P1, sidik jari tak hash `hanyaUntuk`)** — `verifikasi.ts` `sidikJariPack`: field
  `anamnesis[].hanyaUntuk` (gerbang tampilan pertanyaan bersyarat) tak ikut di-hash — perubahan
  konten di field ini tak memicu penolakan dossier versi-beda. Ditambah ke objek hash.
- **#11 (P2, Arc Keluarga Yani kehilangan target indikator)** — `desaD.ts`: skenario terakhir arc
  Yani (`yani_k2`) cuma menarget `['asi_eksklusif']`, padahal skenario pertama (`yani_k1`) sudah
  menarget `['asi_eksklusif','pantau_tumbuh_kembang']` — pola di 15 arc lain adalah skenario akhir
  SUPERSET skenario awal. Ditambah `pantau_tumbuh_kembang` balik ke target akhir. **Pagar baru**:
  test `pack.test.ts` generik yg mengecek invarian ini di SELURUH arc keluarga (bukan cuma instance
  Yani) — menangkap seluruh kelas bug ini ke depan.
- **#15 (P2, teks UI Posyandu basi + narasi tanpa syarat skor)** — `Kegiatan.tsx`: (a) label sub
  "Sistem 5 Meja — balita & imunisasi" tersisa dari sebelum migrasi Posyandu ke ILP "5 Langkah" (M11,
  seluruh siklus hidup) — diupdate ke "ILP 5 Langkah — seluruh siklus hidup"; (b) narasi hasil
  Posyandu ("gizi & imunisasi RW ini membaik") tampil TANPA SYARAT skor (bahkan skor 0/semua salah)
  — pola beda dari cabang KLB di bawahnya yg sudah bersyarat. Dibuat bersyarat `hasil.skor > 0`. 3
  test regresi baru (`Kegiatan.hasilPosyandu.test.tsx`).
- **#17 (P2, guard `will-navigate` Electron terlalu longgar)** — `main/index.ts`: guard produksi
  cuma cek `url.startsWith('file://')` — mengizinkan navigasi ke file LOKAL MANA PUN di disk
  (skema cocok, path apa saja) sambil tetap membawa preload bridge save/telemetri yg sama.
  Dipersempit ke exact-match thd satu-satunya berkas renderer yang sah dimuat
  (`pathToFileURL(join(__dirname,'../renderer/index.html')).href`, sama persis dgn yg dipakai
  `win.loadFile`). Tak ada test — repo ini belum punya harness test proses-main (tak ada mock
  `electron` di vitest config); diverifikasi via code review + typecheck.

**BUTUH KEPUTUSAN DOKTER (dikonfirmasi valid, BELUM difix — trade-off desain/gameplay, bukan bug
mekanis):**
- **#6** — info-leak save-scumming mode ujian (pacing/UX trade-off).
- **#10** — celah bypass roster `desa.binaan` (3 arah remediasi berbeda, keputusan desain game).
- **#12** — grade akhir kunjungan mengabaikan disposisi (pola desain lama yg sudah mapan; mungkin
  layak mitigasi UI-saja yg murah, tapi tetap trade-off, bukan bug jelas).
- **#13** — follow-up terjadwal tak benar-benar ditegakkan (trade-off pacing/realisme).
- **#14** — hasil lab tertunda tak terbawa ke encounter berikutnya (penambahan fitur signifikan,
  bukan bug — di luar scope batch mekanis ini).

**DIKONFIRMASI, NOL AKSI (sudah benar / sudah diputuskan sebelumnya / bukan isu kode):**
- **#16** — glare peta mode-malam: SUDAH DIPUTUSKAN sesi sebelumnya, tak ada perubahan lanjutan.
- **#18** — installer basi di folder deploy: catatan proses-build (redeploy manual), bukan isu kode.

**Verifikasi**: 675/675 test (naik dari 654 — 21 test regresi baru: 9 save.ts, 5 verifikasi.ts, 1
race-condition TitleScreen, 1 director.ts gender, 1 clinic.ts antibiotik-floor, 3 Kegiatan.tsx, 1
pack.test.ts invarian arc) + typecheck bersih. `npm audit`: 0 kerentanan (tak berubah dari §63).
**REVISI_ENGINE 21→22** (bundel #2 antibiotik-floor-gap + #3 reducer-sync + #9 hanyaUntuk-hash —
ketiganya memengaruhi replay/skor, dibundel satu bump per disiplin proyek).
