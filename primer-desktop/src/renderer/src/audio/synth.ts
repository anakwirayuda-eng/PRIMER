/**
 * SYNTH — mesin suara FM WebAudio TANPA aset.
 * Semua bunyi disintesis saat itu juga: SFX kertas-dan-stempel + BGM ambient
 * slendro sangat pelan. Modul ini murni audio — tidak tahu-menahu soal React
 * maupun GameState; useAudio.ts yang memetakan GameEvent → fungsi di sini.
 *
 * Catatan: Math.random BOLEH di sini (larangan hanya untuk src/engine/**) —
 * variasi nada BGM justru diinginkan non-deterministik.
 */

import { getPengaturan, subscribePengaturan } from '../settings'

const KUNCI_MUTE = 'primer.audio.mute'
const VOLUME_MASTER = 0.4

/** Tangga nada slendro (aproksimasi 5 nada per oktaf, ±240 sen per langkah). */
const SLENDRO: readonly number[] = [261.63, 300.53, 345.19, 396.49, 455.4]

function nadaSlendro(indeks: number): number {
  const oktaf = Math.floor(indeks / SLENDRO.length)
  const nada = SLENDRO[((indeks % SLENDRO.length) + SLENDRO.length) % SLENDRO.length] ?? 261.63
  return nada * Math.pow(2, oktaf)
}

/* ---------------------------------------------------------------------------
 * State modul (singleton — satu AudioContext untuk seluruh aplikasi)
 * ------------------------------------------------------------------------- */

interface MesinAudio {
  ctx: AudioContext
  master: GainNode
  bufferNoise: AudioBuffer
}

let mesin: MesinAudio | null = null
let muted = bacaMuteTersimpan()
const pendengarMute = new Set<() => void>()

/** Target gain master SFX = 0 saat mute, else VOLUME_MASTER × volume pemain. */
function gainSfxTarget(): number {
  return muted ? 0 : VOLUME_MASTER * getPengaturan().volumeSfx
}

// Volume SFX ikut Pengaturan secara live.
subscribePengaturan(() => {
  if (!mesin) return
  const t = mesin.ctx.currentTime
  mesin.master.gain.cancelScheduledValues(t)
  mesin.master.gain.setTargetAtTime(gainSfxTarget(), t, 0.04)
})

function bacaMuteTersimpan(): boolean {
  try {
    return window.localStorage.getItem(KUNCI_MUTE) === '1'
  } catch {
    return false
  }
}

function simpanMute(nilai: boolean): void {
  try {
    window.localStorage.setItem(KUNCI_MUTE, nilai ? '1' : '0')
  } catch {
    /* penyimpanan tidak tersedia — mute tetap berlaku untuk sesi ini */
  }
}

/* ---------------------------------------------------------------------------
 * Inisialisasi & siklus hidup
 * ------------------------------------------------------------------------- */

/**
 * Buat AudioContext + rantai gain. Idempoten — panggil sebebasnya; hanya
 * gesture pertama yang benar-benar membangun mesin (kebijakan autoplay).
 */
export function initAudio(): void {
  if (mesin) {
    // Konteks bisa tertidur (suspend) di beberapa platform — bangunkan.
    if (mesin.ctx.state === 'suspended') void mesin.ctx.resume()
    return
  }

  const Ctx = window.AudioContext
  if (!Ctx) return // lingkungan tanpa WebAudio — game tetap jalan, hening
  const ctx = new Ctx()

  const master = ctx.createGain()
  master.gain.value = gainSfxTarget()
  master.connect(ctx.destination)

  // Buffer derau putih 0,5 dtk — dipakai berulang untuk burst stempel/kokok.
  const bufferNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate)
  const data = bufferNoise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  mesin = { ctx, master, bufferNoise }
  if (ctx.state === 'suspended') void ctx.resume()
  // Catatan: BGM ambient synth lama DIMATIKAN sejak M7 — musik latar kini
  // dari berkas (audio/bgm.ts). Fungsi jadwalkanBgm dipertahankan sbg cadangan.
}

/** Matikan seluruh mesin audio dengan rapi (dipanggil saat App di-unmount). */
export function disposeAudio(): void {
  if (!mesin) return
  try {
    mesin.master.disconnect()
  } catch {
    /* sudah terputus — tidak apa-apa */
  }
  void mesin.ctx.close().catch(() => undefined)
  mesin = null
}

/* ---------------------------------------------------------------------------
 * Mute (persist localStorage) — MuteButton berlangganan lewat subscribeMute
 * ------------------------------------------------------------------------- */

export function isMuted(): boolean {
  return muted
}

export function setMuted(nilai: boolean): void {
  if (muted === nilai) return
  muted = nilai
  simpanMute(nilai)
  if (mesin) {
    const t = mesin.ctx.currentTime
    mesin.master.gain.cancelScheduledValues(t)
    mesin.master.gain.setTargetAtTime(gainSfxTarget(), t, 0.04)
  }
  pendengarMute.forEach((fn) => fn())
}

export function toggleMute(): boolean {
  setMuted(!muted)
  return muted
}

/** Berlangganan perubahan mute — kompatibel dengan useSyncExternalStore. */
export function subscribeMute(fn: () => void): () => void {
  pendengarMute.add(fn)
  return () => {
    pendengarMute.delete(fn)
  }
}

/* ---------------------------------------------------------------------------
 * Blok bangunan sintesis
 * ------------------------------------------------------------------------- */

interface OpsiSuaraFm {
  /** Frekuensi carrier (Hz). */
  freq: number
  /** Durasi total nada (detik). */
  durasi: number
  /** Puncak amplitudo relatif terhadap bus tujuan (0-1). */
  gain: number
  /** Rasio frekuensi modulator : carrier (default 2 — timbre kayu lembut). */
  ratio?: number
  /** Indeks modulasi (kedalaman FM, dalam kelipatan freq; default 1.5). */
  index?: number
  /** Waktu serang/attack (detik, default 0.005 — perkusi). */
  attack?: number
  /** Jeda mulai relatif dari sekarang (detik). */
  delay?: number
  /** Bentuk gelombang carrier (default 'sine'). */
  bentuk?: OscillatorType
  /** Bus tujuan (default master — SFX; BGM memakai busBgm). */
  tujuan?: AudioNode
}

/** Satu suara FM 2-operator: modulator → frekuensi carrier → envelope → bus. */
function suaraFm(opsi: OpsiSuaraFm): void {
  if (!mesin) return
  const { ctx } = mesin
  const mulai = ctx.currentTime + (opsi.delay ?? 0)
  const selesai = mulai + opsi.durasi
  const ratio = opsi.ratio ?? 2
  const index = opsi.index ?? 1.5
  const attack = Math.min(opsi.attack ?? 0.005, opsi.durasi * 0.5)

  const carrier = ctx.createOscillator()
  carrier.type = opsi.bentuk ?? 'sine'
  carrier.frequency.value = opsi.freq

  const modulator = ctx.createOscillator()
  modulator.type = 'sine'
  modulator.frequency.value = opsi.freq * ratio

  const kedalaman = ctx.createGain()
  kedalaman.gain.setValueAtTime(opsi.freq * index, mulai)
  // Indeks modulasi ikut meluruh — timbre melembut seperti bilah gamelan.
  kedalaman.gain.exponentialRampToValueAtTime(Math.max(1, opsi.freq * index * 0.15), selesai)

  const envelope = ctx.createGain()
  envelope.gain.setValueAtTime(0.0001, mulai)
  envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, opsi.gain), mulai + attack)
  envelope.gain.exponentialRampToValueAtTime(0.0001, selesai)

  modulator.connect(kedalaman)
  kedalaman.connect(carrier.frequency)
  carrier.connect(envelope)
  envelope.connect(opsi.tujuan ?? mesin.master)

  carrier.start(mulai)
  modulator.start(mulai)
  carrier.stop(selesai + 0.02)
  modulator.stop(selesai + 0.02)
  carrier.onended = () => {
    carrier.disconnect()
    modulator.disconnect()
    kedalaman.disconnect()
    envelope.disconnect()
  }
}

/** Burst derau ber-filter — tekstur kertas/stempel/kepak. */
function burstNoise(durasi: number, gain: number, freqFilter: number, delay = 0): void {
  if (!mesin) return
  const { ctx } = mesin
  const mulai = ctx.currentTime + delay

  const sumber = ctx.createBufferSource()
  sumber.buffer = mesin.bufferNoise

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freqFilter
  filter.Q.value = 0.9

  const envelope = ctx.createGain()
  envelope.gain.setValueAtTime(gain, mulai)
  envelope.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi)

  sumber.connect(filter)
  filter.connect(envelope)
  envelope.connect(mesin.master)

  sumber.start(mulai)
  sumber.stop(mulai + durasi + 0.02)
  sumber.onended = () => {
    sumber.disconnect()
    filter.disconnect()
    envelope.disconnect()
  }
}

/** Sapuan frekuensi satu osilator (untuk kokok-ish pagi). */
function sapuan(dari: number, ke: number, durasi: number, gain: number, delay = 0): void {
  if (!mesin) return
  const { ctx } = mesin
  const mulai = ctx.currentTime + delay
  const selesai = mulai + durasi

  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(dari, mulai)
  osc.frequency.exponentialRampToValueAtTime(ke, selesai)

  const envelope = ctx.createGain()
  envelope.gain.setValueAtTime(0.0001, mulai)
  envelope.gain.exponentialRampToValueAtTime(gain, mulai + durasi * 0.2)
  envelope.gain.exponentialRampToValueAtTime(0.0001, selesai)

  osc.connect(envelope)
  envelope.connect(mesin.master)
  osc.start(mulai)
  osc.stop(selesai + 0.02)
  osc.onended = () => {
    osc.disconnect()
    envelope.disconnect()
  }
}

/** SFX di-skip total saat mute — hemat node, bukan sekadar gain 0. */
function siapBunyi(): boolean {
  return mesin !== null && !muted
}

/* ---------------------------------------------------------------------------
 * SFX per peristiwa (dipanggil useAudio berdasar GameEvent)
 * ------------------------------------------------------------------------- */

/** Stempel jatuh ke kertas: thunk rendah + derau kertas singkat. */
export function sfxStempel(): void {
  if (!siapBunyi()) return
  suaraFm({ freq: 82, durasi: 0.16, gain: 0.85, ratio: 1, index: 2.2, attack: 0.002 })
  burstNoise(0.07, 0.22, 1400)
}

/** Blip bicara lembut (pasien menjawab / warga bicara). */
export function sfxBlip(): void {
  if (!siapBunyi()) return
  const nada = nadaSlendro(2 + Math.floor(Math.random() * 3))
  suaraFm({ freq: nada, durasi: 0.09, gain: 0.18, ratio: 2, index: 1.2 })
}

/** Bel kecil meja resepsionis — surat masuk. */
export function sfxBel(): void {
  if (!siapBunyi()) return
  suaraFm({ freq: 1244, durasi: 0.7, gain: 0.22, ratio: 3.53, index: 3, attack: 0.002 })
  suaraFm({ freq: 1244 * 1.006, durasi: 0.55, gain: 0.1, ratio: 3.53, index: 2.5, attack: 0.002 })
}

/** Buzzer minor — firewall alergi, karma terjadi, diusir warga. */
export function sfxBuzzer(): void {
  if (!siapBunyi()) return
  suaraFm({ freq: 196, durasi: 0.34, gain: 0.28, ratio: 1, index: 4, bentuk: 'square', attack: 0.004 })
  // Sekon minor di atasnya — disonansi yang jelas "ada yang salah".
  suaraFm({ freq: 207.65, durasi: 0.34, gain: 0.2, ratio: 1, index: 4, bentuk: 'square', attack: 0.004 })
}

/** Arpeggio pentatonik naik — karma dicegah / encounter grade A. */
export function sfxArpeggio(): void {
  if (!siapBunyi()) return
  for (let i = 0; i < 5; i++) {
    suaraFm({
      freq: nadaSlendro(i + 2),
      durasi: 0.32,
      gain: 0.24,
      ratio: 2,
      index: 1.8,
      delay: i * 0.09
    })
  }
}

/** Fajar: sapuan kokok-ish + tiga nada pagi slendro. */
export function sfxPagi(): void {
  if (!siapBunyi()) return
  sapuan(320, 940, 0.4, 0.16)
  burstNoise(0.18, 0.08, 2600, 0.05)
  const pagi = [0, 2, 4] as const
  pagi.forEach((langkah, i) => {
    suaraFm({
      freq: nadaSlendro(langkah + 5),
      durasi: 0.5,
      gain: 0.2,
      ratio: 2,
      index: 1.5,
      attack: 0.01,
      delay: 0.55 + i * 0.22
    })
  })
}

/** Penutup encounter non-A — dua nada turun netral, "kasus ditutup". */
export function sfxSelesai(): void {
  if (!siapBunyi()) return
  suaraFm({ freq: nadaSlendro(4), durasi: 0.28, gain: 0.2, ratio: 2, index: 1.5 })
  suaraFm({ freq: nadaSlendro(2), durasi: 0.36, gain: 0.2, ratio: 2, index: 1.5, delay: 0.14 })
}
