# UKM Assurance Release 2026-07-19

## Ringkasan eksekutif

Gelombang ini menutup empat kelemahan utama audit UKM-UKP: evidence intervensi yang masih generik, konsekuensi kartu yang belum masuk hasil kunjungan, storylet yang terlalu sedikit dan kurang peka-state, serta bahasa kausal yang berisiko mengesankan satu keputusan selalu menyebabkan satu outcome.

Penilaian ulang di bawah adalah **audit rekayasa statis**, bukan bukti efektivitas pendidikan pada mahasiswa. Seluruh dimensi yang sebelumnya bernilai di bawah 8 kini melewati ambang 8 berdasarkan wiring, kelengkapan konten, invariant, dan uji otomatis. Kesenangan bermain dan transfer belajar tetap memerlukan playtest manusia.

| Dimensi | Sebelum | Sesudah | Dasar kenaikan |
|---|---:|---:|---|
| Evidence spesifik intervensi UKM | 4,7 | 8,4 | 27/27 kartu benar memiliki sumber, locator, kekuatan dukungan, klaim yang didukung, dan batas transfer |
| Storylet formal dan replay | 4,2 | 8,5 | 44 storylet; rotasi deterministik tanpa pengulangan dalam satu siklus; tujuh konteks state nyata |
| Realisme kausal | 6,1 | 8,3 | Seluruh sembilan outcome karma dibingkai sebagai realisasi risiko multifaktorial, bukan hukuman moral deterministik |
| Feedback dan debrief | 6,0 | 8,6 | `hasilNarasi` hidup di hasil kunjungan; evidence dan batas transfer masuk catatan pedagogis pasca-penilaian |
| Baseline regulasi dan layanan primer | 7,6 | 8,3 | PIS-PK/SAJI, ILP, dan Permenkes 3/2026 dibaca berlapis; sumber program dibedakan dari evidence mekanisme |
| Bridge UKM-UKP struktural | 8,3 | 8,7 | Storylet memakai episode perawatan dan tahap rujukan nyata; tidak lagi menyimpulkan receipt dari tally agregat |
| Skor keseluruhan audit rekayasa | 6,8 | 8,5 | Nilai konservatif setelah seluruh gate di atas terpenuhi |

## Perubahan yang dijamin

1. **Evidence terminal 27/27.** Setiap skenario UKM aktif mempunyai tepat satu kartu benar dan satu binding evidence intervensi. Binding objective dan follow-up seluruh 26 skenario dasar tidak lagi `pending`; skenario Gunawan K2 mempertahankan binding M13 yang sudah diterima.
2. **Tidak ada kebocoran jawaban.** Saat pemain masih memilih kartu, panel hanya memberi konteks domain. Dukungan spesifik dan batas transfer baru muncul sesudah penilaian. Kartu distraktor tidak diberi cap seolah-olah direkomendasikan pedoman.
3. **Konsekuensi pilihan terlihat.** `KartuIntervensi.hasilNarasi` kini masuk `narasiPenutup` bila hasilnya relevan. Narasi positif tidak ditampilkan ketika kartu benar dipilih tetapi proses SAJI gagal, sehingga feedback tidak saling bertentangan.
4. **Storylet peka-state.** Receipt rujukan menunggu, rujukan selesai, Posyandu, Prolanis, episode aktif, episode terverifikasi, dan keluarga binaan hanya muncul bila state mendukung klaim tersebut.
5. **Bahasa kausal lebih jujur.** Outcome buruk tetap punya bobot gameplay, tetapi dinyatakan sebagai risiko yang meningkat, keterlambatan deteksi, atau hasil multifaktorial. Satu pilihan tidak dipresentasikan sebagai sebab tunggal yang pasti.
6. **Graceful degradation.** Narasi tidak mengasumsikan USG, PONED, ambulans desa, subsidi, obat, atau jejaring selalu tersedia. Keputusan klinis dan program harus mengikuti asesmen serta kapasitas lokal.

## Sumber utama

- Kementerian Kesehatan RI, KMK HK.01.07/MENKES/2015/2023, Petunjuk Teknis Integrasi Pelayanan Kesehatan Primer.
- Kementerian Kesehatan RI, Permenkes 3/2026 tentang Penanggulangan Penyakit, sebagai payung aktif yang dibaca bersama pedoman teknis yang masih berlaku.
- Kementerian Kesehatan RI, KMK HK.01.07/MENKES/303/2026, PNPK Tata Laksana Hipertensi pada Dewasa.
- WHO, *Consolidated Guidelines on Tuberculosis, Module 4: Treatment and Care* (2025).
- WHO, *Recommendations on Maternal Health*, edisi kedua (2025).
- WHO, *Clinical Treatment Guideline for Tobacco Cessation in Adults* (2024).
- WHO, *mhGAP Guideline*, edisi ketiga (2023).
- WHO, *Guideline for Complementary Feeding of Infants and Young Children 6-23 Months* (2023).
- WHO, *Behavioural and Social Drivers of Vaccination* (2022).
- WHO, *Guidelines for Drinking-water Quality* (2022).
- WHO dan Johns Hopkins, *Family Planning: A Global Handbook for Providers*, edisi keempat (2022).
- WHO, *HEARTS Technical Package: Team-based Care* (2018), *Guidelines on Sanitation and Health* (2018), dan pedoman program community health worker (2018).

Registry lengkap, URL, locator, klaim, dan keterbatasan transfer tersimpan secara terstruktur di `src/content/ukmEvidence.ts` serta diperiksa oleh invariant test.

## Batas klaim dan langkah validasi

- Evidence mendukung **mekanisme intervensi**, bukan menjamin outcome individual dalam storylet. Adaptasi lokal ditandai secara eksplisit.
- Skor sesudah adalah hasil audit rekayasa, bukan hasil uji efektivitas pedagogis.
- Target playtest berikutnya: 2-3 mahasiswa/proxy, sedikitnya dua sesi berulang, dengan pengukuran pemahaman loop UKM-UKP, keterbacaan feedback, beban kognitif, dan variasi yang terasa.
- Ambang penerimaan manusia yang disarankan: tidak ada defect material; sedikitnya 80% peserta dapat menjelaskan kembali satu loop UKM-UKP; tidak ada pola jawaban yang tertebak dari panel sumber; dan tidak ada storylet yang dianggap sebagai kabar palsu dari state.

## Verifikasi teknis

- `npm test`: 123 file, 1.194 tes lulus.
- `npm run typecheck`: lulus.
- Freeze contract: 18/18 lulus; `REVISI_ENGINE` dinaikkan menjadi 54.
- `CONTENT_RELEASE`: `ukm-assurance-2026-07-19`, dengan urutan migrasi dari release lab sebelumnya dipertahankan.
- Soak test Karier dan Ujian, paket Ujian, save migration, bridge actionability, dan fingerprint dossier seluruhnya lulus.
- Installer NSIS: `PRIMERA test-beta Setup 1.0.0.exe`, SHA-256 `254D6AE33C0FD21B7BDBF1F8F92DF994E6766A91CE4C822F8E09A63C1B689764`.
- `app.asar` hasil build dan instalasi lokal identik, SHA-256 `7A72BC57888A086C531B3EA591D832F2F2C0EE3098D2CF78A1A2BD4609703413`; launch-smoke Windows responsif.
