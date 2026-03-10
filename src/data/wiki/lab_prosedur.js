/**
 * @reflection
 * [IDENTITY]: lab_prosedur
 * [PURPOSE]: Static data module exporting: labProsedurData.
 * [STATE]: Experimental
 * [ANCHOR]: labProsedurData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const labProsedurData = {
    // --- Prosedur ---
    proc_iv_line: {
        title: "Pemasangan Infus (IV Line)",
        category: "prosedur",
        icon: "Droplet",
        concept: "Prosedur memasukkan jarum kateter ke pembuluh darah vena untuk pemberian cairan atau obat.",
        ikmContext: "Kompetensi dasar perawat dan dokter. Kegagalan pemasangan infus pada kasus syok bisa berakibat fatal.",
        sknContext: "Cairan infus (kristaloid) adalah obat esensial yang ketersediaannya wajib dijamin di setiap fasyankes.",
        funFact: "Ukuran jarum infus (Abocath) diberi kode warna; makin kecil angkanya (misal 18G/Hijau), makin besar jarumnya.",
        gameTip: "Wajib dilakukan pada semua pasien prioritas 1 (Merah) dan sebagian prioritas 2 (Kuning) untuk jalur obat darurat."
    },
    proc_oxygen: {
        title: "Terapi Oksigen",
        category: "prosedur",
        icon: "Wind",
        concept: "Pemberian oksigen tambahan untuk mengatasi hipoksia (kurang oksigen). Bisa via Nasal Kanul atau Masker.",
        ikmContext: "Tabung oksigen sering langka di daerah terpencil. Manajemen logistik gas medis sangat krusial.",
        sknContext: "Standar pelayanan minimal gawat darurat mewajibkan ketersediaan oksigen medis 24 jam.",
        funFact: "Udara biasa hanya mengandung 21% oksigen. Dengan masker NRM, kita bisa memberikan konsentrasi hingga 100%.",
        gameTip: "Berikan pada pasien dengan sesak napas berat atau SpO2 < 95% untuk mencegah kerusakan otak permanen."
    },
    proc_nebulizer: {
        title: "Nebulizer (Uap)",
        category: "prosedur",
        icon: "Cloud",
        concept: "Alat yang mengubah obat cair menjadi uap agar bisa dihirup langsung ke dalam paru-paru.",
        ikmContext: "Sangat efektif untuk serangan asma akut yang sering terjadi di masyarakat akibat polusi atau alergi.",
        sknContext: "Puskesmas wajib memiliki alat nebulizer di Ruang Tindakan untuk penanganan pertama sesak napas.",
        funFact: "Obat nebulizer bekerja jauh lebih cepat daripada obat minun atau suntik untuk melebarkan jalan napas.",
        gameTip: "Tindakan utama untuk kasus Asma atau PPOK. Jangan lupa evaluasi suara napas setelah tindakan."
    },
    proc_cpr: {
        title: "RJP (Resusitasi Jantung Paru)",
        category: "prosedur",
        icon: "Heart",
        concept: "Tindakan kompresi dada untuk menggantikan fungsi pompa jantung yang berhenti (Cardiac Arrest).",
        ikmContext: "Bantuan Hidup Dasar (BHD). Setiap detik keterlambatan RJP mengurangi peluang hidup 10%.",
        sknContext: "Semua nakes wajib bersertifikat BCLS/ACLS. Masyarakat awam pun kini dilatih melakukan RJP tangan-saja.",
        funFact: "Lagu 'Stayin' Alive' dari Bee Gees memiliki tempo 100-120 bpm, tempo yang pas untuk kompresi dada.",
        gameTip: "Lakukan HANYA pada pasien henti jantung (Nadi tidak teraba). Jangan berhenti sampai ROSC atau bantuan lanjut datang."
    },
    proc_hecting: {
        title: "Penjahitan Luka (Hecting)",
        category: "prosedur",
        icon: "Scissors",
        concept: "Menyatukan tepi luka terbuka dengan benang jahit untuk mempercepat penyembuhan dan mengurangi parut.",
        ikmContext: "Keterampilan bedah minor paling sering dilakukan di IGD Puskesmas, terutama akibat kecelakaan lalu lintas.",
        sknContext: "Pencegahan infeksi (sterilitas) saat menjahit adalah kunci mutu pelayanan bedah minor.",
        funFact: "Benang jahit ada yang 'jadi daging' (absorbable) dan ada yang harus dilepas (non-absorbable).",
        gameTip: "Gunakan anestesi lokal (Lidocaine) sebelum menjahit agar pasien tidak kesakitan dan reputasi Anda terjaga."
    },
    proc_kateter: {
        title: "Pemasangan Kateter Urin",
        category: "prosedur",
        icon: "Anchor",
        concept: "Memasang selang ke kandung kemih untuk mengalirkan urin.",
        ikmContext: "Indikasi untuk monitoring output cairan pada pasien syok atau pasien yang tidak bisa kencing (retensi).",
        sknContext: "Risiko infeksi saluran kemih (ISK) tinggi jika pemasangan tidak steril.",
        funFact: "Balon kateter dikunci dengan air (aquades), bukan udara, agar tidak mengapung di dalam kandung kemih.",
        gameTip: "Penting untuk pasien Dehidrasi Berat guna memantau produksi urin (target 0.5-1 cc/kgBB/jam)."
    },

    // --- Laboratorium ---
    lab_dl: {
        title: "Darah Lengkap (DL)",
        category: "lab",
        icon: "Droplet",
        concept: "Pemeriksaan sel darah: Hb, Leukosit, Trombosit, Hematokrit.",
        ikmContext: "Pemeriksaan paling dasar untuk skrining infeksi (Leukosit naik) atau anemia (Hb turun).",
        sknContext: "Puskesmas minimal harus bisa melakukan pemeriksaan Hemoglobin (Hb) stik atau hematologi sederhana.",
        funFact: "Pada DB (Demam Berdarah), yang ditakuti bukan trombosit turun, tapi hematokrit naik (kebocoran plasma).",
        gameTip: "Cek DL pada kasus demam >3 hari untuk membedakan infeksi bakteri vs virus (DBD/Tifus)."
    },
    lab_gds: {
        title: "Gula Darah Sewaktu (GDS)",
        category: "lab",
        icon: "Activity",
        concept: "Mengukur kadar glukosa dalam darah saat itu juga tanpa puasa.",
        ikmContext: "Skrining cepat Diabetes Melitus. Hipoglikemia (Gula rendah) lebih mematikan dalam jangka pendek daripada Hiperglikemia.",
        sknContext: "Alat POCT (Point of Care Testing) stik gula darah wajib ada di setiap kit emergency.",
        funFact: "Otak manusia hanya bisa 'makan' glukosa. Jika GDS < 60, otak mulai 'kelaparan' and pasien bisa koma.",
        gameTip: "Wajib cek pada pasien pingsan/penurunan kesadaran. Obatnya murah (Dextrose 40%), efeknya instan."
    },
    lab_widal: {
        title: "Tes Widal",
        category: "lab",
        icon: "Disc",
        concept: "Pemeriksaan serologi untuk mendeteksi antibodi Salmonella typhi (Penyebab Tifus).",
        ikmContext: "Masih populer di Indonesia meski spesifisitasnya rendah (sering positif palsu).",
        sknContext: "Gold standard sebenarnya adalah kultur, tapi Widal lebih murah and cepat untuk setting Puskesmas.",
        funFact: "Di negara maju tes ini sudah ditinggalkan, tapi di daerah tropis masih sangat membantu diagnostik.",
        gameTip: "Gunakan untuk konfirmasi diagnosis Demam Tifoid jika demam >1 minggu, lidah kotor, and nyeri perut."
    },
    lab_urin: {
        title: "Urinalisa (Urin Rutin)",
        category: "lab",
        icon: "FlaskConical",
        concept: "Analisis fisik, kimia, and mikroskopis urin.",
        ikmContext: "Deteksi infeksi saluran kemih (ISK), batu ginjal, atau diabetes (gula dalam urin).",
        sknContext: "Pemeriksaan sederhana yang bisa mengungkap banyak penyakit sistemik.",
        funFact: "Warna urin bisa berubah jadi merah bukan cuma karena darah, tapi juga karena makan buah naga!",
        gameTip: "Cek pada pasien nyeri pinggang atau demam tanpa sebab jelas (ISK sering tersembunyi)."
    }
};
