/**
 * KELUARGA BINAAN DESA F (M3c) — tiga keluarga arc 1-babak penutup.
 * Ketiganya berhambatan MOTIVASI tapi dengan rasa yang sangat berbeda —
 * kenyamanan kebiasaan (bagyo), kuasa adat keluarga (endah), keyakinan
 * maskulin-religius (karsa) — supaya pemain tak bisa menebak hambatan
 * dari sekadar "temanya".
 *
 * keluarga_bagyo : BAB di kali turun-temurun — jamban_sehat (motivasi).
 * keluarga_endah : bumil anak pertama, TB 142 cm, adat "mulih lahiran
 *                  ke rumah ibu" — persalinan_faskes (motivasi keluarga).
 * keluarga_karsa : 5 anak, istri kelelahan, suami menolak KB — kb (motivasi).
 */

import type { KeluargaBinaan } from '../types'

export const KELUARGA_DESA_F: KeluargaBinaan[] = [
  /* =========================================================================
   * KELUARGA BAGYO — RW 7 (terpencil), miskin — JAMBAN (motivasi/kebiasaan)
   * ======================================================================= */
  {
    id: 'keluarga_bagyo',
    namaKeluarga: 'Keluarga Pak Bagyo',
    rw: 7,
    jarakMenit: 35,
    ekonomi: 'miskin',
    anggota: [
      { nama: 'Pak Bagyo', usia: 48, jenisKelamin: 'L', peran: 'kepala', kondisi: ['perokok_aktif'] },
      { nama: 'Bu Jum', usia: 43, jenisKelamin: 'P', peran: 'istri' },
      { nama: 'Tini', usia: 14, jenisKelamin: 'P', peran: 'anak' },
    ],
    indikatorAwal: {
      kb: 'ya',
      persalinan_faskes: 'na',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'tidak',
    },
    arc: {
      sinopsis:
        'Keluarga Pak Bagyo PUNYA jamban — bantuan program tahun lalu, masih kinclong. Tapi tiap subuh, ' +
        'jalur ke kali di belakang rumah tetap ramai: "jamban itu buat tamu, Dok."',
      kunjungan: [
        {
          id: 'bagyo_k1',
          judul: 'Jamban untuk Tamu',
          pembuka:
            'Rumah panggung di bibir kali, sejuk oleh bambu. Jamban bantuan itu berdiri di samping rumah — ' +
            'bersih mengilap, gayungnya masih bergantung rapi seperti pajangan toko. Pak Bagyo menyambut ' +
            'dari arah kali, handuk di bahu. "Pas, Dok! Habis dari \'kantor lama\'," ia terbahak.',
          target: ['jamban_sehat'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Jamban ADA, air ADA, semua orang TAHU fungsinya — dan tetap memilih kali: "lebih adem, sekalian ' +
            'ngobrol sama tetangga, dari zaman simbah ya begitu." Bagi Pak Bagyo, kali subuh adalah warung ' +
            'kopi sosial, dan jamban adalah kamar sempit yang sumpek. Ini kenyamanan & kebiasaan kolektif — ' +
            'bukan akses (sudah dibangunkan), bukan pengetahuan (penyuluhan sudah dua kali).',
          hotspot: [
            {
              id: 'bk1_h1',
              label: 'Jamban kinclong tak terpakai',
              narasi:
                'Kloset jongkok bersih tanpa noda pemakaian, sarang laba-laba kecil di sudut atap, ember ' +
                'penuh air yang jernih menganggur. Bangunan setahun yang masih seperti baru diresmikan.',
              indikator: 'jamban_sehat',
              x: 78,
              y: 50,
            },
            {
              id: 'bk1_h2',
              label: 'Jalan setapak licin ke kali',
              narasi:
                'Dari pintu belakang, jalan setapak yang MENGKILAP karena dipakai tiap hari menurun ke kali. ' +
                'Di tepinya tergantung ember dan sandal jepit antre — infrastruktur kebiasaan yang terawat.',
              x: 20,
              y: 70,
            },
            {
              id: 'bk1_h3',
              label: 'Sertifikat penyuluhan STBM di dinding',
              narasi:
                'Dipigura dan digantung bangga: piagam "Peserta Pemicuan STBM Desa" atas nama Pak Bagyo, ' +
                'tahun lalu. Ia hadir, ia paham, ia dapat piagam — dan tetap ke kali.',
              x: 55,
              y: 30,
            },
            {
              id: 'bk1_h4',
              label: 'Tini menjemur seragam dekat tanggul',
              narasi:
                'Tini menjemur seragam SMP-nya di tanggul. "Dia satu-satunya yang pakai jamban, Dok," ' +
                'kata Bu Jum. "Katanya malu sama teman sekolah kalau ketahuan ke kali." Generasi yang berbelok.',
              x: 40,
              y: 80,
            },
          ],
          dialog: [
            {
              id: 'bk1_d1',
              narasi:
                '"Bukan kami tidak bersyukur dibangunkan, Dok," Pak Bagyo menuang kopi. "Tapi ke kali itu ' +
                'sudah kayak subuh berjamaah. Ketemu Kang Wo, Kang Dul, sekalian rasan-rasan harga gabah. ' +
                'Di jamban? Sendirian, sumpek, panas."',
              pilihan: [
                {
                  id: 'bk1_d1_a',
                  teks:
                    '"Jadi yang berat ditinggal itu bukan kalinya — obrolan subuhnya. Kalau begitu saya ' +
                    'tanya: yang di hilir, yang tiap pagi nimba air dari kali yang sama itu... keluarga ' +
                    'siapa saja ya, Pak?"',
                  gaya: 'refleksi',
                  respons:
                    'Pak Bagyo menyeruput kopi, lalu berhenti di tengah seruputan. "...Hilir itu rumahnya ' +
                    'Lek Karno. Sama mertuanya Kang Dul." Ia meletakkan gelas. "Wah. Kang Dul tiap subuh ' +
                    'nyetor di hulu, mertuanya nimba di hilir." Ia tertawa — getir, kali ini.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Teknik pemicuan STBM sejati: alur kontaminasi dipetakan dengan NAMA-NAMA yang mereka ' +
                    'kenal, bukan diagram kuman. Rasa jijik & malu yang muncul sendiri adalah motor perubahan.',
                },
                {
                  id: 'bk1_d1_b',
                  teks:
                    '"Tapi Pak, BAB di kali itu menyebarkan kuman tinja lewat air — diare, tifus, cacingan. ' +
                    'Di penyuluhan STBM kemarin kan sudah dijelaskan alurnya."',
                  gaya: 'edukasi',
                  respons:
                    '"Sudah, Dok, lengkap sama gambar-gambarnya," Pak Bagyo menunjuk piagamnya di dinding, ' +
                    'bangga. "Saya sampai dapat piagam." Materinya sampai; kalinya tetap ramai. Ceramah ketiga ' +
                    'tidak akan berbeda nasibnya.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Piagam di dinding itu bukti bahwa pengetahuan BUKAN hambatannya. Mengulang materi yang ' +
                    'sudah lulus diujikan = salah sasaran intervensi.',
                },
                {
                  id: 'bk1_d1_c',
                  teks:
                    '"Pak, jamban bantuan itu dibangun pakai uang negara. Kalau tidak dipakai begini, ' +
                    'namanya menyia-nyiakan — bisa-bisa desa ini dicoret dari program bantuan berikutnya."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Lho, kami tidak pernah minta dibangunkan, Dok," Pak Bagyo meletakkan gelasnya. ' +
                    '"Datang-datang tukang ngukur tanah. Sekarang malah kami yang diancam-ancam." Kopi ' +
                    'sambutan itu tidak dituang ulang.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Jamban yang dibangun TANPA pemicuan memang sering jadi monumen — dan menagih rasa terima ' +
                    'kasih atas barang yang tak diminta hanya menambah jarak. Perubahan sanitasi dimulai dari ' +
                    'dalam, bukan dari ancaman program.',
                },
              ],
            },
            {
              id: 'bk1_d2',
              narasi:
                'Bu Jum ikut duduk. "Sebenarnya pas musim hujan kemarin Tini sama saya mencret bareng, ' +
                'Dok. Tapi kata orang-orang ya karena musim, bukan karena kali. Wong dari zaman simbah ' +
                'minum air kali ya sehat-sehat."',
              pilihan: [
                {
                  id: 'bk1_d2_a',
                  teks:
                    '"Zaman simbah, yang buang hajat di kali ini berapa rumah, Bu? Dan sekarang berapa? ' +
                    'Kalinya masih kali yang sama — isinya yang sudah beda jauh."',
                  gaya: 'refleksi',
                  respons:
                    '"Zaman simbah... paling lima rumah, Dok. Sekarang?" Bu Jum menghitung dengan alis ' +
                    'berkerut. "Tiga puluhan lebih, sejak perumahan bedol desa itu." Pak Bagyo menimpali ' +
                    'pelan: "Pantes airnya sekarang buthek terus, ora kaya mbiyen." Nostalgianya baru saja ' +
                    'bertemu aritmetika.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    '"Dulu sehat-sehat saja" dijawab bukan dengan bantahan, tapi dengan menunjukkan bahwa ' +
                    'DULU dan SEKARANG bukan situasi yang sama. Biarkan pasien menghitung sendiri bedanya.',
                },
                {
                  id: 'bk1_d2_b',
                  teks:
                    '"Itu namanya bias penyintas, Bu — yang sakit dan meninggal zaman dulu kan tidak ' +
                    'sempat cerita. Data diare kecamatan naik 30% tiap musim hujan, tertinggi di RW ' +
                    'bantaran kali."',
                  gaya: 'edukasi',
                  respons:
                    '"Bias... penyintas," Bu Jum mengangguk sopan pada istilah asing itu. Angka 30% lewat ' +
                    'seperti angin kali — statistik kecamatan selalu kalah nyata dibanding "simbah sehat ' +
                    'sampai sembilan puluh".',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Data agregat jarang mengubah keyakinan komunal. Yang menggerakkan adalah cerita LOKAL ' +
                    'dengan nama dan alamat — mencretnya Tini lebih berharga dari statistik satu kecamatan.',
                },
                {
                  id: 'bk1_d2_c',
                  teks:
                    '"Mencret bareng sekeluarga kok masih bilang karena musim, Bu. Itu ya dari kali itu. ' +
                    'Masa harus nunggu ada yang opname dulu baru percaya?"',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Jum terdiam, tersudut di rumahnya sendiri. Pak Bagyo mengalihkan: "Wis, Dok, kopinya ' +
                    'diminum. Adem-adem begini enaknya ngobrol yang ringan-ringan." Topik ditutup dengan ' +
                    'keramahan — pintu khas desa untuk tamu yang mulai tidak sopan.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Menyudutkan dengan "masa harus nunggu opname" adalah taruhan yang buruk: bila tak ada ' +
                    'yang opname, kamu pembohong; bila ada, kamu pembawa sial. Dua-duanya kalah.',
                },
              ],
            },
            {
              id: 'bk1_d3',
              narasi:
                'Tini selesai menjemur dan duduk di undakan, mendengarkan. "Kalau aku sih tim jamban, Dok," ' +
                'katanya tiba-tiba. "Di sekolah diajari, dan jijik tahu nggak sih liat bapak-bapak jongkok ' +
                'rame-rame." Pak Bagyo tersedak kopinya.',
              pilihan: [
                {
                  id: 'bk1_d3_a',
                  teks:
                    '"Nah — Pak, dengar itu? Generasi Tini sudah pindah sendiri. Pertanyaannya tinggal: ' +
                    'Bapak mau jadi angkatan TERAKHIR yang ke kali, atau angkatan pertama yang pindah? ' +
                    'Soal obrolan subuh Kang Wo dan Kang Dul — pos ronda itu kurang apa? Kopi bisa pindah tempat."',
                  gaya: 'empati',
                  respons:
                    'Pak Bagyo memandang anaknya, lalu jalan setapak ke kali, lalu jamban kinclongnya. ' +
                    '"Angkatan terakhir..." ia mengulang, seperti mencoba ukuran baju. "Kang Wo sama Kang Dul ' +
                    'itu sebenarnya juga sudah dibangunkan jamban semua, Dok. Cuma ya... saling tunggu siapa ' +
                    'yang pindah duluan." Kunci sosialnya baru saja terlihat: tak ada yang mau jadi yang pertama.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'jamban_sehat',
                    ambangTrust: 5,
                    responsBohong:
                      '"Kami sudah pakai jamban kok, Dok, sudah pindah semua," kata Pak Bagyo lancar — ' +
                      'sementara handuk di bahunya masih lembap oleh subuh tadi di kali.',
                  },
                  catatanPedagogis:
                    'Perilaku kolektif macet karena TAK ADA PENGGERAK PERTAMA. Memberi peran terhormat ' +
                    '("angkatan pertama yang pindah") + memindahkan fungsi sosialnya (kopi pos ronda) menjawab ' +
                    'dua hal yang sebenarnya ia pertahankan.',
                },
                {
                  id: 'bk1_d3_b',
                  teks:
                    '"Pinter anaknya, Pak. Nah, biar Tini saja yang tiap hari mengingatkan bapak-ibunya ' +
                    'pakai jamban. Anak muda kan lebih didengar sekarang."',
                  gaya: 'edukasi',
                  respons:
                    'Tini meringis. "Aku yang kena, Dok..." Menyuruh anak SMP menceramahi bapaknya tiap ' +
                    'hari adalah resep perang dingin rumah tangga, bukan perubahan perilaku. Pak Bagyo ' +
                    'tersenyum menang.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Membebankan perubahan orang tua pada anak = membalik struktur kuasa Jawa tanpa bekal. ' +
                    'Anak boleh jadi inspirasi (seperti barusan, alami) — jangan diangkat jadi pengawas.',
                },
                {
                  id: 'bk1_d3_c',
                  teks:
                    '"Betul kata Tini — jijik, Pak. Orang dewasa harusnya lebih tahu malu daripada ' +
                    'anak SMP."',
                  gaya: 'konfrontasi',
                  respons:
                    'Tawa di undakan itu mati. Pak Bagyo menatap kopimu yang belum habis: "Wis sore, Dok. ' +
                    'Jalan ke bawah licin kalau gelap." Diusir dengan halus, oleh tuan rumah yang barusan ' +
                    'dipermalukan di depan anaknya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Meminjam mulut anak untuk menghina bapaknya adalah konfrontasi terburuk: kau kehilangan ' +
                    'bapaknya DAN menempatkan anak itu pada posisi durhaka. Jangan pernah.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'bk1_i1',
              nama: 'Deklarasi Pindah Berjamaah + Kopi Pos Ronda',
              deskripsi:
                'Pecahkan kemacetan "saling tunggu": kumpulkan Pak Bagyo, Kang Wo, Kang Dul, dan para ' +
                'pemilik jamban-monumen lain untuk DEKLARASI pindah bersama satu tanggal (tak ada yang jadi ' +
                'yang pertama sendirian), pindahkan ritual kopi subuh ke pos ronda, dan Pak Bagyo — ' +
                'pemegang piagam STBM — didaulat jadi ketua gerakannya.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Deklarasinya jadi tontonan setengah kampung: tujuh kepala keluarga tanda tangan di kertas ' +
                'manila, disaksikan kader dan anak-anak yang bersorak. Subuh-subuh berikutnya, pos ronda ' +
                'wangi kopi dan rasan-rasan harga gabah — jalur setapak ke kali mulai ditumbuhi rumput. ' +
                '"Sing penting ora ijenan, Dok," kata Pak Bagyo. Yang penting tidak sendirian.',
            },
            {
              id: 'bk1_i2',
              nama: 'Perbaikan Kenyamanan Jamban',
              deskripsi:
                'Tambah ventilasi, penerangan, dan gantungan handuk di jamban supaya tidak "sumpek dan ' +
                'panas" seperti keluhan Pak Bagyo.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Jamban itu kini paling nyaman se-RT — terang, sejuk, wangi karbol. Dan tetap paling bersih, ' +
                'karena tetap nyaris tak terpakai: yang dirindukan Pak Bagyo di kali bukan angin, tapi ' +
                'Kang Wo dan Kang Dul. Kenyamanan fisik tidak menjawab kehilangan sosial.',
            },
            {
              id: 'bk1_i3',
              nama: 'Penyuluhan STBM Putaran Ketiga',
              deskripsi:
                'Ulangi pemicuan STBM dengan materi alur kontaminasi tinja-air-mulut yang lebih detail.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Kehadiran lengkap, piagam bertambah satu di dinding. Pak Bagyo kini bisa menggambar alur ' +
                'kontaminasi lebih rapi dari kadernya — sambil tetap menggulung handuk tiap subuh. Putaran ' +
                'keempat sudah tidak ada yang mengusulkan.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit lewat jalan depan — dan Pak Bagyo memanggil dari teras: "Dok! Sabtu pagi ke sini. ' +
            'Ada acara tanda tangan-tanda tangan sama Kang Wo. Bawa stempel Puskesmas sekalian, biar sakral." ' +
            'Di undakan, Tini mengacungkan dua jempol tanpa suara.',
          penutupGagal:
            'Subuh besok jalur setapak itu akan mengkilap lagi, dan jamban kinclong itu kembali ke tugas ' +
            'utamanya: menunggu tamu. Di dinding, piagam STBM tersenyum dalam pigura — bukti paling rapi ' +
            'bahwa tahu dan mau adalah dua sungai yang berbeda.',
        },
      ],
      epilogBerhasil:
        'Tiga bulan kemudian RW 7 diusulkan jadi "Dusun ODF" — open defecation free — pertama di desa. ' +
        'Di verifikasi lapangan, Pak Bagyo memandu petugas kabupaten dengan piagam terselip di saku, ' +
        'menunjuk jalur setapak yang kini ditanami singkong: "Bekas kantor lama, Pak. Sudah tutup. ' +
        'Pindah ke sebelah, yang ada atapnya."',
      epilogGagal:
        'Musim hujan berikutnya, kali itu meluap sampai undakan — membawa pulang semua yang pernah disetor ' +
        'ke hulu. Seminggu setelahnya, catatan kader mencatat empat KK bantaran mencret bergiliran, ' +
        'termasuk Bu Jum. "Musim, Dok," kata orang-orang. Jamban-jamban kinclong itu tetap menunggu tamu.',
    },
  },

  /* =========================================================================
   * KELUARGA ENDAH — RW 4 (sedang), cukup — PERSALINAN FASKES (motivasi/adat)
   * ======================================================================= */
  {
    id: 'keluarga_endah',
    namaKeluarga: 'Keluarga Mas Andri & Mbak Endah',
    rw: 4,
    jarakMenit: 18,
    ekonomi: 'cukup',
    anggota: [
      { nama: 'Mas Andri', usia: 27, jenisKelamin: 'L', peran: 'kepala' },
      {
        nama: 'Mbak Endah',
        usia: 23,
        jenisKelamin: 'P',
        peran: 'istri',
        kondisi: ['hamil_g1p0', 'tinggi_badan_142cm'],
      },
    ],
    indikatorAwal: {
      kb: 'na',
      persalinan_faskes: 'tidak',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'ya',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Mbak Endah (23) hamil anak pertama, rajin ANC, sehat — kecuali satu angka yang tak bisa diubah: ' +
        'tinggi 142 cm. Dan satu adat yang tak boleh dilanggar: anak pertama lahir di rumah ibu, ' +
        'di kaki gunung, dua jam dari faskes terdekat.',
      kunjungan: [
        {
          id: 'endah_k1',
          judul: 'Mulih Lahiran',
          pembuka:
            'Rumah kontrakan kecil pasangan muda: rapi, penuh perlengkapan bayi serba pink hasil menabung. ' +
            'Buku KIA Mbak Endah paling rajin se-desa — semua kolom terisi. "Bulan depan kami mulih ke ' +
            'rumah Ibu, Dok," katanya cerah. "Adatnya begitu, anak pertama lahiran di rumah orang tua."',
          target: ['persalinan_faskes'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Endah sendiri sebenarnya ingin bersalin di Puskesmas PONED — bidannya sudah mewanti-wanti soal ' +
            'panggul sempit. Yang menahannya bukan dirinya: ibunya di kampung sudah menyiapkan kamar, ' +
            'selamatan, dan "kata Ibu, pamali anak pertama lahir di tempat orang". Andri terjepit antara ' +
            'istri dan mertua. Ini motivasi KELUARGA BESAR — dan pemegang vetonya tak tinggal di rumah ini.',
          hotspot: [
            {
              id: 'ek1_h1',
              label: 'Buku KIA dengan stabilo kuning',
              narasi:
                'Buku KIA terisi penuh, rapi. Di halaman skrining, bidan menstabilo kuning satu baris: ' +
                '"TB < 145 cm — risiko CPD (panggul sempit), rencanakan persalinan di faskes mampu PONED." ' +
                'Di bawahnya, tulisan tangan Endah sendiri: tanda tanya kecil.',
              indikator: 'persalinan_faskes',
              x: 45,
              y: 35,
            },
            {
              id: 'ek1_h2',
              label: 'Tas mudik yang sudah dikemas',
              narasi:
                'Di sudut kamar, tas besar sudah terkemas rapi — baju bayi, jarik, perlengkapan empat puluh ' +
                'hari. Tiket travel ke kampung tertulis di kertas yang diselipkan di risleting: dua minggu lagi.',
              x: 75,
              y: 60,
            },
            {
              id: 'ek1_h3',
              label: 'Foto pernikahan dengan keluarga besar',
              narasi:
                'Foto pernikahan setahun lalu: keluarga besar Endah berdiri formasi lengkap, ibunya di ' +
                'tengah memegang kedua tangan pengantin. Posisi tangan yang menjelaskan struktur komando keluarga.',
              x: 20,
              y: 30,
            },
            {
              id: 'ek1_h4',
              label: 'HP Andri penuh chat "Ibu"',
              narasi:
                'HP Andri menyala di meja: deretan chat dari kontak "Ibu (Mertua)" — foto kamar yang sudah ' +
                'dicat ulang, jadwal selamatan, daftar nama sesepuh yang akan datang. Panitia sudah bekerja; ' +
                'yang belum ditanya cuma panggul Endah.',
              x: 85,
              y: 45,
            },
          ],
          dialog: [
            {
              id: 'ek1_d1',
              narasi:
                '"Bu bidan bilang panggul saya sempit, harus di PONED," Endah membuka buku KIA-nya, jarinya ' +
                'berhenti di baris stabilo. "Tapi Ibu sudah nyiapkan semuanya di kampung, Dok. Kamar sudah ' +
                'dicat. Masa saya bilang tidak jadi... Ibu pasti sedih sekali."',
              pilihan: [
                {
                  id: 'ek1_d1_a',
                  teks:
                    '"Jadi sebenarnya hati Mbak Endah sudah tahu harus di mana — yang berat itu ' +
                    'menyampaikannya ke Ibu. Betul? Kalau begitu yang kita cari bukan keputusannya, ' +
                    'tapi CARA bilangnya."',
                  gaya: 'refleksi',
                  respons:
                    'Mata Endah berkaca seketika. "Iya, Dok... saya takut sama lahirannya, tapi lebih takut ' +
                    'bilang ke Ibu." Andri meraih tangan istrinya — lega ada yang akhirnya mengucapkan ' +
                    'masalah yang sebenarnya. "Nah itu, Dok. Itu masalah kami dua minggu ini."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Memisahkan KEPUTUSAN KLINIS (sudah jelas: PONED) dari MASALAH KOMUNIKASI (cara bilang ke ' +
                    'ibu) membuat masalahnya mendadak bisa dikerjakan. Jangan mengulang edukasi CPD pada pasien ' +
                    'yang sudah percaya — bantu ia melewati orang yang belum.',
                },
                {
                  id: 'ek1_d1_b',
                  teks:
                    '"Panggul sempit dengan taksiran bayi normal itu risiko partus macet, Mbak. Kalau macet ' +
                    'di kampung yang dua jam dari faskes, itu bisa fatal untuk ibu dan bayi. Medisnya jelas: ' +
                    'harus PONED."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya, Dok, bu bidan juga bilang persis begitu." Endah menutup buku KIA-nya pelan. ' +
                    '"Saya percaya kok." Ia percaya — dan tas mudik itu tetap terkemas di sudut kamar, ' +
                    'karena bukan keyakinannya yang perlu diyakinkan.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Kamu baru saja memenangkan debat yang sudah dimenangkan bidan minggu lalu. Pasien ini ' +
                    'butuh sekutu menghadapi ibunya, bukan penjelasan ketiga tentang CPD.',
                },
                {
                  id: 'ek1_d1_c',
                  teks:
                    '"Adat itu bagus, Mbak, tapi nyawa lebih penting dari perasaan Ibu. Orang tua yang baik ' +
                    'pasti ngerti. Kalau tidak ngerti, ya berarti egois namanya."',
                  gaya: 'konfrontasi',
                  respons:
                    'Endah menegang. "Ibu saya tidak egois, Dok. Beliau cuma... sayang, caranya begitu." ' +
                    'Andri ikut diam. Kamu barusan menghina calon nenek di rumah anaknya — dan mereka berdua ' +
                    'kini satu barisan: membela Ibu.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Memaksa pasien memilih "nyawa vs ibu" adalah dikotomi palsu yang kejam. Sang ibu bukan ' +
                    'musuh rencana persalinan — ia calon sekutu terkuat yang belum diberi informasi.',
                },
              ],
            },
            {
              id: 'ek1_d2',
              narasi:
                '"Sebenarnya yang paling repot posisi saya, Dok," Andri angkat bicara. "Istri saya taruhan ' +
                'nyawanya, mertua saya taruhan perasaannya. Saya ini menantu baru — mau ngomong apa saya, ' +
                'salah-salah dikira merebut anak orang."',
              pilihan: [
                {
                  id: 'ek1_d2_a',
                  teks:
                    '"Makanya jangan Mas yang ngomong — dan jangan Mbak Endah juga. Yang paling didengar ' +
                    'ibu-ibu soal persalinan itu sesama perempuan yang paham: bidan. Bagaimana kalau kita ' +
                    'bikin \'ANC keluarga\' — Ibu diundang ikut periksa kehamilan, dengar langsung dari bidan, ' +
                    'lihat sendiri USG-nya?"',
                  gaya: 'empati',
                  respons:
                    'Andri dan Endah bertukar pandang cepat. "Ibu... diundang ikut periksa?" Endah mengulang. ' +
                    '"Beliau pasti mau, Dok — beliau paling senang dilibatkan. Selama ini kan memang tidak ' +
                    'pernah diajak, cuma dikabari." Kalimat terakhir itu jatuh seperti kunci yang menemukan lubangnya.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'persalinan_faskes',
                    ambangTrust: 5,
                    responsBohong:
                      '"Rencananya tetap di Puskesmas kok, Dok," kata Endah sambil tersenyum — dan matanya ' +
                      'melirik sekilas ke tas mudik yang terkemas rapi dengan tiket dua minggu lagi itu.',
                  },
                  catatanPedagogis:
                    'Sang ibu menolak karena DIKABARI, bukan DILIBATKAN. Mengundangnya masuk ke lingkar ' +
                    'keputusan (ANC bersama, dengar dari bidan, lihat USG) mengubah lawan adat jadi panitia ' +
                    'keselamatan. Konflik keluarga jarang soal isi — hampir selalu soal siapa diajak bicara.',
                },
                {
                  id: 'ek1_d2_b',
                  teks:
                    '"Mas Andri kan kepala keluarga sekarang. Secara hukum dan agama, keputusan ada di ' +
                    'Mas. Tegas saja: demi keselamatan istri, lahiran di PONED. Titik."',
                  gaya: 'edukasi',
                  respons:
                    'Andri tertawa tanpa suara. "Tegas ke mertua, Dok. Sampeyan sudah pernah?" Teorinya ' +
                    'benar di buku; di rumah orang Jawa, menantu setahun yang "tegas" pada mertua sedang ' +
                    'menulis surat perang untuk sepuluh tahun ke depan.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    '"Kepala keluarga harus tegas" mengabaikan ekologi kuasa keluarga besar. Solusi yang ' +
                    'memenangkan persalinan tapi menghancurkan hubungan mertua-menantu bukan kemenangan.',
                },
                {
                  id: 'ek1_d2_c',
                  teks:
                    '"Ya sudah, jalan tengahnya: mulih saja sesuai adat, tapi pas mendekati HPL pindah ke ' +
                    'penginapan dekat RS kabupaten sana. Adat jalan, medis jalan."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Penginapan..." Andri menghitung: sebulan penginapan + makan berdua + wara-wiri, ' +
                    'dengan tabungan yang sudah habis untuk perlengkapan bayi. "Boleh saya pikir-pikir, Dok." ' +
                    'Jalan tengah yang mahal adalah jalan buntu yang sopan.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Kompromi kreatif tetap harus lolos uji dompet. Dan intinya terlewat: masalahnya bukan ' +
                    'lokasi vs adat, tapi ibu yang belum pernah diajak duduk di meja keputusan.',
                },
              ],
            },
            {
              id: 'ek1_d3',
              narasi:
                'HP Andri bergetar — "Ibu (Mertua)" menelepon, seperti tiap sore. Andri menatapmu: ' +
                '"Diangkat, Dok? Atau..." Endah mengelus perutnya, menunggu.',
              pilihan: [
                {
                  id: 'ek1_d3_a',
                  teks:
                    '"Angkat — dan kalau Ibu berkenan, kenalkan saya. Bukan untuk membahas lokasi lahiran ' +
                    'hari ini, cukup: \'Bu, ada dokter Puskesmas, beliau kepingin mengundang Ibu ikut ' +
                    'periksa kehamilan Endah minggu depan.\' Sisanya biar berjalan sendiri."',
                  gaya: 'empati',
                  respons:
                    'Panggilan diangkat, pengeras dinyalakan. Suara di seberang ramai soal cat kamar — lalu ' +
                    'hening mendengar undangan itu. "...Aku diajak periksa? Naik apa ya, travel pagi ada ' +
                    'nggak ya—" suara itu mendadak sibuk MERENCANAKAN DATANG. Endah menutup mulutnya, ' +
                    'antara tawa dan haru.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Undangan tanpa agenda tersembunyi ("bukan membahas lokasi hari ini") menurunkan tembok. ' +
                    'Begitu sang ibu duduk di ruang ANC dan mendengar kata "panggul sempit" dari bidan sambil ' +
                    'melihat cucunya di layar USG — adat akan bernegosiasi dengan sendirinya.',
                },
                {
                  id: 'ek1_d3_b',
                  teks:
                    '"Jangan sekarang — nanti malah panjang. Tulis dulu poin-poinnya, baru besok ' +
                    'ditelepon balik dengan persiapan matang."',
                  gaya: 'edukasi',
                  respons:
                    'Panggilan berdering sampai habis. Di layar: "Ibu (Mertua) — 2 panggilan tak terjawab". ' +
                    'Besok sang ibu akan bertanya kenapa tak diangkat, dan percakapan akan dimulai dari ' +
                    'defisit — bukan dari undangan.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Momen hangat yang ditunda demi "persiapan" sering tidak kembali. Panggilan sore rutin ' +
                    'itu justru pintu paling alami — masuklah saat pintunya sedang terbuka.',
                },
                {
                  id: 'ek1_d3_c',
                  teks:
                    '(Memberi isyarat minta HP) "Biar saya yang bicara langsung, Bu-nya harus dengar dari ' +
                    'ahlinya: kondisi Endah tidak memungkinkan lahiran di kampung."',
                  gaya: 'konfrontasi',
                  respons:
                    'Kamu mendengar suara di seberang berubah formal: "Oh... dokter. Inggih. Inggih, Dok." ' +
                    'Lalu, setelah telepon ditutup, yang sampai ke kampung adalah kabar: "dokternya Endah ' +
                    'melarang-larang, padahal kamar sudah dicat." Vonis lewat telepon dari orang asing — ' +
                    'adat kini punya musuh bersama.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Otoritas medis yang menembak dari jauh, tanpa relasi, memicu pertahanan adat paling keras. ' +
                    'Kabar buruk medis untuk keluarga besar harus disampaikan DI DALAM lingkaran, bukan dari atasnya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'ek1_i1',
              nama: 'ANC Keluarga: Undang Sang Ibu',
              deskripsi:
                'Gelar ANC istimewa minggu depan dengan calon nenek sebagai tamu kehormatan: dengar denyut ' +
                'jantung cucu, lihat USG, dan dengar penjelasan risiko panggul sempit LANGSUNG dari bidan — ' +
                'lalu tawarkan peran baru: selamatan tetap di kampung SETELAH empat puluh hari, ibu yang ' +
                'memimpin, dan kamar cat baru itu jadi kamar cucu saat mudik pertama.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Sang ibu datang membawa dua kardus oleh-oleh dan pulang membawa foto USG yang dilaminating. ' +
                'Di ruang ANC, saat bidan menunjuk angka 142 cm, beliau yang lebih dulu memutuskan: "Wis, ' +
                'lahiran nang PONED wae. Aku sing nunggoni." Tas mudik dibongkar ulang — isinya kini untuk ' +
                'menginap di dekat Puskesmas. Adatnya bergeser empat puluh hari, tidak dilanggar.',
            },
            {
              id: 'ek1_i2',
              nama: 'Amanat Persalinan PONED',
              deskripsi:
                'Susun rencana persalinan lengkap: rujukan terencana ke PONED, transport, pendonor darah ' +
                'siaga, dan tanggal kontrol terakhir sebelum HPL.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Rencananya rapi tertempel di kulkas kontrakan — dan tiket travel di risleting tas itu masih ' +
                'berlaku. Dua minggu lagi tas itu tetap akan berangkat ke kaki gunung, membawa serta seluruh ' +
                'rencana yang tertinggal di pintu kulkas. Logistiknya sempurna; restunya belum ada.',
            },
            {
              id: 'ek1_i3',
              nama: 'Kelas Suami Siaga untuk Andri',
              deskripsi:
                'Latih Andri jadi suami siaga: tanda bahaya persalinan, kapan berangkat, apa yang disiapkan.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Andri lulus kelas dengan nilai terbaik — ia kini hafal tanda bahaya melebihi kadernya. ' +
                'Tapi di percakapan sore dengan mertua, ilmu barunya tetap tak menemukan kalimat pembuka. ' +
                'Yang ia butuhkan bukan materi; keberanian struktural yang tak diajarkan kelas mana pun.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit saat mereka masih menyusun rencana penyambutan "tamu kehormatan" minggu depan — ' +
            'Endah mau memasak gudeg kesukaan ibunya, Andri mengatur kursi paling empuk di ruang ANC. ' +
            'Persalinan paling aman ternyata dirancang bukan di ruang bersalin, tapi di ruang tamu.',
          penutupGagal:
            'Tas mudik itu tetap di sudut kamar, terkemas sempurna, tiketnya tak tergoyahkan. Endah ' +
            'mengantarmu ke pintu dengan senyum yang meminta maaf: "Doakan lancar ya, Dok. Ibu saya... ' +
            'orangnya baik kok, cuma nanti kalau sudah kepalang di sana, ya sudah." Baris stabilo kuning ' +
            'itu ikut terlipat rapi di dalam tas.',
        },
      ],
      epilogBerhasil:
        'Bayi itu lahir di PONED — partus lama sembilan jam yang berakhir vakum, persis skenario yang ' +
        'ditakutkan bidan, di tempat yang persis disiapkan untuknya. Yang pertama menggendong setelah ' +
        'Endah: sang nenek, yang menginap tiga malam di musala Puskesmas dan menolak pulang. Empat puluh ' +
        'hari kemudian, selamatan di kaki gunung digelar besar-besaran — kamar cat baru itu akhirnya dipakai.',
      epilogGagal:
        'Kabar dari kaki gunung datang terlambat dan bertahap: partus macet tengah malam, dukun terpandai ' +
        'pun angkat tangan, perjalanan dua jam ke RS kabupaten yang jadi empat jam karena hujan. Bayinya ' +
        'selamat; Endah harus transfusi dan robekan luas. Ibunya kini yang paling keras bicara di kampung: ' +
        '"Anak keduamu besok, lahiran nang rumah sakit. Adat iso ngenteni — nyowo ora."',
    },
  },

  /* =========================================================================
   * KELUARGA KARSA — RW 8 (terpencil), rentan — KB (motivasi suami)
   * ======================================================================= */
  {
    id: 'keluarga_karsa',
    namaKeluarga: 'Keluarga Pak Karsa',
    rw: 8,
    jarakMenit: 38,
    ekonomi: 'rentan',
    anggota: [
      { nama: 'Pak Karsa', usia: 39, jenisKelamin: 'L', peran: 'kepala', kondisi: ['perokok_aktif'] },
      { nama: 'Bu Painah', usia: 34, jenisKelamin: 'P', peran: 'istri', kondisi: ['anemia_ringan'] },
      { nama: 'Wati', usia: 13, jenisKelamin: 'P', peran: 'anak' },
      { nama: 'Joko', usia: 10, jenisKelamin: 'L', peran: 'anak' },
      { nama: 'Sri', usia: 7, jenisKelamin: 'P', peran: 'anak' },
      { nama: 'Bambang', usia: 4, jenisKelamin: 'L', peran: 'anak' },
      { nama: 'Lestari', usia: 2, jenisKelamin: 'P', peran: 'anak' },
    ],
    indikatorAwal: {
      kb: 'tidak',
      persalinan_faskes: 'ya',
      imunisasi_dasar: 'ya',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'ya',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Lima anak dalam tiga belas tahun, dan Bu Painah (34) makin sering berkunang-kunang saat mencuci. ' +
        'Ia diam-diam ingin KB; Pak Karsa menolak keras — "banyak anak banyak rezeki, dan KB itu ' +
        'melawan takdir."',
      kunjungan: [
        {
          id: 'karsa_k1',
          judul: 'Banyak Anak Banyak Rezeki',
          pembuka:
            'Halaman rumah itu riuh: lima anak, dua layangan, satu ban bekas. Bu Painah menggendong ' +
            'Lestari sambil mengangkat jemuran; wajahnya pucat khas yang kamu hafal dari poli. Pak Karsa ' +
            'menyambut hangat dari amben bambu: "Wah, dokter! Sini, Dok. Lihat pasukan saya — ramai to? ' +
            'Rezeki semua ini."',
          target: ['kb'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Bu Painah sudah dua kali diam-diam bertanya soal KB ke bidan — dan dua kali pulang tanpa apa-apa ' +
            'karena "harus izin suami". Pak Karsa menolak bukan karena tak sayang: baginya jumlah anak ' +
            'adalah bukti kejantanan, rezeki adalah urusan Yang di Atas, dan KB itu "istri yang diatur-atur ' +
            'orang kesehatan". Hambatannya di kepala satu orang — dan orang itu bukan pasiennya.',
          hotspot: [
            {
              id: 'kk1_h1',
              label: 'Bu Painah berpegangan tiang saat berdiri',
              narasi:
                'Saat bangkit dari mengangkat ember, Bu Painah berpegangan tiang jemuran sejenak, memejam, ' +
                'menunggu dunia berhenti berputar — gerakan yang sudah jadi kebiasaan, sampai anak-anaknya ' +
                'tak menoleh lagi.',
              indikator: 'kb',
              x: 25,
              y: 55,
            },
            {
              id: 'kk1_h2',
              label: 'Tablet tambah darah tak tersentuh',
              narasi:
                'Di atas meja, strip tablet tambah darah dari Posyandu masih utuh. "Kata bapaknya obat-obatan ' +
                'begitu bikin ketergantungan," bisik Wati yang melihatmu memperhatikan.',
              x: 60,
              y: 40,
            },
            {
              id: 'kk1_h3',
              label: 'Rapor Wati bertumpuk piagam',
              narasi:
                'Rapor dan piagam lomba Wati tertata di rak: ranking satu terus. Di halaman terakhir rapor, ' +
                'catatan wali kelas: "Berpotensi beasiswa SMP favorit — mohon orang tua mempersiapkan." ' +
                'Biaya, maksudnya.',
              x: 80,
              y: 30,
            },
            {
              id: 'kk1_h4',
              label: 'Sarung bayi menggantung di paku',
              narasi:
                'Di dinding kamar, gendongan bayi Lestari masih menggantung — dan di sebelahnya, paku kosong ' +
                'yang seperti menunggu gendongan berikutnya. Bu Painah mengikuti pandanganmu dan cepat-cepat ' +
                'mengalihkan muka.',
              x: 45,
              y: 65,
            },
          ],
          dialog: [
            {
              id: 'kk1_d1',
              narasi:
                '"Orang kesehatan itu senangnya ngatur-ngatur anak orang, Dok," Pak Karsa membuka sambil ' +
                'melinting. "Simbah saya anaknya sebelas, hidup semua, rezeki jalan. Kok sekarang punya lima ' +
                'saja disuruh setop. Rezeki itu yang ngatur Gusti Allah, bukan Puskesmas."',
              pilihan: [
                {
                  id: 'kk1_d1_a',
                  teks:
                    '"Saya sepakat rezeki urusan Gusti Allah, Pak — dan saya tidak datang menyuruh setop. ' +
                    'Saya cuma penasaran satu hal: pasukan lima ini kan butuh panglima yang sehat. Panglimanya ' +
                    'Pak Karsa... tapi yang masak, nyuci, momong lima-limanya siapa? Sehat tidak beliau?"',
                  gaya: 'refleksi',
                  respons:
                    'Pak Karsa menoleh ke istrinya yang sedang berpegangan tiang jemuran lagi. Lama. ' +
                    '"...Bojoku memang sering liyer-liyeren, Dok. Tak kira masuk angin biasa." Untuk pertama ' +
                    'kalinya sore itu, ia memandang istrinya lebih lama dari lintingannya.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Jangan berdebat teologi rezeki — geser sorot ke KESEHATAN ISTRI yang ada di depan mata. ' +
                    '"Banyak anak" tak pernah bertentangan dengan "istri sehat"; pertentangkan yang kedua ' +
                    'dengan kelalaiannya, bukan dengan imannya.',
                },
                {
                  id: 'kk1_d1_b',
                  teks:
                    '"Zaman simbah beda, Pak. Sekarang biaya sekolah mahal, lahan makin sempit. Lima anak ' +
                    'itu secara ekonomi sudah melewati kemampuan keluarga dengan penghasilan Bapak."',
                  gaya: 'edukasi',
                  respons:
                    '"Wah, Dokter sudah menghitung penghasilan saya," Pak Karsa tersenyum tipis, tidak enak. ' +
                    '"Anak-anak saya tidak ada yang kelaparan, Dok." Benar — dan harga dirinya barusan ' +
                    'menutup pintu diskusi ekonomi apa pun.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Menghitung ekonomi keluarga di depan kepala keluarganya = mengaudit kejantanannya. ' +
                    'Argumen biaya hanya bisa dibawa OLEH DIA sendiri (mis. lewat rapor Wati), bukan olehmu.',
                },
                {
                  id: 'kk1_d1_c',
                  teks:
                    '"Pak, istri Bapak anemia dan jaraknya kehamilan terlalu rapat. Kalau hamil lagi, ' +
                    'risikonya perdarahan sampai kematian. KB itu bukan melawan takdir — menolak KB sambil ' +
                    'tahu risikonya, itu yang mendekati menzalimi."',
                  gaya: 'konfrontasi',
                  respons:
                    'Lintingan itu berhenti di tengah jalan. "Dokter bilang saya menzalimi bojoku?" Suaranya ' +
                    'rendah. Anak-anak di halaman berhenti bermain. Bu Painah buru-buru menyuguhkan teh dengan ' +
                    'tangan yang sedikit gemetar — mendamaikan, seperti biasa.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Kata "zalim" pada suami di rumahnya sendiri adalah deklarasi perang, bukan konseling. ' +
                    'Fakta medisnya benar; pilihannya membuat fakta itu tidak akan pernah didengar.',
                },
              ],
            },
            {
              id: 'kk1_d2',
              narasi:
                'Bu Painah menyuguhkan teh, lalu duduk di undakan — agak jauh, seperti penonton di ' +
                'sidang tentang tubuhnya sendiri. Kamu menangkap matanya sekilas; ada pertanyaan yang ' +
                'sudah dua kali gagal sampai ke bidan.',
              pilihan: [
                {
                  id: 'kk1_d2_a',
                  teks:
                    '(Kepada keduanya) "Bu Painah, Pak Karsa — kunang-kunang, cepat lelah, pucat begini ' +
                    'namanya anemia: darahnya kurang. Lima kehamilan dalam tiga belas tahun itu seperti ' +
                    'sumur ditimba terus tanpa diberi waktu terisi. Boleh saya periksa Ibu sebentar, ' +
                    'Pak — biar Bapak lihat sendiri?"',
                  gaya: 'empati',
                  respons:
                    'Pak Karsa mengangguk. Konjungtiva pucat, telapak tangan putih — kamu tunjukkan ' +
                    'perbandingannya dengan telapak Pak Karsa sendiri: merah sehat vs putih pias. ' +
                    '"...Kok putih begitu, Dok?" suaranya berubah. "Dari kapan?" — Dari Lestari, Pak. ' +
                    'Dua tahun. Ia terdiam menghitung sesuatu.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'kb',
                    ambangTrust: 6,
                    responsBohong:
                      '"Kami memang belum kepingin KB kok, Dok, sudah sepakat berdua," kata Bu Painah cepat, ' +
                      'melirik suaminya — jawaban yang hafalannya terlalu lancar untuk jadi miliknya sendiri.',
                  },
                  catatanPedagogis:
                    'Tubuh istri jadi BUKTI yang tak bisa dibantah: perbandingan telapak tangan adalah ' +
                    'demonstrasi anemia paling sederhana sedunia. Suami yang MELIHAT lebih mudah bergeser ' +
                    'daripada suami yang diceramahi.',
                },
                {
                  id: 'kk1_d2_b',
                  teks:
                    '(Kepada Bu Painah, langsung) "Ibu sendiri bagaimana? Kepingin KB tidak? Ini tubuh ' +
                    'Ibu — yang berhak memutuskan ya Ibu."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Painah melirik suaminya sepersekian detik — refleks yang menjawab segalanya — ' +
                    'lalu tersenyum: "Saya manut bapaknya saja, Dok." Secara prinsip kamu benar; secara ' +
                    'taktik kamu baru memaksanya memilih di depan hakim yang salah.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Otonomi tubuh istri itu tujuan — tapi menanyakannya DI DEPAN suami yang menolak justru ' +
                    'memaksa ia menyangkal keinginannya sendiri demi damai. Bangun dulu ruang amannya.',
                },
                {
                  id: 'kk1_d2_c',
                  teks:
                    '"Bu, tablet tambah darah dari Posyandu itu kok masih utuh? Diminum dong — percuma ' +
                    'program pemerintah kalau di rumah cuma jadi pajangan."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Inggih, Dok, nanti diminum," Bu Painah menunduk. Yang melarang tablet itu duduk ' +
                    'di amben dua meter darimu, dan barusan kamu menegur orang yang salah — di depan ' +
                    'yang benar.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Selalu telusuri SIAPA di balik ketidakpatuhan sebelum menegur. Menyalahkan korban ' +
                    'kebijakan rumah tangga menambah bebannya tanpa menyentuh pembuat kebijakannya.',
                },
              ],
            },
            {
              id: 'kk1_d3',
              narasi:
                'Wati muncul membawa rapornya — disuruh ibunya, jelas, tapi berdiri sendiri di depan ' +
                'bapaknya: "Pak, kata Bu Guru aku bisa dapat beasiswa SMP 1. Tapi tetap harus bayar ' +
                'seragam, buku, sama kos... Boleh ya, Pak?" Pak Karsa menerima rapor itu dan lama tidak bicara.',
              pilihan: [
                {
                  id: 'kk1_d3_a',
                  teks:
                    '"Ranking satu terus, Pak. Anak panglima memang unggul. Nah — ini bukan soal setop atau ' +
                    'tidak setop, cuma soal JEDA: kalau tiga-empat tahun ke depan tenaga dan biaya keluarga ' +
                    'difokuskan ke Wati dan adik-adiknya yang SUDAH ada... KB itu alatnya jeda, Pak. ' +
                    'Bukan lawannya takdir — pengatur napasnya."',
                  gaya: 'refleksi',
                  respons:
                    'Pak Karsa membolak-balik rapor itu. "Jeda..." Ia memandang Wati, lalu istrinya di ' +
                    'undakan, lalu paku kosong di dinding kamar. "Simbah saya sebelas anaknya, Dok. Tapi ' +
                    'zaman simbah, sekolah cukup sampai bisa baca." Ia melipat lintingannya, tidak jadi ' +
                    'dibakar. "Kalau cuma jeda... ceritakan dulu macam-macamnya."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Reframing kunci konseling KB pria: dari "berhenti" (terdengar final, menyerah, kalah) ' +
                    'menjadi "jeda/pengaturan jarak" (terdengar strategis, tetap berkuasa). Ditambah wajah ' +
                    'anak yang berprestasi — rezeki yang sudah datang dan butuh dibiayai.',
                },
                {
                  id: 'kk1_d3_b',
                  teks:
                    '"Beasiswa begini jangan sampai lepas, Pak. Banyak jalan: coba ajukan keringanan ke ' +
                    'sekolah, atau cari orang tua asuh. Nanti saya bantu tanya-tanya."',
                  gaya: 'edukasi',
                  respons:
                    '"Wah, dibantu carikan jalan — matur nuwun, Dok." Pak Karsa sumringah, Wati ikut cerah. ' +
                    'Masalah biaya Wati mungkin teratasi — dan percakapan tentang jeda kehamilan menguap, ' +
                    'tertukar dengan urusan yang lebih mudah kalian berdua sepakati.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Menolong itu baik — tapi menyelesaikan masalah TURUNAN (biaya satu anak) sambil ' +
                    'membiarkan masalah AKAR (jarak kehamilan + anemia ibu) adalah kemenangan yang salah papan.',
                },
                {
                  id: 'kk1_d3_c',
                  teks:
                    '"Nah lho, Pak. Lima anak saja beasiswanya kerepotan. Masih yakin banyak anak ' +
                    'banyak rezeki? Rezekinya mana?"',
                  gaya: 'konfrontasi',
                  respons:
                    'Pak Karsa menutup rapor Wati pelan-pelan. "Rezekinya ini." Ia mengangkat rapor itu. ' +
                    '"Ranking satu, Dok. Dari perut istri saya yang katanya kurang darah itu." Wati mundur ' +
                    'perlahan, menyesal telah membawa rapornya keluar. Skakmatmu barusan dibalik jadi ' +
                    'pembelaan iman yang lebih dalam.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menantang "banyak anak banyak rezeki" secara frontal selalu kalah: setiap anak yang ADA ' +
                    'adalah bukti hidupnya. Jangan serang doktrinnya — tawarkan tafsir yang lebih luas: ' +
                    'rezeki juga berarti ibu yang sehat dan anak yang tersekolahkan.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'kk1_i1',
              nama: 'Konseling Pasangan: Jeda, Bukan Setop',
              deskripsi:
                'Sesi konseling KB BERDUA di Puskesmas (bukan istri sendirian): bahasa "pengaturan jarak" ' +
                'bukan "berhenti", pilihan metode yang di tangan mereka, plus obrolan santai dengan Pak ' +
                'Modin yang anaknya tiga dan istrinya sehat — "KB-ne wong alim yo ono, Kang." Tablet tambah ' +
                'darah Bu Painah tetap diresepkan ulang sebagai pengobatan anemianya sendiri — itu haknya, ' +
                'bukan bahan tawar; yang dirundingkan berdua cukup soal KB-nya.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Mereka datang berdua naik motor butut — Pak Karsa yang memboncengkan, Pak Karsa pula yang ' +
                'bertanya paling banyak di ruang konseling ("kalau suntik itu bikin gemuk bojoku?"). ' +
                'Pulangnya, Bu Painah mengantongi jadwal KB suntik 3 bulan dan — untuk pertama kalinya ' +
                'disaksikan suaminya — meminum tablet tambah darahnya. "Jeda dulu, Dok," kata Pak Karsa. ' +
                '"Sampai Wati lulus SMP. Habis itu... ya lihat rezekinya."',
            },
            {
              id: 'kk1_i2',
              nama: 'Edukasi Anemia & Gizi untuk Bu Painah',
              deskripsi:
                'Ajari Bu Painah pola makan penambah darah dan pentingnya tablet Fe diminum rutin ' +
                'dengan vitamin C.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Bu Painah menyimak sungguh-sungguh — ia memang tidak pernah kekurangan niat. Strip tablet ' +
                'itu tetap utuh di meja, karena fatwa "obat bikin ketergantungan" masih berlaku di rumah ' +
                'ini, dan yang mengeluarkan fatwa belum diajak bicara.',
            },
            {
              id: 'kk1_i3',
              nama: 'Layanan KB Jemput Bola',
              deskripsi:
                'Bidan datang ke rumah menawarkan layanan KB langsung supaya Bu Painah tak perlu jauh-jauh ' +
                'ke Puskesmas.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Bidan datang — dan pulang lebih cepat dari tehnya dingin: "Bapaknya bilang tidak usah, ' +
                'Bu Bidan. Terima kasih." Layanan sudah di depan pintu; yang terkunci memang bukan pintunya.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit saat magrib hampir turun. Di halaman, Pak Karsa mengumpulkan layangan anak-anaknya ' +
            'sambil berteriak ke dalam: "Bune! Kamis ke Puskesmas ya, wis tak setujui — JEDA!" Bu Painah ' +
            'di ambang pintu memandangmu dengan terima kasih yang tidak butuh kata-kata.',
          penutupGagal:
            'Teh dingin, lintingan baru menyala, dan paku kosong di dinding kamar itu tetap menunggu. ' +
            'Bu Painah mengantar sampai pagar, dan di detik terakhir berbisik cepat: "Dok... kalau saya ' +
            'ke Posyandu sendiri, bisa minta yang suntik itu tidak? Jangan bilang bapaknya." Pertanyaan ' +
            'yang seharusnya tidak perlu diajukan sambil berbisik.',
          karma: {
            kasusId: 'anemia_defisiensi_bumil',
            anggotaIndex: 1,
            jatuhTempoHari: 50,
            narasi:
              'Bu Painah datang ke poli diantar Wati — pucat seperti kertas, berkunang-kunang sampai dua ' +
              'kali terduduk di ruang tunggu. Tes kehamilannya positif: anak keenam, di atas anemia yang ' +
              'tak pernah diobati. "Bapaknya bilang rezeki, Dok," kata Wati pelan, memegangi tangan ibunya ' +
              '— dengan nada anak ranking satu yang sudah bisa menghitung sendiri harga sebuah keyakinan.',
          },
        },
      ],
      epilogBerhasil:
        'Setahun kemudian, di halaman yang sama: masih lima anak, dua layangan, satu ban bekas — dan ' +
        'Bu Painah yang menimba air tanpa berpegangan tiang lagi. Hb-nya 12,1 di pemeriksaan terakhir. ' +
        'Wati masuk SMP 1 dengan beasiswa penuh; foto pengumumannya dipajang Pak Karsa di warung kopi, ' +
        'diceritakan pada siapa pun yang duduk: "Anak pertama saya, Dok — eh, Kang. Rezeki itu memang ' +
        'tidak bohong."',
      epilogGagal:
        'Kehamilan keenam itu berat sejak awal — transfusi dua kali sebelum bersalin, dan bayi Karsa ' +
        'keenam lahir kecil sebelum waktunya. Pak Karsa menungguinya di PONED tiga hari tiga malam, ' +
        'dan pulang membawa dua hal: anak lelaki bernama Slamet, dan tekad yang terlambat satu nyaris-nyawa: ' +
        '"Wis. Jeda. Aku sing ngeterke KB-ne." Paku kosong di dinding kamar akhirnya dicabut.',
    },
  },
]
