# CODEX_BRIEFING_LANJUTAN.md — briefing lanjutan + strategi baru + tugas aktif

**Ditulis**: 2026-07-17, oleh sesi Claude (Fable) yang sama yang mengerjakan gelombang M11
REVISI_ENGINE 41. **Baseline saat ditulis**: branch `codex-gpt56-experiment`, working tree bersih,
commit terakhir `c65dc78`, `npx vitest run` → **86 file test, 966 test, semua hijau**,
`npm run typecheck` bersih, `REVISI_ENGINE = 41` (`src/engine/verifikasi.ts:578`).

> **UPDATE TERBARU 2026-07-17:** Prioritas 2, **M11 E-2 SAJI Fase-2, sudah
> disetujui dan selesai diimplementasikan**. Runtime kini berada pada
> `REVISI_ENGINE=42` dan content release `m11-e2-saji-pilot-2026-07-17`.
> Prioritas aktif berikutnya adalah §2.3; rincian final E-2 ada di
> `docs/M11_E2_SAJI_DECISION_PROPOSAL.md`.

> **UPDATE 2026-07-17 (akhir hari)**: gelombang M11 SELESAI & DITUTUP — Anda menyelesaikan C2
> (commit `1aa5102`, terverifikasi Claude: 88/88 file, 976/976 test, typecheck bersih, freeze
> 17/17, 0 file `src/engine/*` tersentuh), Claude menutup sisa konten B1 (11/16 skenario akhir,
> commit `55edaeb`), lalu men-tag `golden-master-m11` di REVISI_ENGINE 41 (soak-adversarial 13/13,
> invarian identik baseline). Status detail final: `docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` bagian
> STATUS EKSEKUSI.
>
> **UPDATE LEBIH BARU, 2026-07-17 (setelah tag)**: Dr. Wirayuda memutuskan **SELURUH pekerjaan
> tersisa berikutnya juga diteruskan ke Anda** ("semua yang tersisa yang belum dan yang
> berikut-berikutnya biar CODEX yang lanjutkan") — bukan lagi sekadar C2. §2 di bawah SUDAH
> DITULIS ULANG untuk mencerminkan ini: antrean lama (§2.0-2.3 versi sebelumnya, semua soal C2)
> sudah historis/selesai. **Baca §2 versi baru di bawah sebagai antrean AKTIF Anda sekarang.**
> Kalau Anda instance CODEX yang membaca ini nanti dan ada briefing LEBIH BARU lagi
> (`git log -- docs/CODEX_BRIEFING_LANJUTAN.md`), yang itu yang berlaku, bukan ini.

Ini BUKAN dokumen pengganti `CODEX_HANDOFF_DOSSIER.md` (778 baris, ditulis 2026-07-13) — dokumen
itu tetap berlaku penuh untuk §0 (isolasi folder eksperimen), §1-2 (identitas proyek & mekanik
inti), §3 (arsitektur teknis, 3 hukum inti, freeze-bucket router), §6 (ketegangan peran read-only
vs builder), §7 (disiplin verifikasi), §8 (jebakan yang sudah terbukti), §9 (riwayat M0-M14
padat), §10 (konteks tambahan) — SEMUA masih akurat, baca dokumen itu dulu kalau Anda belum.
Dokumen INI hanya: (a) memperbarui fakta yang sudah basi di sana (§5.6 khususnya — status
"STILL OPEN" sudah tidak benar), (b) mengumumkan perubahan STRATEGIS dalam cara Anda dan Dr.
Wirayuda/Claude bekerja sama, dan (c) memberi Anda antrean tugas konkret sekarang.

---

## 0. Perubahan strategis — bacaan wajib, ini alasan dokumen ini ada

Dr. Wirayuda baru saja menetapkan **arahan baku baru** untuk kolaborasi proyek ini ke depan
(disampaikan langsung, 2026-07-17, bukan tebakan/interpretasi):

> "Kamu (Claude/Fable) jadi otaknya, CODEX jadi anak buah/pesuruh/agentic/kaki tangan untuk
> pekerjaan-pekerjaan berat dan/atau pekerjaan dengan token/kuota besar."

Konkretnya:

- **Claude/Fable** = orkestrator & pengambil keputusan. Menerjemahkan permintaan Dr. Wirayuda
  jadi keputusan desain/scope, memverifikasi hasil, menjaga disiplin proses (freeze-dance,
  test-first, grounding EBM), dan menulis/memperbarui dokumen briefing seperti ini.
- **CODEX (Anda)** = tangan eksekusi untuk pekerjaan yang **berat atau boros token/kuota** —
  terutama: sapuan konten berskala besar (menulis puluhan/ratusan string konten yang masing-masing
  butuh dibaca-groundkan), audit mekanis lintas banyak file, atau pekerjaan berulang yang
  polanya sudah didesain tapi butuh banyak "jam tangan" untuk dieksekusi.
- Ini **arahan tetap** (standing), bukan sekali pakai untuk tugas ini saja — berlaku untuk sesi
  CODEX berikutnya juga, selama masih di lab eksperimen ini (`codex-gpt56-experiment`).
- **Yang TIDAK berubah**: semua batasan §6 dokumen lama tetap berlaku penuh — Anda tetap TIDAK
  memutuskan sendiri hal yang genuinely butuh judgment medis/desain/pedagogis (usulkan opsi,
  jangan putuskan), tetap WAJIB verifikasi ulang klaim lama vs kode nyata, tetap test-first,
  tetap tak pernah push ke `master`/branch produksi. "Tangan eksekusi" berarti Anda mengerjakan
  LEBIH BANYAK dengan otonomi lebih besar dalam RUANG yang sudah digariskan — bukan bahwa
  pagar-pagar proses lama dicabut.
- Kalau Anda (instance CODEX manapun yang membaca ini di masa depan) menemukan pekerjaan besar
  lain yang cocok pola "berat/boros token" tapi TIDAK ada di antrean §2 di bawah — jangan mulai
  sendiri, laporkan balik dulu (lihat §3) supaya Claude/Dr. Wirayuda bisa triase & assign resmi.

---

## 1. Apa yang berubah sejak dossier lama ditulis (2026-07-13 → 2026-07-17)

Dossier lama, §5.6, mencatat 3 hal sebagai **"STILL OPEN"**: keputusan slot sitasi UKM (#2),
granularitas Prolanis (#3), dan adopsi SAJI. **Ketiganya sudah diadjudikasi Dr. Wirayuda dan
SUDAH diimplementasikan** dalam gelombang REVISI_ENGINE 41 di atas. Juga, §5.3 mencatat M11 item
2/4/5 sebagai "belum dispesifikasi, JANGAN mereka-reka" — item **#4 dan #5-B1 sudah dispesifikasi
DAN dibangun**; #2 (storylet) sebagian dibangun (A2); sisanya (#3 A3, #6, #7-riset) masih belum
digarap, lihat §2.3.

9 commit baru sejak dossier lama (`b3b7e58` → `c65dc78`, semua di `codex-gpt56-experiment`):

| Commit | Isi |
|---|---|
| `b3b7e58` | Mekanik engine "variasi presentasi Tingkat-A" (#4) — `VarianPresentasiTingkatA`, `kasusEfektif`, seleksi RNG di `director.ts`. REVISI_ENGINE 40→41. |
| `5cde066` | Fix: `variasi` (suara persona) tak lagi menggugurkan override varian; sidik jari pack jadi sensitif thd STRUKTUR varian (id list), tapi kebal thd TEKS varian. |
| `1a26a56` | Fase 1 UKM: slot sitasi Decision #2 (schema saja) + label SAJI di layar Kunjungan (adopsi Permenkes 39/2016). |
| `7d1d8ce` | **Konten** #4 — 40 kasus/79 varian (dari workflow adversarial-verified) + mekanik #5-B1 (kunjungan Tingkat-A: `VarianKunjunganTingkatA`, `skenarioEfektif`, dll). |
| `be3095a` | Lapisan penerapan varian-kunjungan ke katalog + `KartuKegiatan.sumber?` (slot sitasi kegiatan). |
| `ae71097` | A2 — storylet Debrief Malam (atmosfer, non-REVISI, murni renderer). |
| `34b8652` | D3-lite — rotasi naratif 4 kanal Prolanis (BPJS 4-kanal resmi vs realita ILP 2023). |
| `ff335e8` | B2 — pool narasi kartu KLB verifikasi & 5W1H. |
| `c65dc78` | Dok: B3 (variasi suara surat kader) ternyata SUDAH terpenuhi kode lama, tak perlu kerja baru; + tabel status eksekusi. |
| `70d56fd` | Konten B1 run pertama — 9/16 skenario kunjungan dapat varian; fix regresi `selfplay.test.ts`. |
| `1aa5102` | **(Anda/CODEX)** C2 penuh — registry `ukmCitations.ts`, 27/27 skenario + 89/89 intervensi + Posyandu/Prolanis/KLB, tanpa sentuh engine beku. |
| `55edaeb` | Konten B1 retry — final 11/16 skenario/21 varian (5 skenario tetap gagal, alasan struktural genuine). |
| `c32beaf` | Dok penutupan gelombang. |
| tag `golden-master-m11` | REVISI_ENGINE 41, menunjuk `55edaeb`. Gelombang M11 resmi ditutup di sini. |

**Dokumen kunci yang HARUS Anda baca sebelum mulai kerja** (jangan re-derive dari nol):
- `docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` — dossier keputusan Bagian A-F (storyline, variasi
  UKM, sitasi, Prolanis, SAJI, M13-103) + tabel "STATUS EKSEKUSI" di akhir. Ini sumber kebenaran
  untuk "apa sudah diputuskan, apa masih terbuka." **Bagian E (SAJI, termasuk desain E-2) dan
  Bagian F (M13-103) masih relevan penuh** — itu basis §2 baru di bawah.
- `docs/M11_VARIAN_TINGKAT_A_HASIL.md` / `docs/M11_VARIAN_KUNJUNGAN_TINGKAT_A_HASIL.md` /
  `docs/M11_SITASI_UKM_HASIL.md` — ringkasan hasil #4/#5-B1/C2, referensi pola kerja (workflow
  draf→verifikasi-adversarial, registry konten terpisah) yang relevan utk tugas baru di §2.1/2.2.

---

## 2. Antrean tugas — urutan prioritas (DITULIS ULANG 2026-07-17 pasca-tag)

Gelombang M11 (§1) SUDAH SELESAI, ter-tag `golden-master-m11`. Antrean di bawah adalah pekerjaan
BARU, mencakup SEMUA sisa item yang tercatat di `docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` Bagian
E-2 dan F, plus 3 item M11 kreatif yang dari awal belum dispesifikasi. Dr. Wirayuda eksplisit
menyerahkan seluruh ini ke Anda ("semua yang tersisa yang belum dan yang berikut-berikutnya biar
CODEX yang lanjutkan") — kerjakan berurutan sesuai prioritas di bawah, JANGAN tunggu instruksi
per-item lagi kecuali disebutkan eksplisit butuh keputusan Dr. Wirayuda dulu.

### 2.1 — PRIORITAS 1: Artefak adjudikasi M13 (103 kasus prototipe lab)

> **STATUS CODEX 2026-07-17: SELESAI sebagai M13-137, menunggu adjudikasi dokter.** Query
> runtime aktual menemukan **137**, bukan 103: assertion `>=103` di test lama adalah batas
> minimum yang menjadi basi setelah Batch 4 menambah 34 kasus. Deliverable:
> `docs/M13_137_ADJUDICATION.html`, `docs/M13_137_ADJUDICATION_DATA.json`,
> `docs/M13_137_ADJUDICATION_REPORT.md`, dan snapshot KFA 74-obat. Semua 137 kasus tercakup;
> keputusan dokter tetap kosong. Generator + 8 invariant test mengunci inventaris, provenance,
> fingerprint impor, dan interaksi HTML. Tidak ada file gameplay/engine yang diubah.

**Riset + kompilasi, BUKAN adjudikasi** — adjudikasi medis tetap wewenang Dr. Wirayuda sendiri
(`docs/M11_LANJUTAN_KEPUTUSAN_TERPADU.md` Bagian F). Tugas Anda: siapkan artefak keputusan gaya
M11.5 (`panduanResmi` batch — lihat pola di `M11_VARIAN_TINGKAT_A_HASIL.md` dan histori commit
`baee64a` dst di `CODEX_HANDOFF_DOSSIER.md`) supaya Dr. Wirayuda bisa mengadjudikasi 103 kasus
ini sekali-duduk per batch, bukan satu-satu.

**Cara menemukan 103 kasusnya** (jangan asumsikan file/lokasi dari ingatan — query ini
terverifikasi langsung terhadap `fullCoverage.test.ts:66-68` saat briefing ini ditulis):
```
labCases = semua entri PACK.kasus dgn kasus.activationStatus === 'lab_prototype_unadjudicated'
// fullCoverage.test.ts sendiri assert labCases.length >= 103 — pakai test ini sbg
// sumber-kebenaran jumlah & untuk menemukan file sumbernya (grep import chain-nya).
```

**Untuk TIAP kasus, kompilasi**:
1. Ringkasan kasus (nama, ICD-10, demografi, tatalaksana `obatBenar`/`obatAlternatif`/prosedur
   saat ini).
2. Grounding — cross-check terhadap SEMUA sumber berikut, urutan prioritas (aturan baku proyek
   ini, `feedback_ebm_realistis_priority_rule`): **PPK 1186/2022 dan PNPK terkini = lantai
   wajib**, lalu Fornas 1199/2025 (obat), ASPAK (alat/sarana yang realistis tersedia di FKTP),
   KFA (penamaan obat/alkes resmi). Sertakan kutipan sumber presisi per klaim, BUKAN paraphrase
   tanpa jejak — pola sama seperti M11.5 (`sumberKutipanPpk`).
3. Untuk tiap klaim: tandai salah satu — **cocok** (tatalaksana kasus sudah sesuai sumber, tak
   perlu diubah), **perlu-koreksi** (sumber menunjukkan tatalaksana harus berubah — sebutkan
   ke apa + kutipan), atau **tak-ada-sumber** (JANGAN mengarang; tandai jujur sbg gap).
4. Keluaran: artefak per-kasus dgn radio Setuju/Perlu-Edit/Tolak/Nanti (pola persis M11.5/M11
   shortlist 41-item) + ekspor JSON, supaya Dr. Wirayuda review satu layar per batch.

**Verifikasi wajib**: sumber regulasi diverifikasi ulang lewat portal resmi (JDIH Kemenkes,
peraturan.go.id, peraturan.bpk.go.id — pola persis yang Anda pakai di C2, itu sudah terbukti
bagus). JANGAN mengadjudikasi/mengubah kode kasus sendiri — ini murni artefak riset+kompilasi
untuk Dr. Wirayuda baca, bukan implementasi.

### 2.2 — PRIORITAS 2: E-2 (SAJI Fase-2) — gelombang unfreeze BARU, REVISI_ENGINE 42

> **STATUS CODEX 2026-07-17: SELESAI DIIMPLEMENTASIKAN.** Dr. Wirayuda
> menyetujui rekomendasi paket E-2. Implementasi mencakup 5 pilot Ingatkan,
> kualitas SAJI 80/20 tanpa mengubah gate MI, 2 penutupan kontak awal Career,
> 82/82 reklasifikasi gaya, migrasi save, UI/debrief, release bump, dan
> unfreeze sadar ke `REVISI_ENGINE=42`. Instruksi rinci di bawah dipertahankan
> sebagai audit trail, bukan lagi antrean aktif.

Ini **menyentuh engine beku** (`state.ts`/`kunjungan.ts`/`reducer.ts`/`scoring.ts`) — ikuti
disiplin unfreeze-dance PENUH (`CODEX_HANDOFF_DOSSIER.md` §3/§7): test-first (merah→hijau
dibuktikan, bukan diklaim), lalu setelah lolos jalankan `freeze.test.ts`, salin hash baru ke
`HASH_DIBEKUKAN`, **bump `REVISI_ENGINE` 41→42** dengan komentar bertanggal menjelaskan APA yang
berubah & APAKAH replay lama bergeser, lalu jalankan `soakAdversarial.test.ts` ulang dan
bandingkan invarian `teliti ≥ speedrunner ≥ ceroboh` terhadap baseline saat ini (teliti=3.80,
speedrunner=2.08, ceroboh=1.80 — CATAT kalau distribusi bergeser drastis, itu sinyal kalibrasi
perlu ditinjau, bukan diabaikan). 3 sub-item, kerjakan berurutan (masing2 punya keputusan yang
HARUS Anda usulkan dulu ke Dr. Wirayuda/Claude sebelum menulis konten skala besar — lihat catatan
di tiap sub-item):

**E-2.1 — Babak "Ingatkan" eksplisit** (fase penutup baru, `state.ts:302`
`BabakKunjunganFase = 'observasi' | 'wawancara' | 'diagnosis_perilaku' | 'resep_sosial' | 'selesai'`
→ sisipkan `'ingatkan'` sebelum `'selesai'`):
- Setelah `PILIH_INTERVENSI` (kunjungan.ts:300-309, saat ini langsung `fase: 'selesai'`), ubah
  jadi `fase: 'ingatkan'`, lalu babak baru: pemain pilih 1 dari 3 pesan pengingat — 1 BENAR
  (spesifik-indikator + jadwal follow-up konkret, mis. "kontrol tensi 2 minggu lagi, catat di
  buku KIA"), 2 SALAH (generik "jaga kesehatan ya" ATAU menggurui "Ibu harus lebih disiplin").
  Baru setelah babak ini pilihan → `fase: 'selesai'`.
- Skor: masuk `kualitasMi` yang SUDAH ada (kunjungan.ts:366, saat ini cuma dari rasio pilihan
  dialog tepat/total) — tambahkan pilihan-ingatkan sbg satu unit tambahan ke rasio yang sama
  (paling sederhana: treat spt satu "pilihan dialog" tambahan di penghitungan `tepat`/
  `totalPilihan`), ATAU bikin komponen terpisah kalau Anda menilai itu lebih bersih — **usulkan
  desain persisnya (opsi + tradeoff) sebelum implementasi**, ini genuinely keputusan skor.
- Konten: 1 field baru per skenario, mis. `SkenarioKunjungan.pilihanIngatkan?: {benar: string,
  salahSatu: string, salahDua: string}` — TIDAK wajib ada di semua 16 keluarga sekaligus; bisa
  digelar bertahap (pilot 3-5 keluarga dulu, verifikasi mekanik+skor masuk akal, baru sapu sisanya)
  — pola sama seperti #4/#5-B1 yang dulu pilot dulu baru full-scale.

**E-2.2 — 2 hasil kunjungan SAH baru: "ditolak-total" & "diterima-terpaksa"**
**PENTING — JANGAN disamakan dgn mekanik `diusir` yang SUDAH ADA** (`kunjungan.ts:268`,
`state.ts:318/397`): `diusir` adalah HUKUMAN atas gaya konfrontatif berulang (2× righting-reflex
gagal) — kegagalan PEMAIN, karma dipercepat. "ditolak-total" yang dimaksud di sini beda secara
konseptual: keluarga menolak SEPENUHNYA meski dokter sudah ber-MI dgn benar (per Permenkes ini
outcome resmi yang bisa terjadi, BUKAN kegagalan pemain). Kalau diimplementasikan naif sbg
alias `diusir`, itu SALAH — akan menghukum pemain yang sudah bermain benar.
- Model outcome saat ini: `berhasil: boolean` + `tingkat: 'berhasil'|'partial'|'gagal'`
  (`kunjungan.ts:382-398`, fungsi `selesaikanKunjungan`). Perlu diperluas jadi union beranggota 4
  (atau tambahan field terpisah `hasilAkhir` di luar `tingkat` existing — **usulkan mana yang
  lebih aman thd kode yang sudah baca `tingkat`/`berhasil` di reducer.ts/scoring.ts sebelum
  memilih**, jangan pecahkan konsumen existing diam-diam).
- Aturan yang diusulkan (Bagian E dokumen keputusan, boleh disesuaikan tapi USULKAN dulu kalau
  beda): **ditolak-total** = tanpa penalti MI/kualitasMi, `karma` dijadwalkan ulang otomatis
  (bukan gagal permanen — keluarga bisa didekati lagi kunjungan berikutnya); **diterima-terpaksa**
  = indikator TETAP tercatat terverifikasi (target dianggap tersentuh) TAPI beri flag "rapuh" yang
  mempercepat kemungkinan drift kembali ke status semula — cek mekanik drift yang SUDAH ADA
  (`reducer.ts`, item "eskalasi follow-up mangkir ke pool drift", dari histori M10.6) sebelum
  membangun mekanisme drift baru, kemungkinan besar bisa REUSE bukan bikin dari nol.
- **Konten**: skenario mana yang butuh 2 penutup tambahan (`penutupDitolakTotal`/
  `penutupDiterimaTerpaksa`)? Menulis bespoke utk semua 16×27 skenario mahal token. **Usulkan
  opsi ke Dr. Wirayuda/Claude**: (a) generik-tapi-personal (1 template per keluarga, sisipkan
  nama/detail via interpolasi, bukan per-skenario), (b) bespoke penuh (mahal, kualitas tertinggi),
  atau (c) bespoke hanya utk skenario yg SUDAH dapat varian Tingkat-A (11/16, karena itu skenario
  yg paling sering direplay) + generik utk sisanya. Jangan pilih sendiri tanpa mengusulkan opsi
  ini dulu — ini keputusan cakupan/biaya-token, bukan hal mekanis.

**E-2.3 — Taksonomi `gaya` lebih tajam** (`types.ts:608`,
`gaya: 'empati' | 'refleksi' | 'edukasi' | 'konfrontasi'`):
- Pecah `'konfrontasi'` jadi subtipe resmi: `'menghakimi' | 'menggurui' | 'menakut-nakuti' |
  'memaksa'` (atau nama lain yang lebih pas — usulkan kalau ada istilah OARS/MI yang lebih baku).
  Mekanik righting-reflex (2-beruntun bergaya buruk → `diusir`, `kunjungan.ts:191-201`) TETAP
  sama strukturnya — cukup treat SEMUA subtipe baru sbg anggota grup "gaya buruk" yang sama utk
  gerbang itu, jangan ubah logikanya.
- **Ini REKLASIFIKASI konten existing**, bukan konten baru — semua `PilihanDialog` yang saat ini
  `gaya: 'konfrontasi'` (di 16 file `src/content/keluarga/desa*.ts`) perlu diklasifikasi ulang ke
  subtipe yang paling akurat berdasar TEKS respons kader yang sudah ada. Baca tiap satu, jangan
  asumsikan pola generik cocok semua.
- Debrief jadi bisa merujuk subtipe spesifik ("gaya menggurui terdeteksi" bukan cuma
  "konfrontasi") — cek `catatanPedagogis`/render debrief mana yang perlu ikut diperbarui.

**Penutupan E-2:** ketiga sub-item, soak, freeze, build, dan pembaruan status
sudah dilakukan. Commit checkpoint dibuat terpisah; tag Golden Master baru
tidak dibuat tanpa instruksi eksplisit pemilik.

### 2.3 — PRIORITAS 3: M11 #3/#6/#7-riset — PROPOSE-ONLY, JANGAN implementasi

3 item M11 kreatif yang dari awal ("M11 #2 storyline, #4 presentasi, #5 UKM" — pesan asli Dr.
Wirayuda) TIDAK termasuk yang di-scope eksplisit (#4/#5 sudah; #2/A3 storyline bercabang malah
eksplisit DITOLAK di Bagian A). Ini masih genuinely "belum dispesifikasi" — **tugas Anda BUKAN
membangun, tapi mengusulkan opsi+tradeoff** (pola operasi baku proyek ini, lihat §0):
- **#3 (A3, arc bercabang)** — sudah eksplisit ditolak/ditunda ("rasio biaya:nilai buruk,
  September dekat") di `M11_LANJUTAN_KEPUTUSAN_TERPADU.md` Bagian A. **Jangan diusulkan ulang**
  kecuali Dr. Wirayuda membuka topik ini sendiri — anggap closed.
- **#6** — item paling kosong: dari `CODEX_HANDOFF_DOSSIER.md` §5.3, ini SEJAK AWAL cuma
  disebut "variasi-variasi lainnya yg belum terpikirkan" (kutipan asli Dr. Wirayuda, M11 poin 6)
  — literally belum ada satu ide konkret pun. **Tugas Anda**: baca ulang seluruh histori M11 (git
  log + `docs/M11_*` semua file) dan brainstorm 3-5 ide konkret yang BELUM dibangun sesi mana pun
  (storyline/UKM/EBM-nuance/pedagogical-honesty — 4 kategori M11 yang sudah ada), masing2 dgn
  perkiraan biaya (REVISI atau tidak, konten seberapa besar) dan nilai pedagogis. TULIS sbg
  dokumen usulan (`docs/M11_ITEM6_USULAN.md` atau serupa) — JANGAN implementasi apa pun dari
  daftar ini sebelum Dr. Wirayuda memilih.
- **#7-riset** — item 7 (lapisan realita-FKTP) MEKANISMENYA SUDAH ADA & dipakai luas
  (`catatanRealita` field, 67/67 kasus UKP + M11.5 `panduanResmi`). Yang belum: **riset
  sistematis celah realita LAIN** di luar yang sudah tercakup — kandidat dari catatan lama
  (BELUM diverifikasi, purely illustrative): kesenjangan Fornas-vs-stok-riil Puskesmas,
  friksi birokrasi rujukan/SISRUTE di lapangan, realita administratif BPJS/JKN, kekurangan
  staf/alat pedesaan, akses geografis. **Instruksi eksplisit dari Dr. Wirayuda yang WAJIB
  diikuti** (sudah berlaku sejak awal item ini dicatat, `feedback_ebm_realistis_priority_rule`
  jiwanya sama): **riset web dulu, BUKAN karang dari ingatan pelatihan umum** — klaim "begini
  realita Puskesmas Indonesia hari ini" harus tertelusur ke sumber (berita kesehatan terkini,
  laporan Kemenkes/BPJS, riset akademik Indonesia terkini), bukan asumsi generik/textbook
  usang. **Keluaran: dokumen riset+usulan** (bukan kode) — kandidat celah realita yang
  tergrounding, masing2 dgn draft `catatanRealita`-style teks SIAP-PAKAI (format sama dgn field
  yang sudah ada) supaya kalau disetujui, penerapannya tinggal tempel — tapi jangan tempelkan
  sendiri sebelum disetujui.

### 2.4 — DITAHAN, BUKAN tugas Anda sekarang — butuh keputusan Dr. Wirayuda dulu

- **M12 (pass estetika penuh)** — butuh keputusan RISIKO LISENSI dulu (AI-gen vs aset RPG-Maker/
  VN berbayar) sebelum siapa pun mulai kerja — ada preseden insiden lisensi BGM/Square Enix di
  proyek ini yang membuat keputusan ini genuinely sensitif, bukan sekadar preferensi. Jangan
  mulai riset/draft aset apa pun utk M12 sampai Dr. Wirayuda memutuskan arahnya.
- **Cross-platform/mobile** — sengaja ditunda tanpa batas waktu, butuh greenlight baru dari Dr.
  Wirayuda sebelum dipertimbangkan lagi (Electron tak bisa jalan di mobile, ini keputusan
  arsitektur besar bukan tambahan kecil).
- Kalau Anda menemukan pekerjaan besar LAIN yang belum tercantum di §2.1-2.3 selama mengerjakan
  antrean ini — jangan mulai sendiri, laporkan balik dulu (§3).

---

## 3. Cara melapor balik

Ikuti pola operasi proyek ini yang sudah konsisten sejak awal (`CODEX_HANDOFF_DOSSIER.md` §6):
**usulkan opsi dgn tradeoff jelas, JANGAN putuskan sendiri** untuk apa pun yang genuinely butuh
judgment medis/desain/pedagogis. Untuk pelaporan status/hasil kerja, dan khususnya untuk
mengurangi bolak-balik verifikasi yang lambat: **kalau temuan Anda mekanis** (mis. sitasi yang
salah kutip nomor dokumen, field kosong yang seharusnya terisi) — **perbaiki langsung**, jangan
tanya dulu. Tandai hanya kontradiksi yang genuinely butuh keputusan klinis/desain baru sebagai
item terpisah yang perlu diadjudikasi. Laporan akhir cukup: apa yang selesai, cakupan (berapa
dari berapa), apa yang dilewati & kenapa, commit hash, hasil test/typecheck.

**Urutan kerja §2**: kerjakan 2.1 → 2.2 → 2.3 berurutan, JANGAN paralel di file yang sama —
2.1 (M13-103) murni riset/dokumen, aman dikerjakan kapan saja duluan tanpa risiko. 2.2 (E-2)
punya 3 sub-item dgn beberapa titik keputusan eksplisit yang WAJIB diusulkan dulu (ditandai tebal
di teksnya) sebelum menulis konten skala besar — jangan skip langkah usul itu meski Anda yakin
tahu jawabannya, itu justru pola yang berulang kali terbukti salah di proyek ini (lihat
`CODEX_FIX_RULES.md` §1 utk 3 contoh nyata). 2.3 murni dokumen usulan, tak ada kode yang berubah.
Kalau ragu antara "ini mekanis, perbaiki langsung" vs "ini butuh usul dulu" — default ke usul;
biaya bertanya jauh lebih murah daripada biaya membangun sesuatu yang salah arah di file beku.

Selamat bekerja. Dokumen ini akan diperbarui (oleh Claude) setiap kali antrean tugas berubah —
kalau Anda instance CODEX yang membaca ini di sesi berikutnya, cek dulu commit terbaru pada
`docs/CODEX_BRIEFING_LANJUTAN.md` sendiri (git log -- docs/CODEX_BRIEFING_LANJUTAN.md) untuk
memastikan Anda membaca versi yang masih current, bukan cache lama.
