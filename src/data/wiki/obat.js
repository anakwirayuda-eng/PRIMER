/**
 * @reflection
 * [IDENTITY]: obat
 * [PURPOSE]: Static data module exporting: obatData.
 * [STATE]: Experimental
 * [ANCHOR]: obatData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const obatData = {
    med_paracetamol: {
        title: "Paracetamol",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat analgetik and antipiretik paling aman untuk meredakan nyeri ringan-sedang and demam. Tersedia dalam bentuk Tablet, Sirup, and Drop.",
        ikmContext: "Obat esensial nomor satu di Indonesia. Tersedia di setiap tingkatan faskes (Puskesmas, Pustu, Posyandu).",
        sknContext: "Masuk dalam Formularium Nasional (FORNAS). Penggunaan yang benar mencegah kerusakan hati (hepatotoksik).",
        funFact: "Paracetamol adalah obat medis yang paling banyak dikonsumsi di seluruh dunia setiap tahunnya.",
        gameTip: "Pilihan pertama untuk demam pada anak and dewasa. Berikan dosis tepat (10-15 mg/kgBB)."
    },
    med_asam_mefenamat: {
        title: "Asam Mefenamat",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat anti-inflamasi non-steroid (NSAID) yang efektif untuk nyeri akut, terutama nyeri haid (dismenore) and nyeri gigi.",
        ikmContext: "Sangat umum diresepkan namun harus hati-hati pada pasien dengan riwayat gangguan lambung (Gastritis).",
        sknContext: "Tersedia secara luas sebagai obat generik 500mg di Puskesmas.",
        funFact: "Banyak dikenal masyarakat Indonesia sebagai 'obat sakti' untuk sakit gigi.",
        gameTip: "Sangat efektif untuk keluhan nyeri haid di Poli KIA atau remaja sekolah saat kunjungan UKS."
    },
    med_ibuprofen: {
        title: "Ibuprofen",
        category: "farmasi",
        icon: "Pill",
        concept: "NSAID yang memiliki efek anti-inflamasi (anti-radang) lebih kuat dibanding Paracetamol. Tersedia dalam tablet 400mg and sirup.",
        ikmContext: "Pilar pengobatan nyeri sendi (osteoartritis) and demam tinggi yang tidak turun dengan paracetamol.",
        sknContext: "Bagian dari obat esensial yang wajib ada untuk penanganan trauma ringan di lapangan.",
        funFact: "Selain menurunkan panas, Ibuprofen juga mengurangi pembengkakan di area yang cedera.",
        gameTip: "Gunakan bila paracetamol kurang efektif, namun ingatkan pasien untuk meminumnya sesudah makan."
    },
    med_amoxicillin: {
        title: "Amoxicillin",
        category: "farmasi",
        icon: "Pill",
        concept: "Antibiotik golongan Penisilin spektrum luas untuk infeksi bakteri di saluran napas, telinga, and kulit.",
        ikmContext: "Sering disalahgunakan untuk flue virus. Peran nakes sangat penting dalam mencegah resistensi antibiotik (AMR).",
        sknContext: "Wajib dihabiskan sesuai resep dokter meskipun gejala sudah hilang.",
        funFact: "Ditemukan pertama kali dari jamur Penicillium, jenis antibiotik ini adalah yang tersering diresepkan di dunia.",
        gameTip: "Hanya berikan jika ada bukti infeksi bakteri (radang tenggorokan dengan bintik putih, luka bernanah, dsb)."
    },
    med_cefixime: {
        title: "Cefixime / Cefadroxil",
        category: "farmasi",
        icon: "Pill",
        concept: "Antibiotik golongan Sefalosporin yang lebih poten untuk infeksi saluran kemih (ISK) and infeksi bakteri berat.",
        ikmContext: "Sering menjadi lini kedua jika kuman sudah tidak mempan dengan antibiotik golongan penisilin.",
        sknContext: "Obat ini termasuk 'Watch Group' dalam klasifikasi WHO, penggunaannya harus lebih selektif.",
        funFact: "Cefixime stabil terhadap banyak enzim yang biasanya menghancurkan antibiotik lain.",
        gameTip: "Efektif untuk kasus keputihan akibat bakteri atau ISK berulang di Puskesmas."
    },
    med_cotrimoxazole: {
        title: "Cotrimoxazole",
        category: "farmasi",
        icon: "Pill",
        concept: "Kombinasi dua antibiotik (Sulfamethoxazole & Trimethoprim) untuk infeksi bakteri luas.",
        ikmContext: "Selain infeksi umum, juga digunakan sebagai profilaksis (pencegahan) infeksi paru pada penderita HIV.",
        sknContext: "Waspadai reaksi alergi berat (kulit melepuh/SJS) pada beberapa orang yang sensitif terhadap obat golongan sulfa.",
        funFact: "Obat ini sering disebut 'Respiratori Antibiotic' karena efektivitasnya pada infeksi paru and bronkitis.",
        gameTip: "Pilihan murah and efektif untuk ISK atau infeksi telinga tengah pada anak."
    },
    med_metronidazole: {
        title: "Metronidazole",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat anti-infeksi khusus untuk kuman anaerob and parasit seperti Amoeba atau Trichomonas.",
        ikmContext: "Prinsip utama pengobatan diare berdarah (Disentri) and infeksi organ reproduksi.",
        sknContext: "Memberikan rasa logam (metallic taste) di lidah sebagai efek samping yang umum namun tidak berbahaya.",
        funFact: "Jangan meminum alkohol saat mengomsumsi obat ini karena bisa menyebabkan mual hebat (efek disulfiram).",
        gameTip: "Wajib diberikan pada pasien dengan keluhan keputihan berbau atau diare berlendir/berdarah."
    },
    med_acyclovir: {
        title: "Acyclovir",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat antivirus untuk mengatasi infeksi virus Herpes Simplex (luka mulut/kelamin) and Herpes Zoster (Dampa).",
        ikmContext: "Tidak membunuh virus secara total, namun menghambat replikasinya sehingga penyembuhan lebih cepat.",
        sknContext: "Diberikan dalam dosis tinggi (400mg-800mg) and tersedia juga dalam bentuk salep.",
        funFact: "Virus herpes biasanya 'sembunyi' di saraf and bisa muncul kembali saat daya tahan tubuh drop.",
        gameTip: "Segera berikan pada kasus Dampa (cacar ular) untuk mencegah nyeri saraf berkepanjangan (Neuralgia)."
    },
    med_oat_tb: {
        title: "Obat Anti-Tuberkulosis (OAT)",
        category: "farmasi",
        icon: "Pill",
        concept: "Paket pengobatan TB (Rifampisin, Isoniazid, Pirazinamid, Etambutol) yang diberikan selama 6-9 bulan.",
        ikmContext: "Program Nasional penanggulangan TB. Pasien harus didampingi Pengawas Menelan Obat (PMO) agar tidak putus obat.",
        sknContext: "Obat gratis dari pemerintah. Putus obat menyebabkan TB Resisten (MDR-TB) yang sangat berbahaya.",
        funFact: "Obat ini bisa menyebabkan urin berwarna kemerahan (efek Rifampisin), ini normal and bukan darah.",
        gameTip: "Kepatuhan adalah segalanya. Gunakan data kunjungan rumah untuk memantau pasien yang mangkir minum obat."
    },
    med_antimalaria: {
        title: "Antimalaria (DHP & Primaquin)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat kombinasi DHP untuk membunuh parasit malaria di darah and Primaquin untuk membunuh bibitnya di hati.",
        ikmContext: "Eliminasi Malaria di Indonesia. Semua kasus malaria harus dikonfirmasi lab (RDT/Mikroskop) sebelum diobati.",
        sknContext: "Primaquin tidak boleh diberikan pada pasien dengan defisiensi G6PD karena bisa menyebabkan darah pecah.",
        funFact: "Indonesia kini menggunakan terapi kombinasi (ACT) karena parasit malaria sudah resisten terhadap Kina/Kloroquin.",
        gameTip: "Tanyakan riwayat bepergian ke daerah endemis (Papua, NTT, dsb) pada pasien demam menggigil."
    },
    med_antelmintik: {
        title: "Obat Cacing (Albendazole/Pyrantel)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat untuk mematikan cacing perut (Ascaris, Cacing Tambang, Kremi).",
        ikmContext: "Program Pemberian Obat Pencegahan Massal (POPM) Cacingan dilakukan tiap 6 bulan di sekolah/Posyandu.",
        sknContext: "Cacingan adalah penyebab utama anemia and kekurangan gizi pada anak-anak di Indonesia.",
        funFact: "Anak yang cacingan bisa kehilangan hingga 2 sendok makan darah per hari (akibat cacing tambang).",
        gameTip: "Sarankan pemberian rutin untuk seluruh anggota keluarga jika satu orang terkena infeksi cacing kremi."
    },
    med_antifungi: {
        title: "Antijamur (Ketoconazole/Griseofulvin)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat untuk mengatasi infeksi jamur kulit (Kurap, Panu) and jamur kuku.",
        ikmContext: "Sangat umum di daerah tropis lembap. Higiene diri (ganti baju, handuk sendiri) adalah pencegahan utama.",
        sknContext: "Tersedia dalam bentuk salep/krim topikal and tablet oral untuk infeksi yang luas.",
        funFact: "Penyembuhan jamur butuh waktu lama; salep harus tetap dioleskan meskipun gatal sudah hilang.",
        gameTip: "Berikan edukasi agar pasien menjemur kasur and pakaian untuk membunuh spora jamur yang tertinggal."
    },
    med_amlodipine: {
        title: "Amlodipine",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat penurun tekanan darah (Antihipertensi) golongan Calcium Channel Blocker (CCB). Tersedia dalam dosis 5mg and 10mg.",
        ikmContext: "Pilar utama pengobatan Prolanis untuk hipertensi. Membantu mencegah komplikasi stroke and gagal jantung di wilayah.",
        sknContext: "Obat rutin yang ketersediaannya harus dipastikan aman di Puskesmas untuk pasien penyakit kronis (PRB).",
        funFact: "Amlodipine bekerja dengan melemaskan otot pembuluh darah sehingga darah bisa mengalir lebih lancar.",
        gameTip: "Waspadai efek samping bengkak pada pergelangan kaki (edema) pada penggunaan jangka panjang, terutama dosis 10mg."
    },
    med_bisoprolol: {
        title: "Bisoprolol",
        category: "farmasi",
        icon: "Activity",
        concept: "Obat golongan Beta-Blocker yang menurunkan tekanan darah and denyut jantung.",
        ikmContext: "Digunakan pada hipertensi, gagal jantung (CHF), and pasca serangan jantung untuk melindungi otot jantung.",
        sknContext: "Termasuk obat PRB (Program Rujuk Balik) yang harus dilayani di FKTP setelah stabil dari Rumah Sakit.",
        funFact: "Obat ini membuat jantung bekerja lebih 'santai' and efisien sehingga tidak mudah letih.",
        gameTip: "Cek denyut nadi pasien; jangan berikan jika nadi < 60 kali per menit (bradikardia)."
    },
    med_diuretik: {
        title: "Diuretika (Furosemide/HCT)",
        category: "farmasi",
        icon: "Droplet",
        concept: "Obat yang membantu mengeluarkan kelebihan cairan and garam dari tubuh melalui urin (obat perangsang kencing).",
        ikmContext: "Sangat penting untuk pasien bengkak akibat gagal jantung (CHF) atau hipertensi yang sulit turun.",
        sknContext: "Pemantauan kadar elektrolit (Kalium) penting karena obat ini bisa memicu kaki kram atau lemas.",
        funFact: "Pasien akan sering ke toilet setelah minum obat ini, jadi sebaiknya diminum di pagi hari saja.",
        gameTip: "Gunakan Furosemide untuk sesak akibat penumpukan cairan di paru (edema paru) di unit gawat darurat."
    },
    med_statin: {
        title: "Statin (Simvastatin/Atorvastatin)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat penurun kolesterol (dislipidemia) and pencegah penyumbatan pembuluh darah.",
        ikmContext: "Pilar pencegahan primer and sekunder untuk penyakit jantung koroner and stroke stroke.",
        sknContext: "Sebaiknya diminum malam hari sebelum tidur karena pembentukan kolesterol di hati paling aktif saat malam.",
        funFact: "Selain menurunkan kolesterol, statin juga 'memperkuat' dinding pembuluh darah agar tidak mudah pecah.",
        gameTip: "Berikan pada pasien hipertensi yang memiliki risiko kardiovaskular tinggi untuk proteksi jangka panjang."
    },
    med_captopril: {
        title: "Captopril",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat antihipertensi golongan ACE Inhibitor. Tersedia dalam dosis 12.5mg, 25mg, and 50mg.",
        ikmContext: "Obat andalan di IGD untuk krisis hipertensi karena efeknya yang cepat jika diletakkan di bawah lidah (sublingual).",
        sknContext: "Masuk dalam daftar obat esensial. Efek samping yang paling sering dikeluhkan adalah batuk kering yang membandel.",
        funFact: "Obat ini dikembangkan dari penelitian tentang molekul dalam racun ular beludak Brazil.",
        gameTip: "Jika pasien mengeluh batuk terus menerus setelah minum Captopril, pertimbangkan ganti ke golongan lain."
    },
    med_antiplatelet: {
        title: "Antiplatelet (Aspirin/Clopidogrel)",
        category: "farmasi",
        icon: "Shield",
        concept: "Obat 'pengencer darah' yang mencegah penggumpalan keping darah di pembuluh darah jantung and otak.",
        ikmContext: "Sangat krusial untuk mencegah serangan jantung berulang and stroke iskemik (sumbatan).",
        sknContext: "Harus diberikan dengan hati-hati pada pasien dengan riwayat luka lambung karena bisa memicu perdarahan.",
        funFact: "Aspirin berasal dari kulit pohon willow and sudah digunakan secara tradisional sejak ribuan tahun lalu.",
        gameTip: "Wajib diberikan segera (dikunyah) pada pasien dengan kecurigaan serangan jantung akut di IGD."
    },
    med_metformin: {
        title: "Metformin",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat utama (first-line) untuk mengendalikan kadar gula darah pada penderita Diabetes Melitus Tipe 2.",
        ikmContext: "Bekerja dengan meningkatkan sensitivitas tubuh terhadap insulin; tidak menyebabkan gula drop (hipoglikemia) jika berdiri sendiri.",
        sknContext: "Salah satu obat yang paling aman and memiliki manfaat jangka panjang bagi kesehatan jantung penderita DM.",
        funFact: "Banyak digunakan sebagai obat tambahan untuk sindrom ovarium polikistik (PCOS) pada wanita.",
        gameTip: "Berikan sesudah makan untuk menghindari keluhan mual atau kembung yang sering muncul di awal pengobatan."
    },
    med_sulfonilurea: {
        title: "Sulfonilurea (Glibenclamide/Glimepiride)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat diabetes yang bekerja merangsang pankreas untuk mengeluarkan lebih banyak insulin.",
        ikmContext: "Obat yang sangat kuat menurunkan gula darah, namun memiliki risiko tinggi menyebabkan hipoglikemia.",
        sknContext: "Glimepiride (generasi baru) memiliki risiko hipoglikemia lebih rendah dibanding Glibenclamide.",
        funFact: "Obat ini harus diminum sesaat sebelum makan agar insulin naik saat gula dari makanan masuk.",
        gameTip: "Edukasi pasien: JANGAN pernah minum obat ini tanpa makan setelahnya, karena bisa berakibat pingsan."
    },
    med_insulin: {
        title: "Insulin (Injeksi)",
        category: "farmasi",
        icon: "Syringe",
        concept: "Hormon pengganti untuk menurunkan gula darah melalui suntikan subkutan (di bawah kulit).",
        ikmContext: "Wajib untuk penderita DM Tipe 1 and pasien DM Tipe 2 yang sudah tidak mempan dengan obat minum.",
        sknContext: "Tersedia dalam bentuk kerja cepat (Reguler) untuk darurat, and kerja panjang (Lantus) untuk harian.",
        funFact: "Penemuan insulin adalah salah satu tonggak sejarah medis terbesar yang mengubah DM dari penyakit mematikan jadi terkontrol.",
        gameTip: "Ajarkan pasien teknik penyuntikan mandiri di perut atau paha and cara penyimpanan insulin di kulkas."
    },
    med_antidiabetik_lain: {
        title: "Oral DM Lain (Acarbose/Gliclazide)",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat pendukung dalam terapi kombinasi diabetes melitus.",
        ikmContext: "Acarbose bekerja menghambat penyerapan gula di usus sehingga gula setelah makan tidak melonjak drastis.",
        sknContext: "Gliclazide mirip sulfonilurea namun lebih aman untuk pasien lanjut usia dengan gangguan ginjal ringan.",
        funFact: "Acarbose sering menyebabkan efek samping 'buang angin' (flatulens) karena proses fermentasi karbohidrat di usus.",
        gameTip: "Gunakan terapi kombinasi jika gula darah pasien tetap tinggi meskipun sudah mendapat metformin dosis maksimal."
    },
    med_omeprazole: {
        title: "Omeprazole",
        category: "farmasi",
        icon: "Pill",
        concept: "Obat golongan PPI (Proton Pump Inhibitor) yang menghambat produksi asam lambung langsung dari sumbernya.",
        ikmContext: "Lebih kuat dibanding Antasida. Digunakan untuk kasus gastritis berat atau luka lambung (tukak peptik).",
        sknContext: "Pemberian harus tepat indikasi. Penggunaan jangka panjang yang tidak perlu bisa mengganggu penyerapan nutrisi tertentu.",
        funFact: "Omeprazole adalah 'revolusi' dalam pengobatan penyakit lambung sejak ditemukan pada akhir tahun 1980-an.",
        gameTip: "Sangat efektif untuk pasien dengan nyeri ulu hati kronis yang tidak mempan dengan antasida biasa."
    },
    med_salbutamol: {
        title: "Salbutamol",
        category: "farmasi",
        icon: "Wind",
        concept: "Obat pelega saluran napas (Bronkodilator) untuk mengatasi sesak akibat asma atau PPOK.",
        ikmContext: "Obat darurat (Reliever) yang harus selalu ada di tas emergency setiap nakes saat bertugas di lapangan.",
        sknContext: "Tersedia dalam bentuk tablet, sirup, hingga cairan nebulizer di layanan primer.",
        funFact: "Salbutamol bekerja sangat cepat, biasanya dalam 5-15 menit setelah dihirup, jalan napas langsung melonggar.",
        gameTip: "Gunakan untuk mengatasi serangan sesak akut. Untuk jangka panjang, pasien asma membutuhkan obat 'Controller' (Steroid hirup)."
    },
    med_antasida: {
        title: "Antasida",
        category: "farmasi",
        icon: "Droplets",
        concept: "Obat untuk menetralkan asam lambung berlebih pada kasus Gastritis atau GERD. Tersedia dalam tablet kunyah and sirup.",
        ikmContext: "Obat 'obat maag' yang paling populer di masyarakat. Sering dibeli bebas (OTC) oleh warga.",
        sknContext: "Diberikan di Puskesmas untuk keluhan nyeri ulu hati, mual, and kembung.",
        funFact: "Sebaiknya dikunyah (untuk tablet) atau dikocok (untuk sirup) agar bekerja lebih efektif menetralkan asam.",
        gameTip: "Edukasi pasien untuk meminumnya 1 jam sebelum makan atau 2 jam setelah makan saat lambung kosong."
    },
    med_kortikosteroid: {
        title: "Kortikosteroid (Dexamethasone/Prednison)",
        category: "farmasi",
        icon: "ShieldPlus",
        concept: "Obat anti-radang and penekan sistem imun yang sangat kuat untuk alergi berat, asma, or radang sendi.",
        ikmContext: "Sering disebut 'obat dewa' karena bisa meredakan banyak keluhan, namun penggunaan jangka panjang tanpa pengawasan sangat berbahaya.",
        sknContext: "Bisa menyebabkan efek samping 'Moon Face' (wajah bulat) and pengeroposan tulang jika disalahgunakan.",
        funFact: "Tubuh kita secara alami memproduksi hormon serupa (Kortisol) setiap pagi hari.",
        gameTip: "Gunakan Dexamethasone Injeksi pada kasus alergi berat (Anafilaksis) atau serangan asma yang mengancam nyawa."
    },
    med_antihistamin: {
        title: "Antihistamin (Cetirizine/CTM)",
        category: "farmasi",
        icon: "Smile",
        concept: "Obat untuk meredakan gejala alergi seperti gatal-gatal, gatal hidung (rhinitis), and biduran.",
        ikmContext: "Keluhan alergi adalah salah satu alasan kunjungan terbanyak di Puskesmas. Edukasi untuk menghindari pemicu tetap yang utama.",
        sknContext: "Obat generasi lama (CTM) menyebabkan kantuk berat, sedangkan generasi baru (Cetirizine/Loratadine) lebih sedikit menyebabkan kantuk.",
        funFact: "Histamin sebenarnya adalah zat kimia tubuh yang berfungsi melawan benda asing, namun reaksinya terkadang berlebihan.",
        gameTip: "Sangat baik untuk pasien biduran (urtikaria) atau pasien batuk pilek alergi di wilayah udara dingin."
    },
    med_oralit_zinc: {
        title: "Oralit & Zinc",
        category: "farmasi",
        icon: "Droplet",
        concept: "Kombinasi standar emas (Gold Standard) penanganan diare untuk mencegah dehidrasi and mempercepat pemulihan usus.",
        ikmContext: "Kunci utama menurunkan angka kematian balita akibat diare. Kader harus bisa mengajarkan cara melarutkan oralit yang benar.",
        sknContext: "Zinc diberikan selama 10 hari berturut-turut meskipun diare sudah berhenti untuk memperkuat daya tahan usus anak.",
        funFact: "Satu sachet oralit mengandung campuran garam and gula yang seimbang untuk diserap usus dengan cepat.",
        gameTip: "Wajib diberikan pada setiap kasus diare anak. Oralit untuk saat ini, Zinc untuk perlindungan 2-3 bulan ke depan."
    },
    med_vitamin_suplemen: {
        title: "Vitamin & Suplemen (Vitamin A/Fe)",
        category: "farmasi",
        icon: "Apple",
        concept: "Zat tambahan untuk mendukung pertumbuhan and mencegah penyakit defisiensi (kekurangan zat mikro).",
        ikmContext: "Bulan Vitamin A (Februari & Agustus) adalah agenda nasional. Tablet Tambah Darah (TTD) diberikan untuk mencegah anemia pada remaja putri.",
        sknContext: "Vitamin B Complex and Vitamin C diberikan di Puskesmas untuk mendukung pemulihan setelah sakit.",
        funFact: "Vitamin A dosis tinggi (kapsul biru/merah) sangat penting untuk mencegah kebutaan and meningkatkan imunitas balita.",
        gameTip: "Pastikan stok Tablet Fe (Zat Besi) selalu cukup untuk ibu hamil guna mencegah perdarahan saat melahirkan."
    },
    med_obat_luar: {
        title: "Obat Luar (Salep/Krim/Tetes Mata)",
        category: "farmasi",
        icon: "Thermometer",
        concept: "Obat yang digunakan langsung pada lokasi target (kulit, mata, atau telinga) tanpa melalui sistem pencernaan.",
        ikmContext: "Paling efektif untuk infeksi lokal (salep antibiotik) or radang kulit (salep steroid).",
        sknContext: "Tetes mata harus dibuang 1 bulan setelah segel dibuka untuk mencegah pertumbuhan kuman di dalam botol.",
        funFact: "Salep mata bisa digunakan untuk luka kulit, tapi salep kulit tidak boleh digunakan untuk mata!",
        gameTip: "Sediakan Chloramphenicol Tetes Mata untuk kasus mata merah (Konjungtivitis) yang banyak terjadi di sekolah."
    },
    med_emergency_inj: {
        title: "Obat Injeksi Darurat (Epidrin/Lidocaine)",
        category: "farmasi",
        icon: "Zap",
        concept: "Obat-obatan gawat darurat yang diberikan melalui suntikan untuk respon cepat.",
        ikmContext: "Wajib ada di dalam Kit Emergency IGD and Ambulans. Keberadaannya sangat kritis untuk menyelamatkan nyawa.",
        sknContext: "Termasuk Epinephrine untuk gagal jantung, Lidocaine untuk henti jantung or anestesi lokal, and Diazepam untuk kejang.",
        funFact: "Epinephrine (Adrenalin) adalah hormon alami yang disekresi tubuh saat kita dalam keadaan terancam (Fight or Flight).",
        gameTip: "Berikan Lidocaine sebelum melakukan penjahitan luka (Hecting) agar pasien merasa nyaman and tidak trauma."
    },
    med_alkes_habis_pakai: {
        title: "Alkes Habis Pakai (Kasa/Spuit/Infus)",
        category: "farmasi",
        icon: "Scissors",
        concept: "Alat kesehatan sekali pakai yang mendukung tindakan medis/perawatan pasien.",
        ikmContext: "Manajemen logistik alkes yang buruk bisa menghentikan seluruh layanan unit IGD and Persalinan.",
        sknContext: "Mencakup Kasa Steril, Spuit (Jarum suntik), Abocath (Jarum infus), Plester, and Handscoon (Sarung tangan).",
        funFact: "Handscoon bedah dirancang berbeda untuk tangan kiri and kanan untuk akurasi tindakan operasi.",
        gameTip: "Selalu pantau stok Kasa and Spuit. Tanpa Alkes, tindakan medis secanggih apapun tidak bisa dilakukan."
    },
    med_psikiatri_neuro: {
        title: "Obat Psikiatri & Neurologi",
        category: "farmasi",
        icon: "Brain",
        concept: "Obat-obatan untuk gangguan kesehatan jiwa (Depresi, Psikosis) and gangguan saraf (Epilepsi).",
        ikmContext: "Kesehatan jiwa adalah prioritas yang sering terabaikan di masyarakat. Nakes berperan penting dalam deteksi dini ODGJ di wilayah.",
        sknContext: "Mencakup obat antipsikotik (Haloperidol), antidepresan (Amitriptyline), and anti-kejang rutin (Phenytoin/Carbamazepine).",
        funFact: "Banyak obat psikiatri yang membutuhkan waktu 2-4 minggu diminum secara rutin sebelum manfaatnya benar-benar terasa.",
        gameTip: "Wajib pantau kepatuhan minum obat pada pasien epilepsi or skizofrenia melalui kunjungan rumah nakes."
    }
};
