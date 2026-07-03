# Pocket Diorama DeepThink Dossier
*Tanggal: 9 April 2026*
*Tujuan: Paket konteks dan pertanyaan triangulasi untuk menilai apakah `pocket diorama` masih layak dikejar, diubah bentuknya, atau didemote permanen.*

---

## 1. Executive Verdict

Saat ini `Wilayah` 3D di PRIMER **belum** berbentuk `pocket diorama` per-RW. Runtime aktif masih berupa **full-village diorama opsional**.

Ini bukan sekadar pekerjaan yang tertunda diam-diam. Berdasarkan blueprint terbaru dan audit runtime, keputusan desain sementara sudah bergeser menjadi:

- `2D blueprint` = source of truth gameplay
- `3D diorama` = layer presentasi / parity yang masih parsial
- `pocket diorama RW-only` = backlog parity/showcase, bukan blocker MVP

Jadi pertanyaan strategisnya bukan lagi “kenapa pocket diorama belum jadi?”, tetapi:

**apakah pocket diorama memang masih keputusan terbaik untuk PRIMER setelah scope, parity, mobile, dan kebutuhan showcase akademik diperhitungkan ulang?**

---

## 2. Riwayat Pergumulan Desain

### Fase 1: Visi ekspansi awal

Jejak paling awal menunjukkan `pocket diorama` lahir sebagai bagian dari visi ekspansi desa:

- [GAME_DESIGN_LOG.md](./GAME_DESIGN_LOG.md) mencatat target `200 KK (~800 jiwa), 4-5 RW dengan pocket dioramas`.
- [ARCHITECTURE_LOG.md](./ARCHITECTURE_LOG.md) juga menulis target `RW count 4-5` dengan alasan `themed zoning, pocket dioramas`.

Pada fase ini, `pocket diorama` tampaknya dibayangkan sebagai:

- cara memberi identitas visual per-RW
- cara membuat ekspansi RW terasa “hadir”, bukan cuma angka
- cara memberi rasa showcase yang lebih mewah saat pemain men-zoom ke area tertentu

### Fase 2: Blueprinting penuh

Saat blueprint peta desa berkembang, ide 3D semakin dipikirkan secara arsitektural:

- [blueprint_peta_desa.md](./blueprint_peta_desa.md) sempat menempatkan pocket diorama sebagai bagian dari desain 3D/RW.
- 2D dan 3D awalnya dipikirkan sebagai dual-mode yang sama-sama penting.

Tetapi di waktu yang sama, blueprint juga mulai mengunci kenyataan lain:

- 2D lebih ringan
- 2D lebih cocok untuk overlay operasional
- 2D lebih cocok untuk permainan strategi layanan primer

### Fase 3: Audit runtime memaksa keputusan yang lebih realistis

Saat kode aktif diaudit, terjadi penurunan prioritas:

- [blueprint_runtime_gap_audit_2026-04-04.md](./blueprint_runtime_gap_audit_2026-04-04.md) menegaskan runtime 3D masih merender seluruh desa, bukan pocket per-RW.
- [blueprint_peta_desa.md](./blueprint_peta_desa.md) lalu direvisi:
  - `2D blueprint = source of truth gameplay`
  - `3D diorama = presentational layer opsional`
  - `pocket diorama RW-only = backlog parity/showcase`
- [wilayah_execution_plan_2026-04.md](./wilayah_execution_plan_2026-04.md) mengunci 3D sebagai layer presentasi sampai parity gameplay-nya dikejar.

Ini berarti `pocket diorama` bukan gagal total. Ia mengalami **demotion strategis** demi menjaga fokus:

- lock 2D canonical dulu
- selesaikan readability dan systemic gameplay dulu
- tunda 3D yang lebih mahal

---

## 3. Apa yang Blueprint Sebenarnya Katakan Sekarang

Blueprint terbaru tidak lagi memaksa pocket diorama sebagai bentuk final 3D.

Poin penting dari [blueprint_peta_desa.md](./blueprint_peta_desa.md):

- `3D` sekarang diposisikan sebagai **opsional**
- runtime aktif **belum** memakai pocket diorama 1 RW
- informasi gameplay kritis **harus tetap playable di 2D**
- target pocket diorama dipindah ke fase parity/showcase

Dengan kata lain, blueprint terkini sudah tidak berkata:

> “3D pocket diorama wajib ada agar peta desa dianggap selesai.”

Melainkan lebih dekat ke:

> “Jika suatu hari 3D dikejar lebih jauh, pocket diorama adalah salah satu opsi shape, tetapi 2D tetap fondasi sistemiknya.”

---

## 4. Fakta Runtime Saat Ini

### 4.1 Bentuk 3D aktif

Runtime 3D aktif di:

- [WilayahDiorama.jsx](../src/components/wilayah/3d/WilayahDiorama.jsx)

Fakta implementasi:

- seluruh `mapData.buildings` dirender sekaligus
- kamera punya `swoop`, `zoom`, dan `dive` ke bangunan
- tidak ada filter RW sebagai unit render utama
- tidak ada mode “hanya 1 RW yang dipahat sebagai pocket”

### 4.2 Apa yang sudah hidup di 3D

Yang sudah ada:

- full-village terrain
- render bangunan cukup kaya
- hover tooltip
- camera dive/swoop
- beberapa parity layer dasar seperti:
  - `pispk`
  - `surveillance`
  - `phbs`
  - `perilaku`

### 4.3 Apa yang belum parity di 3D

Gap yang relevan:

- `psn / Jentik` belum punya parity yang jelas di 3D
- `blank spot / Belum Terdata` tidak terbaca sejelas 2D
- `locked RW` tidak dipresentasikan sebagai zona abu-abu tingkat RW
- `intel target`
- `local champion`
- `service coverage`
- `event anchor IKM`

Artinya: 3D saat ini **bisa ditonton**, tetapi belum bisa dipercaya sebagai layar keputusan yang setara dengan 2D.

---

## 5. Temuan Bug / Debt Terkait 3D

### Bug/issue yang sudah diverifikasi

1. `BuildingRenderer.jsx` sempat kena lint `react-hooks/static-components` karena helper atap dibuat sebagai komponen di dalam render path.
   Status: **sudah dibersihkan pada 9 April 2026**.

2. Jalur 3D belum punya test parity khusus.
   Dampak: regresi 3D lebih sulit tertangkap otomatis dibanding 2D.

3. Ada risiko misleading UX:
   - 2D berkata area tertentu masih `Belum Terdata`
   - 3D tetap menampilkan desa penuh
   Ini bisa menimbulkan konflik mental model pemain.

### Bukan bug compile, tetapi problem produk

- Jika 3D tetap interaktif penuh, parity yang hilang akan terasa seperti bug.
- Jika 3D dianggap view-only, maka masalahnya berubah menjadi framing/UI: pemain harus paham bahwa 3D hanya “diorama reward”, bukan layar komando.

---

## 6. Tegangan Desain Inti

Pergumulan pocket diorama ini sebenarnya bukan soal teknik 3D semata. Ada tiga ketegangan besar:

### A. `Wow factor` vs `clarity`

- Pocket diorama bisa terasa lebih artistik, memorable, dan exhibition-ready.
- Tetapi PRIMER adalah simulator keputusan layanan primer, sehingga clarity operasional sangat penting.

### B. `Scope` vs `parity`

- Menambah bentuk 3D yang lebih canggih tanpa parity yang cukup justru membuat dua peta yang bertengkar.
- 2D sudah matang; 3D yang terlalu ambisius bisa menyedot energi dari gameplay inti.

### C. `Cross-platform` vs `showcase fidelity`

- Game ini diarahkan cross-platform dan butuh jalur mobile UX.
- Pocket diorama mungkin memukau di desktop showcase, tapi bisa sulit dibenarkan jika jalur mobile, bilingual shell, dan gameplay klinis masih butuh polish.

---

## 7. Opsi Keputusan Nyata

### Opsi A — Demote permanen

Keputusan:

- 3D tetap full-village diorama opsional
- tidak mengejar pocket diorama
- fokus parity minimum saja atau malah jadikan 3D sekadar bonus visual

Kelebihan:

- paling realistis untuk scope
- selaras dengan 2D canonical
- aman untuk mobile/cross-platform

Risiko:

- kehilangan satu diferensiasi showcase yang unik

### Opsi B — Pocket diorama sebagai fitur showcase terpisah

Keputusan:

- gameplay utama tetap di 2D
- pocket diorama dibangun sebagai mode presentasi terisolasi, misalnya:
  - inspector detail RW
  - reward setelah unlock RW
  - exhibition mode

Kelebihan:

- menjaga wow factor
- tidak memaksa parity penuh dengan layar komando

Risiko:

- butuh framing UX yang sangat jelas agar tidak membingungkan

### Opsi C — Kejar parity penuh menuju tactical 3D

Keputusan:

- 3D diposisikan sebagai mode operasional yang benar-benar setara
- pocket diorama atau mode RW-only dibangun sebagai tactical surface

Kelebihan:

- paling ambisius dan “wah”

Risiko:

- paling mahal
- paling rawan drift
- bisa mengalihkan energi dari core product readiness

---

## 8. Pertanyaan Wisdom untuk DeepThink

Paket pertanyaan berikut sengaja diarahkan supaya jawabannya tidak berhenti di “keren vs tidak keren”.

1. Dalam konteks PRIMER sebagai simulator layanan primer, apakah `pocket diorama` memberi **nilai gameplay nyata**, atau lebih banyak memberi **nilai presentasi/showcase**?
2. Jika nilai utamanya adalah showcase, apakah lebih bijak menjadikannya **mode reward/inspection**, bukan layar operasional?
3. Apakah mempertahankan `2D canonical + 3D full-village opsional` justru lebih sehat secara produk dibanding memaksa pocket diorama?
4. Apakah `pocket diorama per-RW` akan memperkuat atau justru memecah mental model pemain terhadap `RW unlock`, `blank spot`, `service coverage`, dan `event geography`?
5. Jika pocket diorama tetap dikejar, apa bentuk **minimum lovable version**-nya agar tidak menuntut parity penuh dengan 2D?
6. Mana yang lebih penting untuk PRIMER di tahap ini:
   - `wow visual lokal`
   - `clarity systemic map`
   - `mobile/cross-platform readiness`
7. Bagaimana sebaiknya 3D diposisikan terhadap audience akademik luar kampus:
   - alat berpikir
   - alat pamer
   - alat onboarding
   - atau reward visual?
8. Apakah ada bentuk kompromi yang lebih bijak daripada pocket diorama penuh, misalnya:
   - `full village 3D` tetap ada, tetapi
   - saat pilih RW, sidebar menampilkan `isometric inspector scene`
   - bukan mengganti seluruh dunia menjadi 1 pocket
9. Jika 3D tetap bukan source of truth, berapa tingkat parity minimum yang wajib ada agar ia tidak menyesatkan?
10. Dalam kerangka ownership produk, keputusan mana yang paling menjaga:
    - coherence
    - maintainability
    - onboarding pemain baru
    - dan narasi “dokter Puskesmas di desa Indonesia”

---

## 9. Rekomendasi Awal dari Codex

Jika diminta memutuskan hari ini, rekomendasi paling waras adalah:

### Rekomendasi utama

Kejar **Opsi B**:

- `2D` tetap canonical
- `3D` jangan dipaksa jadi tactical parity penuh dulu
- `pocket diorama` dipikirkan ulang sebagai **reward / inspector / showcase mode**

### Alasannya

- paling selaras dengan keadaan codebase sekarang
- tidak mengkhianati blueprint terbaru
- tetap menjaga peluang wow factor
- tidak mengganggu prioritas mobile dan multilingual

### Sinyal untuk membatalkan pocket diorama

Jika setelah diskusi DeepThink hasilnya menunjukkan:

- tidak ada nilai gameplay yang benar-benar unik
- hanya menambah drift dan maintenance
- dan audience showcase tetap bisa terpukau lewat 2D + inspector visual

maka pocket diorama layak **didemote permanen**.

---

## 10. Triangulasi Gemini (9 April 2026)

Masukan Gemini yang masuk setelah dossier ini dibuat ternyata **sangat menguatkan** arah yang sudah muncul dari audit Codex.

Inti verdict Gemini:

- kunci **Opsi B**
- berhenti memaksa 3D menjadi layar taktis/operasional
- jadikan `2D blueprint` sebagai **single source of truth**
- reposisikan 3D sebagai:
  - `reward`
  - `empathy engine`
  - `exhibition layer`
  - `inspector scene`

Poin yang paling penting dari Gemini bukan sekadar “3D itu mahal”, tetapi peringatannya terhadap:

- **Sunk Cost Fallacy**
- **The 3D Parity Trap**

Ini sangat relevan dengan PRIMER, karena:

- 2D sudah memikul hampir semua logika spasial penting
- 3D belum parity di cue operasional
- mobile/cross-platform justru menuntut arsitektur yang lebih hemat dan lebih jelas

### Implikasi strategis dari masukan Gemini

Jika masukan Gemini diadopsi, maka keputusan produk yang paling sehat menjadi:

1. `2D` adalah satu-satunya layar operasional resmi
2. `3D` tidak lagi dikejar sebagai tactical parity surface
3. `Pocket Diorama` tidak dibangun sebagai world replacement, tetapi sebagai:
   - inspector RW
   - reward visual setelah unlock
   - exhibition / attract mode

### 4 gagasan Gemini yang paling layak dipertahankan

#### A. Holographic Inspector

Saat RW dipilih di 2D, panel inspector menampilkan `3D turntable` kecil dengan kamera terkunci.

Kenapa ini kuat:

- GPU cost lebih rendah
- tidak perlu parity UI yang berat
- memperkaya sisi pameran tanpa merusak clarity operasional

#### B. Data Bloom Celebration

RW yang belum terdata bisa divisualkan sebagai `clay/grey model`, lalu “mekar” saat unlock PIS-PK berhasil.

Kenapa ini kuat:

- metafora visual data kesehatan menjadi sangat kuat
- relevan secara akademik
- memberi payoff emosional yang khas PRIMER

#### C. Asymmetric Environmental Storytelling

2D memberitahu *apa* yang terjadi; 3D memberitahu *mengapa/rasanya seperti apa*.

Contoh:

- 2D menunjukkan outbreak / risiko
- 3D menunjukkan suasana asap, lumpur, atau lingkungan padat yang memberi konteks

#### D. Exhibition Attract Mode

Full-village 3D yang saat ini sudah ada bisa diselamatkan sebagai:

- auto fly-through
- mode booth pameran
- layar idle sinematik

Jadi investasi 3D lama **tidak dibuang**, tetapi dipindah ke frame yang tepat.

### Catatan kritis Codex terhadap masukan Gemini

Saya setuju hampir penuh dengan arah Gemini, tetapi ada satu catatan penting:

- kita **belum perlu** langsung menghapus mode 3D full-village dari runtime hari ini

Alasannya:

- ia masih berguna sebagai baseline visual dan bahan exhibition mode
- yang lebih aman adalah **demotion fungsional**, bukan penghapusan tergesa-gesa

Jadi implementasi yang lebih aman:

- `deprecate as gameplay authority`
- `keep as presentational asset`
- `evolve into inspector / exhibition mode`

Dengan kata lain, Gemini memperkuat bukan hanya pilihan `Opsi B`, tetapi juga gaya implementasinya:

> **Jangan buang 3D. Ubah perannya.**

---

## 11. Synthesis Decision

Setelah triangulasi:

- history design lama
- runtime audit aktual
- analisis parity dan bug
- dan masukan Gemini

maka keputusan yang paling kuat saat ini adalah:

### Decision Lock (Current Best)

**Lock `Opsi B` sebagai arah desain kerja.**

Definisi praktisnya:

- `2D blueprint` = otak / layar komando / gameplay authority
- `3D diorama` = hati / reward / empathy / exhibition

Konsekuensinya:

- parity penuh 3D tidak lagi dianggap target default
- pekerjaan 3D berikutnya harus dibenarkan sebagai:
  - inspector value
  - exhibition value
  - emotional storytelling value

bukan sekadar “menyamai 2D”.

---

## 12. Prompt Ringkas untuk DeepThink

Gunakan ini kalau mau langsung dilempar ke DeepThink:

> Saya sedang meninjau keputusan desain `pocket diorama` di game PRIMER. Saat ini runtime aktif memakai `2D blueprint` sebagai source of truth gameplay, sementara `3D` masih berupa `full-village diorama` opsional dengan parity yang parsial. Awalnya pocket diorama per-RW pernah menjadi bagian dari visi ekspansi 200 KK / 4-5 RW, tetapi setelah audit runtime ia diturunkan ke backlog parity/showcase. Tolong bantu nilai dengan jujur: apakah pocket diorama masih keputusan terbaik untuk produk ini, atau sebaiknya ia didemote permanen atau diubah jadi reward/inspector mode? Pertimbangkan gameplay clarity, parity cost, mobile/cross-platform, exhibition value, coherence arsitektur, dan beban maintenance jangka panjang. Berikan rekomendasi tegas beserta tradeoff-nya.
