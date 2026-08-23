# 4 Pertanyaan Terbuka — Sisa Tinjauan Bulk 74 Kasus Lab, 23 Agustus 2026

**Status wewenang:** dr. Wirayuda mengotorisasi Claude meninjau 74 dari 121 kasus lab yang belum diadjudikasi ("rutin", non-taruhan-tinggi; 47 kasus taruhan-tinggi sengaja TIDAK disentuh — lihat `CLAUDE_REVIEWED_LAB_CASE_IDS` di `src/content/lab/index.ts`). Tinjauan memakai 38 agen (review + sanggahan adversarial per kelompok). Hasilnya: 53 kasus bersih, 17 kasus dikoreksi (lihat commit terkait untuk rinciannya), dan **4 kasus di bawah ini** — BUKAN kasus taruhan-tinggi, tapi pilihannya genuinely butuh penilaian klinis dokter, bukan aturan mekanis. **Tidak ada keputusan yang diambil untuk keempatnya**; kode tetap dalam bentuk lama sampai dokter memutuskan.

---

## 1. `lab_alergi_makanan_ringan` — kode ICD-10 mana yang paling tepat?

**Kondisi saat ini:** `icd10: 'L27.2'` (`src/content/lab/batch1.ts`, "Alergi Makanan Tanpa Anafilaksis").

**Vignette:** dewasa 15-55 tahun, "Setiap makan udang, kulit saya bentol gatal dalam beberapa menit" — pola IgE-mediated klasik (onset menit, urtikaria).

**Tiga opsi yang muncul dari tinjauan:**
- **L27.2** (kondisi saat ini) — "Dermatitis akibat makanan yang dimakan". WHO ICD-10 punya *Excludes* note yang mengarahkan reaksi kulit alergi-makanan bergejala urtikaria ke L50, bukan L27.2 — jadi kode ini berpotensi salah bab.
- **L50.0** — "Urtikaria alergik". Paling presisi terhadap temuan vignette sendiri ("bentol gatal" = wheal/urtikaria klasik), dan konsisten dengan Excludes note L27.2 di atas.
- **T78.1** — "Reaksi makanan lain, tidak spesifik". Lebih generik/aman, tidak mengklaim mekanisme urtikaria yang spesifik.

**Kenapa ini bukan keputusan mekanis:** ketiganya punya argumen WHO yang sah tergantung sudut pandang (kode manifestasi vs kode etiologi vs kode paling netral) — perlu penilaian klinis, bukan aturan "kategori sama/beda" yang dipakai `PENGECUALIAN_KODE`.

**Efek berantai bila diubah:** `lab_intoleransi_makanan_laktosa` (sudah dikoreksi batch ini ke E73.9) memakai `L27.2` sebagai distraktor banding di `diagnosisBanding: ['E73.9', 'L27.2', 'K58.0']` — mewakili "ini alergi, bukan intoleransi". Bila kode kasus alergi berubah, distraktor ini perlu disesuaikan ke kode baru agar tetap menunjuk konsep yang benar.

---

## 2. `lab_cacing_tambang` — B76.0 (spesies tertentu) atau B76.9 (tak spesifik)?

**Kondisi saat ini:** `icd10: 'B76.0'` (Ankilostomiasis — secara WHO artinya spesifik *Ancylostoma duodenale*).

**Konsistensi internal (sudah diverifikasi, bukan sekadar diklaim):** B76.0 dipakai SELURUHNYA konsisten di proyek ini — kasus itu sendiri, tiga distraktor banding di kasus lain (strongiloidiasis, taeniasis, talasemia anak), dan entri katalog SKDI-144 `hookworm`. Tidak ada kontradiksi kode di dalam proyek.

**Pertanyaan klinisnya:** mikroskopi feses rutin di FKTP — yang menjadi dasar diagnosis di vignette ini — **tidak dapat membedakan** telur *Ancylostoma duodenale* (B76.0) dari *Necator americanus* (B76.1) secara morfologi; keduanya identik di bawah mikroskop cahaya biasa. Bila vignette tidak menyebut teknik spesiasi lanjutan (kultur larva/Harada-Mori), maka B76.9 ("Penyakit cacing tambang, tak spesifik") lebih jujur secara diagnostik daripada B76.0 yang mengklaim spesies tertentu.

**Trade-off:** B76.0 konsisten secara internal proyek (tak ada kontradiksi kode untuk diperbaiki); B76.9 lebih akurat terhadap keterbatasan riil pemeriksaan FKTP. Ini murni soal seberapa jauh game harus mengajarkan keterbatasan diagnostik mikroskopi rutin — keputusan pedagogis-klinis, bukan bug.

---

## 3. `lab_vaginitis_kandida` — cakupan "langsung" utk KMK 1936/2022 kepenuhan atau sebagian?

**Kondisi saat ini:** `src/content/clinicalSourceAssignments.generated.ts` menandai sumber `ppk-fktp-1936-2022` sebagai `cakupan: "langsung"` (setara dgn `cdc-vvc-2021`) untuk kasus ini.

**Konteks:** KMK 1936/2022 adalah dokumen AMANDEMEN atas PPK dasar (KMK 1186/2022) — mengutipnya "langsung" mengklaim seluruh dokumen relevan, padahal amandemen biasanya hanya menyentuh bab/pasal tertentu. Preseden yang sudah ADA di kasus tetangga: `lab_vaginosis_bakterialis` (kondisi mirip, sama-sama duh vagina) memakai `cakupan: "terkait"` plus catatan eksplisit *"Bab PPK terkait, bukan padanan diagnosis yang identik."* — pola yang lebih konservatif.

**Catatan penting:** kekhawatiran serupa di kasus-kasus LAIN sudah diperbaiki lewat commit `a071607` (8 Agustus 2026); hanya framing kasus vaginitis kandida ini yang masih belum disamakan. Jadi ini bukan celah baru, melainkan satu kasus yang tertinggal dari perbaikan yang sudah pernah dilakukan.

**Pilihan:** (a) turunkan ke `cakupan: "terkait"` + catatan seperti vaginosis bakterialis, (b) pertahankan "langsung" bila memang bab KMK 1936 yang relevan benar-benar membahas kandidiasis vulvovaginal secara spesifik dan lengkap (perlu dicek isi bab amandemen itu sendiri, di luar kapasitas Claude memutuskan tanpa akses dokumen fisiknya).

---

## 4. `lab_dermatitis_numularis` — potensi steroid: kebijakan satu proyek, bukan satu kasus

**Kondisi saat ini:** `obatBenar: ['hidrokortison_krim', 'emolien_petrolatum']` (hidrokortison = potensi RENDAH, 2.5%). Clue hanya menulis "gunakan steroid topikal singkat" tanpa menyebut potensi.

**Pola proyek yang ditemukan (diverifikasi via grep, bukan sampel):** `betametason_krim` (potensi SEDANG-TINGGI, 0.1%) muncul di ≥20 kasus dermatologi di seluruh proyek, dan di SEMUA kemunculan itu ia berperan sebagai jebakan (`bahaya`), TIDAK PERNAH sebagai jawaban benar. *(Catatan koreksi kecil: entri terpisah `betametason_krim_005`, potensi 0.05%, memang dipakai sebagai jawaban benar di satu kasus lain — `lab_fimosis_patologis_ringan` — tapi itu ID katalog & konsentrasi yang berbeda dari `betametason_krim` 0.1% yang jadi sorotan di sini.)*

**Pertanyaan klinis:** literatur dermatologi umum menyarankan steroid potensi SEDANG-TINGGI untuk numularis, terutama pada plak tebal/likenifikasi di ekstremitas (kulit lebih tebal, sering resisten terhadap potensi rendah) — berbeda dari dermatitis wajah/lipatan yang memang harus potensi rendah. Vignette numularis ini berlokasi di tungkai.

**Ini BUKAN sekadar tentang satu kasus:** mengubah numularis sendirian akan menciptakan SATU pengecualian di tengah kebijakan seragam "potensi rendah saja" yang berlaku di puluhan kasus derm lain. Pertanyaan sebenarnya untuk dokter: apakah kebijakan seragam itu sendiri yang perlu ditinjau ulang (setidaknya untuk kondisi ekstremitas/likenifikasi), atau numularis memang pengecualian yang berdiri sendiri, atau kebijakan lama dipertahankan apa adanya dan hidrokortison-lama-lebih-lambat dianggap trade-off yang diterima demi keamanan/kesederhanaan mengajar.

---

*Tidak ada perubahan kode untuk keempat item ini. Bila dokter memutuskan salah satu, catat keputusannya (mis. lewat `docs/M13_137_DECISION_LOG.md` atau dokumen serupa) dan Claude/CODEX dapat mengimplementasikannya di commit terpisah.*
