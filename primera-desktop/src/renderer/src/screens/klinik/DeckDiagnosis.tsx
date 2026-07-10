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
  // M9.1: toggle TEGAK/SUSPEK tak pernah dikunci sebelumnya — pemain bisa
  // klik SUSPEK meski tutorial menuntun jalur TEGAK (kasus tutorial selalu
  // 100% pasti, TEGAK adalah pelajaran yang tepat). Dikunci ke 'tegak' & tak
  // bisa diubah selama tutorial.
  const [jenis, setJenis] = useState<JenisDiagnosis>(
    tutorialAktif ? 'tegak' : (enc.diagnosis?.jenis ?? 'suspek'),
  )
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
        {/* M10 §49: role=radio + aria-checked pada interaksi BERSKOR (dulu state
            terpilih hanya via CSS, nol semantik ARIA — lebih parah dari
            aria-pressed). Roving/panah SENGAJA tak dipakai di sini: opsi bisa
            di-disable saat tutorial, dan handler panah akan mem-bypass kunci
            itu (memilih via keyboard tanpa lewat onClick ber-disabled). */}
        <div className="klinik-deck__grup" role="radiogroup" aria-label="Diagnosis banding">
          <div className="judul-seksi">Diagnosis Banding</div>
          {banding.map((kode) => {
            const aktif = pilihan === kode
            const disorot = sorotOpsi && kode === kasus.icd10
            // M9.1: dulu `&& !aktif` membiarkan opsi yg SUDAH dipilih tetap
            // aktif-diklik (sama spt celah DeckAnamnesis) — begitu pilihan
            // benar terpilih, sorotOpsi jadi false utk SEMUA opsi, "!aktif"
            // jadi satu-satunya penjaga tersisa dan gagal mengunci opsi yg
            // barusan dipilih. Terkunci KECUALI ini persis yg disorot.
            const dikunci = tutorialAktif && !disorot
            return (
              <button
                key={kode}
                role="radio"
                aria-checked={aktif}
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
          <div className="klinik-tinta-pilih" role="radiogroup" aria-label="Tinta stempel diagnosis">
            <button
              role="radio"
              aria-checked={jenis === 'tegak'}
              className={`klinik-tinta-pilih__opsi${jenis === 'tegak' ? ' klinik-tinta-pilih__opsi--aktif' : ''}`}
              onClick={() => setJenis('tegak')}
              disabled={tutorialAktif}
            >
              <span className="stempel stempel--hijau">TEGAK</span>
              <span className="teks-xs teks-lembut">
                Kamu yakin. Kalau keliru, kalibrasi diagnostikmu tergerus dalam.
              </span>
            </button>
            <button
              role="radio"
              aria-checked={jenis === 'suspek'}
              className={`klinik-tinta-pilih__opsi${jenis === 'suspek' ? ' klinik-tinta-pilih__opsi--aktif' : ''}`}
              onClick={() => setJenis('suspek')}
              disabled={tutorialAktif}
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
