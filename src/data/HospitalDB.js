/**
 * @reflection
 * [IDENTITY]: HospitalDB
 * [PURPOSE]: Static data module exporting: HOSPITALS, AMBULANCES, REFERRAL_STATUSES.
 * [STATE]: Experimental
 * [ANCHOR]: HOSPITALS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


export const HOSPITALS = [
    {
        id: 'rs_pratama_permata',
        name: 'RS Pratama Permata',
        class: 'C',
        distance: 5,
        type: 'Umum',
        specialties: ['pediatrics', 'obgyn', 'internal_medicine'],
        bedCapacity: { total: 20, available: 8 },
        description: 'RS terdekat dengan layanan dasar lengkap.',
        img: '/images/hospitals/rs_class_c.png'
    },
    {
        id: 'rsud_kabupaten',
        name: 'RSUD Kabupaten Harapan',
        class: 'B',
        distance: 18,
        type: 'Umum',
        specialties: ['surgery', 'internal_medicine', 'neurology', 'orthopedics'],
        bedCapacity: { total: 150, available: 22 },
        description: 'RS rujukan utama tingkat kabupaten dengan fasilitas bedah lengkap.',
        img: '/images/hospitals/rs_class_b.png'
    },
    {
        id: 'rsup_nasional',
        name: 'RSUP Nasional Merdeka',
        class: 'A',
        distance: 42,
        type: 'Umum',
        specialties: ['cardiology', 'oncology', 'neurosurgery', 'urology'],
        bedCapacity: { total: 500, available: 15 },
        description: 'Pusat rujukan nasional untuk kasus kompleks dan subspesialis.',
        img: '/images/hospitals/rs_class_a.png'
    },
    {
        id: 'rs_mata_bakti',
        name: 'RS Mata Bakti Husada',
        class: 'Khusus',
        distance: 25,
        type: 'Khusus Mata',
        specialties: ['ophthalmology'],
        bedCapacity: { total: 50, available: 12 },
        description: 'RS khusus mata dengan teknologi laser terbaru.',
        img: '/images/hospitals/rs_specialist.png'
    }
];

export const AMBULANCES = [
    {
        id: 'amb_transport',
        name: 'Ambulans Transport',
        type: 'Basic',
        isAmbulance: true,
        speedBoost: 1,
        stabilizationBonus: 0,
        cost: 0,
        energyDeduction: 5
    },
    {
        id: 'amb_emergency',
        name: 'Ambulans Gawat Darurat',
        type: 'Advance',
        isAmbulance: true,
        speedBoost: 1.2,
        stabilizationBonus: 15,
        cost: 250000,
        energyDeduction: 10
    },
    {
        id: 'amb_mandiri',
        name: 'Kendaraan Pribadi / Umum',
        type: 'Mandiri',
        isAmbulance: false,
        speedBoost: 0.8,
        stabilizationBonus: 0,
        cost: 0,
        energyDeduction: 0
    }
];

export const REFERRAL_STATUSES = {
    PENDING: 'Menunggu Respon',
    ACCEPTED: 'Diterima',
    REJECTED: 'Ditolak (Penuh)',
    EN_ROUTE: 'Dalam Perjalanan',
    ARRIVED: 'Sampai di RS'
};
