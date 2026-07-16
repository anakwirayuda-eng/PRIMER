# M13 Lab Decision Ledger

> Clone: `D:\Dev\PRIMER-CODEX-lab\primera-desktop`
> Status: full-fledge lab prototype, bukan release kurikulum teradjudikasi
> Runtime label: `lab_prototype_unadjudicated`

## Aturan Operasi

- PPK/PNPK Kemenkes aktif adalah floor; EBM yang lebih baru boleh mengganti
  floor bila sumbernya disebut dan keputusan tetap masuk akal untuk FKTP.
- Fornas 1199/2025 menentukan status/restriksi, bukan jaminan stok lokal.
- Seluruh ekspansi lab Career-only. Pool Ujian tidak berubah.
- Ledger ini hanya mencatat konflik material yang mengubah diagnosis, terapi,
  stabilisasi, atau disposisi. Tidak ada physician sign-off yang direkayasa.

## Batch 1 - 2026-07-16

**Aktivasi:** 25 kasus poli baru, terdiri dari 18 kasus SKDI 4A dan 7 kasus
3A/3B rujuk. Cakupan tersertifikasi FKTP naik dari 48/144 menjadi 66/144.

**Sumber utama:** PPK Dokter FKTP KMK 1186/2022; PNPK Pneumonia Dewasa KMK
2147/2023; Permenkes 28/2021 Penggunaan Antibiotik; WHO bronchiolitis 2026;
WHO hepatitis A 2026; WHO/CDC helminth guidance; NICE CG141 untuk perdarahan
GI atas; Fornas KMK 1199/2025.

| ID | Konflik material | Keputusan prototipe |
|---|---|---|
| `lab_pneumonia_komunitas_dewasa` | PPK lama memuat pilihan makrolida/doksisiklin; regulasi antibiotik dan PNPK lebih baru menempatkan penilaian berat serta amoksisilin rawat jalan | Amoksisilin 500 mg tiap 8 jam, 5-7 hari untuk pasien stabil tanpa komorbid; evaluasi 48-72 jam |
| `lab_rinitis_vasomotor` | Kortikosteroid intranasal didukung PPK, tetapi flutikason nasal tidak ditandai sebagai Fornas FKTP dalam katalog lab | Flutikason menjadi answer-key ideal; ketidaktersediaan tidak boleh diganti antibiotik/dekongestan berkepanjangan |
| `lab_hepatitis_a_akut` | PPK lama memuat terapi simptomatik; WHO 2026 menekankan menghindari obat yang tidak perlu dan dapat membebani hati | Terapi suportif; parasetamol tidak menjadi jawaban benar, tetapi juga tidak diperlakukan sebagai kontraindikasi absolut |
| `lab_skistosomiasis_sulteng` | Prazikuantel Fornas antisistosoma dibatasi untuk fokus Sulawesi Tengah | Vignette menyebut pajanan Lembah Napu dan terapi dikoordinasikan melalui program |
| `lab_edema_paru_akut_hipertensif` | Furosemid injeksi tidak diasumsikan ready pada baseline Sukamaju | Dudukkan, oksigen, nitrat selektif bila tekanan darah aman, lalu transfer; tidak ada klik wajib furosemid injeksi |
| `lab_perdarahan_gi_atas` | PPK lama memuat NGT/lavage dan PPI; NICE tidak menjadikan PPI pra-endoskopi sebagai langkah universal | ABC, akses IV/cairan terukur, oksigen karena hipoksemia, dan transfer; PPI/lavage tidak menjadi blocker |
| `lab_abses_peritonsil` | Antibiotik oral tidak aman bila jalan napas terancam atau pasien tidak dapat menelan | Vignette eksplisit masih dapat menelan dan tanpa stridor; amoksisilin-klavulanat pra-rujuk dinilai benar, drainase buta dinilai berbahaya |

## Batch 2-3 - 2026-07-16

**Aktivasi:** 78 kasus poli SKDI-4A baru (39 + 39). Seluruh 144 baris katalog
FKTP kini tertaut satu-ke-satu ke 144 kasus playable unik di mode Karier;
total pool poli Karier menjadi 176 kasus. Pool Ujian tetap tidak berubah.

**Sumber utama:** PPK Dokter FKTP KMK 1186/2022 beserta amandemennya; PNPK
terkait; Fornas KMK 1199/2025; pedoman program Kemenkes; WHO untuk EBM yang
lebih baru. Status obat program atau pengadaan lokal disebut eksplisit dan
tidak disamarkan sebagai ketersediaan Fornas.

| ID | Konflik material | Keputusan prototipe |
|---|---|---|
| `lab_kejang_demam_sederhana` | Antipiretik memperbaiki kenyamanan tetapi tidak mencegah kekambuhan kejang demam | Parasetamol dibuat opsional; pertolongan kejang dan safety-net tetap kritis |
| `lab_gonore_uretritis_pria`, `lab_sindrom_duh_genital_servisitis` | Regimen gonore PPK lama sudah tertinggal oleh rekomendasi WHO 2024 dan pola resistensi | Seftriakson 1 g IM dosis tunggal; doksisiklin ditambahkan bila klamidia belum disingkirkan |
| `lab_fimosis_patologis_ringan` | Katalog lama hanya punya betametason 0,1%, sedangkan PPK menyebut 0,05% | Tambah sediaan 0,05%; tidak menukar konsentrasi diam-diam |
| `lab_defisiensi_mineral_zinc` | Zinc dispersibel Fornas ditujukan untuk diare anak, bukan dugaan defisiensi zinc dewasa | Diet dan evaluasi penyebab menjadi inti; suplementasi spesifik melalui jejaring bila terkonfirmasi |
| `lab_kusta_pausibasiler` | MDT adalah pasokan program; komposisi regimen nasional dapat berbeda dari WHO terbaru, dan keterlibatan saraf dapat mengubah klasifikasi | Vignette PB dibuat dua lesi, BTA negatif, tanpa keterlibatan saraf; gunakan blister program aktif dan jangan merakit regimen bebas dari stok umum |
| `lab_ruptur_perineum_derajat_1` | Draf awal menyebut derajat 2 tetapi memakai ICD O70.0 (derajat 1) | Skenario direkonsiliasi menjadi robekan derajat 1 dengan rembesan aktif; otot dan sfingter utuh |
| `lab_tinea_kapitis_anak`, `lab_limfadenitis_servikal_akut`, `lab_ektima_tungkai` | Sediaan dewasa 500-625 mg tidak layak menjadi satu-satunya pilihan untuk pasien anak | Gunakan griseofulvin 125 mg dan sefadroksil sirup 125 mg/5 mL yang tercantum Fornas |
| `lab_pedikulosis_pubis` | PPK lama memakai benzil benzoat 25%; EBM menerima permetrin 1%, tetapi Fornas hanya memuat krim 5% | Losio 1% tersedia lewat pengadaan lokal dalam vignette; konsentrasi tidak disubstitusi diam-diam |
| `lab_tinea_unguium_terkonfirmasi` | Terbinafin tidak tersedia pada tingkat FKTP di Fornas, sedangkan griseofulvin tersedia | Gunakan griseofulvin setelah konfirmasi dan pemeriksaan keamanan yang relevan |
| `lab_eritrasma_lipat_paha` | Tetrasiklin topikal PPK dan eritromisin topikal tidak tersedia di katalog/Fornas FKTP | Lesi terbatas memakai mupirosin topikal yang tersedia; hindari antibiotik sistemik otomatis |
| `lab_dermatitis_kontak_iritan_tangan`, `lab_dermatitis_atopik_ringan`, `lab_dermatitis_numularis`, `lab_dermatitis_popok_iritan`, `lab_akne_vulgaris_ringan`, `lab_hidradenitis_supuratif_hurley1`, `lab_dermatitis_perioral` | Beberapa pilihan topikal EBM tidak tercantum sebagai item Fornas | Skenario menyebut pengadaan lokal/OTC; pilihan non-Fornas wajib memiliki catatan availability dan tidak memicu substitusi antibiotik sistemik |

## Perbaikan kasus orisinal - 2026-07-16

| ID | Konflik material | Keputusan prototipe |
|---|---|---|
| `kia_kb_konseling` | Clue (disetujui, WHO MEC/BKKBN) mengajarkan pemilihan metode KB, tetapi laci resep tidak menyediakan satu pun kontrasepsi dan jebakan estrogen-menyusui tidak dimodelkan (temuan playtest user) | 4 item katalog baru (desogestrel 75 mcg, DMPA 150 mg, kondom program, pil kombinasi LNG+EE — status Fornas per item); model informed choice: obatBenar tetap kosong, opsi aman = `obatOpsional`, pil kombinasi = `obatSalahUmum` ber-`kontraindikasi` (estrogen menekan ASI + risiko trombosis, WHO MEC 3 menyusui 6 mgg-6 bln); AKDR/implan sengaja TIDAK jadi tindakan (butuh pemasangan terlatih — dicatat di catatanRealita) |

Sapuan clue-vs-struktur SELURUH 176 kasus (skrip audit 3-sisi) mengonfirmasi
`kia_kb_konseling` = SATU-SATUNYA bug "laci resep kosong-total sambil
mengajarkan obat". Dua temuan kelas-ringan (terapi utama tetap bisa dipilih,
hanya opsi sekunder yg disebut clue tak selektabel) ikut dirapikan:

| ID | Konflik | Keputusan |
|---|---|---|
| `rinitis_alergi` | panduanResmi menyebut PPK menaruh CTM (gen-1) sejajar gen-2 + boleh steroid intranasal, tapi keduanya tak selektabel → resep CTM (lini-1 PPK) kena -15 | tambah `obatOpsional: [ctm_4, flutikason_semprot_hidung]` — sah tak dihukum; gen-2 non-sedatif tetap slot ideal yg dinilai penuh |
| `kia_isk_kehamilan` | clue mengesahkan "beta-laktam (sefiksim/amoksisilin)" tapi hanya sefiksim diterima | antibiotik jadi pilih-salah-satu `obatAlternatif: [[cefixime_100, amoxicillin_500]]`, paracetamol tetap wajib |

## Audit CODEX UKM - 2026-07-16

| Modul | Konflik material | Keputusan prototipe |
|---|---|---|
| `prolanis_dm` | Parameter kontrol lama memakai GDS < 200 mg/dL, tidak selaras indikator RPPT BPJS | Parameter kini GDP dengan ambang kontrol < 130 mg/dL (RPPT) menggantikan GDS < 200; langkah drift GDP disesuaikan 10-30 mg/dL |
| `prolanis_roster` | Peserta multimorbiditas HT+DM diklasifikasi HT saja | Keterbatasan model yang DIKETAHUI, butuh redesign roster — ditunda secara sadar, bukan bug |
| `surveilans_klb` | Ambang KLB masih angka repo lama; Permenkes 1/2026 belum tersedia di corpus | Label UI diubah menjadi "Verifikasi & Respons Sinyal KLB" sampai sumber resmi didapat; angka ambang tidak diklaim sebagai regulasi terkini |
| `keluarga_asih` (desa C) | Temuan TD 150/95 + edema pada kehamilan 7 bulan sebelumnya tidak berbuntut evaluasi segera di teks naratif | Arc diperkuat beat evaluasi preeklampsia segera (ulang ukur tensi + protein urin stik + tanya gejala berat + rujuk hari ini-besok) per Buku KIA/WHO; gerbang `aksiEskalasi` engine sudah ada sejak M10.5 |

## Audit CODEX UKM - item desain - 2026-07-16 (Permenkes 1/2026 diterima)

| Modul | Konflik / keputusan desain | Keputusan prototipe |
|---|---|---|
| `pispk_outcome` (#4) | Arc tamat langsung men-set indikator target `statusSebenarnya: ya` — rencana/janji jadi hasil final tanpa observasi waktu | Outcome-window: target → `sumber: 'janji'` (IKS naik optimis lewat `status`, `statusSebenarnya` belum berubah); dijadwalkan `verifikasi_pispk` (14 hari Karier / 5 Ujian); ditepati (peluang fungsi trust 0.35-0.92) → `dokter`/ya permanen, ingkar → status balik ke sebenarnya + surat |
| `ekonomi_iks` (#5) | Posyandu/KLB/Program menyuntik bonus IKS abstrak (mengajarkan manipulasi indikator, bukan pengukuran) | Posyandu berkualitas (skor≥0.5) kini MEMVERIFIKASI data KIA kader jadi data dokter (bonus abstrak 0.04→0.012); KLB 0.03→0.012; Program Wilayah: +0.004/hari IKS DIHAPUS, diganti PERISAI DRIFT (keluarga RW fokus: peluang drift 0.35→0.18) |
| `kader_staging` (#8) | Kader mengisi 95/95 indikator sekaligus hari-2 sebelum peta pertama dibuka; 65 tak terkoreksi | Kader isi maks 2 indikator 'belum' per keluarga per hari (jenuh ~1-2 pekan) → dokter punya jendela memverifikasi lebih dulu; koreksi via kunjungan (hotspot/dialog), posyandu (KIA), prolanis (PTM) |
| `surveilans_klb` (#13) | Ambang KLB "angka repo lama"; sumber resmi belum ada | Permenkes 1/2026 Pasal 23(2): penetapan KLB = "minimal 1 kriteria ... bermakna secara epidemiologis" — SENGAJA tak mematok angka tunggal, mendelegasikan ke kriteria numerik klasik (≥2× lipat). Ambang di-ground + dikalibrasi keterjangkauan: ISPA 5→4; vektor/berat tetap 2. Label pra-penetapan tetap "Verifikasi & Respons Sinyal KLB" |

## Batch 4 + 5 + 6 - 2026-07-16 (ronde full-fledge)

**Aktivasi:** +34 kasus poli tier-rujuk (3A/3B/2) di 4 file `batch4*.ts`,
+14 kasus IGD (`igdLab1.ts`/`igdLab2.ts`) → pool IGD Karier 6 → 20. Seluruhnya
Career-only. Mode Ujian TIDAK berubah: `examBlueprint.ts` tetap mengunci 98 slot
poli + `exactEvents: 5` kasus IGD baseline.

### Keputusan desain material

| Modul | Konflik / keputusan desain | Keputusan prototipe |
|---|---|---|
| `surveilans` (Batch 6) | `AMBANG_CLUSTER` = 8 id hardcoded di `surveilans.ts` (file beku) → 13 kasus infeksi lab MUSTAHIL berkluster, dan penulis kasus tak punya cara mendaftarkan kasus menular baru tanpa membuka Golden Master | Sumber ambang DIPINDAH KE KONTEN: `KasusKlinis.ambangKluster` (+ diteruskan `FktpLabSpec`), dibaca `ambangKlusterPack(pack)`. Registry engine DIHAPUS, bukan ditambahi — menambah id ke daftar lama hanya menunda kelas bug yang sama. 8 angka legacy dipindah apa adanya; 14 kasus lab menular kini ikut terpantau. Kasus menular berikutnya terintegrasi otomatis |
| `ambang_kasus_lab` (Batch 6) | Kasus lab mana yang layak berkluster? | Dipilih berdasar relevansi PWS/SKDR Puskesmas, bukan "semua yang berlabel infeksi": KLB klasik Indonesia = 2 (hepatitis A, leptospirosis pascabanjir, pertusis, keracunan pangan, skistosomiasis fokus endemis, kusta); menular biasa = 3 (mumps, pneumonia dewasa, sifilis, gonore, duh genital, tinea kapitis); sangat lazim = 4 (influenza/ILI, cacing tambang). Kandidat yang DITOLAK: tetanus & HIV (transmisi/inkubasinya tak membentuk kluster bermakna dalam jendela 14 hari), vaginitis/vaginosis/PID (bukan unit penularan outbreak) |
| `prb_lab` (Batch 6) | Direktif menyatakan "kasus kronis-stabil lab wajib bisa PRB", mengasumsikan footprint besar | **Premis direktif tidak akurat — dikoreksi, bukan dipaksakan.** Audit concept 103 kasus lab: hanya `concept:dm_type1` yang masuk 9 kelompok PRB Perpres JKN. Kebocoran factory NYATA (`FktpLabSpec` tak meneruskan `bisaPrb`) dan sudah ditutup, tapi cakupan kontennya 1/103, bukan "banyak". `lab_dm_tipe1_stabil_prb` ditandai `bisaPrb: true`; isi PRB yang sesungguhnya datang dari Batch 4 (gagal jantung dekompensasi, PPOK eksaserbasi berat). Tidak ada kasus yang ditandai PRB hanya demi menaikkan angka cakupan |
| `anamnesis_lab` (Batch 5) | Direktif: "pertanyaan anamnesis median 4 vs 8; tambah OLDCARTS bila <5" | **Sudah tertutup ronde sebelumnya — diverifikasi, tidak dikerjakan ulang.** Pengukuran atas `LAB_ALL_CASES` pasca-enrichment: median 5, min 5, maks 7, **0 kasus <5**. Angka "median 4" di direktif sudah basi. Lapisan `LabEnrichmentSpec.pertanyaan` tetap ditambahkan (dulu pengayaan hanya bisa menambah pertanyaan DISTRAKTOR, tak pernah memperdalam yang relevan) sebagai kapasitas untuk batch berikutnya |
| `konfirmasi_wajib_rujuk` (Batch 4) | Kandidat `konfirmasiWajib: 'tcm_spesimen_lesi'` pada TB putus obat suspek MDR (kelas "test before treat") | DIBATALKAN. `harusDirujuk: true` + `konfirmasiWajib` = no-win: merujuk hari itu → cap C (hasil TCM belum keluar), observasi → cap D (menahan kasus wajib-rujuk). CODEX menghapus gate identik di `batch3.ts:196-200` atas alasan sama. Poin pedagogis ("jangan ulangi OAT lini-1 sebelum status resistansi diketahui") disampaikan lewat `obatSalahUmum` `oat_kdt` tag `kontraindikasi` + `clue` — bergigi tanpa gerbang mustahil |
| `igd_mode_policy` (Batch 4) | `currentModePolicy()` di kanal IGD selalu dipanggil TANPA argumen → tiap kasus IGD baru otomatis `ujian: true`, membocorkan konten lab ke mode ujian | `KasusIgd` diberi `activationStatus` (semantik sama `KasusKlinis`); helper dilonggarkan ke bentuk struktural sehingga kanal IGD ikut terbaca. 14 kasus IGD lab = Career-only |
| `icd_cedera_kepala` (Batch 4) | Draf awal memakai `S06.0` untuk "cedera kepala sedang" | Dikoreksi ke `S06.9`. S06.0 = concussion (lazim GCS 13-15); vignette GCS 12 + muntah berulang + amnesia adalah cedera kepala SEDANG yang jenis lesi intrakranialnya justru belum diketahui di FKTP (CT baru di RS rujukan) — kode "tak dirinci" lebih jujur daripada diagnosis spesifik yang belum tegak |
| `penunjang_idealis` (Batch 4) | USG/radiografi polos dimasukkan katalog padahal tak semua Puskesmas punya | Konsisten dengan pilihan desain game yang sudah ada (idealis demi mengajar breadth EBM): USG masuk karena program USG ANC Kemenkes sejak 2022 memang mendistribusikannya; radiografi ada di sebagian Puskesmas. Celahnya disebut di `catatanRealita` kasus terkait, bukan disembunyikan |

**REVISI_ENGINE 38 → 39** (unfreeze sadar: `surveilans.ts` kontrak fungsi +
sumber ambang, `reducer.ts`/`director.ts` call-site). Jejak lama yang HANYA
menyentuh 8 kasus legacy mereplay identik (angka dipindah apa adanya), tetapi
jejak yang menyentuh 14 kasus infeksi lab kini bisa membentuk kluster yang dulu
mustahil → komposisi KLB & bobot Director bergeser → bump wajib.

## Ronde audit CODEX pasca-Batch 4 - 2026-07-16

Audit read-only CODEX atas installer 13:56 + working tree. **Catatan penting:**
verdict "working tree NO-GO 2,0/10" adalah artefak SNAPSHOT — CODEX mengaudit
pukul 15:03-15:07 saat integrasi Batch 4 sedang berjalan (14 IGD sudah di
blueprint, belum di PACK; 16 error skema batch baru). Integrasi tuntas 15:44;
state final: 906/906 test hijau, typecheck bersih, validasiPack hijau. Temuan
snapshot itu TIDAK dihitung sebagai bug — tapi temuan substantifnya diverifikasi
satu per satu ke kode dan mayoritas VALID.

### Diterima & diperbaiki

| Temuan | Verifikasi | Keputusan |
|---|---|---|
| **Kontradiksi ambang Prolanis DM** (kartu/skor `<200` vs drift `<130`) | **VALID — regresi kami sendiri.** Saat skala DM pindah GDS→GDP di rev 37 (#12), HANYA `driftProlanis` ikut ke <130; `kartuProlanis` & `scoring.ts` tertinggal di ambang GDS lama. Peserta GDP 150 tampil "terkendali" + dihitung terkendali skor, tapi `takTerkontrolBerturut` terus naik — kartu hijau, penyakit jalan | Satu konstanta bersama `AMBANG_TERKENDALI_PROLANIS` (ht 140 / dm 130, BPJS RPPT) + predikat `prolanisTerkendali()` dipakai kartu, skor, DAN drift. Regresi test mengunci ketiganya. REVISI_ENGINE 39→40 (skor UKM jejak lama bergeser turun — soak: teliti 76,4→74,7) |
| **Distraktor anamnesis terlalu generik** (35× "sering haus dan banyak kencing", 34× "nyeri dada atau berdebar", lintas mata/kulit/obstetri/trauma) | **VALID — regresi kami sendiri** dari lapisan enrichment. Terverifikasi: 89 entri di 3 file | 89 distraktor ditulis ulang jadi **differential-driven** (mengejar banding kasus masing-masing / mitos klinis lazim pada kasus itu). Pakai-ulang terburuk turun 35× → 4× ("Bapak merokok?" — netral lintas kasus, wajar). Test anti-template: tak boleh ada teks distraktor di ≥6 kasus |
| **Dosis anak belum aman** (morbili 1-8 th mewajibkan `paracetamol_500`) | **VALID.** Tablet 500 mg = unit dewasa; dosis anak 10-15 mg/kg (WHO) → balita butuh ~¼ tablet | Game tak memodelkan berat/fraksi tablet, jadi pelajaran dipindah ke **pilihan SEDIAAN**: `paracetamol_sirup` (120 mg/5 mL, bisa ditakar) jadi obatBenar; tablet dewasa jadi jebakan `nonPrimer` bersuara mengajar. Pagar: kasus usiaMax≤8 tak boleh mewajibkan sediaan padat dewasa yang punya padanan sirup. Menyentuh answer-key kasus Ujian — disengaja: mengajarkan tablet 500 mg utk balita lebih buruk daripada kontrak paket |
| **Alias ICD katalog↔kasus butuh rationale + test** | **VALID sebagian** — hitungan 11 benar, TAPI allowlist ber-rationale (`GENERIK_SENGAJA`) SUDAH ada sejak ronde sebelumnya. Yang belum dijaga: allowlist bisa membusuk | Tak menduplikasi test yang sudah ada (sempat ditulis, lalu dihapus setelah ketahuan redundan). Ditambah HANYA nilai barunya: cek **yatim** — tiap id di allowlist wajib masih benar-benar mismatch, supaya entri basi tak jadi izin diam-diam untuk drift baru |
| **Rapor "Belum ada data" tapi Manajemen/Resiliensi tetap 15** | **VALID.** Total sudah digerbang (M14 #20), tapi 4 kartu dimensi tetap merender angka | Saat `!punyaAktivitas`, keempat dimensi tampil "—" + "Belum dinilai". Dulu menyesatkan DUA arah: Manajemen 15/15 terbaca "sudah diraih", UKP 0/35 terbaca "gagal" padahal belum mulai |
| **Kartu keluarga "Sehat" walau data 2/9** | **VALID.** Chip "IKS sementara" ada, tapi chip klasifikasi tetap BERWARNA penuh — warnanya sendiri yang membocorkan kepastian | Saat data belum lengkap: warna klasifikasi ditahan (chip netral), angka diberi awalan `≈`, label ditandai "(sementara)". Warna penuh hanya setelah seluruh indikator relevan ber-data |

### Ditolak (diverifikasi ke kode, temuan tidak berdiri)

| Temuan | Bukti |
|---|---|
| **"Kasus tanpa slot terapi otomatis dapat rasio terapi 100%"** (`totalSlot === 0 ? 1`, clinic.ts:537) | **TIDAK BERDIRI sebagai bug.** Rumus lengkapnya `skorTerapi = 100×rasioTerapi − 15×obatDiLuar − 25×obatBerbahaya − …`: pada 28 kasus ber-slot-nol (stroke→rujuk, hordeolum→kompres, obesitas→gaya hidup, insomnia, dst.), meresepkan obat yang salah TETAP dihukum. Jadi insentifnya sudah benar — menahan diri diganjar, meresepkan dihukum. "100% gratis" hanyalah baseline untuk keputusan yang memang benar (tidak memberi obat), dan pelajaran non-farmakologisnya hidup di dimensi `edukasi` yang dinilai terpisah. Mengubahnya = redesain model skor 28 kasus tanpa bug yang dibayar |

### Diterima sebagai catatan, TIDAK dikerjakan ronde ini

- **103 prototipe belum teradjudikasi EBM & 382/456 evidence binding `pending`** —
  ini BUKAN bug, ini status desain yang disengaja (`lab_prototype_unadjudicated`).
  Adjudikasi formal + physician sign-off memang dipindahkan ke repo produksi per
  direktif GASPOL §2. Skor "kesiapan akademik 6,2/10" dari CODEX adalah penilaian
  yang JUJUR dan kami tidak mengklaim sebaliknya.
- **Locator sumber (halaman/bagian) utk 5 kasus** — "PPK 1186/2022 floor" tanpa
  halaman memang belum auditabel. Masuk pekerjaan adjudikasi produksi.
- **Reflow 200% E2E, Axe, soak/focus-stress** — belum ada bukti screenshot;
  tak diklaim tertutup.
- **Distribusi indikator PIS-PK timpang** (air bersih 1 skenario vs hipertensi 5)
  & hanya 9 arc berkarma — desain konten, butuh keputusan cerita.
- **`--text-xs` 12 px & letter-spacing 0.28-0.42em** — nyata, tapi menyentuh
  token global; ditunda ke pass estetika (M12) agar tak mengacak layar lain.

## Sumber Daring

- Kemenkes, PNPK Pneumonia Dewasa 2023:
  https://www.kemkes.go.id/id/pnpk-2023---tata-laksana-pneumonia-pada-dewasa
- WHO, bronchiolitis and childhood asthma guideline 2026:
  https://www.who.int/publications/i/item/9789240122680
- WHO, Hepatitis A, 14 May 2026:
  https://www.who.int/news-room/fact-sheets/detail/hepatitis-a
- CDC, Clinical Care of Strongyloides:
  https://www.cdc.gov/strongyloides/hcp/clinical-care/index.html
- WHO, Schistosomiasis:
  https://www.who.int/news-room/fact-sheets/detail/schistosomiasis
- WHO, Taeniasis/cysticercosis:
  https://www.who.int/news-room/fact-sheets/detail/taeniasis-cysticercosis
- NICE CG141, acute upper GI bleeding:
  https://www.nice.org.uk/guidance/cg141/chapter/Recommendations
- Kemenkes, Fornas KMK 1199/2025 (berlaku 1 April 2026):
  https://e-fornas.kemkes.go.id/guest/landing
- WHO, Leprosy fact sheet, 23 January 2026:
  https://www.who.int/news-room/fact-sheets/detail/leprosy
- WHO, updated gonorrhoea/chlamydia/syphilis recommendations, 2024:
  https://www.who.int/publications/i/item/9789240090767
