# Brief Instruksi untuk ASTRA — Perbaikan PRIMERA pasca-brainstorm 11–12 September 2026

**Untuk:** ASTRA (agen coding GPT) yang akan mengerjakan perbaikan.
**Dari:** Claude, atas permintaan dr. Anak Agung Bagus Wirayuda (product owner, dokter penelaah tunggal).
**Tanggal:** 2026-09-12. **Basis kode:** PRIMERA 1.2.0, commit `6e9f17c`, cabang `codex-gpt56-experiment`, REVISI_ENGINE 72.
**Sifat dokumen:** dosier lengkap + rencana kerja. Ditulis agar bisa dibaca tanpa akses ke percakapan asalnya. Dua dosier sumbernya ada di repo yang sama: `docs/BRAINSTORM_OSCE_SIM_V4_2026-09-11.md` (sisi UKP) dan `docs/BRAINSTORM_UKM_2026-09-11.md` (sisi UKM). Bila ada beda detail, dua dosier itu dan kode sumber yang menang.

---

## ADENDUM 12 September (pasca-review ASTRA) — berlaku di atas isi di bawahnya

ASTRA mengkaji brief ini terhadap **Lab 2** (`D:\Dev\PRIMER\CODEX Lab 2 Version`, `1.3.0-lab2.2`, `689812f`, cabang `lab2/bugfix-20260907`). Claude memverifikasi sendiri: Lab 2 adalah repo git **terpisah tanpa remote** berisi salinan persis `6e9f17c` (seluruh `src/engine` dan `src/content` identik byte-per-byte, `freeze.test.ts` identik, REVISI_ENGINE 72, CONTENT_RELEASE tidak berubah) ditambah 6 commit ASTRA (5–7 September) yang hanya menyentuh renderer dan proses utama Electron (30 berkas, +898/−119). Karena itu seluruh temuan engine/konten/skor di dokumen ini tetap berlaku untuk Lab 2; yang berubah hanya status beberapa paket layar.

**Koreksi yang diterima:**
1. **PK-0 selesai di Lab 2** (`Kegiatan.tsx:57` merender dari `vonis?.kartu`; tes `Kegiatan.lab2.test.tsx`). Jangan diulang. Belum ada di repo sumber `6e9f17c`.
2. **PK-5 sebagian selesai**: `screens/ukm/PapanPenyelidikan.tsx` sudah memuat daftar pasien per identitas, dedup, perbandingan RW, dan hari pertama tercatat, tanpa menampilkan ambang. Sisa PK-5: kepala "RW n · kampung · hari" untuk semua jenis kegiatan, dan label yang lebih tegas "catatan yang masih tersedia dalam jendela 14 hari" (entri bisa terpangkas oleh supresi program/KLB tuntas, jadi bukan kurva epidemi).
3. **Klaim KLB dipersempit**: `reducer.ts:2513` menaikkan `tally.klbTuntas`; yang tidak naik adalah `tally.karmaDicegah`, dan `klbTuntas` tidak dibaca `scoring.ts`. Angka 0,18 / 0,9 / 2,3 poin per slot adalah taksiran marginal yang bergantung state, bukan bobot tetap.
4. **PK-2**: "warna penuh bila ≥ 1 indikator dokter" terlalu lemah. Tampilkan dua hal terpisah: kelengkapan data dan komposisi sumber (belum lengkap / seluruhnya kader / campuran / seluruh indikator relevan terverifikasi). Tooltip Δ vs baseline harus menyebut bahwa skor memakai bagian kenaikan positif yang dirata-ratakan dan dibatasi; delta negatif bukan penalti langsung.
5. **PK-6**: `indikatorTerverifikasi` = hotspot + ungkap jujur (`kunjungan.ts:466`), jadi kalimatnya "hasil verifikasi dokter", bukan "kamu lihat sendiri". `HasilKegiatan.jawaban` tidak menyimpan siapa yang menjawab; atribusi "kamu/kader" untuk rekap delegasi harus dari snapshot sesi yang teruji, dan tentukan perilaku setelah reload.
6. **PK-7/PK-8**: pakai konstanta per mode (KLB buka Karier 45 / Ujian 15; Prolanis periode 30/10, batas 90/30); peringatan Prolanis dihitung dari `max(hariSekarang, sesiBerikutHari)`. Kluster non-target = keterbatasan cakupan program, bukan "sengaja dibiarkan". Jangan cetak "slot siang kosong" tanpa sumber hitungan historis.
7. **PK-10 dipindah ke §9** (menunggu dokter): menunda pembahasan kesalahan adalah keputusan pedagogis, dan `narasiPenutup` juga tersimpan di `careEpisodes.receipt.feedback` dan `history.detail` (`reducer.ts:1649-1653`) sehingga tampil di Jejak Perawatan, Kabar Sukamaju, dan Album; penundaan butuh kebijakan lintas permukaan.
8. **PK-11**: nudge Edukasi **tidak terulang** di Chromium (nama aksesibel memuat "Edukasi (0/3)") — coret. Toast Buku Saku memakai bintang, bukan literal "+1" — periksa ulang kalimatnya, bukan angkanya.
9. **PK-12** dipecah: (a) akses data encounter yang benar untuk `PanelHasil` (kasus/varian aktual, bukan kasus dasar); (b) rupiah dari daftar lab yang benar-benar dipesan, bukan dari hitungan `labTakRelevan`; kasus formatif/tutorial tidak boleh tampak memotong kapitasi; (c) cetak hanya untuk encounter yang datanya tersedia; episode lama yang hanya ringkasan diekspor sebagai ringkasan. Jangan mengarang isi dari kunci kasus.
10. Metrik "opsi terpanjang benar 68/85" = jumlah kata (66/85 bila jumlah karakter; 4 node seri).

**Urutan kerja yang disepakati:** PK-1 hotspot → PK-2 provenance peta + kepala Kegiatan → PK-3 sasaran KIA + PK-4 kader bernama → PK-6 delegasi transparan + PK-7 Lokmin/Rapor + PK-8 Prolanis → PK-9 → PK-11 (dikurangi) → PK-12 bertahap.

**Risiko tata kelola yang harus diputuskan dokter sebelum ASTRA lanjut:** Lab 2 tidak terhubung ke `origin` dan bukan cabang repo utama; repo sumber memuat tiga dosier baru yang tidak ada di Lab 2, Lab 2 memuat 6 commit kode yang tidak ada di repo sumber. Rekomendasi: jadikan Lab 2 cabang resmi di GitHub (push `lab2/bugfix-20260907`) atau cherry-pick 6 commit-nya ke `codex-gpt56-experiment`, lalu salin tiga dosier ke Lab 2, supaya hanya ada satu sumber kebenaran. Hasil Electron Lab 2 terakhir bertanggal 7 September dan belum diuji ulang.

---

## 0. Cara membaca dokumen ini dan aturan main

### 0.1 Peran ASTRA
Kamu mengerjakan **paket kerja §8** secara berurutan. Kamu **tidak** memutuskan hal-hal di **§9** (keputusan klinis/pedagogis milik dokter). Bila sebuah paket ternyata membutuhkan keputusan §9, hentikan paket itu, catat, lanjutkan paket berikutnya.

### 0.2 Empat aturan yang tidak boleh dilanggar
1. **Jangan sentuh berkas engine beku** (daftar di §2.3). Menyentuhnya = bump REVISI_ENGINE = seluruh dossier mahasiswa yang berjalan menjadi "tidak dapat diverifikasi". Itu hanya boleh terjadi di jendela Golden Master atas perintah dokter.
2. **Jangan ubah kunci jawaban konten** tanpa menaikkan `CONTENT_RELEASE` (§2.4). Pelajaran mahal proyek ini: kunci berubah tanpa rilis naik → mahasiswa jujur divonis curang.
3. **Jangan langgar keputusan desain terkunci** (§3). Sebagian besar temuan di dokumen ini sudah pernah "diperbaiki" oleh orang yang tidak membaca §3, lalu harus dibatalkan.
4. **Verifikasi sendiri, jangan percaya laporan.** Setiap klaim di dokumen ini dilengkapi rujukan `file:baris` per 11 September. Baris bisa bergeser. Baca kodenya sebelum mengubah.

### 0.3 Gaya laporan yang diminta dokter
Jangan pernah menulis "selesai" sebagai satu kata. Laporkan **tujuh keadaan** secara terpisah untuk tiap paket: implemented (kode berubah) · wired (runtime benar-benar memakainya) · verified (typecheck + vitest + freeze test hijau; untuk fitur interaksi: dicek di runtime Electron atau preview browser sungguhan, bukan hanya jsdom) · built (installer dibuat) · installed (installer dijalankan) · committed · pushed. Sebutkan yang tidak terpenuhi.

### 0.4 Gaya bahasa untuk teks yang dilihat pemain
Aturan dokter (2 Agustus 2026): **makna dulu, nomor peraturan belakangan**; satu gagasan per kalimat; tanpa jargon yang tidak diterjemahkan (`floor` → "acuan dasar", `danger sign` → "tanda bahaya"); jangan buka kalimat dengan "Permenkes X/YYYY: …"; jangan hapus rujukan peraturan, hanya pindahkan ke akhir dalam kurung. Sebelum mengirim teks pemain, baca sebagai mahasiswa yang sedang diburu waktu.

---

## 1. Latar belakang produk

**PRIMERA** ("Puskesmas Pagi") adalah game desktop (Electron + React + TypeScript strict) simulasi 90 hari menjadi dokter penanggung jawab desa di Puskesmas Sukamaju (200 KK, 8 RW). Pemakai: mahasiswa FK Indonesia pada stase Ilmu Kesehatan Masyarakat / Kedokteran Keluarga, sekitar 50 orang per kohort, target pemakaian September 2026. Skor game dipakai dosen untuk menilai, sehingga prioritas produk: **integritas pedagogis > integritas asesmen > retensi > kompetisi > kesenangan kasual**.

Dua sisi gameplay:
- **UKP** (upaya kesehatan perorangan): poli pagi. Alur satu pasien: Anamnesis (deck kartu pertanyaan + gauge Sabar pasien) → Pemeriksaan (vital, figur tubuh per region, lab dengan biaya BPJS nyata dan sebagian hasil "besok") → Diagnosis (3 opsi banding + stempel TEGAK/SUSPEK) → Terapi (formularium 150 obat, edukasi prioritas 3 dari 173 topik, 62 tindakan) → Disposisi (pulang / observasi / rujuk SBAR + SISRUTE 4 RS). Debrief per pasien: grade A–D, 4 meter, bendera, gap yang terlewat, Mutiara EBM, Panduan Resmi, Realita FKTP, Duel/Teach-back.
- **UKM** (upaya kesehatan masyarakat): tiga lapis. (1) **Kader = scout**: 8 kader (1/RW) dengan stat ketelitian 50–85 dan bias persona, menyurvei otomatis dan mengisi indikator PIS-PK keluarga dengan kemungkinan salah; data berchip provenance ✓ dokter / ~ kader / ? belum / ⧗ janji. (2) **Peta = papan keputusan**: choropleth 8 RW berwarna dari IKS (Permenkes 39/2016), panel RW, roster Keluarga Binaan (maks 16 dari 16 keluarga bernama). (3) **Kunjungan rumah** lima tahap dalam satu layar: Salam & Observasi (hotspot pada ilustrasi interior) → Wawancara (dialog gaya wawancara motivasional/MI: Refleksi, Empati, Edukasi, dan 4 gaya terlarang; 2 gaya terlarang beruntun = diusir; gerbang kejujuran bila trust rendah) → Diagnosis Perilaku (COM-B: Kapabilitas/Kesempatan/Motivasi) → Resep Sosial (1 dari 4 kartu) → Ingatkan (penutup SAJI). Plus **Kegiatan** terjadwal: Posyandu (buka Hari 15, 4 kartu, delegasi kader 65% benar/kartu), Prolanis (Hari 30), Respons KLB (Hari 45, dipicu kluster surveilans dari diagnosis poli), Program Wilayah bulanan, Lokakarya Mini (Hari 31/61), Pemulihan akhir pekan.

**Model waktu:** 1 hari = 3 blok (Pagi klinik, Siang lapangan 1 slot, Sore meja kerja: kotak masuk, debrief malam, refleksi, tidur/autosave). Stamina 6 pip/hari. Dua mode: Karier 90 hari (bebas nilai) dan Ujian 30 hari (satu-satunya yang menghasilkan skor formal; 8 paket rotasi; dua seed: kurikulum per paket dan flavor per mahasiswa).

**Skor akhir 4 dimensi (100):** UKP 35 · UKM 35 · Manajemen 15 · Resiliensi 15. Grade A ≥ 85 · B ≥ 70 · C ≥ 55 · D.

**Formula UKM 35** (`src/engine/scoring.ts:143-231`, berkas beku):
```
skorIksDesa   = clamp( rata-rata(max(0, iksRW − baselineRollRW)) / 0,115 , 0, 1 )
rasioKunjungan = kunjunganBerhasil / max(24 karier | 8 ujian, kunjunganTotal)
kualitasMI    = miTepat / max(24 | 8, miTotal)
prolanis      = fraksi roster Prolanis yang terkendali
ukm = clamp( (0,4·skorIksDesa + 0,2·rasioKunjungan + 0,2·kualitasMI + 0,2·prolanis) · 35
             − 2·apathy + (3·karmaDicegah − 9·karmaTerjadi)/max(3, n) , 0, 35 )
```
Akibat formula ini (terverifikasi): kunjungan + Prolanis memasok ≈ 88% dari UKM. Posyandu hanya menambah `bonusIks` 0,012 per sesi ke IKS RW (lalu dipotong pada baseline), KLB tuntas 0,012, dan KLB memancarkan event `KARMA_DICEGAH` **tanpa** menaikkan tally. Per slot siang: Posyandu ≈ 0,18 poin, kunjungan ≈ 0,9, Prolanis ≈ 2,3. Ini **bukan bug**; ini konsekuensi keputusan dokter 16 Juli 2026 ("nilai KLB di pemutusan penularan, bukan angka") dan masuk §9 (keputusan dokter), bukan §8.

---

## 2. Peta repo, arsitektur, dan perintah

### 2.1 Lokasi
- Repo git tunggal: `D:\Dev\PRIMER-CODEX-lab` (remote `https://github.com/anakwirayuda-eng/PRIMER.git`). Aplikasi aktif: `primera-desktop/`. Cabang kerja: `codex-gpt56-experiment`. Semua path di bawah relatif ke `primera-desktop/`.
- **Jangan** mengambil apa pun dari repo lama `D:\Dev\PRIMER\src` (riwayat insiden keracunan terjemahan ICD).

### 2.2 Struktur
- `src/engine/` — engine murni, nol React, deterministik (`advance(state, action, content, rng)`). Action-log = sumber kebenaran skor; replay-able untuk verifikasi dosen (M6).
- `src/content/` — konten bertipe: `kasus/*.ts` (73 kasus inti), `lab/*.ts` (137 kasus prototipe lab), `igd*.ts` (20 IGD), `keluarga/desaA–F.ts` (16 keluarga, 27 skenario kunjungan, profil 8 kader di `desaB.ts:1587-1660`, profil RW `desaB.ts:1669-1678`), `katalog*.ts` (obat/edukasi/lab/tindakan), `ukmCitations.ts` (Landasan Resmi UKM), `pack.ts` (validasi pack fail-fast + `CONTENT_RELEASE`), `types.ts`.
- `src/renderer/src/` — React + zustand tipis: `screens/` (MejaKerja, Klinik + `klinik/*`, PetaDesa + `peta/*`, Kunjungan + `kunjungan/*`, Kegiatan, Rapor, DexSkdi, LaporanAkhir, TitleScreen, JejakPerawatan), `components/`, `store.ts`, `styles/tokens.css` (palet "Puskesmas Pagi": Daun `#0E8A6B`, Kertas `#FAF6EF`, Kunyit `#D9822B`, Malam `#14201C`; font Plus Jakarta Sans / IBM Plex Mono / Caveat).
- `src/renderer/src/main.tsx` — shim `window.primer` → localStorage untuk preview browser tanpa Electron.
- `docs/` — dokumen keputusan. Urutan prioritas bila bertentangan: kode + test di cabang aktif > entri keputusan terbaru bertanggal > `docs/GDD.md`, `docs/ROADMAP.md`, `docs/ADJUDIKASI_DELEGASI_2026-08-21.md`, `docs/PEDOMAN_AUTHORING_UI.md`, `docs/PROSEDUR_RILIS.md`.

### 2.3 Berkas engine beku (JANGAN DISENTUH)
Dihash oleh `src/engine/freeze.test.ts`: `reducer.ts`, `clinic.ts`, `scoring.ts`, `director.ts`, `core/rng.ts`, `igd.ts`, `kader.ts`, `init.ts`, `kegiatan.ts`, `kunjungan.ts`, `paketUjian.ts`, `verifikasi.ts`, `state.ts`, `save.ts`, `pispk.ts`, `surveilans.ts`, `examBlueprint.ts`, `bridge.ts`. Verifikasi daftar aktual dengan membaca `freeze.test.ts` sebelum mulai.
Yang **tidak** beku dan boleh disunting: seluruh `src/renderer/`, `src/engine/debriefNarator.ts` (sengaja tidak dibekukan: kalimat debrief), `src/engine/events.ts`, `src/engine/actions.ts` (tipe saja; menambah aksi baru tetap butuh reducer → dilarang), konten di `src/content/` (dengan aturan §2.4).

### 2.4 CONTENT_RELEASE dan sidik jari
- `src/content/pack.ts` memuat `CONTENT_RELEASE` dan `CONTENT_RELEASE_ORDER`. Save lama dibandingkan lewat `rilisArsipKompatibel` (`store.ts`), yang **hanya** membaca `contentRelease`, tidak REVISI_ENGINE.
- Sidik jari konten (`verifikasi.ts` sekitar baris 1000–1030) menghash antara lain arc keluarga, kunci jawaban kasus, ambang kluster, profil kader (id/rw/ketelitian/bias — **nama kader tidak masuk hash**).
- Aturan: setiap kali menyentuh field yang memengaruhi kunci jawaban atau skor, tanya "apakah CONTENT_RELEASE perlu naik?" Teks murni display (`clue`, `mutiaraEbm`, `catatanRealita`, `panduanResmi`, narasi, label) tidak menaikkan rilis.
- Regenerasi artefak M13 (`npm run m13:adjudication`) harus dari pohon **bersih** (commit kode dulu → regenerasi → commit artefak terpisah); pohon kotor menghasilkan `sourceCommit` berakhiran `+dirty` dan test merah. Arsipkan alat tinjau lama sebelum regenerasi (fingerprint baru menghapus review yang sedang berjalan).

### 2.5 Perintah verifikasi (PowerShell, dari `primera-desktop/`)
```
npm.cmd run typecheck
npx.cmd vitest run
npx.cmd vitest run src/engine/freeze.test.ts
npm.cmd run audit:editorial
npm.cmd run build
npm.cmd run dist      # hanya untuk rilis; check:provenance menolak pohon kotor
```
Status 11 September: typecheck 0 error, vitest 176 berkas / 1.701 test hijau.

Preview browser tanpa Electron: konfigurasi `.claude/launch.json` di root repo, nama `puskesmas-pagi-preview` (`npx vite --config vite.preview.config.ts`, port 5199). Untuk melompat ke hari tertentu saat menguji: ubah `primer.save.autosave` di localStorage (field `state.hari`, `state.blok`, `state.layar`, `state.lapanganTerpakai`, `state.stamina`) lalu reload; hasilnya "Lanjutkan — Hari N" di layar judul. Uji akhir tetap di Electron (`npm run dev`).

---

## 3. Keputusan desain yang terkunci (jangan diusulkan ulang, jangan dilanggar)

| Keputusan | Sumber | Artinya untuk kamu |
|---|---|---|
| Tanpa umpan balik benar/salah **instan per pertanyaan**; umpan balik datang di debrief | GDD §11 | Jangan tambah stempel/warna vonis per klik di anamnesis atau dialog kunjungan. Kartu Kegiatan (Posyandu/Prolanis/KLB) adalah pengecualian yang sudah ada: jawaban terkunci saat klik, stempel TEPAT/KELIRU per kartu **dipertahankan** (refuter: 21 dari 38 teks opsi salah tidak memuat kata vonis). |
| Tanpa framing "melawan" pasien; tanpa peta jelajah/karakter jalan-jalan; judul bukan "Kepala Puskesmas"; trust naik dari **kualitas** wawancara, bukan frekuensi | GDD §11 | Garis putus-putus statis pada hover di peta boleh; karakter bergerak tidak. |
| "Tanpa teater": fitur yang tidak dinilai/berefek tidak boleh ada di layar | GDD §2 pilar 6 | Jangan tambah meter/angka yang tidak diperoleh dari state. |
| "Setiap angka diperoleh, atau ia tidak ada"; provenance ✓/~/?/⧗ | GDD §2 pilar 1 | Jangan tampilkan angka kalibrasi (mis. ambang kluster) seolah fakta epidemiologi. |
| D3-lite Prolanis (2026-07-17): investasi mekanik Prolanis **ditolak**; hanya narasi yang boleh berbeda | UKM Decision #3 | Jangan buat hasil Prolanis bergantung kunjungan rumah; jangan ubah pilihan/benar/respons kartu Prolanis. |
| Kunci #12: warna petak RW 1:1 dengan klasifikasi IKS resmi (> 0,8 / 0,5–0,8 / < 0,5) | `petaUtil.ts:88-96` | Kanal kemajuan baru boleh **di atas** warna, bukan mengganti warna. |
| De-beacon #7: hotspot kunjungan tanpa denyut abadi, opasitas idle 0,26 | `Kunjungan.css:156-171`, keputusan 16 Juli | Boleh menaikkan opasitas idle dengan garis tepi statis dan menambah kalimat instruksi; tidak boleh denyut/sapuan cahaya. |
| Delegasi Posyandu flat 0,65 = satu-satunya sumber angka | `kegiatan.ts:783-792` | Perubahan (membaca ketelitian kader, batasi kartu klinis, kembalikan stamina) = engine beku = §10. |
| Program Wilayah gratis (ongkosnya eksklusivitas sebulan); dr. Ratih rival statis 71/78 | `reducer.ts:1816-1848`, ROADMAP M2.11 | Jangan usulkan biaya stamina/kas atau rival dinamis. |
| Roster binaan 16 dan `EKSPEKTASI_KUNJUNGAN_KARIER = 24` saling terkalibrasi | M13 §6.16, `scoring.ts:34` | Cap roster < 16 bukan fix murah; §9. |
| Pedoman UI terkunci | `docs/PEDOMAN_AUTHORING_UI.md` | `window.alert/confirm` dilarang → `DialogGame`; tooltip lewat `data-tip` (elemen disabled: pola dual `title` + `data-tip`); hotkey lewat gate `sedangMengetik`; preferensi kosmetik ke `utils/laciPersist.ts`, bukan save; operasi async tidak boleh sukses senyap. |
| Anti-bocor UI | preseden `79795df`, ROADMAP triangulasi M3b | UI tidak boleh membocorkan jawaban: opsi diagnosis bernama setara, IGD tidak menampilkan diagnosis sebelum disposisi, edukasi tidak boleh disaring per kasus dari hidden state ("scaffolding statis-universal sah; reduksi dinamis dari hidden state = bocor"). |
| Kabar/narasi hanya untuk keadaan yang benar-benar terjadi di state; bingkai kontrafaktual tingkat individu dilarang | UKM Assurance 2026-07-19 | Jangan tulis "seandainya tidak kamu kunjungi, Bu X akan stroke". |
| Semua opsi benar kartu Kegiatan ber-id `'a'` dan urutan opsi diacak per mahasiswa di renderer | audit 22 Agustus | Jangan pernah merender opsi dari kartu yang bukan kartu yang sedang divonis (lihat PK-0). |

---

## 4. Status terverifikasi 11 September 2026

| Aspek | Keadaan |
|---|---|
| Commit | `6e9f17c` (23 Agustus), tidak ada commit 19 hari, pohon bersih (kecuali 2 dosier baru yang belum di-commit) |
| Test | typecheck 0 · vitest 1.701/1.701 · REVISI_ENGINE 72 |
| Kasus poli | 210 = 73 inti + 137 prototipe lab (16 disetujui dokter · 70 ditinjau Claude · 51 belum) |
| Kasus IGD | 20 |
| Katalog | 150 obat · 173 topik edukasi (laci 62/37/36/15/14/9) · 41 lab · 62 tindakan · 16 keluarga · 27 skenario kunjungan · 85 node dialog · 123 hotspot · 144 entri SKDI |
| Milestone | M0–M7, M9, M10.5 (Golden Master), M11 inti, M12, M14 selesai; M13 sebagian; M15 disetujui belum dibangun |

---

## 5. Ringkasan perjalanan diskusi (11–12 September)

1. **Dokter mengirim** `ai_clinical_case_simulator_v_4.tsx`: simulator OSCE satu pasien berbasis Gemini (kasus dibuat LLM, pasien dijawab LLM, penilaian cocok-kata, "teliti" = klik semua pemeriksaan, resep tidak dinilai, diagnosis emas dimasukkan ke prompt pasien, kunci API di klien). Kesimpulan: bukan pesaing PRIMERA; **lima hal layak dipinjam tanpa LLM** (§6.3). LLM runtime ditolak untuk kohort ini; LLM sebagai alat penulis offline tetap boleh.
2. **Claude memainkan PRIMERA** Hari 1–3 di preview browser dan mencatat gesekan UX (§6.2). Verdik: PRIMERA jauh lebih matang secara rekayasa dan pedagogi, tetapi belum pernah diuji mahasiswa sungguhan.
3. **Dokter bertanya soal UKM.** Claude memainkan Kunjungan Bu Wulan dan Posyandu (Hari 17 via lompat autosave), menjalankan orkestrasi 72 agen (peta subsistem → 5 kritikus dimensi → 6 generator ide + 3 juri → 52 penyanggah adversarial → sintesis), lalu menghitung ulang sendiri angka-angka kunci. Hasil: §7 dan §8.
4. **Dokter meminta** dokumen ini untuk diserahkan ke ASTRA.

---

## 6. Temuan sisi UKP (klinik)

### 6.1 Yang sudah baik (jangan diubah)
Lembar Periksa SOAP yang terisi sendiri dari tindakan pemain; anamnesis progresif (keluhan utama → satu pertanyaan jembatan → riwayat); gauge Sabar; debrief berlapis; stempel TEGAK/SUSPEK; firewall alergi; disposisi SISRUTE dengan SBAR yang dinilai engine.

### 6.2 Gesekan yang ditemukan saat bermain (browser preview; konfirmasi ulang di Electron)
| # | Temuan | Lokasi | Berat |
|---|---|---|---|
| U1 | Katalog edukasi 173 topik dalam 6 laci; laci "Tindakan Fisik & Teknik Khusus" berisi 62, "Kepatuhan & Kontrol" 37, "Higiene" 36. Ambang DeepThink Juli ±15 item per daftar datar. Pencarian ada, tapi mahasiswa belum tentu tahu kosakatanya. | `DeckTerapi.tsx` tab Edukasi; `katalog*.ts` metadata `kategori` | sedang–tinggi; **keputusan taksonomi = §9** |
| U2 | Nudge "💬 Pasien belum diedukasi — buka tab ; konseling ikut dinilai." Nama tab hilang dari nama aksesibel (dirender sebagai elemen bergaya). | `DeckTerapi.tsx` bawah tombol Selesai | rendah, copy/aria |
| U3 | Toast "Buku Saku diperbarui (+1)" setelah kasus non-144 (KB Z30.0), padahal Buku Saku tetap "0 dijumpai / 144 belum". | reducer event → `Toaster.tsx`; `DexSkdi.tsx` | rendah, konsistensi pesan |
| U4 | Tooltip "Stempelkan diagnosis di lembar." pada tombol nonaktif menimpa keterangan bantuan di bawahnya. | `DeckDiagnosis.tsx` + `TooltipInstan` | rendah, kosmetik |
| U5 | Setelah "Pesan" lab, fokus pindah ke kotak cari dan item yang baru dipesan keluar dari pandangan. | `DeckPemeriksaan.tsx` | rendah, konfirmasi Electron |
| U6 | Diagnosis rata-rata 3,06 opsi (198/210 kasus 3 opsi) → tebakan 33%. | konten `diagnosisBanding` | sedang; **menunggu dokter (dosier 22 Agustus §5.4)** |
| U7 | Tutorial pasien pertama: tombol terkunci tampil tanpa label terbaca. | `tutorialKlinik.ts`, deck | rendah |

### 6.3 Yang layak dipinjam dari simulator OSCE (display-only, tanpa LLM)
- **UKP-A** Debrief menampilkan **teks temuan** pemeriksaan fisik relevan yang terlewat, bukan hanya nama region (`PanelHasil.tsx` + `temuanUntukRegion` di `clinic.ts`, sudah diekspor; pakai `kasusEfektif` bila kasus ber-varian). Post-hoc, bukan bocoran.
- **UKP-B** Rupiah terbuang per lab tak relevan di chip debrief ("Lab tak relevan ×2 · Rp 35.000 terbakar dari kapitasi"). Biaya lab ada di katalog lab.
- **UKP-C** Cetak/ekspor rekam medis per pasien dari `PanelHasil` dan `JejakPerawatan` (HTML cetak; Electron `printToPDF` via IPC di proses utama, preview `window.print`). Tidak ada di kode saat ini (grep `window.print` hanya di `LaporanAkhir.tsx`).
- **UKP-D** Kalimat "kesan pertama" pasien (≤ 12 kata, observasional generik) di ruang tunggu — **§9**, butuh pagar anti-bocor disetujui dokter.
- **UKP-E** Mode **Latihan Bebas per kategori** (formatif, tanpa dunia): layar baru dari layar judul yang memakai `buatPasienDariKasus` (director.ts, hanya dipanggil, tidak diubah), `aksiKlinik`, `nilaiEncounter`; ditandai formatif sehingga tidak menyentuh Dex/rapor/kapitasi/konsekuensi. Nilai tertinggi untuk kohort; **kapan dikerjakan = §9 pertanyaan dokter**.
- **UKP-F** Baris pertanyaan universal (alergi, obat rutin, RPD, RPK) — butuh jawaban ber-state (alergi pasien hasil roll) → engine → §10.
- **UKP-G** Anamnesis ketik bebas dipetakan ke bank pertanyaan (fuzzy + fonetik + sinonim, dispatch `TANYA` biasa; tanpa LLM) — pilot pasca-trial, §10.
- **UKP-H** Kolam distraktor diagnosis dari katalog 144 (3 → 4–5 opsi) — menyentuh `KOMIT_DIAGNOSIS` → §10, dan menunggu dokter.
- Ditolak: saran AI diagnosis/obat, timer yang memengaruhi skor, penilaian cocok-kata, resep berdosis tanpa validasi (keputusan M10.5 "tanpa dosis" tetap), Firebase/online, meter "stabilitas" teater, input suara.

---

## 7. Temuan sisi UKM (lengkap)

### 7.1 Skor jujur per dimensi
Gameplay 5,5 · Visual 6,5 · Keasikan 5,5 · Presisi 6,5 · Beban kognitif 5,5 (dari 10). Jantung UKM (kunjungan rumah) sudah bekerja; lapisan sekelilingnya belum hidup. Pekan 1–5 layak 8, pekan 6–13 layak 3.

### 7.2 Kekuatan yang jangan disentuh
Mesin kunjungan lima tahap (hotspot mengalahkan kebohongan `kunjungan.ts:467`; gerbang kejujuran trust berjalan `:311`; diusir 2× `:299`; berhasil = hipotesis + kartu + MI ≥ 50 `:389`; armor SDOH `reducer.ts:1458`); akibat bernama 9 karma keluarga; tulisan kunjungan; formula IKS persis Permenkes 39/2016 (`pispk.ts:16-56`); konten KLB per rute penularan (`kegiatan.ts:535-649`, registry tanpa default droplet); disiplin token visual & aksesibilitas; penahan beban yang sudah ada (kartu keluarga melipat indikator kosong, Tas Kunjungan beralasan, Agenda Besok, tombol nonaktif ber-alasan).

### 7.3 Gameplay (5,5) — angka pasca-sanggahan
- Nilai timpang (lihat §1 formula). Probe pemain teladan 29 kunjungan: IKS berbasis binaan di 7 dari 8 RW tetap di bawah baseline; suku IKS praktis bergantung bonus. **§9**.
- KLB memancarkan `KARMA_DICEGAH` tanpa `tally.karmaDicegah` (`reducer.ts:2529` vs `:1577`). **§9**.
- Delegasi Posyandu tidak menghemat stamina/slot (`reducer.ts:1731`, `:2277`), surat Hari 15 menjanjikan "bila harimu padat" (`reducer.ts:3758`, beku). Panel penutup hanya "3/4 keputusan tepat"; `KegiatanState.jawaban` (`state.ts:411`) merekam per kartu tetapi tidak ditampilkan. → PK-6.
- **Kunjungan ulang gratis**: `followUpHari` hanya dipasang bila berhasil (`kunjungan.ts:642`); gerbang `MULAI_KUNJUNGAN` hanya membaca `arcSelesai` dan `followUpHari` (`reducer.ts:1402-1406`). Hari itu juga pemain membaca `hasilNarasi` kartu meleset yang menyebut hambatan sebenarnya (`kunjungan.ts:553` → `MejaKerja.tsx:710`), catatan pembimbing kartu (`kunjungan.ts:529`), dan vonis "Dugaan hambatanmu tepat/meleset" (`debriefNarator.ts:98`). Trust +6..8 per kunjungan bermutu dari awal 2 → melampaui ambang gerbang tertinggi 6 dalam satu kunjungan. → PK-10 (tahap D) + §10 (tahap E).
- **Gaya dialog ≡ vonis** (dihitung dari PACK: 255 pilihan): Refleksi 45/45 tepat, Empati 37/37, empat gaya terlarang 0/82, Edukasi 9/91; opsi terpanjang = benar di 68/85 node; efekTrust tepat {+1: 15, +2: 76}, keliru {0: 42, +1: 25, −1: 30, −2: 67}. Label "Gaya: ♡ Empati" tampil pasca-pilih (`Kunjungan.tsx:538-544`) dan 4 kalimat sambung stok bergantung tanda efekTrust (`Kunjungan.tsx:97-113`), bertabrakan dengan GDD §11 dan dengan `DIALOGUE_COHERENCE_AUDIT 07-20` yang mengklaim label "tersembunyi sampai debrief". Berat rendah (respons warga sudah diegetik); tuas sebenarnya konten (§9). → PK-9.
- Lapis 1 kader: tidak ada aksi kader di `actions.ts`; ketelitian/bias ditulis sekali (`init.ts:199-204`) dibaca sekali (`kader.ts:186`); surat kader bernama berhenti ±Hari 7–15 (`kader.ts:259`). Janji GDD §6 "penugasan kader mingguan" belum dibangun → §10.
- Roster 16/16: bukan teater (gerbang kunjungan, pemicu drift, sasaran silaturahmi), tetapi ongkos tersembunyi (tooltip `KartuKeluarga.tsx:266`) dan kandidat diurut abjad (`PetaDesa.tsx:110-115`). → PK-9.
- Pacing: 26 skenario arc untuk ±88 slot siang; slot kosong tanpa ongkos dan tak tampak (`reducer.ts:2667-2671`). Arc tamat bisa terbuka lagi lewat janji ingkar (`reducer.ts:3235-3249`), stokastik.
- Program Wilayah: efek positif diam (supresi 1 entri/hari `reducer.ts:3447`, perisai drift `:3368`, tanpa surat/tally); panel ongkos Lokmin (`MejaKerja.tsx:1318-1332`) menuduh untuk kluster non-target (4 dari 9 penyakit yang bisa berkluster di build ini; 14 kasus lab formatif kebal dampak `reducer.ts:1291-1300`). Label "Fokus bulan ini sudah dikunci di Lokakarya Mini" salah (kunci kalender, `reducer.ts:1830`). → PK-7.
- Prolanis: sesi berikut = hari sesi aktual + 30 (`reducer.ts:2479`); sesi pertama Hari 31 → ketiga Hari 91 hangus tanpa peringatan (`MejaKerja.tsx:775-786`; surat Hari 30 `reducer.ts:3662-3667`). ≈ 1 poin skor akhir. → PK-8. (Klaim "HT 175 tetap tak terkendali" **salah**; jangan diangkat.)

### 7.4 Visual (6,5)
- **Bug** hotspot: `slamet_k1` gembok `slk1_h1 [59,30]` vs piala `slk1_h4 [60,34]` (`visualProfiles.ts:147-149`), jarak pusat ≈ 19 px, cakram 36 px. Gembok = kunci "Kamar yang Selalu Terkunci" (indikator `jiwa_tidak_ditelantarkan`, `desaD.ts:69-76`); tanpa gembok, jawaban empati benar mencatat "ya ✓ dokter" palsu (`kunjungan.ts:604-608`). Test hanya menjaga batas koordinat x 4–92 / y 8–92 (`visualProfiles.test.tsx:64-67`), bukan jarak; `ketut_k1` 46 px hampir bersinggungan. → PK-1.
- Afordans hotspot idle 0,26 (`Kunjungan.css:163-187`), kontras ≈ 2,3:1 (< 3:1 WCAG 1.4.11); hover 0,85 baru setelah kursor di 0,6% luas panggung; teks pembuka tidak menyebut "klik" (`Kunjungan.tsx:511-513`); animasi memang dihapus (css:226, commit `3a96d85`). → PK-1.
- Choropleth: sehat/pra-sehat tak terjangkau (IKS RW = (binaan sehat + baseline 0,06–0,20 × KK tersurvei)/(berdata + KK) + bonus, `kader.ts:230-251`); merah + mendung seragam 8 RW sejak ±Hari 4 (`petaUtil.ts:97-106`, `:116-118`). Skor menilai kenaikan, peta memetakan absolut. `proporsiBaselineRoll` ada di `RwState` (`state.ts:327`) dan Rapor sudah memakainya (`Rapor.tsx:275-277`). Tanda "!" karma bukan bagian temuan. → PK-2.
- Meter IKS 8 px memakai kelas klasifikasi tanpa gerbang `dataIksLengkap` (`KartuKeluarga.tsx:150-154` vs chip `:161-181`); default `.meter__isi` hijau (`base.css:294`) → perlu kelas netral abu, bukan pencabutan kelas. → PK-2.
- Provenance agregat: chip klasifikasi memberi "Sehat" hijau penuh (`petaUtil.ts:154-161`) ke keluarga 100% data kader karena `dataIksLengkap` (`:102-104`) = `sumber !== 'belum'`. Baris indikator sudah benar (`KartuKeluarga.tsx:34`). → PK-2.
- Layar Kegiatan tanpa RW/hari di kepala (`Kegiatan.tsx:121-144`; `kg.rw` ada di `state.ts:402-406`); gulir 487 px pada 1000×686 karena kerangka vertikal, bukan stempel. → PK-5.
- Dua bahasa ikon: emoji OS (🍼 🚨 🩺 😴 🏃 ☕ 🔒 🚚 💾 ⏳ ⚖️) vs glyph tinta di Kunjungan/Peta. Rendah; kandidat polish.
- Warga binaan berganti wajah saat masuk poli/Prolanis: potret pasien dari hash `id|usia|jk` (`patientVisualProfiles.ts:100-103`), tidak membaca `keluargaId` yang ada di entri antrian karma (`reducer.ts:3160-3172`); 24 potret M12 di `kunjungan/visualProfiles.ts:209-234`. Kandidat polish display-only.

### 7.5 Keasikan (5,5)
Gerbang kejujuran tanpa momen "aku tahu kamu bohong" lewat dialog (sengaja lewat hotspot; hotspot tak terlihat). Kader lenyap ±Hari 7–15; renderer tidak pernah membaca `PACK.kader`; tiga surat reducer "Kader RW n" (`reducer.ts:3297`, `:3314`, `:3411`). Kartu Posyandu Langkah 5 konstan (`kartuPosyandu()` `kegiatan.ts:354`), narasi KLB 3 varian lintas penyakit (`kegiatan.ts:658-712`), Prolanis "suka makan asin" (`kegiatan.ts:405-424`). Setelah ±Hari 40 kabar bernama habis; 48 storylet malam institusional (`mejaKerja/storylet.ts`). Surat "janji ditepati" mencetak id mentah (`reducer.ts:3316`, beku). Tabrakan nama: kader Pak Slamet RW 2 vs Keluarga Pak Slamet RW 4; kader Bu Ketut Ayu RW 7 vs Keluarga Pak Ketut RW 7; dr. Ratih (rival) vs Ratih anak Mbah Lastri (desaE).

### 7.6 Presisi (6,5) — semuanya keputusan dokter (§9), bukan bug engine
Taksonomi gaya bukan OARS; resep sosial dikotomi palsu (skrining kontak TB `sk1_i4` ber-kunci `kesempatan`, hambatan `santoso_k1` = `motivasi`, `desaA.ts:816-823`, `:1207-1216`); delegasi menyerahkan keputusan klinis ke kader (`delegasiKegiatan` `kegiatan.ts:799-817`); bingkai "sinyal KLB 14 hari" untuk TB/kusta/IMS + surat "bukan kebetulan" (`reducer.ts:3499-3505`; ambang = kalibrasi `surveilans.ts:40-43`); definisi usia PIS-PK KIA tidak diikuti (contoh `desaA.ts:1556-1571`, `desaD.ts:645-647`); kartu Prolanis buta besaran parameter; kartu Posyandu remaja memberi TTD mingguan tanpa cek Hb (`kegiatan.ts:126-150`). Catatan kecil: "5W1H" (isinya Orang-Tempat-Waktu), "PWS" untuk register menular, "Laporan W1" bukan penutup, "Catatan pembimbing" dibuka "Adaptasi beralasan: KMK RI HK.01.07/MENKES/303/2026…" (`ukmCitations.ts:257`, `debriefNarator.ts:104`).

### 7.7 Beban kognitif (5,5)
Satu blok siang 21–27 klik untuk 5–6 keputusan (GDD 8–14). ±35 istilah baru dalam 3 hari tanpa onboarding UKM (`Onboarding.tsx:49-97` hanya klinik). Landasan Resmi identik 27× (kunjungan) hingga 96× (kegiatan) per karier (`PetaDesa.tsx:402-407`, `ukmCitations.ts:198-206`). Aside sitasi 40 kata per kartu Resep Sosial pra-penilaian (`Kunjungan.tsx:663-676`). Jargon tanpa tip (`MejaKerja.tsx:241`, `Rapor.tsx:297`). Surat drift/janji mencetak id mentah (`reducer.ts:3404`, `:3316`, `:3290`, `:3280`, beku → petakan di renderer). Tas Kunjungan `<div>` tak bisa diklik (`MejaKerja.tsx:675-689`, `:725-740`) padahal mekanisme lompat ada (`setPetaTargetKeluargaId`, `MejaKerja.tsx:563-578`, `PetaDesa.tsx:75-85`). Blok siang Meja Kerja hingga 18 tombol, 8 di antaranya "RW n" polos (`MejaKerja.tsx:813-859`). Mode Ujian menumpuk 5 modul dalam 10 hari (Posyandu D5, Prolanis D10, Lokmin D11, KLB D15, Lokmin D21; `reducer.ts:146-198`). ±1.000 kata per kunjungan, narasi penutup dibaca 3×.

---

## 8. Paket kerja untuk ASTRA (urut prioritas; semuanya display-only, nol berkas beku, nol CONTENT_RELEASE)

Format tiap paket: **Tujuan · Konteks · Berkas · Langkah · Kriteria terima · Test · Jangan.** Kerjakan satu paket = satu commit (atau beberapa commit kecil), pesan commit berbahasa Indonesia dengan awalan `fix(ukm):`, `fix(ux):`, `feat(ukm):`, dst., mengikuti gaya log repo.

### PK-0 — Kartu Kegiatan: render dari `vonis.kartu` (P1, kunci jawaban bocor)
- **Tujuan:** menghentikan kebocoran kunci jawaban di Posyandu/Prolanis/KLB (UKM 35 poin di Mode Ujian).
- **Konteks:** sejak `be09694` (22 Agustus), klik opsi langsung men-dispatch `JAWAB_KEGIATAN` yang memajukan `kg.index`, sementara layar memegang cuplikan `vonis` kartu lama. Terbukti di layar 11 September: judul/narasi/opsi kartu 2 tampil bersama pembahasan kartu 1, dan karena semua opsi benar ber-id `'a'`, opsi benar kartu 2 sudah menyala hijau. `Kegiatan.tsx:54` masih membaca `kg.kartu[kg.index]`; panel penutup `PanelVonisPenutup` (`:306`) sudah membaca `vonis.kartu` untuk kartu terakhir.
- **Berkas:** `src/renderer/src/screens/Kegiatan.tsx`, `Kegiatan.css` bila perlu, test baru `Kegiatan.vonisKartu.test.tsx`.
- **Langkah:** saat `vonis` ada, render judul, narasi, daftar opsi, nomor kartu, dan pembahasan dari `vonis.kartu` (dan pilihan yang dijawab), bukan dari `kg.kartu[kg.index]`. Tombol "Kartu Berikutnya" menghapus `vonis` lalu barulah kartu `kg.index` tampil. Pastikan tombol "Tutup Sesi" tidak muncul satu kartu terlalu awal. Jangan sentuh `kegiatan.ts`, `reducer.ts`, atau `store.ts`.
- **Kriteria terima:** dengan dek 3 kartu (mis. KLB), setelah klik opsi kartu 1: judul kartu 1 tetap tampil, respons kartu 1 tampil, tidak ada elemen ber-kelas `kegiatan__opsi--benar` yang milik kartu 2; setelah "Kartu Berikutnya", kartu 2 tampil tanpa stempel apa pun.
- **Test:** jsdom dengan store/reducer asli (bukan mock): 3 kartu, klik opsi kartu 1, assert judul & respons & kelas; lalu klik lanjut, assert kartu 2 bersih. Jalankan juga seluruh `Kegiatan*.test.tsx` yang ada dan `freeze.test.ts`.
- **Jangan:** memecah aksi jadi JAWAB+LANJUT di engine (pernah dibatalkan: memecahkan ~10 harness test).

### PK-1 — Hotspot kunjungan: gembok Pak Slamet, test jarak, instruksi observasi
- **Tujuan:** hotspot kunci tidak tertimpa; pemula tahu gambar bisa diklik; tanpa melanggar de-beacon #7.
- **Konteks:** §7.4 butir 1–2. Saya sendiri tidak melihat hotspot pada screenshot statis sebelum diklik; setelah diklik muncul pin bernomor.
- **Berkas:** `src/renderer/src/screens/kunjungan/visualProfiles.ts` (tabel `slamet_k1` sekitar `:147-149`), `visualProfiles.test.tsx`, `Kunjungan.tsx` (`:447` panel Catatan Observasi, `:511-513` pembuka), `Kunjungan.css` (`:163-187`).
- **Langkah:** (a) pindahkan `slk1_h4` (piala) ke piala sungguhan pada adegan M12 Slamet (perkiraan `[41,33]`; buka gambar adegannya dan tempatkan dengan mata, jangan tebak); (b) tambah invariant test: untuk setiap skenario, jarak pusat antar hotspot pada pelat 853×480 ≥ 50 px; (c) teks pembuka babak 1 ditambah satu kalimat instruksi ("Klik benda di ruangan yang menarik perhatianmu."); panel Catatan Observasi menampilkan "0 dari N titik ditemukan" (N sudah publik lewat aria-label `:432`); (d) opsional: opasitas idle hotspot ≈ 0,55–0,6 dengan garis tepi statis gelap agar kontras ≥ 3:1, dikunci test CSS/snapshot; **tanpa** animasi denyut atau sapuan cahaya.
- **Kriteria terima:** test jarak hijau untuk 27 skenario; `ketut_k1` yang 46 px ikut diperbaiki; kalimat instruksi tampil sekali per kunjungan; hitungan bertambah tiap hotspot diklik; `prefers-reduced-motion` tak berubah.
- **Jangan:** memakai kata "Salam & Observasi" sebagai alasan (SAJI = Salam–Ajak bicara–Jelaskan & bantu–Ingatkan; observasi adalah tambahan tim game); jangan namai panel "buku saku" (bertabrakan dengan Dex SKDI).

### PK-2 — Peta yang jujur
- **Tujuan:** peta berhenti menjadi alarm merah seragam; kanal kemajuan yang benar-benar dinilai tampil; meter/chip mengikuti provenance.
- **Konteks:** §7.4 butir 3–5. Kunci #12 (warna petak 1:1 klasifikasi) tetap.
- **Berkas:** `screens/PetaDesa.tsx`, `peta/PetaSvg.tsx`, `peta/petaUtil.ts`, `peta/KartuKeluarga.tsx`, `PetaDesa.css`, `styles/base.css` (kelas meter netral), test `PetaSvg.test.tsx`, `KartuKeluarga.test.tsx`, `petaUtil.test.ts`.
- **Langkah:** (a) chip "Δ vs baseline" per RW di label petak dan panel RW: `rw.iks − (rw.proporsiBaselineRoll ?? rw.iks)`, format "+0,04" / "−0,02" / "0,00"; tooltip "kenaikan IKS di atas data awal kader — inilah yang dinilai rapor"; (b) mendung digerbang "Δ < 0" (bukan kelas absolut); (c) legenda: sembunyikan item sehat/pra-sehat atau beri keterangan "belum ada RW yang mencapai"; (d) meter IKS: bila `!dataIksLengkap`, pakai kelas netral abu baru (jangan mengosongkan kelas karena default hijau); (e) chip klasifikasi warna penuh hanya bila ≥ 1 indikator relevan bersumber `'dokter'`; sisanya label tambahan "(laporan kader)"; chip roster (`PetaDesa.tsx:248`) diberi "≈" bila sementara.
- **Kriteria terima:** Hari 3 preview: 15 dari 16 kartu chip netral **dan** meter netral; RW dengan satu binaan sehat menampilkan Δ positif; warna petak tidak berubah dari sebelumnya untuk state yang sama (snapshot warna).
- **Jangan:** membaca `statusSebenarnya`; mengubah `klasifikasiIks`; menampilkan angka baseline sebagai "target".

### PK-3 — PWS-KIA mini di tombol Posyandu
- **Tujuan:** Posyandu menjadi keputusan bersasaran, bukan ritual 2 stamina.
- **Konteks:** engine hanya memutakhirkan tiga indikator KIA (`imunisasi_dasar`, `asi_eksklusif`, `pantau_tumbuh_kembang`; daftar di `reducer.ts:50-64`, **tidak diekspor**) pada keluarga bersumber kader di RW itu (`reducer.ts:2297-2316`); 4 RW (2, 4, 5, 6) tak punya keluarga bersasaran KIA; 25% dek tidak membuka meja KIA. Skor juri tertinggi (8,08).
- **Berkas:** `peta/petaUtil.ts` (helper `kolomKiaKader(state, rw)` + konstanta `KIA_POSYANDU` salinan 3 id), `PetaDesa.tsx` (`:321-330` tombol), `MejaKerja.tsx` (satu baris di modal Lokmin), test.
- **Langkah:** hitung `N` = jumlah (keluarga di RW × indikator KIA) dengan `sumber === 'kader'` dan `status !== 'na'`. Teks tombol/tooltip: N > 0 → "N kolom KIA di RW ini masih laporan kader; meja yang terbuka ditarik saat sesi, jadi tak semuanya pasti tercocokkan"; N = 0 → "Tak ada kolom KIA berlaporan kader di RW ini; sesi tidak mengubah data keluarga, hanya bonus kecil IKS RW". Lokmin: daftar RW yang masih menyisakan kolom KIA kader.
- **Kriteria terima:** angka sama dengan hitungan manual dari state; test paritas yang membaca teks sumber `reducer.ts` untuk memastikan 3 id salinan tidak melenceng (pola `hashFile` di `freeze.test.ts`).
- **Jangan:** menulis "akan diverifikasi"; mengutip resi "Seluruh data KIA konsisten"; membuat tabel PWS 8 baris (ditunda).

### PK-4 — Kader bernama di permukaan yang masih anonim
- **Tujuan:** delapan kader punya nama sepanjang stase tanpa membocorkan ketelitian/bias.
- **Konteks:** `state.desa.kader` sudah memuat nama (`state.ts:296`); surat keliling harian sudah bernama (`kader.ts:328`, format "Bu Endang — kader Kampung Sumber Agung"); yang anonim: panel RW, tiga surat reducer "Kader RW n", chip surat, Tas Kunjungan, tooltip PERLU PERHATIAN.
- **Berkas:** `peta/petaUtil.ts` (helper `kaderRw(state, rw)`), `PetaDesa.tsx:275-305`, `MejaKerja.tsx` (`:59-72` `metaSurat`, `:503`, `:602`, `:231`), `KartuKeluarga.tsx:120`, test.
- **Langkah:** (a) panel RW: baris "Kader: Bu Endang"; (b) Kotak Masuk: render pengirim "Kader RW n" menjadi "<nama> — kader RW n, <kampung>" lewat pemetaan tampilan (regex pada `surat.dari`; data surat tidak diubah; pertahankan nomor RW); (c) `metaSurat(surat)` memberi chip "Surveilans" bila `surat.dari === 'Petugas Surveilans'` (kini salah berlabel "Laporan Kader"); (d) Tas Kunjungan dan tooltip: "Kabar dari wilayah Bu Endang (kader RW 5): kondisinya memburuk" (bukan "Bu Endang mendengar" — berita karma datang dari perawat jaga).
- **Kriteria terima:** tidak ada teks "Kader RW n" polos yang tersisa di UI; persona/ketelitian tidak pernah dirender; `kaderRw(9)` → null aman.
- **Jangan:** nama kader di kepala Posyandu (ditunda sampai delegasi membaca ketelitian); kartu kenalan kader (ditolak); mengubah konten kader (nama tabrakan = §9 pertanyaan 3; sementara pakai sufiks "— kader RW n" di semua permukaan).

### PK-5 — Berkas kasus di dalam Respons KLB + RW di kepala panel Kegiatan
- **Tujuan:** kartu verifikasi/penyelidikan KLB bertumpu pada diagnosis poli mahasiswa sendiri; layar Kegiatan punya tempat.
- **Konteks:** `KegiatanState.rw/kasusId` (`state.ts:402-406`) belum dibaca `Kegiatan.tsx`; `state.desa.surveilans` menyimpan `{hari, rw, kasusId, pasienNama}` (`surveilans.ts:11-22`), hanya diagnosis benar (`reducer.ts:1266-1274`); `pangkasSurveilans`/`hitungCluster` diekspor (`surveilans.ts:56-118`) dan dedup per orang.
- **Berkas:** `Kegiatan.tsx` (`:121-144` kepala; blok baru di bawah narasi untuk `kg.jenis === 'klb'`), `Kegiatan.css`, test.
- **Langkah:** kepala panel semua jenis: "RW n — <nama kampung> · Hari h". Untuk KLB: daftar per orang "Hari n · Nama (2 kunjungan)" dari entri yang cocok (rw, kasusId) dalam 14 hari; angka "tercatat" dari `hitungCluster`; kalimat pengantar "Terkonfirmasi di poli; yang belum ada: definisi kasus dan kasus yang belum datang ke poli." Render dari `kg` (kompatibel PK-0).
- **Kriteria terima:** daftar cocok dengan chip KLUSTER di peta; tidak ada angka ambang di layar; tidak ada "Laporan W1".
- **Jangan:** menampilkan `ambangKluster` (kalibrasi; sudah masuk sidik jari); membuat "Laporan W1" penutup (jalur sukses menghapus entri, `reducer.ts:2519-2523`); memakai kata "tanding/lawan".

### PK-6 — Koreksi atas laporan kader bernama + delegasi transparan
- **Tujuan:** verifikasi dokter yang meluruskan data kader terlihat; delegasi Posyandu berhenti menjadi kotak hitam.
- **Konteks:** kunjungan menimpa status kader dengan `statusSebenarnya` + sumber `'dokter'` tanpa jejak (`kunjungan.ts:600-609`); Posyandu sama (`reducer.ts:2294-2312`). `hasil.indikatorTerverifikasi` (hotspot + ungkap jujur) membedakan dari `indikatorDibohongi` — **wajib** dipakai agar warga yang berbohong tidak dicatat sebagai kesalahan kader. Untuk Posyandu: `HasilKegiatan.jawaban[{kartuId, pilihanId, benar}]` sudah ada.
- **Berkas:** `store.ts` (hitung `koreksiKader[]` saat events memuat `KUNJUNGAN_SELESAI`/`KEGIATAN_SELESAI`, bandingkan state sebelum/sesudah; reset saat hari berganti; state UI sesi, bukan save), `PetaDesa.tsx:383-440` (modal hasil kunjungan), `Kegiatan.tsx:246-290` (KartuHasil), test.
- **Langkah:** (a) kunjungan: hanya indikator di `indikatorTerverifikasi` yang `prev.sumber === 'kader'` dan status berubah → kalimat "Kolom Imunisasi dari laporan Bu Endang, kader RW 5: tercatat ya, kamu lihat sendiri tidak. Kolom ini memang sulit ditanyakan kader — verifikasi sendiri di rumah lain RW ini."; (b) Posyandu: syarat `prev.sumber === 'kader'` && status berubah pada keluarga RW itu; (c) panel penutup Posyandu setelah delegasi menampilkan rekap per kartu: judul kartu, siapa yang menjawab (kamu/kader), tepat/keliru — bangun ulang dek dengan `kartuPosyandu(new Rng(seedKurikulum, 'posyandu', hari, rw))` seperti `reducer.ts:1733` bila judul tidak tersimpan.
- **Kriteria terima:** skenario warga berbohong tanpa hotspot → tidak ada kalimat koreksi kader; skenario hotspot mengungkap data kader salah → kalimat muncul dengan nama kader RW yang benar; rekap delegasi cocok dengan `hasil.jawaban`.
- **Jangan:** tally "N koreksi" di panel RW (tak ada mekanik yang membacanya); persistensi ke save (= field state = §10); menyebut persona/bias kader.

### PK-7 — Lokmin dan Rapor yang tidak menuduh dan tidak menyembunyikan
- **Berkas:** `MejaKerja.tsx:1318-1332` (panel ongkos), `PetaDesa.tsx` (penanda RW fokus dari `state.program`), `Rapor.tsx:188-200` (tally sesi), test `MejaKerja.lokminOngkos.test.tsx`.
- **Langkah:** (a) panel ongkos dua daftar: kluster penyakit **target** program di RW lain → "dana bulan ini hanya bekerja di RW yang kamu pilih" (akurat, disengaja); kluster penyakit **non-target** atau saat fokus belum ditetapkan → "tidak ada program untuk X — butuh Respons KLB (buka Hari 45)"; (b) penanda RW fokus di peta; (c) Rapor UKM menampilkan jumlah sesi Posyandu/Prolanis/KLB dari tally yang ada (`badge.ts:76-78` membacanya); (d) baris "slot siang kosong: n" di Lokmin; (e) perbaiki label "dikunci di Lokakarya Mini" → "dikunci sampai awal bulan berikutnya" (`MejaKerja.tsx:821`).
- **Jangan:** biaya stamina/kas untuk program; dr. Ratih dinamis; tally supresi/perisai (reducer → §10).

### PK-8 — Peringatan jadwal Prolanis
- **Berkas:** `MejaKerja.tsx:775-786` (tombol Prolanis), `JejakPerawatan.tsx:206`, test cadence terlambat (tambahan pada `m2program.test.ts:356-363` yang hanya menguji jalur tepat waktu).
- **Langkah:** tampilkan "Sesi ke-k dari 3 · sesi terakhir yang masih mungkin: hari X" dari `state.prolanis.sesiBerikutHari + 30·(3−k)` vs 90 (Ujian: +10 vs 30); bila sesi ketiga akan hangus, kalimat peringatan "tunda satu hari berarti sesi ke-3 jatuh di luar stase".
- **Jangan:** jangkar ke kalender D30/60/90 (reducer → §10).

### PK-9 — Label gaya ke debrief, kalimat stok, tooltip roster, urutan kandidat
- **Berkas:** `Kunjungan.tsx:538-544` (label gaya), `:97-113` (4 kalimat stok), `debriefNarator.ts:97-103` (jalur debrief, tidak beku), `KartuKeluarga.tsx:266` (tooltip), `PetaDesa.tsx:110-115` (urutan kandidat) memakai prioritas yang sama dengan `saranKunjungan` di `MejaKerja.tsx:209-260`, test `Kunjungan.test.tsx`, `transkrip.test.ts`.
- **Langkah:** (a) label "Gaya: ♡ Empati" tidak tampil pasca-pilih; tampil di debrief sore per kunjungan (daftar gaya yang dipakai, tanpa menyebut node mana yang keliru); (b) hapus kalimat stok atau ganti dengan kalimat netral yang tidak bergantung tanda efekTrust; (c) tooltip "Jadikan Binaan": "Sejak masuk roster, keluarga yang lebih dari 7 hari tak dikunjungi bisa memburuk dan menurunkan IKS RW."; (d) kandidat panel RW diurut prioritas (karma terlihat → janji jatuh tempo → IKS terendah), bukan abjad.
- **Jangan:** mengubah konten opsi (refleksi keliru / edukasi tepat = §9 pertanyaan 6).

### PK-10 — Tunda narasi kartu meleset dan vonis ke debrief kunjungan berikutnya (tahap D)
- **Berkas:** `MejaKerja.tsx:710` (panel siang membaca `hasilNarasi`), `PetaDesa.tsx:383-440` (modal hasil), `debriefNarator.ts:98` (vonis tepat/meleset), test.
- **Langkah:** untuk keluarga yang `arcSelesai` belum terisi: `hasilNarasi` kartu meleset, catatan pembimbing kartu, dan label "Dugaan hambatanmu tepat/meleset" **tidak** dirender hari itu; cukup "sasaran meleset — coba pahami lagi rumah ini". Tampil penuh di debrief kunjungan berikutnya keluarga yang sama, atau saat arc tamat. Mode Ujian ikut aturan yang sama. Skor MI dan angka rincian lain tetap tampil.
- **Kriteria terima:** replay kunjungan gagal → hari itu tidak ada teks yang menyebut hambatan sebenarnya; kunjungan berikutnya berhasil → debrief memuat narasi kartu meleset kemarin + hasil hari ini.
- **Jangan:** jeda follow-up, plafon trust, penundaan karma (semua `kunjungan.ts`/`reducer.ts` → §10).

### PK-11 — Copy dan aksesibilitas kecil (UKM + UKP)
- "Catatan pembimbing" (`debriefNarator.ts:104` memakai `ukmCitations.ts:257`): tulis ulang makna dulu, nomor KMK di akhir dalam kurung; label "Adaptasi beralasan" diganti kalimat manusiawi.
- Nudge edukasi (`DeckTerapi.tsx`): nama tab masuk ke teks/aria ("buka tab Edukasi (0/3)").
- Toast "Buku Saku diperbarui (+1)" hanya bila entri masuk katalog 144, atau ubah kalimatnya untuk kasus non-144.
- Tooltip "Stempelkan Diagnosis" pada tombol nonaktif: pastikan tidak menimpa caption (pola dual `title`/`data-tip`).
- Daftar lab: setelah "Pesan", pertahankan posisi gulir dan fokus pada item (konfirmasi dulu di Electron).
- Surat drift/janji/episode yang mencetak id mentah (`tb berobat standar`, `jkn`, `kb`): pemetaan tampilan di renderer saat merender isi surat/episode → `LABEL_INDIKATOR.penuh`.
- Jargon: pembungkus kecil `data-tip` untuk ±25 akronim (PIS-PK, MI, SAJI, KEK, LILA, GDP, PTM, KMS) di label kartu kegiatan, Rapor, debrief; "Kualitas komunikasi (MI + SAJI)" → "cara bicara ke keluarga" dengan tip.
- Landasan Resmi: paragraf tetap terbuka hanya pada tayangan pertama per jenis (kunci di `laciPersist`, **bukan** localStorage per instalasi yang gagal untuk PC berbagi; ikat ke state/nama dokter), sesudahnya `<details>` terlipat; aside sitasi pra-penilaian di Resep Sosial diganti chip Pinkesga + satu tautan "Sumber".
- Tas Kunjungan menjadi tombol yang melompat ke kartu keluarga (`setPetaTargetKeluargaId` + `PINDAH_LAYAR` peta, mekanisme surat).

### PK-12 — Debrief UKP: teks temuan PF terlewat, rupiah lab terbuang, cetak rekam medis
- **Berkas:** `klinik/PanelHasil.tsx`, `LembarPeriksa.tsx` (template cetak), IPC Electron di `src/main` + `src/preload` untuk `printToPDF` (preview: `window.print`), `JejakPerawatan.tsx`.
- **Langkah:** (a) `DaftarGap` "Pemeriksaan relevan terlewat" menampilkan teks temuan (`temuanUntukRegion(kasusEfektif(...), region)`); (b) chip "Lab tak relevan ×n · Rp X terbakar dari kapitasi" (jumlahkan biaya lab tak relevan dari katalog); (c) tombol "Cetak RM" → HTML cetak ber-kop Puskesmas, No. RM, SOAP, resep, edukasi, disposisi; status "menyiapkan… / ✓ tersimpan" (tidak sukses senyap).
- **Jangan:** menampilkan gap sebelum disposisi (bocor); menyentuh `clinic.ts`.

### PK-13 — Menunggu keputusan dokter sebelum dimulai (siapkan, jangan eksekusi)
Mode Latihan Bebas per kategori (UKP-E), taksonomi laci edukasi (U1), kesan pertama pasien (UKP-D), opsi wawancara refleksi-keliru/edukasi-tepat, resep sosial "juga benar", rename kader, label "Investigasi kontak" vs "Sinyal KLB", kabar desa pasca-tuntas. Boleh menyiapkan desain teknis dan daftar berkas, tidak boleh mengubah kode sebelum dokter menjawab §9.

---

## 9. Keputusan yang tetap milik dokter (ASTRA dilarang memutuskan)

**Dari brainstorm UKP (dosier OSCE):**
1. Jalur full trial: A manual penuh / B berbasis risiko / C delegasi bulk / D trial dua tingkat (121 dari 137 kasus lab belum bertanda tangan; rekomendasi Claude B+C).
2. P1 Kegiatan diperbaiki sekarang di jalur UI? (rekomendasi ya — PK-0 boleh dianggap disetujui secara teknis karena tidak menyentuh keputusan klinis, tetapi laporkan).
3. Mode Latihan Bebas: sebelum atau sesudah trial?
4. Kesan pertama pasien: observasional generik = "yang dokter lihat" atau bocor?
5. Taksonomi edukasi: pecah laci > 15 menurut organ/alat?
6. Anamnesis ketik bebas: pilot pasca-trial di Karier?
7. LLM: posisi A (tanpa runtime) + B (alat penulis offline), tolak C (runtime)?
8. Empat pertanyaan klinis 23 Agustus (alergi makanan L27.2/L50.0/T78.1; cacing tambang B76.0/B76.9; cakupan KMK 1936 vaginitis kandida; potensi steroid numularis) dan dosier koding 22 Agustus §5 (servisitis N89/N72, kekerasan tumpul/tajam, kepadatan 3 opsi, bobot `closureRate`, clue stroke).

**Dari brainstorm UKM:**
9. Posyandu dan KLB: keputusan #5 (16 Juli) tetap? Bila diputus ulang: `klbTuntas` → `tally.karmaDicegah`; Posyandu dinilai lewat jumlah keluarga KIA berpindah provenance kader→dokter (rasio ternormalisasi).
10. Kunjungan ulang: jeda 2–3 hari untuk partial/gagal + plafon trust (engine); tunda-tampil display-only sekarang (PK-10) boleh?
11. Rename kader Pak Slamet RW 2 (mis. "Pak Sarwo") dan pertimbangkan Bu Ketut Ayu RW 7 (nama tidak masuk hash; nol CONTENT_RELEASE).
12. Koreksi laporan kader boleh menyebut KOLOM (membuka pola bias kader dalam 2–3 koreksi)?
13. Ambang kluster boleh tampil? (rekomendasi: tidak).
14. Kosakata MI: 4 gaya sebagai "gaya percakapan" + tambah 6–8 node edukasi tepat, atau tulis ulang ke OARS?
15. Delegasi Posyandu dibatasi ke kartu ukur/catat/penyuluhan, membaca ketelitian kader, mengembalikan 1 stamina? (Golden Master.)
16. Bingkai "Investigasi kontak" untuk TB/kusta/IMS lewat pemetaan renderer per kasus; "5W1H" → "Orang-Tempat-Waktu".
17. Resep Sosial: kartu skrining kontak TB "juga benar"? Atau tulis skrining Bagas sebagai langkah otomatis di penutup/pembuka kunjungan berikutnya (konten)?
18. Definisi usia PIS-PK KIA pada anggota keluarga konten; kalimat besaran parameter di narasi Prolanis; kartu Posyandu remaja (Hb sebelum TTD terapi).

---

## 10. Tingkat 3 — jendela REVISI_ENGINE (Golden Master, bump 73). Catat, jangan kerjakan
- Jeda follow-up partial/gagal (`kunjungan.ts:642`) + plafon trust kunjungan ulang skenario sama (pola `TRUST_PLAFON_SILATURAHMI`, `reducer.ts:178-186`) + penundaan karma ditutup bila kartu meleset (`reducer.ts:1586-1603`).
- `klbTuntas` → `tally.karmaDicegah` (`reducer.ts:2529`) atau suku skor Posyandu/KLB ternormalisasi.
- Delegasi Posyandu: flag `bolehKader` per kartu, peluang per ketelitian kader RW, kembalikan 1 stamina (`kegiatan.ts:799-817`, `reducer.ts:1731-1733`, `:2277`).
- Jangkar sesi Prolanis ke kalender (`reducer.ts:2479`).
- Tally supresi program & perisai drift per bulan (`reducer.ts:3447`, `:3368`) → baris positif Lokmin; surat "janji ditepati" memakai `LABEL_INDIKATOR` (`reducer.ts:3316`).
- Export `INDIKATOR_PER_KARTU_POSYANDU` & `SEMUA_INDIKATOR_KIA_POSYANDU` (`reducer.ts:50-64`) agar salinan renderer PK-3 dihapus.
- Aksi sore "Bimbing kader RW n" berkuota mingguan (`actions.ts` + `reducer.ts`; ketelitian/bias ada di sidik jari replay `verifikasi.ts:1007`).
- Persistensi koreksi kader (field `GameState` + allowlist `save.ts`).
- UKP: pertanyaan universal ber-state (UKP-F), anamnesis ketik bebas (UKP-G), kolam distraktor diagnosis (UKP-H), arsip debrief lintas hari (`selesaiHariIni` → riwayat), Kegiatan: kartu Posyandu remaja (Hb), tier kartu Prolanis "tak terkendali berat".
- Selaraskan GDD §3 vs §6 soal ongkos RW terpencil.

---

## 11. Protokol kerja dan pelaporan

1. **Sebelum menyentuh apa pun:** baca `freeze.test.ts` (daftar beku aktual), `docs/PEDOMAN_AUTHORING_UI.md`, `docs/GDD.md` §2, §6, §11, `docs/ADJUDIKASI_DELEGASI_2026-08-21.md`, dan dua dosier 11 September. Jalankan `npm.cmd run typecheck` dan `npx.cmd vitest run` untuk baseline (harus 0 / 1.701 hijau).
2. **Verifikasi setiap rujukan baris** di dokumen ini sebelum mengedit; catat bila bergeser.
3. **Urutan:** PK-0 → PK-1 → PK-2 → PK-3 → PK-4 → PK-5 → PK-6 → PK-7 → PK-8 → PK-9 → PK-10 → PK-11 → PK-12. Satu paket = satu commit (boleh dipecah). Jangan menggabungkan dua paket dalam satu commit.
4. **Tiap paket:** tulis test dulu atau bersamaan; jalankan `typecheck`, `vitest run`, `freeze.test.ts`; untuk fitur interaksi, buka preview `puskesmas-pagi-preview` (atau Electron) dan lakukan klik sungguhan; tangkap layar sebelum/sesudah dan simpan di `docs/bukti/` bila diminta.
5. **Jangan sentuh** berkas §2.3. Bila sebuah perbaikan "lebih rapi" lewat engine, catat di laporan sebagai kandidat §10 dan kerjakan versi renderer.
6. **Teks pemain** mengikuti §0.4. Jangan `alert/confirm`. Jangan emoji baru di tombol (arahnya glyph tinta).
7. **Preferensi kosmetik** (laci terbuka/tertutup, "sudah lihat Landasan") → `utils/laciPersist.ts` atau state UI sesi, **bukan** save/skor, dan hati-hati dengan PC lab berbagi (jangan kunci per instalasi untuk hal yang harus dilihat tiap mahasiswa).
8. **Laporan per paket** memakai tujuh keadaan (§0.3), menyebut file yang diubah, test yang ditambah, angka test sebelum/sesudah, dan apa yang **tidak** dikerjakan beserta alasannya.
9. **Jangan pernah** melaporkan hasil agen/alat lain tanpa memeriksanya sendiri; jangan mengubah keputusan teradjudikasi dengan bukti sepihak (pola insiden "fix M6 ter-revert diam-diam" dan "N89/N72").
10. **Rilis** (bila diminta dokter) mengikuti `docs/PROSEDUR_RILIS.md`: naikkan versi di `package.json` + `package-lock.json`, commit bersih, `npm run dist` (gerbang `check:provenance`), tag `test-beta-<hash7>` tepat di commit sumber, baru `gh release create`. Installer lama diarsip ke `C:\Users\HP\PRIMERA-dist-archive` karena drive D sering penuh.

---

## 12. Lampiran

### 12.1 Peringkat 20 ide teratas menurut 3 juri (sebelum sanggahan) dan nasibnya
| Skor | Id | Judul singkat | Nasib |
|---|---|---|---|
| 8,08 | pedagogi-ikm-1 | PWS-KIA mini di tombol Posyandu | **PK-3** |
| 7,98 | detektif-2 | Alamat pasien di lembar periksa + stempel kasus ke-n | ditolak (RW pasien diundi seragam; anchoring palsu) |
| 7,95 | detektif-4 | Berkas kasus KLB + Laporan W1 | inti → **PK-5**; W1 ditolak |
| 7,85 | detektif-1 | Register PWS per RW pra-alarm | ditolak (engine membuang entri; 67% orang sama) |
| 7,73 | football-7 | Laporan tanding KLB dari data sendiri | dilebur ke PK-5 |
| 7,63 | harvest-2 | Krisis dicegah mendapat paragraf | ditolak (kode mati; kontrafaktual dilarang) |
| 7,63 | pedagogi-ikm-3 | Kartu KLB baca surveilans + kurva | dilebur ke PK-5; kurva ditolak |
| 7,63 | juice-1 | Buku saku observasi + sapuan cahaya | instruksi & hitungan → PK-1; sapuan ditolak |
| 7,57 | pedagogi-ikm-6 | Audit data kader bernama | **PK-6** |
| 7,57 | pengurangan-8 | Hapus stempel Kegiatan, pita, kepala RW | render vonis + kepala RW → PK-0/PK-5; hapus stempel ditolak |
| 7,57 | juice-2 | Kepala lembar "terakhir kali di rumah ini" | ditolak; sisa: nama keluarga di Agenda Besok (boleh masuk PK-11) |
| 7,53 | juice-4 | Kader bernama | **PK-4** |
| 7,43 | harvest-1 | 8 kader bernama versi penuh | inti → PK-4; kartu kenalan ditolak |
| 7,43 | football-2 | Delegasi bertingkat | §10 |
| 7,43 | pedagogi-ikm-8 | Rapor berbahasa kompetensi | disimpan; boleh masuk PK-11 sebagai tooltip suku skor |
| 7,38 | pengurangan-1 | Respons warga menyatu dengan node berikutnya | disimpan (display-only, belum diverifikasi) |
| 7,35 | pengurangan-4 | Program Wilayah pindah ke panel RW | disimpan |
| 7,32 | detektif-5 | Kasus dingin kluster padam | disimpan (perbaikan bug UX: Jejak Perawatan menyuruh aksi yang engine tolak, `reducer.ts:1779`) |
| 7,30 | football-1 | Rekam jejak scout | tahap 1 → PK-6 |
| 7,25 | pedagogi-ikm-4 | Program Wilayah dari data | disimpan |

### 12.2 Dokumen rujukan
`docs/BRAINSTORM_OSCE_SIM_V4_2026-09-11.md` · `docs/BRAINSTORM_UKM_2026-09-11.md` · `docs/GDD.md` · `docs/ROADMAP.md` · `docs/ADJUDIKASI_DELEGASI_2026-08-21.md` · `docs/ADJUDIKASI_MENUNGGU_DOKTER_2026-08-23.md` · `docs/DEEPTHINK_DOSIER_MENYELURUH_2026-08-22.md` · `docs/PEDOMAN_AUTHORING_UI.md` · `docs/PROSEDUR_RILIS.md` · `docs/M45_MODE_UJIAN.md` · `docs/M12_VISUAL_PASS.md` · `docs/UKM_ASSURANCE_RELEASE_2026-07-19.md` · `docs/UKM_KLB_TRANSMISSION_MAPPING.md`.

### 12.3 Angka verifikasi mandiri (boleh dikutip)
16 keluarga · 27 skenario · 85 node dialog · 255 pilihan · 123 hotspot · Refleksi 45/45 tepat · Empati 37/37 · gaya terlarang 0/82 · Edukasi 9/91 · opsi terpanjang benar 68/85 · jeda kunjungan hanya bila berhasil · kartu Posyandu Langkah 5 konstan · hotspot Slamet [59,30]/[60,34] · skrining TB `sk1_i4` kunci `kesempatan` pada hambatan `motivasi`.
