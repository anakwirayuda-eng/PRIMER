/**
 * @reflection
 * [IDENTITY]: dashboard_manajemen
 * [PURPOSE]: Static data module exporting: dashboardManajemenData — MAIA Codex wiki entries for dashboard metrics, game mechanics, and management concepts.
 * [STATE]: Stable
 * [ANCHOR]: dashboardManajemenData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

export const dashboardManajemenData = {
    energy: {
        title: "Energi Dokter (Stamina)",
        category: "manajemen",
        icon: "Activity",
        concept: "Energi merepresentasikan stamina fisik dan mental dokter Puskesmas dalam menjalani tugas harian. Setiap tindakan klinis (anamnesis, pemeriksaan fisik, tindakan) mengonsumsi energi. Energi pulih dengan istirahat di Rumah Dinas.",
        maiaInsight: "Dokter yang kelelahan memiliki risiko medical error lebih tinggi. Kelola energi Anda seperti mengelola sumber daya Puskesmas — bijak dan terukur.",
        ikmContext: "Burnout tenaga kesehatan adalah isu global. WHO memasukkan burnout sebagai fenomena okupasional di ICD-11. Di Indonesia, nakes Puskesmas sering merangkap tugas klinis, administrasi, dan program lapangan secara bersamaan.",
        sknContext: "Permenkes tentang Keselamatan Pasien menekankan bahwa faktor kelelahan petugas adalah salah satu kontributor utama Kejadian Tidak Diharapkan (KTD) di fasilitas kesehatan.",
        funFact: "Riset JAMA menunjukkan bahwa dokter yang bekerja lebih dari 24 jam tanpa tidur memiliki tingkat kesalahan setara dengan seseorang dengan kadar alkohol 0.1% — melebihi batas legal mengemudi di banyak negara.",
        gameTip: "Jangan memaksakan diri saat energi rendah. Pulihkan di Rumah Dinas sebelum menerima pasien berikutnya untuk menghindari penalti 'Groggy' yang menurunkan akurasi klinis Anda."
    },
    reputation: {
        title: "Reputasi Puskesmas",
        category: "manajemen",
        icon: "TrendingUp",
        concept: "Reputasi mencerminkan kepercayaan masyarakat terhadap kualitas pelayanan Puskesmas. Dipengaruhi oleh akurasi diagnosa, kepuasan pasien, dan keberhasilan program kesehatan masyarakat.",
        maiaInsight: "Reputasi yang tinggi meningkatkan Angka Kontak dan partisipasi masyarakat dalam program promotif-preventif.",
        ikmContext: "Dalam ilmu pemasaran sosial kesehatan, kepercayaan masyarakat (community trust) adalah fondasi dari pemanfaatan layanan kesehatan. Puskesmas dengan reputasi buruk akan ditinggalkan meskipun fasilitasnya memadai.",
        sknContext: "Indikator Nasional Mutu (INM) Puskesmas yang baik berkontribusi langsung pada penilaian status Akreditasi dan evaluasi kinerja BPJS Kesehatan.",
        funFact: "Studi di Indonesia menunjukkan bahwa 60% masyarakat lebih memilih berobat ke klinik swasta karena persepsi kualitas, meskipun Puskesmas menyediakan layanan gratis melalui JKN.",
        gameTip: "Reputasi naik dari diagnosa yang tepat, terapi yang rasional, dan edukasi pasien yang baik. Hindari over-prescribing antibiotik — ini bisa menurunkan skor mutu klinis Anda."
    },
    accuracy: {
        title: "Akurasi Klinis",
        category: "manajemen",
        icon: "Target",
        concept: "Akurasi klinis mengukur ketepatan Anda dalam melakukan anamnesis, menegakkan diagnosa, dan memberikan terapi sesuai standar Evidence-Based Medicine (EBM).",
        ikmContext: "Pengukuran akurasi klinis merupakan bagian dari Clinical Governance — tata kelola klinis yang memastikan setiap keputusan medis berbasis bukti ilmiah terkini.",
        sknContext: "Akreditasi Puskesmas mensyaratkan kepatuhan terhadap Panduan Praktik Klinis (PPK) dan Standar Prosedur Operasional (SPO) untuk setiap tindakan medis.",
        funFact: "Studi menunjukkan bahwa anamnesis yang baik dapat memberikan 80% informasi yang dibutuhkan untuk diagnosis, bahkan sebelum pemeriksaan fisik dilakukan.",
        gameTip: "Lakukan anamnesis lengkap (keluhan utama, RPS, RPD, RPK, sosial) sebelum memeriksa pasien. Semakin lengkap data, semakin tinggi confidence score MAIA."
    },
    treatment: {
        title: "Terapi Rasional",
        category: "manajemen",
        icon: "Shield",
        concept: "Terapi rasional adalah pemberian obat yang tepat indikasi, tepat dosis, tepat rute, tepat waktu, tepat pasien, dan tepat informasi — sesuai prinsip WHO.",
        maiaInsight: "Peresepan rasional bukan hanya tentang obat yang benar, tapi juga tentang menghindari obat yang tidak perlu (polypharmacy).",
        ikmContext: "Indonesia menghadapi tantangan besar dalam penggunaan obat rasional. Studi Kemenkes menunjukkan bahwa antibiotik masih sering diresepkan untuk ISPA viral tanpa indikasi.",
        sknContext: "Formularium Nasional (FORNAS) adalah acuan utama obat yang ditanggung JKN. Peresepan di luar FORNAS tanpa justifikasi klinis dapat menyebabkan klaim BPJS ditolak.",
        funFact: "Resistensi antimikroba (AMR) diperkirakan akan menyebabkan 10 juta kematian per tahun di seluruh dunia pada 2050 jika tidak ditangani sekarang.",
        gameTip: "Cek daftar obat yang direkomendasikan MAIA untuk setiap kasus. Berikan sesuai indikasi dan edukasi pasien tentang cara minum obat yang benar."
    },
    ukp_overview: {
        title: "UKP — Upaya Kesehatan Perorangan",
        category: "manajemen",
        icon: "Users",
        concept: "UKP adalah pelayanan kesehatan yang ditujukan kepada individu pasien, meliputi promotif, preventif, kuratif, dan rehabilitatif. Di Puskesmas, UKP diwujudkan melalui pelayanan poli umum, poli gigi, poli KIA/KB, dan IGD.",
        maiaInsight: "Kualitas UKP diukur dari ketepatan diagnosa, kesesuaian terapi, dan kepuasan pasien — semua terintegrasi dalam sistem CPPT.",
        ikmContext: "UKP dan UKM (Upaya Kesehatan Masyarakat) adalah dua pilar utama Puskesmas. UKP fokus pada pelayanan individu, sedangkan UKM fokus pada kesehatan komunitas.",
        sknContext: "Standar UKP tertuang dalam Bab 7, 8, dan 9 instrumen Akreditasi Puskesmas. Mencakup hak pasien, pelayanan klinis, dan peningkatan mutu berkelanjutan.",
        funFact: "Rata-rata Puskesmas di Indonesia melayani 50-100 pasien per hari, dengan waktu konsultasi rata-rata hanya 3-5 menit per pasien.",
        gameTip: "Setiap kontak pasien di poli adalah kesempatan untuk meningkatkan skor UKP Anda. Lakukan anamnesis, pemeriksaan, diagnosa, terapi, dan edukasi secara lengkap."
    },
    stress: {
        title: "Stres & Beban Kerja",
        category: "manajemen",
        icon: "AlertCircle",
        concept: "Tingkat stres kerja yang memengaruhi performa dan kesehatan mental dokter Puskesmas. Beban administratif, target program, dan kekurangan staf berkontribusi pada stres.",
        ikmContext: "WHO mendefinisikan burnout sebagai sindrom akibat stres kerja kronis yang tidak dikelola dengan baik, ditandai kelelahan, sinisme, dan penurunan efektivitas profesional.",
        sknContext: "Permenkes mengamanatkan Puskesmas untuk memperhatikan kesehatan petugas, termasuk kesehatan jiwa, sebagai bagian dari manajemen SDM.",
        funFact: "Survei IDAI menemukan bahwa 40% dokter di Indonesia mengalami burnout tingkat sedang-berat, terutama yang bertugas di daerah terpencil.",
        gameTip: "Pantau indikator stres. Staf yang terlalu lelah bekerja di bawah kapasitas optimal dan membuat lebih banyak kesalahan."
    },
    inventory: {
        title: "Manajemen Logistik & Inventaris",
        category: "manajemen",
        icon: "Package",
        concept: "Pengelolaan stok obat, alat kesehatan, dan bahan habis pakai di Puskesmas. Logistik yang baik memastikan ketersediaan obat esensial tanpa overstock yang menyebabkan pemborosan.",
        maiaInsight: "Kehabisan obat esensial di saat dibutuhkan adalah salah satu kegagalan manajemen paling kritis di fasilitas kesehatan primer.",
        ikmContext: "Supply chain management di Puskesmas menggunakan metode LPLPO (Laporan Pemakaian dan Lembar Permintaan Obat) untuk rekapitulasi kebutuhan bulanan.",
        sknContext: "Sistem e-Logistik Kemenkes memungkinkan pemantauan stok secara real-time dan perencanaan pengadaan yang lebih akurat berdasarkan pola konsumsi historis.",
        funFact: "Indonesia memiliki lebih dari 10.000 Puskesmas yang harus dipasok obat secara berkala. Di daerah terpencil, jalur distribusi bisa memakan waktu berminggu-minggu.",
        gameTip: "Cek stok obat secara berkala. Pastikan obat-obatan kritis (antibiotik, OAT, obat darurat) selalu tersedia. Kehabisan stok saat ada pasien darurat akan berdampak buruk pada reputasi."
    },
    kbk: {
        title: "KBK — Kapitasi Berbasis Kinerja",
        category: "manajemen",
        icon: "DollarSign",
        concept: "Sistem pembayaran dari BPJS Kesehatan kepada FKTP (Puskesmas) berdasarkan pencapaian indikator kinerja tertentu: Angka Kontak, Rasio Rujukan, dan Prolanis.",
        maiaInsight: "KBK adalah mekanisme insentif yang mendorong Puskesmas untuk meningkatkan kualitas pelayanan, bukan hanya kuantitas.",
        ikmContext: "Sebelum KBK, pembayaran kapitasi bersifat flat — sama rata tanpa mempertimbangkan kinerja. KBK mengubah paradigma ini menjadi 'pay-for-performance'.",
        sknContext: "Tiga indikator utama KBK: (1) Angka Kontak ≥150 per mil, (2) Rasio Rujukan Non-Spesialistik ≤5%, dan (3) Rasio Peserta Prolanis Rutin Berkunjung ≥50%.",
        funFact: "Puskesmas yang memenuhi ketiga indikator KBK mendapat 100% dana kapitasi, sedangkan yang tidak memenuhi bisa dikenakan pemotongan hingga 10%.",
        gameTip: "Tingkatkan Angka Kontak dengan proaktif mengundang warga untuk pemeriksaan rutin. Turunkan Rasio Rujukan dengan meningkatkan kompetensi klinis Anda."
    },
    angka_kontak: {
        title: "Angka Kontak",
        category: "manajemen",
        icon: "Users",
        concept: "Jumlah kontak (kunjungan) peserta JKN ke FKTP per 1.000 peserta terdaftar per bulan. Target minimal adalah 150 per mil.",
        ikmContext: "Angka Kontak yang tinggi menunjukkan bahwa masyarakat memanfaatkan layanan kesehatan primer dengan baik — indikator aksesibilitas dan penerimaan masyarakat.",
        sknContext: "Angka Kontak merupakan salah satu tiga indikator KBK yang menentukan besaran pembayaran kapitasi dari BPJS ke Puskesmas.",
        funFact: "Angka Kontak Indonesia masih jauh di bawah rata-rata negara maju. Target 150 per mil artinya dari 1.000 peserta, setidaknya 150 harus mengunjungi Puskesmas per bulan.",
        gameTip: "Dorong kunjungan melalui program promotif-preventif seperti Posyandu, Prolanis, dan skrining rutin. Setiap kontak terhitung, termasuk kunjungan rumah."
    },
    patient_safety: {
        title: "Keselamatan Pasien (Patient Safety)",
        category: "manajemen",
        icon: "Shield",
        concept: "Sistem dan prinsip untuk mencegah terjadinya Kejadian Tidak Diharapkan (KTD) dan cedera pada pasien selama proses pelayanan kesehatan.",
        maiaInsight: "Keselamatan pasien bukan tentang menyalahkan individu, tapi tentang membangun sistem yang meminimalisir peluang terjadinya kesalahan.",
        ikmContext: "WHO meluncurkan Global Patient Safety Action Plan 2021-2030 yang menekankan 'zero harm to patients'. Sasaran keselamatan pasien meliputi identifikasi, komunikasi, obat berisiko tinggi, lokasi operasi, infeksi, dan risiko jatuh.",
        sknContext: "7 Sasaran Keselamatan Pasien (SKP) wajib diterapkan di semua fasilitas kesehatan termasuk Puskesmas, dan merupakan elemen penilaian Akreditasi.",
        funFact: "Kesalahan identitas pasien terjadi lebih sering dari yang kita kira. Oleh karena itu, konfirmasi identitas pasien (nama + tanggal lahir) adalah SKP #1.",
        gameTip: "Lakukan identifikasi pasien dengan benar, resepkan obat sesuai dosis yang tepat, dan dokumentasikan setiap tindakan di CPPT untuk menjaga keselamatan pasien."
    },
    skdi_coverage: {
        title: "Cakupan SKDI",
        category: "manajemen",
        icon: "GraduationCap",
        concept: "Standar Kompetensi Dokter Indonesia (SKDI) menetapkan 144 penyakit yang wajib dikuasai dokter umum di FKTP. Cakupan SKDI mengukur seberapa banyak kondisi yang telah Anda tangani.",
        ikmContext: "SKDI disusun oleh Konsil Kedokteran Indonesia (KKI) sebagai acuan kompetensi minimal dokter layanan primer. Level kemampuan berkisar dari 1 (mengenali) hingga 4A (menangani tuntas).",
        sknContext: "144 penyakit SKDI level 4A harus mampu ditatalaksana secara tuntas di FKTP tanpa perlu rujukan ke spesialis.",
        funFact: "Dari 144 penyakit SKDI, mayoritas adalah penyakit infeksi tropis dan penyakit kronis yang umum ditemukan di layanan primer Indonesia.",
        gameTip: "Semakin banyak variasi kasus yang berhasil Anda tangani dengan benar, semakin tinggi cakupan SKDI — ini berkontribusi langsung pada skor kompetensi Anda."
    },
    rrns: {
        title: "RRNS — Rasio Rujukan Non-Spesialistik",
        category: "manajemen",
        icon: "TrendingUp",
        concept: "Persentase rujukan kasus non-spesialistik (yang seharusnya bisa ditangani di FKTP) terhadap total kunjungan. Target BPJS: ≤5%.",
        maiaInsight: "Rujukan berlebihan menunjukkan under-competence atau over-cautiousness. Keduanya merugikan pasien dan sistem.",
        ikmContext: "Rujukan non-spesialistik yang tinggi membebani Rumah Sakit dan menyebabkan antrean panjang. Ini mengindikasikan fungsi gatekeeper FKTP tidak berjalan optimal.",
        sknContext: "RRNS adalah indikator KBK kedua. Rujukan yang terlalu tinggi bisa menurunkan dana kapitasi dan mempengaruhi penilaian kredensialing BPJS.",
        funFact: "Di beberapa daerah, angka rujukan Puskesmas bisa mencapai 30-40% — jauh di atas target 5%. Ini menunjukkan gap kompetensi yang signifikan.",
        gameTip: "Tangani kasus SKDI level 4A secara mandiri. Rujuk hanya untuk kasus yang benar-benar di atas kompetensi dokter umum. MAIA akan memberikan peringatan jika Anda merujuk kasus non-spesialistik."
    },
    iks: {
        title: "IKS — Indeks Keluarga Sehat",
        category: "wilayah",
        icon: "Home",
        concept: "Indikator komposit yang mengukur derajat kesehatan keluarga berdasarkan 12 indikator utama: KB, persalinan di faskes, imunisasi, ASI eksklusif, tumbuh kembang, pengobatan TB, penanganan hipertensi, gangguan jiwa, tidak merokok, JKN, air bersih, dan jamban sehat.",
        maiaInsight: "IKS adalah cermin nyata dari keberhasilan program kesehatan masyarakat. Setiap keluarga yang naik statusnya berkontribusi pada peningkatan IKS wilayah.",
        ikmContext: "Program Indonesia Sehat dengan Pendekatan Keluarga (PIS-PK) menggunakan IKS untuk mengidentifikasi masalah kesehatan prioritas di setiap keluarga.",
        sknContext: "Data IKS dikumpulkan melalui kunjungan rumah (family profiling) dan diinput ke aplikasi Keluarga Sehat. Hasilnya digunakan untuk intervensi lanjut sesuai masalah spesifik.",
        funFact: "IKS nasional Indonesia masih berada di kisaran 0.17 (dari skala 0-1), artinya mayoritas keluarga Indonesia belum tergolong 'Keluarga Sehat'.",
        gameTip: "Lakukan kunjungan rumah secara rutin untuk mengidentifikasi dan mengatasi masalah kesehatan keluarga di wilayah kerja Anda. Ini meningkatkan IKS dan skor wilayah."
    },
    prolanis_compliance: {
        title: "Kepatuhan Prolanis",
        category: "manajemen",
        icon: "Activity",
        concept: "Prolanis (Program Pengelolaan Penyakit Kronis) BPJS Kesehatan mendorong peserta dengan penyakit kronis (DM dan Hipertensi) untuk rutin kontrol ke FKTP. Kepatuhan mengukur persentase peserta yang berkunjung sesuai jadwal.",
        maiaInsight: "Pasien Prolanis yang patuh memiliki risiko komplikasi 40% lebih rendah dibanding yang tidak patuh. Investasi di follow-up sangat bernilai.",
        ikmContext: "Penyakit kronis seperti DM dan Hipertensi adalah penyebab utama kematian prematur di Indonesia. Prolanis bertujuan mencegah komplikasi melalui kontrol rutin.",
        sknContext: "Rasio Peserta Prolanis Rutin Berkunjung (RPPB) ≥50% adalah indikator KBK ketiga. Tidak tercapai = potongan kapitasi dari BPJS.",
        funFact: "Prolanis tidak hanya tentang obat. Aktivitas Klub Prolanis meliputi senam, edukasi gizi, dan peer support yang terbukti meningkatkan kepatuhan.",
        gameTip: "Kelola daftar pasien Prolanis dengan baik. Pastikan mereka terjadwal untuk kontrol rutin dan obat PRB tersedia di gudang farmasi."
    },
    prb: {
        title: "PRB — Program Rujuk Balik",
        category: "manajemen",
        icon: "Shield",
        concept: "Program BPJS untuk mengembalikan penanganan pasien penyakit kronis stabil dari Rumah Sakit ke FKTP. Pasien yang sudah stabil tidak perlu bolak-balik ke spesialis — cukup kontrol rutin di Puskesmas.",
        ikmContext: "PRB mengurangi beban RS sekaligus memperkuat peran FKTP sebagai pusat pelayanan primer. Ini adalah inti dari sistem rujukan berjenjang.",
        sknContext: "Obat PRB disediakan di FKTP dan dijamin BPJS. Daftar obat PRB mencakup obat-obatan kronis seperti antihipertensi, antidiabetes, dan statin.",
        funFact: "Sebelum PRB, banyak pasien hipertensi harus mengantri berjam-jam di RS hanya untuk mendapat obat rutin yang sebenarnya bisa dilayani di Puskesmas terdekat.",
        gameTip: "Terima dan kelola pasien PRB dengan baik. Ini menambah Angka Kontak dan menunjukkan kompetensi FKTP Anda dalam menangani penyakit kronis."
    },
    accreditation_chapters: {
        title: "Bab Akreditasi Puskesmas",
        category: "manajemen",
        icon: "GraduationCap",
        concept: "Instrumen Akreditasi Puskesmas terdiri dari beberapa bab utama yang mencakup: Kepemimpinan & Manajemen, Penyelenggaraan UKM, dan Penyelenggaraan UKP. Setiap bab memiliki standar, kriteria, dan elemen penilaian.",
        ikmContext: "Akreditasi bukan sekadar penilaian dokumen — ini adalah transformasi budaya organisasi menuju mutu berkelanjutan (Continuous Quality Improvement).",
        sknContext: "Akreditasi Puskesmas dilakukan setiap 3 tahun oleh lembaga independen (KARS/Lembaga Akreditasi FKTP). Status: Tidak Terakreditasi, Dasar, Madya, Utama, Paripurna.",
        funFact: "Puskesmas dengan status Paripurna mendapatkan insentif finansial lebih tinggi dan menjadi role model bagi Puskesmas lain di wilayahnya.",
        gameTip: "Lengkapi semua elemen di setiap bab akreditasi. Prioritaskan bab yang skornya paling rendah untuk efisiensi peningkatan status."
    },
    dana_bok: {
        title: "Dana BOK (Bantuan Operasional Kesehatan)",
        category: "manajemen",
        icon: "DollarSign",
        concept: "Dana dari APBN yang ditransfer ke daerah untuk mendanai kegiatan operasional UKM Puskesmas: kunjungan rumah, Posyandu, penyuluhan, surveilans, dan kegiatan luar gedung lainnya.",
        maiaInsight: "BOK adalah 'bahan bakar' untuk program promotif-preventif. Tanpa BOK, kegiatan luar gedung Puskesmas praktis lumpuh.",
        ikmContext: "Dana BOK merupakan respons terhadap temuan bahwa 70% anggaran kesehatan habis untuk kuratif, sementara promotif-preventif kekurangan dana.",
        sknContext: "Penggunaan BOK diatur ketat oleh Juknis Kemenkes. Meliputi: transport petugas, konsumsi kegiatan, ATK, dan penggandaan. Tidak boleh untuk belanja modal atau honor tetap.",
        funFact: "BOK telah menjadi tulang punggung kegiatan UKM Puskesmas sejak 2010. Tanpa BOK, banyak kegiatan Posyandu dan surveillance harus dihentikan.",
        gameTip: "Manfaatkan Dana BOK untuk kegiatan UKM yang meningkatkan IKS dan cakupan program. Alokasi yang tepat meningkatkan skor manajemen dan kesehatan wilayah."
    }
};
