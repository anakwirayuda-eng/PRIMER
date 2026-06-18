# 🎼 PRIMER — Audio Sourcing Guide (Week 1)

> **Tujuan**: Panduan download, proses, dan pasang 3 ambient soundscape BGM CC0 dari Freesound.org sesuai [AUDIO_DESIGN.md](./AUDIO_DESIGN.md) v0.2.
> **Status**: v1.0 (2026-04-24) — curated & license-verified
> **Author**: AG (Commander)

---

## 🎯 TL;DR

3 track CC0 yang **sudah diverifikasi licensing + metadata-nya**:

| Scene | Track | Creator | Durasi | Ukuran WAV | Link |
|---|---|---|---|---|---|
| **Menu** | Village miners morning (Amazon) | felix.blume | 97s | 26.7 MB | [674665](https://freesound.org/people/felix.blume/sounds/674665/) |
| **Wilayah** | Crickets — Jungle & Summer day | Vrymaa | 85s | 7.8 MB | [805467](https://freesound.org/people/Vrymaa/sounds/805467/) |
| **Puskesmas** | Empty Office Room Tone | richwise | 472s | 172.9 MB | [456207](https://freesound.org/people/richwise/sounds/456207/) |

Semua **CC0** (public domain, tanpa attribution requirement). Setelah konversi ke `.ogg` + `.mp3` (128kbps, -18 LUFS), total bundle estimasi **7–10 MB** — well under DeepThink 20 MB budget.

---

## 📋 Curated Track Pool

### 🏆 Scene 1 — Main Menu (Morning Village)

**PRIMARY**: [Village miners morning atmosphere in forest edge](https://freesound.org/people/felix.blume/sounds/674665/)
- **Creator**: felix.blume (field recording specialist, prolific CC0 contributor)
- **License**: ✅ CC0 (public domain)
- **Technical**: WAV 24-bit / 48 kHz / stereo / 97.1s / 26.7 MB
- **Content**: Ambience pagi hutan pinggir desa Amazon — birds + **rooster** + dog barking + distant Spanish voices
- **Tags**: Amazon, atmosphere, barking, bird, dog, edge, field-recording, forest, miners, morning, rainforest, rooster, spanish, village, voices
- **Pro**: Atmosfer village morning paling kaya; ada rooster (ayam berkokok) + distant voices → "desa hidup"
- **Con**: Voices dalam bahasa Spanyol (bukan Indonesia) — nyaris tak terdengar, tapi kalau volume naik bisa jadi cue region wrong
- **Tip processing**: trim ke 60-90s, crossfade 2s di ujung untuk loop seamless

**ALTERNATIVE**: [Country rural mountain village quiet but dense morning birds and distant rooster](https://freesound.org/people/kyles/sounds/413849/)
- Creator: kyles | CC0 | WAV 96kHz 24-bit stereo | 232s | 129 MB
- Peru mountain village, morning birds + distant rooster + faint radio/TV
- **Trade-off**: Kualitas audiophile (96kHz), tapi file sangat besar. Download lebih lambat.

---

### 🏆 Scene 2 — Wilayah (Rural Daytime)

**PRIMARY**: [Crickets — Jungle & Summer day](https://freesound.org/people/Vrymaa/sounds/805467/)
- **Creator**: Vrymaa
- **License**: ✅ CC0
- **Technical**: WAV 16-bit / 48 kHz / mono / 85.5s / 7.8 MB
- **Content**: Forest crickets di pegunungan tropis, siang hari. "No background noise, clean sound, close range."
- **Tags**: ambiance, ambient, cricket, crickets, field-recording, forest, jungle, nature, summer, tropical
- **Pro**: **BEST TROPICAL MATCH** untuk Indonesia — langsung terdengar sebagai "siang di desa hutan tropis". Clean, mudah di-loop.
- **Con**: Mono (tidak stereo) — masih OK untuk ambient background, tapi kurang spasial

**ALTERNATIVE**: [Wheat Field Ambience](https://freesound.org/people/florianreichelt/sounds/447810/)
- Creator: florianreichelt | CC0 | WAV 48kHz | 61s | 11.2 MB
- Direkam saat trip ke India — wind + birds + farming ambient
- **Trade-off**: Wheat field (bukan jungle), tapi kultural lebih dekat (South Asia)

---

### 🏆 Scene 3 — Puskesmas (Clinical Indoor)

**PRIMARY**: [Empty Office Room Tone](https://freesound.org/people/richwise/sounds/456207/)
- **Creator**: richwise
- **License**: ✅ CC0
- **Technical**: WAV / 48 kHz / 472s (7:52) / 172.9 MB
- **Content**: Empty office — dominated by faint fan noise + occasional subtle ~3.7 kHz beep every few seconds
- **Tags**: background-noise, office, room-tone, quiet, fan, hum, indoors, building, large-room
- **Pro**: Durasi 7+ menit = banyak material untuk trim + loop. Vibe "ruang kerja sepi" cocok untuk Puskesmas.
- ⚠️ **WARNING**: Ada beep halus ~3.7 kHz tiap beberapa detik — **AUDITION DULU**. Kalau annoying, edit out di Audacity (Effect > Notch Filter @ 3700 Hz) atau trim ke segmen tanpa beep.

**ALTERNATIVE** (jika richwise beep terlalu mengganggu): cari manual di [Freesound tag office CC0](https://freesound.org/search/?q=office+hum&f=license%3A%22Creative+Commons+0%22)

---

## 🛠️ Workflow — Download → Process → Install

### Step 1: Download (butuh Freesound account free)
1. Buat akun gratis di https://freesound.org/home/register/ (pakai email apa saja)
2. Klik link track di atas
3. Pojok kanan atas: tombol **Download** → pilih format Wave (WAV) — pilih yang full quality, bukan OGG preview

### Step 2: Audition di Audacity (cek beep / noise)
1. Install [Audacity](https://www.audacityteam.org/) (gratis, multi-platform)
2. File > Open → pilih WAV download
3. Play full: dengar untuk beep, voice artefak, abrupt cut
4. **Khusus richwise**: lewati beberapa detik, cari area tanpa beep. Kalau semua ada beep → apply Effect > Notch Filter dengan frequency 3700 Hz Q=5 untuk suppress.

### Step 3: Trim ke durasi target (60-120s)
1. Pilih region tengah yang paling representatif (hindari awal/akhir yang mungkin ada noise mic setup)
2. Edit > Remove Special > Trim Audio
3. Target durasi:
   - Menu: 60-80s
   - Wilayah: 60-90s
   - Puskesmas: 90-120s (ruang cukup untuk tidak terasa repetitif)

### Step 4: Seamless loop (crossfade)
1. Copy 2 detik pertama track
2. Paste di akhir
3. Select segmen terakhir (4 detik) → Effect > Fade Out (dari second ke-2)
4. Mix original awal ke akhir dengan Fade In paralel
5. (Alternatif simpel: Effect > Crossfade Clips setelah split jadi 2 region)
6. Preview dengan loop playback (shift+space) — harus smooth tanpa "klik" di seam

### Step 5: Normalize ke -18 LUFS
1. Effect > Loudness Normalization
2. Normalize to: **-18 LUFS** (integrated)
3. True peak limiting: ON, target -1 dBTP
4. Apply

Kenapa -18 LUFS: standar broadcast untuk konten yang tidak melelahkan, match DeepThink recommendation.

### Step 6: Export ke `.ogg` (primary) + `.mp3` (fallback)

**OGG (utama, lebih kecil, gapless loop):**
1. File > Export > Export as OGG
2. Quality: **5** (~128 kbps)
3. Target filename — lihat tabel bawah

**MP3 (fallback Safari lama):**
1. File > Export > Export as MP3
2. Bit Rate: **128 kbps** constant
3. Mode: Stereo (atau Joint Stereo untuk size lebih kecil)

### Step 7: Rename + place di `public/audio/`

| Source | OGG filename | MP3 filename |
|---|---|---|
| felix.blume/674665 | `menu.ogg` | `menu.mp3` |
| Vrymaa/805467 | `wilayah.ogg` | `wilayah.mp3` |
| richwise/456207 | `puskesmas.ogg` | `puskesmas.mp3` |

Target path: `D:\Dev\PRIMER\public\audio\menu.ogg` dst.

Expected total size akhir (setelah normalize + 128kbps encode):
- menu.ogg ≈ 1.0-1.5 MB
- wilayah.ogg ≈ 0.9-1.3 MB
- puskesmas.ogg ≈ 1.5-2.0 MB
- (MP3 fallback serupa)
- **Total ≈ 7-10 MB** ✅ under DeepThink 20 MB budget

---

## 🧩 Code Patch — Aktifkan BGM setelah files terpasang

Setelah 6 file (.ogg + .mp3) berada di `public/audio/`, edit `src/utils/SoundManager.js`:

```diff
-    // BGM tracks — cleared 2026-04-24 after legal audit.
-    // Previously held 7 copyrighted Square Enix tracks (FF8/Chrono Cross).
-    // Pending royalty-free replacement per docs/AUDIO_DESIGN.md:
-    //   target 3-4 CC0 ambient soundscape (Freesound.org) — not melody.
-    bgmTracks = [];
+    // BGM tracks — CC0 ambient soundscape from Freesound.org.
+    // Howler accepts array: tries .ogg first (smaller, gapless), falls
+    // back to .mp3 if browser doesn't support. See AUDIO_SOURCING.md.
+    bgmTracks = [
+        ['/audio/menu.ogg', '/audio/menu.mp3'],         // felix.blume/674665
+        ['/audio/wilayah.ogg', '/audio/wilayah.mp3'],   // Vrymaa/805467
+        ['/audio/puskesmas.ogg', '/audio/puskesmas.mp3'], // richwise/456207
+    ];
```

**Catatan**: BGM playback sudah pakai Howler.js (commit pasca-Phase 3). Howler otomatis handle:
- Multi-format fallback (OGG primary, MP3 fallback Safari lama)
- Autoplay policy + iOS audio unlock
- HTML5 streaming (large files tidak dibuffer ke RAM — anti-OOM)
- Smooth `fade()` untuk crossfade & Respectful Silence

**Future iteration**: refactor `playBGM(day)` → `playBGM({ location: 'puskesmas' })` untuk context-aware BGM selection (Phase 3+ di [AUDIO_DESIGN.md](./AUDIO_DESIGN.md)).

---

## ✅ Verification Checklist

Setelah install:

- [ ] `public/audio/menu.mp3` ada dan <2 MB
- [ ] `public/audio/wilayah.mp3` ada dan <2 MB
- [ ] `public/audio/puskesmas.mp3` ada dan <3 MB
- [ ] `npm run build` sukses (check `dist/audio/*.mp3` ter-copy)
- [ ] `npm run dev` → buka game, settings modal → Master slider kerja
- [ ] Masuk ke scene (dashboard / wilayah / rumah dinas) → ada BGM terdengar
- [ ] BGM tidak "klik" di loop seam (listen 2 menit penuh)
- [ ] Focus Mode toggle → BGM senyap, SFX tetap bunyi
- [ ] Total audio bundle size di `dist/audio/` <10 MB

---

## 🪪 Licensing & Credits

### Tidak butuh Credits screen (kalau hanya pakai CC0 yang di-curate di atas)
CC0 = public domain = tidak wajib attribution. Game boleh ship tanpa modal credits.

### Kalau user pilih mix dengan CC-BY (attribution required)
Misal kalau nanti mau pakai suling Bali [RTB45/203363](https://freesound.org/people/RTB45/sounds/203363/) (CC-BY 4.0):

Tambahkan `docs/CREDITS.md` atau Credits screen di game berisi:
```
Audio Credits
─────────────
"Suling Flute - Bali" by RTB45
Source: https://freesound.org/people/RTB45/sounds/203363/
License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
```

**Rekomendasi saat ini**: stick with CC0 untuk MVP Juni 2026. Tambah CC-BY + Credits UI di V2.

---

## 🔄 Fallback & Alternatif

### Kalau track primary tidak memuaskan saat audition

| Scene | Primary | Fallback Strategy |
|---|---|---|
| Menu | felix.blume/674665 | Pakai kyles/413849 (Peru, lebih besar tapi 96kHz kualitas) |
| Wilayah | Vrymaa/805467 | Pakai florianreichelt/447810 (India wheat field) |
| Puskesmas | richwise/456207 | Cari manual di [Freesound office tag CC0](https://freesound.org/search/?q=office+hum&f=license%3A%22Creative+Commons+0%22) |

### Sumber royalty-free lain kalau Freesound tidak cukup

1. **[Pixabay Music](https://pixabay.com/music/)** — CC0, tanpa attribution. Search: "tropical ambient", "village morning"
2. **[YouTube Audio Library](https://studio.youtube.com/channel/UC/music)** — Royalty-free, no attribution
3. **[Kevin MacLeod / Incompetech](https://incompetech.com/music/royalty-free/)** — CC-BY, wajib credit
4. **[OpenGameArt.org](https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=13)** — bervariasi, cek license per-track

### AVOID
- ❌ Suno / Udio (ToS commercial berubah-ubah)
- ❌ Rip YouTube tanpa verify creator license
- ❌ Gamelan spesifik Bali/Jawa untuk scene generic (appropriation risk)
- ❌ Track CC-BY-NC (non-commercial only — risiko untuk rilis institusional)

---

## 🔗 Related Docs

- [AUDIO_DESIGN.md](./AUDIO_DESIGN.md) — konsep + palette + phases
- [AUDIO_DOSSIER.md](./AUDIO_DOSSIER.md) — dossier lengkap + DeepThink review
- [SoundManager.js](../src/utils/SoundManager.js) — implementation

---

## 📝 Audit Trail

- **2026-04-24**: Curated by AG via Freesound.org WebFetch verification. All 3 primary tracks CC0-confirmed via direct sound page fetch.
- Track metadata captured: license, duration, format, file size, sample rate, tags, description, loopability notes.
- 2 alternative per scene documented for fallback.
