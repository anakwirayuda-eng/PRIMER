# M13-0D Constrained Exam Blueprint

Tanggal implementasi: 2026-07-14

Blueprint: `m13-0d-v1`

Content release: `m13-0c-2026-07-14`

Engine revision: `34`

## 1. Tujuan dan batas

M13-0D mengganti pemilihan kasus Ujian yang adaptif dengan blueprint asesmen
berversi. Tujuannya bukan membuat semua pengalaman mahasiswa identik, tetapi
mengunci materi klinis yang dinilai agar paket setara dan tidak berubah akibat
Leitner/Dex, musim, kluster, atau performa sebelumnya.

Milestone ini tidak menambah atau mengubah konten medis. Karena itu
`CONTENT_RELEASE` tetap. Perubahan berada pada engine, fingerprint, paket
Ujian, simulasi penerimaan, CI, dan manifest build kohort.

## 2. Denominator yang dikunci

Satu stase Ujian memiliki tepat 98 `controlled clinic draws` selama 30 hari:

| Hari | Kapasitas | Subtotal |
|---|---:|---:|
| 1-2 | 2/hari | 4 |
| 3-20 | 3/hari | 54 |
| 21-30 | 4/hari | 40 |
| Total | | 98 |

Pool aktif terdiri dari 67 kasus klinik. Setiap kasus muncul sekurangnya satu
kali; 31 slot sisanya adalah pengulangan yang dinyatakan eksplisit dalam
`caseCounts`. Seluruh delapan paket memakai multiset yang sama, tetapi urutan
berbeda.

Follow-up, karma, dan PRB adalah `supplemental encounters`. Semuanya tetap
dimainkan sebagai konsekuensi keputusan mahasiswa, tetapi tidak masuk dan
tidak boleh mengubah denominator 98 draw.

## 3. Kuota exact

`Tier` di dokumen ini adalah tier paparan berbasis prevalensi kasus, bukan
level SKDI, bukan tingkat bahaya, dan bukan authoring tier M13-0A.

| Dimensi | Kuota |
|---|---|
| Exposure tier | A 49, B 33, C 16 |
| Severity | stable 86, referral-required 10, referral-needs-stabilization 2, emergency 0 |
| Rujukan | 12 |
| Safety trap | 12 |
| Kasus unik | 67 |

Kuota kategori:

| Kategori | Jumlah | Kategori | Jumlah |
|---|---:|---|---:|
| Respirasi | 10 | Infeksi | 3 |
| Pencernaan | 14 | Kulit | 15 |
| Mata | 5 | Kardiovaskular | 3 |
| Metabolik | 9 | THT | 10 |
| KIA | 7 | Saraf | 6 |
| Muskuloskeletal | 10 | Jiwa | 6 |
| Gigi | 0 | Gawat klinik | 0 |

Kuota demografi adalah eligibility archetype, bukan hasil roll pasien:

| Eligibility usia | Jumlah | Eligibility gender | Jumlah |
|---|---:|---|---:|
| Pediatric only | 10 | Any | 79 |
| Crosses pediatric/adult | 27 | Female only | 15 |
| Adult only | 39 | Male only | 4 |
| Adult/older | 22 | | |

Constraint jadwal per paket:

- slot pertama hari 1 selalu kasus tutorial;
- slot kedua hari 1 adalah anchor paket yang unik, tier A, stabil, dan
  nonrujukan;
- maksimal satu kasus rujukan per hari;
- maksimal dua kasus kategori sama per hari;
- kasus yang diulang berjarak sekurangnya dua hari;
- tidak ada kasus duplikat di antara controlled draws pada hari yang sama.

## 4. IGD

Setiap paket memiliki tepat lima event IGD, semuanya unik, pada hari 4-30,
dengan jarak minimal empat hari. Lima ID yang dikunci:

- `igd_asma_berat`
- `igd_dengue_syok`
- `igd_hipoglikemia`
- `igd_kejang_demam`
- `igd_syok_anafilaksis`

Test integrasi menjalankan reducer selama 30 hari untuk seluruh delapan paket
dan membuktikan hari serta ID kasus aktual sama dengan jadwal blueprint.

## 5. Isolasi perilaku dan flavor

Controlled draw Ujian tidak membaca bobot Leitner, penguasaan Dex, musim,
kluster surveilans, atau kategori yang belum tersentuh. Daftar kasus pasien
kembali juga tidak boleh mengganti ID draw.

Demografi aktual tetap di-roll dari flavor seed per mahasiswa. Status keluarga
binaan tidak boleh mengganti nama/usia/gender controlled patient; bridge
keluarga tetap tersedia di Karier, sedangkan konsekuensi Ujian hadir melalui
supplemental encounter.

Implikasi yang diterima secara sadar: supplemental return dapat membawa
diagnosis yang sama dengan controlled draw pada hari itu. Mengganti atau
menghapus controlled draw akan membuat soal bergantung pada perilaku pemain,
sehingga fairness blueprint diberi prioritas.

Validator dan CI bersifat fail-loud. Jalur runtime bersifat fail-closed: bila
pin mode/release atau active pool tidak cocok, engine mengembalikan tidak ada
draw/IGD alih-alih melempar error yang dapat merestart sesi. Build seperti itu
tetap gagal validasi dan tidak boleh didistribusikan.

## 6. Versi dan integritas

Setiap `PaketUjian` membawa `blueprintVersion` dan `contentRelease`. Cache
jadwal dikunci oleh ID paket, seed kurikulum, versi blueprint, dan rilis agar
seed baru tidak pernah memakai jadwal lama.

Fingerprint pack kini mencakup payload runtime blueprint dan seluruh pin/seed
paket. `REVISI_ENGINE` naik 33 -> 34. `examBlueprint.ts` ditambahkan ke Golden
Master freeze sehingga total menjadi 17 file engine.

Manifest build kohort naik ke schema 2 dan wajib mencatat
`examBlueprintVersion`, di samping commit, engine revision, content release,
fingerprint, serta SHA-256 installer. Kebijakan frozen-build-per-cohort tetap
berlaku; build ini tidak boleh disisipkan ke kohort yang sedang berjalan.

## 7. Kontrak simulasi

Matriks penerimaan ditetapkan sebelum hasil dibaca:

- 8 paket x 32 flavor seed x 2 profil = 512 run;
- profil `strong`: Dex maksimum dan tanpa konflik follow-up;
- profil `weak_careless`: Dex minimum dan stress input seolah seluruh draw hari
  itu juga muncul pada daftar pasien kembali;
- delta seluruh kuota exact = 0;
- perubahan jadwal lintas flavor = 0;
- perubahan jadwal lintas bot = 0;
- maximum pairwise same-slot share <= 25%;
- spread rerata demografi antarpaket <= 8 poin persentase;
- rentang per-run konservatif: female 35-76%, pediatric 1-32%, adult 58-94%,
  older 0-18%.

Hasil aktual:

| Metrik | Hasil |
|---|---:|
| Run | 512 |
| Error | 0 |
| Jadwal invariant lintas flavor | Ya |
| Jadwal invariant lintas bot | Ya |
| Maximum pairwise same-slot share | 5.10% |
| Spread rerata female antarpaket | 1.91 pp |
| Spread rerata pediatric antarpaket | 0.89 pp |
| Spread rerata adult antarpaket | 1.43 pp |
| Spread rerata older antarpaket | 0.99 pp |

Rentang aktual seluruh grup berada di dalam batas: female 41.84-66.33%,
pediatric 12.24-25.51%, adult 64.29-81.63%, dan older 2.04-12.24%.

Artefak JSON dibuat oleh `npm run exam:simulate` ke
`dist/exam-blueprint/m13-0d-simulation.json`. Workflow kohort menjalankan
simulasi setelah packaging agar report tidak terhapus saat `dist/` dibangun.

## 8. Yang belum dipromosikan menjadi gate

Target Q17 spread skor antarpaket <=2/100 tetap hipotesis kalibrasi. M13-0D
tidak mengklaimnya lulus karena belum ada bot klinis end-to-end atau pilot
mahasiswa yang menghasilkan skor valid. Begitu pula beban subjektif akibat
supplemental encounters harus dinilai pada M13-1b, bukan disimpulkan dari
kesetaraan controlled draw.

M13-1a dan M13-1b tidak dimulai dalam checkpoint ini.

## 9. Pagar regresi

Pagar khusus mencakup:

- validator blueprint dan negative quota drift;
- exact multiset, daily constraints, anchor, dan pin rilis;
- imunitas terhadap Dex, return exclusions, serta state keluarga binaan;
- cache separation saat seed berubah;
- integrasi reducer untuk lima IGD pada delapan paket;
- simulasi 512 run dalam test suite dan CI;
- fingerprint dan Golden Master freeze.

Hasil verifikasi final dicatat di decision log dan commit checkpoint M13-0D.
