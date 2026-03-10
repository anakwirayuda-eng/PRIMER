/**
 * @reflection
 * [IDENTITY]: klinis
 * [PURPOSE]: Static data module exporting: klinisData.
 * [STATE]: Experimental
 * [ANCHOR]: klinisData
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

export const klinisData = {
    // --- CPPT (Resume Medis Terintegrasi) ---
    cppt: {
        title: "CPPT (Catatan Perkembangan Pasien Terintegrasi)",
        category: "prosedur",
        icon: "FileText",
        concept: "Format dokumentasi klinis terintegrasi yang mencatat seluruh perkembangan kondisi pasien dalam format SOAP (Subjective, Objective, Assessment, Planning) secara kronologis oleh seluruh tenaga kesehatan yang terlibat.",
        ikmContext: "CPPT adalah jantung dari Rekam Medis Elektronik (RME) di fasilitas kesehatan. Dalam perspektif IKM, CPPT yang lengkap memungkinkan 'Continuity of Care' — kesinambungan pelayanan lintas waktu dan lintas provider. Pasien yang datang berulang kali akan memiliki riwayat medis yang utuh, membantu dokter mengambil keputusan klinis berbasis data historis, bukan hanya keluhan saat itu.",
        sknContext: "Sesuai Permenkes tentang Rekam Medis, setiap kontak pasien di faskes WAJIB didokumentasikan dalam CPPT berbasis SOAP. CPPT terintegrasi berarti dokter, perawat, bidan, dan apoteker menulis dalam satu lembar kronologis (bukan terpisah). Ini adalah standar SATU SEHAT dan menjadi salah satu elemen penilaian Akreditasi Bab 3 (UKP).",
        funFact: "CPPT yang baik bukan hanya catatan medis, tapi juga dokumen hukum. Dalam kasus sengketa medis, CPPT adalah bukti utama bahwa dokter telah melakukan penatalaksanaan sesuai standar profesi. Pepatah lama di dunia medis: 'If it was not documented, it was not done.'",
        gameTip: "Setiap kali Anda menyelesaikan konsultasi pasien, CPPT otomatis disimpan. Buka tab 'Riwayat' saat memeriksa pasien yang pernah datang untuk melihat CPPT sebelumnya — ini akan membantu Anda mengenali pola penyakit kronis dan riwayat pengobatan yang pernah diberikan."
    }
};
