# PRIMER UX Audit Master

Tanggal: 2026-04-16
Scope: seluruh permukaan UI utama PRIMER, lintas desktop, laptop umum, tablet, dan mobile
Tujuan: memaksa audit yang tegas, konsisten, dan attritive supaya cepat terlihat screen mana yang layak, layak terbatas, atau tidak layak

## 1. Cara Pakai

Audit dilakukan per `screen`, `tab`, `panel`, `drawer`, `modal`, dan `state penting`.

Skor per poin:

- `0` = gagal
- `1` = lemah
- `2` = cukup
- `3` = kuat

Total skor per surface:

- `0-14` = tidak layak
- `15-20` = layak terbatas, revisi besar wajib
- `21-25` = usable tapi masih berat
- `26-30` = solid

Status akhir surface:

- `Tidak layak` jika kena auto-fail meski skor total tinggi
- `Layak terbatas` jika lolos auto-fail tapi skor inti masih lemah
- `Layak` jika lolos semua gate keras dan skor inti stabil

## 2. Attrition Gate

Surface langsung `tidak layak` jika salah satu terjadi:

- CTA utama tidak terlihat dalam 3 detik
- Ada clipping, overflow, teks kepotong, atau tombol terdorong keluar
- Ada horizontal scroll yang bukan disengaja
- Layout bergantung pada monitor besar dan pecah di `1366x768`
- Tablet `1024x768` atau `768x1024` terasa seperti desktop rusak
- Mobile menampilkan lebih dari satu panel primer sekaligus
- Aksi inti butuh scroll panjang sebelum user bisa mulai
- State tab/panel berubah tanpa penanda konteks yang jelas
- Alert safety-critical tenggelam atau justru alert minor terlalu dominan
- User harus membandingkan terlalu banyak panel untuk tahu next step

Gate tambahan agar surface disebut `layak`:

- Poin `Task Clarity`, `Information Hierarchy`, `Panel Economy`, `Responsive Stability`, dan `Cognitive Load` minimal skor `2`
- Tidak ada lebih dari `2` poin lain yang bernilai `1`
- Harus lolos di `1366x768`, `1024x768`, dan `390x844`

## 3. Rubrik 10 Poin

| Poin | Apa yang dicek | Tanda gagal |
| --- | --- | --- |
| `1. Task Clarity` | Dalam 3 detik user tahu sedang di mana dan apa langkah berikutnya | Heading lemah, CTA utama tidak dominan, screen terasa "apa sih yang harus saya lakukan?" |
| `2. Information Hierarchy` | Urutan baca alami: title -> status -> aksi -> detail | Semua panel sama keras, badge dan angka saling rebut perhatian |
| `3. Density vs Clutter` | Informasi padat hanya yang relevan saat itu | Info duplikat, card-inside-card, label kecil terlalu banyak |
| `4. Panel Economy` | Jumlah panel aktif masuk akal untuk viewport itu | Terlalu banyak split pane, drawer, tab, rail, subpanel bersamaan |
| `5. Readability` | Teks mudah discan di laptop biasa dan tablet | Font kecil, kontras lemah, line-height sempit, metadata pasien terlalu ramai |
| `6. Navigation & State Logic` | Pindah tab/service/mode tetap terasa jelas | User lupa sedang di mode mana, tab dipakai untuk hal yang tidak setara |
| `7. Interaction Comfort` | Klik/tap nyaman, target cukup besar, jarak aman | Tombol rapat, chip kecil, salah klik mudah terjadi |
| `8. Responsive Stability` | Layout tetap rasional di semua viewport target | Masih "muat" tapi proporsi absurd, wrapping aneh, panel inti jadi sempit |
| `9. Cognitive Load` | UI membantu recognition, bukan recall | User harus scan banyak area, mengingat status panel lain, atau baca terlalu lama |
| `10. Domain Realism & Workflow Fit` | Alur sesuai konteks klinis/gameplay | Kasus tidak nyambung, emergency terlalu sering, distribusi layanan terasa random |

## 4. Evidence Anchor

Rubrik ini sengaja disandarkan ke guideline yang umum dipakai:

- `NN/g 10 Usability Heuristics`: clarity, recognition over recall, consistency, minimalist design
- `NIST Health IT UI guidance`: display compatibility, alert prominence, information density, workflow fit, patient focus
- `WCAG 2.2`: reflow, target size, readable scaling
- `Material Accessibility`: hierarchy, grouping, visible actions, spacing

Referensi:

- [NN/g Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [NIST Health IT UI Guidance PDF](https://nvlpubs.nist.gov/nistpubs/gcr/2015/NIST.GCR.15-996.pdf)
- [WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow)
- [WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Material Accessibility](https://m1.material.io/usability/accessibility.html)

## 5. Viewport Matrix

### Desktop and Laptop

| Label | Size | Status |
| --- | --- | --- |
| `Laptop baseline keras` | `1366x768` | wajib lolos |
| `Laptop high-DPI umum` | `1536x864` | wajib lolos |
| `Desktop menengah` | `1440x900` | wajib lolos |
| `Desktop standar` | `1920x1080` | wajib lolos |
| `Laptop sempit lama` | `1280x720` | opsional keras untuk dense screen |

### Tablet

| Label | Size | Status |
| --- | --- | --- |
| `Tablet landscape klasik` | `1024x768` | wajib lolos |
| `Tablet portrait klasik` | `768x1024` | wajib lolos |
| `Tablet portrait besar` | `820x1180` | wajib lolos |
| `Tablet landscape lebar` | `1280x800` | wajib lolos |

### Mobile

| Label | Size | Status |
| --- | --- | --- |
| `Mobile kecil lama` | `360x640` | wajib cek |
| `iPhone kecil` | `375x667` | wajib cek |
| `Mobile baseline keras` | `390x844` | wajib lolos |
| `Android tinggi` | `412x915` | wajib cek |
| `iPhone besar` | `430x932` | wajib cek |

## 6. Gate Per Device

### Laptop and Desktop

- area kerja utama tidak boleh jadi strip sempit hanya demi mempertahankan semua panel
- panel kiri idealnya stabil, tidak lebih dominan dari area aksi
- tiga kolom hanya boleh dipakai bila kolom tengah masih nyaman dibaca
- tidak boleh ada teks penting yang wrap jadi 3-4 baris karena panel terlalu sempit
- alert tidak boleh memecah ritme scan utama

### Tablet

- tidak boleh terasa seperti desktop yang diperas
- jika tiga zona aktif membuat area utama rusak, turunkan menjadi dua zona
- queue, CTA, dan state aktif harus tetap terlihat tanpa precision scrolling
- split-pane harus tetap bisa dibaca sekilas

### Mobile

- satu layar satu prioritas
- hanya satu panel primer aktif pada satu waktu
- secondary info masuk drawer, sheet, accordion, atau langkah berikutnya
- list item default maksimal 2 baris konten inti
- sticky CTA atau bottom action dibutuhkan untuk task kritis
- tidak boleh ada horizontal scroll

## 7. Panelization Stress Test

Khusus PRIMER, terutama `ClinicalPage`, `PatientEMR`, `WilayahPage`, dan modal KPI.

### Panel Load Index

Hitung berapa zona primer tampil sekaligus:

- `1-2 zona` = aman
- `3 zona` = hanya boleh jika area utama masih dominan
- `4+ zona` = hampir selalu gagal untuk laptop dan tablet

Zona primer yang dihitung:

- nav/service rail
- queue/list utama
- work area utama
- side insight panel
- floating KPI/modal besar
- persistent banner/alert yang mengambil tinggi nyata

### Duplication Load

Hitung pengulangan informasi penting:

- jika angka/status yang sama muncul di `3` tempat atau lebih, itu indikasi clutter
- jika nama service, jumlah antrian, atau urgency tampil berulang tanpa keputusan baru, turunkan

### Micro-Signal Saturation

Surface cenderung overload jika dalam satu scan path user melihat terlalu banyak:

- badge
- timer
- icon status
- accent color
- chip
- angka kecil

Patokan:

- `Desktop/laptop`: maksimal `3` sinyal mikro dominan per item
- `Tablet`: maksimal `2-3`
- `Mobile`: maksimal `2`

## 8. Data Density Cap

### Queue Row

- nama pasien harus dominan
- metadata default maksimal `3-4` sinyal
- timer dan urgency boleh tampil, tapi bukan bersama 5 metadata lain
- default row idealnya `2` baris di mobile, `2-3` baris di desktop

### Card Default

Satu card idealnya tidak memaksa user membaca lebih dari:

- `1` heading
- `1` quick stat utama
- `1` CTA atau next step
- `1-2` supporting line

Jika butuh lebih, pertimbangkan progressive disclosure.

### Tab Strip

- tab hanya untuk kategori yang setara
- jangan campur tab untuk `mode`, `detail`, `alert`, dan `shortcut` sekaligus
- di layar sempit, jika tab melebihi ruang, wajib ada alternatif yang jelas

## 9. Severity Definition

- `P1`: menggagalkan task, menyesatkan aksi, atau rusak di viewport umum
- `P2`: masih bisa dipakai tapi jelas berat, lambat, atau membingungkan
- `P3`: polish issue, imbalance, rough edge, inconsistency

## 10. Surface Inventory

Semua item di bawah ini harus diaudit minimal pada state `default`, `loading/empty` jika ada, `full data`, `alert`, dan `worst-case content`.

### A. Boot and Entry Flow

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `OpeningScreen` | intro/splash | pacing, skip clarity, visual noise |
| `DatabaseSync` | syncing/loading | status clarity, blocking feedback |
| `LoginPage` | auth/offline path | CTA clarity, form comfort, fallback logic |
| `SaveSlotSelector` | empty slot, occupied slot, new game | card hierarchy, slot differentiation |
| `PlayerSetup` | profile setup flow | form grouping, progression clarity |

### B. Main Shell and Global Overlay

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `MainLayout shell` | sidebar expanded, collapsed, mobile nav open | page identity, navigation load, shortcut discoverability |
| `TimeController` | normal, paused, fast-forward | status visibility, control priority |
| `PauseOverlay` | paused game | resume clarity, interruption handling |
| `QuestBoard` | open/closed | overlay density, task scanning |
| `Smartphone` | homescreen, app open | device-within-device clutter, touch comfort |
| `ShortcutHelpModal` | keyboard help | readability, discoverability |
| `SettingsModal` | global settings | grouping, safe dismissal |
| `StatusJunctionModal` | status summary | priority order, overload risk |
| `CalendarModal` | archive calendar | date selection comfort |
| `DailyReportModal` | day report detail | reading fatigue, navigation |
| `KPIDashboard global modal` | all tabs | modal size, scroll trap, density |
| `EducationalWikiModal` | knowledge overlay | readability, overlay escape |
| `NarrativeOverlay` | active story | interruption cost, dismissal clarity |
| `ReferralHUD` | passive/global referral status | visual intrusion |
| `ReferralSISRUTEModal` | referral action flow | safety, task progression |
| `OutbreakBanner` | passive alert | prominence without takeover |
| `OutbreakModal` | outbreak detail | alert relevance and actionability |
| `AvatarSelectionModal` | avatar editing | grid density, preview clarity |
| `AboutModal` | about/help | readability |
| `GameOverModal` | fail state | recovery clarity |

### C. Dashboard

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `DashboardPage` | hub home | card balance, hierarchy, scanability |
| `DashboardPage` | `clinical` view | metric grouping, action mapping |
| `DashboardPage` | `community` view | information spread, chart readability |
| `DashboardPage` | `performance` view | underfilled vs overcrowded states |
| `DashboardPage` | `accreditation` view | status legibility, priority cues |
| `DashboardPage` | `logistics` view | stock urgency vs clutter |

Dashboard hard checks:

- hub card tidak boleh ada yang terasa kosong sendirian
- angka cepat harus bisa discan tanpa baca paragraf
- action card dan status card tidak boleh sama dominan
- `1366x768` wajib nyaman, bukan hanya monitor besar

### D. Clinical Gameplay

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `ClinicalPage shell` | desktop expanded rail | panel economy, width balance |
| `ClinicalPage shell` | desktop collapsed rail | icon recognition, hover discoverability |
| `ClinicalPage shell` | tablet | split-pane sanity, panel width |
| `ClinicalPage shell` | mobile | queue drawer, single-priority flow |
| `ServiceCardDeck` | all services | service discoverability, lock state clarity |
| `ClinicalPage spotlight` | empty state / workflow ready | next-step clarity, duplicate stats |
| `ClinicalPage` | KPI mode | context return, overlay dominance |
| `ClinicalPage` | lounge rest state | novelty vs distraction |
| `ClinicalPage` | emergency alert outside IGD | proximity and proportionality |
| `QueueList` | normal queue | row density, scan speed |
| `QueueList` | long names, many badges | worst-case wrapping |
| `QueueList` | empty queue | empty state usefulness |
| `Poli Umum` | sub-tab `antrian` | queue clarity, next action |
| `Poli Umum` | sub-tab `prolanis` | mode clarity, not hidden by queue bias |
| `IGD` | `EmergencyPanel` | triage prominence, speed of action |
| `IGD` | `EmergencyEMR` | high-stakes clarity, safety affordance |
| `Farmasi & Lab` | placeholder / future state | expectation setting |
| `Poli KIA-KB` | placeholder / future state | expectation setting |
| `Poli Gigi` | placeholder / future state | expectation setting |

Clinical hard checks:

- pilih pasien harus bisa < `5` detik
- user harus tahu next step tanpa baca paragraf panjang
- queue kiri tidak boleh terasa seperti spreadsheet mini
- panel kanan hanya boleh hidup jika benar-benar bantu keputusan
- emergency alert harus dekat konteksnya tapi tidak memecah fokus poli terus-menerus

### E. Patient EMR

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `PatientEMR shell` | header ribbon | identity clarity, patient safety, density |
| `PatientEMR shell` | mobile | sticky actions, tab compression |
| `PatientEMR` | tab `anamnesis` | interaction readability, chat fatigue |
| `PatientEMR` | tab `history` | table/list readability |
| `PatientEMR` | tab `physical` | action grouping, result visibility |
| `PatientEMR` | tab `labs` | order clarity, result readability |
| `PatientEMR` | tab `assessment` | search/select diagnosis flow |
| `PatientEMR` | tab `treatment` | prescription density, medication pick comfort |
| `PatientEMR` | tab `procedures` | search and selection clarity |
| `PatientEMR` | tab `education` | content selection clarity |
| `PatientEMR` | tab `billing` | summary readability |
| `ClinicalSidebar` | sidebar expanded/collapsed | insight usefulness vs noise |
| `ReasoningDashboard` | evaluation density | panel overload risk |

EMR hard checks:

- patient identity harus sangat menonjol
- tab aktif harus jelas bahkan saat layar sempit
- data entry/search tidak boleh memaksa scroll liar
- mobile tidak boleh menampilkan terlalu banyak lapisan klinis sekaligus

### F. Inventory and Logistics

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `InventoryPage` | header + stats | stat hierarchy |
| `InventoryPage` | search + category filter | filter discoverability |
| `InventoryPage` | stock table | row density, table overflow |
| `InventoryPage` | pending orders area | urgency visibility |
| `OrderModal` | ordering flow | form clarity, quantity comfort |
| `Procurement log` | expanded log state | scrolling, column readability |

### G. Facility / Gedung

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `GedungPage` | header + stats | at-a-glance comprehension |
| `GedungPage` | room grid | selection comfort, card balance |
| `UpgradeModal` | confirm/upgrade/loading | cost clarity, action confidence |

### H. Staff

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `StaffPage` | tab `available` | selection vs detail split |
| `StaffPage` | tab `hired` | roster scanability |
| `StaffDetail` | right detail panel | width sanity on laptop |
| `Fire confirmation modal` | confirmation state | danger clarity |

### I. Academy / Diklat

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `DiklatPage` | XP header | summary density |
| `DiklatPage` | tab `skills` | card density, upgrade clarity |
| `DiklatPage` | category filter | chip comfort |
| `DiklatPage` | tab `workshops` | reward/cost clarity |

### J. Archive and Census

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `ArsipPage` | tab `folders` | search, folder grouping |
| `ArsipPage` | tab `daily` | report scanability |
| `ArsipPage` | family detail view | toolbar clarity, member density |
| `MemberProfileCard` | collapsed/expanded | progressive disclosure quality |
| `SensusPage` | hero summary | top summary balance |
| `SensusPage` | `cards` mode | card density, scanning |
| `SensusPage` | `table` mode | overflow, column compression |
| `SensusPage` | KK modal | document realism vs usability |
| `SensusPage` | search/filter by RW/RT | discoverability |

### K. Wilayah

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `WilayahPage` | default map | orientation, clutter, layer logic |
| `WilayahPage` | compact HUD | mobile/tablet simplification |
| `WilayahPage` | selected building inspector | inspector density, actions |
| `WilayahPage` | selected RW dossier | macro insight clarity |
| `WilayahPage` | home visit modal | intervention choice comfort |
| `WilayahPage` | building interior / game panel | entry clarity |
| `WilayahPage` | `PosyanduActivePanel` | workflow grouping |
| `WilayahPage` | `PustuActivePanel` | workflow grouping |
| `WilayahPage` | `CommunityDiagnosisPanel` | scenario density |
| `WilayahPage` | `BehaviorCasePanel` | reading burden |
| `WilayahPage` | showcase modal 3D | cinematic vs usability |
| `WilayahPage` | 2D/3D fallback switch | continuity, no broken mental model |

Wilayah hard checks:

- peta harus tetap membantu orientasi, bukan jadi ilustrasi cantik tapi membingungkan
- inspector panel tidak boleh memonopoli layar pada laptop kecil
- kalau 3D/2D fallback berubah, user tidak boleh kehilangan konteks

### L. Rumah Dinas

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `RumahDinas` | room tabs overall | tab count vs width |
| `RumahDinas` | `living_room` | action discoverability |
| `RumahDinas` | `bedroom` | sleep flow clarity |
| `RumahDinas` | `kitchen` | item/action grouping |
| `RumahDinas` | `workspace` | study/work density |
| `RumahDinas` | `gym` | action clarity |
| `RumahDinas` | `guest_room` | guest event readability |
| `RumahDinas` | `garage` | space economy |
| `RumahDinas` | `bathroom` | novelty vs usability |
| `MorningBriefingModal` | day start briefing | scanability |
| `EndOfDayModal` | debrief | fatigue vs clarity |

### M. Smartphone Apps

| Surface | Sub-surface / state | Fokus audit |
| --- | --- | --- |
| `Smartphone homescreen` | icon grid + dock | icon density, readability |
| `ChatApp` | app body | conversational readability |
| `BankApp` | finance app | dense finance readability |
| `ShopApp` | purchase flow | card density, tap comfort |
| `NewsApp` | feed readability | list density |

## 11. Device-Specific Audit Worksheet

Ulangi worksheet ini untuk setiap viewport penting.

### Desktop / Laptop Worksheet

- apakah screen masih nyaman di `1366x768`
- apakah kolom utama tetap dominan
- apakah ada card atau panel yang terlihat "maksa muat"
- apakah tombol penting masih punya napas visual
- apakah state panjang menyebabkan wrapping absurd

### Tablet Worksheet

- apakah layout berubah jadi dua zona yang masuk akal
- apakah queue/list masih bisa dipilih cepat
- apakah title, stat, dan CTA masih terlihat tanpa scroll besar
- apakah tab strip masih terbaca
- apakah split layout masih terasa disengaja

### Mobile Worksheet

- apakah hanya satu prioritas aktif
- apakah ada sticky CTA bila task kritis
- apakah list item tetap ringkas
- apakah drawer/modal mudah ditutup
- apakah thumb reach masuk akal

## 12. Clinical Plausibility Worksheet

Audit terpisah untuk realism gameplay:

- apakah `IGD` terlalu sering interupsi layanan lain
- apakah `defibrilasi` atau kasus kritis terlalu sering dibanding konteks FKTP
- apakah distribusi kasus per service nyambung
- apakah pola emergency terasa "random absurd"
- apakah service placeholder memberi ekspektasi yang jujur
- apakah alur klinis masih terasa seperti kerja fasilitas primer

Status plausibility:

- `Layak`: variasi terasa masuk akal dan mendukung gameplay
- `Perlu tuning`: kadang terasa janggal tapi belum merusak flow
- `Tidak layak`: pola kasus merusak mental model user

## 13. Reporting Template

Gunakan format ini per surface:

```md
## [Nama Surface]
Viewport: 1366x768
Status: Layak / Layak terbatas / Tidak layak
Total: 22/30

Skor:
- Task Clarity: 2
- Information Hierarchy: 2
- Density vs Clutter: 1
- Panel Economy: 1
- Readability: 2
- Navigation & State Logic: 3
- Interaction Comfort: 2
- Responsive Stability: 2
- Cognitive Load: 1
- Domain Realism & Workflow Fit: 3

Auto-fail:
- Tidak

P1:
- ...

P2:
- ...

P3:
- ...

Perbaikan tercepat:
- ...

Perbaikan struktural:
- ...
```

## 14. Quick Fail Clues for PRIMER

Kalau menemukan salah satu pola ini, biasanya screen memang belum matang:

- queue kiri padat tetapi panel tengah juga mengulang semua info queue
- angka penting muncul di banyak card sekaligus
- tab dan panel dipakai untuk "lapisan" yang tidak setara
- laptop biasa terasa sesak padahal monitor besar terlihat bagus
- mobile hanya versi desktop yang dikecilkan
- CTA utama kalah oleh badge, chip, atau efek visual
- user harus membaca terlalu banyak sebelum bisa bertindak
- kasus klinis terasa tidak sesuai layanan aktif

## 15. Prioritas Audit Putaran Berikutnya

Urutan yang paling bernilai untuk PRIMER:

1. `ClinicalPage` shell, queue, spotlight, dan service switching
2. `PatientEMR` tabs, sidebar, dan mobile behavior
3. `DashboardPage` hub + subview balance
4. `WilayahPage` compact HUD, inspector, dan map-to-panel continuity
5. `SensusPage`, `ArsipPage`, `KPIDashboard`, dan `StaffPage`
