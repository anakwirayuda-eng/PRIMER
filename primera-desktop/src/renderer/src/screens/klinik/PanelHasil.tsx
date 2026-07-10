/**
 * PANEL HASIL — modal penutup encounter: grade stempel besar, rincian skor,
 * bendera pedagogis, dan mutiara klinis (clue EBM) dari kasus.
 */

import type { PenilaianEncounter } from '@engine/state'
import { PACK } from '@content/index'
import { useFocusTrap } from '../../useFocusTrap'

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
  const tutorial = hasil.tutorialLatihan === true
  // M11: kasus utk lapisan pengayaan (mutiaraEbm/catatanRealita) — murni display.
  const kasus = PACK.kasus[hasil.kasusId]

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

  // CODEX M10.a ronde-4 (dossier §44): tanpa jebak fokus, tombol HUD di
  // belakang (navigasi layar dkk) tetap Tab-able & ter-aktivasi walau modal
  // debrief ini menutupinya total secara visual.
  const ref = useFocusTrap<HTMLDivElement>(true, () => onSelesai(false))

  return (
    <div className="overlay" onClick={() => onSelesai(false)}>
      <div
        ref={ref}
        className="modal klinik-hasil"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Hasil encounter"
      >
        <div className="klinik-hasil__atas">
          {/* CODEX: pasien tutorial dituntun lewat jalur MINIMAL (1 pertanyaan,
              1 regio, tanpa edukasi) — skor SOAP mentah dari jalur itu bisa
              jatuh ke grade D walau pemain 100% mengikuti sorotan. Skor
              sungguhan sudah kebal (reducer.ts); di sini cukup jangan
              menampilkan huruf/rincian yang menghukum utk latihan pertama. */}
          <span className="klinik-hasil__grade-tutorial">
            {tutorial ? (
              <span aria-hidden="true">🎓</span>
            ) : (
              <span
                className={`stempel stempel--jatuh klinik-hasil__grade ${WARNA_GRADE[hasil.grade]}`}
                aria-label={`Grade ${hasil.grade}`}
              >
                {hasil.grade}
              </span>
            )}
          </span>
          <div className="tumbuh">
            <div className="judul-seksi">Encounter Selesai</div>
            <div className="klinik-hasil__nama">{hasil.pasienNama}</div>
            <div className="teks-kecil teks-lembut">
              {tutorial ? 'Latihan pertama tuntas — ini tak memengaruhi skor.' : LABEL_GRADE[hasil.grade]}
            </div>
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
        {!tutorial && !hasil.diagnosisBenar && (
          <p className="teks-kecil teks-lembut klinik-hasil__kalibrasi">
            {hasil.jenisDiagnosis === 'tegak'
              ? 'Stempel TEGAK pada diagnosis keliru menggerus kalibrasimu dalam-dalam. Bila ragu, jujurlah dengan SUSPEK.'
              : 'Diagnosismu keliru — tetapi stempel SUSPEK menunjukkan kejujuran epistemik. Kalibrasimu terjaga sebagian.'}
          </p>
        )}

        {!tutorial && (
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
        )}

        {!tutorial && (
          <div className="klinik-hasil__flags">
            {bendera.map((b) => (
              <span key={b.teks} className={`chip ${b.kelas}`}>
                {b.teks}
              </span>
            ))}
          </div>
        )}

        {/* DeepThink triangulasi (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md, O6):
            debrief adalah formative assessment PASCA-skor-terkunci — sebut
            eksplisit topik edukasiKritis yang terlewat, bukan cuma angka
            skorEdukasi yg di-cap, supaya pemain paham APA yg harus diperbaiki. */}
        {!tutorial && hasil.edukasiKritisTerlewat.length > 0 && (
          <p className="klinik-hasil__edukasi-kritis">
            Topik edukasi non-negotiable terlewat:{' '}
            {hasil.edukasiKritisTerlewat
              .map((id) => PACK.edukasi[id]?.nama ?? id)
              .join(', ')}
            . Skor Edukasi di-cap krn ini klinis kritis, tak bisa disubsidi topik lain.
          </p>
        )}

        {!tutorial && hasil.konsekuensiDijadwalkan && (
          <p className="klinik-hasil__konsekuensi">
            Perjalanan penyakit ini belum tentu selesai. Awasi kotak masukmu beberapa hari ke
            depan.
          </p>
        )}

        <div className="folder klinik-hasil__clue">
          <div className="judul-seksi">Mutiara Klinis (EBM)</div>
          <p className="teks-kecil">{hasil.clue}</p>
        </div>

        {/* M11: lapisan pengayaan — mutiara EBM "temuan bisa menyesatkan" +
            catatan realita FKTP. Dibaca langsung dari PACK (murni display, tak
            lewat engine/skor). Muncul hanya bila kasus menyediakannya. */}
        {kasus?.mutiaraEbm && (
          <div className="folder klinik-hasil__ebm">
            <div className="judul-seksi">💡 Waspada — Temuan Bisa Menyesatkan</div>
            <p className="teks-kecil">{kasus.mutiaraEbm}</p>
          </div>
        )}
        {kasus?.catatanRealita && (
          <div className="folder klinik-hasil__realita">
            <div className="judul-seksi">🏥 Realita FKTP</div>
            <p className="teks-kecil">{kasus.catatanRealita}</p>
          </div>
        )}
        {/* M11.5: lapisan otoritas ke-3 — panduan RESMI Kemenkes (PPK
            1186/2022), terpisah dari clue (EBM internasional) & realita. Sama
            kelas display-only. Muncul hanya bila kasus menyediakannya. */}
        {kasus?.panduanResmi && (
          <div className="folder klinik-hasil__panduan">
            <div className="judul-seksi">📜 Panduan Resmi Kemenkes</div>
            <p className="teks-kecil">{kasus.panduanResmi}</p>
          </div>
        )}

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
