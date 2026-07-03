# ⚕️ PRIMER Avatar Engine: Art Direction Bible

**Target Rendering:** Pure React SVG | **ViewBox:** `0 0 200 200` | **Skala Optimal:** `36px` (Sidebar HUD) & `120px` (Modal)

## 1. STYLE PILLAR
*   **Nama Style:** Vanguard Medical Operator (PRIMER Trademark Edition)
*   **Aesthetic Keywords:** *Detailed, Sharp, Professional, Semi-Cel-Shaded, Authoritative.*
*   **DILARANG KERAS (Banned Elements):** 
    *   Proporsi *chibi* ekstrem (rasio kepala melebihi torso).
    *   Mata kartun komikal (*googly eyes*, *dot-eyes* tanpa bayangan).
    *   Penggunaan shading gradasi halus / *soft-edge shadow* (`<filter>`, `<linearGradient>`).
    *   Desain *flat geometric* murni tanpa susunan ilusi kedalaman bayangan (no-shadow).

## 2. PROPORTION CANON (Koordinat Eksak ViewBox)
*   **Head-to-Body Ratio:** Eksak visual **50:50** pada sumbu Y. 
    *   **Kepala:** Membentang dari puncak batas rambut (`Y: 24`) hingga dasar potong siluet rahang bawah (`Y: 132.8` untuk wanita, `Y: 137.6` untuk pria).
    *   **Torso:** Dimulai dari titik potong leher-bahu (`Y: 120`) memotong penuh batas dasar layar kanvas (`Y: 200`).
*   **Shoulder Width Range:** Bentangan melebar X bahu wajib menyentuh rentang **180px** (dari ujung siluet `X: 10` hingga `X: 190` pada sumbu terdalam `Y: 200`).
*   **Eye Position Anchor:** 
    *   Garis belah horisontal bola putih mata (*Sclera*) tertambat tegak lurus rata pada **`Y: 80`**.
    *   Titik pusat penempatan mutlak mata (*cx, cy*): Kiri di koordinat `(80.4, 79.2)` dan Kanan di `(119.6, 79.2)`. Jarak mutlak antarpupil adalah **39.2px**.
*   **Neck Span Dimorphism (Lebar Leher):**
    *   **Pria:** Kokoh tebal tegak (`X: 84` ke `X: 116` = **32px**).
    *   **Wanita:** Ramping *tapered* (`X: 88.8` ke `X: 111.2` = **22.4px**).
*   **Accessory Constraints:** 
    *   **Stetoskop:** Ketebalan pipa karet *tube* maksimun **`5.5px`** melengkung batas jatuh terbawah di `Y: 195`. *Chestpiece* berbentuk bundar konstan terfiksasi di koordinat dada kanan `X: 100, Y: 192` dengan **`r: 6`**.
    *   **Kacamata:** Lensa dipaku pada kurungan *bounding box* eksak **`36x26px`** bersudut membulat **`rx: 8`**, terpusat simetris pada kornea iris.

## 3. OUTLINE RULES
*   **Global Outline:** **TIDAK ADA**. Sangat dilarang membungkus karakter, rahang tepi, tubuh punggung, atau rambut dengan garis outline luar. Separasi siluet mengandalkan kemurnian 100% *hard-edge contour shadow* antar tumpukan warna kulit/kain.
*   **Selective Facial Stroke (WAJIB berwarna Midnight Slate `#020617`):**
    *   **Thick Upper Eyelid (Trademark):** WAJIB TEBAL. Wanita **`3.6px`**, Pria **`3.2px`** dengan parameter `strokeLinecap="round"`. 
    *   **Eyebrows (Alis):** Pria menggunakan ketebalan tebal tegas **`2.8px`**, Wanita tipis elegan **`1.6px`**.
    *   **Batang Hidung:** Garis minimalis pembentuk hidung Pria **`2.0px`**, Wanita **`1.4px`** dengan baseline transparan `opacity: 0.12`.
    *   **Kacamata:** Gagang frame separuh atas lebih tebal (*Half-rim* **`3.2px`**), frame dudukan bawah menipis ke **`2.4px`**.
*   **Outfit Seams (Garis Jahitan/Lipatan):** Dilarang pakai outline hitam. Garis kerah/raglan meminjam warna *base kain* yang digelapkan (Misal Scrubs Hijau `#059669` digaris menggunakan tepi hijau tua `#047857`). Ketebalan merentang **`2.5px - 3.0px`**.

## 4. SHADOW SYSTEM
*   **Level Shadow:** **2-Tone Cel-Shading** (Satu layer base blok warna murni + 1 layer bayangan potong tajam *hard-edge cel-shade*).
*   **Arah Cahaya:** *Top-Left* (Kiri-Atas). Highlight menyapu sisi kiri wajah. Seluruh tarikan bayangan jatuh serong asimetris ke arah Kanan Bawah. Aksen pantulan batas belakang hanya diakomodir oleh tipisnya garis cyan `rim light` di sisi kiri punggung baju.
*   **Adaptive Skin Tone Engine (Opacity Multiplier):**
    Untuk mencegah render bayangan berwujud kulit membusuk (*ashy*) di ras/warna kulit legam gelap, *shadow hex* berganti suhu (*warm shift*) dan menerapkan *multiplier*:
    *   **Light/Fair:** Warna dasar `#020617` | Multiplier **`1.0x`**
    *   **Medium/Tan:** Warna hangat `#1a0f0a` | Multiplier **`1.2x - 1.5x`**
    *   **Brown/Dark:** Warna tanah `#140a05` | Multiplier **`1.9x - 2.4x`**
*   **Opacity Eksak Dasar (Sebelum Dikalikan Multiplier):** Shadow leher dalam (`0.18`), Bayangan V-dagu wajah (`0.08`), Bayangan telinga lekuk (`0.10`), dan Shader Jewel mata pelangi (`0.40`).

## 5. COLOR PALETTE RULES
*   **Base Outfit Colors:**
    *   **Lab Coat:** Kain Putih jas `#f8fafc`, *Shadow Folds* base `#e2e8f0`, Inner Lapel Shirt Teal `#0f766e`.
    *   **Scrubs:** Kain seragam Hijau `#059669`.
    *   **Casual:** Kain T-shirt Dark Slate `#1e293b`.
*   **Shadow Multiplier Pakaian:** Bayangan siluet pakaian dikalkulasi dari tindihan lapisan `#020617`. Jas Putih Lab Coat (`opacity: 0.30`), Jas Scrubs (`opacity: 0.25`), Kasual Pakaian (`opacity: 0.40`).
*   **Accent Colors (PRIMER Brand):** 
    *   Teal Medis `#0d9488` (Detail dot badge karyawan, Pin bros logam).
    *   Cyan Biru `#38bdf8` (Air Keringat Panik, Efek *tint* lapisan lensa kacamata `opacity: 0.08`).
    *   Crimson Rose `#e11d48` (Siluet mulat wanita, Rona pipi asimetris miring sudut -12° dengan `opacity: 0.12`).
*   **Warna DILARANG:** Hitam Absolut `#000000` (harus diubah menjadi `#020617`). Putih Absolut `#ffffff` dilarang disapukan ke kain/kulit (HANYA diizinkan spesifik sebagai titik pijar putih *Catchlights* mata dua biji).
*   **Hijab Color Override:** Jika `hairStyle === 'hijab'`, warna rambut asli DILARANG diteruskan. Warna WAJIB di-override ke *Dark Slate* `#334155`, ciput *Midnight* `#0f172a` (`opacity: 0.95`).
*   **Hair Volume Shading:** Rambut dilarang *flat*. Volume dibentuk overlay `rgba(2,6,23,0.2)` + highlight putih `opacity: 0.15 - 0.20`.

## 6. DETAIL DENSITY SCALE (Render Budget Threshold)
Untuk performa React DOM yang optimal bebas hambatan di skala 36px HUD, kalkulasi *density limit* SVG primitive adalah mutlak:
*   **Head Base:** Kuota maksimal **8 Paths** (Base leher, shadow leher, kulit wajah, bayangan dagu, rahang tepian, telinga, bayangan kuping, hidung path).
*   **Eyes:** Padat, presisi batas **9 - 11 elemen** per mata. (*Sclera* datar 28px, *sclera shadow*, cincin mutlak lebar *overscaled iris r: 4.8/5.6*, sumur pupil hitam, 2 buah titik *catchlights* bintang, 2 *jewel shading arcs*, kurva ketebalan *upper eyelid*).
*   **Hair:** Rentang fleksibel **2 hingga 11 elemen paths** per gaya. (Potongan Buzz ringan memakai 2 path, sementara Wanita Rambut Panjang / Hijab mengomposisikan siluet depan poni menyamping, rambut tumpuk belakang, plus shader permanen `rgba(2,6,23,0.2)`).
*   **Outfit:** **8 - 15 elemen**. Logo dan Saku dada kiri TIDAK memakai logo rumit, melainkan disimplifikasi dengan posisi koordinat pasti di `X: 42, Y: 148` dan struktur susunan ID Badge dada kanan memuat pola baris sederhana (2 frame `<rect>`, 3 strip titik hijau identitas).
*   **Accessories:** Stetoskop **6 elemen** presisi. Kacamata utuh bersumbu **10 elemen**.
*   **Total Avatar Limit:** Sistem dilarang merender kurang dari **30 elemen minimum** dan sangat dilarang melewati **65 elemen maksimum per figur karakter**.

## 7. EXPRESSION RULES
*   **Mekanisme Transisi Mood:** Harus digerakkan secara eksklusif menggunakan pergeseran koordinat nilai rotasi sumbu geometris (BUKAN mengganti kanvas dasar apalagi *opacity fade-out* transparan lambat). Manipulasi menargetkan: `Y-axis` pada garis Alis, lebar `<path>` lengkung mulit bawah, dan penyusutan radius `r` pada titik pusat Iris sentral.
*   **Range Emosi Ekspresi:** Sangat *subtle/naturalistic* dan membumi untuk rona *Neutral, Happy, Stressed*. Gaya komikal berlebih *anime trope* difilter dan tertutup ketat, kecuali dieksekusi eksklusif HANYA sewaktu pasien gawat / *Panic Mode*.
*   **Elemen yang Bergeser State (Dibatasi 5-8 path berubah mutlak):**
    *   **Neutral (Baseline):** Kornea tengah statis `cy: 79.2`. Mulut Pria garis lurus tegas (`Y: 108`, `op: 0.6`). Mulut Wanita kurva senyum minimalis tertutup (`Q100,108.8`).
    *   **Happy:** Mata *Neutral* dipertahankan 100%. Bibir ditarik U-shape asimetris (`Q100, 111.2`). Blush wanita ditebalkan.
    *   **Stressed:** Alis ditekan turun ~`1.5px` ke arah dalam. Pria WAJIB memunculkan garis letih (*Fatigue lines*) di `Y: 84.8` (`strokeWidth: 1.0px`, `op: 0.15`).
    *   **Relieved:** *Sclera* & Iris DIBASMI. Ditimpa busur senyum tertutup `3.2px`. Bibir ditarik santai `Q100,112`.
    *   **Panic:** Alis patah tajam ke `Y: 64`. Upper Eyelid menyusut ke `2.4px`. Sclera melebar penuh, Iris `r: 4.2`, Pupil `r: 1.8`. Sweat drop statis (`X: 125.6, Y: 54.4`). Mulut balok kaget `10x6.4px` (`rx: 3`).

## 8. RESOLUTION SURVIVAL RULES (Skala Toleransi Optik 36px Sidebar)
Untuk mempertahankan arsitektur keterbacaan (*Readability Hierarchy*) avatar primer medis ketika dirender terjun bebas ke dimensi kanvas piktogram 36x36px:
*   **Minimum Stroke Mutlak:** Limit tidak kasat mata terendah yang disahkan kompilator adalah **`1.0px`**. (Hanya dihibahkan untuk detail sekunder *background* opsional: garis kantung letih pria dan sabuk pengikat lanyard badge).
*   **Minimum Shape Mutlak:** Lingkaran `<circle>` titik pantulan sekecil apapun tidak boleh kurang dari rasio titik **`r: 0.8`** (terkhusus *secondary catchlights* sorot pelangi mata bawah `cy: 81.5`).
*   **Priority 1: Elemen WAJIB SURVIVE (Anti-Aliasing Safe):** Proporsi tegas sumbu jawline dagu lancip (Wanita V-Shape) membanding lawan rahang datar (Pria), Ketebalan *Upper Eyelid* mata di puncak maksimal `3.6px`, diameter mutlak mata raksasa bermanik warna (*overscaled r: 5.6*), kontras blok rambut padat, serta kejelasan warna corak V-Neck pinggiran kerah baju siluet lab putih.
*   **Priority 3: Elemen BOLEH MENGHILANG (Graceful Degradation):** Tanda letih redup Pria (`stroke: 1, op: 0.15`), Blush pipi Wanita (`op: 0.12`), rincian lubang klip stetoskop (*r: 2.5*), struktur rajutan jahitan putus-putus pada kain hijau Scrubs saku (`strokeDasharray: 2,2`), serta detail *tint cyan* kilap mikro tangkai kacamata.

## 9. DOM STACKING ORDER (Painter's Algorithm)
SVG tidak memiliki `z-index`. Urutan render `<g>` dari belakang ke depan adalah **hukum mutlak**:
1. **Back VFX:** Rim light, aksen background.
2. **Back Hair:** Ponytail, ekor rambut panjang, punggung hijab.
3. **Head Base:** Leher → shadow leher → rahang → cheek shadow.
4. **Face Expressions:** Sclera → Iris & Jewel → Alis → Upper Eyelid → Mulut → Blush/Fatigue.
5. **Front Hair:** Poni depan, widow's peak, ciput hijab. (WAJIB menutupi ujung atas alis).
6. **Outfit:** Kain base → shadow lipatan → V-Neck kerah → ID Badge/Saku.
7. **Accessories:** Kacamata & Stetoskop (paling depan mutlak, menimpa kerah & hidung).
