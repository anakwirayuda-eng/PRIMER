/**
 * @reflection
 * [IDENTITY]: wilayah
 * [PURPOSE]: Static data module exporting: wilayahData.
 * [STATE]: Experimental
 * [ANCHOR]: wilayahData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const wilayahData = {
    // --- REGIONAL & DEMOGRAPHIC INDICATORS ---
    village_id: {
        title: "Micro-Indicator: Village Level",
        category: "wilayah",
        icon: "MapPin",
        concept: "Indikator kesehatan yang diukur pada tingkat desa, mencakup cakupan imunisasi, akses air bersih, and jumlah balita stunting.",
        maiaInsight: "Masalah di satu desa bisa berbeda total dengan desa tetangganya. Pemetaan mikro (Micro-mapping) adalah rahasia sukses Puskesmas.",
        ikmContext: "Prinsip 'Locus' (Lokasi) dalam intervensi. Program seperti Desa Siaga and Kampung KB adalah ujung tombak penggerakan masyarakat.",
        sknContext: "Sesuai Standar Pelayanan Minimal (SPM) Kabupaten, setiap desa wajib memiliki laporan indikator kesehatan yang terupdate setiap bulan.",
        funFact: "Tahukah Anda? Desa dengan gotong royong yang kuat (Social Capital) biasanya memiliki angka kematian ibu yang paling rendah.",
        gameTip: "Selalu cek tab 'Wilayah' untuk melihat desa mana yang sedang 'merah' and butuh intervensi segera (Fogging, Kunjungan Rumah, dsb)."
    },
    pispk_index: {
        title: "IKS (Indeks Keluarga Sehat)",
        category: "wilayah",
        icon: "Heart",
        concept: "Nilai rata-rata kesehatan keluarga di suatu wilayah berdasarkan 12 indikator utama PIS-PK (Program Indonesia Sehat dengan Pendekatan Keluarga).",
        ikmContext: "12 Indikator PIS-PK mencakup: KB, Persalinan Faskes, Imunisasi Lengkap, ASI Eksklusif, Pertumbuhan Balita, TB, Hipertensi, ODGJ, Merokok, JKN, Air Bersih, and Jamban Sehat.",
        sknContext: "Keluarga Sehat (IKS > 0.8), Keluarga Pra-Sehat (0.5 - 0.8), Keluarga Tidak Sehat (IKS < 0.5). Target nasional adalah meningkatkan status IKS secara agregat.",
        funFact: "Petugas harus melakukan kunjungan rumah (Home Visit) ke seluruh keluarga di wilayah kerja tanpa kecuali untuk mendapatkan data ini.",
        gameTip: "Pasien dari keluarga dengan IKS rendah (Tidak Sehat) memiliki risiko kekambuhan penyakit menular yang jauh lebih tinggi."
    },
    outbreak_risk: {
        title: "Outbreak Risk (Risiko KLB)",
        category: "wilayah",
        icon: "ShieldAlert",
        concept: "Potensi terjadinya Kejadian Luar Biasah (KLB) penyakit menular seperti DBD, Campak, atau Diare di suatu area.",
        maiaInsight: "Data SKDR (Sistem Kewaspadaan Dini and Respon) menunjukkan sinyal peringatan jika ada peningkatan kasus yang tidak wajar.",
        ikmContext: "Pilar Epidemiologi: Surveilans aktif and pelacakan kontak (Contact Tracing) adalah kunci untuk 'memadamkan api' sebelum menjadi kebakaran besar.",
        sknContext: "KLB didefinisikan secara hukum jika jumlah kasus naik dua kali lipat dibanding periode sebelumnya di tahun yang sama.",
        funFact: "Istilah 'Disease Detectives' merujuk pada petugas epidemiologi yang melacak sumber infeksi pertama (Index Case) dalam suatu wabah.",
        gameTip: "Tingkatkan cakupan imunisasi and sanitasi lingkungan untuk menurunkan risiko KLB secara permanen di desa tersebut."
    },

    // --- BUILDINGS & FACILITIES ---
    building_emergency: {
        title: "Unit Gawat Darurat (UGD)",
        category: "wilayah",
        icon: "ShieldAlert",
        concept: "Garda terdepan Puskesmas untuk menangani kasus yang mengancam nyawa (Life-saving).",
        ikmContext: "Triage (Pemilahan) adalah kompetensi mutlak. Di Puskesmas, UGD berperan menstabilkan pasien sebelum dirujuk ke Rumah Sakit.",
        sknContext: "Wajib buka 24 jam untuk Puskesmas Rawat Inap, dengan peralatan standar seperti Oksigen, Emergency Kit, and Defibrillator.",
        funFact: "Triase menggunakan kode warna: Merah (Gawat Darurat), Kuning (Gawat Tidak Darurat), Hijau (Tidak Gawat Tidak Darurat), and Hitam (Meninggal).",
        gameTip: "Staf yang ditempatkan di UGD harus memiliki Knowledge and Energy stat yang tinggi agar tidak terjadi malpraktik saat kritis."
    },
    building_outpatient: {
        title: "Poli Rawat Jalan",
        category: "wilayah",
        icon: "Users",
        concept: "Area pelayanan medis primer untuk kasus-kasus umum non-darurat.",
        ikmContext: "Berdasarkan Permenkes No. 19/2024, Puskesmas standar memiliki 5 titik pelayanan klinis: Poli Umum, Poli KIA-KB, Poli Gigi, UGD, and Farmasi/Lab.",
        sknContext: "Standar waktu tunggu rawat jalan adalah salah satu indikator kepuasan pasien dalam sistem akreditasi.",
        funFact: "85% masalah kesehatan masyarakat sebenarnya bisa diselesaikan tuntas di Poli Rawat Jalan Puskesmas tanpa harus ke spesialis.",
        gameTip: "Pastikan jumlah staf di Poli mencukupi di jam-jam sibuk untuk menjaga skor 'Patient Satisfaction' tetap hijau."
    },
    building_lab: {
        title: "Laboratorium Sederhana",
        category: "wilayah",
        icon: "FlaskConical",
        concept: "Unit penunjang untuk membantu penegakan diagnosis melalui pemeriksaan spesimen (darah, urin, dahak).",
        ikmContext: "Point of Care Testing (POCT) mempercepat keputusan klinis. Sangat penting untuk pelacakan penyakit seperti TB (via TCM/BTA).",
        sknContext: "Puskesmas minimal wajib mampu memeriksa Hb, Gula Darah, Protein Urin, and Golongan Darah.",
        funFact: "Mikroskop adalah alat yang paling 'ikonik' di lab Puskesmas untuk mencari bakteri TB yang berwarna merah saat dicat (BTA).",
        gameTip: "Gunakan pemeriksaan Lab jika Anda ragu antara diagnosis virus atau bakteri; ini menghemat penggunaan antibiotik."
    },
    building_pharmacy: {
        title: "Instalasi Farmasi (Apotek)",
        category: "wilayah",
        icon: "Pill",
        concept: "Unit pengelola obat-obatan and alat kesehatan, serta tempat pemberian edukasi penggunaan obat kepada pasien.",
        ikmContext: "Manajemen Logistik (LPLPO) memastikan obat selalu tersedia and tidak kedaluwarsa (First-In First-Out).",
        sknContext: "Pelayanan Kefarmasian mencakup skrining resep, penyiapan obat, and konseling (PIO - Pelayanan Informasi Obat).",
        funFact: "Apoteker Puskesmas sering juga melakukan 'Home Pharmacy Care' untuk memastikan pasien lansia minum obat dengan benar di rumah.",
        gameTip: "Selalu cek stok obat di farmasi; stok kosong (Out of Stock) akan menyebabkan pasien tidak sembuh and rating Anda turun drastis."
    },

    // --- STAFF ROLES ---
    staff_physician: {
        title: "Dokter Umum",
        category: "wilayah",
        icon: "UserCheck",
        concept: "Clinical Leader yang bertanggung jawab atas diagnosis, pengobatan, and kepemimpinan tim medis.",
        ikmContext: "Dokter di Puskesmas harus berjiwa 'Social Physician' yang memandang pasien bukan sekadar fisik, tapi juga lingkungan sosialnya.",
        sknContext: "Memiliki kewenangan klinis sesuai standar kompetensi Dokter Indonesia (SKDI) level 4A untuk layanan primer.",
        funFact: "Seorang dokter Puskesmas terkadang harus merangkap jadi manajer, ahli gizi, bahkan motivator saat ke lapangan.",
        gameTip: "Tingkatkan level Dokter untuk membuka akses ke prosedur medis yang lebih kompleks and akurat."
    },
    staff_nurse: {
        title: "Perawat",
        category: "wilayah",
        icon: "Activity",
        concept: "Garda terdepan asuhan keperawatan, asisten prosedur medis, and pengelola program kesehatan di lapangan.",
        ikmContext: "Perawat komunitas berperan besar dalam 'PHN' (Public Health Nursing) — merawat keluarga sakit di rumah mereka langsung.",
        sknContext: "Memiliki SIKP (Surat Izin Kerja Perawat) and mampu melakukan tindakan mandiri keperawatan sesuai SOP.",
        funFact: "Tahukah Anda? Jumlah perawat adalah yang terbanyak di Puskesmas and mereka adalah 'tulang punggung' operasional.",
        gameTip: "Tempatkan perawat di UGD and Poli; pastikan Energy mereka tidak low karena mereka yang paling banyak berinteraksi dengan pasien."
    },
    staff_midwife: {
        title: "Bidan",
        category: "wilayah",
        icon: "Heart",
        concept: "Ahli kesehatan ibu and anak (KIA), persalinan, KB, serta pendamping utama kesehatan reproduksi wanita.",
        ikmContext: "Bidan desa adalah kunci penurunan Angka Kematian Ibu (AKI). Mereka tinggal di desa untuk respon cepat 24 jam.",
        sknContext: "Bidan memiliki wewenang memberikan imunisasi, pemasangan KB, and penanganan persalinan normal (fisiologis).",
        funFact: "Evolusi bidan dari 'Dukun Beranak' menjadi tenaga medis profesional adalah sejarah besar kesehatan masyarakat Indonesia.",
        gameTip: "Selalu bawa bidan saat melakukan intervensi Posyandu untuk meningkatkan skor 'KIA Coverage' di desa tersebut."
    },
    staff_sanitarian: {
        title: "Sanitarian (Kesling)",
        category: "wilayah",
        icon: "Wind",
        concept: "Tenaga ahli kesehatan lingkungan yang bertugas memeriksa kualitas air, jamban, limbah, and sarana sanitasi umum.",
        ikmContext: "Prinsip 'Environmental Health'. Pencegahan penyakit berbasis lingkungan seperti Diare and DBD dimulai dari tangan Sanitarian.",
        sknContext: "Melakukan Inspeksi Kesehatan Lingkungan (IKL) ke tempat-tempat umum seperti sekolah, pasar, and rumah warga.",
        funFact: "Pekerjaan sanitarian lebih banyak di luar kantor (outdoor) — mencari sumber kontaminasi kuman di selokan or sumur warga.",
        gameTip: "Jika di suatu desa sering terjadi outbreak Diare, kirim Sanitarian untuk mencari sumber air yang tercemar (Contaminated Well)."
    },

    // --- CLINICAL SERVICES (POLI) — Permenkes No. 19/2024 ---
    poli_standard: {
        title: "Standar Poli Puskesmas (Permenkes No. 19/2024)",
        category: "wilayah",
        icon: "Building",
        concept: "Puskesmas wajib memiliki 4-6 titik pelayanan klinis terstandar: Poli Umum (termasuk Prolanis), Poli KIA-KB (gabungan), Poli Gigi, UGD, Farmasi & Lab.",
        maiaInsight: "Jangan buat terlalu banyak poli terpisah! Di dunia nyata, Puskesmas efisien karena satu poli menangani banyak program. KIA + KB + Imunisasi cukup satu ruangan.",
        ikmContext: "Konsolidasi poli meningkatkan efisiensi ruangan and tenaga. Prinsip 'One-Stop Service' mengurangi waktu tunggu pasien and meningkatkan cakupan program.",
        sknContext: "Permenkes No. 19 Tahun 2024 tentang Standar Puskesmas mengatur jumlah minimal ruangan, tenaga, and peralatan untuk setiap jenis pelayanan.",
        funFact: "85% masalah kesehatan masyarakat bisa diselesaikan tuntas di Puskesmas tanpa perlu rujukan ke spesialis — itulah kekuatan Layanan Primer.",
        gameTip: "Fokus upgrade Poli Umum dulu (kapasitas pasien), lalu KIA-KB (cakupan ibu-anak), kemudian Gigi (dental coverage). Ini urutan real-world priority."
    },
    poli_umum_wiki: {
        title: "Poli Umum & Prolanis",
        category: "wilayah",
        icon: "Stethoscope",
        concept: "Pusat pelayanan medis primer. Menangani semua keluhan umum, penyakit menular/tidak menular, plus program Prolanis (DM & Hipertensi) sebagai sub-layanan.",
        maiaInsight: "Prolanis BUKAN poli terpisah — itu program bulanan yang dilaksanakan oleh dokter umum di Poli Umum. Senam Prolanis, edukasi, and kontrol parameter dilakukan bersamaan.",
        ikmContext: "Prolanis (Program Pengelolaan Penyakit Kronis) oleh BPJS mencakup: konsultasi medis, edukasi, senam, home visit, and pemantauan parameter HbA1c/TD.",
        sknContext: "Poli Umum wajib mampu menangani 155 diagnosis SKDI level 4A. Waktu konsultasi standar 15-30 menit per pasien.",
        funFact: "Di Puskesmas sibuk, satu dokter bisa melayani 40-60 pasien per hari! Itulah pentingnya sistem triage and delegasi ke perawat.",
        gameTip: "Gunakan tab Prolanis di Poli Umum untuk kontrol bulanan pasien DM/HT. Parameter terkontrol = XP bonus + reputasi naik."
    },
    poli_kia_kb_wiki: {
        title: "Poli KIA-KB (Kesehatan Ibu Anak & Keluarga Berencana)",
        category: "wilayah",
        icon: "Baby",
        concept: "Pelayanan terpadu untuk ibu hamil (ANC K1-K4), persalinan, nifas, kesehatan anak, imunisasi dasar, tumbuh kembang, and konseling KB.",
        maiaInsight: "ANC K4 (4x kunjungan antenatal) adalah indikator kunci. Ibu yang tidak K4 lengkap memiliki risiko komplikasi 3x lebih tinggi.",
        ikmContext: "Program KIA mencakup: ANC Terpadu, USG screening, MTBS (Manajemen Terpadu Balita Sakit), Imunisasi Dasar Lengkap, and KB Pasca Persalinan.",
        sknContext: "Permenkes mengamanatkan setiap Puskesmas memiliki minimal 1 bidan terlatih untuk pelayanan KIA-KB. USG Point-of-Care semakin menjadi standar.",
        funFact: "Indonesia berhasil menurunkan AKI (Angka Kematian Ibu) dari 390/100.000 (1991) ke 189/100.000 (2023) — salah satu pencapaian terbesar kesehatan masyarakat.",
        gameTip: "Tracking kehamilan K1 sampai K4. Random events seperti pre-eklampsia bisa terjadi — deteksi risiko tinggi dan rujuk tepat waktu untuk XP bonus!"
    },
    poli_gigi_wiki: {
        title: "Poli Gigi & Mulut",
        category: "wilayah",
        icon: "Smile",
        concept: "Pelayanan kesehatan gigi: pemeriksaan, penambalan, pencabutan, scaling, and UKGS (Usaha Kesehatan Gigi Sekolah) untuk anak-anak.",
        maiaInsight: "DMFT Index (Decayed-Missing-Filled Teeth) adalah indikator populasi. Indonesia rata-rata DMFT = 4.85 — artinya hampir 5 gigi bermasalah per orang!",
        ikmContext: "UKGS (Usaha Kesehatan Gigi Sekolah) adalah program preventif terbaik: screening massal, edukasi sikat gigi, and aplikasi fluor.",
        sknContext: "Poli Gigi membutuhkan Dokter Gigi and Dental Unit yang memenuhi standar. Tindakan ART (Atraumatic Restorative Treatment) bisa dilakukan tanpa bor.",
        funFact: "Teknik ART (tambal tanpa bor) dikembangkan khusus untuk Puskesmas di area terpencil yang tidak punya listrik stabil untuk dental unit!",
        gameTip: "Hire dokter gigi untuk unlock poli ini. UKGS event di sekolah memberi cakupan luas and DMFT score populasi membaik = XP bonus."
    },
    farmasi_lab_wiki: {
        title: "Farmasi & Laboratorium",
        category: "wilayah",
        icon: "Pill",
        concept: "Unit pengelolaan obat (dispensing, stok, LPLPO) and laboratorium klinik (pemeriksaan darah, urin, dahak) untuk menunjang diagnosis.",
        maiaInsight: "Medication Error adalah silent killer di Puskesmas — dosis salah, interaksi obat, or resep tanpa indikasi. Dispensing yang cermat menyelamatkan nyawa.",
        ikmContext: "Rational Drug Use (Penggunaan Obat Rasional) adalah prinsip: tepat indikasi, tepat obat, tepat dosis, tepat cara pemberian, tepat lama pemberian.",
        sknContext: "Puskesmas wajib mampu memeriksa minimal: Darah Lengkap (Hb, Leukosit), GDS, Protein Urin, Golongan Darah, BTA (dahak TB), and Rapid Test.",
        funFact: "Sistem FIFO (First In First Out) mencegah obat kedaluwarsa. Satu obat expired bisa menyebabkan seluruh batch ditarik — kerugian jutaan rupiah!",
        gameTip: "Kelola stok obat dengan cermat. Stockout = pasien tidak bisa diobati. Expired = buang uang. Dispensing cepat and akurat = XP bonus + patient satisfaction."
    }
};
