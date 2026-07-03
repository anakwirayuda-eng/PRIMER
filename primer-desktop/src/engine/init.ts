/**
 * INIT — membangun GameState awal dari ContentPack.
 * Hari 1 dimulai di meja kerja dengan surat sambutan + antrian pagi pertama.
 */

import type { GameState, KeluargaState, ModeStase, NilaiIndikator, Surat } from './state'
import type { ContentPack } from '@content/pack'
import type { IndikatorPisPk, StatusIndikator } from '@content/types'
import { Rng } from './core/rng'
import { susunAntrianHarian } from './director'
import { STAMINA_MAKS } from './reducer'
import { HARI_STASE, pilihPaket } from './paketUjian'

const SEMUA_INDIKATOR: IndikatorPisPk[] = [
  'kb',
  'persalinan_faskes',
  'imunisasi_dasar',
  'asi_eksklusif',
  'pantau_tumbuh_kembang',
  'tb_berobat_standar',
  'hipertensi_berobat',
  'jiwa_tidak_ditelantarkan',
  'tidak_merokok',
  'jkn',
  'air_bersih',
  'jamban_sehat',
]

function buatKeluargaState(id: string, pack: ContentPack): KeluargaState {
  const content = pack.keluarga[id]
  const indikator = {} as Record<IndikatorPisPk, NilaiIndikator>
  for (const ind of SEMUA_INDIKATOR) {
    const nilai: StatusIndikator = content?.indikatorAwal[ind] ?? 'na'
    indikator[ind] = {
      status: nilai, // UI hanya menampilkan bila sumber !== 'belum'
      statusSebenarnya: nilai,
      sumber: 'belum',
      hariData: 0,
    }
  }
  return {
    id,
    trust: 2,
    ttm: 'prekontemplasi',
    indikator,
    arcIndex: 0,
    jumlahKunjungan: 0,
  }
}

/** M4.18 — stok awal gudang: 12 unit per obat formularium. */
export function stokAwal(pack: ContentPack): Record<string, number> {
  const stok: Record<string, number> = {}
  for (const id of Object.keys(pack.obat)) stok[id] = 12
  return stok
}

function suratSambutan(namaDokter: string, mode: ModeStase, namaPaket?: string): Surat[] {
  const durasi = HARI_STASE[mode]
  return [
    {
      id: 'surat_1_0',
      hari: 1,
      jenis: 'sistem',
      dari: 'dr. Harsono, Kepala Puskesmas',
      judul: mode === 'ujian' ? `Stase ujian dimulai — ${namaPaket ?? 'paket ujian'}` : 'Selamat datang di Sukamaju',
      isi:
        mode === 'ujian'
          ? `Dokter ${namaDokter}, ini stase UJIAN: ${durasi} hari, dan skormu terkunci di hari terakhir untuk disetorkan ke kampus (${namaPaket ?? 'paket ujian'}). Aturannya sama dengan praktik sungguhan: poli pagi, lapangan siang, administrasi sore. Tidak ada ulangan dan tidak ada kunci jawaban — yang dinilai adalah caramu berpikir, tercatat di setiap keputusan. Mulailah dari klinik; pasien pertamamu sudah menunggu.`
          : `Dokter ${namaDokter}, selamat bergabung. Sembilan puluh hari ke depan, desa ini tanggung jawabmu: poli di pagi hari, pembinaan keluarga di siang hari, dan — percayalah — surat-surat yang tidak pernah habis. Mulailah dari klinik. Pasien pertamamu sudah menunggu. Satu nasihat dari saya: di sini, angka yang tidak kamu periksa sendiri adalah angka yang belum ada.`,
      dibaca: false,
    },
    {
      id: 'surat_1_1',
      hari: 1,
      jenis: 'tutorial',
      dari: 'Sistem',
      judul: 'Cara bermain — hari pertamamu',
      isi: `Hari berjalan dalam 3 blok: PAGI (klinik), SIANG (lapangan), SORE (meja kerja). Tekan LANJUTKAN untuk mengalir. Di klinik: panggil pasien, gali anamnesis (perhatikan kesabaran pasien!), periksa fisik, komit diagnosis dengan stempel TEGAK bila yakin atau SUSPEK bila masih diagnosis kerja — kejujuran epistemikmu ikut dinilai. Stamina 6 pip per hari; setiap pasien playable memakan 1 pip. Besok, Peta Desa terbuka.`,
      dibaca: false,
    },
  ]
}

export function buildInitialState(
  namaDokter: string,
  seed: number,
  pack: ContentPack,
  opsi?: { mode?: ModeStase },
): GameState {
  // M4.5 — pemisahan seed (docs/M45_MODE_UJIAN.md): Karier byte-identik dgn
  // perilaku lama (seedKurikulum = seed); Ujian memakai seed paket bersama.
  const mode: ModeStase = opsi?.mode ?? 'karier'
  const paket = mode === 'ujian' ? pilihPaket(seed) : undefined
  const seedKurikulum = paket ? paket.seedKurikulum : seed

  const keluarga: Record<string, KeluargaState> = {}
  for (const id of Object.keys(pack.keluarga)) keluarga[id] = buatKeluargaState(id, pack)

  // Karma loop: krisis keluarga rawan TERJADWAL SEJAK HARI PERTAMA — kunjungan
  // yang berhasil membatalkannya. "Konsekuensi bernama" bukan hukuman acak;
  // ia jam pasir yang sudah berjalan sebelum dokter tahu.
  const jadwalKarma = []
  for (const [id, content] of Object.entries(pack.keluarga)) {
    const skenarioPertama = content.arc.kunjungan[0]
    if (!skenarioPertama?.karma) continue
    const jadwalId = `jadwal_karma_${id}`
    // Identitas anggota yang akan jatuh sakit — konsekuensi BERNAMA.
    const anggota = content.anggota[skenarioPertama.karma.anggotaIndex]
    jadwalKarma.push({
      id: jadwalId,
      hari: skenarioPertama.karma.jatuhTempoHari,
      jenis: 'karma_igd' as const,
      keluargaId: id,
      kasusId: skenarioPertama.karma.kasusId,
      catatan: skenarioPertama.karma.narasi,
      rw: content.rw,
      ...(anggota ? { nama: anggota.nama, usia: anggota.usia, jenisKelamin: anggota.jenisKelamin } : {}),
    })
    const kel = keluarga[id]
    if (kel) {
      keluarga[id] = { ...kel, karmaAktif: { jadwalId, jatuhTempoHari: skenarioPertama.karma.jatuhTempoHari } }
    }
  }

  const kader = Object.fromEntries(
    pack.kader.map((k) => [
      k.id,
      { id: k.id, nama: k.nama, rw: k.rw, ketelitian: k.ketelitian, bias: k.bias, kkTersurvei: 0 },
    ]),
  )

  const rw = pack.rw.map((r) => ({
    nomor: r.nomor,
    nama: r.nama,
    jarak: r.jarak,
    totalKk: r.totalKk,
    kkTersurvei: 0,
    iks: 0,
    bonusIks: 0,
  }))

  const base: GameState = {
    versi: 1,
    seed,
    mode,
    seedKurikulum,
    ...(paket ? { paketUjian: paket.id } : {}),
    namaDokter,
    hari: 1,
    blok: 'pagi',
    stamina: STAMINA_MAKS,
    burnout: 0,
    klinik: {
      antrian: [],
      selesaiHariIni: [],
      autoHariIni: { jumlah: 0, bermasalah: 0 },
    },
    desa: { keluarga, kader, rw, binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } },
    inbox: suratSambutan(namaDokter, mode, paket?.nama),
    jadwal: jadwalKarma,
    tally: {
      totalPasien: 0,
      diagnosisBenar: 0,
      tegakBenar: 0,
      tegakSalah: 0,
      suspekBenar: 0,
      suspekSalah: 0,
      rujukanTotal: 0,
      rujukanNonSpesialistik: 0,
      rujukanTepat: 0,
      rujukanDitolak: 0,
      cowboy: 0,
      antibiotikTanpaIndikasi: 0,
      labTakRelevan: 0,
      miTepat: 0,
      miTotal: 0,
      kunjunganBerhasil: 0,
      kunjunganTotal: 0,
      kunjunganDiusir: 0,
      apathy: 0,
      autoBermasalah: 0,
      posyanduSesi: 0,
      prolanisSesi: 0,
      klbTuntas: 0,
      igdStabil: 0,
      igdSalahDisposisi: 0,
      igdMeninggal: 0,
      rmLengkap: 0,
      teguranDinkes: 0,
      hariKelelahan: 0,
      karmaTerjadi: 0,
      karmaDicegah: 0,
    },
    dex: {},
    log: [],
    jejak: [],
    kapitasi: 15_000_000,
    // M4.18: stok awal seragam 12 per obat — fast mover (parasetamol, amoksisilin)
    // terkuras dalam ~2 pekan → pemain belajar pengadaan; obat jarang awet.
    gudang: { stok: stokAwal(pack), pesanan: [] },
    keuanganBulan: { belanjaObat: 0, belanjaPengadaan: 0 },
    refleksi: {},
    flags: {},
    layar: 'meja',
    lapanganTerpakai: false,
    igdHariIni: false,
    prolanis: { roster: [] },
    posyanduRwTerakhir: {},
    program: {},
  }

  // Antrian hari pertama (bias 4A minggu pertama diatur Director).
  // M4.5: seleksi kasus dari seed KURIKULUM, wajah pasien dari seed flavor.
  const antrian = susunAntrianHarian(
    base,
    pack,
    new Rng(seedKurikulum, 'director', 1),
    [],
    new Rng(seed, 'director-flavor', 1),
  )
  return { ...base, klinik: { ...base.klinik, antrian } }
}
