# DEEPTHINK TRIANGULASI — Keputusan Terbuka Pasca-Audit P1 (2026-08-03)

**Penyusun:** Claude (lane pengembang), setelah memverifikasi ulang audit read-only CODEX dengan 12 agen adversarial terhadap kode & jaringan sungguhan.
**Snapshot:** branch `codex-gpt56-experiment`, commit ter-push `7983843`, rilis `test-beta-7983843` (v1.1.0-beta.14). `REVISI_ENGINE = 63`, vitest **1493/1493** di 161 berkas, typecheck bersih.
**Peran kamu:** DeepThink = reviewer **arah keputusan**, bukan auditor kode. CODEX sudah memeriksa *apakah kodenya benar* (hasilnya di §0b). Yang diminta di sini: *apakah arah, urutan, dan biaya keputusannya benar* — khususnya karena empat butir di bawah menyentuh **integritas asesmen** dan **otoritas sumber klinis**, dua hal yang tidak boleh diputuskan pengembang sendirian.
**Yang menjawab akhirnya:** dr. Wirayuda. Kamu memberi triangulasi (kode vs praktik pendidikan kedokteran vs literatur), bukan vonis.

---

## 0. Konteks — baca ini dulu

### 0a. Apa yang dinilai, dan kenapa taruhannya tinggi

PRIMERA ("Puskesmas Pagi") = game desktop Electron (TypeScript+React). Pemain berperan dokter fresh-graduate di satu Puskesmas desa fiktif selama **stase 90 hari** (mode Karier) atau **30 hari** (mode Ujian, seed deterministik). Target: ±50 mahasiswa FK Indonesia, **dinilai dari skor game mereka**, redeploy ±September 2026. Pengembang: satu dokter (dr. Wirayuda, sekaligus penulis konten klinis) dibantu agen AI.

Karena skornya dipakai menilai, dua hal jadi kepentingan produk inti, bukan kemewahan:
- **Integritas pedagogis** — game harus mengajarkan yang benar, dan tidak boleh mengklaim sesuatu terjadi padahal belum.
- **Integritas asesmen** — skor tidak boleh bisa dipalsukan, dan dosen harus bisa memverifikasi dossier hasil mahasiswa.

Istilah yang dipakai di bawah:
- **UKP** = layanan perorangan (poli). **UKM** = layanan masyarakat (desa, Posyandu, Prolanis, surveilans).
- **FKTP** = fasilitas kesehatan tingkat pertama (Puskesmas). **PPK** = Panduan Praktik Klinis.
- **careEpisode** = "rangkaian perawatan" satu masalah pada satu orang, lintas waktu dan lintas layanan — jembatan UKP↔UKM. Punya status (`terdeteksi` → … → `terverifikasi`/`berakhir`), tenggat (`dueDay`), dan bila dirujuk punya `referral.stage` (`sent` → `feedback` → `acted`).
- **`sidikJariPack`** = hash konten yang dipakai dosen memverifikasi dossier mahasiswa. Bila hash berubah, dossier dari versi lama berstatus "tidak dapat diverifikasi".
- **Daftar beku (`freeze.test.ts`)** = 18 berkas engine yang di-hash-lock; menyentuhnya wajib menaikkan `REVISI_ENGINE` + menyegarkan hash.
- **137 prototipe lab** = kasus yang sudah ditulis tapi belum diadjudikasi dokter. **Baru 16 yang `physician_approved`**; 121 sisanya formatif dan seluruh dampak formalnya dibatalkan di engine. "Playable" ≠ "teradjudikasi klinis".

### 0b. Yang SUDAH selesai hari ini — jangan dibuka ulang

Audit CODEX mengangkat empat temuan P1. Semuanya nyata; dua perlu dikoreksi arah/besarannya. Yang mekanis sudah diperbaiki dan dirilis di beta.14:

1. **Provenance rilis & kebenaran versi (P1-4) — TUNTAS.** Tag rilis beta.12/beta.13 menunjuk commit yang keliru (`gh release create` dengan tag baru menempelkan tag di branch default, bukan di commit yang namanya tertulis). Versi beta.13 juga belum di-commit saat build, dan lockfile tertinggal di beta.9. Semua dikoreksi. Penjaga baru: `scripts/prarilis-provenance.js` menolak build dari pohon kerja kotor / versi tak seragam / tag versi yang sudah menunjuk commit lain; `src/versiKonsisten.test.ts`; `docs/PROSEDUR_RILIS.md`. Layar Tentang & Kredit kini menampilkan versi build asli (dulu dipaku `v1.0.0` untuk semua build, sehingga instruksi PANDUAN_DOSEN agar satu kelas menyamakan versi tidak bisa dijalankan).
2. **Kejujuran debrief rujukan (P1-1) — bagian mekanisnya TUNTAS.** Lihat D1 untuk sisa pertanyaan pedagogisnya.
3. **Gerbang struktural URL sumber (P1-3 bagian mekanis) — TERPASANG.** Lihat D3.

Pagar yang dihormati sepanjang hari: nol berkas engine beku disentuh, `REVISI_ENGINE` tetap 63, `sidikJariPack` **tidak berubah** — sehingga dossier dari beta.13 tetap terverifikasi di beta.14.

---

## D1. Kapan sebuah rangkaian perawatan pantas disebut "tuntas"?

**Yang sudah diperbaiki (mekanis, tak perlu ditinjau ulang).** Dulu debrief sore menyalakan bendera "rujukan tuntas" begitu `referral.stage` menjadi `feedback` — yaitu saat **kabar tiba**, bukan saat pekerjaannya selesai. Dua akibat nyata:

- Rujukan yang **DITOLAK RS** memakai tahap yang sama (`reducer.ts:888` "Kompetensi FKTP", `:934` "Tujuan tidak sesuai"). Jadi satu rujukan berlebih — justru kesalahan yang ingin diajarkan game ini — langsung membuat debrief berkata *"Rangkaian ditutup karena ada bukti tindakan"*, padahal RS memulangkan pasien dan dokter harus menggarapnya sendiri besok.
- Surat penolakan dibuat tanpa `episodeId` (`reducer.ts:869`) sedangkan aksi adopsi umpan balik mensyaratkannya, sehingga episode itu **tak pernah bisa** mencapai `acted`. Benderanya terkunci menyala sampai stase habis. Terukur: ±16% malam dalam satu stase memunculkan kabar rujukan, dan sekali terkunci, sebagiannya palsu.

Sudah dipisah tiga keadaan (menunggu / umpan balik tiba / tuntas), renderer-only. Dua kalimat yang hanya mengklaim *informasi kembali* tetap muncul sejak kabar tiba — itu memang benar, termasuk untuk penolakan. Dua kalimat yang mengklaim *tindakan selesai* kini menunggu adopsi.

**Yang TERSISA dan bukan wilayah pengembang.** Aksi `ADOPSI_UMPAN_BALIK` menandai episode `status: 'terverifikasi'` dan menghapus tenggatnya, setelah pemain membaca surat RS lalu mencentang rekonsiliasi obat + rencana kontrol (+ pemantauan keluarga bila pasien anggota keluarga binaan). Gerbangnya nyata dan ditegakkan engine, bukan sekadar UI.

Masalahnya epistemik: **`terverifikasi` di sini dicapai dengan mengadopsi RENCANA**, sedangkan setiap tempat lain di engine memakai kata yang sama untuk **perubahan yang teramati** — mis. hipertensi benar-benar terkontrol pada kunjungan berikutnya, atau janji keluarga diverifikasi saat kunjungan ulang. UI lalu melabelinya "Tindak lanjut tuntas".

**Opsi.**
- **A. Biarkan.** Menutup loop informasi + menyusun rencana FKTP memang pencapaian yang layak dirayakan; menuntut kunjungan kontrol nyata bisa membuat loop terasa tak pernah selesai dalam 30 hari mode Ujian.
- **B. Ganti kata, jangan ganti mekanik.** Tetap satu aksi, tapi status/label dibedakan (mis. `rencana_disusun` → "Rencana lanjut tersusun") dan `terverifikasi` disimpan untuk bukti teramati. Murah bila hanya label renderer; jadi mahal bila menambah nilai status baru di engine beku.
- **C. Tuntut bukti kontrol.** Episode baru `terverifikasi` setelah pasien benar-benar datang kontrol / ada hasil teramati. Paling jujur secara klinis, tapi menyentuh `reducer.ts` (beku), menaikkan `REVISI_ENGINE` 63→64, dan mengubah apa yang diajarkan game tentang penutupan loop.

**Rekomendasi Claude:** B, dan hanya bila bisa dikerjakan di lapisan label. Alasan: keluhan sebenarnya adalah *kata*, bukan *mekanik* — mekaniknya (baca surat, rekonsiliasi obat, rencana kontrol) sudah mengajarkan hal yang benar. Tapi ini penilaian klinis, bukan penilaian saya.

**Q1.** Apakah "menyusun rencana lanjut setelah membaca umpan balik RS" pantas disebut tindak lanjut **tuntas**, atau harus ada bukti kontrol teramati dulu?
**Q2.** Bila hanya perlu ganti kata (opsi B), istilah apa yang tepat secara klinis untuk keadaan "rencana sudah disusun tapi pasien belum terpantau"?
**Q3.** Apakah dalam mode Ujian 30 hari, menuntut bukti kontrol realistis, atau justru menghukum pemain karena keterbatasan durasi?

---

## D2. Apakah kontinuitas perawatan pantas berbobot skor?

**Temuan terverifikasi.** `scoring.ts` (357 baris) hanya membaca `tally` + agregat desa; **tidak pernah** menyentuh `careEpisodes`, keterlambatan, atau `closureRate`. Aksi adopsi umpan balik adalah **satu-satunya aksi pemain di seluruh game yang efeknya murni tulisan ledger** — tanpa event, tanpa tally, tanpa dampak apa pun. Rapor, laporan akhir, dan badge sama sekali tidak menyebut episode.

Konsekuensinya, dua mahasiswa dengan permainan klinis identik — satu selalu menutup loop rujukan, satu tak pernah membuka Meja Kerja — mendapat **skor 4 dimensi yang identik byte-per-byte**.

**Sanggahan terkuat, dan saya menerimanya.** Ini **bukan celah yang bisa dieksploitasi**. Menutup loop tidak memakan stamina, tidak memakan slot lapangan, tidak terikat blok waktu. Melewatkannya tidak menghemat apa pun. Bandingkan dua bug skor asli yang dulu diperbaiki di repo ini — sesi Prolanis dan obat berbahaya — keduanya menciptakan **jalan pintas gratis** sehingga ada insentif rasional untuk curang. Di sini tidak ada. Jadi ini **celah cakupan penilaian**, bukan bug mekanik: rapor sekadar tidak dapat membedakan kontinuitas.

**Biaya bila dipasang.** Aturan kontrak engine: skor hanya boleh membaca `tally`, tak pernah menghitung ulang dari UI. Jadi butuh penghitung baru, dan itu menyentuh **7 berkas beku**: `state.ts` (field `SkorTally` baru), `init.ts` (isi 0), `save.ts` (migrasi save lama), `reducer.ts` (naikkan saat adopsi + flush akhir stase untuk episode yang terlantar), `scoring.ts` (suku baru + bobot), `verifikasi.ts` (`REVISI_ENGINE` 63→64), plus `freeze.test.ts` (segarkan hash). Ditambah kalibrasi ulang soak/benchmark, karena bot teladan sudah melakukan aksi itu sehingga skor acuan akan bergeser naik.

**Yang paling menentukan:** **angka bobotnya adalah seluruh substansi perubahan ini.** Terlalu kecil = teater; terlalu besar = menghukum mahasiswa karena tidak membaca surat, bukan karena keputusan klinisnya buruk.

**Opsi.**
- **A. Tidak sama sekali.** Kontinuitas diajarkan lewat narasi & jejak perawatan, tidak dinilai. Nol biaya, dan jujur — asalkan dinyatakan terbuka di PANDUAN_DOSEN bahwa rapor tidak mengukur dimensi ini.
- **B. Bonus kecil positif** (mis. bagian dari blok UKP), tanpa penalti. Menghargai yang rajin tanpa menghukum yang lambat.
- **C. Penalti untuk episode terlantar** saat stase berakhir — sejajar mekanik yang sudah ada untuk karma IGD dan verifikasi PIS-PK yang keduanya sudah force-evaluate di akhir.
- **D. Tunda sampai pilot M13-1b** memberi data apakah mahasiswa benar-benar mengabaikan loop, baru putuskan bobotnya berdasar perilaku nyata.

**Rekomendasi Claude:** D lalu B. Menetapkan bobot sebelum ada satu pun data perilaku adalah menebak, dan biayanya (kenaikan revisi engine + kalibrasi ulang benchmark) terlalu mahal untuk ditebak dua kali. Tapi bila memang diinginkan sebelum kelas, B jauh lebih aman daripada C — penalti pada dimensi yang belum pernah diajarkan secara eksplisit berisiko dianggap tidak adil.

**Q4.** Apakah kontinuitas perawatan termasuk kompetensi yang **memang ingin dinilai** dalam stase ini, atau cukup diajarkan tanpa skor?
**Q5.** Bila dinilai: bonus positif saja, atau juga penalti untuk loop yang terlantar? Berapa bobotnya relatif terhadap 35 poin UKP dan 35 poin UKM?
**Q6.** Apakah keputusan ini layak menunggu data pilot M13-1b, mengingat menaikkan `REVISI_ENGINE` dua kali menuntut kalibrasi benchmark dua kali?
**Q7.** Butir murah terpisah: `closureRate` sudah dihitung di `bridge.ts` tapi **tidak pernah dibaca siapa pun** (kode mati yang dipatok satu test). Ditampilkan saja di layar Jejak Perawatan (renderer, gratis), atau dihapus (menyentuh berkas beku, jadi malah mahal)?

---

## D3. Empat tautan sumber mati — dan masalah yang lebih dalam di baliknya

**Fakta terverifikasi.** 295 URL diperiksa dengan User-Agent browser sungguhan, tiap kegagalan diuji ulang di Chrome nyata. Hasil: 237 hidup, ±49 membalas 403 (**diblokir bot tapi dokumennya sehat** — CDC, doi.org, dll.; ini BUKAN mati), dan **4 URL benar-benar mati** dipakai di 8 sitasi:

| # | Label yang tertulis | Yang sebenarnya ditunjuk URL-nya | Pemakaian |
|---|---|---|---|
| 1 | "Kemenkes - PPK Dokter FKTP KMK 1186/2022 dan perubahannya" | halaman **berita workshop** (404) | 5 kasus |
| 2 | "Kemenkes - Mengenal Demam Tifoid" | artikel informasi awam (404) | 1 |
| 3 | "Kemenkes - MTBS: Rencana Terapi Diare Anak" | artikel awam tentang diare, **bukan dokumen MTBS** (404) | 1 |
| 4 | "Queensland Paediatric Guideline - Foreign Body in the Nose" | jalur konsumen `health-a-to-z` (404) | 1 |

**Masalah sebenarnya bukan link busuk.** Tiga dari empat menunjuk **halaman berita/artikel awam padahal labelnya mengklaim pedoman profesional** — artinya dokumennya sudah salah bahkan sebelum mati. Semua empat berjenis `pedoman_indonesia`/pedoman, yaitu sitasi **wajib** kasus tersebut, dan dirender sebagai tautan biasa yang bisa diklik. Dalam kuliah, itu justru tautan yang paling mungkin diklik dosen.

**Satu di antaranya tidak butuh keputusan editorial baru.** Untuk KMK 1186/2022, proyek ini **sudah** memakai URL hidup untuk regulasi yang sama persis di 6 tempat lain (`paralegal.id`, id sumber `ppk_fktp_2022`, sudah saya verifikasi hidup 2026-08-03 dan memang memuat KMK HK.01.07/MENKES/1186/2022 tentang PPK bagi Dokter di FKTP, tertanggal 31 Mei 2022, dengan catatan telah diubah). Jadi lima situs itu adalah **perbaikan konsistensi internal**, bukan pemilihan otoritas baru. Tinggal disetujui.

**Yang menentukan urutan kerja:** `sumber` — **termasuk `url` DAN `label`** — ikut masuk `sidikJariPack` (`verifikasi.ts:783`). Jadi mengganti satu URL saja akan mengubah sidik jari konten, meregenerasi artefak M13, dan membuat dossier lintas-versi tak terverifikasi. **Karena itu keempatnya sebaiknya diperbaiki sekali jalan**, bukan sepotong-sepotong.

**Q8.** Untuk KMK 1186/2022: setuju menyamakan 5 sitasi mati itu ke URL yang sudah dipakai proyek (`paralegal.id`, indeks publik), atau Anda menghendaki sumber lain (mis. JDIH Kemenkes) untuk seluruh 11 pemakaian sekaligus?
**Q9.** Demam tifoid dan MTBS diare: dokumen apa yang **seharusnya** disitir? Keduanya kini menunjuk artikel awam, jadi ini bukan sekadar mengganti URL melainkan memilih pedoman yang benar.
**Q10.** Benda asing hidung: proyek sudah menyitir jalur pedoman profesional Queensland (QPEC) di tempat lain — apakah ini diarahkan ke sana, atau diganti sumber lain?
**Q11.** Apakah ada pola yang lebih luas yang perlu disapu? Tiga dari empat kesalahan berbentuk sama (label = pedoman, URL = halaman awam). Perlukah audit menyeluruh atas seluruh 295 sitasi untuk kesesuaian label↔dokumen, bukan sekadar hidup/mati?

---

## D4. Desain gerbang keterjangkauan tautan

**Keadaan sekarang.** Sudah ada pemeriksa keterjangkauan yang **matang** (`scripts/check-clinical-source-urls.ts` / `npm run audit:provenance:urls`): GET+Range, retry, HEAD fallback, dan sudah **benar** membedakan 401/403/429 sebagai "dibatasi" dari 404/410 sebagai "rusak", keluar dengan kode gagal hanya untuk yang rusak. Masalahnya: **tak ada satu pun yang memanggilnya otomatis** — tidak di CI, tidak di hook, tidak di rantai build. Ia bergantung pada seseorang mengingat menjalankannya.

Koreksi untuk laporan audit: tuduhan bahwa artefak lama menyesatkan **tidak berdasar**. Konstantanya bernama jujur "domain yang gagal di browser pemain" dan barisnya di laporan berbunyi "Tautan dari domain yang gagal di browser pemain: 0" — keduanya berlingkup domain dan browser, tak pernah mengklaim semua tautan hidup.

**Yang sudah saya pasang hari ini.** Gerbang **struktural, offline, deterministik** (`src/content/bentukUrlSumber.test.ts`): sumber berjenis pedoman tidak boleh menunjuk URL berbentuk artikel berita. Tiga pelanggar lama terdaftar eksplisit sebagai utang yang menunggu keputusan dokter, dan daftar itu **hanya boleh mengecil**. Tautan buruk **baru** gagal seketika, tanpa menyentuh jaringan — sehingga layak jalan tiap commit.

**Yang sengaja BELUM saya pasang.** Gerbang jaringan di rantai rilis. Alasannya: ia akan langsung menggagalkan build karena keempat URL mati di D3, sebelum Anda sempat memilih penggantinya. Memasangnya sekarang berarti memblokir rilis demi masalah yang keputusannya belum ada.

**Opsi tingkatan yang disarankan.**
1. **Tiap commit, offline, keras** — gerbang struktural (sudah ada). Bisa diperkuat jadi **daftar putih penerbit** (kemkes.go.id, who.int, cdc.gov, cochranelibrary.com, …) alih-alih daftar hitam satu domain seperti sekarang.
2. **Terjadwal malam, lunak** — job CI mingguan/harian menjalankan pemeriksa URL, gagal **hanya** pada 404/410, dengan aturan "merah setelah dua kali berturut-turut" supaya satu malam buruk tidak memicu alarm palsu. 403 dilaporkan sebagai peringatan saja.
3. **Saat rilis, keras** — `audit:provenance:urls` masuk rantai `dist`, dengan jalan keluar eksplisit untuk build luring.

**Rekomendasi Claude:** pasang tingkat 2 sekarang (tidak memblokir siapa pun), lalu tingkat 3 **segera setelah** keempat URL di D3 diputuskan. Tingkat 1 diperkuat kapan saja.

**Q12.** Setuju dengan penahapan ini, atau Anda ingin gerbang rilis langsung keras (artinya D3 harus diputuskan lebih dulu)?
**Q13.** Untuk daftar putih penerbit: penerbit apa saja yang Anda anggap sah sebagai sumber `pedoman_indonesia` selain Kemenkes — organisasi profesi (PAPDI, IDAI, PERKI, dll.)? Ini menentukan gerbangnya bisa seketat apa.

---

## D5. Dua gerbang manusia yang tak bisa digantikan siapa pun

Dicatat di sini bukan untuk ditriangulasi, tapi supaya tidak hilang dari peta keputusan:

- **Adjudikasi kasus 17–137.** Baru 16 dari 137 prototipe lab berstatus disetujui dokter. Kompiler berkata "137/137 cocok", tapi itu kecocokan **struktural**, bukan persetujuan klinis. Sampai diadjudikasi, 121 kasus tetap formatif dan dampak formalnya dibatalkan engine — governance yang jujur, tapi berarti sebagian besar katalog belum bisa dipakai menilai.
- **Playtest M13-1b.** Belum pernah dijalankan. Ini satu-satunya dimensi benchmark yang bernilai rendah (validasi manusia/pedagogis ±3,0/5) dan satu-satunya yang tidak bisa dinaikkan dengan menulis kode.

**Q14.** Dari sudut pandangmu, mana yang lebih menentukan kesiapan kelas September: menaikkan jumlah kasus teradjudikasi, atau menjalankan pilot lebih dulu dengan 16 kasus yang sudah disetujui untuk menemukan masalah desain sebelum 121 kasus terlanjur diadjudikasi dengan asumsi yang salah?

---

## ADJUDIKASI

> Diisi setelah jawaban DeepThink diterima dan ditriage. Format: nomor Q → keputusan dr. Wirayuda → tindakan Claude → commit.

_(kosong)_

---

## Lampiran — dasar bukti dossier ini

Seluruh klaim di atas berasal dari verifikasi hari ini, bukan dari membaca laporan audit begitu saja:

- **12 agen** memverifikasi empat temuan secara independen, tiap temuan yang bertahan lalu diserang 2 penyanggah dengan lensa berbeda (kebenaran mekanis vs niat desain).
- Temuan D1 **direproduksi ujung-ke-ujung pada reducer asli** (bukan membaca kode): satu disposisi rujuk atas kasus kompetensi FKTP di hari ke-4 langsung menghasilkan bendera "tuntas" menyala pada aksi yang sama.
- Temuan D3 dibangun ulang dari nol: 295 URL diprobe, tiap kegagalan diuji ulang di Chrome nyata untuk memisahkan 404 sejati dari 403 blokir-bot.
- Dua klaim audit **diturunkan** setelah tidak bertahan: label "Tindak lanjut tuntas" di Jejak Perawatan ternyata pemetaan status yang jujur, dan artefak audit lama ternyata tidak menyesatkan.
- Satu klaim audit **dinaikkan**: URL mati berjumlah 4, bukan 3.

Verifikasi build: typecheck bersih, vitest 1493/1493 di 161 berkas, sidik jari pack tidak berubah, installer beta.14 terpasang dengan `app.asar` cocok byte-per-byte, tag rilis terverifikasi menunjuk commit sumber.
