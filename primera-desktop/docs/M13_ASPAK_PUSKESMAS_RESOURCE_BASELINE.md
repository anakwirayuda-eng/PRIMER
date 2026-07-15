# Baseline Empiris Resource Puskesmas Indonesia untuk PRIMERA

Tanggal ekstraksi data: 2026-07-15
Versi laporan: 1.1
Status: **baseline naratif disetujui melalui M13-RP1; belum mengubah runtime, PACK, atau scoring**

## 1. Abstrak

Laporan ini menjawab pertanyaan: seperti apa baseline resource Puskesmas yang
cukup mewakili titik tengah Indonesia untuk PRIMERA, tanpa menggambarkan FKTP
secara terlalu miskin dan tanpa mengasumsikan fasilitas ideal yang tidak lazim?

Snapshot publik ASPAK menghasilkan 10.261 skor fasilitas unik untuk indikator
gabungan sarana, prasarana, dan alat kesehatan (SPA). Rerata skor adalah 65,31,
median 67,59, dan rentang antarkuartil 56,96-76,20. Namun, median komponen alat
kesehatan hanya 58,34; median prasarana 61,91; sedangkan median sarana 83,89.
Pada endpoint agregat provinsi, 7.063 dari 10.253 Puskesmas (68,89%) memenuhi
ambang legacy ASPAK sebesar 60. Hanya 46,04% memenuhi ambang yang sama untuk
alat kesehatan.

Angka tersebut tidak boleh dibaca sebagai inventaris literal. Skor yang sama
dapat dibentuk oleh kombinasi item yang berbeda; endpoint publik juga tidak
membuktikan fungsi alat, kalibrasi, bahan habis pakai, stok, atau petugas yang
siap pada saat pasien datang. Selain itu, metadata indikator publik masih
menyebut Permenkes 43/2019, padahal regulasi aktif adalah Permenkes 19/2024.

Simpulan desain: Puskesmas Sukamaju paling defensible dimodelkan sebagai
**Puskesmas perdesaan nonrawat inap dengan core service yang layak, formularium
inti relatif baik, tetapi alat khusus, kesiapan kegawatdaruratan, menu lab,
SDM, transport, dan jejaring bersifat eksplisit/variabel**. Resource yang menjadi
syarat jawaban benar tidak boleh disembunyikan dari pemain.

### Status tata kelola M13-RP1

Pada 15 Juli 2026, dr. Anak Agung Bagus Wirayuda menyetujui
`sukamaju_middle_v1` sebagai baseline naratif/authoring. Resource Tier A-D
diterima sebagai checklist editorial, bukan sebagai state atau mekanik runtime.
`FacilityResourceProfile`, lima status readiness dinamis, downtime, dan
invariant resource engine ditunda sampai sesudah M13-1b dan memerlukan keputusan
scope tersendiri. Kasus M13-1a boleh mensyaratkan resource khusus hanya bila
ketersediaannya dinyatakan sebelum keputusan pemain dinilai.

## 2. Pertanyaan dan tujuan

### 2.1 Pertanyaan utama

1. Berapa pusat distribusi skor SPA Puskesmas: rerata, median, dan kuartil?
2. Komponen mana yang relatif kuat dan mana yang menjadi bottleneck?
3. Apakah satu "Puskesmas rata-rata" dapat diterjemahkan menjadi daftar alat?
4. Profil apa yang paling masuk akal untuk setting fiksi Desa Sukamaju?
5. Bagaimana resource limitation diterapkan tanpa menghukum pemain secara tidak
   adil atau menambah cognitive load yang tidak mendidik?

### 2.2 Tujuan penggunaan

Laporan ini dimaksudkan sebagai dasar untuk:

- authoring vignette dan kasus M13;
- deklarasi resource pada kasus poli, IGD, dan UKM;
- graceful degradation dari EBM terbaik ke tindakan feasible dan aman;
- desain profil fasilitas, bukan untuk menilai kinerja Puskesmas tertentu;
- audit tahunan bila data ASPAK atau standar Kemenkes berubah.

## 3. Sumber dan hierarki bukti

| Tingkat | Sumber | Peran | Keterbatasan utama |
|---|---|---|---|
| A | [Dashboard publik ASPAK](https://aspak.kemkes.go.id/aplikasi/dashboard/simple/dashboardpublik/kelengkapanspa) dan API DWH | Skor fasilitas dan proporsi memenuhi ambang | Metadata indikator masih memakai Permenkes 43; freshness dan validasi record publik tidak transparan |
| A | [Permenkes 19/2024](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-19-tahun-2024) | Standar Puskesmas aktif | Norma adalah target/floor, bukan bukti realisasi |
| A | [Profil Kesehatan Indonesia 2024](https://repository.kemkes.go.id/book/1356) | Jumlah fasilitas, jenis pelayanan, dan SDM | Agregat administratif, bukan audit fungsi alat |
| B | [Rifaskes 2019: Puskesmas](https://repository.badankebijakan.kemkes.go.id/id/eprint/4390/) | Distribusi item, layanan, utilitas, dan readiness mendekati sensus | Data sudah berumur dan mendahului ILP serta standar 2024 |
| B | [LAKIP Farmalkes 2024](https://farmalkes.kemkes.go.id/unduh/laporan-kinerja-direktorat-jenderal-kefarmasian-dan-alat-kesehatan-tahun-2024/) | Ketersediaan 40 obat indikator | Hanya fasilitas pelapor dan bukan bukti stok setiap item pada hari tertentu |
| B | [LAKIP Kesprimkom 2025](https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/LAKIP_DITJEN_Kesprimkom_TA_2025.pdf) | Indikator SPA yang lebih ketat pada tingkat kabupaten/kota | Unit analisis kabupaten/kota, bukan Puskesmas |
| Tata kelola | [Permenkes 31/2018 tentang ASPAK](https://farmalkes.kemkes.go.id/unduh/permenkes-31-2018/) | Makna pencatatan kondisi, fungsi, kalibrasi, dan validasi | Field kesiapan rinci tidak tersedia di ekspor agregat publik yang dipakai di sini |

Sumber normatif dan sumber empiris sengaja dipisahkan. "Wajib tersedia menurut
standar" tidak otomatis berarti "siap dipakai sekarang".

## 4. Metode

### 4.1 Ekstraksi ASPAK

Pada 15 Juli 2026, endpoint berikut diperiksa:

- [daftar periode](https://dwh-aspak.kemkes.go.id/payload/periode);
- [metadata F.01 SPA gabungan](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=48);
- [metadata F.02 alat](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=262);
- [metadata F.03 prasarana](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=261);
- [metadata F.04 sarana](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=260);
- endpoint `infopublic/membership` untuk agregasi provinsi;
- endpoint `infopublic/ranking` untuk skor fasilitas.

Contoh query reproduksi:

- [F.01 membership, periode 20263](https://dwh-aspak.kemkes.go.id/infopublic/membership?id_theme=48&treshold=60&sort_by=persen&sort_type=desc&id_lokasi=1&periode=20263&jenis=&kriteria=&rawdata=0);
- [F.02 membership, periode 20263](https://dwh-aspak.kemkes.go.id/infopublic/membership?id_theme=262&treshold=60&sort_by=persen&sort_type=desc&id_lokasi=1&periode=20263&jenis=&kriteria=&rawdata=0);
- [median candidate F.01, rank 5.131](https://dwh-aspak.kemkes.go.id/infopublic/ranking?page=5131&per-page=1&id_theme=48&treshold=60&sort_by=value&sort_type=asc&id_lokasi=1&id_sublokasi=0&periode=20263&jenis=&kriteria=).

Parameter ekspor mengembalikan tautan XLSX sementara yang dihapus setelah
diunduh. Karena itu, laporan mencatat query dan metode, bukan menanam tautan
artefak sementara sebagai referensi permanen.

Periode publik yang ditandai "Sekarang" adalah `20263`. Ekspor ranking F.01
diambil dalam 11 chunk melalui parameter `export=1` sampai `export=11`, diurutkan
menaik menurut nilai. Setelah header dibuang, terdapat **10.261 kode fasilitas
unik**.

Perhitungan:

- rerata = jumlah seluruh skor / 10.261;
- median = observasi urutan ke-5.131;
- Q1 dan Q3 dihitung dari distribusi penuh;
- proporsi lulus = jumlah skor >=60 / denominator snapshot;
- analisis sensitivitas mengeluarkan 21 record bernilai nol.

Median dan kuartil komponen F.02-F.04 diperoleh dari ranking nasional pada urutan
ke-2.566, 5.131, dan 7.696. Ekspor publik tidak memberikan item-level bundle,
sehingga tidak dilakukan rekonstruksi inventaris yang tidak dapat dibuktikan.

### 4.2 Triangulasi

Hasil ASPAK dibandingkan dengan:

- jumlah dan jenis Puskesmas pada Profil Kesehatan Indonesia 2024;
- item-level availability dan pelayanan pada Rifaskes 2019;
- indikator obat esensial Farmalkes 2024;
- standar dan masa transisi Permenkes 19/2024;
- indikator kabupaten/kota pada LAKIP Kesprimkom 2025.

### 4.3 Estimand yang digunakan

Ada empat estimand berbeda dan tidak boleh dicampur:

1. **Skor fasilitas**: indeks ASPAK per Puskesmas.
2. **Proporsi lulus**: persentase fasilitas melewati ambang indikator.
3. **Proporsi item tersedia**: persentase Puskesmas yang memiliki item tertentu.
4. **Readiness klinis**: item ada, berfungsi, terkalibrasi, ada bahan, dan ada
   petugas kompeten pada saat dibutuhkan.

Hanya estimand 1 dan 2 yang tersedia relatif mutakhir pada API publik. Estimand 3
ditriangulasi dari Rifaskes 2019. Estimand 4 tidak dapat disimpulkan dari satu
dashboard nasional.

## 5. Hasil ASPAK nasional

### 5.1 Pusat distribusi skor

| Indikator ASPAK | N | Q1 | Median | Q3 | Rerata |
|---|---:|---:|---:|---:|---:|
| F.01 SPA gabungan | 10.261 | 56,96 | **67,59** | 76,20 | **65,31** |
| F.02 alat kesehatan | 10.261 | 45,68 | **58,34** | 68,50 | tidak dihitung dari ekspor penuh |
| F.03 prasarana | 10.261 | 47,65 | **61,91** | 76,18 | tidak dihitung dari ekspor penuh |
| F.04 sarana | 10.261 | 71,43 | **83,89** | 91,08 | tidak dihitung dari ekspor penuh |

Interpretasi paling sederhana: **sarana relatif kuat; alat dan prasarana adalah
bottleneck**. Median fasilitas tidak mencapai 60 untuk komponen alat.

Analisis sensitivitas yang mengeluarkan 21 skor nol hanya mengubah rerata F.01
dari 65,31 menjadi 65,44 dan median dari 67,59 menjadi 67,64. Simpulan pusat
distribusi tidak berubah.

### 5.2 Proporsi memenuhi ambang publik 60

Endpoint membership memberi denominator 10.253, sedikit berbeda dari ranking.

| Indikator | Memenuhi / terdaftar | Persentase |
|---|---:|---:|
| F.01 SPA gabungan | 7.063 / 10.253 | **68,89%** |
| F.04 sarana | 8.809 / 10.253 | **85,92%** |
| F.03 prasarana | 5.572 / 10.253 | **54,35%** |
| F.02 alat kesehatan | 4.720 / 10.253 | **46,04%** |

Mengubah parameter URL `treshold` menjadi 50 atau 80 tidak mengubah hasil
membership. Endpoint tampaknya memakai threshold yang melekat pada indikator,
bukan parameter ad hoc. Karena itu tabel ini hanya sah untuk threshold publik
yang tertanam, yaitu 60.

### 5.3 Rawat inap versus nonrawat inap

Distribusi ranking F.01:

| Jenis | N ranking | Rerata | Median | Skor >=60 |
|---|---:|---:|---:|---:|
| Rawat inap | 4.259 | 68,71 | 70,38 | 3.235 (75,96%) |
| Nonrawat inap | 6.002 | 62,89 | 65,31 | 3.834 (63,88%) |

Endpoint membership dengan mode mentah memberi angka yang sangat dekat tetapi
tidak identik: 3.234/4.255 (76,00%) rawat inap dan 3.834/5.997 (63,93%)
nonrawat inap. Perbedaan kecil antarcache/endpoint ini adalah alasan angka harus
selalu disertai tanggal, endpoint, dan denominator.

### 5.4 Variasi geografis

Untuk F.01, proporsi provinsi yang melewati threshold 60 berkisar dari 100% di
DKI Jakarta (44/44 pada denominator ASPAK) sampai 11,24% di Papua Pegunungan
(20/178). Contoh lain:

| Provinsi | Memenuhi / terdaftar | Persentase F.01 |
|---|---:|---:|
| Jawa Timur | 959 / 979 | 97,96% |
| Jawa Tengah | 854 / 882 | 96,83% |
| Jawa Barat | 954 / 1.106 | 86,26% |
| Sumatera Utara | 370 / 620 | 59,68% |
| Nusa Tenggara Timur | 217 / 435 | 49,89% |
| Papua Pegunungan | 20 / 178 | 11,24% |

Median sederhana dari 38 persentase provinsi hanya 60,79%, lebih rendah daripada
proporsi nasional tertimbang 68,89%. Fasilitas di provinsi besar Jawa menarik
angka nasional ke atas. Karena itu, "nasional" tidak boleh digunakan sebagai
profil untuk seluruh storyline regional.

### 5.5 Freshness dan denominator

| Sumber/snapshot | Denominator |
|---|---:|
| Profil Kesehatan Indonesia, Desember 2024 | 10.268 |
| ASPAK membership agregat | 10.253 |
| ASPAK membership rawat + nonrawat | 10.252 |
| ASPAK ranking export | 10.261 |

Label periode publik adalah 2026 Q3, tetapi `lupdate` agregat provinsi yang
terlihat berada antara 12 Februari dan 5 Mei 2025. Ini dapat berarti nilai lama
dibawa ke periode aktif atau field tersebut adalah waktu kalkulasi terakhir;
endpoint publik tidak cukup untuk membedakannya. Laporan ini menyebut hasil
tersebut **snapshot yang diakses pada 2026**, bukan survei lapangan 2026.

## 6. Mengapa angka ASPAK belum cukup

### 6.1 Indikator publik masih legacy

Metadata F.01-F.04 secara literal masih menyebut "Permenkes 43" dan threshold
60. Permenkes 19/2024 telah mencabut Permenkes 43/2019 dan berlaku sejak
31 Desember 2024.

Permenkes 19/2024 memberi struktur yang berbeda:

- bangunan dan prasarana mendapat skor penuh pada pemenuhan >=80%;
- peralatan mendapat skor penuh pada pemenuhan >=60%;
- izin sementara Puskesmas baru dapat diberikan dengan 40 obat esensial dan
  60% alat, disertai ambang SDM;
- fasilitas yang sudah berjalan diberi waktu dua tahun untuk menyesuaikan,
  yaitu sampai 31 Desember 2026.

Jadi, skor ASPAK publik adalah proksi realitas transisi dan **bukan sertifikat
kepatuhan penuh pada standar 2024**.

### 6.2 Skor tidak sama dengan isi lemari

Median 67,59 tidak berarti Puskesmas median memiliki 67,59% dari setiap item.
Masalahnya:

- formula merupakan indeks dari beberapa kelompok dan bobot;
- dua fasilitas dapat memperoleh skor sama dari kekurangan yang berbeda;
- median tiap komponen dapat berasal dari fasilitas yang berbeda;
- ekspor publik tidak menunjukkan fungsi, kalibrasi, reagen, consumables, atau
  kompetensi operator;
- keberadaan alat pada tanggal entri tidak membuktikan alat siap saat kasus
  muncul.

Karena itu, baseline inventory harus dibuat dari gabungan distribusi skor,
item-level historical readiness, standar aktif, dan keputusan desain eksplisit.

## 7. Triangulasi readiness nyata

### 7.1 Bentuk fasilitas dan SDM

Profil Kesehatan Indonesia 2024 (PDF pp. 53, 58, 60) mencatat:

- 10.268 Puskesmas;
- 4.252 rawat inap (41,4%);
- 6.016 nonrawat inap (58,6%);
- 51,7% memiliki lengkap sembilan jenis tenaga kesehatan;
- 3,94% tidak memiliki dokter, dengan variasi provinsi yang sangat besar.

Untuk PRIMERA, dokter selalu hadir karena pemain adalah dokter. Namun, kehadiran
perawat, bidan, ATLM, farmasi, gizi, kesehatan lingkungan, dan petugas lain tidak
boleh otomatis dianggap lengkap pada setiap jam.

### 7.2 Alat pemeriksaan umum

Rifaskes 2019 (PDF p. 683) memberi item-level anchor berikut:

| Item | Perkotaan | Perdesaan | Terpencil |
|---|---:|---:|---:|
| Tempat tidur periksa | 98,4% | 98,2% | 92,5% |
| Timbangan dewasa | 96,8% | 95,9% | 92,3% |
| Stetoskop | 94,0% | 94,0% | 89,5% |
| Tensimeter | 84,1% | 82,5% | 74,6% |

Rifaskes juga mencatat rerata kelengkapan seluruh daftar alat poli umum hanya
63,03% di perkotaan, 60,25% di perdesaan, dan 54,58% di lokasi terpencil
(PDF p. 681). Jadi alat inti lazim, tetapi kelengkapan keseluruhan tidak.

### 7.3 KIA, laboratorium, dan pemeriksaan khusus

Beberapa contoh yang relevan:

- termometer klinis KIA tersedia pada 80,9% perkotaan, 78,7% perdesaan, dan
  69,8% terpencil (Rifaskes p. 689);
- rerata kelengkapan alat laboratorium adalah 51,31%, 46,36%, dan 39,80%
  untuk tiga strata wilayah tersebut (p. 693);
- pemeriksaan glukosa darah dilakukan pada 86,7% Puskesmas perkotaan, 80,0%
  perdesaan, dan 60,9% terpencil; HbA1c hanya 3,1-5,4% (p. 586);
- BTA dilakukan pada 87,5%, 79,6%, dan 70,9%, tetapi Xpert MTB jauh lebih
  terbatas (p. 598);
- EKG dilakukan pada 22,2% perkotaan, 20,2% perdesaan, dan 11,6% terpencil
  (p. 611);
- rontgen dilakukan pada 1,8%, 1,1%, dan 0,4% (p. 610).

Artinya, gula darah sederhana dapat dianggap common core. HbA1c, EKG, X-ray,
dan pemeriksaan lanjutan tidak boleh menjadi kemampuan diam-diam fasilitas
generik.

### 7.4 Utilitas, obstetri, dan layanan

Rifaskes 2019 menunjukkan:

- listrik 24 jam tersedia pada 97,7% Puskesmas perkotaan, 95,9% perdesaan,
  tetapi 68,3% terpencil di antara fasilitas yang memiliki listrik (p. 85);
- ANC dilakukan pada 99,3% rawat inap dan 98,3% nonrawat inap;
- oksitosin parenteral tersedia pada 82,8% rawat inap versus 56,4% nonrawat;
- antikonvulsan parenteral untuk ibu hamil 68,0% versus 43,5%;
- manual plasenta 78,0% versus 41,9% (p. 398).

Layanan umum dapat sangat luas, tetapi kemampuan tindakan spesifik tetap
berbeda. "Ada pelayanan KIA" tidak sama dengan "seluruh bundle PONED ready".

### 7.5 Obat esensial

LAKIP Farmalkes 2024 mencatat 9.509 dari 9.895 Puskesmas pelapor (96,10%)
memiliki sedikitnya 80% dari 40 obat indikator. Cakupan pelaporan adalah
9.895/10.406 (95,09%).

Ini mencegah baseline menjadi terlalu suram: formularium inti pada Puskesmas
pelapor umumnya cukup baik. Namun angka tersebut tidak membuktikan stok setiap
obat, tanggal kedaluwarsa, jumlah unit, atau ketersediaan pada hari permainan.
Fornas tetap menentukan status/restriksi; inventory lokal menentukan readiness.

## 8. Baseline desain yang direkomendasikan

### 8.1 Profil utama: `sukamaju_middle_v1`

Profil ini adalah **sintesis desain**, bukan klaim bahwa kombinasi tersebut adalah
modus joint distribution nasional.

| Dimensi | Baseline |
|---|---|
| Wilayah | Perdesaan, tidak terpencil |
| Kemampuan | Nonrawat inap |
| Band SPA | 60-69, mendekati median nasional |
| Jam rutin | Pelayanan harian; kesiapan di luar jam kerja dinyatakan terpisah |
| Layanan dasar | Rawat jalan, kunjungan rumah, gawat darurat awal, KIA, imunisasi, gizi, KB, PTM, penyakit menular, UKM |
| PONED | Tidak diasumsikan; harus dinyatakan/ditetapkan |
| Rawat inap 24/7 | Tidak |
| Rujukan | Jejaring RS/PONED ada, tetapi waktu, transport, dan capability selalu eksplisit |
| SDM | Dokter pemain hadir; tim inti ada menurut jadwal, tetapi sembilan profesi tidak diasumsikan hadir lengkap |

Pilihan perdesaan-nonrawat sesuai lore desa dan mayoritas nasional nonrawat inap.
Ia juga cocok dengan storyline yang menggambarkan fasilitas PONED sebagai tujuan
jejaring, bukan otomatis Puskesmas Sukamaju sendiri.

### 8.2 Resource Tier A-D — checklist editorial

M13-RP1 menetapkan tier berikut sebagai alat authoring dan review, bukan sebagai
simulasi inventory atau readiness runtime. Taksonomi ini berbeda dari authoring
Tier A/B/C yang mengatur kedalaman konten M13.

#### Tier A - core ready secara default

Didukung oleh prevalensi historis sangat tinggi dan kebutuhan layanan umum:

- tempat tidur/meja periksa;
- stetoskop;
- timbangan dewasa;
- alat ukur tinggi/panjang dan pita ukur dasar;
- hand hygiene, disinfektan, safety box, dan PPE dasar;
- alat balut/luka sederhana;
- pemeriksaan glukosa darah sederhana dengan strip pada jam layanan;
- obat inti sesuai formularium dan stok harian.

#### Tier B - common, default-on tetapi statusnya terlihat

Masuk akal tersedia pada Puskesmas tengah, tetapi tidak universal:

- tensimeter dan manset sesuai ukuran;
- termometer klinis;
- timbangan bayi dan perangkat antropometri anak;
- Doppler/fetoskop untuk KIA;
- Hb sederhana, carik celup urine, tes kehamilan;
- mikroskopi/RDT program tertentu sesuai epidemiologi;
- refrigerator/cold-chain untuk layanan imunisasi;
- listrik dan internet pada jam layanan.

Status Tier B harus dapat berubah menjadi rusak, habis bahan, atau operator tidak
tersedia. Perubahan harus terlihat sebelum keputusan klinis dinilai.

#### Tier C - wajib dinyatakan bila menjadi syarat jawaban

Tidak berarti selalu langka. Artinya bukti publik tidak cukup untuk menganggap
seluruh bundle selalu ready:

- sumber oksigen, regulator, kanula/masker, dan sisa kapasitas;
- pulse oximeter yang berfungsi;
- nebulizer, unit-dose, listrik, dan consumables;
- bag-valve-mask, suction, airway adjunct, monitor;
- EKG 12 sadapan;
- otoskop dan spekulum yang sesuai;
- alat ekstraksi benda asing;
- bidai, balut steril, akses IV/IO, antibiotik parenteral, tetanus;
- CBC analyzer/hematologi lengkap dan reagen;
- PONED beserta tim dan obat lengkap;
- ambulans/transport, petugas pendamping, komunikasi, dan tujuan rujukan;
- layanan 24 jam.

Jika tindakan Tier C diberi skor wajib, vignette atau panel resource harus
menyatakan `ready` sebelum pemain memilih tindakan.

#### Tier D - tidak diasumsikan pada Puskesmas generik

- X-ray/radiologi;
- USG diagnostik lanjutan;
- HbA1c rutin;
- troponin serial, analisis gas darah, elektrolit cepat lengkap;
- CT, MRI, ICU, ventilator, bank darah;
- fibrinolisis/PCI dan layanan spesialistik definitif.

Tier D tetap dapat muncul sebagai fasilitas jejaring atau profil khusus, bukan
sebagai default Sukamaju.

### 8.3 Model readiness konseptual — ditunda dari runtime

Model berikut adalah arah desain yang dapat dipertimbangkan kembali setelah
M13-1b. M13-RP1 tidak menyetujuinya sebagai fitur engine saat ini.

Setiap resource klinis sebaiknya memiliki status:

1. `ready`: ada, berfungsi, bahan ada, operator ada;
2. `present_not_ready`: ada tetapi rusak/tidak terkalibrasi/habis bahan;
3. `scheduled_or_shared`: tersedia hanya pada jadwal/jejaring tertentu;
4. `unavailable`: tidak tersedia lokal;
5. `unknown`: belum diverifikasi.

Metadata minimal:

- `verifiedAt`;
- `source` (`facility_profile`, ASPAK snapshot, stok harian, atau event);
- `consumablesReady`;
- `operatorReady`;
- `fallbackDestination` dan estimasi waktu bila relevan.

## 9. Implikasi langsung untuk M13-1a

| Kasus | Resource yang harus terlihat | Baseline yang disarankan |
|---|---|---|
| Nayla, diare bayi | timbangan bayi, oralit/zinc, akses IV/IO dan cairan bila Plan C | antropometri core; bundle resusitasi dinyatakan ready |
| Dimas, asma berat | pulse oximeter, oksigen, nebulizer, unit-dose, consumables, transport | Tier C; tidak boleh menjadi kejutan setelah pemain menjawab |
| Hipoglikemia | glucometer + strip, glukosa oral/IV sesuai kesadaran | GDS common; jalur IV dinyatakan bila dibutuhkan |
| Benda asing hidung | cahaya, visualisasi, alat ekstraksi, positioning/tenaga | Tier C; satu upaya hanya bila bundle lengkap |
| Otitis | otoskop berfungsi dan spekulum sesuai anak | eksplisit karena diagnosis bulging bergantung alat |
| Fraktur terbuka | balut steril, bidai, analgesia, akses IV, antibiotik/tetanus, transport | Tier C dan protocol-linked; tanpa substitusi improvisasi |
| STEMI | EKG, aspirin, oksigen karena hipoksemia, monitor/transport | EKG wajib eksplisit; data Rifaskes tidak mendukung asumsi default |
| UKM pilot | kendaraan, konektivitas, kader, cold-chain atau kit lapangan sesuai aktivitas | profile/event-level, bukan inventaris klinik generik |

## 10. Aturan pedagogis dan UX

1. **Jangan memberi hukuman tersembunyi.** Resource yang tidak dinyatakan tidak
   boleh menjadi syarat skor.
2. **Satu encounter, maksimal satu keterbatasan utama** kecuali learning
   objective memang resource coordination. Ini menahan cognitive overload.
3. **Tampilkan readiness ringkas di awal**: ikon alat, stok, SDM, transport, dan
   jejaring; detail dibuka bila diperlukan.
4. **Kebenaran klinis tidak berubah.** Resource limitation mengubah tindakan
   feasible dan disposisi, bukan diagnosis atau standar EBM.
5. **Tidak semua hari harus sulit.** Baseline utama stabil dan kompeten;
   downtime/resource scarcity dipakai sebagai skenario bermakna, bukan noise
   acak yang terus-menerus.
6. **Reward coordination.** Mengenali alat rusak, meminta bantuan, memulai
   stabilisasi feasible, dan mengaktifkan rujukan harus memperoleh kredit.
7. **Jangan ubah Puskesmas menjadi mini-RS.** Rawat inap dibatasi paling banyak
   10 tempat tidur dan perawatan paling lama lima hari menurut Permenkes 19/2024.

## 11. Temuan yang sering salah dibaca

### 11.1 Angka 68,89% bukan "kesiapan 68,89%"

Itu adalah proporsi fasilitas yang melewati threshold indikator legacy, bukan
persentase alat yang berfungsi dan bukan peluang setiap tindakan dapat dilakukan.

### 11.2 Angka 0,19% bukan hanya 0,19% Puskesmas yang siap

LAKIP Kesprimkom 2025 melaporkan 0,19% **kabupaten/kota** memiliki minimal 90%
Puskesmas dengan skor SPA >=70. Ini indikator jauh lebih ketat dan unit
analisisnya kabupaten/kota.

### 11.3 KFA dan Fornas bukan inventaris lokal

- KFA mengunci identitas/nomenklatur produk;
- Fornas mengatur status/restriksi formularium JKN;
- ASPAK merekam sarana/prasarana/alat fasilitas;
- stok harian, fungsi, consumables, SDM, dan jejaring tetap perlu state lokal.

### 11.4 "Sesuai standar" bukan "selalu tersedia"

Standar adalah baseline normatif. Game harus mengajarkan standar terbaik dan
sekaligus jalur aman ketika resource belum ready, sesuai prinsip graceful
degradation yang telah ditetapkan untuk M13.

## 12. Limitasi ilmiah

1. Metadata ASPAK F.01-F.04 masih mengacu pada regulasi yang sudah dicabut.
2. Periode `20263` tidak membuktikan observasi lapangan 2026; `lupdate` yang
   terlihat terutama berasal dari 2025.
3. Denominator antarsumber berbeda 10.252-10.268 karena definisi, cache, dan
   waktu snapshot.
4. Ekspor ranking publik memberi skor tetapi tidak memberi item-level
   readiness, status validasi, atau formula lengkap yang dapat direkonstruksi.
5. Rifaskes 2019 adalah sumber item-level terbaik yang ditemukan, tetapi sudah
   tua dan mendahului pandemi, ILP, serta standar 2024.
6. Rerata/median nasional menutupi variasi provinsi, perkotaan/perdesaan,
   terpencil, rawat/nonrawat, akreditasi, dan BLUD.
7. Median komponen tidak boleh digabung sebagai satu fasilitas nyata tanpa
   mikrodata multivariat lengkap.
8. Data availability tidak sama dengan clinical readiness saat pasien datang.

## 13. Rekomendasi keputusan

### Sekarang

1. Gunakan `sukamaju_middle_v1` sebagai baseline naratif/authoring yang telah
   disetujui melalui M13-RP1, belum sebagai kode runtime.
2. Gunakan Resource Tier A-D sebagai checklist editorial saat mengadjudikasi
   delapan kasus M13-1a.
3. Minta resource Tier C dinyatakan eksplisit sebelum aktivasi kasus; jangan
   membuat hidden penalty berbasis resource.
4. Pertahankan PONED, rawat inap, EKG, radiologi, dan advanced lab sebagai
   capability yang tidak otomatis ada.
5. Jangan menurunkan core formulary menjadi gambaran stok selalu kosong; data
   obat nasional mendukung baseline yang cukup baik tetapi tidak sempurna.

### Jika scope engine dibuka kembali — ditunda

Butir berikut bukan pekerjaan M13-1a. Ia hanya boleh dibuka kembali melalui
RFC/milestone engine tersendiri setelah M13-1b memberi bukti kebutuhan.

1. Buat schema `FacilityResourceProfile` terpisah dari konten kasus.
2. Simpan `dataVintage`, status readiness, dan provenance per resource.
3. Biarkan kasus meminta capability, bukan meng-hardcode asumsi fasilitas.
4. Tambahkan invariant: tindakan wajib tidak boleh aktif bila resource belum
   dideklarasikan `ready` atau fallback aman belum tersedia.
5. Kalibrasi frekuensi downtime melalui pilot mahasiswa, bukan angka asumsi.

### Audit berkala

1. Ulang ekstraksi ASPAK setiap rilis konten besar atau minimal tahunan.
2. Ganti baseline ketika metadata publik benar-benar berpindah ke Permenkes
   19/2024 atau standar berikutnya.
3. Cari facility-level validated extract resmi bila Kemenkes membuka akses.
4. Perbarui item-level readiness ketika Rifaskes baru atau survei fasilitas
   nasional baru diterbitkan.

## 14. Ringkasan satu halaman

**Puskesmas tengah Indonesia bukan fasilitas kosong.** Core examination,
layanan primer, UKM, dan formularium inti umumnya nyata. Namun **Puskesmas
tengah juga bukan mini-RS**: kelengkapan alat adalah bottleneck, staf lengkap
hanya sekitar separuh, dan EKG/radiologi/advanced lab tidak layak diasumsikan.

Baseline PRIMERA yang paling adil:

- perdesaan, nonrawat inap;
- core service stabil dan kompeten;
- skor SPA band 60-69;
- alat umum dasar tersedia;
- tensimeter/termometer/basic lab common tetapi status terlihat;
- oksigen/nebulizer/EKG/alat tindakan/transport dinyatakan bila dinilai;
- PONED, rawat inap, radiologi, dan advanced lab bukan default;
- resource limitation menghasilkan graceful degradation dan koordinasi rujukan,
  bukan perubahan standar klinis atau hukuman kejutan.

## 15. Referensi utama

1. Kementerian Kesehatan RI. [Profil Kesehatan Indonesia 2024](https://repository.kemkes.go.id/book/1356). Jakarta; 2025.
2. Kementerian Kesehatan RI. [Permenkes 19/2024 tentang Penyelenggaraan Puskesmas](https://jdih.kemkes.go.id/storage/documents/pdfs/2024permenkes019.pdf).
3. Kementerian Kesehatan RI. [Permenkes 31/2018 tentang ASPAK](https://farmalkes.kemkes.go.id/unduh/permenkes-31-2018/).
4. Badan Litbangkes. [Laporan Nasional Puskesmas Rifaskes 2019](https://repository.badankebijakan.kemkes.go.id/id/eprint/4390/1/lapnas_puskesmas_rifas19.pdf).
5. Ditjen Farmalkes. [Laporan Kinerja Tahun 2024](https://farmalkes.kemkes.go.id/unduh/laporan-kinerja-direktorat-jenderal-kefarmasian-dan-alat-kesehatan-tahun-2024/).
6. Ditjen Kesprimkom. [Laporan Kinerja Tahun 2025](https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/LAKIP_DITJEN_Kesprimkom_TA_2025.pdf).
7. Kementerian Kesehatan RI. [KMK 1578/2024 tentang jenis alat kesehatan Puskesmas](https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/2024kepmenkes1578.pdf).
8. ASPAK. [Infoboard](https://aspak.kemkes.go.id/aplikasi/infoboard), [periode](https://dwh-aspak.kemkes.go.id/payload/periode), [F.01](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=48), [F.02](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=262), [F.03](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=261), dan [F.04](https://dwh-aspak.kemkes.go.id/payloadtwo/indikator?id=260). Diakses 15 Juli 2026.
