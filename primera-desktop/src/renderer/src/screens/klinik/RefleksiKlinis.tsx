import { useState } from 'react'
import type { DexEntry } from '@engine/state'
import {
  duelUntukKasus,
  teachBackUntukKasus,
  type DuelDiagnosisPilot,
  type PilihanFormatif,
  type SumberPedagogis,
} from '@content/pedagogyPilots'
import './RefleksiKlinis.css'

type Dex = Record<string, DexEntry>

function SumberRingkas({ sumber }: { sumber: readonly SumberPedagogis[] }) {
  return (
    <p className="refleksi__sumber teks-xs teks-lembut">
      Landasan:{' '}
      {sumber.map((item, index) => (
        <span key={item.id}>
          {index > 0 && ' | '}
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.label} ({item.tahun})
          </a>
        </span>
      ))}
    </p>
  )
}

function PilihanLatihan({
  pilihan,
  terpilih,
  onPilih,
  label,
}: {
  pilihan: readonly PilihanFormatif[]
  terpilih: string | null
  onPilih: (id: string) => void
  label: string
}) {
  return (
    <div className="refleksi__pilihan" role="group" aria-label={label}>
      {pilihan.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`refleksi__opsi${terpilih === item.id ? ' refleksi__opsi--aktif' : ''}`}
          aria-pressed={terpilih === item.id}
          onClick={() => onPilih(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function UmpanBalik({ pilihan, terpilih }: { pilihan: readonly PilihanFormatif[]; terpilih: string | null }) {
  const item = pilihan.find((opsi) => opsi.id === terpilih)
  if (!item) return null
  return (
    <p
      className={`refleksi__respons ${item.benar ? 'refleksi__respons--benar' : 'refleksi__respons--ulang'}`}
      role="status"
    >
      {item.respons}
    </p>
  )
}

function kasusDuelSudahDijumpai(duel: DuelDiagnosisPilot, dex: Dex): boolean {
  return duel.sisi.every((sisi) => (dex[sisi.kasusId]?.ditangani ?? 0) > 0)
}

export function DuelDiagnosis({ kasusId, dex }: { kasusId: string; dex: Dex }) {
  const duel = duelUntukKasus(kasusId)
  const [pilihanId, setPilihanId] = useState<string | null>(null)
  if (!duel || !kasusDuelSudahDijumpai(duel, dex)) return null

  const sisi = duel.sisi.find((item) => item.kasusId === kasusId)!
  return (
    <details className="refleksi refleksi--duel">
      <summary>
        <span>Duel diagnosis</span>
        <span className="refleksi__durasi mono">25 detik</span>
      </summary>
      <div className="refleksi__isi">
        <dl className="refleksi__kontras">
          <div><dt>Keputusan</dt><dd>{sisi.keputusan}</dd></div>
          <div><dt>Pembeda</dt><dd>{duel.pembeda}</dd></div>
          <div><dt>Akan membalik</dt><dd>{duel.pembalik}</dd></div>
        </dl>
        <p className="refleksi__pertanyaan">{duel.pertanyaan}</p>
        <PilihanLatihan
          pilihan={duel.pilihan}
          terpilih={pilihanId}
          onPilih={setPilihanId}
          label="Pilihan duel diagnosis"
        />
        <UmpanBalik pilihan={duel.pilihan} terpilih={pilihanId} />
        <SumberRingkas sumber={duel.sumber} />
      </div>
    </details>
  )
}

export function TeachBack({ kasusId }: { kasusId: string }) {
  const pilot = teachBackUntukKasus(kasusId)
  const [pembukaId, setPembukaId] = useState<string | null>(null)
  const [penilaianId, setPenilaianId] = useState<string | null>(null)
  if (!pilot) return null

  const pembukaBenar = pilot.pilihanPembuka.find((item) => item.id === pembukaId)?.benar === true
  const penilaianBenar = pilot.pilihanPenilaian.find((item) => item.id === penilaianId)?.benar === true

  return (
    <details className="refleksi refleksi--teachback">
      <summary>
        <span>{pilot.judul}</span>
        <span className="refleksi__durasi mono">30 detik</span>
      </summary>
      <div className="refleksi__isi">
        <p className="refleksi__fokus teks-kecil">Fokus: {pilot.fokus}</p>
        <p className="refleksi__pertanyaan">{pilot.pertanyaanPembuka}</p>
        <PilihanLatihan
          pilihan={pilot.pilihanPembuka}
          terpilih={pembukaId}
          onPilih={(id) => {
            setPembukaId(id)
            setPenilaianId(null)
          }}
          label="Pilihan prompt teach-back"
        />
        <UmpanBalik pilihan={pilot.pilihanPembuka} terpilih={pembukaId} />

        {pembukaBenar && (
          <div className="refleksi__lanjutan">
            <blockquote className="refleksi__ucapan">
              Pasien: "{pilot.ucapanPasienAwal}"
            </blockquote>
            <p className="refleksi__pertanyaan">{pilot.pertanyaanPenilaian}</p>
            <PilihanLatihan
              pilihan={pilot.pilihanPenilaian}
              terpilih={penilaianId}
              onPilih={setPenilaianId}
              label="Pilihan respons re-teach"
            />
            <UmpanBalik pilihan={pilot.pilihanPenilaian} terpilih={penilaianId} />
          </div>
        )}

        {penilaianBenar && (
          <div className="refleksi__selesai" role="status">
            <p><strong>Ajar ulang:</strong> {pilot.ajarUlang}</p>
            <blockquote className="refleksi__ucapan refleksi__ucapan--akhir">
              Pasien: "{pilot.ucapanPasienAkhir}"
            </blockquote>
          </div>
        )}
        <SumberRingkas sumber={pilot.sumber} />
      </div>
    </details>
  )
}
