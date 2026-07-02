/**
 * DECK DISPOSISI — pulangkan / observasi / rujuk (form SBAR SISRUTE 4 kolom
 * yang DINILAI engine) + ringkasan billing encounter.
 */

import { useState } from 'react'
import { PACK } from '@content/index'
import type { EncounterState, SbarIsi } from '@engine/state'
import type { Action } from '@engine/actions'
import { formatRupiah } from './util'

interface Props {
  enc: EncounterState
  dispatch: (action: Action) => void
}

const KOLOM_SBAR: { kunci: keyof SbarIsi; label: string; placeholder: string }[] = [
  {
    kunci: 'situation',
    label: 'S — Situation',
    placeholder: 'Kondisi pasien saat ini: identitas, keluhan utama, tanda vital terakhir…',
  },
  {
    kunci: 'background',
    label: 'B — Background',
    placeholder: 'Riwayat singkat: anamnesis kunci, penyakit penyerta, terapi yang sudah diberikan…',
  },
  {
    kunci: 'assessment',
    label: 'A — Assessment',
    placeholder: 'Penilaianmu: diagnosis kerja (sebut nama/kode ICD-10) dan derajat keparahannya…',
  },
  {
    kunci: 'recommendation',
    label: 'R — Recommendation',
    placeholder: 'Apa yang kamu minta dari faskes rujukan: stabilisasi lanjutan, pemeriksaan, rawat inap…',
  },
]

const SBAR_KOSONG: SbarIsi = { situation: '', background: '', assessment: '', recommendation: '' }

export function DeckDisposisi({ enc, dispatch }: Props) {
  const [modeRujuk, setModeRujuk] = useState(false)
  const [sbar, setSbar] = useState<SbarIsi>(SBAR_KOSONG)

  const punyaDiagnosis = enc.diagnosis !== undefined
  const alasanTanpaDiagnosis =
    'Butuh diagnosis di kolom A. Fase diagnosis sudah lewat — bila kasus di luar kompetensi, rujuk.'

  const biayaLab = enc.labDipesan.reduce((total, id) => total + (PACK.lab[id]?.biaya ?? 0), 0)
  const biayaObat = enc.resep.reduce((total, id) => {
    const o = PACK.obat[id]
    if (!o) return total
    return total + (enc.pasien.bpjs ? o.hargaBeli : o.hargaJual)
  }, 0)

  const sbarLengkap = KOLOM_SBAR.every(({ kunci }) => sbar[kunci].trim().length > 0)

  return (
    <>
      <div className="klinik-deck__isi">
        {/* Billing ringkas */}
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Ringkasan Biaya</div>
          <div className="klinik-billing">
            <div className="baris baris--antara teks-kecil">
              <span>Laboratorium ({enc.labDipesan.length} item)</span>
              <span className="mono">{formatRupiah(biayaLab)}</span>
            </div>
            <div className="baris baris--antara teks-kecil">
              <span>Obat ({enc.resep.length} item)</span>
              <span className="mono">{formatRupiah(biayaObat)}</span>
            </div>
            <div className="baris baris--antara klinik-billing__total">
              <span>Total</span>
              <span className="mono">{formatRupiah(biayaLab + biayaObat)}</span>
            </div>
            <span className="teks-xs teks-lembut">
              {enc.pasien.bpjs
                ? 'Pasien JKN — biaya dibebankan ke kapitasi Puskesmas.'
                : 'Pasien umum — membayar tarif retribusi di loket.'}
            </span>
          </div>
        </div>

        {/* Pilihan disposisi */}
        {!modeRujuk ? (
          <div className="klinik-deck__grup">
            <div className="judul-seksi">Disposisi</div>
            <button
              className="tombol tombol--utama tombol--besar"
              onClick={() => dispatch({ type: 'DISPOSISI', jenis: 'pulang' })}
              disabled={!punyaDiagnosis}
              title={
                punyaDiagnosis
                  ? 'Pulangkan pasien dengan resep & edukasi.'
                  : alasanTanpaDiagnosis
              }
            >
              PULANGKAN
            </button>
            <button
              className="tombol tombol--besar"
              onClick={() => dispatch({ type: 'DISPOSISI', jenis: 'observasi' })}
              disabled={!punyaDiagnosis}
              title={
                punyaDiagnosis
                  ? 'Observasi di Puskesmas dulu sebelum pulang.'
                  : alasanTanpaDiagnosis
              }
            >
              OBSERVASI
            </button>
            <button
              className="tombol tombol--kunyit tombol--besar"
              onClick={() => setModeRujuk(true)}
              title="Buka form rujukan SISRUTE (SBAR 4 kolom)."
            >
              RUJUK &rarr;
            </button>
            <span className="teks-xs teks-lembut">
              Ingat gerbang SKDI: merujuk kasus yang tuntas di FKTP menggerus rasio rujukanmu
              (RRNS); menahan kasus di luar kompetensi membahayakan pasien.
            </span>
          </div>
        ) : (
          <div className="klinik-deck__grup">
            <div className="judul-seksi">Rujukan SISRUTE &mdash; SBAR</div>
            {KOLOM_SBAR.map(({ kunci, label, placeholder }) => (
              <label key={kunci} className="klinik-sbar__kolom">
                <span className="baris baris--antara">
                  <span className="mono teks-xs klinik-sbar__label">{label}</span>
                  {sbar[kunci].trim().length > 0 && (
                    <span className="mono teks-xs teks-lembut">{sbar[kunci].trim().length}</span>
                  )}
                </span>
                <textarea
                  className="klinik-sbar__isian"
                  value={sbar[kunci]}
                  onChange={(e) => setSbar({ ...sbar, [kunci]: e.target.value })}
                  placeholder={placeholder}
                  rows={3}
                />
              </label>
            ))}
            <span className="teks-xs teks-lembut">
              S: sebutkan kondisi &amp; tanda vital terukur &middot; B: riwayat singkat &middot; A:
              diagnosis kerja &middot; R: apa yang kamu minta dari RS.
            </span>
            <button
              className="tombol tombol--kunyit tombol--besar"
              onClick={() => dispatch({ type: 'DISPOSISI', jenis: 'rujuk', sbar })}
              disabled={!sbarLengkap}
              title={
                sbarLengkap
                  ? 'Kirim rujukan ke rumah sakit melalui SISRUTE.'
                  : 'Isi keempat kolom SBAR dulu.'
              }
            >
              Kirim Rujukan (SISRUTE)
            </button>
            <button className="tombol tombol--senyap" onClick={() => setModeRujuk(false)}>
              &larr; Batal merujuk
            </button>
          </div>
        )}
      </div>

      <footer className="klinik-deck__footer">
        <span className="teks-xs teks-lembut">
          Disposisi menutup encounter &mdash; penilaian dihitung dari seluruh isi lembar.
        </span>
      </footer>
    </>
  )
}
