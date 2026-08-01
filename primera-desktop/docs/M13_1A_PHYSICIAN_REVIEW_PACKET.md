# M13-1a Physician Review Packet

Tanggal draf dan adjudikasi: 2026-07-15
Baseline aktif: `m13-0c-2026-07-14`
Rilis usulan saat aktivasi: `m13-1a-pilot-2026-07-15`
Status: **SUPERSEDED - 8/8 APPROVED, REKONSILIASI SELESAI, AKTIF CAREER-ONLY**

> Pembaruan 2026-07-15: bagian "belum aktif" di bawah adalah snapshot gate
> pra-aktivasi dan dipertahankan sebagai audit trail. Kelima blocker teknis
> telah ditutup, review hash direkonsiliasi, dan rilis
> `m13-1a-pilot-2026-07-15` kini aktif hanya di mode Karier. Mode Ujian tetap
> terisolasi. Status operatif ada di bagian terbaru `M13_DECISION_LOG.md`.

## 1. Batas gate (snapshot historis pra-aktivasi)

Checkpoint ini memuat 6 kasus poli, 1 IGD, dan 1 skenario UKM yang telah
direview dokter. Konten sengaja belum diimpor ke `PACK` karena lima blocker
aktivasi teknis masih terbuka.

Yang belum dilakukan:

- tidak ada bump `CONTENT_RELEASE`;
- tidak ada perubahan pool Karier atau Ujian;
- karma Nayla dan Dimas belum di-rewire;
- dua exception mismatch karma di `pack.test.ts` belum dihapus;
- M13-1b belum dimulai.

`PhysicianSignoff` di bawah berasal dari keputusan eksplisit dr. Anak Agung
Bagus Wirayuda pada 2026-07-15. Codex hanya mencatat keputusan itu ke ledger;
Codex tidak bertindak sebagai physician reviewer.

Persetujuan M13-0B tidak otomatis berlaku untuk materi baru ini. Bila konten,
katalog, topology kurikulum, policy mode/release, evidence, metadata sumber,
rewire, atau pertanyaan keputusan direvisi setelah review, hash envelope
berubah dan versi yang baru harus direview kembali.

Seluruh envelope kini juga mengikat `CLINICAL_GROUNDING_POLICY` versi
`clinical-grounding-floor-graceful-degradation-v1`: PPK/PNPK/aturan Kemenkes
aktif terbaru adalah floor; EBM yang lebih baik boleh menaikkan standar dengan
jejak konflik dan physician adjudication; implementasi serta scoring mengikuti
graceful degradation berdasarkan resource yang benar-benar diverifikasi.
Fornas, KFA, dan ASPAK tidak diperlakukan sebagai bukti stok siap pakai.
Untuk Dimas, otitis eksterna, dan fraktur terbuka, jejak itu juga hadir secara
terstruktur di `EvidenceBinding.governance`: sumber floor, sumber EBM pembanding,
sumber resource, status `variable_or_unverified`, dan catatan implementasinya.
Konflik material tanpa struktur tersebut gagal validator.

**Batas scope resource M13-RP1 (disetujui dr. Wirayuda, 2026-07-15):**
`sukamaju_middle_v1` adalah baseline naratif/authoring dan Resource Tier A-D
adalah checklist editorial, bukan mekanik engine. Untuk slice ini, resource
khusus yang menjadi prasyarat jawaban benar harus dinyatakan tersedia sebelum
pilihan dinilai. Tidak ada `FacilityResourceProfile`, downtime dinamis, atau
resource gate baru pada M13-1a; kasus IGD lama juga tidak di-retrofit di
milestone ini. Keputusan tersebut menjadi batas resource bagi adjudikasi N1-U1
yang dicatat pada bagian 7.

## 2. Ringkasan slice

| Kanal | Konten | Tier authoring | SKDI | Tujuan utama |
|---|---|---:|---:|---|
| Poli | Nayla: diare bayi dengan dehidrasi berat | A | 4A | Plan C bayi, zinc, stabilisasi sambil rujuk |
| Poli | Dimas: eksaserbasi asma berat anak | A | 3B | Oksigen, bronkodilator, steroid, rujuk |
| Poli | Hipoglikemia ringan pengguna sulfonilurea | A | 4A | Rule of 15 dan disposisi aman |
| Poli | Benda asing hidung pada anak | B | 4A | Satu ekstraksi terencana dan stop rule |
| Poli | Otitis eksterna akut ringan | C | 4A | Terapi topikal, bukan antibiotik sistemik rutin |
| Poli | Fraktur terbuka tibia | B | 3B | Bundel stabilisasi pra-rujuk |
| IGD | STEMI anterior dengan hipoksemia | - | 3B | EKG <=10 menit, aspirin, transfer reperfusi |
| UKM | Gunawan K2: Kabin Truk Tanpa Kretek | - | - | Relapse prevention berbasis pemicu kerja |

Empat kasus representatif menutup tier A/B/C dan memuat satu rujuk-wajib.
Tiga item FKTP yang saat ini belum tersertifikasi mendapat calon encounter:
hipoglikemia ringan, benda asing hidung, dan otitis eksterna. Gap kanonik tetap
99 pada build aktif; bila aktivasi disetujui, proyeksinya menjadi 96.

## 3. Keputusan klinis per konten

### A. Nayla - diare bayi 3 bulan, dehidrasi berat

Jalur benar draf:

- klasifikasi dehidrasi berat dari letargis, mata cekung, hampir tidak mau
  minum, dan skin pinch sangat lambat;
- Ringer laktat/NaCl 0,9% total 100 mL/kg untuk bayi <12 bulan: 30 mL/kg
  dalam 1 jam, lalu 70 mL/kg dalam 5 jam, dengan reassessment serial;
- seluruh Plan C dimodelkan sebagai satu tindakan bernilai, bukan sekadar
  tindakan generik memasang infus;
- ORS sekitar 5 mL/kg/jam setelah mampu minum dan aman;
- zinc 10 mg/hari selama 14 hari, bukan 20 mg/hari;
- stabilisasi berjalan sambil jejaring rujukan anak disiapkan.

Dangerous path yang dikunci: memaksa ORS pada bayi letargis, loperamid,
antibiotik empiris tanpa indikasi, atau menunda cairan untuk pemeriksaan feses.

Saat menilai keputusan berikut, tentukan pula kapan Plan C diselesaikan di
FKTP dan kapan transfer berjalan sambil stabilisasi.

**Keputusan N1 (teks kanonik):**
> Nayla: setujui Plan C bayi sebagai tindakan bernilai, kebijakan stabilisasi sambil rujuk, dan jalur bila akses IV tidak segera berhasil.

### B. Dimas - eksaserbasi asma berat anak 7 tahun

Jalur benar draf:

- berat badan 24 kg, SpO2 87%, bicara kata demi kata, retraksi, respons singkat
  setelah pelega di rumah;
- oksigen terkontrol dengan target SpO2 92-95% sesuai GINA 2026;
- nebulisasi SABA + ipratropium setiap 20 menit sampai tiga kali pada jam
  pertama;
- prednison/prednisolon 1-2 mg/kgBB/hari, maksimum 40 mg, selama 3-5 hari;
- rujuk ke layanan anak dengan terapi dan monitoring tetap berjalan.

Dangerous path yang dikunci: salbutamol oral sebagai pengganti terapi inhalasi,
antibiotik tanpa bukti infeksi bakteri, atau menganggap silent chest sebagai
perbaikan.

Katalog draf memakai unit-dose ipratropium 0,5 mg + salbutamol 2,5 mg untuk
anak 24 kg. Queensland Paediatric Asthma v5 mendukung ipratropium 0,5 mg tiap
20 menit sampai tiga dosis untuk usia >6 tahun, tetapi sumber yang sama memakai
salbutamol 5 mg nebulisasi untuk usia >=6 tahun. Fornas memuat unit-dose
kombinasi tersebut, namun tidak menetapkan bahwa satu unit-dose adalah total
dosis klinis untuk semua usia. Jadi komponen salbutamol 2,5 mg versus total
5 mg adalah konflik dosis material yang diputuskan dokter pada bagian 7. Keduanya juga
tidak membuktikan stok lokal; vignette harus menyatakan oksigen, nebulizer,
bahan habis pakai, SDM, dan transport tersedia.

**Keputusan D1 (teks kanonik):**
> Dimas: adjudikasi target SpO2 92-95% (GINA 2026), ipratropium 0,5 mg tiap 20 menit x3, dan total dosis SABA karena unit-dose Fornas berisi salbutamol 2,5 mg sedangkan sumber pediatrik usia >=6 tahun memakai 5 mg; lalu setujui steroid, rujuk, serta status 3B tanpa kredit asma stabil 4A.

### C. Hipoglikemia ringan pada dewasa dengan DM2

Jalur benar draf:

- pasien sadar, mampu menelan, GDS 58 mg/dL, pencetus makan terlewat;
- glukosa oral 15-20 g, periksa ulang 15 menit, ulangi bila masih <70 mg/dL
  atau gejala menetap;
- beri makanan setelah pulih dan evaluasi faktor obat, ginjal, hati, alkohol,
  serta keamanan pemantauan;
- hentikan sementara atau kurangi sulfonilurea sesuai penilaian dan selaraskan
  regimen dengan pola makan; jangan otomatis melanjutkan dosis berikut;
- rujuk bila tidak membaik, berulang, kesadaran turun, atau tidak aman dipantau.

Dangerous path yang dikunci: menambah sulfonilurea atau membiarkan pasien
melanjutkan aktivitas tanpa makan dan pemantauan.

**Keputusan H1 (teks kanonik):**
> Hipoglikemia: setujui penghentian sementara/pengurangan sulfonilurea, batas observasi, dosis berikutnya, dan ambang rujuk bila berulang.

### D. Benda asing hidung pada anak

Jalur benar draf:

- manik plastik bulat, anterior, tampak jelas, bukan baterai/magnet/benda tajam,
  anak stabil dan kooperatif;
- satu upaya terencana memakai pengait di belakang benda, kateter balon, atau
  suction sesuai bentuk dan alat yang tersedia;
- jangan menjepit benda bulat dari depan dan jangan blind probing;
- berhenti dan rujuk bila upaya pertama gagal, benda sulit dilihat, alat atau
  posisi tidak aman, anak tidak kooperatif, atau timbul komplikasi.

Dangerous path yang dikunci: percobaan berulang, mendorong benda ke posterior,
dan menunda baterai kancing yang dapat merusak jaringan dalam hitungan jam.

**Keputusan B1 (teks kanonik):**
> Benda asing hidung anak: setujui satu upaya ekstraksi terencana, teknik aman menurut bentuk, dan ambang berhenti/rujuk yang eksplisit.

### E. Otitis eksterna akut ringan

Jalur benar draf:

- otalgia setelah berenang, nyeri tragus/aurikula, edema ringan, sekret minimal,
  membran timpani tampak utuh, tanpa diabetes/imunosupresi;
- pembersihan hati-hati hanya bila memang diperlukan dan mampu dilakukan;
  tindakan ini tidak dijadikan skor wajib pada draf;
- asam asetat otik 2% sebanyak 5 tetes 3-4 kali sehari, edukasi teknik tetes
  dan telinga kering;
- nilai respons 48-72 jam; antibiotik sistemik tidak rutin pada penyakit tanpa
  penyebaran atau faktor host berisiko.

PPK 1186/2022 menyebut povidon iodin atau tampon antibiotik-steroid untuk
terapi topikal, bukan asam asetat secara spesifik. Fornas 1199/2025 memuat
asam asetat tetes telinga 2%. AAO-HNSF mendukung terapi topikal dan reassessment
48-72 jam; label DailyMed dipakai hanya sebagai pembanding dosis dan
kontraindikasi perforasi.

**Keputusan O1 (teks kanonik):**
> Otitis eksterna: adjudikasi asam asetat 2%, dosis 5 tetes 3-4 kali/hari, durasi lokal, dan posisi opsi ini terhadap agen yang disebut PPK.

### F. Fraktur terbuka tibia

Jalur benar draf:

- primary survey dan kontrol perdarahan tanpa mendorong fragmen masuk;
- singkirkan hanya kontaminan kasar yang lepas tanpa probing, irigasi,
  debridement, atau manipulasi fragmen;
- balut dengan kasa steril dibasahi NaCl dan lapisan oklusif bila tersedia,
  dokumentasi neurovaskular sebelum-sesudah bidai, akses IV;
- analgesia sesuai kondisi dan protokol;
- antibiotik parenteral dini dan profilaksis tetanus sesuai riwayat;
- rujuk segera untuk debridement/fiksasi; radiologi FKTP tidak menunda transfer.

Dangerous path yang dikunci: manipulasi fragmen, membuka balutan berulang,
antibiotik oral sebagai substitusi, atau transfer tanpa imobilisasi.

PNPK Fraktur 270/2019 dan PPK 1186/2022 mendukung pembersihan/irigasi sepintas
kontaminan tampak sebelum debridement definitif. ACS Best Practices Orthopaedic
Trauma (2022) dan BOAST melarang irigasi/mini-washout di luar kamar operasi.
Draf mengikuti no-mini-washout dan mempertahankan jejak konflik tersebut di
evidence audit.
Fornas mencantumkan sefazolin dengan restriksi profilaksis bedah;
Fornas, KFA, atau ASPAK tidak sendirian membuktikan indikasi maupun stok rutin
FKTP. Alternatif antibiotik tidak boleh diimprovisasi tanpa sumber atau SOP
jejaring yang terverifikasi.

**Keputusan F1 (teks kanonik):**
> Fraktur terbuka: adjudikasi no-mini-washout terhadap konflik PNPK 270/2019 vs ACS/BOAST, balut lembap-oklusif, analgesia, antibiotik/tetanus, dan deklarasi resource FKTP/jejaring.

### G. IGD STEMI anterior dengan hipoksemia

Jalur benar draf:

- ABC, monitor, akses IV, EKG 12 sadapan dalam <=10 menit;
- oksigen karena SpO2 88%, bukan oksigen rutin pada normoksemia;
- aspirin tidak bersalut 160-320 mg dikunyah bila tidak ada kontraindikasi;
- kirim EKG/SBAR dan transfer medis terpantau ke jejaring reperfusi tanpa
  menunggu troponin atau hilangnya nyeri.

Near-miss berbahaya yang dikunci: menunggu troponin sebelum EKG, meniadakan
oksigen walau SpO2 88%, loading aspirin yang terlalu kecil/lambat, mendahulukan
nitrat, observasi serial di FKTP, atau memilih RS tanpa memastikan kemampuan
reperfusi.

**Keputusan I1 (teks kanonik):**
> STEMI: setujui bundel aspirin/oksigen/EKG/transfer serta putuskan apakah P2Y12, antikoagulan, nitrat, dan strategi PCI/fibrinolisis sengaja di luar scope.

Archetype ini tidak memberi sertifikasi diagnosis karena engine IGD tidak
menulis Dex.

### H. UKM Gunawan K2 - Kabin Truk Tanpa Kretek

Jalur benar draf:

- mengakui keberhasilan tiga hari bebas rokok tanpa mempermalukan relaps;
- functional analysis pada antre malam, kopi, tawaran teman, dan rokok di kabin;
- latihan kalimat menolak, stimulus control kabin, titik istirahat aman,
  pengganti oral, dukungan keluarga, dan follow-up UBM;
- mengantuk berat ditangani dengan menepi, bukan rokok.

Near-miss yang dikunci: quit date tanpa rencana pemicu, mengandalkan perubahan
seluruh rekan kerja, menyimpan rokok tetap di kabin, atau memakai kopi sebagai
pengganti menepi saat kantuk berat.

**Keputusan U1 (teks kanonik):**
> Gunawan K2: setujui fokus opportunity/relapse prevention dan putuskan apakah penilaian ketergantungan, withdrawal, serta farmakoterapi wajib masuk skenario.

Penilaian juga mencakup koherensi arc keluarga Gunawan, keselamatan berkendara,
realisme intervensi Puskesmas, dan apakah asesmen dapat ditautkan ke UBM.

## 4. Blocker aktivasi teknis

### 4.1 Bundel stabilisasi

Field engine `stabilisasiWajib` saat ini hanya dapat memberi cap
`stabilisasiTerlewat` untuk satu tindakan. Dimas memerlukan oksigen dan
nebulisasi; fraktur terbuka memerlukan balut steril, bidai, akses IV, antibiotik,
dan profilaksis tetanus.

Selain itu, resep runtime hanya menyimpan ID obat tanpa dosis/kuantitas. Pada
Dimas, satu unit-dose kombinasi berisi salbutamol 2,5 mg dapat dinilai benar,
padahal adjudikasi D1 menetapkan total salbutamol nebulisasi 5 mg. Gate ini
belum boleh dianggap selesai sebelum bundel stabilisasi dan semantik dosis
tersebut dapat dinilai atau memiliki kontrol fail-safe eksplisit.

Sebelum aktivasi harus dipilih salah satu:

1. perluas engine agar dapat mengunci bundel stabilisasi dan dosis; atau
2. buat kontrol fail-safe tertulis dan teruji yang menjelaskan gate cap,
   pemenuhan dosis, serta cara tindakan penting lain tetap dinilai.

Checkpoint authoring boleh disimpan dengan blocker ini; aktivasi tidak boleh.

### 4.2 Tampilan usia bayi

State pasien runtime hanya menyimpan usia sebagai tahun bulat dan UI menulis
`{usia} tahun`. Nayla yang berusia 3 bulan akan tampil sebagai `0 tahun` pada
header, walaupun narasi dan berat badan sudah menyebut 3 bulan. Aktivasi perlu
representasi/display usia bulan atau override terverifikasi agar perbaikan
mismatch pediatrik tidak menghasilkan demografi yang janggal.

### 4.3 Kalibrasi ekonomi

Harga obat dan biaya tindakan pada katalog draf adalah placeholder authoring
untuk memenuhi schema. Nilainya bukan klaim harga pengadaan. Harga beli/jual,
biaya tindakan, dan dampak margin perlu dikalibrasi. Setiap obat/alat yang
dinilai wajib dipetakan ke Fornas/KFA/ASPAK lalu diverifikasi lokal, atau
vignette harus mendeklarasikan availability dan jalur graceful degradation.

### 4.4 Teknik ekstraksi benda asing

Engine hanya menilai tindakan generik `ekstraksi_benda_asing_hidung`; ia belum
dapat membedakan pengait/kateter/suction yang dipilih sesuai bentuk dari blind
probing atau menjepit benda bulat dari depan. Aktivasi memerlukan dangerous-
action gate yang dapat dinilai atau waiver pedagogis eksplisit.

### 4.5 Kapabilitas tujuan STEMI

Model rumah sakit runtime hanya menyimpan spesialisasi, belum kemampuan PCI,
fibrinolisis, atau jejaring STEMI. Kasus tidak boleh aktif sampai tujuan
reperfusi dapat diverifikasi oleh model data/gate khusus atau keputusan scope
dan waiver yang tertulis.

## 5. Evidence dan keterbatasan

Semua `EvidenceBinding` kini `resolved` sesuai delapan keputusan `approved`.
Tiga audit konflik material membawa physician sign-off eksplisit. Populasi
anak ditulis eksplisit dan tidak diturunkan dari regimen dewasa.

Sumber inti:

- [WHO IMCI Chart Booklet](https://www.who.int/docs/default-source/mca-documents/imci-chart-booklet.pdf)
- [Kemenkes Pedoman Asma FKTP](https://repository.kemkes.go.id/book/1251)
- [WHO Childhood Asthma 2026](https://www.who.int/publications/i/item/9789240122680)
- [GINA Strategy Report 2026](https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf)
- [Queensland Paediatric Asthma v5](https://www.childrens.health.qld.gov.au/for-health-professionals/queensland-paediatric-emergency-care-qpec/queensland-paediatric-clinical-guidelines/asthma)
- [Fornas KMK 1199/2025](https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf)
- [PNPK Fraktur KMK 270/2019](https://www.kemkes.go.id/app_asset/file_content_download/17001196726555c478e59fc5.31771765.pdf)
- [ACS Best Practices Orthopaedic Trauma 2022](https://www.facs.org/media/mkbnhqtw/ortho_guidelines.pdf)
- [BOAST Open Fractures](https://www.boa.ac.uk/resource/boast-4-pdf.html)
- [ASPAK Kemenkes](https://aspak.kemkes.go.id/aplikasi/infoboard)
- [KFA SATUSEHAT API](https://satusehat.kemkes.go.id/platform/docs/id/master-data/kfa/rest-api-kfa/apis/api-kfa-v2/)
- [AAO-HNSF Acute Otitis Externa](https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/)
- [DailyMed Acetic Acid Otic 2%](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f9b4d18b-25f3-604f-e053-6394a90a5531&type=display)
- [WHO Tobacco Cessation 2024](https://www.who.int/publications/b/74755)
- [Kemenkes PIS-PK Monitoring](https://repository.kemkes.go.id/book/758)

PPK 1186/2022 ditelusuri dari artefak lokal
`docs/references/ppk1186/ppk1186_fulltext.txt`; tautan PDF langsung JDIH yang
pernah dipakai sudah 404. Ini dicatat sebagai limitation, bukan disembunyikan.

## 6. Hash review envelope

Hash adalah SHA-256 dari envelope kanonik yang mengikat encounter, entri
katalog/ICD, topology kurikulum, policy Karier-only dan release, evidence,
metadata sumber, kebijakan grounding klinis universal, rewire terkait, serta
pertanyaan keputusan dokter. Status terminal dan tanda tangan adalah hasil
review, sehingga dikeluarkan dari snapshot pra-keputusan yang di-hash. Delapan
hash berikut tetap identik setelah sign-off dicatat.

| Review record | SHA-256 |
|---|---|
| Nayla | `7f507c16697683f1d09b03fad2d64c2cd2ee9430ba083e76efd987024343a499` |
| Dimas | `cd9891a3213ed541396d746bd60f33b05795a7b6bdc52b3d367fe2d72ba18bab` |
| Hipoglikemia | `1efa8b66bfab8fcb45e5d7641af9bd0dfd1dfe13ec242bff6dad0f2c3fd24bc5` |
| Benda asing hidung | `c1a1118fb3454c1024f4b4017fc6cd8fd90a77f69eba642b8c86a4eccadd2b0c` |
| Otitis eksterna | `135af2d38d1535bbc1fd14369bdeb21b43aec1f44081539966acda43126cb582` |
| Fraktur terbuka | `9146723a1ebbf938a5e143e681581b915e30f5bb75b61f5bfebc805e544688da` |
| IGD STEMI | `8a16306299a7196caad193c65cb3d4ce27831373a70e5922465155ca3d12aa30` |
| UKM Gunawan K2 | `4a36c4ff0a0ef1296fc6e2609948228381bfd0c30c8e794f4030d4c87249e922` |

## 7. Physician adjudication record

- Reviewer: **dr. Anak Agung Bagus Wirayuda**
- Kredensial: **Dokter; penanggung jawab klinis PRIMERA**
- Tanggal: **2026-07-15**
- Hasil: **8/8 `approved`; tidak ada waiver konten**

| ID | Status | Resolusi yang disetujui |
|---|---|---|
| N1 | `approved` | Plan C bayi dinilai komposit dan dimulai sambil menyiapkan rujukan. Bila IV tidak segera berhasil, ikuti cabang WHO menurut akses terapi IV terdekat, kemampuan minum, dan kompetensi NGT; jangan menetapkan batas upaya IV arbitrer atau memaksa oralit pada bayi letargis. |
| D1 | `approved` | Target SpO2 92-95%; ipratropium 0,5 mg tiap 20 menit sampai tiga dosis; total salbutamol nebulisasi 5 mg per dosis untuk usia 7 tahun. Unit-dose Fornas 0,5/2,5 mg bukan bukti total SABA atau stok siap. Steroid dini, terapi sambil rujuk, status 3B, dan tanpa kredit asma stabil 4A dipertahankan. |
| H1 | `approved` | Koreksi glukosa dan evaluasi serial, makanan setelah pulih, lalu hold/kurangi sulfonilurea berdasarkan review. Dosis berikut tidak otomatis dilanjutkan; rujuk bila tidak membaik, berulang, kesadaran turun, atau pemantauan tidak aman. Tidak ada durasi observasi arbitrer. |
| B1 | `approved` | Satu upaya terencana dengan teknik sesuai bentuk dan alat. Blind probing, front-grasping benda bulat, serta percobaan berulang dilarang; kegagalan atau kondisi tidak aman menjadi stop rule dan rujukan. |
| O1 | `approved` | Asam asetat otik 2%, 5 tetes 3-4 kali/hari, hanya bila membran timpani utuh. Nilai ulang 48-72 jam dan lanjutkan selama masih terindikasi menurut respons/protokol lokal tanpa durasi kaku arbitrer. Agen PPK tetap alternatif kontekstual; antibiotik sistemik tidak rutin. |
| F1 | `approved` | No-mini-washout: singkirkan hanya kontaminan kasar yang lepas tanpa probing/irigasi; balut lembap-oklusif, dokumentasi neurovaskular, bidai, analgesia, antibiotik parenteral dini, tetanus sesuai riwayat, lalu rujuk segera. Tidak ada substitusi improvisasi. |
| I1 | `approved` | EKG <=10 menit, aspirin kunyah 160-320 mg setelah skrining kontraindikasi, oksigen karena SpO2 88%, monitoring, komunikasi, dan transfer terpantau. P2Y12, antikoagulan, nitrat, serta pemilihan PCI/fibrinolisis sengaja di luar skor slice dan mengikuti protokol jejaring; blocker tujuan reperfusi tetap terbuka. |
| U1 | `approved` | Fokus K2 tetap opportunity/relapse prevention. Asesmen ketergantungan, withdrawal, dan kelayakan farmakoterapi ditautkan ke UBM tetapi tidak wajib dimainkan/diberi skor di kunjungan ini. Kantuk berat ditangani dengan menepi dan beristirahat. |

Persetujuan ini berlaku pada delapan hash di bagian 6. Perubahan berikutnya pada
materi yang masuk envelope mengubah hash dan memerlukan review baru. Persetujuan
ini juga tidak menghapus satu pun blocker teknis di bagian 4.

## 8. Checklist aktivasi setelah review

- [x] Delapan keputusan konten selesai dan hash masih cocok.
- [ ] Blocker bundel stabilisasi diselesaikan atau mendapat waiver eksplisit.
- [ ] Usia Nayla ditampilkan sebagai 3 bulan, bukan 0 tahun.
- [ ] Harga/biaya placeholder dikalibrasi dan ditinjau dampak gameplay-nya.
- [ ] Resource yang dinilai dinyatakan tersedia/terverifikasi atau mempunyai
      graceful degradation tanpa substitusi improvisasi.
- [ ] Teknik ekstraksi aman dapat dinilai atau mendapat waiver pedagogis.
- [ ] Tujuan STEMI memodelkan kemampuan reperfusi atau mendapat keputusan
      scope/waiver eksplisit.
- [x] Semua binding terkait menjadi terminal sesuai keputusan.
- [ ] Draf diimpor ke katalog, `PACK`, blueprint, dan keluarga yang tepat.
- [ ] Karma Nayla/Dimas di-rewire dan dua exception lama dihapus.
- [ ] Seluruh archetype/skenario baru `karier=true`, `ujian=false`.
- [ ] `CONTENT_RELEASE` dibump atomik ke rilis yang disetujui.
- [ ] Save pra-aktivasi menjadi arsip netral sesuai kebijakan M13-0C.
- [ ] Test negatif membuktikan konten pilot tidak pernah masuk pool Ujian.
- [ ] Fingerprint/freeze, full suite, typecheck, build, dan packaging lulus.

M13-1b baru boleh dimulai setelah aktivasi yang disetujui dan tetap memerlukan
playtest manusia serta keputusan zero-material-defect terpisah.

## 9. Verifikasi pasca-adjudikasi

- authoring invariant: **19/19**;
- full suite: **77 file / 851 test**;
- freeze Golden Master: **17/17** di dalam full suite;
- delapan hash review envelope: cocok dengan hash pra-sign-off;
- TypeScript typecheck: lulus;
- production build: lulus;
- `git diff --check`: lulus.

Physician approval materi telah tercatat, tetapi hasil ini belum membuktikan
kesiapan aktivasi. Build aktif masih memakai 67 kasus lama dan release M13-0C.
