/**
 * @reflection
 * [IDENTITY]: cardio_variations
 * [PURPOSE]: Case variations for Cardiovascular diseases (Hypertension, etc.).
 * [STATE]: Stable
 * [ANCHOR]: cardio_variations
 * [DEPENDS_ON]: None
 */
export const cardio_variations = {
    // ═══════════════════════════════════════════════════════════════
    // CARDIOVASCULAR
    // ═══════════════════════════════════════════════════════════════
    hypertension_primary: {
        q_main: {
            low_education: 'Puyeng dok, pusing banget terutama pagi-pagi.',
            high_education: 'Keluhan utama cephalgia, terutama saat bangun tidur dan aktivitas.',
            skeptical: 'Pusing.',
            anxious: 'Dok saya pusing terus, jangan-jangan saya stroke ya? Saya takut banget!',
            elderly: 'Pusing terus Nak Dokter, rasanya melayang-layang gitu.',
            child_proxy: null
        },
        q_headache_type: {
            low_education: 'Pusingnya kayak di ikat kenceng dok, di belakang kepala.',
            high_education: 'Nyeri tipe tension, lokasi oksipital, konstan.',
            skeptical: 'Berdenyut.',
            anxious: 'Sakit banget Dok di belakang kepala, rasanya mau pecah, apa ini tanda stroke?',
            elderly: 'Berat Nak, kayak ditindih di belakang kepala.'
        },
        q_duration_ht: {
            low_education: 'Udah semingguan dok, nggak ilang-ilang.',
            high_education: 'Sekitar satu minggu ini, sifatnya kronik progresif.',
            skeptical: 'Seminggu.',
            anxious: 'Udah seminggu lebih Dok, saya cemas terus jadinya makin pusing!',
            elderly: 'Sudah lama Nak, tapi belakangan ini makin parah.'
        },
        q_bp_history: {
            low_education: 'Saya nggak pernah cek tensi dok, nggak tahu.',
            high_education: 'Saya belum pernah didiagnosis hipertensi, tapi memang jarang check-up.',
            skeptical: 'Nggak tahu.',
            anxious: 'Pernah dibilang agak tinggi waktu periksa, tapi saya nggak minum obat... salah ya Dok?',
            elderly: 'Dulu pernah tinggi Nak, tapi saya nggak terusin obatnya.'
        },
        q_smoking_ht: {
            low_education: 'Ngerokok dok, udah puluhan tahun.',
            high_education: 'Iya, perokok aktif sekitar 20 tahun.',
            skeptical: 'Iya.',
            anxious: 'Iya merokok Dok, saya tahu itu bahaya... mau berhenti tapi susah banget.',
            elderly: 'Udah dari muda Nak Dokter, sekarang tinggal sedikit.'
        },
        q_family_ht: {
            low_education: 'Bapak saya juga darah tinggi dok.',
            high_education: 'Ayah saya hipertensi dan pernah stroke.',
            skeptical: 'Bapak saya.',
            anxious: 'Bapak saya hipertensi dan meninggal karena stroke, Dok! Saya takut ikutan!',
            elderly: 'Almarhum bapak saya juga darah tinggi Nak Dokter.'
        }
    }
};
