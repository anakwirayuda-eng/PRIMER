/**
 * FEED RILIS — pembaca feed Atom rilis GitHub untuk cek pembaruan opt-in.
 * Dipisah dari index.ts (yang punya efek samping saat diimpor) agar bisa
 * diuji langsung. Perbandingan versi tetap di renderer (pembaruan.ts).
 */

export const URL_FEED_RILIS = 'https://github.com/anakwirayuda-eng/PRIMER/releases.atom'

/**
 * Hanya halaman rilis repo ini yang diteruskan ke renderer. Banner juga
 * memvalidasi URL sebelum menautkannya; ini lapis kedua, sekaligus membuang
 * tautan lain di feed.
 */
const AWALAN_HALAMAN_RILIS = 'https://github.com/anakwirayuda-eng/PRIMER/releases/'

/** Batas ukuran feed yang masih wajar; feed asli ±35 KB untuk 10 rilis. */
export const MAKS_BYTE_FEED = 512_000

export interface RilisFeed {
  judul: string
  url: string
}

const ENTITAS: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

function dekodeEntitas(teks: string): string {
  return teks.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (asli, kode: string) => {
    if (kode.startsWith('#')) {
      const n = kode[1] === 'x' || kode[1] === 'X' ? Number.parseInt(kode.slice(2), 16) : Number.parseInt(kode.slice(1), 10)
      return Number.isInteger(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : asli
    }
    return ENTITAS[kode.toLowerCase()] ?? asli
  })
}

/** {judul, url} tiap entri, urut seperti feed (terbaru dulu), maksimal 20. */
export function bacaFeedRilis(xml: string): RilisFeed[] {
  const hasil: RilisFeed[] = []
  for (const entri of xml.split('<entry>').slice(1)) {
    const judul = dekodeEntitas(entri.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '')
    const url = entri.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? ''
    if (judul && url.startsWith(AWALAN_HALAMAN_RILIS)) hasil.push({ judul, url })
  }
  return hasil.slice(0, 20)
}
