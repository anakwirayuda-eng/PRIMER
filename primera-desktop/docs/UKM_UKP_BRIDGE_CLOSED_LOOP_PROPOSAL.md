# Dossier Triangulasi Bridge UKM <-> UKP

**Tanggal:** 2026-07-17<br>
**Snapshot kode:** `945ce39`, `REVISI_ENGINE=44`<br>
**Status:** riset dan proposal keputusan; **tidak mengaktifkan mekanik baru**<br>
**Tujuan:** menentukan bentuk jembatan UKM-UKP yang representatif, menyenangkan,
dan pedagogis tanpa mengubah PRIMERA menjadi simulasi birokrasi Puskesmas.

## 1. Ringkasan eksekutif

PRIMERA sudah mempunyai hampir semua simpul layanan primer: keluarga binaan,
SAJI, kader, Posyandu, Prolanis, poli, IGD, surveilans, respons KLB, SISRUTE,
dan PRB. Kelemahan utamanya bukan kekurangan menu, melainkan **episode yang
sering berhenti setelah berpindah layar**.

Bridge yang matang berbentuk siklus:

```text
populasi/keluarga bernama
  -> sinyal kebutuhan
  -> asesmen UKM atau UKP
  -> rencana dan penanggung jawab
  -> tindakan/rujukan
  -> umpan balik
  -> tindak lanjut
  -> hasil terverifikasi
  -> pembaruan keluarga/program/PWS
```

Penilaian desain pasca-perbaikan dua P0 adalah **6,2/10**. Ini skor audit
kualitatif, bukan hasil validasi mahasiswa. Cakupan domainnya kaya, tetapi
continuity, recovery, dan payoff longitudinal masih tertinggal.

Rekomendasi utama adalah **BRIDGE-PHC-LITE**: ledger episode yang kecil,
6-8 tracer loop yang dalam, dan causal receipt yang terlihat. Jangan membangun
RME, klaim JKN, roster pegawai, atau ASPAK lengkap sebagai minigame.

## 2. Pertanyaan keputusan

1. Unsur apa yang universal pada community-clinical linkage?
2. Bagian mana yang khas Indonesia dan wajib dipertahankan?
3. Apa yang perlu dimodelkan agar keputusan pemain terasa berdampak?
4. Apa yang harus diabstraksikan agar cognitive load tetap wajar?
5. Perubahan minimum apa yang menutup loop sebelum konten baru diperbanyak?

## 3. Temuan universal dari literatur

Kerangka [WHO PHC Measurement Framework](https://www.who.int/teams/integrated-health-services/health-services-performance-assessment/phc-measurement-framework-and-indicators)
menempatkan empanelment, referral/counter-referral, care pathway, kolaborasi
fasilitas-komunitas, dan proactive outreach sebagai satu rantai model layanan.
[WHO Operational Framework for PHC](https://www.who.int/publications/b/56502)
menyatukan pelayanan primer dengan fungsi kesehatan masyarakat, komunitas,
obat/teknologi, tenaga, pembiayaan, dan sistem informasi.

Dari kerangka tersebut dan pembanding lintas negara, delapan fungsi berikut
bersifat cukup universal:

1. **Populasi tanggung jawab jelas.** Tim tahu siapa dan wilayah mana yang harus
   ditindaklanjuti.
2. **Sinyal dua arah.** Komunitas tidak hanya mengirim data; hasil klinis kembali
   ke keluarga dan program.
3. **Identitas longitudinal.** Orang yang ditemukan di rumah adalah orang yang
   sama ketika masuk poli, dirujuk, pulang, dan dikunjungi lagi.
4. **Penanggung jawab eksplisit.** Setiap masalah aktif punya next action,
   deadline, dan pihak yang memegang tindak lanjut.
5. **Rujukan closed-loop.** Mengirim surat belum sama dengan selesai; perlu
   penerimaan, pelayanan, umpan balik, dan tindakan atas umpan balik.
6. **Continuity tiga lapis.** Informasi, manajemen, dan relasi harus bertahan
   lintas tempat dan waktu, konsisten dengan kerangka
   [Haggerty et al.](https://www.bmj.com/content/327/7425/1219).
7. **Graceful degradation.** Kemampuan lokal memengaruhi jalur, tetapi tidak
   menurunkan batas keselamatan.
8. **Learning population.** Hasil individu memperbarui prioritas keluarga,
   program, surveilans, atau PWS.

Yang **tidak universal**: ukuran panel, komposisi profesi, model kapitasi,
frekuensi kunjungan rumah, status kader, aplikasi digital, formulir, dan struktur
rumah sakit distrik. Elemen tersebut harus mengikuti Indonesia, bukan disalin.

## 4. Triangulasi lintas negara

| Sistem | Pelajaran yang dapat dipindahkan | Yang jangan disalin mentah |
|---|---|---|
| Brazil Family Health Strategy | Tim wilayah dan community health agent membawa data serta tindak lanjut dua arah | Ukuran panel, komposisi tim, dan pola kerja ACS |
| Costa Rica EBAIS | Geographic empanelment, kunjungan berbasis risiko, rekam longitudinal, quality feedback | Integrasi pembiayaan-penyedia yang lebih vertikal dan kesiapan digital |
| Thailand district/VHV | Jejaring komunitas-pusat kesehatan-rumah sakit distrik dan fungsi navigasi VHV | Jumlah relawan, purchasing UCS, dan struktur district hospital |
| Australia rural/ACCHS | Continuity relasional, cultural safety, community governance, resource sharing | Aeromedical retrieval dan tata kelola masyarakat adat tanpa konteks |
| Canada eConsult | Advice spesialis dapat mencegah perjalanan/rujukan yang tidak perlu | Membutuhkan koneksi, specialist pool, shared record, dan tata kelola matang |

Sumber orientasi: [Brazil FHS](https://www.gov.br/saude/pt-br/composicao/saps/esf/esf/),
[Costa Rica EBAIS](https://www.commonwealthfund.org/publications/case-study/2021/mar/community-oriented-primary-care-lessons-costa-rica),
[WHO Thailand PHC case](https://www.who.int/teams/primary-health-care/evidence-and-innovation/primary-health-care-case-study-compendium/detail/country-case-studies-on-primary-health-care--thailand--the-development-of-primary-health-care),
[Australia ACCHS](https://www.health.gov.au/topics/aboriginal-and-torres-strait-islander-health/primary-care),
[Ontario BASE eConsult](https://www.ontario.ca/document/healthy-ontario-building-sustainable-health-care-system/chapter-3-ten-recommendations),
dan [WHO service organization](https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/service-organizations-and-integration).

## 5. Baseline Indonesia

### 5.1 Norma sistem

- [KMK 2015/2023 Juknis ILP](https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/KMK_Nomor_2015_Tahun_2023_tentang_Petunjuk_Teknis_Integrasi_Pelayanan_Kesehatan1.pdf)
  menghubungkan pelayanan siklus hidup, jejaring desa, kunjungan rumah, dan PWS.
- [Permenkes 19/2024](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-19-tahun-2024)
  menempatkan UKM dan UKP dalam tanggung jawab Puskesmas terhadap wilayah kerja.
- [Permenkes 16/2024](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024)
  mendefinisikan rujukan sebagai pelimpahan tanggung jawab timbal balik menurut
  kebutuhan medis, kemampuan, jarak, dan waktu tempuh.
- Playbook [SATUSEHAT Rujukan versi 6](https://satusehat.kemkes.go.id/platform/docs/id/interoperability/rujukan/)
  pada Juni 2026 sudah memasukkan variabel dan alur rujuk balik.

### 5.2 Realita implementasi

Norma tersebut adalah arah yang benar, bukan bukti bahwa semua loop sudah berjalan
sempurna. Studi 44 Puskesmas Jakarta pada 2024 menemukan readiness ILP kurang dari
separuh, tetapi sampel urban itu **tidak boleh** dijadikan probabilitas nasional
([Dhynianti et al., 2025](https://scholar.ui.ac.id/en/publications/readiness-of-community-health-centers-to-implement-integrated-pri/)).
Laporan pengawasan Kemenkes 2025 juga menunjukkan friksi koordinasi, anggaran,
data sumber daya, dan layanan luar gedung; persentasenya berasal dari cakupan
monitoring tersebut dan tidak boleh diperlakukan sebagai prevalensi nasional
([Itjen Kemenkes 2025](https://itjen.kemkes.go.id/storage/laporan/laporan_kinerja_inspektorat_2_tahun_2025.pdf)).

Implikasi desain: simulator perlu menunjukkan **loop ideal yang dapat dijalankan**
serta satu kendala realistis sesekali, bukan menjadikan kegagalan sistem sebagai
keadaan normal atau alasan menurunkan mutu klinis.

## 6. Audit implementasi PRIMERA saat ini

### 6.1 Yang sudah kuat

1. Diagnosis menular yang benar menulis sinyal UKP -> surveilans RW
   (`src/engine/reducer.ts:802-812`).
2. Kluster memicu kegiatan KLB; sejak commit `2c2ff3e`, 22/22 penyakit
   clusterable mempunyai respons sesuai transmisi dan tidak memakai fallback
   droplet diam-diam.
3. Sejak commit `8214e8c`, KLB hanya ditutup bila skor investigasi cukup **dan**
   `klb_aksi` benar (`src/engine/reducer.ts:1623-1632`).
4. Posyandu berkualitas memperbaiki provenance data KIA, bukan sekadar menambah
   angka IKS (`src/engine/reducer.ts:1534-1565`).
5. SISRUTE sudah menilai tujuan, stabilisasi, SBAR, kapasitas, dan PRB pada kasus
   eligible. Rujukan tepat tidak diperlakukan sebagai kekalahan.
6. Keluarga, Prolanis, dan karma sudah dapat memunculkan pasien bernama ke poli.

### 6.2 Loop yang masih putus

| Temuan | Bukti kode | Dampak pengalaman |
|---|---|---|
| Klinik tidak memulihkan family state setelah karma | `reducer.ts:850-869`; keluarga gagal dikunci di `reducer.ts:918-920` | Pemain menangani pasien dengan benar tetapi keluarga tetap gagal selamanya |
| Janji yang ingkar menyuruh "kunjungi lagi", tetapi arc berhasil sudah terkunci | `reducer.ts:1991-2028`; `kunjungan.ts:573-614` | Instruksi naratif tidak dapat dilaksanakan |
| Pasien "keluarga akrab" tetap dapat diberi `keluargaId` saat tak ada anggota cocok | `director.ts:363-404` | Informational continuity tampak ada, tetapi identitas dapat fiktif |
| Multimorbid HT+DM direduksi menjadi salah satu | `reducer.ts:2511-2517` | Prolanis kehilangan masalah aktif kedua |
| Hasil encounter tidak menulis balik parameter/kontrol Prolanis | `reducer.ts:1567-1611` dan cabang `DISPOSISI` | Program menjadi generator pasien satu arah |
| PRB hadir sebagai jadwal dan surat, belum sebagai care plan yang terlihat | `reducer.ts:780-795` | Counter-referral belum memberi pekerjaan longitudinal yang memuaskan |

### 6.3 Skor pasca-P0

| Dimensi | Skor /10 | Catatan |
|---|---:|---|
| Kekayaan domain UKM+UKP | 8,5 | Simpul layanan sangat luas |
| UKM -> UKP | 7,5 | Karma, Prolanis, dan keluarga sudah memunculkan pasien |
| UKP -> UKM/PWS | 6,5 | Surveilans dan Posyandu kuat; family/program callback lemah |
| Integritas identitas | 5,0 | Jalur terjadwal baik; pasien akrab masih best-effort |
| Continuity manajemen | 3,5 | Belum ada problem/care episode lintas layar |
| Recovery keluarga | 2,5 | Krisis keluarga praktis terminal |
| Rujukan dan stabilisasi | 7,5 | SISRUTE/SBAR/PRB cukup matang |
| Akurasi epidemiologi bridge | 8,0 | Meningkat setelah P0-A/P0-B |
| Feedback kausal | 5,5 | Banyak skor/debrief, sedikit receipt longitudinal |
| Fun/payoff/satisfaction | 6,0 | Hukuman terasa; pemulihan belum setara emosional |

## 7. Proposal BRIDGE-PHC-LITE

### 7.1 Unit dasar: episode, bukan RME lengkap

Satu episode cukup menyimpan:

```ts
interface CareEpisodeLite {
  personId: string
  familyId?: string
  source: 'keluarga' | 'posyandu' | 'prolanis' | 'surveilans' | 'klinik' | 'rs'
  problemId: string
  owner: 'dokter' | 'perawat' | 'bidan' | 'kader' | 'program' | 'rs'
  nextAction: string
  dueDay: number
  status: 'terdeteksi' | 'dinilai' | 'ditindaklanjuti' | 'kembali' | 'terverifikasi'
}
```

Ini **skema ilustratif**, bukan keputusan implementasi. Tujuannya menjaga tujuh
informasi yang mengubah keputusan; bukan menyimpan setiap formulir, tagihan, dan
transaksi klinis.

### 7.2 Lima aturan perilaku

1. Event UKM yang menciptakan pasien harus menunjuk episode yang sama di UKP.
2. Encounter UKP anggota binaan harus menghasilkan callback keluarga/program,
   termasuk bila hasilnya mangkir, ditolak, atau gagal.
3. Rujukan baru selesai saat feedback diterima dan ditindaklanjuti.
4. Outcome sistem tidak boleh mengubah keputusan klinis benar menjadi salah.
5. Tiap episode maksimal memiliki satu bottleneck utama agar beban kognitif wajar.

### 7.3 Enam sampai delapan hero loops

Dalami tracer berikut sebelum memperluas ke seluruh pool aktif pada snapshot ini (176 kasus poli Karier dan 20 kasus IGD):

1. HT -> Prolanis -> stroke -> RS -> PRB -> kontrol keluarga.
2. DM -> Prolanis -> kaki diabetik/hiperglikemia -> rujuk -> wound/follow-up.
3. TB -> poli -> notifikasi -> kontak serumah -> TPT/skrining -> verifikasi.
4. KIA risiko tinggi -> kunjungan -> ANC/PONED -> rujuk -> nifas/neonatal.
5. Gizi/anak -> Posyandu -> poli -> intervensi keluarga -> pengukuran ulang.
6. Diare/dengue -> poli -> surveilans -> KLB -> pemantauan penutupan.
7. Jiwa -> keluarga -> poli -> keselamatan/follow-up -> kepatuhan/relapse.
8. Rujuk balik kronis -> RS -> obat/rencana -> FKTP -> outcome.

Enam loop pertama cukup untuk pilot; dua terakhir dapat menunggu bukti playtest.

### 7.4 Causal receipt

Setiap loop menutup dengan ringkasan maksimal empat baris:

```text
Sinyal: Bu Marni dua kali tak terkontrol di Prolanis.
Keputusanmu: nilai infeksi kaki, stabilkan, rujuk, kirim SBAR.
Umpan balik: RS melakukan debridement; rencana luka dan insulin dikirim balik.
Berikutnya: kontrol luka hari 3, cek stok insulin dan kemampuan keluarga.
```

Receipt harus membedakan kompetensi pemain dari keberuntungan sistem.

## 8. Apa yang sengaja tidak disimulasikan

- mengetik data ke banyak aplikasi;
- kode klaim, billing, dan antrean administrasi rinci;
- roster shift seluruh pegawai;
- inventaris ASPAK item per item;
- prosedur internal rumah sakit setelah rujukan;
- rapat Lokmin sebagai transkrip panjang;
- probabilitas kelangkaan nasional yang dibuat dari studi lokal.

Prinsipnya adalah **functional task alignment**: modelkan cue, keputusan,
konsekuensi, dan umpan balik yang menjadi tujuan belajar. Kemiripan fisik atau
administratif tidak otomatis meningkatkan transfer
([Hamstra et al.](https://pubmed.ncbi.nlm.nih.gov/24448038/)).

## 9. Risiko pedagogis dan guardrail

| Risiko | Guardrail |
|---|---|
| Kelangkaan menjadi hidden curriculum | Tampilkan standar, kendala lokal, adaptasi aman, dan red line secara terpisah |
| Dokter disalahkan atas bed/internet/stok | Pisahkan skor clinical decision dari resilience response dan outcome sistem |
| Kader menjadi "dokter mini" | Batasi peran kader pada deteksi, edukasi, navigasi, dan follow-up |
| Kemiskinan/desa menjadi stereotip | Beri alasan rasional, agency, aset komunitas, dan sensitivitas regional |
| Satu kunjungan tampak pasti mencegah penyakit | Gunakan jeda, probabilitas transparan, dan lebih dari satu jalur benar |
| Administrasi mengalahkan reasoning | Satu episode card, satu bottleneck, progressive disclosure |
| Metric gaming | Seimbangkan process, outcome, equity, dan continuity |
| Debrief menjadi wall of text | Maksimal satu receipt + satu insight sistem per episode |

[INACSL 2025](https://inacsl.memberclicks.net/healthcare-simulation-standards)
mensyaratkan debrief yang direncanakan. Review virtual patient terbaru juga
menemukan feedback sering hanya menilai jawaban akhir dan jarang membahas problem
representation, hypothesis generation, atau justification
([Jay et al., 2025](https://pubmed.ncbi.nlm.nih.gov/39485118/)).

## 10. Urutan implementasi yang diusulkan

### Wave B0 - sudah selesai

- Gerbang KLB wajib `klb_aksi` benar (`8214e8c`).
- Pemetaan transmisi 22/22 penyakit (`2c2ff3e`).

### Wave B1 - closure minimum

1. Hilangkan family link palsu: hanya anggota nyata boleh mendapat `keluargaId`.
2. Buka jalur kunjungan ulang setelah janji ingkar.
3. Tambahkan callback klinik -> pemulihan keluarga untuk karma.
4. Pisahkan multimorbiditas Prolanis dan tulis balik hasil encounter.

### Wave B2 - hero-loop pilot

- Aktifkan enam tracer loop.
- Tambahkan care episode card dan causal receipt.
- Jangan memperluas ke semua kasus sebelum playtest.

### Wave B3 - referral closure

- Modelkan `sent -> accepted -> completed -> feedback -> acted`.
- Pertahankan jalur kontingensi offline dan bed penuh yang sudah ada.

### Wave B4 - evaluasi

- Playtest 2-3 mahasiswa/proxy terlebih dahulu.
- Uji recall tertunda dan kemampuan menjelaskan rantai sebab-akibat.
- Perluasan hanya jika beban kognitif, waktu sesi, dan kepuasan tetap baik.

## 11. Acceptance criteria proposal

1. 100% pasien berlabel keluarga adalah anggota nyata dengan demografi dan JKN
   konsisten.
2. Tidak ada krisis atau janji gagal yang memberi instruksi tak dapat dimainkan.
3. Setiap tracer mempunyai minimal satu aksi UKM yang mengubah episode UKP dan
   satu hasil UKP yang menulis balik ke keluarga/program/PWS.
4. Semua rujukan tracer mempunyai status akhir dan action setelah feedback.
5. Outcome probabilistik menjelaskan determinan dan tidak mengubah skor keputusan
   klinis secara acak.
6. Pemain dapat menjelaskan rantai sebab-akibat tracer tanpa membuka panduan.
7. Causal receipt terbaca kurang dari 20 detik dan tidak menambah lebih dari satu
   keputusan UI per transisi.
8. Soak tetap mempertahankan `teliti >= speedrunner >= ceroboh`.

Target pengalaman seperti ">=80% dapat menjelaskan loop" atau rating dampak
">=4/5" adalah **hipotesis pilot**, bukan release gate ilmiah sebelum data ada.

## 12. Keputusan yang diminta

Dokumen ini belum memberi izin implementasi. Keputusan berikut perlu dikunci:

1. Setuju/tolak BRIDGE-PHC-LITE sebagai arah arsitektur.
2. Setuju/tolak Wave B1 sebagai scope engine berikutnya.
3. Pilih enam hero loops pilot.
4. Tentukan apakah referral closure masuk B2 atau gelombang terpisah.
5. Tetapkan siapa yang melakukan physician review atas transisi klinis tiap loop.

## 13. Kesimpulan

PRIMERA tidak membutuhkan lebih banyak layar untuk terasa "wow". Ia membutuhkan
beberapa cerita yang benar-benar ingat siapa orangnya, apa masalahnya, siapa yang
bertanggung jawab, apa yang terjadi sesudah rujukan, dan apakah keluarga akhirnya
pulih. Menutup loop tersebut akan memberi nilai pedagogis dan payoff emosional
lebih besar daripada menambah puluhan kejadian yang tetap berakhir di layar asal.
