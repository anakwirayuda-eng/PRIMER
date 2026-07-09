# M10 — Audit Brief untuk CODEX, RONDE-2: refresh pasca-§36–§39 + dimensi UI/UX

**Status:** brief kerja ronde-2, memperbarui `M10_AUDIT_BRIEF.md` (ronde-1, 2026-07-05). **Ditulis:** 2026-07-06. **Untuk:** ronde audit CODEX read-only berikutnya, laporkan kembali ke Claude untuk ditriase.

**Baca DUA dokumen ini, dengan urutan prioritas:**
1. **Dokumen INI** — apa yang berubah sejak ronde-1, fokus baru, dan DO-NOT-RE-REPORT terkini (§4 di sini menggantikan/menambah §6 ronde-1).
2. **`M10_AUDIT_BRIEF.md` (ronde-1)** — orientasi proyek (§2 struktur folder & istilah domain MASIH VALID), dan detail sumbu A/B/C yang belum berubah. JANGAN abaikan; dokumen ini hanya delta di atasnya.
3. **`CODEX_AUDIT_DOSSIER.md` §36–§39** — apa yang sudah dikerjakan sejak ronde-1 (wajib dibaca agar tak mengulang).

---

## 1. Apa yang berubah sejak ronde-1 (§36–§39)

Ronde-1 sudah dijalankan (hasil di dossier §36). Sejak itu, EMPAT hal berubah yang mengubah lanskap audit M10:

1. **§36 — ronde CODEX pertama atas brief ronde-1 SUDAH selesai.** Temuannya: (a) karma demografi mismatch dikonfirmasi 3 instance (2 di antaranya butuh konten baru, DIBIARKAN terbuka sbg keputusan konten; 1 diperbaiki: `mm_hipertensi_urgensi` usiaMax 70→80); (b) `sidikJariPack` kini hash isi topik edukasi; (c) test flaky DexSkdi timeout dilonggarkan. **Semua temuan ronde-1 sudah ditutup/diputuskan** — jangan ulangi (detail di §4 di sini).

2. **§37 — mekanik `edukasiKritis` LANDED.** Celah "edukasi >3 topik wajib bisa full-score walau lewatkan topik paling kritis" (dulu 32/67 kasus) kini punya solusi: `Tatalaksana.edukasiKritis?: string[]` — subset topik wajib yang non-negotiable; lewatkan satu → `skorEdukasi` di-cap 50 (`clinic.ts`, pola sama `vitalDiukur`). **5 kasus sudah ditandai** (dengue_df→tanda_bahaya, diare_akut_anak→cairan_oralit, tb_paru→minum_oat_tuntas, hipertensi_esensial→kepatuhan_obat, dm_tipe2→kepatuhan_obat). REVISI_ENGINE 12→13. **27 kasus lain dgn wajib>3 BELUM ditandai** — ini justru target audit sumbu A (lihat §3 di sini).

3. **§38 — dimensi ke-4 M10 lahir: konsistensi layering UI/UX.** Bug live: toast `Toaster` (z-index 400 > modal 300, tanpa pointer-events:none) menimpa & mencegat klik tombol modal/scene. User minta KELAS bug ini (elemen melayang/fixed saling tumpang-tindih & memblokir interaksi) jadi dimensi M10 formal.

4. **§39 — M10.a (sapuan dimensi-4) SUDAH dikerjakan Claude.** Inventaris 18 titik `position:fixed/absolute`+z-index, verifikasi empiris di window minimum 1200×760. 2 fix: (a) kartu `.kunjungan-temuan` menelan klik hotspot ber-x tinggi → `z-index:1` pada `.kunjungan-hotspot`; (b) tombol melayang mute+gigi menimpa kartu Dex → didok ke HUD. Pagar baru `styles/lapisan.test.ts`. **Titik yang sudah diperiksa jangan diulang** — TAPI lihat §3-dimensi-4 di sini untuk apa yang MASIH terbuka (yang butuh mata read-only CODEX, bukan hit-testing).

---

## 2. Statistik konten terkini (dihitung ulang 2026-07-06, bukan warisan ronde-1)

| Item | Nilai |
|---|---|
| Kasus klinis playable | **67** (stabil) |
| Kasus dgn `tatalaksana.edukasi.length > 3` | **32** — dari itu **5 sudah py `edukasiKritis`**, **27 belum** |
| Keluarga binaan | 16 · di 6 desa (A–F) |
| Keluarga dgn `karma` (jembatan UKM→UKP) | **9 total** — desaA:1, desaC:1, desaD:2, desaE:4, desaF:1; **desaB: 0** |
| `REVISI_ENGINE` | **13** (naik dari 12 di §37; jangan bingung bila laporan lama sebut 11/12) |
| Total test | **411** (38 file) — bila laporan sebut 395/407, itu snapshot lama |
| Kasus `harusDirujuk:true` | 12 · `konsekuensi`: 57 · `alergiTrap`: 6 · `prosedur`: 4 |

---

## 3. Fokus ronde-2 per dimensi

Claude mengerjakan M10 secara mono/solo, CODEX membantu dari belakang sbg **perspektif kedua read-only**. Urutan kerja Claude: **M10.a (dimensi-4 UI/UX) SUDAH; M10.b (dimensi 2+3 bridge/NPC) BERIKUTNYA; M10.c (dimensi-1 pipeline) TERAKHIR.** CODEX paling berdampak bila menyorot dimensi-1 & 2+3 (Claude belum menyentuhnya), dan dimensi-4 pada sudut yang hanya bisa dilihat di level SUMBER (bukan hit-testing runtime).

### Dimensi 1 — Pipeline penyakit (sumbu A ronde-1 MASIH BERLAKU penuh), + tambahan pasca-edukasiKritis

Semua butir A.1–A.2 ronde-1 (§3 di sana) masih target. **Tambahan spesifik ronde-2:**

- **27 kasus `edukasi.length>3` yang BELUM py `edukasiKritis`** — untuk tiap satu, baca `clue` + `konsekuensi.narasi`, identifikasi apakah ADA satu topik wajib yang secara klinis "tidak boleh dilewatkan" (mis. tanda bahaya, kepatuhan obat kronis, restriksi cairan) yang layak jadi `edukasiKritis`. Laporkan PER-KASUS dengan justifikasi tekstual (kutip clue/konsekuensi yang mendukung) — BUKAN daftar telanjang. Ini melanjutkan pola 5 kasus yang sudah ditandai (§37); Claude sengaja konservatif (hanya yang justifikasinya kuat & tekstual) — CODEX bantu temukan sisanya yang terlewat.
- **`edukasi` vs `clue` mismatch (sumbu, bukan cuma jumlah)** — DUA instance sudah ditemukan manual & diperbaiki (`kia_kb_konseling`, `mm_gagal_jantung_kongestif`), TAPI belum ada sapuan sistematis 67-kasus. Cross-check tiap topik `edukasi` (nama+sinonim dari katalog) vs isi `clue`: adakah topik yang IRELEVAN atau KONTRADIKTIF dgn niat klinis kasusnya? (Contoh kelas: topik "banyak minum" pada kasus yang butuh restriksi cairan.)

### Dimensi 2+3 — Bridge UKP↔UKM + status NPC/warga (Claude BELUM menyentuh — perspektif CODEX paling bernilai di sini)

Semua butir §4–§5 ronde-1 berlaku. **Yang sudah berubah / perlu di-rescope:**

- **Karma demografi** — §36 sudah menemukan 3 mismatch (2 terbuka, 1 fixed) DAN menambah test invarian menyeluruh di `pack.test.ts` (cek SEMUA 9 keluarga ber-karma vs demografi kasus target, dgn allowlist `DIKETAHUI_BELUM_DIPERBAIKI` utk 2 yang butuh konten). **JANGAN ulangi 3 yang sudah ditemukan.** Yang MASIH terbuka utk CODEX: apakah test invarian itu benar-benar menangkap SEMUA dimensi mismatch (usia DAN jenis kelamin DAN anggotaIndex-out-of-bounds), atau hanya sebagian? Apakah ada keluarga ber-karma di `arc.kunjungan[i]` untuk `i>0` (bukan cuma kunjungan pertama) yang luput dari `jadwalKarma`?
- **`AnggotaKeluarga.kondisi?: string[]`** — ronde-1 menanyakan apakah field ini dipakai runtime atau cuma metadata. BELUM terjawab. Konfirmasi (grep menyeluruh): apakah ada satu titik pun di `src/engine/` yang membaca `.kondisi`? Kalau tidak → dokumentasikan sbg metadata mati (kandidat: apakah SEHARUSNYA menyetir sesuatu, mis. karma demografi konsistensi?).
- **Kader ketelitian/bias → IKS** — apakah data yang masuk ke IKS RW benar-benar merefleksikan `ketelitian`/`bias` kader RW itu? Adakah RW yang datanya "terlalu akurat" utk kader ber-ketelitian rendah?
- **PRB & rmLengkap** — butir §4.1 ronde-1 belum diaudit sama sekali.

### Dimensi 4 — Layering UI/UX (M10.a sudah sapu yang empiris; sisa yang butuh mata SUMBER)

M10.a memakai hit-testing runtime (`elementsFromPoint` di game berjalan) — kuat untuk menemukan tumpang-tindih AKTUAL pada ukuran window tertentu, LEMAH untuk: kombinasi state yang tak sempat dimainkan, dan invarian struktural yang tak bergantung ukuran. **CODEX (baca sumber, tak menjalankan game) justru unggul di sini:**

- **Setiap `position:fixed`/`absolute` tanpa `pointer-events:none` yang menimpa area interaktif** — M10.a cek 18 titik pada layar yang SEMPAT dimainkan (meja/klinik/peta/dex/rapor/kunjungan). Layar **Kegiatan (posyandu/prolanis/KLB)**, **IGD**, **LaporanAkhir**, **MejaKerja modal surat**, dan semua **overlay modal** (Onboarding/Pengaturan/TentangModal/PanelHasil) belum di-hit-test khusus. Baca CSS-nya: adakah elemen absolute/fixed yang bisa menutupi tombol pada kombinasi konten tertentu?
- **Urutan render dua overlay `z-modal` sama** — bila dua modal `z-index:var(--z-modal)` bisa terbuka bersamaan, urutan DOM (App.tsx render order) yang menentukan siapa di atas. Adakah kombinasi (mis. PanelHasil + Pengaturan, atau Onboarding + toast) yang urutannya salah?
- **Token `--z-drawer` (200) yatim** — didefinisikan di tokens.css, TAK dipakai siapa pun (dikonfirmasi §39). Bukan bug, tapi bila CODEX menemukan tempat yang SEHARUSNYA memakainya (drawer/panel geser yang malah pakai angka literal), laporkan.
- **Elemen ber-`z-index` angka LITERAL** (bukan token) — `.klinik-sorot-tutorial{z-index:1}`, `.kunjungan-hotspot{z-index:1}` (baru), `TitleScreen z-index:1`, `DexSkdi z-index:1`. Angka literal rawan tabrakan tak sengaja dgn skala token. Adakah dua literal `z-index` di konteks stacking yang sama yang saling bertentangan?

---

## 4. DO-NOT-RE-REPORT — tambahan ronde-2 (baca §6 ronde-1 DULU, ini melengkapinya)

Semua item DO-NOT-RE-REPORT ronde-1 (§6 di sana) MASIH berlaku. **Tambahan yang settled sejak ronde-1:**

- **Karma demografi 3 mismatch** (`keluarga_yani`→Nayla/diare_akut_anak, `keluarga_gunawan`→Dimas/asma_ringan, `keluarga_lastri`→Mbah Lastri/mm_hipertensi_urgensi) — SUDAH ditemukan §36. Dua pertama = keputusan konten terbuka (butuh kasus pediatrik baru); ketiga sudah fixed (usiaMax 80). Jangan re-flag KETIGANYA; hanya lapor mismatch BARU di luar 3 ini.
- **`edukasiKritis` di 5 kasus** — sudah ditandai §37. Jangan usulkan ulang kelima itu; fokus ke 27 yang belum.
- **Celah edukasi >3 topik itu sendiri** — sudah SOLVED secara mekanik (§37); yang tersisa murni pekerjaan KONTEN (menandai kasus mana), bukan bug mekanik. Jangan laporkan "formula edukasiTarget mengizinkan skip topik kritis" sbg temuan — itu sekarang by-design dengan opt-out `edukasiKritis`.
- **`sidikJariPack` tak hash isi edukasi/tindakan** — sudah fixed (§36 edukasi, §33 tindakan). `edukasiKritis` otomatis ter-hash via `tx:k.tatalaksana` wholesale (§37, ada test). Jangan re-flag.
- **Toaster z-index/pointer-events (dimensi-4)** — fixed §38. `--z-toast` kini 250 (<modal). Jangan re-flag.
- **Kartu temuan menelan hotspot; mute/gigi menimpa Dex** — fixed §39. `.kunjungan-hotspot` kini z-index:1; mute/gigi didok di HUD (`<MuteButton dok/>`/`<Pengaturan dok/>` di Hud.tsx, TitleScreen tetap melayang). Jangan re-flag KEDUANYA; hanya lapor titik layering LAIN.
- **REVISI_ENGINE / test count** — bila laporan menyebut REVISI 11/12 atau test 395/407, itu snapshot LAMA (kini 13 / 411). Verifikasi ulang thd kode terkini sebelum melapor apa pun yang bergantung angka ini.

---

## 5. Yang CODEX TAK BISA verifikasi sendiri (serahkan ke Claude, jangan tebak)

CODEX read-only & tak menjalankan game. Untuk hal berikut, **laporkan sbg PERTANYAAN/HIPOTESIS ber-file:baris, bukan sbg temuan pasti** — Claude akan verifikasi empiris via harness browser (`puskesmas-pagi-preview`, driving store Zustand asli):

- Tumpang-tindih VISUAL aktual (butuh render+hit-test pada ukuran window nyata).
- Apakah suatu override state (mis. demografi karma) benar-benar SAMPAI ke UI saat encounter berjalan (butuh replay runtime).
- Distribusi RNG director (butuh simulasi multi-hari).

Untuk semua yang bisa dibaca murni dari sumber (konsistensi field, mismatch clue-vs-konten, dead metadata, kontradiksi 2-field internal), laporkan normal sbg temuan ber-severity.

---

## 6. Format laporan — sama persis ronde-1 §7

File:baris + kutipan + klaim 1-kalimat + bukti/skenario konkret + severity (P1 integritas skor/data, P2 konten/UX salah tak-eksploitatif, P3 kosmetik/dok) + cek-dulu thd DO-NOT-RE-REPORT (ronde-1 §6 + ronde-2 §4 di sini). Read-only — jangan edit apa pun. Laporkan ke Claude untuk triase (verifikasi thd kode aktual → test-first fix → verifikasi-bergigi → dossier update), pola sama seluruh sesi.
