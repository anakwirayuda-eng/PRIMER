# M10 Batch-3 — Dokumen Keputusan Medis (untuk Dr. Wirayuda)

**Status:** hasil riset multi-agen (8 pertanyaan klinis, WebSearch guideline internasional +
konteks Indonesia, 2026-07-10). **Keputusan akhir ada di tangan dokter** — dokumen ini menyajikan
BUKTI + OPSI, bukan vonis untuk pasien nyata. Ini konten edukasi.

**Metode:** 8 agen paralel, tiap agen mencari guideline terbaru (WHO/CDC/NICE/Cochrane/ACC-AHA/
ESC) + sumber Indonesia (Kemenkes PPK/Buku Saku, Permenkes, Perdoski/PERKI/POGI/InaSH), lalu
membandingkan ke isi game aktual. Semua 8 keyakinan **tinggi**. Sitasi diverifikasi silang;
di mana PDF resmi gagal di-fetch (mis. Buku Saku Malaria Kemenkes — server 521) isinya
ditriangulasi dari cermin WHO + ringkasan sekunder yang konsisten (dicatat per item).

4 item CODEX lain (P1.6/P1.7/P1.9/C.1 — desain/skoring) sudah dipindah ke **M11**.

---

## Urutan prioritas yang disarankan (keselamatan dulu)

| # | Item | Verdikt | Prioritas | Kompleksitas fix |
|---|------|---------|-----------|------------------|
| **C.4** | Malaria — skrining kehamilan sebelum primakuin | kondisional (⚠️ **keselamatan #1**) | TINGGI | ringan-sedang |
| **C.5** | Target HT urgensi "25%/jam" | **game-salah** | TINGGI | ~nol (edit clue) |
| **C.11** | Zinc pd disentri dewasa + sediaan salisilat veruka | **game-salah** | TINGGI | ringan (konten/katalog) |
| **C.10** | ICD K35.80 (kode Amerika) | **game-salah** | SEDANG | ~nol (2 string) |
| **C.2** | Tinea/impetigo wajib-oral vs clue kondisional | kondisional | SEDANG | sedang |
| **C.12** | Abortus iminens — tirah baring & kausalitas | kondisional | RENDAH | ringan (wording) |
| **C.8** | Skrining alergi pra-resep | kondisional (desain) | RENDAH | bervariasi |
| **P1.8** | Timing tes dengue | **game-benar** | — | tak perlu diubah |

---

## ⚠️ C.4 — Malaria falsiparum: skrining kehamilan sebelum primakuin (KESELAMATAN #1)

**Game sekarang:** `kia_malaria_falsiparum`, demografi usia 18–50 gender **di-roll**. obatBenar
WAJIB = DHP + **primakuin 15 mg dosis tunggal** + parasetamol. **Tidak ada** pertanyaan skrining
kehamilan maupun G6PD.

**EBM (WHO Guidelines for malaria 2023/2025 + policy brief SLD 2015):**
- DHP + primakuin **dosis tunggal rendah 0,25 mg/kg** (gametosidal, memutus transmisi) = **benar &
  mutakhir**. 15 mg ≈ 0,25 mg/kg dewasa ~60 kg → tepat.
- **Primakuin KONTRAINDIKASI MUTLAK pada kehamilan** + bayi <6 bln + menyusui bayi <6 bln.
- **Tes G6PD TIDAK diwajibkan** untuk regimen dosis-tunggal-rendah falciparum (aman lintas varian
  defisiensi) → **ketiadaan pertanyaan G6PD di game BUKAN kesalahan.**

**Indonesia (Buku Saku Tata Laksana Malaria Kemenkes, Des 2023):** identik — DHP + primakuin dosis
tunggal 0,25 mg/kg masih lini pertama; primakuin tak diberikan pada hamil/bayi <6 bln/G6PD; ibu
hamil falciparum = DHP saja (tanpa primakuin).

**Inti masalah:** obat sudah benar, tapi karena gender di-roll usia subur, banyak seed memunculkan
perempuan usia subur → game **mewajibkan primakuin tanpa satu pun langkah menyingkirkan kehamilan**
= menanamkan kebiasaan tidak aman.

**Opsi (dokter pilih):**
- **A. Tambah catatan EBM** (termurah, M11): sisipkan di clue "pada perempuan usia subur singkirkan
  kehamilan dulu; primakuin KI hamil & bayi <6 bln; G6PD tak perlu dites utk dosis tunggal."
- **B. Tambah 1 pertanyaan anamnesis esensial** skrining kehamilan (HPHT/kemungkinan hamil).
- **C. Gate kontraindikasi (paling kuat mengajar, juga varian M11 "malaria pada kehamilan"):** bila
  pasien perempuan hamil → obatBenar = DHP saja, primakuin dilarang; beri poin bila mahasiswa
  menyingkirkan kehamilan.
- **D. Constrain demografi** ke laki-laki (termurah tapi menghapus peluang ajar).

**Rekomendasi peneliti:** minimal A; ideal B atau C. *Sumber di-triangulasi (PDF Kemenkes 521),
keyakinan tinggi.*

---

## C.5 — Hipertensi urgensi: target "≤25% dalam jam pertama" (GAME-SALAH)

**Game sekarang:** `mm_hipertensi_urgensi` clue: "TURUNKAN BERTAHAP oral, **target ~25% dalam jam
pertama / beberapa jam** — JANGAN drop cepat."

**EBM (ACC/AHA 2017 [Whelton et al.]; ESC/ESH 2023; StatPearls Hypertensive Crisis 2024):**
"≤25% dalam jam pertama" adalah target **HIPERTENSI EMERGENSI** (ada kerusakan organ, obat IV).
**Urgensi** (tanpa kerusakan organ) = obat **oral bertahap dalam 24–48 jam**, TANPA target
persen-per-jam; penurunan cepat tak memperbaiki luaran.

**Indonesia (InaSH/PERHI Konsensus Hipertensi 2019/2021; Alomedika mengutip ESH 2023):** sejalan —
urgensi = oral perlahan 24–48 jam + follow-up ~1 minggu; emergensi = IV cepat.

**Inti masalah:** game menempel angka **emergensi** ke clue **urgensi** — keliru secara guideline
DAN kontradiktif dgn kalimatnya sendiri "jangan drop cepat" (25% dalam 1 jam justru cepat).

**Opsi:** (1) **[rekomendasi]** ganti frasa jadi "target penurunan PERLAHAN dgn oral dalam 24–48
jam (bukan target persen/jam)"; (2) relabel: pindahkan "≤25% dalam jam pertama" ke sisi EMERGENSI
clue sbg kontras eksplisit (nilai edukatif tertinggi); (3) + catatan EBM M11. Fix ~nol risiko
(hanya wording clue, tak ubah obatBenar).

---

## C.11 — Zinc pd disentri dewasa + sediaan salisilat veruka (GAME-SALAH, sebagian benar)

**(b) BENAR & terpuji — pertahankan:** disentri basiler dimodelkan tepat (wajib siprofloksasin,
larang loperamid, bedakan disentri ameba→metronidazol). Sesuai WHO & PPK FKTP Permenkes 5/2014.

**(a) SALAH — zinc pada dewasa:** kasus disentri (pasien **dewasa** 15–50) mewajibkan `zinc_20` di
obatBenar. WHO/UNICEF + Buku Saku LINTAS DIARE Kemenkes 2011 membatasi zinc pada **anak <5 th** (10–
20 mg, 10–14 hari). Tak ada guideline yang merekomendasikan zinc rutin pada diare/disentri dewasa
→ mengajarkan over-prescribing. **[Perlu verifikasi kasus mana:** cek apakah zinc_20 memang di
obatBenar kasus disentri DEWASA vs hanya di `diare_akut_anak` — riset menandai perlu di-Read ulang.]**

**(c) SALAH — sediaan salisilat veruka:** `kulit_veruka_vulgaris` obatBenar = `asam_salisilat_bedak`
("Asam Salisilat 2% Bedak"). Sediaan wart standar = **asam salisilat 17% kolodion / plester 40% /
gel** (Cochrane wart topical; Perdoski) — **bedak 2% salah sediaan & konsentrasi** (bedak salisil 2%
= produk biang keringat/miliaria, bukan keratolitik kutil).

**Opsi:** (c) prioritas — tambah/ganti item katalog "Asam Salisilat 17% Kolodion" (atau plester 40%)
jadi obatBenar veruka; (a) hapus zinc dari obatBenar disentri-dewasa (jadikan opsional/netral),
pertahankan zinc HANYA di kasus anak; (b) biarkan (sudah benar), opsional catatan EBM resistensi
fluorokuinolon.

---

## C.10 — Apendisitis ICD "K35.80" (GAME-SALAH, fix ~nol)

**Game:** `apendisitis_akut` icd10 "K35.80" (+ di diagnosisBanding).

**Temuan:** "K35.80" adalah **ICD-10-CM (Amerika)** — TIDAK ADA di WHO ICD-10 (2016: K35.2/K35.3/
**K35.8**; edisi lama: K35.0/K35.1/**K35.9**). Indonesia terikat **WHO ICD-10** via Permenkes 76/2016
(INA-CBG). Kode "K35.80" tak akan diterima grouper INA-CBG/BPJS. Outlier gaya-CM bersanding kode
WHO lain (N83.2, A09) di database yang sama.

**Opsi:** ganti "K35.80" → **"K35.8"** (WHO 2016, konsisten dgn game) di 2 lokasi (kasusRespGi.ts
~1057 & ~1136); atau "K35.9" bila memilih edisi WHO lama. **[rekomendasi]** K35.8 + tetapkan
kebijakan edisi WHO ICD-10 2016 eksplisit + audit outlier serupa. Nyaris nol risiko.

---

## C.2 — Tinea/impetigo: wajib-oral vs clue kondisional (kondisional)

**CLUE sudah benar** (oral hanya BILA luas/rekalsitran/multipel). Masalah di **mekanik** + 1 konten:
- **Tinea:** obatBenar sekarang mewajibkan `griseofulvin_500` (oral) — **lawan clue-nya sendiri** &
  EBM (topikal = lini pertama lesi terbatas; lesi anular tunggal ±4 cm cukup topikal). *(Catatan:
  ini efek samping fix §49-Batch1-ku yg menjadikan griseofulvin wajib — riset menyarankan
  meninjaunya.)*
- **Impetigo:** topikal pakai `gentamisin_krim` — guideline (IDSA 2014/NICE/Perdoski) = **mupirosin**
  topikal utk lesi terbatas.

**Opsi:** (A) jadikan oral **tier opsional/kondisional** (topikal-saja = skor penuh utk lesi
terbatas); (B) selaraskan narasi jadi tegas "luas/rekalsitran" bila ingin tetap wajib-oral; (C)
**[rekomendasi]** ganti gentamisin→mupirosin (isu paling jelas); (E) catatan EBM M11 (terbinafin
kini lebih dipilih drpd griseofulvin secara internasional; griseofulvin masih di Fornas/lini FKTP ID).

---

## C.12 — Abortus iminens: tirah baring & kausalitas aktivitas (kondisional)

**Inti BENAR & dominan — pertahankan:** perdarahan <20 mgg + ostium tertutup + janin hidup → RUJUK
USG SpOG, hindari NSAID, kenali progresi.

**2 nuansa perlu koreksi:**
- **"Tirah baring"** disajikan sbg tata laksana FKTP — Cochrane CD003576 (2005), ACOG 2021, NICE
  NG126, **DAN PPK/POGI Indonesia** sepakat tirah baring **tak terbukti** mencegah keguguran (tirah
  baring lama malah risiko VTE). POGI eksplisit: "tirah baring tidak memberi hasil lebih baik".
- **konsekuensi.narasi** "tetap beraktivitas berat → abortus inkomplit" — **kausalitas ini tak
  didukung bukti** (etiologi keguguran umumnya tak terkait aktivitas).

**Opsi:** ganti "tirah baring" → "pembatasan aktivitas berat / istirahat wajar (bukan tirah baring
total)"; perlembut kausalitas jadi natural history; + catatan EBM M11 + (bonus) teaching moment
konseling "keguguran bukan salah ibu" (hindari self-blame). Kandidat kuat M11 EBM-nuance.

---

## C.8 — Skrining alergi pra-resep (kondisional — desain)

**Prinsip DIMANDATKAN kuat:** NICE CG183 (2014) verbatim "check drug allergy status before
prescribing any drug"; **Permenkes 74/2016** (pengkajian resep: alergi wajib dinilai); Standar
Akreditasi Puskesmas 2023 (SKP keselamatan). **Nuansa Indonesia:** Permenkes **24/2022 (Rekam
Medis)** — dibaca langsung — TIDAK menyebut "alergi" sbg field wajib rekam medis minimum.

**Implikasi:** game (alergi hanya menonjol di 6 kasus jebakan; `rmLengkap` tak menuntutnya)
**under-teach** refleks keselamatan universal ("hidden curriculum: alergi = trap-only").

**Opsi:** (1) tambah opsi alergi ke semua 61 kasus ber-obat + jadikan esensial (mahal, risiko
"jawaban selalu tidak"); (2) **[rekomendasi]** jadikan "tanya alergi sebelum resep" butir
**keselamatan terpisah** (bukan dipaksa ke rmLengkap) — justifikasi via **Permenkes 74/2016 +
Akreditasi**, BUKAN via PMK 24/2022 rekam medis; (3) catatan EBM M11 murah; (4) jalur-tengah subset
kasus. Ini **keputusan desain** → sebagian overlap M11.

---

## P1.8 — Timing tes dengue (GAME-BENAR, tak perlu diubah)

Teks game (NS1+ ; IgM/IgG− "belum terbentuk <hari ke-5"; "NS1 lebih sensitif fase akut") **akurat &
guideline-aligned** untuk skenario (hari-2, infeksi primer). WHO 2009/SEARO + CDC + Alomedika/PNPK:
NS1 hari 0–5(≤7), IgM mulai ~hari 4–5, IgG hari 5–7. **Nuansa (tak berlaku di kasus ini):** pd
infeksi **sekunder** endemik IgG bisa positif dini. **Opsi:** biarkan konten; nilai edukatif ekstra
(aturan pemilihan tes per-hari-onset + mekanik skor yg menghargai ketepatan tes) = kandidat M11/M12.

---

## Ringkasan keputusan yang diminta

**Fix "aman & jelas" (game-salah faktual, koreksi ~nol-risiko)** — tinggal ya/tidak:
- **C.5** edit wording clue HT urgensi (hapus "25%/jam", jadikan "bertahap 24–48 jam").
- **C.10** K35.80 → K35.8 (+ pilih edisi WHO).
- **C.11(c)** sediaan salisilat veruka (bedak 2% → kolodion 17%/plester 40%).
- **C.11(a)** longgarkan kewajiban zinc pd disentri dewasa (perlu konfirmasi kasusnya).

**Butuh arah desainmu (kondisional/keselamatan):**
- **C.4** skrining kehamilan malaria — pilih A/B/C/D (keselamatan #1).
- **C.2** tinea wajib-oral & impetigo gentamisin→mupirosin.
- **C.12** reframe tirah baring + kausalitas abortus.
- **C.8** alergi sbg butir keselamatan (sebagian M11).
