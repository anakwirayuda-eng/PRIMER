# Dosier Menyeluruh — Segala Pertanyaan Terbuka Menuju Full Trial
**Disusun:** 2026-08-22 · **Diminta oleh:** dr. Anak Agung Bagus Wirayuda, eksplisit: *"jangan dibatasi... termasuk adjudikasi-adjudikasi dan keputusan-keputusan klinis mau saya sapu supaya saya pribadi bisa maju ke tahap full trial to the end per hari ini."*

---

## 0. Cara memakai dosier ini

Ini BUKAN daftar tambahan di samping dosier koding tanggal yang sama (`DEEPTHINK_TRIANGULASI_KODING_2026-08-22.md`) — dosier ini **menggantikannya sebagai titik masuk tunggal**: seluruh isi dosier koding ada di §5 di bawah (dipadatkan tapi lengkap), plus lapisan baru yang lebih penting untuk tujuan hari ini: **apa saja yang benar-benar menahan proyek ini dari status "siap full trial"**, bukan cuma pertanyaan presisi kode.

Tidak ada yang sengaja disaring. Repo ini eksplisit berstatus lab/percobaan, dan permintaannya adalah menyapu bersih backlog adjudikasi supaya keputusan bisa diambil hari ini — jadi dosier ini memuat *setiap* pertanyaan terbuka yang saya (Claude) ketahui per hari ini, termasuk yang murni akademis-presisi dan yang murni strategis-operasional, tanpa menimbang dulu mana yang "layak ditanyakan".

**Struktur:**
- §1 — konteks produk & mekanisme kunci (untuk pembaca tanpa akses repo)
- §2 — sejarah singkat: bagaimana proyek ini sampai di titik sekarang
- §3 — **PERTANYAAN PALING BESAR**: jalur ke full trial hari ini (121 dari 137 kasus lab belum ditandatangani dokter)
- §4 — tata kelola penyegelan ulang amplop m13-1a (terkait langsung §3)
- §5 — 7 pertanyaan koding/desain presisi (dari dosier sebelumnya, dipadatkan)
- §6 — 1 pertanyaan klinis baru: arah drift diabetes tak terkendali
- §7 — lampiran: peta berkas & keputusan yang SUDAH diambil (agar tak diadjudikasi dua kali)

---

## 1. Konteks produk & mekanisme kunci

**PRIMERA** adalah game edukasi kedokteran Indonesia: simulasi rotasi dokter di FKTP (Puskesmas) untuk mahasiswa kedokteran, dengan dua sisi gameplay — **UKP** (pelayanan perorangan: diagnosis-terapi pasien poli/IGD) dan **UKM** (kesehatan masyarakat: kunjungan keluarga, Posyandu/Prolanis, surveilans wabah). Skor akhir 4 dimensi: UKP 35 + UKM 35 + Manajemen 15 + Resiliensi 15 = 100.

**Mekanisme integritas yang relevan untuk dosier ini:**

- **`skdi144` vs `kasus`.** `skdi144` = katalog 144 kompetensi wajib FKTP dari KMK 1186/2022 — barisnya kadang setingkat *sindrom* ("Sindroma Duh Genital"), bukan diagnosis presisi. `kasus` = vignette klinis yang dimainkan, dengan fenotipe spesifik. Bila kode kasus lebih spesifik dari kode katalog, itu didaftarkan eksplisit di allowlist **`GENERIK_SENGAJA`** (`pack.test.ts`, 13 entri) — mekanisme yang sudah matang untuk menampung divergensi katalog-vs-kasus.

- **Freeze / `REVISI_ENGINE`.** 18 berkas engine yang menentukan hasil replay (reducer, scoring, kegiatan, kunjungan, dll.) di-hash-lock. Setiap perubahan wajib: bump `REVISI_ENGINE` + refresh hash + changelog bertanggal. Ini melindungi **verifiability dosier mahasiswa** — dosier ditandatangani HMAC dan direplay lawan build engine saat itu. Build lama yang tak cocok jatuh ke status **`tidak_dapat_diverifikasi`** (netral, bukan tuduhan curang) — perbedaan yang pernah jadi pelajaran mahal (insiden beta.17: kunci jawaban berubah tanpa `CONTENT_RELEASE` naik → mahasiswa jujur divonis `tidak_sah`/curang).

- **Amplop tanda tangan dokter (m13-1a).** Slice kurikulum `m13-1a` (Career-only, 9 envelope: 5 klinik, 1 IGD, 1 UKM, dst.) dilindungi hash SHA-256 atas payload kanonik. Gerbang `fail-closed` menolak aktivasi bila isi berubah setelah ditandatangani. **Aturan berlaku (preseden commit `db25f00`): penyegelan ulang hanya atas perintah dokter — bukan wewenang pengembang.** Mekanisme ini sudah 2× terbukti bekerja (menolak perubahan diam-diam).

- **Adjudikasi 137 kasus lab.** Katalog kasus prototipe (`lab_prototype_unadjudicated`, Career-only, tak masuk Ujian) sedang direview dokter satu-per-satu sejak akhir Juli. **Status hari ini: 16/137 disetujui-dengan-edit, 121 masih formatif** (belum direview individual oleh dokter). "Compiler bilang 137/137 cocok" (artinya: lolos validasi struktural mekanis) **≠** persetujuan dokter — dua hal yang berbeda dan sengaja dipisah statusnya di kode.

- **Model delegasi yang sudah terbukti.** 21-22 Agustus, dokter mendelegasikan 10 keputusan klinis/kalibrasi eksplisit ke Claude dengan mandat *"sebijak, seakurat, selogis mungkin"*, direkam lengkap dasarnya di `docs/ADJUDIKASI_DELEGASI_2026-08-21.md`, **vetoable kapan pun**. Ini preseden yang berhasil — dan relevan langsung untuk §3 di bawah: pertanyaannya sekarang adalah **apakah pola ini bisa diperluas ke 121 kasus yang belum diadjudikasi**, bukan diulang satu-per-satu.

---

## 2. Sejarah singkat (agar pembaca tanpa konteks bisa mengikuti)

Timeline dipadatkan dari log commit & memori proyek (detail penuh ada di git log branch `codex-gpt56-experiment` dan `docs/PROSEDUR_RILIS.md`):

1. **Akhir Juli – awal Agustus:** adjudikasi 137 kasus lab dimulai, dokter mereview satu-per-satu; 16 selesai, "case 17" jadi penanda berhenti.
2. **1-6 Agustus (beta.4→beta.17):** rangkaian audit CODEX eksternal + bug-hunt internal (58-65 agen per gelombang), tiap temuan diverifikasi adversarial sebelum ditindaklanjuti. Pola berulang yang tercatat sebagai pelajaran: **sanggahan adversarial mengubah rencana secara material** (bukan sekadar konfirmasi) — beberapa "perbaikan" awal ternyata salah dan dibatalkan sendiri setelah diperiksa lebih dalam.
3. **6 Agustus (beta.17):** insiden serius — kunci jawaban berubah tanpa `CONTENT_RELEASE` naik, sehingga save lama bisa divonis `tidak_sah` (tuduhan curang) alih-alih `tidak_dapat_diverifikasi` (netral). Diperbaiki, jadi pelajaran permanen soal disiplin versioning.
4. **21 Agustus:** bug hunt 10-dimensi (65 agen, 46 temuan, 0 P0). Delegasi 8 keputusan klinis eksplisit ke Claude. Audit label distraktor menyeluruh (49 label bermasalah diperbaiki). Deep research koding ICD-10 (9 kode diluruskan ke WHO). Rilis 1.2.0 dibangun & terpasang.
5. **22 Agustus (hari ini):** delegasi keputusan #9 (rinitis alergi) dan #10 (kalibrasi IKS). Audit UKM 6-agen (22 temuan, 18 nyata, 12 diperbaiki: 2 P1 replay-exploit & surveilans-orang-vs-encounter, 10 lainnya). Dosier koding 7-pertanyaan ditulis. **Sekarang:** permintaan untuk menyapu SELURUH backlog adjudikasi menuju full trial.

**Pelajaran proses yang berulang dan mahal** (dicatat agar tak diulang saat menjawab dosier ini): (a) jangan percaya angka dari laporan agen tanpa verifikasi independen; (b) periksa dulu apakah sesuatu sudah jadi kebijakan teradjudikasi sebelum menimpanya dengan bukti sepihak — pola "fix M6 ter-revert diam-diam" pernah terjadi dan mahal diperbaiki; (c) unit test hijau ≠ fitur bekerja untuk hal yang menyentuh DOM/runtime nyata; (d) verifikasi angka dihitung ulang dari kode, bukan disalin dari klaim.

---

## 3. PERTANYAAN PALING BESAR — jalur ke "full trial" hari ini

### Fakta
- 137 kasus lab total. **16 disetujui dokter. 121 belum** (formatif — sudah lolos validasi struktural/mekanis penuh, tapi belum direview klinis oleh manusia berkompeten).
- Laju adjudikasi manual sejauh ini: 16 kasus dalam kira-kira 3 minggu kerja dokter di sela kesibukan lain. Pada laju itu, 121 sisanya secara realistis **bukan pekerjaan satu hari** bila dilakukan dengan rigor identik (review baris-demi-baris tiap vignette, obat, dosis, disposisi, sitasi).
- Tapi: sistem *sudah* punya jalur verifikasi non-manual yang terbukti bekerja — bug-hunt multi-agen dengan sanggahan adversarial wajib (dipakai berulang kali sejak awal Agustus, pola yang konsisten menangkap kesalahan DAN mengoreksi rencana yang keliru sebelum diterapkan). Dan delegasi eksplisit 10-keputusan (21-22 Agustus) menunjukkan dokter bisa mendelegasikan penilaian klinis ke Claude untuk kelas masalah tertentu, dengan hasil yang sejauh ini tidak pernah diveto.
- Konten 121 kasus ini **bukan konten sembarangan** — ia sudah lolos: validasi struktural (skema TypeScript penuh), validasi provenance (sitasi wajib per kasus, tier LANGSUNG/TERKAIT/PEDOMAN-DASAR), validasi cross-reference (ICD-10 vs katalog SKDI, obat vs formularium), dan berbagai audit sapuan-kelas (desync lab, tag edukasi salah kategori, dll. — lihat §7). Yang BELUM terjadi murni "seorang dokter membaca vignette ini dan bilang ya, ini akurat secara klinis."

### Ketegangannya
Menunggu 121 tanda tangan manual satu-per-satu = paling aman, tapi realistanya menunda "full trial" tanpa batas waktu jelas, dan repo ini eksplisit berstatus lab/percobaan yang penulisnya sendiri ingin bergerak cepat hari ini. Melompat langsung ke trial tanpa validasi apa pun = cepat tapi berisiko mengekspos mahasiswa ke kesalahan klinis yang belum tertangkap (dosis salah, kontraindikasi terlewat, dll.) — persis kelas kesalahan yang audit-audit sebelumnya berhasil temukan dan perbaiki SEBELUM konten itu bertemu mahasiswa.

### Empat jalur yang mungkin (bukan daftar lengkap — DeepThink/dokter boleh mengusulkan yang lain)

**Jalur A — Review manual penuh, satu-per-satu, seperti 16 kasus pertama.**
Paling aman, paling lambat. Realistanya bukan "hari ini". Cocok bila dokter menilai tak ada substitusi yang cukup ketat untuk otoritas klinisnya sendiri per kasus.

**Jalur B — Review berbasis risiko: dokter pribadi hanya menyentuh kasus bertaruhan tinggi.**
Dokter mereview manual hanya kasus yang salah-arahnya bisa fatal atau nyaris-fatal (IGD, obstetri darurat, pediatri, obat berjendela-sempit) — sisanya (diagnosis banding rutin tier-4A, kompetensi umum) diverifikasi lewat jalur adversarial multi-agen yang sudah terbukti (seperti bug-hunt), dengan dokter melakukan spot-check sampel acak sebagai audit akhir. Ini menyeimbangkan kecepatan dan keamanan dengan menaruh perhatian manusia di tempat taruhannya paling tinggi.

**Jalur C — Delegasi bulk eksplisit ke Claude, mengikuti pola 21-22 Agustus.**
Dokter mendelegasikan seluruh 121 kasus dengan mandat serupa ("sebijak, seakurat, selogis mungkin"), dijalankan sebagai audit multi-agen adversarial (finder + sanggahan independen, pola yang sudah 5+ kali terbukti di proyek ini), menghasilkan dosier keputusan terekam penuh (seperti `ADJUDIKASI_DELEGASI_2026-08-21.md`) yang **tetap vetoable seluruhnya**. Dokter melakukan satu pas ratifikasi akhir (baca dosier, bukan baca 121 vignette dari nol) alih-alih authorship dari nol per kasus.

**Jalur D — Trial berjalan sekarang dengan pelabelan dua-tingkat.**
Luncurkan trial hari ini dengan 16 kasus bertanda "diverifikasi dokter" dan 121 sisanya secara eksplisit dilabeli "konten pilot — belum divalidasi klinis" (mekanismenya sudah ada: `lab_prototype_unadjudicated`). Masalah nyata yang muncul dari pemakaian sungguhan selama trial *menjadi* proses reviewnya, alih-alih pra-syarat sebelum trial. Risiko: mahasiswa peserta trial pertama menjadi "penguji" konten yang belum divalidasi.

### Pertanyaan untuk DeepThink / dokter
> **(a)** Dari empat jalur di atas (atau kombinasinya, atau jalur lain), mana yang paling defensibel untuk sebuah alat edukasi kedokteran yang eksplisit berstatus lab/percobaan, mengingat tujuannya HARI INI adalah mulai full trial?
> **(b)** Bila Jalur B atau C dipilih — kriteria objektif apa yang memisahkan "taruhan tinggi, wajib tangan dokter" dari "bisa diverifikasi adversarial"? (Usul awal: tier IGD/kegawatan, obat berjendela sempit/kontraindikasi absolut, populasi rentan — obstetri, pediatri, geriatri — vs diagnosis banding rutin FKTP tier 4A)
> **(c)** Bila Jalur C dipilih, apakah metodologi audit yang sama (finder multi-agen + sanggahan independen wajib + dosier keputusan terekam + hak veto penuh) sudah cukup ketat, atau perlu lapisan tambahan mengingat skalanya (121 kasus sekaligus, bukan segelintir temuan bug)?
> **(d)** Apakah "full trial to the end" HARUS menunggu semua 137 kasus lulus salah satu jalur di atas, atau bolehkah trial dimulai dengan subset (mis. hanya 16 yang sudah sah + kasus lab yang lolos Jalur B/C tercepat), dengan sisanya menyusul?

---

## 4. Tata kelola: penyegelan ulang amplop m13-1a

*(Pertanyaan ini SAMA dengan §8 dosier koding sebelumnya — dipertahankan di sini karena langsung berkaitan dengan §3: bila dokter memilih menyapu backlog hari ini, mekanisme reseal-nya harus ikut diputuskan serentak, bukan menggantung.)*

### Fakta
- Koreksi kode `J34.89` → `J34.8` pada kasus `benda_asing_hidung_anak` menyentuh payload bertanda tangan m13-1a. **Delta klinisnya nol secara harfiah** — judul resmi WHO J34.8 dan ICD-10-CM J34.89 adalah kalimat yang **sama persis**: *"Other specified disorders of nose and nasal sinuses"*. Yang berubah hanya sistem koding mana yang dirujuk (WHO vs CM Amerika) — bukan diagnosis, obat, dosis, atau disposisi.
- Akibatnya **3 test merah menggantung** di repo (2 gerbang amplop m13-1a + 1 fingerprint artefak M13) — sudah bertahan sejak audit koding kemarin, belum berubah hari ini.
- Aturan berlaku (preseden `db25f00`): reseal **hanya atas perintah dokter eksplisit**, bukan wewenang pengembang. Sudah ditanyakan 2× di sesi-sesi sebelumnya, belum dijawab.

### Pertanyaan untuk DeepThink / dokter
> **(a)** Layakkah kelas pengecualian sempit dan terdefinisi ketat — *"koreksi kode ke padanan WHO yang judul resminya identik kata-per-kata, nol perubahan diagnosis/obat/dosis/disposisi/sitasi"* — di mana penyegelan ulang boleh dilakukan pengembang dengan pencatatan wajib, tanpa perintah eksplisit tiap kali?
> **(b)** Bila ya, penjaga teknis apa yang harus menegakkan batas kelas itu (mis. test otomatis yang membandingkan payload lama-vs-baru dan menolak bila ada field SELAIN kode ICD yang berubah)?
> **(c)** Bila tidak — apakah perintah eksplisit untuk resign m13-1a bisa diberikan SEKARANG (di sela menjawab dosier ini), supaya 3 test merah ini tidak ikut menahan status "siap trial"?

---

## 5. Tujuh pertanyaan koding/desain presisi (dipadatkan dari dosier kemarin — masih 100% terbuka)

*(Detail penuh — kutipan WHO API baris-per-baris, tabel opsi, argumen dua sisi lengkap — ada di `docs/DEEPTHINK_TRIANGULASI_KODING_2026-08-22.md`. Ringkasan di bawah cukup untuk memutuskan; buka berkas itu bila ingin verifikasi kutipan sumber.)*

**5.1 — Servisitis: N89 (katalog) vs N72 (fenotipe klinis).** N89 WHO = kelainan *noninflamasi vagina* (bukan serviks, bukan inflamasi) — tak cocok definisi untuk kasus bervignette serviks mukopurulen berdarah kontak. N72 WHO = radang serviks, cocok fenotipe. Tapi N89 adalah **keputusan sadar tingkat-gelombang** (wave-14, dikunci test, diterapkan konsisten ke klaster 3-kasus IMS) — Claude sempat mengubah lalu membatalkan sendiri setelah menemukan kebijakan terkunci itu. Pertanyaan: presisi klinis vs koherensi klaster-katalog, mana menang untuk kode yang tercetak di layar mahasiswa?

**5.2 — Alergi makanan: L27.2 vs T78.1 vs L50.0.** Kode sekarang (L27.2 = "dermatitis akibat makanan tertelan") melanggar aturan Excludes WHO sendiri untuk presentasi urtikaria. Vignette-nya jelas urtikaria alergika dipicu udang berulang. Masalah berlapis: kode salah, DAN distraktor jawabannya (L50.0 "Urtikaria Alergika") justru **diagnosis yang benar** untuk pasien ini. Tiga opsi: T78.1 (pencetus makanan tegak, tak melanggar Excludes), L50.0 (paling presisi tapi butuh ganti distraktor), atau biarkan (melanggar WHO).

**5.3 — Kekerasan tumpul vs tajam: dua kompetensi SKDI, satu kelas kode S00-S09.** Kemungkinan kompetensi ini berkerangka forensik (visum et repertum), bukan koding morbiditas — WHO sendiri tak mengkodekan mekanisme cedera di blok S; mekanisme ada di Bab XX terpisah (sebab luar). Pertanyaan: apakah baris katalog ini salah kerangka sejak awal, dan haruskah dipetakan ke kode sebab-luar alih-alih sifat-luka?

**5.4 — Kepadatan opsi: 198 dari 210 kasus poli hanya 3 pilihan jawaban.** Tebakan acak = 33%, dengan satu distraktor lemah bisa naik ke 50%. Pertanyaan psikometrik: berapa jumlah opsi optimal untuk asesmen vignette diagnostik, dan syarat mutu distraktor apa yang harus dipenuhi agar 3 opsi tetap valid?

**5.5 — Bobot skor kontinuitas rujukan (`closureRate`).** Dihitung di kode tapi tak pernah dibaca skor — mahasiswa yang selalu menutup loop rujukan mendapat skor identik dengan yang tak pernah. Argumen tandingan: menutup loop tak berbiaya apa pun, jadi mengabaikannya bukan strategi eksploitatif. Pertanyaan: seberapa sentral kompetensi ini layak DINILAI (bukan sekadar dinarasikan), dan bila ya berapa bobotnya serta di dimensi mana?

**5.6 — Clue stroke masih memakai nama pra-adjudikasi.** Lapisan adjudikasi mengubah nama jadi "Suspek Stroke Akut" + kode I64 (sengaja tak spesifik — FKTP tanpa CT tak bisa memastikan iskemik vs perdarahan), tapi teks clue dasar masih membuka dengan kalimat deklaratif "Stroke iskemik akut..." — mengajarkan kepastian yang dibantah keputusan adjudikasi sendiri. Pertanyaan: bagaimana kalimat pembuka seharusnya berbunyi agar tetap mengajarkan patofisiologi penumbra tanpa menyatakan subtipe sebagai kepastian?

**5.7 — (Digabung ke §4 di atas)** Tata kelola reseal amplop m13-1a.

---

## 6. Pertanyaan klinis baru — arah drift diabetes tak terkendali

### Fakta
Keputusan delegasi #8 (21 Agustus) memperbaiki arah drift parameter untuk peserta Prolanis **hipertensi** terkendali yang salah intervensi (opsi salahnya = "naikkan dosis", overtreatment) — dibalik jadi turun, karena menaikkan dosis antihipertensi pada pasien terkendali justru menurunkan tekanan darah, bukan menaikkannya. Amendemen hari yang sama sengaja **mengecualikan DM**: pada kartu DM terkendali, opsi salahnya adalah "Stop obat karena gula sudah normal" (under-treatment) — arah lama (+1, gula naik) memang benar untuk itu.

**Yang masih terbuka:** apakah ada kartu DM lain — atau kartu DM *tak terkendali* — dengan pola overtreatment yang belum diaudit dengan bar yang sama? Catatan memori proyek menyebut opsi "Tambah obat" pada peserta DM tak terkendali menaikkan GDP 10-30 mg/dL, sementara teks responsnya sendiri mengatakan tindakan itu **"jarang berhasil"** (bukan "memperburuk") — berpotensi kontradiksi arah yang sama seperti kasus HT yang sudah diperbaiki, tapi belum diverifikasi baris-demi-baris terhadap kode `kegiatan.ts` saat ini.

### Pertanyaan untuk DeepThink / dokter
> **(a)** Untuk peserta DM **tak terkendali** yang salah memilih opsi overtreatment ("tambah obat" tanpa indikasi/evaluasi ulang) — apakah arah simulasi saat ini (parameter memburuk) sesuai fisiologi, ataukah perlu diaudit dengan bar yang sama seperti kasus HT (delegasi #8)?
> **(b)** Bila narasi kartu ("jarang berhasil") dan efek mekanis (memburuk pasti) tidak konsisten, mana yang harus menyerah ke yang lain — teks atau mekanika?

---

## 7. Lampiran — peta keputusan yang SUDAH diambil (agar tak diadjudikasi dua kali)

| Dokumen | Isi |
|---|---|
| `docs/ADJUDIKASI_DELEGASI_2026-08-21.md` | 10 keputusan klinis/kalibrasi terdelegasi ke Claude (kurva IGD, 3 kasus suspek, I13.9, makrolida, pseudoefedrin, R62.7→R62.8, floor observasi, drift HT/DM, cuci-seprai-panas, kalibrasi IKS) — semua vetoable. |
| `docs/DEEPTHINK_TRIANGULASI_KODING_2026-08-22.md` | Versi penuh §5 di atas + riset ICD-10 yang sudah selesai (9 kode diluruskan ke WHO — tabel lengkap ada di §1 dokumen itu). |
| `adjudicationWave14.test.ts` | Mengunci kebijakan sadar "kode katalog dipertahankan, fenotipe klinis diperjelas di teks" untuk klaster 3-kasus IMS — relevan untuk §5.1. |
| `pack.test.ts` (`GENERIK_SENGAJA`) | 13 kasus di mana kode kasus sengaja lebih spesifik dari kode katalog — mekanisme yang sudah matang, dipakai sebagai preseden untuk §5.1/§5.2. |
| Memori proyek `project-m13-137-status` | Riwayat lengkap rilis beta.4→1.2.0, termasuk 8+ gelombang audit yang SUDAH menutup semua "MENUNGGU DOKTER" versi sebelumnya — pola metodologisnya (finder multi-agen + sanggahan wajib) adalah dasar Jalur C di §3. |
| Memori proyek `project-bughunt-2026-08-21` | Audit UKM 22-08 (12 dari 18 temuan nyata diperbaiki hari ini) + pelajaran proses. |

**Yang eksplisit TIDAK perlu diadjudikasi ulang** (sudah final, jangan ditimpa bukti sepihak baru tanpa memeriksa dulu apakah sudah ada kebijakan terkunci — pola kegagalan "fix M6 ter-revert diam-diam"): 9 koreksi kode ICD-10 di §1 dosier koding, pencabutan `cuci_seprai_panas`, kalibrasi IKS #10, seluruh 10 keputusan di `ADJUDIKASI_DELEGASI_2026-08-21.md`.
