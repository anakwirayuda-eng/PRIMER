/**
 * @reflection
 * [IDENTITY]: emergency_wiki
 * [PURPOSE]: Static data module exporting: emergencyWikiData — MAIA Codex wiki entries for IGD triage, ESI levels, and emergency protocols.
 * [STATE]: Stable
 * [ANCHOR]: emergencyWikiData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

export const emergencyWikiData = {
    esi_overview: {
        title: "ESI — Emergency Severity Index",
        category: "klinis",
        icon: "Zap",
        concept: "Sistem triase lima level yang digunakan di IGD untuk menentukan prioritas pasien berdasarkan kebutuhan sumber daya dan tingkat keparahan. ESI 1 (paling darurat) hingga ESI 5 (paling ringan).",
        maiaInsight: "Triase yang tepat menyelamatkan nyawa. Pasien ESI 1-2 harus ditangani segera, sementara ESI 4-5 bisa menunggu dengan aman.",
        ikmContext: "ESI dikembangkan oleh Agency for Healthcare Research and Quality (AHRQ) Amerika dan telah diadaptasi secara luas di Indonesia sebagai standar triase IGD.",
        sknContext: "Akreditasi Puskesmas mensyaratkan IGD memiliki SOP Triase yang jelas. Triase dilakukan oleh perawat/dokter terlatih saat pasien pertama kali tiba.",
        funFact: "Sistem triase modern dimulai dari medan perang Napoleon, ketika dokter militer Dominique Jean Larrey memutuskan untuk menangani tentara yang paling membutuhkan terlebih dahulu, bukan berdasarkan pangkat.",
        gameTip: "Evaluasi pasien IGD dengan cepat. Periksa kesadaran, airway, breathing pertama. Pasien ESI 1-2 membutuhkan tindakan dalam hitungan menit."
    },
    esi_1: {
        title: "ESI Level 1 — Resusitasi",
        category: "klinis",
        icon: "Zap",
        concept: "Kondisi yang mengancam jiwa dan membutuhkan intervensi penyelamatan segera (immediate life-saving intervention). Contoh: henti jantung, gagal napas, syok anafilaksis berat.",
        ikmContext: "Pasien ESI 1 membutuhkan full resuscitation team. Setiap detik keterlambatan menurunkan peluang survival secara drastis.",
        sknContext: "Di Puskesmas, kemampuan resusitasi dasar (BHD) wajib dikuasai seluruh tenaga kesehatan. Pasien ESI 1 harus distabilisasi sebelum dirujuk.",
        funFact: "Pada henti jantung, setiap menit tanpa CPR menurunkan peluang bertahan hidup sebesar 7-10%. Setelah 10 menit tanpa CPR, peluang survival mendekati nol.",
        gameTip: "Pasien ESI 1 = hentikan semua yang sedang Anda lakukan. Lakukan ABC (Airway-Breathing-Circulation), berikan oksigen dan epinephrine jika perlu, lalu rujuk segera."
    },
    esi_2: {
        title: "ESI Level 2 — Emergensi",
        category: "klinis",
        icon: "Zap",
        concept: "Kondisi berisiko tinggi yang membutuhkan penanganan cepat (high-risk situation). Pasien dengan nyeri berat, perubahan kesadaran, atau kondisi yang bisa memburuk dengan cepat.",
        ikmContext: "Contoh: nyeri dada akut (suspek AMI), stroke akut, trauma kepala dengan penurunan kesadaran, keracunan akut.",
        sknContext: "Waktu respons target: pasien harus dievaluasi dokter dalam waktu 10 menit setelah triase.",
        funFact: "ESI 2 sering disebut 'golden window' — intervensi tepat waktu bisa membuat perbedaan antara recovery penuh dan disabilitas permanen.",
        gameTip: "ESI 2 tidak seberbahaya ESI 1 tapi bisa memburuk kapan saja. Monitor ketat, lakukan pemeriksaan cepat dan terapi awal sebelum rujuk jika diperlukan."
    },
    esi_3: {
        title: "ESI Level 3 — Urgensi",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Kondisi yang membutuhkan dua atau lebih sumber daya (pemeriksaan lab, rontgen, prosedur, dll.) dan tidak stabil secara potensial. Contoh: demam tinggi dengan sesak, nyeri perut akut, patah tulang tertutup.",
        ikmContext: "Mayoritas kasus IGD Puskesmas jatuh di ESI 3. Membutuhkan evaluasi menyeluruh dan beberapa pemeriksaan penunjang.",
        sknContext: "Pasien ESI 3 bisa ditangani di IGD Puskesmas jika sumber daya tersedia. Rujuk jika membutuhkan intervensi di luar kemampuan FKTP.",
        funFact: "Studi menunjukkan bahwa 40-50% kunjungan IGD di seluruh dunia masuk kategori ESI 3, menjadikannya kelompok terbesar.",
        gameTip: "Lakukan anamnesis dan pemeriksaan lengkap. Gunakan lab dan imaging sesuai indikasi. Banyak kasus ESI 3 bisa dituntaskan di Puskesmas tanpa rujuk."
    },
    esi_4: {
        title: "ESI Level 4 — Kurang Urgen",
        category: "klinis",
        icon: "Info",
        concept: "Kondisi yang membutuhkan satu sumber daya (satu pemeriksaan atau satu prosedur sederhana). Contoh: luka kecil yang perlu dijahit, keseleo, infeksi kulit ringan.",
        ikmContext: "Pasien ESI 4 bisa menunggu lebih lama tanpa risiko perburukan signifikan. Ideal ditangani di Puskesmas.",
        sknContext: "Seringkali pasien ESI 4 bisa langsung ditangani di poli umum, tidak harus melalui jalur IGD.",
        funFact: "Banyak kunjungan IGD di RS sebenarnya masuk kategori ESI 4-5 dan bisa ditangani di layanan primer — ini yang disebut 'inappropriate ED visits'.",
        gameTip: "ESI 4 biasanya cepat ditangani. Lakukan prosedur yang dibutuhkan (jahit luka, bidai, dll.) dan pulangkan dengan edukasi."
    },
    esi_5: {
        title: "ESI Level 5 — Non-Urgen",
        category: "klinis",
        icon: "Info",
        concept: "Kondisi yang tidak membutuhkan sumber daya tambahan — cukup anamnesis dan pemeriksaan fisik saja. Contoh: flu ringan, permintaan surat sehat, konsultasi nutrisi.",
        ikmContext: "Pasien ESI 5 seharusnya dilayani di poli reguler, bukan di IGD. Tingginya kunjungan ESI 5 ke IGD menunjukkan masalah akses ke layanan primer.",
        sknContext: "Edukasi masyarakat tentang penggunaan layanan yang tepat penting untuk mengurangi beban IGD dari kasus-kasus non-urgen.",
        funFact: "Di beberapa negara, pasien ESI 5 dikenakan biaya lebih tinggi jika datang ke IGD untuk mendorong mereka menggunakan pelayanan primer.",
        gameTip: "Tangani dengan cepat dan efisien. Edukasi pasien untuk kunjungi poli reguler di jam kerja untuk keluhan serupa di masa mendatang."
    },
    triage_red: {
        title: "Triase Merah — Gawat Darurat",
        category: "klinis",
        icon: "Zap",
        concept: "Pasien dengan ancaman jiwa yang membutuhkan tindakan segera. Setara ESI 1-2. Ditandai label merah pada kartu triase.",
        ikmContext: "Airway compromise, syok, perdarahan masif, penurunan kesadaran berat. Tidak boleh menunggu — harus ditangani SEGERA.",
        sknContext: "SOP IGD mengharuskan semua pasien label merah mendapat respons dalam 0-5 menit.",
        funFact: "Sistem label warna (merah-kuning-hijau-hitam) berasal dari triase bencana yang dikembangkan untuk menangani korban massal.",
        gameTip: "Pasien label merah = prioritas absolut. Drop everything dan tangani segera."
    },
    triage_yellow: {
        title: "Triase Kuning — Gawat Tidak Darurat",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Pasien dengan kondisi serius tapi stabil secara hemodinamik — bisa menunggu penanganan hingga 30 menit. Setara ESI 3.",
        ikmContext: "Contoh: patah tulang tertutup tanpa perdarahan, nyeri perut hebat tapi hemodinamik stabil, luka bakar sedang.",
        sknContext: "Pasien label kuning harus tetap dimonitor karena bisa berubah menjadi label merah jika terjadi perburukan.",
        funFact: "Keputusan triase sering harus dibuat dalam 60 detik — ini membutuhkan latihan dan pengalaman klinis yang solid.",
        gameTip: "Stabilkan pasien kuning, lakukan pemeriksaan lengkap, dan tentukan apakah bisa ditangani sendiri atau perlu rujukan."
    },
    triage_green: {
        title: "Triase Hijau — Tidak Gawat Tidak Darurat",
        category: "klinis",
        icon: "Info",
        concept: "Pasien dengan kondisi ringan yang bisa menunggu lebih lama. Setara ESI 4-5. Tidak membutuhkan tindakan segera.",
        ikmContext: "Contoh: luka kecil, demam ringan, nyeri otot, mual tanpa dehidrasi. Bisa diarahkan ke poli reguler.",
        sknContext: "Pasien label hijau tetap berhak mendapat pelayanan yang baik, meskipun tidak diprioritaskan.",
        funFact: "Di Puskesmas saat bencana atau KLB, mayoritas korban biasanya masuk kategori hijau (walking wounded) — yang justru sering panik karena melihat korban berat.",
        gameTip: "Tangani efisien dan edukasi. Pasien hijau yang diabaikan bisa membuat reputasi turun karena persepsi 'tidak dilayani'."
    },
    triage_black: {
        title: "Triase Hitam — Meninggal / Beyond Help",
        category: "klinis",
        icon: "AlertCircle",
        concept: "Dalam konteks triase bencana: pasien yang sudah meninggal atau memiliki cedera yang tidak compatible with life. Dalam praktik sehari-hari: pasien DOA (Dead on Arrival).",
        ikmContext: "Keputusan memberikan label hitam dalam bencana massal adalah salah satu keputusan etis paling berat dalam kedokteran — merelakan pasien yang tidak bisa diselamatkan demi menyelamatkan yang masih bisa.",
        sknContext: "Pasien DOA/meninggal di IGD harus didokumentasikan sesuai prosedur visum et repertum jika ada indikasi medikolegal.",
        funFact: "Dalam triase massal, rasio survival meningkat signifikan ketika tenaga medis disiplin menerapkan sistem triase dibanding menangani siapa saja yang terlihat pertama.",
        gameTip: "Dalam mode bencana, alokasikan sumber daya untuk pasien yang masih bisa diselamatkan. Dokumentasikan dengan baik."
    }
};
