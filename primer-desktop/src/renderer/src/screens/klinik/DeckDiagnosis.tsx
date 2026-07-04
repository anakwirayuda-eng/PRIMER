/**
 * DECK DIAGNOSIS — daftar diagnosis banding + stempel dua tinta.
 * TEGAK = yakin (kalibrasi dipertaruhkan), SUSPEK = diagnosis kerja yang jujur.
 */

import { useMemo, useState } from 'react'
import type { EncounterState, JenisDiagnosis } from '@engine/state'
import type { Action } from '@engine/actions'
import type { KasusKlinis } from '@content/types'
import { namaDiagnosis } from './util'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  /** DeepThink "onboarding railroaded" (keputusan user). */
  tutorialAktif?: boolean
}

export function DeckDiagnosis({ enc, kasus, dispatch, tutorialAktif = false }: Props) {
  const [pilihan, setPilihan] = useState<string | null>(enc.diagnosis?.icd10 ?? null)
  const [jenis, setJenis] = useState<JenisDiagnosis>(enc.diagnosis?.jenis ?? 'suspek')
  // Sorotan: kasus.icd10 selalu jawaban benar utk kasus tutorial (dipaksa
  // KASUS_TUTORIAL oleh init.ts) — sorot opsi itu sampai dipilih, lalu
  // sorot tombol stempel.
  const sorotOpsi = tutorialAktif && pilihan !== kasus.icd10
  const sorotStempel = tutorialAktif && pilihan === kasus.icd10

  // Anti-bocor jawaban: urutan konten menaruh jawaban benar di index 0 —
  // render SELALU terurut kode ICD-10 (ascending, deterministik).
  const banding = useMemo(
    () => [...kasus.diagnosisBanding].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    [kasus.diagnosisBanding],
  )

  return (
    <>
      <div className="klinik-deck__isi">
        <div className="klinik-deck__grup">
          <div className="judul-seksi">Diagnosis Banding</div>
          {banding.map((kode) => {
            const aktif = pilihan === kode
            const disorot = sorotOpsi && kode === kasus.icd10
            const dikunci = tutorialAktif && !disorot && !aktif
            return (
              <button
                key={kode}
                className={`klinik-banding${aktif ? ' klinik-banding--aktif' : ''}${disorot ? ' klinik-sorot-tutorial' : ''}`}
                onClick={() => setPilihan(kode)}
                disabled={dikunci}
                title="Pilih sebagai diagnosis kerja"
              >
                <span className="klinik-banding__radio" aria-hidden="true" />
                <span className="tumbuh">
                  <span className="klinik-banding__nama">{namaDiagnosis(kode, kasus)}</span>
                  <span className="mono teks-xs teks-lembut klinik-banding__kode">{kode}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="klinik-deck__grup">
          <div className="judul-seksi">Tinta Stempel</div>
          <div className="klinik-tinta-pilih">
            <button
              className={`klinik-tinta-pilih__opsi${jenis === 'tegak' ? ' klinik-tinta-pilih__opsi--aktif' : ''}`}
              onClick={() => setJenis('tegak')}
            >
              <span className="stempel stempel--hijau">TEGAK</span>
              <span className="teks-xs teks-lembut">
                Kamu yakin. Kalau keliru, kalibrasi diagnostikmu tergerus dalam.
              </span>
            </button>
            <button
              className={`klinik-tinta-pilih__opsi${jenis === 'suspek' ? ' klinik-tinta-pilih__opsi--aktif' : ''}`}
              onClick={() => setJenis('suspek')}
            >
              <span className="stempel stempel--biru">SUSPEK</span>
              <span className="teks-xs teks-lembut">
                Diagnosis kerja. Jujur atas ketidakpastian &mdash; lebih aman bila ragu.
              </span>
            </button>
          </div>
        </div>
      </div>

      <footer className="klinik-deck__footer">
        <button
          className={`tombol tombol--utama tombol--besar${sorotStempel ? ' klinik-sorot-tutorial' : ''}`}
          onClick={() => {
            if (pilihan !== null) dispatch({ type: 'KOMIT_DIAGNOSIS', icd10: pilihan, jenis })
          }}
          disabled={pilihan === null}
          title={pilihan === null ? 'Pilih satu diagnosis banding dulu.' : 'Stempelkan diagnosis di lembar.'}
        >
          Stempelkan Diagnosis
        </button>
        {/* Kasus tak pasti / di luar kompetensi TETAP butuh diagnosis kerja:
            pilih impresi terdekat lalu cap SUSPEK, baru rujuk. Disposisi
            memang mensyaratkan diagnosis (juga utk rujuk) — dulu ada tombol
            "lewati tanpa diagnosis" yang menuntun ke jalan buntu (CODEX P2),
            sudah dihapus. */}
        <span className="teks-xs teks-lembut klinik-deck__diag-nb">
          Belum yakin? Pilih impresi terdekat, cap <strong>SUSPEK</strong> — lalu tata laksana awal &amp; rujuk.
          Merujuk pun butuh diagnosis kerja di kolom A.
        </span>
      </footer>
    </>
  )
}
