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
  HARI_BUKA_KUNJUNGAN,
  HARI_BUKA_POSYANDU,
  HARI_BUKA_KLB,
} from '@engine/reducer'
import type { HasilKunjungan, KeluargaState } from '@engine/state'
import type { KeluargaBinaan } from '@content/types'
import { PACK } from '@content/index'
import { PetaSvg } from './peta/PetaSvg'
import { KartuKeluarga } from './peta/KartuKeluarga'
import { karmaTerlihat, LABEL_JARAK, LABEL_KLASIFIKASI } from './peta/petaUtil'
import { clusterAktif } from '@engine/surveilans'
import './PetaDesa.css'

const MAKS_BINAAN = 8

export function PetaDesa() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)

  const [rwTerpilih, setRwTerpilih] = useState<number | null>(null)
  const [hasilKunjungan, setHasilKunjungan] = useState<HasilKunjungan | null>(null)
  const tickTerproses = useRef(-1)

  // Kunjungan selesai → reducer memindah layar ke sini; sambut dengan kartu hasil.
  useEffect(() => {
    if (tickTerproses.current === eventTick) return
    tickTerproses.current = eventTick
    for (const e of lastEvents) {
      if (e.type === 'KUNJUNGAN_SELESAI') setHasilKunjungan(e.hasil)
    }
  }, [eventTick, lastEvents])

  /* -- Turunan tampilan (murni baca) ---------------------------------------- */

  // Titik merah karma hanya untuk keluarga yang datanya SUDAH dimiliki dokter
  // (gerbang provenance — lihat karmaTerlihat).
  const karmaRw = new Set<number>()
  for (const [id, kel] of Object.entries(state.desa.keluarga)) {
    if (karmaTerlihat(kel)) {
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
  const semuaCluster = clusterAktif(state)
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
    if (kel.arcSelesai === 'gagal')
      return { alasan: 'Krisis sudah terjadi — dampingi pemulihannya lewat klinik.', biaya }
    if (kel.arcIndex >= content.arc.kunjungan.length)
      return { alasan: 'Seluruh kunjungan keluarga ini sudah tuntas.', biaya }
    if (state.hari < HARI_BUKA_KUNJUNGAN)
      return { alasan: `Kunjungan rumah terbuka mulai hari ke-${HARI_BUKA_KUNJUNGAN}.`, biaya }
    if (state.blok !== 'siang') return { alasan: 'Kunjungan rumah hanya bisa dilakukan di blok siang.', biaya }
    if (state.hasilKunjunganHariIni)
      return { alasan: 'Slot lapangan hari ini sudah terpakai — lanjutkan ke sore.', biaya }
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
    if (terakhir !== undefined && state.hari - terakhir < 30)
      return `Posyandu RW ${rw} baru digelar — jadwalnya bulanan.`
    return alasanSlotLapangan(BIAYA_STAMINA_KEGIATAN)
  }
  function alasanKegiatanKlb(): string | null {
    return alasanSlotLapangan(BIAYA_STAMINA_KEGIATAN)
  }

  const keluargaHasil = hasilKunjungan ? PACK.keluarga[hasilKunjungan.keluargaId] : undefined

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
            ✓ dokter · ~ kader · ? belum ada data
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
                    title={`Keluarga ${content.namaKeluarga} — RW ${content.rw}. Klik untuk membuka RW-nya.`}
                  >
                    {karmaTerlihat(kel) && <span className="peta-roster-item__karma" aria-label="perlu perhatian" />}
                    <span className="peta-roster-item__nama">{content.namaKeluarga}</span>
                    <span className="chip">{iks === null ? 'IKS ?' : `IKS ${(iks * 100).toFixed(0)}`}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {rwTerpilih === null || !rwAktif ? (
          <div className="peta-petunjuk kertas tengah">
            <div className="kolom" style={{ alignItems: 'center', textAlign: 'center' }}>
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
                    IKS agregat {(rwAktif.iks * 100).toFixed(0)} · {LABEL_KLASIFIKASI[klasifikasiIks(rwAktif.iks)].label}
                  </span>
                ) : (
                  <span className="chip">belum ada data — kader belum sampai ke sini</span>
                )}
              </div>
              {clusterRwAktif.length > 0 && (
                <div className="baris teks-xs" style={{ flexWrap: 'wrap' }}>
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
              {state.hari >= HARI_BUKA_POSYANDU && (
                <button
                  className="tombol tombol--kunyit"
                  disabled={alasanKegiatanPosyandu(rwAktif.nomor) !== null}
                  title={alasanKegiatanPosyandu(rwAktif.nomor) ?? 'Gelar Posyandu bulanan di RW ini (blok siang, 2 stamina).'}
                  onClick={() => dispatch({ type: 'MULAI_POSYANDU', rw: rwAktif.nomor })}
                >
                  🍼 Gelar Posyandu
                </button>
              )}
              {state.hari >= HARI_BUKA_KLB &&
                clusterRwAktif.map((c) => (
                  <button
                    key={c.kasusId}
                    className="tombol tombol--bahaya"
                    disabled={alasanKegiatanKlb() !== null}
                    title={alasanKegiatanKlb() ?? 'Turun ke lapangan menyelidiki & mengendalikan kluster ini.'}
                    onClick={() => dispatch({ type: 'MULAI_KLB', rw: rwAktif.nomor, kasusId: c.kasusId })}
                  >
                    🚨 Respons KLB {PACK.kasus[c.kasusId]?.nama ?? c.kasusId}
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
                      binaan={state.desa.binaan.includes(content.id)}
                      rosterPenuh={state.desa.binaan.length >= MAKS_BINAAN}
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
          <div className="modal peta-hasil" onClick={(e) => e.stopPropagation()}>
            <span
              className={`stempel stempel--jatuh ${
                hasilKunjungan.diusir
                  ? 'stempel--merah'
                  : hasilKunjungan.berhasil
                    ? 'stempel--hijau'
                    : 'stempel--kunyit'
              }`}
            >
              {hasilKunjungan.diusir ? 'DIPERSILAKAN PULANG' : hasilKunjungan.berhasil ? 'KUNJUNGAN BERHASIL' : 'BELUM BERHASIL'}
            </span>
            <div className="peta-hasil__judul">
              Keluarga {keluargaHasil ? keluargaHasil.namaKeluarga : hasilKunjungan.keluargaId}
            </div>
            <p className="peta-hasil__narasi">{hasilKunjungan.narasiPenutup}</p>
            <div className="baris" style={{ justifyContent: 'center' }}>
              <span className="chip chip--biru">
                {hasilKunjungan.indikatorTerverifikasi.length} indikator terverifikasi ✓
              </span>
            </div>
            <p className="teks-xs teks-lembut">Rincian penilaian menantimu di debrief sore nanti.</p>
            <button className="tombol tombol--utama tombol--besar" onClick={() => setHasilKunjungan(null)}>
              Kembali ke Peta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
