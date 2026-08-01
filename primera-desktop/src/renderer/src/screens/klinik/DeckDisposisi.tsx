/**
 * DECK DISPOSISI — pulangkan / observasi / rujuk.
 *
 * Alur rujuk = SISRUTE berjenjang (M3.13):
 *   1) SBAR 4 kolom (dinilai engine — dipertahankan apa adanya).
 *   2) PEMILIH RS: kartu jejaring rujukan (PACK.rumahSakit). RS yang spesialisasinya
 *      COCOK dengan kebutuhan kasus aktif disorot & disorot-default (terdekat cocok),
 *      TAPI pilihan salah TIDAK dikunci — pemain belajar dari penolakan RS.
 *   3) Kirim → dispatch { type:'DISPOSISI', jenis:'rujuk', sbar, rumahSakitId }.
 *
 * Kartu pemilih tak menonjolkan rubrik karakter apa pun — hanya info operasional
 * (kelas, jarak, spesialisasi, estimasi bed). Engine yang memutuskan terima/tolak.
 */

import { useMemo, useState } from 'react'
import { PACK } from '@content/index'
import type { EncounterState, SbarIsi } from '@engine/state'
import type { Action } from '@engine/actions'
import type { JustifikasiRujuk, KasusKlinis, RumahSakit, SpesialisasiRs } from '@content/types'
import { formatRupiah } from './util'
import { useRadioGroup } from '../../useRadioGroup'
import './DeckDisposisi.css'

/**
 * M10.5 §3a (2026-07-12) TACC — label alasan rujukan di luar `harusDirujuk`.
 * Tak menyorot mana yang "valid" utk kasus aktif — deklarasi tetap penilaian
 * klinis pemain sendiri (validity-check nyata terjadi diam-diam di clinic.ts;
 * lihat debrief PanelHasil utk tahu apakah deklarasinya cocok).
 */
const LABEL_JUSTIFIKASI: Record<JustifikasiRujuk, string> = {
  komplikasi: 'Ada komplikasi di luar presentasi standar',
  komorbid: 'Ada komorbid yang mempersulit tata laksana FKTP',
  keterbatasan_fasilitas: 'Keterbatasan fasilitas/alat di Puskesmas ini',
}

interface Props {
  enc: EncounterState
  kasus: KasusKlinis
  dispatch: (action: Action) => void
  /** DeepThink "onboarding railroaded" (keputusan user). */
  tutorialAktif?: boolean
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

/** Label manusiawi untuk kelas RS. */
const LABEL_KELAS: Record<RumahSakit['kelas'], string> = {
  D: 'Kelas D',
  C: 'Kelas C',
  B: 'Kelas B',
}

/** Label Indonesia untuk chip spesialisasi. */
const LABEL_SPESIALIS: Record<SpesialisasiRs, string> = {
  penyakit_dalam: 'Penyakit Dalam',
  bedah: 'Bedah',
  anak: 'Anak',
  obgyn: 'Obgyn',
  saraf: 'Saraf',
  mata: 'Mata',
  tht: 'THT',
  jiwa: 'Jiwa',
  paru: 'Paru',
}

export function DeckDisposisi({ enc, kasus, dispatch, tutorialAktif = false }: Props) {
  const [modeRujuk, setModeRujuk] = useState(false)
  const [sbar, setSbar] = useState<SbarIsi>(SBAR_KOSONG)
  const [justifikasiRujuk, setJustifikasiRujuk] = useState<JustifikasiRujuk | undefined>(undefined)
  // §3a: opsi TACC hanya relevan bila kasus TIDAK wajib-rujuk (harusDirujuk
  // false) — kasus wajib-rujuk sudah benar tanpa perlu justifikasi apa pun.
  const tawarkanJustifikasi = !kasus.harusDirujuk

  const punyaDiagnosis = enc.diagnosis !== undefined
  const alasanTanpaDiagnosis =
    'Butuh diagnosis di kolom A. Fase diagnosis sudah lewat — bila kasus di luar kompetensi, rujuk.'

  const biayaLab = enc.labDipesan.reduce((total, id) => total + (PACK.lab[id]?.biaya ?? 0), 0)
  const biayaObat = enc.resep.reduce((total, id) => {
    const o = PACK.obat[id]
    if (!o) return total
    return total + (enc.pasien.bpjs ? o.hargaBeli : o.hargaJual)
  }, 0)
  // CODEX (2026-07-05): prosedur/tindakan (nebulisasi, Epley, dst.) sudah
  // membebani kapitasi sejak reducer diperbaiki — ringkasan biaya di sini
  // sebelumnya cuma lab+obat, jadi tak cocok dgn kas sungguhan.
  const biayaTindakan = enc.tindakan.reduce((total, id) => total + (PACK.tindakan[id]?.biaya ?? 0), 0)
  const observasi = kasus.observasi
  const observasiDimulai = enc.observasiDimulai === true
  const observasiSelesai = enc.observasiDilakukan === true
  const labMenunggu = enc.labDipesan.find(
    (id) =>
      PACK.lab[id]?.bolehTundaTerapi === true &&
      kasus.lab.some((item) => item.id === id && item.relevan),
  )

  // Fix #19a (audit CODEX 2026-07-11): gate submit dulu cuma cek non-kosong
  // (length>0, 1 karakter lolos) — tak selaras ambang kualitas SBAR sungguhan
  // di clinic.ts (sbarSkor menghitung tiap kolom >=20 karakter). Disamakan
  // supaya gate UI mencerminkan standar isi minimal yang sebenarnya dinilai.
  const AMBANG_SBAR_ISI = 20
  const sbarLengkap = KOLOM_SBAR.every(({ kunci }) => sbar[kunci].trim().length >= AMBANG_SBAR_ISI)

  /* Spesialisasi yang DIBUTUHKAN kasus aktif (bila kasus wajib-rujuk). */
  const spesialisDibutuhkan: SpesialisasiRs | undefined =
    PACK.kasus[enc.pasien.kasusId]?.spesialisRujukan

  /* Jejaring RS diurutkan: yang cocok dulu (terdekat), lalu sisanya (terdekat). */
  const rsUrut = useMemo<RumahSakit[]>(() => {
    const cocok = (rs: RumahSakit): boolean =>
      spesialisDibutuhkan !== undefined && rs.spesialisasi.includes(spesialisDibutuhkan)
    return [...PACK.rumahSakit].sort((a, b) => {
      const skorCocok = Number(cocok(b)) - Number(cocok(a))
      if (skorCocok !== 0) return skorCocok
      return a.jarakMenit - b.jarakMenit
    })
  }, [spesialisDibutuhkan])

  /* Default: RS cocok terdekat; bila tak ada yang cocok, RS terdekat apa pun. */
  const rsDefault = rsUrut[0]?.id
  const [rumahSakitId, setRumahSakitId] = useState<string | undefined>(rsDefault)
  const rsTerpilih = rumahSakitId ?? rsDefault
  // M10 §49: pemilih RS = radiogroup benar (dulu <button aria-pressed> tanpa
  // wrapper role). Persis satu terpilih → semantik radio, bukan toggle.
  const rsRadio = useRadioGroup<string>(
    rsUrut.map((r) => r.id),
    rsTerpilih ?? '',
    (id) => setRumahSakitId(id),
  )

  const bukaFormRujuk = () => {
    // Segarkan default saat form dibuka (kasus/antrian mungkin sudah berganti).
    setRumahSakitId(rsDefault)
    setJustifikasiRujuk(undefined)
    setModeRujuk(true)
  }

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
            <div className="baris baris--antara teks-kecil">
              <span>Tindakan ({enc.tindakan.length} item)</span>
              <span className="mono">{formatRupiah(biayaTindakan)}</span>
            </div>
            <div className="baris baris--antara klinik-billing__total">
              <span>Total</span>
              <span className="mono">{formatRupiah(biayaLab + biayaObat + biayaTindakan)}</span>
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
            {observasi && (
              <section
                className={`klinik-observasi${observasiSelesai ? ' klinik-observasi--selesai' : ''}`}
                aria-label="Observasi dan nilai ulang"
              >
                <div className="baris baris--antara">
                  <strong>Observasi & nilai ulang</strong>
                  <span className={`chip ${observasiSelesai ? 'chip--daun' : 'chip--kunyit'}`}>
                    {observasiSelesai
                      ? 'Selesai'
                      : observasiDimulai
                        ? 'Menunggu nilai ulang'
                        : `${observasi.durasiMenit} menit klinis`}
                  </span>
                </div>
                <p className="teks-kecil">{observasi.tujuan}</p>
                <ul className="klinik-observasi__parameter teks-xs teks-lembut">
                  {observasi.parameter.map((parameter) => (
                    <li key={parameter}>{parameter}</li>
                  ))}
                </ul>
                {observasiSelesai ? (
                  <div className="klinik-observasi__hasil" role="status">
                    <span className="mono teks-xs">HASIL NILAI ULANG</span>
                    <p className="teks-kecil">{observasi.hasilUlang}</p>
                  </div>
                ) : observasiDimulai ? (
                  <button
                    className="tombol tombol--kunyit tombol--besar"
                    onClick={() => dispatch({ type: 'NILAI_ULANG_OBSERVASI' })}
                    disabled={!punyaDiagnosis || tutorialAktif}
                    data-tip="Durasi klinis dikompresi. Periksa ulang parameter sebelum menentukan disposisi."
                  >
                    NILAI ULANG SETELAH {observasi.durasiMenit} MENIT
                  </button>
                ) : (
                  <button
                    className="tombol tombol--kunyit tombol--besar"
                    onClick={() => dispatch({ type: 'MULAI_OBSERVASI' })}
                    disabled={!punyaDiagnosis || tutorialAktif}
                    data-tip="Mulai siklus observasi. Hasil baru terbuka setelah kamu memilih nilai ulang."
                  >
                    MULAI OBSERVASI
                  </button>
                )}
              </section>
            )}
            <button
              className={`tombol tombol--utama tombol--besar${tutorialAktif ? ' klinik-sorot-tutorial' : ''}`}
              onClick={() => dispatch({ type: 'DISPOSISI', jenis: 'pulang' })}
              // M9.1: dulu cuma `!punyaDiagnosis` — benar krn KEBETULAN
              // KASUS_TUTORIAL selalu harusDirujuk:false, bukan krn diperiksa
              // eksplisit. Gerbang literal supaya benar walau kasus tutorial
              // berubah nanti (bukan asumsi implisit yang rapuh).
              disabled={!punyaDiagnosis || (tutorialAktif && kasus.harusDirujuk)}
              title={punyaDiagnosis ? undefined : alasanTanpaDiagnosis}
              data-tip="Pulangkan pasien dengan resep & edukasi."
            >
              PULANGKAN
            </button>
            {labMenunggu && !observasi && (
              <button
                className="tombol tombol--besar"
                onClick={() => dispatch({ type: 'DISPOSISI', jenis: 'observasi' })}
                disabled={!punyaDiagnosis || tutorialAktif}
                title={
                  tutorialAktif
                    ? 'Kasus latihan ini cukup dipulangkan.'
                    : punyaDiagnosis
                      ? undefined
                      : alasanTanpaDiagnosis
                }
                data-tip="Tutup kunjungan sementara dan jadwalkan pasien kembali saat hasil lab tersedia."
              >
                TUNGGU HASIL {PACK.lab[labMenunggu]?.nama.toUpperCase() ?? 'LAB'}
              </button>
            )}
            <button
              className="tombol tombol--kunyit tombol--besar"
              onClick={bukaFormRujuk}
              disabled={!punyaDiagnosis || tutorialAktif}
              title={
                tutorialAktif
                  ? 'Kasus latihan ini tidak perlu dirujuk.'
                  : punyaDiagnosis
                    ? undefined
                    : alasanTanpaDiagnosis
              }
              data-tip="Buka formulir rujukan SISRUTE: isi SBAR, lalu pilih rumah sakit tujuan."
            >
              RUJUK &rarr;
            </button>
            <span className="teks-xs teks-lembut">
              Ingat batas kompetensi SKDI: rujukan yang tidak diperlukan menurunkan mutu rujukan,
              sedangkan menahan kasus di luar kompetensi membahayakan pasien.
            </span>
          </div>
        ) : (
          <>
          {/* Sapuan 2026-07-16: form rujuk dipecah 3 grup langkah (TACC / SBAR /
              RS+kirim) — gap antar-grup dari parent, tembok form jadi bertahap. */}
          {tawarkanJustifikasi && (
          <div className="klinik-deck__grup">
                <div className="judul-seksi">Alasan Rujukan (opsional)</div>
                <span className="teks-kecil teks-lembut">
                  Kasus ini biasanya tuntas di FKTP. Bila menurutmu ADA alasan klinis sungguhan
                  untuk merujuk, pilih salah satu. Alasan yang tidak sesuai temuan klinis tetap
                  dinilai sebagai rujukan yang tidak diperlukan.
                </span>
                <div className="klinik-justifikasi">
                  {(Object.keys(LABEL_JUSTIFIKASI) as JustifikasiRujuk[]).map((opsi) => (
                    <label key={opsi} className="baris klinik-justifikasi__opsi">
                      <input
                        type="radio"
                        name="justifikasi-rujuk"
                        checked={justifikasiRujuk === opsi}
                        onChange={() => setJustifikasiRujuk(opsi)}
                      />
                      <span className="teks-kecil">{LABEL_JUSTIFIKASI[opsi]}</span>
                    </label>
                  ))}
                  {justifikasiRujuk !== undefined && (
                    <button
                      type="button"
                      className="tombol tombol--senyap teks-xs"
                      onClick={() => setJustifikasiRujuk(undefined)}
                    >
                      Batalkan alasan
                    </button>
                  )}
                </div>
          </div>
          )}

          <div className="klinik-deck__grup">
            {/* -- Langkah 1: SBAR (dipertahankan) -------------------------------- */}
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
                  spellCheck={false}
                />
              </label>
            ))}
            <span className="teks-xs teks-lembut">
              S: sebutkan kondisi &amp; tanda vital terukur &middot; B: riwayat singkat &middot; A:
              diagnosis kerja &middot; R: apa yang kamu minta dari RS.
            </span>

          </div>

          <div className="klinik-deck__grup">
            {/* -- Langkah 2: Pemilih RS SISRUTE ---------------------------------- */}
            <div className="judul-seksi">Pilih RS Tujuan</div>
            <span className="teks-xs teks-lembut">
              {spesialisDibutuhkan !== undefined ? (
                <>
                  Kasus ini butuh layanan{' '}
                  <strong>{LABEL_SPESIALIS[spesialisDibutuhkan]}</strong>. RS yang menyediakannya
                  ditandai <span className="chip chip--daun">cocok</span> &mdash; sudah tersorot yang
                  terdekat.
                </>
              ) : (
                <>Pilih RS tujuan rujukan dari jejaring SISRUTE di bawah.</>
              )}
            </span>

            <div className="sisrute-rs" {...rsRadio.groupProps} aria-label="Pilih rumah sakit tujuan rujukan">
              {rsUrut.map((rs) => {
                const cocok =
                  spesialisDibutuhkan !== undefined &&
                  rs.spesialisasi.includes(spesialisDibutuhkan)
                const dipilih = rsTerpilih === rs.id
                const kelasKartu = [
                  'sisrute-rs__kartu',
                  dipilih ? 'sisrute-rs__kartu--dipilih' : '',
                  cocok ? 'sisrute-rs__kartu--cocok' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={rs.id}
                    type="button"
                    className={kelasKartu}
                    {...rsRadio.radioProps(rs.id)}
                    onClick={() => setRumahSakitId(rs.id)}
                  >
                    <div className="sisrute-rs__kepala">
                      <span className="sisrute-rs__radio" aria-hidden="true" />
                      <span className="tumbuh">
                        <span className="sisrute-rs__nama">{rs.nama}</span>
                        <span className="sisrute-rs__meta">
                          <span className="chip">{LABEL_KELAS[rs.kelas]}</span>
                          <span className="chip">{rs.jarakMenit} menit</span>
                          <span className="chip">bed &plusmn; {rs.bedDasar}</span>
                          {cocok && <span className="chip chip--daun">cocok</span>}
                        </span>
                      </span>
                    </div>
                    <div className="sisrute-rs__spesialisasi">
                      {rs.spesialisasi.map((sp) => {
                        const alasan = spesialisDibutuhkan === sp
                        return (
                          <span
                            key={sp}
                            className={
                              alasan
                                ? 'chip chip--daun sisrute-rs__chip-cocok'
                                : 'chip'
                            }
                          >
                            {LABEL_SPESIALIS[sp]}
                          </span>
                        )
                      })}
                    </div>
                    {spesialisDibutuhkan !== undefined && !cocok && (
                      <span className="teks-xs sisrute-rs__catatan">
                        <span className="teks-lembut">
                          Tak punya layanan {LABEL_SPESIALIS[spesialisDibutuhkan]} &mdash; berisiko
                          ditolak &amp; dirujuk-ulang.
                        </span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <span className="teks-xs teks-lembut sisrute-rs__edu">
              SISRUTE memverifikasi rujukan: RS bisa <strong>menolak</strong> bila spesialisasi tak
              tersedia, tempat tidur penuh, atau kasus sebenarnya masih dapat ditangani di FKTP.
              Penolakan menambah pekerjaan administrasi dan menunda layanan. Pilih RS yang tepat
              sejak awal.
            </span>

            <button
              className="tombol tombol--kunyit tombol--besar"
              onClick={() =>
                dispatch({
                  type: 'DISPOSISI',
                  jenis: 'rujuk',
                  sbar,
                  rumahSakitId: rsTerpilih,
                  ...(justifikasiRujuk ? { justifikasiRujuk } : {}),
                })
              }
              disabled={!sbarLengkap || rsTerpilih === undefined}
              title={
                !sbarLengkap
                  ? `Isi keempat kolom SBAR dengan cukup detail dulu (minimal ${AMBANG_SBAR_ISI} karakter/kolom).`
                  : rsTerpilih === undefined
                    ? 'Pilih satu RS tujuan.'
                    : undefined
              }
              data-tip="Kirim rujukan ke RS terpilih melalui SISRUTE."
            >
              Kirim Rujukan (SISRUTE)
            </button>
            <button className="tombol tombol--senyap" onClick={() => setModeRujuk(false)}>
              &larr; Batal merujuk
            </button>
          </div>
          </>
        )}
      </div>

      <footer className="klinik-deck__footer">
        <span className="teks-xs teks-lembut">
          Keputusan akhir menutup konsultasi. Penilaian dihitung dari seluruh isi lembar.
        </span>
      </footer>
    </>
  )
}
