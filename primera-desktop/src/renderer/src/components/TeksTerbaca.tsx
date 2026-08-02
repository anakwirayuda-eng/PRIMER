interface Props {
  teks: string
  className?: string
  batasKata?: number
}

function hitungKata(teks: string): number {
  return teks.match(/[\p{L}\p{N}][\p{L}\p{N}'’/-]*/gu)?.length ?? 0
}

export function pecahTeksTerbaca(teks: string, batasKata = 55): string[] {
  // Sapuan delivery 2026-08-02: penulis konten kini boleh memisahkan gagasan
  // dgn baris kosong (\n\n). Pemisah itu HARUS dihormati — dulu seluruh teks
  // diratakan lebih dulu, jadi paragraf yang sengaja dipisah penulis dilebur
  // kembali dan pemecahannya jatuh ke tebakan batas kata semata.
  const blok = teks
    .split(/\n\s*\n/)
    .map((b) => b.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  if (blok.length === 0) return []

  const paragraf: string[] = []
  for (const bersih of blok) {
    const kalimat = bersih
      .split(/(?<=[.!?])\s+(?=["'“”‘’(]*[\p{Lu}\p{N}])/u)
      .map((item) => item.trim())
      .filter(Boolean)
    let kini = ''
    for (const item of kalimat) {
      const gabungan = kini ? `${kini} ${item}` : item
      if (kini && hitungKata(gabungan) > batasKata) {
        paragraf.push(kini)
        kini = item
      } else {
        kini = gabungan
      }
    }
    if (kini) paragraf.push(kini)
  }
  return paragraf
}

export function TeksTerbaca({ teks, className = '', batasKata = 55 }: Props) {
  return (
    <div className={`teks-terbaca ${className}`.trim()}>
      {pecahTeksTerbaca(teks, batasKata).map((paragraf, index) => (
        <p key={`${index}-${paragraf.slice(0, 24)}`}>{paragraf}</p>
      ))}
    </div>
  )
}
