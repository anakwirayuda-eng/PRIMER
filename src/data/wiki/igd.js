/**
 * @reflection
 * [IDENTITY]: igd wiki entries
 * [PURPOSE]: Static data module exporting: igdData — MAIA Codex wiki entries for 20 new IGD cases.
 * [STATE]: Stable
 * [ANCHOR]: igdData
 * [DEPENDS_ON]: None
 */

export const igdData = {
    // --- Respiratory ---
    igd_copd_exacerbation: {
        title: "PPOK Eksaserbasi Akut",
        category: "igd",
        icon: "Wind",
        concept: "Perburukan akut gejala PPOK: sesak memberat, sputum purulen, dan wheezing yang tidak respons terhadap terapi rumatan.",
        ikmContext: "PPOK adalah penyakit kronis terbanyak ke-3 di dunia. Eksaserbasi sering dipicu infeksi atau polusi udara — sangat relevan di daerah pertanian.",
        sknContext: "Nebulizer dan oksigen wajib tersedia di IGD Puskesmas. Steroid sistemik menurunkan angka relaps eksaserbasi.",
        funFact: "Pursed-lip breathing (menghembuskan napas lewat bibir yang dimonyongkan) bukan sekadar kebiasaan — ini auto-PEEP alami yang mencegah kolaps jalan napas!",
        gameTip: "Berikan nebulizer salbutamol + ipratropium, KEMUDIAN steroid IV. Jangan lupa antibiotik jika sputum purulen."
    },
    igd_foreign_body_aspiration: {
        title: "Aspirasi Benda Asing",
        category: "igd",
        icon: "AlertTriangle",
        concept: "Benda asing (makanan, mainan) masuk dan menyumbat jalan napas. Pada anak kecil paling sering kacang, biji, atau mainan kecil.",
        ikmContext: "Penyebab kematian ke-4 pada anak <5 tahun. Pencegahan melalui KIE orang tua tentang bahaya finger food bulat (anggur, sosis) pada balita.",
        sknContext: "Setiap tenaga kesehatan wajib bisa melakukan Heimlich maneuver / back blow. Manuver sederhana ini menyelamatkan nyawa.",
        funFact: "Heimlich maneuver ditemukan oleh Dr. Henry Heimlich tahun 1974. Beliau sendiri baru mempraktikkannya pada orang sungguhan di usia 96 tahun!",
        gameTip: "Jika pasien masih batuk kuat → dorong batuk. Jika silent choking (nggak bisa batuk/bicara) → Heimlich / back blow SEGERA."
    },

    // --- Cardiovascular ---
    igd_hypertensive_crisis: {
        title: "Krisis Hipertensi",
        category: "igd",
        icon: "Activity",
        concept: "Peningkatan TD mendadak >180/120 mmHg disertai kerusakan organ target (otak, mata, ginjal, jantung).",
        ikmContext: "Indonesia = negara dengan prevalensi hipertensi tertinggi di ASEAN (34%). Putus obat adalah penyebab krisis tersering.",
        sknContext: "Puskesmas wajib bisa memberikan anti-hipertensi IV. Target: turunkan MAP 25% dalam 1 jam pertama, JANGAN turunkan terlalu cepat.",
        funFact: "Tekanan darah 220/130, jika diturunkan terlalu cepat, bisa menyebabkan stroke iskemik — karena otak sudah terbiasa tekanan tinggi dan 'kelaparan' jika diturunkan mendadak.",
        gameTip: "Gunakan nicardipine drip, BUKAN nifedipine sublingual (terlalu agresif). Target MAP turun 25% perlahan."
    },
    igd_chf_acute: {
        title: "Gagal Jantung Akut (Edema Paru)",
        category: "igd",
        icon: "Heart",
        concept: "Jantung gagal memompa → cairan menumpuk di paru-paru → sesak napas berat mendadak (flash pulmonary edema).",
        ikmContext: "Pasien CHF yang putus obat (terutama diuretik dan ACEi) sering masuk IGD malam hari karena cairan redistribusi saat tidur.",
        sknContext: "Posisi duduk + oksigen + furosemide IV adalah trias awal yang wajib dikuasai semua nakes IGD.",
        funFact: "Batuk berbusa pink (pink frothy sputum) adalah tanda khas edema paru — busa berasal dari protein plasma yang bocor ke alveoli dan berbusa akibat gerakan napas.",
        gameTip: "Dudukkan pasien (JANGAN tiduran!), O2, Furosemide IV, ISDN sublingual. Morfin jika sangat agitated (menurunkan preload)."
    },

    // --- Metabolic ---
    igd_dka: {
        title: "Ketoasidosis Diabetik (KAD)",
        category: "igd",
        icon: "Droplet",
        concept: "Defisiensi insulin → tubuh membakar lemak → produksi keton → asidosis metabolik. GDS >300, pH <7.3, keton (+).",
        ikmContext: "KAD adalah penyebab mortalitas utama DM tipe 1. Sering terjadi saat putus insulin atau saat infeksi berat.",
        sknContext: "Kunci utama KAD: resusitasi cairan NaCl 0.9% agresif + drip insulin regular. JANGAN bolus insulin!",
        funFact: "Napas Kussmaul (cepat + dalam) dan bau aseton adalah mekanisme tubuh untuk 'membuang' asam keton lewat paru-paru — ini kompensasi respiratorik terhadap asidosis metabolik.",
        gameTip: "Resusitasi cairan DULU (1L NaCl/jam pertama), baru insulin drip 0.1 U/kg/jam. Monitor Kalium — bisa fatal jika hipokalemia!"
    },
    igd_hhs: {
        title: "Status Hiperglikemik Hiperosmolar (HHS)",
        category: "igd",
        icon: "Droplet",
        concept: "DM tipe 2 lansia: GDS >600, dehidrasi masif, gangguan kesadaran TANPA asidosis ketosis bermakna.",
        ikmContext: "Mortalitas HHS (20-30%) jauh lebih tinggi dari KAD (5%). Sering pada lansia DM tipe 2 yang asupan cairan kurang.",
        sknContext: "Defisit cairan bisa mencapai 6-12 liter. Rehidrasi perlahan dan hati-hati — penurunan osmolalitas terlalu cepat bisa menyebabkan edema serebri.",
        funFact: "Perbedaan HHS vs KAD: di HHS masih ada insulin SEDIKIT sehingga cukup untuk mencegah lipolisis (pembakaran lemak), tapi tidak cukup untuk memasukkan glukosa ke sel.",
        gameTip: "Rehidrasi SANGAT agresif (target 6-9L/24jam). Insulin dosis rendah. Awasi osmolalitas dan natrium serum."
    },

    // --- Allergy ---
    igd_angioedema: {
        title: "Angioedema Berat",
        category: "igd",
        icon: "AlertTriangle",
        concept: "Bengkak masif di jaringan dalam (bibir, kelopak mata, lidah, laring) akibat pelepasan bradikinin. Beda dengan urtikaria yang superfisial.",
        ikmContext: "ACE-inhibitor (Captopril, Ramipril) adalah penyebab angioedema tersering — bisa terjadi bahkan setelah bertahun-tahun minum obat!",
        sknContext: "Krusial: angioedema + stridor = ancaman jalan napas → perlakukan seperti anafilaksis. Tanpa stridor → steroid + antihistamin cukup.",
        funFact: "Angioedema herediter (HAE) sangat langka dan tidak merespons antihistamin / steroid — butuh icatibant atau C1-inhibitor concentrate.",
        gameTip: "Hentikan ACE-inhibitor! Steroid + antihistamin IV. Observasi 6 jam untuk stridor. Ganti anti-HT ke ARB (losartan)."
    },

    // --- Neurology ---
    igd_cva_stroke: {
        title: "Stroke / CVA",
        category: "igd",
        icon: "Brain",
        concept: "Gangguan aliran darah otak mendadak — iskemik (sumbatan) atau hemoragik (perdarahan). Golden period <4.5 jam untuk trombolisis.",
        ikmContext: "Stroke adalah penyebab kematian #1 di Indonesia dan penyebab kecacatan #1 global. FAST assessment menyelamatkan nyawa.",
        sknContext: "Puskesmas berperan krusial dalam pengenalan dini dan rujukan cepat. CT scan wajib sebelum terapi apapun (membedakan iskemik vs hemoragik).",
        funFact: "Setiap menit stroke tanpa penanganan, otak kehilangan 1.9 juta neuron. Maka muncul istilah: TIME IS BRAIN.",
        gameTip: "FAST: Face (cek senyum), Arms (angkat tangan), Speech (bicara), Time (catat onset). Jangan turunkan TD kecuali >220/120!"
    },
    igd_head_injury_moderate: {
        title: "Cedera Kepala Sedang (CKS)",
        category: "igd",
        icon: "AlertTriangle",
        concept: "Cedera otak traumatik dengan GCS 9-13. Risiko tinggi perdarahan intrakranial (epidural/subdural hematoma).",
        ikmContext: "KLL motor adalah penyebab CKS #1 di Indonesia. Pemakaian helm standar SNI menurunkan risiko CKB 69%.",
        sknContext: "Lucid interval: pasien tampak sadar normal lalu tiba-tiba koma → curiga epidural hematoma → SEGERA rujuk SpBS!",
        funFact: "Cushing triad (hipertensi + bradikardia + napas ireguler) adalah tanda akhir peningkatan TIK — jika sudah muncul, waktu sangat terbatas.",
        gameTip: "Immobilisasi C-spine, head-up 30°, monitor GCS tiap 15 menit. Jika pupil anisokor → HERNIASI → rujuk darurat!"
    },

    // --- Infection ---
    igd_severe_malaria: {
        title: "Malaria Berat",
        category: "igd",
        icon: "Bug",
        concept: "Malaria P. falciparum dengan komplikasi: serebral malaria, anemia berat, gagal ginjal, hipoglikemia, atau black water fever.",
        ikmContext: "Papua dan NTT masih merupakan daerah endemis tinggi malaria. Riwayat perjalanan ke daerah endemis = red flag.",
        sknContext: "Artesunate IV adalah gold standard malaria berat — lebih unggul dari kina. Namun ketersediaan di Puskesmas terbatas → rujuk jika tidak ada.",
        funFact: "Eritrosit yang terinfeksi P. falciparum menjadi 'lengket' dan menyumbat kapiler otak — inilah mekanisme malaria serebral (cerebral malaria).",
        gameTip: "Tanya SELALU: baru dari daerah endemis malaria? Demam periodik + splenomegali = curiga malaria. Cek RDT dan GDS!"
    },
    igd_sepsis: {
        title: "Sepsis",
        category: "igd",
        icon: "Flame",
        concept: "Respons imun berlebihan terhadap infeksi yang menyebabkan disfungsi organ. qSOFA: TD ≤100, RR ≥22, gangguan kesadaran.",
        ikmContext: "Sepsis membunuh 11 juta orang/tahun secara global. Deteksi dini di Puskesmas (primary care) menurunkan mortalitas drastis.",
        sknContext: "Hour-1 Bundle: ambil kultur, antibiotik IV, resusitasi cairan 30ml/kg, ukur laktat — semua dalam 1 JAM pertama!",
        funFact: "Skin mottling (kulit belang-belang keunguan) di lutut adalah tanda perfusi buruk yang mudah dikenali tanpa alat — makin luas mottling, makin buruk prognosis.",
        gameTip: "qSOFA ≥2 = curiga sepsis. Resusitasi NaCl 0.9% 30ml/kgBB segera. Antibiotik dalam 1 jam. Pasang kateter untuk monitor urin."
    },

    // --- Trauma ---
    igd_open_fracture: {
        title: "Fraktur Terbuka",
        category: "igd",
        icon: "Bone",
        concept: "Patah tulang dimana fragmen tulang menembus kulit → kontaminasi langsung. Klasifikasi Gustilo I-IIIC menentukan tatalaksana.",
        ikmContext: "KLL motor roda dua adalah penyebab fraktur terbuka tersering di Indonesia, terutama tibia (tulang kering).",
        sknContext: "Golden period debridement: 6 jam. Setelah itu risiko infeksi meningkat tajam.",
        funFact: "Jangan pernah mendorong tulang yang menonjol kembali ke dalam luka — kontaminasi justru masuk lebih dalam! Tutup dengan kasa NaCl basah steril.",
        gameTip: "Irigasi NaCl steril ≥1 liter, bidai as-is (jangan reposisi), ATS, antibiotik profilaksis, analgesik. Rujuk SpOT <6 jam."
    },
    igd_organophosphate_poisoning: {
        title: "Keracunan Organofosfat (Pestisida)",
        category: "igd",
        icon: "Skull",
        concept: "Organofosfat menghambat asetilkolinesterase → akumulasi asetilkolin → stimulasi kolinergik berlebih. Mnemonik: SLUDGE / DUMBELS.",
        ikmContext: "Indonesia: kasus keracunan pestisida sering terjadi di daerah pertanian (pajanan kerja) dan sebagai sarana percobaan bunuh diri.",
        sknContext: "Atropin = antidot utama. Titrasi sampai 'atropinisasi': kulit kering, pupil melebar, nadi >80. Bisa butuh puluhan ampul!",
        funFact: "Pupil miosis pinpoint pada keracunan OP begitu kecilnya sehingga sulit membedakan dengan pupil opioid — bedanya: OP berkeringat sangat banyak, opioid kulit kering.",
        gameTip: "ABCD dulu! Suction jalan napas, Atropin IV sampai atropinisasi, Pralidoxime (2-PAM). Bilas lambung jika <1 jam."
    },

    // --- Digestive ---
    igd_hematemesis: {
        title: "Hematemesis Melena",
        category: "igd",
        icon: "Droplet",
        concept: "Perdarahan saluran cerna atas: muntah darah (hematemesis) dan BAB hitam lengket (melena). Sumber: ulkus, varises, Mallory-Weiss.",
        ikmContext: "NSAID (piroxicam, ibuprofen) yang dijual bebas di warung adalah penyebab gastritis erosif dan ulkus lambung tersering di masyarakat.",
        sknContext: "Resusitasi cairan agresif + NGT untuk evaluasi perdarahan + crossmatch darah. Endoskopi urgent jika tersedia.",
        funFact: "500ml darah di lambung cukup untuk mengubah seluruh feses menjadi hitam (melena). Warna hitam berasal dari hemoglobin yang dicerna asam lambung → hematin.",
        gameTip: "2 IV line besar (18G), NaCl resusitasi, crossmatch PRC, tranexamic acid IV, omeprazole IV. Rujuk SpPD Gastro untuk endoskopi."
    },

    // --- Other/Obstetric/Psychiatric ---
    igd_eclampsia: {
        title: "Eklampsia",
        category: "igd",
        icon: "Baby",
        concept: "Kejang pada ibu hamil/nifas dengan pre-eklampsia (TD >140/90 + proteinuria). Berbahaya bagi ibu dan janin.",
        ikmContext: "Eklampsia adalah penyebab kematian ibu #2 di Indonesia setelah perdarahan. ANC yang adekuat bisa mendeteksi pre-eklampsia dini.",
        sknContext: "MgSO4 adalah satu-satunya anti-kejang yang BOLEH untuk eklampsia. Diazepam DILARANG — tidak mencegah kejang berulang dan mendepresi napas bayi.",
        funFact: "MgSO4 bekerja ganda: anti-kejang DAN vasodilator serebral. Antidotnya: Kalsium Glukonas IV — wajib sedia di samping pasien saat pemberian MgSO4.",
        gameTip: "MgSO4 loading 4g IV pelan + 5g IM bokong kanan/kiri. Monitor: refleks patella, RR >16x, urin >30ml/jam."
    },
    igd_suicide_attempt: {
        title: "Percobaan Bunuh Diri (Deliberate Self-Harm)",
        category: "igd",
        icon: "Heart",
        concept: "Tindakan menyakiti diri sendiri dengan intensi mengakhiri hidup. Asesmen risiko bunuh diri wajib setelah stabilisasi fisik.",
        ikmContext: "WHO: bunuh diri adalah penyebab kematian #4 usia 15-29 tahun secara global. Di Indonesia, kasus sering underreported karena stigma.",
        sknContext: "Prinsip: stabilisasi fisik DULU, lalu asesmen psikiatri. Jangan tinggalkan pasien sendirian. Singkirkan benda berbahaya dari ruangan.",
        funFact: "Luka sayatan transversal (melintang) di pergelangan umumnya superfisial (hesitation marks). Luka longitudinal (memanjang) mengancam nyawa karena mengenai arteri radialis.",
        gameTip: "Atasi luka fisik, safety assessment (singkirkan benda tajam), empati tanpa judgement, konsul SpKJ."
    },

    // --- Pediatrics ---
    igd_bronchiolitis: {
        title: "Bronkiolitis Berat",
        category: "igd",
        icon: "Baby",
        concept: "Infeksi saluran napas bawah pada bayi <2 tahun, paling sering oleh RSV. Menyebabkan obstruksi bronkiolus oleh mukus dan edema.",
        ikmContext: "Bronkiolitis adalah penyebab rawat inap #1 pada bayi (terutama usia 2-6 bulan). Belum ada vaksin RSV yang tersedia luas di Indonesia.",
        sknContext: "Terapi utama: oksigen + hidrasi. Bronkodilator dan steroid TIDAK terbukti efektif untuk bronkiolitis (berbeda dengan asma).",
        funFact: "Banyak dokter salah memberikan nebulizer salbutamol untuk bronkiolitis — padahal spasme bukan mekanisme utamanya. Yang tersumbat adalah mukus kental di bronkiolus kecil!",
        gameTip: "Oksigen jika SpO2 <93%, cairan IV/NGT jika nggak bisa menyusu, monitoring ketat. JANGAN beri antibiotik kecuali ada infeksi sekunder."
    },
    igd_intussusception: {
        title: "Intususepsi",
        category: "igd",
        icon: "AlertTriangle",
        concept: "Bagian usus masuk ('tersedot') ke dalam usus di sebelahnya — seperti teleskop. Paling sering ileocecal junction pada bayi 6-18 bulan.",
        ikmContext: "Trias klasik: nyeri kolik hilang-timbul + BAB darah lendir (red currant jelly stool) + massa abdomen sosis-shaped.",
        sknContext: "Golden period reduksi non-operatif: <24 jam. Setelahnya risiko iskemia usus dan perforasi meningkat drastis.",
        funFact: "Dance's sign: kuadran kanan bawah terasa 'kosong' saat palpasi karena sekum sudah tersedot ke atas bersama intususeptum.",
        gameTip: "Kolik + BAB darah lendir pada bayi = curiga intususepsi! Pasang NGT, IV line, rujuk SpBA untuk USG + reduksi barium/udara."
    },
    igd_dka_child: {
        title: "KAD pada Anak (DM Tipe 1)",
        category: "igd",
        icon: "Droplet",
        concept: "KAD pada anak sering merupakan manifestasi pertama DM tipe 1 (onset baru). Lebih berisiko edema serebri dibanding dewasa.",
        ikmContext: "Di Indonesia banyak anak DM tipe 1 didiagnosis terlambat karena dikira sakit biasa — polidipsi dan poliuri diabaikan.",
        sknContext: "Koreksi cairan pada anak harus lebih pelan dari dewasa (48 jam) karena risiko edema serebri fatal. Gunakan rumus defisit + maintenance.",
        funFact: "DM tipe 1 pada anak bisa muncul pertama kali sebagai 'ketoasidosis' tanpa riwayat DM sama sekali — inilah mengapa GDS wajib dicek pada setiap anak dengan napas Kussmaul!",
        gameTip: "Resusitasi NaCl 10-20ml/kg pelan, insulin 0.05-0.1 U/kg/jam. Monitor GDS tiap jam. GCS turun → curiga edema serebri → mannitol!"
    },
    igd_neonatal_asphyxia: {
        title: "Asfiksia Neonatus",
        category: "igd",
        icon: "Baby",
        concept: "Gagal napas pada bayi baru lahir ditandai APGAR rendah, sianosis, hipotonia. Golden minute: 60 detik pertama krusial.",
        ikmContext: "Asfiksia neonatus menyumbang 23% kematian neonatal global. Pelatihan resusitasi neonatus sederhana (HBB) menurunkan mortalitas 47%.",
        sknContext: "Langkah awal: hangatkan, keringkan, posisikan, bersihkan jalan napas, stimulasi. Jika tidak napas spontan → ventilasi tekanan positif.",
        funFact: "Warna kulit biru saat lahir belum tentu asfiksia — hampir semua bayi lahir biru (akrosianosis) dan berwarna merah muda dalam 90 detik pertama.",
        gameTip: "Keringkan + hangatkan + stimulasi (60 detik pertama). Jika nggak napas → BVM 40-60x/menit. Jika mekonium → suction dahulu!"
    }
};
