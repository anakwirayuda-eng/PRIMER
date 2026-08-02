/**
 * AMBIENT — musik latar GENERATIF berbasis laras gamelan, tanpa satu berkas pun.
 *
 * Kenapa disintesis, bukan memakai berkas musik:
 *  1. Riwayat proyek ini: 7 track OST Square Enix pernah dipakai lalu HARUS
 *     dihapus (lihat scripts/check-bgm-license.js). Musik yang dibangkitkan
 *     kode bebas lisensi secara konstruksi — tak ada yang bisa dicabut.
 *  2. Nol byte tambahan pada installer yang sudah ~103 MB.
 *  3. Tak pernah berulang persis: tak ada loop 2 menit yang terasa menjemukan
 *     setelah stase 90 hari.
 *  4. Bisa berubah menurut konteks (pagi/siang/sore/IGD) tanpa menyimpan
 *     enam berkas berbeda.
 *
 * Prinsip desainnya: ini LATAR, bukan pertunjukan. Pemain sedang membaca
 * vignette klinis dan menimbang keputusan — musik yang menuntut perhatian
 * adalah beban kognitif, bukan hadiah. Karena itu: sangat pelan, tempo sangat
 * lambat, tanpa perkusi tegas, tanpa perubahan mendadak, dan register tengah
 * (menghindari frekuensi tinggi yang melelahkan di sesi panjang).
 *
 * Catatan budaya: laras di sini adalah APROKSIMASI yang terinspirasi gamelan,
 * bukan tiruan gamelan sungguhan maupun kutipan gending/repertoar tertentu.
 * Tak ada komposisi tradisional yang disalin; yang dipinjam hanya sifat tangga
 * nada dan tekstur "ombak" dua bilah yang ditala berdekatan. Konteks
 * pemakaiannya sekuler (perangkat lunak pendidikan), bukan upacara.
 */

import { getPengaturan } from '../settings'

/* ---------------------------------------------------------------------------
 * Laras
 * ------------------------------------------------------------------------- */

/**
 * Laras SLENDRO — lima nada per oktaf berjarak nyaris rata (~240 sen).
 * Nilai sen di bawah adalah aproksimasi umum; gamelan sungguhan tidak punya
 * tala baku (tiap perangkat ditala sendiri — "embat"), jadi angka pasti
 * memang tidak ada, dan sedikit ketidakrataan justru wajar.
 */
const SEN_SLENDRO: readonly number[] = [0, 231, 474, 717, 955]

/**
 * Laras PELOG — tujuh nada dgn jarak TIDAK rata; terdengar lebih khidmat/berat.
 * Dipakai untuk konteks yang lebih serius (IGD, laporan akhir).
 */
const SEN_PELOG: readonly number[] = [0, 120, 258, 539, 675, 785, 943]

/** Frekuensi dasar (Hz) — register tengah, sengaja rendah supaya tidak menusuk. */
const DASAR = 174.61

function dariSen(sen: number, oktaf: number): number {
  return DASAR * Math.pow(2, sen / 1200 + oktaf)
}

export type Laras = 'slendro' | 'pelog'

function nada(laras: Laras, indeks: number): number {
  const tabel = laras === 'pelog' ? SEN_PELOG : SEN_SLENDRO
  const n = tabel.length
  const oktaf = Math.floor(indeks / n)
  const sen = tabel[((indeks % n) + n) % n] ?? 0
  return dariSen(sen, oktaf)
}

/* ---------------------------------------------------------------------------
 * Watak per konteks
 * ------------------------------------------------------------------------- */

export type KonteksAmbient = 'title' | 'pagi' | 'siang' | 'sore' | 'igd' | 'laporan'

interface Watak {
  laras: Laras
  /** Rata-rata jeda antar-nada (detik) — makin besar makin lapang. */
  jeda: number
  /** Rentang indeks nada yang boleh dipakai (register). */
  rentang: readonly [number, number]
  /** Gain relatif konteks ini (0-1) terhadap plafon ambient. */
  gain: number
  /** Frekuensi cutoff lowpass (Hz) — makin rendah makin teredam/jauh. */
  cutoff: number
  /** Sertakan drone rendah berkelanjutan? */
  drone: boolean
}

const WATAK: Record<KonteksAmbient, Watak> = {
  // Layar judul: lapang & mengundang, sedikit lebih hadir dari yang lain.
  title: { laras: 'slendro', jeda: 3.6, rentang: [2, 9], gain: 1, cutoff: 1800, drone: true },
  // Pagi di poli: paling terang & paling sering muncul — dibuat paling tipis
  // supaya tidak melelahkan sepanjang blok terpanjang permainan.
  pagi: { laras: 'slendro', jeda: 5.0, rentang: [4, 11], gain: 0.7, cutoff: 2200, drone: false },
  // Siang di lapangan: lebih hangat & lebih rendah.
  siang: { laras: 'slendro', jeda: 4.4, rentang: [2, 8], gain: 0.8, cutoff: 1600, drone: true },
  // Sore/meja kerja: paling tenang, mengendap.
  sore: { laras: 'pelog', jeda: 6.0, rentang: [0, 7], gain: 0.75, cutoff: 1200, drone: true },
  // IGD: pelog register rendah + drone — tegang tanpa menjadi musik aksi.
  // Sengaja TIDAK dipercepat: kegentingan datang dari isi kasus, bukan tempo.
  igd: { laras: 'pelog', jeda: 5.5, rentang: [0, 5], gain: 0.85, cutoff: 900, drone: true },
  // Laporan akhir: khidmat, register lebih luas untuk rasa penutup.
  laporan: { laras: 'pelog', jeda: 4.8, rentang: [1, 9], gain: 0.9, cutoff: 1500, drone: true },
}

/**
 * Plafon ambient. Musik latar dijaga JAUH di bawah SFX: di lab komputer 30-50
 * mesin tanpa jaminan headphone, musik yang terdengar jelas dari kursi sebelah
 * adalah gangguan, bukan suasana.
 */
const PLAFON_AMBIENT = 0.055
/**
 * "Ombak" — pasangan bilah gamelan sengaja ditala berbeda tipis sehingga
 * bunyinya berdenyut pelan. Ditulis sebagai selisih Hz TETAP, BUKAN sen.
 * Riset 2026-08-02: detune dalam sen membuat laju denyut naik sebanding
 * pitch (7 sen = 0,45 Hz di 110 Hz tapi 3,6 Hz di 880 Hz) — di register atas
 * berubah dari "ombak" jadi flutter yang menjengkelkan setelah sejam.
 * Selisih tetap menjaga denyut ~0,4 Hz di seluruh register.
 */
const OMBAK_HZ = 0.4
const FADE_DETIK = 2.5

/* ---------------------------------------------------------------------------
 * Mesin
 * ------------------------------------------------------------------------- */

interface MesinAmbient {
  ctx: AudioContext
  bus: GainNode
  filter: BiquadFilterNode
  /** Rantai pelindung telinga — lihat pasangRantai(). */
  pelindung: AudioNode
  timer: number | null
  droneOsc: OscillatorNode[]
  droneGain: GainNode | null
  konteks: KonteksAmbient
}

let mesin: MesinAmbient | null = null
let dibisukan = false

function gainTarget(): number {
  const p = getPengaturan()
  if (dibisukan || !mesin || !p.musikAktif) return 0
  return PLAFON_AMBIENT * p.volumeMusik * WATAK[mesin.konteks].gain
}

/** Perbarui volume live (slider Pengaturan / tombol bisu) tanpa memulai ulang. */
export function sinkronVolumeAmbient(mutedBaru?: boolean): void {
  if (typeof mutedBaru === 'boolean') dibisukan = mutedBaru
  if (!mesin) return
  const t = mesin.ctx.currentTime
  // cancelAndHoldAtTime (bukan cancelScheduledValues): menahan nilai kurva yang
  // sedang berjalan, sehingga menggeser slider di tengah fade tak terdengar
  // melompat. Didukung Chromium di Electron 43.
  if (typeof mesin.bus.gain.cancelAndHoldAtTime === 'function') mesin.bus.gain.cancelAndHoldAtTime(t)
  else mesin.bus.gain.cancelScheduledValues(t)
  mesin.bus.gain.setTargetAtTime(gainTarget(), t, 0.5)
}

/**
 * Jendela tersembunyi → bisukan lalu tidurkan konteks. Electron mencekik timer
 * di latar (backgroundThrottling), yang membuat penjadwal nada tersendat dan
 * musik jadi tersentak-sentak saat pengguna kembali. Lebih baik hening.
 */
let visibilitasTerpasang = false
function pasangVisibilitas(): void {
  if (visibilitasTerpasang) return
  visibilitasTerpasang = true
  document.addEventListener('visibilitychange', () => {
    if (!mesin) return
    if (document.hidden) {
      const t = mesin.ctx.currentTime
      mesin.bus.gain.setTargetAtTime(0.0001, t, 0.4)
    } else {
      sinkronVolumeAmbient()
    }
  })
}

/** Satu nada "bilah": dua osilator ditala beda tipis → berdenyut pelan. */
function bunyikanBilah(freq: number, gain: number): void {
  if (!mesin) return
  const { ctx, filter } = mesin
  const mulai = ctx.currentTime + 0.02
  // Attack & release SANGAT panjang (riset 2026-08-02: 6-12 dtk attack,
  // 12-25 dtk release). Nada yang "muncul" alih-alih "dipukul" tak pernah
  // menarik perhatian — syarat mutlak musik latar untuk tugas membaca.
  const attack = 7
  const durasi = 26

  for (const arah of [-1, 1]) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq + (arah * OMBAK_HZ) / 2

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, mulai)
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), mulai + attack)
    env.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi)

    osc.connect(env)
    env.connect(filter)
    osc.start(mulai)
    osc.stop(mulai + durasi + 0.05)
    osc.onended = () => {
      osc.disconnect()
      env.disconnect()
    }
  }
}

/** Jadwalkan nada berikutnya — jeda acak agar tak pernah terasa metronomik. */
function jadwalkanBerikutnya(): void {
  if (!mesin) return
  const w = WATAK[mesin.konteks]
  const [lo, hi] = w.rentang
  // Jeda 0,7×-1,6× nilai dasar: ritmenya bernapas, bukan berdetak.
  const jedaMs = w.jeda * 1000 * (0.7 + Math.random() * 0.9)
  mesin.timer = window.setTimeout(() => {
    if (!mesin) return
    // Pola sama siapBunyi() di synth.ts: saat mati, LEWATI penjadwalan sama
    // sekali (bukan sekadar gain 0) — hemat CPU di mesin lab.
    const pref = getPengaturan()
    if (!dibisukan && pref.musikAktif && pref.volumeMusik > 0) {
      const indeks = lo + Math.floor(Math.random() * (hi - lo + 1))
      // Nada tinggi dilirihkan — melindungi telinga di sesi panjang.
      const peredam = 1 - ((indeks - lo) / Math.max(1, hi - lo)) * 0.45
      bunyikanBilah(nada(w.laras, indeks), 0.55 * peredam)
      // Sesekali nada kedua berdekatan — tekstur, bukan melodi.
      if (Math.random() < 0.22) {
        const kedua = Math.max(lo, Math.min(hi, indeks - 2))
        window.setTimeout(() => {
          if (mesin) bunyikanBilah(nada(w.laras, kedua), 0.3 * peredam)
        }, 700 + Math.random() * 900)
      }
    }
    jadwalkanBerikutnya()
  }, jedaMs)
}

function pasangDrone(): void {
  if (!mesin) return
  const w = WATAK[mesin.konteks]
  lepasDrone()
  if (!w.drone) return
  const { ctx, filter } = mesin
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + FADE_DETIK)
  g.connect(filter)

  // Dua oktaf bawah + kuint-nya: fondasi tanpa menutupi nada bilah.
  for (const [sen, oktaf] of [[0, -1], [0, -2], [SEN_SLENDRO[3] ?? 717, -2]] as const) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = dariSen(sen, oktaf)
    osc.connect(g)
    osc.start()
    mesin.droneOsc.push(osc)
  }
  mesin.droneGain = g
}

function lepasDrone(): void {
  if (!mesin) return
  for (const osc of mesin.droneOsc) {
    try {
      osc.stop()
      osc.disconnect()
    } catch {
      /* sudah berhenti */
    }
  }
  mesin.droneOsc = []
  if (mesin.droneGain) {
    try {
      mesin.droneGain.disconnect()
    } catch {
      /* sudah terputus */
    }
    mesin.droneGain = null
  }
}

/**
 * Mulai/ganti ambient. Idempoten: memanggil dgn konteks yang sama = no-op,
 * jadi aman dipanggil dari useEffect yang sering berjalan ulang.
 */
export function mulaiAmbient(ctx: AudioContext, konteks: KonteksAmbient): void {
  if (mesin && mesin.konteks === konteks) return

  if (!mesin) {
    const bus = ctx.createGain()
    bus.gain.value = 0.0001

    // Rantai pelindung telinga (riset 2026-08-02). Urutan:
    //   filter (cutoff per-konteks) -> highpass -> highshelf -> lowpass -> bus
    // - highpass 48 Hz: buang rumble tak terdengar yang cuma memakan headroom
    //   dan justru paling merambat lewat meja ke kursi sebelah.
    // - highshelf 3 kHz -10 dB + lowpass 3,5 kHz: meredam pita 2-5 kHz tempat
    //   telinga paling peka. Inilah yang membuat musik bisa berbunyi berjam-jam
    //   tanpa melelahkan. TIDAK memakai ConvolverNode (reverb): komponen
    //   termahal di Web Audio, dan target kami PC lab kampus yang bisa tua.
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 48
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'highshelf'
    shelf.frequency.value = 3000
    shelf.gain.value = -10
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 3500
    lp.Q.value = 0.5

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = WATAK[konteks].cutoff
    filter.Q.value = 0.4

    filter.connect(hp)
    hp.connect(shelf)
    shelf.connect(lp)
    lp.connect(bus)
    bus.connect(ctx.destination)
    mesin = { ctx, bus, filter, pelindung: hp, timer: null, droneOsc: [], droneGain: null, konteks }
    pasangVisibilitas()
    pasangDrone()
    jadwalkanBerikutnya()
  } else {
    mesin.konteks = konteks
    // Transisi lembut: geser cutoff & pasang ulang drone, JANGAN memutus nada
    // yang sedang berbunyi (pergantian blok tak boleh terdengar seperti potongan).
    const t = mesin.ctx.currentTime
    mesin.filter.frequency.cancelScheduledValues(t)
    mesin.filter.frequency.setTargetAtTime(WATAK[konteks].cutoff, t, 1.2)
    pasangDrone()
  }
  sinkronVolumeAmbient()
}

/**
 * Redam ambient sesaat lalu kembali — "musik menahan napas".
 *
 * Dipakai Kode Hitam (pasien meninggal di IGD), konsekuensi terberat di game.
 * Efek ini dulu ada di bgm.ts (duckBgm) tapi menjadi no-op sejak musik berkas
 * dimatikan; kini benar-benar terdengar lagi.
 */
export function redamAmbient(msTurun: number, msTahan: number): void {
  if (!mesin) return
  const t = mesin.ctx.currentTime
  const g = mesin.bus.gain
  g.cancelScheduledValues(t)
  g.setTargetAtTime(0.0001, t, Math.max(0.05, msTurun / 3000))
  window.setTimeout(() => sinkronVolumeAmbient(), msTurun + msTahan)
}

/** Hentikan & bersihkan seluruh node (dipanggil saat App unmount). */
export function hentikanAmbient(): void {
  if (!mesin) return
  if (mesin.timer !== null) window.clearTimeout(mesin.timer)
  lepasDrone()
  try {
    mesin.filter.disconnect()
    mesin.bus.disconnect()
  } catch {
    /* sudah terputus */
  }
  mesin = null
}

/** Untuk uji: apakah ambient sedang berjalan, dan pada konteks apa. */
export function statusAmbient(): { aktif: boolean; konteks: KonteksAmbient | null } {
  return { aktif: mesin !== null, konteks: mesin?.konteks ?? null }
}

/** Dipakai uji parameter — bukan bagian API runtime. */
export const _internal = { WATAK, nada, PLAFON_AMBIENT, SEN_SLENDRO, SEN_PELOG }
