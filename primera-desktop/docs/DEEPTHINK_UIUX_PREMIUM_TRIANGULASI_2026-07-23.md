# DEEPTHINK TRIANGULASI — Sisa Pekerjaan UI/UX Premium (2026-07-23)

**Penyusun:** Claude (lane UI/UX renderer, paralel terhadap adjudikasi M13-137 CODEX)
**Snapshot:** branch `codex-gpt56-experiment`, commit ter-push `619e9e4`
**Tujuan dokumen:** delapan butir yang TERSISA setelah dua pass UX premium hari ini, ditulis selengkap mungkin agar DeepThink dapat mentriangulasi (kode vs praktik industri vs kebutuhan pedagogis) dan dr. Wirayuda dapat menjawab satu per satu. Tiap butir ditutup pertanyaan keputusan bernomor (Q1-Q11).

---

## 0. Konteks — apa yang SUDAH selesai (jangan dibuka ulang)

Dua pass pada 2026-07-23, semuanya renderer-only, verified (typecheck bersih; vitest **1289/1289** di 138 file; smoke browser lulus), committed & pushed di `619e9e4`:

1. Hotkey `1-5` navigasi tab HUD — gate identik tombol via `alasanTabNonaktif` (`utils/navigasiHud.ts`); mati saat mengetik/modal/encounter; keycap hint + `aria-keyshortcuts`.
2. `TooltipInstan` global berbasis `[data-tip]` (hover + fokus keyboard, tanpa delay); ±60 situs `title` dimigrasi di 19 file. Pola dual untuk kontrol yang bisa `disabled` native: `data-tip` saat aktif, `title` tinggal fallback saat disabled (mouse event tersuppress Chromium).
3. `DialogGame` in-game menggantikan SEMUA `window.confirm/alert` (TitleScreen + MejaKerja); fokus awal ke kontainer (anti Enter-refleks, preseden M14 #14b); Esc = batal. Test kontrak overwrite ditulis ulang; terdaftar sbg titik modal ke-8 di `lapisan.test.ts`.
4. `PintasanModal` daftar shortcut (tombol di Pengaturan + hotkey `?`); titik modal ke-9.
5. Toaster: durasi adaptif panjang teks (3,8-9 dtk), hover = pause, klik = tutup.
6. Ergonomi cari: `/`|Ctrl+F fokus (Buku Saku), Esc dua-tahap + tombol ✕ (DexSkdi + 4 kotak cari klinik); spellcheck/autocomplete mati di semua input ketik.
7. Rasa tekan fisik `:active` tombol/kartu; laci akordeon persist localStorage; indikator slot "menyimpan…/✓ tersimpan"; aria-label stamina/dana.

Pagar yang dihormati: nol file engine/konten disentuh; working tree adjudikasi CODEX 07-09 utuh; `REVISI_ENGINE`/`CONTENT_RELEASE`/`sidikJariPack` tidak berubah (semua perubahan kelas kosmetik murni per Keputusan 4 M13).

---

## D1. Fullscreen & manajemen jendela (MAIN PROCESS — di luar lane renderer)

**Keadaan sekarang.** Game berjalan di jendela Electron ukuran default; tak ada F11 fullscreen, ukuran/posisi jendela tak diingat antar sesi, dan tombol "Keluar" TitleScreen memanggil `window.close()` langsung. Ekspektasi game desktop komersial: F11/Alt+Enter toggle fullscreen, jendela dibuka kembali di ukuran+posisi terakhir, ukuran minimum yang menjamin layout (HUD dirancang empiris pada ≥1200×760 — lihat komentar `Hud.tsx` M10.a).

**Kenapa tertunda.** Menyentuh `src/main/` (main process + IPC) — di luar pembagian "Claude = renderer-only" pada dossier pemulihan. Bukan file beku engine, tapi butuh persetujuan eksplisit lintas-lane.

**Opsi.**
- **A. Paket penuh:** F11 toggle + simpan `bounds` jendela ke file settings main-process + `minWidth/minHeight` eksplisit. ±60-90 baris main + 1 IPC channel. Perlu smoke test packaging.
- **B. Minimal:** hanya `minWidth: 1200, minHeight: 760` pada `BrowserWindow` (1 baris, mencegah layout pecah) — fullscreen/restore ditunda.
- **C. Tidak sama sekali** (kelas memakai laptop seragam; risiko kecil).

**Rekomendasi Claude:** B sekarang (murah, mencegah bug layout nyata saat mahasiswa me-resize kecil), A sebelum kelas September bila playtest M13-1b menemukan kebiasaan fullscreen.

**Q1.** Boleh Claude menyentuh `src/main/` untuk opsi B (min-size) sekarang? **Q2.** Apakah paket penuh A (F11 + ingat bounds) dijadwalkan pra-kelas atau ditunda pasca-playtest?

---

## D2. Kebijakan SFX interaksi (audit audio belum dilakukan mendalam)

**Keadaan sekarang.** `audio/synth.ts` + `useAudio.ts` ada (SFX sintetis, volume musik/SFX terpisah di Pengaturan; lisensi BGM dicek `check:bgm-license`). Yang BELUM diaudit: kosakata bunyi per interaksi — apakah klik tombol utama, stempel diagnosis, firewall alergi, toast bahaya, transisi layar, punya feedback audio yang konsisten dan bermakna (premium game: audio = kanal feedback kedua, bukan hiasan). Risiko dua arah: (a) bunyi kurang → dunia terasa mati; (b) bunyi berlebih pada app pendidikan → melelahkan di lab komputer 50 mahasiswa (banyak tanpa headphone).

**Bahan triangulasi untuk DeepThink:** baca `synth.ts`/`useAudio.ts`/`bgm.ts`, petakan event→bunyi yang ada vs momen bermakna tanpa bunyi (stempel jatuh, grade muncul, Kode Hitam sudah ada getar visual — audionya?), lalu usulkan kosakata minimal (mis. 5-7 bunyi semantik: konfirmasi, batal, bahaya, sukses-besar, notifikasi) dengan argumen kapan TIDAK berbunyi.

**Q3.** Apakah arah produk menginginkan lapisan SFX interaksi yang lebih kaya, atau sengaja minimalis (fokus kelas)? **Q4.** Bila ya, apakah default volume SFX di kelas sebaiknya rendah/mati dengan opt-in?

---

## D3. Riwayat notifikasi (toast maksimal 4, sisanya hilang)

**Keadaan sekarang.** `Toaster.tsx` menahan maksimal 4 toast (`slice(-4)`); saat banjir event (Kode Hitam + karma + surat masuk serentak) toast tertua terpotong tanpa jejak. Mitigasi parsial yang SUDAH ada: durasi adaptif + hover-pause (pass hari ini), dan surat penting masuk Kotak Masuk MejaKerja (permanen). Tapi event non-surat (DEX_BERTAMBAH, KEGIATAN_SELESAI, KARMA_DICEGAH) tak punya arsip.

**Opsi.**
- **A. Panel "Riwayat Hari Ini"** kecil di HUD (ikon lonceng, drawer berisi ±20 event terakhir sesi berjalan; murni display, state lokal renderer, tidak masuk save).
- **B. Perbesar cap** ke 6 + antre (toast ke-7 menunggu slot) — murah, tak menjawab arsip.
- **C. Status quo** — debrief malam MejaKerja sudah merangkum hari.

**Rekomendasi Claude:** A bernilai tapi BUKAN blocker kelas; C dapat dipertahankan sampai playtest membuktikan pemain kehilangan informasi. Jangan bangun fitur atas hipotesis.

**Q5.** Tunggu bukti playtest (C) atau bangun panel riwayat (A) sekarang?

---

## D4. Audit baris-per-baris MejaKerja.tsx (±1.250 baris) & Kunjungan.tsx (646)

**Keadaan sekarang.** Dua file terbesar renderer baru diaudit lewat sapuan pola (grep title/confirm/input/timer) + pembacaan blok yang saya edit — belum dibedah penuh baris-per-baris seperti Klinik decks. Area yang layak dicek mendalam: alur baca surat (fokus/scroll saat surat panjang), stepper SAJI Kunjungan (state antar-babak), hotspot discovery pacing, kondisi race pada dispatch beruntun, dan konsistensi disabled-reason.

**Rekomendasi Claude:** jadwalkan sebagai pass tersendiri (perkiraan 1 sesi penuh per file, hasil = temuan + patch kecil, bukan refactor). Prioritas SETELAH keputusan D1-D3 karena temuan playtest M13-1b bisa mengubah prioritas bagian yang diaudit.

**Q6.** Setuju dijadwalkan sebagai pass tersendiri, dan mana duluan — MejaKerja (hub 80% waktu) atau Kunjungan (pilar UKM)?

---

## D5. Sisa `title` native yang DISENGAJA (fallback keadaan disabled)

**Keadaan sekarang.** Migrasi tooltip menyisakan `title` HANYA pada kontrol yang bisa `disabled` native, karena elemen disabled tak menerima mouse event di Chromium — `title` browser-level satu-satunya tooltip yang tetap bekerja di sana. Situs tersisa (pola `title={nonaktif ? alasan : undefined}` + `data-tip` untuk keadaan aktif): tombol submit TitleScreen, slot rilis-lama, tab Terapi saat tutorial, "+ Resep" (diresepkan/habis), chip edukasi (baki penuh), "Pesan" lab/obat (dipesan/kas), disposisi (tanpa diagnosis), Prolanis/Posyandu/KLB (gate), kartu siluet Dex, pertanyaan anamnesis "sudah ditanya", vital terukur, program wilayah terkunci.

**Alternatif teknis bila ingin 100% tooltip instan:** bungkus tiap kontrol disabled dgn `<span data-tip=...>` wrapper (hover jatuh ke wrapper) ATAU ganti `disabled` → `aria-disabled` + guard onClick (pola HUD/KartuKeluarga). Keduanya menyentuh banyak titik & mengubah kontrak test `toBeDisabled()`; nilai tambahnya kecil karena hampir semua situs disabled SUDAH menampilkan alasan sebagai caption terlihat (pola sapuan 2026-07-16).

**Rekomendasi Claude:** terima status quo sebagai keputusan sadar; tulis di guideline authoring UI.

**Q7.** Setuju status quo dipermanenkan (dan dicatat sbg konvensi), atau ingin uniformitas penuh via refactor `aria-disabled`?

---

## D6. Peta konfirmasi aksi — mana yang PANTAS mendapat DialogGame berikutnya

**Keadaan sekarang.** DialogGame kini melindungi: timpa autosave (mulai stase/muat slot/impor), autosave korup, timpa slot manual. Aksi ireversibel lain yang MASIH satu-klik: **"Keluar"** TitleScreen (`window.close()` — aman krn autosave, tapi standar game menanyakan), **"Tutup Poli — Lanjut ke Siang"** (pasien tersisa di-auto-resolve; ada caption peringatan tapi tanpa jeda), **"Delegasi ke kader"** Kegiatan (20% keputusan bisa keliru — tooltip menjelaskan, klik langsung jalan), **"LANJUTKAN"/tidur** (menutup hari). Risiko over-konfirmasi nyata: aksi berfrekuensi tinggi (LANJUTKAN dipakai 3×/hari × 90 hari) TIDAK boleh dipagari dialog — melelahkan dan mendidik pemain menekan Enter membabi-buta (habituasi merusak konfirmasi yang sungguh penting).

**Rekomendasi Claude:** tambahkan dialog HANYA untuk "Keluar" (frekuensi rendah, konvensi desktop). Tutup Poli & Delegasi cukup caption yang sudah ada; LANJUTKAN jangan pernah.

**Q8.** Setuju hanya "Keluar" yang diberi konfirmasi? Adakah aksi lain yang menurut pengalaman klinis/pedagogismu butuh jeda sadar?

---

## D7. Integrasi ke protokol playtest M13-1b (gerbang manusia)

**Keadaan sekarang.** Fitur pass premium (hotkey, tooltip, dialog, pintasan) belum pernah disentuh manusia selain saya. M13-1b (≥3 mahasiswa/proxy, dangerous-path, zero-material-defect) adalah tempat validasi alaminya. Butir observasi UX yang saya usulkan MASUK ke protokol playtest: (a) apakah peserta menemukan hotkey 1-5 tanpa diberi tahu (keycap hint cukup?); (b) apakah tooltip instan terbaca atau justru mengganggu; (c) apakah dialog konfirmasi dibaca atau langsung di-Enter (fokus-ke-kontainer harusnya memaksa jeda — ukur); (d) apakah `?` pernah ditemukan organik; (e) waktu-ke-obat-pertama di formularium (laci + cari + ✕) sebagai metrik ergonomi ketik.

**Q9.** Setuju kelima butir observasi ini dimasukkan ke lembar protokol M13-1b? Ada tambahan dari sisi klinis?

---

## D8. Build/instalasi (deploy) — status & keputusan checkpoint

**Keadaan sekarang, per definisi 7-keadaan:** pass premium = implemented ✔ wired ✔ verified ✔ committed ✔ **pushed ✔ (`619e9e4`)** — tetapi **built ✘ installed ✘**. Installer terpasang (`1.1.0-beta.1`, build 2026-07-23 04:29) memuat s/d `e18eaf9`: TANPA pass premium dan TANPA adjudikasi 07-09.

**Kenapa build saya tahan:** `npm run dist` memaketkan working tree, yang saat ini berisi perubahan adjudikasi 07-09 CODEX yang BELUM di-commit. Dossier pemulihan §17: jangan build di tengah perubahan CODEX tanpa memastikan isi paket memang dimaksudkan; checkpoint batch 07-09 adalah wewenang CODEX (regenerate artefak → commit → push). Build paling bersih: SETELAH checkpoint itu, sehingga installer memuat premium pass + 07-09 sekaligus dengan provenance commit yang jelas.

**Q10.** Tunggu checkpoint CODEX lalu build gabungan (rekomendasi), atau perlu build interim sekarang (isinya tetap menyertakan 07-09 dari working tree — konten physician-approved, hanya belum ber-commit)? **Q11.** Setelah build, apakah instalasi lokal langsung diganti (menimpa `PRIMERA test-beta` terpasang)?

---

## Lampiran — bukti verifikasi pass hari ini

| Verifikasi | Hasil |
|---|---|
| `tsc --noEmit` | bersih |
| `vitest run` penuh | 1289/1289, 138 file (baseline pagi: 1272/136) |
| Freeze/engine | tak tersentuh (tak ada file beku dalam diff) |
| Smoke browser (vite preview 5199) | hotkey 1-5 ✔ · guard modal & ketikan ✔ · tooltip instan hover+fokus ✔ · DialogGame timpa-arsip (batal/Esc/setuju) ✔ · `?` pintasan + focus trap ✔ · pencarian `/`+Esc+✕ ✔ |
| Isolasi lane | 49 file staged semuanya `src/renderer/`; file CODEX & `docs/M13_137_*` tak tersentuh |

Dokumen ini murni catatan keputusan UI/UX; tidak mengubah konten klinis mana pun.
