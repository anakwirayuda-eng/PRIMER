import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PACK } from '../src/content/index'
import { DUEL_DIAGNOSIS_PILOTS, TEACH_BACK_PILOTS } from '../src/content/pedagogyPilots'

type Register = 'pasien' | 'dokter' | 'narasi' | 'debrief' | 'data_klinis'
type Severity = 'tinggi' | 'sedang'

export interface TextEntry {
  path: string
  register: Register
  text: string
}

export interface Finding extends TextEntry {
  rule: string
  severity: Severity
  words: number
  maxSentenceWords: number
  detail: string
}

const JARGON_PASIEN = [
  'wheal', 'eritematosa', 'eritem', 'makula', 'papul', 'papula', 'vesikel', 'pustul',
  'urtika', 'ekskoriasi', 'likenifikasi', 'deskuamasi', 'skuama', 'krusta', 'maserasi',
  'dispnea', 'ortopnea', 'hemoptisis', 'hematemesis', 'melena', 'disuria', 'hematuria',
  'poliuria', 'polidipsia', 'polifagia', 'diaforesis', 'sianosis', 'ikterik', 'pruritus',
  'parestesia', 'klaudikasio', 'odinofagia', 'disfagia', 'rinorea', 'otorea', 'takipnea',
  'retraksi', 'sputum', 'mukopurulen', 'purulen', 'tenesmus', 'defekasi', 'epigastrium',
  'periumbilikal', 'retrosternal', 'regurgitasi', 'palpebra', 'konjungtiva', 'oksipital',
  'lumbal', 'monoartikular', 'poliartritis', 'artralgia', 'artritis', 'edema', 'nokturnal',
  'onset', 'intermiten', 'episodik', 'anhedonia', 'tonik-klonik', 'postiktal', 'parese',
  'disartria', 'hemiparesis', 'gestasi', 'hiperglikemia', 'wheezing', 'ekspiratoar',
  'mcburney', 'nyha', 'ldl', 'visus', 'obstruksi nasi',
] as const

const AKRONIM_DIIZINKAN = new Set([
  'ANC', 'ASI', 'BAB', 'BAK', 'BPJS', 'COM-B', 'CT', 'EKG', 'FKTP', 'GDS', 'HIV',
  'IGD', 'IKS', 'IM', 'IV', 'JKN', 'KB', 'KIA', 'KIE', 'KLB', 'MI', 'NGT', 'OAT',
  'ORS', 'PIS-PK', 'PMO', 'PNPK', 'PONED', 'PPK', 'PRB', 'RW', 'SAJI', 'SABA',
  'SD', 'SMA', 'SMP', 'TB', 'TTM', 'UGD', 'UKM', 'UKP', 'USG', 'WHO',
  // Sapuan 2026-08-06: 71 temuan "kapital berlebihan" ditelusuri satu per satu,
  // dan ternyata TIGA kelas berbeda tercampur jadi satu. Kelas terbesarnya
  // singkatan lembaga & istilah baku sepanjang >=5 huruf — bukan teriakan,
  // hanya kebetulan lolos ambang panjang. Didaftarkan di sini supaya temuan
  // yang tersisa benar-benar layak dibaca dokter, bukan tenggelam di derau.
  'AACE', 'AAN', 'AAP', 'ACE-I', 'ACR', 'ADA', 'AHA', 'AKDR', 'ARB', 'ARIA', 'ASA',
  'ATLS', 'BKKBN', 'CBT-I', 'CDC', 'CPR', 'DMARD', 'DTS', 'EASD', 'ECC', 'EPOS',
  'EULAR', 'FIGO', 'FT3', 'FT4', 'GINA', 'IACS', 'ICM', 'IDAI', 'IMCI', 'IUD',
  'JBDS', 'MDR', 'MDR-TB', 'MTBS', 'MTP-1', 'NSAID', 'OAINS', 'PAPDI', 'PDPI',
  'PERDAMI', 'PERDOSSI', 'PERHATI-KL', 'PERKENI', 'PERKI', 'PPGD', 'RR-TB',
  'SGOT', 'SGPT', 'SNNOOP10', 'TB-RO',
])

/**
 * Kata yang SENGAJA dibesarkan sebagai penekanan keselamatan — gaya rumah
 * proyek ini, bukan cacat penulisan. Dipisahkan dari daftar akronim supaya
 * niatnya tetap terbaca: ini keputusan editorial, dan mencabutnya berarti
 * menghapus penanda yang membuat kata berbahaya menonjol di layar debrief.
 *
 * Yang TIDAK didaftarkan di sini dan karenanya tetap muncul sebagai temuan:
 * kata sambung dan kata biasa yang dibesarkan tanpa muatan keselamatan
 * (DENGAN, SAMBIL, MASIH, HANYA, SANGAT, dsb). Itu memang penekanan berlebih.
 */
const PENEKANAN_KLINIS_DIIZINKAN = new Set([
  'RUJUK', 'JANGAN', 'TIDAK', 'TANPA', 'BUKAN', 'WAJIB', 'HINDARI', 'DIHINDARI',
  'SINGKIRKAN', 'PUASAKAN', 'ULANGI', 'OBATI', 'SEGERA', 'MASASE', 'KOMPRESI',
  'BIMANUAL', 'KONTRAINDIKASI', 'RESUSITASI', 'NEBULISASI',
])

/** Singkatan majemuk seperti "AHA/AAP" atau "PPK/PNPK" dinilai per bagian. */
function kapitalTakDikenal(word: string): boolean {
  const bagian = word.split('/').filter(Boolean)
  return bagian.some(
    (b) =>
      // Tahun/angka di dalam singkatan majemuk (mis. "2009/PAPDI") bukan teriakan.
      !/^\d+$/.test(b) &&
      !AKRONIM_DIIZINKAN.has(b) &&
      !PENEKANAN_KLINIS_DIIZINKAN.has(b),
  )
}

function add(entries: TextEntry[], path: string, register: Register, value: unknown): void {
  if (typeof value !== 'string') return
  const text = value.replace(/\s+/g, ' ').trim()
  if (text) entries.push({ path, register, text })
}

function words(text: string): string[] {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’/-]*/gu) ?? []
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=["'“”‘’(]*[\p{Lu}\p{N}])/u)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function collectEntries(): TextEntry[] {
  const entries: TextEntry[] = []

  for (const kasus of Object.values(PACK.kasus)) {
    const root = `clinic.${kasus.id}`
    add(entries, `${root}.keluhanUtama`, 'pasien', kasus.keluhanUtama)
    for (const question of kasus.anamnesis) {
      add(entries, `${root}.anamnesis.${question.id}.tanya`, 'dokter', question.tanya)
      add(entries, `${root}.anamnesis.${question.id}.jawab`, 'pasien', question.jawab)
      for (const [persona, answer] of Object.entries(question.variasi ?? {})) {
        add(entries, `${root}.anamnesis.${question.id}.variasi.${persona}`, 'pasien', answer)
      }
    }
    for (const [index, finding] of kasus.pemeriksaanFisik.entries()) {
      add(entries, `${root}.pemeriksaanFisik.${index}`, 'data_klinis', finding.temuan)
    }
    for (const lab of kasus.lab) add(entries, `${root}.lab.${lab.id}`, 'data_klinis', lab.hasil)
    add(entries, `${root}.clue`, 'debrief', kasus.clue)
    add(entries, `${root}.mutiaraEbm`, 'debrief', kasus.mutiaraEbm)
    add(entries, `${root}.catatanRealita`, 'debrief', kasus.catatanRealita)
    add(entries, `${root}.panduanResmi`, 'debrief', kasus.panduanResmi)
    add(entries, `${root}.konsekuensi.narasi`, 'narasi', kasus.konsekuensi?.narasi)
    add(entries, `${root}.konsekuensi.kondisiKembali`, 'data_klinis', kasus.konsekuensi?.kondisiKembali)
    for (const wrong of kasus.tatalaksana.obatSalahUmum ?? []) {
      add(entries, `${root}.obatSalah.${wrong.id}`, 'debrief', wrong.alasan)
    }
    for (const wrong of kasus.tatalaksana.tindakanSalahUmum ?? []) {
      add(entries, `${root}.tindakanSalah.${wrong.id}`, 'debrief', wrong.alasan)
    }
    for (const variant of kasus.varianPresentasi ?? []) {
      add(entries, `${root}.varian.${variant.id}.keluhanUtama`, 'pasien', variant.keluhanUtama)
      for (const [id, answer] of Object.entries(variant.jawabanBerubah ?? {})) {
        add(entries, `${root}.varian.${variant.id}.jawaban.${id}`, 'pasien', answer)
      }
      for (const [region, finding] of Object.entries(variant.temuanBerubah ?? {})) {
        add(entries, `${root}.varian.${variant.id}.temuan.${region}`, 'data_klinis', finding)
      }
    }
  }

  for (const kasus of Object.values(PACK.kasusIgd)) {
    const root = `igd.${kasus.id}`
    add(entries, `${root}.pembuka`, 'narasi', kasus.pembuka)
    for (const step of kasus.langkah) {
      add(entries, `${root}.langkah.${step.id}.narasi`, 'narasi', step.narasi)
      for (const option of step.pilihan) {
        add(entries, `${root}.langkah.${step.id}.${option.id}.label`, 'dokter', option.label)
        add(entries, `${root}.langkah.${step.id}.${option.id}.respons`, 'debrief', option.respons)
      }
    }
    add(entries, `${root}.clue`, 'debrief', kasus.clue)
    add(entries, `${root}.panduanResmi`, 'debrief', kasus.panduanResmi)
  }

  for (const family of Object.values(PACK.keluarga)) {
    const root = `ukm.${family.id}`
    add(entries, `${root}.sinopsis`, 'narasi', family.arc.sinopsis)
    add(entries, `${root}.epilogBerhasil`, 'narasi', family.arc.epilogBerhasil)
    add(entries, `${root}.epilogGagal`, 'narasi', family.arc.epilogGagal)
    for (const visit of family.arc.kunjungan) {
      const visitRoot = `${root}.${visit.id}`
      add(entries, `${visitRoot}.pembuka`, 'narasi', visit.pembuka)
      add(entries, `${visitRoot}.petunjukHambatan`, 'debrief', visit.petunjukHambatan)
      add(entries, `${visitRoot}.panduanResmi`, 'debrief', visit.panduanResmi)
      add(entries, `${visitRoot}.penutupBerhasil`, 'narasi', visit.penutupBerhasil)
      add(entries, `${visitRoot}.penutupGagal`, 'narasi', visit.penutupGagal)
      add(entries, `${visitRoot}.karma`, 'narasi', visit.karma?.narasi)
      for (const hotspot of visit.hotspot) {
        add(entries, `${visitRoot}.hotspot.${hotspot.id}.label`, 'narasi', hotspot.label)
        add(entries, `${visitRoot}.hotspot.${hotspot.id}.narasi`, 'narasi', hotspot.narasi)
      }
      for (const node of visit.dialog) {
        add(entries, `${visitRoot}.dialog.${node.id}.narasi`, 'narasi', node.narasi)
        for (const option of node.pilihan) {
          add(entries, `${visitRoot}.dialog.${node.id}.${option.id}.teks`, 'dokter', option.teks)
          add(entries, `${visitRoot}.dialog.${node.id}.${option.id}.respons`, 'pasien', option.respons)
          add(entries, `${visitRoot}.dialog.${node.id}.${option.id}.responsBohong`, 'pasien', option.ungkap?.responsBohong)
          add(entries, `${visitRoot}.dialog.${node.id}.${option.id}.catatan`, 'debrief', option.catatanPedagogis)
        }
      }
      for (const card of visit.intervensi) {
        add(entries, `${visitRoot}.intervensi.${card.id}.deskripsi`, 'dokter', card.deskripsi)
        add(entries, `${visitRoot}.intervensi.${card.id}.hasil`, 'narasi', card.hasilNarasi)
        add(entries, `${visitRoot}.intervensi.${card.id}.catatan`, 'debrief', card.catatanPedagogis)
      }
      if (visit.pilihanIngatkan) {
        add(entries, `${visitRoot}.ingatkan.prompt`, 'dokter', visit.pilihanIngatkan.prompt)
        for (const option of visit.pilihanIngatkan.pilihan) {
          add(entries, `${visitRoot}.ingatkan.${option.id}.teks`, 'dokter', option.teks)
          add(entries, `${visitRoot}.ingatkan.${option.id}.respons`, 'pasien', option.respons)
          add(entries, `${visitRoot}.ingatkan.${option.id}.catatan`, 'debrief', option.catatanPedagogis)
        }
      }
      if (visit.penerimaanAwal) {
        add(entries, `${visitRoot}.penerimaan.narasi`, 'narasi', visit.penerimaanAwal.narasi)
        add(entries, `${visitRoot}.penerimaan.rasional`, 'debrief', visit.penerimaanAwal.rasional)
        for (const option of visit.penerimaanAwal.pilihan) {
          add(entries, `${visitRoot}.penerimaan.${option.id}.teks`, 'dokter', option.teks)
          add(entries, `${visitRoot}.penerimaan.${option.id}.respons`, 'pasien', option.respons)
          add(entries, `${visitRoot}.penerimaan.${option.id}.catatan`, 'debrief', option.catatanPedagogis)
        }
      }
      for (const variant of visit.varianKunjungan ?? []) {
        add(entries, `${visitRoot}.varian.${variant.id}.pembuka`, 'narasi', variant.pembuka)
        add(entries, `${visitRoot}.varian.${variant.id}.penutupBerhasil`, 'narasi', variant.penutupBerhasil)
        add(entries, `${visitRoot}.varian.${variant.id}.penutupGagal`, 'narasi', variant.penutupGagal)
        for (const [id, response] of Object.entries(variant.pilihanBerubah ?? {})) {
          add(entries, `${visitRoot}.varian.${variant.id}.${id}.respons`, 'pasien', response.respons)
          add(entries, `${visitRoot}.varian.${variant.id}.${id}.responsBohong`, 'pasien', response.responsBohong)
        }
      }
    }
  }

  for (const duel of DUEL_DIAGNOSIS_PILOTS) {
    const root = `pedagogy.duel.${duel.id}`
    for (const [index, side] of duel.sisi.entries()) {
      add(entries, `${root}.sisi.${index}.keputusan`, 'debrief', side.keputusan)
    }
    add(entries, `${root}.pembeda`, 'debrief', duel.pembeda)
    add(entries, `${root}.pembalik`, 'debrief', duel.pembalik)
    add(entries, `${root}.pertanyaan`, 'dokter', duel.pertanyaan)
    for (const option of duel.pilihan) {
      add(entries, `${root}.pilihan.${option.id}.label`, 'dokter', option.label)
      add(entries, `${root}.pilihan.${option.id}.respons`, 'debrief', option.respons)
    }
  }

  for (const pilot of TEACH_BACK_PILOTS) {
    const root = `pedagogy.teachBack.${pilot.id}`
    add(entries, `${root}.judul`, 'narasi', pilot.judul)
    add(entries, `${root}.fokus`, 'dokter', pilot.fokus)
    add(entries, `${root}.pertanyaanPembuka`, 'dokter', pilot.pertanyaanPembuka)
    add(entries, `${root}.ucapanPasienAwal`, 'pasien', pilot.ucapanPasienAwal)
    add(entries, `${root}.pertanyaanPenilaian`, 'dokter', pilot.pertanyaanPenilaian)
    add(entries, `${root}.ajarUlang`, 'debrief', pilot.ajarUlang)
    add(entries, `${root}.ucapanPasienAkhir`, 'pasien', pilot.ucapanPasienAkhir)
    for (const phase of ['pilihanPembuka', 'pilihanPenilaian'] as const) {
      for (const option of pilot[phase]) {
        add(entries, `${root}.${phase}.${option.id}.label`, 'dokter', option.label)
        add(entries, `${root}.${phase}.${option.id}.respons`, 'debrief', option.respons)
      }
    }
  }
  return entries
}

export function audit(entries: TextEntry[]): Finding[] {
  const findings: Finding[] = []
  const push = (entry: TextEntry, rule: string, severity: Severity, detail: string) => {
    const sentenceLengths = sentences(entry.text).map((sentence) => words(sentence).length)
    findings.push({
      ...entry,
      rule,
      severity,
      words: words(entry.text).length,
      maxSentenceWords: Math.max(0, ...sentenceLengths),
      detail,
    })
  }

  for (const entry of entries) {
    const wordCount = words(entry.text).length
    const maxSentenceWords = Math.max(0, ...sentences(entry.text).map((sentence) => words(sentence).length))
    const maxField = entry.register === 'pasien' ? 60 : entry.register === 'dokter' ? 55 : entry.register === 'debrief' ? 140 : 120
    const maxSentence = entry.register === 'pasien' ? 36 : entry.register === 'dokter' ? 34 : entry.register === 'debrief' ? 45 : 48
    if (wordCount > maxField) push(entry, 'field_terlalu_panjang', 'tinggi', `${wordCount} kata; ambang ${maxField}`)
    if (maxSentenceWords > maxSentence) push(entry, 'kalimat_terlalu_panjang', 'tinggi', `${maxSentenceWords} kata dalam satu kalimat; ambang ${maxSentence}`)
    if (entry.register === 'dokter' && (entry.path.includes('.anamnesis.') || entry.path.endsWith('.prompt'))) {
      const questionMarks = (entry.text.match(/\?/g) ?? []).length
      if (questionMarks >= 3 || (questionMarks === 2 && wordCount > 30)) {
        push(entry, 'pertanyaan_bertumpuk', 'sedang', `${questionMarks} tanda tanya dalam ${wordCount} kata`)
      }
    }
    if (entry.register === 'pasien') {
      for (const jargon of JARGON_PASIEN) {
        if (new RegExp(`\\b${jargon}\\b`, 'iu').test(entry.text)) {
          push(entry, 'jargon_di_mulut_pasien', 'tinggi', jargon)
        }
      }
    }
    const caps = words(entry.text).filter((word) => /\p{L}/u.test(word) && word.length >= 5 && word === word.toLocaleUpperCase('id-ID') && kapitalTakDikenal(word))
    if (caps.length >= 3 || (entry.register === 'pasien' && caps.length >= 2)) {
      push(entry, 'kapital_berlebihan', 'sedang', [...new Set(caps)].join(', '))
    }
    const quoteCount = (entry.text.match(/"/g) ?? []).length
    if (quoteCount % 2 !== 0) push(entry, 'kutip_tidak_seimbang', 'tinggi', `${quoteCount} tanda kutip lurus`)
    const opens = (entry.text.match(/\(/g) ?? []).length
    const closes = (entry.text.match(/\)/g) ?? []).length
    if (opens !== closes) push(entry, 'kurung_tidak_seimbang', 'tinggi', `buka=${opens}; tutup=${closes}`)
    if (/\s[,.;:!?]/u.test(entry.text)) push(entry, 'spasi_sebelum_tanda_baca', 'sedang', 'spasi tidak perlu sebelum tanda baca')
    if (/[!?]{3,}|[,;:]{2,}|\.{4,}/u.test(entry.text)) push(entry, 'tanda_baca_berulang', 'sedang', 'tanda baca berulang berlebihan')
  }
  return findings
}

function run(): void {
  const entries = collectEntries()
  const findings = audit(entries).sort((a, b) => {
    const severity = (value: Severity) => (value === 'tinggi' ? 0 : 1)
    return severity(a.severity) - severity(b.severity) || b.maxSentenceWords - a.maxSentenceWords || a.path.localeCompare(b.path)
  })
  const anamnesisFlows = Object.values(PACK.kasus).map((kasus) => ({
    kasusId: kasus.id,
    keluhanUtama: kasus.keluhanUtama,
    questions: kasus.anamnesis.map((question) => ({
      id: question.id,
      kategori: question.kategori,
      tanya: question.tanya,
      jawab: question.jawab,
      bukaSetelah: question.bukaSetelah ?? [],
      esensial: question.esensial === true,
      distraktor: question.distraktor === true,
    })),
  }))
  const outputArg = process.argv.findIndex((value) => value === '--output')
  const outputPath = resolve(outputArg >= 0 && process.argv[outputArg + 1] ? process.argv[outputArg + 1]! : 'dist/editorial-audit/report.json')
  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      entries: entries.length,
      clinicCases: Object.keys(PACK.kasus).length,
      igdCases: Object.keys(PACK.kasusIgd).length,
      ukmFamilies: Object.keys(PACK.keluarga).length,
      ukmVisits: Object.values(PACK.keluarga).reduce((sum, family) => sum + family.arc.kunjungan.length, 0),
      findings: findings.length,
      high: findings.filter((finding) => finding.severity === 'tinggi').length,
      medium: findings.filter((finding) => finding.severity === 'sedang').length,
    },
    byRule: Object.fromEntries([...new Set(findings.map((finding) => finding.rule))].sort().map((rule) => [rule, findings.filter((finding) => finding.rule === rule).length])),
    anamnesisFlows,
    findings,
  }
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  process.stdout.write(`${outputPath}\n${JSON.stringify(report.counts)}\n${JSON.stringify(report.byRule)}\n`)
}

if (process.env['VITEST'] !== 'true') run()
