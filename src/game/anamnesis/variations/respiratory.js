/**
 * @reflection
 * [IDENTITY]: respiratory_variations
 * [PURPOSE]: Case variations for Respiratory diseases (ISPA, Pneumonia).
 * [STATE]: Stable
 * [ANCHOR]: respiratory_variations
 * [DEPENDS_ON]: None
 */
export const respiratory_variations = {
    // ═══════════════════════════════════════════════════════════════
    // RESPIRATORY
    // ═══════════════════════════════════════════════════════════════
    ispa_common: {
        q_duration: {
            low_education: 'Udah tiga hari ini dok, nggak berhenti-berhenti pileknya.',
            high_education: 'Sudah sekitar tiga hari ini dok, onsetnya gradual.',
            skeptical: 'Tiga hari.',
            anxious: 'Dok, sudah 3 hari lho ini pilek terus, saya takut kenapa-kenapa, jangan-jangan ada yang serius?',
            elderly: 'Tiga hari sudah Nak Dokter, kalau nggak salah mulai hari itu.',
            child_proxy: 'Anaknya sudah 3 hari pilek terus Bu Dok, kasian meler terus.'
        },
        q_fever: {
            low_education: 'Anget-anget aja dok badannya, nggak panas banget sih.',
            high_education: 'Ada subfebris dok, saya ukur di rumah sekitar 37.5.',
            skeptical: 'Sumer doang.',
            anxious: 'Iya dok ada demam! Saya takut banget, jangan-jangan demam berdarah?',
            elderly: 'Badannya anget Nak Dokter, tapi nggak sampai menggigil.',
            child_proxy: 'Badannya agak anget Bu Dok, tapi masih mau main.'
        },
        q_cough: {
            low_education: 'Belum batuk sih dok, cuma gatel aja di tenggorokan.',
            high_education: 'Belum ada batuk produktif, hanya ada iritasi faring.',
            skeptical: 'Nggak.',
            anxious: 'Belum sih batuk, tapi tenggorokan rasanya gatel banget, nanti jangan-jangan jadi batuk parah ya Dok?',
            elderly: 'Alhamdulillah belum batuk Nak, cuma gatel-gatel aja di sini (pegang leher).',
            child_proxy: 'Belum batuk sih Bu Dok, cuma dia sering garuk-garuk lehernya.'
        },
        q_sob: {
            low_education: 'Nggak sesek dok, cuma idung mampet aja jadi napasnya lewat mulut.',
            high_education: 'Tidak ada dyspnea, hanya obstruksi nasal.',
            skeptical: 'Enggak.',
            anxious: 'Nggak sesak sih... tapi kadang napas terasa berat gitu Dok, apa itu bahaya?',
            elderly: 'Alhamdulillah napas lancar Nak Dokter, cuma idungnya tersumbat.',
            child_proxy: 'Nggak sesak Bu Dok, cuma hidungnya mampet jadi napasnya bunyi grok-grok.'
        },
        q_allergy: {
            low_education: 'Nggak ada alergi dok setahu saya.',
            high_education: 'Tidak ada riwayat alergi obat maupun makanan.',
            skeptical: 'Nggak.',
            anxious: 'Kayaknya nggak ada sih Dok... tapi saya nggak yakin, gimana ya?',
            elderly: 'Nggak ada Nak Dokter, dari kecil nggak pernah alergi apa-apa.',
            child_proxy: 'Setahu saya nggak ada alergi Bu Dok.'
        },
        q_family_sick: {
            low_education: 'Anak saya juga lagi meler-meler dok.',
            high_education: 'Iya, anak saya juga mengalami gejala serupa, kemungkinan kontak erat.',
            skeptical: 'Ya anak saya juga.',
            anxious: 'Anak saya juga pilek Dok! Jangan-jangan menular ya? Waduh, harus diobati juga nggak?',
            elderly: 'Cucu saya juga lagi pilek Nak Dokter, mungkin ketularan.',
            child_proxy: 'Kakaknya juga lagi flu Bu Dok, mungkin ketularan di sekolah.'
        },
        q_smoking: {
            low_education: 'Ya ngerokok dok, tapi nggak banyak.',
            high_education: 'Kadang-kadang, sekitar 3-5 batang sehari.',
            skeptical: 'Kadang.',
            anxious: 'Iya saya ngerokok Dok... apa gara-gara itu ya sakitnya? Saya mau berhenti tapi susah.',
            elderly: 'Sudah dari muda Nak Dokter, tapi sekarang tinggal 2-3 batang.',
            child_proxy: 'Bapaknya perokok Bu Dok, sering ngerokok di dalam rumah.'
        }
    },

    pneumonia_bacterial: {
        q_cough_type: {
            low_education: 'Dahaknya kuning-kuning kental dok, bikin sesek.',
            high_education: 'Batuk produktif dengan sputum purulen berwarna kuning-hijau.',
            skeptical: 'Berdahak kuning.',
            anxious: 'Aduh dok, dahaknya kuning kehijauan, tebal banget, saya takut banget ini TBC ya Dok?',
            elderly: 'Dahaknya kuning Nak Dokter, susah dikeluarkan, harus batuk kenceng.',
            child_proxy: 'Batuknya berdahak Bu Dok, warnanya kuning-kuningan gitu.'
        },
        q_duration: {
            low_education: 'Demem tinggi udah 3 hari dok, nggak turun-turun.',
            high_education: 'Demam tinggi sudah 3 hari ini, persisten meskipun sudah minum antipiretik.',
            skeptical: 'Tiga hari.',
            anxious: 'Sudah 3 hari Dok panas tinggi! Saya sudah minum obat warung tapi nggak mempan, gimana ini?!',
            elderly: 'Sudah tiga hari panas tinggi Nak, badan lemes semua.',
            child_proxy: 'Panasnya tinggi terus Bu Dok, sudah 3 hari, Paracetamol cuma turun sebentar.'
        },
        q_chest_pain: {
            low_education: 'Sakit banget di dada kanan dok, apalagi kalau narik napas.',
            high_education: 'Ada nyeri pleuritik di hemithorax dextra, terutama saat inspirasi dalam.',
            skeptical: 'Sakit napas dalam.',
            anxious: 'Dada saya sakit parah Dok! Terutama kalau tarik napas, saya kira serangan jantung!',
            elderly: 'Dada kanan nyeri Nak Dokter, perih kalau napas, jadi saya napasnya pelan-pelan.',
            child_proxy: 'Anak bilang dadanya sakit Bu Dok, nangis kalau batuk.'
        },
        q_sob_severity: {
            low_education: 'Iya sesek banget dok, tidur harus duduk.',
            high_education: 'Sesak cukup berat, perlu posisi semi-Fowler untuk tidur, menggunakan bantal tinggi.',
            skeptical: 'Lumayan sesak.',
            anxious: 'Sesak banget Dok, sampai nggak bisa tidur, saya takut kenapa-kenapa kalau malam!',
            elderly: 'Harus pakai bantal tinggi Nak, kalau tidur datar sesak banget.',
            child_proxy: 'Sesaknya parah Bu Dok, dia tidur harus setengah duduk.'
        },
        q_history: {
            low_education: 'Nggak pernah asma atau TBC dok.',
            high_education: 'Tidak ada riwayat asma, tuberkulosis, maupun penyakit paru kronis lainnya.',
            skeptical: 'Nggak ada.',
            anxious: 'Setahu saya nggak ada sih Dok... tapi keluarga jauh ada yang kena TBC, apa saya juga?',
            elderly: 'Alhamdulillah nggak pernah paru-paru Nak Dokter.'
        },
        q_family: {
            low_education: 'Nggak ada yang batuk-batuk lama di rumah dok.',
            high_education: 'Tidak ada riwayat batuk kronis di keluarga.',
            skeptical: 'Nggak.',
            anxious: 'Setahu saya tidak ada sih Dok, tapi tetangga baru pulang dari RS karena paru-paru...',
            elderly: 'Nggak ada Nak Dokter, alhamdulillah keluarga sehat.'
        },
        q_smoke: {
            low_education: 'Iya dok sebungkus sehari, udah dari muda.',
            high_education: 'Iya, perokok aktif, sekitar 1 bungkus per hari selama 15 tahun.',
            skeptical: 'Ya, satu bungkus.',
            anxious: 'Iya sebungkus sehari Dok, saya tahu itu pasti bikin sakit ini ya? Saya mau berhenti!',
            elderly: 'Sudah rokok dari umur 20 Nak Dokter, tapi sekarang tinggal setengah bungkus.'
        }
    }
};
