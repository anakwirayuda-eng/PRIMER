/**
 * DECK PEMERIKSAAN — tombol ukur vital, figur tubuh klik-regio, dan
 * form laboratorium (biaya membakar kapitasi; sebagian hasil datang besok).
 */

import { useMemo, useRef, useState } from 'react'
import { PACK } from '@content/index'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import { FigurTubuh } from './FigurTubuh'
import { LABEL_REGION, URUTAN_REGION, cocokLab, formatRupiah } from './util'
import { REGION_PERTAMA_TUTORIAL } from './tutorialKlinik'

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
  const [cariLab, setCariLab] = useState('')
  const cariLabRef = useRef<HTMLInputElement>(null)
  const daftarLab = useMemo(() => {
    const q = cariLab.trim()
    return Object.values(PACK.lab)
      .filter((item) => q === '' || cocokLab(item, q))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
  }, [cariLab])

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
          {daftarLab.length === 0 ? (
            <div className="klinik-lembar__kosong">Tidak ada pemeriksaan lab yang cocok.</div>
          ) : (
            daftarLab.map((item) => {
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
            })
          )}
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
