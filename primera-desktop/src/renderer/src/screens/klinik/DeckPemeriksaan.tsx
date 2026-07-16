/**
 * DECK PEMERIKSAAN — tombol ukur vital, figur tubuh klik-regio, dan
 * form laboratorium (biaya membakar kapitasi; sebagian hasil datang besok).
 */

import { useMemo, useRef, useState } from 'react'
import { PACK } from '@content/index'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import { FigurTubuh } from './FigurTubuh'
import {
  cocokLab,
  formatRupiah,
  kelompokLab,
  LABEL_KELOMPOK_LAB,
  LABEL_REGION,
  URUTAN_KELOMPOK_LAB,
  URUTAN_REGION,
  type KelompokLab,
} from './util'
import { REGION_PERTAMA_TUTORIAL } from './tutorialKlinik'

/** Kelompok lab yang DITUTUP pemain — diingat selama sesi (default semua
 * terbuka; beda dari laci obat yang default tertutup krn 128 item). */
const labTutupSesi = new Set<KelompokLab>()

interface Props {
  enc: EncounterState
  dispatch: (action: Action) => void
  /** DeepThink "onboarding railroaded" (keputusan user). */
  tutorialAktif?: boolean
}

export function DeckPemeriksaan({ enc, dispatch, tutorialAktif = false }: Props) {
  // Sorotan: vital dulu, lalu satu regio, lalu "Selesai Pemeriksaan". Lab
  // sengaja TAK disorot & terkunci — kasus tutorial tak butuh lab sama sekali.
  const sorotVital = tutorialAktif && !enc.vitalDiukur
  const sorotRegion = tutorialAktif && enc.vitalDiukur && enc.diperiksa.length === 0
  const sorotSelesai = tutorialAktif && enc.vitalDiukur && enc.diperiksa.length > 0
  // DeepThink (2026-07-04): daftar lab dulu satu-satunya tanpa pencarian di
  // antara 3 daftar pilihan klinik (Obat/Edukasi sudah punya) — pola sama.
  // Sapuan 2026-07-16: ±31 baris datar dipecah per kelompok klinis (chunking).
  const [cariLab, setCariLab] = useState('')
  const cariLabRef = useRef<HTMLInputElement>(null)
  const [, setLabTick] = useState(0)
  const labPerKelompok = useMemo(() => {
    const peta = new Map<KelompokLab, typeof PACK.lab[string][]>()
    for (const kel of URUTAN_KELOMPOK_LAB) peta.set(kel, [])
    for (const item of Object.values(PACK.lab)) peta.get(kelompokLab(item))?.push(item)
    for (const daftar of peta.values()) daftar.sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    return peta
  }, [])
  const kueriLab = cariLab.trim()
  const sedangCariLab = kueriLab.length > 0
  const toggleKelompokLab = (kel: KelompokLab) => {
    if (labTutupSesi.has(kel)) labTutupSesi.delete(kel)
    else labTutupSesi.add(kel)
    setLabTick((n) => n + 1)
  }
  const adaHasilLab = URUTAN_KELOMPOK_LAB.some((kel) =>
    (labPerKelompok.get(kel) ?? []).some((item) => !sedangCariLab || cocokLab(item, kueriLab)),
  )

  return (
    <>
      <div className="klinik-deck__isi">
        {/* Tanda vital */}
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Tanda Vital</div>
          <button
            className={`tombol ${enc.vitalDiukur ? '' : 'tombol--utama'}${sorotVital ? ' klinik-sorot-tutorial' : ''}`}
            onClick={() => dispatch({ type: 'UKUR_VITAL' })}
            disabled={enc.vitalDiukur}
            title={
              enc.vitalDiukur
                ? 'Tanda vital sudah terukur — lihat kolom O di lembar.'
                : 'Ukur TD, nadi, RR, suhu, SpO₂ — angka baru muncul setelah diukur.'
            }
          >
            {enc.vitalDiukur ? '✓ Tanda Vital Terukur' : 'Ukur Tanda Vital'}
          </button>
        </div>

        {/* Figur tubuh + regio */}
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Pemeriksaan Fisik</div>
          <div className="klinik-pf">
            <FigurTubuh
              diperiksa={enc.diperiksa}
              onPeriksa={(region) => dispatch({ type: 'PERIKSA', region })}
              terkunci={
                tutorialAktif
                  ? (region) => !(sorotRegion && region === REGION_PERTAMA_TUTORIAL)
                  : undefined
              }
            />
            <div className="klinik-regio">
              {URUTAN_REGION.map((r) => {
                const sudah = enc.diperiksa.includes(r)
                const disorot = sorotRegion && r === REGION_PERTAMA_TUTORIAL
                // CODEX: dulu cuma `!enc.vitalDiukur` — begitu vital terukur SEMUA
                // chip regio kebuka (bukan hanya regio target), lubang yg sama
                // spt figur tubuh SVG di bawah. Kunci = terkunci KECUALI ini
                // persis regio yang sedang disorot.
                const dikunci = tutorialAktif && !disorot
                return (
                  <button
                    key={r}
                    className={`chip klinik-regio__chip${sudah ? ' klinik-regio__chip--sudah' : ''}${disorot ? ' klinik-sorot-tutorial' : ''}`}
                    onClick={() => dispatch({ type: 'PERIKSA', region: r })}
                    disabled={dikunci}
                    title={sudah ? 'Sudah diperiksa — temuan tercatat di lembar.' : `Periksa ${LABEL_REGION[r]}`}
                  >
                    {sudah ? '✓ ' : ''}
                    {LABEL_REGION[r]}
                  </button>
                )
              })}
            </div>
          </div>
          <span className="teks-xs teks-lembut">
            Klik regio pada figur atau chip di samping. Temuan langsung tercetak di kolom O.
          </span>
        </div>

        {/* Laboratorium */}
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Permintaan Laboratorium</div>
          <input
            ref={cariLabRef}
            className="klinik-cari"
            type="text"
            value={cariLab}
            onChange={(e) => setCariLab(e.target.value)}
            placeholder="Cari pemeriksaan lab&hellip;"
            aria-label="Cari lab"
          />
          {!adaHasilLab && (
            <div className="klinik-lembar__kosong">Tidak ada pemeriksaan lab yang cocok.</div>
          )}
          {URUTAN_KELOMPOK_LAB.map((kel) => {
            const semua = labPerKelompok.get(kel) ?? []
            if (semua.length === 0) return null
            const daftar = sedangCariLab ? semua.filter((item) => cocokLab(item, kueriLab)) : semua
            if (sedangCariLab && daftar.length === 0) return null
            const terbuka = sedangCariLab || !labTutupSesi.has(kel)
            const terpesanDiKelompok = semua.filter((item) => enc.labDipesan.includes(item.id)).length
            return (
              <div key={kel} className="klinik-eduk__laci">
                <button
                  className="klinik-eduk__laci-kepala"
                  aria-expanded={terbuka}
                  onClick={() => toggleKelompokLab(kel)}
                  disabled={tutorialAktif}
                >
                  <span className="klinik-eduk__laci-panah" aria-hidden="true">
                    {terbuka ? '▾' : '▸'}
                  </span>
                  <span className="teks-kecil tumbuh klinik-eduk__laci-judul">
                    {LABEL_KELOMPOK_LAB[kel]}
                  </span>
                  <span className="mono teks-xs teks-lembut">
                    {terpesanDiKelompok > 0 ? `${terpesanDiKelompok}✓ · ` : ''}
                    {sedangCariLab ? daftar.length : semua.length}
                  </span>
                </button>
                {terbuka && (
                  <div className="klinik-lab__isi">
                    {daftar.map((item) => {
                      const dipesan = enc.labDipesan.includes(item.id)
                      return (
                        <div key={item.id} className="klinik-lab__baris">
                          <div className="tumbuh">
                            <span className="teks-kecil">{item.nama}</span>
                            {item.hasilBesok === true && (
                              <span className="chip chip--kunyit klinik-lab__besok">hasil besok</span>
                            )}
                          </div>
                          <span className="mono teks-xs teks-lembut">{formatRupiah(item.biaya)}</span>
                          <button
                            className="tombol klinik-lab__pesan"
                            onClick={() => {
                              dispatch({ type: 'PESAN_LAB', labId: item.id })
                              // Bugfix (2026-07-13): sama seperti "+ Resep" di DeckTerapi
                              // ("kena frozen lagi eh") — tombol ini disabled sesudah
                              // dipesan, memaksa fokus jatuh ke <body>. Kembalikan ke
                              // kotak cari supaya pemain bisa lanjut mengetik lab berikutnya.
                              cariLabRef.current?.focus()
                            }}
                            disabled={dipesan || tutorialAktif}
                            title={
                              dipesan
                                ? 'Sudah dipesan.'
                                : tutorialAktif
                                  ? 'Kasus latihan ini tak butuh lab — lanjutkan tanpa memesan.'
                                  : `Pesan ${item.nama} — biaya ${formatRupiah(item.biaya)} membebani kapitasi.`
                            }
                            // CODEX audit UI/UX 2026-07-10 (#15): teks visible tombol ini
                            // ("Pesan"/"✓") sama di SETIAP baris lab — nama lab hanya ada
                            // di title (hover) & teks node saudara, bukan di accessible
                            // name tombolnya sendiri. Screen reader/scan cepat tak bisa
                            // membedakan baris mana yang mana.
                            aria-label={dipesan ? `${item.nama} sudah dipesan` : `Pesan ${item.nama}`}
                          >
                            {dipesan ? '✓' : 'Pesan'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          <span className="teks-xs teks-lembut">
            Biaya lab membakar kapitasi Puskesmas. Pesan yang terindikasi saja.
          </span>
        </div>
      </div>

      <footer className="klinik-deck__footer">
        <button
          className={`tombol tombol--utama tombol--besar${sorotSelesai ? ' klinik-sorot-tutorial' : ''}`}
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
          disabled={tutorialAktif && !sorotSelesai}
        >
          Selesai Pemeriksaan &mdash; ke Diagnosis &rarr;
        </button>
        <span className="teks-xs teks-lembut">
          Hasil lab bertanda &ldquo;besok&rdquo; menuntut keputusan interim hari ini.
        </span>
      </footer>
    </>
  )
}
