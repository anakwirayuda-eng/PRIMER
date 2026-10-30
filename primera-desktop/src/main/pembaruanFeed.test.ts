import { describe, expect, it } from 'vitest'
import { bacaFeedRilis } from './pembaruanFeed'

const entri = (judul: string, href: string): string =>
  `<entry><id>tag:github.com,2008:Repository/1/x</id><updated>2026-09-12T00:00:00Z</updated>` +
  `<link rel="alternate" type="text/html" href="${href}"/><title>${judul}</title>` +
  `<content type="html">&lt;p&gt;catatan&lt;/p&gt;</content></entry>`

// Bentuk feed asli github.com/anakwirayuda-eng/PRIMER/releases.atom (2026-10-19).
const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
  <title>Release notes from PRIMER</title>
  <link type="text/html" rel="alternate" href="https://github.com/anakwirayuda-eng/PRIMER/releases"/>
  ${entri('PRIMERA 1.3.1 — peningkatan UKM dan UI', 'https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2ab6ae4')}
  ${entri('1.1.0-beta.14 — perbaikan kejujuran debrief rujukan &amp; kebenaran versi', 'https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2b37dc9')}
</feed>`

describe('bacaFeedRilis', () => {
  it('mengambil judul dan halaman tiap rilis, bukan judul feed, dengan entitas didekode', () => {
    expect(bacaFeedRilis(FEED)).toEqual([
      { judul: 'PRIMERA 1.3.1 — peningkatan UKM dan UI', url: 'https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2ab6ae4' },
      { judul: '1.1.0-beta.14 — perbaikan kejujuran debrief rujukan & kebenaran versi', url: 'https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-2b37dc9' },
    ])
  })

  it('membuang tautan di luar halaman rilis repo ini', () => {
    const asing = `<feed>${entri('9.9.9 — palsu', 'https://contoh.invalid/unduh')}${entri('9.9.8 — palsu', 'http://github.com/anakwirayuda-eng/PRIMER/releases/tag/x')}</feed>`
    expect(bacaFeedRilis(asing)).toEqual([])
  })

  it('maksimal 20 entri dan aman untuk masukan rusak', () => {
    const banyak = `<feed>${Array.from({ length: 25 }, (_, i) => entri(`1.0.${i}`, `https://github.com/anakwirayuda-eng/PRIMER/releases/tag/t${i}`)).join('')}</feed>`
    expect(bacaFeedRilis(banyak)).toHaveLength(20)
    expect(bacaFeedRilis('')).toEqual([])
    expect(bacaFeedRilis('<entry><title>&#99999999; tanpa tautan</title></entry>')).toEqual([])
  })
})
