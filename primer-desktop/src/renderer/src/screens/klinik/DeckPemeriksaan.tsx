/**
 * DECK PEMERIKSAAN — tombol ukur vital, figur tubuh klik-regio, dan
 * form laboratorium (biaya membakar kapitasi; sebagian hasil datang besok).
 */

import { useMemo } from 'react'
import { PACK } from '@content/index'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import { FigurTubuh } from './FigurTubuh'
import { LABEL_REGION, URUTAN_REGION, formatRupiah } from './util'

interface Props {
  enc: EncounterState
  dispatch: (action: Action) => void
}

export function DeckPemeriksaan({ enc, dispatch }: Props) {
  const daftarLab = useMemo(
    () => Object.values(PACK.lab).sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
    [],
  )

  return (
    <>
      <div className="klinik-deck__isi">
        {/* Tanda vital */}
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Tanda Vital</div>
          <button
            className={`tombol ${enc.vitalDiukur ? '' : 'tombol--utama'}`}
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
            />
            <div className="klinik-regio">
              {URUTAN_REGION.map((r) => {
                const sudah = enc.diperiksa.includes(r)
                return (
                  <button
                    key={r}
                    className={`chip klinik-regio__chip${sudah ? ' klinik-regio__chip--sudah' : ''}`}
                    onClick={() => dispatch({ type: 'PERIKSA', region: r })}
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
          {daftarLab.map((item) => {
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
                  onClick={() => dispatch({ type: 'PESAN_LAB', labId: item.id })}
                  disabled={dipesan}
                  title={
                    dipesan
                      ? 'Sudah dipesan.'
                      : `Pesan ${item.nama} — biaya ${formatRupiah(item.biaya)} membebani kapitasi.`
                  }
                >
                  {dipesan ? '✓' : 'Pesan'}
                </button>
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
          className="tombol tombol--utama tombol--besar"
          onClick={() => dispatch({ type: 'LANJUT_FASE' })}
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
