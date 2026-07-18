/**
 * PETA DESA — papan keputusan UKM (Lapis 2): choropleth 8 RW kartu pos di kiri,
 * panel keluarga (roster binaan + kandidat per RW) di kanan.
 * Layar ini MEMBACA state & konten; semua aturan (IKS, guard kunjungan) datang
 * dari engine — UI hanya mencerminkan alasannya di tombol yang dinonaktifkan.
 */

import { useEffect, useRef, useState } from 'react'
import { useGame } from '../store'
import { hitungIksKeluarga, klasifikasiIks } from '@engine/pispk'
import {
  BIAYA_STAMINA_KUNJUNGAN,
  BIAYA_STAMINA_KEGIATAN,
  COOLDOWN_POSYANDU,
  HARI_BUKA_KUNJUNGAN,
  HARI_BUKA_POSYANDU,
  HARI_BUKA_KLB,
  MAKS_BINAAN,
} from '@engine/reducer'
import { arcKunjunganAktif } from '@engine/kunjungan'
import type { HasilKunjungan, KeluargaState } from '@engine/state'
import type { KeluargaBinaan } from '@content/types'
import { PACK } from '@content/index'
import { panduanSkenarioUkm } from '@content/ukmCitations'
import { PetaSvg } from './peta/PetaSvg'
import { KartuKeluarga } from './peta/KartuKeluarga'
import { formatIks, karmaTerlihat, LABEL_JARAK, LABEL_KLASIFIKASI } from './peta/petaUtil'
import { clusterAktif } from '@engine/surveilans'
import { useFocusTrap } from '../useFocusTrap'
import './PetaDesa.css'
import { tampilanHasilKunjungan } from './hasilKunjunganView'

export function PetaDesa() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)
  const petaTargetKeluargaId = useGame((s) => s.petaTargetKeluargaId)
  const setPetaTargetKeluargaId = useGame((s) => s.setPetaTargetKeluargaId)

  const [rwTerpilih, setRwTerpilih] = useState<number | null>(null)
  const [keluargaDitautkan, setKeluargaDitautkan] = useState<string | null>(null)
  const [hasilKunjungan, setHasilKunjungan] = useState<HasilKunjungan | null>(null)
  const tickTerproses = useRef(-1)
  // CODEX M10.a ronde-4 (dossier §44): backdrop sudah dismissible via klik —
  // Escape disamakan dgn itu.
  const refHasilKunjungan = useFocusTrap<HTMLDivElement>(hasilKunjungan !== null, () => setHasilKunjungan(null))

  // Kunjungan selesai → reducer memindah layar ke sini; sambut dengan kartu hasil.
  useEffect(() => {
    if (tickTerproses.current === eventTick) return
    tickTerproses.current = eventTick
    for (const e of lastEvents) {
      if (e.type === 'KUNJUNGAN_SELESAI') setHasilKunjungan(e.hasil)
    }
  }, [eventTick, lastEvents])

  // Surat yang menjanjikan "lihat keluarga" harus membuka RW dan menandai
  // kartu yang tepat, bukan sekadar membuang pemain ke peta umum.
  useEffect(() => {
    if (!petaTargetKeluargaId) return
    const keluarga = PACK.keluarga[petaTargetKeluargaId]
    if (keluarga) {
      setRwTerpilih(keluarga.rw)
      setKeluargaDitautkan(keluarga.id)
    }
    setPetaTargetKeluargaId(null)
  }, [petaTargetKeluargaId, setPetaTargetKeluargaId])

  /* -- Turunan tampilan (murni baca) ---------------------------------------- */

  // Titik merah karma hanya untuk keluarga yang datanya SUDAH dimiliki dokter
  // (gerbang provenance — lihat karmaTerlihat).
  const karmaRw = new Set<number>()
  for (const [id, kel] of Object.entries(state.desa.keluarga)) {
    if (karmaTerlihat(kel, state.hari)) {
      const c = PACK.keluarga[id]
      if (c) karmaRw.add(c.rw)
    }
  }

  const roster = state.desa.binaan
    .map((id) => ({ id, content: PACK.keluarga[id], kel: state.desa.keluarga[id] }))
    .filter((r): r is { id: string; content: KeluargaBinaan; kel: KeluargaState } =>
      Boolean(r.content && r.kel),
    )

  // Sinyal kluster surveilans (M1.2): diagnosis menular di poli → peringatan wilayah.
  const semuaCluster = clusterAktif(state, PACK)
  const clusterRwAktif = rwTerpilih === null ? [] : semuaCluster.filter((c) => c.rw === rwTerpilih)

  const rwAktif = rwTerpilih === null ? undefined : state.desa.rw.find((r) => r.nomor === rwTerpilih)
  const kandidat =
    rwTerpilih === null
      ? []
      : Object.values(PACK.keluarga)
          .filter((k) => k.rw === rwTerpilih)
          .sort((a, b) => a.namaKeluarga.localeCompare(b.namaKeluarga))

  /** Cermin guard reducer MULAI_KUNJUNGAN — supaya tombol jujur soal alasannya. */
  function infoKunjungan(content: KeluargaBinaan, kel: KeluargaState): { alasan: string | null; biaya: number } {
    const rwProfil = PACK.rw.find((r) => r.nomor === content.rw)
    const biaya = BIAYA_STAMINA_KUNJUNGAN[rwProfil?.jarak ?? 'sedang']
    // Fix #10: cermin gerbang roster reducer.ts — tombol Kunjungi jujur soal
    // alasannya utk keluarga non-roster, bukan sekadar tak berfungsi diam-diam.
    if (!state.desa.binaan.includes(content.id))
      return { alasan: 'Jadikan binaan dulu sebelum berkunjung.', biaya }
    if (kel.arcSelesai === 'gagal')
      return { alasan: 'Krisis sudah terjadi — dampingi pemulihannya lewat klinik.', biaya }
    // Audit CODEX UKM 2026-07-16 #1: progres arc dihitung atas daftar TERSARING
    // mode-policy (arcKunjunganAktif, cermin MULAI_KUNJUNGAN reducer) — bukan
    // panjang arc mentah yang bisa memuat skenario Career-only (buntu di Ujian).
    const arcAktif = arcKunjunganAktif(PACK, content, state.mode, state.contentRelease)
    if (kel.arcIndex >= arcAktif.length)
      return { alasan: 'Seluruh kunjungan keluarga ini sudah tuntas.', biaya }
    if (state.hari < HARI_BUKA_KUNJUNGAN)
      return { alasan: `Kunjungan rumah terbuka mulai hari ke-${HARI_BUKA_KUNJUNGAN}.`, biaya }
    if (state.blok !== 'siang') return { alasan: 'Kunjungan rumah hanya bisa dilakukan di blok siang.', biaya }
    if (state.lapanganTerpakai || state.hasilKunjunganHariIni)
      return { alasan: 'Slot lapangan hari ini sudah terpakai — lanjutkan ke sore.', biaya }
    if (state.kegiatan) return { alasan: 'Sedang ada kegiatan lapangan berjalan.', biaya }
    if (state.stamina < biaya)
      return { alasan: `Butuh ${biaya} stamina untuk perjalanan ke ${rwProfil ? rwProfil.nama : `RW ${content.rw}`}.`, biaya }
    return { alasan: null, biaya }
  }

  /** Cermin guard slot kegiatan (siang, satu slot/hari, stamina). */
  function alasanSlotLapangan(biaya: number): string | null {
    if (state.blok !== 'siang') return 'Kegiatan lapangan hanya di blok siang.'
    if (state.lapanganTerpakai || state.hasilKunjunganHariIni)
      return 'Slot lapangan hari ini sudah terpakai.'
    if (state.stamina < biaya) return `Butuh ${biaya} stamina untuk kegiatan ini.`
    return null
  }
  function alasanKegiatanPosyandu(rw: number): string | null {
    const terakhir = state.posyanduRwTerakhir[String(rw)]
    // Audit CODEX UKM 2026-07-16: cooldown per mode (Ujian 10 hari), bukan literal 30.
    const cooldown = COOLDOWN_POSYANDU[state.mode]
    if (terakhir !== undefined && state.hari - terakhir < cooldown)
      return `Posyandu RW ${rw} baru digelar — jadwal berikutnya ${cooldown} hari sejak sesi terakhir.`
    return alasanSlotLapangan(BIAYA_STAMINA_KEGIATAN)
  }
  function alasanKegiatanKlb(): string | null {
    return alasanSlotLapangan(BIAYA_STAMINA_KEGIATAN)
  }

  const keluargaHasil = hasilKunjungan ? PACK.keluarga[hasilKunjungan.keluargaId] : undefined
  const skenarioHasil = hasilKunjungan
    ? keluargaHasil?.arc.kunjungan.find((skenario) => skenario.id === hasilKunjungan.skenarioId)
    : undefined
  const tampilanHasil = hasilKunjungan ? tampilanHasilKunjungan(hasilKunjungan) : undefined
  const panduanHasil = skenarioHasil ? panduanSkenarioUkm(skenarioHasil) : undefined

  return (
    <div className="peta-root">
      {/* ---------------- KIRI: peta kartu pos ---------------- */}
      <section className="peta-kiri kertas">
        <div className="judul-seksi">Peta Pembinaan — Desa Sukamaju</div>
        <PetaSvg
          daftarRw={state.desa.rw}
          terpilih={rwTerpilih}
          karmaRw={karmaRw}
          onPilih={(nomor) => setRwTerpilih(nomor)}
        />
        <div className="peta-legenda">
          <span className="peta-legenda__item">
            <span className="peta-legenda__swatch" style={{ background: 'var(--kertas-400)' }} /> belum tersurvei
          </span>
          <span className="peta-legenda__item">
            <span className="peta-legenda__swatch" style={{ background: 'var(--daun-600)' }} /> sehat
          </span>
          <span className="peta-legenda__item">
            <span className="peta-legenda__swatch" style={{ background: 'var(--kunyit-600)' }} /> pra-sehat
          </span>
          <span className="peta-legenda__item">
            <span className="peta-legenda__swatch" style={{ background: 'var(--tinta-merah)' }} /> tidak sehat
          </span>
          <span className="peta-legenda__pisah" />
          <span className="mono" title="Provenance data indikator: hanya yang kamu verifikasi sendiri yang pasti benar.">
            ✓ dokter · ~ kader · ? belum ada data · ⧗ dijanjikan warga — menunggu verifikasi outcome
          </span>
        </div>
      </section>

      {/* ---------------- KANAN: panel keluarga ---------------- */}
      <section className="peta-kanan">
        <div className="peta-roster-blok kertas">
          <div className="judul-seksi">
            Roster Binaan ({roster.length}/{MAKS_BINAAN})
          </div>
          {roster.length === 0 ? (
            <p className="teks-kecil teks-lembut">
              Belum ada keluarga binaan. Klik petak RW, kenali keluarganya, lalu tekan “Jadikan Binaan”.
            </p>
          ) : (
            <div className="peta-roster">
              {roster.map(({ id, content, kel }) => {
                const iks = hitungIksKeluarga(kel)
                return (
                  <button
                    key={id}
                    className={`peta-roster-item ${rwTerpilih === content.rw ? 'peta-roster-item--aktif' : ''}`}
                    onClick={() => setRwTerpilih(content.rw)}
                    title={`${content.namaKeluarga} — RW ${content.rw}. Klik untuk membuka RW-nya.`}
                  >
                    {karmaTerlihat(kel, state.hari) && <span className="peta-roster-item__karma" aria-label="perlu perhatian" />}
                    <span className="peta-roster-item__nama">{content.namaKeluarga}</span>
                    <span className="chip">{iks === null ? 'IKS ?' : `IKS ${formatIks(iks)}`}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {rwTerpilih === null || !rwAktif ? (
          <div className="peta-petunjuk kertas tengah">
            <div className="kolom">
              <span className="peta-petunjuk__ikon" aria-hidden>
                ⌖
              </span>
              <p className="teks-lembut">
                Klik salah satu petak RW pada peta untuk melihat keluarga binaan-kandidat di sana.
              </p>
              <p className="teks-xs teks-pudar-hint">
                Warna petak dihitung dari data yang MASUK — RW abu-abu berarti kadernya belum menyurvei, bukan berarti
                sehat.
              </p>
            </div>
          </div>
        ) : (
          <div className="peta-detail kertas">
            <div className="peta-detail__kepala">
              <div className="baris baris--antara">
                <div className="peta-detail__judul">
                  RW {rwAktif.nomor} — {rwAktif.nama}
                </div>
                <span className="chip">jarak {LABEL_JARAK[rwAktif.jarak]}</span>
              </div>
              <div className="baris teks-xs teks-lembut mono">
                <span>
                  KK tersurvei {rwAktif.kkTersurvei}/{rwAktif.totalKk}
                </span>
                {rwAktif.kkTersurvei > 0 ? (
                  <span className={`chip ${LABEL_KLASIFIKASI[klasifikasiIks(rwAktif.iks)].chip}`}>
                    IKS agregat {formatIks(rwAktif.iks)} · {LABEL_KLASIFIKASI[klasifikasiIks(rwAktif.iks)].label}
                  </span>
                ) : (
                  <span className="chip">belum ada data — kader belum sampai ke sini</span>
                )}
              </div>
              {clusterRwAktif.length > 0 && (
                <div className="baris teks-xs peta-detail__cluster">
                  {clusterRwAktif.map((c) => (
                    <span key={c.kasusId} className="chip chip--merah" title="Kluster surveilans: beberapa kasus penyakit sama dari RW ini tercatat di poli dalam 14 hari — kunjungi wilayahnya.">
                      ⚠ KLUSTER {(PACK.kasus[c.kasusId]?.nama ?? c.kasusId).toUpperCase()} — {c.jumlah} kasus/14 hr
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Kegiatan lapangan M2: Posyandu per RW + Respons KLB per kluster */}
            <div className="peta-kegiatan">
              {state.hari >= HARI_BUKA_POSYANDU[state.mode] && (
                <button
                  className="tombol tombol--kunyit"
                  disabled={alasanKegiatanPosyandu(rwAktif.nomor) !== null}
                  title={alasanKegiatanPosyandu(rwAktif.nomor) ?? 'Gelar Posyandu bulanan di RW ini (blok siang, 2 stamina).'}
                  onClick={() => dispatch({ type: 'MULAI_POSYANDU', rw: rwAktif.nomor })}
                >
                  🍼 Gelar Posyandu
                </button>
              )}
              {state.hari >= HARI_BUKA_KLB[state.mode] &&
                clusterRwAktif.map((c) => (
                  <button
                    key={c.kasusId}
                    className="tombol tombol--bahaya"
                    disabled={alasanKegiatanKlb() !== null}
                    title={alasanKegiatanKlb() ?? 'Turun ke lapangan menyelidiki & mengendalikan kluster ini.'}
                    onClick={() => dispatch({ type: 'MULAI_KLB', rw: rwAktif.nomor, kasusId: c.kasusId })}
                  >
                    {/* Audit CODEX UKM 2026-07-16 #13: sinyal kluster BELUM tentu KLB —
                        label pra-kegiatan jujur soal langkah verifikasi dulu. */}
                    🚨 Verifikasi &amp; Respons Sinyal KLB {PACK.kasus[c.kasusId]?.nama ?? c.kasusId}
                  </button>
                ))}
            </div>

            <div className="peta-daftar">
              {kandidat.length === 0 ? (
                <p className="teks-kecil teks-lembut">
                  Tidak ada keluarga binaan-kandidat bernama di RW ini — KK-nya dikelola agregat lewat sensus kader.
                </p>
              ) : (
                kandidat.map((content) => {
                  const kel = state.desa.keluarga[content.id]
                  if (!kel) return null
                  const info = infoKunjungan(content, kel)
                  return (
                    <KartuKeluarga
                      key={content.id}
                      content={content}
                      kel={kel}
                      hari={state.hari}
                      binaan={state.desa.binaan.includes(content.id)}
                      rosterPenuh={state.desa.binaan.length >= MAKS_BINAAN}
                      ditautkan={keluargaDitautkan === content.id}
                      alasanKunjungan={info.alasan}
                      biayaStamina={info.biaya}
                      onBinaan={() => dispatch({ type: 'PILIH_BINAAN', keluargaId: content.id })}
                      onLepas={() => dispatch({ type: 'LEPAS_BINAAN', keluargaId: content.id })}
                      onKunjungi={() => dispatch({ type: 'MULAI_KUNJUNGAN', keluargaId: content.id })}
                    />
                  )
                })
              )}
            </div>
          </div>
        )}
      </section>

      {/* ---------------- Kartu hasil kunjungan (toast besar) ---------------- */}
      {hasilKunjungan && (
        <div className="overlay" onClick={() => setHasilKunjungan(null)}>
          <div
            ref={refHasilKunjungan}
            className="modal peta-hasil"
            role="dialog"
            aria-modal="true"
            aria-label="Hasil kunjungan"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`stempel stempel--jatuh ${tampilanHasil?.kelasWarna ?? 'stempel--kunyit'}`}
            >
              {tampilanHasil?.label}
            </span>
            <div className="peta-hasil__judul">
              {keluargaHasil ? keluargaHasil.namaKeluarga : hasilKunjungan.keluargaId}
            </div>
            <p className="peta-hasil__narasi">{hasilKunjungan.narasiPenutup}</p>
            {panduanHasil && (
              <aside className="peta-hasil__panduan">
                <b className="mono">LANDASAN RESMI</b>
                <p>{panduanHasil}</p>
              </aside>
            )}
            <div className="baris baris--tengah">
              {tampilanHasil?.substantif ? (
                <span className="chip chip--biru">
                  {hasilKunjungan.indikatorTerverifikasi.length} indikator terverifikasi ✓
                </span>
              ) : (
                <span className="chip chip--biru">
                  Janji ulang Hari {state.hari + (hasilKunjungan.ulangDalamHari ?? 1)}
                </span>
              )}
            </div>
            <p className="teks-xs teks-lembut">
              {tampilanHasil?.substantif
                ? 'Rincian penilaian menantimu di debrief sore nanti.'
                : 'Kontak awal ditutup tanpa menilai MI, indikator, atau perubahan perilaku.'}
            </p>
            <button className="tombol tombol--utama tombol--besar" onClick={() => setHasilKunjungan(null)}>
              Kembali ke Peta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
