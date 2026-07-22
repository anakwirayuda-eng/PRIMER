/**
 * LEMBAR PERIKSA — kolom kiri: satu lembar rekam medis kertas ber-SOAP yang
 * terisi hidup dari atas ke bawah. Pilar "setiap angka diperoleh": tanda vital
 * tampil '—' sampai diukur, riwayat alergi tampil setelah ditanyakan.
 */

import { PACK } from '@content/index'
import type { EncounterState } from '@engine/state'
import type { Action } from '@engine/actions'
import { temuanUntukRegion } from '@engine/clinic'
import { formatUsia } from '@engine/usia'
import type { KasusKlinis, TandaVital } from '@content/types'
import {
  LABEL_PERSONA,
  LABEL_REGION,
  jawabanPasien,
  labelJk,
  namaDiagnosis,
  personaAnamnesis,
} from './util'
import { PotretPasien } from './PotretPasien'

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
}

const BARIS_VITAL: { kunci: keyof TandaVital; label: string; satuan: string }[] = [
  { kunci: 'td', label: 'TD', satuan: 'mmHg' },
  { kunci: 'nadi', label: 'Nadi', satuan: 'x/mnt' },
  { kunci: 'rr', label: 'RR', satuan: 'x/mnt' },
  { kunci: 'suhu', label: 'Suhu', satuan: '°C' },
  { kunci: 'spo2', label: 'SpO₂', satuan: '%' },
  { kunci: 'gds', label: 'GDS', satuan: 'mg/dL' },
]

const CHIP_FLAG: Record<string, { label: string; kelas: string }> = {
  normal: { label: 'normal', kelas: 'chip--daun' },
  rendah: { label: 'rendah', kelas: 'chip--biru' },
  tinggi: { label: 'tinggi', kelas: 'chip--merah' },
  abnormal: { label: 'abnormal', kelas: 'chip--merah' },
}

/**
 * Audit V-3 (2026-07-23): id internal pasien memuat kasusId (`p_<kasusId>_<n>`)
 * dan dulu di-render mentah sebagai No. RM — kop berkas MEMBOCORKAN diagnosis
 * (mis. "P_TB_PARU_4821") sebelum satu pun pertanyaan anamnesis, termasuk di
 * mode Ujian. Nomor tampilan kini kosmetik-deterministik dari id yang sama;
 * id internal TIDAK diubah (dipakai save/replay/verifier — di luar wewenang
 * tampilan).
 */
export function nomorRmTampilan(id: string): string {
  // FNV-1a atas seluruh id mempertahankan kesinambungan pasien tanpa
  // menampilkan kasusId. Sepuluh digit memakai seluruh ruang uint32; empat
  // digit lama terlalu mudah berulang selama stase dengan ratusan pasien.
  let h = 0x811c9dc5
  for (let k = 0; k < id.length; k++) {
    h ^= id.charCodeAt(k)
    h = Math.imul(h, 0x01000193)
  }
  return `RM-${String(h >>> 0).padStart(10, '0')}`
}

export function LembarPeriksa({ enc, kasus, dispatch }: Props) {
  const p = enc.pasien

  // Alergi "diperoleh": tampil setelah pertanyaan alergi ditanyakan
  // atau setelah firewall pernah terpicu (ketahuan dari reaksi sistem).
  // Karma loop positif: pasien keluarga binaan sudah dikenal dokter dari
  // kunjungan rumah — riwayat alerginya PRE-FILLED sejak awal.
  const alergiTerungkap =
    p.bonusTrust ||
    enc.firewallTerpicu > 0 ||
    enc.ditanya.some((id) => {
      const q = kasus.anamnesis.find((x) => x.id === id)
      return q !== undefined && q.tanya.toLowerCase().includes('alergi')
    })

  const labMenunggu = enc.labDipesan.filter((id) => !enc.labTersedia.includes(id))

  return (
    <article className="klinik-lembar kertas" aria-label="Lembar periksa pasien">
      {/* Kop rekam medis */}
      <header className="klinik-lembar__kop">
        <div className="klinik-lembar__kop-instansi">
          PEMERINTAH KABUPATEN SUKAMAJU &middot; PUSKESMAS SUKAMAJU
        </div>
        <div className="klinik-lembar__kop-judul">REKAM MEDIS RAWAT JALAN</div>
        <div className="mono teks-xs teks-lembut">No. RM: {nomorRmTampilan(p.id)}</div>
      </header>

      {/* Identitas */}
      <section className="klinik-lembar__seksi">
        <div className="baris baris--antara klinik-lembar__identitas">
          <div className="baris klinik-lembar__identitas-utama">
            <PotretPasien pasien={p} />
            <div>
              <div className="klinik-lembar__nama">{p.nama}</div>
              <div className="teks-kecil teks-lembut">
                {formatUsia(p.usia, p.usiaBulan)} &middot; {labelJk(p.jenisKelamin)}
              </div>
            </div>
          </div>
          <div className="baris klinik-lembar__chips">
            <span className="chip">{LABEL_PERSONA[personaAnamnesis(kasus, p.persona)]}</span>
            {p.bpjs ? <span className="chip chip--biru">BPJS</span> : <span className="chip">Umum</span>}
            {p.bonusTrust && (
              <span
                className="chip chip--daun"
                title="Dari keluarga yang kamu bina — riwayatnya sudah kamu kenal dari kunjungan rumah."
              >
                Keluarga binaanmu
              </span>
            )}
            {p.followUpDari !== undefined && <span className="chip chip--merah">Kembali</span>}
            {kasus.activationStatus === 'lab_prototype_unadjudicated' && (
              <span
                className="chip chip--kunyit"
                title="Kasus ini aktif hanya di lab pengembangan dan belum melewati adjudikasi klinis final."
              >
                Prototipe lab
              </span>
            )}
          </div>
        </div>
        <div className="baris teks-kecil">
          <span className="teks-lembut">Riwayat alergi:</span>
          {!alergiTerungkap ? (
            <span className="klinik-lembar__kosong">&mdash; belum ditanyakan &mdash;</span>
          ) : p.alergi.length > 0 ? (
            p.alergi.map((a) => (
              <span key={a} className="chip chip--merah">
                ALERGI {a.toUpperCase()}
              </span>
            ))
          ) : (
            <span className="tulis-tangan klinik-tinta">tidak ada</span>
          )}
        </div>
        {p.followUpDari !== undefined && (
          <div className="klinik-lembar__catatan-kembali teks-kecil">{p.followUpDari}</div>
        )}
      </section>

      {/* S — Subjektif */}
      <section className="klinik-lembar__seksi">
        <div className="judul-seksi">S &mdash; Subjektif (Anamnesis)</div>
        <div className="klinik-lembar__qa">
          <div className="klinik-lembar__tanya teks-kecil teks-lembut">Keluhan utama</div>
          <div className="tulis-tangan">
            {kasus.keluhanUtamaOlehPendamping && (
              <span className="teks-xs teks-lembut">Dituturkan pendamping: </span>
            )}
            &ldquo;{kasus.keluhanUtama}&rdquo;
          </div>
        </div>
        {enc.ditanya.length === 0 ? (
          <div className="klinik-lembar__kosong">&mdash; belum ada kutipan anamnesis &mdash;</div>
        ) : (
          enc.ditanya.map((id) => {
            const q = kasus.anamnesis.find((x) => x.id === id)
            if (!q) return null
            return (
              <div key={id} className="klinik-lembar__qa klinik-tinta">
                <div className="klinik-lembar__tanya teks-kecil teks-lembut">{q.tanya}</div>
                <div className="tulis-tangan">
                  {(q.olehPendamping === true || kasus.keluhanUtamaOlehPendamping === true) && (
                    <span className="teks-xs teks-lembut">Pendamping: </span>
                  )}
                  &ldquo;{jawabanPasien(q, p.persona, kasus)}&rdquo;
                </div>
              </div>
            )
          })
        )}
      </section>

      {/* O — Objektif */}
      <section className="klinik-lembar__seksi">
        <div className="judul-seksi">O &mdash; Objektif</div>

        <div className="klinik-lembar__sublabel mono teks-xs teks-lembut">TANDA VITAL</div>
        <div className="klinik-lembar__vital" key={enc.vitalDiukur ? 'terukur' : 'kosong'}>
          {BARIS_VITAL.map(({ kunci, label, satuan }) => {
            const nilai = kasus.vital[kunci]
            const terukur = enc.vitalDiukur && nilai !== undefined
            return (
              <div key={kunci} className="klinik-lembar__vital-item">
                <span className="klinik-lembar__vital-label mono teks-xs teks-lembut">{label}</span>
                {terukur ? (
                  <span className="klinik-lembar__vital-nilai klinik-tinta">
                    {nilai} <span className="klinik-lembar__vital-satuan">{satuan}</span>
                  </span>
                ) : (
                  <span className="klinik-lembar__vital-nilai klinik-lembar__vital-nilai--kosong">
                    &mdash;
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="klinik-lembar__sublabel mono teks-xs teks-lembut">PEMERIKSAAN FISIK</div>
        {enc.diperiksa.length === 0 ? (
          <div className="klinik-lembar__kosong">&mdash; belum ada regio yang diperiksa &mdash;</div>
        ) : (
          enc.diperiksa.map((r) => {
            const temuan = temuanUntukRegion(kasus, r)
            return (
              <div key={r} className="klinik-lembar__qa klinik-tinta">
                <div className="klinik-lembar__tanya teks-kecil teks-lembut">{LABEL_REGION[r]}</div>
                <div className="tulis-tangan">{temuan}</div>
              </div>
            )
          })
        )}

        <div className="klinik-lembar__sublabel mono teks-xs teks-lembut">LABORATORIUM</div>
        {enc.labDipesan.length === 0 ? (
          <div className="klinik-lembar__kosong">&mdash; tidak ada pemeriksaan penunjang &mdash;</div>
        ) : (
          <>
            {enc.labTersedia.map((id) => {
              const item = PACK.lab[id]
              const hasil = kasus.lab.find((l) => l.id === id)
              const flag = hasil ? CHIP_FLAG[hasil.flag] : CHIP_FLAG['normal']
              return (
                <div key={id} className="klinik-lembar__qa klinik-tinta">
                  <div className="baris">
                    <span className="klinik-lembar__tanya teks-kecil teks-lembut">
                      {item?.nama ?? id}
                    </span>
                    {flag && <span className={`chip ${flag.kelas}`}>{flag.label}</span>}
                  </div>
                  <div className="tulis-tangan">
                    {hasil?.hasil ?? 'Dalam batas normal, tidak ada temuan bermakna.'}
                  </div>
                </div>
              )
            })}
            {labMenunggu.map((id) => (
              <div key={id} className="klinik-lembar__qa klinik-tinta baris">
                <span className="klinik-lembar__tanya teks-kecil teks-lembut">
                  {PACK.lab[id]?.nama ?? id}
                </span>
                <span className="chip chip--kunyit">hasil besok pagi</span>
              </div>
            ))}
          </>
        )}
      </section>

      {/* A — Asesmen */}
      <section className="klinik-lembar__seksi">
        <div className="judul-seksi">A &mdash; Asesmen (Diagnosis)</div>
        {enc.diagnosis ? (
          <div className="baris">
            <span
              key={`${enc.diagnosis.icd10}-${enc.diagnosis.jenis}`}
              className={`stempel stempel--jatuh ${
                enc.diagnosis.jenis === 'tegak' ? 'stempel--hijau' : 'stempel--biru'
              }`}
            >
              {enc.diagnosis.jenis === 'tegak' ? 'TEGAK' : 'SUSPEK'}
            </span>
            <div>
              <div className="tulis-tangan">{namaDiagnosis(enc.diagnosis.icd10, kasus)}</div>
              <div className="mono teks-xs teks-lembut">ICD-10: {enc.diagnosis.icd10}</div>
            </div>
          </div>
        ) : (
          <div className="klinik-lembar__kosong">&mdash; belum ditegakkan &mdash;</div>
        )}
      </section>

      {/* P — Penatalaksanaan */}
      <section className="klinik-lembar__seksi">
        <div className="judul-seksi">P &mdash; Penatalaksanaan</div>
        {enc.resep.length === 0 ? (
          <div className="klinik-lembar__kosong">&mdash; resep masih kosong &mdash;</div>
        ) : (
          enc.resep.map((id) => {
            const o = PACK.obat[id]
            return (
              <div key={id} className="klinik-lembar__resep klinik-tinta baris baris--antara">
                <span className="tulis-tangan">
                  R/ {o?.nama ?? id}
                  {o ? ` — ${o.sediaan}` : ''}
                </span>
                <button
                  className="tombol tombol--senyap klinik-lembar__coret"
                  onClick={() => dispatch({ type: 'HAPUS_OBAT', obatId: id })}
                  title={`Coret ${o?.nama ?? id} dari resep`}
                  // CODEX audit UI/UX 2026-07-10 (#15): tombol ini dulu HANYA
                  // berisi simbol "✕" dgn title statis "Coret dari resep" —
                  // nama obat tak disebut sama sekali (bahkan di title), jadi
                  // tak terbedakan dari baris resep lain sama sekali.
                  aria-label={`Coret ${o?.nama ?? id} dari resep`}
                >
                  &#10005;
                </button>
              </div>
            )
          })
        )}
        {enc.firewallTerpicu > 0 && (
          <div className="klinik-lembar__firewall">
            &#9888; {enc.firewallTerpicu}&times; percobaan resep dicegah sistem pengaman alergi
          </div>
        )}
        {enc.edukasi.length > 0 && (
          <div className="baris klinik-lembar__edukasi">
            <span className="teks-xs teks-lembut mono">EDUKASI:</span>
            {enc.edukasi.map((id) => (
              <span key={id} className="chip chip--daun">
                {PACK.edukasi[id]?.nama ?? id}
              </span>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
