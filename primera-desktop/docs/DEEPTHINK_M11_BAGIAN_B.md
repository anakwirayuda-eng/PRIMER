# DOSSIER UNTUK DEEPTHINK — Bagian B M11 (13 keyakinan-sedang) + Pergumulan Riwayat Pedoman Klinis

Ditulis 2026-07-10. Dr. Wirayuda menyetujui **Bagian A** (21 koreksi clue) dan **Bagian C** (7 temuan
cross-check PPK Kemenkes 1186/2022) dari shortlist M11 konsolidasi tanpa ragu. **Bagian B (13 item
"keyakinan sedang")** ingin ditanyakan ke DeepThink dulu sebagai pendapat kedua sebelum diputuskan —
inilah dossier lengkapnya. Dokumen ini SWADAYA (self-contained) — tidak mengasumsikan DeepThink
membaca percakapan sebelumnya.

---

## §0. Konteks — baca dulu sebelum §1

### 0a. Apa itu PRIMERA
Game edukasi simulasi dokter Puskesmas Indonesia (working title "Puskesmas Pagi"), untuk mahasiswa
FK yang menjalani stase Ilmu Kedokteran Masyarakat (IKM)/Kedokteran Komunitas. Pemain berperan sebagai
dokter penanggung jawab satu Puskesmas fiktif (Desa Sukamaju) selama 90 hari (mode Karier) atau 30
hari (mode Ujian, dinilai formal). Dua sisi gameplay: **UKP** (Upaya Kesehatan Perseorangan — klinik
pagi, 67 kasus penyakit + 5 kasus gawat darurat IGD) dan **UKM** (Upaya Kesehatan Masyarakat — siang
hari, posyandu/prolanis/kunjungan 16 keluarga binaan). Target deploy: ~September 2026, 50 mahasiswa FK.

### 0b. Apa itu M11 dan mengapa Bagian B ini muncul
M11 = milestone "pengayaan & polish" — salah satu isinya adalah menambah dua field TAMPILAN (bukan
skor) ke tiap kasus klinis: `mutiaraEbm` (temuan klinis yang bisa menyesatkan — mis. asam urat bisa
NORMAL saat serangan akut gout) dan `catatanRealita` (celah antara textbook-ideal vs realita FKTP
Indonesia — mis. colchicine gout jarang distok Puskesmas). Kedua field ini PURELY DISPLAY: dibaca
dari data kasus, tak memengaruhi skor/replay, tak butuh bump versi engine (`REVISI_ENGINE`).

Untuk mengisi field ini across 67 kasus, dijalankan workflow riset multi-agen (`m11-pengayaan-riset`):
tiap agen meneliti 1 file kasus, mengusulkan kandidat isi `mutiaraEbm`/`catatanRealita` dengan sitasi,
lalu agen VERIFIKATOR terpisah mengecek tiap kandidat via web-research independen (WHO/Kemenkes/Fornas/
PPK/jurnal) dan memberi label keyakinan: **tinggi** (bukti kuat, konsisten) / **sedang** (faktual &
bersitasi, tapi verifikator sendiri mencatat kelemahan bukti/konteks-lokal/nuansa) / **kontradiksiClue**
(verifikator menilai isi clue GAME SAAT INI justru keliru/usang, perlu dikoreksi).

Dari 118 kandidat total: 84 keyakinan-tinggi (aman langsung dipakai), 21 kontradiksiClue (jadi
"Bagian A" shortlist — SUDAH DISETUJUI semua oleh Dr. Wirayuda), **13 keyakinan-sedang (Bagian B —
dossier ini)**, sisanya masuk kategori lain (mis. 7 dari cross-check PPK Kemenkes = "Bagian C", SUDAH
DISETUJUI semua).

**Penting: Bagian B BUKAN "kasus yang isinya diragukan salah"** — beda dari Bagian A. Bagian A adalah
klaim "clue SAAT INI keliru, ganti ke X". Bagian B adalah usulan KONTEN BARU (pengayaan, bukan koreksi)
yang verifikatornya sendiri sudah merasa PERLU mata manusia sebelum ditambahkan — biasanya karena bukti
pendukungnya tak setegas kategori "tinggi", atau melibatkan penilaian konteks-lokal Indonesia yang
verifikator (AI) tak sepenuhnya yakin generalisasinya.

### 0c. Format tiap item di §1 di bawah
- **Isi game SAAT INI** (`clue` verbatim) — apa yang sudah diajarkan ke pemain.
- **Usulan tambahan** — draft `mutiaraEbm`/`catatanRealita` baru yang diajukan.
- **Sitasi** — sumber yang dikutip pengusul.
- **Catatan verifikator** — alasan PERSIS kenapa cuma "sedang", ditulis verifikator sendiri (bukan
  parafrase Claude) — ini bagian paling penting untuk dinilai DeepThink.

### 0d. Yang diminta dari DeepThink
Untuk MASING-MASING 13 item: apakah usulan ini (a) cukup kuat untuk langsung diterima, (b) perlu
direvisi/dipersempit klaimnya, atau (c) sebaiknya ditolak/ditunda karena buktinya memang belum cukup?
Tak perlu riset baru dari nol — nilai berdasarkan sitasi & catatan verifikator yang sudah disediakan,
plus pengetahuan medis DeepThink sendiri. Ini keputusan MEDIS/KONTEN, bukan soal engine/skor.

---

## §1. 13 item Bagian B

### B1. `demam_tifoid` — Demam Tifoid (ICD-10 A01.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusInfeksi.ts:372 (objek), clue di baris 476`


**Isi game SAAT INI (`clue`, verbatim):**
> Demam stepladder (naik bertahap, puncak sore-malam) + lidah kotor + bradikardia relatif -> tifoid. Lini pertama FKTP/Fornas: kloramfenikol (alternatif kotrimoksazol/amoksisilin; bila tersedia & sesuai antibiogram/derajat, sefiksim/seftriakson) -- tekankan tuntas + istirahat total untuk cegah perforasi usus. Catatan: Widal tunggal punya angka positif-palsu tinggi, tegakkan dengan gambaran klinis + konteks endemis; kultur bila tersedia.


**Usulan tambahan:**
> Kultur darah (baku emas) praktis tak ada di Puskesmas. WHO/global geser ke seftriakson/azitromisin/fluorokuinolon akibat resistensi, tapi S. typhi Indonesia umumnya masih sensitif kloramfenikol — Fornas jadikan lini-1: murah, efektif. Wajib tuntas + pantau hematologik.


**Sitasi pengusul:** WHO Typhoid treatment (azithromycin/ceftriaxone/ciprofloxacin); PPK Demam Tifoid IDAI/PAPDI (kloramfenikol lini-1, sefiksim/seftriakson lini-2 MDR); Fornas FKTP; data resistensi S. typhi Asia (Bangladesh 1999–2022, medRxiv 2023)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti draft benar & terverifikasi: kultur darah tak tersedia di Puskesmas; WHO/global memang bergeser ke seftriakson/azitromisin/fluorokuinolon; Fornas + IDAI/PPK tetap kloramfenikol lini-1 (alternatif amoksisilin/kotrimoksazol, sefiksim/seftriakson utk MDR). Nuansa penting yang saya tambahkan: pergeseran global terutama didorong resistensi fluorokuinolon & galur MDR/XDR di Asia Selatan (Pakistan/Bangladesh), sedangkan S. typhi Indonesia sebagian besar MASIH sensitif kloramfenikol (MDR terhadap lini-lama relatif rendah/menurun) — jadi pilihan Indonesia bukan sekadar kompromi biaya, obat memang masih efektif. Draft yang hanya menyebut 'murah, tersedia' berisiko membuat mahasiswa menilai praktik FKTP tertinggal; koreksi ini mencegah miskonsepsi. Tidak bertentangan dgn clue kasus (yang sudah mengajarkan kloramfenikol lini-1 + kaveat Widal), justru memperkaya lapisan idealis-vs-realita. Keyakinan 'sedang' karena tak menemukan satu angka surveilans resistensi Indonesia 2023 yang tegas; klaim sensitivitas lokal bersandar pada perilaku guideline nasional + tren regional.


---

### B2. `konjungtivitis_bakterial` — Konjungtivitis Bakterial (ICD-10 H10.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusInfeksi.ts:828 (objek), clue di baris 926`


**Isi game SAAT INI (`clue`, verbatim):**
> Konjungtivitis bakterial: mata merah + sekret MUKOPURULEN + kelopak lengket pagi, TANPA nyeri hebat/silau/penurunan visus. Antibiotik topikal (kloramfenikol tetes), self-limiting 5-7 hari. Nyeri hebat + fotofobia + visus TURUN = red flag keratitis -> rujuk (AAO PPP).


**Usulan tambahan:**
> Tetes mata steroid/steroid-antibiotik (mis. deksametason, Cendo Xitrol) sebenarnya obat KERAS wajib resep, tapi lazim ditebus tanpa resep di apotek — pasien swamedikasi steroid pada mata merah, berisiko memperberat keratitis herpes/glaukoma hingga ulkus kornea.


**Sitasi pengusul:** AAO Preferred Practice Pattern — Conjunctivitis (2018); Penjelasan BPOM RI — deksametason & tetes mata steroid = golongan Obat Keras wajib resep (2020)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti bahaya BENAR & kuat (AAO: steroid topikal kontraindikasi pada keratitis HSV, memperberat infeksi, memicu glaukoma/katarak → risiko ulkus kornea). TAPI draft keliru secara regulatoris: tetes mata steroid (deksametason/Cendo Xitrol) di Indonesia = OBAT KERAS wajib resep, BUKAN "bebas di warung". Yang benar-benar dijual bebas di warung/obat bebas terbatas adalah tetrahydrozoline (Insto/Rohto/Visine) — vasokonstriktor, bukan steroid. Realita sesungguhnya = penegakan lemah: apotek sering menebus obat keras tanpa resep + swamedikasi, pemicu steroid-induced glaucoma. Dikoreksi jadi "obat keras yang lazim ditebus tanpa resep". Bukan kontradiksi clue: clue konjungtivitis bakterial tak menyinggung steroid; ini dimensi sistemik/akses tambahan. Keyakinan sedang: bahaya (AAO) & klasifikasi obat keras (BPOM) kuat, tapi tak ada studi Indonesia-spesifik ttg angka dispensing tanpa resep. Sumber file: primera-desktop/src/content/kasus/kasusInfeksi.ts (clue baris 926).


---

### B3. `kia_abortus_iminens` — Abortus Iminens (Ancaman Keguguran) (ICD-10 O20.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKiaJiwa.ts:364 (objek), clue di baris 461`


**Isi game SAAT INI (`clue`, verbatim):**
> Abortus IMINENS: perdarahan pervaginam pada kehamilan <20 minggu dengan ostium uteri TERTUTUP dan janin masih hidup. Tata laksana FKTP: istirahat wajar & pembatasan aktivitas berat (BUKAN tirah baring total -- tak terbukti mencegah keguguran, Cochrane/POGI; tirah baring lama berisiko trombosis), pelvic rest bila perdarahan aktif, lalu RUJUK untuk USG konfirmasi viabilitas janin & evaluasi SpOG. Waspadai progresi ke abortus insipiens/inkomplit (perdarahan hebat, ostium terbuka) -- kegawatan. Konseling: keguguran umumnya BUKAN akibat aktivitas ibu (PPK/PNPK Perdarahan Kehamilan Muda).


**Usulan tambahan:**
> Realita: abortus iminens rutin diberi progestin oral (alilestrenol/didrogesteron) walau bukti manfaat terbatas—progesteron vaginal (PRISM) hanya menolong subgrup dengan riwayat keguguran; pada pasien tanpa riwayat belum terbukti & bukan keharusan. Inti: rujuk USG.


**Sitasi pengusul:** PRISM RCT (Coomarasamy dkk., NEJM 2019); NICE NG126 (2019, upd. 2025); meta-analisis progestogen (Zhao dkk., Acta Obstet Gynecol Scand 2024); praktik lapangan RI (Premaston/Duphaston, obat keras rutin diresepkan)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Realita TERKONFIRMASI: progestin oral (alilestrenol/didrogesteron) memang rutin diresepkan utk abortus iminens di Indonesia (sumber pharma/klinis RI; keduanya obat keras, branded, mahal—bukan stok baku Fornas Puskesmas), padahal kasus ini harusDirujuk (SKDI 3B) → jurang idealis(rujuk USG)-vs-realita valid. NUANSA yang perlu dikoreksi: draft menyandarkan argumen pada PRISM yang menguji progesteron VAGINAL (NEJM 2019: keseluruhan tak signifikan RR0.91 CI0.81-1.01; manfaat hanya subgrup perdarahan+riwayat keguguran; NICE NG126 rekomendasi vaginal HANYA bila ada riwayat keguguran—pasien ini tak punya). Namun didrogesteron ORAL (yang justru dipakai di RI) punya bukti: meta-analisis 2024-25 menunjukkan penurunan ANGKA abortus vs plasebo, tapi luaran kelahiran hidup tak konsisten. Jadi 'belum terbukti' terlalu absolut & mencampur rute/obat—diperhalus jadi 'manfaat terbatas, terutama luaran lahir-hidup, & tak wajib pada pasien tanpa riwayat'. kontradiksiClue=false karena clue saat ini (bed-rest myth+rujuk) tak menyinggung progestin sama sekali—note ini MELENGKAPI, bukan mengoreksi. Keyakinan sedang: inti realita kuat, tapi lanskap bukti progestin genuinely mixed.


---

### B4. `jiwa_depresi_ringan` — Episode Depresif Ringan (ICD-10 F32.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKiaJiwa.ts:683 (objek), clue di baris 786`


**Isi game SAAT INI (`clue`, verbatim):**
> Depresi RINGAN: >=2 minggu mood depresif + anhedonia + gejala penyerta (tidur, nafsu makan, energi turun) dengan fungsi MASIH cukup terjaga. WAJIB skrining risiko bunuh diri di tiap kunjungan. Lini pertama mhGAP/NICE: PSIKOEDUKASI + konseling suportif/aktivasi perilaku + aktivitas fisik + active monitoring -- antidepresan TIDAK rutin untuk depresi ringan, tambahkan SSRI (fluoksetin) HANYA bila gejala menetap/mengganggu fungsi. Singkirkan hipotiroid & riwayat manik (bipolar). Kontrol berkala; rujuk bila memberat/ada risiko bunuh diri (mhGAP WHO / PPK Jiwa FKTP).


**Usulan tambahan:**
> Idealnya (mhGAP/NICE NG222) depresi ringan: psikoedukasi + aktivasi perilaku + active monitoring dulu, antidepresan tak rutin. Realita FKTP: layanan psikologi sering tak ada (hanya ~40% Puskesmas punya layanan jiwa) & kontrol sulit, obat kerap langsung diberi — bila perlu, sertai rencana kontrol + skrining bunuh diri.


**Sitasi pengusul:** NICE NG222 (2022); WHO mhGAP-IG v2.0 & Update 2023; Kemenkes/PDSKJI — cakupan layanan jiwa Puskesmas ~40% & mandat psikolog klinis PMK No.19/2024


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Sisi idealis KONFIRM kuat: NICE NG222 & mhGAP menempatkan intervensi psikososial + active monitoring sebagai lini pertama depresi ringan, antidepresan tak rutin. Sisi realita benar tapi draft menyempitkan sebabnya ke 'active monitoring sulit'. Bukti struktural menunjukkan pendorong utama adalah TIDAK TERSEDIANYA layanan psikososial itu sendiri: hanya ~40% Puskesmas mampu memberi layanan jiwa (timpang, terpusat di kota), psikolog klinis baru diwajibkan PMK No.19/2024, dan psikiater ~1.000 (70% di Jawa). Maka terapi psikososial terstruktur sering tak bisa dijalankan → obat/rujukan jadi fallback. Klaim 'obat kerap langsung diberi' masuk akal namun bersifat interpretatif (tak ada data prevalensi peresepan langsung yang saya temukan) → keyakinan 'sedang'. Skrining bunuh diri + rencana kontrol sudah tepat (sesuai mhGAP). Tidak kontradiksi dengan clue kasus (baris 786) yang sudah mengajarkan antidepresan tak rutin untuk depresi ringan; catatan ini menambah lapisan 'mengapa realita menyimpang'. Caveat tak dimasukkan ke catatan final karena kurang bukti solid: pola obat yang benar-benar tersedia/distok di Puskesmas (amitriptilin TCA murah vs SSRI) bisa memengaruhi pilihan obat — tak terverifikasi di Fornas terkini, jadi tidak diklaim.


---

### B5. `kia_malaria_falsiparum` — Malaria Falsiparum (ICD-10 B50.9)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKiaJiwa.ts:1040 (objek), clue di baris 1153`


**Isi game SAAT INI (`clue`, verbatim):**
> Malaria falsiparum: demam periodik + menggigil + splenomegali + riwayat dari daerah endemis (Papua/NTT). KONFIRMASI dengan RDT/mikroskopis SEBELUM terapi. Lini pertama Kemenkes: ACT = DHP (Dihidroartemisinin-Piperakuin) 3 hari + primakuin dosis tunggal 0,25 mg/kgBB (gametosidal). SINGKIRKAN KEHAMILAN pada perempuan usia subur: primakuin KONTRAINDIKASI pada hamil & bayi <6 bln (beri DHP saja) -- tes G6PD tidak diwajibkan untuk dosis tunggal falsiparum. JANGAN pakai klorukin untuk falsiparum -- resisten luas di Indonesia. Kenali tanda MALARIA BERAT (penurunan kesadaran, kejang, ikterik, gagal ginjal, hipoglikemia) -> rujuk (Pedoman Tata Laksana Malaria Kemenkes).


**Usulan tambahan:**
> Malaria impor: pasien pulang dari Papua/NTT kerap berobat di Puskesmas Jawa/Bali non-endemis yang tak menstok RDT & ACT (DHP)/primakuin (distribusi terfokus daerah endemis) → diagnosis terlambat. Curigai demam+riwayat perjalanan; siapkan rujukan & lapor e-SISMAL.


**Sitasi pengusul:** Buku Saku Tata Laksana Kasus Malaria Kemenkes 2023; KMK No.556/2019 (PNPK Malaria); e-SISMAL Kemenkes; laporan kasus malaria impor wilayah non-endemis (Medicina Udayana, 2024)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Draft faktual, mutakhir, dan relevan. Premis cocok dgn kasus (keluhan utama "baru pulang dari Papua"). Malaria = program vertikal Kemenkes; RDT+DHP/primakuin adalah komoditas program yang dialokasikan menurut beban kasus/API ke daerah endemis, sehingga FKTP fase-eliminasi Jawa/Bali kerap tak menstok buffer RDT/ACT → malaria impor terlambat terdiagnosis. Didukung laporan kasus falsiparum berat impor di wilayah non-endemis Bali (Medicina Udayana) & prinsip kewaspadaan reseptivitas/vulnerabilitas eliminasi. e-SISMAL adalah sistem pelaporan surveilans malaria yang benar & wajib. Keyakinan 'sedang' krn klaim spesifik "stok tak tersedia di non-endemis" bersandar pada logika distribusi komoditas + laporan lapangan, bukan satu kutipan pedoman eksplisit. kontradiksiClue=false: clue kasus hanya mengajar diagnosis/terapi (DHP, jangan klorokuin, singkirkan hamil) & tak menyentuh konteks ketersediaan di FKTP non-endemis, jadi catatan ini MELENGKAPI bukan mengoreksi. catatanFinal diringkas ke 265 karakter (≤280).


---

### B6. `otitis_media_akut` — Otitis Media Akut (ICD-10 H66.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKronis.ts:525 (objek), clue di baris 641`


**Isi game SAAT INI (`clue`, verbatim):**
> OMA (AAP/WHO): diagnosis butuh membran timpani menonjol (bulging) + tanda inflamasi akut. Amoksisilin dosis tinggi (80-90 mg/kg/hari) lini pertama + analgesik untuk nyeri. Tetes antibiotik hanya bila ada perforasi/otorea. Watchful waiting dapat dipertimbangkan pada kasus ringan usia >2 th.


**Usulan tambahan:**
> Dosis tinggi amoksisilin 80–90 mg/kg/hari (AAP 2013) di lapangan sering menyusut jadi ~40–50 mg/kg/hari — memadai untuk pneumokokus peka, tapi bisa gagal pada strain resisten. Otoskop berfungsi pun tak selalu ada, sehingga 'bulging' tak ternilai dan diagnosis jadi terkaan.


**Sitasi pengusul:** AAP AOM Guideline 2013 (Lieberthal, Pediatrics); "Optimizing antibiotic use in Indonesia" systematic review 2022; Permenkes 43/2019 (peralatan Puskesmas)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti benar & relevan FKTP. (1) 80–90 mg/kg/hari lini pertama = CONFIRMED (AAP 2013); clue kasus sudah mengajarkan angka ini, jadi catatan ini melengkapi—bukan mengoreksi (kontradiksiClue=false). (2) Under-dosing di lapangan didukung systematic review antibiotik Indonesia 2022 (amoksisilin sering diberi dosis substandar), tapi kata "subterapeutik" terlalu absolut: dosis standar ~40–45 mg/kg masih efektif utk pneumokokus peka; rasional dosis tinggi khusus menutup strain resisten-penisilin—maka diperhalus. (3) Otoskop: Permenkes 43/2019 mewajibkan min. 1 unit, tapi regulasi sendiri mengakui substitusi bila infrastruktur belum memadai; realdistik banyak Puskesmas tak punya otoskop berfungsi → 'bulging' (kriteria diagnostik AAP) tak ternilai. Keyakinan sedang: fakta guideline kuat, tetapi angka spesifik dosis lapangan & prevalensi otoskop bersifat estimasi observasional, bukan data pinpoint.


---

### B7. `kulit_pioderma_impetigo` — Pioderma -- Impetigo Krustosa (ICD-10 L01.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKulit.ts:276 (objek), clue di baris 386`


**Isi game SAAT INI (`clue`, verbatim):**
> Impetigo krustosa: KRUSTA MADU (honey-colored) di wajah anak. Terlokalisir -> LINI PERTAMA mupirosin topikal (IDSA/Perdoski); LUAS/multipel -> tambah antibiotik oral anti-Staph (cefadroxil; eritromisin bila alergi penisilin). Rendam & lepaskan krusta, potong kuku, cuci tangan (PPK Perdoski/IDAI).


**Usulan tambahan:**
> Mupirosin (lini pertama pedoman) sering TIDAK distok di Puskesmas—umumnya sediaan bermerek. Realistis: salep gentamisin generik (paling sering ada), asam fusidat, atau langsung antibiotik oral anti-Staph (sefadroksil). Sesuaikan stok Fornas/e-katalog setempat; jangan resepkan obat yang kosong.


**Sitasi pengusul:** Fornas — KMK No. HK.01.07/Menkes/2197/2023 (berlaku Mar 2024); IDSA SSTI Guidelines 2014 & PPK Perdoski (mupirosin lini pertama impetigo); praktik FKTP Indonesia (diskusi klinis Alomedika)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti draft benar & mencerminkan jurang nyata FKTP: mupirosin (lini pertama IDSA/Perdoski) di Indonesia hampir selalu produk bermerek (Bactoderm/Mupicor/Pirotop dll) sehingga sering tak distok Puskesmas; substitusi lapangan adalah gentamisin salep generik (murah, paling sering ada—dikonfirmasi diskusi klinis Alomedika & selaras komentar kode migrasi gentamisin→mupirosin) atau antibiotik oral (sefadroksil). Koreksi kecil: draft menyandingkan 'asam fusidat/gentamisin' setara, padahal asam fusidat juga umumnya bermerek/obat keras—gentamisin generik yang lebih andal distok; wording diperhalus. Fornas (KMK 2197/2023) memang jadi acuan pengadaan Puskesmas dengan pengadaan luar-Fornas butuh izin Dinkes, mendukung frasa 'sesuai stok setempat'. Tak bisa memastikan line-item Fornas 2023 spesifik mupirosin utk FKTP → keyakinan sedang. kontradiksiClue=false: melengkapi, tidak mengoreksi clue yang sudah benar mengajarkan mupirosin sebagai lini pertama.


---

### B8. `kulit_herpes_zoster` — Herpes Zoster (ICD-10 B02.9)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKulit.ts:516 (objek), clue di baris 616`


**Isi game SAAT INI (`clue`, verbatim):**
> Herpes zoster: vesikel bergerombol UNILATERAL dermatomal + nyeri neuralgik. ASIKLOVIR HARUS dimulai <72 JAM sejak ruam (asiklovir 5x800 mg/hari 7 hari; sediaan 400 mg -> 2 tablet per dosis) untuk memangkas durasi & risiko NEURALGIA PASCAHERPETIK. Analgesik adekuat. Waspadai zoster oftalmikus (rujuk mata) (PPK Perdoski/CDC).


**Usulan tambahan:**
> Asiklovir zoster 5×800 mg/hari (di FKTP = 5×2 tab 400 mg = 10 tablet/hari, 7 hari) menekan kepatuhan. Valasiklovir 3×1 g lebih ringkas dan ADA di Fornas, tapi restriksi tingkat RS & lebih mahal—tak lazim di Puskesmas. Realistis tetap asiklovir 5×/hari; kunci: alarm & jadwal minum.


**Sitasi pengusul:** PPK Perdoski (dosis asiklovir 5×800 mg & valasiklovir 3×1 g herpes zoster); Fornas 2023 (KMK Menkes No. HK.01.07/2197/2023, kelas 6.6.1 Antiherpes — asiklovir tab 200/400 mg tersedia TK-1/FKTP, valasiklovir 500 mg restriksi tingkat lanjut)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti draft benar & bernilai pedagogis: regimen asiklovir 5×800 mg/hari (=10 tab 400 mg/hari) memang membebani kepatuhan, dan valasiklovir 3×1 g lebih praktis (PPK Perdoski terkonfirmasi). NAMUN klaim spesifik "valasiklovir belum tentu masuk Fornas" KELIRU — valasiklovir 500 mg terdaftar di Fornas 2023 (antiherpes 6.6.1). Hambatan sebenarnya bukan "tak masuk Fornas" melainkan restriksi tingkat faskes (asiklovir di TK-1/FKTP; valasiklovir cenderung tingkat RS) plus harga lebih mahal, sehingga di Puskesmas realistis tetap asiklovir 5×/hari. Karena itu perlu-nuansa: catatanFinal dikoreksi. Tak bertentangan dengan clue kasus (yang sudah mengajarkan asiklovir 5×800 mg) → kontradiksiClue false. Keyakinan sedang: dosis sangat kuat, tetapi tingkat restriksi FKTP-vs-RS bersumber dari ringkasan dokumen Fornas, bukan baris primer yang saya baca verbatim.


---

### B9. `kulit_varisela` — Varisela (Cacar Air) (ICD-10 B01.9)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKulit.ts:632 (objek), clue di baris 729`


**Isi game SAAT INI (`clue`, verbatim):**
> Varisela: lesi POLIMORF (semua stadium bersamaan) distribusi sentripetal + demam. Asiklovir (5x800 mg/hari 7 hari) bermanfaat pada REMAJA/DEWASA/imunokompromais bila <24-72 jam onset ruam. Simtomatik + kalamin untuk gatal, potong kuku, HINDARI ibuprofen. Isolasi hingga semua lesi berkrusta; jauhi ibu hamil & imunokompromais (PPK Perdoski/CDC).


**Usulan tambahan:**
> VZIG untuk kontak rentan berisiko (mis. bumil) idealnya <=96 jam (bisa s/d 10 hari) pascapajanan, tetapi praktis tak tersedia di Indonesia. Realistis: rujuk bumil ke SpOG; bila VZIG tak ada, asiklovir oral profilaksis mulai hari ke-7-10 dapat dipertimbangkan.


**Sitasi pengusul:** CDC MMWR 2013 (Updated Recommendations for Use of VariZIG — hingga 10 hari); AAP Red Book & VZV post-exposure prophylaxis review (PMC6931226, 2019)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti draft benar & bernilai (VZIG ideal untuk bumil terpajan, tetapi praktis tak tersedia di Indonesia — tidak di Fornas, tidak dipasarkan). Dua koreksi: (1) Jendela VZIG kini hingga 10 hari pascapajanan, bukan hanya <=96 jam (CDC MMWR 2013; studi VARIZIG open-label: insidensi 6,3% bila <=96 jam vs 9,4% bila 96 jam-10 hari). (2) Draft menyatakan "realistis hanya observasi" — kurang lengkap: bila VZIG tak ada, asiklovir oral profilaksis (20 mg/kg 4x/hari, mulai hari ke-7-10, 7 hari) adalah alternatif yang diakui CDC/AAP dan JUSTRU tersedia di FKTP Indonesia; jadi ada opsi farmakologis, bukan sekadar tunggu-lihat. Caveat: bukti profilaksis asiklovir terkuat pada anak sehat, lebih lemah pada bumil → "dapat dipertimbangkan" + rujuk SpOG. Keyakinan sedang: koreksi timing/alternatif tersumber kuat, tetapi klaim ketiadaan spesifik-Indonesia bersandar realita lapangan tanpa sumber terbit. kontradiksiClue=false: clue kasus hanya membahas isolasi & asiklovir untuk penderita, tidak menyentuh profilaksis pascapajanan kontak — catatan ini mengisi celah, bukan mengoreksi ajaran game.


---

### B10. `kulit_kandidiasis_kutis` — Kandidiasis Kutis (Intertriginosa) (ICD-10 B37.2)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusKulit.ts:745 (objek), clue di baris 846`


**Isi game SAAT INI (`clue`, verbatim):**
> Kandidiasis intertriginosa: plak merah LEMBAP di lipatan + LESI SATELIT (papulopustul di luar tepi) -> antijamur topikal (mikonazol/ketokonazol) + JAGA AREA KERING (tepuk kering, pakaian menyerap). Selidiki faktor predisposisi: DM, obesitas, kelembapan. Cek gula darah (PPK Perdoski).


**Usulan tambahan:**
> Lampu Wood pemisah eritrasma-kandida sering tak ada di Puskesmas dan KOH jarang dikerjakan rutin, jadi terapi kerap empiris. 'Jaga area kering' sulit pada pasien obes di iklim lembap — rekurensi tinggi selama BB, kelembapan, dan gula darah belum dikoreksi.


**Sitasi pengusul:** PPK PERDOSKI 2021 (kandidiasis kutis); Fornas 2023 (Kepmenkes HK.01.07/MENKES/2197/2023 — mikonazol/ketokonazol/nistatin topikal); StatPearls Erythrasma 2023 (fluoresensi coral-red lampu Wood)


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Klaim inti terverifikasi: lampu Wood memisahkan eritrasma (fluoresensi coral-red, coproporphyrin III C. minutissimum) dari kandida yang tidak berpendar (StatPearls). Lampu Wood memang bukan alat standar Puskesmas (bukan item wajib sarana FKTP), sehingga terapi empiris realistis — namun klaim "sering tak ada" kuat secara klinis tapi tanpa sitasi regulasi keras, maka keyakinan sedang. Rekurensi tinggi tanpa koreksi berat badan/kelembapan/gula darah sesuai PPK PERDOSKI dan narasi konsekuensi kasus. Mikonazol/ketokonazol/nistatin topikal ada di Fornas. Draft benar; diperhalus dengan menambah KOH (yang kasus sebut sebagai penunjang bedside) karena di lapangan pun jarang dikerjakan rutin — ini gap penunjang yang lebih sentral daripada lampu Wood. Tidak bertentangan dengan clue (clue menyuruh jaga area kering + cek gula; realita justru melengkapi dengan menjelaskan kenapa itu sulit dan mengapa rekurensi tinggi). kontradiksiClue = false.


---

### B11. `mm_dislipidemia` — Dislipidemia (ICD-10 E78.5)

**Jenis usulan:** 💡 Mutiara EBM (mutiaraEbm)

**Lokasi kode:** `src/content/kasus/kasusMetabolikMsk.ts:166 (objek), clue di baris 273`


**Isi game SAAT INI (`clue`, verbatim):**
> Dislipidemia sering ASIMTOMATIK -- jangan meremehkan hanya karena tak ada keluhan. Nilai risiko KV total (LDL tinggi + perokok + riwayat keluarga dini + TD tinggi). Terapi: perubahan gaya hidup WAJIB + statin (simvastatin malam hari). Cek SGOT/SGPT baseline. Simvastatin diminum malam (PPK PERKI / Kemenkes PTM).


**Usulan tambahan:**
> LDL ≥190 mg/dL yang terisolasi + riwayat jantung dini keluarga bukan sekadar 'kolesterol gaya hidup' — curigai Hiperkolesterolemia Familial & rujuk untuk skrining keluarga. Di kasus ini pola campuran (TG tinggi, HDL rendah, obesitas) condong ke dislipidemia metabolik.


**Sitasi pengusul:** PB PERKENI, Panduan Pengelolaan Dislipidemia di Indonesia 2021; kriteria Dutch Lipid Clinic Network (DLCN); ESC/EAS Dyslipidaemias 2019


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Konsep FH sebagai mimicker 'kolesterol gaya hidup' VALID & penting (DLCN; FH ~1:250, sering telat terdiagnosis di Indonesia — PERKENI 2021). TAPI draft memaksakannya ke kasus yang buruk fit-nya. (1) LDL kasus = 182, di BAWAH ambang suspek FH ≥190. (2) Pola CAMPURAN (TG 210 tinggi, HDL 38 rendah) + obesitas sentral IMT 29 + prediabetes + perokok = sindrom metabolik/dislipidemia gaya hidup, BUKAN pola LDL terisolasi khas FH (FH umumnya TG normal). (3) Pasien 40-60 th, bukan 'usia relatif muda' seperti klaim draft. (4) Skor DLCN kasus ini hanya ~2 poin = 'unlikely FH', bukan 'possible' (3-5) seperti klaim alasan; ayah wafat TEPAT usia 55 = batas 'premature <55' pada pria, borderline. (5) 'Statin intensitas tinggi' bentrok dengan intoleransi statin yang sudah tercatat di kasus (alergiTrap→ezetimibe) & merupakan aksi lini rujukan, di luar eksekusi FKTP. Inti EBM benar, tapi aplikasi ke kasus perlu dikoreksi: catatanFinal diarahkan mengajarkan AMBANG PICU FH (LDL≥190 terisolasi + CAD dini keluarga → rujuk skrining kaskade) sambil jujur bahwa pasien ini condong metabolik → status perlu-nuansa. kontradiksiClue=false: catatan justru sejalan dengan clue (framing gaya hidup/risiko KV), tak mengoreksi ajaran game.


---

### B12. `mm_dislipidemia` — Dislipidemia (ICD-10 E78.5)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusMetabolikMsk.ts:166 (objek), clue di baris 273`


**Isi game SAAT INI (`clue`, verbatim):**
> Dislipidemia sering ASIMTOMATIK -- jangan meremehkan hanya karena tak ada keluhan. Nilai risiko KV total (LDL tinggi + perokok + riwayat keluarga dini + TD tinggi). Terapi: perubahan gaya hidup WAJIB + statin (simvastatin malam hari). Cek SGOT/SGPT baseline. Simvastatin diminum malam (PPK PERKI / Kemenkes PTM).


**Usulan tambahan:**
> Di praktik FKTP, statin yang tersedia lazimnya hanya simvastatin (intensitas sedang); atorvastatin/rosuvastatin intensitas tinggi jarang ada di rak Puskesmas. Pemantauan ulang lipid & SGOT/SGPT sering terlewat, dan pasien kerap putus obat karena merasa 'tak ada keluhan'.


**Sitasi pengusul:** PERKENI Panduan Pengelolaan Dislipidemia 2021; Fornas (KMK Kemenkes terbaru); Pedoman PTM Kemenkes


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti draft benar: simvastatin = intensitas sedang dan menjadi statin praktis satu-satunya di rak Puskesmas, sedangkan atorvastatin/rosuvastatin intensitas tinggi jarang tersedia (klasifikasi statin dikonfirmasi PERKENI 2021 & ACC/AHA; realita FKTP didukung sumber lapangan). Dua koreksi kecil: (1) draft asli ~350 karakter, melebihi batas 280 → dipadatkan; (2) atorvastatin SEBENARNYA ada di Fornas (dengan restriksi), jadi 'tak masuk stok' diperhalus menjadi 'jarang ada di rak Puskesmas' agar akurat. Tidak mengoreksi clue: clue mengajarkan cek SGOT/SGPT BASELINE + lifestyle + simvastatin malam; catatan ini menambah dimensi realita (keterbatasan pilihan statin + pemantauan LANJUTAN yang terlewat + putus obat), sehingga melengkapi—bukan berlawanan. Keyakinan 'sedang' karena teks restriksi Fornas spesifik tak berhasil dikutip langsung; klaim stok bertumpu pada sumber sekunder/praktik lapangan.


---

### B13. `hemoroid_grade1` — Hemoroid Interna Grade 1 (ICD-10 K64.0)

**Jenis usulan:** 🏥 Realita FKTP (catatanRealita)

**Lokasi kode:** `src/content/kasus/kasusRespGi.ts:953 (objek), clue di baris 1044`


**Isi game SAAT INI (`clue`, verbatim):**
> Hemoroid interna grade 1: hematokezia segar TANPA nyeri, menetes/di kertas pascadefekasi, benjolan BELUM prolaps. Tata laksana KONSERVATIF: tinggi serat + cukup air + hindari mengejan lama + pelunak tinja; bukan indikasi bedah. WAJIB colok dubur & waspadai red flag keganasan (usia >45-50, BB turun, anemia, perubahan pola BAB, riwayat keluarga kanker kolorektal) -> pertimbangkan rujukan/kolonoskopi (PPK IDI).


**Usulan tambahan:**
> Kolonoskopi untuk menyingkirkan keganasan hanya di RS rujukan; anoskopi kerap tak dipakai dan tes darah samar tinja (FOBT) baru digulirkan lewat program skrining, belum merata—sehingga banyak perdarahan rektal 'diamati saja' karena rujukan terkendala antrean, jarak, dan biaya.


**Sitasi pengusul:** Permenkes 43/2019 (standar Puskesmas); Kemenkes — Skrining Kanker Kolorektal via Cek Kesehatan Gratis 2025 (RAN Penanggulangan Kanker 2024–2034); PPK IDI Hemoroid


**Catatan verifikator (kenapa cuma "sedang", verbatim):**
> Inti realita benar dan relevan: kolonoskopi jelas prosedur RS (bukan FKTP), dan hambatan rujukan (antrean/jarak/biaya) membuat banyak perdarahan rektal hanya diamati — konteks yang membentuk keputusan lapangan. Dua koreksi nuansa: (1) klaim absolut 'anoskopi tidak tersedia di Puskesmas' berlebihan — anoskop murah/sederhana, lebih tepat 'sering tak tersedia/jarang dipakai'; grade 1 justru SKDI 4A/fktp144 (harusDirujuk:false) dan diagnosis bertumpu pada colok dubur yang memang tersedia. (2) 'FOBT belum rutin' kini agak dated: Kemenkes sudah mengintegrasikan skrining kolorektal (colok dubur+FOBT) ke program Cek Kesehatan Gratis / RAN Kanker 2024–2034, tetapi implementasi masih dini & tak merata. Tidak kontradiksi dengan clue (clue menganjurkan pertimbangkan rujukan/kolonoskopi; catatan ini menjelaskan mengapa akses itu terkendala). Keyakinan sedang karena bagian anoskopi/daftar alat Permenkes 43/2019 tak terkonfirmasi persis di sumber.


---

---

## §2. PERGUMULAN — apakah "riwayat praktik keliru" perlu jadi konten pedagogis eksplisit?

Ini pertanyaan TERPISAH dari §1 — brainstorm desain, bukan permintaan keputusan cepat. Dr. Wirayuda
ingin pendapat DeepThink DAN mencatatnya sebagai bahan pemikiran sendiri.

### 2a. Pertanyaan asli (Dr. Wirayuda, 2026-07-10, verbatim diterjemahkan konteksnya)

Selama proses M11 ini, versi AWAL konten PRIMERA (yang ditulis Claude sebelum audit/koreksi M10.5-M11
berjalan) beberapa kali ternyata keliru/usang dibanding pedoman terkini (lihat Bagian A: 21 koreksi;
juga temuan cross-check PPK/PNPK sepanjang sesi ini — mis. `hipertensi_esensial` yang pakai monoterapi
JNC-8 padahal PNPK 2021 mewajibkan kombinasi, atau `mata_konjungtivitis_alergi` yang melarang steroid
topikal padahal PPK Kemenkes mengizinkannya). Dr. Wirayuda lalu berpikir: bagaimana kalau konten LAMA
itu bukan sekadar "simplifikasi gameplay yang kebetulan salah", melainkan justru **mencerminkan
praktik yang genuinely masih dilakukan luas oleh banyak FKTP di lapangan — sesuatu yang dulu (atau
sampai sekarang) dianggap benar, ternyata keliru/usang, dan proses inilah (menemukan + memperbaiki)
yang baru saja dialami tim development**.

Pertanyaannya: **apakah konteks "riwayat praktik keliru → ditemukan → diperbaiki" ini layak dijadikan
konten pedagogis eksplisit** untuk mahasiswa/pemain — mengajarkan mereka cara MENEMUKAN kekeliruan
praktik dan MEMPERBAIKINYA, mirip materi mata kuliah **SPK (Sistem Pelayanan Kesehatan)** soal audit
klinis/manajemen mutu/organisasi pelayanan kesehatan? Atau ini lebih cocok jadi ide pengembangan game
di kemudian hari (M12+), bukan sekarang?

### 2b. Konteks tambahan yang perlu diketahui DeepThink sebelum menjawab

**Ini BUKAN ide pertama soal "kesenjangan ideal-vs-realita" di PRIMERA** — sudah ada DUA lapisan
serupa yang sedang dibangun/direncanakan, dan pertanyaan Dr. Wirayuda ini berpotensi jadi **lapisan
KETIGA yang berbeda sumbu**, bukan duplikat:

1. **Sumbu 1 (sudah berjalan, M11 Fase-1): EBM-textbook-ideal vs realita-sumber-daya-FKTP** — field
   `mutiaraEbm`/`catatanRealita`. Contoh: colchicine untuk gout benar secara EBM, tapi jarang distok
   Puskesmas riil. Sumbunya: KEBENARAN KLINIS SAMA, bedanya KETERSEDIAAN/KELAYAKAN di lapangan.
2. **Sumbu 2 (baru diformalkan M10.5 §3c, belum diimplementasi): EBM-terkini vs Panduan-Resmi-Kemenkes
   (PPK/PNPK) vs Realita-Lapangan** — 3 kotak debrief terpisah, rencana field baru `panduanResmi`.
   Sumbunya: SUMBER OTORITAS BERBEDA bisa punya rekomendasi SEDIKIT berbeda satu sama lain (mis.
   AAO internasional melarang steroid mata di FKTP, PPK Kemenkes mengizinkan) — bukan salah-benar,
   tapi otoritas mana yang diikuti dalam konteks apa.
3. **Sumbu 3 (ide BARU Dr. Wirayuda, belum ada bentuknya sama sekali): riwayat TEMPORAL** — bukan
   soal "ideal vs realita" ataupun "otoritas A vs B", tapi **"dulu dianggap benar (bahkan mungkin
   genuinely praktik luas) → sekarang terbukti/diperbarui keliru → begini proses menemukan &
   memperbaikinya"**. Ini soal EVOLUSI pedoman dari waktu ke waktu, dan proses AUDIT/QI (Quality
   Improvement) yang menemukannya — bukan soal SUMBER mana yang benar hari ini.

**Catatan kejujuran epistemik penting** (Claude menandai ini sebelum DeepThink menjawab): klaim "ini
dulu genuinely praktik luas banyak FKTP" adalah KLAIM EPIDEMIOLOGIS TERSENDIRI yang butuh bukti
per-kasus, BUKAN otomatis benar hanya karena versi lama PRIMERA kebetulan menuliskannya begitu. Versi
lama PRIMERA ditulis Claude berdasar pengetahuan umum/textbook, BUKAN hasil survei praktik FKTP
Indonesia riil — jadi bisa saja itu cuma "simplifikasi textbook yang kebetulan sudah usang" (mis.
textbook lama yang dipelajari Claude), bukan cerminan sungguhan "banyak FKTP mempraktikkannya". Kedua
kemungkinan ini py implikasi pedagogis BEDA: kalau memang genuinely praktik luas → mengajarkannya
sbg "kenali kekeliruan sistemik" sangat bernilai (persis semangat audit-mutu). Kalau cuma textbook lama
Claude yang usang → mengajarkannya sbg "riwayat praktik FKTP" jadi KELIRU/OVERCLAIM, walau kontennya
sendiri sudah benar diperbaiki. **Setiap kasus yang mau dipakai sbg contoh "riwayat" HARUS diverifikasi
dulu apakah benar ada bukti pergeseran guideline temporal beneran (bukan cuma "versi lama kami salah"),
baru layak dijadikan materi riwayat pedoman ke pemain.** Contoh yang KEMUNGKINAN benar-benar temporal
(guideline berubah dari waktu ke waktu, bukan cuma Claude yang keliru): pergeseran WHO tifoid dari
kloramfenikol ke fluorokuinolon/seftriakson akibat resistensi (item Bagian B #1 di §1); pergeseran
dosis amoksisilin OMA (AAP 2013 naikkan dosis akibat resistensi pneumokokus) — keduanya genuinely
riwayat evolusi guideline internasional, terlepas dari soal PRIMERA.

### 2c. Kaitan kurikuler yang disebut Dr. Wirayuda (SPK) — kenapa ini bukan ide asing

Sistem Pelayanan Kesehatan (SPK)/Kedokteran Komunitas di kurikulum FK Indonesia memang mengajarkan
audit klinis, manajemen mutu (continuous quality improvement/PDSA cycle), dan tata kelola organisasi
pelayanan kesehatan sebagai kompetensi tersendiri — bukan sekadar "pengetahuan penyakit". Menariknya,
riset UKM yang baru selesai sesi ini (`docs/UKM_SUMBER_RISET_M11.md`) SUDAH menemukan bahwa Permenkes
19/2024 (payung hukum reformasi ILP) punya BAB V eksplisit soal "Peningkatan Mutu" Puskesmas — jadi
ada landasan regulasi nyata yang bisa dipakai kalau arah ini mau dikembangkan, bukan mengada-ada.

### 2d. Opsi brainstorm (menu, BUKAN rekomendasi tunggal)

**Opsi 1 — Diamkan saja, koreksi senyap (status quo).** Field `mutiaraEbm`/`catatanRealita`/
`panduanResmi` tetap murni tampilan "begini yang benar", tanpa jejak "dulu game ini bilang lain".
Plus: tak menambah kompleksitas/verbositas (isu berulang di proyek ini — lihat 2f). Minus: kehilangan
momen pedagogis yang Dr. Wirayuda identifikasi; pemain tak pernah belajar bahwa pedoman klinis itu
HIDUP/berubah, bukan tabel statis.

**Opsi 2 — Sitasi ringan "riwayat" HANYA saat genuinely temporal (bukan mekanik baru).** Untuk kasus
yang LOLOS verifikasi 2b (pergeseran guideline temporal terbukti, bukan cuma typo Claude lama), tambah
satu kalimat di `catatanRealita`/`panduanResmi` yang sudah direncanakan: "Sampai awal 2000an, WHO
menganjurkan kloramfenikol; pergeseran ke seftriakson/azitromisin terjadi karena resistensi meningkat
di [wilayah]." Biaya implementasi: nyaris nol (field sudah ada/direncanakan), tapi jangkauannya kecil
(cuma kasus yang genuinely py riwayat guideline, bukan filosofi umum "audit mutu").

**Opsi 3 — Fitur baru "Jejak Pedoman" (Guideline Trail) di Buku Saku/Dex.** Untuk kasus-kasus
terpilih yang py riwayat temporal genuine, tambah panel expandable terpisah: timeline "Dulu → Kenapa
berubah → Sekarang", eksplisit dibingkai sbg pengajaran evolusi EBM/CME (continuing medical education).
Biaya: field/UI baru (non-REVISI, tapi tetap kerja desain+konten baru), butuh kurasi kasus mana yang
py cerita temporal genuine (bukan semua 67 kasus punya ini).

**Opsi 4 — Mekanik baru "Audit Mutu Internal" (paling ambisius, M12+).** Sebuah UKM/manajemen quest
baru: pemain (dokter) menemukan gap antara praktik Puskesmas-nya vs pedoman terbaru (mis. lewat surat
masuk/insiden/kasus rujukan-balik), lalu menjalankan siklus audit-mutu sederhana (identifikasi gap →
cari standar benar → usulkan perubahan protokol Puskesmas → ukur dampak) — mengajarkan SPK/audit-mutu
sbg MEKANIK, bukan cuma bacaan. Biaya: TINGGI — mekanik/state/skor baru, kemungkinan butuh
`REVISI_ENGINE` bump kalau memengaruhi skor, riset konten (contoh audit-mutu FKTP nyata) dari nol.
Cocoknya M12 (yang memang dijadwalkan sbg "full aesthetic + fitur besar pass" sesudah M10/M11), BUKAN
M11 yang sudah padat & berdeadline September 2026.

**Opsi 5 — Meta-transparansi soal proses development sendiri (paling eksperimental).** Ide paling liar:
literally beri tahu pemain (di Kredit/Tentang, atau easter egg) bahwa proses koreksi konten game ini
sendiri (ditemukan salah → diperbaiki via AI+dokter review) MENCERMINKAN proses audit-mutu klinis
sungguhan — bikin proses pembuatan game jadi materi ajar itu sendiri. Menarik secara konsep, tapi
berisiko terasa terlalu "cute"/self-referential dan mengalihkan fokus dari konten klinis. Dicatat sbg
brainstorm ekstrem, bukan usulan serius.

### 2e. Kalau harus memilih sekarang (lean Claude, bukan keputusan)

Kalau dipaksa memilih HARI INI dengan constraint M11 (deadline September, sudah banyak item tertunda):
**Opsi 2** paling masuk akal sbg langkah SEKARANG (murah, memperkaya field yang sudah direncanakan,
tak menambah beban verbositas signifikan) — DENGAN syarat kurasi ketat sesuai 2b (hanya kasus yang
genuinely py bukti pergeseran guideline temporal, bukan asal tempel narasi "dulu keliru" ke semua
kasus). **Opsi 3/4** dicatat sbg ide valid untuk M11-lanjutan/M12 — terutama Opsi 4 yang punya
kaitan kurikuler SPK kuat & sudah py landasan regulasi (Permenkes 19/2024 BAB V) — TAPI jangan
dikerjakan sekarang, taruh di backlog M12 supaya tak mengganggu tenggat M11/M10.5.

### 2f. Tegangan yang perlu diingat DeepThink saat menjawab

Proyek ini sudah DUA KALI "terbakar" oleh masalah verbositas/wall-of-text (lihat riwayat: masalah
38-tombol-edukasi yang perlu di-taxonomi-ulang M7; kekhawatiran eksplisit soal Debrief Malam jadi
kepanjangan kalau tiap kasus dapat paragraf riwayat). Opsi manapun yang direkomendasikan HARUS
menghormati batas ini — PRIMERA sudah punya banyak lapisan informasi per-kasus (clue, mutiaraEbm,
catatanRealita, rencana panduanResmi) dan menambah lapisan ke-4 (riwayat temporal) TANPA disiplin
kurasi/tampilan bisa membuat debrief encounter jadi kepanjangan, kontraproduktif thd tujuan
pembelajaran itu sendiri.

---

## §3. Yang diminta dari DeepThink (ringkasan)

1. Untuk 13 item §1: nilai tiap satu — terima/revisi/tolak, dengan alasan singkat.
2. Untuk pergumulan §2: mana dari 5 opsi (atau kombinasi/opsi lain) yang DeepThink rekomendasikan,
   dengan pertimbangan tegangan verbositas (2f) dan tenggat M11 (September 2026)? Ini keputusan
   desain-pedagogis Dr. Wirayuda pada akhirnya, tapi pendapat kedua DeepThink diminta dulu.
