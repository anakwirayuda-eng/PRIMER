# M11 #4 Tingkat A — Hasil Konten Varian Presentasi (2026-07-16)

> Dihasilkan workflow `m11-varian-tingkat-a`: 1 agen penulis per kasus ->
> 2 lensa verifikasi adversarial (stabilitas diagnosis-disposisi + koherensi
> internal) -> 1 ronde perbaikan utk yang dibantah -> varian yang masih
> dibantah DIBUANG (tercatat di bawah). Diterapkan ke game via
> `src/content/varianTingkatAData.ts` (lapisan terpisah, kasus dasar tak
> disentuh). Kunci jawaban secara STRUKTURAL tak tersentuh (tipe varian tak
> punya field diagnosis/disposisi/tatalaksana).
>
> Ringkasan: 39 kasus lolos penuh, 1 sebagian,
> 1 gagal, dari 41 target; total varian terpasang: 79.

## ispa_common_cold - status: lolos

- **hidung_mampet_bersin** - vital td=120/80, nadi=78, suhu=37.4, spo2=98; keluhanUtama; jawaban: q_keluhan, q_durasi; temuan: tht_mulut
  - keluhanUtama: "Hidung saya mampet dok, bersin-bersin terus sudah empat hari."
  - jawab `q_keluhan`: "Hidung saya mampet dok, bersin-bersin terus. Ingusnya tetap keluar, bening encer kayak air."
  - jawab `q_durasi`: "Sudah empat hari ini dok, belum enakan juga."
  - temuan `tht_mulut`: "Mukosa hidung edema dengan konka edema bilateral, sekret serosa jernih (+). Faring hiperemis ringan, tonsil T1/T1 tenang."
  - rasional: Sekret tetap serosa jernih, demam tetap subfebris, tanpa sesak/mengi — diagnosis J00 dan tatalaksana simtomatik tanpa antibiotik di FKTP tidak bergeser. Anti-hafalan: keluhan dominan berubah dari "meler" ke "mampet + bersin", durasi 4 hari (bukan 3), dan seluruh angka vital berbeda dari versi dasar.
- **meriang_kluster_kantor** - vital td=118/76, nadi=92, rr=20, suhu=37.9; keluhanUtama; jawaban: q_keluhan, q_durasi, q_demam, q_kontak
  - keluhanUtama: "Badan saya meriang dok, hidungnya juga meler sejak kemarin sore."
  - jawab `q_keluhan`: "Badan saya meriang nggak enak dok, terus hidung saya meler, ingusnya bening encer."
  - jawab `q_durasi`: "Baru dari kemarin sore dok."
  - jawab `q_demam`: "Semalam saya ukur 37.8 dok, meriang tapi nggak sampai menggigil."
  - jawab `q_kontak`: "Di rumah nggak ada dok, tapi di kantor lagi banyak yang pilek, teman semeja saya juga."
  - rasional: Demam tetap di bawah 38 tanpa tanda bahaya napas maupun sekret purulen, jadi tetap common cold viral swasirna yang tuntas simtomatik di FKTP. Anti-hafalan: pembuka bergeser ke meriang dengan onset baru sehari, sumber penularan kluster kantor (bukan anak di rumah), dan profil vital berbeda.

## faringitis_akut - status: lolos

- **demam_menggigil_dua_hari** - vital td=110/70, nadi=104, rr=20, suhu=39.1; keluhanUtama; jawaban: q_keluhan, q_demam, q_kgb; temuan: umum, tht_mulut, kepala_leher
  - keluhanUtama: "Dua hari ini badan saya demam terus dok, tenggorokan juga nyeri sekali tiap menelan."
  - jawab `q_keluhan`: "Yang paling berat tenggorokannya dok, nelan ludah saja nyeri banget. Badan juga panas terus dua hari ini."
  - jawab `q_demam`: "Iya dok, dua hari ini demam tinggi terus, semalam sampai menggigil kedinginan."
  - jawab `q_kgb`: "Iya dok, dari bawah rahang sampai leher dua sisi terasa bengkak, senut-senut kalau tersentuh."
  - temuan `umum`: "Compos mentis, tampak sakit sedang, menggigil ringan, kulit teraba panas."
  - temuan `tht_mulut`: "Faring hiperemis (+), tonsil T2/T2 hiperemis dengan lapisan eksudat putih kekuningan pada kedua tonsil. Tidak ada batuk."
  - temuan `kepala_leher`: "KGB submandibula dan servikal anterior teraba membesar bilateral, nyeri tekan (+)."
  - rasional: Kriteria Centor tetap lengkap (suhu 39.1, eksudat tonsil bilateral simetris T2/T2, KGB servikal nyeri, tanpa batuk) tanpa satu pun tanda abses peritonsil atau distres napas, sehingga diagnosis faringitis streptokokus dan disposisi rawat-FKTP tidak bergeser; nadi 104 wajar untuk demam 39-an. Nilai anti-hafalan: kurva demam (2 hari, menggigil, 39.1 vs 38.4 mendadak semalam), nadi, dan deskripsi eksudat/KGB semuanya berbeda dari dasar.
- **tiga_hari_gagal_obat_warung** - vital td=120/80, nadi=96, rr=18, suhu=38.8; keluhanUtama; jawaban: q_keluhan, q_demam, q_amandel, q_kontak, q_kgb; temuan: tht_mulut, kepala_leher
  - keluhanUtama: "Sudah tiga hari tenggorokan saya nyeri sekali buat menelan dok, obat dari warung tidak mempan."
  - jawab `q_keluhan`: "Nyeri tenggorokannya dok, tiap menelan rasanya panas kayak kebakar. Sudah tiga hari sampai malas makan."
  - jawab `q_demam`: "Ada dok, demamnya barengan sama sakit tenggorokan tiga hari lalu. Sempat turun sebentar habis minum obat dari warung, tapi naik lagi terus."
  - jawab `q_amandel`: "Baru kali ini yang separah ini dok, biasanya paling serak sehari dua hari sembuh sendiri."
  - jawab `q_kontak`: "Di rumah nggak ada dok, tapi teman yang sering main bareng saya minggu lalu juga radang tenggorokan."
  - jawab `q_kgb`: "Ada dok, leher depan dua sisi ada benjolan kecil, nyeri kalau kepencet."
  - temuan `tht_mulut`: "Faring hiperemis (+), tonsil T2/T2 hiperemis dengan bintik-bintik eksudat putih di permukaan kedua tonsil. Tidak ada batuk."
  - temuan `kepala_leher`: "KGB servikal anterior bilateral teraba membesar sekitar 1 cm, kenyal, mobile, nyeri tekan (+)."
  - rasional: Durasi 3 hari dengan demam naik-turun pasca obat warung tetap faringitis akut streptokokus ber-Centor penuh (suhu 38.8, eksudat tonsil, KGB nyeri, tanpa batuk) dan tetap konsisten dengan leukositosis netrofilik pada lab; tidak ada red flag rujukan sehingga tatalaksana FKTP tak berubah. Anti-hafalan: durasi dan riwayat pengobatan sendiri, sumber kontak (teman, bukan adik serumah), riwayat amandel (episode berat pertama, bukan 2-3x/tahun), serta angka vital semuanya berbeda dari dasar.

## diare_akut_anak - status: lolos

- **muntah_dulu_habis_kondangan** - vital nadi=118, rr=26, suhu=38.2; keluhanUtama; jawaban: q_keluhan, q_muntah, q_makan, q_keluarga
  - keluhanUtama: "Anak saya semalam muntah-muntah dok, sekarang gantian mencret cair terus, sudah tujuh kali sejak subuh."
  - jawab `q_keluhan`: "Semalam dia muntah-muntah dulu dok, terus dari subuh gantian mencret cair terus, sudah tujuh kali sampai sekarang."
  - jawab `q_muntah`: "Semalam muntahnya sampai empat kali dok, tapi dari subuh sudah nggak muntah lagi, cuma badannya anget."
  - jawab `q_makan`: "Kemarin sore kami kondangan dok, dia makan macam-macam di sana, es buah sama sate-satean."
  - jawab `q_keluarga`: "Bapaknya yang ikut kondangan dari tadi pagi juga mules dan sempat mencret sekali dok."
  - rasional: Urutan gejala khas GE virus/keracunan makanan — muntah semalam yang sudah berhenti sendiri lalu diare cair sejak subuh pasca-kondangan, demam 38.2 — sementara semua jangkar Rencana Terapi B tetap utuh (rewel responsif, mata cekung, haus/minum lahap, turgor agak lambat, feses cair tanpa darah sesuai lab) dan muntah yang berhenti menjaga rehidrasi oral tetap layak, jadi diagnosis GE akut dehidrasi ringan-sedang rawat-FKTP dengan oralit+zinc tanpa antibiotik tidak bergeser. Nilai anti-hafalan: urutan gejala, onset, frekuensi BAB, pemicu, kontak keluarga, dan angka nadi/suhu semuanya berbeda dari presentasi dasar.
- **tanpa_muntah_sejak_kemarin_sore** - vital td=95/65, nadi=120, rr=22, suhu=37.4; keluhanUtama; jawaban: q_keluhan, q_muntah, q_makan, q_keluarga; temuan: umum, abdomen
  - keluhanUtama: "Anak saya mencret terus dari kemarin sore dok, sudah delapan kali, rewel minta minum melulu."
  - jawab `q_keluhan`: "Dia mencret cair terus dari kemarin sore dok, sampai tadi sudah delapan kali, rewelnya minta minum melulu."
  - jawab `q_muntah`: "Nggak muntah sama sekali dok. Semalam badannya sempat anget, tadi pagi sudah turun sendiri."
  - jawab `q_makan`: "Kemarin siang dia minum es cendol beli di pasar dok, sorenya mulai mencret."
  - jawab `q_keluarga`: "Nggak ada dok, di rumah cuma dia sendiri yang mencret."
  - temuan `umum`: "Anak gelisah dan rewel, sadar penuh, mata tampak cekung, air mata masih keluar saat menangis. Kesan dehidrasi ringan-sedang."
  - temuan `abdomen`: "Bising usus meningkat, perut supel, tidak ada nyeri tekan bermakna maupun distensi."
  - rasional: Varian diare-dominan berdurasi lebih panjang: tanpa muntah, onset kemarin sore dengan pemicu es cendol pasar, riwayat keluarga negatif, dan demam sudah reda (37.4) — namun anak tetap rewel-sadar, mata cekung, haus (q_minum dasar), turgor agak lambat, akral hangat CRT <2 detik, dan feses cair tanpa darah, sehingga klasifikasi tetap dehidrasi ringan-sedang (Rencana Terapi B) dengan tatalaksana oralit+zinc tanpa antibiotik di FKTP. Nilai anti-hafalan: durasi, ada-tidaknya muntah dan demam, frekuensi, pemicu, riwayat keluarga, serta keempat angka vital berbeda dari dasar tanpa menyeberangi ambang keputusan mana pun.

## hipertensi_esensial - status: sebagian

- **nyeri_kepala_sore_seminggu** - vital td=168/102, nadi=88, rr=18, suhu=36.8; keluhanUtama; jawaban: ht_ku, ht_onset, ht_penyerta; temuan: umum
  - keluhanUtama: "Kepala saya sering nyut-nyutan dan leher terasa kaku kalau sore, Dok, sudah seminggu ini."
  - jawab `ht_ku`: "Kepala saya nyut-nyutan, Dok, lehernya ikut kaku. Biasanya muncul sore hari sehabis pulang kerja."
  - jawab `ht_onset`: "Sudah hampir seminggu, Dok, hilang-timbul; paling berat sore hari setelah seharian kerja."
  - jawab `ht_penyerta`: "Tidak ada, Dok. Mata masih jelas, tidak mual, dada juga tidak nyeri."
  - temuan `umum`: "Composmentis, tampak sedikit lelah. IMT 26,4 kg/m² (berat badan lebih), lingkar pinggang berlebih."
  - rasional: TD 168/102 masih di pita derajat 2 dengan margin aman dari krisis, red flag tetap negatif, dan penyerta justru lebih bersih, jadi diagnosis, disposisi FKTP, dan kunci terapi kombinasi tetap identik. Pola beda yang berarti — durasi seminggu (bukan tiga hari), memberat sore pasca-kerja (bukan pagi), angka TD/nadi/IMT berbeda — memutus hafalan angka dan pola waktu kasus dasar.
- DIBUANG (gagal verifikasi 2x): mimisan_berulang_ringan
  - `mimisan_berulang_ringan`: Angka vital aman (166/100 tetap derajat 2 non-krisis), tetapi presentasi mimisan BERULANG (3-4x dalam 5 hari), UNILATERAL, pada pasien 45-65 tahun yang PEROKOK (ht_rokok tidak diubah) membuka fork disposisi yang sah: (1) PPK FKTP entri Epistaksis mencantumkan epistaksis berulang / curiga sumber posterior-tumor sebagai kriteria rujuk THT meski episode anterior terkontrol; (2) unilateral+berulang+usia+rokok adalah konstelasi red-flag karsinoma nasofaring yang diajarkan eksplisit di FK Indonesia (KNF endemik) — framing 'unilateral' yang dimaksud benign justru menambah fitur peringatan; (3) temuan 'mukosa hidung tenang' antar-episode tidak melokalisasi sumber perdarahan — rinoskopi anterior Puskesmas tidak menyingkirkan sumber posterior/nasofaring, dan justru perdarahan berulang TANPA sumber teridentifikasi adalah alasan endoskopi THT; (4) varian sendiri ingin mengoreksi mitos 'darah tinggi bikin mimisan' — konsekuensinya, setelah HT dicoret sebagai penyebab, diferensial yang terbuka (lokal/neoplastik/koagulopati) menuntut evaluasi lanjutan di luar slice kasus, kontradiksi internal dengan kontrak disposisi-tetap-FKTP. Dokter FKTP kompeten bisa sampai pada disposisi rujuk-THT (atau setidaknya diagnosis kerja ganda R04.0 yang butuh workup), jadi kontrak 'diagnosis/disposisi tidak berubah' tidak kokoh. Per aturan ragu -> tidak lolos. Saran perbaikan bila ingin dipertahankan: turunkan jadi episode TUNGGAL ringan yang sudah berhenti (bukan berulang), hilangkan kata unilateral, atau ganti keluhan pemimpin ke gejala non-perdarahan.

## dm_tipe2 - status: lolos

- **polifagia_lemas_dominan** - vital td=128/82, nadi=88, gds=279; keluhanUtama; jawaban: dm_ku
  - keluhanUtama: "Saya gampang sekali lapar dan makan terus, Dok, tapi badan malah tambah lemas; malam juga sering bolak-balik kencing."
  - jawab `dm_ku`: "Saya cepat sekali lapar, Dok, makan sudah banyak tapi badan tetap saja lemas. Malam hari bolak-balik kencing dan rasanya haus terus."
  - rasional: Trias klasik tetap lengkap — hanya penonjolannya dibalik ke polifagia-lemas — dan GDS 279 / TD 128/82 tetap di koridor DM tipe 2 stabil non-katabolik (GDS jelas ≥200 tanpa mendekati ambang dekompensasi, TD tetap non-hipertensi), sehingga diagnosis E11.9, disposisi FKTP, dan OAD kombinasi tidak bergeser. Nilai anti-hafalannya: pemain tidak bisa mengandalkan pola 'kencing malam + GDS 258' dan dipaksa menilai ulang kriteria diagnosis dari gejala yang tergali.
- **gatal_selangkangan_kesemutan** - vital td=122/78, nadi=80, gds=235; keluhanUtama; jawaban: dm_ku, dm_luka, dm_kesemutan; temuan: kulit
  - keluhanUtama: "Selangkangan saya gatal tidak sembuh-sembuh, Dok, ujung jari kaki sering kesemutan, dan malam jadi bolak-balik kencing."
  - jawab `dm_ku`: "Yang paling mengganggu gatal di selangkangan, Dok, sudah hampir sebulan hilang timbul. Ujung jari kaki juga sering kesemutan, dan malam saya bolak-balik kencing, gampang haus, badan lemas."
  - jawab `dm_luka`: "Luka tidak ada, Dok. Cuma gatal di selangkangan dan lipatan kulit itu yang hampir sebulan hilang timbul, apalagi kalau berkeringat."
  - jawab `dm_kesemutan`: "Iya, Dok, hampir tiap malam ujung jari kaki kesemutan dan sedikit kebas, tapi hilang sendiri."
  - temuan `kulit`: "Turgor kulit normal; tampak bekas garukan ringan di lipatan inguinal tanpa lesi jamur aktif yang luas, tidak ada akantosis mencolok."
  - rasional: Pintu masuk keluhan digeser ke manifestasi kulit-neuropati yang memang sudah ada di kasus dasar (gatal lipatan, kesemutan, monofilamen menurun), dengan gejala osmotik tetap terucap saat anamnesis; GDS 235 masih jelas ≥200, tanpa ulkus, ketonuria, ataupun tanda dehidrasi, sehingga diagnosis, rawat-FKTP, dan metformin+glimepirid tidak berubah. Anti-hafalannya: wajah kasus di antrian sama sekali berbeda dari trias klasik yang biasa dihafal, memaksa pemain menggali ulang anamnesis.

## gastritis - status: lolos

- **begah_pasca_makan** - vital td=118/76, nadi=88, suhu=36.8; keluhanUtama; jawaban: gas_ku, gas_onset, gas_agravasi, gas_gayahidup; temuan: abdomen
  - keluhanUtama: "Ulu hati saya begah dan mual, Dok, makin terasa habis makan, apalagi kalau pedas atau bersantan."
  - jawab `gas_ku`: "Rasanya penuh dan begah di ulu hati, Dok, kadang perih juga; mualnya paling muncul setelah makan pedas atau bersantan."
  - jawab `gas_onset`: "Sudah hampir sebulan hilang timbul, Dok, makin sering kambuh kalau kerjaan lagi menumpuk."
  - jawab `gas_agravasi`: "Memberat setelah makan pedas, bersantan, atau habis ngopi, Dok; kalau makan pelan-pelan porsi kecil rasanya lebih enak."
  - jawab `gas_gayahidup`: "Makan saya tidak teratur, suka yang pedas dan bersantan, kopi paling dua gelas sehari, dan lagi banyak pikiran soal kerjaan."
  - temuan `abdomen`: "Nyeri tekan epigastrium ringan (+), perut atas tampak sedikit kembung, timpani, tidak ada defans muskular, bising usus normal, hepar/lien tidak teraba."
  - rasional: Pola bergeser dari perih-lapar ke begah/penuh pasca-makan — tetap dispepsia tanpa tanda alarm (gas_alarm negatif, BB stabil, tidak anemis, vital normal) sehingga diagnosis K29.7 dan terapi PPI empiris di FKTP tidak bergeser. Anti-hafalan: pemicu, durasi (sebulan vs dua minggu), jumlah kopi, dan semua angka vital berubah sehingga pemain harus membaca ulang data, bukan mengenali angka.
- **perih_pagi_lembur** - vital td=110/74, nadi=76, rr=16, suhu=36.5; keluhanUtama; jawaban: gas_ku, gas_onset, gas_agravasi, gas_obat, gas_keluarga, gas_gayahidup; temuan: abdomen
  - keluhanUtama: "Ulu hati saya perih dan mual kalau pagi-pagi belum sempat sarapan, Dok."
  - jawab `gas_ku`: "Perih panas di ulu hati, Dok, paling terasa pagi hari waktu perut masih kosong, kadang sampai mual."
  - jawab `gas_onset`: "Baru sepuluh hari ini, Dok, hampir tiap pagi kumat; minggu ini pas lagi banyak lembur."
  - jawab `gas_agravasi`: "Paling perih kalau perut kosong, Dok, apalagi kalau cuma minum kopi tanpa makan; setelah diisi nasi agak reda."
  - jawab `gas_obat`: "Kalau pusing atau badan pegal habis lembur, saya biasa beli obat nyeri di warung, Dok, kadang ditambah jamu."
  - jawab `gas_keluarga`: "Bapak saya dulu juga sering sakit maag, Dok."
  - jawab `gas_gayahidup`: "Sebulan ini sering lembur malam, Dok, sarapan sering kelewat, kopi bisa empat gelas biar kuat, pikiran juga lagi tegang."
  - temuan `abdomen`: "Nyeri tekan epigastrium (+) tanpa nyeri lepas, defans muskular (-), bising usus normal, tidak teraba massa maupun pembesaran hepar/lien."
  - rasional: Pola perih saat lambung kosong sama persis dengan dasar (tanpa fitur alarm baru, tanpa nyeri nokturnal), hanya konteks dan angkanya diganti — dokter kompeten tetap sampai di dispepsia tanpa alarm, kelola FKTP dengan PPI. Anti-hafalan: durasi (10 hari), waktu kambuh (pagi pra-sarapan), sumber NSAID (obat warung), riwayat keluarga (bapak), jumlah kopi, dan seluruh vital berbeda dari kasus dasar.

## bronkitis_akut - status: lolos

- **batuk_malam_sepuluh_hari** - vital td=124/78, nadi=78, rr=18, suhu=36.8, spo2=99; keluhanUtama; jawaban: q_keluhan, q_durasi, q_demam; temuan: tht_mulut
  - keluhanUtama: "Dok, batuk saya sudah sepuluh hari nggak sembuh-sembuh, malam hari paling parah sampai susah tidur."
  - jawab `q_keluhan`: "Awalnya kering dok, sekarang berdahak putih. Malam hari paling sering kumat, sampai kebangun-bangun tidur."
  - jawab `q_durasi`: "Sudah sepuluh hari dok. Awalnya ketularan pilek orang serumah — pilek saya sudah sembuh, tapi batuknya nyisa terus."
  - jawab `q_demam`: "Nggak sampai demam dok. Cuma badan agak nggak enak dua hari pertama, habis itu sudah biasa lagi."
  - temuan `tht_mulut`: "Faring tenang, sisa hiperemis minimal, tonsil T1/T1."
  - rasional: Batuk 10 hari pasca-pilek (ketularan orang serumah), kini afebris 36.8, tanpa sesak/hemoptisis/penurunan BB, paru dan leukosit tetap normal — masih jauh di bawah ambang red flag 3 minggu maupun ambang skrining TB 2 minggu, jadi tetap bronkitis akut viral self-limiting yang tuntas di FKTP tanpa antibiotik. Nilai anti-hafalan: durasi (10 vs 6 hari), pemicu (ketularan serumah vs pilek sendiri), pola batuk malam, dan set vital afebris memutus hafalan angka dasar (37.4/88/20).
- **batuk_pagi_sumeng_sore** - vital td=118/76, nadi=94, suhu=37.6, spo2=97; keluhanUtama; jawaban: q_keluhan, q_durasi, q_demam
  - keluhanUtama: "Batuk terus dok lima hari ini, paling berat pagi habis bangun tidur, sampai otot dada rasanya ketarik."
  - jawab `q_keluhan`: "Awalnya kering dok, dua hari terakhir mulai keluar dahak putih. Paling berat pagi habis bangun tidur, siang agak mendingan."
  - jawab `q_durasi`: "Baru lima hari dok. Minggu lalu saya kehujanan naik motor, habis itu pilek — pileknya sudah reda, eh batuknya malah tambah sering."
  - jawab `q_demam`: "Masih suka sumeng kalau sore dok, tapi nggak tinggi. Pagi ini badan cuma anget sedikit."
  - rasional: Batuk 5 hari pasca-pilek (setelah kehujanan), dominan pagi, sumeng 37.6 yang tetap subfebris dengan margin aman di bawah 38 dan jauh dari "demam tinggi menetap", sementara paru, leukosit normal, dan semua jawaban red-flag (dahak putih tanpa darah, tak sesak, BB stabil) tak berubah — dokter kompeten tetap tiba di bronkitis akut viral, simtomatik di FKTP tanpa antibiotik. Nilai anti-hafalan: pola demam yang belum reda (vs sudah hilang di dasar), pola diurnal pagi, cerita pemicu berbeda, dan angka vital baru (nadi 94, SpO2 97) memaksa penalaran ulang alih-alih klik-otomatis.

## rinitis_alergi - status: lolos

- **mampet_dominan_malam** - vital td=124/80, nadi=84, rr=18, suhu=36.8, spo2=98; keluhanUtama; jawaban: q_keluhan, q_pencetus; temuan: tht_mulut
  - keluhanUtama: "Hidung saya mampet banget tiap malam dok, sampai susah tidur, bersin-bersin juga dan ingusnya bening terus."
  - jawab `q_keluhan`: "Mampetnya pindah-pindah kiri kanan dok, paling berat malam pas berbaring sampai harus napas lewat mulut. Bersinnya juga sering beruntun, ingusnya bening encer, hidungnya gatal."
  - jawab `q_pencetus`: "Paling berat malam sampai pas bangun tidur dok, apalagi kalau kucing habis tidur di kasur atau saya habis bersihin karpet kamar."
  - temuan `tht_mulut`: "Mukosa hidung livide (pucat kebiruan) dan edema, konka inferior hipertrofi bilateral menonjol, sekret serosa jernih (+), tidak ada sekret purulen."
  - rasional: Fenotipe sumbatan-dominan yang memberat malam akibat tungau kasur/karpet dan kucing tetap rinitis alergi khas (trias bersin-gatal-rinorea jernih dipertahankan, afebris, tanpa sekret purulen/nyeri sinus) sehingga diagnosis, rawat-FKTP, dan kunci antihistamin gen-2 tak bergeser — steroid intranasal memang sudah berstatus opsional. Nilai anti-hafalan: memutus pola "rinitis alergi = bersin tiap pagi + TD 118/76".
- **serangan_bersin_debu_gudang** - vital td=112/72, nadi=88, rr=20, suhu=36.5, spo2=99; keluhanUtama; jawaban: q_keluhan, q_pencetus, q_riwayat; temuan: tht_mulut
  - keluhanUtama: "Bersin saya kumat parah dok sejak kemarin beres-beres gudang belakang rumah, ingusnya bening ngocor terus."
  - jawab `q_keluhan`: "Sekali kumat bisa bersin belasan kali beruntun dok, ingusnya encer bening kayak air, hidung sama langit-langit mulut ikut gatal."
  - jawab `q_pencetus`: "Tiap kena debu langsung kumat dok. Kemarin bongkar-bongkar gudang belakang rumah yang penuh debu langsung parah, tapi memang sudah bertahun-tahun begini hilang-timbul."
  - jawab `q_riwayat`: "Asma nggak pernah dok, tapi dari kecil saya sering biduran, apalagi kalau udara dingin."
  - temuan `tht_mulut`: "Mukosa hidung pucat dan edema, sekret serosa jernih banyak sampai membasahi vestibulum, konka inferior edema bilateral."
  - rasional: Serangan episodik pasca-paparan debu gudang dengan atopi berupa biduran (bukan eksim + sesak-debu) tetap memenuhi trias bersin serial + rinorea jernih + gatal tanpa demam dan tanpa tanda asma aktif, jadi diagnosis J30.4 dan tatalaksana FKTP identik. Konteks pemicu episodik (bukan pola pagi), riwayat atopi berbeda, dan angka vital berbeda mencegah pemain menghafal satu presentasi tunggal.

## gerd - status: lolos

- **regurgitasi_malam_terbangun** - vital td=112/72, nadi=74; keluhanUtama; jawaban: q_keluhan, q_pencetus; temuan: tht_mulut
  - keluhanUtama: "Hampir tiap malam saya kebangun dok, ada cairan asam dari perut naik ke tenggorokan sampai terbatuk-batuk, mulut asam pahit tiap bangun pagi."
  - jawab `q_keluhan`: "Dari ulu hati naik ke belakang dada sampai pangkal tenggorokan dok. Panasnya nggak terlalu hebat, tapi cairan asam pahitnya itu yang sering naik sampai mulut, apalagi pas tidur malam."
  - jawab `q_pencetus`: "Paling parah malam hari pas berbaring dok, apalagi kalau makan malamnya telat terus langsung tidur. Siang hari kalau jalan jauh atau kerja berat malah nggak kumat."
  - temuan `tht_mulut`: "Faring posterior hiperemis granular ringan (iritasi asam kronik), tanpa eksudat; tampak erosi ringan email gigi posterior."
  - rasional: Fenotipe regurgitasi nokturnal dominan dari GERD yang sama: tetap tanpa gejala alarm, pola tetap memberat saat berbaring dan bukan saat aktivitas, vital normal, sehingga diagnosis K21.9 dan penanganan FKTP (PPI empiris + gaya hidup) tidak bergeser. Nilai anti-hafalannya: skrip 'heartburn habis makan' diganti wajah 'terbangun malam karena asam naik + batuk' dengan angka vital yang jelas berbeda. (Varian ini lolos verifikasi tanpa bantahan — dipertahankan apa adanya.)
- **kambuh_kopi_lembur** - vital td=130/84, nadi=90; keluhanUtama; jawaban: q_keluhan, q_pencetus, q_gaya, q_obat
  - keluhanUtama: "Sudah lama dok dada saya suka panas perih dari ulu hati naik ke tenggorokan, tapi belakangan makin sering kumat tiap habis lembur — banyak ngopi terus makan larut malam."
  - jawab `q_keluhan`: "Panasnya mulai dari ulu hati naik ke tengah dada sampai tenggorokan dok, mulut ikut asam. Keluhannya sih sudah bertahun-tahun hilang-timbul, cuma belakangan makin sering. Diminumin obat maag kunyah dari warung adem sebentar, habis itu balik lagi."
  - jawab `q_pencetus`: "Memberatnya habis makan besar larut malam dan kalau kebanyakan kopi dok, ditambah langsung rebahan makin naik. Kalau naik tangga atau angkat galon nggak ngaruh."
  - jawab `q_gaya`: "Parah sih dok, kalau lembur kopi bisa empat-lima gelas sehari, rokok masih jalan, makan malam jam sebelas terus langsung tidur, cemilannya gorengan."
  - jawab `q_obat`: "Obat pereda nyeri nggak rutin dok, paling sesekali beli di warung kalau badan pegal habis lembur. Yang lebih sering malah obat maag kunyah buat dada panasnya."
  - rasional: REVISI atas bantahan verifikator: durasi eksplisit 'Tiga bulan ini' dibuang. Keluhan sekarang dibingkai LAMA & kumat-kumatan (hilang-timbul bertahun-tahun, hanya belakangan makin sering) — bukan refluks onset baru. Ini mematikan trigger indikasi endoskopi 'usia >45-50 onset baru' yang diajarkan clue kasus ini, sehingga untuk subset roll usia tua (46-55, demografi 25-55 diroll uniform di director.ts) pun disposisi FKTP tetap identik dan harusDirujuk: false tetap benar; keluhanUtama yang berubah tetap disertai override jawaban pembuka q_keluhan yang juga bebas-durasi. Elemen lain yang sudah dinilai kokoh dipertahankan: tetap tanpa alarm; tetap non-eksersional (naik tangga/angkat galon tak berpengaruh, koheren EKG sinus normal); respons parsial antasida warung bukan 'gagal terapi empirik' PPK karena bukan PPI test dokter; TD 130/84 & nadi 90 masih di bawah ambang hipertensi/takikardia; kebiasaan makan larut + obat pegal warung dipertahankan agar koheren dengan konsekuensi. Anti-hafalan lewat narasi pemicu (lembur/kopi berlebih) dan vital yang jelas berbeda, pada diagnosis K21.9 serta disposisi FKTP yang identik.

## dispepsia_fungsional - status: lolos

- **begah_cepat_kenyang** - vital td=124/80, nadi=84, rr=18, suhu=36.8, spo2=98; keluhanUtama; jawaban: q_keluhan, q_durasi; temuan: abdomen
  - keluhanUtama: "Perut atas saya penuh dan begah tiap habis makan dok, baru beberapa suap sudah kenyang, sudah hampir tiga bulan hilang timbul."
  - jawab `q_keluhan`: "Begah dan penuh banget dok terutama habis makan, baru beberapa suap sudah kenyang, sering sendawa dan kadang mual. Perihnya cuma sesekali, nggak seberapa."
  - jawab `q_durasi`: "Sudah hampir tiga bulan dok, hilang timbul, paling terasa kalau makan nggak teratur dan pas kerjaan lagi numpuk-numpuknya."
  - temuan `abdomen`: "Epigastrium tampak sedikit kembung, nyeri tekan epigastrium minimal, tidak ada massa, bising usus normal, tidak ada defans/nyeri lepas."
  - rasional: Presentasi subtipe postprandial distress (begah, cepat kenyang, nyeri minimal) selama ~3 bulan tanpa satu pun tanda alarm, vital dan abdomen tetap jinak — dokter FKTP tetap tiba di dispepsia fungsional K30 dengan terapi empiris tanpa rujukan/endoskopi. Nilai anti-hafalan: cluster gejala dominan, durasi, dan seluruh angka vital berbeda jelas dari kasus dasar.
- **perih_perut_kosong** - vital td=108/68, nadi=70, rr=16, suhu=36.4, spo2=99; keluhanUtama; jawaban: q_keluhan, q_durasi, q_kopi; temuan: abdomen
  - keluhanUtama: "Ulu hati saya perih sekali kalau telat makan dok, apalagi habis ngopi pagi belum sarapan, sudah sekitar enam minggu kumat-kumatan."
  - jawab `q_keluhan`: "Perih di ulu hati dok, paling terasa pas perut kosong atau habis ngopi pagi-pagi, kalau sudah makan agak mendingan tapi nanti kumat lagi. Kadang mual, begahnya cuma sesekali."
  - jawab `q_durasi`: "Kurang lebih enam minggu dok, kumat-kumatan, paling parah kalau perut kosong kelamaan atau lagi banyak pikiran."
  - jawab `q_kopi`: "Kopi bisa dua-tiga gelas sehari dok, sering pagi-pagi sebelum sarapan, pedas juga suka, rokok sesekali kalau stres."
  - temuan `abdomen`: "Nyeri tekan ringan terlokalisir di epigastrium, tidak menjalar ke punggung, tidak ada massa, bising usus normal, tidak ada defans/nyeri lepas."
  - rasional: Presentasi subtipe nyeri epigastrium tipe lapar (perih saat perut kosong, pemicu kopi sebelum sarapan, mereda sebagian setelah makan) tetap tanpa alarm dengan Hb dan pemeriksaan normal — diagnosis dan disposisi tidak bergeser: dispepsia fungsional rawat FKTP dengan PPI empiris. Nilai anti-hafalan: pola pemicu (lapar/kopi vs stres-begah), durasi 6 minggu, dan set vital yang berbeda memutus pattern-matching angka.

## kulit_dermatitis_kontak - status: gagal_semua

- DIBUANG (gagal verifikasi 2x): detergen_bubuk_dua_minggu, jam_tangan_logam_pergelangan
  - `detergen_bubuk_dua_minggu`: Kunci jawaban terkunci struktural ke L23.9, sedangkan L24.9 (dermatitis kontak IRITAN) adalah differential yang DI-SKOR di diagnosisBanding — distraktor yang salah bila dipilih. Varian ini menggeser presentasi ke kutub iritan relatif terhadap kasus dasar TANPA menetralkan confounder wet-work: q_kerja (IRT yang tiap hari nyuci piring + baju) dan q_batas ('cuma di tangan yang kena air cucian') TIDAK di-override, sehingga lesi tetap terpaku ke distribusi wet-work. Di atas itu varian MENAMBAH fitur pro-iritan: deterjen BUBUK (alkali/enzim, lebih iritan daripada sabun cair), durasi diperpanjang 5 hari menjadi hampir 2 minggu (paparan kumulatif), dan perluasan ke SELA JARI (khas retensi lembap wet-work), pada lesi bilateral difus yang hanya 'berbatas relatif tegas'. Satu-satunya nudge alergen adalah 'pewangi kuat', yang tidak mendominasi gambaran wet-work bilateral. Seorang dokter FKTP kompeten dapat bernalar benar ke L24.9 (DKI/eksim wet-work tangan pada IRT) — yaitu distraktor yang di-skor salah — sehingga varian melemahkan anchor yang membuat L23.9 tegak. Fitur diferensiasi sejati DKA (demarkasi tajam ke zona kontak spesifik / penyebaran di luar area kontak langsung) TIDAK hadir kuat; justru ciri DKI (difus, batas kabur-relatif, distribusi wet-work) yang menonjol. Karena ragu klinis nyata antara kunci L23.9 dan distraktor L24.9, verdict = TIDAK lolos.
  - `jam_tangan_logam_pergelangan`: Gagal cek (b): kontradiksi dengan konsekuensi dasar yang tidak (dan tidak bisa) di-override. kondisiKembali dasar: 'Pasien kembali dengan kulit tangan menebal, pecah-pecah, dan sebagian bernanah karena tetap mencuci tanpa pelindung' — padahal varian secara eksplisit menegasikan mencuci sebagai kausa (q_batas override: 'Telapak sama punggung tangan yang tiap hari kena air cucian malah nggak kenapa-kenapa'; q_pencetus override: 'Sabun cuci nggak saya ganti, cuma jam ini yang baru'; temuan kulit: 'Dorsum dan palmar manus bilateral tenang'). Narasi gagal-terapi akan menyalahkan mencuci dan menaruh lesi di 'kulit tangan', bertentangan dengan premis varian (alergen = jam logam, lesi pita terbatas pergelangan kiri, tangan sehat). Sekunder: clue dasar memberi contoh mitigasi 'mis. sarung tangan saat mencuci' yang tidak relevan untuk alergen jam logam. Sisanya (key jawabanBerubah/temuanBerubah/vital valid, pembuka ikut di-override, jawaban tetap menjawab pertanyaan asli, id unik) bersih, tetapi kontradiksi konsekuensi cukup untuk tidak lolos.

## kulit_tinea_korporis - status: lolos

- **pemicu_keringat_olahraga** - vital td=124/80, nadi=74, rr=16, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_meluas, q_lembap, q_obat
  - keluhanUtama: "Di perut saya ada bulatan gatal kayak cincin dok, pinggirnya merah dan makin melebar."
  - jawab `q_keluhan`: "Bulat kayak cincin dok di perut sampai ke pinggang, gatal sekali. Pinggirnya merah kasar bersisik, tengahnya malah kelihatan agak bersih."
  - jawab `q_meluas`: "Iya dok, dua minggu lalu masih sebesar uang koin, sekarang sudah selebar bola pingpong, melebarnya dari pinggirnya."
  - jawab `q_lembap`: "Saya rutin olahraga lari tiap sore dok, habis itu jarang langsung mandi, kaos basah keringat kepakai sampai malam."
  - jawab `q_obat`: "Dikasih tetangga krim buat gatal dok, katanya manjur. Awalnya memang adem, tapi lama-lama bercaknya tambah lebar dan pinggirnya jadi samar."
  - rasional: Morfologi anular tepi-aktif dengan central clearing di koridor abdomen-lumbal, riwayat krim steroid yang membuat lesi melebar-kabur (tinea inkognito), dan vital normal-afebris semua dipertahankan, jadi diagnosis tinea korporis terbatas dan tatalaksana antijamur topikal di FKTP tidak bergeser. Nilai anti-hafalan: pemicu lembap berganti dari kerja panas-panasan ke kebiasaan olahraga, kronologi jadi eksplisit dua minggu (koin menjadi selebar bola pingpong, tetap cocok dengan diameter fisik kurang lebih 4 cm), sumber krim berganti warung menjadi tetangga, dan keempat angka vital bergeser dalam koridor normal.
- **kontak_kucing_pitak** - vital td=112/72, nadi=86, rr=20, suhu=37.1; keluhanUtama; jawaban: q_keluhan, q_meluas, q_kontak, q_obat
  - keluhanUtama: "Pinggang kanan saya ada bercak bundar yang gatal banget dok, terus melebar pelan-pelan."
  - jawab `q_keluhan`: "Di pinggang sebelah kanan dok, bentuknya bundar kayak gelang: pinggirnya merah bersisik dan paling gatal apalagi kalau keringatan, tengahnya agak mulus kayak mau sembuh."
  - jawab `q_meluas`: "Melebar dok, pelan tapi pasti sejak sekitar sebulan lalu. Yang merah dan gatal itu pinggirnya, jalarnya ke arah luar."
  - jawab `q_kontak`: "Di rumah belum ada yang ketularan dok. Tapi kucing kampung peliharaan saya bulunya lagi rontok pitak-pitak, hampir tiap hari saya pangku."
  - jawab `q_obat`: "Saya olesi krim sisa obat eksim yang ada di rumah dok. Gatalnya sempat kalem, tapi bercaknya malah melebar dan batas pinggirnya jadi kabur."
  - rasional: Lesi tetap plak anular khas di regio lumbal dengan riwayat steroid topikal (krim eksim) yang menghasilkan gambaran tinea inkognito dan vital tetap normal-afebris (37,1 masih jauh dari febris), sehingga dokter FKTP kompeten tetap tiba di tinea korporis terbatas yang tuntas dengan antijamur topikal tanpa rujukan. Anti-hafalan: sisi lesi ditegaskan kanan, perjalanan lebih lambat (sekitar sebulan), sumber penularan bergeser ke kucing peliharaan pitak dengan keluarga belum tertular (tetap koheren dengan konsekuensi 'anaknya kini juga terkena' sebagai progresi lewat handuk bersama), plus set angka vital yang berbeda.

## saraf_tension_headache - status: lolos

- **pemicu_postur_layar** - vital td=118/76, nadi=84, rr=18, suhu=36.7, spo2=98; keluhanUtama; jawaban: q_keluhan, q_durasi, q_stres, q_obat, q_kopi; temuan: kepala_leher
  - keluhanUtama: "Kepala saya kenceng terus dok, kayak ditekan dari dua sisi sampai ke tengkuk."
  - jawab `q_keluhan`: "Rasanya kayak ditekan kenceng dari kedua sisi kepala dok, berat sampai ke tengkuk. Tumpul gitu, bukan nyut-nyutan."
  - jawab `q_durasi`: "Kambuh-kambuhan dok, seminggu bisa dua-tiga kali. Biasanya mulai siang menjelang sore, pas saya sudah lama banget duduk di depan komputer."
  - jawab `q_stres`: "Tekanan kerjaan ada lah dok, lagi padat. Saya seharian nunduk di depan laptop jarang gerak, tidurnya juga sering kemalaman, jam dua belas lebih baru tidur."
  - jawab `q_obat`: "Belum minum obat apa-apa dok, biasanya cuma saya balur minyak angin sama minta dipijit. Enakan sebentar, terus balik lagi."
  - jawab `q_kopi`: "Jarang dok, paling segelas pagi-pagi biar melek."
  - temuan `kepala_leher`: "Nyeri tekan otot perikranial (+) terutama regio temporal bilateral; otot leher dan trapezius teraba tegang, palpasi mencetuskan keluhan."
  - rasional: Kualitas nyeri tetap menekan bilateral tanpa red flag, negatif migrain dan neurologis normal tidak disentuh, frekuensi 2-3x/minggu tetap di pita TTH episodik sehingga diagnosis, disposisi FKTP, dan analgetik tunggal + edukasi tidak bergeser. Nilai anti-hafalan: pemicu diganti dari deadline+begadang menjadi postur statis kerja layar, pola waktu bergeser ke siang hari dengan penjalaran tengkuk, vital dan distribusi nyeri tekan berbeda.
- **stresor_jaga_keluarga_sakit** - vital td=124/82, nadi=72, rr=16, suhu=36.5, spo2=99; jawaban: q_durasi, q_stres, q_obat; temuan: kepala_leher
  - jawab `q_durasi`: "Sudah dua-tiga bulan ini dok, hilang-timbul. Seminggu paling sekali-dua kali, tapi sekali kumat bisa setengah hari sampai seharian baru reda."
  - jawab `q_stres`: "Iya dok, kerjaan lagi ramai-ramainya, terus malamnya saya gantian jaga orang tua yang sakit di rumah. Tidur jadi kepotong-potong, nggak pernah nyenyak."
  - jawab `q_obat`: "Baru sekali-dua kali minum obat sakit kepala bungkusan dari warung dok, lumayan enakan tapi habis itu kumat lagi."
  - temuan `kepala_leher`: "Nyeri tekan otot perikranial (+) terutama regio frontotemporal kedua sisi; otot leher dan bahu teraba tegang."
  - rasional: Keluhan antrian dan pembuka tetap 'diikat melingkar' khas TTH, semua negatif (mual, fotofobia, red flag) serta neurologis normal dipertahankan, dan frekuensi 1-2x/minggu tetap jauh di bawah ambang kronik >=15 hari/bulan sehingga tetap TTH episodik rawat-FKTP dengan analgetik tunggal. Nilai anti-hafalan: stresor berubah menjadi merawat keluarga sakit dengan tidur terfragmentasi, pola serangan episodik berdurasi setengah-seharian menggantikan pola 'tiap sore pulang kerja', plus angka vital dan lokasi nyeri tekan yang berbeda.

## mata_konjungtivitis_alergi - status: lolos

- **kumat_pagi_debu_kasur** - vital td=110/70, nadi=84, rr=16, suhu=36.8, spo2=98; keluhanUtama; jawaban: q_keluhan, q_pemicu, q_atopi
  - keluhanUtama: "Dua mata saya gatal banget dan merah dok, berair terus, paling parah pas baru bangun tidur, sudah seminggu hilang-timbul."
  - jawab `q_keluhan`: "Gatalnya dok yang paling nggak tahan, dua mata merah dan berair, bawaannya pengin ngucek terus. Paling parah pas baru bangun tidur."
  - jawab `q_pemicu`: "Kayaknya dari kasur kapuk sama karpet kamar yang berdebu dok, tiap habis tiduran di situ atau beres-beres kamar langsung kumat."
  - jawab `q_atopi`: "Iya dok, tiap pagi bersin-bersin dan meler kalau kena debu, dari kecil juga gampang biduran. Bapak saya sama, pilek alergi."
  - rasional: Semua jangkar diagnosis tetap utuh — gatal bilateral dominan, sekret serosa bening, visus normal, latar atopi — sehingga dokter tetap tiba di konjungtivitis alergi rawat-FKTP dengan antihistamin + air mata buatan; yang digeser hanya cerita pencetus (debu kasur/karpet, puncak saat bangun tidur), durasi seminggu, dan angka vital dalam koridor normal. Nilai anti-hafalan: pola waktu kumat, sumber alergen rumah, riwayat keluarga, dan vital tidak lagi cocok dengan hafalan presentasi dasar.
- **pencetus_kucing_peliharaan** - vital td=122/78, nadi=68, rr=17, suhu=36.4, spo2=100; keluhanUtama; jawaban: q_keluhan, q_pemicu, q_atopi
  - keluhanUtama: "Mata kanan-kiri saya merah, gatal banget, dan berair terus dok, dua minggu ini kumat-kumatan sejak ada kucing baru di rumah."
  - jawab `q_keluhan`: "Yang paling mengganggu gatalnya dok, dua mata merah dan berair terus, rasanya pengin dikucek melulu. Kumatnya dua minggu ini sejak ada kucing di rumah."
  - jawab `q_pemicu`: "Paling jelas kucing dok, sejak adik saya bawa kucing peliharaan ke rumah, tiap habis main atau gendong kucingnya langsung gatal berat. Nyapu lantai berdebu juga bikin kumat."
  - jawab `q_atopi`: "Saya ada asma ringan dari kecil dok tapi jarang kumat, dan kalau pagi sering bersin-bersin pilek. Keluarga saya memang gampang alergi."
  - rasional: Diagnosis dan disposisi tidak bergeser: gatal bilateral, sekret encer bening, visus normal, dan atopi dipertahankan, tanpa tanda berat baru (asma ringan inaktif hanya memperkuat latar atopi, vital tetap normal semua). Nilai anti-hafalan: konteks pemicu (kucing peliharaan baru di rumah, bukan bersih-bersih + kucing tetangga), durasi dua minggu, dan set angka vital berbeda nyata dari presentasi dasar.

## tht_serumen_prop - status: lolos

- **buntu_bertahap_dua_minggu** - vital td=104/68, nadi=82, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_pemicu
  - keluhanUtama: "Pendengaran telinga kanan saya makin lama makin berkurang dok, sudah dua minggu rasanya penuh terus."
  - jawab `q_keluhan`: "Telinga kanan terasa penuh dok, pendengarannya makin menurun pelan-pelan, sudah kira-kira dua minggu, makin lama makin buntu."
  - jawab `q_pemicu`: "Nggak habis berenang atau kemasukan air dok. Buntunya nambah pelan-pelan sendiri sejak dua minggu ini, nggak ada pemicu yang jelas."
  - rasional: Onset diubah dari buntu akut pasca kena air menjadi penurunan pendengaran bertahap dua minggu tanpa pemicu air (koheren dengan kebiasaan cotton bud yang mendorong serumen makin dalam); otoskopi tetap serumen obturans total tanpa nyeri hebat/sekret/demam, sehingga diagnosis, ekstraksi + karbogliserin, dan rawat-FKTP tidak bergeser. Memutus hafalan pola 'buntu habis kena air, beberapa hari' beserta fingerprint angka vital dasar.
- **buntu_mendadak_pasca_berenang** - vital td=100/64, nadi=88, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_pemicu, q_denging
  - keluhanUtama: "Telinga kanan saya mendadak buntu total habis berenang kemarin dok, suara jadi redup semua."
  - jawab `q_keluhan`: "Telinga kanan mendadak buntu total sejak kemarin dok, suara orang jadi redup, tapi suara saya sendiri malah kedengaran bergema di kepala."
  - jawab `q_pemicu`: "Iya dok, persis setelah berenang di kolam kemarin. Begitu keluar dari air langsung buntu total, kayak disumpal."
  - jawab `q_denging`: "Nggak berdenging dok, nggak pusing berputar juga. Cuma rasanya buntu aja."
  - rasional: Konteks pemicu diganti berenang di kolam dengan buntu total mendadak sehari plus autofoni, dan tinitus dibalik jadi negatif — tetap tanpa nyeri hebat, sekret, demam, dan liang tidak edema, jadi tetap serumen prop kelola-FKTP dan bukan otitis eksterna perenang. Menguji pengenalan pola otoskopik alih-alih hafalan 'habis keramas + kadang berdenging'.

## mm_gout_artritis_akut - status: lolos

- **podagra_kiri_makanan_laut** - vital td=128/82, nadi=96, suhu=37.3; keluhanUtama; jawaban: q_keluhan, q_onset, q_pemicu; temuan: ekstremitas
  - keluhanUtama: "Jempol kaki kiri saya mendadak bengkak merah dan nyeri hebat dok, sejak menjelang subuh tadi."
  - jawab `q_keluhan`: "Pangkal jempol kaki kiri dok, bengkak, merah mengkilap, nyerinya berdenyut panas — kena kaus kaki saja rasanya bukan main."
  - jawab `q_onset`: "Mendadak dok. Menjelang subuh saya terbangun karena nyerinya, dalam dua-tiga jam saja sudah bengkak besar dan sakitnya di puncak."
  - jawab `q_pemicu`: "Semalam ada syukuran di rumah saudara dok, saya makan udang, kerang, sama cumi banyak sekali."
  - temuan `ekstremitas`: "Sendi MTP-1 kiri: edema, eritema mengkilap, teraba hangat, sangat nyeri tekan (podagra). Pasien menghindari menapak dengan kaki kiri; ROM terbatas karena nyeri."
  - rasional: Tetap monoartritis MTP-1 klasik dengan pemicu santapan tinggi purin, suhu subfebris, dan riwayat ginjal bersih — diagnosis gout akut, disposisi rawat-FKTP, dan jalur kolkisin (NSAID tetap terblokir alergi) tidak bergeser. Nilai anti-hafalan: sisi sendi (kiri), jenis pemicu (makanan laut saat syukuran), jam onset (menjelang subuh), dan angka vital semuanya berbeda dari kasus dasar.
- **afebris_pemicu_jeroan** - vital td=124/78, nadi=84, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_pemicu, q_riwayat, q_demam; temuan: umum
  - keluhanUtama: "Dok, jempol kaki kanan saya semalam mendadak bengkak dan nyeri cenut-cenut, sampai sandal jepit saja tidak bisa dipakai."
  - jawab `q_keluhan`: "Di pangkal jempol kaki kanan dok, bengkak, merah, rasanya panas berdenyut — dipakai sandal tidak muat, disentuh sedikit saja nyerinya luar biasa."
  - jawab `q_pemicu`: "Kemarin siang saya makan soto jeroan sapi sama emping banyak dok, habis itu seharian angkat-angkat panen di sawah panas-panasan, minumnya cuma sedikit."
  - jawab `q_riwayat`: "Sudah dua kali dok. Terakhir kira-kira enam bulan lalu, di jempol kanan yang ini juga, waktu itu reda sendiri hampir seminggu."
  - jawab `q_demam`: "Tidak demam dok, badan biasa saja. Sendi lain juga tidak ada yang sakit, cuma jempol kanan ini."
  - temuan `umum`: "Compos mentis, tampak kesakitan, berjalan pincang menumpu pada tumit kanan menghindari tekanan pada jempol kaki. Habitus overweight."
  - rasional: Gout akut memang sering afebris — menghapus demam subfebris tidak menggeser diagnosis (podagra monoartikular klasik dengan asam urat 9.2) maupun disposisi FKTP, dan tatalaksana akut tetap kolkisin tanpa memulai allopurinol. Nilai anti-hafalan: pola demam (afebris), pemicu (jeroan + emping + kurang minum saat kerja berat), frekuensi riwayat serangan (dua kali, terakhir enam bulan lalu), gaya jalan antalgik, dan angka vital berbeda jelas dari kasus dasar.

## mm_dislipidemia - status: lolos

- **skrining_posbindu_desa** - vital td=132/86, nadi=88; keluhanUtama; jawaban: q_keluhan, q_aktivitas, q_dm; temuan: umum
  - keluhanUtama: "Dok, kemarin saya ikut skrining Posbindu di balai desa, kata kadernya kolesterol saya tinggi, disuruh periksa ke sini."
  - jawab `q_keluhan`: "Tidak ada keluhan apa-apa dok. Kemarin ikut skrining Posbindu di balai desa, kata kadernya kolesterol saya tinggi, jadi disuruh lanjut periksa ke Puskesmas."
  - jawab `q_aktivitas`: "Saya jaga warung kelontong di rumah dok, seharian duduk di belakang etalase, hampir tidak pernah olahraga."
  - jawab `q_dm`: "Kencing manis belum pernah diperiksa dok. Tensi waktu di Posbindu katanya juga agak tinggi."
  - temuan `umum`: "Habitus obesitas sentral, lingkar perut melebihi normal. IMT 31."
  - rasional: Rute penemuan digeser dari MCU kantor ke skrining Posbindu PTM dengan pekerjaan sedenter berbeda (penjaga warung), sementara TD/nadi/IMT memakai angka jelas berbeda namun tetap di koridor aman: TD 132/86 tetap di pita normal-tinggi 130-139/85-89 (seperti basis 138/88), tetap obesitas sentral, dan seluruh faktor risiko KV (perokok, ayah infark dini, sedenter) serta riwayat intoleransi statin utuh — diagnosis E78.5, kunci terapi, dan rawat-FKTP tidak bergeser. Nilai anti-hafalannya: penanda hafalan "MCU kantor + 138/88 + IMT 29" tidak berlaku lagi sehingga mahasiswa harus menilai ulang profil risiko dari data.
- **cek_mandiri_teman_serangan_jantung** - vital td=135/88, nadi=92; keluhanUtama; jawaban: q_keluhan, q_makan; temuan: umum
  - keluhanUtama: "Dok, minggu lalu teman kantor saya kena serangan jantung, saya jadi ikut cek lab, ternyata kolesterol saya tinggi."
  - jawab `q_keluhan`: "Tidak ada keluhan dok. Tapi minggu lalu teman sekantor saya kena serangan jantung, saya jadi kepikiran bapak saya dulu — langsung saya cek lab sendiri, ternyata kolesterol saya tinggi."
  - jawab `q_makan`: "Hampir tiap hari dok, sarapan gorengan dekat kantor, makan siang sering bersantan, jeroan juga doyan."
  - temuan `umum`: "Habitus obesitas sentral, lingkar perut 104 cm. IMT 30."
  - rasional: Pemicu pemeriksaan diganti dari MCU rutin menjadi cek lab mandiri karena takut setelah teman sekantor kena serangan jantung (menggemakan riwayat ayah lewat 'kepikiran bapak saya', tanpa mengubah q_keluarga), pola makan diceritakan ulang dengan isi klinis sama, dan angka permukaan diperbarui. Perbaikan atas bantahan verifikator: TD dinaikkan dari 128/84 (yang jatuh ke pita normal) menjadi 135/88 yang tetap di pita normal-tinggi 130-139/85-89 — sama seperti basis 138/88 dan varian 1 132/86 — sehingga tiga teks tak-dioverride tetap berdasar: clue 'Nilai risiko KV total ... + TD tinggi', q_dm 'tekanan darah katanya suka agak tinggi', dan konsekuensi.kondisiKembali 'TD makin tinggi'. Angka ini tetap di bawah ambang hipertensi ≥140/90 sehingga disposisi tak berubah: tetap dislipidemia campuran asimtomatik risiko tinggi yang ditangani di FKTP dengan kunci terapi identik (simvastatin/statin + gaya hidup, atau alternatif non-statin sesuai alergiTrap). Nilai anti-hafalannya: konteks pemicu dan seluruh angka permukaan berubah tanpa menyeberangi satu pun ambang keputusan klinis maupun mementahkan konten tak-dioverride.

## mm_osteoartritis_lutut - status: lolos

- **kaku_singkat_berdiri_lama** - vital td=134/82, nadi=88; keluhanUtama; jawaban: q_keluhan, q_kaku; temuan: umum
  - keluhanUtama: "Dua lutut saya nyeri dok kalau kelamaan berdiri atau naik-turun tangga, yang kanan paling berat."
  - jawab `q_keluhan`: "Dua-duanya dok, lutut kanan paling berat. Paling terasa kalau kelamaan berdiri di dapur, bolak-balik naik-turun tangga jemuran, sama waktu bangkit dari jongkok. Kalau duduk istirahat ya mendingan."
  - jawab `q_kaku`: "Kaku cuma sebentar sekali dok, paling lima menit, digerak-gerakkan sedikit sudah lemas lagi."
  - temuan `umum`: "Obesitas (IMT 32). Cara jalan antalgik, menumpu lebih ke tungkai kiri menghindari pembebanan lutut kanan."
  - rasional: Pola tetap nyeri mekanik saat menumpu beban yang mereda dengan istirahat, kaku pagi 5 menit (jauh di bawah ambang 30 menit), tanpa tanda inflamasi — diagnosis OA lutut, tatalaksana parasetamol + latihan + turun BB, dan rawat-FKTP tidak bergeser. Nilai anti-hafalan: durasi kaku, konteks pemicu aktivitas, angka TD/nadi, dan IMT semuanya berbeda dari presentasi dasar.
- **kronik_sulit_jongkok** - vital td=148/88, nadi=70, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_kaku, q_bengkak; temuan: umum
  - keluhanUtama: "Hampir setahun ini lutut saya nyeri dok, sekarang susah sekali dipakai jongkok atau duduk bersila."
  - jawab `q_keluhan`: "Dua lutut dok, kanan paling parah. Kumatnya kalau jalan agak jauh, turun tangga, apalagi jongkok di kamar mandi atau duduk bersila di lantai — bangkitnya susah. Kalau istirahat nyerinya berkurang."
  - jawab `q_kaku`: "Kaku dok tiap bangun pagi, kira-kira dua puluh menitan, habis itu longgar sendiri kalau dibawa gerak."
  - jawab `q_bengkak`: "Kalau habis capek banyak jalan, lutut kanan kadang terasa agak penuh dok, tapi tidak pernah merah atau panas mendadak."
  - temuan `umum`: "Obesitas (IMT 31). Bangkit dari kursi periksa perlahan sambil menahan lutut kanan; jalan antalgik ringan."
  - rasional: Kaku pagi 20 menit masih jelas di bawah ambang inflamasi 30 menit dan keluhan tetap mekanik-degeneratif kronik tanpa pemicu rujukan (bukan kandidat operasi, belum ada terapi farmakologis yang gagal, efusi tetap minimal tanpa merah/panas) — diagnosis dan disposisi FKTP identik dengan dasar. Nilai anti-hafalan: durasi kaku di ujung lain koridor aman, kronisitas hampir setahun, pemicu jongkok/duduk bersila, dan angka vital yang berbeda.

## mm_low_back_pain - status: lolos

- **nyeri_setelah_lembur_kardus** - vital td=118/76, nadi=84, rr=16, suhu=36.7; keluhanUtama; jawaban: q_keluhan; temuan: ekstremitas, umum
  - keluhanUtama: "Punggung bawah saya kaku dan nyeri dok, sudah tiga hari, sejak lembur angkat-angkat kardus di gudang."
  - jawab `q_keluhan`: "Tiga hari lalu dok, pas lembur bongkar muatan saya angkat kardus terus-terusan. Sejak itu pinggang bawah kaku dan nyeri, paling berat kalau bangun dari duduk atau mau membungkuk."
  - temuan `ekstremitas`: "Spasme dan nyeri tekan otot paravertebral lumbal bilateral; ROM lumbal terbatas nyeri saat fleksi dan saat bangkit dari duduk. Straight Leg Raise negatif bilateral."
  - temuan `umum`: "Compos mentis, tidak demam, bangkit dari kursi perlahan sambil menumpu tangan ke paha, berjalan agak kaku menjaga pinggang."
  - rasional: Pemicu (lembur angkat kardus), durasi 3 hari, agravasi, vital, dan temuan diparafrase namun semua penapis red flag tetap negatif (SLR negatif, neurologis-BAK utuh, afebris, tanpa penjalaran) sehingga tetap LBP mekanik akut M54.5 rawat-FKTP konservatif. Nilai anti-hafalan: memutus hafalan pola dasar 'galon air kemarin + 124/78' dengan konteks okupasional dan set angka vital yang sama sekali berbeda tapi sama-sama normal.
- **pegal_kanan_setelah_geser_lemari** - vital td=128/82, nadi=72, rr=18, suhu=36.4; keluhanUtama; jawaban: q_keluhan, q_menjalar; temuan: ekstremitas
  - keluhanUtama: "Pinggang kanan saya pegal dan nyeri dok, hampir seminggu, sejak menggeser lemari waktu beres-beres rumah."
  - jawab `q_keluhan`: "Hampir seminggu lalu dok, waktu beres-beres rumah saya angkat dan geser-geser lemari sendirian. Sejak itu pinggang bawah sebelah kanan pegal dan nyeri, tambah berat kalau berdiri lama atau membungkuk, enakan kalau rebahan."
  - jawab `q_menjalar`: "Tidak dok, sakitnya ngumpul di pinggang kanan saja, tidak turun ke bokong apalagi sampai ke kaki."
  - temuan `ekstremitas`: "Nyeri tekan dan spasme otot paravertebral lumbal dengan sisi kanan lebih dominan; ROM lumbal terbatas nyeri saat fleksi dan lateral-fleksi ke kanan. Straight Leg Raise negatif bilateral."
  - rasional: Lateralisasi ke kanan dengan penjalaran tetap disangkal tegas, SLR negatif, tanpa defisit neurologis/gangguan BAK/demam, durasi hampir seminggu masih jelas akut, dan vital tetap normotensif-afebris — diagnosis M54.5 dan tata laksana konservatif FKTP tidak bergeser. Nilai anti-hafalan: pemicu domestik non-okupasional, sisi dominan kanan, durasi beda, dan set vital ketiga yang berbeda dari dasar maupun varian pertama.

## mm_mialgia - status: lolos

- **pegal_pasca_badminton** - vital td=124/82, nadi=88, rr=16, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_pemicu
  - keluhanUtama: "Bahu, lengan, sama betis saya pegal nyeri semua dok, kemarin habis tanding badminton antar-RT."
  - jawab `q_keluhan`: "Ototnya dok — bahu, lengan atas, sama betis. Sendinya tidak sakit, dagingnya yang nyeri kalau digerakkan."
  - jawab `q_pemicu`: "Iya dok, kemarin saya ikut tanding badminton antar-RT dari sore sampai malam, padahal sudah lama sekali tidak olahraga."
  - rasional: Pemicu diganti olahraga tak biasa (badminton) dengan vital normal yang angkanya jelas berbeda, sementara distribusi nyeri tetap bahu/lengan/betis sesuai temuan fisik dasar dan semua negatif red-flag (demam, urin gelap, statin, sendi bengkak) dipertahankan — tetap mialgia pasca-aktivitas 4A rawat FKTP dengan analgetik simtomatik. Anti-hafalannya: konteks pemicu dan angka vital tak bisa lagi dihafal dari kemunculan sebelumnya.
- **pegal_bantu_hajatan** - vital td=112/70, nadi=68, suhu=37; keluhanUtama; jawaban: q_keluhan, q_pemicu, q_tidur
  - keluhanUtama: "Dua hari ini badan saya nyeri pegal semua dok, terutama bahu sama betis, habis bantu-bantu hajatan tetangga."
  - jawab `q_keluhan`: "Yang pegal ototnya dok — bahu, lengan, betis juga. Persendiannya tidak apa-apa, dagingnya saja yang sakit."
  - jawab `q_pemicu`: "Ada dok, dua hari lalu saya seharian bantu hajatan tetangga, angkat-angkat kursi, dandang besar, sama galon air."
  - jawab `q_tidur`: "Dua malam ini kurang nyenyak dok, badan pegal semua, mau miring saja terasa sakit."
  - rasional: Onset digeser ke dua hari (puncak nyeri otot pasca-aktivitas) dengan pemicu domestik yang berbeda dan set vital normal lain; tanpa demam, urin tetap normal, dan tanpa obat rutin sehingga diagnosis mialgia dan disposisi rawat-FKTP tidak bergeser. Nilai anti-hafalannya: durasi keluhan, konteks pemicu, dan angka vital semuanya berbeda dari presentasi dasar.

## mm_isk_bawah - status: lolos

- **afebris_nyeri_suprapubik** - vital td=108/70, nadi=76, rr=16, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_pinggang, q_urin, q_riwayat; temuan: umum, abdomen
  - keluhanUtama: "Perut bawah saya senut-senut tiap habis pipis dok, kencingnya perih dan keluarnya sedikit-sedikit terus."
  - jawab `q_keluhan`: "Perih waktu kencing dok, terus perut bawah ikut senut-senut tiap habis pipis. Keluarnya cuma sedikit-sedikit padahal rasanya pengin terus."
  - jawab `q_pinggang`: "Tidak dok, pinggang tidak sakit, demam juga tidak ada — badan rasanya biasa saja."
  - jawab `q_urin`: "Keruh dok kayak air cucian beras dan baunya tajam, tapi tidak ada merah-merahnya."
  - jawab `q_riwayat`: "Belum pernah dok, seumur-umur baru kali ini kena yang begini."
  - temuan `umum`: "Compos mentis, afebris (36.8), tampak tidak nyaman menahan nyeri perut bawah, tidak toksik."
  - temuan `abdomen`: "Nyeri tekan suprapubik (+) sedang, tanpa nyeri lepas atau defans; tidak ada massa, bising usus normal."
  - rasional: Sistitis akut sering afebris dan boleh tampil dengan nyeri suprapubik menonjol tanpa hematuria kasat mata (eritrosit 3-5/lpb tetap mikroskopik) — CVA tetap negatif, tidak hamil, vital stabil, sehingga diagnosis ISK bawah nonkomplikata, nitrofurantoin, dan rawat-FKTP tak bergeser. Nilai anti-hafalannya memutus jangkar '37.4 + kemerahan di akhir kencing + pernah setahun lalu': pemain harus bernalar dari urinalisis, bukan mengenali angka.
- **urgensi_nokturia_pasca_perjalanan** - vital td=124/78, nadi=92; keluhanUtama; jawaban: q_keluhan, q_frekuensi, q_kebiasaan; temuan: abdomen
  - keluhanUtama: "Dari kemarin kebelet pipis terus dok, semalam sampai lima kali bangun, tapi keluarnya sedikit dan ujungnya perih."
  - jawab `q_keluhan`: "Kebelet terus dok susah ditahan, semalam sampai lima kali bangun buat pipis, keluarnya sedikit-sedikit dan ujungnya perih."
  - jawab `q_frekuensi`: "Iya dok, baru keluar dari WC sudah pengin lagi, ditahan sebentar saja rasanya mau bocor."
  - jawab `q_kebiasaan`: "Dua hari kemarin saya perjalanan bus jauh dok, seharian nahan pipis, dan sengaja tidak banyak minum biar tidak bolak-balik berhenti."
  - temuan `abdomen`: "Nyeri tekan suprapubik ringan (+), kandung kemih tidak teraba penuh; tidak ada massa, bising usus normal."
  - rasional: Pembuka urgensi-nokturia dengan pemicu perjalanan jauh menahan kencing tetap ISK bawah nonkomplikata: subfebris 37.4 tak berubah, CVA negatif, tidak hamil, TD/nadi masih normal — diagnosis, nitrofurantoin, dan disposisi FKTP identik. Anti-hafalannya mengganti kalimat antrian, konteks pemicu (perjalanan vs kerja), dan angka vital sehingga pemain menilai ulang gejala iritatif tanpa red flag alih-alih mencocokkan teks hafalan.

## kia_anc_kehamilan_normal - status: lolos

- **pindah_domisili_24_minggu** - vital td=120/80, nadi=92, rr=20, suhu=36.9, spo2=98; keluhanUtama; jawaban: q_keluhan, q_hpht, q_gerak, q_fe, q_dukungan; temuan: abdomen
  - keluhanUtama: "Saya baru pindah ikut suami dok, mau lanjut periksa kehamilan pertama saya di sini."
  - jawab `q_keluhan`: "Kontrol rutin dok, cuma saya baru pindah ikut suami jadi lanjut periksanya di sini. Kandungan jalan enam bulan, alhamdulillah sehat."
  - jawab `q_hpht`: "HPHT-nya sekitar 24 minggu yang lalu dok, tercatat juga di buku KIA saya. Ini hamil pertama, belum pernah keguguran."
  - jawab `q_gerak`: "Sudah kuat gerakannya dok, paling terasa malam hari. Tidak ada keluar darah atau air sama sekali."
  - jawab `q_fe`: "Diminum kok dok, tapi biasanya saya barengkan teh manis pagi-pagi biar tidak eneg."
  - jawab `q_dukungan`: "Suami mendukung dok. Karena baru pindah, kami sedang cari bidan dekat rumah baru untuk rencana bersalinnya."
  - temuan `abdomen`: "TFU setinggi pusat (sesuai ~24 minggu). DJJ 136x/menit reguler. Tidak ada nyeri tekan."
  - rasional: Usia gestasi digeser ke 24 minggu (TFU setinggi pusat, DJJ 136) dengan konteks pindah domisili — tetap ANC normal trimester 2 pada primigravida tanpa satu pun tanda bahaya (TD 120/80 jauh di bawah 140/90), sehingga Z34.0 dan rawat-FKTP tak bergeser; kebiasaan minum Fe bersama teh tetap memicu edukasi kepatuhan yang sama sesuai clue. Anti-hafalannya: pemain harus menilai ulang kesesuaian TFU/DJJ/vital terhadap usia gestasi berbeda, bukan mengenali paket angka 110/70–DJJ 148–20 minggu.
- **cemas_kiriman_kader** - vital td=100/70, nadi=78, rr=16, suhu=36.4; keluhanUtama; jawaban: q_keluhan, q_gerak, q_bahaya, q_fe; temuan: abdomen
  - keluhanUtama: "Saya disuruh bu kader periksa kehamilan dok, hamil pertama, jadi ingin memastikan kandungan saya baik-baik saja."
  - jawab `q_keluhan`: "Tidak ada keluhan dok, kandungan jalan lima bulan. Cuma bu kader Posyandu kemarin mengingatkan supaya periksa lengkap, jadi saya sekalian mau memastikan semuanya baik."
  - jawab `q_gerak`: "Baru dua minggu ini mulai terasa dok, seperti kedutan halus. Tidak ada keluar darah atau air."
  - jawab `q_bahaya`: "Tidak ada sama sekali dok — tidak pernah sakit kepala hebat, mata kabur, atau bengkak. Justru itu yang saya ingin pastikan."
  - jawab `q_fe`: "Sudah dikasih bu bidan dok, tapi jujur minumnya bolong-bolong, seminggu paling dua tiga kali kalau ingat."
  - temuan `abdomen`: "TFU 3 jari di bawah pusat (sesuai ~20 minggu). DJJ 152x/menit reguler. Tidak ada nyeri tekan."
  - rasional: Presentasi worried-well kiriman kader dengan vital low-normal fisiologis trimester 2 (100/70, nadi 78) dan DJJ 152 pada usia gestasi yang sama — semua tanda bahaya tetap eksplisit negatif dan ambang preeklampsia/rujukan tak didekati, jadi diagnosis dan disposisi identik. Anti-hafalannya: pemain harus menegakkan 'normal' dari data dan menahan diri memedikalisasi kecemasan, bukan mengandalkan skrip pembuka 'kontrol rutin' yang hafal.

## jiwa_insomnia - status: lolos

- **terbangun_tengah_malam** - vital td=112/74, nadi=88; keluhanUtama; jawaban: q_keluhan, q_durasi, q_kebiasaan; temuan: umum
  - keluhanUtama: "Tidur saya putus-putus dok, tengah malam kebangun terus dan susah tidur lagi."
  - jawab `q_keluhan`: "Kalau mulai tidur cepat dok, tapi jam satu-dua malam pasti kebangun, bisa dua-tiga kali — habis itu lama sekali baru bisa terlelap lagi."
  - jawab `q_durasi`: "Sudah hampir dua bulan dok, seminggu paling tidak lima malam begitu."
  - jawab `q_kebiasaan`: "Kopi sore masih sering dok, dan kalau kebangun tengah malam saya malah buka HP, scroll sampai lama."
  - temuan `umum`: "Compos mentis, tampak kurang segar dengan lingkaran gelap di bawah mata. Afek dalam batas normal, tidak ada tanda depresi/psikotik."
  - rasional: Berpindah subtipe dari sulit-memulai ke sering-terbangun (maintenance) tetap F51.0 insomnia non-organik pada kelas manajemen yang sama — higiene tidur/CBT-I di FKTP tanpa hipnotik rutin, tanpa rujukan — karena semua penyingkir sekunder tak disentuh: q_fisik tetap menyangkal nokturia/mendengkur-apnea (bukan OSA), afek normal, mood dan skrining keselamatan tetap negatif, TSH normal. Nilai anti-hafalan: pola tidur, angka durasi-frekuensi (hampir 2 bulan, 5 malam/minggu), perilaku higiene (scroll HP saat terbangun), dan vital semuanya berbeda sehingga pemain harus menalar ulang dari data, bukan mengenali angka dasar.
- **ngantuk_siang_stres_usaha** - vital td=128/82, nadi=72, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_durasi, q_mood, q_kebiasaan, q_zat; temuan: umum
  - keluhanUtama: "Badan saya lemas dan ngantuk terus dok siangnya — malamnya susah sekali mulai tidur, sering baru terlelap jam tiga pagi."
  - jawab `q_keluhan`: "Susah mulai tidurnya dok. Lampu sudah saya matikan dari jam sepuluh, tapi pikiran muter terus — sering baru terlelap jam tiga pagi."
  - jawab `q_durasi`: "Kira-kira sudah tiga bulan dok, hampir tiap malam. Seminggu paling cuma satu-dua malam yang bisa tidur cepat."
  - jawab `q_mood`: "Sedih terus sih tidak dok, semangat juga masih ada. Cuma kepikiran terus soal warung saya yang lagi sepi."
  - jawab `q_kebiasaan`: "Kalau malam kelamaan nonton TV dok, dan biasa minum teh kental sehabis maghrib. Tidur siang jarang."
  - jawab `q_zat`: "Alkohol dan rokok tidak dok. Kopi jarang, tapi teh kental hampir tiap sore — minuman berenergi atau obat-obatan tidak pernah."
  - temuan `umum`: "Compos mentis, tampak letih dan beberapa kali menguap selama wawancara. Afek dalam batas normal, tidak ada tanda depresi/psikotik."
  - rasional: Pintu masuk keluhan berpindah ke dampak siang (lemas-mengantuk) dengan pemicu stres usaha warung, durasi tiga bulan, dan higiene berbeda (teh kental + TV, q_zat ikut diselaraskan) — tetap insomnia onset non-organik: mood, minat, dan skrining keselamatan eksplisit tetap negatif, tanpa red flag organik, vital tetap di koridor normal (128/82 jauh di bawah 140/90), sehingga diagnosis F51.0, tatalaksana higiene tidur/CBT-I, dan disposisi FKTP tak bergeser. Nilai anti-hafalan: konteks pemicu, kebiasaan kafein/layar, angka durasi-frekuensi, dan vital tak lagi bisa dikenali dari hafalan kasus dasar.

## lab_influenza_tanpa_komplikasi - status: lolos

- **demam_hari_ketiga_klaster_serumah** - vital td=122/78, nadi=98, suhu=38.4; keluhanUtama; jawaban: q_keluhan, q_lama, q_kontak; temuan: tht_mulut
  - keluhanUtama: "Sudah tiga hari saya demam naik-turun, badan ngilu semua, tenggorokan perih, dan batuk kering terus, Dok."
  - jawab `q_keluhan`: "Tiga hari lalu mendadak demam dan menggigil, badan ngilu semua, kepala berat; sekarang tenggorokan perih dan batuk kering, pileknya cuma sedikit."
  - jawab `q_lama`: "Sudah tiga hari, Dok. Demamnya naik-turun tapi tidak makin parah, makan dan minum masih masuk."
  - jawab `q_kontak`: "Ada, Dok. Dua orang serumah saya juga mulai demam dan batuk-pilek minggu ini."
  - temuan `tht_mulut`: "Faring hiperemis tanpa eksudat, tonsil T1-T1 tenang; mukosa hidung sedikit hiperemis, sekret jernih minimal."
  - rasional: Demam hari ketiga yang naik-turun tanpa perburukan, intake baik, paru tetap vesikuler, dan tanpa red flag tetap influenza tanpa komplikasi (J11) rawat jalan FKTP; durasi 3 hari tidak menggeser kunci terapi karena tatalaksananya memang suportif (antiviral bukan bagian kunci kasus). Nilai anti-hafalan: durasi, klaster penularan (serumah vs rekan kerja), fokus gejala (tenggorokan menonjol vs pilek), dan angka vital semuanya berbeda dari dasar.
- **demam_tinggi_menggigil_dominan** - vital td=110/70, nadi=100, suhu=38.7; keluhanUtama; jawaban: q_keluhan; temuan: umum, tht_mulut
  - keluhanUtama: "Sejak kemarin sore badan saya mendadak panas tinggi sampai menggigil, kepala cekot-cekot, badan ngilu, dan hidung tersumbat, Dok."
  - jawab `q_keluhan`: "Kemarin sore tiba-tiba panas tinggi sampai menggigil minta selimut, kepala cekot-cekot, otot paha dan punggung ngilu, hidung tersumbat, dan mulai batuk kering."
  - temuan `umum`: "Tampak lelah, sesekali menggigil, tidak toksik, hidrasi baik."
  - temuan `tht_mulut`: "Mukosa hidung edema dan hiperemis dengan sekret jernih sedikit; faring hiperemis ringan."
  - rasional: Suhu 38.7 dengan nadi 100 masih proporsional demam pada dewasa sehat tanpa sesak, SpO2 dan paru tetap normal, sehingga tetap influenza tanpa komplikasi dengan terapi simptomatik di FKTP — jauh dari ambang rujukan (tanda pneumonia); onset semalam tetap cocok dengan jawaban q_lama "baru satu hari" yang tidak diubah. Nilai anti-hafalan: pola keluhan dominan menggigil-sakit kepala-hidung tersumbat menggantikan pilek-pegal, dan suhu, nadi, serta TD jelas berbeda dalam koridor aman.

## lab_stomatitis_aftosa - status: lolos

- **dua_ulkus_pipi_tergigit** - vital td=124/80, nadi=84, suhu=36.6; keluhanUtama; jawaban: q_keluhan; temuan: tht_mulut
  - keluhanUtama: "Ada dua sariawan perih di pipi kanan bagian dalam sejak tiga hari."
  - jawab `q_keluhan`: "Ada dua luka bulat kecil berdampingan di pipi kanan bagian dalam, Dok, sejak tiga hari. Perihnya terasa sekali kalau kena makanan pedas atau panas."
  - temuan `tht_mulut`: "Dua ulkus bulat dangkal 3-4 mm berdampingan pada mukosa bukal kanan setinggi garis oklusi, dasar putih-kekuningan dengan halo eritema; tidak ada indurasi atau vesikel."
  - rasional: Tetap aftosa minor pada mukosa nonkeratinisasi: dua ulkus dangkal <5 mm dengan pencetus trauma gigitan yang sama (koheren dengan q_trauma dan distraktor panas dalam yang menyebut tempat sering tergigit), tanpa gejala sistemik, sehingga diagnosis K12 dan tatalaksana topikal di FKTP tidak bergeser. Anti-hafalan: jumlah lesi (dua vs satu), lokasi (bukal vs labial), durasi (tiga vs empat hari), dan agravasi (pedas/panas vs asam).
- **kambuh_stres_bawah_lidah** - vital td=112/72, nadi=80, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_trauma, q_dist_panas_dalam; temuan: tht_mulut
  - keluhanUtama: "Sariawan di bawah lidah perih sejak dua hari, sudah tiga kali kambuh dalam dua bulan ini."
  - jawab `q_keluhan`: "Satu luka bulat kecil di bawah lidah, Dok, baru dua hari ini. Tapi dua bulan ini sudah tiga kali kambuh begini; perih sekali kalau kena makanan asin atau saat sikat gigi."
  - jawab `q_trauma`: "Tidak ada, Dok. Tidak tergigit dan tidak pakai kawat gigi. Munculnya justru pas saya lagi banyak pikiran dan kurang tidur."
  - jawab `q_dist_panas_dalam`: "Minum saya cukup banyak kok, Dok. Kata orang memang panas dalam, tapi saya perhatikan sariawannya kambuh tiap saya kecapekan dan kurang tidur, bukan karena kurang minum."
  - temuan `tht_mulut`: "Ulkus soliter bulat dangkal 5 mm pada mukosa ventral lidah, dasar putih-kekuningan dengan halo eritema; tepi rata, tidak ada indurasi."
  - rasional: Tetap aftosa minor rekuren: ulkus soliter dangkal 5 mm pada mukosa nonkeratinisasi yang sembuh sendiri <2 minggu tiap episode (koheren dengan q_lama), tanpa indurasi, limfadenopati, maupun gejala sistemik, sehingga diagnosis dan disposisi FKTP tidak berubah - hanya pencetusnya stres/kelelahan alih-alih trauma. Anti-hafalan: lokasi ventral lidah, durasi dua hari, pola rekuren eksplisit (3x/2 bulan), dan pencetus non-trauma yang memaksa pemain menggali ulang alih-alih menghafal jawaban tergigit.

## lab_mata_kering - status: lolos

- **berpasir_kasir_toko_ac** - vital td=124/78, nadi=82; keluhanUtama; jawaban: q_keluhan, q_dist_kabur_layar; temuan: mata
  - keluhanUtama: "Dua mata saya terasa berpasir dan cepat lelah kalau seharian menjaga kasir sambil menatap layar komputernya, Dok."
  - jawab `q_keluhan`: "Kurang lebih sebulan ini, Dok. Paling berat sore hari setelah seharian menatap layar komputer kasir di toko yang ber-AC dingin; kalau sudah di luar toko pelan-pelan mendingan."
  - jawab `q_dist_kabur_layar`: "Tidak berbayang, Dok. Angka di layar kasir masih jelas; yang mengganggu ya rasa berpasir dan cepat lelahnya itu."
  - temuan `mata`: "Visus baik; tear meniscus tampak tipis, break-up time air mata memendek, injeksi konjungtiva ringan pada kedua mata, kornea jernih tanpa defek epitel."
  - rasional: Hanya konteks yang digeser (pekerja kasir toko ber-AC dengan layar komputer kasir) sementara inti presentasi yang diajarkan clue dipertahankan utuh: gejala bilateral berpasir yang memburuk saat screen-time/AC, tanpa red flag, visus normal, kornea jernih — diagnosis H04.1, air mata buatan + edukasi, dan disposisi FKTP tidak berubah. Menjawab bantahan verifikator: 'berpasir' tetap dilaporkan pasien di keluhanUtama maupun jawaban distraktor, dan pemicu layar+AC tetap eksplisit di jawaban pembuka, sehingga clue debrief dan kondisiKembali 'makin perih, silau, dan berpasir' tetap koheren (berpasir memang sudah ada sejak awal dan tinggal memberat). Koheren pula dengan variasi persona pembuka (semuanya menyebut berpasir/lelah/layar). Nilai anti-hafalan datang dari kosakata, durasi (sebulan), pekerjaan, faktor pereda, dan detail temuan (BUT memendek) yang berbeda tanpa menggeser satu pun ambang keputusan.
- **berpasir_lembur_laporan** - vital td=114/72, nadi=72; keluhanUtama; jawaban: q_keluhan, q_dist_kabur_layar; temuan: mata
  - keluhanUtama: "Kedua mata saya berasa berpasir dan gampang capek tiap lembur mengetik laporan di laptop, Dok."
  - jawab `q_keluhan`: "Sekitar dua bulan, Dok. Makin terasa malam hari kalau lembur mengetik laporan di ruangan kerja ber-AC; kalau libur dan tidak pegang laptop, keluhannya jauh berkurang."
  - jawab `q_dist_kabur_layar`: "Tidak, Dok. Huruf di laptop masih tajam kok; keluhannya cuma rasa berpasir dan cepat capeknya saja."
  - temuan `mata`: "Visus baik; tear meniscus berkurang dengan pola break-up air mata yang cepat, hiperemia konjungtiva ringan di kedua mata, kornea jernih."
  - rasional: Variasi kosmetik murni: pemicu tetap kombinasi screen-time (lembur mengetik laptop) dan ruangan ber-AC persis seperti yang diklaim clue, gejala berpasir bilateral tetap menjadi keluhan utama, distraktor tetap negatif-tak-relevan, dan q_redflag/q_obat/q_sistemik dasar tak terkontradiksi — sehingga H04.1, lubrikan + edukasi perlindungan mata, dan penanganan tuntas di FKTP tidak bergeser. Menjawab bantahan verifikator: tidak ada lagi penghapusan 'berpasir' (kondisiKembali 'makin ... berpasir' kini koheren karena berpasir memang baseline) dan tidak ada penggantian pemicu ke luar pola screen-time/AC yang diajarkan clue saat debrief. Yang berubah hanya kemasan: durasi dua bulan, konteks lembur malam, faktor pereda saat libur, frasa jawaban distraktor, dan redaksi temuan fisik dengan substansi identik (meniscus berkurang, hiperemia ringan bilateral, kornea jernih).

## lab_hipermetropia - status: lolos

- **astenopia_layar_hp** - vital td=112/70, nadi=84; keluhanUtama; jawaban: q_keluhan, q_fungsi; temuan: mata
  - keluhanUtama: "Dahi cepat pegal dan mata lelah kalau lama menatap layar HP dari dekat."
  - jawab `q_keluhan`: "Paling terasa kalau lama menatap layar HP dekat-dekat atau menulis, Dok; dahi sampai pegal dan mata cepat lelah. Melihat jauh masih jelas."
  - jawab `q_fungsi`: "Melihat layar HP lama dan menulis jadi cepat bikin kepala pegal, Dok; sering saya berhenti dulu sebentar."
  - temuan `mata`: "Visus jauh normal; visus dekat menurun dan membaik dengan koreksi sferis plus. Segmen anterior tenang."
  - rasional: Konteks pemicu digeser dari membaca buku ke kerja jarak dekat pada layar HP/menulis dengan nyeri kepala frontal — tetap astenopia akomodatif hipermetropia: temuan kunci (visus dekat menurun yang membaik dengan sferis plus, segmen anterior tenang) dan absennya red flag tidak bergeser, sehingga diagnosis H52.0 dan disposisi FKTP (uji refraksi + edukasi) tetap sama. Nilai anti-hafalan: cerita pemicu, redaksi keluhan antrian, dan angka vital jelas berbeda dari presentasi dasar yang identik di semua kasus refraksi.
- **kabur_dekat_hilang_timbul** - vital td=108/72, nadi=80; keluhanUtama; jawaban: q_keluhan, q_fungsi, q_dist_baca_gelap; temuan: mata
  - keluhanUtama: "Tulisan makin kabur kalau membaca lama, lama-lama kepala ikut pusing."
  - jawab `q_keluhan`: "Awal membaca masih jelas, Dok, tapi makin lama tulisan makin kabur dan kepala ikut pusing. Kalau mata diistirahatkan sebentar, jelas lagi; melihat jauh tidak masalah."
  - jawab `q_fungsi`: "Membaca lama tidak tahan, Dok; harus sering berhenti supaya tulisan jelas lagi, jadi semuanya lebih lambat."
  - jawab `q_dist_baca_gelap`: "Tidak, Dok, saya biasa membaca di tempat terang. Tetap saja lama-lama kabur."
  - temuan `mata`: "Visus dekat menurun, terkoreksi dengan lensa sferis plus; visus jauh dalam batas normal, segmen anterior dan media refraksi jernih."
  - rasional: Pola gejala diubah menjadi kabur dekat hilang-timbul yang memberat saat membaca lama dan pulih dengan istirahat mata — gambaran kelelahan akomodasi yang tetap khas hipermetropia, tanpa menyentuh kata kunci presbiopia (menjauhkan tulisan) maupun astigmatisme (berbayang) dan tanpa red flag, sehingga diagnosis H52.0 serta tatalaksana koreksi optik di FKTP tidak berubah. Anti-hafalan: dinamika keluhan (hilang-timbul vs lelah konstan), jawaban distraktor, dan vital berbeda nyata dari dasar.

## lab_miopia_ringan - status: lolos

- **sulit_kenali_wajah_jauh** - vital td=112/70, nadi=84; keluhanUtama; jawaban: q_keluhan, q_fungsi; temuan: mata
  - keluhanUtama: "Wajah orang dari kejauhan tampak buram, tetapi membaca dekat tetap jelas."
  - jawab `q_keluhan`: "Paling terasa kalau melihat jauh, Dok — wajah teman di seberang jalan baru kelihatan jelas kalau saya menyipitkan mata. Membaca dekat tidak ada masalah. Sudah hampir setahun ini, pelan-pelan makin terasa."
  - jawab `q_fungsi`: "Menyapa orang dari jauh sering salah karena wajahnya buram, Dok; kalau membaca atau menulis dekat lancar saja."
  - temuan `mata`: "Visus jauh 6/12 pada kedua mata, membaik menjadi 6/6 dengan pinhole dan lensa sferis minus ringan; segmen mata lainnya normal."
  - rasional: Tetap kabur jauh bilateral yang muncul perlahan tanpa nyeri/merah/kilatan, penglihatan dekat jelas, dan visus 6/12 ODS terkoreksi penuh dengan pinhole/lensa minus ringan — diagnosis tetap miopia ringan yang dikelola uji visus-refraksi di FKTP tanpa rujukan. Nilai anti-hafalannya: konteks keluhan berpindah dari 'tulisan di papan' ke sulit mengenali wajah dari jauh, dengan durasi dan angka visus konkret yang berbeda, sehingga pencocokan teks hafalan tidak lagi berjalan.
- **salah_baca_angkot_jauh** - vital td=118/74, nadi=72, suhu=36.6; keluhanUtama; jawaban: q_keluhan, q_kacamata, q_fungsi; temuan: mata
  - keluhanUtama: "Nomor angkot dan tulisan di jalan baru terbaca kalau sudah dekat sekali."
  - jawab `q_keluhan`: "Paling terasa di jalan, Dok — nomor angkot atau papan nama toko dari jauh buram, harus menunggu dekat dulu baru terbaca. Membaca buku di tangan tetap jelas. Munculnya pelan-pelan beberapa bulan terakhir."
  - jawab `q_kacamata`: "Belum pernah pakai kacamata, Dok, dan buramnya tidak berubah cepat — bertambahnya pelan sekali."
  - jawab `q_fungsi`: "Bepergian jadi repot karena tulisan dan nomor kendaraan dari jauh tidak terbaca, Dok; kalau membaca dekat masih enak."
  - temuan `mata`: "Visus jauh 6/9 pada kedua mata, membaik menjadi 6/6 dengan pinhole dan koreksi lensa sferis minus kecil; segmen anterior dan posterior dalam batas normal."
  - rasional: Semua penanda kelas tidak bergeser — onset perlahan berbulan-bulan, tanpa red flag, tanpa riwayat perubahan resep cepat, visus 6/9 ODS simetris yang membaik ke 6/6 dengan pinhole/lensa minus kecil — tetap miopia ringan kelolaan FKTP. Anti-hafalannya: skenario fungsional khas keseharian (membaca nomor angkot/tulisan jalan), durasi berbeda, dan parafrase jawaban riwayat kacamata memaksa mahasiswa menilai pola klinis, bukan menghafal kalimat kasus dasar.

## lab_astigmatisme_ringan - status: lolos

- **lampu_malam_berbayang** - vital td=110/70, nadi=88, rr=20, suhu=36.7; keluhanUtama; jawaban: q_keluhan, q_fungsi
  - keluhanUtama: "Lampu kendaraan saat malam tampak pecah berbayang dan mata cepat lelah bila membaca."
  - jawab `q_keluhan`: "Paling terasa malam hari, Dok — lampu kendaraan dan lampu jalan tampak pecah seperti berekor dan berbayang. Kalau lama membaca, tulisan juga ikut berbayang dan kepala jadi pegal."
  - jawab `q_fungsi`: "Bepergian malam hari jadi kurang nyaman karena lampu tampak pecah, dan membaca lama membuat mata cepat lelah."
  - rasional: Distorsi tetap muncul pada berbagai jarak (lampu jauh malam hari + tulisan dekat) tanpa nyeri, mata merah, atau penurunan mendadak, sehingga tetap astigmatisme ringan H52.2 yang dikelola dengan uji visus-refraksi di FKTP. Mengganti konteks dominan dari 'berbayang saat membaca' ke 'lampu malam pecah berekor' memutus hafalan template keluhan tanpa menggeser ambang diagnosis maupun disposisi.
- **huruf_dobel_makin_sore** - vital td=114/72, nadi=70, rr=16, suhu=36.3; keluhanUtama; jawaban: q_keluhan, q_fungsi; temuan: mata
  - keluhanUtama: "Huruf di layar tampak dobel tipis dan mata terasa tegang, makin berat menjelang sore."
  - jawab `q_keluhan`: "Makin sore makin terasa, Dok. Huruf di layar HP tampak dobel tipis, menonton TV dari jauh pun kadang berbayang, dan mata rasanya tegang."
  - jawab `q_fungsi`: "Membaca di layar jadi lambat karena saya sering berhenti dan memicingkan mata supaya hurufnya lebih jelas."
  - temuan `mata`: "Pasien tampak memicingkan mata saat uji visus; visus membaik sebagian dengan pinhole dan terkoreksi dengan lensa silinder; kornea jernih."
  - rasional: Presentasi asthenopia-dominan (tegang menjelang sore, kebiasaan memicingkan mata) dengan bayangan dobel tipis pada jarak dekat maupun jauh tetap konsisten dengan astigmatisme ringan yang terkoreksi lensa silinder — diagnosis, refraksi di FKTP, dan status tanpa rujukan tak bergeser. Pola pemicu diurnal dan konteks layar memberi wajah kedua yang jelas berbeda dari kasus dasar sebagai anti-hafalan.

## lab_presbiopia - status: lolos

- **baca_hp_lampu_redup** - vital td=128/82, nadi=84, suhu=36.7, spo2=98; keluhanUtama; jawaban: q_keluhan, q_fungsi, q_dist_katarak; temuan: mata
  - keluhanUtama: "Susah membaca tulisan di HP dan mata cepat pegal, apalagi kalau lampu redup."
  - jawab `q_keluhan`: "Paling terasa kalau membaca dekat, Dok — pesan di HP atau tulisan di bungkus obat harus saya jauhkan atau besarkan hurufnya. Kira-kira setahun ini pelan-pelan makin susah, apalagi malam kalau lampu redup; melihat jauh masih jelas."
  - jawab `q_fungsi`: "Membalas pesan di HP dan membaca label bumbu di dapur jadi lama, Dok. Sekarang saya harus cari tempat terang dulu kalau mau membaca."
  - jawab `q_dist_katarak`: "Tidak, Dok. Tidak berkabut dan tidak silau; melihat jauh malam hari masih jernih. Yang susah cuma huruf kecil dari dekat, apalagi kalau kurang terang."
  - temuan `mata`: "Visus jauh 6/6 kedua mata; membaca kartu dekat lambat pada jarak baca biasa dan membaik dengan adisi lensa plus sesuai usia; media refraksi jernih."
  - rasional: Semua pilar diagnosis dan disposisi tak bergeser — usia paruh baya dengan keluhan dekat progresif-lambat, visus jauh tetap baik, membaik dengan adisi plus, tanpa red flag dan media jernih — sehingga tetap presbiopia yang dikelola FKTP dengan uji visus-refraksi. Nilai anti-hafalannya: konteks pemicu berbeda (layar HP dan cahaya redup), durasi eksplisit sekitar setahun, serta set angka vital normal yang berbeda dari dasar.
- **sulit_memasukkan_benang_jarum** - vital td=112/70, nadi=68, rr=16, suhu=36.4; keluhanUtama; jawaban: q_keluhan, q_kacamata, q_fungsi; temuan: mata
  - keluhanUtama: "Susah memasukkan benang ke jarum, koran juga harus dijauhkan sampai tangan lurus."
  - jawab `q_keluhan`: "Waktu kerja dekat, Dok — memasukkan benang ke jarum hampir selalu gagal, dan koran harus saya jauhkan sampai tangan lurus baru terbaca. Sekitar delapan bulan ini makin lama makin susah, tapi melihat jauh tidak ada masalah."
  - jawab `q_kacamata`: "Belum pernah punya kacamata sendiri, Dok, dan tidak ada perubahan yang tiba-tiba. Waktu iseng mencoba kacamata baca murah di pasar, tulisan memang jadi lebih jelas, tapi saya belum pernah diperiksa resmi."
  - jawab `q_fungsi`: "Menjahit jadi lama sekali dan mata cepat lelah, Dok; membaca koran atau catatan belanja juga harus dijauhkan dulu baru terbaca."
  - temuan `mata`: "Visus jauh normal tanpa koreksi pada kedua mata; titik dekat mundur dari jarak baca normal dan membaik nyata dengan uji adisi lensa plus; segmen anterior tenang."
  - rasional: Diagnosis dan tatalaksana identik — penurunan akomodasi sesuai usia (gagal memasukkan benang, koran dijauhkan sejauh lengan, jelas membaik saat mencoba lensa baca plus) tanpa tanda organik maupun red flag, tetap dirawat di FKTP. Anti-hafalannya: motif tugas dekat yang berbeda, durasi delapan bulan, riwayat mencoba kacamata baca pasar yang koheren dengan temuan adisi plus, dan angka vital normal yang lain.

## lab_pitiriasis_versikolor - status: lolos

- **bercak_kecokelatan** - keluhanUtama; jawaban: q_keluhan, q_kambuh; temuan: kulit
  - keluhanUtama: "Muncul bercak kecokelatan bersisik halus di punggung dan dada saya."
  - jawab `q_keluhan`: "Sudah sekitar dua bulan, Dok. Warnanya kecokelatan dan makin banyak kalau saya sering berkeringat."
  - jawab `q_kambuh`: "Iya pernah kambuh, Dok, apalagi saya kerja seharian di tempat yang panas."
  - temuan `kulit`: "Makula hiperpigmentasi kecokelatan multipel dengan fine scale (skuama halus) di dada dan punggung; sensasi utuh."
  - rasional: Tetap Pitiriasis Versikolor (B36.0) dengan KOH Malassezia yang sama dan disposisi FKTP + ketokonazol topikal yang tidak berubah — hanya warna lesi digeser ke bentuk hiperpigmentasi yang sama klasiknya, dengan skuama halus dan sensasi utuh tetap jadi jangkar. Nilai anti-hafalan: memutus asumsi 'PV selalu bercak putih/terang' sehingga mahasiswa bernalar dari skuama + KOH, bukan dari warna lesi.
- **pasca_berjemur_pantai** - vital td=114/72, nadi=62; keluhanUtama; jawaban: q_keluhan, q_kambuh; temuan: kulit
  - keluhanUtama: "Sepulang dari pantai, punggung dan dada saya belang putih dan bersisik halus."
  - jawab `q_keluhan`: "Baru sekitar tiga minggu ini, Dok. Bercaknya makin kelihatan putih setelah kulit sekitarnya jadi cokelat karena berjemur di pantai."
  - jawab `q_kambuh`: "Ini baru pertama kali, Dok, tapi saya memang gampang berkeringat karena rutin olahraga."
  - temuan `kulit`: "Makula hipopigmentasi multipel dengan fine scale di punggung dan dada, tampak lebih kontras terhadap kulit yang tersamak matahari; sensasi utuh."
  - rasional: Diagnosis dan disposisi tidak berubah (PV B36.0, afebris tanpa red flag, ketokonazol topikal rawat FKTP); skuama halus, sensasi utuh, dan KOH Malassezia tetap jadi jangkar diagnostik. Nilai anti-hafalan: mengganti set angka yang dihafal (durasi dua bulan, pekerja tempat panas) menjadi onset tiga minggu pasca-berjemur pada pasien muda aktif, sambil mempertahankan kisah hipopigmentasi yang menonjol setelah kulit menyamak.

## lab_reaksi_gigitan_serangga - status: lolos

- **semut_merah_tungkai_pagi** - vital td=118/76, nadi=86, rr=16, suhu=36.9, spo2=98; keluhanUtama; jawaban: q_keluhan, q_dist_bentol_pindah; temuan: kulit
  - keluhanUtama: "Kaki saya bentol gatal setelah digigit semut merah di pekarangan."
  - jawab `q_keluhan`: "Tadi pagi waktu mencabuti rumput di pekarangan kaki saya digigit semut merah, lalu muncul dua bentol yang gatal sekali di betis kanan."
  - jawab `q_dist_bentol_pindah`: "Tidak, bentolnya menetap di kaki kanan itu saja sejak tadi pagi, tidak pindah-pindah."
  - temuan `kulit`: "Dua papul urtikarial dengan punctum sentral pada tungkai bawah kanan, edema lokal kecil, tanpa selulitis."
  - rasional: Tetap reaksi lokal gigitan serangga tanpa tanda sistemik maupun infeksi sekunder (afebris, papul dengan punctum, tanpa selulitis, semua skrining anafilaksis/infeksi tetap negatif), sehingga diagnosis dan penanganan simtomatik di FKTP tidak bergeser. Anti-hafalan: lokasi lengan menjadi tungkai kanan, pemicu berkebun menjadi digigit semut merah saat membersihkan pekarangan, jumlah tiga menjadi dua, onset kemarin menjadi tadi pagi, dan angka vital bergeser jelas namun tetap dalam koridor normal.
- **nyamuk_malam_leher_tangan** - vital td=124/80, nadi=72, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_dist_bentol_pindah; temuan: kulit
  - keluhanUtama: "Leher dan punggung tangan saya bentol gatal setelah digigit nyamuk dua malam lalu."
  - jawab `q_keluhan`: "Dua malam lalu saya ketiduran di ruang tengah tanpa kelambu, nyamuknya banyak sekali; paginya muncul empat bentol gatal di leher kiri dan punggung tangan kiri, sampai sekarang masih gatal."
  - jawab `q_dist_bentol_pindah`: "Tidak, bentolnya tetap di leher dan tangan yang sama sejak dua malam lalu, tidak hilang sendiri dalam beberapa jam."
  - temuan `kulit`: "Empat papul urtikarial dengan punctum sentral pada sisi leher kiri dan punggung tangan kiri, edema lokal kecil, tanpa selulitis."
  - rasional: Presentasi indoor tanpa konteks berkebun ini tetap reaksi gigitan lokal: papul menetap dengan punctum di area terbuka saat tidur, tanpa demam, tanpa tanda anafilaksis, dan distraktor urtikaria tetap ternegasi (bentol tidak berpindah/hilang cepat), jadi diagnosis, disposisi FKTP, dan terapi simtomatik sama persis. Anti-hafalan: pemicu berkebun menjadi digigit nyamuk saat tidur, lokasi lengan menjadi leher dan punggung tangan kiri, jumlah tiga menjadi empat, onset kemarin menjadi dua malam lalu, dengan vital tetap normal tapi angkanya berbeda dari dasar.

## lab_dermatitis_kontak_iritan_tangan - status: lolos

- **pencuci_piring_warung_telapak** - vital td=112/74, nadi=88, rr=20, suhu=36.5, spo2=98; keluhanUtama; jawaban: q_keluhan, q_alergi, q_obat; temuan: kulit
  - keluhanUtama: "Telapak dan jari kedua tangan saya kering, gatal, dan pecah-pecah sejak sering mencuci piring dengan air deterjen di warung."
  - jawab `q_keluhan`: "Baru sekitar tiga minggu ini, Dok. Tiap hari saya mencuci piring pakai air deterjen di warung tanpa sarung tangan; makin gatal dan pecah-pecah kalau warung ramai, dan agak membaik waktu warung tutup dua hari."
  - jawab `q_alergi`: "Tidak, cuma di telapak dan jari kedua tangan yang kena air cucian; badan dan wajah tidak ada apa-apa."
  - jawab `q_obat`: "Belum pakai krim apa-apa, paling saya olesi minyak kelapa kalau terasa kering sekali."
  - temuan `kulit`: "Eritema, xerosis, dan fisura dangkal pada telapak dan ujung jari kedua tangan sesuai area kontak; tanpa vesikel, tanpa pus."
  - rasional: Iritan tetap deterjen (air cucian piring warung), lesi tetap bilateral dan terbatas pada area kontak dengan pola membaik saat warung tutup, tanpa tanda infeksi maupun penyebaran ala alergi — diagnosis tetap dermatitis kontak iritan tangan ringan yang dirawat di FKTP dengan emolien plus steroid topikal ringan. Nilai anti-hafalannya: konteks pemicu (cuci piring warung), durasi tiga minggu, lokasi lesi telapak-ujung jari (bukan dorsum-sela jari), keluhan dominan gatal-pecah, dan angka vital semuanya berbeda dari dasar.
- **petugas_kebersihan_kambuh_pasca_cuti** - vital td=124/80, nadi=68, suhu=36.8; keluhanUtama; jawaban: q_keluhan, q_alergi, q_obat; temuan: kulit
  - keluhanUtama: "Punggung kedua tangan saya merah, kering, dan perih sejak tiap hari mencuci dan memeras lap pakai air deterjen."
  - jawab `q_keluhan`: "Sudah hampir dua bulan, Dok. Saya petugas kebersihan kantor, tiap hari merendam dan memeras lap pakai air deterjen tanpa sarung tangan. Waktu cuti seminggu sempat membaik, begitu mulai kerja lagi kambuh."
  - jawab `q_alergi`: "Tidak, hanya di punggung kedua tangan yang sering kena air deterjen; tidak menyebar ke mana-mana."
  - jawab `q_obat`: "Pernah beli pelembap di apotek, tapi dipakainya cuma kalau ingat."
  - temuan `kulit`: "Eritema dengan xerosis, skuama, dan fisura dangkal pada punggung tangan hingga pergelangan kedua sisi sesuai area terpapar; tanpa pus."
  - rasional: Pola khas dermatitis iritan kumulatif dipertahankan — paparan air deterjen harian, membaik saat cuti lalu kambuh saat kembali bekerja, lesi bilateral terbatas area kontak tanpa red flag infeksi — sehingga diagnosis dan disposisi rawat-FKTP tidak bergeser. Anti-hafalannya: durasi lebih panjang (dua bulan), pola remisi-kambuh pasca cuti, pekerjaan berbeda (petugas kebersihan), dan distribusi lesi meluas ke pergelangan.

## lab_dermatitis_atopik_ringan - status: lolos

- **kumat_gerah_berkeringat** - vital td=118/76, nadi=88, suhu=36.9; keluhanUtama; jawaban: q_keluhan, q_atopi, q_perawatan; temuan: kulit
  - keluhanUtama: "Lipatan lutut dan siku saya gatal kumat-kumatan dari kecil, tambah parah kalau gerah dan berkeringat."
  - jawab `q_keluhan`: "Dari kecil hilang-timbul, Dok. Kumatnya kalau cuaca gerah dan banyak keringat, misalnya habis olahraga atau main di luar; paling terasa di lipatan lutut, lipatan siku juga ikut gatal."
  - jawab `q_atopi`: "Asma tidak ada. Ayah saya rinitis alergi, dan kata ibu waktu saya bayi pipi saya sering merah dan gatal seperti ini."
  - jawab `q_perawatan`: "Sabunnya sabun antiseptik biar badan kesat, dan pelembap tidak pernah pakai."
  - temuan `kulit`: "Plak eksematosa tipis simetris, fossa poplitea lebih menonjol daripada kubiti, dengan xerosis dan ekskoriasi bekas garukan; tanpa madidans, krusta madu, atau tanda infeksi sekunder."
  - rasional: Pencetus dibalik dari udara kering-malam menjadi gerah-berkeringat, konstelasi atopi diganti (riwayat eksim infantil di pipi + ayah rinitis alergi, bukan rinitis pribadi + ibu asma), lesi poplitea-dominan, dan kebiasaan sabun antiseptik menggantikan mandi air panas — semua anchor L20 ringan (pruritus kronik-kambuhan fleksural simetris siku-lutut, xerosis, riwayat atopi, tanpa tanda infeksi, vital normal) utuh sehingga diagnosis, rawat-FKTP, dan emolien + hidrokortison tidak bergeser. Anti-hafalannya memaksa mahasiswa menalar ulang kriteria dermatitis atopik alih-alih mencocokkan pola hafalan "kering-malam + rinitis + ibu asma + 120/78".
- **kumat_terpapar_debu** - vital td=112/70, nadi=80, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_perawatan; temuan: kulit
  - keluhanUtama: "Gatal kambuhan di lipatan siku dan belakang lutut, seminggu ini kumat lagi."
  - jawab `q_keluhan`: "Kambuh-kambuhan sejak balita, Dok. Seminggu ini kumat lagi, biasanya kalau kena debu waktu kamar disapu atau ganti sprei; paling gatal di lipatan siku, belakang lutut juga kena."
  - jawab `q_perawatan`: "Sabun batang yang wangi, mandinya biasa saja; pelembap tidak pakai sama sekali."
  - temuan `kulit`: "Plak eksematosa simetris di fossa kubiti dan poplitea, sisi kubiti lebih dominan, kulit sekitar xerotik difus dengan ekskoriasi ringan; tanpa krusta madu, pustul, atau vesikel."
  - rasional: Pencetus menjadi paparan debu dengan flare berjalan seminggu, kubiti lebih dominan, kebiasaan sabun batang berpewangi menggantikan mandi air panas, dan vital digeser dalam koridor normal yang jelas — kronisitas sejak balita, distribusi fleksural simetris siku-lutut, xerosis, atopi (rinitis pribadi + ibu asma tetap dipakai), dan absennya tanda infeksi dipertahankan sehingga dokter FKTP kompeten tetap tiba di dermatitis atopik ringan yang dikelola di FKTP. Nilai anti-hafalannya memecah hafalan pencetus tunggal serta angka vital NORMAL 120/78 yang identik antar-kemunculan kasus lab.

## lab_dermatitis_popok_iritan - status: lolos

- **popok_lama_perjalanan_jauh** - vital nadi=134, rr=34, suhu=37, spo2=98; keluhanUtama; jawaban: q_keluhan, q_perawatan; temuan: kulit
  - keluhanUtama: "Kulit bayi merah di area popok setelah dua hari perjalanan jauh."
  - jawab `q_keluhan`: "Muncul dua hari ini, Dok, pas kami perjalanan jauh dan popoknya lama tidak diganti. Yang merah bagian yang menonjol; lipatan pahanya masih bersih."
  - jawab `q_perawatan`: "Selama di perjalanan popoknya bisa lima-enam jam baru diganti, dan bersihkannya cuma pakai tisu basah berpewangi."
  - temuan `kulit`: "Eritema merata pada permukaan cembung bokong dan pubis yang kontak popok; lipatan inguinal relatif bersih, tanpa erosi maupun pustul satelit."
  - rasional: Pemicu diganti dari diare menjadi oklusi lama karena popok jarang diganti selama perjalanan, dengan vital tetap normal-afebris untuk bayi dan pola ruam tetap cembung-dominan dengan lipatan bersih tanpa lesi satelit — diagnosis L22 ringan, non-rujukan, dan barrier zinc oxide tidak bergeser. Anti-hafalan: memutus asosiasi 'diare + nadi 118 = popok iritan' sehingga mahasiswa harus membaca pola distribusi, bukan cerita pemicunya.
- **sabun_dewasa_popok_semalaman** - vital nadi=112, rr=30, suhu=36.5, spo2=100; keluhanUtama; jawaban: q_keluhan, q_perawatan; temuan: kulit
  - keluhanUtama: "Kulit bayi merah di area popok padahal rajin saya sabuni tiap ganti."
  - jawab `q_keluhan`: "Sudah lima hari, Dok, makin lama makin merah. Yang kena bagian menonjol yang tertutup popok; lipatan pahanya tidak ikut."
  - jawab `q_perawatan`: "Kalau siang diganti saat sudah penuh, tapi malam ya semalaman baru pagi diganti; tiap ganti saya gosok pakai sabun mandi dewasa supaya bersih."
  - temuan `kulit`: "Eritema mengilap (glazed) dengan skuama halus terbatas pada area cembung tertutup popok; lipatan inguinal spared, tanpa erosi maupun pustul satelit."
  - rasional: Pemicu dibalik arah menjadi overcleaning (sabun dewasa tiap ganti) plus oklusi popok semalaman, dengan morfologi glazed erythema yang khas iritan; lipatan tetap spared, afebris, tanpa tanda sistemik, sehingga dokter kompeten tetap tiba di L22 ringan yang dikelola FKTP dengan barrier dan higiene lembut. Anti-hafalan: durasi, angka vital, dan narasi perawatan berbeda nyata dari kasus dasar tanpa menyeberangi ambang kandidiasis (lipatan/satelit) maupun infeksi sekunder.

## lab_dermatitis_seboroik_dewasa - status: lolos

- **kambuh_begadang_belakang_telinga** - vital td=112/74, nadi=68, suhu=36.4, spo2=98; keluhanUtama; jawaban: q_keluhan; temuan: kulit
  - keluhanUtama: "Kulit kepala, belakang telinga, dan sisi hidung bersisik berminyak, gatalnya kumat-kumatan."
  - jawab `q_keluhan`: "Hilang-timbul sudah sekitar dua tahun di kulit kepala, belakang telinga, dan samping hidung; paling kumat kalau saya begadang dan kecapekan."
  - temuan `kulit`: "Skuama kekuningan berminyak pada scalp, sulkus retroaurikular, dan lipatan nasolabial dengan eritem ringan; tanpa pustul, erosi, atau krusta."
  - rasional: Distribusi tetap murni area seboroik (scalp, retroaurikular, nasolabial) dengan pola kronik-kambuhan ringan tanpa tanda infeksi sekunder maupun imunokompromais, sehingga diagnosis L21 dan tatalaksana ketokonazol topikal di FKTP tidak bergeser. Nilai anti-hafalan: pemicu begadang/kelelahan menggantikan stres, durasi eksplisit dua tahun, situs belakang telinga menggantikan alis, dan set vital jelas berbeda namun tetap normal.
- **pemicu_udara_dingin_dada** - vital td=126/82, nadi=88, suhu=36.9; keluhanUtama; jawaban: q_keluhan, q_produk; temuan: kulit
  - keluhanUtama: "Kulit kepala, sisi hidung, dan dada bersisik berminyak dan gatal saat udara dingin."
  - jawab `q_keluhan`: "Sudah sekitar lima tahun kumat-kumatan di kulit kepala, samping hidung, kadang sampai dada; biasanya memburuk saat udara dingin, mereda sendiri, lalu balik lagi."
  - jawab `q_produk`: "Hanya sampo biasa; saya tidak pakai gel atau minyak rambut."
  - temuan `kulit`: "Skuama kekuningan berminyak di scalp, alis, lipatan nasolabial, dan area presternal dengan eritem ringan; tanpa plak tebal berbatas tegas berskuama keperakan."
  - rasional: Keterlibatan presternal adalah distribusi seboroik klasik dan perjalanannya tetap kronik-kambuhan ringan (bukan mendadak berat, tanpa demam atau tanda psoriasis/tinea), sehingga diagnosis dan disposisi rawat-FKTP dengan ketokonazol topikal tidak berubah. Nilai anti-hafalan: pemicu udara dingin menggantikan stres, durasi lima tahun, situs dada, jawaban produk rambut berbeda, dan vital bergeser jelas dalam koridor normal.

## lab_akne_vulgaris_ringan - status: lolos

- **komedonal_dahi_garis_rambut** - vital td=112/72, nadi=88, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_obat; temuan: kulit
  - keluhanUtama: "Dahi saya sampai dekat garis rambut penuh bruntusan komedo sejak tiga bulan terakhir."
  - jawab `q_keluhan`: "Sejak tiga bulan terakhir, kebanyakan komedo kecil-kecil di dahi sampai dekat garis rambut, ada beberapa bintil merah; tidak ada benjolan dalam atau bekas cekung."
  - jawab `q_obat`: "Hampir tiap hari saya pakai pomade rambut yang berminyak; steroid atau suplemen tidak ada."
  - temuan `kulit`: "Komedo terbuka dan tertutup dominan di dahi hingga batas garis rambut, disertai sedikit papul eritem kecil; tanpa pustul, nodul, kista, atau jaringan parut."
  - rasional: Masih akne vulgaris ringan dominan komedonal tanpa nodul/kista/skar dan tanpa tanda hiperandrogenisme, jadi diagnosis, terapi benzoil peroksida topikal plus edukasi kosmetik, dan rawat-FKTP tidak bergeser. Nilai anti-hafalan: durasi 6 bulan menjadi 3 bulan, distribusi pindah ke dahi/garis rambut mengikuti pola pemakaian pomade, dan campuran lesi menjadi komedonal murni tanpa pustul.
- **hilang_timbul_pipi_dagu** - vital td=124/80, nadi=68, suhu=36.9; keluhanUtama; jawaban: q_keluhan, q_obat, q_psikososial; temuan: kulit
  - keluhanUtama: "Pipi dan dagu saya sering bruntusan komedo dan jerawat kecil, hilang timbul hampir setahun."
  - jawab `q_keluhan`: "Hampir setahun hilang timbul, paling banyak komedo di pipi dan dagu, kadang ada bintil merah kecil bernanah di ujungnya, tapi tidak pernah ada benjolan dalam atau bekas cekung."
  - jawab `q_obat`: "Tidak minum obat atau suplemen; sebulan ini saya pakai pelembap wajah yang kental dan berminyak, steroid tidak pernah."
  - jawab `q_psikososial`: "Kadang malu kalau difoto teman, tapi kegiatan sehari-hari tetap jalan."
  - temuan `kulit`: "Komedo tertutup dominan di pipi dan dagu disertai beberapa papul-pustul kecil superfisial; tanpa nodul, kista, atau jaringan parut."
  - rasional: Tetap akne vulgaris ringan karena komedo tetap dominan dengan hanya beberapa papul-pustul superfisial tanpa nodul/kista/skar, sehingga tatalaksana topikal dan disposisi FKTP sama persis. Nilai anti-hafalan: perjalanan berubah jadi hilang-timbul hampir setahun, lokasi pindah ke pipi-dagu, pemicu kosmetik berganti dari pomade ke pelembap berminyak, dan jawaban psikososial diparafrase agar tak bisa dihafal verbatim.

## lab_miliaria_rubra - status: lolos

- **pemicu_olahraga_baju_ketat** - vital td=124/80, nadi=86, suhu=36.9; keluhanUtama; jawaban: q_keluhan, q_oklusi; temuan: kulit
  - keluhanUtama: "Dada dan punggung muncul bintil merah perih setiap habis olahraga."
  - jawab `q_keluhan`: "Muncul kira-kira seminggu ini, setiap habis olahraga sore badan banyak keringat; bintilnya paling banyak di bagian yang tertutup baju."
  - jawab `q_oklusi`: "Iya, baju olahraga saya ketat dan bahannya tidak menyerap keringat, sering juga tidak langsung ganti setelah selesai."
  - temuan `kulit`: "Papul-vesikel eritem kecil nonfolikular tersebar di dada dan punggung, dominan pada area oklusi pakaian, tanpa pustul."
  - rasional: Pemicu bergeser dari cuaca panas + pakaian kerja tebal ke keringat olahraga + baju ketat tak menyerap, distribusi pindah ke dada-punggung, dan angka vital digeser namun tetap normal-afebris. Morfologi kunci (papul-vesikel nonfolikular tanpa pustul, tanpa demam/nanah/obat baru) utuh sehingga tetap miliaria rubra ringan rawat-FKTP dengan kalamin + edukasi — pemain harus mengenali pola oklusi-keringat, bukan menghafal 'cuaca panas + leher-punggung + 120/78'.
- **oklusi_krim_berminyak_kemarau** - vital td=112/72, nadi=72, rr=16, suhu=36.5, spo2=98; keluhanUtama; jawaban: q_keluhan, q_oklusi; temuan: kulit
  - keluhanUtama: "Leher dan dada muncul bintil merah perih sejak musim kemarau ini."
  - jawab `q_keluhan`: "Sudah hampir dua minggu sejak kemarau panas terik; makin banyak kalau berkeringat, apalagi saya rutin memakai krim badan yang tebal dan berminyak."
  - jawab `q_oklusi`: "Pakaian saya longgar biasa saja, tapi setiap habis mandi saya membalurkan krim badan tebal yang berminyak."
  - temuan `kulit`: "Papul-vesikel eritem kecil nonfolikular di leher dan dada atas, terutama pada area yang rutin dibaluri krim berminyak, tanpa pustul."
  - rasional: Faktor oklusi berpindah ke sisi lain pertanyaan sosial yang sama (krim berminyak, bukan pakaian tebal/ketat), lokasi ke leher-dada, durasi memanjang jadi ±2 minggu, dengan set vital normal yang jelas berbeda. Tetap afebris tanpa pustul/nanah dan tanpa obat sistemik baru sehingga tak ada ambang yang terlewati — diagnosis miliaria rubra, disposisi FKTP, dan tatalaksana konservatif tidak bergeser, sementara hafalan pemicu/durasi/angka dasar terpatahkan.

## lab_vulnus_laseratum_lengan - status: lolos

- **tersayat_cutter_kardus** - vital td=126/82, nadi=88, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_kontaminasi, q_tetanus; temuan: ekstremitas
  - keluhanUtama: "Lengan kiri saya tersayat cutter dua jam lalu."
  - jawab `q_keluhan`: "Cutter-nya meleset waktu saya membuka kardus paket, kena lengan kiri. Langsung saya tekan pakai kain bersih, darahnya sudah berhenti."
  - jawab `q_kontaminasi`: "Tidak ada; mata cutter-nya bersih dan utuh, tidak ada yang patah atau tertinggal di luka."
  - jawab `q_tetanus`: "Saya benar-benar tidak ingat; rasanya belum pernah disuntik tetanus lagi sejak kecil."
  - temuan `ekstremitas`: "Laserasi linear 4 cm di sisi luar lengan bawah kiri, tepi rata, subkutis dangkal, bersih; tendon, saraf, dan pembuluh utuh."
  - rasional: Mekanisme, sisi, ukuran, waktu, dan ingatan tetanus berubah (cutter, lengan kiri, 4 cm, 2 jam, status tak ingat) tetapi tetap laserasi linear dangkal bersih dengan neurovaskular-tendon utuh dalam golden period dan status tetanus tetap wajib profilaksis — diagnosis vulnus laseratum sederhana dan tatalaksana FKTP (irigasi, hecting, profilaksis tetanus) tidak bergeser. Anti-hafalannya: pola 'seng-3cm-1jam' tak bisa diandalkan lagi sehingga pemain harus menilai ulang kontaminasi, benda asing, dan status tetanus dari data.
- **teriris_pisau_dapur** - vital td=118/74, nadi=92, rr=20, suhu=36.9; keluhanUtama; jawaban: q_keluhan, q_kontaminasi, q_tetanus; temuan: ekstremitas
  - keluhanUtama: "Lengan kanan saya teriris pisau dapur setengah jam lalu."
  - jawab `q_keluhan`: "Pisau dapur meleset waktu saya memotong sayur dan mengenai lengan kanan. Langsung saya bilas dengan air mengalir lalu ditekan handuk; sekarang tinggal merembes sedikit."
  - jawab `q_kontaminasi`: "Tidak; pisaunya bersih dan tidak ada apa pun yang tertinggal di luka."
  - jawab `q_tetanus`: "Sudah lama sekali, pokoknya lebih dari sepuluh tahun yang lalu."
  - temuan `ekstremitas`: "Laserasi linear 5 cm di lengan bawah kanan, tepi rata, subkutis dangkal, bersih; rembesan darah minimal berhenti dengan penekanan; tendon, saraf, dan pembuluh utuh."
  - rasional: Pisau dapur bersih, 30 menit, lengan kanan, 5 cm dengan rembesan minimal yang berhenti dengan penekanan tetap luka sayat dangkal bersih dan hemodinamik stabil, dengan tetanus >10 tahun — diagnosis, hecting, dan profilaksis tetanus di FKTP tetap sama, tanpa menyeberang ke red flag (bukan perdarahan menyemprot, bukan luka dalam/terkontaminasi). Nilai anti-hafalannya pada konteks pemicu, sisi, ukuran, waktu, dan perilaku perdarahan yang semuanya berbeda dari kasus dasar.

## lab_katarak_matur - status: lolos

- **manik_putih_disadari_keluarga** - vital td=128/76, nadi=84, suhu=36.8; keluhanUtama; jawaban: q_keluhan; temuan: mata
  - keluhanUtama: "Anak saya kaget lihat tengah mata saya memutih seperti kelereng susu, Dok, jadi saya dipaksa periksa. Penglihatan memang sudah lama berkabut, wajah orang di depan saya saja sudah tidak kenal."
  - jawab `q_keluhan`: "Berubahnya pelan-pelan, Dok, sudah bertahun-tahun, dari kabut tipis jadi putih tebal. Saya sendiri sudah pasrah; ini anak saya yang memaksa ke sini karena katanya tengah mata saya kelihatan putih seperti kelereng susu."
  - temuan `mata`: "Pupil kedua mata putih susu, tampak jelas bahkan dari jarak bicara, kanan lebih padat; refleks fundus hilang sehingga dasar mata tidak dapat dinilai. Mata tenang, tidak merah, bola mata teraba lunak normal."
  - rasional: Penyakit, derajat, dan disposisi tidak bergeser sedikit pun: tetap katarak matur bilateral (kanan lebih padat) pada mata tenang yang wajib dirujuk ke spesialis mata — yang berubah hanya pemicu kunjungan, yaitu keluarga melihat pupil memutih, bukan keluhan fungsional pasien sendiri. Anti-hafalannya: pemain tidak bisa lagi mengenali kasus dari frasa antrian 'tidak bisa membaca' atau angka 138/82.
- **lima_tahun_berhenti_mengaji** - vital td=134/78, nadi=72, rr=16, suhu=36.5; keluhanUtama; jawaban: q_keluhan, q_silau, q_second_sight, q_tetes_warung, q_aktivitas; temuan: umum
  - keluhanUtama: "Mata saya makin lama makin tertutup kabut putih, Dok. Mengaji dan baca koran sudah tidak bisa, turun undakan rumah saja sekarang harus dituntun anak."
  - jawab `q_keluhan`: "Sudah lima tahun lebih, Dok, pelannya bukan main. Mulanya cuma seperti ada selaput tipis, sekarang seperti kabut putih tebal yang tidak mau hilang, dikucek pun tetap."
  - jawab `q_silau`: "Silau sekali, Dok. Sore-sore kena matahari dari barat itu perih silaunya, dan kalau malam papasan lampu mobil rasanya putih semua, jadi saya tidak berani keluar malam."
  - jawab `q_second_sight`: "Iya, ada masa aneh itu, Dok. Kira-kira setahun lalu saya sempat beberapa bulan bisa baca tulisan di bungkus obat tanpa kacamata, saya kira mata saya sembuh. Habis itu malah makin putih berkabut sampai sekarang."
  - jawab `q_tetes_warung`: "Macam-macam sudah saya coba, Dok. Tetes mata dari penjual keliling yang katanya bisa merontokkan katarak, kapsul herbal kiriman anak juga saya minum bertahun-tahun. Tidak ada perubahan sama sekali."
  - jawab `q_aktivitas`: "Membaca sudah tidak bisa sama sekali, mengaji pun berhenti. Orang datang baru saya kenali setelah dia bersuara. Turun undakan atau ke kamar mandi malam hari harus dituntun."
  - temuan `umum`: "Lansia datang dituntun anaknya, meraba-raba tepi meja sebelum duduk; keadaan umum baik, tidak tampak sakit."
  - rasional: Semua jangkar diagnosis dan disposisi dipertahankan — kekeruhan memutih perlahan bertahun-tahun tanpa nyeri, silau berat, episode second sight, mata tenang dengan refleks fundus hilang — sehingga tetap katarak matur yang dirujuk ke spesialis mata. Nilai anti-hafalannya: durasi (lima tahun), waktu second sight (setahun lalu), sumber pengobatan sendiri (penjual keliling + kapsul herbal), dan detail fungsional (mengaji, undakan) semuanya berbeda dari versi dasar.

## diare_akut_bayi_dehidrasi_berat - status: lolos

- **perburukan_cepat_semalam** - vital td=72/44, nadi=178, rr=46, suhu=37.4; keluhanUtama; jawaban: nb_keluhan, nb_frekuensi, nb_kencing, nb_asupan; temuan: kepala_leher, kulit
  - keluhanUtama: "Dok, bayi saya semalaman mencret terus-menerus, sekarang lemas sekali dan hampir tidak mau menyusu."
  - jawab `nb_keluhan`: "Sejak tadi malam BAB-nya cair terus-menerus dan muntah beberapa kali, Dok. Menjelang pagi badannya lemas dan lebih banyak memejamkan mata."
  - jawab `nb_frekuensi`: "Semalaman sampai pagi ini saya hitung lebih dari sepuluh kali BAB cair, muntahnya tiga kali."
  - jawab `nb_kencing`: "Popok terakhir basah sekitar tengah malam, Dok. Setelah itu sampai sekarang kering terus."
  - jawab `nb_asupan`: "Tidak ada, Dok. Bayi saya masih ASI saja, belum pernah saya beri makanan atau minuman lain."
  - temuan `kepala_leher`: "Kedua mata cekung dalam; fontanel anterior cekung; bibir dan mukosa mulut kering sekali."
  - temuan `kulit`: "Cubitan kulit abdomen kembali sangat lambat, sekitar 3 detik; akral dingin; CRT 3 detik."
  - rasional: Perjalanan fulminan satu malam (lebih dari sepuluh kali BAB cair pada bayi ASI eksklusif tanpa pemicu makanan) tetap menampilkan paket lengkap dehidrasi berat WHO — letargis, mata cekung dalam, hampir tak mau menyusu, turgor sangat lambat, popok kering sejak tengah malam — sehingga diagnosis A09, Plan C, dan rujukan anak tidak bergeser. Nilai anti-hafalannya: memutus jangkar kasus dasar (onset kemarin, 8x/4x, pisang kerok nenek, vital 70/40-172-42-37,8) dengan pola onset, frekuensi, pemicu, dan angka vital yang berbeda namun tetap di koridor takikardia-hipoperfusi yang sama.
- **dua_hari_memberat_susu_formula** - vital td=74/42, nadi=166, rr=40, suhu=38.1; keluhanUtama; jawaban: nb_keluhan, nb_frekuensi, nb_minum, nb_kencing, nb_demam, nb_asupan, nb_obat; temuan: umum, kepala_leher
  - keluhanUtama: "Bayi saya mencret sudah dua hari, Dok. Hari ini makin sering, badannya lemas dan hampir tidak mau minum susu."
  - jawab `nb_keluhan`: "Dua hari lalu mulai BAB cair dan sesekali muntah. Hari ini makin sering, badannya lemas sekali dan lebih banyak tidur."
  - jawab `nb_frekuensi`: "Hari pertama tiga sampai empat kali, kemarin enam kali, hari ini sudah tujuh kali BAB cair. Muntahnya lima kali sejak kemarin."
  - jawab `nb_minum`: "Dua hari ini menyusu dan minum dari botolnya makin sebentar. Sejak tadi pagi hampir tidak mau mengisap sama sekali."
  - jawab `nb_kencing`: "Sejak kemarin kencingnya sedikit-sedikit, Dok. Popok terakhir basah sedikit menjelang subuh, sesudah itu kering."
  - jawab `nb_demam`: "Badannya lebih hangat dari biasanya sejak kemarin, tapi perutnya tidak kembung dan muntahnya putih, bukan hijau."
  - jawab `nb_asupan`: "ASI saya mulai berkurang, jadi sejak seminggu ini saya tambah susu formula. Makanan padat belum pernah."
  - jawab `nb_obat`: "Saya hanya menyusui dan memberi susu formulanya sedikit-sedikit. Belum saya beri obat, oralit, atau ramuan."
  - temuan `umum`: "Berat badan 5,6 kg. Bayi letargis, membuka mata sebentar bila dirangsang lalu terkulai lagi, menangis lemah tanpa air mata."
  - temuan `kepala_leher`: "Kedua mata cekung dalam; ubun-ubun depan teraba cekung; lidah dan mukosa mulut kering lengket."
  - rasional: Perjalanan gradual dua hari pada bayi campuran ASI-formula dengan subfebris 38,1 tetap jelas dehidrasi berat — letargis, hampir tidak mengisap, mata cekung dalam, turgor tetap sangat lambat (temuan kulit dasar dipertahankan), popok nyaris kering — tanpa menyeberangi ambang mana pun: tinja tetap tanpa darah, rr 40 di bawah ambang napas cepat, disposisi tetap Plan C plus rujukan. Anti-hafalannya: onset, kurva frekuensi bertahap, konteks pemberian susu, dan seluruh angka vital berbeda dari kasus dasar sehingga pemain dipaksa menilai tanda dehidrasi, bukan mengenali angka hafalan.

