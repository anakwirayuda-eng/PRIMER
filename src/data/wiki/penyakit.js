/**
 * @reflection
 * [IDENTITY]: penyakit
 * [PURPOSE]: Static data module exporting: penyakitData.
 * [STATE]: Experimental
 * [ANCHOR]: penyakitData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const penyakitData = {
    // === SISTEM PERNAPASAN ===
    urti_uncomplicated: {
        title: "ISPA (Infeksi Saluran Pernapasan Akut)",
        category: "klinis",
        icon: "Thermometer",
        concept: "Infeksi virus pada hidung and tenggorokan yang menyebabkan batuk, pilek, and demam. Biasanya sembuh sendiri.",
        maiaInsight: "Hati-hati: Diagnosis ISPA sering disalahgunakan untuk menutupi ketidakpastian. Jika ada sesak, langsung curigai Pneumonia.",
        ikmContext: "Penyakit nomor 1 di hampir seluruh Puskesmas di Indonesia. Terkait erat dengan polusi udara and asap rokok.",
        sknContext: "Standar kompetensi Dokter Indonesia level 4A.",
        funFact: "Tahukah Anda? Istilah 'Batuk Pilek Biasa' disebabkan oleh lebih dari 200 jenis virus.",
        gameTip: "Gunakan obat simtomatis and jangan memberikan antibiotik jika sekret hidung masih bening."
    },
    pneumonia_child: {
        title: "Pneumonia pada Balita",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Infeksi akut pada jaringan paru yang menyebabkan kantong udara meradang, ditandai dengan napas cepat.",
        maiaInsight: "Cek 'Tarikan Dinding Dada'. Ini adalah tanda bahaya merah yang menandakan oksigen sudah sangat rendah.",
        ikmContext: "Penyebab kematian balita terbesar di dunia. Program MTBS sangat krusial.",
        sknContext: "Kompetensi 4A. Penanganan awal dengan antibiotik dosis pertama and rujukan segera.",
        funFact: "Napas cepat dihitung 1 menit penuh saat anak tenang: >50x (2-12 bln), >40x (1-5 thn).",
        gameTip: "Oksigen and antibiotik injeksi adalah life-saver. Jangan tunda rujukan jika SpO2 < 92%."
    },
    tuberculosis_lung: {
        title: "Tuberkulosis (TBC) Paru",
        category: "klinis",
        icon: "Activity",
        concept: "Penyakit menular akibat kuman Mycobacterium tuberculosis, ditandai batuk >2 minggu, keringat malam, BB turun.",
        maiaInsight: "TBC bukan penyakit keturunan! Ini murni infeksi. Edukasi etika batuk sangat penting.",
        ikmContext: "Indonesia adalah negara dengan beban TBC tertinggi ke-2 di dunia. Strategi DOTS adalah wajib.",
        sknContext: "Kompetensi 4A. Penegakan diagnosis dengan TCM and pengobatan gratis 6 bulan di Puskesmas.",
        funFact: "Kuman TBC bisa melayang di udara and bertahan berjam-jam di ruangan gelap, tapi mati oleh sinar matahari.",
        gameTip: "Pastikan kepatuhan minum obat; jika 'putus obat', risiko menjadi TB-MDR sangat tinggi."
    },
    asthma_attack: {
        title: "Serangan Asma Akut",
        category: "klinis",
        icon: "Wind",
        concept: "Penyempitan saluran napas mendadak akibat reaksi alergi/iritasi, menyebabkan sesak and mengi.",
        maiaInsight: "Dengarkan napasnya: Bunyi 'ngik-ngik' saat buang napas adalah tanda khas.",
        ikmContext: "Penyakit tidak menular kronis. Kualitas hidup bergantung pada kontrol lingkungan.",
        sknContext: "Kompetensi 4A. Penanganan dengan oksigen and nebulizer untuk melebarkan jalan napas.",
        funFact: "Asma seringkali memburuk di malam atau dini hari karena suhu dingin and perubahan hormon.",
        gameTip: "Nebulizer rutin and identifikasi pemicu alergi efektif menurunkan kunjungan UGD."
    },
    pharyngitis_acute: {
        title: "Faringitis Akut (Radang Tenggorokan)",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Peradangan pada dinding tenggorokan yang menyebabkan nyeri telan and demam.",
        maiaInsight: "Lihat amandelnya: Jika ada bercak putih (eksudat), kemungkinan besar bakteri.",
        ikmContext: "Sering terjadi karena hygiene tangan buruk. Edukasi istirahat and hidrasi.",
        sknContext: "Kompetensi 4A. Penanganan sesuai penyebab: Antibiotik hanya jika diduga infeksi bakteri.",
        funFact: "Minum air hangat dengan garam atau madu dapat membantu meredakan nyeri secara alami.",
        gameTip: "Seringkali menyertai flu biasa; jangan terburu-buru merujuk kecuali ada tanda kesulitan bernapas."
    },

    // === SISTEM KARDIOVASKULAR & METABOLIK ===
    hypertension: {
        title: "Hipertensi (Tekanan Darah Tinggi)",
        category: "klinis",
        icon: "Activity",
        concept: "Tekanan darah > 140/90 mmHg yang menetap, sering disebut 'The Silent Killer'.",
        maiaInsight: "Pasien sering berhenti minum obat karena merasa sehat. Obat hipertensi adalah untuk MENCEGAH stroke.",
        ikmContext: "Penyakit degeneratif utama. Program POSBINDU PTM sangat penting untuk skrining dini.",
        sknContext: "Kompetensi 4A. Pengelolaan jangka panjang dengan modifikasi gaya hidup (diet DASH).",
        funFact: "90% hipertensi tidak diketahui penyebab pastinya (Esensial), terkait gaya hidup and genetik.",
        gameTip: "Tingkatkan stat 'Public Health' dengan kegiatan senam lansia and edukasi diet di wilayah."
    },
    diabetes_type2: {
        title: "Diabetes Melitus Tipe 2",
        category: "klinis",
        icon: "Droplet",
        concept: "Gangguan metabolisme dimana kadar gula darah tinggi karena resistensi insulin.",
        maiaInsight: "Waspadai tanda 3P: Polidipsi, Polifagi, and Poliuri, disertai berat badan turun.",
        ikmContext: "Epidemi global PTM. Komplikasi bisa menyebabkan kebutaan, cuci darah, hingga amputasi.",
        sknContext: "Kompetensi 4A. Pengobatan melibatkan diet ketat kalori, olahraga, and kepatuhan obat.",
        funFact: "Sekitar 1 dari 10 orang dewasa di dunia menderita diabetes, and banyak yang tidak menyadarinya.",
        gameTip: "Gula darah tak terkontrol meningkatkan risiko infeksi berat (Sepsis) pada luka kecil di kaki."
    },
    heart_failure_acute: {
        title: "Gagal Jantung Akut",
        category: "klinis",
        icon: "Heart",
        concept: "Kondisi darurat dimana jantung tidak mampu memompa darah adekuat, menyebabkan edema paru.",
        maiaInsight: "Dengar bunyi 'Ronkhi Basah'. Pasien biasanya tidak bisa tidur terlentang (Orthopnea).",
        ikmContext: "Tahap lanjut dari hipertensi/PJK tak terobati. Beban biaya kesehatan tinggi.",
        sknContext: "Kompetensi 3B. Penanganan awal: Oksigen, posisi duduk, and diuretik sebelum dirujuk.",
        funFact: "Bengkak pada kedua pergelangan kaki (Pitting Oedema) adalah tanda klasik gagal jantung kronis.",
        gameTip: "Segera rujuk ke RS karena membutuhkan pemantauan ketat and obat-obatan intravena."
    },
    dyslipidemia: {
        title: "Dislipidemia (Kolesterol Tinggi)",
        category: "klinis",
        icon: "Activity",
        concept: "Ketidakseimbangan kadar lemak darah (LDL tinggi, HDL rendah, atau Trigliserida tinggi).",
        maiaInsight: "Fokus pada 'Risiko Kardiovaskular Global' (risiko serangan jantung 10 tahun ke depan).",
        ikmContext: "Faktor risiko utama Jantung Koroner and Stroke. Edukasi pola makan and olahraga adalah kunci.",
        sknContext: "Kompetensi 4A. Pengobatan Statin diindikasikan berdasarkan profil risiko pasien.",
        funFact: "LDL disebut Kolesterol 'Jahat' (menimbun lemak), HDL adalah 'Penyelamat' (mengangkut ke hati).",
        gameTip: "Tanyakan riwayat keluarga yang meninggal mendadak di usia muda atau benjolan lemak (xanthoma)."
    },
    hyperuricemia: {
        title: "Hiperurisemia (Asam Urat)",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Tingginya asam urat darah, yang bisa menyebabkan nyeri sendi hebat (Gout Arthritis).",
        maiaInsight: "Bedakan: Gout biasanya menyerang SATU sendi mendadak (sering jempol kaki), merah, and nyeri.",
        ikmContext: "Banyak salah kaprah; seringnya nyeri sendi adalah osteoartritis atau nyeri otot.",
        sknContext: "Kompetensi 4A. Saat nyeri akut, JANGAN beri Allopurinol; berikan antinyeri terlebih dahulu.",
        funFact: "Asam urat adalah sisa metabolisme Purin (terdapat pada emping, jeroan, kacang-kacangan).",
        gameTip: "Edukasi pasien untuk banyak minum air putih guna membantu ginjal membuang asam urat."
    },
    obesity: {
        title: "Obesitas",
        category: "klinis",
        icon: "User",
        concept: "Penumpukan lemak berlebih (IMT >= 25) yang berisiko mengganggu kesehatan.",
        maiaInsight: "Obesitas adalah 'Penyakit Ibu' bagi diabetes, hipertensi, and sakit jantung.",
        ikmContext: "Program 'CERDIK' (Cek kesehatan, Enyahkan rokok, Rajin fisik, Diet, Istirahat, Kelola stres).",
        sknContext: "Kompetensi 4A. Konseling perubahan perilaku and manajemen berat badan berkelanjutan.",
        funFact: "Lingkar perut lebih berbahaya: target ideal <90 cm (pria) and <80 cm (wanita Asia).",
        gameTip: "Bantu pasien menetapkan target penurunan berat badan realistis (0.5-1 kg/minggu)."
    },

    // === SISTEM PENCERNAAN ===
    gerd_gastritis: {
        title: "Gastritis & GERD (Sakit Maag)",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Peradangan lambung atau naiknya asam lambung ke kerongkongan, menyebabkan perih ulu hati.",
        maiaInsight: "Nyeri lambung dipicu makanan, terasa panas (heartburn), and membaik dengan antasida.",
        ikmContext: "Terkait pola makan tak teratur, stres, and konsumsi kopi/pedas berlebih.",
        sknContext: "Kompetensi 4A. Penanganan dengan modifikasi pola makan and obat penurun asam (Antasida, PPI).",
        funFact: "GERD bisa menyebabkan rasa pahit di mulut and batuk kronis di malam hari.",
        gameTip: "Tanyakan apakah pasien sering tidur segera setelah makan; ini adalah pemicu utama GERD."
    },
    diarrhea_acute: {
        title: "Diare Akut & Kolera",
        category: "klinis",
        icon: "Droplets",
        concept: "BAB cair >3x sehari. Bahaya utamanya adalah DEHIDRASI yang bisa mematikan.",
        maiaInsight: "Cek 'Turgor' (elastisitas kulit). Jika kembali sangat lambat, itu tanda dehidrasi berat.",
        ikmContext: "Terkait akses Air Bersih and Sanitasi. Program STBM adalah kuncinya.",
        sknContext: "Kompetensi 4A. Prinsip: LINTAS DIARE (Oralit, Zinc, ASI, Antibiotik selektif, Edukasi).",
        funFact: "Oralit telah menyelamatkan jutaan nyawa anak di seluruh dunia dari dehidrasi lethal.",
        gameTip: "Jangan hentikan diare dengan Loperamid pada anak; fokuslah pada rehidrasi cairan."
    },
    typhoid_fever: {
        title: "Demam Tifoid (Tifus)",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Infeksi sistemik Salmonella typhi dari makanan tercemar, ditandai demam tinggi berpola.",
        maiaInsight: "Cek 'Lidah Kotor' (Coat tongue): Putih di tengah dengan pinggiran merah.",
        ikmContext: "Penyakit 'Food-borne'. Edukasi Cuci Tangan Pakai Sabun (CTPS) and higiene penjaja makanan.",
        sknContext: "Kompetensi 4A. Treatment utama adalah antibiotik and istirahat total (Bed-rest).",
        funFact: "Salmonella typhi hanya menyerang manusia. Beberapa orang bisa jadi pembawa kuman sehat.",
        gameTip: "Diet lunak rendah serat penting untuk mencegah komplikasi perdarahan/kebocoran usus."
    },

    // === SISTEM INDRA (MATA & TELINGA) ===
    otitis_media: {
        title: "Otitis Media Akut (Congek)",
        category: "klinis",
        icon: "Volume2",
        concept: "Infeksi bakteri pada telinga tengah, biasanya menyusul batuk pilek, ditandai nyeri hebat.",
        maiaInsight: "Anak menangis memegang telinga? Cek otoskop. Jika gendang telinga menonjol, itu infeksi.",
        ikmContext: "Dapat menyebabkan gangguan pendengaran permanen jika tidak tuntas diobati.",
        sknContext: "Kompetensi 4A. Penanganan dengan antibiotik and obat tetes telinga jika sudah perforasi.",
        funFact: "Telinga tengah terhubung ke tenggorokan lewat saluran Eustachius.",
        gameTip: "Edukasi orang tua untuk TIDAK membersihkan telinga anak dengan cotton bud saat infeksi."
    },
    conjunctivitis_acute: {
        title: "Konjungtivitis (Mata Merah)",
        category: "klinis",
        icon: "Eye",
        concept: "Peradangan selaput mata akibat virus/bakteri. Khas: Mata merah, gatal, and 'belek'.",
        maiaInsight: "Sekret kental/kuning = bakteri. Cair/bening + gatal hebat = virus/alergi.",
        ikmContext: "Sangat mudah menular di sekolah/asrama. Edukasi cuci tangan and jangan berbagi handuk.",
        sknContext: "Kompetensi 4A. Penanganan dengan tetes mata antibiotik or antihistamin.",
        funFact: "Mitos 'menular hanya dengan bertatapan' adalah salah; penularan lewat kontak cairan mata.",
        gameTip: "Ingatkan pasien untuk tidak mengucek mata agar tidak terjadi infeksi sekunder."
    },

    // === SISTEM GINJAL & SALURAN KEMIH ===
    lower_uti: {
        title: "Infeksi Saluran Kemih (ISK) Bawah",
        category: "klinis",
        icon: "Droplets",
        concept: "Infeksi bakteri kandung kemih, ditandai nyeri saat berkemih and anyang-anyangan.",
        maiaInsight: "ISK bawah biasanya tanpa demam tinggi atau nyeri ketok pinggang (bedakan dengan ISK atas).",
        ikmContext: "Sangat sering pada wanita. Edukasi cara basuh dari depan ke belakang.",
        sknContext: "Kompetensi 4A. Penanganan dengan antibiotik oral and banyak minum air putih.",
        funFact: "Air putih tetap merupakan cara terbaik untuk 'membilas' bakteri keluar.",
        gameTip: "Wajib cek Urinalisa (Leukosit/Nitrit) untuk konfirmasi diagnosis di layanan primer."
    },
    gonorrhea: {
        title: "Gonore (Kencing Nanah)",
        category: "klinis",
        icon: "AlertCircle",
        concept: "IMS akibat bakteri N. gonorrhoeae, ditandai keluarnya nanah dari uretra.",
        maiaInsight: "Obati pasangannya juga agar tidak terjadi fenomena 'Ping-pong' infeksi.",
        ikmContext: "Pendekatan non-judgmental sangat penting agar pasien mau berobat tuntas.",
        sknContext: "Kompetensi 4A. Penanganan dengan antibiotik injeksi atau oral sesuai pedoman.",
        funFact: "Bakteri penyebab gonore cepat mati jika berada di luar tubuh manusia.",
        gameTip: "Selalu skrining IMS lainnya (Sifilis/HIV) pada pasien dengan Gonore."
    },

    // === NUTRISI & METABOLIK ===
    malnutrition_energy_protein: {
        title: "Malnutrisi Energi Protein (MEP)",
        category: "klinis",
        icon: "UserX",
        concept: "Kekurangan gizi kronis, mencakup kondisi Marasmus and Kwashiorkor.",
        maiaInsight: "Cek tanda 'Baggy Pants' atau perut buncit dengan rambut jagung.",
        ikmContext: "Isu krusial 'Stunting'. Penanganan lewat PMT pemulihan and edukasi pola asuh.",
        sknContext: "Kompetensi 4A. Tata laksana mengikuti 10 langkah penanganan gizi buruk.",
        funFact: "Kwashiorkor berarti 'penyakit saat adik lahir' (penghentian ASI terlalu dini).",
        gameTip: "Fokus stabilisasi: Cegah hipoglikemia, hipotermia, and dehidrasi pada fase awal."
    },
    vitamin_deficiency: {
        title: "Defisiensi Vitamin",
        category: "klinis",
        icon: "Package",
        concept: "Kekurangan vitamin esensial yang mengganggu fungsi organ tubuh.",
        maiaInsight: "Defisiensi Vit A (buta senja); Vit C (sariawan); Vit B12 (kesemutan).",
        ikmContext: "Program 'Bulan Kapsul Vitamin A' untuk mencegah kebutaan balita.",
        sknContext: "Kompetensi 4A. Penanganan dengan suplementasi and perbaikan keragaman makanan.",
        funFact: "Defisiensi Vit C (Scurvy) dulunya adalah pembunuh utama para pelaut.",
        gameTip: "Jangan memberikan multivitamin 'dewa' untuk semua pasien tanpa indikasi jelas."
    },
    mineral_deficiency: {
        title: "Defisiensi Mineral",
        category: "klinis",
        icon: "Package",
        concept: "Kekurangan mineral seperti Zat Besi (Anemia), Yodium (Gondok), atau Zink.",
        maiaInsight: "Defisiensi Yodium dapat menyebabkan penurunan IQ permanen di daerah pegunungan.",
        ikmContext: "Kebijakan fortifikasi Yodium pada garam untuk mencegah GAKY.",
        sknContext: "Kompetensi 4A. Identifikasi and pengobatan serta penguatan ketahanan pangan.",
        funFact: "Mineral hanya 4% berat badan, tapi perannya mutlak untuk saraf and tulang.",
        gameTip: "Waspadai kram otot atau gangguan irama jantung pada pasien diare sebagai tanda defisiensi mineral."
    },

    // === INFEKSI & HEMATOLOGI ===
    hiv_uncomplicated: {
        title: "HIV Tanpa Komplikasi",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Infeksi virus HIV stadium awal tanpa infeksi oportunistik berat.",
        maiaInsight: "Pendekatan VCT (Voluntary Counseling) harus dengan empati and privasi mutlak.",
        ikmContext: "Program 'Triple Elimination' (HIV, Sifilis, Hep B) pada ibu hamil.",
        sknContext: "Kompetensi 4A. FKTP berperan dalam skrining and pemberian ARV.",
        funFact: "Jika virus tak terdeteksi (undetectable), maka tidak akan menular (untransmittable).",
        gameTip: "Edukasi kepatuhan minum obat seumur hidup untuk menjaga kualitas hidup."
    },
    anemia_deficiency: {
        title: "Anemia Defisiensi Besi",
        category: "klinis",
        icon: "Droplet",
        concept: "Kurang sel darah merah akibat kurang asupan zat besi untuk hemoglobin.",
        maiaInsight: "Gejala 5L: Lemah, Letih, Lesu, Lelah, Lalai. Cek konjungtiva mata pucat.",
        ikmContext: "Sering pada remaja putri. Program Tablet Tambah Darah (TTD) di sekolah.",
        sknContext: "Kompetensi 4A. Penanganan dengan suplementasi besi oral and protein hewani.",
        funFact: "Zat besi hewani diserap jauh lebih efisien daripada zat besi dari sayuran.",
        gameTip: "Cek riwayat perdarahan kronis (wasir/menstruasi berlebih) sebagai penyebab."
    },
    lymphadenitis: {
        title: "Limfadenitis (Radang Kelenjar Getah Bening)",
        category: "klinis",
        icon: "Activity",
        concept: "Peradangan kelenjar getah bening akibat infeksi area sekitarnya.",
        maiaInsight: "Cari sumber infeksinya! Jika leher bengkak, cek sakit tenggorokan/gigi.",
        ikmContext: "Waspadai Limfadenitis TB jika tidak nyeri, kenyal, and menetap >2 minggu.",
        sknContext: "Kompetensi 4A. Penanganan awal dengan antibiotik and kompres hangat.",
        funFact: "Kelenjar getah bening adalah 'markas tentara' sistem imun kita.",
        gameTip: "Limfadenitis infeksi biasanya nyeri and mobile (bisa digerakkan)."
    },
    dengue_df: {
        title: "Demam Dengue / DBD",
        category: "klinis",
        icon: "Bug",
        concept: "Penyakit virus via nyamuk Aedes. Fase kritis saat demam mulai turun.",
        maiaInsight: "Hati-hati hari ke-4 sampai ke-6, itu saat risiko kebocoran plasma tertinggi.",
        ikmContext: "Program 3M Plus and Gerakan 1 Rumah 1 Jumantik adalah kunci.",
        sknContext: "Kompetensi 4A. Monitoring ketat Hematokrit/Trombosit and rehidrasi cairan.",
        funFact: "Hanya nyamuk betina yang menggigit manusia karena butuh protein untuk telur.",
        gameTip: "Pantau tanda bahaya: Nyeri perut hebat, muntah terus, atau perdarahan gusi."
    },
    malaria_vivax: {
        title: "Malaria",
        category: "klinis",
        icon: "Thermometer",
        concept: "Infeksi parasit via nyamuk Anopheles. Gejala: Demam berkala, menggigil.",
        maiaInsight: "Trias Malaria: Demam-Menggigil-Berkeringat. Tanyakan riwayat ke daerah endemis.",
        ikmContext: "Eliminasi Malaria adalah target global. Gunakan kelambu berinsektisida.",
        sknContext: "Kompetensi 4A. Diagnosis pasti dengan mikroskop/RDT and obat ACT.",
        funFact: "Nyamuk Anopheles menggigit pada malam hari and posisinya menungging.",
        gameTip: "Waspadai Malaria Cerebral (kejang/pingsan) sebagai kegawatdaruratan segera."
    },
    leptospirosis: {
        title: "Leptospirosis",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Zoonosis via urine tikus di area banjir. Bakteri masuk lewat luka kulit.",
        maiaInsight: "Nyeri otot betis and mata kemerahan (conjunctival suffusion) adalah tanda klasik.",
        ikmContext: "Musiman saat banjir. Gunakan sepatu bot saat membersihkan area banjir.",
        sknContext: "Kompetensi 4A. Penanganan dengan Doxycycline atau Penicillin sesegera mungkin.",
        funFact: "Bakteri Leptospira berbentuk seperti tanda tanya (?) di bawah mikroskop.",
        gameTip: "Tanyakan apakah pasien tinggal di area banyak tikus atau terpapar air banjir."
    },
    anaphylaxis: {
        title: "Syok Anafilaktik",
        category: "klinis",
        icon: "Zap",
        concept: "Reaksi alergi berat mendadak, menyebabkan tensi drop and sesak napas.",
        maiaInsight: "ADRENALIN adalah obat nomor satu! Jangan tunda jika ada tanda sesak and tensi drop.",
        ikmContext: "Sering pasca suntik obat/serangga. Fasyankes wajib punya 'Emergency Kit'.",
        sknContext: "Kompetensi 4A (Emergency). Harus ditangani di tempat sebelum stabilisasi.",
        funFact: "Anafilaktik bisa terjadi dalam hitungan detik setelah paparan pemicu.",
        gameTip: "Selalu tanya riwayat alergi mendalam sebelum memberikan obat suntik apapun."
    },

    // === SISTEM MUSKULOSKELETAL & TRAUMA ===
    leg_ulcer: {
        title: "Ulkus Tungkai",
        category: "klinis",
        icon: "Target",
        concept: "Luka terbuka sulit sembuh pada tungkai (akibat vaskular atau diabetes).",
        maiaInsight: "Ulkus vena biasanya tidak nyeri; ulkus arteri sangat nyeri and kering.",
        ikmContext: "Terkait higiene and mobilitas lansia. Perawatan luka modern sangat membantu.",
        sknContext: "Kompetensi 4A. FKTP melakukan perawatan luka rutin and kontrol komorbid.",
        funFact: "Madu medis telah lama digunakan sebagai agen topikal alami penyembuhan ulkus.",
        gameTip: "Edukasi pasien untuk tidak menggunakan ramuan tradisional tidak steril pada luka."
    },
    lipoma: {
        title: "Lipoma",
        category: "klinis",
        icon: "User",
        concept: "Benjolan lemak jinak lunak di bawah kulit, biasanya tidak nyeri.",
        maiaInsight: "Ini bukan kanker. Jika tidak mengganggu estetika, tidak perlu dioperasi.",
        ikmContext: "Keluhan bedah minor tersering. Tindakan ekstirpasi bisa di Puskesmas.",
        sknContext: "Kompetensi 4A. Dokter FKTP mampu melakukan operasi kecil (eksisi) lipoma.",
        funFact: "Lipoma adalah jenis tumor jaringan lunak paling umum pada orang dewasa.",
        gameTip: "Jika benjolan tumbuh sangat cepat and mengeras, waspadai keganasan."
    },
    sharp_trauma: {
        title: "Luka Tajam (Vulnus Laceratum)",
        category: "klinis",
        icon: "Scissors",
        concept: "Luka akibat benda tajam, ditandai tepi rata and perdarahan aktif.",
        maiaInsight: "Hentikan perdarahan (Pressure) adalah prioritas sebelum menjahit.",
        ikmContext: "Sering akibat kecelakaan kerja/rumah tangga. Cek status imunisasi tetanus.",
        sknContext: "Kompetensi 4A. Mencakup pembersihan, penjahitan, and profilaksis.",
        funFact: "Tepi luka rata lebih cepat sembuh dibanding luka tumpul yang compang-camping.",
        gameTip: "Selalu cek fungsi saraf and tendon di bawah luka untuk memastikan tak ada kerusakan."
    },
    blunt_trauma: {
        title: "Luka Tumpul / Memar",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Cedera jaringan lunak hantaman benda tumpul (memar/hematoma).",
        maiaInsight: "Metode RICE: Rest, Ice, Compression, Elevation adalah pertolongan pertama.",
        ikmContext: "Kasus tersering kecelakaan lalin. Waspada trauma tumpul abdomen yang tidak terlihat.",
        sknContext: "Kompetensi 4A. Observasi tanda syok atau penurunan kesadaran pasca trauma.",
        funFact: "Warna memar berubah dari biru ke hijau-kuning adalah proses alami pembersihan darah.",
        gameTip: "JANGAN beri kompres panas pada 48 jam pertama karena akan memperluas perdarahan."
    },
    burn_grade12: {
        title: "Luka Bakar Derajat 1-2",
        category: "klinis",
        icon: "Flame",
        concept: "Kerusakan kulit akibat panas. D1: Merah; D2: Melepuh and nyeri hebat.",
        maiaInsight: "Guyur air mengalir 15-20 menit segera. JANGAN beri pasta gigi!",
        ikmContext: "Mitigasi bencana kebakaran rumah tangga. Edukasi gas and listrik aman.",
        sknContext: "Kompetensi 4A (luas <10%). Perawatan luka moist and hidrasi.",
        funFact: "Luka bakar D2 sering lebih nyeri dibanding D3 karena saraf sensorik masih utuh.",
        gameTip: "Hati-hati memecah lepuhan; biarkan utuh jika kecil sebagai pelindung alami."
    }
};
