# M11 — Brief Rekognisi untuk CODEX (READ-ONLY, full-scale deep & wide)

**Status:** brief kerja, ditulis 2026-07-10 SETELAH seluruh audit M10 tuntas (dossier §36–§54).
**Sifat pekerjaan:** BEDA total dari brief M10. M10 = mencari yang RUSAK/tak konsisten. **M11 =
PENGAYAAN & poles** — menambah hal baik, bukan memperbaiki bug. Karena itu tugas CODEX di sini
BUKAN "temukan bug", melainkan **REKOGNISI**: baca seluruh basis kode secara lebar & dalam, lalu
hasilkan **INVENTARIS TERSTRUKTUR** yang menjadi bahan mentah pekerjaan konten M11 nanti.

**Read-only mutlak.** Jangan edit/hapus/buat file apa pun. Laporkan kembali ke Claude untuk
ditriase → Claude yang mengeksekusi (bersama keputusan user Dr. Wirayuda untuk hal medis).

**Konteks lengkap:** `docs/CODEX_AUDIT_DOSSIER.md` §36–§54 (riwayat M10), `docs/M10_BATCH3_MEDIS.md`
(dokumen keputusan medis + gaya sitasi), memory milestone M11.

---

## 0. Kenapa brief ini ada & apa yang diharapkan

M11 adalah milestone pengayaan besar. User (dokter, pengembang tunggal) ingin CODEX melakukan
sapuan rekognisi read-only **lebih dulu** supaya saat pekerjaan konten M11 mulai, sudah ada peta
lengkap: kasus mana yang butuh apa, peluang di mana, dan (untuk item mekanik yang dipindah dari
M10) analisis kode yang presisi. Deliverable = **daftar/inventaris per workstream**, bukan prosa
opini. Sedalam & selebar mungkin — tapi TERSTRUKTUR agar bisa langsung dipakai.

**Prinsip penting untuk semua workstream:** untuk klaim MEDIS/FAKTUAL apa pun (mis. "obat X tak
tersedia di Puskesmas nyata", "temuan Y bisa normal-menyesatkan"), CODEX **HANYA mengusulkan
kandidat + alasan**, TIDAK memvonis sebagai fakta. Verifikasi faktual dilakukan belakangan lewat
riset web + penilaian dokter (pola sama Batch-3 M10). Tandai keyakinan tiap kandidat.

---

## 1. Orientasi arsitektur (fakta, verifikasi ulang bila ragu)

Root: `primera-desktop/`. Statistik terkini (recount bila perlu):
- **67 kasus klinis** playable di `src/content/kasus/*.ts` (7 file: kasusInfeksi/kasusKronis/
  kasusRespGi/kasusKulit/kasusSarafMataTht/kasusMetabolikMsk/kasusKiaJiwa).
- **5 kasus IGD** (`src/content/igd.ts`), **16 keluarga binaan** UKM (`src/content/keluarga/
  desaA-F.ts`), 8 kader/RW.
- Katalog: ~90 obat, 23 lab, ~40 topik edukasi, 8 tindakan (`src/content/katalog.ts` +
  `katalogM3.ts`). Kontrak tipe TUNGGAL: `src/content/types.ts` (baca ini duluan).
- Engine murni TS di `src/engine/` (tanpa React). Skor 4 dimensi: `src/engine/scoring.ts`
  (`hitungSkor` baris 40). Skoring per-encounter: `src/engine/clinic.ts` (`nilaiEncounter`).
- UI React: `src/renderer/src/screens/`. `REVISI_ENGINE = 17` (verifikasi.ts).

**Mekanik yang WAJIB CODEX pahami sebelum mengusulkan (baca kodenya):**
- `KasusKlinis` (types.ts): `anamnesis[]` (dgn `esensial`/`distraktor`/`variasi` per-persona/
  `oldcarts`/`hanyaUntuk`), `pemeriksaanFisik[]` (`relevan`), `lab[]` (`relevan`/`hasilBesok`),
  `tatalaksana` (`obatBenar`/`obatAlternatif`/`obatOpsional`/`prosedur`/`edukasi`/`edukasiKritis`),
  `konsekuensi`, `demografi`, `prevalensi`, `clue`.
- **Pola "cap-to-50" yang sudah ada** (penting utk item mekanik dipindahan): `vitalDiukur` →
  `skorPemeriksaan` di-cap 50 bila vital tak diukur (clinic.ts:448); `edukasiKritis` → `skorEdukasi`
  di-cap 50 bila topik kritis terlewat (clinic.ts:580-583). Ini TEMPLATE untuk gate baru.
- `variasi` persona (polos/terpelajar/skeptis/cemas/lansia/wali_anak) SUDAH ada utk gaya bahasa
  jawaban — M11 "variasi presentasi" BERBEDA (variasi FAKTA/PRESENTASI klinis, bukan gaya).

---

## 2. Workstream M11 & inventaris yang diminta

### W1 — Kandidat catatan EBM-nuance ("temuan klasik yang bisa menyesatkan")

Ide asal M11: kasus gout sudah punya nota "asam urat bisa NORMAL saat serangan akut — diagnosis
tetap klinis". User ingin lebih banyak yang sejenis. **Deliverable:** untuk SETIAP dari 67 kasus +
5 IGD, identifikasi peluang nota EBM-nuance kelas "temuan penting bisa normal/atipikal/
menyesatkan". Contoh yang dicari: leukosit normal pada apendisitis dini; rontgen dada normal pada
pneumonia sangat dini; EKG normal pada angina tak stabil; NS1 negatif tak menyingkirkan dengue;
CRP/kultur; window period serologi; dll.
Per kandidat laporkan: `kasusId` + `file:baris` (di mana nota akan menempel: clue/lab.hasil/
konsekuensi) + nuansa spesifik (1 kalimat) + apakah kasus SUDAH menyinggungnya (jangan usulkan
duplikat) + keyakinan (tinggi/sedang/rendah — rendah = perlu verifikasi dokter/web).

### W2 — Peluang "variasi presentasi penyakit yang sama" (anti-bosan)

Karena 50 mahasiswa memainkan 67 kasus yang sama berkali-kali dalam 90 (atau 30) hari, presentasi
identik tiap kali melemahkan engagement & pembelajaran. **Deliverable:** untuk tiap kasus, nilai
"seberapa sama-tiap-kali" dan identifikasi FIELD mana yang bisa mendukung varian presentasi TANPA
merusak skoring/replay. Fokus:
- anamnesis: jawaban baku yang bisa punya beberapa varian faktual (mis. lokasi nyeri, durasi,
  pemicu) yang tetap mengarah ke diagnosis sama.
- pemeriksaanFisik/lab: temuan yang bisa bervariasi derajat (mis. suhu, luas lesi, nilai lab dalam
  rentang) tanpa mengubah diagnosis benar.
- Kasus mana yang PALING monoton & paling untung divariasikan (prioritas).
Catat juga: RISIKO teknis — field mana yang IKUT `sidikJariPack` (verifikasi.ts) sehingga
menambah varian statis akan menggeser sidik jari/replay (butuh mekanik pemilihan-varian di
director, bukan sekadar tambah data). Tandai mana yang "aman konten" vs "butuh mekanik baru".

### W3 — Lapisan "idealis vs realita FKTP Indonesia" (butuh riset web nanti)

User: game sengaja menggambarkan FKTP idealis (semua obat/alat tersedia) agar breadth EBM bisa
diajarkan, TAPI ingin fitur yang membuat pemain SADAR celah antara "benar textbook" vs "tersedia
nyata di Puskesmas". Contoh jangkar: kolkisin utk gout akut (benar EBM, tapi biasanya TAK
distok Puskesmas). **Deliverable:** inventaris KANDIDAT celah idealis-vs-nyata — TANPA memvonis
faktanya (itu diverifikasi web belakangan). Sisir:
- obat di `obatBenar`/`obatAlternatif`/`obatOpsional` seluruh kasus yang PATUT dipertanyakan
  ketersediaannya di Puskesmas FKTP nyata (mis. kolkisin, mupirosin, sediaan khusus, antibiotik
  lini-2, dll) — cocokkan dgn field `fornas:true/false` di katalog sbg petunjuk awal.
- lab/tindakan yang mungkin tak tersedia di FKTP dasar (mis. lab tertentu, prosedur).
- friksi administratif/rujukan (SISRUTE/BPJS/PRB) yang di-idealisasi.
Per kandidat: id item + di mana dipakai + alasan diduga "gap realita" + `fornas` flag + keyakinan
(mayoritas akan "rendah — perlu riset web/dokter"). Ini bahan mentah, bukan kesimpulan.

### W4 — Variasi konten sisi UKM (kunjungan/kader/posyandu/prolanis)

Ide anti-bosan yang sama utk UKM. **Deliverable:** inventaris peluang variasi di
`src/content/keluarga/desa*.ts` (skenario kunjungan, dialog, hambatan) + program UKM (`kegiatan.ts`
kartu posyandu/prolanis/KLB) — mana yang repetitif, mana yang bisa punya varian tanpa merusak
mekanik karma/trust/IKS.

### W5 — Poles storyline & visual (observasi, bukan implementasi)

**Deliverable:** catatan peluang variasi storyline (surat/narasi/arc keluarga) + observasi poles
visual yang bisa disiapkan (tanpa masuk ranah M12 yang khusus aset seni besar). Ringkas — ini
paling longgar.

---

## 3. Lima item mekanik/skoring yang DIPINDAH dari M10 (butuh analisis KODE presisi)

Ini bukan "cari peluang" — ini item CODEX audit M10 yang faktanya sudah terverifikasi tapi
KEPUTUSANNYA desain (dipindah ke M11). Untuk tiap item, **deliverable = analisis kode presisi**:
"begini cara kerjanya sekarang (file:baris) + mengubahnya akan menyentuh apa saja + opsi
implementasi + apakah butuh REVISI_ENGINE bump/field types.ts baru". CODEX TIDAK memutuskan — ia
menyiapkan bahan keputusan.

- **P1.6 — Apakah mode Ujian menilai PROSES klinis?** `hitungSkor` (scoring.ts:40+) dimensi UKP
  didominasi diagnosis/disposisi/tally; sub-skor per-encounter (skorAnamnesis/PF/terapi/edukasi/
  grade) TAK dibaca ke grade akhir; `rmLengkap`→akreditasi baru berdampak hari 60 sedang Ujian
  tamat hari 30. Petakan: persis field/agregat apa yang masuk UKP sekarang, di mana sub-skor
  encounter "hilang", dan apa yang berubah bila mereka diikutkan (re-baseline test, rebalance
  karier?).
- **P1.7 / C.7 — Gate tes-konfirmasi utk skor diagnosis.** Malaria/TB/DM bisa grade bagus tanpa
  tes konfirmasi yang clue-nya wajibkan. Analisis: bagaimana skorDiagnosis dihitung (clinic.ts),
  di mana gate bisa disisipkan meniru pola `vitalDiukur`/`edukasiKritis` (cap-to-50), dan usul
  field baru (mis. `konfirmasiWajib?: labId`) + kasus mana yang butuh.
- **P1.9 — edukasiKritis terlewat → rmLengkap/konsekuensi?** Sekarang edukasiKritis terlewat hanya
  cap skorEdukasi ke 50; `rmLengkap` (reducer.ts:314) terima ≥50 & gerbang konsekuensi tak lihat
  edukasi. Analisis kopling: bagaimana rmLengkap & konsekuensi dihitung, dan apa dampak bila
  edukasiKritis-terlewat mendiskualifikasi "lengkap"/memicu konsekuensi.
- **C.1 — Mekanik stabilisasi hands-on.** Clue pneumonia berat/PPOK/CHF menyebut oksigen/IV pra-
  rujuk, tapi tak ada aksi "oksigen" & (sebelum §49) `pasang_infus` tak dipakai. Inventaris: kasus
  mana yang clue-nya menyebut stabilisasi hands-on tapi tak ada slot mekaniknya; apa yang perlu
  (aksi/tindakan `oksigen` baru? field wajib-stabilisasi?). Catatan: dasar MEDIS "kasus mana
  butuh stabilisasi apa" akan diriset web nanti — CODEX cukup petakan sisi KODE + kutip clue.
- **C.8 — Skrining alergi sbg butir keselamatan.** 40 dari 61 kasus ber-obat tak punya pertanyaan
  alergi; `rmLengkap` tak menuntutnya; hanya 6 kasus ber-`alergiTrap` menonjolkan alergi. Analisis:
  di mana "cek alergi" bisa jadi butir keselamatan TERPISAH (bukan dipaksa ke tiap rmLengkap),
  meniru pola gate yang ada; + inventaris 61 kasus ber-obat mana yang punya/tak punya pertanyaan
  alergi (daftar konkret). Justifikasi regulasi = Permenkes 74/2016 (pengkajian resep) +
  Akreditasi, BUKAN Permenkes 24/2022 (rekam medis) — lihat `M10_BATCH3_MEDIS.md` C.8.

---

## 4. Batas & DO-NOT

- **READ-ONLY.** Nol edit.
- **Jangan re-report bug M10** yang sudah difix (§36–§54) — M11 bukan ronde audit bug. Bila
  menemukan bug BARU yang genuine (bukan enrichment), boleh dicatat TERPISAH di bagian "temuan
  insidental", tapi itu bukan fokus.
- **Jangan memvonis fakta medis/realita-FKTP** sebagai kebenaran — semua klaim faktual =
  KANDIDAT ber-keyakinan, akan diverifikasi web + dokter (pola Batch-3).
- **Jangan masuk ranah M12** (aset seni/scene besar) — itu milestone terpisah.
- Hormati keputusan desain terdokumentasi (mis. tutorial kebal skor by-design; model dua-lapis
  clue/konsekuensi; `obatOpsional`/`hanyaUntuk`/cap-to-50 sbg mekanik yang sudah ada).

---

## 5. Format laporan

Per workstream, keluarkan DAFTAR terstruktur (bukan prosa panjang). Tiap butir:
`workstream` + `kasusId/itemId` + `file:baris` + usul/kandidat (1-2 kalimat) + (utk klaim faktual)
keyakinan + (utk item mekanik §3) sentuhan-kode & apakah butuh REVISI/field baru. Urutkan per
workstream, prioritaskan yang paling berdampak. Read-only — laporkan ke Claude untuk triase
(Claude verifikasi thd kode + jalankan riset web bila perlu + eksekusi bersama keputusan user).

**Ingat:** tujuan M11 adalah membuat game lebih KAYA, lebih TAHAN-MAIN-ULANG, lebih JUJUR soal
realita FKTP, dan lebih menghargai PROSES klinis — bukan menambal cacat. Inventaris CODEX adalah
fondasi agar pekerjaan itu presisi & tak menebak.
