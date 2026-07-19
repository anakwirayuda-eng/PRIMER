/**
 * KUNJUNGAN RUMAH — match engine 4 babak dalam SATU layar penuh:
 * Salam & Observasi → Wawancara (MI/OARS) → Diagnosis Perilaku → Resep Sosial.
 *
 * Aturan emas gerbang kejujuran: respons warga yang BOHONG dirender persis sama
 * dengan respons jujur — tanpa penanda, warna, atau jeda berbeda. Pemain harus
 * menyadarinya sendiri dari kontradiksi dengan temuan hotspot babak 1.
 * Semua logika (trust, diusir, gerbang) milik engine; layar ini hanya panggung.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store'
import type { BabakKunjunganFase } from '@engine/state'
import type { Hambatan, PilihanDialog } from '@content/types'
import { PACK } from '@content/index'
import { sitasiIntervensiUkm } from '@content/ukmCitations'
import { hashSeed, Rng } from '@engine/core/rng'
import { arcKunjunganAktif, hariTindakLanjutKunjungan, skenarioEfektif } from '@engine/kunjungan'
import { acakUrutan } from '../utils/acakUrutan'
import { RumahIlustrasi } from './kunjungan/RumahIlustrasi'
import { useRadioGroup } from '../useRadioGroup'
import './Kunjungan.css'

/* ---------------------------------------------------------------------------
 * Kosakata tampilan
 * ------------------------------------------------------------------------- */

/**
 * M11 adopsi SAJI (Permenkes 39/2016, "M11 Lanjutan" Bagian E, 2026-07-16):
 * `sajiLabel` murni menandai babak dgn nomenklatur metode resmi kunjungan
 * rumah PIS-PK — display-only, tak mengubah `BabakKunjunganFase` (state.ts,
 * beku) ataupun urutan/logika babak sama sekali. Babak 3+4 game (diagnosis
 * perilaku, resep sosial) sama-sama masuk huruf J (Jelaskan & Bantu) SAJI;
 * huruf I (Ingatkan) belum punya babak game tersendiri (lihat Fase E-2).
 */
const BABAK: { fase: BabakKunjunganFase; label: string; sajiLabel: string }[] = [
  { fase: 'observasi', label: 'Salam & Observasi', sajiLabel: 'S — Salam' },
  { fase: 'wawancara', label: 'Wawancara', sajiLabel: 'A — Ajak Bicara' },
  { fase: 'diagnosis_perilaku', label: 'Diagnosis Perilaku', sajiLabel: 'J — Jelaskan & Bantu' },
  { fase: 'resep_sosial', label: 'Resep Sosial', sajiLabel: 'J — Jelaskan & Bantu' },
  { fase: 'ingatkan', label: 'Ingatkan', sajiLabel: 'I — Ingatkan' },
]

const GAYA_INFO: Record<PilihanDialog['gaya'], { label: string; simbol: string }> = {
  empati: { label: 'Empati', simbol: '♡' },
  refleksi: { label: 'Refleksi', simbol: '↺' },
  edukasi: { label: 'Edukasi', simbol: '✎' },
  menghakimi: { label: 'Menghakimi', simbol: '!' },
  menggurui: { label: 'Menggurui', simbol: '!' },
  menakut_nakuti: { label: 'Menakut-nakuti', simbol: '!' },
  memaksa: { label: 'Memaksa', simbol: '!' },
}

function isiPlaceholderJadwal(teks: string, hari: number): string {
  return teks.replaceAll('{jadwal}', `Hari ${hari}`)
}

const KARTU_HAMBATAN: { id: Hambatan; judul: string; sub: string; deskripsi: string }[] = [
  {
    id: 'kapabilitas',
    judul: 'Kapabilitas',
    sub: 'Tidak tahu, atau tidak mampu',
    deskripsi:
      'Pengetahuan, keterampilan, daya ingat, atau kondisi tubuh menghalangi mereka melakukannya — meski sebenarnya mau.',
  },
  {
    id: 'kesempatan',
    judul: 'Kesempatan',
    sub: 'Lingkungan tidak memungkinkan',
    deskripsi: 'Biaya, jarak, sarana, waktu, atau tekanan sosial di sekitar menutup jalannya — meski tahu dan mau.',
  },
  {
    id: 'motivasi',
    judul: 'Motivasi',
    sub: 'Belum merasa perlu, atau takut',
    deskripsi: 'Keyakinan, prioritas, pengalaman buruk, atau rasa malu membuat mereka belum siap berubah.',
  },
]

interface Ucapan {
  peran: 'dokter' | 'warga'
  teks: string
}

function Potret({ nama }: { nama: string }) {
  return (
    <span className="kunjungan-potret" aria-hidden>
      {nama.charAt(0).toUpperCase()}
    </span>
  )
}

/* ---------------------------------------------------------------------------
 * Layar
 * ------------------------------------------------------------------------- */

export function Kunjungan() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)

  const kj = state.kunjungan
  const kelContent = kj ? PACK.keluarga[kj.keluargaId] : undefined
  const skenarioDasar = kj && kelContent ? kelContent.arc.kunjungan.find((sk) => sk.id === kj.skenarioId) : undefined
  const skenario = skenarioDasar ? skenarioEfektif(skenarioDasar, kj?.varianId) : undefined

  /** Catatan percakapan lokal (untuk rekap babak 3) + respons yang sedang tampil. */
  const [riwayat, setRiwayat] = useState<Ucapan[]>([])
  const [responsAktif, setResponsAktif] = useState<string | null>(null)
  const [dokterTerakhir, setDokterTerakhir] = useState<string | null>(null)
  // Audit CODEX UKM 2026-07-16 #6: gaya pilihan diungkap SETELAH memilih (di
  // layar respons), bukan sebagai chip di tombol — simpan gaya terakhir dipilih.
  const [gayaTerakhir, setGayaTerakhir] = useState<PilihanDialog['gaya'] | null>(null)
  const [intervensiPilihan, setIntervensiPilihan] = useState<string | null>(null)
  const tickTerproses = useRef(-1)
  // M10 Batch-2 (CODEX A.1): saat respons warga tampil, tombol-tombol pilihan
  // dialog di-unmount → fokus keyboard jatuh ke <body>. Pindahkan ke tombol
  // "Lanjut →" (satu-satunya aksi berikutnya).
  const lanjutRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (responsAktif !== null) lanjutRef.current?.focus()
  }, [responsAktif])
  // CODEX M14 #14c: pergantian BABAK (observasi→wawancara→diagnosis→resep) meng-
  // unmount set tombol babak sebelumnya → fokus jatuh ke <body>. Pindahkan ke
  // root (pola DeckAksi). Tak bentrok dgn efek responsAktif di atas (pemicu beda).
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (responsAktif === null) rootRef.current?.focus({ preventScroll: true })
  }, [kj?.fase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tangkap ucapan warga dari event engine. Respons bohong TIDAK dibedakan —
  // sengaja: field `bohong` tidak pernah dibaca di layar ini.
  useEffect(() => {
    if (tickTerproses.current === eventTick) return
    tickTerproses.current = eventTick
    for (const e of lastEvents) {
      if (e.type === 'WARGA_BICARA') {
        setRiwayat((r) => [...r, { peran: 'warga', teks: e.teks }])
        setResponsAktif(e.teks)
      }
    }
  }, [eventTick, lastEvents])

  // Anti-bocor jawaban: konten menaruh intervensi yang cocok di posisi pertama —
  // acak urutan render sekali, deterministik per skenario (replay/testing aman).
  const intervensiAcak = useMemo(() => {
    if (!skenario) return []
    return new Rng(hashSeed('intervensi', skenario.id)).shuffle(skenario.intervensi)
  }, [skenario])
  // CODEX audit UI/UX review (workflow Batch-7): single-select murni (SATU
  // resep sosial), aria-pressed keliru dipakai sebelumnya — kartu yang sudah
  // aria-pressed="true" tak pernah ter-un-press oleh klik ulang, ciri BUKAN
  // toggle button. Pola sama persis MejaKerja.tsx Program Wilayah (role+
  // aria-checked saja, fallback '' agar tak ada kartu ke-checked keliru
  // sebelum ada pilihan).
  const intervensiRadio = useRadioGroup<string>(
    intervensiAcak.map((k) => k.id),
    intervensiPilihan ?? '',
    (id) => setIntervensiPilihan(id),
  )

  // Audit CODEX UKM 2026-07-16 #6: anti-tebakan dialog — konten cenderung
  // menaruh pilihan "tepat" di posisi tetap; acak urutan render deterministik
  // per-pemain (pola sama Igd/Kegiatan; skor tetap by pilihanId, bukan indeks).
  const dialogIndexAktif = kj?.dialogIndex ?? -1
  const pilihanAcak = useMemo(() => {
    const node = skenario && dialogIndexAktif >= 0 ? skenario.dialog[dialogIndexAktif] : undefined
    return node ? acakUrutan(node.pilihan, state.seed, 'kunjungan-dialog', dialogIndexAktif) : []
  }, [skenario, dialogIndexAktif, state.seed])

  const arcAktif = kelContent
    ? arcKunjunganAktif(PACK, kelContent, state.mode, state.contentRelease)
    : []
  const arcTamat = Boolean(kj && arcAktif.findIndex((item) => item.id === kj.skenarioId) === arcAktif.length - 1)
  const hariJanji = hariTindakLanjutKunjungan(state.hari, state.mode, arcTamat)
  const pilihanIngatkanAcak = useMemo(
    () => skenario?.pilihanIngatkan
      ? acakUrutan(skenario.pilihanIngatkan.pilihan, state.seed, 'kunjungan-ingatkan', 0)
      : [],
    [skenario, state.seed],
  )
  const pilihanPenerimaanAcak = useMemo(
    () => skenario?.penerimaanAwal
      ? acakUrutan(skenario.penerimaanAwal.pilihan, state.seed, 'kunjungan-penerimaan', 0)
      : [],
    [skenario, state.seed],
  )

  // CODEX ronde-13: `kj.hotspotDitemukan` korup (bukan array) crash `.includes`
  // di bawah bila lolos guard tanpa cek ini.
  if (!kj || !kelContent || !skenario || !Array.isArray(kj.hotspotDitemukan)) {
    return (
      <div className="kunjungan-root kunjungan-root--kosong tengah">
        <div className="kartu kolom" style={{ alignItems: 'center' }}>
          <p className="teks-lembut">Tidak ada kunjungan rumah yang sedang berjalan.</p>
          <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}>
            Kembali ke Peta Desa
          </button>
        </div>
      </div>
    )
  }

  const kepala = kelContent.anggota.find((a) => a.peran === 'kepala') ?? kelContent.anggota[0]
  const namaWarga = kepala ? kepala.nama : kelContent.namaKeluarga
  const nodeAktif = skenario.dialog[kj.dialogIndex]
  const wawancaraTuntas = kj.dialogIndex >= skenario.dialog.length
  const temuan = skenario.hotspot.filter((h) => kj.hotspotDitemukan.includes(h.id))
  const babakIndex = BABAK.findIndex((b) => b.fase === kj.fase)
  const ucapanWarga = riwayat.filter((u) => u.peran === 'warga')
  const intervensiAktif = intervensiPilihan
    ? skenario.intervensi.find((kartu) => kartu.id === intervensiPilihan)
    : undefined
  const sitasiIntervensiAktif = intervensiAktif
    ? sitasiIntervensiUkm(skenario, intervensiAktif)
    : undefined

  function pilihDialog(p: PilihanDialog) {
    setDokterTerakhir(p.teks)
    setGayaTerakhir(p.gaya)
    setRiwayat((r) => [...r, { peran: 'dokter', teks: p.teks }])
    dispatch({ type: 'PILIH_DIALOG', pilihanId: p.id })
  }

  function tulisResep() {
    if (!intervensiPilihan) return
    dispatch({ type: 'PILIH_INTERVENSI', intervensiId: intervensiPilihan })
  }

  function pilihIngatkan(pilihanId: string) {
    dispatch({ type: 'PILIH_INGATKAN', pilihanId })
  }

  function responsPenerimaan(pilihanId: string) {
    dispatch({ type: 'RESPONS_PENERIMAAN', pilihanId })
  }

  /* -- Kunci panel bawah per babak (remount → transisi halus) ---------------- */
  const kunciPanel =
    kj.fase === 'wawancara'
      ? responsAktif
        ? `respons-${riwayat.length}`
        : `node-${kj.dialogIndex}`
      : kj.fase

  return (
    <div className="kunjungan-root" ref={rootRef} tabIndex={-1}>
      {/* ---------------- Header: keluarga + stepper babak ---------------- */}
      <header className="kunjungan-header kertas">
        <div className="kunjungan-header__info">
          <div className="kunjungan-header__judul">{skenario.judul}</div>
          <div className="baris teks-xs teks-lembut">
            <span>{kelContent.namaKeluarga}</span>
            <span className="chip">RW {kelContent.rw}</span>
            {/* Audit CODEX UKM 2026-07-16 #1: nomor urut dihitung atas arc TERSARING
                mode-policy — konsisten dgn progres KartuKeluarga/PetaDesa. */}
            <span className="chip">
              Kunjungan ke-
              {nomorKunjunganArc(kj.skenarioId, arcAktif)}
            </span>
          </div>
        </div>
        <ol className="kunjungan-stepper">
          {BABAK.map((b, i) => (
            <li
              key={b.fase}
              className={`kunjungan-stepper__langkah ${
                i === babakIndex ? 'kunjungan-stepper__langkah--aktif' : ''
              } ${i < babakIndex || kj.fase === 'selesai' ? 'kunjungan-stepper__langkah--lewat' : ''}`}
              aria-current={i === babakIndex ? 'step' : undefined}
              title={`Metode SAJI (Permenkes 39/2016): ${b.sajiLabel}`}
            >
              <span className="kunjungan-stepper__angka mono">{i + 1}</span>
              <span className="kunjungan-stepper__label">{b.label}</span>
            </li>
          ))}
        </ol>
      </header>

      {/* ---------------- Panggung: interior rumah + hotspot ---------------- */}
      <div className={`kunjungan-scene ${kj.fase !== 'observasi' ? 'kunjungan-scene--redup' : ''}`}>
        <div className="kunjungan-panggung">
          <RumahIlustrasi />

          <div className="kunjungan-hotspot-lapis">
            {skenario.hotspot.map((h, i) => {
              const ketemu = kj.hotspotDitemukan.includes(h.id)
              if (!ketemu && kj.fase !== 'observasi') return null
              return (
                <button
                  key={h.id}
                  className={`kunjungan-hotspot ${ketemu ? 'kunjungan-hotspot--ketemu' : ''}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  onClick={() => dispatch({ type: 'KLIK_HOTSPOT', hotspotId: h.id })}
                  disabled={ketemu || kj.fase !== 'observasi'}
                  title={ketemu ? h.label : 'Ada yang menarik perhatianmu di sini'}
                  // CODEX audit UI/UX 2026-07-10 (#13): dulu SEMUA hotspot yang
                  // belum ditemukan berbagi aria-label literal identik — keyboard/
                  // screen-reader tak bisa membedakan 5 titik sama sekali (padahal
                  // pemain sighted sudah bisa, dari posisi x/y visual). Tambah
                  // urutan/posisi (info yang sudah publik secara visual) TANPA
                  // membocorkan identitas objek (h.label/h.narasi tetap disembunyikan).
                  aria-label={ketemu ? h.label : `Amati lebih dekat (titik ${i + 1} dari ${skenario.hotspot.length})`}
                >
                  {ketemu ? '✓' : ''}
                </button>
              )
            })}
          </div>
        </div>

        {/* Catatan temuan observasi — panel samping (sibling panggung, tak lagi
            menutupi scene) — tetap terlihat sampai wawancara usai */}
        {(kj.fase === 'observasi' || kj.fase === 'wawancara' || kj.fase === 'diagnosis_perilaku') && (
          <aside className="kunjungan-temuan">
            <div className="kunjungan-temuan__judul mono">CATATAN OBSERVASI</div>
            {temuan.length === 0 ? (
              <span className="teks-xs teks-lembut">Belum ada temuan — amati ruangan pelan-pelan…</span>
            ) : (
              temuan.map((h) => (
                <div key={h.id} className="kunjungan-temuan__kartu kertas">
                  <b>{h.label}</b>
                  <p>{h.narasi}</p>
                </div>
              ))
            )}
          </aside>
        )}
      </div>

      {/* ---------------- Panel bawah per babak ---------------- */}
      <div className="kunjungan-panel" key={kunciPanel}>
        {kj.fase === 'penerimaan' && skenario.penerimaanAwal && (
          <div className="kunjungan-pembuka kunjungan-penerimaan kertas">
            <div className="baris baris--antara">
              <span className="chip chip--biru">KONTAK PERTAMA</span>
              <span className="teks-xs teks-lembut">{kelContent.namaKeluarga}</span>
            </div>
            <p className="kunjungan-pembuka__teks">{skenario.penerimaanAwal.narasi}</p>
            <div className="kunjungan-pilihan-baris" role="group" aria-label="Respons terhadap penerimaan keluarga">
              {pilihanPenerimaanAcak.map((pilihan) => (
                <button
                  key={pilihan.id}
                  className="kunjungan-pilihan kartu kartu--klik"
                  onClick={() => responsPenerimaan(pilihan.id)}
                >
                  <span className="kunjungan-pilihan__teks">
                    {isiPlaceholderJadwal(
                      pilihan.teks,
                      state.hari + skenario.penerimaanAwal!.ulangDalamHari,
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {kj.fase === 'observasi' && (
          <div className="kunjungan-pembuka kertas">
            <p className="kunjungan-pembuka__teks">{skenario.pembuka}</p>
            <div className="baris baris--antara">
              <span className="teks-kecil teks-lembut">
                {temuan.length === 0
                  ? 'Amati ruangan pelan-pelan — rumah sering bercerita lebih jujur daripada tuan rumahnya.'
                  : `${temuan.length} temuan tercatat di buku sakumu.`}
              </span>
              <button className="tombol tombol--utama" onClick={() => dispatch({ type: 'LANJUT_BABAK' })}>
                Mulai Berbincang →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && responsAktif && (
          <div className="kunjungan-wawancara">
            {/* M10 Batch-2 (A.1): live region — respons warga diumumkan SR. */}
            <div className="kunjungan-dialog kertas" role="status" aria-live="polite">
              <Potret nama={namaWarga} />
              <div className="kunjungan-dialog__isi">
                {dokterTerakhir && (
                  // CODEX audit UI/UX 2026-07-10 (#14): PilihanDialog.teks di
                  // SELURUH 246 entri konten sudah membawa tanda kutip lurus
                  // sendiri di kontennya — bungkus “ ” di sini bikin kutip
                  // ganda bersarang. Render apa adanya, konten yang menentukan
                  // kutipnya sendiri.
                  <p className="kunjungan-dialog__gema teks-xs teks-lembut">Kamu: {dokterTerakhir}</p>
                )}
                <div className="kunjungan-dialog__nama mono">{namaWarga}</div>
                <p className="kunjungan-dialog__teks">“{responsAktif}”</p>
                {/* #6: gaya diungkap DI SINI (pasca-pilih) — bahan refleksi MI,
                    bukan kunci tebakan sebelum memilih. */}
                {gayaTerakhir && (
                  <p className="teks-xs teks-lembut">
                    Gaya: {GAYA_INFO[gayaTerakhir].simbol} {GAYA_INFO[gayaTerakhir].label}
                  </p>
                )}
              </div>
              <button ref={lanjutRef} className="tombol tombol--utama" onClick={() => setResponsAktif(null)}>
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && !responsAktif && nodeAktif && (
          <div className="kunjungan-wawancara">
            <div className="kunjungan-dialog kertas">
              <Potret nama={namaWarga} />
              <div className="kunjungan-dialog__isi">
                <p className="kunjungan-dialog__narasi">{nodeAktif.narasi}</p>
              </div>
            </div>
            <div className="kunjungan-pilihan-baris">
              {/* Audit CODEX UKM 2026-07-16 #6: chip gaya (Empati/Refleksi/...)
                  DISEMBUNYIKAN sebelum dipilih — dulu jadi kunci tebakan meta
                  ("selalu klik yang berlabel Empati"). Kelas warna per-gaya juga
                  dilepas (bocoran identitas yang sama lewat kode warna); gaya
                  baru diungkap di layar respons setelah memilih. */}
              {pilihanAcak.map((p) => (
                <button key={p.id} className="kunjungan-pilihan kartu kartu--klik" onClick={() => pilihDialog(p)}>
                  {/* #14 (sama alasan di atas): p.teks sudah berkutip sendiri. */}
                  <span className="kunjungan-pilihan__teks">{p.teks}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {kj.fase === 'wawancara' && !responsAktif && !nodeAktif && wawancaraTuntas && (
          <div className="kunjungan-pembuka kertas">
            <p className="kunjungan-pembuka__teks">
              Perbincangan mereda. Gelas teh sudah setengah kosong — saatnya menimbang apa yang sebenarnya menahan
              keluarga ini.
            </p>
            <div className="baris baris--kanan">
              <button className="tombol tombol--utama" onClick={() => dispatch({ type: 'LANJUT_BABAK' })}>
                Ambil Kesimpulan →
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'diagnosis_perilaku' && (
          <div className="kunjungan-diagnosis">
            <div className="kunjungan-rekap kertas">
              <div className="judul-seksi">Apa yang kamu lihat &amp; dengar</div>
              <div className="kunjungan-rekap__kolom">
                <div>
                  <b className="teks-xs mono">TERLIHAT</b>
                  {temuan.length === 0 ? (
                    <p className="teks-xs teks-lembut">Kamu tidak sempat mengamati rumah mereka.</p>
                  ) : (
                    <ul>
                      {temuan.map((h) => (
                        <li key={h.id} className="teks-kecil">
                          {h.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <b className="teks-xs mono">TERDENGAR</b>
                  {ucapanWarga.length === 0 ? (
                    <p className="teks-xs teks-lembut">Tidak ada ucapan yang tercatat.</p>
                  ) : (
                    <ul>
                      {ucapanWarga.map((u, i) => (
                        <li key={i} className="teks-kecil">
                          “{u.teks}”
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="kunjungan-hambatan-baris">
              {KARTU_HAMBATAN.map((k) => (
                <button
                  key={k.id}
                  className={`kunjungan-hambatan kartu kartu--klik kunjungan-hambatan--${k.id}`}
                  onClick={() => dispatch({ type: 'KOMIT_HAMBATAN', hipotesis: k.id })}
                >
                  <span className="kunjungan-hambatan__judul">{k.judul}</span>
                  <span className="kunjungan-hambatan__sub">{k.sub}</span>
                  <p className="kunjungan-hambatan__deskripsi teks-xs teks-lembut">{k.deskripsi}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {kj.fase === 'resep_sosial' && (
          <div className="kunjungan-resep">
            <div className="kunjungan-resep__baris" role="radiogroup" aria-label="Pilihan resep sosial">
              {intervensiAcak.map((k) => (
                // CODEX M14 #15: spread props radiogroup PENUH (tabIndex/data-radio/
                // onKeyDown), bukan cuma role+aria-checked — kartu resep sosial tak
                // pernah terkunci, jadi roving tabindex + navigasi panah harus aktif
                // (pola W3C radiogroup). Dulu semua tombol jadi tab-stop & panah mati.
                <button
                  key={k.id}
                  {...intervensiRadio.radioProps(k.id)}
                  className={`kunjungan-intervensi kartu kartu--klik ${
                    intervensiPilihan === k.id ? 'kunjungan-intervensi--terpilih' : ''
                  }`}
                  onClick={() => setIntervensiPilihan(k.id)}
                >
                  <b>{k.nama}</b>
                  <p className="teks-kecil teks-lembut">{k.deskripsi}</p>
                </button>
              ))}
            </div>
            {sitasiIntervensiAktif && (
              <aside
                className="kunjungan-resep__sitasi"
                role="status"
                aria-live="polite"
                aria-label="Konteks ilmiah kartu terpilih, bukan penanda benar atau salah"
              >
                <div className="baris">
                  <span className="chip chip--biru">{sitasiIntervensiAktif.pinkesga}</span>
                  <span className="chip">{sitasiIntervensiAktif.labelDukungan}</span>
                </div>
                <p>{sitasiIntervensiAktif.sumber}</p>
              </aside>
            )}
            <div className="baris baris--antara">
              <span className="teks-kecil teks-lembut">
                Pilih SATU resep sosial yang menjawab hambatan sebenarnya — bukan yang paling terdengar medis.
              </span>
              <button
                className="tombol tombol--utama tombol--besar"
                disabled={!intervensiPilihan}
                title={intervensiPilihan ? 'Tutup kunjungan dengan resep sosial ini.' : 'Pilih satu kartu intervensi dulu.'}
                onClick={tulisResep}
              >
                Tulis Resep Sosial ✎
              </button>
            </div>
          </div>
        )}

        {kj.fase === 'ingatkan' && skenario.pilihanIngatkan && (
          <div className="kunjungan-ingatkan kertas">
            <div className="baris baris--antara">
              <span className="chip chip--biru">I — INGATKAN</span>
              <span className="teks-xs teks-lembut">Penutup SAJI</span>
            </div>
            <p className="kunjungan-pembuka__teks">{skenario.pilihanIngatkan.prompt}</p>
            <div className="kunjungan-pilihan-baris" role="group" aria-label="Pilihan pengingat penutup">
              {pilihanIngatkanAcak.map((pilihan) => (
                <button
                  key={pilihan.id}
                  className="kunjungan-pilihan kartu kartu--klik"
                  onClick={() => pilihIngatkan(pilihan.id)}
                >
                  <span className="kunjungan-pilihan__teks">
                    {isiPlaceholderJadwal(pilihan.teks, hariJanji)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Nomor urut skenario dalam arc (untuk chip "Kunjungan ke-n"). */
function nomorKunjunganArc(skenarioId: string, kunjungan: { id: string }[]): number {
  const i = kunjungan.findIndex((k) => k.id === skenarioId)
  return i < 0 ? 1 : i + 1
}
