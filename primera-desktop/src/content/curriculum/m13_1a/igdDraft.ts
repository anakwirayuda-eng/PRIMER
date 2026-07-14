import type { KasusIgd } from '../../types'

export const M13_1A_IGD_DRAFTS: KasusIgd[] = [
  {
    id: 'igd_stemi_anterior_hipoksemik',
    nama: 'STEMI Anterior dengan Hipoksemia',
    icd10: 'I21.0',
    skdi: '3B',
    pembuka:
      'Seorang laki-laki dibawa ke ruang tindakan karena nyeri dada menekan sejak 35 menit. ' +
      'Keringat dingin membasahi bajunya, nyeri menjalar ke lengan kiri, dan ia tampak sesak.',
    demografi: { usiaMin: 45, usiaMax: 70, jenisKelamin: 'L' },
    vitalAwal: { td: '104/68', nadi: 108, rr: 26, suhu: 36.5, spo2: 88 },
    stabilitasAwal: 48,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Nyeri dada tipikal >20 menit + elevasi ST anterior adalah STEMI sampai terbukti lain. Lakukan ABC, monitor, akses IV, EKG 12 sadapan dalam <=10 menit, dan oksigen karena SpO2 88% (bukan rutin pada pasien normoksemik). Beri aspirin kunyah 160-320 mg bila tidak alergi/perdarahan aktif, lalu aktifkan transfer emergensi ke jejaring reperfusi tanpa menunggu troponin atau hilangnya nyeri.',
    langkah: [
      {
        id: 'stemi_1',
        narasi:
          'Pasien pucat, nyeri 9/10, SpO2 88%, dan masih sadar. Langkah awal paling tepat?',
        pilihan: [
          {
            id: 'a',
            label: 'ABC + monitor/akses IV, oksigen karena hipoksemia, dan EKG 12 sadapan segera',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Stabilkan ABC dan dokumentasikan EKG secepatnya; hipoksemia pada kasus ini adalah indikasi oksigen nyata.',
          },
          {
            id: 'b',
            label: 'Pasang monitor dan akses IV, lalu tunggu troponin sebelum merekam EKG',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Urutan ini tetap berbahaya. Monitor dan akses IV benar, tetapi EKG dalam <=10 menit tidak boleh menunggu biomarker.',
          },
          {
            id: 'c',
            label: 'Monitor dan EKG segera, tetapi tunda oksigen karena oksigen tidak rutin pada STEMI',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Prinsip tanpa oksigen rutin berlaku pada normoksemia. SpO2 88% adalah hipoksemia nyata dan harus dikoreksi.',
          },
        ],
      },
      {
        id: 'stemi_2',
        narasi:
          'EKG menunjukkan elevasi ST V1-V4. Pasien menyangkal alergi aspirin, perdarahan aktif, dan riwayat perdarahan intrakranial.',
        pilihan: [
          {
            id: 'a',
            label: 'Beri aspirin tidak bersalut 160-320 mg untuk dikunyah',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Aspirin kunyah diberikan segera bila tidak ada kontraindikasi sambil jalur reperfusi diaktifkan.',
          },
          {
            id: 'b',
            label: 'Beri aspirin salut enterik 80 mg untuk ditelan utuh',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Aspirin memang tepat, tetapi sediaan, dosis, dan cara ini memperlambat serta mengurangi loading awal yang dibutuhkan.',
          },
          {
            id: 'c',
            label: 'Beri nitrat lebih dahulu dan tunda aspirin sampai respons tekanan darah dinilai',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Nitrat dapat dipertimbangkan secara bersyarat, tetapi tidak menggantikan atau menunda aspirin loading dan aktivasi jejaring reperfusi.',
          },
        ],
      },
      {
        id: 'stemi_3',
        narasi:
          'Nyeri masih ada, tekanan darah 100/66, dan ambulans jejaring reperfusi dapat tiba dalam 12 menit. Apa langkah berikutnya?',
        pilihan: [
          {
            id: 'a',
            label: 'Aktifkan rujuk emergensi ke RS reperfusi, kirim EKG/SBAR, terapi dan monitor tetap berjalan',
            benar: true,
            efekStabilitas: 18,
            respons:
              'Tepat. Waktu iskemik harus dipangkas; transfer terpantau dimulai tanpa menunggu troponin atau perbaikan total.',
          },
          {
            id: 'b',
            label: 'Rujuk ke RS terdekat yang punya penyakit dalam tanpa memastikan kemampuan reperfusi',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Dekat saja tidak cukup. Tujuan harus berada dalam jejaring STEMI dan mampu menjalankan strategi reperfusi yang telah disepakati.',
          },
          {
            id: 'c',
            label: 'Observasi dua jam di FKTP dengan EKG dan troponin serial sambil menunggu kepastian tempat tidur',
            benar: false,
            efekStabilitas: -25,
            respons:
              'EKG sudah menunjukkan STEMI. Observasi serial di FKTP memperpanjang waktu iskemik; koordinasi tempat berjalan paralel dengan transfer emergensi.',
          },
        ],
      },
    ],
  },
]
