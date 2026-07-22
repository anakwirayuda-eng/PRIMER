# M13-14 IGD - Log Keputusan Dokter

**Reviewer:** dr. Anak Agung Bagus Wirayuda, MD, PhD

**Peran:** Penanggung Jawab Klinis PRIMERA

**Tanggal mulai:** 2026-07-22

**Artefak review:** `M13_14_IGD_ADJUDICATION.html`

## Aturan pencatatan

- Keputusan berasal dari reviewer klinis; CODEX melakukan riset, menyusun rekomendasi, dan mencatatnya.
- `Perlu edit - disetujui` berarti reviewer menyetujui patch specification yang disajikan, bukan menyatakan konten lama sudah benar.
- Aktivasi akademik baru dilakukan setelah semua perubahan diterapkan, artefak diregenerasi, dan gerbang teknis serta editorial lulus.
- Perubahan runtime dikumpulkan menjadi satu content release agar save/fingerprint tidak bergerak 14 kali.

## Kemajuan

| No. | Kasus | Keputusan dokter | Status implementasi |
|---:|---|---|---|
| 1 | `igd_asfiksia_neonatorum` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 2 | `igd_cedera_kepala_sedang` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 3 | `igd_eklampsia` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 4 | `igd_gigitan_ular_berbisa` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 5 | `igd_keracunan_organofosfat` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 6 | `igd_ketoasidosis_diabetik` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 7 | `igd_stroke_iskemik_window` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 8 | `igd_perdarahan_pascasalin` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 9 | `igd_pneumotoraks_tension_trauma` | **Perlu edit - disetujui** | Patch terkunci; menunggu batch implementasi akhir |
| 10 | `igd_status_epileptikus` | **Rekomendasi: Perlu edit** | Paket keputusan siap; menunggu adjudikasi dokter |
| 11-14 | - | Belum diputuskan | - |

## IGD-1 - Asfiksia Neonatorum

**Pernyataan reviewer:** `IGD-1: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Ubah frekuensi ventilasi bantuan dari `40-60/menit` menjadi `30-60/menit` sesuai AHA/AAP 2025.
2. Nyatakan bayi cukup bulan; mulai ventilasi dengan udara ruangan, pasang pulse oximeter preduktal, lalu titrasi oksigen terhadap target berbasis menit kehidupan. Jangan memakai angka SpO2 tanpa waktu pengukuran.
3. Bila HR tetap kurang dari 60/menit setelah 30 detik ventilasi yang benar-benar mengembangkan dada, lakukan langkah koreksi ventilasi dan gunakan airway alternatif bila tersedia serta operator kompeten sebelum/bersamaan dengan kompresi.
4. Kompresi tetap 3:1 bersama ventilasi; naikkan oksigen ke 100 persen bila tersedia tanpa menunda tindakan, lalu titrasi turun setelah ROSC.
5. Bila HR tetap kurang dari 60/menit setelah 60 detik kompresi dan ventilasi adekuat, epinefrin intravaskular menjadi langkah berikutnya.
6. Hapus klaim bahwa kebanyakan bayi dengan presentasi berat ini pulih hanya dengan langkah awal.
7. Nyatakan tujuan transfer sebagai RS dengan kemampuan perawatan neonatus dan tekankan resusitasi berlanjut selama transfer.

**Sumber keputusan:**

- AHA/AAP, *2025 Guidelines for Neonatal Resuscitation*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation
- Kementerian Kesehatan RI, kurikulum pelatihan resusitasi dan kegawatan neonatus bagi tim FKTP, 2025: https://ditmutunakes.kemkes.go.id/index.php/detail-kurikulum-pelatihan/pelatihan-pelayanan-anc-dengan-deteksi-dini-fokus-preeklampsia-dan-pencegahan-prematuritas-serta-pelayanan-resusitasi-dan-kegawatan-neonatus-bagi-dokter-bidan-dan-perawat-di-fktp/4d7a457a4e7a4d774d7a67744d7a417a4f4330304e444d354c5749314d7a59744d7a637a4e444d344d7a557a4e544d7a
- UKK Neonatologi IDAI, *Panduan Provider Resusitasi Neonatus Resneo ID*, 2024: https://www.idai.or.id/publications/buku-idai/buku-panduan-provider-resusitasi-neonatus-resneo-id-edisi-pertama

## IGD-2 - Cedera Kepala Sedang

**Pernyataan reviewer:** `IGD-2: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Ubah klasifikasi cedera kepala sedang dari `GCS 9-13` menjadi `GCS 9-12`; ingatkan bahwa GCS bukan satu-satunya ukuran beban cedera.
2. Nyatakan sasaran oksigenasi sebagai `SpO2 >=94%`, bukan pemberian oksigen otomatis tanpa menilai saturasi dan jalan napas.
3. Ganti klaim `GCS serial adalah monitor tekanan intrakranial termurah` dengan penjelasan bahwa GCS dan pupil serial adalah pemantauan neurologis dasar, bukan pengukuran ICP.
4. Ganti `log roll bersama papan` dengan pemiringan en bloc terkoordinasi, stabilisasi servikal manual, dan kesiapan suction; jangan menyiratkan penggunaan spinal board berkepanjangan.
5. Perjelas bahwa diazepam tidak diberikan hanya untuk menenangkan pasien, tetapi analgesia, sedasi prosedural, atau tata laksana jalan napas yang terindikasi tidak boleh ditahan demi mempertahankan angka GCS.
6. Pertahankan larangan hiperventilasi rutin. Ventilasi terkontrol hanya menjadi tindakan penyelamatan singkat pada ancaman herniasi oleh tim kompeten dengan monitoring yang sesuai.
7. Jangan memberi manitol empiris hanya karena muntah. Osmoterapi bukan tindakan wajib kasus ini di FKTP dan hanya dipertimbangkan menurut protokol, kemampuan monitoring, serta tanpa menunda transfer.
8. Nyatakan tujuan sebagai RS dengan CT dan kemampuan trauma/neurosurgical, dengan monitoring, restriksi gerak spinal, serta petugas yang mampu menangani perburukan jalan napas selama transfer.
9. Ganti respons bernada menyalahkan keluarga mengenai biaya dengan penjelasan kegawatan yang empatik serta aktivasi ambulans, JKN, dan dukungan sosial agar biaya tidak menunda keselamatan.
10. Tambahkan ACS Best Practices Guidelines: Traumatic Brain Injury 2024 sebagai sumber mutakhir. TXA tidak dijadikan tindakan wajib FKTP tanpa adjudikasi protokol, waktu cedera, kontraindikasi, dan ketersediaan.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- American College of Surgeons, *Best Practices Guidelines: The Management of Traumatic Brain Injury*, 2024: https://www.facs.org/media/vgfgjpfk/best-practices-guidelines-traumatic-brain-injury.pdf
- NICE, *Head Injury: Assessment and Early Management*, NG232: https://www.nice.org.uk/guidance/NG232/chapter/recommendations
- Brain Trauma Foundation, *Guidelines for Prehospital Management of TBI, 2nd Edition*: https://braintrauma.org/coma/guidelines/pre-hospital-2nd-edition

## Kebijakan tampilan bukti yang disetujui

Reviewer meminta referensi kasus tampil pada penjelasan atau debrief akhir dan dapat dibuka di browser bawaan komputer. Implementasi mengikuti prinsip berikut:

- tampilkan parafrasa keputusan klinis yang singkat sebagai isi utama;
- tampilkan sumber dalam panel ringkas yang tertutup secara default agar tidak menambah beban kognitif;
- bedakan pedoman Indonesia dan EBM internasional, sertakan tahun dan label yang dapat dipahami;
- buka hanya URL HTTPS melalui browser OS, bukan di dalam renderer;
- gunakan kutipan literal secara hemat hanya bila redaksi atau ambang angka sumber perlu dipertahankan secara presisi;
- jangan menampilkan panel sebelum keputusan terakhir bila isinya dapat membocorkan jawaban.

## IGD-3 - Eklampsia

**Pernyataan reviewer:** `IGD-3: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Patch specification yang disetujui:**

1. Definisikan eklampsia sebagai kejang baru pada kehamilan atau pascapersalinan yang berkaitan dengan gangguan hipertensi dan tidak lebih baik dijelaskan oleh penyebab lain; jangan menjadikan koma sebagai kriteria alternatif yang setara dengan kejang.
2. Tegaskan proteksi cedera, posisi lateral kiri, kesiapan suction/jalan napas, larangan memasukkan benda ke mulut, dan larangan menahan ekstremitas secara paksa.
3. Nyatakan regimen loading PPK secara aman: 4 g atau 10 mL MgSO4 40% diencerkan dengan 10 mL air steril, lalu diberikan IV perlahan selama 20 menit. Jangan menyiratkan MgSO4 40% disuntikkan IV tanpa pengenceran.
4. Sebelum dosis lanjutan, pastikan refleks patela ada, frekuensi napas minimal 16/menit, dan produksi urin minimal 0,5 mL/kg/jam. Bila terjadi depresi napas, hentikan MgSO4 dan berikan kalsium glukonas 1 g atau 10 mL larutan 10% IV selama 10 menit sesuai protokol.
5. Tangani tekanan darah 180/115 segera dengan antihipertensi yang sesuai protokol dan kemampuan fasilitas. Bila nifedipin oral digunakan, obat ditelan dan bukan diberikan sublingual. Sasaran awal adalah keluar dari rentang hipertensi berat dengan pemantauan, bukan menurunkan mendadak sampai normal.
6. Jangan menjadikan rumatan MgSO4 selama transfer sebagai kewajiban universal. Bila regimen penuh tidak dapat diberikan dan dipantau secara aman, berikan loading dose lalu transfer segera; bila sumber daya dan pengawalan kompeten tersedia, rumatan dapat dilanjutkan sesuai protokol tanpa menunda transfer.
7. Diazepam hanya menjadi jalan darurat terakhir bila MgSO4 benar-benar tidak tersedia, dengan kesiapan jalan napas dan transfer; bukan alternatif yang setara.
8. Ganti klaim `persalinan adalah terapi definitif` dengan prinsip stabilisasi ibu lebih dahulu, kemudian tim obstetri menentukan waktu dan cara kelahiran menurut keadaan ibu-janin. Jangan menyiratkan eklampsia otomatis berarti seksio sesarea segera.
9. Rujuk ke RS dengan layanan obstetri emergensi dan perawatan neonatus. Oksigen tepat untuk vignette ini karena SpO2 93% dan kejang aktif, bukan kewajiban rutin tanpa menilai oksigenasi.
10. Edema wajah dan tungkai boleh tetap menjadi tekstur vignette, tetapi tidak boleh diajarkan sebagai syarat diagnosis.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO, *Recommendations for Prevention and Treatment of Pre-eclampsia and Eclampsia*: https://www.who.int/publications/i/item/9789241548335
- WHO, *Pre-eclampsia Fact Sheet*, 2025: https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia
- NICE, *Hypertension in Pregnancy: Diagnosis and Management*, NG133: https://www.nice.org.uk/guidance/ng133/chapter/recommendations

## IGD-4 - Gigitan Ular Berbisa

**Pernyataan reviewer:** `oke silakan ditindaklanjuti yg perlu dan dibuat seindah-sejelas mungkin tanpa penuh sesak tanpa cognitive overload` pada 2026-07-22, merujuk rekomendasi `IGD-4 Perlu edit - disetujui` yang langsung mendahuluinya.

**Dossier riset:** `M13_14_IGD4_REALITA_FKTP_RESEARCH.md`

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Ringkasan alasan:** draf lama melepaskan ikatan ketat terlalu dini, menyederhanakan sindrom gigitan ular, menyebut persiapan antihistamin/steroid dengan penekanan yang keliru, merujuk hanya berdasarkan keberadaan antibisa, dan mengikat kasus ke PPK FKTP 1186/2022 yang tidak memuat gigitan ular. Paket revisi juga menambahkan alur konsultasi-rujukan Indonesia, Realita FKTP, perlindungan tenaga kesehatan, pelaporan GHBTB, dan tiga kasus nyata yang disajikan secara etis.

**Patch specification yang diajukan:**

1. Pelepasan ikatan ketat hanya dilakukan terkontrol ketika resusitasi, adrenalin, pemantauan, dan antivenom yang sesuai siap; akses IV saja tidak cukup.
2. Gunakan pendekatan sindromik dan serial, bukan dikotomi viperid-elapid atau identifikasi keluarga yang terlalu pasti.
3. Jangan menggosok, memijat, menginsisi, mengisap, memberi es/ramuan, atau menyuruh keluarga menangkap ular; imobilisasi dan dokumentasikan progresi.
4. Nyatakan perdarahan gusi sebagai envenomasi sistemik yang tidak menunggu 20WBCT atau pemeriksaan lain untuk mulai koordinasi definitif.
5. Antivenom hanya untuk envenomasi yang terindikasi dan harus cocok dengan sindrom/spesies; jangan lakukan skin test rutin.
6. Siapkan adrenalin IM dan resusitasi untuk reaksi antivenom; antihistamin/steroid bukan profilaksis rutin atau pengganti adrenalin.
7. Rujuk berdasarkan kemampuan nyata: produk dan stok antivenom, koagulasi/transfusi, airway/ventilasi, renal support, SDM, dan monitoring; konfirmasi penerimaan.
8. Hapus binding `ppk_fktp_2022`; gunakan WHO 2016, BKPK 2025, portal GHBTB 2026, dan Permenkes 16/2024 sesuai fungsi masing-masing.
9. Tambahkan `Realita FKTP` yang menjelaskan konsentrasi keahlian, distribusi stok, jejaring GHBTB, serta batas klaim "satu-satunya ahli".
10. Tambahkan tiga caselet sumber resmi: Kefamenanu (keselamatan nakes dan otonomi klinis), Samarinda (konsultasi-logistik berhasil), dan Baduy (akses geografis dan stok terpilih).
11. Tambahkan perlindungan nakes menurut UU 17/2023, PP 28/2024, dan Permenkes 13/2025 tanpa menjadikannya alasan meninggalkan tindakan penyelamatan nyawa.
12. Tutup jembatan UKP-UKM melalui pelaporan GHBTB, edukasi tanpa torniket, pemetaan risiko lingkungan/pekerjaan, dan follow-up disabilitas.

**Batas etik:** kasus dr. Icha tidak didramatisasi sebagai NPC atau hubungan sebab tunggal. Tidak ada detail metode bunuh diri. Fakta, dugaan, dan proses hukum dibedakan; sumber resmi dibuka dari panel bukti.

**Keputusan reviewer:** **Perlu edit - disetujui.** Penyajian wajib memakai progressive disclosure: ringkasan utama singkat, tiga caselet dalam panel tertutup, dan sumber berlabel jelas agar pengayaan tidak menambah beban kognitif.

## IGD-5 - Keracunan Organofosfat

**Pernyataan reviewer:** `IGD-5: Keracunan Organofosfat setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` dan patch specification yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** diagnosis, urgensi atropin, perlindungan penolong, dekontaminasi, dan keputusan rujuk sudah tepat. Nilai klinis saat ini sekitar **7,1/10**. Risiko utamanya adalah urutan tindakan yang dapat dibaca sebagai "mandikan dahulu", dosis berbasis "satu ampul", endpoint atropinisasi "paru kering", dan asumsi bahwa pralidoksim semata-mata urusan rumah sakit. Paket di bawah ditargetkan membawa kasus ke **>=8,7/10** tanpa menambah satu babak baru.

**Patch specification yang diajukan:**

1. Ubah langkah pertama menjadi respons tim paralel: gunakan APD; segera lakukan suction, oksigen/ventilasi, dan atropin; pada saat yang sama petugas terlindung melepas serta mengemas pakaian terkontaminasi dan mencuci kulit/rambut dengan sabun-air. Ancaman ABC tidak menunggu dekontaminasi selesai.
2. Ganti istilah `satu ampul` dengan dosis dalam miligram. Untuk pasien dewasa ini, mulai atropin `1-2 mg IV/IO`, lalu gandakan tiap 5 menit menurut respons. Konsentrasi atau isi ampul tidak boleh menjadi satuan klinis.
3. Ganti endpoint `PARU YANG KERING` dengan sasaran yang aman: bronkorea dan bronkospasme terkendali, suara napas/air entry membaik, oksigenasi membaik, serta bradikardia dan perfusi pulih. Ukuran pupil dan pengeringan seluruh sekret bukan sasaran.
4. Setelah atropinisasi awal, pertahankan efek dengan infus atropin yang dititrasi bila pompa, monitoring, dan petugas kompeten tersedia. Bila tidak, gunakan bolus ulang bertitrasi sesuai protokol sambil mempercepat transfer; jangan mengimprovisasi infus yang tidak dapat diawasi.
5. Tambahkan kesiapan bag-valve-mask dan airway definitif dini bila ventilasi gagal. Atropin mengatasi efek muskarinik tetapi tidak membalikkan paralisis nikotinik. Bila intubasi diperlukan, hindari suksinilkolin dan mivakurium karena blokade dapat memanjang.
6. Revisi kalimat pralidoksim: terapi ini layak dipertimbangkan dini pada keracunan organofosfat berat, tetapi efektivitasnya bergantung senyawa dan ketersediaannya tidak boleh diasumsikan di Sukamaju. Konsultasi dan transfer ke fasilitas mampu dilakukan tanpa menunda atropin, airway, atau dekontaminasi.
7. Perjelas APD dan dekontaminasi: sarung tangan tahan bahan kimia, apron/gown, dan pelindung mata sesuai risiko; pakaian dilepas dan dikemas tertutup; kulit serta rambut dicuci sabun-air; cegah kontaminasi staf, ruangan, ambulans, dan limpasan air.
8. Jangan membawa botol pestisida terkontaminasi secara lepas. Utamakan foto label; bila wadah perlu dibawa, segel/double-bag secara aman. Catat bahan aktif, konsentrasi, rute, waktu, dan perkiraan jumlah paparan.
9. Pertahankan bilas lambung/arang aktif sebagai jawaban salah hanya untuk paparan dermal pada vignette ini. Umpan balik tidak boleh mengajarkan bahwa dekontaminasi gastrointestinal selalu dilarang; bilas lambung berisiko besar, sedangkan arang aktif hanya dipertimbangkan pada keadaan tertelan yang terpilih dan jalan napas aman.
10. Perjelas risiko sindrom perantara sebagai kelemahan leher/proksimal dan otot napas yang dapat timbul setelah krisis kolinergik tampak mereda. Karena itu pasien memerlukan observasi serta dukungan ventilasi rumah sakit, bukan dipulangkan setelah sekret terkendali.
11. Rujuk berdasarkan kapabilitas nyata: kemampuan airway/ventilasi, monitoring berkelanjutan, stok atropin yang cukup, pemberian rumatan, konsultasi toksikologi, oksim bila terindikasi/tersedia, dan perawatan intensif. Konfirmasi penerimaan dan teruskan terapi selama transfer terpantau.
12. Tutup jembatan UKP-UKM: setelah stabilisasi, pastikan apakah paparan kerja, kecelakaan, atau disengaja; lakukan penilaian psikososial privat bila relevan; telusuri rekan kerja yang ikut terpapar; koordinasikan pelaporan sesuai jalur daerah; dan berikan pencegahan tanpa menyalahkan petani (APD, baca label, jangan menyemprot melawan angin, simpan di wadah asli jauh dari pangan/air/anak).
13. Hapus binding generik `ppk_fktp_2022` karena PPK 1186/2022 tidak menyediakan bab khusus organofosfat. Gunakan Buku Pedoman Keracunan Kemenkes 2024 sebagai konteks Indonesia, AHA 2025 sebagai algoritme mutakhir, WHO 2008/2026 untuk layanan berjenjang dan paparan kimia, Fornas 1199/2025 untuk ketersediaan normatif atropin, serta Permenkes 16/2024 untuk rujukan.

**Realita FKTP yang diajukan, versi layar utama:**

> Atropin injeksi tercantum dalam Formularium Nasional untuk FKTP, tetapi tercantum tidak sama dengan stok bedside yang cukup untuk keracunan berat; kebutuhan dosis dapat jauh melebihi pemakaian bradikardia biasa. Pralidoksim tidak diasumsikan tersedia di Sukamaju, dan sistem poison center nasional masih dalam tahap penguatan. Karena itu tim harus mengobati sindrom kolinergik segera, mengenali keterbatasan fasilitas, mengidentifikasi bahan aktif dengan aman, dan mengonfirmasi RS yang mampu melanjutkan airway, atropin, oksim, serta pemantauan. Setelah pasien selamat, kasus kembali ke UKM: cari paparan bersama, perbaiki praktik kerja dan penyimpanan, serta koordinasikan pelaporan lintas sektor.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan saja - `lindungi tim`, `ABC + atropin segera`, `titrasi pada respons`, `rujuk sambil terapi berjalan`.
- Panel `Realita FKTP`: tertutup secara default; memuat ketersediaan atropin, keterbatasan oksim/poison center, dan jembatan UKM.
- Panel `Bukti klinis`: sumber berlabel Indonesia/internasional dan dapat dibuka melalui browser OS setelah kasus selesai.
- Detail regimen, airway, dan pelaporan tidak dimasukkan ke label tombol; detail muncul pada umpan balik atau panel bukti setelah keputusan.

**Catatan sumber dan keterbatasan:**

- AHA 2025 memberi rekomendasi kuat untuk atropin segera, airway dini, APD, dan dekontaminasi; pralidoksim dinilai reasonable pada keracunan organofosfat berat. Dosis tabel AHA adalah atropin dewasa 1-2 mg, digandakan tiap 5 menit.
- Buku Kemenkes 2024 mencantumkan atropin dewasa 2-4 mg IV tiap 5-10 menit dan pralidoksim, tetapi bukan PNPK/PPK serta memiliki inkonsistensi dosis pediatrik internal. Ia dipakai untuk konteks Indonesia, bukan disalin sebagai algoritme tanpa tapis.
- Fornas 1199/2025 mencantumkan atropin injeksi 0,25 mg/mL pada FPKTP dan FPKTL. Pencarian teks dokumen yang ditinjau tidak menemukan pralidoksim; ini mendukung keputusan untuk tidak mengasumsikan stok lokal, bukan membuktikan obat mustahil tersedia lewat jalur lain.
- BKPK masih mencantumkan inisiasi virtual poison center sebagai pertanyaan kebijakan. Game tidak boleh berpura-pura bahwa satu nomor konsultasi toksikologi nasional sudah selalu operasional.

**Sumber keputusan:**

- AHA, *2025 Guidelines - Organophosphates and Carbamates*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation
- AHA, *Table 4 - Commonly Used Doses of Antidotes*: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/content/guidelines-accordion/toxicology-nested-section/table-4
- WHO, *Clinical Management of Acute Pesticide Intoxication*, 2008: https://www.who.int/publications/i/item/9789241597456
- WHO, *Interim Clinical Guidance for Toxic Chemical Exposures*, 2026: https://www.who.int/brunei/news/detail-global/04-06-2026-empowering-health-care-workers-to-save-lives-after-toxic-chemical-exposures--who-interim-clinical-guidance
- BKPK Kemenkes, *Buku Pedoman Keracunan Alami dan Non Alami*, 2024: https://repository.badankebijakan.kemkes.go.id/id/eprint/5608/
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- BKPK Kemenkes, *Policy Questions - Virtual Poison Center*: https://www.badankebijakan.kemkes.go.id/policy-question/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- BPOM, *Analisis Data Kasus Keracunan Obat dan Makanan 2024*: https://pusakom.pom.go.id/riset-kajian/detail/analisis-data-kasus-keracunan-obat-dan-makanan-tahun-2024

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-5 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-6 - Ketoasidosis Diabetik pada Dewasa

**Pernyataan reviewer:** `yes dan lanjut` pada 2026-07-22, merujuk rekomendasi `Perlu edit - disetujui` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** urutan besar kasus sudah benar: kenali krisis hiperglikemik, pulihkan volume, jangan memulai insulin tanpa mengetahui dan mampu memantau kalium, hindari bikarbonat rutin, lalu rujuk dengan cairan tetap berjalan. Nilai klinis saat ini sekitar **8,0/10**. Kekurangannya bukan perubahan arah terapi, melainkan diagnosis yang terlalu definitif tanpa bukti asidosis, cairan yang dikunci hanya ke NaCl 0,9%, penjelasan fisiologi insulin yang berlebihan, tujuan rujukan yang masih berbasis nama spesialis, dan pemicu `insulin habis` yang belum ditutup kembali ke kontinuitas UKP-UKM. Paket di bawah ditargetkan membawa kasus ke **>=9,0/10**.

**Patch specification yang diajukan:**

1. Tegaskan bahwa pasien dewasa ini diketahui memiliki **DM tipe 1** agar ICD `E10.1`, kebutuhan insulin basal, dan populasi algoritme tidak disimpulkan hanya dari usia muda serta kata `insulin-dependent`.
2. Pada fase sebelum pemeriksaan asam-basa tersedia, gunakan istilah **suspek KAD berat/krisis hiperglikemik dengan ketosis**, bukan diagnosis biokimia final. Ajarkan tiga komponen diagnosis KAD: diabetes atau hiperglikemia, ketosis, dan asidosis metabolik. GDS 480 mg/dL, keton urin kuat, Kussmaul, dehidrasi, dan gangguan kesadaran cukup untuk tindakan serta rujukan emergensi, tetapi tidak membuktikan komponen asidosis tanpa pH atau bikarbonat.
3. Ubah langkah pertama menjadi `nilai ABC, lindungi jalan napas dari aspirasi, pasang sekurangnya satu akses IV yang andal, dan mulai kristaloid isotonik`. Akses kedua boleh dipasang bila mudah dan tidak menunda transfer, tetapi tidak dijadikan ritual wajib.
4. Jangan mengunci cairan ke NaCl 0,9%. Pada dewasa tanpa gangguan jantung atau ginjal, gunakan **NaCl 0,9% atau kristaloid seimbang sesuai stok/protokol**, umumnya 500-1.000 mL/jam pada 2-4 jam awal dengan penilaian ulang tekanan darah, nadi, perfusi, kesadaran, input-output, dan risiko overload. Pada vignette ini, satu liter awal lalu reassessment tetap masuk akal.
5. Pertahankan jawaban salah `insulin bolus besar hanya karena GDS 480`, tetapi ganti umpan balik lama. Bahaya utamanya adalah insulin dimulai tanpa mengetahui/mengoreksi kalium dan tanpa monitoring memadai, bukan klaim sederhana bahwa insulin `menarik air ke dalam sel lalu memperdalam syok`. Di fasilitas mampu, insulin diberikan setelah cairan awal berjalan dan kalium dinilai; di Sukamaju yang tidak dapat memeriksa serta memantau kalium, lanjutkan cairan dan transfer tanpa insulin improvisasi.
6. Ganti kalimat absolut `kalium tidak pernah diberikan bolus` menjadi instruksi presisi: **jangan memberikan kalium sebagai IV push atau penggantian cepat tanpa data**. Kalium diberikan sebagai infus terkontrol menurut kadar serum, fungsi ginjal/diuresis, ECG bila tersedia, dan protokol; insulin ditunda bila kalium terlalu rendah.
7. Pertahankan larangan bikarbonat rutin. Jelaskan pada debrief bahwa bikarbonat hanya dipertimbangkan pada asidosis sangat berat, sekitar `pH <7,0`, di fasilitas dengan monitoring; napas Kussmaul saja tidak cukup menjadi indikasi.
8. Jangan menjadikan turunnya GDS atau keton urin sebagai endpoint resolusi. Resolusi KAD dinilai dengan pulihnya keton darah dan asidosis (`beta-hydroxybutyrate`, pH atau bikarbonat); glukosa dapat turun lebih dahulu, dan keton urin dapat tampak menetap atau meningkat ketika beta-hydroxybutyrate berubah menjadi asetoasetat.
9. Karena SpO2 98%, pertahankan **tanpa oksigen rutin**. Lakukan monitoring, suction/kesiapan airway, serta eskalasi ventilasi hanya bila oksigenasi atau ventilasi gagal. Gangguan kesadaran menjadikan pasien ini kandidat layanan intensif dan meningkatkan risiko aspirasi.
10. Ubah tujuan rujukan dari sekadar `RS dengan penyakit dalam` menjadi RS yang telah mengonfirmasi penerimaan dan mampu melakukan pemeriksaan serial kalium, glukosa, pH/bikarbonat dan keton; infus insulin dengan pompa/protokol; monitoring ECG serta diuresis; perawatan airway; dan ICU bila gangguan kesadaran menetap. Cairan, catatan jumlah masuk, respons klinis, hasil GDS/keton, waktu dosis insulin terakhir, serta obat pasien ikut dalam handoff.
11. Telusuri pencetus tanpa menunda transfer: putusnya insulin, infeksi, infark/iskemia, stroke, pankreatitis, obat tertentu termasuk SGLT2 inhibitor, kehamilan bila relevan, dan masalah psikososial. Jangan menerima `obat habis` sebagai akhir anamnesis atau menyalahkan pasien.
12. Tutup jembatan UKP-UKM: setelah stabil, cari mengapa insulin habis (stok, resep/PRB-JKN, biaya, jarak, transport, jam layanan, alat suntik, penyimpanan/cold chain, atau distress); pulihkan suplai insulin dan alat monitoring sebelum pulang; ajarkan sick-day rules, jangan menghentikan insulin basal tanpa rencana klinis, tanda bahaya, pemeriksaan keton bila tersedia, serta jalur kontak cepat. Buat callback ke pengelolaan logistik Puskesmas bila masalahnya sistemik atau dialami pasien lain.
13. Hapus `ppk_fktp_2022` sebagai binding langsung algoritme KAD. KMK 1186/2022 memuat DM tipe 2 dan HHNK, tetapi tidak menyediakan protokol KAD tersendiri. Gunakan PERKENI 2021 sebagai pedoman profesi Indonesia yang langsung membahas krisis hiperglikemik; pakai konsensus internasional 2024 dan ADA Standards of Care 2026 untuk pembaruan diagnosis, cairan, monitoring, serta pencegahan kekambuhan; gunakan Fornas 1199/2025 hanya untuk ketersediaan normatif insulin dan Permenkes 16/2024 untuk logika rujukan berbasis kemampuan.

**Realita FKTP yang diajukan, versi layar utama:**

> Insulin regular dan NPH tercantum dalam Formularium Nasional untuk pelayanan tingkat pertama, tetapi tercantum tidak menjamin stok pasien tidak pernah putus dan tidak berarti Puskesmas otomatis mampu menjalankan infus insulin KAD. Terapi ini memerlukan pemeriksaan kalium dan asam-basa, pemantauan glukosa serial, pompa atau protokol infus, serta petugas yang dapat merespons hipokalemia, hipoglikemia, dan perburukan jalan napas. Di Sukamaju, tindakan aman adalah mengenali suspek KAD, memulai kristaloid isotonik, menjaga ABC, mengonfirmasi RS yang mampu, dan mengirim pasien dengan terapi serta monitoring berlanjut. Setelah selamat, `insulin habis` harus menjadi masalah sistem yang ditutup, bukan kesalahan pasien yang dilupakan.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan - `curigai KAD, jangan menunggu semua hasil`, `cairan + ABC dahulu`, `insulin hanya dengan kalium dan monitoring`, `rujuk sambil terapi berjalan`.
- Panel `Realita FKTP`: tertutup secara default; memuat batas kemampuan infus insulin dan jembatan akses insulin.
- Panel `Bukti klinis`: tampil setelah kasus selesai; pisahkan pedoman Indonesia, EBM internasional, ketersediaan obat, dan regulasi rujukan.
- Detail angka kalium, kriteria resolusi, dan sick-day rules ditempatkan pada umpan balik/panel bukti, bukan dijejalkan ke label pilihan.

**Catatan sumber dan keterbatasan:**

- Konsensus internasional 2024 mendefinisikan KAD dengan tiga komponen: diabetes/hiperglikemia, ketosis, dan asidosis. Ia menerima NaCl 0,9% maupun kristaloid seimbang serta menyarankan 500-1.000 mL/jam pada 2-4 jam awal untuk dewasa tanpa gangguan jantung atau ginjal.
- Konsensus 2024 menunda insulin bila kalium kurang dari 3,5 mmol/L, tidak merekomendasikan bikarbonat rutin, dan hanya mempertimbangkannya pada `pH <7,0`. Resolusi memerlukan perbaikan keton dan asidosis, bukan sekadar GDS kurang dari 200 mg/dL.
- ADA Standards of Care 2026 kembali menegaskan bahwa seluruh kriteria harus terpenuhi untuk diagnosis formal dan meminta edukasi pencegahan KAD/HHS dalam perencanaan pulang.
- PERKENI 2021 memberi konteks Indonesia yang langsung membahas KAD, tetapi beberapa angka dan langkahnya mendahului konsensus 2024. Ia dipakai sebagai baseline lokal dan ditapis dengan EBM terbaru, bukan disalin tanpa pembaruan.
- Fornas 1199/2025 membuktikan ketersediaan normatif human insulin di FPKTP, bukan stok aktual, kesinambungan rantai pasok, atau kesiapan menjalankan protokol KAD.

**Sumber keputusan:**

- PERKENI, *Pedoman Petunjuk Praktis Terapi Insulin pada Pasien Diabetes Melitus*, 2021: https://pbperkeni.or.id/wp-content/uploads/2021/11/22-10-21-_-Website-Pedoman-Petunjuk-Praktis-Terapi-Insulin-Pada-Pasien-Diabetes-Melitus-Ebook.pdf
- ADA/EASD/JBDS/AACE/DTS, *Hyperglycemic Crises in Adults With Diabetes: A Consensus Report*, 2024: https://www.diabetes.org.uk/sites/default/files/2024-07/Hyperglycaemic%20Crisis%20Global%20Consensus.pdf
- ADA, *Diabetes Care in the Hospital: Standards of Care in Diabetes - 2026*: https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022 (ditinjau untuk batas provenance): https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-6 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-7 - Suspek Stroke Akut dalam Jendela Reperfusi

**Pernyataan reviewer:** `setuju next` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** pengenalan FAST, saksi onset, pemeriksaan glukosa, larangan aspirin sebelum CT, larangan neuroprotektor, pra-notifikasi, dan pilihan RS ber-CT sudah kuat. Nilai klinis saat ini sekitar **7,9/10**. Dua cacat materialnya adalah subtipe `iskemik/I63.9` ditetapkan sebelum pencitraan dan jawaban tekanan darah mengajarkan larangan absolut dengan fisiologi penumbra yang terlalu disederhanakan. Kasus juga belum menutup perjalanan akut ke rehabilitasi, pencegahan sekunder, dan perbaikan sistem rujukan. Paket di bawah ditargetkan membawa kasus ke **>=9,1/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis untuk kompatibilitas, tetapi ubah label klinis fase FKTP dari `Stroke Iskemik dalam Jendela Terapi/I63.9` menjadi **`Suspek Stroke Akut dalam Jendela Reperfusi/I64`** sampai CT. Ini menyamakan IGD dengan kasus poli `stroke_iskemik` yang sudah diadjudikasi pada M13-0B. CT kepala nonkontras membedakan iskemik dan perdarahan; gejala klinis saja tidak boleh menetapkan subtipe.
2. Bedakan dan dokumentasikan tiga waktu bila relevan: `last known well`, waktu gejala pertama ditemukan, dan waktu onset yang disaksikan. Pada vignette ini onset disaksikan pukul 07.00 dan kedatangan pukul 08.30, sehingga jendela 90 menit valid. Simpan nomor saksi agar tim stroke dapat mengonfirmasi bila keluarga terpisah selama transfer.
3. Ubah umpan balik glukosa dari `menyingkirkan peniru stroke` menjadi **menyingkirkan hipoglikemia sebagai salah satu mimic yang cepat dibalik**. GDS 132 mg/dL tidak membuktikan stroke iskemik dan tidak menyingkirkan kejang pascaiktal, migrain, toksik-metabolik, tumor, atau mimic lain; evaluasi tambahan tidak boleh menunda rujukan.
4. Lakukan pemeriksaan neurologis singkat yang dapat diulang: FAST/defisit fokal, kesadaran, pupil, gaze, bahasa, lengan dan tungkai, serta skrining keparahan/LVO yang telah dilatih. NIHSS lengkap atau pemeriksaan panjang tidak boleh menjadi syarat keberangkatan dari FKTP.
5. Karena SpO2 97%, pertahankan **tanpa oksigen rutin**. Jaga ABC, hindari hipoksia dan hipotensi, serta berikan kristaloid hanya bila dehidrasi, pra-syok, atau syok. Jangan menggunakan cairan dekstrosa kecuali untuk hipoglikemia.
6. Tambahkan `NPO sampai skrining menelan`: jangan memberikan makanan, minuman, atau obat oral, termasuk aspirin dan antihipertensi oral, sebelum kemampuan menelan dinilai. Ini menutup risiko aspirasi yang saat ini tidak terlihat dalam tiga langkah.
7. Revisi jawaban tekanan darah. Pada TD ulang **182/100**, jangan memberi kaptopril/nifedipin sublingual dan jangan menunda transfer untuk normalisasi tekanan darah. Namun jangan mengajarkan bahwa tekanan darah akut selalu `kompensatoris` atau setiap penurunan pasti `memadamkan penumbra`. Nilai ini sudah di bawah ambang pra-trombolisis `<185/110 mmHg`; monitor dan laporkan. Bila tekanan melewati ambang reperfusi atau terdapat kegawatan hipertensi lain, penurunan terkontrol dengan obat IV yang dapat dititrasi dilakukan menurut protokol di fasilitas mampu, tanpa target intensif `<140` dan tanpa menunda reperfusi.
8. Pertahankan larangan antiplatelet/antikoagulan pra-pencitraan. Tambahkan bahwa setelah perdarahan disingkirkan, pilihan trombolisis, aspirin, atau dual antiplatelet bergantung pada disabilitas defisit, pencitraan, waktu, kontraindikasi, serta strategi reperfusi; pasien ini tidak boleh dianggap kandidat aspirin hanya karena FAST positif.
9. Pertahankan neuroprotektor sebagai jawaban salah. Umpan balik dibuat profesional: tidak ada neuroprotektor yang menggantikan pencitraan dan reperfusi berbasis bukti; obat tambahan tidak boleh menunda transport. Hapus nada `kebiasaan yang menenangkan dokter` agar debrief tidak terdengar mengejek praktik atau pemain.
10. Sebelum berangkat, kumpulkan cepat tanpa menahan ambulans: obat antikoagulan/antiplatelet dan waktu dosis terakhir, riwayat perdarahan/operasi/trauma atau stroke sebelumnya, baseline fungsi, komorbid, alergi, berat badan perkiraan, serta nomor kontak saksi. Rekam pemeriksaan neurologis dan perubahan selama di FKTP.
11. Pertahankan RS 25 menit dengan CT dan layanan stroke sebagai jawaban benar dibanding RS 10 menit tanpa CT. Perjelas bahwa aturan universalnya bukan `selalu pilih RS lebih jauh`, melainkan **ikuti jejaring lokal dan pilih kemampuan yang mengubah terapi**: CT 24 jam dan trombolisis; CTA/skrining LVO serta jalur EVT atau transfer cepat bila dicurigai LVO. Bila sistem transfer antar-RS sangat cepat dan RS terdekat benar-benar thrombolysis-capable, keputusan bypass dapat berbeda.
12. Tambahkan target operasional PNPK: pra-notifikasi/telemedisin bila tersedia, konfirmasi penerimaan, dan target keberangkatan **<=30 menit setelah keputusan rujuk**. Handoff menyertakan last-known-well/onset, GDS, tekanan darah serial, SpO2, defisit, status NPO, obat/kontraindikasi, dan perubahan selama transfer terpantau.
13. Tutup bridge UKP-UKM melalui dua callback. `Hiperakut`: catat onset-to-arrival, decision-to-departure, tujuan dan kegagalan jejaring untuk audit Puskesmas/Dinkes serta edukasi komunitas `SEGERA KE RS`. `Pascapulang`: rujuk balik untuk rehabilitasi, skrining disfagia/kebutuhan rumah, dukungan caregiver, kepatuhan antitrombotik sesuai diagnosis final, dan pengendalian hipertensi, DM, lipid, merokok, fibrilasi atrium, aktivitas, serta depresi pascastroke.
14. Bersihkan provenance pada clue. Hapus sitasi bare `PPK FKTP KMK 1186/2022` yang tidak muncul pada panel sumber dan telah diamandemen KMK 1936/2022. Gunakan PNPK Stroke KMK 304/2026 sebagai baseline Indonesia dan AHA/ASA 2026 sebagai pembaruan EBM. Catat pada metadata editorial, bukan UI utama, bahwa nomor dokumen menyebut 2026 sementara halaman tanda tangan literal bertanggal 17 April 2025.

**Realita FKTP yang diajukan, versi layar utama:**

> Di FKTP, tugas dokter bukan menebak iskemik versus perdarahan, melainkan mengenali suspek stroke, menjaga ABC, mengecek glukosa, mengunci waktu, dan mengantar pasien secepatnya ke kemampuan yang dapat mengubah terapi. Dalam skenario ini, RS 10 menit tanpa CT menambah satu perpindahan, sedangkan RS 25 menit memiliki CT dan layanan stroke; karena itu tujuan kedua lebih masuk akal. Keputusan rute tetap mengikuti jejaring setempat: pasien dengan dugaan LVO mungkin perlu langsung ke pusat trombektomi, sedangkan daerah dengan transfer antar-RS yang sangat cepat dapat memakai pola lain. Setiap keterlambatan dicatat agar kasus individu memperbaiki sistem desa.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `kenali + kunci waktu`, `cek glukosa`, `jangan obat oral/antitrombotik pra-CT`, dan `pra-notifikasi ke kemampuan reperfusi`.
- Angka BP, pilihan trombolisis/EVT, serta daftar kontraindikasi berada di panel `Bukti klinis`, tertutup secara default.
- Bridge UKM tampil sebagai satu kartu ringkas `Jejak Waktu Stroke`; detail audit sistem dan rujuk balik dibuka hanya bila pemain memilih memperdalam.
- Jangan menampilkan diagnosis subtipe selama tiga langkah keputusan. Pada debrief, jelaskan bahwa kasus akhir dapat terbukti iskemik, tetapi keputusan FKTP dibuat ketika subtipe masih belum diketahui.

**Catatan sumber dan keterbatasan:**

- PNPK 304/2026 meminta pasien stroke akut dibawa ke RS dengan layanan stroke, menghindari antiplatelet/antikoagulan pra-rumah sakit, tidak menurunkan tekanan darah secara agresif, dan menargetkan keberangkatan rujukan dalam <=30 menit.
- PNPK menetapkan CT nonkontras sebagai pemeriksaan awal untuk membedakan iskemik dan perdarahan serta sasaran tekanan darah sebelum rtPA `<185/110 mmHg`. Karena pasien 182/100, normalisasi tekanan darah di FKTP tidak diperlukan.
- AHA/ASA 2026 menerima alteplase atau tenecteplase dalam jendela 4,5 jam pada pasien terpilih, memperluas kriteria EVT, dan menekankan bahwa routing harus mengikuti kemampuan serta performa sistem lokal. Ia tidak mendukung penurunan sistolik intensif ke `<140 mmHg` setelah reperfusi.
- Nama `Suspek Stroke Akut/I64` konsisten dengan resolusi dokter M13-0B pada kasus poli yang sama; membiarkan prototipe IGD tetap `Stroke Iskemik/I63.9` akan menciptakan kontradiksi internal.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Stroke*, KMK 304/2026: https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf
- AHA/ASA, *2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke*: https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke
- AHA/ASA, *Top Things to Know - 2026 AIS Guideline*: https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke/top-things-to-know
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- M13-0B internal precedent: `M13_0B_DELTA_AUDIT_2026.md`, bagian Delta Stroke.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-7 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-8 - Perdarahan Pascasalin Primer dengan Syok

**Pernyataan reviewer:** `IGD-8: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** pengenalan perdarahan pascasalin, syok, 4T, respons simultan, oksitosin, traneksamat dini, kompresi bimanual, dan pra-notifikasi sudah kuat. Nilai klinis saat ini sekitar **8,2/10**. Risiko materialnya adalah status plasenta tidak jelas meski kasus mengunci atonia, umpan balik mengajarkan traneksamat seolah harus menunggu giliran, kristaloid ditulis sebagai `guyur` tanpa reassessment atau hubungan dengan darah, dan kompresi/tampon selama perjalanan diperlakukan sebagai kewajiban universal tanpa menyatakan kompetensi serta kesiapan fasilitas. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10** sekaligus membuat jembatan UKP-UKM PPH terasa nyata.

**Patch specification yang diajukan:**

1. Pertahankan ICD `O72.1`, tetapi beri label klinis **`Perdarahan Pascasalin Primer dengan Syok, kemungkinan Atonia Uteri`**. Nyatakan bahwa plasenta sudah lahir dan kelengkapannya sedang diperiksa. Uterus lembek serta respons terhadap masase mendukung atonia, tetapi pencarian `Tone, Tissue, Trauma, Thrombin` tetap berjalan dan diagnosis penyebab tidak boleh dikunci hanya dari satu temuan.
2. Tambahkan deteksi objektif tanpa membuat pemain menunggu angka: ukur kehilangan darah dengan kantong atau drape terkalibrasi bila tersedia dan pantau aliran, tonus, nadi, tekanan darah, kesadaran, perfusi, serta suhu. Ambang WHO adalah kehilangan darah >500 mL, atau >300 mL disertai tanda vital abnormal; **clinical judgement tetap cukup** pada perdarahan deras dengan syok seperti vignette ini.
3. Aktifkan respons perdarahan obstetri dan bagi peran sejak langkah pertama: satu petugas memimpin ABC/resusitasi, satu menjalankan bundel PPH dan mencatat waktu/dosis, satu menghubungi transport serta RS, dan satu memastikan bayi serta pendamping tidak terlantar. Jangan menunggu dokter obstetri untuk memulai respons pertama.
4. Ajarkan bundel **MOTIVE** sebagai tindakan paralel yang selesai secepatnya, idealnya dalam 15 menit: Massage uterus, Oxytocic, Tranexamic acid, IV fluids, Vaginal/genital tract examination, dan Escalation. Urutan internal tidak penting dan semua komponen yang tersedia tetap diberikan walau ada perbaikan awal.
5. Nyatakan regimen oksitosin dengan satuan klinis: oksitosin `10 IU` IV yang diencerkan dan diberikan perlahan selama 1-2 menit, atau IM; lanjutkan infus menurut protokol, misalnya `20 IU dalam 1 L` selama sekitar 4 jam. Profilaksis oksitosin saat kala III tidak menghapus kebutuhan terapi PPH. Hindari bolus IV cepat dan hindari mengulang `dosis demi dosis` tanpa rencana.
6. Berikan asam traneksamat `1 g IV selama 10 menit` sedini mungkin dan dalam 3 jam setelah kelahiran. Ulangi `1 g` bila perdarahan masih berlangsung setelah 30 menit atau berulang dalam 24 jam. Koreksi umpan balik pilihan lama: kesalahannya adalah **menunggu 15 menit sebelum menjalankan masase dan uterotonika**, bukan karena traneksamat tidak boleh diberikan pada awal respons.
7. Pasang dua akses IV besar bila dapat dilakukan tanpa menunda tindakan lain, ambil darah untuk Hb, golongan/crossmatch, koagulasi dan pemeriksaan terkait, tetapi jangan menunggu hasil. Gunakan kristaloid isotonik hangat secara terukur dengan reassessment, jaga kehangatan, dan hindari istilah `guyur`. Kristaloid adalah jembatan, bukan pengganti darah; pra-notifikasi harus membuat darah dan protokol perdarahan masif siap di tujuan.
8. Periksa 4T secara cepat dan aman: tonus uterus, kelengkapan plasenta/retensi jaringan, robekan jalan lahir atau ruptur/inversi, serta kemungkinan koagulopati. Pemeriksaan tidak boleh berubah menjadi eksplorasi uterus buta atau penjahitan robekan kecil yang mengalihkan resusitasi dari syok dan sumber utama.
9. Bila perdarahan berlanjut, pilih uterotonika tambahan menurut stok dan kontraindikasi. Ergometrin dihindari pada hipertensi/preeklamsia atau penyakit jantung; prostaglandin tertentu dihindari pada asma. Misoprostol `800 mcg sublingual` dapat dipakai bila oksitosin tidak tersedia atau mutunya tidak dapat dijamin, tetapi bukan alasan untuk menunda transfer atau menumpuk obat tanpa evaluasi.
10. Gunakan kompresi bimanual oleh tenaga terlatih sebagai tindakan sementara bila atonia tidak merespons. Jelaskan tindakan dan beri dukungan/analgesia sejauh keadaan memungkinkan, gunakan pencegahan infeksi, serta rancang pemindahan dengan jumlah petugas yang cukup agar kontrol perdarahan dapat dipertahankan secara aman. Jangan mengajarkan bahwa tangan internal harus selalu dipertahankan tanpa henti di setiap ambulans, apa pun kompetensi kru dan keselamatan perjalanan.
11. Tampon balon atau kondom kateter hanya menjadi jembatan bila protokol PPH, alat steril, operator terlatih, monitoring, jalur darah/operasi, dan eskalasi segera benar-benar tersedia. Karena `sukamaju_middle_v1` adalah Puskesmas perdesaan nonrawat-inap dan PONED tidak diasumsikan, vignette harus menyatakan readiness bila tindakan ini diberi kredit. Bila tidak ready, lanjutkan tindakan yang aman dan transfer tanpa menunggu improvisasi alat.
12. Ubah tujuan rujukan dari sekadar `RS dengan obgyn` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu menyediakan darah/transfusi masif, anestesi, kamar operasi, kendali sumber obstetri, perawatan intensif, dan dukungan neonatus. Hindari transfer berantai Polindes-Puskesmas-PONED-RS bila jalur langsung ke kemampuan definitif lebih cepat; Sukamaju hanya menjadi titik stabilisasi bila memang itu rute tercepat dan aman.
13. Handoff wajib memuat waktu persalinan dan mulai perdarahan, perkiraan/ukuran kehilangan darah, status dan kelengkapan plasenta, tren tanda vital dan kesadaran, dugaan 4T, semua uterotonika/TXA beserta dosis-waktu, cairan masuk, intervensi mekanik, respons, komorbid/kontraindikasi, serta kondisi bayi. Dokumentasikan siapa penerima dan rencana darah/operasi di tujuan.
14. Tutup bridge UKP-UKM melalui dua callback. `Kesiapan semua persalinan`: audit stok dan cold chain oksitosin, stok TXA, drape terkalibrasi, set IV, kompetensi tim, simulasi PPH, ambulans, komunikasi, serta jejaring darah; banyak PPH tidak memiliki faktor risiko yang dapat diprediksi. `Kasus individual`: lakukan audit maternal near-miss atas keterlambatan pengenalan, keputusan, transport dan darah; setelah pulang tindak lanjuti anemia, pemulihan fisik, laktasi, kesehatan mental/trauma, kontrasepsi, dan kebutuhan keluarga.
15. Perbaiki provenance. Jadikan PNPK Tata Laksana Komplikasi Kehamilan KMK 91/2017 sebagai floor Indonesia langsung untuk PPH, dengan PPK FKTP KMK 1186/2022 sebagai jalur praktis FKTP. Gunakan WHO/FIGO/ICM 2025 dan Implementation Guide 2026 untuk ambang diagnosis, MOTIVE, regimen mutakhir, serta implementasi sistem. Hapus frasa mengambang `panduan Kemenkes/POGI` bila tidak ada sumber yang dapat dibuka. Fornas 1199/2025 hanya membuktikan listing normatif obat; Permenkes 16/2024 mengatur logika jejaring rujukan.

**Realita FKTP yang diajukan, versi layar utama:**

> Oksitosin dan asam traneksamat tercantum dalam Formularium Nasional untuk FKTP, tetapi listing tidak menjamin stok, cold chain, jumlah ampul, tim terlatih, atau ambulans selalu siap. Snapshot nasional Rifaskes 2019 bahkan mencatat oksitosin parenteral hanya tersedia pada 56,4% Puskesmas nonrawat-inap; angka historis ini bukan inventaris Sukamaju hari ini, tetapi alasan readiness harus terlihat. Dalam skenario ini, obat, dua akses IV, tenaga terlatih, transport, dan RS penerima harus dinyatakan. Bila satu komponen tidak ready, pemain tetap menjalankan bagian MOTIVE yang aman, mengendalikan perdarahan sebisanya, dan mempercepat transfer tanpa terkena hukuman tersembunyi. Setelah ibu selamat, kasus kembali ke UKM sebagai audit stok, kompetensi, waktu rujuk, dan akses darah.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: empat pesan - `kenali syok tanpa menunggu hitungan`, `MOTIVE paralel dalam 15 menit`, `kendalikan perdarahan sambil resusitasi`, dan `pra-notifikasi ke darah + operasi`.
- Regimen obat, kontraindikasi uterotonika, dan syarat tampon berada di panel `Bukti klinis`, tertutup secara default.
- Bridge UKM tampil sebagai satu kartu `Jejak 40 Menit`: kapan darah dikenali, bundel dimulai, keputusan rujuk dibuat, ambulans berangkat, dan darah/operasi siap.
- Gunakan label peran tim atau garis waktu singkat, bukan paragraf tambahan di tiga tombol keputusan.

**Catatan sumber dan keterbatasan:**

- WHO/FIGO/ICM 2025 memperkenalkan deteksi pada >300 mL dengan tanda vital abnormal, mempertahankan >500 mL atau clinical judgement, dan meminta bundel MOTIVE segera. Quick card WHO meminta bundel selesai dalam 15 menit dan menegaskan urutan komponen tidak penting.
- Quick card WHO memberi oksitosin 10 IU IV lambat/IM, TXA 1 g IV selama 10 menit, dosis TXA kedua setelah 30 menit bila perdarahan berlanjut, serta pengukuran darah objektif bila tersedia.
- PNPK KMK 91/2017 secara langsung memuat PPH, 4T, respons simultan, masase, oksitosin, kompresi bimanual, tampon kondom, resusitasi dan rujukan. Bagian obat serta perangkat yang lebih tua ditapis dengan WHO 2025, bukan dibuang sebagai konteks lokal.
- WHO menempatkan tampon balon pada sistem yang menjalankan protokol PPH dan memiliki prasyarat implementasi. Baseline M13-RP1 tidak menganggap Sukamaju PONED; readiness harus dinyatakan, bukan diasumsikan dari nama Puskesmas.
- Fornas 1199/2025 mencantumkan oksitosin injeksi 10 IU/mL dan asam traneksamat injeksi untuk FPKTP dengan restriksi. Ini bukan bukti stok bedside atau cold-chain aktual.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Komplikasi Kehamilan*, KMK 91/2017: https://www.kemkes.go.id/app_asset/file_content_download/17012281586566ae7eec8862.58707574.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO/FIGO/ICM, *Consolidated Guidelines for Prevention, Diagnosis and Treatment of PPH*, 2025: https://www.who.int/publications/i/item/9789240115637
- WHO/FIGO/ICM/Jhpiego/UNFPA, *PPH Implementation Guide*, 2026: https://www.who.int/publications/i/item/9789240116115
- WHO, *PPH Quick Card*, updated November 2025: https://cdn.who.int/media/docs/default-source/integrated-health-services-%28ihs%29/csy/pph-quick-card.pdf?sfvrsn=359ae7aa_1
- WHO, *Recommendation on Uterine Balloon Tamponade*, 2021: https://www.who.int/publications/i/item/9789240013841
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, khususnya profil `sukamaju_middle_v1` dan data Rifaskes 2019.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-8 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-9 - Pneumotoraks Tensi Traumatik dengan Syok Obstruktif

**Pernyataan reviewer:** `IGD-9: setuju` pada 2026-07-22, merujuk rekomendasi `Perlu edit` yang langsung mendahuluinya.

**Rekomendasi CODEX:** `Perlu edit - disetujui`.

**Penilaian ringkas:** kasus sudah benar mengenali kegawatan klinis, melarang penundaan untuk foto toraks, memberi oksigen, melakukan dekompresi di sisi sakit, menghindari tepi bawah iga, memantau kekambuhan, dan tetap merujuk setelah respons. Nilai klinis saat ini sekitar **7,2/10**. Masalah material berada tepat pada prosedur inti: lokasi tusuk tidak pernah disebut, panjang kateter tidak dinyatakan, desis udara dianggap konfirmasi, cairan ditolak secara absolut pada pasien trauma yang mungkin mengalami syok campuran, dan WSD disebut selalu melampaui FKTP alih-alih dikaitkan dengan readiness. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis dan ICD `S27.0`, tetapi gunakan label **`Pneumotoraks Tensi Traumatik dengan Syok Obstruktif`**. Diagnosis tetap klinis dan tindakan tidak menunggu pencitraan pada pasien dengan hipotensi serta kompromi napas berat seperti vignette ini.
2. Ajarkan pola, bukan triad buku teks: mekanisme trauma toraks, perburukan cepat, distres/hipoksia, gerak dada dan suara napas unilateral turun atau hilang, serta gangguan perfusi. Distensi vena leher dan deviasi trakea boleh ada pada vignette, tetapi merupakan tanda yang tidak sensitif atau terlambat dan tidak boleh menjadi syarat. Vena leher dapat datar bila trauma juga menyebabkan hipovolemia.
3. Batasi indikasi dekompresi: lakukan hanya pada **dugaan pneumotoraks tensi dengan instabilitas hemodinamik atau kompromi respirasi berat**, bukan setiap pneumotoraks atau setiap suara napas unilateral menurun. Pada pasien stabil, pencitraan/eFAST dan tata laksana terkontrol tetap relevan.
4. Ganti dialog `Tolak foto toraksnya` dengan `jangan menunda dekompresi untuk foto`. eFAST boleh membantu bila alat dan operator terlatih sudah berada di sisi pasien serta tidak menunda tindakan; hasil negatif tidak menyingkirkan pneumotoraks. Ini juga menghilangkan kontradiksi dengan profil Sukamaju yang tidak mengasumsikan radiologi ready.
5. Karena SpO2 79%, berikan oksigen konsentrasi tinggi dan lakukan penilaian trauma ABCDE secara paralel. Pasang akses IV, cari perdarahan lain, lindungi tulang belakang sesuai mekanisme, dan jaga suhu. Koreksi umpan balik lama: dekompresi memang mendahului bolus cairan, tetapi trauma dapat menimbulkan syok campuran; cairan/darah tidak boleh dinyatakan tidak berguna secara universal.
6. Nyatakan resource sebelum pilihan prosedur: operator terlatih, kateter dekompresi besar yang **cukup panjang untuk dinding dada pasien** (untuk skenario dewasa ini perangkat 14G sekitar 8 cm), antiseptik, sarung tangan, oksigen, monitoring, dan transport tersedia. Kateter IV pendek biasa dapat gagal mencapai pleura; pemain tidak boleh dihukum oleh alat yang diam-diam tidak memadai.
7. Tentukan lokasi secara eksplisit menurut protokol dan anatomi. Untuk skenario dewasa ini pilih sela iga ke-4 atau ke-5 pada garis anterior aksila/sekitar safe triangle; sela iga ke-2 garis midklavikula tetap diakui sebagai alternatif dalam pedoman tertentu. Tusuk tepat di atas tepi iga bawah pada sela yang dipilih, hindari arah terlalu medial, terlalu rendah, atau terlalu posterior, dan jangan menjadikan garis puting sebagai landmark tunggal.
8. Revisi langkah teknik: desinfeksi tanpa menunda keadaan mengancam nyawa, masukkan jarum-kateter tegak lurus sesuai lokasi sampai pleura tercapai, majukan kateter dan keluarkan jarum, lalu biarkan sistem berventilasi sesuai perangkat/protokol serta fiksasi dengan aman. Jangan meninggalkan instruksi samar `kanul terbuka` sebagai keseluruhan tata laksana.
9. Hapus klaim bahwa desis udara `mengonfirmasi diagnosis`. Desis dapat tidak terdengar dan dekompresi dapat gagal karena lokasi, panjang, kink, sumbatan, atau dislodgement. Keberhasilan dinilai dari respons serial: kerja napas, ekspansi/suara napas, SpO2, tekanan darah, nadi, kesadaran dan perfusi. Bila tidak membaik atau kembali memburuk, segera nilai ulang diagnosis, sisi, patensi dan kebutuhan dekompresi ulang/teknik alternatif oleh petugas yang kompeten.
10. Pertahankan needle decompression sebagai jembatan yang benar untuk profil Sukamaju. Open/finger thoracostomy atau tube thoracostomy dapat lebih andal bila dilakukan tim yang sangat terlatih dengan alat, tata kelola, dan quality assurance, tetapi tidak ready dalam vignette ini. Ganti umpan balik `WSD melampaui lingkup FKTP` dengan `WSD tidak tersedia dan tidak aman dilakukan oleh tim Sukamaju saat ini`; kemampuan fasilitas, bukan nama tingkat layanan, menjadi batasnya.
11. Setelah respons, jangan cabut kateter atau menutup jalur secara kedap. Fiksasi, pantau patensi dan kekambuhan, teruskan oksigen sesuai respons, dan siapkan dekompresi ulang bila tension kambuh. Bila ventilasi tekanan positif menjadi perlu, pastikan dekompresi efektif karena tekanan positif dapat mempercepat kekambuhan.
12. Rujuk tanpa menunggu foto dokumentasi ke fasilitas yang telah mengonfirmasi penerimaan dan mampu melakukan chest drain, pencitraan trauma, ventilasi, transfusi, bedah/trauma dan perawatan intensif. Handoff memuat mekanisme, sisi dan temuan, lokasi/perangkat/waktu dekompresi, respons, komplikasi, tren vital, terapi lain, serta kecurigaan cedera penyerta.
13. Beri analgesia dan dukungan komunikasi setelah ancaman segera teratasi tanpa menunda tindakan. Jelaskan bahwa perbaikan adalah hasil dekompresi sementara, bukan paru yang sudah sembuh. Foto toraks atau eFAST tetap diperlukan setelah stabilisasi di fasilitas mampu untuk cedera toraks dan posisi drainase definitif.
14. Tutup bridge UKP-UKM melalui dua callback. `Trauma individu`: dokumentasikan lokasi kecelakaan, penggunaan helm, alkohol/kelelahan, kondisi jalan, waktu ditemukan, respons PSC/ambulans dan cedera penyerta tanpa menyalahkan korban. `Kesiapan sistem`: setiap needle decompression masuk audit indikasi, sisi, landmark, panjang perangkat, respons dan komplikasi; cek stok kateter panjang, kompetensi berkala dengan simulasi, serta waktu menuju chest drain. Temuan berulang diteruskan ke Puskesmas, PSC/Dinkes dan lintas sektor keselamatan jalan.
15. Perbaiki provenance. Jadikan PNPK Tata Laksana Trauma KMK 132/2017 dan PPK FKTP KMK 1186/2022 sebagai floor Indonesia, tetapi jangan mengklaim keduanya menetapkan lokasi dekompresi modern secara rinci. Gunakan WHO-ICRC Basic Emergency Care untuk konteks layanan pertama sumber daya terbatas, NICE NG39 yang masih aktif untuk indikasi dan pilihan teknik berbasis kompetensi, WSES-AAST 2025 untuk pembaruan teknik trauma toraks, dan NAEMSP 2024 untuk risiko salah indikasi/kegagalan serta quality assurance. Hapus sitasi mengambang `prinsip ATLS` bila edisi atau akses sumber tidak tersedia di panel bukti.

**Realita FKTP yang diajukan, versi layar utama:**

> Needle decompression masuk kompetensi kegawatdaruratan yang dapat diajarkan di layanan primer; WHO Indonesia bahkan memasukkannya dalam pelatihan Basic Emergency Care untuk tenaga Puskesmas. Namun pelatihan nasional tidak membuktikan setiap Puskesmas selalu memiliki operator kompeten, kateter cukup panjang, monitoring, atau ambulans pada setiap jam. Karena prosedur ini satu-satunya tindakan penyelamat pada vignette, kasus harus menyatakan semua resource tersebut ready sebelum pemain memilih. Sukamaju melakukan dekompresi jarum sebagai jembatan, memantau kegagalan/kekambuhan, dan mengirim pasien ke chest drain definitif. Setiap tindakan kemudian diaudit agar prosedur langka ini tidak berubah menjadi tusukan refleks pada semua sesak pascatrauma.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `diagnosis klinis pada pasien tidak stabil`, `oksigen + dekompresi tanpa menunggu gambar`, `nilai keberhasilan dari pasien, bukan desis`, dan `rujuk untuk chest drain`.
- Sebelum langkah teknik, tampilkan strip resource singkat: `operator terlatih`, `kateter 14G panjang`, `monitoring`, dan `ambulans ready`.
- Setelah keputusan, tampilkan satu diagram anatomi sederhana dengan lokasi lateral yang dipilih, alternatif anterior, serta penanda `di atas iga`; jangan menjejalkan anatomi ke label tombol.
- Panel `Bukti klinis` memisahkan floor Indonesia, panduan layanan terbatas, dan pembaruan trauma internasional. Detail kegagalan kateter serta pilihan thoracostomy berada di panel tertutup.
- Bridge UKM tampil sebagai kartu `Audit Satu Tusukan`: indikasi, alat, landmark, respons dan komplikasi, lalu tindak lanjut kesiapan sistem.

**Catatan sumber dan keterbatasan:**

- PNPK Trauma 132/2017 menempatkan Puskesmas sebagai ujung tombak evaluasi awal, stabilisasi dan rujukan trauma, tetapi teksnya tidak memberi algoritme needle decompression dewasa yang cukup rinci untuk menjadi satu-satunya sumber prosedur.
- PPK 1186/2022 menyebut dekompresi jarum atau tube thoracostomy pada syok obstruktif serta menyediakan daftar alat pneumotoraks, tetapi bab pneumotoraksnya terutama membahas pneumotoraks spontan dan tidak menentukan site/length modern.
- NICE NG39 membatasi dekompresi pada instabilitas hemodinamik atau kompromi napas berat, melarang penundaan pencitraan pada keadaan itu, dan memilih open thoracostomy bila keahlian tersedia. Ini tidak berarti open thoracostomy layak diasumsikan di Sukamaju.
- WSES-AAST 2025 menempatkan chest tube sebagai terapi definitif dan menerima needle decompression di sela iga ke-2 garis midklavikula atau sela iga ke-5 garis midaksila ketika chest tube tidak tersedia atau dalam layanan prarumah sakit.
- NAEMSP 2024 menyoroti salah indikasi dan rendahnya keberhasilan needle thoracostomy, meminta pendekatan individual terhadap anatomi/perangkat serta quality assurance. Bukti perbandingan teknik tetap banyak bergantung pada studi observasional dan konsensus, sehingga game tidak boleh menyajikan satu site sebagai kebenaran universal tanpa konteks protokol.
- WHO-ICRC BEC mengajarkan kateter 14-16G di sela iga ke-2 garis midklavikula dan transfer segera; ia dipakai sebagai konteks feasible untuk first-contact care, lalu ditriangulasi dengan rekomendasi trauma yang lebih baru.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Trauma*, KMK 132/2017: https://keslan.kemkes.go.id/unduhan/fileunduhan_1610422327_714480.pdf
- Kementerian Kesehatan RI, *PPK Dokter di FKTP*, KMK 1186/2022: https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/
- WHO-ICRC-IFEM, *Basic Emergency Care*: https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care/bec
- WHO Indonesia, *Empowering Primary Care: WHO Trains Health Workers to Provide Quality Emergency Services*, 2024: https://www.who.int/indonesia/news/detail/05-01-2024-empowering-primary-care--who-trains-health-workers-to-provide-quality-emergency-services
- NICE, *Major Trauma: Assessment and Initial Management*, NG39: https://www.nice.org.uk/guidance/ng39/chapter/recommendations
- WSES-AAST, *Thoracic Trauma Guidelines*, 2025: https://link.springer.com/article/10.1186/s13017-025-00651-1
- NAEMSP, *Prehospital Trauma Compendium: Traumatic Pneumothorax Care*, 2024: https://doi.org/10.1080/10903127.2024.2416978
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan reviewer:** **Perlu edit - disetujui.** Seluruh patch specification IGD-9 dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.

## IGD-10 - Status Epileptikus Konvulsif pada Dewasa

**Status:** paket keputusan siap; belum merupakan sign-off dokter.

**Rekomendasi CODEX:** `Perlu edit`.

**Penilaian ringkas:** draf sudah benar mengenali kejang lebih dari lima menit sebagai kegawatan, melindungi pasien dari cedera, melarang restrain dan benda di mulut, memberi oksigen pada hipoksemia, memakai benzodiazepin sebagai lini pertama, membatasi pengulangan, serta tetap merujuk. Nilai klinis saat ini sekitar **6,9/10**. Cacat materialnya adalah rentang usia 15-17 tahun digrounding ke PNPK dewasa, pemeriksaan glukosa baru dijadikan jawaban setelah dua dosis benzodiazepin, dan tidak ada tindakan lini kedua ketika kasus sudah masuk established benzodiazepine-resistant status epilepticus. Frasa `jalan napas aman` juga memberi rasa aman palsu, rute bukal muncul tanpa obat/protokol Indonesia yang dinyatakan, dan tujuan rujukan hanya berbasis nama spesialis. Paket di bawah ditargetkan membawa kasus ke **>=9,2/10**.

**Patch specification yang diajukan:**

1. Pertahankan id teknis dan ICD `G41.9`, tetapi ubah label menjadi **`Status Epileptikus Konvulsif pada Dewasa`** dan rentang usia menjadi 18-45 tahun. KMK 274/2026 adalah PNPK epilepsi dewasa; usia 15-17 tidak boleh masuk diam-diam tanpa jalur pediatrik tersendiri.
2. Ajarkan dua ambang ILAE secara tepat: pada kejang tonik-klonik, `t1 = 5 menit` adalah saat terapi emergensi harus dimulai dan `t2 = 30 menit` adalah saat risiko konsekuensi jangka panjang meningkat. Pemain tidak menunggu menit ke-30 untuk menamai atau mengobati status.
3. Ubah fase pertama menjadi respons tim paralel: catat waktu mulai; panggil bantuan dan aktifkan ambulans/jejaring rujuk sejak status dikenali; lindungi kepala dan jauhkan benda keras; jangan menahan gerakan atau memasukkan benda ke mulut; posisikan lateral bila aman dan feasible; suction hanya sekret/muntahan yang terlihat; beri oksigen karena SpO2 90%; siapkan BVM dan monitor; pasang akses IV tanpa menunda obat; serta periksa glukosa kapiler dalam menit awal. Turn-based UI boleh meminta satu keputusan utama, tetapi narasi harus menjelaskan bahwa tugas-tugas ini berjalan bersamaan.
4. Jangan menyebut jalan napas `sudah aman` hanya karena pasien dimiringkan dan SpO2 naik. Kejang aktif serta benzodiazepin dapat mengganggu ventilasi; nilai gerak dada, frekuensi dan usaha napas, saturasi, sekret, serta kesiapan suction/BVM. Eskalasi airway dilakukan oleh tim kompeten bila ventilasi gagal.
5. Jangan menunda benzodiazepin demi ritual ABC lengkap atau akses IV. Setelah proteksi dan bantuan ventilasi dasar sedang berjalan, berikan dosis adekuat segera. Untuk pasien dewasa ini, PNPK 274/2026 menetapkan diazepam IV 0,1 mg/kgBB, 5-10 mg per dosis, maksimum kumulatif 20 mg, dengan kecepatan maksimum 5 mg/menit; dapat diulang satu kali bila kejang berlanjut. Bila akses IV tidak segera didapat, diazepam rektal sesuai protokol adalah jalur PNPK-FPKTP yang dinyatakan tersedia.
6. Hapus umpan balik yang memperkenalkan rute `bukal` tanpa menyebut obat, sediaan, atau readiness. Midazolam bukal sah pada pedoman tertentu, sedangkan PNPK dewasa Indonesia mencantumkan diazepam rektal untuk FPKTP dan midazolam IM pada bagian FPKTL. Game hanya menampilkan rute yang benar-benar terikat ke sediaan, protokol, dan resource vignette.
7. Rekam waktu, rute, dosis, dan respons setiap benzodiazepin, termasuk obat yang mungkin sudah diberikan keluarga atau petugas pra-fasilitas. Jangan mengulang berdasarkan kesan `masih kejang` tanpa mengetahui dosis kumulatif; jangan pula mengurangi dosis efektif hanya karena takut depresi napas. Risiko napas ditangani dengan monitoring dan dukungan ventilasi, bukan dengan undertreatment.
8. Pindahkan pemeriksaan glukosa dari langkah ketiga ke fase awal. Hipoglikemia dikoreksi segera bila ada, tetapi pemeriksaan atau pemberian glukosa tidak boleh menunda benzodiazepin. Skrining penyebab berjalan paralel dan mencakup obat antiseizure yang terputus, infeksi, stroke, trauma, gangguan elektrolit/metabolik, toksin atau putus alkohol, kehamilan/eklampsia bila relevan, serta kemungkinan kejadian nonepileptik tanpa membiarkan keraguan itu menunda terapi pada presentasi berisiko tinggi.
9. Setelah dua dosis benzodiazepin yang adekuat tanpa terminasi, nyatakan secara eksplisit **established benzodiazepine-resistant status epilepticus**. Jangan berhenti pada `cek gula lalu rujuk`: pasien membutuhkan obat antiseizure IV lini kedua dengan monitoring serta kesiapan airway. WHO 2023, NICE NG217, ACEP 2024, dan ESETT mendukung levetirasetam, fenitoin/fosfenitoin, atau valproat sebagai opsi dengan efektivitas serupa; fenobarbital juga merupakan opsi pada konteks tertentu. Pilihan mengikuti protokol, komorbid, interaksi, kehamilan, ketersediaan, dan kemampuan monitoring, bukan satu obat juara universal.
10. Terapkan graceful degradation secara konkret pada vignette. Sukamaju dinyatakan memiliki diazepam IV/enema, glukometer, oksigen, suction, BVM, akses IV, monitor tanda vital, dan ambulans. Sukamaju **tidak** dinyatakan ready untuk infus lini kedua karena pompa/protokol, monitoring jantung, stok dosis penuh, serta operator tidak semuanya terverifikasi. Karena itu, setelah dua dosis adekuat gagal, tim mempertahankan airway/ventilasi dan monitoring, mengoreksi penyebab reversibel, meminta arahan medis penerima, dan mentransfer segera ke fasilitas yang telah siap memberi lini kedua. Bila kelak profil kasus menyatakan seluruh resource lini kedua ready, terapi tersebut dimulai tanpa menunda transport.
11. Jangan menyamakan `obat tercantum` dengan kemampuan mengeksekusi protokol. Fornas 1199/2025 mencantumkan diazepam injeksi dan enema untuk FPKTP serta beberapa antikonvulsan lain, tetapi listing tidak membuktikan stok hari itu, dosis penuh, pompa, ECG, airway backup, kompetensi, atau tata kelola. Panel Realita FKTP harus menerangkan perbedaan ini singkat dan tanpa memberi kesan Puskesmas tidak boleh berbuat apa-apa.
12. Bila gerakan motorik berhenti tetapi kesadaran tidak pulih, jangan otomatis menyatakan status selesai atau menumpuk benzodiazepin. Lanjutkan ABC, periksa ulang glukosa, suhu, pupil, trauma dan tanda fokal; pertimbangkan fase postiktal, efek obat, penyebab struktural/metabolik, dan non-convulsive status. Fasilitas tujuan harus mampu melakukan EEG serta airway/critical care bila gangguan kesadaran menetap.
13. Ubah tujuan rujukan dari sekadar `RS dengan layanan saraf` menjadi fasilitas yang telah mengonfirmasi penerimaan dan mampu memberi obat lini kedua, ventilasi/intubasi, pemeriksaan elektrolit serta etiologi, CT bila terindikasi, EEG untuk kecurigaan status non-konvulsif, dan ICU. Handoff memuat onset/t1, semiologi, pemulihan di antara kejang, glukosa, kehamilan bila relevan, pemicu, obat rumah, seluruh dosis serta waktu obat emergensi, respons, tren vital, dan dukungan airway selama transfer.
14. Tutup bridge UKP-UKM melalui dua callback. `Individu-keluarga`: setelah stabil, buat rencana emergensi tertulis, ajarkan first aid dan kapan mengaktifkan ambulans, pastikan akses obat rutin/rescue bila diresepkan, telaah kepatuhan tanpa menyalahkan, serta bahas keselamatan air, api, ketinggian, mesin, berkendara, pekerjaan dan kesehatan mental/stigma secara relevan. `Sistem`: setiap status memicu audit waktu onset-ke-benzodiazepin, kecukupan dosis, kesiapan oksigen-suction-BVM, ketersediaan obat rescue, waktu ambulans dan tujuan capable; temuan berulang kembali ke manajemen stok, simulasi tim, edukasi keluarga/sekolah/tempat kerja, dan jejaring Puskesmas-RS. Jangan memalsukan write-back ke indikator PIS-PK bila tidak ada indikator yang cocok.
15. Hubungkan pedagoginya dengan kasus poli epilepsi dewasa yang sudah diadjudikasi: kejang singkat yang sudah berhenti dan pasien pulih bukan alasan otomatis memberi diazepam rektal, sedangkan kejang aktif >=5 menit atau berulang tanpa pulih adalah status yang membutuhkan rescue treatment dan rujukan. Ini mencegah pemain menggeneralisasi satu algoritme ke semua kejang.
16. Perbaiki provenance. Jadikan PNPK Epilepsi Dewasa KMK 274/2026 sebagai floor Indonesia dan ILAE 2015 untuk definisi t1/t2. Tambahkan WHO 2023, NICE NG217 yang diperbarui 2025, kebijakan ACEP 2024, dan ESETT sebagai dasar lini kedua. Fornas 1199/2025 hanya digunakan untuk ketersediaan normatif, sedangkan Permenkes 16/2024 mendasari rujukan berbasis kemampuan. Hapus sitasi mengambang `konsensus PERDOSSI` bila dokumen, tahun, dan URL spesifik tidak hadir pada panel bukti.

**Realita FKTP yang diajukan, versi layar utama:**

> Diazepam injeksi dan enema tercantum dalam Formularium Nasional untuk FPKTP, sehingga Puskesmas bukan sekadar tempat lewat: status dikenali pada menit ke-5, first aid, oksigen/ventilasi, glukosa, dan benzodiazepin adekuat dimulai sambil rujukan bergerak. Namun obat lini kedua yang tercantum di daftar tidak otomatis berarti pompa, ECG, stok dosis penuh, operator, dan airway backup siap pada setiap giliran jaga. Pada encounter ini Sukamaju mampu memberi dua dosis diazepam terukur dan mendukung ventilasi, tetapi tidak mendaku mampu menjalankan infus lini kedua. Setelah gagal, tim tidak menumpuk sedasi atau menunggu: RS capable dikonfirmasi, monitoring berlanjut selama transfer, dan setiap keterlambatan kembali menjadi audit kesiapan sistem.

**Rancangan penyajian tanpa overload:**

- Isi utama debrief: `5 menit = mulai`, `ABC dan glukosa berjalan paralel`, `benzodiazepin adekuat - maksimal dua dosis`, dan `gagal dua dosis = lini kedua + transfer capable`.
- Tampilkan timeline ringkas tiga fase, bukan paragraf dosis panjang: `0-5 stabilisasi`, `5-20 benzodiazepin`, `gagal dua dosis -> established SE`.
- Sebelum pilihan obat, tampilkan strip resource singkat: `diazepam IV/enema`, `glukometer`, `O2-suction-BVM`, `monitor`, dan `ambulans ready`; `infus lini kedua belum ready`.
- Panel `Bukti klinis` tertutup secara default dan memisahkan PNPK Indonesia, definisi ILAE, EBM lini kedua, Fornas, serta aturan rujukan.
- Bridge UKM tampil setelah pasien selamat sebagai kartu `Menit yang Hilang`: waktu ke obat, dosis, transport, akses obat rutin/rescue, dan satu perbaikan sistem. Detail keselamatan hidup berada dalam teach-back singkat, bukan daftar panjang di layar utama.

**Catatan sumber dan keterbatasan:**

- PNPK KMK 274/2026 secara eksplisit membatasi regimen awalnya pada pasien dewasa: diazepam IV 0,1 mg/kgBB, 5-10 mg per dosis, maksimum 20 mg dan kecepatan maksimum 5 mg/menit, dapat diulang sekali, atau diazepam rektal saat kejang sambil merujuk. Dokumen juga menetapkan t1 5 menit dan t2 30 menit untuk status tonik-klonik.
- Diagram lini lanjut di PNPK berada sebagai gambar dan ekstraksi teksnya tidak cukup untuk dijadikan satu-satunya rincian algoritme. Karena itu rekomendasi setelah kegagalan benzodiazepin ditriangulasi dengan WHO, NICE, ACEP, dan uji ESETT.
- WHO 2023 menyatakan bahwa setelah dua dosis benzodiazepin, pilihan IV fosfenitoin/fenitoin, levetirasetam, fenobarbital, atau valproat bergantung pada sumber daya dan monitoring; rekomendasinya kondisional dengan kepastian bukti rendah pada dewasa.
- ACEP 2024 memberi rekomendasi Level A bahwa fosfenitoin, levetirasetam, atau valproat dapat digunakan dengan efektivitas serupa pada dewasa yang tetap kejang setelah dosis benzodiazepin optimal.
- ESETT menemukan terminasi kejang dan perbaikan respons pada sekitar separuh pasien: 47% levetirasetam, 45% fosfenitoin, dan 46% valproat, tanpa perbedaan bermakna. Temuan ini mencegah game mengajarkan superioritas palsu.
- NICE NG217 terakhir diperbarui Januari 2025 dan meminta terapi lini kedua setelah dua dosis benzodiazepin. Pembaruan keselamatan valproat harus diperhatikan; game tidak menjadikannya pilihan refleks pada semua pasien.
- Fornas membuktikan listing dan restriksi normatif, bukan stok atau kesiapan prosedural saat encounter. Baseline ASPAK PRIMERA juga merupakan profil authoring, bukan data readiness real-time.

**Sumber keputusan:**

- Kementerian Kesehatan RI, *PNPK Tata Laksana Epilepsi Dewasa*, KMK 274/2026: https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf
- ILAE, *Definition and Classification of Status Epilepticus*, 2015: https://www.ilae.org/guidelines/definition-and-classification/status-epilepticus-2015
- WHO, *Antiseizure Medicines for Management of Established Status Epilepticus*, updated 2023: https://www.who.int/teams/mental-health-and-substance-use/mental-health-gap-action-programme/resources-centre/epilepsy-and-seizures/Antiseizure-medicines-for-management-of-established-status-epilepticus
- NICE, *Epilepsies in Children, Young People and Adults*, NG217, updated 2025: https://www.nice.org.uk/guidance/ng217/chapter/7-Treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures
- American College of Emergency Physicians, *Clinical Policy: Adult Patients Presenting With Seizures*, 2024: https://www.acep.org/siteassets/new-pdfs/clinical-policies/seizures.pdf
- Kapur et al., *Randomized Trial of Three Anticonvulsant Medications for Status Epilepticus (ESETT)*, NEJM 2019: https://www.nejm.org/doi/full/10.1056/NEJMoa1905795
- American Epilepsy Society, *Treatment of Prolonged Seizures in Children and Adults*, 2016: https://aesnet.org/clinical-care/clinical-guidance/guideline-prolonged-seizures
- Kementerian Kesehatan RI, *Fornas 1199/2025*: https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/
- Kementerian Kesehatan RI, *Permenkes 16/2024 tentang Sistem Rujukan*: https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024
- Baseline internal: `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`, profil `sukamaju_middle_v1`.

**Keputusan yang diminta:** `Setuju`, `Perlu edit`, `Tolak`, atau `Nanti` terhadap paket IGD-10 di atas. Bila `Setuju`, seluruh patch specification dikunci untuk batch implementasi akhir setelah adjudikasi 14 kasus selesai.
