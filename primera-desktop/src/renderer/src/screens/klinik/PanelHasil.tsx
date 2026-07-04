/**
 * PANEL HASIL — modal penutup encounter: grade stempel besar, rincian skor,
 * bendera pedagogis, dan mutiara klinis (clue EBM) dari kasus.
 */

import type { PenilaianEncounter } from '@engine/state'

interface Props {
  hasil: PenilaianEncounter
  /** Boleh langsung memanggil pasien berikutnya? */
  bolehPanggil: boolean
  /** Alasan bila tidak boleh (jadi arahan pemain). */
  alasanTutup: string
  onSelesai: (panggilBerikutnya: boolean) => void
}

const WARNA_GRADE: Record<PenilaianEncounter['grade'], string> = {
  A: 'stempel--hijau',
  B: 'stempel--biru',
  C: 'stempel--kunyit',
  D: 'stempel--merah',
}

const LABEL_GRADE: Record<PenilaianEncounter['grade'], string> = {
  A: 'Tatalaksana teladan',
  B: 'Kompeten',
  C: 'Cukup — buka lagi guideline-nya',
  D: 'Perlu pembinaan',
}

export function PanelHasil({ hasil, bolehPanggil, alasanTutup, onSelesai }: Props) {
  const barisSkor: { label: string; nilai: number }[] = [
    { label: 'Anamnesis', nilai: hasil.skorAnamnesis },
    { label: 'Pemeriksaan', nilai: hasil.skorPemeriksaan },
    { label: 'Terapi', nilai: hasil.skorTerapi },
    { label: 'Edukasi', nilai: hasil.skorEdukasi },
  ]

  const bendera: { teks: string; kelas: string }[] = [
    hasil.disposisiTepat
      ? { teks: 'Disposisi tepat', kelas: 'chip--daun' }
      : { teks: 'Disposisi keliru', kelas: 'chip--merah' },
  ]
  if (hasil.rujukanNonSpesialistik)
    bendera.push({ teks: 'Rujukan non-spesialistik — menggerus RRNS', kelas: 'chip--merah' })
  if (hasil.cowboy)
    bendera.push({ teks: 'Kasus rujukan ditahan sendiri', kelas: 'chip--merah' })
  if (hasil.antibiotikTanpaIndikasi)
    bendera.push({ teks: 'Antibiotik tanpa indikasi', kelas: 'chip--merah' })
  if (hasil.labTakRelevan > 0)
    bendera.push({ teks: `Lab tak relevan ×${hasil.labTakRelevan}`, kelas: 'chip--kunyit' })
  if (hasil.sbarSkor !== undefined)
    bendera.push({
      teks: `SBAR ${hasil.sbarSkor}/100`,
      kelas: hasil.sbarSkor >= 60 ? 'chip--daun' : 'chip--kunyit',
    })

  return (
    <div className="overlay" onClick={() => onSelesai(false)}>
      <div
        className="modal klinik-hasil"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Hasil encounter"
      >
        <div className="klinik-hasil__atas">
          <span className={`stempel stempel--jatuh klinik-hasil__grade ${WARNA_GRADE[hasil.grade]}`}>
            {hasil.grade}
          </span>
          <div className="tumbuh">
            <div className="judul-seksi">Encounter Selesai</div>
            <div className="klinik-hasil__nama">{hasil.pasienNama}</div>
            <div className="teks-kecil teks-lembut">{LABEL_GRADE[hasil.grade]}</div>
          </div>
        </div>

        <div className="baris klinik-hasil__diagnosis">
          <span className={`chip ${hasil.diagnosisBenar ? 'chip--daun' : 'chip--merah'}`}>
            Diagnosis {hasil.diagnosisBenar ? 'BENAR' : 'KELIRU'}
          </span>
          <span
            className={`stempel klinik-hasil__jenis ${
              hasil.jenisDiagnosis === 'tegak' ? 'stempel--hijau' : 'stempel--biru'
            }`}
          >
            {hasil.jenisDiagnosis === 'tegak' ? 'TEGAK' : 'SUSPEK'}
          </span>
        </div>
        {!hasil.diagnosisBenar && (
          <p className="teks-kecil teks-lembut klinik-hasil__kalibrasi">
            {hasil.jenisDiagnosis === 'tegak'
              ? 'Stempel TEGAK pada diagnosis keliru menggerus kalibrasimu dalam-dalam. Bila ragu, jujurlah dengan SUSPEK.'
              : 'Diagnosismu keliru — tetapi stempel SUSPEK menunjukkan kejujuran epistemik. Kalibrasimu terjaga sebagian.'}
          </p>
        )}

        <div className="klinik-hasil__skor">
          {barisSkor.map(({ label, nilai }) => (
            <div key={label} className="klinik-hasil__skor-baris">
              <span className="teks-kecil klinik-hasil__skor-label">{label}</span>
              <div className="meter tumbuh">
                <div
                  className={`meter__isi${
                    nilai < 55 ? ' meter__isi--bahaya' : nilai < 70 ? ' meter__isi--waspada' : ''
                  }`}
                  style={{ width: `${nilai}%` }}
                />
              </div>
              <span className="mono teks-xs">{nilai}</span>
            </div>
          ))}
        </div>

        <div className="klinik-hasil__flags">
          {bendera.map((b) => (
            <span key={b.teks} className={`chip ${b.kelas}`}>
              {b.teks}
            </span>
          ))}
        </div>

        {hasil.konsekuensiDijadwalkan && (
          <p className="klinik-hasil__konsekuensi">
            Perjalanan penyakit ini belum tentu selesai. Awasi kotak masukmu beberapa hari ke
            depan.
          </p>
        )}

        <div className="folder klinik-hasil__clue">
          <div className="judul-seksi">Mutiara Klinis (EBM)</div>
          <p className="teks-kecil">{hasil.clue}</p>
        </div>

        <div className="baris klinik-hasil__aksi">
          <button className="tombol tombol--senyap" onClick={() => onSelesai(false)}>
            Tutup
          </button>
          <span className="tumbuh" />
          {bolehPanggil ? (
            <button className="tombol tombol--utama tombol--besar" onClick={() => onSelesai(true)}>
              Pasien Berikutnya &rarr;
            </button>
          ) : (
            <span className="teks-kecil teks-lembut">{alasanTutup}</span>
          )}
        </div>
      </div>
    </div>
  )
}
