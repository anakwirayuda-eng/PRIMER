/**
 * KARTU KELUARGA — unit informasi keluarga binaan/kandidat di panel Peta Desa.
 * Membaca state + konten, TIDAK menghitung aturan: IKS dari @engine/pispk,
 * alasan tombol dinonaktifkan disuplai layar induk (cermin guard reducer).
 */

import { hitungIksKeluarga, klasifikasiIks, SEMUA_INDIKATOR_PISPK } from '@engine/pispk'
import type { KeluargaState, NilaiIndikator } from '@engine/state'
import type { KeluargaBinaan } from '@content/types'
import { karmaTerlihat, LABEL_EKONOMI, LABEL_INDIKATOR, LABEL_KLASIFIKASI, SIMBOL_SUMBER } from './petaUtil'

interface Props {
  content: KeluargaBinaan
  kel: KeluargaState
  binaan: boolean
  rosterPenuh: boolean
  /** Alasan tombol Kunjungi dinonaktifkan; null = boleh berangkat. */
  alasanKunjungan: string | null
  biayaStamina: number
  onBinaan: () => void
  onLepas: () => void
  onKunjungi: () => void
}

/** Kelas chip indikator: warna dari status TERCATAT, simbol dari provenance. */
function kelasChipIndikator(nilai: NilaiIndikator): string {
  if (nilai.sumber === 'belum') return 'chip'
  if (nilai.status === 'ya') return nilai.sumber === 'dokter' ? 'chip chip--daun' : 'chip chip--kunyit'
  return 'chip chip--merah'
}

function judulChipIndikator(nilai: NilaiIndikator, penuh: string): string {
  if (nilai.sumber === 'belum') return `${penuh} — belum ada data. Kader atau kunjunganmu yang mengisinya.`
  const status = nilai.status === 'ya' ? 'terpenuhi' : 'belum terpenuhi'
  const sumber =
    nilai.sumber === 'dokter'
      ? 'diverifikasi dokter — kamu melihatnya sendiri'
      : 'laporan kader — bisa saja keliru, verifikasi dengan kunjungan'
  return `${penuh}: ${status} (${sumber}, data hari ${nilai.hariData}).`
}

function HatiTrust({ trust }: { trust: number }) {
  const isi = Math.round(trust / 2)
  return (
    <span className="peta-hati" title={`Kepercayaan keluarga ${trust}/10 — naik dari kualitas percakapanmu, bukan frekuensi kunjungan.`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < isi ? 'peta-hati__isi' : 'peta-hati__kosong'}>
          ♥
        </span>
      ))}
    </span>
  )
}

export function KartuKeluarga({
  content,
  kel,
  binaan,
  rosterPenuh,
  alasanKunjungan,
  biayaStamina,
  onBinaan,
  onLepas,
  onKunjungi,
}: Props) {
  const iks = hitungIksKeluarga(kel)
  const klasifikasi = iks === null ? null : LABEL_KLASIFIKASI[klasifikasiIks(iks)]
  const kepala = content.anggota.find((a) => a.peran === 'kepala') ?? content.anggota[0]
  const totalKunjunganArc = content.arc.kunjungan.length
  // Gerbang provenance: peringatan karma hanya bila dokter sudah punya data keluarga ini.
  const karmaTampak = karmaTerlihat(kel)

  return (
    <article className={`peta-keluarga kartu ${karmaTampak ? 'peta-keluarga--karma' : ''}`}>
      <div className="baris baris--antara">
        <div className="peta-keluarga__nama">Keluarga {content.namaKeluarga}</div>
        <div className="baris peta-keluarga__chipbaris">
          {karmaTampak && (
            <span
              className="chip chip--merah peta-chip-karma"
              title="Kader mendengar kondisinya memburuk — prioritaskan kunjungan ke keluarga ini."
            >
              PERLU PERHATIAN
            </span>
          )}
          {binaan && <span className="chip chip--daun">BINAAN</span>}
          <span className="chip">{LABEL_EKONOMI[content.ekonomi]}</span>
        </div>
      </div>

      <p className="peta-keluarga__sinopsis teks-kecil teks-lembut">{content.arc.sinopsis}</p>

      <div className="peta-keluarga__meta teks-xs teks-lembut mono">
        {kepala ? `Kepala: ${kepala.nama}` : 'Tanpa kepala keluarga tercatat'} · {content.anggota.length} anggota ·{' '}
        {content.jarakMenit} mnt dari Puskesmas
      </div>

      <div className="peta-keluarga__iks">
        <span className="teks-xs mono teks-lembut">IKS</span>
        <div className="meter tumbuh" title="Indeks Keluarga Sehat — dihitung HANYA dari indikator yang sudah punya data.">
          <div
            className={`meter__isi ${klasifikasi?.meter ?? ''}`}
            style={{ width: iks === null ? '0%' : `${Math.round(iks * 100)}%` }}
          />
        </div>
        {iks === null ? (
          <span className="chip" title="Belum ada satu pun indikator ber-data — angka yang belum diperoleh tidak ada.">
            ? belum ada data
          </span>
        ) : (
          <span className={`chip ${klasifikasi?.chip ?? ''}`}>
            {(iks * 100).toFixed(0)} · {klasifikasi?.label}
          </span>
        )}
        <HatiTrust trust={kel.trust} />
      </div>

      <div className="peta-keluarga__indikator">
        {SEMUA_INDIKATOR_PISPK.map((ind) => {
          const nilai = kel.indikator[ind]
          if (nilai.status === 'na') return null // tidak berlaku secara demografis
          const label = LABEL_INDIKATOR[ind]
          return (
            <span key={ind} className={kelasChipIndikator(nilai)} title={judulChipIndikator(nilai, label.penuh)}>
              {SIMBOL_SUMBER[nilai.sumber]} {label.singkat}
            </span>
          )
        })}
      </div>

      <div className="baris baris--antara peta-keluarga__aksi">
        <div className="baris">
          <span className="chip" title="Progres kunjungan berseri (arc) keluarga ini.">
            Kunjungan {Math.min(kel.arcIndex, totalKunjunganArc)}/{totalKunjunganArc}
          </span>
          {kel.arcSelesai === 'berhasil' && <span className="chip chip--daun">ARC BERHASIL</span>}
          {kel.arcSelesai === 'gagal' && <span className="chip chip--merah">ARC GAGAL</span>}
        </div>
        <div className="baris">
          {binaan ? (
            <button className="tombol tombol--senyap" onClick={onLepas} title="Keluarkan dari roster binaan.">
              Lepas
            </button>
          ) : (
            <button
              className="tombol"
              onClick={onBinaan}
              disabled={rosterPenuh}
              title={rosterPenuh ? 'Roster binaan penuh (maks 8) — lepas satu keluarga dulu.' : 'Masukkan ke roster keluarga binaan.'}
            >
              Jadikan Binaan
            </button>
          )}
          <button
            className="tombol tombol--utama"
            onClick={onKunjungi}
            disabled={alasanKunjungan !== null}
            title={alasanKunjungan ?? `Berangkat kunjungan rumah — memakai ${biayaStamina} stamina.`}
          >
            Kunjungi (siang · {biayaStamina} pip)
          </button>
        </div>
      </div>
    </article>
  )
}
