/**
 * DECK ANAMNESIS — kartu pertanyaan per kategori + gauge SABAR pasien.
 * Pertanyaan yang sudah ditanya tercatat di lembar; jawaban terakhir muncul
 * sebagai balon bicara (termasuk jawaban ketus saat sabar habis).
 */

import { useEffect, useMemo, useRef } from 'react'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import type { GameEvent } from '@engine/events'
import type { KasusKlinis, KategoriAnamnesis, PertanyaanAnamnesis } from '@content/types'
import { LABEL_KATEGORI, URUTAN_KATEGORI } from './util'
import { ANAMNESIS_PERTAMA_TUTORIAL } from './tutorialKlinik'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  lastEvents: GameEvent[]
  eventTick: number
  /** DeepThink "onboarding railroaded" (keputusan user). */
  tutorialAktif?: boolean
}

export function DeckAnamnesis({ enc, kasus, dispatch, lastEvents, eventTick, tutorialAktif = false }: Props) {
  // Sorotan: pertanyaan pertama sampai ≥1 ditanya, lalu "Selesai Anamnesis".
  const sorotPertanyaan = tutorialAktif && enc.ditanya.length === 0 ? ANAMNESIS_PERTAMA_TUTORIAL : null
  const sorotSelesai = tutorialAktif && enc.ditanya.length > 0
  const perKategori = useMemo(() => {
    const peta = new Map<KategoriAnamnesis, PertanyaanAnamnesis[]>()
    for (const kat of URUTAN_KATEGORI) peta.set(kat, [])
    for (const q of kasus.anamnesis) {
      // M10 Batch-2 (CODEX C.6): pertanyaan spesifik-gender (mis. riwayat haid)
      // disembunyikan bila tak cocok jenis kelamin pasien — skor anamnesis
      // (clinic.ts) mengecualikannya dari denominator dgn aturan yang sama.
      if (q.hanyaUntuk !== undefined && q.hanyaUntuk !== enc.pasien.jenisKelamin) continue
      const daftar = peta.get(q.kategori)
      if (daftar) daftar.push(q)
      else peta.set(q.kategori, [q])
    }
    return peta
  }, [kasus, enc.pasien.jenisKelamin])
  const pembukaTerjawab = (perKategori.get('keluhan_utama') ?? []).some((q) =>
    enc.ditanya.includes(q.id),
  )
  const rps = perKategori.get('rps') ?? []
  const rpsTerjawab = rps.length === 0 || rps.some((q) => enc.ditanya.includes(q.id))
  const rpsPembuka = rps[0]
  const rpsPembukaTerjawab = !rpsPembuka || enc.ditanya.includes(rpsPembuka.id)

  let jawabanTerakhir: { teks: string; olehPendamping: boolean } | null = null
  for (const e of lastEvents) {
    if (e.type === 'PASIEN_MENJAWAB') {
      jawabanTerakhir = { teks: e.teks, olehPendamping: e.olehPendamping === true }
    }
  }

  // M10 Batch-2 (CODEX A.1): setelah pertanyaan diklik, tombolnya jadi
  // disabled → fokus keyboard JATUH ke <body> (hilang dari alur). Pindahkan
  // fokus ke balon jawaban (tabIndex -1) — pembaca layar membacakan jawaban
  // (aria-live) dan Tab berikutnya lanjut dari posisi logis, bukan dari nol.
  const balonRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // preventScroll (sapuan 2026-07-16): balon kini sticky di atas panel —
    // focus() default men-scroll panel melompat ke atas tiap klik pertanyaan.
    if (jawabanTerakhir !== null) balonRef.current?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTick])

  const sabar = enc.sabar
  const kelasSabar =
    sabar < 30 ? ' meter__isi--bahaya' : sabar < 60 ? ' meter__isi--waspada' : ''
  const pasienLelah = enc.ditanya.length >= 8

  return (
    <>
      <div className="klinik-deck__isi">
        {/* Sticky (sapuan 2026-07-16): gauge Sabar + balon jawaban menempel di
            atas panel scroll — konteks percakapan tak hilang saat daftar
            pertanyaan panjang di-scroll. */}
        <div className="klinik-anamnesis-atas">
          {/* Gauge sabar */}
          <div className="klinik-sabar">
            <div className="baris baris--antara">
              <span className="judul-seksi klinik-sabar__judul">Sabar Pasien</span>
              <span className="mono teks-xs teks-lembut">{sabar}/100</span>
            </div>
            <div className="meter">
              <div className={`meter__isi${kelasSabar}`} style={{ width: `${sabar}%` }} />
            </div>
            {pasienLelah && (
              <div className="klinik-lelah">
                Pasien mulai lelah ditanya-tanya &mdash; tiap pertanyaan tambahan menggerus sabarnya.
              </div>
            )}
          </div>

          {/* Balon jawaban terakhir — live region + target fokus pasca-klik (A.1) */}
          {jawabanTerakhir !== null && (
            <div key={eventTick} ref={balonRef} className="klinik-balon" role="status" aria-live="polite" tabIndex={-1}>
              {jawabanTerakhir.olehPendamping && (
                <span className="teks-xs teks-lembut">Pendamping: </span>
              )}
              &ldquo;{jawabanTerakhir.teks}&rdquo;
            </div>
          )}
        </div>

        {/* Kartu pertanyaan per kategori */}
        {URUTAN_KATEGORI.map((kat) => {
          const daftar = perKategori.get(kat) ?? []
          // Mulai dari keluhan utama agar pertanyaan fokus tidak memberi tahu
          // diagnosis sebelum pemain mendengar cerita pembuka pasien.
          if (daftar.length === 0 || (kat !== 'keluhan_utama' && !pembukaTerjawab)) return null
          // Riwayat latar baru dibuka setelah dokter menindaklanjuti cerita kini.
          // Ini menjaga percakapan mengalir KU → RPS → riwayat/latar tanpa
          // memaksa satu graf prasyarat besar untuk ratusan kasus.
          if ((kat === 'rpd' || kat === 'rpk' || kat === 'sosial') && !rpsTerjawab) return null
          const daftarTerbuka = daftar.filter((q) => {
            if (!(q.bukaSetelah?.every((id) => enc.ditanya.includes(id)) ?? true)) return false
            // Light-plus sequencing: satu pertanyaan RPS pertama menjadi
            // jembatan setelah pembuka. Sesudah dijawab, seluruh RPS relevan
            // terbuka. Ini mencegah panel langsung terasa seperti checklist
            // acak tanpa membangun graf prasyarat per kasus.
            if (kat === 'rps' && !rpsPembukaTerjawab) return q.id === rpsPembuka?.id
            return true
          })
          if (daftarTerbuka.length === 0) return null
          return (
            <div key={kat} className="klinik-deck__grup">
              <div className="judul-seksi">{LABEL_KATEGORI[kat]}</div>
              {daftarTerbuka.map((q) => {
                const sudah = enc.ditanya.includes(q.id)
                const disorot = sorotPertanyaan === q.id
                // M9.1: dulu `sorotPertanyaan !== null && !disorot` — begitu
                // pertanyaan pertama ditanya, sorotPertanyaan jadi null &
                // "!disorot" jadi vakum-benar utk SEMUA pertanyaan lain,
                // jadi kebuka semua (bukan cuma "Selesai" yg menyala).
                // Terkunci KECUALI ini persis pertanyaan yg disorot.
                const dikunci = tutorialAktif && !disorot
                return (
                  <button
                    key={q.id}
                    className={`klinik-tanya${sudah ? ' klinik-tanya--sudah' : ''}${disorot ? ' klinik-sorot-tutorial' : ''}`}
                    onClick={() => dispatch({ type: 'TANYA', pertanyaanId: q.id })}
                    disabled={sudah || dikunci}
                    title={sudah ? 'Sudah ditanyakan — jawabannya tercatat di lembar.' : undefined}
                  >
                    <span>{q.tanya}</span>
                    {sudah && <span className="klinik-tanya__cek">&#10003;</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      <footer className="klinik-deck__footer">
        <button
          className={`tombol tombol--utama tombol--besar${sorotSelesai ? ' klinik-sorot-tutorial' : ''}`}
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
          disabled={tutorialAktif && !sorotSelesai}
        >
          Selesai Anamnesis &mdash; ke Pemeriksaan &rarr;
        </button>
        <span className="teks-xs teks-lembut">
          Fase tidak bisa diulang. Pastikan riwayat yang penting sudah kamu gali.
        </span>
      </footer>
    </>
  )
}
