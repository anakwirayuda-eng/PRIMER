/**
 * @reflection
 * [IDENTITY]: AppMetadata
 * [PURPOSE]: PRIMER Official IP Shield, HAKI Registry, & Legal Disclaimer
 * [STATE]: Production
 * [ANCHOR]: APP_METADATA
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-20
 */

/**
 * PRIMER: Primary Care Manager Simulator
 * 
 * Official Metadata & HAKI (Hak Kekayaan Intelektual) Information
 * Creator: Anak Agung Bagus Wirayuda, MD, PhD
 * 
 * Registered under UU No. 28 Tahun 2014 tentang Hak Cipta
 * Surat Pencatatan Ciptaan No. EC002026019623
 */

// Deep Freeze: prevents F12 console mutation of metadata
const deepFreeze = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) deepFreeze(obj[key]);
    });
    return Object.freeze(obj);
};

export const APP_METADATA = deepFreeze({
    name: "PRIMER",
    fullName: "Primary Care Manager Simulator",
    version: "0.8.5",
    creator: "Anak Agung Bagus Wirayuda MD PhD",
    organization: "ITS MEDICS",
    department: "Institut Teknologi Sepuluh Nopember",
    releasedDate: "2026-01-30",
    origin: "Surabaya, Indonesia",
    tagline: "Bridging clinical excellence and public health leadership.",
    copyright: "© 2026 Anak Agung Bagus Wirayuda MD PhD. Hak Cipta Terdaftar — No. EC002026019623.",

    // === OFFICIAL HAKI REGISTRATION ===
    // Surat Pencatatan Ciptaan — Kementerian Hukum Republik Indonesia
    // Direktorat Jenderal Kekayaan Intelektual
    haki: {
        registrationNumber: "EC002026019623",
        registrationDate: "2026-01-31",
        recordNumber: "001104039",
        type: "Permainan Video",
        title: "PRIMER: Primary Care Manager Simulator",
        creator: "Anak Agung Bagus Wirayuda",
        holder: "Anak Agung Bagus Wirayuda",
        firstPublished: "2026-01-30",
        firstPublishedCity: "Kota Surabaya",
        protectionPeriod: "50 tahun sejak Ciptaan pertama kali dilakukan Pengumuman",
        legalBasis: "Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta, Pasal 72",
        signingAuthority: "Agung Damarsasongko, SH., MH.",
        signingTitle: "Direktur Hak Cipta dan Desain Industri"
    },

    // === LEGAL PROTECTIONS ===
    legal: {
        internationalProtection: "Protected globally under the Berne Convention for the Protection of Literary and Artistic Works (181 member states). Indonesia ratified via Keppres No. 18/1997. DMCA/WIPO compliant for takedown enforcement on international hosting platforms.",
        medicalDisclaimer: "PRIMER is a management simulation game intended solely for educational purposes. It is NOT a Software as a Medical Device (SaMD), NOT an absolute clinical guideline (PNPK/PPK), and MUST NOT be used as the basis for real-world patient diagnosis or treatment decisions. All clinical scenarios are fictional simulations. The Creator bears zero liability for any real-world clinical decisions influenced by this software.",
        dataPrivacy: "Compliant with UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP). Operational logic and PIS-PK scoring algorithms are protected as Trade Secrets (Rahasia Dagang).",
        trademarkNotice: "PRIMER™ is a recognized identifier of ITS MEDICS. Trademark registration pending at DJKI (Kelas 9: Software & Kelas 41: Edukasi)."
    },

    // Formal Description for HAKI (Uraian Singkat)
    description: "PRIMER (Primary Care Manager Simulator) adalah perangkat lunak simulasi manajemen kesehatan primer (FKTP/Puskesmas) yang dirancang untuk melatih pengambilan keputusan klinis dan kompetensi manajerial bagi tenaga medis maupun mahasiswa di bidang kesehatan. Dengan berpedoman pada Standar Pelayanan Minimal (SPM), Patient Safety (Keselamatan Pasien), serta Quality Assurance (Penjaminan Mutu), pengguna ditantang untuk mengelola pelayanan pasien berstandar SKDI, sinkronisasi data intervensi keluarga (PIS-PK), serta efisiensi operasional harian fasilitas kesehatan. Selain sebagai sarana pembelajaran bagi akademisi, perangkat ini juga ditujukan bagi khalayak umum untuk menjembatani kesenjangan pengenalan akan Sistem Kesehatan Nasional (SKN) serta mengilustrasikan kompleksitas dalam mewujudkan kesehatan masyarakat yang ideal.",

    history: [
        {
            year: "2024-2025",
            event: "Pengembangan konsep dasar simulasi manajemen Puskesmas berbasis RPG."
        },
        {
            year: "2025",
            event: "Integrasi standar klinis (SKDI) dan program nasional (PIS-PK/Prolanis) ke dalam gameplay."
        },
        {
            year: "2026-01",
            event: "Pencatatan Hak Cipta resmi di Kemenkumham RI (No. EC002026019623)."
        },
        {
            year: "2026-02",
            event: "v0.8.5 — Stability & Hardening: Lint Stability Pack, PRIMERA v5.0 Watchdog Mode."
        },
        { year: "2026-03", event: "Cloud deployment (Supabase + Vercel), Security Hardening, Anti-cheat systems." }
    ],

    objectives: [
        "Meningkatkan kompetensi manajerial Kepala Puskesmas.",
        "Mengintegrasikan prinsip Patient Safety dan Standar Pelayanan Minimal (SPM).",
        "Menjamin Quality Assurance melalui akurasi klinis berstandar SKDI.",
        "Memberikan pemahaman praktis tentang Sistem Kesehatan Nasional.",
        "Melatih pengambilan keputusan klinis yang efisien dan akurat.",
        "Mengedukasi masyarakat umum tentang alur pelayanan kesehatan primer."
    ]
});
