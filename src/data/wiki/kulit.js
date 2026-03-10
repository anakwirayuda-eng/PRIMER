/**
 * @reflection
 * [IDENTITY]: kulit
 * [PURPOSE]: Static data module exporting: kulitData.
 * [STATE]: Experimental
 * [ANCHOR]: kulitData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const kulitData = {
    // === SISTEM INTEGUMEN (KULIT) ===
    verruca_vulgaris: {
        title: "Veruka Vulgaris (Kutil)",
        category: "klinis",
        icon: "Circle",
        concept: "Infeksi virus HPV pada kulit, menyebabkan pertumbuhan tonjolan kasar.",
        maiaInsight: "Pasien sering mencoba memotong sendiri. Edukasi bahwa ini menular and butuh tindakan kimia/krioterapi.",
        ikmContext: "Kebersihan pribadi and penggunaan alas kaki di tempat umum sangat penting.",
        sknContext: "Kompetensi 4A. Penanganan dengan bahan kaustik atau elektrokauter.",
        funFact: "Kutil sering memiliki titik hitam (pembuluh darah beku) di tengahnya.",
        gameTip: "Waspadai penularan ke area lain (autoinokulasi) jika kutil sering dikopek."
    },
    molluscum: {
        title: "Moluskum Kontagiosum",
        category: "klinis",
        icon: "Disc",
        concept: "Infeksi virus Pox ditandai bintil putih/pink dengan lekukan (delle) di tengah.",
        maiaInsight: "Ciri khas 'Delle' adalah kunci diagnosis. Jika dipencet, keluar massa seperti nasi.",
        ikmContext: "Sangat mudah menular pada anak melalui kontak langsung atau berbagi handuk.",
        sknContext: "Kompetensi 4A. Penanganan dengan pengeluaran massa (enukleasi).",
        funFact: "Moluskum bisa sembuh sendiri dlm 6-12 bln, tapi sering diobati untuk cegah penularan.",
        gameTip: "Gunakan anestesi topikal (Emla) sebelum enukleasi pada anak agar tidak traumatis."
    },
    herpes_zoster: {
        title: "Herpes Zoster (Dompo)",
        category: "klinis",
        icon: "Zap",
        concept: "Reaktivasi virus cacar air di saraf, menyebabkan lepuh nyeri dermatomal.",
        maiaInsight: "Hanya satu sisi tubuh (unilateral)! Jika melewati garis tengah, curigai imunokompromais.",
        ikmContext: "Penanganan dini dlm 72 jam krusial untuk cegah nyeri saraf berkepanjangan.",
        sknContext: "Kompetensi 4A. Pemberian antivirus (Acyclovir) dosis tinggi and antinyeri.",
        funFact: "Seseorang tidak tertular Zoster langsung, tapi bisa tertular Cacar Air jika belum pernah.",
        gameTip: "Waspadai Herpes Zoster Oftalmikus (kena mata) sebagai kondisi darurat rujuk segera."
    },
    varicella: {
        title: "Varisela (Cacar Air)",
        category: "klinis",
        icon: "CloudRain",
        concept: "Infeksi virus Varicella-zoster primer menyebabkan bintil berair gatal di seluruh tubuh.",
        maiaInsight: "Gambaran 'Tetesan Embun'. Lesi muncul dalam berbagai stadium serentak.",
        ikmContext: "Sangat menular via udara. Isolasi di rumah sampai semua luka kering.",
        sknContext: "Kompetensi 4A. Antivirus Acyclovir, bedak salisil gatal, and nutrisi baik.",
        funFact: "Cairan di dalam bintil mengandung virus yang sangat banyak and infeksius.",
        gameTip: "Edukasi untuk JANGAN mandi air terlalu panas and pastikan kuku anak pendek."
    },
    herpes_simplex: {
        title: "Herpes Simpleks",
        category: "klinis",
        icon: "Zap",
        concept: "Infeksi HSV tipe 1 (mulut) atau tipe 2 (genital) menyebabkan bintil berair nyeri.",
        maiaInsight: "Sifatnya rekuren (hilang timbul). Virus 'sembunyi' and aktif saat stres/sakit.",
        ikmContext: "Herpes genital adalah IMS umum. Membutuhkan pendekatan konseling sensitif.",
        sknContext: "Kompetensi 4A. Salep/tablet antivirus and edukasi pencegahan penularan.",
        funFact: "HSV tipe 1 sangat umum; lebih dari separuh populasi dunia adalah pembawa virus.",
        gameTip: "Bedakan dengan Sifilis: Herpes sangat nyeri, Ulkus Durum (sifilis) tidak nyeri."
    },
    impetigo: {
        title: "Impetigo",
        category: "klinis",
        icon: "Flame",
        concept: "Infeksi bakteri kulit menular pada anak, ditandai keropeng kuning madu.",
        maiaInsight: "Krusta warna madu (honey-colored crust) adalah tanda emas diagnosis.",
        ikmContext: "Terkait higiene buruk. Rajin cuci tangan and mandi adalah pencegah utama.",
        sknContext: "Kompetensi 4A. Salep antibiotik (Mupirocin) and pembersihan keropeng.",
        funFact: "Impetigo hanya mengenai lapisan kulit atas and jarang meninggalkan bekas luka.",
        gameTip: "Jika lesi sangat luas atau anak demam, tambahkan antibiotik oral."
    },
    folliculitis: {
        title: "Folikulitis",
        category: "klinis",
        icon: "Target",
        concept: "Peradangan akar rambut akibat infeksi, bintil merah/nanah di batang rambut.",
        maiaInsight: "Dipicu gesekan pakaian ketat, mencukur, atau keringat menyumbat folikel.",
        ikmContext: "Penyakit kulit dasar iklim tropis. Gunakan pakaian longgar menyerap keringat.",
        sknContext: "Kompetensi 4A. Sabun antiseptik and salep antibiotik topikal.",
        funFact: "Kondisi 'Hot Tub Folliculitis' terjadi dlm air panas yg tak bersih (Pseudomonas).",
        gameTip: "Sarankan pasien sementara tidak mencukur area terkena sampai benar sembuh."
    },
    furuncle: {
        title: "Furunkel / Karbunkel (Bisul)",
        category: "klinis",
        icon: "Circle",
        concept: "Infeksi bakteri dalam folikel rambut (furunkel) or kumpulan bisul menyatu (karbunkel).",
        maiaInsight: "Hati-hati: Jika di wajah or pasien memiliki DM, risiko komplikasi sistemik tinggi.",
        ikmContext: "Higiene personal buruk and penggunaan handuk bersama faktor risiko utama.",
        sknContext: "Kompetensi 4A. Kompres hangat, insisi drainase jika matang, and antibiotik.",
        funFact: "Karbunkel sering menyerang pria di bagian belakang leher or punggung.",
        gameTip: "Jangan memencet bisul paksa sebelum matang karena bisa mendorong bakteri ke darah."
    },
    erythrasma: {
        title: "Eritrasma",
        category: "klinis",
        icon: "Activity",
        concept: "Infeksi C. minutissimum bercak merah kecokelatan kering di lipatan tubuh.",
        maiaInsight: "Mirip jamur tapi lampu Wood memancarkan warna merah bata (coral red).",
        ikmContext: "Faktor risiko: Obesitas and keringat berlebih. Sering tak disadari karena minim gatal.",
        sknContext: "Kompetensi 4A. Antibiotik topikal (Erythromycin) atau sabun antiseptik.",
        funFact: "Warna merah bata lampu Wood dihasilkan zat porfirin produksi bakteri.",
        gameTip: "Pikirkan eritrasma jika 'panu' di lipatan tak kunjung sembuh dengan salep jamur."
    },
    erysipelas: {
        title: "Erisipelas",
        category: "klinis",
        icon: "Zap",
        concept: "Infeksi bakteri kulit dalam, bercak merah terang berbatas tegas + demam.",
        maiaInsight: "Tepi luka 'Well-demarcated' (batas sangat jelas) and terasa panas.",
        ikmContext: "Gunakan alas kaki! Luka kecil di kaki pintu masuk utama kuman.",
        sknContext: "Kompetensi 4A. Membutuhkan antibiotik oral/sunti kuat and bed rest.",
        funFact: "Dulu dikenal sebagai 'St. Anthony's Fire' karena rasa panas terbakar hebat.",
        gameTip: "Lakukan elevasi pada kaki yg sakit untuk kurangi pembengkakan and percepat pemulihan."
    },
    scrofuloderma: {
        title: "Skrofuloderma (Tuberculosis Kulit)",
        category: "klinis",
        icon: "Activity",
        concept: "Manifestasi TB kulit dari kelenjar getah bening bawahnya, borok kronis and parut.",
        maiaInsight: "Borok khas: Tidak nyeri, tepi menggaung, sering di daerah leher.",
        ikmContext: "Tanda adanya infeksi TB aktif/laten. Harus pelacakan kontak serumah.",
        sknContext: "Kompetensi 4A. Penanganan sama dengan TB Paru (OAT minimal 6 bulan).",
        funFact: "Skrofuloderma adalah TB yang paling 'visible', beda dari TB paru yg tersembunyi.",
        gameTip: "Pastikan pasien rutin minum OAT and periksakan rontgen dada."
    },
    leprosy: {
        title: "Kusta (Morbus Hansen/Lepra)",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Penyakit kronis M. leprae menyerang saraf tepi and kulit (mati rasa).",
        maiaInsight: "Bercak putih 'Mati Rasa'! Jika ada bercak tak gatal/sakit ditusuk, curigai kusta.",
        ikmContext: "Stigma sosial musuh utama. Puskesmas sedia obat MDT GRATIS.",
        sknContext: "Kompetensi 4A. Edukasi rehabilitasi diri untuk cegah kecacatan permanen.",
        funFact: "Penyakit tertua, namun 95% manusia punya kekebalan alami terhadap kumannya.",
        gameTip: "Cek penebalan saraf (ulnaris atau peroneus) sebagai bagian penting periksa fisik."
    },
    syphilis_12: {
        title: "Sifilis Stadium 1-2",
        category: "klinis",
        icon: "Target",
        concept: "IMS Treponema pallidum. S1: Luka tidak nyeri; S2: Ruam telapak tangan/kaki.",
        maiaInsight: "Ulkus Durum (S1): Luka bersih, tidak nyeri, tapi sangat menular.",
        ikmContext: "Sifilis meningkat pesat. Penanganan dini FKTP sangat penting.",
        sknContext: "Kompetensi 4A. Penanganan standar emas adalah suntikan tunggal Penicillin G.",
        funFact: "Dijuluki 'The Great Imitator' karena bisa mirip hampir semua penyakit kulit lain.",
        gameTip: "Selalu skrining sifilis ibu hamil karena bisa sebabkan keguguran/kusta bawaan."
    },
    tinea_corporis: {
        title: "Tinea Korporis (Kurap)",
        category: "klinis",
        icon: "RotateCw",
        concept: "Infeksi jamur kulit tubuh bercak merah melingkar cincin ('Ringworm').",
        maiaInsight: "Tanda khas: 'Central Healing' (tengah tenang, tepi merah aktif).",
        ikmContext: "Penyakit jamur sejuta umat. Mandi teratur and pakaian kering adalah kunci.",
        sknContext: "Kompetensi 4A. Penanganan dengan salep antijamur topikal.",
        funFact: "Meski namanya 'Ringworm', penyakit ini disebabkan jamur, bukan cacing.",
        gameTip: "Pakai salep minimal 1-2 minggu SETELAH bercak hilang agar jamur tuntas."
    },
    tinea_cruris: {
        title: "Tinea Kruris (Jamur Selangkangan)",
        category: "klinis",
        icon: "ZapOff",
        concept: "Infeksi jamur selangkangan, sangat gatal terutama saat berkeringat.",
        maiaInsight: "Ruam merah luas selangkangan. Tepi lesi meninggi and berkelok-kelok.",
        ikmContext: "Masalah umum di asrama/pondok. Edukasi jangan bertukar pakaian dalam!",
        sknContext: "Kompetensi 4A. Hindari salep steroid (salep gatal umum) karena jamur makin subur.",
        funFact: "Sering disebut 'Jock Itch' karena dialami atlet yang banyak berkeringat.",
        gameTip: "Keringkan selangkangan dengan handuk bersih sebelum pakai pakaian dalam."
    },
    tinea_pedis: {
        title: "Tinea Pedis (Kutu Air)",
        category: "klinis",
        icon: "Droplets",
        concept: "Infeksi jamur kaki celah jari. Kulit basah, mengelupas, and bau.",
        maiaInsight: "Celah jari ke-4 and ke-5 lokasi favorit. Perih jika lecet kena air.",
        ikmContext: "Pekerja sawah (petani) or kaos kaki lembap seharian paling berisiko.",
        sknContext: "Kompetensi 4A. Salep antijamur and bedak untuk jaga sepatu tetap kering.",
        funFact: "Nama 'Athlete's Foot' populer karena atlet sering di ruang ganti lembap.",
        gameTip: "Jemur sepatu di bawah matahari langsung untuk matikan sisa jamur di dalamnya."
    },
    pityriasis_versicolor: {
        title: "Pityriasis Versicolor (Panu)",
        category: "klinis",
        icon: "Disc",
        concept: "Infeksi jamur ragi bercak putih/pink/cokelat bersisik halus.",
        maiaInsight: "Efek 'Hipopigmentasi' (bercak putih) karena jamur blokir melanin kulit.",
        ikmContext: "Paling umum di negara tropis. Stigma estetika sering bikin pasien tak pede.",
        sknContext: "Kompetensi 4A. Shampo Ketoconazole sebagai sabun, diamkan 5 menit baru bilas.",
        funFact: "Bercak putih tak langsung hilang setelah jamur mati; butuh berminggu-minggu.",
        gameTip: "Cek termudah: Garuk bercak dengan kuku, jika muncul sisik halus (finger-nail test), itu panu."
    },
    scabies: {
        title: "Skabies (Gudik)",
        category: "klinis",
        icon: "Bug",
        concept: "Infestasi tungau di bawah kulit, gatal hebat terutama malam hari.",
        maiaInsight: "Gatal Malam Hari and mengenai sekelompok orang (keluarga/asrama).",
        ikmContext: "Khas asrama. Edukasi 'Jemur Kasur' and cuci kain dengan air panas.",
        sknContext: "Kompetensi 4A. Salep Permethrin 5% oles SELURUH tubuh selama 8-12 jam.",
        funFact: "Tungau jantan mati setelah kawin, betinanya hidup di bawah kulit bertelur.",
        gameTip: "Tekankan salep harus dioleskan ke seluruh tubuh tanpa kecuali dari leher ke kaki."
    },
    dermatitis_kontak: {
        title: "Dermatitis Kontak",
        category: "klinis",
        icon: "ShieldAlert",
        concept: "Radang kulit kontak zat tertentu (Iritan atau Alergi).",
        maiaInsight: "Ruam muncul tepat di lokasi kontak pemicu (misal jam tangan).",
        ikmContext: "Terkait paparan kimia tempat kerja atau kosmetik tak cocok.",
        sknContext: "Kompetensi 4A. Identifikasi and MENGHINDARI pemicu, salep kortikosteroid.",
        funFact: "Alergika bisa muncul bahkan 24-48 jam setelah paparan (tipe lambat).",
        gameTip: "Tanya apakah baru pakai sabun/deterjen/perhiasan baru dlm 2 hari terakhir."
    },
    atopic_dermatitis: {
        title: "Dermatitis Atopik (Eksim Susu)",
        category: "klinis",
        icon: "Activity",
        concept: "Radang kulit kronis berulang, terkait riwayat asma/alergi keluarga.",
        maiaInsight: "Lokasi: Pipi (bayi) and lipatan siku/lutut (anak/dewasa). Kulit kering.",
        ikmContext: "Edukasi penggunaan pelembap kulit rutin adalah kunci kualitas hidup.",
        sknContext: "Kompetensi 4A. Pelembap, sabun lembut, and kortikosteroid saat kambuh.",
        funFact: "Sering disebut 'The Itch that Rashes' karena ruam muncul akibat digaruk.",
        gameTip: "JANGAN memakai air panas saat mandi karena akan memperparah kulit kering."
    },
    seborrheic_dermatitis: {
        title: "Dermatitis Seboroik",
        category: "klinis",
        icon: "Disc",
        concept: "Radang kulit area kaya minyak, bercak merah and sisik kekuningan berminyak.",
        maiaInsight: "Lokasi: Kulit kepala (ketombe), alis, lipatan hidung. Bayi: 'Cradle Cap'.",
        ikmContext: "Sering kambuh saat stres. Terkait pertumbuhan jamur Malassezia berlebih.",
        sknContext: "Kompetensi 4A. Shampoo antijamur and salep kortikosteroid ringan.",
        funFact: "Ketombe sebenarnya adalah bentuk paling ringan dari dermatitis seboroik.",
        gameTip: "Edukasi radang ini kronis and sering kambuh ditekankan kontrol gejala."
    },
    acne_vulgaris: {
        title: "Akne Vulgaris (Jerawat)",
        category: "klinis",
        icon: "Target",
        concept: "Radang kronis kelenjar minyak akibat hormon, bakteri, and pori sumbat.",
        maiaInsight: "Fokus pencegahan parut (bopeng)! JANGAN memencet jerawat sendiri.",
        ikmContext: "Mempengaruhi mental remaja. Edukasi kebersihan wajah and diet rendah gula.",
        sknContext: "Kompetensi 4A. Benzoil Peroksida/Asam Retinoat and antibiotik oral (berat).",
        funFact: "Makanan tinggi indeks glikemik terbukti memperparah jerawat.",
        gameTip: "Sabar: Hasil penanganan biasanya baru terlihat setelah 4-8 minggu rutin."
    },
    miliaria: {
        title: "Miliaria (Biang Keringat)",
        category: "klinis",
        icon: "Droplets",
        concept: "Sumbatan kelenjar keringat cuaca panas, bintil kecil gatal.",
        maiaInsight: "Miliaria Rubra (Prickly Heat) paling umum: bintil merah and 'nyelekit'.",
        ikmContext: "Sangat sering pada bayi tropis. Jangan membedung bayi terlalu tebal.",
        sknContext: "Kompetensi 4A. Pakaian tipis, ruang sejuk, and bedak kocok (Calamin).",
        funFact: "Bisa muncul tifa tingkat: kristalina, rubra, and profunda (dalam).",
        gameTip: "JANGAN beri minyak telon saat biang keringat karena makin sumbat pori."
    },
    urticaria_acute: {
        title: "Urtikaria Akut (Biduran)",
        category: "klinis",
        icon: "Thermometer",
        concept: "Reaksi alergi bentol merah gatal and cepat pindah tempat.",
        maiaInsight: "Bentol khas (wheal): Jika ditekan memucat. Muncul and hilang dlm < 24 jam.",
        ikmContext: "Pemicu: seafood, telur, obat, cuaca dingin. Cari and hindari pemicu!",
        sknContext: "Kompetensi 4A. Penanganan dengan antihistamin oral (Cetirizine).",
        funFact: "Sering disebut 'Kaligata' atau 'Liduran' di berbagai daerah Indonesia.",
        gameTip: "Segera rujuk jika biduran + mata/bibir bengkak and sesak napas (Angioedema)."
    }
};
