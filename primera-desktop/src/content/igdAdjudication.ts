import type { DebriefIgd, KasusIgd, PilihanIgd } from './types'

type ChoicePatch = Partial<Pick<PilihanIgd, 'label' | 'respons'>>

interface StepPatch {
  narasi?: string
  pilihan?: Record<string, ChoicePatch>
}

interface CasePatch {
  fields?: Partial<Omit<
    KasusIgd,
    'activationStatus' | 'reviewStatus' | 'langkah' | 'panduanResmi' | 'sumber' | 'debrief'
  >>
  langkah?: Record<string, StepPatch>
  debrief: DebriefIgd
}

const PATCHES: Record<string, CasePatch> = {
  igd_asfiksia_neonatorum: {
    langkah: {
      an_1: {
        pilihan: {
          a: {
            respons: 'Tepat. Dalam 30 detik pertama, jaga hangat, posisikan airway, keringkan, dan stimulasi; suction hanya bila ada sumbatan. Presentasi berat ini tetap memerlukan penilaian napas dan denyut yang cepat, bukan janji bahwa langkah awal pasti cukup.',
          },
        },
      },
      an_2: {
        pilihan: {
          a: {
            label: 'Mulai ventilasi tekanan positif 30-60 kali/menit dengan udara ruangan; pastikan sungkup rapat, dada mengembang, dan pasang pulse oximeter preduktal',
            respons: 'Tepat. Pada bayi cukup bulan, ventilasi dimulai dengan udara ruangan. Nilai gerak dada dan denyut, lakukan koreksi ventilasi bila dada tidak naik, lalu titrasi oksigen menurut target saturasi berbasis menit kehidupan.',
          },
        },
      },
      an_3: {
        pilihan: {
          a: {
            label: 'Pastikan ventilasi efektif, lanjutkan VTP dan mulai kompresi 3:1; naikkan oksigen ke 100% bila tersedia, nilai ulang 60 detik, dan siapkan epinefrin serta transfer neonatus',
            respons: 'Tepat. HR <60/menit setelah 30 detik ventilasi yang mengembangkan dada adalah indikasi kompresi 3:1 bersama ventilasi. Gunakan airway alternatif bila tersedia dan operator kompeten; bila HR tetap <60 setelah 60 detik, epinefrin intravaskular menjadi langkah berikutnya. Titrasi oksigen turun setelah ROSC.',
          },
          c: {
            respons: 'Urutannya belum tepat. Epinefrin dipertimbangkan bila HR tetap <60 setelah 60 detik ventilasi dan kompresi yang efektif; pemasangan akses tidak boleh menghentikan ventilasi.',
          },
          d: {
            respons: 'Rujukan perlu, tetapi resusitasi harus terus berjalan selama pemindahan dan perjalanan menuju fasilitas yang mampu merawat neonatus.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Ventilasi efektif adalah intervensi utama; pastikan dada benar-benar mengembang.',
        'Bayi cukup bulan mulai dengan udara ruangan dan oksigen dititrasi menurut target menit kehidupan.',
        'Kompresi 3:1 baru dimulai bila HR <60/menit setelah ventilasi efektif.',
        'Resusitasi tidak berhenti ketika transfer ke layanan neonatus dimulai.',
      ],
      realitaFktp: 'Sukamaju dinyatakan memiliki penghangat, balon-sungkup neonatus, oksigen, pulse oximeter preduktal, suction terarah, dan tim resusitasi. Akses umbilikal, advanced airway, serta perawatan neonatus lanjutan mengikuti kompetensi dan jejaring; ketidaktersediaannya tidak boleh menunda ventilasi efektif.',
      sumberDaya: {
        ready: ['penghangat dan kain kering', 'balon-sungkup neonatus', 'oksigen dan pulse oximeter', 'ambulans dengan pendamping resusitasi'],
        melaluiJejaring: ['advanced airway neonatus', 'epinefrin intravaskular', 'NICU/perawatan neonatus'],
      },
      kontinuitas: 'Setelah pulang, nilai minum, berat badan, ikterus, tonus, kejang, pendengaran, penglihatan, dan perkembangan; pastikan rujuk balik neonatus serta dukungan ibu-keluarga berjalan.',
      bridgeUkm: {
        judul: 'Menit Emas, Sistem yang Siap',
        ringkasan: 'Audit suhu ruang bersalin, kesiapan balon-sungkup berbagai ukuran, oksigen, pembagian peran, waktu ventilasi pertama, kualitas transfer, dan latihan berkala bersama bidan, Puskesmas, PONED, serta RS.',
      },
    },
  },
  igd_cedera_kepala_sedang: {
    fields: { nama: 'Cedera Kepala Sedang dengan Perburukan Neurologis' },
    langkah: {
      ck_1: {
        pilihan: {
          a: {
            label: 'Stabilisasi servikal manual, buka airway dengan jaw thrust, cek oksigenasi dan targetkan SpO2 >=94%, lalu pasang collar bila sesuai',
            respons: 'Tepat. Prioritasnya airway dengan pembatasan gerak servikal dan pencegahan hipoksia. Oksigen dititrasi terhadap saturasi dan kondisi klinis, bukan diberikan sebagai ritual tanpa penilaian.',
          },
          c: {
            respons: 'Muntah tidak membuktikan herniasi. Osmoterapi bukan tindakan wajib kasus ini di FKTP; pertimbangan khusus memerlukan protokol, monitoring, dan tidak boleh menunda airway maupun transfer.',
          },
        },
      },
      ck_2: {
        pilihan: {
          a: {
            label: 'Miringkan en bloc secara terkoordinasi dengan stabilisasi servikal dan suction siap; nilai pupil, defisit, vital, serta GCS serial',
            respons: 'Tepat. Pemiringan en bloc melindungi airway tanpa memelintir tulang belakang. GCS dan pupil serial adalah pemantauan neurologis dasar untuk mendeteksi perubahan; keduanya bukan pengukuran tekanan intrakranial.',
          },
          b: {
            respons: 'Hiperventilasi rutin dapat menurunkan aliran darah otak. Ventilasi terkontrol hanya menjadi rescue singkat pada ancaman herniasi oleh tim kompeten dengan monitoring yang sesuai.',
          },
          c: {
            respons: 'Diazepam tidak diberikan sekadar untuk menenangkan pasien. Namun analgesia, sedasi prosedural, atau airway management yang memang terindikasi juga tidak boleh ditahan hanya demi mempertahankan angka GCS; dokumentasikan waktu dan respons.',
          },
        },
      },
      ck_3: {
        pilihan: {
          a: {
            label: 'Jelaskan kegawatan dengan empatik, aktifkan ambulans/JKN/dukungan sosial, dan transfer terpantau ke RS dengan CT serta kemampuan trauma-neurosurgical',
            respons: 'Tepat. Anisokor dan GCS yang menurun memerlukan CT serta kemampuan menangani perburukan airway dan cedera intrakranial. Dukungan pembiayaan dan sosial diaktifkan agar biaya tidak menunda keselamatan.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'GCS 9-12 adalah cedera kepala sedang; tren GCS dan pupil menilai perburukan, bukan mengukur ICP.',
        'Cegah hipoksia dan hipotensi; targetkan SpO2 >=94% tanpa terapi otomatis yang tidak perlu.',
        'Muntah dan penurunan kesadaran memerlukan airway plan, suction, serta pemiringan en bloc terkoordinasi.',
        'Anisokor dan GCS menurun memerlukan transfer ke CT dan layanan trauma/neurosurgical.',
      ],
      realitaFktp: 'Sukamaju mampu melakukan ABC, stabilisasi servikal manual, oksigen, suction, monitor serial, analgesia terukur, dan transport terpantau. CT, pengukuran ICP, advanced airway kompleks, serta bedah saraf berada di jejaring; osmoterapi atau hiperventilasi bukan ritual pra-rujuk.',
      sumberDaya: {
        ready: ['oksigen dan suction', 'stabilisasi servikal', 'monitor GCS-pupil-vital', 'ambulans terpantau'],
        melaluiJejaring: ['CT kepala', 'advanced airway/ventilasi', 'trauma dan bedah saraf'],
      },
      kontinuitas: 'Rujuk balik menilai sakit kepala, kognisi, tidur, mood, kejang, fungsi, dan kesiapan kembali bekerja atau berkendara; keluarga menerima safety-net perburukan.',
      bridgeUkm: {
        judul: 'Dari Benturan ke Jalan yang Lebih Aman',
        ringkasan: 'Episode memicu audit helm, alkohol atau kelelahan, lokasi kecelakaan, waktu respons, dan hambatan biaya tanpa menyalahkan korban; temuan agregat diteruskan ke PSC, desa, dan lintas sektor keselamatan jalan.',
      },
    },
  },
  igd_eklampsia: {
    langkah: {
      ekl_1: {
        pilihan: {
          a: {
            label: 'Lindungi dari cedera, posisi lateral kiri, siapkan suction dan airway, beri oksigen karena SpO2 93%; jangan tahan ekstremitas atau masukkan benda ke mulut',
            respons: 'Tepat. Proteksi cedera, posisi lateral kiri, airway, suction, dan oksigen dikerjakan segera. Kejang baru pada kehamilan tetap memerlukan evaluasi penyebab lain, tetapi presentasi ini ditangani sebagai eklampsia tanpa menunda.',
          },
        },
      },
      ekl_2: {
        pilihan: {
          a: {
            label: 'Encerkan 10 mL MgSO4 40% dengan 10 mL air steril, berikan 4 g IV perlahan selama 20 menit, dan siapkan kalsium glukonas',
            respons: 'Tepat. MgSO4 adalah obat pilihan. Larutan 40% tidak disuntikkan IV tanpa pengenceran; pantau napas, refleks patela, dan urine serta siapkan kalsium glukonas sebagai antidot toksisitas.',
          },
          b: {
            respons: 'Diazepam bukan alternatif setara. Ia hanya menjadi jalan darurat terakhir bila MgSO4 benar-benar tidak tersedia, dengan dukungan airway dan transfer segera.',
          },
        },
      },
      ekl_3: {
        pilihan: {
          a: {
            label: 'Tangani TD berat dengan obat tertitrasi sesuai protokol, pasang kateter urin, cek refleks/RR/diuresis, lalu transfer; rumatan MgSO4 hanya bila dapat dipantau aman',
            respons: 'Tepat. Bila memakai nifedipin oral, obat ditelan dan bukan sublingual. Target awal adalah keluar dari rentang hipertensi berat, bukan normal mendadak. Stabilkan ibu dahulu; tim obstetri menentukan waktu dan cara kelahiran menurut kondisi ibu-janin.',
          },
          d: {
            respons: 'MgSO4 tidak dihentikan hanya karena kejang berhenti, tetapi rumatan juga bukan kewajiban universal bila monitoring tidak aman. Hentikan bila toksisitas muncul; pada depresi napas berikan kalsium glukonas 1 g atau 10 mL larutan 10% IV selama 10 menit sesuai protokol.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Lindungi ibu, posisi lateral kiri, jaga airway, dan jangan memasukkan benda ke mulut.',
        'MgSO4 adalah obat pilihan; loading IV 4 g harus diencerkan dan diberikan perlahan.',
        'Sebelum dosis lanjutan, pastikan refleks patela, RR >=16/menit, dan diuresis memadai.',
        'Stabilkan ibu, tangani hipertensi berat, lalu transfer ke obstetri emergensi dan layanan neonatus.',
      ],
      realitaFktp: 'MgSO4, kalsium glukonas, oksigen, monitor, kateter urin, dan transport dinyatakan ready pada encounter ini. Rumatan selama perjalanan hanya dilakukan bila protokol, pemantauan, dan petugas kompeten tersedia; bila tidak, loading dose dan transfer cepat lebih aman daripada improvisasi.',
      sumberDaya: {
        ready: ['MgSO4 dan pengencer', 'kalsium glukonas', 'oksigen-suction-BVM', 'monitor dan ambulans'],
        melaluiJejaring: ['obstetri emergensi', 'monitoring ibu-janin', 'kamar operasi dan perawatan neonatus'],
      },
      kontinuitas: 'Setelah pulang, pantau tekanan darah, obat, gejala neurologis, fungsi ginjal, laktasi, kesehatan mental, kontrasepsi, dan risiko kehamilan berikutnya.',
      bridgeUkm: {
        judul: 'Kejang Ibu, Alarm Sistem',
        ringkasan: 'Audit ANC, pengenalan tanda bahaya, stok MgSO4 dan antidot, simulasi tim, waktu keputusan-keberangkatan, transport, serta kesiapan obstetri-neonatus tanpa mengubah kasus menjadi kesalahan ibu.',
      },
    },
  },
  igd_gigitan_ular_berbisa: {
    langkah: {
      ular_1: {
        pilihan: {
          a: {
            label: 'Imobilisasi tungkai dan siapkan resusitasi; jangan lepas ikatan mendadak. Koordinasikan pelepasan terkontrol saat adrenalin, monitor, antivenom yang sesuai, dan tim definitif siap',
            respons: 'Tepat. Ikatan ketat merusak jaringan, tetapi pelepasan mendadak setelah satu jam dapat melepaskan bolus bisa. Akses IV saja tidak cukup: pelepasan harus terkontrol ketika resusitasi, adrenalin IM, pemantauan, antivenom yang sesuai, dan petugas kompeten benar-benar siap.',
          },
          b: {
            respons: 'Menambah ikatan memperberat iskemia dan nekrosis. Jangan melepas secara mendadak tanpa kesiapan definitif, tetapi jangan pula memperketat atau menambah torniket.',
          },
          d: {
            respons: 'Perdarahan gusi menunjukkan envenomasi sistemik dan koordinasi antivenom harus segera. Namun antivenom harus cocok dengan sindrom, tersedia, serta diberikan dengan adrenalin dan resusitasi siap; bukan disuntikkan tanpa sistem pengaman.',
          },
        },
      },
      ular_2: {
        pilihan: {
          a: {
            label: 'Tolak ramuan dengan empatik, jangan gosok luka; tandai batas bengkak beserta waktu, ukur serial, imobilisasi, dan dokumentasikan sindrom',
            respons: 'Tepat. Pemantauan serial progresi, perdarahan, neurologi, dan perfusi lebih berguna daripada memaksa identifikasi jenis ular. Bersihkan ringan bila perlu tanpa memijat atau mengganggu jaringan.',
          },
          c: {
            respons: 'Steroid dan antihistamin tidak menghentikan kerusakan jaringan akibat bisa serta bukan profilaksis rutin reaksi antivenom. Adrenalin IM dan resusitasi harus siap; skin test antivenom rutin juga tidak dianjurkan.',
          },
        },
      },
      ular_3: {
        pilihan: {
          a: {
            label: 'Konfirmasi RS dengan antivenom yang sesuai, koagulasi/transfusi, airway, renal support, dan monitor; transfer terpantau dengan tungkai terimobilisasi',
            respons: 'Tepat. Perdarahan gusi dan bengkak progresif adalah envenomasi bermakna; koordinasi definitif tidak menunggu 20WBCT. Catat waktu gigitan, progresi, first aid, perdarahan, dan kemampuan yang sudah dikonfirmasi.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Imobilisasi, lepaskan benda ketat, dan dokumentasikan progresi; jangan insisi, isap, es, atau ramuan.',
        'Ikatan ketat dilepas terkontrol ketika resusitasi dan tata laksana definitif benar-benar siap.',
        'Perdarahan gusi adalah envenomasi sistemik; koordinasi antivenom tidak menunggu tes yang terlambat.',
        'Antivenom harus cocok dengan sindrom dan diberikan dengan adrenalin IM serta resusitasi siap.',
      ],
      realitaFktp: 'Keahlian dan stok antivenom di Indonesia terkonsentrasi serta tidak merata. Sukamaju menilai sindrom secara serial, menghindari pertolongan berbahaya, mengonfirmasi produk dan stok tujuan, serta merujuk ke kemampuan koagulasi, airway, transfusi, renal support, dan monitoring. Klaim satu-satunya ahli nasional tidak diperlakukan sebagai fakta absolut.',
      sumberDaya: {
        ready: ['imobilisasi dan dokumentasi serial', 'akses IV dan resusitasi', 'adrenalin IM', 'komunikasi GHBTB/rujukan'],
        melaluiJejaring: ['antivenom yang sesuai', 'koagulasi dan transfusi', 'ventilasi dan renal support'],
      },
      kontinuitas: 'Pantau luka, fungsi ekstremitas, perdarahan, ginjal, serum sickness, rehabilitasi, disabilitas, kesehatan mental, dan kemampuan kembali bekerja.',
      bridgeUkm: {
        judul: 'Gigitan Ular, Jejaring yang Menyelamatkan',
        ringkasan: 'Laporkan melalui jalur GHBTB setempat, petakan lokasi dan pekerjaan berisiko, ajarkan imobilisasi tanpa torniket, perkuat keselamatan penolong, stok terpilih, serta rute konsultasi-rujukan. Tiga kisah nyata dibuka melalui sumber, bukan didramatisasi sebagai NPC.',
      },
    },
  },
  igd_keracunan_organofosfat: {
    langkah: {
      ops_1: {
        pilihan: {
          a: {
            label: 'Aktifkan tim paralel: APD; suction, oksigen/BVM dan atropin segera; petugas terlindung melepas serta mengemas pakaian lalu mencuci kulit-rambut',
            respons: 'Tepat. Ancaman ABC tidak menunggu dekontaminasi selesai, dan dekontaminasi tidak menunggu pasien tenang. Lindungi staf, cegah kontaminasi ruangan/ambulans, dan kerjakan airway, atropin, serta pencucian secara paralel.',
          },
          b: {
            respons: 'Atropin harus segera, tetapi dekontaminasi juga berjalan paralel oleh petugas terlindung. Menunda salah satunya membuat pasien atau tim terus terpapar.',
          },
        },
      },
      ops_2: {
        narasi: 'Dekontaminasi dan dukungan airway berjalan, tetapi bronkorea, bronkospasme, hipoksia, serta bradikardia menetap. Dosis atropin awal sudah diberikan. Apa sasaran berikutnya?',
        pilihan: {
          a: {
            label: 'Berikan atropin dewasa 1-2 mg IV/IO, gandakan tiap 5 menit sampai bronkorea-bronkospasme terkendali, air entry/oksigenasi dan perfusi membaik',
            respons: 'Tepat. Gunakan miligram, bukan jumlah ampul. Sasaran atropinisasi adalah ventilasi, oksigenasi, sekret bronkus, bradikardia, dan perfusi yang membaik; bukan pupil melebar atau seluruh tubuh menjadi kering.',
          },
          b: {
            respons: 'Satu ampul bukan satuan klinis dan sering tidak cukup. Dosis dititrasi cepat terhadap respons dengan monitoring airway, ventilasi, dan perfusi.',
          },
          d: {
            respons: 'Transfer harus bergerak, tetapi atropin dan dukungan ventilasi tidak dihentikan. Pasien tidak perlu mencapai keadaan tanpa sekret sama sekali; ia perlu cukup stabil dan terus diterapi selama transport.',
          },
        },
      },
      ops_3: {
        pilihan: {
          a: {
            label: 'Pertahankan atropin dengan infus tertitrasi bila pompa-monitor ready atau bolus ulang berprotokol; siapkan BVM, kirim foto label/wadah tersegel, dan transfer ke layanan ventilasi-toksikologi',
            respons: 'Tepat. Atropin mengatasi efek muskarinik tetapi tidak paralisis nikotinik. Pralidoksim dapat dipertimbangkan dini pada kasus berat menurut senyawa dan ketersediaan; jangan menunda airway, atropin, dekontaminasi, atau transfer untuk mencarinya.',
          },
          d: {
            respons: 'Pada vignette ini paparan utamanya dermal dan kesadaran belum pulih penuh, sehingga bilas lambung/arang menambah risiko tanpa manfaat. Pada paparan tertelan terpilih, keputusan dekontaminasi gastrointestinal berbeda dan mensyaratkan airway aman serta penilaian toksikologi.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Lindungi tim; ABC, atropin, dan dekontaminasi berjalan paralel.',
        'Atropin dewasa dimulai dalam miligram dan digandakan menurut respons, bukan menurut jumlah ampul.',
        'Targetnya bronkorea-bronkospasme terkendali, air entry dan oksigenasi membaik, serta perfusi pulih.',
        'Sindrom perantara dan paralisis nikotinik memerlukan airway, monitoring, dan RS capable.',
      ],
      realitaFktp: 'Atropin tercantum untuk FKTP, tetapi keracunan berat dapat membutuhkan stok jauh lebih besar daripada pemakaian rutin. Pralidoksim, infus rumatan, poison-center support, dan ventilasi tidak diasumsikan ready; Sukamaju memberi atropin serta dukungan airway segera sambil mengonfirmasi fasilitas penerima.',
      sumberDaya: {
        ready: ['APD kimia dasar', 'suction-oksigen-BVM', 'atropin dan monitor', 'dekontaminasi serta ambulans'],
        melaluiJejaring: ['pralidoksim sesuai indikasi', 'infus atropin termonitor', 'ventilasi dan intensive care'],
      },
      kontinuitas: 'Setelah stabil, tentukan apakah paparan kerja, kecelakaan, atau disengaja; lakukan asesmen psikososial privat, rekonsiliasi terapi, dan pantau kelemahan napas tertunda.',
      bridgeUkm: {
        judul: 'Dari Sawah ke Sistem Aman',
        ringkasan: 'Telusuri paparan bersama, APD, arah angin, label, wadah asli, penyimpanan jauh dari pangan-air-anak, limbah dekontaminasi, dan jalur pelaporan lintas sektor tanpa menyalahkan petani.',
      },
    },
  },
  igd_ketoasidosis_diabetik: {
    fields: { nama: 'Suspek Ketoasidosis Diabetik Berat pada Dewasa dengan DM Tipe 1' },
    langkah: {
      kad_1: {
        narasi: 'Pasien diketahui memiliki DM tipe 1. GDS 480 mg/dL, keton urin kuat, napas Kussmaul, dehidrasi, dan kesadaran turun menunjukkan suspek KAD berat; pH/bikarbonat belum tersedia. Tindakan pertama?',
        pilihan: {
          a: {
            label: 'Nilai ABC dan risiko aspirasi, pasang sekurangnya satu akses IV andal, lalu mulai NaCl 0,9% atau kristaloid seimbang dengan penilaian ulang',
            respons: 'Tepat. Pada dewasa tanpa gagal jantung atau ginjal, kristaloid isotonik umumnya dimulai 500-1.000 mL/jam pada fase awal, lalu dititrasi terhadap perfusi, kesadaran, input-output, dan tanda overload. Akses kedua boleh dipasang bila tidak menunda transfer.',
          },
          b: {
            respons: 'Bahaya utamanya bukan insulin menarik air ke sel, melainkan insulin tanpa mengetahui dan mengoreksi kalium serta tanpa monitoring memadai. Di fasilitas mampu, insulin dimulai setelah cairan berjalan dan kalium dinilai.',
          },
          c: {
            respons: 'Napas Kussmaul tidak sendiri menjadi indikasi bikarbonat. Bikarbonat tidak rutin dan hanya dipertimbangkan pada asidosis sangat berat, sekitar pH <7,0, dalam fasilitas dengan monitoring.',
          },
        },
      },
      kad_2: {
        narasi: 'Setelah satu liter kristaloid isotonik, nadi turun ke 110 dan kesadaran sedikit membaik. Sukamaju tidak dapat memeriksa atau memantau kalium serial. Perawat bertanya apakah insulin dimulai.',
        pilihan: {
          a: {
            label: 'Lanjutkan cairan dan transfer tanpa insulin improvisasi; insulin dimulai di fasilitas yang dapat menilai kalium, ECG, glukosa, keton, dan asam-basa serial',
            respons: 'Tepat. Kalium total tubuh dapat rendah walau kadar awal tampak normal. Insulin ditunda bila kalium terlalu rendah dan seluruh terapi harus termonitor; Sukamaju menjaga ABC serta meneruskan cairan sambil mempercepat transfer.',
          },
          c: {
            respons: 'Jangan memberi kalium sebagai IV push atau penggantian cepat tanpa data. Kalium diberikan sebagai infus terkontrol menurut kadar serum, fungsi ginjal/diuresis, ECG bila tersedia, dan protokol.',
          },
          d: {
            respons: 'Keton urin tidak cocok sebagai endpoint resolusi dan dapat tampak menetap saat beta-hydroxybutyrate berubah menjadi asetoasetat. Perfusi, keton darah, pH/bikarbonat, elektrolit, dan kesadaran lebih bermakna.',
          },
        },
      },
      kad_3: {
        pilihan: {
          a: {
            label: 'Transfer ke RS yang siap kalium/pH-keton serial, infus insulin, ECG-diuresis, airway dan ICU; cairan serta monitoring berlanjut dengan handoff lengkap',
            respons: 'Tepat. GDS dapat turun sebelum ketosis dan asidosis pulih. Handoff memuat cairan, respons, GDS/keton, obat dan dosis insulin terakhir, pencetus, kesadaran, serta risiko aspirasi.',
          },
          b: {
            respons: 'Glukosa di bawah 200 mg/dL bukan syarat tunggal resolusi. Perbaikan keton darah serta pH atau bikarbonat diperlukan, dan itu harus dipantau di fasilitas mampu.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Curigai KAD dari hiperglikemia/diabetes, ketosis, dan kemungkinan asidosis; jangan menunggu semua hasil untuk bertindak.',
        'ABC dan kristaloid isotonik lebih dulu; NaCl 0,9% atau kristaloid seimbang dipilih menurut stok dan protokol.',
        'Insulin memerlukan data serta pemantauan kalium; jangan mengimprovisasi infus di fasilitas yang tidak siap.',
        'Glukosa turun bukan akhir KAD; resolusi memerlukan perbaikan keton dan asidosis.',
      ],
      realitaFktp: 'Insulin regular dan NPH tercantum untuk layanan tingkat pertama, tetapi listing tidak berarti Sukamaju siap menjalankan infus KAD. Pemeriksaan kalium dan asam-basa, pompa/protokol, ECG, monitoring serial, serta respons terhadap komplikasi berada di RS capable. Di sini cairan, ABC, pencarian pencetus, dan transfer berjalan tanpa insulin improvisasi.',
      sumberDaya: {
        ready: ['GDS dan keton urin', 'kristaloid isotonik', 'suction-BVM-monitor', 'ambulans dan handoff'],
        melaluiJejaring: ['kalium dan asam-basa serial', 'keton darah', 'infus insulin dan ICU'],
      },
      kontinuitas: 'Tutup penyebab insulin habis: stok, resep PRB/JKN, biaya, jarak, jam layanan, alat suntik, penyimpanan, distress, dan sick-day plan sebelum pasien dinyatakan pulih.',
      bridgeUkm: {
        judul: 'Insulin Habis Bukan Akhir Anamnesis',
        ringkasan: 'Kasus memicu audit rantai pasok, cold chain, resep dan akses alat monitoring; pola putus obat agregat kembali ke farmasi, program kronis, BPJS, dan jejaring, bukan ditempelkan sebagai kesalahan pasien.',
      },
    },
  },
  igd_luka_bakar_luas: {
    fields: { nama: 'Luka Bakar Mayor 25% TBSA dengan Suspek Cedera Inhalasi' },
    langkah: {
      lb_1: {
        pilihan: {
          a: {
            label: 'Pastikan lokasi aman; lepaskan pakaian panas yang tidak melekat dan perhiasan, potong di sekitar kain yang melekat, lalu dinginkan 20 menit sambil ABC berjalan',
            respons: 'Tepat. Jangan mengelupas kain yang melekat. Gunakan air mengalir sejuk/suhu ruang bila masih dalam 3 jam, jaga bagian tubuh lain hangat, hentikan bila memicu hipotermia, dan jangan menunda airway atau transfer.',
          },
          d: {
            respons: 'Akses dan cairan penting, tetapi proses bakar dan ABC ditangani paralel. Satu akses andal lebih baik daripada menunda keberangkatan demi ritual dua akses.',
          },
        },
      },
      lb_2: {
        pilihan: {
          a: {
            label: 'Beri oksigen konsentrasi tinggi, siapkan suction-BVM dan bantuan airway, serta transfer segera ke fasilitas capable; jangan menunggu SpO2 turun',
            respons: 'Tepat. Ruang tertutup, serak progresif, jelaga, dan sputum hitam adalah suspek kuat cedera inhalasi. Pulse oximeter standar dapat tampak 95% pada keracunan CO; advanced airway hanya dicoba bila operator dan alat benar-benar ready.',
          },
        },
      },
      lb_3: {
        narasi: 'TBSA partial/full thickness dihitung 25% dengan Rule of Nines; eritema saja tidak dihitung. Berat sekitar 60 kg dan kejadian satu jam lalu. Apa rencana cairan dan transfer?',
        pilihan: {
          a: {
            label: 'Mulai kristaloid seimbang hangat sebagai estimasi 2 mL/kg/%TBSA/24 jam, hitung dari waktu bakar, lalu titrasi respons sambil transfer ke burn service',
            respons: 'Tepat. Estimasi awalnya sekitar 3.000 mL/24 jam, separuh dalam delapan jam pertama sejak terbakar. Hitung sisa waktu tanpa bolus buta untuk mengejar angka; titrasi terhadap perfusi, vital, kesadaran, dan urine sekitar 0,5 mL/kg/jam bila dapat dipantau.',
          },
          c: {
            respons: 'Formula adalah titik awal, bukan target yang harus dihabiskan. Cairan berlebihan memperburuk edema, termasuk airway; nilai respons dan kemungkinan trauma/perdarahan lain.',
          },
          d: {
            respons: 'Transfer tidak menunggu dua jalur, tetapi satu akses IV andal dan cairan hangat dapat dimulai cepat tanpa menahan keberangkatan. Tambahkan akses kedua bila feasible.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Hentikan proses bakar; jangan menarik kain yang melekat, dan dinginkan 20 menit tanpa membuat hipotermia.',
        'Serak progresif, jelaga, dan ruang tertutup adalah suspek cedera inhalasi; SpO2 normal tidak menyingkirkan CO.',
        'Formula cairan adalah estimasi awal yang dititrasi, bukan target yang harus dihabiskan.',
        'Rujuk ke kemampuan airway, toksisitas asap, burn service, ICU, dan rehabilitasi.',
      ],
      realitaFktp: 'Sukamaju menyiapkan oksigen konsentrasi tinggi, suction, BVM, akses IV, kristaloid seimbang hangat, analgesia, balut bersih, dan transport. Advanced airway, co-oximetry, antidot sianida, ICU, serta burn service tidak diasumsikan ready; operator dan alat harus dinyatakan sebelum suatu prosedur diberi skor.',
      sumberDaya: {
        ready: ['oksigen-suction-BVM', 'pendinginan dan pencegahan hipotermia', 'akses IV dan kristaloid hangat', 'analgesia-balut-ambulans'],
        melaluiJejaring: ['advanced airway dan ventilasi', 'co-oximetry/toksikologi asap', 'burn service dan ICU'],
      },
      kontinuitas: 'Rujuk balik menilai luka, rentang gerak, kontraktur/parut, nutrisi, nyeri-gatal, kesehatan mental, dukungan keluarga, serta kembali bekerja.',
      bridgeUkm: {
        judul: 'Dapur Warung, Keselamatan Bersama',
        ringkasan: 'Audit tabung dan regulator gas, ventilasi, pintu keluar macet, alat pemadam, jalur evakuasi, first aid yang keliru, serta respons ambulans bersama pemilik, desa, pemadam, Puskesmas, dan Dinkes tanpa menyalahkan korban.',
      },
    },
  },
  igd_perdarahan_pascasalin: {
    fields: { nama: 'Perdarahan Pascasalin Primer dengan Syok, Kemungkinan Atonia Uteri' },
    langkah: {
      pps_1: {
        narasi: 'Plasenta sudah lahir dan kelengkapannya sedang diperiksa. Uterus lembek, darah terus mengalir, TD 85/55, nadi 126. Apa respons pertama?',
        pilihan: {
          a: {
            label: 'Aktifkan tim dan rujukan; jalankan MOTIVE paralel: masase, oksitosin, TXA, IV-kristaloid hangat, pemeriksaan 4T, dan eskalasi',
            respons: 'Tepat. Bundel berjalan secepatnya, idealnya dalam 15 menit, tanpa menunggu satu komponen selesai. Ukur kehilangan darah bila alat ready, tetapi clinical judgement pada perdarahan deras dengan syok sudah cukup untuk bertindak.',
          },
          d: {
            respons: 'TXA 1 g IV selama 10 menit memang diberikan sedini mungkin dan dalam 3 jam kelahiran. Kesalahan pilihan ini adalah menunggu 15 menit sebelum masase, uterotonika, cairan, pemeriksaan, serta eskalasi yang harus berjalan paralel.',
          },
        },
      },
      pps_2: {
        pilihan: {
          a: {
            label: 'Tenaga terlatih melakukan kompresi bimanual sementara; lanjutkan uterotonika sesuai kontraindikasi, kristaloid hangat terukur, dan transfer yang sudah aktif',
            respons: 'Tepat. Kompresi membeli waktu sambil 4T terus dinilai. Kristaloid adalah jembatan, bukan pengganti darah; jaga kehangatan dan nilai ulang perfusi tanpa istilah guyur atau bolus tanpa batas.',
          },
          b: {
            respons: 'Robekan tetap dicari dalam 4T, tetapi pemeriksaan tidak boleh berubah menjadi eksplorasi buta atau penjahitan kecil yang mengalihkan resusitasi dari syok dan sumber utama.',
          },
        },
      },
      pps_3: {
        pilihan: {
          a: {
            label: 'Transfer sekarang; pertahankan kontrol perdarahan dengan kompresi oleh kru terlatih atau tampon hanya bila protokol-alat-monitoring ready, sambil cairan dan pra-notifikasi berjalan',
            respons: 'Tepat. Cara mempertahankan kontrol perdarahan harus aman bagi ibu dan kru selama pemindahan. Tampon bukan improvisasi universal; tujuan telah menyiapkan darah, anestesi, kamar operasi, kendali sumber obstetri, ICU, dan dukungan neonatus.',
          },
          b: {
            respons: 'Melepas semua kontrol saat perdarahan masih aktif berisiko, tetapi kompresi internal juga tidak boleh dipaksakan tanpa kru, posisi, dan transport yang aman. Pilih jembatan yang benar-benar dapat dipertahankan sambil transfer.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Aktifkan tim dan jalankan MOTIVE secara paralel; jangan menunggu Hb atau satu tindakan selesai.',
        'Oksitosin dan TXA diberikan dalam dosis-waktu yang jelas; kristaloid hangat adalah jembatan, bukan pengganti darah.',
        'Cari 4T sambil resusitasi; plasenta sudah lahir tetapi kelengkapannya tetap diperiksa.',
        'Kompresi atau tampon hanya dijalankan bila operator, alat, pemantauan, dan transfer aman benar-benar ready.',
      ],
      realitaFktp: 'Oksitosin dan TXA tercantum untuk FKTP, tetapi stok, cold chain, jumlah ampul, drape, kompetensi, dan ambulans tidak otomatis siap. Encounter ini menyatakan obat, dua akses IV, tim, transport, serta RS penerima ready; tindakan yang tidak ready tidak menjadi hukuman tersembunyi.',
      sumberDaya: {
        ready: ['oksitosin dan TXA', 'dua akses IV dan kristaloid hangat', 'tim terlatih serta monitor', 'ambulans dan pra-notifikasi'],
        melaluiJejaring: ['darah/transfusi masif', 'anestesi dan kamar operasi', 'kendali sumber obstetri dan ICU'],
        tidakReady: ['tampon improvisasi tanpa protokol/operator'],
      },
      kontinuitas: 'Setelah pulang, tindak lanjuti anemia, pemulihan fisik, laktasi, trauma/kesehatan mental, kontrasepsi, dan kebutuhan keluarga; lakukan maternal near-miss review.',
      bridgeUkm: {
        judul: 'MOTIVE Sampai Sistem',
        ringkasan: 'Audit cold chain oksitosin, stok TXA, drape, set IV, simulasi PPH, ambulans, komunikasi, dan jejaring darah. Banyak PPH tidak dapat diprediksi, sehingga kesiapan berlaku untuk setiap persalinan.',
      },
    },
  },
  igd_pneumotoraks_tension_trauma: {
    fields: { nama: 'Pneumotoraks Tensi Traumatik dengan Syok Obstruktif' },
    langkah: {
      ptx_1: {
        pilihan: {
          a: {
            label: 'Jangan tunda dekompresi untuk foto; beri oksigen konsentrasi tinggi, lakukan trauma ABCDE, dan dekompresi sisi kanan oleh operator terlatih',
            respons: 'Tepat. Instabilitas hemodinamik dan kompromi napas berat membuat diagnosis serta tindakan bersifat klinis. eFAST boleh membantu bila alat-operator sudah di sisi pasien dan tidak menunda; hasil negatif tidak menyingkirkan pneumotoraks.',
          },
          c: {
            respons: 'Dekompresi mendahului cairan pada syok obstruktif ini, tetapi trauma dapat menimbulkan syok campuran. Pasang akses, cari perdarahan lain, dan berikan cairan atau darah menurut indikasi setelah penyebab obstruktif ditangani.',
          },
        },
      },
      ptx_2: {
        narasi: 'Operator terlatih, kateter 14G sekitar 8 cm, antiseptik, oksigen, monitor, dan transport tersedia. Lokasi encounter mengikuti protokol sela iga 4-5 garis anterior aksila/safe triangle.',
        pilihan: {
          a: {
            label: 'Tusuk tegak lurus tepat di atas tepi iga bawah pada sela 4-5 garis anterior aksila; majukan kateter, keluarkan jarum, ventilasikan sesuai perangkat, lalu fiksasi',
            respons: 'Tepat. Jangan mengandalkan garis puting atau kateter pendek. Desis mungkin tidak terdengar dan bukan konfirmasi; nilai keberhasilan dari kerja napas, SpO2, tekanan darah, nadi, kesadaran, suara/ekspansi dada, serta perfusi.',
          },
          d: {
            respons: 'WSD bukan salah karena nama FKTP, tetapi karena alat, operator, monitoring, dan quality assurance tidak ready pada tim Sukamaju ini. Needle decompression adalah jembatan menuju chest drain definitif.',
          },
        },
      },
      ptx_3: {
        pilihan: {
          a: {
            label: 'Fiksasi dan pertahankan ventilasi kateter sesuai perangkat/protokol, pantau kegagalan atau kekambuhan, teruskan oksigen, lalu transfer ke trauma-chest drain capable RS',
            respons: 'Tepat. Dekompresi adalah jembatan. Catat sisi, landmark, alat, waktu, respons dan komplikasi; siapkan penilaian ulang atau dekompresi ulang bila pasien memburuk, terutama bila ventilasi tekanan positif diperlukan.',
          },
          d: {
            respons: 'Pencitraan setelah stabilisasi tetap diperlukan, tetapi tidak boleh menahan transfer menuju chest drain, trauma care, ventilasi, transfusi, bedah, dan intensive care.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Instabilitas dengan pola trauma toraks adalah diagnosis klinis; jangan menunda dekompresi untuk foto.',
        'Operator, lokasi, panjang kateter, dan monitoring harus eksplisit sebelum prosedur dinilai.',
        'Desis bukan konfirmasi; nilai keberhasilan dari napas, perfusi, kesadaran, dan patensi serial.',
        'Needle decompression adalah jembatan menuju chest drain dan trauma care definitif.',
      ],
      realitaFktp: 'Encounter ini secara eksplisit menyediakan operator terlatih, kateter 14G sekitar 8 cm, antiseptik, oksigen, monitor, akses IV, dan ambulans. WSD/finger thoracostomy tidak ready pada tim Sukamaju; batasnya adalah kemampuan nyata, bukan label tingkat fasilitas.',
      sumberDaya: {
        ready: ['operator dekompresi terlatih', 'kateter panjang dan antiseptik', 'oksigen-monitor-akses IV', 'ambulans'],
        melaluiJejaring: ['chest drain', 'imaging trauma dan transfusi', 'ventilasi-bedah-ICU'],
      },
      kontinuitas: 'Rujuk balik menilai pemulihan paru, nyeri, cedera penyerta, fungsi, rehabilitasi, serta kesiapan kembali bekerja dan berkendara.',
      bridgeUkm: {
        judul: 'Tusukan yang Harus Dapat Diaudit',
        ringkasan: 'Catat indikasi, sisi, landmark, panjang alat, respons, komplikasi, lokasi kecelakaan, helm, dan waktu respons. Temuan agregat mengarahkan stok, simulasi, jalur chest drain, serta keselamatan jalan.',
      },
    },
  },
  igd_status_epileptikus: {
    fields: {
      nama: 'Status Epileptikus Konvulsif pada Dewasa',
      demografi: { usiaMin: 18, usiaMax: 45 },
    },
    langkah: {
      se_1: {
        pilihan: {
          a: {
            label: 'Catat onset, panggil tim dan ambulans; lindungi kepala, posisi lateral bila aman, suction terarah, oksigen-BVM-monitor, akses IV, dan cek GDS tanpa menunda obat',
            respons: 'Tepat. Status pada t1 lima menit memerlukan kerja paralel. Jangan menahan gerakan atau memasukkan benda ke mulut. Posisi lateral membantu, tetapi airway belum otomatis aman; kejang dan benzodiazepin tetap dapat mengganggu ventilasi.',
          },
          d: {
            respons: 'Benzodiazepin tidak menunggu ritual ABC selesai atau akses IV bila rute rescue lain ready. Proteksi dasar dan dukungan ventilasi disiapkan paralel, lalu dosis adekuat diberikan segera.',
          },
        },
      },
      se_2: {
        pilihan: {
          a: {
            label: 'Berikan diazepam IV 0,1 mg/kgBB (5-10 mg, maks kumulatif 20 mg; maks 5 mg/menit), ulang sekali bila perlu; gunakan rute rektal bila IV gagal',
            respons: 'Tepat. Catat waktu, rute, dosis, respons, dan obat pra-fasilitas. PNPK dewasa mendukung diazepam IV atau rektal sesuai kesiapan encounter; rute bukal tidak diperkenalkan tanpa obat, sediaan, dan protokol yang jelas.',
          },
          c: {
            respons: 'Jangan mengurangi dosis efektif hanya karena takut depresi napas. Risiko napas ditangani dengan monitoring, suction, BVM, dan eskalasi airway, sedangkan undertreatment memperpanjang kejang.',
          },
        },
      },
      se_3: {
        narasi: 'GDS awal normal. Setelah dua dosis diazepam adekuat, kejang hanya berhenti 40 detik lalu kambuh tanpa pemulihan kesadaran: established benzodiazepine-resistant status epilepticus.',
        pilihan: {
          a: {
            label: 'Pertahankan airway-ventilasi dan monitor, koreksi penyebab reversibel, konsultasikan penerima, lalu transfer segera ke RS yang siap obat lini kedua, EEG, CT, dan ICU',
            respons: 'Tepat. Levetirasetam, fenitoin/fosfenitoin, atau valproat adalah opsi lini kedua dengan pemilihan menurut protokol dan pasien. Sukamaju tidak mengimprovisasi infus tanpa pompa, ECG, stok penuh, operator, dan airway backup.',
          },
          d: {
            respons: 'GDS sudah diperiksa pada fase awal. Transfer benar, tetapi airway, monitoring, dokumentasi obat, pencarian pencetus, dan koreksi penyebab reversibel tetap berjalan selama perjalanan.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        't1 = 5 menit berarti terapi emergensi dimulai; t2 = 30 menit menandai risiko konsekuensi jangka panjang.',
        'Proteksi, airway-ventilasi, glukosa, benzodiazepin, ambulans, dan pencatatan waktu berjalan paralel.',
        'Diazepam diberikan dalam dosis-rute terukur dan dapat diulang sekali; jangan undertreat atau menumpuk tanpa catatan.',
        'Gagal setelah dua dosis adekuat adalah established refractory pathway menuju lini kedua dan airway-capable RS.',
      ],
      realitaFktp: 'Sukamaju memiliki diazepam IV/enema, glukometer, oksigen, suction, BVM, monitor, akses IV, dan ambulans. Infus lini kedua tidak dinyatakan ready karena pompa, ECG, stok penuh, operator, dan airway backup belum terverifikasi; transfer tidak menunggu kejang berhenti.',
      sumberDaya: {
        ready: ['diazepam IV dan rektal', 'glukometer-oksigen-suction-BVM', 'monitor dan akses IV', 'ambulans'],
        melaluiJejaring: ['obat lini kedua termonitor', 'CT/EEG dan evaluasi etiologi', 'intubasi-ventilasi-ICU'],
      },
      kontinuitas: 'Susun rescue plan tertulis, akses obat rutin, first aid keluarga, safety-net, risiko air-api-ketinggian-mesin-berkendara, kesehatan mental, dan stigma tanpa menyalahkan kepatuhan.',
      bridgeUkm: {
        judul: 'Lima Menit yang Menguji Sistem',
        ringkasan: 'Audit onset-ke-benzodiazepin, kecukupan dosis, kesiapan oksigen-suction-BVM, stok rescue medicine, ambulans, dan tujuan capable; temuan kembali ke simulasi tim serta edukasi keluarga, sekolah, dan tempat kerja.',
      },
    },
  },
  igd_stroke_iskemik_window: {
    fields: {
      nama: 'Suspek Stroke Akut dalam Jendela Reperfusi',
      icd10: 'I64',
    },
    langkah: {
      st_1: {
        narasi: 'Onset disaksikan pukul 07.00, tiba 08.30. Pasien sadar dengan bicara pelo dan hemiparesis kiri; SpO2 97%. Apa prioritas FKTP?',
        pilihan: {
          a: {
            label: 'Jaga ABC tanpa oksigen rutin, dokumentasikan last-known-well/onset dan nomor saksi, lakukan skrining neurologis singkat, lalu cek GDS',
            respons: 'Tepat. GDS cepat menyingkirkan hipoglikemia sebagai salah satu mimic yang dapat dibalik, tetapi hasil normal tidak membuktikan stroke iskemik atau menyingkirkan mimic lain. Pemeriksaan panjang tidak boleh menahan pra-notifikasi dan transfer.',
          },
          b: {
            respons: 'Subtipe iskemik belum diketahui sampai pencitraan. Pasien tetap NPO dan tidak menerima aspirin, antikoagulan, minuman, makanan, atau obat oral sebelum perdarahan serta kemampuan menelan dinilai.',
          },
        },
      },
      st_2: {
        pilihan: {
          a: {
            label: 'Jangan beri kaptopril/nifedipin sublingual atau menunda transfer; monitor TD 182/100 dan laporkan karena masih di bawah ambang pra-trombolisis 185/110',
            respons: 'Tepat. Jangan menyebut semua hipertensi akut kompensatoris atau setiap penurunan memadamkan penumbra. Bila TD melampaui ambang reperfusi atau ada kegawatan lain, penurunan terkontrol dengan obat IV tertitrasi dilakukan menurut protokol di fasilitas mampu.',
          },
          b: {
            respons: 'Normalisasi cepat dengan kaptopril sublingual tidak aman dan membuang waktu. Sasaran tekanan darah bergantung strategi reperfusi dan kondisi penyerta, bukan target rutin <140/90 di FKTP.',
          },
          c: {
            respons: 'Nifedipin sublingual memberi penurunan yang cepat dan tidak terkontrol. Monitor, laporkan tren, dan jangan menunda akses ke pencitraan serta reperfusi.',
          },
        },
      },
      st_3: {
        pilihan: {
          a: {
            label: 'Ikuti jejaring dan transfer ke RS 25 menit dengan CT-layanan stroke; pra-notifikasi, target berangkat <=30 menit, dan kirim waktu, defisit, GDS, TD, NPO, serta obat',
            respons: 'Tepat untuk jejaring skenario ini. Prinsipnya adalah kemampuan yang mengubah terapi, bukan selalu memilih rumah sakit lebih jauh. Jalur LVO/EVT atau pola transfer lain mengikuti performa sistem lokal yang terdokumentasi.',
          },
          b: {
            respons: 'RS tanpa CT hanya menambah perpindahan dalam jejaring ini. Keputusan dapat berbeda bila fasilitas terdekat benar-benar thrombolysis-capable dan transfer lanjutnya terbukti cepat.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Kenali defisit, kunci last-known-well/onset, cek glukosa, dan pra-notifikasi.',
        'GDS normal hanya menyingkirkan hipoglikemia sebagai satu mimic; subtipe stroke menunggu pencitraan.',
        'NPO dan tanpa antiplatelet/antikoagulan sebelum perdarahan disingkirkan.',
        'Tujuan dipilih dari kemampuan CT-reperfusi dan performa jejaring, dengan target berangkat <=30 menit.',
      ],
      realitaFktp: 'Tugas Sukamaju bukan menebak iskemik versus perdarahan, tetapi menjaga ABC, mengunci waktu, menilai defisit singkat, dan memilih kemampuan yang mengubah terapi. Pada skenario ini RS 25 menit dengan CT dan layanan stroke lebih tepat daripada RS 10 menit tanpa CT; rute tetap mengikuti jejaring lokal.',
      sumberDaya: {
        ready: ['GDS dan pemeriksaan neurologis singkat', 'monitor vital dan suction', 'pra-notifikasi serta ambulans'],
        melaluiJejaring: ['CT 24 jam', 'trombolisis/CTA/EVT pathway', 'stroke unit dan rehabilitasi'],
      },
      kontinuitas: 'Rujuk balik mencakup diagnosis final, antitrombotik, disfagia, rehabilitasi, kebutuhan rumah, caregiver, tekanan darah, DM, lipid, merokok, fibrilasi atrium, aktivitas, dan depresi pascastroke.',
      bridgeUkm: {
        judul: 'Jejak Waktu Stroke',
        ringkasan: 'Catat onset-to-arrival, decision-to-departure, tujuan, dan kegagalan jejaring. Data agregat mengarahkan edukasi SEGERA KE RS, telemedisin, routing, dan kesiapan rehabilitasi tanpa membuka identitas pasien.',
      },
    },
  },
  igd_sumbatan_jalan_napas_anak: {
    fields: {
      nama: 'Aspirasi Benda Asing dengan Sumbatan Jalan Napas Berat pada Anak',
      demografi: { usiaMin: 3, usiaMax: 3, jenisKelamin: 'L' },
    },
    langkah: {
      fbao_1: {
        narasi: 'Anak 3 tahun masih responsif tetapi tidak dapat bersuara; batuk lemah tanpa suara dan wajah membiru. Ini FBAO berat. Apa respons pertama?',
        pilihan: {
          a: {
            label: 'Satu petugas aktifkan bantuan dan ambulans; penolong utama lakukan 5 back blows lalu 5 abdominal thrusts sampai benda keluar atau anak tidak responsif',
            respons: 'Tepat. Pada anak, siklus lima back blows dan lima abdominal thrusts dimulai segera. Bayi di bawah satu tahun memakai chest thrust, tetapi algoritme bayi tidak diuji pada tombol kasus anak tiga tahun ini.',
          },
          d: {
            respons: 'Manuver pelepasan tidak boleh ditunda oleh pemasangan sungkup, tetapi oksigen, suction, BVM anak, monitor, dan alat resusitasi tetap disiapkan paralel dan digunakan segera ketika aliran udara atau ventilasi memungkinkan.',
          },
        },
      },
      fbao_2: {
        pilihan: {
          a: {
            label: 'Baringkan aman dan mulai CPR tanpa menunda untuk pulse check; saat membuka airway lihat mulut, ambil hanya benda yang tampak, lalu ventilasi dengan BVM bila dada dapat naik',
            respons: 'Tepat. Ikuti rasio pediatric BLS sesuai jumlah penolong. Bila dada tidak naik, reposisi dan lanjutkan siklus; AED/pad pediatrik dipasang bila cardiac arrest dan tersedia tanpa mengganggu kompresi.',
          },
          d: {
            respons: 'Direct laryngoscopy dan Magill hanya untuk operator terlatih ketika benda terlihat dan alat sudah berada di sisi pasien. Jangan meninggalkan CPR untuk mencari alat atau melakukan instrumentasi buta.',
          },
        },
      },
      fbao_3: {
        pilihan: {
          a: {
            label: 'Nilai ulang ABC dan trauma, pertahankan NPO, lalu transfer ke airway pediatrik-anestesi-bronkoskopi capable RS karena batuk dan napas kasar menetap',
            respons: 'Tepat. SpO2 atau foto toraks normal tidak menyingkirkan benda organik radiolusen. Abdominal thrust tidak selalu mencederai organ; nilai nyeri, muntah, memar, distensi, dan kekuatan/jumlah manuver, tetapi alasan utama transfer adalah dugaan retained foreign body.',
          },
          b: {
            respons: 'Benda yang keluar belum membuktikan airway bersih. Batuk dan bunyi napas menetap setelah episode asfiksia membutuhkan evaluasi bronkoskopi-capable, bukan sekadar pesan hati-hati.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Anak 3 tahun dengan FBAO berat: lima back blows lalu lima abdominal thrusts sambil bantuan diaktifkan.',
        'Bila tidak responsif, mulai CPR; lihat mulut saat membuka airway dan ambil hanya benda yang tampak.',
        'Bayi memakai chest thrust, bukan abdominal thrust; algoritme usia tidak dicampur di tombol utama.',
        'Batuk atau bunyi napas menetap setelah benda keluar membutuhkan evaluasi retained foreign body.',
      ],
      realitaFktp: 'Sukamaju memiliki tim pediatric BLS, oksigen, suction, BVM dan masker anak, monitor, AED/pad pediatrik bila tersedia, serta ambulans. Bronkoskopi tidak tersedia; laringoskop/Magill hanya digunakan oleh operator terlatih bila benda terlihat dan alat sudah berada di sisi pasien.',
      sumberDaya: {
        ready: ['tim pediatric BLS', 'oksigen-suction-BVM anak', 'monitor dan AED pediatrik', 'ambulans'],
        melaluiJejaring: ['airway pediatrik dan anestesi', 'bronkoskopi serta kamar operasi', 'PICU'],
      },
      kontinuitas: 'Keluarga melakukan teach-back first aid, pemilihan dan pemotongan makanan sesuai usia, posisi duduk tenang, pengawasan makan, serta penyimpanan benda kecil.',
      bridgeUkm: {
        judul: 'Satu Bakso, Dua Keselamatan',
        ringkasan: 'Gabungkan first aid keluarga dengan latihan choking untuk kader, PAUD, dan penjual makanan; audit BVM anak serta ambulans dan tinjau makanan bulat-kenyal tanpa menyalahkan keluarga atau pedagang.',
      },
    },
  },
  igd_syok_sepsis: {
    fields: {
      nama: 'Suspek Sepsis dengan Syok, Kemungkinan Sumber Urin',
      demografi: { usiaMin: 68, usiaMax: 68, jenisKelamin: 'P' },
    },
    langkah: {
      sep_1: {
        narasi: 'Perempuan 68 tahun, 55 kg, bingung, oliguria, akral dingin, CRT >4 detik, TD 82/50, SpO2 92%. Fungsi ginjal belum diketahui; laktat dan kultur tidak ready. Apa respons awal?',
        pilihan: {
          a: {
            label: 'Aktifkan huddle dan rujukan paralel; verifikasi SpO2, titrasi oksigen, pasang IV, cek GDS, lalu beri kristaloid seimbang 250-500 mL dengan reassessment',
            respons: 'Tepat. Sepsis adalah diagnosis klinis dan resusitasi tidak menunggu laktat. Nilai TD/MAP, CRT, kesadaran, nadi, napas, SpO2, paru, dan urine tiap aliquot; 30 mL/kg adalah orientasi bukti rendah, bukan tiga kantong otomatis.',
          },
          d: {
            respons: 'Vasopresor dapat diperlukan dini pada syok tidak stabil dan tidak selalu harus menunggu akses sentral. Pilihan ini salah pada encounter Sukamaju karena pompa, protokol, monitor, obat, dan operator tidak ready; eskalasi ke tim/RS capable, jangan improvisasi.',
          },
        },
      },
      sep_2: {
        narasi: 'Tidak ada alergi beta-laktam berat atau risiko MDR/ESBL yang diketahui. Protokol jejaring menyediakan dua vial seftriakson sebagai stok jembatan emergensi; fasilitas tujuan sedang dikonfirmasi tanpa menunggu satu RS yang penuh.',
        pilihan: {
          a: {
            label: 'Berikan seftriakson 2 g IV dosis pertama dan catat jamnya; lanjutkan cairan-reassessment sambil mencari fasilitas dengan ICU, kultur-imaging, dan source control urologis',
            respons: 'Tepat untuk encounter ini. Regimen berasal dari protokol jejaring untuk dugaan sumber urin komunitas setelah skrining alergi/MDR singkat; bukan resep universal dan bukan klaim bahwa seftriakson rutin tersedia di semua Puskesmas.',
          },
          b: {
            respons: 'Kultur diambil lebih dulu hanya bila tersedia dan tidak menunda antibiotik. Pada syok, dosis IV segera dan idealnya dalam satu jam berjalan bersamaan dengan resusitasi serta pencarian tujuan.',
          },
        },
      },
      sep_3: {
        narasi: 'Setelah cairan terukur, TD 92/60 (MAP sekitar 71), napas 26, dan kesadaran sedikit membaik. Respons dapat sementara dan kemungkinan obstruksi urin belum terselesaikan. Ambulans siap.',
        pilihan: {
          a: {
            label: 'Transfer sekarang sambil terapi dan monitor berjalan; handoff cairan-respons, urine, antibiotik-dosis-jam, alergi/MDR, sumber, serta kebutuhan source control',
            respons: 'Tepat. Nilai ini tidak membuktikan pasien pasti membutuhkan vasopresor saat ini, tetapi ia tetap memerlukan layanan shock, kultur/laktat, imaging, ICU/HCU, dan urologi karena respons dapat sementara dan source control belum tercapai.',
          },
          d: {
            respons: 'Hidrokortison adalah tambahan terpilih pada septic shock yang masih membutuhkan vasopresor dalam lingkungan termonitor; bukan dosis tinggi pra-rujuk atau pengganti antibiotik, cairan, dan source control.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Kenali kegawatan klinis dan mulai resusitasi tanpa menunggu laktat atau kultur.',
        'Kristaloid seimbang diberikan 250-500 mL lalu dinilai ulang; 30 mL/kg bukan tiga kantong otomatis.',
        'Seftriakson 2 g IV adalah stok jembatan encounter yang diaudit, bukan stok universal Puskesmas.',
        'Antibiotik, source-control thinking, dan pencarian RS capable berjalan sejak menit pertama.',
      ],
      realitaFktp: 'Sukamaju tidak perlu laktat untuk mengenali infeksi, bingung, oliguria, akral dingin, dan TD 82/50 sebagai kegawatan. Tim memberi cairan dalam aliquot, oksigen tertitrasi, serta dosis jembatan berprotokol. Vasopresor tidak diimprovisasi tanpa pompa, monitor, obat, protokol, dan operator; keterlambatan bed memicu pencarian alternatif.',
      sumberDaya: {
        ready: ['kristaloid seimbang dan akses IV', 'oksigen-monitor-GDS', 'seftriakson stok jembatan berprotokol', 'ambulans dan komunikasi'],
        melaluiJejaring: ['laktat-kultur-imaging', 'vasopresor dan ICU/HCU', 'urologi/source control'],
        tidakReady: ['vasopresor perifer tanpa protokol', 'menunggu bed dua jam di Sukamaju'],
      },
      kontinuitas: 'Nilai pemulihan ginjal dan urine, antibiotik/obat kronis, kelemahan, nutrisi, fungsi-kognisi pascasepsis, infeksi berulang, serta kemungkinan batu atau obstruksi.',
      bridgeUkm: {
        judul: 'Satu Jam, Dua Sistem',
        ringkasan: 'Audit waktu kenal sepsis, antibiotik, cairan dan reassessment, decision-to-departure, penolakan bed, stok emergency dose, handoff, dan source control untuk memperbaiki protokol, antibiogram, huddle, serta jejaring.',
      },
    },
  },
  igd_tenggelam: {
    fields: {
      nama: 'Tenggelam Nonfatal dengan Gagal Napas dan Hipotermia Ringan',
      demografi: { usiaMin: 22, usiaMax: 22, jenisKelamin: 'L' },
    },
    langkah: {
      tgl_1: {
        narasi: 'Laki-laki 22 tahun, diperkirakan 60 kg, dari sungai setelah hujan dini hari. Nadi 54/menit masih teraba, RR 6/menit dangkal, SpO2 80%, suhu low-reading 33,8 C. Apa prioritas?',
        pilihan: {
          a: {
            label: 'Buka airway, keluarkan hanya muntahan/benda yang menghalangi, lalu assisted ventilation BVM-oksigen segera dengan two-person seal dan volume sampai dada naik',
            respons: 'Tepat. Dengan nadi tetapi napas tidak efektif, masalahnya respiratory failure. Hindari ventilasi terlalu cepat/bertekanan tinggi; jangan menghabiskan waktu menyedot busa halus yang terus terbentuk bila ventilasi masih dapat dilakukan.',
          },
          b: {
            respons: 'Abdominal thrust tidak mengeluarkan air dari paru dan menambah regurgitasi. Ia hanya relevan bila benda padat benar-benar menyebabkan FBAO.',
          },
          d: {
            respons: 'Pengeringan dan penghangatan harus dimulai paralel oleh petugas kedua setelah ventilasi berjalan; ventilasi tidak boleh ditunda untuk melepas pakaian.',
          },
        },
      },
      tgl_2: {
        pilihan: {
          a: {
            label: 'Pertahankan bantuan ventilasi sampai napas adekuat, titrasi O2 ke 94-98%, lepaskan pakaian basah, keringkan, insulasi dan hangatkan batang tubuh secara paralel',
            respons: 'Tepat. Nilai kesadaran, kerja napas, auskultasi, muntah, ECG, glukosa, suhu, perfusi, dan tren SpO2. Cairan isotonic hangat hanya bila ada hipovolemia/hipotensi; jenis air tidak mengubah algoritme awal.',
          },
          b: {
            respons: 'Menggosok tungkai tidak efektif, dapat mencederai kulit dan meningkatkan vasodilatasi perifer. Tidak perlu klaim absolut bahwa tindakan itu pasti memicu fibrilasi ventrikel; gunakan rewarming batang tubuh yang terkontrol.',
          },
          c: {
            respons: 'Antibiotik dan steroid tidak diberikan rutin. Antibiotik dipertimbangkan bila muncul infeksi atau paparan sangat tercemar, idealnya berdasarkan kultur dan pola lokal; pneumonitis awal tidak otomatis infeksi.',
          },
        },
      },
      tgl_3: {
        narasi: 'Transfer sudah dikoordinasikan sejak awal. Setelah 30 menit ia sadar dan SpO2 96% dengan oksigen, tetapi masih batuk setelah sempat tidak sadar dan membutuhkan BVM. Keluarga bertanya apakah tetap perlu berangkat.',
        pilihan: {
          a: {
            label: 'Lanjutkan transfer ke fasilitas airway-ventilasi-blood gas-imaging-ICU capable karena pernah gagal napas, membutuhkan BVM, masih batuk, dan hipotermia',
            respons: 'Tepat. Alasan transfer adalah derajat penyakit nyata, bukan mitos secondary drowning atau air tersisa. Handoff memuat kronologi submersi/rescue, bantuan napas/CPR, muntah, trauma/penyebab medis, serta tren neurologis, respirasi, dan suhu.',
          },
          b: {
            respons: 'Pasien ringan yang benar-benar asimtomatik dan stabil setelah observasi 4-6 jam di fasilitas mampu dapat dipertimbangkan pulang. Pasien ini tidak termasuk karena sempat gagal napas, membutuhkan BVM, dan masih batuk.',
          },
          c: {
            respons: 'Tiga puluh menit terlalu singkat untuk pasien ini, tetapi jangan mengajarkan kematian mendadak berhari-hari akibat air tersisa. Keputusan berdasar gejala, kebutuhan airway support, pemeriksaan, dan observasi terstruktur.',
          },
          d: {
            respons: 'Foto awal normal tidak menjamin tidak ada cedera paru dan foto abnormal tidak sendiri menentukan prognosis. Jangan menunggu pencitraan untuk memulai transfer pada pasien berisiko tinggi.',
          },
        },
      },
    },
    debrief: {
      poinKunci: [
        'Dengan nadi tetapi napas tidak efektif, beri assisted ventilation segera; jangan mencoba mengeluarkan air.',
        'Bila nadi hilang, CPR ideal mencakup napas dan kompresi; AED tidak menunda CPR.',
        'Keringkan dan hangatkan paralel setelah ventilasi berjalan; hindari spinal board rutin tanpa indikasi trauma.',
        'Rujuk karena pernah gagal napas dan membutuhkan BVM, bukan karena mitos secondary drowning.',
      ],
      realitaFktp: 'Sukamaju memberi ventilasi efektif, menyiapkan CPR dengan napas bila nadi hilang, mengeringkan dan menghangatkan paralel, lalu meneruskan pasien ke fasilitas yang mampu menangani cedera paru dan hipoksia. Advanced airway, NIV, blood gas, ventilator, dan ICU berada di jejaring.',
      sumberDaya: {
        ready: ['BVM-masker-reservoir dan oksigen', 'suction-airway adjunct-monitor-AED', 'GDS-termometer-selimut', 'ambulans'],
        melaluiJejaring: ['advanced airway dan NIV/ventilator', 'blood gas dan imaging', 'ICU dan rewarming lanjut'],
      },
      kontinuitas: 'Tinjau fungsi kognitif-neurologis, batuk-sesak, toleransi aktivitas, tidur/kecemasan, sinkop-kejang-aritmia, alkohol/zat, kesehatan mental, dan kesiapan kembali ke aktivitas air.',
      bridgeUkm: {
        judul: 'Dari Sungai ke Sistem Aman',
        ringkasan: 'Audit lokasi, cuaca/arus, penerangan, akses tebing, pelampung, alkohol, waktu ditemukan, rescue, napas bantuan, BVM-AED, serta response-to-departure; pilih intervensi hazard lokal bersama desa, BPBD/Basarnas, PSC, sekolah, dan komunitas.',
      },
    },
  },
}

export const IGD_ADJUDICATED_IDS = Object.keys(PATCHES).sort()

/** Terapkan keputusan dokter tanpa mengubah id pilihan atau efek skor. */
export function terapkanAdjudikasiIgd(kasus: readonly KasusIgd[]): KasusIgd[] {
  const ids = kasus.map((item) => item.id).sort()
  if (ids.join('|') !== IGD_ADJUDICATED_IDS.join('|')) {
    throw new Error(`Adjudikasi IGD tidak eksak: runtime=[${ids.join(', ')}], patch=[${IGD_ADJUDICATED_IDS.join(', ')}]`)
  }

  return kasus.map((item) => {
    const patch = PATCHES[item.id]!
    const { activationStatus: _prototype, ...tanpaFlagPrototipe } = item
    const stepById = new Map(item.langkah.map((step) => [step.id, step]))
    for (const [stepId, stepPatch] of Object.entries(patch.langkah ?? {})) {
      const step = stepById.get(stepId)
      if (!step) throw new Error(`Adjudikasi IGD merujuk langkah tak dikenal: ${item.id}/${stepId}`)
      const choiceIds = new Set(step.pilihan.map((choice) => choice.id))
      for (const choiceId of Object.keys(stepPatch.pilihan ?? {})) {
        if (!choiceIds.has(choiceId)) {
          throw new Error(`Adjudikasi IGD merujuk pilihan tak dikenal: ${item.id}/${stepId}/${choiceId}`)
        }
      }
    }
    const langkah = item.langkah.map((step) => {
      const stepPatch = patch.langkah?.[step.id]
      if (!stepPatch) return step
      return {
        ...step,
        ...(stepPatch.narasi ? { narasi: stepPatch.narasi } : {}),
        pilihan: step.pilihan.map((choice) => ({
          ...choice,
          ...(stepPatch.pilihan?.[choice.id] ?? {}),
        })),
      }
    })
    return {
      ...tanpaFlagPrototipe,
      ...patch.fields,
      langkah,
      reviewStatus: 'physician_approved',
      debrief: patch.debrief,
    }
  })
}
