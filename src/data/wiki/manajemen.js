/**
 * @reflection
 * [IDENTITY]: manajemen
 * [PURPOSE]: Static data module exporting: manajemenData.
 * [STATE]: Experimental
 * [ANCHOR]: manajemenData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const manajemenData = {
    liquidity: {
        title: "Liquid Assets (Aset Liquid)",
        category: "manajemen",
        icon: "DollarSign",
        concept: "Likuiditas adalah ketersediaan dana tunai yang siap digunakan untuk operasional harian Puskesmas.",
        maiaInsight: "Efisiensi operasional sangat bergantung pada arus kas yang stabil. Saya merekomendasikan pemantauan harian.",
        ikmContext: "Dalam Ilmu Kesehatan Masyarakat, manajemen keuangan yang sehat (Ekonometrik Kesehatan) memastikan pelayanan tidak terhenti karena masalah logistik atau gaji. Puskesmas harus mampu menyeimbangkan antara 'Public Service' dan 'Sustainability'.",
        sknContext: "Di Indonesia, Puskesmas dengan status BLUD (Badan Layanan Umum Daerah) memiliki fleksibilitas mengelola pendapatan sendiri (dari JKN & Umum) tanpa harus menyetor ke kas daerah terlebih dahulu. Ini vital untuk respons cepat kebutuhan medis.",
        funFact: "Tahukah Anda? Sebagian besar dana Puskesmas berasal dari 'Dana Kapitasi' BPJS yang dibayar di muka berdasarkan jumlah peserta terdaftar, bukan jumlah pasien yang datang.",
        gameTip: "Jaga likuiditas tetap positif dengan meningkatkan 'Angka Kontak' agar BPJS memberikan penilaian KBK yang maksimal."
    },
    staff_readiness: {
        title: "Staff Readiness (Kesiapan Staf)",
        category: "manajemen",
        icon: "Users",
        concept: "Mengukur tingkat kompetensi, kesehatan mental (avoiding burnout), dan kesiapan operasional tim medis.",
        ikmContext: "Human Resources for Health (HRH) adalah pilar vital WHO. Di Indonesia, tantangan utamanya adalah retensi dan beban kerja administratif yang tinggi bagi nakes di Puskesmas.",
        sknContext: "Sesuai standar Akreditasi, Puskesmas wajib memiliki uraian tugas yang jelas dan program 'Continuous Medical Education' (CME) agar nakes tetap kompeten menghadapi penyakit baru.",
        funFact: "Beban kerja nakes Puskesmas mencakup 40% klinis and 60% administratif/lapangan. Manajemen yang buruk sering menyebabkan 'Burnout' yang menurunkan kualitas diagnosa.",
        gameTip: "Berikan waktu istirahat (Energy) yang cukup bagi staf dan tingkatkan Knowledge stat melalui pelatihan."
    },
    quality_score: {
        title: "Clinical Quality (Mutu Klinis)",
        category: "manajemen",
        icon: "CheckCircle",
        concept: "Indikator tingkat kepatuhan klinis terhadap SOP dan keberhasilan terapi pasien (Outcome).",
        ikmContext: "Indikator Nasional Mutu (INM) Puskesmas mencakup kepatuhan cuci tangan, penggunaan APD, dan identifikasi pasien.",
        sknContext: "Di Indonesia, mutu diawasi melalui sistem laporan bulanan (PWS-KIA, LPLPO) dan survei Akreditasi berkala.",
        funFact: "Tahukah Anda? Kesalahan medis (medical error) di dunia seringkali bukan karena kurang ilmu, tapi karena kegagalan komunikasi atau kelelahan staf.",
        gameTip: "Tingkatkan skor mutu dengan selalu melakukan anamnesis lengkap and pemeriksaan penunjang yang sesuai indikasi."
    },
    pusk_accreditation: {
        title: "Puskesmas Accreditation",
        category: "manajemen",
        icon: "Award",
        concept: "Status pengakuan resmi dari Kemenkes terhadap standar pelayanan Puskesmas (Dasar, Madya, Utama, Paripurna).",
        ikmContext: "Akreditasi bukan sekadar sertifikat, tapi budaya keselamatan pasien (Patient Safety Culture) yang merata di seluruh unit.",
        sknContext: "Puskesmas Paripurna adalah standar tertinggi. Ini mencakup manajemen (Bab 1, 2), UKM (Bab 4, 5), and UKP (Bab 7, 8, 9).",
        funFact: "Proses akreditasi melibatkan surveyor independen yang melakukan telusur dokumen and telusur lapangan secara mendalam.",
        gameTip: "Status Paripurna meningkatkan 'multiplier' pendapatan Kapitasi dari BPJS secara signifikan."
    },
    blud_status: {
        title: "BLUD (Badan Layanan Umum Daerah)",
        category: "manajemen",
        icon: "Home",
        concept: "Fleksibilitas keuangan bagi Puskesmas untuk mengelola pendapatan sendiri secara langsung demi peningkatan pelayanan.",
        ikmContext: "Status BLUD memutus birokrasi panjang pencairan dana APBD untuk kebutuhan mendesak seperti obat atau alat medis.",
        sknContext: "Puskesmas BLUD wajib menyusun RBA (Rencana Bisnis Anggaran) and laporan keuangan standar akrual (PSAP 13).",
        funFact: "Puskesmas BLUD pertama kali muncul sebagai respons atas implementasi JKN yang membutuhkan kecepatan pengadaan logistik.",
        gameTip: "Kelola status BLUD dengan bijak: investasikan dana sisa lebih (SILPA) ke peralatan medis yang meningkatkan profitabilitas long-term."
    }
};
