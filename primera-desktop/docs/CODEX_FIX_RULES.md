# CODEX_FIX_RULES.md — aturan main kalau CODEX diizinkan MEMPERBAIKI sendiri (bukan cuma melapor)

## 0. Kapan dokumen ini berlaku

Mode default proyek ini tetap `CODEX_AUDIT_DOSSIER.md` §0: CODEX **read-only**, dilarang
menulis/mengubah/menghapus file apa pun, output-nya SATU laporan markdown yang dikembalikan
sebagai teks. Itu tetap governing untuk audit biasa.

Dokumen ini HANYA berlaku kalau dr. Wirayuda secara eksplisit menyalakan mode "CODEX boleh
langsung bug-hunt DAN fix sendiri di background" untuk suatu sesi/lingkup. Tanpa instruksi
eksplisit itu, kembali ke §0 (read-only, laporan saja) — dokumen ini tidak menggantikannya,
hanya menambah lapisan aturan untuk saat mode auto-fix benar-benar dinyalakan.

## 1. Mengapa dokumen ini perlu ada — bukti dari histori proyek ini sendiri, bukan teori

Tiga pola berikut sudah terjadi NYATA di proyek ini, masing-masing terdokumentasi dengan
`file:baris`/commit yang bisa ditelusuri ulang di `CODEX_AUDIT_DOSSIER.md`:

- **Klaim CODEX bisa benar arah, salah skala.** §59: klaim asli "58 pilihan, 2 file" — audit
  ulang menghitung sungguhan 246 entri `PilihanDialog.teks` di 6 file (`desaA`–`desaF.ts`).
  Arah temuannya benar (banyak entri belum berkutip rapi), skalanya meleset ~4×. Auto-fix yang
  percaya detail klaim mentah-mentah (mis. "cukup sentuh 2 file itu") akan salah lingkup.
- **Sebagian "bug" ternyata keputusan desain sengaja.** §57: dari 30 temuan yang diverifikasi
  lewat workflow 10-agen (baca kode langsung, bukan percaya laporan mentah), 2 di antaranya
  ternyata mekanik SENGAJA yang sudah didokumentasikan — kunci Program Wilayah bulanan (#9,
  M2.10/DeepThink Q4: "tanpa kunci sebulan penuh, program cuma daftar centang tanpa ongkos
  oportunitas nyata") dan kanvas Peta Desa yang sengaja tak ikut mode malam (#21b,
  `PetaDesa.css:206-229`, "kartu pos abadi siang hari"). Auto-fix tanpa jeda manusia berisiko
  membalik keputusan desain yang sebenarnya benar.
- **Bahkan agen ter-instruksi rapi (test-first, isolasi file) masih menghasilkan regresi nyata
  — dan test-nya sendiri ikut lolos-kan kesalahan itu.** §61 (Batch-7): review adversarial
  3-lensa (korektnes ARIA, risiko-regresi, kontras WCAG) menemukan 2 regresi SEBELUM sempat
  ter-commit — (a) `aria-pressed` dipakai keliru untuk kartu single-select murni di
  `Kunjungan.tsx`/`DexSkdi.tsx` (bukan toggle button — klik ulang tak meng-un-press), seharusnya
  `role=radio`+`aria-checked` (pola `useRadioGroup` yang sudah benar dipakai di tempat lain pada
  batch yang sama); (b) token `--kunyit-800` baru dipakai untuk fix kontras tapi TAK diremap di
  blok `[data-mode='malam']` `tokens.css` — membuat mode gelap LEBIH BURUK dari sebelum fix
  (~2.3:1, gagal AA parah). Poin kritis: agen yang salah paham pola aria-pressed itu **juga**
  menulis test yang mengunci pemahaman salahnya sebagai "lolos" — test hijau saja tidak
  membuktikan kebenaran kalau penulis test berbagi blind spot yang sama dengan penulis fix.

Proyek ini juga punya zona yang sekali rusak sulit dipulihkan, tak seperti bug UI biasa:
`sidikJariPack`/`REVISI_ENGINE` (`src/engine/verifikasi.ts:203,223`) menjaga determinisme
dossier mahasiswa ber-HMAC lintas versi engine; **Golden Master tunggal akhir Agustus 2026**
(`docs/M10_5_FIDELITAS.md` §1) akan hard-freeze `reducer.ts`/`clinic.ts`/`scoring.ts` begitu
semester (±September) mulai; dan fakta medis di seluruh proyek ini SELALU diadjudikasi
dr. Wirayuda sendiri, tak pernah diputuskan sepihak oleh agen (lihat disiplin M10.5/M11/PPK
1186 cross-check yang konsisten sepanjang proyek).

## 2. Klasifikasi 3 warna

### 🟢 Boleh auto-fix (dengan gerbang wajib di §3 — tak ada kategori yang "cukup aman utk skip review")
- Perbaikan kontras/token CSS yang WCAG-nya sudah diverifikasi lewat perhitungan (skrip
  luminance/rasio kontras), bukan tebakan mata.
- Perbaikan `aria-*` yang salah pola, SELAMA pola penggantinya sudah punya preseden identik
  yang terverifikasi benar di file lain pada codebase yang sama (mis. `useRadioGroup` untuk
  kartu single-select, `useFocusTrap` untuk modal wajib-selesai).
- Salah ketik/typo pada string non-medis dan non-skor.
- Penambahan test baru murni (tidak menyentuh kode produksi sama sekali).
- Label/nama-kontrol aksesibilitas yang aditif — menambah `aria-label`/`title` tanpa mengubah
  teks visible yang sudah ada.

### 🟡 CODEX hanya USULKAN, manusia yang menerapkan
- Apa pun yang menyentuh shared hooks dipakai lintas banyak file (`useFocusTrap.ts`,
  `useRadioGroup.ts`, dkk) — blast radius besar, satu kekeliruan menjalar ke semua pemakainya.
- Save/load dan proses main Electron (`save.ts`, `main/index.ts` IPC) — tak ada test harness
  otomatis untuk proses main di repo ini (dicatat eksplisit di §57), jadi tak bisa diverifikasi
  test-first penuh seperti sisi renderer/engine.
- Dark-mode/theming — §61 membuktikan ini blind spot yang berulang bahkan dengan instruksi
  eksplisit menyebut "cek kedua mode."
- Teks konten naratif non-medis (dialog persona, nada tulisan) — ranah selera/nada yang
  subjektif, bukan koreksi objektif.
- Apa pun yang laporan audit sendiri sudah beri tag `[D]` opini desain (§0 aturan 3 dossier) —
  otomatis 🟡, karena secara definisi itu bukan bug.

### 🔴 Tidak pernah auto-fix — siapa pun pelapornya, seyakin apa pun klaimnya
- `reducer.ts`, `clinic.ts`, `scoring.ts` — mesin skor, menuju hard-freeze Golden Master
  (`M10_5_FIDELITAS.md` §1).
- `verifikasi.ts` (`sidikJariPack`, `REVISI_ENGINE`) — determinisme ini menjadi dasar
  perbandingan/replay dossier mahasiswa lintas semester.
- Apa pun yang mengklaim atau mengoreksi fakta medis (dosis, ICD-10, kriteria rujukan, dst.) —
  selalu perlu adjudikasi dr. Wirayuda, tanpa kecuali, walau sumbernya sudah PPK/PNPK
  terverifikasi (lihat seluruh alur M10.5/M11/M11.5: riset boleh agentic, keputusan tidak).
- Perubahan yang menaikkan `REVISI_ENGINE` tanpa itu memang menjadi tujuan eksplisit fix-nya.
- File/area yang dossier sudah tandai sebagai keputusan desain sengaja (kunci Program Wilayah
  §57 #9, Peta Desa dark-mode §57 #21b, dan area serupa ke depannya) — kecuali ada instruksi
  eksplisit BARU dari user yang mengubah keputusan itu.

## 3. Gerbang wajib untuk SEMUA auto-fix — termasuk kategori 🟢

1. **Isolasi**: kerjakan di branch/worktree terpisah, jangan langsung ke branch kerja utama.
2. **Test-first bergigi**: tulis/perluas test dulu, buktikan test itu MERAH terhadap kode lama
   (mis. via `git stash` sesaat), baru terapkan fix, baru pastikan HIJAU. "Test hijau" tanpa
   bukti merah-lebih-dulu bukan bukti yang diterima — ini pola yang sudah konsisten dipakai di
   setiap batch fix sepanjang proyek ini.
3. `npm run typecheck` + `npm test` (di `primera-desktop/`) bersih tanpa kegagalan yang
   didiamkan.
4. **Review independen sebelum merge**, idealnya oleh lensa/agen BERBEDA dari yang menulis fix.
   Bukti §61: agen yang salah paham `aria-pressed` juga menulis test yang mengunci kesalahan itu
   sebagai "benar" — penulis fix dan penulis test berbagi blind spot yang sama, jadi mereka tidak
   bisa saling memvalidasi. Minimal 1 reviewer/lensa independen wajib; untuk perubahan yang
   menyentuh banyak file sekaligus, tiru pola §61 (3 lensa: korektnes teknis, risiko-regresi/
   konsistensi, kontras/aksesibilitas).
5. **Diff kecil dan bertema** — satu tema per commit, seperti pola Batch 1–7 di dossier. Ini
   membuat review manusia cepat dan tepat sasaran, bukan satu commit raksasa campur-aduk yang
   sulit ditinjau.
6. Tak ada bypass hook/verifikasi (`--no-verify` dkk.) tanpa izin eksplisit — sama seperti aturan
   umum proyek ini di luar konteks CODEX.
7. **Klaim detail di laporan (jumlah file, jumlah entri, cakupan) wajib diverifikasi ulang
   sebelum auto-fix mulai bekerja**, tidak dipercaya mentah dari ringkasan. §59 adalah bukti
   langsung: arah klaim benar, skalanya meleset ~4×.

## 4. Kalau ragu kategorinya

Default ke 🟡 (usulkan saja), jangan ke 🟢. Biaya jeda-manusia jauh lebih murah daripada biaya
regresi senyap di sistem yang dipakai ~50 mahasiswa FK untuk ujian ber-HMAC.

## 5. Bagaimana menyalakan mode ini

Dokumen ini pasif sampai dr. Wirayuda secara eksplisit menyatakan suatu lingkup boleh auto-fix
(mis. "biarkan CODEX fix sendiri untuk kategori 🟢 malam ini"). Tanpa instruksi eksplisit itu,
mode kerja kembali ke `CODEX_AUDIT_DOSSIER.md` §0 — read-only, satu laporan markdown, tanpa
perubahan file apa pun.
