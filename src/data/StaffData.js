/**
 * @reflection
 * [IDENTITY]: StaffData
 * [PURPOSE]: Static data for available staff types in the game.
 * [STATE]: Stable
 */

export const AVAILABLE_STAFF = [
    {
        id: 'nurse_basic',
        name: 'Perawat Umum',
        role: 'nurse',
        type: 'Tenaga Medis',
        salary: 3500000,
        icon: '👩‍⚕️',
        skills: ['Triage', 'Injeksi', 'Rawat Luka'],
        description: 'Membantu pemeriksaan vital sign dan tindakan keperawatan dasar.',
        effects: { queueSpeed: 10, patientCapacity: 2 },
        unlockLevel: 1
    },
    {
        id: 'midwife',
        name: 'Bidan Terampil',
        role: 'midwife',
        type: 'Tenaga Medis',
        salary: 4000000,
        icon: '👶',
        skills: ['ANC', 'Persalinan Normal', 'KB'],
        description: 'Mengelola layanan KIA dan program KB.',
        effects: { kiaCapacity: 5, reputationBonus: 2 },
        unlockLevel: 3
    },
    {
        id: 'lab_tech',
        name: 'Analis Lab',
        role: 'lab',
        type: 'Tenaga Penunjang',
        salary: 4500000,
        icon: '🔬',
        skills: ['Hematologi', 'Kimia Darah', 'Urinalisa'],
        description: 'Mempercepat hasil lab dan menambah jenis pemeriksaan.',
        effects: { labSpeed: 20, labAccuracy: 10 },
        unlockLevel: 4
    },
    {
        id: 'pharmacist',
        name: 'Apoteker',
        role: 'pharmacy',
        type: 'Tenaga Penunjang',
        salary: 5000000,
        icon: '💊',
        skills: ['Dispensing', 'Konseling Obat', 'Stok Management'],
        description: 'Mengurangi kesalahan obat dan meningkatkan kepatuhan pasien.',
        effects: { medicationError: -15, patientEducation: 10 },
        unlockLevel: 5
    },
    {
        id: 'admin',
        name: 'Staff Administrasi',
        role: 'admin',
        type: 'Non-Medis',
        salary: 3000000,
        icon: '📋',
        skills: ['BPJS Claim', 'Surat Menyurat', 'Rekam Medis'],
        description: 'Mempercepat proses administrasi dan klaim BPJS.',
        effects: { adminSpeed: 20, bpjsClaimBonus: 5 },
        unlockLevel: 2
    },
    {
        id: 'driver',
        name: 'Supir Ambulans',
        role: 'driver',
        type: 'Non-Medis',
        salary: 2500000,
        icon: '🚑',
        skills: ['Evakuasi', 'P3K', 'Navigasi Desa'],
        description: 'Mengaktifkan layanan rujukan dan penjemputan pasien.',
        effects: { referralTime: -30, emergencyResponse: 15 },
        unlockLevel: 3
    },
    {
        id: 'dentist',
        name: 'Dokter Gigi',
        role: 'dentist',
        type: 'Dokter Spesialis',
        salary: 8000000,
        icon: '🦷',
        skills: ['Tambal Gigi', 'Cabut Gigi', 'Scaling'],
        description: 'Membuka poli gigi untuk layanan kesehatan mulut.',
        effects: { dentalService: true, reputationBonus: 5 },
        unlockLevel: 6
    },
    {
        id: 'nutritionist',
        name: 'Ahli Gizi',
        role: 'nutritionist',
        type: 'Tenaga Penunjang',
        salary: 4000000,
        icon: '🥗',
        skills: ['Diet Therapy', 'Konseling Gizi', 'PMBA'],
        description: 'Meningkatkan outcome pasien dengan masalah gizi.',
        effects: { prolanisBonus: 10, childNutrition: 15 },
        unlockLevel: 4
    }
];
