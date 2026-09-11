# Brainstorm UKM — Gameplay, Visual, Keasikan, Presisi, Beban Kognitif

**Tanggal:** 2026-09-11 · **Status:** brainstorm & rencana saja — TIDAK ADA perubahan kode, konten, maupun skor.
**Basis:** PRIMERA 1.2.0, commit `6e9f17c`, REVISI_ENGINE 72, cabang `codex-gpt56-experiment`.
**Pertanyaan dokter:** "Bagaimana gameplay UKM-nya? Secara gameplay, visual, keasikan, maupun presisi, apa yang perlu disorot atau di-upgrade? Ada ide kreatif tapi tidak cognitive overload?"

**Cara saya memeriksa (supaya jelas mana fakta, mana pendapat):**

1. **Memainkan sendiri** di preview browser: Hari 1–3 (peta, roster, kunjungan Bu Wulan lima tahap sampai hasil), lalu melompat ke Hari 16–17 lewat autosave untuk memainkan Posyandu sampai panel penutup.
2. **Orkestrasi 72 agen** dalam lima fase: 5 pembaca subsistem (kader/peta/surveilans, kunjungan, kegiatan, skor/jembatan/ekonomi, dokumen keputusan) → 5 kritikus per dimensi (53 temuan) → 6 generator ide dari sudut pandang berbeda (44 ide) + 3 juri (dosen IKM, desainer game, solo developer) → 52 refuter adversarial atas 14 temuan penting dan 12 ide teratas → 1 sintesis.
3. **Verifikasi mandiri** atas klaim yang akan jadi judul: saya hitung ulang pola jawaban dialog dari PACK, baca gerbang kunjungan ulang, pool kartu Posyandu, koordinat hotspot Pak Slamet, dan kartu skrining TB. Semua terkonfirmasi; angkanya saya pakai di bawah.

Aturan baca: **[D]** display saja (aman kapan pun) · **[K]** konten (CONTENT_RELEASE naik bila menyentuh kunci) · **[E]** engine beku (hanya di jendela Golden Master, REVISI 73).

---

## 0. Ringkasan satu layar

| Dimensi | Skor jujur hari ini | Satu kalimat |
|---|---|---|
| Gameplay | 5,5/10 | Loop mikro (satu kunjungan) kuat; loop makro (skor kegiatan, kader, roster, 90 hari) tipis dan sebagian tanpa ongkos. |
| Visual | 6,5/10 | Identitas dan aksesibilitas kuat; peta, hotspot, dan layar Kegiatan belum "berbicara". |
| Keasikan | 5,5/10 | Pekan 1–5 layak 8, pekan 6–13 layak 3: sesudah arc terakhir tamat, desa kehilangan wajah. |
| Presisi | 6,5/10 | Akurat di angka dan peraturan; rawan salah ajar di kosakata MI, batas peran kader, dan bingkai "wabah 14 hari". |
| Beban kognitif | 5,5/10 | Layar kunjungan sendiri rapi; bebannya di sekelilingnya: klik, istilah, pengulangan Landasan Resmi. |

**Inti temuan dalam satu kalimat:** jantung UKM, yaitu kunjungan rumah lima tahap, sudah bekerja sebagai mesin keputusan yang bertaruh dan berakibat bernama. Lapisan di sekelilingnya belum ikut hidup.

**Tiga hal yang terbukti di kode dan tidak terbantah:**

1. **Nilai UKM timpang.** Kunjungan + Prolanis memasok sekitar 88% dari 35 poin. Per slot siang: Posyandu ≈ 0,18 poin, kunjungan ≈ 0,9, Prolanis ≈ 2,3. Respons KLB memancarkan "krisis dicegah" tanpa dicatat ke tally mana pun. Ini konsekuensi keputusan #5 tanggal 2026-07-16 ("nilai KLB di pemutusan penularan, bukan angka"), jadi butuh keputusan ulang dokter, bukan patch.
2. **Kunjungan ulang gratis.** Hasil partial/gagal tidak memasang jeda, dan narasi kartu yang meleset membocorkan hambatan sebenarnya hari itu juga. Pemain rasional "mengintai" hari ini, "berhasil" besok. Berlaku juga di Mode Ujian.
3. **Tiga permukaan visual menyerempet pilar "tanpa teater".** Choropleth 8 RW terkunci merah bermendung sejak sekitar Hari 4 sampai tamat. Hotspot kunci di rumah Pak Slamet tertimpa hotspot lain. Hotspot idle 26% nyaris tak terlihat sebelum disentuh.

**Kabar baiknya:** hampir semua perbaikan bernilai tinggi murni renderer (Tingkat 1, aman sebelum trial, nol REVISI). Yang menyentuh engine beku menunggu jendela Golden Master dan tanda tangan dokter.

**Yang saya lihat sendiri dan belum ada di dokumen mana pun:** bug P1 kartu Kegiatan terbukti di layar (vonis kartu 1 tampil bersama judul dan opsi kartu 2, opsi benar kartu 2 sudah menyala hijau); delegasi kader menutup sesi tanpa memperlihatkan kartu mana yang kader salah putuskan; dan "Catatan pembimbing" di debrief malam dibuka dengan nomor peraturan, kebalikan dari aturan bahasa yang dokter tetapkan 2 Agustus.

---

## 1. Kekuatan yang jangan disentuh

- **Kunjungan rumah adalah mesin keputusan sungguhan.** Melewati observasi berarti kehilangan hotspot yang mengalahkan kebohongan warga. Gerbang kejujuran membaca trust berjalan, jadi urutan pilihan berpengaruh. Dua gaya terlarang beruntun berarti diusir dan slot hangus. "Berhasil" menuntut hipotesis benar, kartu cocok, dan mutu wawancara ≥ 50. Armor SDOH memangkas trust bila salah sasaran pada keluarga miskin. Ini pola acuan untuk kegiatan lain.
- **Akibat bernama dan terjadwal sejak Hari 1.** Sembilan karma keluarga dengan nama anggota, jarak tenggat dijaga ≥ 1 hari, pasien karma muncul di poli, jalur pemulihan pasca-krisis ada.
- **Tulisan kunjungan.** Sensori, hangat, lucu tanpa murahan, menyambung antar babak (asbak yang hilang di kunjungan pertama muncul lagi sebagai kretek di saku jaket di kunjungan kedua). Epilog ada untuk 16/16 keluarga. Saat saya mainkan, ini bagian terkuat seluruh game.
- **Formula IKS persis Permenkes 39/2016.** IKS keluarga = ya/(ya+tidak) atas indikator yang berlaku, klasifikasi > 0,8 / 0,5–0,8 / < 0,5, IKS wilayah = proporsi keluarga sehat. Menghitung dari status tercatat, bukan status sebenarnya, adalah penyederhanaan sah: data survei yang salah memang meracuni indeks sampai diverifikasi.
- **Konten klinis KLB per rute penularan akurat dan hati-hati.** Registry pola tanpa default droplet; PSN bukan fogging kecuali penularan aktif; kusta = MDT + skrining kontak rahasia + rifampisin dosis tunggal hanya kontak eligible; meningokokus = kemoprofilaksis kontak erat. Posyandu memakai 5 Langkah ILP yang benar.
- **Disiplin token visual dan aksesibilitas.** Satu palet, mode malam dipin ulang khusus kanvas peta, mode aman buta-warna, fokus keyboard global, 27 adegan + 24 potret dijaga test cakupan.
- **Penahan beban yang sudah tepat.** Kartu keluarga melipat indikator kosong ke satu chip dan menahan warna sampai data lengkap. Tas Kunjungan memberi alasan prioritas dalam bahasa pemain. Agenda Besok menutup "tidur buta". Tombol nonaktif selalu menjelaskan alasannya.
- **Keputusan terkunci yang dihormati dosier ini:** GDD §11 (tanpa umpan balik instan per pertanyaan, tanpa framing melawan pasien), D3-lite Prolanis, dokter = manajer bukan enumerator, "tanpa teater", "setiap angka diperoleh atau tidak ada", kunci #12 warna petak 1:1 klasifikasi resmi, de-beacon hotspot #7.

---

## 2. Sorotan per dimensi

### 2a. Gameplay — 5,5

- **Peta nilai timpang** (angka sudah diluruskan refuter). Empat suku UKM: 40% kenaikan IKS desa, 20% rasio kunjungan berhasil, 20% mutu wawancara, 20% fraksi Prolanis terkendali (`scoring.ts:221-231`). Kunjungan + Prolanis ≈ 30,7/35. Bonus Posyandu 0,012 per sesi masuk IKS RW lalu dipotong `max(0, iks − baseline)`, jadi bonusnya "tertunda sampai binaan RW itu sehat", bukan nol. Probe pemain teladan 29 kunjungan: IKS berbasis binaan di 7 dari 8 RW tetap di bawah baseline, artinya kanal "kunjungan → binaan sehat → IKS" hampir tidak menyumbang; suku IKS bergantung pada bonus.
- **KLB memancarkan KARMA_DICEGAH tanpa menaikkan tally** (`reducer.ts:2529` vs `:1577`). Label menjanjikan yang skor tak catat.
- **Delegasi Posyandu tidak menghemat stamina maupun slot** (`reducer.ts:1731`, `:2277`), tetapi surat Hari 15 menjanjikan "bila harimu padat". Saya alami sendiri: delegasi langsung menutup sesi dengan "3/4 keputusan tepat" tanpa menunjukkan kartu mana yang kader salah. Rekaman per kartu sebenarnya ada di state (`KegiatanState.jawaban`), hanya tidak ditampilkan.
- **Kunjungan ulang gratis.** Jeda kontrol hanya dipasang bila berhasil (`kunjungan.ts:642`), gerbang hanya membaca jeda itu (`reducer.ts:1405`). Hari itu juga pemain membaca narasi kartu meleset yang menyebut hambatan sebenarnya, catatan pembimbing kartu, dan vonis "tepat/meleset". Trust naik 6–8 per kunjungan bermutu (76 dari 91 pilihan tepat ber +2), trust awal 2, jadi satu kunjungan sudah melampaui ambang gerbang kejujuran tertinggi (6).
- **Gaya dialog sama dengan vonis.** Hitungan saya dari PACK: Refleksi 45/45 tepat, Empati 37/37, empat gaya terlarang 0/82, Edukasi 9/91; opsi terpanjang adalah opsi benar di 68 dari 85 node. Label "Gaya: ♡ Empati" tampil sesudah memilih, bertabrakan dengan GDD §11 dan dengan catatan audit koherensi dialog 20 Juli yang mengklaim label "tersembunyi sampai debrief". Refuter menurunkan beratnya: respons warga per opsi sudah membuka hasil secara diegetik, dan tuas sebenarnya ada di konten (opsi hangat tidak pernah keliru).
- **Lapis 1 kader: setengah janji GDD §6 terpenuhi.** Pemain memverifikasi data kader (chip ✓/~, petunjuk bias di surat). Setengah lagi belum dibangun dan tidak tercatat dipangkas: penugasan kader mingguan ≤ 8 klik. Tidak ada aksi kader di daftar aksi; ketelitian/bias ditulis sekali dan dibaca sekali. Surat kader bernama berhenti sekitar Hari 7–15 begitu buku survei penuh.
- **Roster 16/16 bukan teater murni**, tetapi ongkosnya tersembunyi: tooltip "Jadikan Binaan" tidak menyebut "keluarga di roster yang ditelantarkan ≥ 7 hari bisa memburuk", dan kandidat panel RW diurut abjad, bukan prioritas. Cap < 16 adalah keputusan lama M13 yang berdampak kalibrasi; jangan diusulkan sebagai fix murah.
- **Pacing:** 26 skenario arc untuk sekitar 88 slot siang. Slot siang kosong tidak berongkos dan tidak tampak. Arc tamat bisa terbuka lagi lewat janji ingkar, tapi stokastik dan tipis.
- **Program Wilayah & Lokmin:** efek positif program tidak pernah bernama (supresi 1 entri/hari dan perisai drift tanpa surat/tally). Panel ongkos oportunitas Lokmin menulis "kamu memilih membiarkannya" untuk kluster penyakit yang tak bisa dicakup program mana pun. Program gratis dan dr. Ratih statis adalah keputusan sengaja, bukan cacat.
- **Prolanis:** satu celah bertahan. Jadwal sesi berjangkar pada hari sesi aktual (+30), bukan kalender; sesi pertama Hari 31 membuat sesi ketiga jatuh di Hari 91 dan hangus tanpa peringatan. Ongkos ≈ 1 poin skor akhir. Klaim "HT 175 tetap tak terkendali" salah; jalur klinik grade A sudah menjadi mekanisme koreksi.

### 2b. Visual — 6,5

- **Bug: hotspot gembok tertimpa hotspot piala di rumah Pak Slamet** (`visualProfiles.ts:147-149`: gembok [59,30], piala [60,34]; jarak pusat ≈ 19 px, cakram 36 px). Gembok adalah hotspot kunci skenario "Kamar yang Selalu Terkunci" untuk indikator jiwa. Tanpa gembok, memilih jawaban empati yang benar mencatat "ya ✓ dokter" palsu. Test hanya menjaga batas koordinat, bukan jarak antar hotspot; ketut_k1 (46 px) hampir bersinggungan.
- **Afordans hotspot idle 26%** (`Kunjungan.css:163-187`): kontras ≈ 2,3:1, di bawah 3:1 WCAG. Hover baru menaikkan ke 85% setelah kursor mendarat di 0,6% luas panggung. Teks pembuka tidak pernah menyebut "klik". Ini ketegangan antara de-beacon #7 dan BUILD_SPECS "lingkaran denyut halus" yang belum direkonsiliasi. Taruhannya: kebohongan warga masuk IKS sebagai ✓ dokter.
- **Choropleth tidak pernah berubah warna.** Dua dari lima keadaan legenda (sehat, pra-sehat) secara aritmetika tak terjangkau; abu-abu hanya Hari 1, pudar Hari 2–3, lalu merah pekat + mendung seragam di 8 RW sampai tamat. Skor menilai kenaikan atas baseline, tetapi peta memetakan IKS absolut. Tanda "!" karma bukan bagian temuan: ia jam pasir jujur yang padam saat kunjungan berhasil.
- **Meter IKS 8 px memakai warna klasifikasi tanpa gerbang data lengkap** (`KartuKeluarga.tsx:150-154`), sementara chip di sebelahnya digerbang. Hari 3: 15 dari 16 kartu chip netral, meter berwarna.
- **Provenance di lapis agregat:** chip klasifikasi memberi "Sehat" hijau penuh kepada keluarga yang 100% datanya laporan kader, karena "terdata" disamakan dengan "terverifikasi". Baris indikator sudah benar (hijau hanya ✓ dokter).
- **Layar Kegiatan tanpa tempat:** kepala panel hanya "POSYANDU / Kartu 1/4", tanpa RW atau hari, padahal tersedia di state. Keputusan jatuh di bawah lipatan pada jendela minimum karena kerangka vertikal, bukan karena stempel.

### 2c. Keasikan — 5,5

- **Gerbang kejujuran tidak punya momen "aku tahu kamu bohong" lewat dialog.** Momen itu sengaja datang dari hotspot. Karena hotspot nyaris tak terlihat, momen ini sering tidak terjadi sama sekali.
- **Delapan kader dengan persona bagus lenyap dari layar sekitar Hari 7–15.** Renderer tidak pernah membaca profil kader; tiga surat engine berbunyi "Kader RW n"; panel RW tidak menyebut kader.
- **Kegiatan memakai pemeran lain dengan kartu yang sama.** Kartu Posyandu Langkah 5 identik di setiap sesi (`kartuPosyandu()`: tiga langkah diundi dari pool, langkah lima konstan). Narasi KLB berotasi 3 varian lintas penyakit. Prolanis "suka makan asin" untuk semua orang, termasuk Bu Wulan yang seluruh arc-nya tentang takut obat.
- **Setelah arc terakhir tamat (sekitar Hari 40), kabar bernama dari desa habis.** Storylet malam 48 aforisme institusional tanpa nama dan tanpa humor ("Tim membaca…", "Petugas menemukan…").
- **Yang sudah ada tapi kurang dikenali:** surat "janji yang ditepati" mencetak id mentah indikator ("hipertensi berobat", "asi eksklusif") dan tidak masuk debrief. Tas Kunjungan, Agenda Besok, dan surat dr. Harsono punya suara yang baik.

### 2d. Presisi — 6,5

Akurat di angka dan peraturan. Tidak ada bug engine. Semua yang rawan adalah keputusan konten/label milik dokter, dirinci di §5.

- Taksonomi gaya dialog (empati/refleksi/edukasi/konfrontasi) tidak setara OARS; chip pasca-pilih mengajarkan kosakata MI yang keliru; "memberi informasi" hampir selalu dinilai salah.
- Resep sosial "pilih satu kartu" memaksa dikotomi palsu: skrining kontak serumah TB pada anak batuk 2 minggu dinilai meleset (kunci kartu Santoso adalah "motivasi", kartu skrining ber-kunci "kesempatan").
- Delegasi Posyandu menyerahkan keputusan klinis (imunisasi saat ISPA ringan, tanda preeklampsia) ke kader dengan 35% keliru.
- Bingkai "sinyal KLB 14 hari" dipakai untuk TB, kusta, IMS, dan surat menegaskan "bukan kebetulan". Untuk penyakit kronis bingkainya adalah investigasi kontak. Kartu aksinya sudah benar.
- Definisi operasional usia PIS-PK untuk indikator KIA tidak diikuti; kartu Prolanis buta besaran parameter.
- Catatan kecil: label "5W1H" padahal isinya Orang-Tempat-Waktu; "PWS" dipakai longgar untuk register penyakit menular; "Laporan W1" adalah laporan dugaan 24 jam, bukan penutup; "Catatan pembimbing" di debrief dibuka dengan nomor KMK.

### 2e. Beban kognitif — 5,5

- Satu blok siang = 21–27 klik untuk 5–6 keputusan; GDD menjanjikan 8–14.
- Pekan pertama memperkenalkan sekitar 35 istilah berlabel dalam tiga hari tanpa kartu onboarding UKM; jargon (PIS-PK, MI, SAJI, KEK, LILA, GDP, PTM) tampil apa adanya.
- Landasan Resmi yang sama diulang tiap kunjungan/kartu, 27× hingga 96× per karier; aside sitasi 40 kata per kartu Resep Sosial tampil sebelum penilaian.
- Surat drift mencetak id mentah indikator (reducer beku); Tas Kunjungan, penopang pemula terbaik, tidak bisa diklik.
- Hampir semua perbaikan murni renderer: melipat, menunda, menautkan, berhenti mengulang. Pola "lipat ke satu chip + tooltip" sudah terbukti di kartu keluarga.

---

## 3. Sepuluh ide terpilih

Dari 44 ide, 12 teratas disanggah dua refuter masing-masing; hanya 4 lolos utuh. Sintesis menggabungkan inti yang bertahan menjadi 10 ide di bawah, urut prioritas. Setiap ide menyebut apa yang dikoreksi refuter supaya dokter tahu mana klaim awal yang gugur.

### Ide 1 — Perbaikan wajib pra-trial: gembok Pak Slamet, instruksi observasi, render kartu Kegiatan dari vonis **[D]**
(a) Geser hotspot piala ke piala sungguhan di bufet (satu baris di `visualProfiles.ts`). (b) Test jarak minimum antar hotspot ≥ 50 px per skenario. (c) Satu kalimat instruksi di pembuka babak 1 ("klik benda yang menarik perhatianmu") + hitungan "0 dari N titik" di Catatan Observasi; N sudah publik lewat aria-label, jadi bukan bocoran. Opsional: opasitas idle ≈ 0,55–0,6 dengan garis tepi statis, dikunci test. (d) Fix P1: `Kegiatan.tsx` merender judul/opsi dari `vonis.kartu`, bukan `kg.kartu[kg.index]`; prasyarat semua ide Kegiatan.
Kerja: kecil. Beban: turun. Catatan sanggahan: sapuan cahaya sekali-tayang ditolak karena membalik keputusan #7; instruksi teks adalah jalan tengahnya.

### Ide 2 — Peta yang jujur: kanal kenaikan per RW, mendung digerbang, legenda hanya yang mungkin, meter dan chip mengikuti provenance **[D]**
(a) Chip "Δ vs baseline" per RW dari `r.iks − proporsiBaselineRoll`, kanal yang benar-benar dinilai skor; warna petak tetap 1:1 klasifikasi resmi (kunci #12). (b) Mendung digerbang "di bawah baseline"; legenda sehat/pra-sehat disembunyikan atau diberi keterangan. (c) Meter IKS kelas netral abu saat data belum lengkap (bukan mengosongkan kelas, karena default meter hijau). (d) Chip klasifikasi hijau penuh hanya bila ≥ 1 indikator bersumber dokter; sisanya berlabel "(laporan kader)".
Kerja: sedang. Beban: turun. Landasan: Rapor sudah memakai kenaikan (kalibrasi #10); peta tinggal mengikuti.

### Ide 3 — PWS-KIA mini: satu kalimat jujur di tombol Posyandu tentang kolom KIA yang masih laporan kader **[D]**
Tombol "Gelar Posyandu" tampil sama untuk semua RW, padahal engine hanya memutakhirkan tiga indikator KIA pada keluarga bersumber kader, dan 4 RW tidak punya sasaran KIA sama sekali. Tambahkan kalimat terhitung: "N kolom KIA di RW ini masih laporan kader; meja yang terbuka ditarik saat sesi, jadi tak semuanya pasti tercocokkan" atau "tak ada kolom KIA berlaporan kader di RW ini; sesi tidak mengubah data keluarga". Satu baris di Lokmin. Skor juri tertinggi (8,08).
Kerja: kecil. Beban: turun. Catatan sanggahan: konstanta indikator KIA tidak diekspor dari reducer, salin 3 id dengan test paritas; jangan menulis "akan diverifikasi".

### Ide 4 — Kader bernama di permukaan yang masih anonim, tanpa membocorkan bias **[D]**
Helper `kaderRw(rw)` membaca `state.desa.kader`. Panel RW: "Kader: Bu Endang". Kotak Masuk: pengirim "Kader RW n" dari tiga surat engine dirender bernama lewat pemetaan tampilan (data surat tak diubah). Chip "Surveilans" untuk surat dari Petugas Surveilans (memperbaiki label salah "Laporan Kader"). Tas Kunjungan: "Kabar dari wilayah Bu Endang (kader RW 5)". Persona dan ketelitian tidak ditampilkan. Nama kader di kepala Posyandu ditunda sampai delegasi membaca ketelitian kader.
Kerja: kecil. Beban: nol. Catatan sanggahan: kartu kenalan 8 kader ditolak karena stereotip profesi/usia membocorkan ketelitian. Tabrakan nama: kader Pak Slamet RW 2 vs Keluarga Pak Slamet RW 4, Bu Ketut Ayu RW 7 vs Keluarga Pak Ketut RW 7 (pertanyaan 3).

### Ide 5 — Berkas kasus di dalam Respons KLB: daftar orang dari diagnosismu sendiri, RW di kepala panel **[D]**
Saat sesi KLB, tampilkan entri surveilans yang cocok (RW, penyakit, 14 hari), per orang, "Hari n · Nama (2 kunjungan)". Angka "tercatat" dari `hitungCluster` supaya sama dengan chip peta. Kepala panel: "RW n · Kampung X · penyakit Y". Kalimat pengantar: "terkonfirmasi di poli; yang belum ada: definisi kasus dan kasus yang belum datang ke poli", menopang opsi benar kartu verifikasi.
Kerja: kecil–sedang. Beban: naik kecil, terjustifikasi (nama yang sudah dikenal dari poli). Catatan sanggahan: JANGAN tampilkan ambang penyakit (angka kalibrasi keterjangkauan, bukan peraturan); "Laporan W1" penutup ditolak karena jalur sukses menghapus entri surveilans.

### Ide 6 — Koreksi atas laporan kader mendapat nama dan kolom, hanya untuk yang benar-benar diverifikasi **[D]**
Di store UI saat kunjungan/Posyandu selesai, bandingkan state sebelum/sesudah; untuk kunjungan BATASI ke `hasil.indikatorTerverifikasi` supaya warga yang berbohong tidak dicatat sebagai kesalahan kader. Tampilkan di modal hasil: "Kolom Imunisasi dari laporan Bu Endang, kader RW 5: tercatat ya, kamu lihat sendiri tidak." Bahasa metode, bukan vonis orang.
Kerja: sedang. Beban: nol. Catatan sanggahan: hanya hidup satu sesi (persistensi = field state baru = REVISI 73). Keputusan dokter: menamai kolom membuka pola bias kader dalam 2–3 koreksi (pertanyaan 4).

### Ide 7 — Lokmin dan Rapor yang tidak menuduh dan tidak menyembunyikan **[D]**
Panel ongkos oportunitas Lokmin dipecah dua daftar: kluster penyakit target di RW lain ("dana bulan ini hanya bekerja di RW yang kamu pilih") vs kluster non-target ("tidak ada program untuk X, butuh Respons KLB"). Penanda RW fokus di peta. Rapor UKM menampilkan jumlah sesi Posyandu/Prolanis/KLB dari tally yang sudah ada. "Slot siang kosong: n" di Lokmin.
Kerja: kecil–sedang. Beban: turun. Catatan sanggahan: jangan usulkan biaya stamina/kas untuk program (keputusan sengaja); tally "entri diredam" butuh reducer (Golden Master).

### Ide 8 — Prolanis: peringatan jadwal "sesi ke-k dari 3; tunda satu hari berarti sesi ke-3 jatuh di luar stase" **[D]**
Di tombol Prolanis dan Jejak Perawatan, hitung dari `sesiBerikutHari` + 30·(3−k) vs 90. Tambah test cadence terlambat.
Kerja: kecil. Beban: nol. Catatan sanggahan: jangkar ke kalender (D30/60/90) = reducer beku, Golden Master.

### Ide 9 — Label gaya MI pindah ke debrief sore; kalimat sambung stok dinetralkan; tooltip "Jadikan Binaan" dan urutan kandidat dijujurkan **[D]**
(a) Label "Gaya: ♡ Empati" pasca-pilih dipindah ke debrief sore per kunjungan, menyamakan kode dengan GDD §11. (b) Kalimat stok "Percakapan terasa lebih terbuka / Suasana menegang" dihapus. (c) Tooltip "Jadikan Binaan" menyebut konsekuensi 7 hari. (d) Kandidat panel RW diurut prioritas Tas Kunjungan.
Kerja: kecil. Beban: turun. Catatan sanggahan: memindahkan label tidak mengembalikan "keputusan", korelasi adalah sifat konten; opsi "refleksi keliru / edukasi tepat" = Tingkat 2, keputusan dokter.

### Ide 10 — Tutup kebocoran kunjungan ulang: tunda narasi kartu meleset dan vonis (display-only sekarang), jeda partial/gagal di jendela REVISI **[D sekarang, E nanti]**
Tahap D: narasi kartu meleset, catatan pembimbing kartu, dan vonis "tepat/meleset" tidak dirender hari itu untuk keluarga yang arc-nya belum tamat; tampil penuh di debrief kunjungan berikutnya di keluarga yang sama. Mode Ujian ikut. Tahap E (REVISI 73): partial/gagal memasang jeda +2/+3 hari, plafon trust kunjungan ulang skenario sama, penundaan karma ditutup bila kartu meleset.
Kerja: kecil (D) / sedang (E). Beban: nol. GDD §11 tetap terjaga: umpan balik pindah ke debrief berikutnya, tidak dihapus.

---

## 4. Ide yang ditolak dan alasannya

- **Alamat pasien di lembar periksa + stempel "kasus ke-n dari RW ini".** RW pasien diundi seragam 1–8; chip RW mengajari anchoring pada isyarat yang palsu di dunia game; 14 dari 23 kasus menular formatif tak pernah masuk surveilans.
- **Register PWS per RW sebelum alarm.** `state.desa.surveilans` bukan register: engine membuang entri (supresi program, KLB tuntas); 67% entri adalah orang yang sama kembali; register append-only = state beku.
- **"Laporan W1" sebagai penutup KLB.** Jalur sukses menghapus entri surveilans pada langkah yang sama; W1 adalah laporan dugaan 24 jam.
- **Krisis yang dicegah mendapat paragraf "yang tidak terjadi".** Jalur KARMA_DICEGAH di modal kunjungan adalah kode mati untuk konten sekarang; bingkai kontrafaktual tingkat individu dilarang assurance 19 Juli; epilog berhasil sudah ada di 16/16 keluarga.
- **Sapuan cahaya hotspot sekali tayang.** Membalik keputusan de-beacon #7; "buku saku" bertabrakan nama dengan Dex SKDI.
- **Hapus stempel TEPAT/KELIRU per kartu Kegiatan.** 21 dari 38 opsi salah tidak memuat kata vonis di teks responsnya; tanpa stempel mahasiswa baru tahu tiga kartu kemudian; bagian "render dari vonis.kartu" dilebur ke Ide 1.
- **Kepala lembar kunjungan "terakhir kali di rumah ini".** Slot "janji yang menunggu" mustahil tampil (janji hanya saat arc tamat, dan arc tamat menolak kunjungan); pemain datang dari kartu keluarga yang sudah menampilkan semuanya.
- **Kartu kenalan 8 kader.** Stereotip profesi/usia membocorkan ketelitian; localStorage per instalasi gagal untuk 50 mahasiswa berbagi PC.
- **Hasil Prolanis lahir dari persiapan di rumah.** Bertabrakan dengan keputusan D3-lite; menyentuh `kegiatan.ts` beku.
- **Kurva mini surveilans di kartu KLB.** Kembar Ide 5; kurva ditolak bersama register PWS.
- **Jarak memakan slot sore, cap roster < 16.** Bukan ditolak, tetapi bukan fix murah: keputusan desain dokter yang berdampak kalibrasi (EKSPEKTASI_KUNJUNGAN 24, target IKS 0,115); GDD.md baris 45 vs 110–111 saling bertentangan.
- **Disimpan untuk putaran berikutnya (belum diuji sanggahan):** delegasi Posyandu bertingkat/supervisi (kegiatan.ts beku, tapi selaras temuan presisi), Rapor berbahasa kompetensi, pemangkasan klik & Landasan Resmi (display-only, layak tapi belum diverifikasi), kasus dingin kluster yang padam, kabar desa pasca-tuntas (konten, butuh penulis), rumor kader yang harus diverifikasi (engine, ide terbaik secara desain dan paling mustahil untuk rilis ini).

---

## 5. Presisi: tujuh hal yang butuh keputusan dokter

1. **Kosakata MI.** Taksonomi empati/refleksi/edukasi/konfrontasi tidak setara OARS (Open questions, Affirmations, Reflections, Summaries). Chip pasca-pilih mengajarkan label yang keliru, dan "memberi informasi" hampir selalu salah (9/91). Pilihan: pertahankan taksonomi game dengan nama yang tidak mengklaim MI, atau tulis ulang opsi agar ada refleksi salah-waktu dan edukasi tepat ala elicit-provide-elicit.
2. **Resep Sosial dikotomi palsu.** Skrining kontak serumah TB pada anak batuk 2 minggu adalah standar program, tetapi dinilai meleset. Kartu mana yang "juga benar", dan bagaimana engine memberi kredit (kunci jawaban berubah → CONTENT_RELEASE naik). Alternatif tanpa engine: tulis skrining Bagas sebagai langkah yang otomatis terjadi di penutup dan pembuka kunjungan berikutnya.
3. **Delegasi Posyandu menyerahkan keputusan klinis ke kader** (imunisasi saat ISPA ringan, tanda preeklampsia), bertentangan dengan batas peran kader Permenkes 19/2024 yang dicatat riset repo sendiri. Batasi ke kartu ukur/catat/penyuluhan (kegiatan.ts beku → Golden Master). Sementara itu, teks surat Hari 15 dan tombol delegasi berhenti menjanjikan kelegaan waktu yang tidak ada.
4. **Bingkai "sinyal KLB 14 hari" untuk TB, kusta, IMS.** Surat menegaskan "bukan kebetulan"; untuk penyakit kronis bingkainya investigasi kontak. Kartu aksi sudah benar. Label bisa dipetakan di renderer per kasus tanpa menyentuh reducer.
5. **Definisi usia PIS-PK untuk indikator KIA** (imunisasi dasar 12–23 bulan, ASI eksklusif 7–23 bulan, pemantauan tumbuh kembang 2–59 bulan) tidak diikuti. Sesuaikan usia anggota di konten, atau pasang "na" manual (konten keluarga → CONTENT_RELEASE).
6. **Kartu Prolanis buta besaran parameter.** Keputusan tidak pernah membaca angka TD/GDP peserta. Sebagai konten, minimal satu kalimat angka di narasi kartu (kegiatan.ts beku → Golden Master) atau catatan di Panduan Dosen.
7. **KLB memancarkan "krisis dicegah" tanpa dicatat tally.** Bukan presisi klinis, tetapi butuh dokter karena "nilai KLB di pemutusan penularan, bukan angka" adalah keputusan 16 Juli.

Catatan kecil yang tidak salah tapi rawan: label "5W1H"; "PWS" untuk register penyakit menular (historis alat KIA; SKDR/W2 lebih tepat); "Laporan W1" jangan dipakai sebagai penutup; surat "janji ditepati" mencetak id mentah; "Catatan pembimbing" dibuka dengan "Adaptasi beralasan: KMK RI HK.01.07/MENKES/303/2026…" (sumber teks di `ukmCitations.ts:257`), kebalikan aturan "makna dulu, nomor peraturan belakangan".

---

## 6. Rencana bertingkat (belum dikerjakan, menunggu persetujuan)

### Tingkat 1 — display-only, aman pra-trial, nol REVISI, nol CONTENT_RELEASE (urut prioritas)
1. Fix P1 `Kegiatan.tsx`: render judul/opsi dari `vonis.kartu`.
2. Geser hotspot piala Pak Slamet + test jarak minimum antar hotspot.
3. Instruksi "klik benda yang menarik perhatianmu" + hitungan "0 dari N titik"; opsional opasitas idle ≥ 3:1, dikunci test.
4. Peta: chip Δ vs baseline per RW, mendung digerbang, legenda hanya yang mungkin, meter netral saat sementara, chip klasifikasi hijau hanya bila ada ✓ dokter.
5. PWS-KIA mini di tombol Posyandu + satu baris Lokmin.
6. Kader bernama: panel RW, pemetaan "Kader RW n" di Kotak Masuk, chip Surveilans, Tas Kunjungan.
7. Berkas kasus KLB: daftar orang + "tercatat" + RW/penyakit di kepala panel; tanpa ambang, tanpa W1.
8. Koreksi kader bernama di modal hasil kunjungan dan panel hasil Posyandu, dibatasi indikator terverifikasi; sekalian tampilkan kartu mana yang kader salah saat delegasi (data sudah ada di `jawaban`).
9. Lokmin/Rapor: panel ongkos dua daftar, penanda RW fokus, jumlah sesi, slot siang kosong.
10. Prolanis: "sesi ke-k/3, terakhir yang masih mungkin hari X" + test cadence terlambat.
11. Label gaya ke debrief; kalimat stok dinetralkan; tooltip Jadikan Binaan; kandidat diurut prioritas.
12. Tunda narasi kartu meleset, catatan pembimbing kartu, dan vonis ke debrief kunjungan berikutnya (mode Ujian ikut).
13. Copy: "Catatan pembimbing" ditulis ulang makna dulu; pemetaan tampilan untuk teks surat beku yang menyesatkan (Hari 15 "bila harimu padat", Hari 30 "bulanan", label "Sinyal KLB" untuk TB/kusta/IMS) bila dokter setuju kalimat penggantinya.

### Tingkat 2 — konten, butuh keputusan/tanda tangan dokter
- Ganti nama kader Pak Slamet (dan pertimbangkan Bu Ketut Ayu); nama kader tidak masuk hash sidik jari, nol CONTENT_RELEASE.
- Opsi wawancara: refleksi salah-waktu dan edukasi tepat di sebagian node; perluas test koherensi dialog dengan plafon "hangat tepat < 100%". Menunggu keputusan taksonomi.
- Resep Sosial: tandai kartu yang "juga sesuai standar program" (kunci berubah).
- Narasi kartu meleset berhenti menyebut hambatan sebenarnya sebelum arc tamat.
- Definisi usia PIS-PK KIA; kalimat besaran parameter di narasi Prolanis (bila dokter mau).
- Kabar desa pasca-tuntas dan storylet malam bernama (butuh penulis; menjawab kesunyian Hari 40–90 tanpa engine).
- Label "Investigasi kontak" vs "Sinyal KLB" per penyakit; kalimat pengganti surat Hari 15/30.

### Tingkat 3 — jendela REVISI_ENGINE (Golden Master, bump 73), semua keputusan dokter dulu
- Jeda follow-up partial/gagal + plafon trust kunjungan ulang + penundaan karma ditutup bila kartu meleset.
- `klbTuntas` dihitung ke `tally.karmaDicegah`, atau Posyandu/KLB masuk suku skor sebagai rasio ternormalisasi seperti Prolanis (keputusan ulang #5).
- Delegasi Posyandu membaca ketelitian kader RW, dibatasi ke kartu non-klinis, dan mengembalikan 1 stamina.
- Jangkar sesi Prolanis ke kalender (D30/60/90) alih-alih hari sesi + 30.
- Tally supresi program dan perisai drift per bulan → baris positif di Lokmin; surat "janji ditepati" memakai label indikator, bukan id mentah.
- Setengah Lapis 1 yang belum dibangun: satu aksi sore "Bimbing kader RW n" berkuota mingguan.
- Selaraskan GDD §3 vs §6 soal ongkos RW terpencil.

### Tidak dikerjakan
- Semua ide di §4; menampilkan ambang kluster di layar mana pun; biaya stamina/kas untuk Program Wilayah; dr. Ratih dinamis; framing melawan pasien; umpan balik instan per pertanyaan; trust dari frekuensi; cap roster < 16 tanpa kalibrasi ulang; denyut abadi pada hotspot.

---

## 7. Pertanyaan untuk dokter (jawab bernomor saja)

1. **Posyandu dan KLB:** apakah keputusan #5 (16 Juli, "nilai KLB di pemutusan penularan, bukan angka") tetap berlaku, sementara KLB memancarkan "krisis dicegah" tanpa dicatat dan Posyandu bernilai ≈ 0,18 poin/slot vs Prolanis ≈ 2,3? (Rekomendasi: putuskan ulang di Golden Master; `klbTuntas` masuk tally karma dicegah; Posyandu dinilai lewat jumlah keluarga KIA yang berpindah provenance kader→dokter. Pra-trial cukup Tingkat 1.)
2. **Kunjungan ulang gratis:** setuju partial/gagal memasang jeda 2–3 hari dan trust kunjungan ulang diberi plafon (engine beku)? Sementara itu, bolehkah narasi kartu meleset dan vonis ditunda ke debrief kunjungan berikutnya? (Rekomendasi: ya untuk keduanya; tunda-tampil masuk Tingkat 1 sekarang.)
3. **Nama kader:** bolehkah kader Pak Slamet RW 2 diganti nama, dan Bu Ketut Ayu RW 7 dipertimbangkan? (Rekomendasi: ya; nol CONTENT_RELEASE; bila ditolak, sufiks "— kader RW n" wajib di semua permukaan.)
4. **Koreksi laporan kader:** bolehkah kalimat di modal hasil menyebut KOLOM-nya, yang membuka pola bias kader dalam 2–3 koreksi? (Rekomendasi: ya, bahasa metode bukan vonis orang, hanya untuk indikator yang benar-benar diverifikasi.)
5. **Ambang kluster:** boleh tampil di berkas KLB? (Rekomendasi: tidak; ia angka kalibrasi, dan menampilkannya memotong pelajaran kartu verifikasi.)
6. **Kosakata MI:** pertahankan 4 gaya sebagai "gaya percakapan" (bukan "teknik MI") dan tambah minimal 6–8 node ber-edukasi tepat, atau tulis ulang taksonomi ke OARS? (Rekomendasi: yang pertama; label ke debrief sekarang.)
7. **Delegasi Posyandu:** dibatasi ke kartu ukur/catat/penyuluhan, membaca ketelitian kader, dan mengembalikan 1 stamina? (Rekomendasi: ya ketiganya di Golden Master; pra-trial, surat Hari 15 dan tombol delegasi berhenti menjanjikan kelegaan, dan panel penutup menunjukkan kartu mana yang kader salah.)
8. **Bingkai KLB untuk TB/kusta/IMS:** ganti label "Investigasi kontak" lewat pemetaan renderer per kasus? (Rekomendasi: ya, setelah dokter menyetujui daftar penyakit dan kalimatnya; sekalian "5W1H" → "Orang-Tempat-Waktu".)

---

## 8. Lampiran — jejak metode

| Fase | Agen | Hasil |
|---|---|---|
| Peta subsistem | 5 | kader/peta/surveilans, kunjungan, kegiatan, skor/jembatan/ekonomi, register keputusan |
| Kritikus per dimensi | 5 | 53 temuan (gameplay 11, visual 10, keasikan 11, presisi 10, beban 11) |
| Generator ide | 6 | 44 ide (detektif epidemiologi 7, juice tanpa mekanik 7, Harvest Moon 7, pengurangan 8, pedagogi IKM 8, Football Manager 7) |
| Juri | 3 | skor 5 sumbu per ide; 2 ide dibuang karena tabrakan ≥ 2 juri |
| Refuter temuan | 28 | 13 dari 14 temuan penting bertahan, 1 gugur, banyak angka diluruskan |
| Refuter ide | 24 | 4 dari 12 lolos utuh; inti yang bertahan dilebur sintesis |
| Sintesis | 1 | 10 ide, 12 penolakan, 7 presisi, rencana 4 tingkat, 8 pertanyaan |

Peringkat juri sebelum sanggahan (10 teratas dari 44): PWS-KIA mini 8,08 · alamat pasien di poli 7,98 (ditolak refuter) · berkas KLB 7,95 · register PWS 7,85 (ditolak) · laporan tanding KLB 7,73 (dilebur ke berkas KLB) · krisis dicegah bernama 7,63 (ditolak) · kartu KLB baca surveilans 7,63 (dilebur) · buku saku observasi 7,63 (ditolak sebagian) · audit data kader 7,57 (bertahan) · hapus stempel Kegiatan 7,57 (ditolak).

Pelajaran metode untuk sesi berikutnya: sanggahan mengubah rencana secara material lagi (angka "97%" jadi 88%, "roster teater" jadi "ongkos tersembunyi", "HT tetap tak terkendali" salah). Angka di dosier ini adalah angka pasca-sanggahan, dan yang jadi judul sudah saya hitung ulang sendiri.
