import type { SkenarioKunjungan } from '../../types'

export interface M13UkmDraft {
  familyId: string
  scenario: SkenarioKunjungan
}

export const M13_1A_UKM_DRAFTS: M13UkmDraft[] = [
  {
    familyId: 'keluarga_gunawan',
    scenario: {
      id: 'gunawan_k2',
      judul: 'Kabin Truk Tanpa Kretek',
      pembuka:
        'Pak Gunawan menepati janji datang setelah rute Solo. Ia belum bebas rokok: tiga hari sempat nol, ' +
        'lalu kembali merokok saat antre bongkar muat tengah malam. "Di rumah saya bisa menjauh, Dok. ' +
        'Di kabin, rokok seperti rekan kerja," katanya. Kali ini kalian bertemu di garasi, tepat di depan truknya.',
      target: ['tidak_merokok'],
      hambatanSebenarnya: 'kesempatan',
      petunjukHambatan:
        'Niat berhenti sudah ada dan Pak Gunawan mampu menyebut dampak rokok pada Dimas. Kekambuhan muncul ' +
        'pada situasi yang sangat spesifik: rute malam, kopi, antrean panjang, teman sopir yang menawarkan, ' +
        'serta bungkus rokok yang tetap disimpan di kabin. Yang belum dibangun adalah lingkungan dan rencana ' +
        'menghadapi craving, bukan ceramah tambahan. Riwayat dua bungkus per hari tetap menuntut penilaian ' +
        'ketergantungan, withdrawal, dan kebutuhan farmakoterapi di UBM; skenario ini hanya memfokuskan lapisan kesempatan.',
      hotspot: [
        {
          id: 'gk2_h1',
          label: 'Bungkus kretek di saku pintu',
          narasi:
            'Satu bungkus terbuka terselip sejengkal dari tangan pengemudi. "Buat jaga-jaga kalau ngantuk," ' +
            'kata Pak Gunawan, meski ia membawa pulang termos kopi penuh.',
          indikator: 'tidak_merokok',
          x: 22,
          y: 56,
        },
        {
          id: 'gk2_h2',
          label: 'Asbak menyatu dengan cup holder',
          narasi:
            'Abu lama masih melekat di cup holder. Bau asap tertinggal di kabin bahkan saat tak ada rokok menyala.',
          indikator: 'tidak_merokok',
          x: 48,
          y: 63,
        },
        {
          id: 'gk2_h3',
          label: 'Jadwal rute malam tanpa jeda terencana',
          narasi:
            'Surat jalan menunjukkan dua blok mengemudi panjang melewati tengah malam. Tidak ada tanda kapan ' +
            'berhenti, berjalan, minum, atau menelepon rumah.',
          x: 72,
          y: 32,
        },
        {
          id: 'gk2_h4',
          label: 'Foto Dimas di pelindung matahari',
          narasi:
            'Foto Dimas memakai seragam sekolah dijepit di atas kemudi. Di belakangnya tertulis dengan spidol: ' +
            '"Bapak pulang jangan bau rokok."',
          indikator: 'tidak_merokok',
          x: 55,
          y: 16,
        },
      ],
      dialog: [
        {
          id: 'gk2_d1',
          narasi:
            '"Tiga hari pertama bisa, Dok. Yang menjatuhkan saya itu antre bongkar muat jam dua pagi. Semua ' +
            'orang merokok dan saya takut mengantuk kalau menolak."',
          pilihan: [
            {
              id: 'gk2_d1_a',
              teks:
                '"Tiga hari nol itu bukti Anda bisa. Mari bedah jam dua pagi itu: tanda craving-nya apa, siapa ' +
                'yang menawarkan, dan pengganti lima menit pertama yang paling mungkin Anda lakukan?"',
              gaya: 'refleksi',
              respons:
                'Pak Gunawan menunjuk urutannya sendiri: kopi habis, teman mengetuk kaca, lalu tangan otomatis ' +
                'meraih saku pintu. "Kalau bungkusnya tidak ada dan saya telepon rumah sebentar, mungkin lewat, Dok."',
              efekTrust: 2,
              tepat: true,
              catatanPedagogis:
                'Validasi capaian kecil, lalu lakukan functional analysis terhadap pemicu, rutinitas, dan imbalan.',
            },
            {
              id: 'gk2_d1_b',
              teks: '"Kita turunkan satu batang setiap rute malam. Pemicu dan isi kabin tidak perlu diubah dulu."',
              gaya: 'edukasi',
              respons:
                'Targetnya terdengar terukur, tetapi bungkus tetap sejengkal dari tangan dan urutan pemicu tidak pernah dibedah.',
              efekTrust: 0,
              tepat: false,
              catatanPedagogis: 'Pengurangan tanpa functional analysis atau stimulus control tidak menjawab pola relaps utama.',
            },
            {
              id: 'gk2_d1_c',
              teks: '"Kita tetapkan tanggal berhenti baru malam ini dan minta keluarga mengawasi, lalu lihat hasilnya."',
              gaya: 'edukasi',
              respons:
                'Ia bersedia memilih tanggal, tetapi tidak tahu apa yang harus dilakukan saat kopi habis dan teman mengetuk kaca.',
              efekTrust: 0,
              tepat: false,
              catatanPedagogis: 'Quit date tanpa rencana menghadapi episode relaps hanya memindahkan kalender.',
            },
          ],
        },
        {
          id: 'gk2_d2',
          narasi:
            '"Kalau teman menawarkan, saya sungkan. Mereka bilang saya sekarang sok sehat. Bagaimana menolaknya ' +
            'tanpa ceramah ke orang lain?"',
          pilihan: [
            {
              id: 'gk2_d2_a',
              teks:
                '"Kita buat satu kalimat pendek milik Anda sendiri. Misalnya: saya sedang berhenti karena napas ' +
                'anak saya; temani saya ngopi saja. Kalimat mana yang terasa alami?"',
              gaya: 'empati',
              respons:
                'Ia mencoba dua kali lalu tertawa. "Saya pensiun kretek, bos. Temani kopi saja." Kalimat itu ' +
                'terdengar seperti dirinya, bukan poster Puskesmas.',
              efekTrust: 2,
              tepat: true,
              catatanPedagogis: 'Latihan respons sosial spesifik lebih operasional daripada nasihat umum.',
            },
            {
              id: 'gk2_d2_b',
              teks: '"Bagikan leaflet bahaya rokok ke regu dan minta mereka berhenti menawarkan kepada Anda."',
              gaya: 'edukasi',
              respons:
                'Ia mengangguk ragu. Rencana itu bergantung pada perubahan semua orang dan belum memberi kalimat yang bisa ia ucapkan saat tawaran berikut datang.',
              efekTrust: 0,
              tepat: false,
              catatanPedagogis: 'Dukungan rekan baik, tetapi pasien tetap memerlukan keterampilan menolak yang dapat ia kendalikan sendiri.',
            },
            {
              id: 'gk2_d2_c',
              teks: '"Kurangi waktu mengobrol saat bongkar muat agar peluang ditawari rokok lebih sedikit."',
              gaya: 'edukasi',
              respons:
                'Ia bisa menjauh sebentar, tetapi tetap satu regu dan tawaran akan muncul lagi saat koordinasi kerja.',
              efekTrust: 0,
              tepat: false,
              catatanPedagogis: 'Mengurangi paparan dapat membantu, tetapi bukan pengganti rehearsal respons sosial.',
            },
          ],
        },
        {
          id: 'gk2_d3',
          narasi:
            'Pak Gunawan memegang bungkus di saku pintu. "Kalau saya buang sekarang, apa rencana saya saat ' +
            'ngantuk dan craving datang bersamaan?"',
          pilihan: [
            {
              id: 'gk2_d3_a',
              teks:
                '"Kita susun paket rute malam: berhenti di titik aman tiap dua jam, jalan lima menit, air/kopi ' +
                'tanpa rokok, permen karet, telepon rumah saat craving, dan jadwal tindak lanjut UBM."',
              gaya: 'refleksi',
              respons:
                'Ia menyalin lima langkah itu ke belakang surat jalan. Bungkus kretek masuk kantong sampah, ' +
                'bukan saku pintu. "Kalau mengantuk berat, saya berhenti. Rokok bukan rem darurat."',
              efekTrust: 2,
              tepat: true,
              catatanPedagogis:
                'Rencana coping menggabungkan keselamatan berkendara, stimulus control, dukungan sosial, dan follow-up.',
            },
            {
              id: 'gk2_d3_b',
              teks: '"Siapkan kopi lebih kuat dan permen karet agar tetap bisa menyetir saat craving atau mengantuk."',
              gaya: 'edukasi',
              respons:
                'Permen dapat membantu craving, tetapi kopi bukan pengganti berhenti di tempat aman saat kantuk berat.',
              efekTrust: -1,
              tepat: false,
              catatanPedagogis: 'Rencana berhenti merokok tidak boleh menormalisasi mengemudi saat mengantuk.',
            },
            {
              id: 'gk2_d3_c',
              teks: '"Kurangi satu batang per malam dan simpan bungkus di laci tertutup supaya tidak terlihat."',
              gaya: 'edukasi',
              respons:
                'Bungkus memang tidak terlihat, tetapi tetap berada di kabin dan mudah dijangkau pada urutan pemicu yang sama.',
              efekTrust: 0,
              tepat: false,
              catatanPedagogis: 'Stimulus control yang setengah hati mempertahankan akses pada saat kontrol diri paling lemah.',
            },
          ],
        },
      ],
      intervensi: [
        {
          id: 'gk2_i1',
          nama: 'Paket Kabin Bebas Asap + Rencana Rute Malam',
          deskripsi:
            'Kosongkan rokok/asbak dari kabin, bersihkan bau asap, tandai titik istirahat aman, siapkan pengganti ' +
            'oral, latihan menolak tawaran, dukungan telepon keluarga, dan jadwal konseling UBM.',
          cocokUntuk: ['kesempatan'],
          hasilNarasi:
            'Kabin berubah dari mesin pemicu menjadi ruang kerja yang mendukung keputusan baru. Pak Gunawan ' +
            'punya langkah konkret untuk craving dan mengantuk tanpa menukar keselamatan dengan rokok.',
        },
        {
          id: 'gk2_i2',
          nama: 'Quit Date + Edukasi Terstruktur',
          deskripsi: 'Tetapkan tanggal berhenti baru dan ulangi edukasi dampak rokok serta manfaat berhenti.',
          cocokUntuk: ['kapabilitas'],
          hasilNarasi:
            'Tanggalnya jelas dan pengetahuannya bertambah, tetapi malam berikutnya bungkus di saku pintu tetap menang karena situasi pemicu belum berubah.',
        },
        {
          id: 'gk2_i3',
          nama: 'Pengurangan Bertahap di Kabin Lama',
          deskripsi: 'Kurangi satu batang per rute tanpa membuang bungkus, membersihkan asbak, atau melatih respons terhadap tawaran.',
          cocokUntuk: ['motivasi'],
          hasilNarasi:
            'Jumlah batang sempat turun, tetapi kabin dan urutan kebiasaan tetap menyalakan relaps saat antrean malam memanjang.',
        },
      ],
      penutupBerhasil:
        'Pak Gunawan mengelap cup holder sampai abu terakhir hilang. Foto Dimas tetap di atas kemudi, tetapi ' +
        'kini di belakangnya ada jadwal istirahat dan nomor konselor UBM. "Kalau ngantuk, menepi. Kalau kangen ' +
        'rokok, telepon rumah. Dua-duanya lebih murah daripada masuk IGD," katanya.',
      penutupGagal:
        'Bungkus itu kembali ke saku pintu. Pak Gunawan pulang membawa pengetahuan yang sudah ia miliki dan ' +
        'kabin yang sama persis; rute malam berikutnya tinggal menekan tombol kebiasaan lama.',
    },
  },
]
