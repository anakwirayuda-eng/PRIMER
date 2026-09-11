import { BrowserWindow } from 'electron'

/** Renderer mengirim markup teks yang telah di-escape. Dokumen tanpa skrip/jaringan. */
export async function renderDokumenPdf(isi: unknown): Promise<Uint8Array> {
  if (typeof isi !== 'string' || isi.length > 1_000_000) throw new Error('Ukuran dokumen tidak valid.')
  const win = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, javascript: false } })
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  try {
    const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>PRIMERA · Dokumen perawatan simulasi</title><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'"><style>@page{size:A4;margin:18mm}body{font:11pt Arial,sans-serif;color:#14201c;line-height:1.5}h1{font-size:20pt}h2,.judul-seksi{font-size:13pt;border-bottom:1px solid #999;padding-bottom:4px}section{break-inside:auto;margin-top:12px}h2,.judul-seksi{break-after:avoid}.klinik-lembar__chips{display:flex;gap:12px}.klinik-lembar__vital{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.klinik-lembar__vital-label{display:inline-block;min-width:48px}.klinik-lembar__sublabel{font-weight:bold;margin-top:10px}.klinik-lembar__qa{margin-top:8px}.klinik-lembar__tanya{font-weight:bold}li{break-inside:avoid;margin-bottom:5px}small{color:#555}button,img,svg{display:none}p{margin:6px 0}header{border-bottom:2px solid #14201c;padding-bottom:12px}footer{border-top:1px solid #999;margin-top:20px;font-size:9pt}</style></head><body>${isi}</body></html>`
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    return await win.webContents.printToPDF({ printBackground: true, preferCSSPageSize: true })
  } finally { win.destroy() }
}
