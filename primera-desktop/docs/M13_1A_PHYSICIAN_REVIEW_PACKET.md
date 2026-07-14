# M13-1a Physician Review Packet

Tanggal draf: 2026-07-15
Baseline aktif: `m13-0c-2026-07-14`
Rilis usulan setelah persetujuan: `m13-1a-pilot-2026-07-15`
Status: **DRAF AUTHORING, BELUM AKTIF, BELUM PHYSICIAN SIGN-OFF**

## 1. Batas gate

Checkpoint ini menyiapkan 6 kasus poli, 1 IGD, dan 1 skenario UKM untuk
review. Konten sengaja belum diimpor ke `PACK`.

Yang belum dilakukan:

- tidak ada bump `CONTENT_RELEASE`;
- tidak ada perubahan pool Karier atau Ujian;
- karma Nayla dan Dimas belum di-rewire;
- dua exception mismatch karma di `pack.test.ts` belum dihapus;
- tidak ada `PhysicianSignoff` yang diisi oleh Codex;
- M13-1b belum dimulai.

Persetujuan M13-0B tidak otomatis berlaku untuk materi baru ini. Bila konten,
katalog, topology kurikulum, policy mode/release, evidence, metadata sumber,
rewire, atau pertanyaan keputusan direvisi setelah review, hash envelope
berubah dan versi yang baru harus direview kembali.

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
- oksigen dengan target SpO2 94-98%;
- nebulisasi SABA + ipratropium setiap 20 menit sampai tiga kali pada jam
  pertama;
- prednison/prednisolon 1-2 mg/kgBB/hari, maksimum 40 mg, selama 3-5 hari;
- rujuk ke layanan anak dengan terapi dan monitoring tetap berjalan.

Dangerous path yang dikunci: salbutamol oral sebagai pengganti terapi inhalasi,
antibiotik tanpa bukti infeksi bakteri, atau menganggap silent chest sebagai
perbaikan.

Katalog draf memakai unit-dose ipratropium 0,5 mg + salbutamol 2,5 mg untuk
anak 24 kg. Angka ini ditampilkan untuk adjudikasi, belum dianggap regimen
lokal yang disetujui.

**Keputusan D1 (teks kanonik):**
> Dimas: setujui dosis/interval nebulisasi pediatrik, target oksigen, steroid sistemik, serta status 3B tanpa kredit asma stabil 4A.

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
- irigasi singkat dengan NaCl untuk membuang kontaminan lepas, tanpa
  debridement atau manipulasi fragmen;
- balut steril, dokumentasi neurovaskular sebelum-sesudah bidai, akses IV;
- analgesia sesuai kondisi dan protokol;
- antibiotik parenteral dini dan profilaksis tetanus sesuai riwayat;
- rujuk segera untuk debridement/fiksasi; radiologi FKTP tidak menunda transfer.

Dangerous path yang dikunci: manipulasi fragmen, membuka balutan berulang,
antibiotik oral sebagai substitusi, atau transfer tanpa imobilisasi.

Fornas mencantumkan sefazolin dengan restriksi profilaksis bedah; entri itu
tidak sendirinya membuktikan regimen fraktur terbuka atau stok rutin FKTP.

**Keputusan F1 (teks kanonik):**
> Fraktur terbuka: adjudikasi irigasi pra-rujuk, analgesia, dosis/cakupan antibiotik, profilaksis tetanus, dan dasar ketersediaan sefazolin di FKTP.

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

Sebelum aktivasi harus dipilih salah satu:

1. perluas engine agar dapat mengunci bundel stabilisasi; atau
2. beri waiver scoring tertulis yang menjelaskan tindakan mana yang menjadi
   gate cap dan bagaimana tindakan penting lain tetap dinilai.

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
biaya tindakan, dampak margin, dan akses stok perlu dikalibrasi terhadap
ekonomi game serta konteks lokal sebelum aktivasi.

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

Semua `EvidenceBinding` masih `pending` sampai physician review. Populasi anak
ditulis eksplisit dan tidak diturunkan dari regimen dewasa.

Sumber inti:

- [WHO IMCI Chart Booklet](https://www.who.int/docs/default-source/mca-documents/imci-chart-booklet.pdf)
- [Kemenkes Pedoman Asma FKTP](https://repository.kemkes.go.id/book/1251)
- [WHO Childhood Asthma 2026](https://www.who.int/publications/i/item/9789240122680)
- [Fornas KMK 1199/2025](https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf)
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
metadata sumber, rewire terkait, serta pertanyaan keputusan dokter.

| Review record | SHA-256 |
|---|---|
| Nayla | `cdc51dfbacadd4d492bb1ade9b204dde55818e2618d119e20fc0abccfad4b837` |
| Dimas | `5c28241f0aa7c21c7ba3bc6475269bd713e460c5d837a8c03bb01ae7bc870e47` |
| Hipoglikemia | `5c19eef81c940516d799d672173096a4b84a8dcacfcaf05c96c074c57f48fc0b` |
| Benda asing hidung | `4142a03601011b687cb611caf43ee73af9c0d42e58dd520cf4fbe8936968fccf` |
| Otitis eksterna | `8c73ae002f2c27ad6e5f12c0cdb0497efd518895862aa7fd5b25d9d691d67ae8` |
| Fraktur terbuka | `cdb66765c7b058c1e4a21ccf454af10e4269c2032c15e497da5c151ecfc41bf5` |
| IGD STEMI | `84fdcb454c6c5448e2b712cfa165aff94c813e1e837026029ce5b03bb01769cb` |
| UKM Gunawan K2 | `b8d83a47768efd0bc0c25324fd44c58172f71156c3c2628883c1e88cb331092d` |

## 7. Cara memberi keputusan

Untuk tiap N1, D1, H1, B1, O1, F1, I1, dan U1, pilih salah satu:

- `approved`;
- `approved_with_waiver` disertai alasan dan batasannya; atau
- `revision_required` disertai koreksi yang diminta.

`revision_required` tidak dibuat sebagai sign-off terminal. Konten diperbaiki,
hash berubah, lalu diajukan kembali. Reviewer, kredensial, tanggal, keputusan,
dan catatan baru boleh diisi setelah keputusan nyata diberikan.

## 8. Checklist aktivasi setelah review

- [ ] Delapan keputusan konten selesai dan hash masih cocok.
- [ ] Blocker bundel stabilisasi diselesaikan atau mendapat waiver eksplisit.
- [ ] Usia Nayla ditampilkan sebagai 3 bulan, bukan 0 tahun.
- [ ] Harga/biaya placeholder dikalibrasi dan ditinjau dampak gameplay-nya.
- [ ] Teknik ekstraksi aman dapat dinilai atau mendapat waiver pedagogis.
- [ ] Tujuan STEMI memodelkan kemampuan reperfusi atau mendapat keputusan
      scope/waiver eksplisit.
- [ ] Semua binding terkait menjadi terminal sesuai keputusan.
- [ ] Draf diimpor ke katalog, `PACK`, blueprint, dan keluarga yang tepat.
- [ ] Karma Nayla/Dimas di-rewire dan dua exception lama dihapus.
- [ ] Seluruh archetype/skenario baru `karier=true`, `ujian=false`.
- [ ] `CONTENT_RELEASE` dibump atomik ke rilis yang disetujui.
- [ ] Save pra-aktivasi menjadi arsip netral sesuai kebijakan M13-0C.
- [ ] Test negatif membuktikan konten pilot tidak pernah masuk pool Ujian.
- [ ] Fingerprint/freeze, full suite, typecheck, build, dan packaging lulus.

M13-1b baru boleh dimulai setelah aktivasi yang disetujui dan tetap memerlukan
playtest manusia serta keputusan zero-material-defect terpisah.

## 9. Verifikasi checkpoint draf

- authoring invariant: **15/15**;
- full suite: **76 file / 845 test**;
- freeze Golden Master: **17/17** di dalam full suite;
- TypeScript typecheck: lulus;
- production build: lulus;
- `git diff --check`: lulus.

Hasil ini membuktikan integritas draf dan non-aktivasi, bukan persetujuan
klinis. Build aktif masih memakai 67 kasus lama dan release M13-0C.
