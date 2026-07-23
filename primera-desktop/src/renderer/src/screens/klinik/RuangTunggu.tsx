/**
 * RUANG TUNGGU — tampilan klinik tanpa pasien aktif: antrian kartu pasien,
 * tombol panggil (dengan alasan disabled yang jelas), rekap pasien selesai,
 * dan arahan LANJUTKAN saat antrian kosong.
 */

import { PACK } from '@content/index'
import type { GameState } from '@engine/state'
import { kasusEfektif } from '@engine/clinic'
import type { Action } from '@engine/actions'
import { formatUsia } from '@engine/usia'
import { labelJk } from './util'
import { PotretPasien } from './PotretPasien'

interface Props {
  state: GameState
  dispatch: (action: Action) => void
}

export function RuangTunggu({ state, dispatch }: Props) {
  const antrian = state.klinik.antrian
  const selesai = state.klinik.selesaiHariIni
  const auto = state.klinik.autoHariIni
  const pagi = state.blok === 'pagi'
  const berikutnya = antrian[0]

  const bolehPanggil = pagi && berikutnya !== undefined && state.stamina >= 1
  const alasanPanggil = !pagi
    ? 'Poli hanya buka di blok pagi.'
    : berikutnya === undefined
      ? 'Antrian kosong.'
      : state.stamina < 1
        ? 'Staminamu habis — lanjutkan hari untuk beristirahat.'
        : `Panggil ${berikutnya.nama} ke ruang periksa (1 stamina).`

  return (
    <div className="klinik-tunggu">
      <header className="klinik-tunggu__kop kertas">
        <div>
          <div className="judul-seksi">Poli Umum &mdash; Loket Antrian</div>
          <div className="klinik-tunggu__judul">
            {pagi ? 'Pasien menunggu dipanggil.' : 'Poli sudah tutup untuk hari ini.'}
          </div>
        </div>
        <div className="klinik-tunggu__stamina teks-kecil teks-lembut">
          Stamina <span className="mono">{state.stamina}/6</span> &middot; 1 pip per pasien
        </div>
      </header>

      {antrian.length > 0 ? (
        <div className="klinik-tunggu__antrian">
          {antrian.map((p, i) => {
            // M11 #4 Tingkat A: preview ruang tunggu harus konsisten dgn
            // keluhanUtama yang nanti tampil di ruang periksa untuk pasien ini.
            const kasusDasar = PACK.kasus[p.kasusId]
            const kasus = kasusDasar ? kasusEfektif(kasusDasar, p.varianId) : kasusDasar
            return (
              <article
                key={p.id}
                className={`kartu klinik-tunggu__kartu${i === 0 ? ' kartu--tebal' : ''}`}
              >
                <span className="klinik-tunggu__nomor mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <PotretPasien pasien={p} ukuran="kecil" />
                <div className="tumbuh">
                  <div className="baris">
                    <span className="klinik-tunggu__nama">{p.nama}</span>
                    <span className="teks-xs teks-lembut">
                      {formatUsia(p.usia, p.usiaBulan)} &middot; {labelJk(p.jenisKelamin)}
                    </span>
                  </div>
                  <div className="klinik-tunggu__keluhan teks-kecil">
                    {kasus?.keluhanUtamaOlehPendamping && (
                      <span className="teks-xs teks-lembut">Dituturkan pendamping: </span>
                    )}
                    &ldquo;{kasus?.keluhanUtama ?? 'Datang dengan keluhan yang belum jelas.'}&rdquo;
                  </div>
                  {p.followUpDari !== undefined && (
                    <div className="teks-xs klinik-tunggu__kembali">{p.followUpDari}</div>
                  )}
                </div>
                <div className="kolom klinik-tunggu__chips">
                  {p.bpjs ? (
                    <span className="chip chip--biru">BPJS</span>
                  ) : (
                    <span className="chip">Umum</span>
                  )}
                  {p.bonusTrust && (
                    <span
                      className="chip chip--daun"
                      data-tip="Dari keluarga yang kamu bina — mereka lebih terbuka padamu."
                    >
                      Keluarga binaanmu
                    </span>
                  )}
                  {p.followUpDari !== undefined && (
                    <span className="chip chip--merah">KEMBALI</span>
                  )}
                </div>
              </article>
            )
          })}

          <button
            className="tombol tombol--utama tombol--besar klinik-tunggu__panggil"
            onClick={() => dispatch({ type: 'PANGGIL_PASIEN' })}
            disabled={!bolehPanggil}
            title={bolehPanggil ? undefined : alasanPanggil}
            data-tip={alasanPanggil}
          >
            Panggil Pasien Berikutnya
            {berikutnya !== undefined ? ` — ${berikutnya.nama}` : ''}
          </button>
          {/* Sapuan 2026-07-16: alasan terkunci dulu hanya di title (hover) —
              kini caption terlihat, pemain tak menebak kenapa tombol mati. */}
          {!bolehPanggil && alasanPanggil !== undefined && (
            <span className="teks-xs teks-lembut klinik-tunggu__alasan">{alasanPanggil}</span>
          )}
        </div>
      ) : (
        <div className="kartu klinik-tunggu__kosong">
          <div className="klinik-tunggu__kosong-judul">
            {pagi && selesai.length > 0
              ? 'Semua pasien pilihan hari ini sudah kamu tangani.'
              : pagi
                ? 'Belum ada pasien di antrian.'
                : 'Ruang tunggu sepi. Sampai jumpa besok pagi.'}
          </div>
          <p className="teks-kecil teks-lembut">
            {pagi
              ? 'Tutup poli dan alirkan waktu — sisa harimu menunggu di lapangan dan meja kerja.'
              : 'Antrian baru disusun tiap pagi oleh keadaan desa (dan keputusanmu kemarin).'}
          </p>
          {pagi ? (
            <button
              className="tombol tombol--utama tombol--besar"
              onClick={() => dispatch({ type: 'LANJUTKAN' })}
              data-tip="Lanjutkan ke blok siang."
            >
              Tutup Poli &mdash; Lanjut ke Siang &rarr;
            </button>
          ) : (
            <button
              className="tombol"
              onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'meja' })}
            >
              Ke Meja Kerja &rarr;
            </button>
          )}
        </div>
      )}

      {(selesai.length > 0 || auto.jumlah > 0) && (
        <footer className="klinik-tunggu__rekap kertas">
          <div className="judul-seksi">Selesai Hari Ini</div>
          <div className="baris klinik-tunggu__rekap-baris">
            {selesai.map((n, i) => (
              <span
                key={`${n.kasusId}_${i}`}
                className={`chip ${
                  n.grade === 'A' || n.grade === 'B'
                    ? 'chip--daun'
                    : n.grade === 'C'
                      ? 'chip--kunyit'
                      : 'chip--merah'
                }`}
              >
                {n.pasienNama} — {n.grade}
              </span>
            ))}
            {auto.jumlah > 0 && (
              <span className="teks-xs teks-lembut">
                +{auto.jumlah} pasien lain ditangani sesuai instingmu (auto).
              </span>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
