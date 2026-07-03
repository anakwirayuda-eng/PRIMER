# AG Super Prompt - PRIMER Parallel UX Audit

Gunakan prompt ini untuk AG saat menjalankan audit paralel terhadap PRIMER.

```text
Kamu sedang mengaudit aplikasi game/simulasi klinik bernama PRIMER.

Repo workspace:
- D:\Dev\PRIMER

Konteks produk:
- PRIMER adalah simulasi kerja layanan primer / puskesmas dengan banyak permukaan UI:
  - dashboard mission control
  - clinical gameplay / poli
  - EMR pasien
  - wilayah / community map
  - inventory / logistics
  - staff
  - facility / gedung
  - diklat
  - arsip
  - sensus
  - rumah dinas
  - smartphone apps
  - overlay global seperti KPI, referral, outbreak, calendar, wiki, story overlay
- User sangat khawatir tentang:
  - cognitive overload
  - panelisasi berlebihan
  - UI terasa sempit/berdesakan di layar PC/laptop yang berbeda-beda
  - tampilan poli terlalu crowded
  - teks terlalu banyak
  - flow gameplay poli dan EMR terlalu melelahkan
  - mobile version untuk semua dimensi
  - plausibilitas klinis, terutama frekuensi emergency/IGD/defibrilasi yang terasa bisa terlalu sering atau tidak nyambung

Kondisi repo yang perlu kamu pahami:
- Ada dokumen audit master yang harus kamu pakai sebagai baseline:
  - docs/UX_AUDIT_MASTER_PRIMER.md
- Jangan bikin rubric baru dari nol kalau tidak perlu. Pakai rubric itu, lalu audit dengan kepala dingin.
- Target user bukan UX expert. Jadi hasilmu harus tajam, evidence-based, dan bisa langsung dipakai untuk memutuskan mana screen yang layak dan mana yang tidak.

Titik file utama yang wajib kamu baca minimal:
- src/components/MainLayout.jsx
- src/components/DashboardPage.jsx
- src/components/ClinicalPage.jsx
- src/components/PatientEMR.jsx
- src/components/KPIDashboard.jsx
- src/components/WilayahPage.jsx
- src/components/InventoryPage.jsx
- src/components/StaffPage.jsx
- src/components/GedungPage.jsx
- src/components/DiklatPage.jsx
- src/components/ArsipPage.jsx
- src/components/sensus/SensusPage.jsx
- src/components/Smartphone.jsx
- src/pages/RumahDinas.jsx
- src/data/ClinicalServices.js

Konteks perubahan terbaru yang sudah terjadi:
- ClinicalPage sudah pernah dipoles untuk:
  - responsivitas tablet
  - queue kiri
  - workflow spotlight / empty state
  - pengurangan dominasi alert IGD
- DashboardPage sudah pernah dipoles untuk:
  - card balance
  - mini support stats
  - pengisian area yang sebelumnya terasa kosong
- Artinya: jangan berasumsi masalahnya masih sama seperti versi lama. Audit current state dari code dan browser, bukan dari bayanganmu.

Tujuanmu:
1. Audit brutal tapi fair terhadap kesiapan UI/UX PRIMER.
2. Cari issue P1-P3 yang benar-benar memengaruhi kenyamanan, scanability, trust, dan efisiensi aksi user.
3. Bedakan masalah:
   - usability
   - hierarchy
   - density
   - panel economy
   - responsive failure
   - tap/click comfort
   - navigation/state logic
   - cognitive load
   - domain realism / gameplay plausibility
4. Jika menemukan mismatch klinis yang terasa absurd, sebutkan dengan jelas.

Kerangka audit wajib:
- Pakai rubric 10 poin dari docs/UX_AUDIT_MASTER_PRIMER.md
- Pakai attrition gate dan auto-fail yang ada di dokumen itu
- Audit per surface, bukan cuma per page besar
- Audit default state, full-data state, alert state, empty/loading state bila ada

Viewport wajib:
- Desktop / laptop:
  - 1366x768
  - 1440x900
  - 1536x864
  - 1920x1080
- Tablet:
  - 1024x768
  - 768x1024
  - 820x1180
- Mobile:
  - 360x640
  - 390x844
  - 430x932

Prioritas audit:
1. ClinicalPage shell
2. QueueList
3. PatientEMR tabs and sidebar
4. Dashboard hub and subviews
5. Wilayah compact HUD and inspector flows
6. KPI modal
7. Archive / Census dense screens
8. Staff / Inventory / Facility
9. Rumah Dinas and Smartphone

Hard focus area:
- Apakah user tahu next step dalam 3 detik?
- Apakah CTA utama jelas?
- Apakah ada info duplikat di banyak panel?
- Apakah panel kanan/sekunder benar-benar membantu?
- Apakah layout hanya bagus di monitor besar tapi sempit di laptop biasa?
- Apakah tablet terasa seperti desktop rusak?
- Apakah mobile benar-benar usable, bukan desktop yang diperas?
- Apakah EMR terlalu berat untuk scanning cepat?
- Apakah queue pasien terlalu ramai?
- Apakah alert IGD terlalu sering menabrak flow poli?
- Apakah distribusi kasus sesuai layanan yang aktif?

Checklist khusus poli:
- queue kiri
- service switching
- sub-tab antrian vs prolanis
- workflow spotlight
- empty state vs active state
- saat ada patient aktif lalu masuk EMR
- saat ada emergency tapi user sedang di poli umum
- clarity antara service info, queue metrics, dan action CTA

Checklist khusus EMR:
- apakah identitas pasien sangat jelas
- apakah tab terlalu banyak untuk layar tertentu
- apakah tab strip tetap masuk akal di tablet/mobile
- apakah sidebar insight/eval/cppt membantu atau malah menambah beban
- apakah ada section yang padat tapi rendah nilai keputusan

Checklist khusus dashboard:
- balance antar card hub
- apakah tiap card punya bobot visual yang proporsional
- apakah summary stat cukup ringkas
- apakah subview terasa sebagai halaman yang fokus, bukan dump metrik

Checklist khusus wilayah:
- apakah map membantu orientasi
- apakah inspector panel terlalu berat
- apakah compact HUD benar-benar menyederhanakan
- apakah 2D/3D/peralihan showcase menambah kebingungan

Checklist khusus mobile:
- satu layar satu prioritas
- no horizontal scroll
- tap target aman
- drawer/modal bisa ditutup dengan jelas
- CTA utama tidak tenggelam
- list item tetap singkat

Checklist khusus realism:
- IGD terlalu sering atau tidak
- defibrilasi terlalu sering atau tidak
- emergency terlalu dominan untuk fasilitas primer atau tidak
- service context sesuai atau tidak
- variasi kasus realistis atau random absurd

Cara kerja yang saya inginkan:
1. Baca dokumen audit master lebih dulu.
2. Baca file kunci secukupnya untuk paham arsitektur.
3. Jalankan app / visual verification bila memungkinkan.
4. Audit secara independen.
5. Jangan takut memberi label “tidak layak” bila memang gagal.
6. Jangan menyanjung desain. Nilai kegunaan nyata.

Output yang saya mau:
1. Temuan utama dulu, urut P1 ke P3
2. Untuk tiap temuan:
   - Judul
   - Severity
   - Surface / viewport
   - Gejala
   - Kenapa ini buruk untuk user
   - Dugaan akar masalah
   - Solusi yang disarankan
   - File / komponen terkait
3. Setelah itu:
   - daftar surface yang langsung auto-fail
   - daftar surface yang hanya layak terbatas
   - daftar surface yang relatif solid
4. Tambahkan:
   - browser checks yang masih perlu dijalankan
   - residual risk
   - keputusan desain yang tetap butuh human judgment

Aturan penting:
- Jangan berhenti di “secara umum bagus”.
- Jangan cuma kasih opini visual.
- Prioritaskan friction yang membuat user:
  - bingung
  - lelah
  - salah klik
  - scan terlalu lama
  - tidak yakin next step
  - kewalahan oleh panel dan sinyal kecil
- Lebih baik temuan sedikit tapi tajam daripada daftar panjang yang dangkal.

Kalibrasi severity:
- P1 = merusak task flow atau gagal di viewport umum
- P2 = jelas mengganggu dan memperberat penggunaan
- P3 = rough edge / polish / inconsistency

Kalimat penutup yang saya butuhkan:
- “Bagian yang paling rawan secara UX saat ini adalah ...”
- “Jika hanya boleh membenahi 3 hal dulu, prioritasnya adalah ...”
```

## Catatan penggunaan

- Prompt ini sengaja dibuat cukup lengkap supaya AG tidak salah paham konteks PRIMER.
- Jika AG bisa membaca file repo, minta dia baca `docs/UX_AUDIT_MASTER_PRIMER.md` dulu.
- Jika AG hanya menerima prompt teks tanpa akses file, kirim prompt ini bersama ringkasan rubric 10 poin.

