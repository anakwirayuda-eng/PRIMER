/** PDF pada desktop; dokumen HTML siap cetak pada preview browser. */
export async function unduhDokumen(isi: string, nama: string): Promise<string> {
  const pdf = window.primer.dokumen?.pdf
  const blob = pdf ? new Blob([new Uint8Array(await pdf(isi))], { type: 'application/pdf' })
    : new Blob([`<!doctype html><html lang="id"><meta charset="utf-8"><title>${nama.replace(/[<>&"]/g, '')}</title><style>body{font:16px sans-serif;max-width:800px;margin:40px auto;line-height:1.6}section{margin-block:24px}button,img,svg{display:none}.judul-seksi{font-weight:bold}@media print{body{margin:0}}</style>${isi}</html>`], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${nama.replace(/[^a-zA-Z0-9 _-]/g, '').slice(0, 100)}.${pdf ? 'pdf' : 'html'}`
  document.body.append(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return pdf ? 'Unduhan PDF disiapkan.' : 'Dokumen HTML siap cetak diunduh (preview browser).'
}
