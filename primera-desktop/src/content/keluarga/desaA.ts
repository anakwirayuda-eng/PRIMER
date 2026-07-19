/**
 * KELUARGA BINAAN DESA A — tiga keluarga bernama, tiga arc dua-kunjungan.
 *
 * keluarga_wulan  : Golden Loop game. Hipertensi tak berobat karena takut obat
 *                   merusak ginjal → MI → terkontrol ATAU stroke subuh (karma D+6).
 * keluarga_santoso: TB putus obat bulan ke-2 karena malu ketahuan tetangga.
 * keluarga_ketut  : bayi 8 bulan belum imunisasi lengkap, ibu muda ragu vaksin,
 *                   RW terpencil.
 *
 * Konvensi id: {keluarga}{kunjungan}_{jenis}{urut} — mis. wk1_h2 = wulan
 * kunjungan 1, hotspot 2. Ground truth gerbang kejujuran selalu 'tidak';
 * kebohongan mengaku 'ya' dan hotspot babak 1 menyimpan kontradiksinya.
 */

import type { KeluargaBinaan } from '../types'

export const KELUARGA_DESA_A: KeluargaBinaan[] = [
  /* =========================================================================
   * KELUARGA WULAN — RW 5 (sedang), rentan
   * ======================================================================= */
  {
    id: 'keluarga_wulan',
    namaKeluarga: 'Keluarga Bu Wulan',
    rw: 5,
    jarakMenit: 25,
    ekonomi: 'rentan',
    anggota: [
      {
        nama: 'Pak Darto',
        usia: 61,
        jenisKelamin: 'L',
        peran: 'kepala',
        kondisi: ['perokok_aktif'],
      },
      {
        nama: 'Bu Wulan',
        usia: 58,
        jenisKelamin: 'P',
        peran: 'istri',
        kondisi: ['hipertensi_esensial'],
      },
    ],
    // Tanpa balita & tanpa ibu bersalin: 4 indikator KIA = na. Bu Wulan 58 th
    // (di luar usia subur) → kb na. Tak ada TB / gangguan jiwa → na.
    indikatorAwal: {
      kb: 'na',
      persalinan_faskes: 'na',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'tidak',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Bu Wulan (58) hipertensi menahun tapi berhenti berobat — ia yakin obat darah tinggi ' +
        'merusak ginjal. Pak Darto merokok di ruang tamu, dan anak semata wayang mereka merantau ke Kalimantan.',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "Obat Itu Bikin Ginjal Rusak, Dok"
         * Hambatan sebenarnya: MOTIVASI (keyakinan salah + takut).
         * Karma: stroke iskemik D+6 bila arc diabaikan/gagal.
         * -------------------------------------------------------------- */
        {
          id: 'wulan_k1',
          judul: 'Obat Itu Bikin Ginjal Rusak, Dok',
          pembuka:
            'Rumah papan berhalaman sempit itu wangi minyak kayu putih. Bu Wulan menyambut sambil ' +
            'memijit tengkuknya, lalu buru-buru merapikan tumpukan koran di kursi tamu. ' +
            '"Aduh, Dokter kok repot-repot ke sini. Duduk, duduk... saya bikinkan teh dulu."',
          target: ['hipertensi_berobat'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Obat dari Puskesmas masih utuh tersegel, tapi jamu rebusan dibuat tiap pagi — Bu Wulan bukan ' +
            'tak sanggup atau tak sempat berobat, ia TAKUT: tetangganya cuci darah, dan grup pengajian ' +
            'menyalahkan "obat kimia". Ini soal keyakinan, bukan akses atau pengetahuan cara minum.',
          pilihanIngatkan: {
            prompt: 'Sebelum pamit, rangkum tindakan Bu Wulan dan waktu bertemu lagi tanpa mengambil alih keputusannya.',
            pilihan: [
              {
                id: 'wk1_ingatkan_tepat',
                teks:
                  '"Bu Wulan, jalankan kesepakatan obat yang Ibu pilih, catat bengkak atau keluhan, dan kita bertemu lagi {jadwal} untuk cek tekanan darah serta menilai obatnya bersama."',
                tepat: true,
                respons:
                  'Bu Wulan mengulang pelan: obat sesuai kesepakatan, catat keluhan, lalu bertemu lagi pada hari yang sudah disebut.',
              },
              {
                id: 'wk1_ingatkan_umum',
                teks: '"Pokoknya obatnya diminum teratur ya, Bu. Nanti kalau sempat datang lagi ke Puskesmas."',
                tepat: false,
                respons: 'Bu Wulan mengangguk sopan, tetapi tidak dapat menyebut kapan atau apa yang harus ia pantau.',
                catatanPedagogis:
                  'Pengingat tanpa tindakan terukur dan waktu ulang mudah berubah menjadi "iya, Dok" yang tidak operasional.',
              },
              {
                id: 'wk1_ingatkan_ancam',
                teks: '"Kalau masih berhenti obat, risiko stroke Ibu tanggung sendiri. Saya sudah mengingatkan."',
                tepat: false,
                respons: 'Bu Wulan menarik kembali tangannya dari kantong obat dan menutup percakapan dengan senyum kaku.',
                catatanPedagogis:
                  'Ingatkan bukan ancaman. Penutupan SAJI harus mengulang kesepakatan dan akses tindak lanjut, bukan memindahkan rasa bersalah.',
              },
            ],
          },
          hotspot: [
            {
              id: 'wk1_h1',
              label: 'Kantong obat Puskesmas masih tersegel',
              narasi:
                'Di atas lemari, kantong plastik obat berlogo Puskesmas tergeletak berdebu. Strip amlodipine ' +
                'di dalamnya masih utuh — tanggal penyerahannya dua bulan lalu.',
              indikator: 'hipertensi_berobat',
              x: 72,
              y: 30,
            },
            {
              id: 'wk1_h2',
              label: 'Asbak penuh di meja tamu',
              narasi:
                'Asbak kaca di meja tamu penuh puntung kretek, beberapa masih baru. Di sebelahnya ' +
                'ada korek gas dan bungkus rokok yang tinggal separuh.',
              indikator: 'tidak_merokok',
              x: 38,
              y: 66,
            },
            {
              id: 'wk1_h3',
              label: 'Panci rebusan daun di dapur',
              narasi:
                'Di kompor, panci kecil berisi rebusan daun sirsak dan seledri masih hangat. ' +
                '"Itu obat darah tinggi saya, Dok. Alami, tidak merusak badan," kata Bu Wulan dari belakang.',
              x: 88,
              y: 55,
            },
            {
              id: 'wk1_h4',
              label: 'Foto wisuda di dinding',
              narasi:
                'Foto seorang pemuda bertoga tergantung miring di dinding. "Itu Anto, anak saya satu-satunya. ' +
                'Kerja di Balikpapan sekarang. Pulangnya setahun sekali, itu pun kalau tiketnya dapat."',
              x: 55,
              y: 22,
            },
            {
              id: 'wk1_h5',
              label: 'Kartu Posyandu Lansia terselip di toples',
              narasi:
                'Kartu pemeriksaan Posyandu Lansia terselip di bawah toples kerupuk. Kolom tekanan darah ' +
                'terakhir tertulis 178/104 — tiga bulan lalu, lalu kosong.',
              x: 20,
              y: 48,
            },
          ],
          dialog: [
            {
              id: 'wk1_d1',
              narasi:
                'Bu Wulan menuang teh, lalu duduk sambil memegangi tengkuknya. "Sebenarnya kepala saya ' +
                'sering cengeng, Dok, berat di sini. Tapi saya sudah kapok obat darah tinggi. Tetangga saya, ' +
                'Bu Karsih, rajin minum obat — sekarang malah cuci darah seminggu dua kali. Obat itu bikin ' +
                'ginjal rusak, Dok."',
              pilihan: [
                {
                  id: 'wk1_d1_a',
                  teks:
                    '"Jadi Ibu berhenti minum obat karena khawatir nasib Ibu jadi seperti Bu Karsih... ' +
                    'takut ginjalnya rusak, ya, Bu?"',
                  gaya: 'refleksi',
                  respons:
                    'Bu Wulan mengangguk cepat, matanya berkaca. "Iya, Dok! Persis. Saya ngeri sekali. ' +
                    'Bu Karsih itu teman pengajian saya. Lihat dia sekarang kurus, tangannya bengkak bekas selang... ' +
                    'Saya masih pengin lihat Anto nikah, Dok."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Refleksi perasaan (OARS): memantulkan ketakutan tanpa menghakimi membuat pasien merasa ' +
                    'didengar — pintu masuk MI sebelum koreksi informasi apa pun.',
                },
                {
                  id: 'wk1_d1_b',
                  teks:
                    '"Itu keliru, Bu. Justru kebalikannya — darah tinggi yang TIDAK diobati itulah yang ' +
                    'merusak ginjal. Bu Karsih cuci darah ya karena hipertensinya, bukan karena obatnya."',
                  gaya: 'menggurui',
                  respons:
                    'Wajah Bu Wulan mengeras. Ia menuang teh pelan-pelan, lama sekali. "Ya... Dokter kan ' +
                    'belajarnya begitu. Tapi yang saya lihat sendiri ya Bu Karsih itu." Ia mengalihkan ' +
                    'pandangan ke jendela.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Secara medis benar, secara MI fatal. Membantah langsung (righting reflex) membuat pasien ' +
                    'mempertahankan keyakinannya makin keras. Fakta yang sama bisa disampaikan NANTI — setelah diizinkan.',
                },
                {
                  id: 'wk1_d1_c',
                  teks:
                    '"Begini, Bu, saya jelaskan cara kerja amlodipine dulu ya. Obat ini melebarkan pembuluh ' +
                    'darah, dibuang lewat hati, bukan ginjal..."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya... iya, Dok," Bu Wulan mengangguk sopan sambil menata gelas, jelas tidak menyimak. ' +
                    '"Tapi kata Ustadzah Umi, yang alami-alami itu lebih aman buat orang tua."',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Edukasi yang benar tapi prematur: sebelum pasien merasa dipahami, penjelasan farmakologi ' +
                    'memantul begitu saja. Urutan MI: dengarkan dulu, minta izin, baru beri informasi.',
                },
              ],
            },
            {
              id: 'wk1_d2',
              narasi:
                'Dari kursi rotan di pojok, Pak Darto ikut menimpali sambil melinting rokok. "Wong ndeso itu ' +
                'percayanya sama yang kelihatan, Dok. Di grup WA pengajiannya bojoku itu tiap hari ada saja: ' +
                'obat kimia lah, racun lah. Saya sudah bilang jangan percaya, malah saya yang disemprot."',
              pilihan: [
                {
                  id: 'wk1_d2_a',
                  teks:
                    '"Boleh saya tahu lebih banyak, Bu? Selain cerita Bu Karsih dan grup pengajian, ' +
                    'apa lagi yang membuat Ibu mantap berhenti?"',
                  gaya: 'empati',
                  respons:
                    'Bu Wulan menghela napas panjang. "Dulu pernah saya minum obatnya seminggu, Dok. Kaki saya ' +
                    'bengkak, kencing jadi sering. Saya pikir, nah kan — mulai rusak ginjalnya. Sejak itu saya ' +
                    'ganti rebusan daun. Badan rasanya ya sama saja, jadi buat apa obat?"',
                  efekTrust: 1,
                  tepat: true,
                  catatanPedagogis:
                    'Pertanyaan terbuka menggali akar keyakinan. Terungkap petunjuk klinis penting: bengkak kaki ' +
                    'adalah efek samping amlodipine yang dikenal — ada bahan nyata untuk dibahas, bukan sekadar hoaks.',
                },
                {
                  id: 'wk1_d2_b',
                  teks:
                    '"Grup WA itu sumbernya tidak jelas, Bu. Ibu lebih percaya orang tidak dikenal di HP ' +
                    'daripada dokter yang sekolahnya bertahun-tahun?"',
                  gaya: 'menghakimi',
                  respons:
                    'Hening sejenak. Pak Darto berhenti melinting. Bu Wulan tersenyum kecut. "Ya bukan begitu, ' +
                    'Dok... Ustadzah Umi itu orang baik. Sudah, tehnya diminum, nanti keburu dingin."',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Merendahkan sumber yang dipercayai pasien = merendahkan pasien dan komunitasnya. ' +
                    'Trust anjlok, dan topik langsung ditutup dengan basa-basi teh.',
                },
                {
                  id: 'wk1_d2_c',
                  teks: '"Ah, grup WA memang begitu, Bu. Tidak usah terlalu dipikirkan, yang penting sehat."',
                  gaya: 'edukasi',
                  respons:
                    '"Nah iya to, Dok," Bu Wulan tertawa lega. "Yang penting sehat. Saya kan merasa sehat-sehat ' +
                    'saja ini." Percakapan meluncur ke harga cabai di pasar.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Menenangkan semu: terasa ramah, tapi justru mengamini logika "merasa sehat = tidak perlu obat" — ' +
                    'jebakan paling berbahaya pada hipertensi, si pembunuh senyap.',
                },
              ],
            },
            {
              id: 'wk1_d3',
              narasi:
                'Teh sudah setengah gelas. Bu Wulan tampak lebih santai, kakinya tidak lagi gemetar ' +
                'menggoyang lantai. Ini saatnya menanyakan hal yang sebenarnya: obat itu sendiri.',
              pilihan: [
                {
                  id: 'wk1_d3_a',
                  teks:
                    '"Bu, saya tidak akan memarahi Ibu, janji. Obat yang dari Puskesmas kemarin itu... ' +
                    'sebenarnya masih diminum, atau sudah berhenti sama sekali?"',
                  gaya: 'empati',
                  respons:
                    'Bu Wulan menunduk, memilin ujung dasternya. "Sudah dua bulan tidak saya sentuh, Dok. ' +
                    'Masih utuh di atas lemari itu. Saya... takut. Tiap mau minum, kebayang selangnya Bu Karsih."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'hipertensi_berobat',
                    ambangTrust: 5,
                    responsBohong:
                      '"Masih, Dok, masih saya minum kok... ya kadang-kadang, kalau pas kepalanya cengeng. ' +
                      'Kalau badan enak ya saya istirahatkan dulu, kasihan ginjalnya."',
                  },
                  catatanPedagogis:
                    'Gerbang kejujuran: pertanyaan sensitif hanya dijawab jujur bila trust cukup. Jawaban ' +
                    '"kadang-kadang kalau pusing" terdengar patuh — bandingkan dengan kantong obat tersegel di atas lemari.',
                },
                {
                  id: 'wk1_d3_b',
                  teks:
                    '"Saya tadi lihat kantong obatnya masih tersegel di atas lemari, Bu. Jadi selama ini ' +
                    'Ibu bohong ke petugas Puskesmas waktu ambil obat?"',
                  gaya: 'menghakimi',
                  respons:
                    'Bu Wulan tersentak, lalu buru-buru berdiri merapikan gelas. "Dokter ini... ngecek-ngecek ' +
                    'rumah orang." Nada bercandanya tidak menutupi matanya yang tersinggung. Pak Darto berdehem.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Temuan observasi adalah alat memahami, BUKAN barang bukti untuk menjebak. Menodongkan ' +
                    'kontradiksi seperti interogasi menghancurkan trust yang susah payah dibangun.',
                },
                {
                  id: 'wk1_d3_c',
                  teks:
                    '"Yang penting rebusan daunnya diminum rutin ya, Bu. Nanti kapan-kapan kita cek ' +
                    'tekanan darahnya lagi."',
                  gaya: 'edukasi',
                  respons:
                    '"Nah, Dokter ini pengertian," Bu Wulan sumringah. "Rutin, Dok, tiap pagi. Badan saya ' +
                    'cocok sama yang alami." Kesempatan menanyakan obat lewat begitu saja.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Menghindari topik sulit demi suasana nyaman = kunjungan hangat yang tidak mengubah apa pun. ' +
                    'TD terakhirnya 178/104; kelembutan tanpa arah bisa berakhir di IGD.',
                },
              ],
            },
            {
              id: 'wk1_d4',
              narasi:
                'Angin sore masuk lewat jendela, menggoyang foto wisuda Anto di dinding. Bu Wulan mengikuti ' +
                'arah pandanganmu ke foto itu dan tersenyum. "Tahun depan katanya mau bawa calon istrinya ke sini, Dok."',
              pilihan: [
                {
                  id: 'wk1_d4_a',
                  teks:
                    '"Ibu pengin sehat terus sampai menimang cucu dari Mas Anto, ya. Kalau Ibu berkenan, ' +
                    'boleh saya ceritakan yang saya tahu soal obat, ginjal, dan kaki bengkak itu? Ibu yang putuskan setelahnya."',
                  gaya: 'refleksi',
                  respons:
                    'Bu Wulan memandang foto itu lama. "...Boleh, Dok. Ceritakan. Asal jangan marahi saya." ' +
                    'Ia menarik kursinya lebih dekat — pertama kalinya sore ini ia yang mendekat lebih dulu.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Elicit–provide–elicit: menyambungkan perubahan dengan nilai terdalam pasien (anak, cucu) lalu ' +
                    'MEMINTA IZIN sebelum memberi informasi. Ini pola emas menutup wawancara MI.',
                },
                {
                  id: 'wk1_d4_b',
                  teks:
                    '"Kalau Ibu tetap tidak mau minum obat, bisa-bisa Ibu stroke duluan sebelum Mas Anto ' +
                    'pulang. Mau dijenguk anak di rumah sakit?"',
                  gaya: 'menakut_nakuti',
                  respons:
                    'Senyum Bu Wulan padam seketika. "Kok Dokter ngomongnya begitu..." Pak Darto meletakkan ' +
                    'lintingannya dan menatapmu. Suasana ruang tamu mendadak dingin.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menakut-nakuti lewat hal yang paling disayangi pasien adalah kekerasan verbal berbaju edukasi. ' +
                    'Rasa takut memicu penghindaran — pasien justru makin jauh dari Puskesmas.',
                },
                {
                  id: 'wk1_d4_c',
                  teks:
                    '"Sudah sore, Bu. Intinya: mulai besok obatnya diminum satu kali sehari sesudah makan, ' +
                    'ya. Nanti saya cek lagi minggu depan."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya, Dok, iya. Nanti saya minum," jawab Bu Wulan sambil membereskan gelas — jawaban ' +
                    'otomatis orang desa pada petugas, yang artinya bisa iya bisa tidak.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Instruksi tanpa kesepakatan menghasilkan "iya, Dok" kosong. Kepatuhan tidak lahir dari ' +
                    'perintah, tapi dari keputusan yang dirasa milik pasien sendiri.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'wk1_i1',
              nama: 'Bukti untuk Bu Wulan',
              deskripsi:
                'Sepakati uji coba dua minggu: minum amlodipine tiap malam, catat keluhan, lalu kembali untuk ' +
                'menilai tekanan darah, tolerabilitas, dan pemeriksaan yang memang berindikasi. Jelaskan manfaat-risiko ' +
                'tanpa menjanjikan satu tes dapat membuktikan keamanan absolut, lalu tawarkan silaturahmi ke Bu Hj. Aminah yang sudah lama berobat teratur.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Bu Wulan terdiam mendengar nama Bu Hj. Aminah. "Lho, Bu Haji itu minum obat, to? Kok segar begitu..." ' +
                'Ia menimbang strip amlodipine di tangannya. "Dua minggu ya, Dok. Saya catat kalau ada keluhan, ' +
                'lalu tensi dan obatnya kita nilai lagi bersama. Tidak cuma disuruh percaya."',
            },
            {
              id: 'wk1_i2',
              nama: 'Antar Obat oleh Kader',
              deskripsi:
                'Minta kader RW 5 mengantarkan obat hipertensi ke rumah tiap awal bulan supaya Bu Wulan ' +
                'tidak perlu jalan jauh ke Puskesmas.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Kader rajin mengantar, dan kantong obat kedua kini bertumpuk di atas lemari — sama tersegelnya ' +
                'dengan yang pertama. Jarak tidak pernah jadi soalnya; ketakutannya yang belum tersentuh.',
            },
            {
              id: 'wk1_i3',
              nama: 'Kotak Obat & Jadwal Tempel',
              deskripsi:
                'Buatkan kotak obat harian bersekat dan jadwal minum bergambar yang ditempel di pintu lemari, ' +
                'supaya Bu Wulan tidak bingung dosis dan waktu minum.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Jadwal tempel itu rapi menghiasi lemari — di atas kantong obat yang tetap tersegel. Bu Wulan ' +
                'paham betul CARA minum obat; yang belum ia putuskan adalah MAU. Sasaran intervensimu meleset.',
            },
            {
              id: 'wk1_i4',
              nama: 'Undangan Penyuluhan Prolanis',
              deskripsi:
                'Daftarkan Bu Wulan ke klub Prolanis di Puskesmas: senam bersama dan ceramah kesehatan ' +
                'tiap bulan agar mendapat lingkungan sesama penderita hipertensi.',
              cocokUntuk: ['kesempatan', 'kapabilitas'],
              hasilNarasi:
                'Undangan Prolanis terselip di toples bersama kartu Posyandu Lansia. "Jauh, Dok, dan isinya ' +
                'ceramah obat-obatan lagi," katanya pada kader. Kegiatan bagus, tapi bukan jawaban untuk rasa takutnya.',
            },
          ],
          penutupBerhasil:
            'Di teras, Bu Wulan menggenggam strip amlodipine seperti menggenggam keputusan besar. "Dua minggu, ' +
            'Dok. Terus kita buktikan ginjal saya aman." Pak Darto mengantar sampai pagar dan berbisik, ' +
            '"Baru kali ini dia mau dengar soal obat, Dok. Suwun."',
          penutupGagal:
            'Teh di gelasmu belum habis, tapi percakapan sudah lama selesai. Bu Wulan melepasmu di pintu dengan ' +
            'senyum sopan yang rapat, seperti pagar yang dikunci halus. Di atas lemari, kantong obat itu ' +
            'tetap tersegel — dan tekanan darahnya tetap 178.',
          karma: {
            kasusId: 'stroke_iskemik',
            anggotaIndex: 1,
            jatuhTempoHari: 6,
            narasi:
              'Subuh buta, pintu IGD didorong tergesa: Bu Wulan digotong Pak Darto dan dua tetangga dengan ' +
              'kain sarung sebagai tandu. Bicaranya pelo, lengan kanannya jatuh lunglai tak bisa diangkat. ' +
              '"Semalam dia bilang kepalanya mau pecah, Dok," suara Pak Darto gemetar. "Saya kira masuk angin biasa." ' +
              'Hipertensi yang tidak terkontrol meningkatkan risiko stroke, tetapi waktu kejadian ini tidak dapat dipastikan sebagai akibat tunggal dari satu keputusan atau satu kunjungan yang terlewat.',
          },
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "Sisa Tiga Butir"
         * Bu Wulan sudah mau minum obat; kini terhambat KESEMPATAN:
         * obat hampir habis, kontrol jauh, tak ada yang mengantar.
         * -------------------------------------------------------------- */
        {
          id: 'wulan_k2',
          judul: 'Sisa Tiga Butir',
          pembuka:
            'Dua minggu berlalu. Kali ini Bu Wulan sudah menunggu di teras dengan dua gelas teh — kamu ' +
            'ditunggu, bukan sekadar diterima. "Dok! Pas sekali. Saya mau tanya-tanya," katanya, ' +
            'setengah cerah setengah cemas.',
          target: ['hipertensi_berobat'],
          hambatanSebenarnya: 'kesempatan',
          petunjukHambatan:
            'Obat tinggal tiga butir dan jadwal kontrol kemarin terlewat: angkot ke Puskesmas cuma lewat pagi, ' +
            'Pak Darto harus menunggu tengkulak gabah, dan Bu Wulan tidak berani antre sendirian. Kemauannya ' +
            'sudah tumbuh — jalannya yang belum ada. Ini soal akses, bukan lagi keyakinan.',
          hotspot: [
            {
              id: 'wk2_h1',
              label: 'Strip amlodipine sisa tiga butir',
              narasi:
                'Di atas TV, strip amlodipine tinggal tiga butir, diletakkan rapi di piring kecil bersama ' +
                'segelas air — disiapkan untuk malam nanti. Kantong obat lama yang berdebu sudah tidak ada.',
              indikator: 'hipertensi_berobat',
              x: 62,
              y: 40,
            },
            {
              id: 'wk2_h2',
              label: 'Kalender dengan tanggal dilingkari',
              narasi:
                'Kalender bank di dinding: tanggal kontrol Puskesmas dilingkari spidol merah dan diberi tulisan ' +
                '"KONTROL". Tanggalnya kemarin — dan sudah dicoret dengan garis kecil yang murung.',
              x: 30,
              y: 25,
            },
            {
              id: 'wk2_h3',
              label: 'Bungkus kretek di saku jaket',
              narasi:
                'Jaket Pak Darto tergantung di paku dekat pintu. Dari sakunya menyembul bungkus kretek ' +
                'yang tinggal separuh dan korek gas — padahal asbak di meja tamu sudah hilang.',
              indikator: 'tidak_merokok',
              x: 12,
              y: 52,
            },
            {
              id: 'wk2_h4',
              label: 'Sepeda tua berkarat di samping rumah',
              narasi:
                'Satu-satunya kendaraan di rumah ini: sepeda ontel tua dengan ban kempis dan rantai berkarat. ' +
                'Jarak ke Puskesmas 25 menit — itu kalau naik motor.',
              x: 90,
              y: 70,
            },
            {
              id: 'wk2_h5',
              label: 'Catatan tensi tulisan tangan',
              narasi:
                'Sobekan buku tulis ditempel di pintu lemari: "Rabu 160/95. Sabtu 152/90." Tulisan tangan ' +
                'Bu Wulan, dicatat dari pemeriksaan kader. Angkanya turun — pelan, tapi turun.',
              x: 75,
              y: 58,
            },
          ],
          dialog: [
            {
              id: 'wk2_d1',
              narasi:
                '"Obatnya cocok, Dok. Kepala saya sudah jarang cengeng, kaki juga tidak bengkak seperti dulu," ' +
                'Bu Wulan membuka cerita, lalu suaranya menurun. "Cuma... itu, tinggal tiga. Kemarin jadwal ' +
                'kontrol saya tidak bisa berangkat."',
              pilihan: [
                {
                  id: 'wk2_d1_a',
                  teks:
                    '"Dua minggu rutin tiap malam itu tidak gampang, Bu — dan Ibu berhasil. Nah, cerita dong, ' +
                    'kemarin apa yang membuat Ibu tidak bisa berangkat kontrol?"',
                  gaya: 'refleksi',
                  respons:
                    'Bu Wulan tersipu dipuji, lalu bicara deras: "Angkot ke Puskesmas itu cuma lewat jam enam ' +
                    'pagi, Dok. Kemarin Bapak menunggu tengkulak gabah, tidak bisa mengantar. Mau berangkat ' +
                    'sendiri... saya bingung antrenya, takut salah loket. Ya sudah, tidak jadi."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Afirmasi + pertanyaan terbuka: rayakan keberhasilan kecil dulu, baru gali hambatan. ' +
                    'Jawabannya memetakan masalah dengan gamblang — transportasi, waktu, dan keberanian antre.',
                },
                {
                  id: 'wk2_d1_b',
                  teks:
                    '"Wah, sayang sekali, Bu. Kontrol itu justru yang paling penting. Kalau bolong begini ' +
                    'kan usaha dua minggunya jadi percuma."',
                  gaya: 'menghakimi',
                  respons:
                    'Wajah Bu Wulan langsung layu. "Percuma ya, Dok..." Ia memandangi piring kecil berisi tiga ' +
                    'butir obatnya. Semangat yang tadi menyala di teras itu meredup di depan matamu.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Kata "percuma" pada orang yang baru dua minggu berjuang adalah racun. Satu kalimat menghakimi ' +
                    'bisa membatalkan perubahan yang baru bertunas.',
                },
                {
                  id: 'wk2_d1_c',
                  teks:
                    '"Tidak apa-apa, Bu. Nanti kalau obatnya habis, minum rebusan daunnya dulu saja sementara, ' +
                    'sambil menunggu bisa ke Puskesmas."',
                  gaya: 'edukasi',
                  respons:
                    '"Oh, boleh to, Dok, diselang-seling begitu?" Bu Wulan tampak lega — kelegaan yang salah alamat. ' +
                    '"Berarti tidak usah buru-buru ya kontrolnya."',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Niat menghibur, hasilnya menormalkan putus obat. Setelah amlodipine dihentikan, tekanan darah ' +
                    'umumnya kembali menuju nilai sebelum terapi dalam sekitar satu minggu; amlodipine tidak lazim menimbulkan rebound berbahaya. Risiko utamanya tetap hilangnya kendali tekanan darah dan putusnya tindak lanjut.',
                },
              ],
            },
            {
              id: 'wk2_d2',
              narasi:
                'Pak Darto muncul dari samping rumah membawa karung, wajahnya letih. "Musim panen begini saya ' +
                'tidak bisa ke mana-mana, Dok. Gabah tidak bisa ditinggal. Bojoku mau tak suruh berangkat sendiri, ' +
                'wong antrenya saja dia tidak pernah."',
              pilihan: [
                {
                  id: 'wk2_d2_a',
                  teks:
                    '"Berarti bukan soal tidak mau, tapi memang belum ada jalannya, ya. Coba kita pikirkan ' +
                    'bareng-bareng — kira-kira apa yang paling mungkin untuk Ibu dan Bapak?"',
                  gaya: 'empati',
                  respons:
                    'Pak Darto meletakkan karungnya dan ikut duduk. "Nah, gitu, Dok. Kalau hari Rabu itu kan ada ' +
                    'mobil bak Pak Kaji ke pasar lewat depan Puskesmas... cuma ya itu, bojoku wedi antre sendirian." ' +
                    'Bu Wulan mengangguk pelan. "Kalau ada temannya, saya berani, Dok."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Melibatkan pasien merancang solusinya sendiri (MI: menumbuhkan otonomi). Perhatikan: solusi ' +
                    'terbaik sering sudah ada di komunitas — mobil Pak Kaji, hari pasar — tinggal disambungkan.',
                },
                {
                  id: 'wk2_d2_b',
                  teks:
                    '"Pak, kesehatan istri itu tanggung jawab suami. Masa mengantar ke Puskesmas sebulan ' +
                    'sekali saja tidak bisa? Gabah kan bisa dititipkan tetangga."',
                  gaya: 'menggurui',
                  respons:
                    'Rahang Pak Darto mengeras. "Dokter tahu apa soal gabah." Ia mengangkat karungnya lagi dan ' +
                    'masuk ke dalam tanpa menoleh. Bu Wulan menunduk, tidak enak hati.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menceramahi kepala keluarga soal tanggung jawabnya di rumahnya sendiri — di depan istrinya — ' +
                    'adalah cara tercepat kehilangan dua sekutu sekaligus.',
                },
                {
                  id: 'wk2_d2_c',
                  teks:
                    '"Sebenarnya sekarang ada aplikasi Mobile JKN, Pak. Antre bisa dari HP, jadi sampai sana ' +
                    'tinggal duduk. Nanti saya ajari caranya."',
                  gaya: 'edukasi',
                  respons:
                    'Pak Darto mengeluarkan HP-nya: layar retak, tombol fisik, sinyal timbul tenggelam. ' +
                    '"HP saya begini, Dok," katanya datar. Bu Wulan bahkan tidak memegang HP sama sekali.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Solusi harus menapak di kenyataan pasien. Aplikasi antrean tidak berguna bagi rumah tangga ' +
                    'dengan satu HP tombol — kenali dulu konteks, baru tawarkan alat.',
                },
              ],
            },
            {
              id: 'wk2_d3',
              narasi:
                'Bu Wulan menyeduh teh baru untuk Pak Darto yang kembali duduk. Kamu teringat asbak yang hilang ' +
                'dari meja tamu — dan bungkus kretek yang tadi menyembul dari saku jaket di dekat pintu.',
              pilihan: [
                {
                  id: 'wk2_d3_a',
                  teks:
                    '"Ngomong-ngomong, meja tamunya sekarang bersih, asbaknya tidak ada. Pak Darto sendiri ' +
                    'bagaimana — rokoknya masih jalan, atau sudah dikurangi?"',
                  gaya: 'empati',
                  respons:
                    'Pak Darto tertawa tertangkap. "Masih, Dok, jujur saja. Cuma sekarang saya ngerokoknya di ' +
                    'sawah, tidak di dalam rumah — kasihan bojoku darah tinggi. Berhenti total... berat. ' +
                    'Dari bujang saya sudah ngudud."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'tidak_merokok',
                    ambangTrust: 6,
                    responsBohong:
                      '"Wah, sudah berhenti saya, Dok! Sudah dua minggu ini bersih, tidak sebatang pun. ' +
                      'Makanya asbaknya saya buang sekalian," katanya lancar, sambil melirik jaketnya di paku dekat pintu.',
                  },
                  catatanPedagogis:
                    'Menghargai kemajuan (asbak hilang) sebelum bertanya membuat pengakuan lebih mudah. ' +
                    'Bila ia mengaku "berhenti total", ingat bungkus kretek di saku jaket itu.',
                },
                {
                  id: 'wk2_d3_b',
                  teks:
                    '"Pak, istri Bapak hipertensi dan Bapak masih merokok? Asap Bapak itu meracuni Bu Wulan ' +
                    'pelan-pelan. Harus berhenti hari ini juga."',
                  gaya: 'memaksa',
                  respons:
                    'Pak Darto meletakkan gelas tehnya dengan bunyi keras. "Saya sudah tidak ngerokok di dalam ' +
                    'rumah, Dok. Jangan dikira saya tidak sayang bojoku." Sisa percakapan sore itu ia jawab ' +
                    'sekenanya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Ultimatum "hari ini juga" pada perokok 40 tahun mengabaikan seluruh ilmu perubahan perilaku. ' +
                    'Yang tersisa hanya pembelaan diri, bukan niat berubah.',
                },
                {
                  id: 'wk2_d3_c',
                  teks:
                    '"Rokok itu urusan pribadi Bapak, saya tidak akan ikut campur. Kita fokus obat Bu Wulan saja."',
                  gaya: 'edukasi',
                  respons:
                    '"Nah, cocok saya sama Dokter ini," Pak Darto terkekeh sambil menyalakan korek di teras. ' +
                    'Topik rokok tertutup rapat — mungkin sampai kunjungan berikutnya, mungkin selamanya.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Rokok suami BUKAN di luar urusan: ini indikator keluarga sehat dan faktor risiko langsung bagi ' +
                    'pasien hipertensimu. Menghindar memang nyaman, tapi meninggalkan lubang di rencana keluarga.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'wk2_i1',
              nama: 'Rombongan Rabu Pahing',
              deskripsi:
                'Sambungkan Bu Wulan dengan rombongan lansia RW 5 yang menumpang mobil Pak Kaji setiap Rabu. ' +
                'Titipkan namanya ke loket Prolanis agar obat bulanan disiapkan. Ia dapat kontrol, mengambil obat, ' +
                'dan pulang bersama tetangga dalam satu perjalanan.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Rabu berikutnya Bu Wulan pulang dari Puskesmas menenteng kantong obat dan cerita panjang soal ' +
                'teman seperjalanan barunya. "Ternyata antrenya tidak seram, Dok. Ada Bu Hj. Aminah yang menemani. ' +
                'Bulan depan saya sudah janjian lagi."',
            },
            {
              id: 'wk2_i2',
              nama: 'Poster Saksi Hidup',
              deskripsi:
                'Buatkan kartu bergambar berisi kisah Bu Hj. Aminah — 12 tahun minum obat hipertensi, ginjal ' +
                'sehat — untuk ditempel di lemari agar tekad Bu Wulan tidak goyah.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Kartu itu ditempel rapi di pintu lemari, dan Bu Wulan memang tidak goyah — tekadnya sudah bulat ' +
                'sejak dua minggu lalu. Yang gagal bukan niatnya: obatnya tetap habis di butir ketiga, karena ' +
                'jalan ke Puskesmas tetap tidak ada.',
            },
            {
              id: 'wk2_i3',
              nama: 'Pelatihan Tensi Mandiri',
              deskripsi:
                'Ajari Bu Wulan dan Pak Darto memakai tensimeter digital pinjaman Puskesmas dan mencatat ' +
                'hasilnya, supaya paham kapan tekanan darahnya berbahaya.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Catatan tensinya makin rajin dan rapi — 158, 160, 163, pelan-pelan merangkak naik lagi. ' +
                'Bu Wulan kini tahu persis angkanya memburuk, dan hanya bisa memandangi piring obat yang kosong. ' +
                'Mengukur bukan masalahnya; obatnya yang tidak tersambung.',
            },
          ],
          penutupBerhasil:
            'Bu Wulan mencatat "RABU — MOBIL PAK KAJI" besar-besar di kalender, menimpa coretan murung yang ' +
            'kemarin. "Ternyata jalannya ada to, Dok, cuma saya yang tidak kepikiran." Pak Darto mengantarmu ' +
            'sampai pagar, kretek di sakunya tidak dinyalakan sepanjang kamu di sana.',
          penutupGagal:
            'Tiga butir obat itu akan habis Kamis malam, dan belum ada rencana yang menyambungkan Bu Wulan ' +
            'dengan butir keempat. "Ya nanti dilihat-lihat dulu, Dok," katanya di pintu — kalimat orang yang ' +
            'ditinggalkan sendirian dengan masalahnya.',
        },
      ],
      epilogBerhasil:
        'Sebulan kemudian sepucuk kabar dari kader RW 5: tensi Bu Wulan 138/85, terendah dalam lima tahun. ' +
        'Di kunjungan Prolanis ia memamerkan foto dari Balikpapan — Anto dan calon istrinya. "Saya mau sehat ' +
        'sampai gendong cucu, Dok. Kan sudah dibuktikan, ginjal saya aman."',
      epilogGagal:
        'Kantong obat itu masih di atas lemari ketika semuanya terlambat. Di desa, kabar menyebar lebih cepat ' +
        'dari ambulans: Bu Wulan, yang rumahnya pernah kamu datangi, kini bicaranya pelo dan tangan kanannya ' +
        'tak lagi bisa memegang teko tehnya sendiri.',
    },
  },

  /* =========================================================================
   * KELUARGA SANTOSO — RW 2 (dekat), cukup
   * ======================================================================= */
  {
    id: 'keluarga_santoso',
    namaKeluarga: 'Keluarga Pak Santoso',
    rw: 2,
    jarakMenit: 10,
    ekonomi: 'cukup',
    anggota: [
      {
        nama: 'Pak Santoso',
        usia: 46,
        jenisKelamin: 'L',
        peran: 'kepala',
        kondisi: ['tb_paru', 'perokok_aktif'],
      },
      {
        nama: 'Bu Rahmi',
        usia: 39,
        jenisKelamin: 'P',
        peran: 'istri',
      },
      {
        nama: 'Bagas',
        usia: 9,
        jenisKelamin: 'L',
        peran: 'anak',
        kondisi: ['batuk_dua_minggu'],
      },
    ],
    // Anak 9 tahun, bukan balita & tak ada persalinan setahun terakhir →
    // 4 indikator KIA = na. Tak ada hipertensi / gangguan jiwa → na.
    indikatorAwal: {
      kb: 'ya',
      persalinan_faskes: 'na',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'tidak',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Pak Santoso (46), tukang mebel, berhenti minum OAT di bulan kedua — bukan karena tak sanggup, ' +
        'tapi karena malu ketahuan tetangga. Sementara itu Bagas, anaknya yang berumur 9 tahun, mulai batuk.',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "Kardus di Bawah Ranjang"
         * Hambatan sebenarnya: MOTIVASI (malu / stigma TB).
         * -------------------------------------------------------------- */
        {
          id: 'santoso_k1',
          judul: 'Kardus di Bawah Ranjang',
          pembuka:
            'Bengkel mebel di samping rumah sunyi; serbuk kayu di mejanya sudah lama tidak diaduk gergaji. ' +
            'Bu Rahmi membukakan pintu dengan senyum tegang. Dari ruang tengah terdengar batuk kecil Bagas, ' +
            'lalu suara Pak Santoso: "Siapa, Bu?" Sesaat kemudian ia mengenali suaramu. "Oh, Dokter."',
          target: ['tb_berobat_standar'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'OAT disembunyikan di kardus bawah ranjang, jendela ditutup rapat agar tetangga tak melihat ke dalam, ' +
            'dan pesanan mebel ditolak sejak kabar "penyakit paru" berhembus. Pak Santoso mampu minum obat dan ' +
            'obatnya tersedia — yang menghentikannya adalah malu. Ini luka harga diri, bukan soal akses atau cara minum.',
          penerimaanAwal: {
            jenis: 'ditolak_total',
            mode: 'karier',
            narasi:
              'Bu Rahmi tetap berdiri di ambang pintu. Dari dalam, Pak Santoso berkata pelan tetapi tegas, "Maaf, Dok. Hari ini jangan masuk dulu. Tetangga sedang banyak di luar. Saya belum siap orang melihat Dokter datang ke rumah."',
            ulangDalamHari: 3,
            rasional:
              'Tiga hari memberi ruang memilih jam yang lebih privat tanpa membiarkan putus OAT dan gejala kontak serumah terlalu lama.',
            pilihan: [
              {
                id: 'sk1_terima_hormati',
                teks:
                  '"Baik, Pak, saya tidak masuk hari ini. Kita pilih waktu yang lebih sepi; saya kembali {jadwal}. Bila Bapak setuju, Bu Rahmi dapat mengabari saya bila waktunya perlu digeser."',
                tindakan: 'hormati',
                respons:
                  'Nada Pak Santoso melunak. Ia menyepakati waktu yang lebih sepi, dan Bu Rahmi mencatat janji ulang tanpa membuka percakapan kesehatan hari ini.',
              },
              {
                id: 'sk1_terima_paksa',
                teks:
                  '"Ini TB, Pak, bukan urusan yang bisa ditunda. Saya harus masuk dan memeriksa obat serta keluarga sekarang."',
                tindakan: 'memaksa',
                respons:
                  'Pintu ditutup. "Kalau begitu tidak usah kembali, Dok." Upaya memaksa mengubah penolakan yang sah menjadi putus relasi.',
                catatanPedagogis:
                  'Pada penolakan kontak awal, pedoman meminta petugas tidak memaksa, tetap ramah, dan membuat janji ulang.',
              },
            ],
          },
          pilihanIngatkan: {
            prompt: 'Tutup kunjungan dengan langkah TB yang aman, menjaga privasi, dan memiliki waktu tindak lanjut jelas.',
            pilihan: [
              {
                id: 'sk1_ingatkan_tepat',
                teks:
                  '"Pak Santoso, bawa sisa OAT dan datang lewat jalur privat yang kita sepakati {jadwal}; petugas TB akan menilai kelanjutan obat, dan Bagas juga perlu diperiksa. Jangan mengubah atau memulai ulang obat sendiri."',
                tepat: true,
                respons:
                  'Pak Santoso mengulang jalur masuk yang privat, membawa sisa obat, dan menyebut Bagas sebagai alasan ia akan menepati jadwal.',
              },
              {
                id: 'sk1_ingatkan_obat_saja',
                teks: '"Mulai lagi saja obat yang tersisa malam ini, Pak. Yang penting jangan putus lagi."',
                tepat: false,
                respons: 'Pak Santoso menatap kardus OAT tanpa tahu apakah regimen lama aman dimulai begitu saja.',
                catatanPedagogis:
                  'Putus OAT perlu evaluasi program TB; jangan mengarahkan pasien memulai ulang sisa obat tanpa penilaian.',
              },
              {
                id: 'sk1_ingatkan_tanpa_janji',
                teks: '"Pikirkan lagi demi Bagas, Pak. Kalau sudah siap, kabari Puskesmas."',
                tepat: false,
                respons: 'Pak Santoso mengangguk, tetapi tidak ada hari, jalur privat, atau tindakan pemeriksaan kontak yang disepakati.',
                catatanPedagogis:
                  'Ajakan yang hangat tetap belum lengkap bila tidak mengunci tindakan dan waktu ulang yang dapat dijalankan.',
              },
            ],
          },
          hotspot: [
            {
              id: 'sk1_h1',
              label: 'Kardus berisi OAT di bawah ranjang',
              narasi:
                'Dari celah pintu kamar, sudut kardus menyembul di bawah ranjang. Di dalamnya: blister OAT-KDT ' +
                'berminggu-minggu jatah, masih utuh, ditindih kain supaya tidak terlihat.',
              indikator: 'tb_berobat_standar',
              x: 15,
              y: 60,
            },
            {
              id: 'sk1_h2',
              label: 'Masker kain tergantung di paku',
              narasi:
                'Sebuah masker kain tergantung di paku dekat pintu kamar, warnanya masih cerah — jarang dipakai. ' +
                'Padahal di rumah ini ada anak sembilan tahun.',
              x: 35,
              y: 35,
            },
            {
              id: 'sk1_h3',
              label: 'Jendela tertutup rapat di siang bolong',
              narasi:
                'Semua jendela sisi jalan tertutup dan gordennya rapat, padahal hari terang. Ruang tengah jadi ' +
                'temaram dan pengap. "Biar tidak ada yang lihat-lihat ke dalam," gumam Bu Rahmi separuh menjelaskan.',
              x: 55,
              y: 20,
            },
            {
              id: 'sk1_h4',
              label: 'Bagas rebahan sambil batuk',
              narasi:
                'Bagas rebahan di karpet ruang tengah menonton TV, sesekali batuk. "Sudah dua minggu begitu, ' +
                'Dok," kata Bu Rahmi pelan. "Malamnya kadang sampai keringatan." Kamarnya bersebelahan dengan kamar ayahnya.',
              x: 70,
              y: 65,
            },
            {
              id: 'sk1_h5',
              label: 'Bungkus kretek di atas lemari bengkel',
              narasi:
                'Di atas lemari perkakas bengkel, bungkus kretek dan korek tersimpan setengah tersembunyi — ' +
                'posisi khas barang yang disembunyikan dari istri, bukan dari tamu.',
              indikator: 'tidak_merokok',
              x: 88,
              y: 45,
            },
          ],
          dialog: [
            {
              id: 'sk1_d1',
              narasi:
                'Pak Santoso duduk di kursi paling jauh, memunggungi jendela. "Saya sudah sehat kok, Dok. ' +
                'Batuknya sudah hilang, badan sudah enak, kerja juga kuat. Tidak usah repot-repot mengurusi saya — ' +
                'di kampung ini yang sakit banyak."',
              pilihan: [
                {
                  id: 'sk1_d1_a',
                  teks:
                    '"Badan sudah enak dan tenaga sudah pulih — itu kabar baik, Pak, sungguh. Boleh saya dengar ' +
                    'ceritanya dari awal? Waktu itu mulai berobat bagaimana sampai sekarang?"',
                  gaya: 'empati',
                  respons:
                    'Pak Santoso melirik, sedikit lunak. "Ya... awalnya batuk darah itu, Dok. Terus dites dahak, ' +
                    'katanya TB. Dua bulan pertama saya minum terus, disiplin. Badan memang jadi enak..." Ia berhenti, ' +
                    'memandangi jendela yang tertutup. "Terus ya sudah, saya rasa cukup."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Mengafirmasi yang bisa diafirmasi dulu (dua bulan disiplin itu nyata), lalu bertanya terbuka. ' +
                    'Perhatikan di mana ceritanya patah — tepat saat menyinggung jendela dan dunia luar.',
                },
                {
                  id: 'sk1_d1_b',
                  teks:
                    '"Merasa sehat itu justru fase paling berbahaya, Pak. Kumannya cuma tidur. Bapak sadar tidak, ' +
                    'kalau putus obat begini Bapak bisa menulari Bagas?"',
                  gaya: 'menakut_nakuti',
                  respons:
                    'Mata Pak Santoso menajam. "Jadi maksud Dokter, saya ini bapak yang meracuni anak sendiri?" ' +
                    'Bu Rahmi buru-buru menengahi dengan menawarkan air putih. Suasana kaku.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Fakta penularannya benar, tapi dijadikan senjata di kalimat kedua percakapan. Rasa bersalah yang ' +
                    'ditodongkan berubah jadi pertahanan diri — pintu yang tadinya sudah sempit kini tertutup.',
                },
                {
                  id: 'sk1_d1_c',
                  teks:
                    '"Kalau begitu saya jelaskan ya, Pak. Pengobatan TB itu minimal enam bulan: dua bulan fase ' +
                    'intensif, empat bulan fase lanjutan. Berhenti di tengah bisa membuat kuman kebal obat..."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya, petugas Puskesmas dulu juga bilang begitu," potong Pak Santoso datar. "Enam bulan, ' +
                    'kebal obat, saya hafal, Dok." Ia tahu semua itu — dan tetap berhenti. Ada yang tidak ' +
                    'dijangkau ceramah.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Pasien putus obat jarang kekurangan informasi — ia sudah dua bulan dalam program. Mengulang ' +
                    'materi penyuluhan hanya membuktikan kamu belum bertanya MENGAPA ia berhenti.',
                },
              ],
            },
            {
              id: 'sk1_d2',
              narasi:
                'Bu Rahmi mengantar air putih, lalu berdiri ragu di ambang dapur. "Bilang saja, Pak..." bisiknya. ' +
                'Pak Santoso menghela napas panjang, jarinya memilin-milin ujung sarung. Ada sesuatu yang ' +
                'menggantung di udara pengap ruangan itu.',
              pilihan: [
                {
                  id: 'sk1_d2_a',
                  teks:
                    '"Sepertinya ada yang lebih berat dari sekadar bosan minum obat ya, Pak. Saya tidak ' +
                    'buru-buru — kalau Bapak mau cerita, saya dengarkan."',
                  gaya: 'refleksi',
                  respons:
                    'Lama Pak Santoso diam. Lalu, pelan: "Dokter tahu ambil obat TB itu di loket mana? Loket yang ' +
                    'sama dengan orang batuk-batuk semua itu. Pernah tetangga saya lewat pas saya antre. Besoknya ' +
                    'pesanan lemari dibatalkan. Katanya... takut mebelnya kena napas saya."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Refleksi + kesediaan menunggu membuka cerita yang sesungguhnya: stigma yang berdampak ekonomi ' +
                    'nyata. Inilah akar putus obatnya — bukan malas, bukan bodoh, tapi malu yang beralasan.',
                },
                {
                  id: 'sk1_d2_b',
                  teks:
                    '"Pak, TB itu penyakit biasa, bukan aib. Yang penting sembuh. Peduli apa dengan omongan ' +
                    'tetangga? Mereka tidak ikut menanggung hidup Bapak."',
                  gaya: 'menghakimi',
                  respons:
                    '"Peduli apa?" Pak Santoso tertawa pahit. "Yang beli mebel saya ya tetangga-tetangga itu, Dok. ' +
                    'Omongan mereka itu piring nasi anak saya." Ia bersandar, kembali memasang jarak.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    '"Jangan pedulikan omongan orang" adalah nasihat termurah untuk orang yang penghasilannya ' +
                    'bergantung pada omongan orang. Stigma TB itu nyata secara ekonomi — meremehkannya berarti ' +
                    'tidak memahami hidupnya.',
                },
                {
                  id: 'sk1_d2_c',
                  teks:
                    '"Mungkin Ibu Rahmi bisa bantu cerita? Sepertinya Ibu tahu sesuatu yang belum disampaikan Bapak."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Rahmi membuka mulut, tapi Pak Santoso mendahului dengan suara rendah: "Urusan saya ya saya ' +
                    'yang cerita, Bu." Bu Rahmi mengatupkan bibir dan kembali ke dapur. Kamu baru saja membuat ' +
                    'sepasang suami-istri saling diam.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Memutari pasien lewat keluarganya — di depan pasiennya sendiri — terasa seperti pengkhianatan ' +
                    'kecil. Berbicara TENTANG pasien di hadapannya bukan teknik MI.',
                },
              ],
            },
            {
              id: 'sk1_d3',
              narasi:
                'Cerita soal pesanan lemari yang dibatalkan itu masih menggantung. Pak Santoso meraih gelas, ' +
                'meneguk air putihnya sampai habis. Pertanyaan yang paling penting belum ditanyakan: obat itu sendiri.',
              pilihan: [
                {
                  id: 'sk1_d3_a',
                  teks:
                    '"Pak, apa pun jawabannya saya tidak akan menghakimi, dan ini tidak akan saya sebarkan. ' +
                    'Obat dari Puskesmas itu — sekarang masih diminum, atau berhenti total?"',
                  gaya: 'empati',
                  respons:
                    'Pak Santoso menatap lantai lama sekali. "Berhenti, Dok. Total. Sejak kejadian loket itu, ' +
                    'saya tidak pernah ambil lagi. Sisanya..." ia melirik ke arah kamar, "...masih saya simpan. ' +
                    'Mau dibuang kok ya sayang. Mau diminum... berat."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'tb_berobat_standar',
                    ambangTrust: 5,
                    responsBohong:
                      '"Lho, sudah selesai kok, Dok. Kata petugasnya dulu, kalau badan sudah enak dan batuknya ' +
                      'hilang ya boleh disudahi. Obatnya sudah habis semua, tuntas," jawabnya lancar — terlalu lancar.',
                  },
                  catatanPedagogis:
                    'Gerbang kejujuran: jaminan kerahasiaan + tanpa penghakiman adalah kuncinya. Bila ia mengaku ' +
                    '"sudah tuntas", ingat kardus di bawah ranjang — tidak ada pengobatan TB yang selesai dalam dua bulan.',
                },
                {
                  id: 'sk1_d3_b',
                  teks:
                    '"Saya lihat sendiri kardus obat di bawah ranjang Bapak tadi. Masih utuh semua. ' +
                    'Jadi tidak usah mengarang cerita sudah sembuh ke saya."',
                  gaya: 'menghakimi',
                  respons:
                    'Wajah Pak Santoso memerah — bukan malu, tapi marah. "Dokter masuk rumah orang sambil ' +
                    'menggeledah?" Ia berdiri. "Bu, temani Dokter. Saya mau ke bengkel." Pintu samping berdebam.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Membuka temuan observasi sebagai tuduhan mengubah kunjungan rumah menjadi penggerebekan. ' +
                    'Pada pasien yang lukanya justru soal harga diri, ini titik tanpa jalan pulang.',
                },
                {
                  id: 'sk1_d3_c',
                  teks:
                    '"Yang penting sekarang kita periksakan Bagas dulu ya, Pak. Batuk dua minggu pada anak ' +
                    'harus dicek dahak dan mungkin rontgen."',
                  gaya: 'edukasi',
                  respons:
                    '"Bagas?" Pak Santoso menegakkan duduknya, cemas yang tulus. "Iya, Dok, periksakan. Jangan ' +
                    'sampai dia kenapa-kenapa." Tapi soal obatnya sendiri, tidak tersentuh — sumber penularannya ' +
                    'masih di kursi itu.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Memeriksa kontak serumah memang wajib — tapi menjadikannya pengalih dari pengobatan si ayah ' +
                    'berarti mengobati hilir sambil membiarkan hulunya. Keduanya harus jalan.',
                },
              ],
            },
            {
              id: 'sk1_d4',
              narasi:
                'Dari ruang tengah, batuk Bagas terdengar lagi — kali ini panjang. Pak Santoso memejamkan mata ' +
                'sebentar. "Dia pengin jadi tentara, Dok, Bagas itu," katanya tiba-tiba. "Tiap sore lari keliling ' +
                'lapangan. Sekarang lari sebentar saja sudah terengah."',
              pilihan: [
                {
                  id: 'sk1_d4_a',
                  teks:
                    '"Bapak ingin Bagas kuat lari lagi, dan Bapak ingin bengkel itu ramai lagi. Menurut Bapak ' +
                    'sendiri, kalau pengobatannya dituntaskan — pelan-pelan, dengan cara yang tidak mempermalukan ' +
                    'Bapak — apa yang mungkin berubah?"',
                  gaya: 'refleksi',
                  respons:
                    'Pak Santoso menatap pintu bengkelnya melalui jendela samping. "Kalau saya benar-benar sembuh... ' +
                    'ya saya bisa bilang ke orang-orang dengan dada tegak: sudah, sudah tuntas, ada suratnya." Ia ' +
                    'menoleh. "Memangnya ada, Dok, cara yang tidak usah antre di loket itu?"',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Pertanyaan evokatif memancing change talk: pasien sendiri yang menyebut "sembuh", "dada tegak", ' +
                    'dan akhirnya BERTANYA solusinya. Saat pasien mulai bertanya, separuh jalan sudah ditempuh.',
                },
                {
                  id: 'sk1_d4_b',
                  teks:
                    '"Kalau Bapak tetap tidak berobat dan Bagas terbukti tertular, itu namanya kelalaian. ' +
                    'Saya bisa saja melaporkan kasus putus obat ke programmer TB dan kader untuk dilacak, lho."',
                  gaya: 'menakut_nakuti',
                  respons:
                    '"Silakan," suara Pak Santoso dingin seperti pahat. "Sekalian umumkan di masjid biar satu ' +
                    'kampung tahu." Bu Rahmi menutup mulutnya dengan tangan. Kunjungan ini selesai — bukan olehmu.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Mengancam pelacakan pada pasien yang trauma justru pada KETAHUAN adalah menyiram api dengan ' +
                    'bensin. Pelacakan kontak itu prosedur baku — tapi sebagai perlindungan, bukan ancaman.',
                },
                {
                  id: 'sk1_d4_c',
                  teks:
                    '"Anak seusia Bagas memang sering batuk kok, Pak. Belum tentu TB. Tidak usah terlalu ' +
                    'khawatir dulu."',
                  gaya: 'edukasi',
                  respons:
                    'Pak Santoso mengangguk, sedikit lega — dan kembali bersandar santai. Kecemasan tentang Bagas ' +
                    'tadi satu-satunya hal yang sempat menggerakkannya. Kamu baru saja mengempiskannya.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Batuk 2 minggu + keringat malam pada kontak serumah TB BTA positif bukan "batuk biasa". ' +
                    'Secara klinis keliru, dan secara MI membuang satu-satunya motivasi yang sudah menyala.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'sk1_i1',
              nama: 'Jalan Pulang yang Terhormat',
              deskripsi:
                'Rancang pengobatan ulang yang menjaga martabat Pak Santoso. Serahkan obat lewat ruang tindakan ' +
                'dan pertemukan ia empat mata dengan Pak Hasan, penyintas TB yang tetap dihormati kampung. ' +
                'Sepakati tujuan berupa surat keterangan sembuh yang dapat ia tunjukkan dengan bangga.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Pak Hasan datang membawa cerita, bukan ceramah: "Aku dulu juga sembunyi, To. Sekarang? Kandangku ' +
                'tambah dua." Pekan itu Pak Santoso menarik kardus dari bawah ranjang dan menaruhnya di meja makan. ' +
                '"Kalau dia bisa tegak lagi, saya juga," katanya pada Bu Rahmi.',
            },
            {
              id: 'sk1_i2',
              nama: 'Antar Obat ke Rumah',
              deskripsi:
                'Atur agar kader mengantarkan OAT ke rumah tiap minggu sehingga Pak Santoso tidak perlu ' +
                'antre di loket Puskesmas dan tidak akan terlihat tetangga.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Obat kini datang sendiri ke rumah — dan menumpuk rapi di kardus yang sama. Yang membuatnya ' +
                'berhenti bukan loketnya, melainkan cap "orang TB-an" yang sudah telanjur menempel di dadanya. ' +
                'Selama itu belum dipulihkan, obat sedekat apa pun tidak diminum.',
            },
            {
              id: 'sk1_i3',
              nama: 'Kelas Efek Samping OAT',
              deskripsi:
                'Beri sesi edukasi terstruktur tentang fase pengobatan, efek samping (urine merah, mual), dan ' +
                'bahaya TB resisten obat, lengkap dengan leaflet bergambar.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                '"Enam bulan, dua fase, urine merah itu normal — saya hafal, Dok, dari dulu," kata Pak Santoso ' +
                'sambil melipat leaflet jadi kipas. Pengetahuannya memang tidak pernah jadi masalah; leaflet ' +
                'tidak bisa menyembuhkan malu.',
            },
            {
              id: 'sk1_i4',
              nama: 'Skrining Kontak Serumah',
              deskripsi:
                'Fokuskan kunjungan pada pemeriksaan Bagas dan Bu Rahmi: tes cepat molekuler dahak dan rujukan ' +
                'foto toraks untuk Bagas, agar penularan dalam rumah segera terpetakan.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Bagas diperiksa — langkah yang memang perlu dan melegakan Bu Rahmi. Tapi sumber penularannya ' +
                'masih duduk di kursi yang sama, memunggungi jendela yang sama, dengan kardus obat yang belum ' +
                'tersentuh di bawah ranjangnya.',
            },
          ],
          penutupBerhasil:
            'Di pintu, Pak Santoso menjabat tanganmu — genggaman tukang kayu, keras dan jujur. "Kamis saya mulai ' +
            'lagi, Dok. Lewat belakang, sesuai janji." Bu Rahmi mengiringimu ke pagar, matanya basah: ' +
            '"Terima kasih sudah tidak mempermalukan bapaknya Bagas."',
          penutupGagal:
            'Pak Santoso mengantar sampai pintu dengan sopan yang berjarak. "Terima kasih sudah mampir, Dok. ' +
            'Kami sehat-sehat saja." Di belakangnya, jendela-jendela tetap tertutup di siang bolong, dan di ' +
            'ruang tengah Bagas batuk lagi — panjang, dan tidak ada yang membicarakannya.',
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "Bulan Kedua, Lagi"
         * OAT dimulai ulang; kini hambatannya KAPABILITAS: mual hebat,
         * salah cara minum, belum ada PMO yang paham.
         * -------------------------------------------------------------- */
        {
          id: 'santoso_k2',
          judul: 'Bulan Kedua, Lagi',
          pembuka:
            'Suara amplas terdengar dari bengkel — Pak Santoso bekerja lagi, meski gerakannya belum setenaga dulu. ' +
            'Jendela ruang tengah kini terbuka separuh; cahaya masuk untuk pertama kalinya sejak berbulan-bulan. ' +
            'Bu Rahmi menyambut dengan wajah yang tidak bisa memutuskan antara bangga dan cemas.',
          target: ['tb_berobat_standar'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Niat Pak Santoso sudah pulih — ia sendiri yang mengambil obat lewat pintu belakang. Tapi kartu ' +
            'centangnya bolong tiga hari: mual hebat tiap pagi, obat diminum sesudah kopi dan gorengan, dan ' +
            'Bu Rahmi tak tahu harus berbuat apa selain menyodorkan air. Ini soal keterampilan menjalani ' +
            'pengobatan — bukan lagi niat, bukan akses.',
          hotspot: [
            {
              id: 'sk2_h1',
              label: 'Kartu centang obat bolong tiga hari',
              narasi:
                'Di dinding dapur tertempel kertas bergaris buatan Bu Rahmi: kolom tanggal dan centang. ' +
                'Rapi di minggu pertama... lalu bolong tiga hari berturut-turut, tepat sampai kemarin.',
              indikator: 'tb_berobat_standar',
              x: 25,
              y: 30,
            },
            {
              id: 'sk2_h2',
              label: 'Ember kecil di samping ranjang',
              narasi:
                'Ember plastik kecil diletakkan di samping ranjang, beralas koran. "Bapak mualnya luar biasa ' +
                'tiap habis minum obat, Dok," Bu Rahmi menjelaskan dengan suara kecil. "Sampai muntah-muntah."',
              x: 12,
              y: 62,
            },
            {
              id: 'sk2_h3',
              label: 'Gelas kopi pekat di meja bengkel',
              narasi:
                'Di meja bengkel, gelas kopi tubruk pekat masih separuh, di sebelah piring bekas gorengan. ' +
                '"Obatnya saya minum habis ngopi pagi, Dok, biar tidak perih," kata Pak Santoso lugu dari balik mebel.',
              x: 85,
              y: 50,
            },
            {
              id: 'sk2_h4',
              label: 'Jendela ruang tengah terbuka',
              narasi:
                'Jendela yang dulu tertutup rapat kini terbuka separuh, gordennya disingkap. Perubahan kecil ' +
                'yang berteriak: rumah ini sudah tidak sepenuhnya bersembunyi.',
              x: 55,
              y: 18,
            },
            {
              id: 'sk2_h5',
              label: 'Puntung kretek di pot bunga teras',
              narasi:
                'Di pot bunga pojok teras, dua puntung kretek ditancapkan tergesa ke tanah — masih baru. ' +
                'Seseorang merokok di sini pagi ini, dan berusaha tidak meninggalkan jejak.',
              indikator: 'tidak_merokok',
              x: 70,
              y: 78,
            },
          ],
          dialog: [
            {
              id: 'sk2_d1',
              narasi:
                'Pak Santoso menepuk-nepuk serbuk kayu dari kausnya dan duduk. "Sudah jalan lagi obatnya, Dok, ' +
                'sesuai janji. Cuma saya mau jujur..." ia menunjuk perutnya, "...ini perut rasanya diaduk-aduk ' +
                'tiap pagi. Tiga hari kemarin saya bolos. Bukan karena malu lho ya — mualnya itu tidak kuat."',
              pilihan: [
                {
                  id: 'sk2_d1_a',
                  teks:
                    '"Bapak memulai lagi dari nol dan bertahan hampir dua minggu sambil menahan mual — itu bukan ' +
                    'hal kecil. Coba ceritakan, mualnya biasanya datang kapan, dan Bapak minum obatnya bagaimana?"',
                  gaya: 'refleksi',
                  respons:
                    '"Habis subuh, Dok. Saya ngopi dulu, sarapan gorengan, terus minum obatnya empat butir ' +
                    'sekaligus — biar cepat. Setengah jam kemudian mualnya datang, kadang sampai keluar semua. ' +
                    'Kalau sudah muntah begitu... ya saya pikir percuma, obatnya kan sudah keluar."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Afirmasi + pertanyaan terbuka menggali TATA CARA, dan ketemulah masalahnya: kopi, perut penuh ' +
                    'gorengan, dan keyakinan keliru "muntah = obat keluar = percuma". Ini murni soal keterampilan.',
                },
                {
                  id: 'sk2_d1_b',
                  teks:
                    '"Bolos tiga hari, Pak? Kita baru saja mulai ulang. Kalau begini terus kumannya bisa kebal, ' +
                    'dan pengobatannya bukan enam bulan lagi — bisa dua tahun dengan suntikan."',
                  gaya: 'menakut_nakuti',
                  respons:
                    'Pak Santoso mengangkat kedua tangannya. "Ya sudah, salah saya, salah saya." Nadanya letih. ' +
                    '"Dokter kira saya senang bolos? Saya yang tiap pagi muntah, Dok, bukan Dokter." Bu Rahmi ' +
                    'menunduk dalam-dalam.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Ancaman TB resisten pada pasien yang bolos KARENA efek samping salah alamat: ia bukan menolak, ' +
                    'ia kewalahan. Yang dibutuhkan keterampilan mengelola mual, bukan tambahan rasa takut.',
                },
                {
                  id: 'sk2_d1_c',
                  teks:
                    '"Mual itu memang risiko OAT, Pak, harus ditahan saja. Semua pasien TB juga begitu. ' +
                    'Lama-lama badannya terbiasa kok."',
                  gaya: 'edukasi',
                  respons:
                    '"Ditahan..." Pak Santoso mengulang pelan, seperti mengunyah pasir. "Ya sudah, saya coba tahan, ' +
                    'Dok." Jawaban patuh yang rapuh — persis jenis janji yang patah di pagi ketiga.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    '"Ditahan saja" bukan tatalaksana. Mual OAT bisa DIKELOLA: waktu minum digeser malam, perut tidak ' +
                    'kosong-melompong, hindari kopi bersamaan, antiemetik bila perlu. Menyerah pada keluhan = mengundang putus obat kedua.',
                },
              ],
            },
            {
              id: 'sk2_d2',
              narasi:
                'Bu Rahmi ikut duduk, membawa kartu centang dari dapur. "Saya yang buat ini, Dok, tapi saya cuma ' +
                'bisa mencentang. Kalau bapaknya bilang mualnya tidak kuat, saya harus jawab apa? Saya takut ' +
                'salah paksa, takut juga kalau dibiarkan."',
              pilihan: [
                {
                  id: 'sk2_d2_a',
                  teks:
                    '"Kartu ini justru bukti Ibu sudah jadi separuh pengawas obat, tinggal dilengkapi ilmunya. ' +
                    'Kalau saya ajari Ibu cara mengatur waktu minum, makanan pengiring, dan kapan mual itu perlu ' +
                    'dibawa ke Puskesmas — Ibu bersedia?"',
                  gaya: 'empati',
                  respons:
                    'Mata Bu Rahmi menyala. "Bersedia, Dok! Dari kemarin saya cuma bingung mau tanya siapa." ' +
                    'Pak Santoso menyeletuk sambil tersenyum kecil: "Wah, bakal ada mandor baru di rumah ini."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'PMO (Pengawas Menelan Obat) yang efektif bukan pencatat, tapi pendamping terampil. Membekali ' +
                    'keluarga dengan keterampilan konkret adalah intervensi kapabilitas paling murah dan awet.',
                },
                {
                  id: 'sk2_d2_b',
                  teks:
                    '"Ibu harusnya lebih tegas. Namanya juga istri — kalau bapaknya menolak minum, ya dipaksa. ' +
                    'Ini nyawa yang dipertaruhkan, bukan main-main."',
                  gaya: 'memaksa',
                  respons:
                    'Bu Rahmi mengerut di kursinya, seperti murid dimarahi guru. "I-iya, Dok..." Pak Santoso ' +
                    'merangkul bahu istrinya. "Bojoku ini sudah paling telaten sedunia, Dok. Jangan disalah-salahkan." ' +
                    'Kini dua-duanya defensif.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menyalahkan pendamping yang sudah berusaha = melemahkan sekutu terbaikmu di rumah ini. ' +
                    'Paksaan juga bukan strategi PMO — kepatuhan yang dipaksa runtuh begitu pengawasnya lengah.',
                },
                {
                  id: 'sk2_d2_c',
                  teks:
                    '"Nanti saya kasih brosur panduan PMO dari program TB ya, Bu. Di situ lengkap semua, ' +
                    'tinggal dibaca pelan-pelan."',
                  gaya: 'edukasi',
                  respons:
                    '"Oh... iya, Dok, terima kasih," Bu Rahmi menerima dengan sopan, lalu menyelipkan janji brosur ' +
                    'itu ke balik kartu centangnya. Pertanyaannya yang sesungguhnya — "saya harus jawab apa?" — ' +
                    'belum terjawab.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Brosur menjawab pertanyaan umum; pendamping butuh jawaban untuk SITUASI RUMAHNYA: mual subuh, ' +
                    'kopi tubruk, suami keras kepala. Keterampilan menular lewat latihan, bukan lembar lipat.',
                },
              ],
            },
            {
              id: 'sk2_d3',
              narasi:
                'Sebelum pamit, kamu teringat dua puntung kretek yang ditancapkan tergesa di pot bunga teras. ' +
                'Pak Santoso mengikuti arah matamu ke teras, lalu pura-pura sibuk merapikan kartu centang di meja.',
              pilihan: [
                {
                  id: 'sk2_d3_a',
                  teks:
                    '"Satu lagi, Pak, bukan untuk memarahi — paru yang sedang diobati ini kawan seperjuangan kita. ' +
                    'Rokoknya sendiri bagaimana kabarnya? Masih jalan, sudah dikurangi, atau berhenti?"',
                  gaya: 'empati',
                  respons:
                    'Pak Santoso menggaruk tengkuk, tertawa kecil. "Ketahuan ya... Masih, Dok, sebatang-dua batang ' +
                    'kalau pusing mikir pesanan. Sembunyi-sembunyi dari bojoku. Tapi sudah jauh berkurang, sumpah — ' +
                    'dulu sebungkus sehari."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'tidak_merokok',
                    ambangTrust: 5,
                    responsBohong:
                      '"Sudah berhenti total, Dok! Sejak mulai obat lagi itu. Ngapain merokok, wong paru saya ' +
                      'lagi diobati," jawabnya cepat, sambil bangkit menutup pintu teras — persis di dekat pot bunga itu.',
                  },
                  catatanPedagogis:
                    'Membingkai pertanyaan rokok sebagai kepedulian pada paru yang "sedang berjuang" — bukan dakwaan — ' +
                    'membuka kejujuran. Bila jawabannya "berhenti total", puntung di pot bunga berkata lain.',
                },
                {
                  id: 'sk2_d3_b',
                  teks:
                    '"Saya lihat puntung rokok di pot bunga, Pak. TB kok merokok — itu sama saja menggali ' +
                    'kubur sendiri. Bagaimana parunya mau sembuh?"',
                  gaya: 'menakut_nakuti',
                  respons:
                    '"Itu punya tukang yang kemarin ambil kusen!" jawabnya terlalu cepat. Suasana yang tadi cair ' +
                    'membeku lagi; sisa kunjungan diisi jawaban-jawaban pendek dan lirikan ke arah jam dinding.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Frasa "menggali kubur sendiri" pada pasien TB adalah teror, bukan konseling. Dan menodongkan ' +
                    'temuan sebagai jebakan mengulang kesalahan klasik: observasi itu untuk memahami, bukan menghakimi.',
                },
                {
                  id: 'sk2_d3_c',
                  teks:
                    '"Ya sudah, yang penting obatnya jalan dulu, Pak. Soal rokok kita bahas lain kali saja ' +
                    'kalau pengobatannya sudah selesai."',
                  gaya: 'edukasi',
                  respons:
                    '"Siap, Dok, satu-satu," Pak Santoso tersenyum lega — terlalu lega. Enam bulan ke depan asap ' +
                    'kretek akan terus menemani paru yang sedang berusaha menutup lubang-lubangnya.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Menunda konseling rokok "sampai TB selesai" berarti membiarkan dua penyakit paru berpacu ' +
                    'di organ yang sama. Kesempatan emas justru SEKARANG, saat motivasi menjaga paru sedang tinggi.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'sk2_i1',
              nama: 'Sekolah PMO untuk Bu Rahmi',
              deskripsi:
                'Latih Bu Rahmi menjadi PMO melalui praktik langsung. Susun waktu minum OAT yang sesuai regimen ' +
                'dan rutinitas Pak Santoso, lalu kenali efek sampingnya. Bila Pak Santoso muntah, hubungi Puskesmas ' +
                'sebelum mengulang dosis. Minta Bu Rahmi menjelaskan kembali sampai lancar.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Bu Rahmi mengulang aturannya tanpa melihat catatan, lengkap dengan gaya menunjuk-nunjuk. Sejak ' +
                'obat pindah ke malam hari, ember di samping ranjang tidak pernah terpakai lagi. Kartu centang ' +
                'terisi penuh — dan yang mencentang sekarang Pak Santoso sendiri, sebelum tidur.',
            },
            {
              id: 'sk2_i2',
              nama: 'Ngobrol Penyintas Jilid Dua',
              deskripsi:
                'Undang lagi Pak Hasan si penyintas TB untuk menyemangati Pak Santoso agar niat berobatnya ' +
                'tidak kendor di fase lanjutan.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Pak Hasan datang, dan mereka mengobrol akrab soal harga kayu jati. Niat Pak Santoso memang tidak ' +
                'pernah kendor kali ini — yang kendor adalah lambungnya tiap subuh. Semangat tidak menyembuhkan ' +
                'mual; besoknya kartu centang bolong lagi.',
            },
            {
              id: 'sk2_i3',
              nama: 'Jemput Obat Mingguan',
              deskripsi:
                'Tugaskan kader mengantar jatah OAT mingguan ke rumah agar Pak Santoso tidak perlu ' +
                'bolak-balik ke Puskesmas selama fase lanjutan.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Obat selalu tersedia tepat waktu di rumah — lalu tertahan di tenggorokan yang sama tiap pagi. ' +
                'Pasokan tidak pernah jadi masalahnya; empat butir sesudah kopi tubruk itulah biang keroknya.',
            },
          ],
          penutupBerhasil:
            'Malam itu juga, jadwal baru ditempel di samping kartu centang: "OBAT: JAM 9 MALAM, HABIS MAKAN. ' +
            'KOPI: PAGI SAJA." Bu Rahmi mengantarmu ke pagar dengan langkah mandor baru. Dari bengkel, Pak Santoso ' +
            'berseru: "Bulan depan timbang saya pasti naik, Dok!"',
          penutupGagal:
            'Kamu meninggalkan rumah itu dengan kartu centang yang masih bolong dan ember yang masih setia di ' +
            'samping ranjang. Niat sudah ada, obat sudah ada — tapi tak seorang pun di rumah itu tahu cara ' +
            'melewati mual pukul enam pagi. Tiga hari bolong bisa jadi tiga puluh.',
        },
      ],
      epilogBerhasil:
        'Enam bulan kemudian, sebuah lemari kecil berukir dikirim ke Puskesmas — tanpa nama, tapi semua orang ' +
        'tahu bengkel mana yang menghasilkan sambungan serapi itu. Terselip di lacinya: fotokopi surat keterangan ' +
        'sembuh, dan secarik kertas: "Untuk loket belakang. Dari pasien yang sekarang antre di loket depan."',
      epilogGagal:
        'Bengkel itu akhirnya benar-benar sepi. Pak Santoso makin kurus dan makin jarang keluar; Bagas berhenti ' +
        'lari sore. Di bawah ranjang, kardus itu masih di sana — obat-obatan yang menunggu keberanian yang ' +
        'tidak pernah datang, di rumah yang jendelanya kembali tertutup.',
    },
  },

  /* =========================================================================
   * KELUARGA KETUT — RW 7 (terpencil), miskin
   * ======================================================================= */
  {
    id: 'keluarga_ketut',
    namaKeluarga: 'Keluarga Pak Ketut',
    rw: 7,
    jarakMenit: 55,
    ekonomi: 'miskin',
    anggota: [
      {
        nama: 'Ketut Sudiarta',
        usia: 24,
        jenisKelamin: 'L',
        peran: 'kepala',
        kondisi: ['perokok_aktif'],
      },
      {
        nama: 'Luh Sari',
        usia: 19,
        jenisKelamin: 'P',
        peran: 'istri',
      },
      {
        nama: 'Putu Ayunda',
        usia: 0,
        jenisKelamin: 'P',
        peran: 'anak',
        kondisi: ['bayi_8_bulan', 'imunisasi_tidak_lengkap'],
      },
    ],
    // Ada bayi 8 bulan → seluruh indikator KIA berlaku. Persalinan ditolong
    // bidan di poskesdes (ya); ASI eksklusif berhenti di bulan ke-3 (tidak);
    // imunisasi mandek setelah DPT-HB-Hib 1 (tidak); jarang ke posyandu (tidak).
    // Tak ada TB/hipertensi/gangguan jiwa → na. JKN belum terdaftar (tidak).
    indikatorAwal: {
      kb: 'ya',
      persalinan_faskes: 'ya',
      imunisasi_dasar: 'tidak',
      asi_eksklusif: 'tidak',
      pantau_tumbuh_kembang: 'tidak',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'tidak',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Di ujung jalan setapak RW 7, Luh Sari (19) membesarkan Putu Ayunda (8 bulan) yang imunisasinya mandek ' +
        'setelah suntikan pertama — bayinya demam semalam, grup WA bilang itu tanda bahaya, dan posyandu terlalu jauh.',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "KMS di Balik Kalender"
         * Hambatan sebenarnya: MOTIVASI (takut demam pasca-imunisasi + hoaks).
         * -------------------------------------------------------------- */
        {
          id: 'ketut_k1',
          judul: 'KMS di Balik Kalender',
          pembuka:
            'Empat puluh menit jalan berbatu, lalu jalan setapak menurun di antara kebun kopi, dan sampailah ' +
            'kamu di rumah berdinding anyaman itu. Luh Sari berdiri di ambang pintu menggendong bayinya erat-erat ' +
            'dengan selendang. "Cari siapa nggih...?" — suaranya sopan, matanya waspada.',
          target: ['imunisasi_dasar'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Buku KIA disembunyikan di balik kalender, dan tiap kali imunisasi disinggung Luh Sari mendekap ' +
            'Ayunda makin erat: bayinya demam semalaman setelah suntikan pertama, mertuanya menyalahkannya, dan ' +
            'grup WA menegaskan ketakutannya. Jalan yang jauh itu nyata, tapi bukan itu yang menghentikannya — ' +
            'yang menghentikannya adalah takut.',
          hotspot: [
            {
              id: 'kk1_h1',
              label: 'Buku KIA terselip di balik kalender',
              narasi:
                'Sudut merah muda buku KIA menyembul di balik kalender dinding, seperti sengaja disembunyikan. ' +
                'Halaman imunisasinya berhenti di satu tanda tangan bidan: HB-0 dan... DPT-HB-Hib 1, delapan ' +
                'bulan lalu. Sisanya kosong.',
              indikator: 'imunisasi_dasar',
              x: 42,
              y: 25,
            },
            {
              id: 'kk1_h2',
              label: 'HP berdenting di atas tikar',
              narasi:
                'HP di atas tikar berdenting-denting; di layarnya, notifikasi grup "Bunda Peduli Alami" ' +
                'menumpuk: "JANGAN biarkan anakmu jadi kelinci percobaan!!" — lengkap dengan gambar jarum ' +
                'suntik disilang merah.',
              x: 65,
              y: 60,
            },
            {
              id: 'kk1_h3',
              label: 'Botol susu & pisang lumat di dapur',
              narasi:
                'Di dapur: botol susu berisi larutan putih encer — susu kental manis, bukan formula — dan piring ' +
                'pisang lumat. "ASI tiang sudah habis dari Ayunda umur tiga bulan," kata Luh Sari mengikuti ' +
                'pandanganmu. "Kata ibu mertua, digenepin pisang saja biar kenyang."',
              indikator: 'asi_eksklusif',
              x: 88,
              y: 48,
            },
            {
              id: 'kk1_h4',
              label: 'Bungkus rokok di bale-bale',
              narasi:
                'Di bale-bale depan, bungkus rokok dan korek tergeletak di samping cangkir kopi yang belum ' +
                'dicuci — Pak Ketut merokok di rumah, dekat jendela kamar bayinya.',
              indikator: 'tidak_merokok',
              x: 15,
              y: 70,
            },
            {
              id: 'kk1_h5',
              label: 'Gelang benang tridatu di pergelangan bayi',
              narasi:
                'Pergelangan mungil Ayunda dililit benang tridatu, dan di keningnya ada bekas boreh. Keluarga ini ' +
                'tidak abai — mereka melindungi bayinya dengan semua cara yang mereka percaya.',
              x: 30,
              y: 45,
            },
            {
              id: 'kk1_h6',
              label: 'Timbangan dacin berdebu di pojok',
              narasi:
                'Sebuah kain gendongan untuk timbangan dacin posyandu tersampir di pojok, berdebu. Terakhir ' +
                'Ayunda ditimbang... entah kapan. Garis pertumbuhannya di KMS berhenti di bulan ketiga.',
              x: 78,
              y: 75,
            },
          ],
          dialog: [
            {
              id: 'kk1_d1',
              narasi:
                'Setelah dipersilakan duduk di tikar, Luh Sari tetap menggendong Ayunda, sedikit memunggungimu. ' +
                '"Kalau soal suntik-suntikan itu nggih, Dok..." katanya sebelum kamu sempat bertanya, "...Ayunda ' +
                'tiang sehat kok. Montok. Tidak usah disuntik-suntik lagi."',
              pilihan: [
                {
                  id: 'kk1_d1_a',
                  teks:
                    '"Iya, Ayunda kelihatan terawat sekali — gendongannya rapi, badannya bersih. Ibu pasti ' +
                    'menjaganya siang malam. Sebelum bicara suntikan, saya boleh kenalan dulu sama Ayunda?"',
                  gaya: 'empati',
                  respons:
                    'Pelan-pelan bahu Luh Sari turun. Ia memutar gendongannya sehingga wajah Ayunda terlihat — ' +
                    'pipi bulat, mata besar yang mengikuti gerak tanganmu. "Delapan bulan, Dok. Sudah bisa ' +
                    'duduk sendiri. Cerewetnya minta ampun kalau lapar." Untuk pertama kalinya ia tersenyum.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Ibu yang defensif melunak ketika pengasuhannya DIAKUI dulu, bukan dikoreksi. Meminta izin ' +
                    '"kenalan" mengembalikan kendali ke tangannya — fondasi trust pada kunjungan pertama.',
                },
                {
                  id: 'kk1_d1_b',
                  teks:
                    '"Justru karena montok itu jangan sampai kena campak, Bu. Ibu tahu tidak, bayi yang tidak ' +
                    'diimunisasi bisa lumpuh polio seumur hidup? Itu bukan cerita, itu fakta."',
                  gaya: 'menakut_nakuti',
                  respons:
                    'Luh Sari mendekap Ayunda makin erat dan menggeser duduknya menjauh. "Nggih, Dok, nggih..." ' +
                    'Matanya mencari-cari pintu. Kata "lumpuh" itu akan sampai ke grup WA-nya malam ini — ' +
                    'sebagai bukti bahwa dokter suka menakut-nakuti.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menakut-nakuti ibu yang SUDAH ketakutan hanya menambah tumpukan takutnya — dan kamu, bukan ' +
                    'penyakitnya, yang jadi sumber ancaman baru di matanya.',
                },
                {
                  id: 'kk1_d1_c',
                  teks:
                    '"Sehat sekarang bukan jaminan, Bu. Begini, imunisasi dasar lengkap itu ada lima jenis: ' +
                    'hepatitis B, BCG, polio, DPT-HB-Hib, campak. Masing-masing ada jadwalnya..."',
                  gaya: 'edukasi',
                  respons:
                    '"Nggih... nggih..." Luh Sari mengangguk pada setiap nama vaksin seperti mengangguk pada ' +
                    'pelajaran yang tidak akan dipakai. Jarak di tikar itu tidak berkurang seinci pun.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Daftar vaksin tidak menjawab pertanyaan yang sebenarnya menggantung di hati ibu ini: ' +
                    '"kenapa anakku demam waktu itu, dan salahkah aku?" Temukan dulu pertanyaannya, baru jawab.',
                },
              ],
            },
            {
              id: 'kk1_d2',
              narasi:
                'Ayunda meraih jarimu dan menggenggamnya — bayi yang mudah percaya, tidak seperti ibunya. ' +
                'Luh Sari memperhatikan, lalu berkata pelan: "Dulu habis disuntik yang pertama itu, Dok... ' +
                'Ayunda panas semalaman. Nangis terus sampai subuh. Tiang sendirian, bapaknya nginap di kebun. ' +
                'Ibu mertua bilang, tuh kan, dibilangin."',
              pilihan: [
                {
                  id: 'kk1_d2_a',
                  teks:
                    '"Semalaman sendirian dengan bayi panas yang menangis... itu pasti malam yang panjang dan ' +
                    'menakutkan sekali, Bu. Pantas Ibu jadi berpikir dua kali soal suntikan berikutnya."',
                  gaya: 'refleksi',
                  respons:
                    'Mata Luh Sari mendadak berkaca-kaca. "Nggih, Dok..." suaranya pecah. "Tiang takut sekali ' +
                    'waktu itu. Tiang pikir Ayunda kenapa-kenapa gara-gara tiang setuju disuntik. Terus di grup ' +
                    'ada yang kirim: demam itu tanda racunnya bekerja. Tiang nangis semalaman sambil meluk dia."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Refleksi kompleks: memvalidasi pengalaman TANPA membenarkan kesimpulannya. Kini akar masalah ' +
                    'terlihat utuh — trauma satu malam + rasa bersalah + hoaks yang datang tepat saat ia rapuh.',
                },
                {
                  id: 'kk1_d2_b',
                  teks:
                    '"Nah, itu dia masalahnya: Ibu percaya grup WA. Yang menulis itu bukan dokter, bukan bidan. ' +
                    'Masa iya Ibu taruh nyawa Ayunda di tangan orang yang tidak jelas?"',
                  gaya: 'menghakimi',
                  respons:
                    '"Yang di grup itu ibu-ibu juga, Dok. Sama-sama punya anak." Suaranya berubah datar. ' +
                    '"Mereka mau dengar cerita tiang jam dua malam." Ia membetulkan selendang. "Dokter sibuk, nggih? ' +
                    'Jauh-jauh ke sini."',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Grup itu memberi hal yang tidak diberikan sistem kesehatan: kehadiran jam dua malam. ' +
                    'Menghina komunitasnya = menghina satu-satunya penopang yang ia punya. Lawan hoaks dengan ' +
                    'kehadiran, bukan penghinaan.',
                },
                {
                  id: 'kk1_d2_c',
                  teks:
                    '"Oh, demam begitu wajar kok, Bu, namanya KIPI ringan. Kejadian Ikutan Pasca Imunisasi. ' +
                    'Kita tetap nilai keadaan Ayunda, cukup minum, dan tanda bahayanya; parasetamol hanya bila perlu untuk tidak nyaman sesuai dosis berat badan, bukan rutin sebelum suntik."',
                  gaya: 'edukasi',
                  respons:
                    '"Wajar..." Luh Sari mengulang kata itu dengan getir. "Dokternya bilang wajar. Yang begadang ' +
                    'kan tiang." Istilah KIPI lewat begitu saja; yang tinggal adalah rasa tidak didengar.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Kata "wajar" untuk malam terburuk dalam hidup seseorang terdengar seperti "kamu berlebihan". ' +
                    'Informasi KIPI itu penting — tapi hanya setelah pengalamannya diakui berat lebih dulu.',
                },
              ],
            },
            {
              id: 'kk1_d3',
              narasi:
                'Luh Sari mengusap matanya dengan ujung selendang. Kalender di dinding bergoyang ditiup angin ' +
                'lembah — dan sudut merah muda buku KIA di baliknya menyembul sedikit. Saatnya menanyakan ' +
                'catatan imunisasi Ayunda.',
              pilihan: [
                {
                  id: 'kk1_d3_a',
                  teks:
                    '"Bu, saya tidak akan memaksa apa-apa hari ini, janji. Saya cuma ingin tahu Ayunda sudah ' +
                    'dapat apa saja — boleh saya lihat buku KIA-nya?"',
                  gaya: 'empati',
                  respons:
                    'Luh Sari ragu sebentar, lalu bangkit dan menarik buku merah muda itu dari balik kalender. ' +
                    '"Cuma sampai yang pertama, Dok," katanya lirih sambil menyerahkannya. "Setelah malam itu ' +
                    'tiang tidak berani lagi. Kolomnya kosong semua... jelek nggih, rapornya Ayunda."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'imunisasi_dasar',
                    ambangTrust: 4,
                    responsBohong:
                      '"Sudah lengkap kok, Dok, sudah semua. Disuntiknya di bidan waktu masih tinggal di rumah ' +
                      'ibu tiang, jauh dari sini. Bukunya... kayaknya ketinggalan di sana, hilang mungkin," ' +
                      'jawabnya sambil melirik kalender di dinding.',
                  },
                  catatanPedagogis:
                    'Gerbang kejujuran: janji "tidak memaksa hari ini" menurunkan taruhan sehingga ibu berani jujur. ' +
                    'Bila ia bilang "lengkap, bukunya hilang" — sudut buku KIA itu terlihat jelas di balik kalender.',
                },
                {
                  id: 'kk1_d3_b',
                  teks:
                    '"Itu buku KIA-nya di balik kalender kan, Bu? Kenapa disembunyikan? Kalau kolomnya kosong ' +
                    'ya tinggal dilengkapi, bukan ditutup-tutupi begitu."',
                  gaya: 'menghakimi',
                  respons:
                    'Wajah Luh Sari memerah. Ia menarik buku itu dan memeluknya bersama Ayunda — dua hal yang ' +
                    'kini sama-sama harus dilindungi darimu. "Rumah tiang memang berantakan, Dok. Maaf." ' +
                    'Sisa kunjunganmu ia habiskan dengan jawaban satu kata.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Buku itu disembunyikan karena MALU — kolom kosong terasa seperti rapor kegagalannya sebagai ibu. ' +
                    'Menunjuknya dengan telunjuk lurus mengubah malu menjadi benteng.',
                },
                {
                  id: 'kk1_d3_c',
                  teks:
                    '"Tidak usah lihat bukunya juga tidak apa-apa, Bu. Nanti data imunisasinya biar dicek ' +
                    'petugas dari catatan poskesdes saja."',
                  gaya: 'edukasi',
                  respons:
                    '"Nggih, Dok, begitu saja," jawab Luh Sari cepat, jelas lega. Buku merah muda itu tetap di ' +
                    'balik kalender, dan berapa kolom yang kosong tetap jadi tebak-tebakan.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Menyerahkan verifikasi ke "petugas nanti" berarti pulang tanpa data — padahal kamu sudah ' +
                    'di sini, empat puluh menit jalan berbatu dari Puskesmas. Kunjungan rumah tanpa verifikasi ' +
                    'adalah silaturahmi biasa.',
                },
              ],
            },
            {
              id: 'kk1_d4',
              narasi:
                'Pak Ketut pulang dari kebun, kaus lusuh dan cangkul di bahu, lalu duduk di bale sambil menyalakan ' +
                'kretek. "Gimana, Bu? Dokternya mau nyuntik Ayunda?" tanyanya setengah bercanda. Luh Sari menatapmu — ' +
                'menunggu jawaban yang akan menentukan kunjungan ini.',
              pilihan: [
                {
                  id: 'kk1_d4_a',
                  teks:
                    '"Hari ini saya tidak bawa jarum, Pak, tenang saja. Saya cuma mau tanya Ibu: sepuluh tahun ' +
                    'lagi, Ibu kepingin Ayunda jadi anak yang bagaimana? Dan kalau Ibu berkenan, lain kali saya ' +
                    'ceritakan kenapa demam malam itu justru tanda tubuh Ayunda kuat."',
                  gaya: 'refleksi',
                  respons:
                    '"Kepingin dia sekolah tinggi, Dok. Jangan kayak tiang, tamat SMP saja." jawab Luh Sari tanpa ' +
                    'berpikir, lalu tertegun oleh jawabannya sendiri. "...Demam itu tanda kuat? Bukan tanda racun?" ' +
                    'Ia menoleh ke suaminya. "Datang lagi nggih, Dok. Ceritakan yang tadi."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Menanam dua benih sekaligus: nilai jangka panjang (masa depan anak) dan rasa penasaran ' +
                    '(reframe demam sebagai tanda tubuh belajar). Mengakhiri kunjungan dengan pasien MEMINTA ' +
                    'kunjungan berikutnya adalah kemenangan MI.',
                },
                {
                  id: 'kk1_d4_b',
                  teks:
                    '"Justru bagus Bapak pulang. Tolong bilang istrinya, Pak — imunisasi itu wajib. Kalau kepala ' +
                    'keluarga tegas, istri pasti nurut."',
                  gaya: 'memaksa',
                  respons:
                    'Pak Ketut terkekeh canggung sambil melirik istrinya — dan tatapan Luh Sari langsung dingin. ' +
                    '"Yang begadang kalau Ayunda panas itu tiang, Dok, bukan bapaknya," katanya pelan tapi tajam. ' +
                    'Kamu baru saja mengubah calon sekutu jadi dua orang yang sama-sama tersinggung.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Memakai suami sebagai alat penekan merendahkan otonomi ibu — pengambil keputusan pengasuhan ' +
                    'yang sesungguhnya di rumah ini. Keputusan yang dipaksakan lewat kuasa akan dibatalkan ' +
                    'diam-diam begitu kamu pergi.',
                },
                {
                  id: 'kk1_d4_c',
                  teks:
                    '"Belum, Pak. Oh iya, sekalian: merokoknya jangan di dekat bayi nggih. Asap rokok itu bahaya ' +
                    'untuk paru-paru Ayunda. Baik, tiang pamit dulu."',
                  gaya: 'edukasi',
                  respons:
                    'Pak Ketut buru-buru mematikan kreteknya, sungkan. "Nggih, Dok, nggih." Nasihat yang benar — ' +
                    'tapi kunjungan berakhir dengan tugas soal rokok, bukan dengan jembatan menuju imunisasi ' +
                    'yang tadi hampir terbangun.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Nasihat rokoknya benar, tapi menutup kunjungan dengan topik baru membuat pesan utama menguap. ' +
                    'Satu kunjungan, satu fokus — sisanya jadi agenda kunjungan berikutnya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'kk1_i1',
              nama: 'Arisan Bunda Lembah',
              deskripsi:
                'Pertemukan Luh Sari dengan tiga ibu muda RW 7 yang anaknya lengkap imunisasi dalam obrolan santai ' +
                'di balai banjar. Tawarkan satu suntikan bulan ini dengan pendampingan bidan. Bidan menjelaskan KIPI, ' +
                'penggunaan parasetamol sesuai berat badan, dan tanda bahaya yang perlu segera dinilai.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Mendengar Bu Komang bercerita anaknya juga demam semalam lalu besoknya main lagi, Luh Sari ' +
                'tertawa lega — tawa orang yang baru tahu dirinya tidak sendirian. "Jadi anak tiang bukan yang ' +
                'aneh sendiri, nggih?" Ia menatap Ayunda. "Satu dulu, Dok. Yang ditemani bidan itu."',
            },
            {
              id: 'kk1_i2',
              nama: 'Posyandu Jemput Bola',
              deskripsi:
                'Jadwalkan tim posyandu keliling datang ke RW 7 bulan depan sehingga Luh Sari tidak perlu ' +
                'berjalan jauh untuk mengimunisasikan Ayunda.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Meja posyandu digelar tepat di bale banjar, lima puluh langkah dari rumahnya. Luh Sari melihat ' +
                'dari balik pagar, menggendong Ayunda... lalu masuk kembali ke rumah. Jaraknya sudah hilang; ' +
                'takutnya masih utuh di tempat yang sama.',
            },
            {
              id: 'kk1_i3',
              nama: 'Kelas Baca KMS',
              deskripsi:
                'Ajari Luh Sari membaca kurva pertumbuhan dan jadwal imunisasi di buku KIA agar ia paham ' +
                'apa saja yang Ayunda butuhkan dan kapan.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Luh Sari ternyata cepat menangkap — ia kini bisa menunjuk kolom mana yang kosong dan kapan ' +
                'jadwal susulannya. Justru itu masalahnya: makin jelas ia membaca daftar suntikan yang menanti, ' +
                'makin erat ia mendekap Ayunda. Pengetahuan baru tidak menyentuh takutnya.',
            },
            {
              id: 'kk1_i4',
              nama: 'Urus Kartu JKN Dulu',
              deskripsi:
                'Bantu keluarga mengurus pendaftaran JKN-PBI lewat perangkat desa supaya semua layanan ' +
                'kesehatan Ayunda kelak tidak terganjal biaya.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Berkasnya diproses dan itu kabar baik untuk masa depan — tapi imunisasi dasar di posyandu ' +
                'memang gratis sejak dulu. Biaya tidak pernah jadi pagarnya; malam panjang delapan bulan lalu ' +
                'itulah pagarnya, dan ia masih berdiri.',
            },
          ],
          penutupBerhasil:
            'Di jalan setapak, Luh Sari memanggilmu dari ambang pintu: "Dok! Yang demam tanda tubuh berlatih itu... ' +
            'beneran nggih? Bukan menghibur tiang saja?" Kamu mengangguk. Ia mendekap Ayunda, tapi kali ini ' +
            'seperti orang menggenggam keputusan, bukan menyembunyikan ketakutan.',
          penutupGagal:
            'Pintu anyaman itu tertutup sebelum kamu mencapai kebun kopi. Malam ini grup "Bunda Peduli Alami" ' +
            'akan mendapat cerita baru tentang dokter yang jauh-jauh datang untuk menyuntik anak orang — ' +
            'dan kolom-kolom kosong di buku KIA Ayunda akan tetap kosong.',
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "Jalan Setapak ke Posyandu"
         * Kemauan sudah tumbuh; kini hambatannya KAPABILITAS: bingung
         * jadwal kejar (catch-up), tak paham KMS, tak tahu tanggal posyandu.
         * -------------------------------------------------------------- */
        {
          id: 'ketut_k2',
          judul: 'Jalan Setapak ke Posyandu',
          pembuka:
            'Kali ini Luh Sari membukakan pintu sebelum kamu mengetuk, buku KIA sudah di tangannya — tidak lagi ' +
            'di balik kalender. "Dok! Ayunda sudah disuntik yang kemarin itu, tidak panas sama sekali!" serunya, ' +
            'lalu wajahnya berkerut. "Tapi tiang bingung... sekarang harusnya yang mana lagi, kapan?"',
          target: ['imunisasi_dasar', 'pantau_tumbuh_kembang'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Takutnya sudah lewat — ia sendiri yang mengantarkan Ayunda disuntik, dan Pak Ketut siap mengantar ' +
            'dengan motor pinjaman. Tapi halaman jadwal buku KIA penuh coretan bingung, kalender tak bertanda, ' +
            'dan istilah "kejar susulan" membuatnya menyerah. Yang kurang sekarang murni keterampilan: membaca ' +
            'jadwal, menandai tanggal, menimbang rutin.',
          hotspot: [
            {
              id: 'kk2_h1',
              label: 'Buku KIA penuh coretan pensil',
              narasi:
                'Buku KIA kini lecek karena sering dibuka. Di halaman jadwal imunisasi ada coretan-coretan pensil: ' +
                'tanda tanya, panah ke sana kemari, dan tulisan kecil "yang mana?". Satu kolom baru terisi ' +
                'tanda tangan bidan — sisanya masih menunggu, tapi kali ini menunggu kejelasan, bukan keberanian.',
              indikator: 'imunisasi_dasar',
              x: 45,
              y: 40,
            },
            {
              id: 'kk2_h2',
              label: 'Kalender polos tanpa tanda',
              narasi:
                'Kalender yang dulu menyembunyikan buku KIA kini tergantung lurus — dan polos. Tidak ada satu pun ' +
                'lingkaran, tidak ada tanggal posyandu. "Posyandu di banjar itu tiap tanggal berapa nggih, Dok? ' +
                'Tiang tidak pernah hafal," Luh Sari bertanya, sungguh-sungguh tidak tahu.',
              indikator: 'pantau_tumbuh_kembang',
              x: 42,
              y: 20,
            },
            {
              id: 'kk2_h3',
              label: 'Bubur kacang hijau di dapur',
              narasi:
                'Di dapur, panci kecil berisi bubur kacang hijau baru matang. "Kata Bu Komang bagus buat bayi, ' +
                'Dok. Pisangnya tiang kurangi." Susu kental manis itu masih ada di rak — tapi kali ini di ' +
                'belakang, bukan di depan.',
              x: 88,
              y: 52,
            },
            {
              id: 'kk2_h4',
              label: 'Motor pinjaman di halaman',
              narasi:
                'Sebuah motor bebek tua diparkir di halaman. "Pinjam punya adik tiang, Dok," kata Pak Ketut ' +
                'bangga. "Buat antar Ayunda suntik kemarin. Kalau ada jadwal lagi, tinggal bilang — tiang antar."',
              x: 15,
              y: 75,
            },
            {
              id: 'kk2_h5',
              label: 'Asbak batok di bale bengong',
              narasi:
                'Di bale bengong belakang, asbak dari batok kelapa terisi puntung yang masih segar — dua di ' +
                'antaranya diselipkan buru-buru di bawah tatakan cangkir, seperti disembunyikan mendadak ' +
                'begitu ada tamu.',
              indikator: 'tidak_merokok',
              x: 72,
              y: 68,
            },
          ],
          dialog: [
            {
              id: 'kk2_d1',
              narasi:
                'Luh Sari membuka halaman jadwal dan menyodorkannya kepadamu. "Kata bidan kemarin, Ayunda harus ' +
                'kejar susulan. Terus di buku ini tulisannya DPT-HB-Hib ada tiga, polio ada empat, campak nanti ' +
                'umur sembilan bulan... Tiang pusing, Dok. Takut salah urutan malah bahaya."',
              pilihan: [
                {
                  id: 'kk2_d1_a',
                  teks:
                    '"Pertanyaan Ibu itu pertanyaan ibu yang teliti — takut salah urutan artinya Ibu serius. ' +
                    'Coba sekarang kita buka sama-sama: menurut Ibu, dari coretan ini, Ayunda sudah dapat yang mana saja?"',
                  gaya: 'refleksi',
                  respons:
                    'Luh Sari menunjuk satu-satu dengan hati-hati: "Yang waktu lahir... terus yang bikin panas itu... ' +
                    'terus yang kemarin." Tiga tunjukannya benar semua. "Lho, berarti tiang sebenarnya ngerti nggih, ' +
                    'Dok? Cuma takut salah saja tiang ini."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Membingkai kebingungan sebagai ketelitian, lalu mengajak pasien menemukan sendiri bahwa ia ' +
                    'sudah setengah paham — kepercayaan diri adalah bagian dari kapabilitas.',
                },
                {
                  id: 'kk2_d1_b',
                  teks:
                    '"Makanya, Bu, jangan bolong-bolong dari awal. Kalau dulu ikut jadwal, tidak perlu ada ' +
                    'kejar-kejaran begini. Sekarang jadi ruwet kan urusannya."',
                  gaya: 'menghakimi',
                  respons:
                    'Tangan Luh Sari yang memegang buku KIA turun pelan-pelan. "Nggih... salah tiang, Dok." ' +
                    'Semangat yang tadi menyala di ambang pintu — "sudah disuntik, tidak panas!" — meredup ' +
                    'jadi rasa bersalah yang lama.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Mengungkit dosa lama pada pasien yang SEDANG berubah adalah cara tercepat membunuh perubahan. ' +
                    'Bolongnya sudah terjadi; tugasmu menyambungkan, bukan menghakimi.',
                },
                {
                  id: 'kk2_d1_c',
                  teks:
                    '"Gampang, Bu, tidak usah dipikir. Pokoknya tiap bulan datang saja ke posyandu, nanti ' +
                    'bidannya yang mengatur mau disuntik apa. Ibu tinggal duduk manis."',
                  gaya: 'edukasi',
                  respons:
                    '"Ooh... nggih, pokoknya datang," Luh Sari mengangguk, lalu ragu. "Posyandunya itu... tanggal ' +
                    'berapa nggih, Dok?" Dan pertanyaan itu — pertanyaan paling sederhana — tidak terjawab oleh ' +
                    '"pokoknya datang".',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    '"Serahkan ke petugas" terdengar meringankan, tapi melanggengkan ketergantungan — dan gugur ' +
                    'pada pertanyaan pertama: kapan? Ibu yang paham jadwalnya sendiri tidak akan bolong lagi.',
                },
              ],
            },
            {
              id: 'kk2_d2',
              narasi:
                'Ayunda merangkak ke arah timbangan dacin yang berdebu di pojok dan menepuk-nepuknya. Luh Sari ' +
                'tertawa: "Eh, dia kok tahu." Lalu, agak malu: "Ayunda belum pernah tiang timbang lagi dari umur ' +
                'tiga bulan, Dok. Garis di KMS itu... tiang juga tidak ngerti bacanya. Naik turun itu maksudnya apa."',
              pilihan: [
                {
                  id: 'kk2_d2_a',
                  teks:
                    '"Ayunda saja sudah semangat ke timbangan — ibunya tinggal menyusul. Sini, Bu, kita coba ' +
                    'sekarang: kita timbang Ayunda pakai dacin ini, terus saya tunjukkan cara menitikkan di garis KMS. ' +
                    'Sekali praktik biasanya langsung bisa."',
                  gaya: 'empati',
                  respons:
                    'Mereka menimbang Ayunda bersama — 7,9 kilo — dan Luh Sari menitikkan sendiri di kurva dengan ' +
                    'ujung lidah tergigit saking fokusnya. "Di garis hijau, Dok! Berarti bagus nggih?" Ia memandangi ' +
                    'titik kecil buatannya seperti memandangi nilai sepuluh pertamanya.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Belajar sambil praktik (hands-on) mengalahkan seribu penjelasan. Satu titik di garis hijau yang ' +
                    'dititikkan TANGANNYA SENDIRI mengubah KMS dari kertas asing menjadi rapor anaknya.',
                },
                {
                  id: 'kk2_d2_b',
                  teks:
                    '"Dari tiga bulan tidak pernah ditimbang, Bu? Bagaimana Ibu bisa tahu Ayunda kurang gizi ' +
                    'atau tidak? Untung saja anaknya kelihatan sehat."',
                  gaya: 'menghakimi',
                  respons:
                    '"...Untung nggih, Dok," Luh Sari mengangkat Ayunda menjauh dari timbangan, memeluknya. ' +
                    'Kata "kurang gizi" menggantung di udara seperti tuduhan yang menunggu dibuktikan.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Pertanyaan retoris yang menghakimi tidak mengajarkan apa-apa — hanya menempelkan rasa takut ' +
                    'baru pada benda yang justru ingin kamu akrabkan: timbangan.',
                },
                {
                  id: 'kk2_d2_c',
                  teks:
                    '"Garis hijau itu artinya gizi baik, kuning waspada, di bawah garis merah berarti kurang. ' +
                    'Yang penting arahnya naik mengikuti pita. Paham ya, Bu?"',
                  gaya: 'edukasi',
                  respons:
                    '"Hijau bagus, merah kurang..." Luh Sari mengangguk menghafal. Tapi buku itu di tanganmu, ' +
                    'bukan di tangannya — dan dacinnya masih berdebu di pojok. Hafalan tanpa praktik akan luntur ' +
                    'sebelum posyandu berikutnya.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Penjelasannya benar tapi searah. Untuk keterampilan (membaca kurva, menimbang), "paham ya?" ' +
                    'harus diganti "coba sekarang" — kapabilitas dibangun lewat tangan, bukan telinga.',
                },
              ],
            },
            {
              id: 'kk2_d3',
              narasi:
                'Pak Ketut datang dari bale bengong membawa kopi untukmu — dan samar-samar, bau kretek ikut ' +
                'bersamanya. Ia duduk agak jauh dari Ayunda, sesuatu yang tidak ia lakukan di kunjungan pertama. ' +
                '"Gimana, Dok, anak tiang? Berat timbangannya bagus?"',
              pilihan: [
                {
                  id: 'kk2_d3_a',
                  teks:
                    '"Bagus, Pak, di garis hijau — dan saya perhatikan Bapak sekarang duduknya jauh dari Ayunda ' +
                    'kalau habis merokok. Itu sudah satu langkah. Kalau boleh jujur saja: merokoknya sekarang ' +
                    'masih di dalam rumah, atau sudah pindah ke luar semua?"',
                  gaya: 'empati',
                  respons:
                    'Pak Ketut menggaruk kepala, nyengir. "Masih bocor kadang-kadang, Dok. Kalau hujan, tiang ' +
                    'ngerokok di bale bengong belakang — itu masih hitungan dalam rumah nggih? Kalau di kamar sudah ' +
                    'tidak pernah, sumpah. Kasihan Ayunda."',
                  efekTrust: 1,
                  tepat: true,
                  ungkap: {
                    indikator: 'tidak_merokok',
                    ambangTrust: 5,
                    responsBohong:
                      '"Wah, sudah tidak merokok tiang, Dok. Berhenti total dari Ayunda lahir. Demi anak," ' +
                      'jawabnya mantap — sambil tanpa sadar mendorong tatakan cangkir di bale bengong itu ' +
                      'lebih rapat dengan sikunya.',
                  },
                  catatanPedagogis:
                    'Afirmasi perubahan kecil (duduk menjauh) sebelum bertanya membuat jujur terasa aman. ' +
                    'Bila jawabannya "berhenti total demi anak" — asbak batok di bale bengong baru saja diisi pagi ini.',
                },
                {
                  id: 'kk2_d3_b',
                  teks:
                    '"Berat badannya bagus, tapi percuma, Pak, kalau paru-parunya tiap hari dipaksa mengisap ' +
                    'asap kretek Bapak. Bapak ini mau jadi bapak atau jadi cerobong?"',
                  gaya: 'menghakimi',
                  respons:
                    'Senyum Pak Ketut lenyap. Ia meletakkan kopi yang tadinya untukmu di meja, agak keras. ' +
                    '"Tiang kerja di kebun buat beli susunya Ayunda, Dok." Luh Sari buru-buru menengahi dengan ' +
                    'menawarkan pisang goreng. Sisa obrolan jadi serba canggung.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Kata "cerobong" itu pukulan ke harga diri, bukan konseling berhenti merokok. Ayah muda ini ' +
                    'SUDAH bergerak (menjauh dari bayi saat merokok) — ejekan bisa memutar arahnya kembali.',
                },
                {
                  id: 'kk2_d3_c',
                  teks:
                    '"Bagus kok, Pak, garis hijau. Sudah, yang penting timbangannya bagus. Kopinya diminum ' +
                    'sambil ngobrol santai saja kita."',
                  gaya: 'edukasi',
                  respons:
                    'Obrolan mengalir hangat soal panen kopi dan harga pupuk. Kunjungan yang menyenangkan — ' +
                    'dan bau kretek dari bale bengong itu lewat begitu saja, tidak pernah dibicarakan siapa pun.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Hangat itu perlu, tapi indikator "keluarga tidak merokok" tidak akan pernah bergerak kalau ' +
                    'topiknya tidak pernah dibuka. Kenyamanan bukan tujuan kunjungan — perubahan yang nyaman itulah tujuannya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'kk2_i1',
              nama: 'Kalender Ayunda',
              deskripsi:
                'Buat "Kalender Ayunda" bersama Luh Sari. Tandai jadwal kejar imunisasi dan penimbangan dengan ' +
                'warna berbeda, lalu sesuaikan dengan tanggal posyandu banjar. Minta Luh Sari menjelaskan kembali ' +
                'seluruh jadwal dengan kata-katanya sendiri di hadapan Pak Ketut.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Kalender yang dulu polos kini ramai tanda merah dan hijau, dan Luh Sari menjelaskannya kepada ' +
                'suaminya seperti guru muda: "Tanggal segini polio tetes, bulan depannya campak pas sembilan bulan..." ' +
                'Pak Ketut mengangguk-angguk sambil menghitung bensin. Tidak ada lagi "yang mana?" di buku KIA.',
            },
            {
              id: 'kk2_i2',
              nama: 'Testimoni Bunda Lembah Jilid Dua',
              deskripsi:
                'Undang lagi kelompok ibu muda RW 7 untuk berbagi cerita agar keyakinan Luh Sari pada ' +
                'imunisasi makin kokoh dan tidak goyah oleh grup WA.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Sorenya menyenangkan dan Luh Sari makin mantap — padahal mantapnya sudah dari kemarin, sejak ' +
                'Ayunda disuntik dan tidak panas. Pulang dari arisan, ia membuka buku KIA dan berhenti lagi di ' +
                'halaman jadwal yang sama membingungkannya. Keyakinan sudah penuh; peta jalannya yang belum ada.',
            },
            {
              id: 'kk2_i3',
              nama: 'Antar-Jemput Posyandu',
              deskripsi:
                'Koordinasikan ojek kader untuk menjemput Luh Sari dan Ayunda setiap jadwal posyandu supaya ' +
                'mereka tidak pernah absen karena jarak.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Ojek kader datang di hari yang ia kira jadwal posyandu — ternyata posyandunya minggu depan. ' +
                'Motor pinjaman adik iparnya pun sebenarnya selalu siap. Kendaraan bukan masalah keluarga ini ' +
                'lagi; yang belum mereka pegang adalah TANGGALNYA.',
            },
          ],
          penutupBerhasil:
            'Dari jalan setapak, rumah anyaman itu terlihat berbeda: kalender berwarna-warni di dinding, buku KIA ' +
            'terbuka di atas tikar, dan Luh Sari sedang menunjuk-nunjuk tanggal sambil menggendong Ayunda. ' +
            '"Tanggal tujuh, Dok! Polio tetes! Tiang yang hafal sekarang!" serunya, melambai sampai kamu hilang ' +
            'di balik kebun kopi.',
          penutupGagal:
            'Kamu pamit dari keluarga yang sudah percaya tapi masih tersesat: kalender tetap polos, halaman ' +
            'jadwal tetap penuh tanda tanya, dan motor pinjaman itu akan menganggur — sebab niat berangkat ' +
            'tanpa tahu tanggal berangkat hanyalah niat.',
        },
      ],
      epilogBerhasil:
        'Pada penimbangan bulan berikutnya, nama "Putu Ayunda" dipanggil pertama — ibunya datang paling pagi. ' +
        'Kolom-kolom buku KIA itu terisi satu per satu sampai tuntas campak di bulan kesembilan, dan di grup ' +
        '"Bunda Peduli Alami", satu anggota mulai membalas hoaks dengan cerita: "Anak tiang disuntik lengkap, ' +
        'sehat. Tiang saksinya."',
      epilogGagal:
        'Musim hujan turun ke lembah, dan bersama itu campak berkeliling dari rumah ke rumah. Ayunda demam tinggi ' +
        'dengan bercak merah di hari ketiga — digendong menembus jalan berbatu yang licin, empat puluh menit yang ' +
        'kini terasa empat jam, menuju Puskesmas yang dulu hanya sejauh satu keputusan.',
    },
  },
]
