# M11 Item #7 - Riset Celah Realita FKTP Indonesia 2026

**Tanggal:** 2026-07-17<br>
**Snapshot:** `945ce39`, `REVISI_ENGINE=44`<br>
**Status:** riset dan draft editorial; **bukan izin menempelkan konten**<br>
**Relasi:** melanjutkan audit 67/67 kasus lama dan baseline ASPAK M13-RP1.

## 1. Ringkasan eksekutif

Lapisan `catatanRealita` yang sudah ada terutama membahas obat, alat, dan batas
layanan per kasus. Sapuan ini menemukan sembilan tema yang cukup kuat untuk
diterjemahkan selektif: stok riil, komposisi tim, koneksi/listrik, fragmentasi
data, rujukan closed-loop, geografi, transisi ILP/outreach, literasi obat, serta
continuity JKN/PRB.

Kesimpulan pentingnya bukan "Puskesmas serba kekurangan". Data nasional justru
menunjukkan fasilitas inti sering ada, tetapi variasi antardaerah dan readiness
pada hari tertentu nyata. Simulator yang adil harus:

1. mempertahankan PPK/PNPK sebagai safety floor;
2. menyatakan resource yang menentukan jawaban sebelum pemain dinilai;
3. memberi jalur adaptasi aman dan jejaring;
4. memisahkan keputusan klinis dari nasib sistem;
5. tidak mengubah hasil studi lokal menjadi probabilitas nasional.

Tidak ada usulan `FacilityResourceProfile` runtime dalam dokumen ini. Keputusan
M13-RP1 tetap berlaku: `sukamaju_middle_v1` adalah baseline naratif, sedangkan
simulasi readiness dinamis ditunda.

## 2. Pertanyaan riset

1. Celah realita apa yang didukung data nasional atau multi-site mutakhir?
2. Mana yang cukup kuat menjadi aturan authoring, dan mana yang hanya cocok
   menjadi kejadian lokal eksplisit?
3. Bagaimana menulis `catatanRealita` tanpa menormalisasi praktik substandar?
4. Bagaimana realita tersebut memperkaya game tanpa menjadi minigame birokrasi?

## 3. Hierarki dan batas bukti

| Tingkat | Jenis sumber | Penggunaan yang sah |
|---|---|---|
| A | Regulasi/KMK/portal resmi Kemenkes terkini | Safety floor, fungsi layanan, terminologi |
| B | Sensus atau survei nasional/mendekati sensus | Baseline nasional dengan tahun dan denominator |
| C | Studi multi-provinsi/multi-distrik | Pola implementasi, bukan prevalensi nasional bila sampling terbatas |
| D | Studi satu provinsi/kota/Puskesmas | Inspirasi skenario lokal yang dinyatakan eksplisit |
| E | Pendapat, berita, anekdot | Tidak cukup untuk klaim authoring faktual |

PPK/PNPK dan kebijakan Kemenkes adalah lantai, bukan plafon. EBM yang lebih baru
boleh dipakai dengan sitasi dan graceful degradation.
[Fornas 1199/2025](https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/)
digunakan untuk status formularium aktif; pencantuman Fornas tidak membuktikan stok lokal.
ASPAK digunakan untuk konteks sarana/prasarana/alat, dan KFA untuk nama/kode,
bukan untuk mengklaim readiness saat pasien datang.

## 4. Matriks temuan dan terjemahan gameplay

### 4.1 Formularium tidak sama dengan stok hari ini

**Bukti.** Sensus 9.831 Puskesmas di 514 kabupaten/kota menemukan median
ketersediaan 17 obat prioritas 82%, tetapi hanya 58% untuk 60 obat yang lebih
luas; kategori KIA 73% dan kesehatan jiwa 42%. Variasi terendah terdapat di
wilayah rural timur
([Fanda et al., 2024](https://www.sciencedirect.com/science/article/pii/S2772368223002056)).
Analisis lanjutan terhadap survei fasilitas nasional yang sama, dipublikasikan
2026, melaporkan rerata 66% dari 50 obat dengan rentang kabupaten 43%-83%;
keberadaan farmasis, pedoman, penyimpanan, FEFO, otonomi pengadaan, dan stok
distrik berasosiasi dengan ketersediaan
([Yuniar et al., 2026](https://doi.org/10.1136/bmjgh-2025-019616)).

**Batas inferensi.** Angka adalah availability saat survei, bukan peluang random
stockout per hari. Daftar Fornas juga tidak boleh dibaca sebagai inventaris.

**Manifestasi yang aman.** Pada kasus tertentu, nyatakan stok/ketiadaan sebelum
pilihan; terima alternatif pedoman atau koordinasi jejaring. Jangan menggulirkan
stockout acak tersembunyi.

**Draft siap-pakai:**

> Fornas menentukan obat yang dapat disediakan, bukan menjamin stok lokal hari
> ini. Bila item tidak tersedia, gunakan alternatif setara yang didukung pedoman
> atau jejaring; jangan mengganti dengan regimen improvisasi dan jangan menunda
> stabilisasi atau rujukan.

### 4.2 Komposisi tim tidak selalu lengkap

**Bukti.** Rencana Aksi Program Ditjen SDMK 2025-2029 mencatat bahwa pada Mei
2025, dari 10.212 Puskesmas, 424 belum memiliki dokter; kekurangan dokter gigi
tercatat di 2.743 Puskesmas, tenaga sanitasi 1.217, ATLM 814, gizi 757, promosi
kesehatan 474, farmasi 456, bidan 39, dan perawat 10
([Kemenkes, halaman 18](https://kms.kemkes.go.id/contents/1781147466787-5344b228c82a971fc5447a467394a896.pdf)).

**Batas inferensi.** Ini snapshot administratif dan tidak menunjukkan siapa yang
sedang bertugas pada satu shift. Sukamaju sendiri sudah mempunyai dokter pemain;
game tidak boleh tiba-tiba menghapus peran itu demi statistik nasional.

**Manifestasi yang aman.** Resource profesi spesifik harus dinyatakan hadir,
terjadwal, atau melalui jejaring. Satu bottleneck SDM per episode sudah cukup.

**Draft siap-pakai:**

> Kasus menyatakan [profesi] tersedia atau terhubung melalui jejaring. Jangan
> menganggap seluruh Puskesmas mempunyai tim lengkap; bila tenaga tersebut tidak
> ada, lakukan langkah dalam kompetensi, tetapkan penanggung jawab, dan
> koordinasikan jejaring tanpa menghapus langkah keselamatan.

### 4.3 Internet dan listrik memerlukan jalur kontingensi

**Bukti.** Survei nasional 10.378 dari 10.382 Puskesmas melaporkan 7,18% tanpa
internet, 14,33% akses terbatas, 53,64% cukup, dan 24,85% cukup-cepat; 8,02%
tidak memiliki listrik 24 jam
([Aisyah et al., 2025](https://medinform.jmir.org/2025/1/e65940)). Studi tersebut
menilai infrastruktur, bukan dampak langsung terhadap outcome klinis.

**Batas inferensi.** Mayoritas mempunyai internet memadai. Gangguan digital
adalah contingency yang realistis, bukan default setiap rujukan.

**Manifestasi yang aman.** Jalur telepon/offline dan sinkronisasi susulan boleh
menjadi satu pilihan sistem; stabilisasi serta transfer gawat tidak boleh
menunggu koneksi pulih.

**Draft siap-pakai:**

> SISRUTE atau SATUSEHAT dapat terhambat koneksi. Gunakan jalur telepon/offline
> dan dokumentasi susulan sesuai SOP bila perlu; gangguan internet tidak boleh
> menunda stabilisasi atau transfer pasien gawat.

### 4.4 Fragmentasi sistem informasi adalah beban, bukan tujuan belajar

**Bukti.** Penilaian ICT pada 121 Puskesmas, 67 Dinas Kesehatan, dan 49 klinik di
9 provinsi memberi skor kematangan rata-rata 2,74/5 dengan variasi regional
([Aisyah et al., 2024](https://medinform.jmir.org/2024/1/e55959)). Survei 2025
melaporkan rerata 30 sistem informasi di Puskesmas rural, 33 urban, dan 22 remote,
serta mengaitkan banyak aplikasi program dengan fragmentasi dan beban petugas
([studi utilisasi HIS](https://medinform.jmir.org/2025/1/e68613/)).

**Batas inferensi.** Angka aplikasi bukan jumlah form yang diisi setiap pasien
dan tidak otomatis berarti pelayanan gagal.

Sebagai triangulasi, laporan implementasi SATUSEHAT menyebut bahwa per 29
Agustus 2024, 83% dari 32.951 fasyankes yang telah memakai RME sudah terintegrasi,
tetapi hanya 43% dari kelompok terintegrasi mengirim data konsisten. Denominator
ini mencakup semua jenis fasyankes, bukan Puskesmas saja
([BKPK 2024, halaman 90](https://repository.badankebijakan.kemkes.go.id/id/eprint/5606/1/LKj%20Pusjak%20KGTK_2024%20%281%29.pdf)).
Karena itu riwayat digital kosong tidak boleh dianggap bukti bahwa riwayat klinis
memang tidak ada.

**Manifestasi yang aman.** Abstraksikan entri berulang. Modelkan hanya kegagalan
yang mengubah keputusan: identitas tak cocok, laporan belum terkirim, atau
feedback tak kembali. Satu tombol "rekonsiliasi" lebih tepat daripada simulasi
30 aplikasi.

**Draft siap-pakai:**

> Pelaporan program dapat memerlukan sinkronisasi lintas sistem. Game
> mengabstraksikan entri data; yang wajib dijaga adalah identitas pasien, masalah
> aktif, penanggung jawab, tindakan berikut, tenggat, dan umpan balik.

**Draft rekonsiliasi siap-pakai:**

> Riwayat digital kosong tidak membuktikan pasien belum pernah berobat. Lakukan
> rekonsiliasi obat, konfirmasi pasien atau keluarga, dan telaah dokumen yang
> tersedia sebelum menarik kesimpulan.

### 4.5 Rujukan harus closed-loop

**Bukti.** Permenkes 16/2024 menempatkan rujukan sebagai pelimpahan tanggung
jawab timbal balik menurut kebutuhan, kemampuan, jarak, dan waktu tempuh.
Playbook SATUSEHAT Rujukan versi 2026 sudah memuat alur rujuk balik
([SATUSEHAT](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/rujukan/)).
WHO juga memasukkan protokol referral/counter-referral dan care pathway sebagai
komponen model layanan primer
([WHO PHC Measurement Framework](https://www.who.int/teams/integrated-health-services/health-services-performance-assessment/phc-measurement-framework-and-indicators)).

**Batas inferensi.** Belum ditemukan estimasi nasional mutakhir yang cukup kuat
untuk menyatakan persentase rujukan yang kehilangan feedback. Karena itu game
tidak boleh mengarang probabilitas "SISRUTE gagal".

**Manifestasi yang aman.** Tracer episode memakai status `sent -> accepted ->
completed -> feedback -> acted`. Kanal digital boleh gagal, tetapi tanggung
jawab klinis tetap berjalan lewat jalur alternatif.

**Draft siap-pakai:**

> Surat rujukan bukan akhir episode. Rujukan selesai setelah fasilitas tujuan
> menerima, pelayanan terjadi, umpan balik atau rujuk balik diterima, dan tindak
> lanjut FKTP dijalankan. Bila kanal digital gagal, gunakan koordinasi alternatif
> yang terdokumentasi.

### 4.6 Geografi harus spesifik skenario, bukan stereotip nasional

**Bukti.** Analisis spasial Maluku menemukan variasi besar jarak darat/laut ke
Puskesmas dan rumah sakit, serta hambatan transport antarpulau
([Leosari et al., 2023](https://doi.org/10.1371/journal.pgph.0001600)). Ini bukti
kuat untuk konteks kepulauan Maluku, bukan rerata Indonesia.

**Batas inferensi.** Angka Maluku tidak boleh diterapkan ke Jawa, Kalimantan,
Papua, atau Sukamaju tanpa deklarasi setting. Jarak lurus juga bukan waktu tempuh.

**Manifestasi yang aman.** Vignette regional menyebut moda, waktu, cuaca bila
relevan, caregiver, dan rencana transport. Resource jarak muncul sebagai cue
sebelum keputusan, bukan dadu tersembunyi sesudah pemain merujuk.

**Draft siap-pakai:**

> Waktu tempuh dan moda transport dalam vignette adalah bagian keputusan, bukan
> dekorasi. Mulai stabilisasi dan koordinasi sedini mungkin; jangan menunggu
> pemeriksaan non-esensial. Angka jarak ini khusus skenario, bukan gambaran
> nasional.

### 4.7 ILP dan outreach memerlukan continuity, bukan hanya coverage

**Bukti.** KMK 2015/2023 menghubungkan layanan siklus hidup, jejaring desa,
kunjungan rumah, dan PWS. Studi readiness pada 44 Puskesmas Jakarta serta
monitoring Itjen 2025 menunjukkan friksi koordinasi/data/outreach, tetapi
keduanya tidak mewakili prevalensi nasional
([studi Jakarta](https://scholar.ui.ac.id/en/publications/readiness-of-community-health-centers-to-implement-integrated-pri/),
[Itjen 2025](https://itjen.kemkes.go.id/storage/laporan/laporan_kinerja_inspektorat_2_tahun_2025.pdf)).

**Batas inferensi.** Gunakan sebagai bukti jenis masalah, bukan angka peluang.

**Manifestasi yang aman.** Temuan rumah harus menempel ke orang/keluarga yang
sama, memiliki owner, next action, dan callback klinis. Coverage tanpa tindak
lanjut tidak dianggap closure.

**Draft siap-pakai:**

> Temuan kunjungan rumah harus kembali ke orang dan keluarga yang sama serta
> menghasilkan tindakan berikut. Bila koordinasi lintas klaster belum mulus,
> tetapkan satu penanggung jawab dan verifikasi tindak lanjut; jangan biarkan
> data hanya menaikkan indikator.

### 4.8 Informasi obat perlu diverifikasi sebagai pemahaman

**Bukti.** Studi multi-center pasien Puskesmas Makassar 2023 menemukan gap antara
harapan dan pengalaman layanan informasi obat
([studi DIS Puskesmas urban](https://pmc.ncbi.nlm.nih.gov/articles/PMC11391965/)).
Karena satu setting urban tidak mewakili nasional, temuan ini hanya mendukung
jenis celah. Metode teach-back AHRQ memberi respons praktis: minta pasien
menjelaskan atau memperagakan kembali, lalu re-teach bila perlu
([AHRQ](https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html)).

**Batas inferensi.** Jangan memberi label "literasi rendah" berdasarkan lokasi,
pendidikan, atau ekonomi. Pemahaman harus diuji secara non-shaming pada semua.

**Manifestasi yang aman.** Gunakan hanya pada edukasi berisiko tinggi dan
hubungkan ke usulan M11 #6 V2.

**Draft siap-pakai:**

> Menyebut topik atau memberi leaflet bukan bukti pasien memahami. Minta pasien
> atau wali menjelaskan kembali rencana atau memperagakan langkah penting tanpa
> mempermalukan; bila belum tepat, jelaskan ulang dan cek kembali.

### 4.9 Kepesertaan, rujuk balik, dan continuity bukan hal yang sama

**Bukti.** Pada 31 Desember 2024, DJSN mencatat 278,1 juta peserta JKN terdaftar,
tetapi 222,67 juta aktif; 55,43 juta atau 19,9% peserta tercatat nonaktif
([DJSN Monthly Report](https://kesehatan.djsn.go.id/kesehatan/doc/laporan-bulanan/Monthly_Report_JKN_12_2024.pdf)).
Status ini tidak boleh ditebak dari kartu atau riwayat lama dan tidak boleh
menghalangi pertolongan gawat darurat.

Untuk PRB, KMK 1645/2024 melaporkan bahwa dari peserta dengan diagnosis PRB di
FKRTL, 11% dirujuk balik pada 2022 dan 10% pada 2023. Dari yang dirujuk balik,
60,68% terpantau aktif melanjutkan pelayanan di FKTP hingga 2024. Pada Desember
2023 terdapat 1.789 apotek mitra PRB, termasuk 266 ruang farmasi Puskesmas
([KMK 1645/2024, halaman 6](https://keslan.kemkes.go.id/unduhan/fileunduhan_1730689792_877636.pdf)).

**Batas inferensi.** Angka JKN nasional bukan peluang status individu; angka PRB
administratif juga tidak menjelaskan seluruh alasan klinis atau pilihan pasien.
Namun keduanya cukup kuat untuk membuktikan bahwa `terdaftar`, `dirujuk balik`,
dan `aktif berlanjut` adalah state berbeda.

**Manifestasi yang aman.** PRB tracer baru dianggap tertutup setelah resume,
rencana obat, titik pengambilan obat, jadwal kontrol, dan penelusuran mangkir
jelas. Masalah administrasi rutin diberi jalur penyelesaian, tidak dijadikan
penalti klinis tersembunyi.

**Draft JKN siap-pakai:**

> Status JKN untuk layanan rutin perlu diverifikasi; terdaftar tidak selalu
> berarti aktif. Arahkan masalah administrasi ke kanal penyelesaian tanpa
> menghalangi pertolongan gawat darurat.

**Draft PRB siap-pakai:**

> Rujuk balik baru lengkap setelah resume klinis, rencana obat, titik pengambilan
> obat, jadwal kontrol, dan penanggung jawab tindak lanjut diterima FKTP. Surat
> tanpa continuation plan belum menutup episode.

## 5. Prioritas penerapan bila disetujui

| Prioritas | Tema | Bentuk | Alasan |
|---|---|---|---|
| P1 | Formularium vs stok | Revisi selektif catatan obat | Bukti nasional terkuat; sering memengaruhi keputusan |
| P1 | Closed-loop referral | Hero-loop/receipt | Menutup bridge UKM-UKP dan payoff longitudinal |
| P1 | Internet contingency | Satu varian SISRUTE | Aman bila tidak menunda transfer |
| P1 | PRB dan continuity | Hero-loop kronis | Gap nasional terukur; payoff bridge tinggi |
| P2 | SDM | Deklarasi profesi/jejaring | Mencegah asumsi tim ideal |
| P2 | ILP continuity | Callback keluarga/program | Masalah gameplay nyata yang sudah terverifikasi |
| P2 | Teach-back | Pilot kasus terpilih | Nilai klinis tinggi; perlu mekanik kecil |
| P3 | Fragmentasi aplikasi | Abstraksi naratif | Realistis tetapi nilai belajar administratif rendah |
| P3 | Geografi | Storyline regional spesifik | Kaya bila setting dan sumber jelas |

## 6. Klaim prototipe yang perlu rekonsiliasi sebelum aktivasi

Sapuan read-only menemukan sejumlah `catatanRealita` pada kasus lab yang memakai
frekuensi nasional atau generalisasi lapangan tanpa scope/sitasi di teks. Ini
**bukan bukti bahwa substansinya pasti salah**, tetapi kekuatan bahasanya melebihi
bukti yang tercantum. Karena kasus-kasus tersebut masih prototipe menunggu
adjudikasi, perbaikannya sebaiknya masuk review M13-137, bukan hotfix gameplay.

| Lokasi | Frasa berisiko | Tindakan editorial |
|---|---|---|
| `batch4Dalam.ts:484` | "nyaris tidak pernah"; "hampir selalu" | Ganti kondisi skenario/jejaring atau beri data wilayah-tahun |
| `batch4Dalam.ts:930` | "hampir selalu datang terlambat"; "paling terabaikan" | Pisahkan mekanisme klinis neuropati dari klaim frekuensi |
| `batch4Dalam.ts:1370` | "banyak Puskesmas hanya punya satu tabung" | Nyatakan konfigurasi Sukamaju atau sitasi survei item-level |
| `batch4ObgynAnak.ts:234,434` | "di banyak Puskesmas USG tidak ada"; operator "lebih langka" | Kaitkan ke baseline ASPAK tanpa mengarang prevalensi item |
| `batch4ObgynAnak.ts:643` | "antrean 60 orang" | Jadikan detail vignette lokal, bukan gambaran umum |
| `batch4Bedah.ts:95,170` | ambulans/USG/tukang urut sebagai pola umum | Deklarasikan setting atau tambah sumber regional |
| `batch4Bedah.ts:402` | stok "habis-habisan" dan skill petugas | Gunakan bahasa netral: tidak diasumsikan ready |
| `batch4Bedah.ts:549` | antrean kolonoskopi "berbulan-bulan" | Nyatakan jejaring/waktu vignette atau beri data lokal |
| `batch4MataThtSaraf.ts:166` | antrean katarak "berbulan-bulan" | Nyatakan setting dan faktor navigasi keluarga |

Template perbaikannya sederhana:

```text
Standar: apa yang seharusnya dilakukan.
Kondisi skenario: resource/jejaring yang tersedia hari ini.
Adaptasi aman: apa yang dilakukan bila kondisi tidak ideal.
```

## 7. Aturan editorial sebelum menempelkan draft

1. Jangan bulk-paste satu paragraf ke semua kasus; pilih hanya bila mengubah
   keputusan, feasibility, komunikasi, atau follow-up.
2. Ganti placeholder dan sebut resource konkret kasus.
3. Pisahkan tiga lapis: **standar**, **kondisi skenario**, **adaptasi aman**.
4. Hindari kata absolut seperti "selalu ada", "praktis tak tersedia", atau
   "Puskesmas pasti".
5. Jangan menamai alternatif obat tanpa cross-check PPK/PNPK, Fornas, dosis,
   kontraindikasi, dan populasi.
6. Jangan jadikan kelangkaan alasan menurunkan safety floor atau menunda rujuk.
7. Setiap angka regional harus menyebut tempat, tahun, dan keterbatasan.
8. Physician review wajib untuk teks yang mengubah terapi, stabilisasi, atau
   disposisi; catatan sistem non-klinis tetap perlu editorial review.

## 8. Yang tidak direkomendasikan

- random stockout berdasarkan persentase nasional;
- "mode Papua" atau "mode terpencil" yang identik dengan kegagalan;
- kehilangan poin karena pemain tidak memakai resource yang tidak pernah
  dinyatakan tersedia;
- simulasi klik 20-30 aplikasi program;
- probabilitas rujukan ditolak tanpa data dan tanpa jalur recovery;
- menganggap semua obat non-Fornas tidak dapat diperoleh melalui jejaring;
- menampilkan masalah sistem tanpa agency atau tindakan aman.

## 9. Hubungan dengan proposal bridge

Temuan ini mendukung `BRIDGE-PHC-LITE` dalam
`docs/UKM_UKP_BRIDGE_CLOSED_LOOP_PROPOSAL.md`, terutama owner, next action,
feedback, contingency, dan causal receipt. Namun bukti realita tidak otomatis
menyetujui skema engine. Implementasi bridge tetap memerlukan keputusan terpisah.

## 10. Keputusan yang diminta

1. Setujui/tolak sembilan tema sebagai pedoman authoring.
2. Pilih tema P1 yang boleh masuk pilot konten.
3. Tentukan apakah teach-back dan closed-loop referral boleh maju ke RFC engine.
4. Pertahankan atau buka kembali batas M13-RP1 untuk resource runtime. Rekomendasi
   dokumen ini: **pertahankan batas tersebut** sampai playtest membuktikan perlu.

## 11. Kesimpulan

Realita FKTP yang paling mendidik bukan daftar kekurangan, melainkan latihan
menjaga standar ketika stok, tenaga, koneksi, jarak, atau koordinasi tidak ideal.
PRIMERA akan lebih representatif bila beberapa episode memperlihatkan adaptasi
aman dan feedback yang selesai, bukan bila setiap kasus diberi paragraf bahwa
Puskesmas terbatas.
