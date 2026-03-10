/**
 * @reflection
 * [IDENTITY]: digestive_variations
 * [PURPOSE]: Case variations for Digestive diseases (Gastroenteritis, etc.).
 * [STATE]: Stable
 * [ANCHOR]: digestive_variations
 * [DEPENDS_ON]: None
 */
export const digestive_variations = {
    // ═══════════════════════════════════════════════════════════════
    // DIGESTIVE
    // ═══════════════════════════════════════════════════════════════
    acute_gastroenteritis: {
        q_main: {
            low_education: 'Mencret-mencret terus dok, perut mules melilit kayak diperas.',
            high_education: 'Saya mengalami diare cair profuse sejak semalam, frekuensinya sering.',
            skeptical: 'Diare.',
            anxious: 'Dok saya diare air terus, takut dehidrasi kayak di berita, harus diinfus nggak?',
            elderly: 'Perut sakit Nak Dokter, buang air terus sampai lemes.',
            child_proxy: 'Anaknya mencret-mencret Bu Dok, kasian pantatnya lecet.'
        },
        q_freq: {
            low_education: 'Waduh nggak kehitung dok, bolak-balik WC terus.',
            high_education: 'Sekitar 6-7 kali frekuensinya dok.',
            skeptical: 'Banyak.',
            anxious: 'Udah lebih 10 kali Dok! Saya itungin terus, takut banget kehabisan cairan!',
            elderly: 'Sering banget Nak, sampai nggak sempat pakai celana.'
        },
        q_stool_desc: {
            low_education: 'Air tok dok, kuning, nggak ada darahnya.',
            high_education: 'Konsistensinya cair (watery), tanpa lendir atau darah.',
            skeptical: 'Cair biasa.'
        },
        q_food: {
            low_education: 'Jajan bakso pentol di depan SD dok, sambalnya banyak.',
            high_education: 'Sepertinya keracunan makanan (food poisoning), kemarin saya makan street food.',
            skeptical: 'Makan biasa aja.',
            anxious: 'Kayaknya salah makan dok... aduh saya nyesel banget jajan sembarangan!',
            elderly: 'Makan sayur santan kemarin sore Nak, mungkin sudah basi.'
        }
    }
};
