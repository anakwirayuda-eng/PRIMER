/**
 * @reflection
 * [IDENTITY]: DialogVariations
 * [PURPOSE]: Personality-aware dialog response templates for anamnesis and home visits.
 * [STATE]: Production
 * [ANCHOR]: DIALOG_VARIATIONS
 * [DEPENDS_ON]: ./PersonalityTraits.js
 */

// ═══════════════════════════════════════════════════════════════
// DIALOG VARIATIONS — Personality-specific responses during anamnesis
// ═══════════════════════════════════════════════════════════════

/**
 * How each personality type responds during clinical encounters.
 * These templates are used during anamnesis to vary patient responses
 * based on their personality, making each encounter feel unique.
 */
export const DIALOG_VARIATIONS = {
    // ─── Opening / Greeting ───
    greeting: {
        cooperative: [
            'Selamat pagi Dok, terima kasih sudah menerima saya.',
            'Dok, saya datang karena ingin periksa. Semoga bisa ditangani di sini.',
            'Assalamualaikum Dok, saya sudah buat janji kemarin.',
        ],
        skeptical: [
            'Ya Dok, saya mau periksa. Tapi sebelumnya saya mau tanya dulu.',
            'Dok, saya kedatangan karena istri yang minta. Sebenarnya saya rasa biasa aja.',
            'Saya baca di internet soal gejala saya, Dok. Bisa di-crosscheck?',
        ],
        superstitious: [
            'Ini disuruh anak saya ke sini Dok, sebenarnya saya sudah minum jamu.',
            'Dok, saya sebenarnya sudah berobat ke Mbah... tapi belum sembuh juga.',
            'Kata tetangga saya harus ke Puskesmas, padahal biasanya kerokan sudah cukup.',
        ],
        fatalistic: [
            'Iya Dok.',
            'Disuruh istri ke sini, Dok.',
            'Mau periksa, Dok. Tapi kalau sudah waktunya ya sudah.',
        ],
        anxious: [
            'Dok! Saya harus periksa sekarang, saya takut ini serius!',
            'Dok, maaf mengganggu, tapi saya sangat khawatir soal kondisi saya...',
            'Akhirnya saya bisa ketemu Dokter! Saya tidak bisa tidur karena cemas.',
        ],
    },

    // ─── Symptom Reporting ───
    symptomReport: {
        cooperative: [
            'Jadi begini Dok, sudah {duration} saya merasakan {symptom}. Awalnya ringan tapi makin lama makin berat.',
            'Keluhannya {symptom}, Dok. Sudah {duration}. Saya juga sudah coba minum {selfMed} tapi tidak membaik.',
            'Yang saya rasakan: {symptom}. Mulai terasa sejak {duration} yang lalu.',
        ],
        skeptical: [
            'Yang saya rasakan cuma {symptom} sih Dok, tidak parah. Tapi istri maksa periksa.',
            'Ada sedikit {symptom}. Saya sudah cek di Google, katanya bisa macam-macam. Menurut Dokter gimana?',
            '{symptom} sudah {duration}. Sebelumnya saya sudah minum obat dari apotek, cukupkah itu Dok?',
        ],
        superstitious: [
            'Masuk angin Dok, kena angin duduk waktu lewat kuburan.',
            'Perutnya kembung Dok, mungkin kesambet. Sudah dikerokin tapi belum membaik.',
            'Badannya panas-dingin Dok, mungkin ada yang tidak suka sama saya.',
        ],
        fatalistic: [
            'Sakit biasa aja Dok, paling juga sudah takdir.',
            '{symptom}. Sudah {duration}.',
            'Sama kayak biasa Dok, sakit lagi.',
        ],
        anxious: [
            '{symptom} sudah {duration} Dok, jangan-jangan saya kena {worstCase} ya? Saya googling katanya bisa {worstCase2}!',
            'Dok ini darurat! Saya merasakan {symptom}, tadi malam tidak bisa tidur memikirkannya!',
            'Jadi saya merasakan {symptom}, lalu {symptom2}, dan kadang sampai {symptom3}. Semuanya terasa parah Dok!',
        ],
    },

    // ─── When asked probing questions ───
    probingResponse: {
        cooperative: [
            'Oh iya Dok, memang ada juga {additionalInfo}. Saya lupa menyebutkan.',
            'Kalau ditanya soal itu, iya Dok memang {answer}.',
            'Benar Dok, {confirmation}.',
        ],
        skeptical: [
            'Hmm, kenapa Dokter tanya itu? Apa hubungannya?',
            'Itu kan beda Dok. Yang saya keluhkan ini soal {mainComplaint}.',
            'Saya rasa itu tidak relevan Dok, tapi kalau Dokter minta... {reluctantAnswer}.',
        ],
        superstitious: [
            'Saya kurang tahu Dok, yang penting saya sudah minum jamu.',
            'Itu... mungkin ada hubungannya sama saya lewat tempat angker kemarin.',
            'Saya ikut aja apa kata Dokter. Tapi nanti juga mau ke orang pintar.',
        ],
        fatalistic: [
            'Tidak tahu Dok.',
            'Mungkin iya, mungkin tidak.',
            'Tidak ingat Dok.',
        ],
        anxious: [
            'IYA DOK! Itu juga saya rasakan! Jadi apa artinya?! Ini berbahaya kan?!',
            'Oh tidak, berarti ini tanda penyakit serius ya Dok?!',
            'Iya Dok, dan selain itu saya juga merasakan {extraSymptom1} dan {extraSymptom2}!',
        ],
    },

    // ─── Response to treatment/education ───
    treatmentResponse: {
        cooperative: [
            'Baik Dok, saya akan ikuti semuanya. Terima kasih banyak.',
            'Obatnya diminum berapa kali sehari Dok? Saya catat ya.',
            'InsyaAllah saya patuhi Dok. Kapan saya harus kontrol lagi?',
        ],
        skeptical: [
            'Obat ini aman kan Dok? Saya dengar dari YouTube katanya ada efek samping...',
            'Apa benar harus obat Dok? Tidak bisa pakai cara alami saja?',
            'Berapa lama harus minum obat ini? Kalau sudah baikan boleh berhenti kan?',
        ],
        superstitious: [
            'Kalau obat dari Puskesmas nanti bentrok sama jamu saya gimana Dok?',
            'Iya Dok, saya minum. Tapi nanti saya juga tetap minum jamu.',
            'Boleh saya tetap berobat ke Mbah juga Dok?',
        ],
        fatalistic: [
            'Iya Dok.',
            'Mau dikasih obat apa juga sama aja Dok, sudah tua.',
            'Terserah Dokter aja lah.',
        ],
        anxious: [
            'Dok yakin ini bukan sesuatu yang berbahaya? Saya mau tes laboratorium semuanya!',
            'Obatnya tidak ada efek samping kan Dok? Saya takut alergi!',
            'Dok, kalau obatnya tidak mempan, saya harus dirujuk ke RS ya? Jangan sampai terlambat!',
        ],
    },

    // ─── Response to referral ───
    referralResponse: {
        cooperative: [
            'Baik Dok, kalau memang harus ke RS, saya siap.',
            'Saya percaya keputusan Dokter. Tolong dibantu surat rujukannya.',
            'Terima kasih Dok, saya akan berangkat secepatnya.',
        ],
        skeptical: [
            'Kenapa harus ke RS Dok? Tidak bisa ditangani di sini?',
            'Dok, RS mana yang paling bagus untuk kasus saya? Saya mau yang terbaik.',
            'Apakah ini benar-benar perlu Dok? Saya tidak mau operasi yang tidak perlu.',
        ],
        superstitious: [
            'Jangan Dok, RS itu tempat orang meninggal. Saya mau pulih di rumah saja.',
            'Saya takut Dok kalau ke RS. Lebih baik saya ke orang pintar.',
            'Apakah... tidak bisa pakai jamu saja Dok?',
        ],
        fatalistic: [
            'Kalau sudah waktunya ya sudah Dok.',
            'Tidak usah ke RS Dok, sudah takdir.',
            'Mau dirujuk juga percuma Dok.',
        ],
        anxious: [
            'HARUS DIRUJUK?! Berarti penyakit saya serius ya Dok?!',
            'Dok, saya harus ke RS sekarang juga ya? Saya panik!',
            'Oh tidak... saya sudah curiga ini serius. RS mana yang paling dekat Dok?!',
        ],
    },

    // ─── Home visit / behavioral intervention response ───
    homeVisitResponse: {
        cooperative: [
            'Silakan masuk Dok. Ada yang bisa saya bantu?',
            'Terima kasih sudah berkunjung. Kami senang dikunjungi Puskesmas.',
            'Aduh Dok repot-repot. Mari silakan duduk.',
        ],
        skeptical: [
            'Ada apa ya Dok? Saya sehat kok.',
            'Oh dari Puskesmas. Kalau soal penyuluhan, saya sudah tahu semua itu Dok.',
            'Dok mau periksa apa? Saya sibuk sebenarnya.',
        ],
        superstitious: [
            'Silakan Dok, tapi kalau soal jamu saya, itu sudah tradisi keluarga.',
            'Saya sudah sehat Dok, sudah minum ramuan Mbah.',
            'Dok mau kasih obat lagi? Saya masih punya yang kemarin belum habis.',
        ],
        fatalistic: [
            'Iya Dok, masuk.',
            'Mau apa Dok?',
            'Silakan, tapi saya tidak yakin ada gunanya.',
        ],
        anxious: [
            'Dok! Kebetulan! Saya mau tanya soal kesehatan anak saya!',
            'Dok datang karena ada masalah kesehatan di RT ini ya? Keluarga saya aman kan?!',
            'Alhamdulillah Dokter berkunjung. Saya banyak pertanyaan!',
        ],
    },
};

// ═══════════════════════════════════════════════════════════════
// HELPER — Get random dialog for a personality and situation
// ═══════════════════════════════════════════════════════════════

/**
 * Get a random dialog line for a personality type in a given situation.
 * @param {string} situation - Key from DIALOG_VARIATIONS (e.g. 'greeting')
 * @param {string} personality - Personality type (e.g. 'superstitious')
 * @param {object} vars - Template variables to fill in (e.g. { symptom: 'batuk' })
 * @returns {string} A dialog line with variables filled in
 */
export function getDialog(situation, personality, vars = {}) {
    const options = DIALOG_VARIATIONS[situation]?.[personality];
    if (!options || options.length === 0) return '';

    let line = options[Math.floor(Math.random() * options.length)];

    // Fill in template variables
    for (const [key, value] of Object.entries(vars)) {
        line = line.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    return line;
}
