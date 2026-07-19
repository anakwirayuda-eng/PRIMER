const fs = require('node:fs')
const path = require('node:path')

const assetsDir = path.resolve(__dirname, '..', 'out', 'renderer', 'assets')
const maxJsBytes = Number(process.env.PRIMER_MAX_RENDERER_JS_BYTES ?? 4 * 1024 * 1024)
const maxCssBytes = Number(process.env.PRIMER_MAX_RENDERER_CSS_BYTES ?? 320 * 1024)

if (!fs.existsSync(assetsDir)) {
  throw new Error(`Bundle renderer belum ada: ${assetsDir}. Jalankan build terlebih dahulu.`)
}

const files = fs.readdirSync(assetsDir).map((name) => ({
  name,
  bytes: fs.statSync(path.join(assetsDir, name)).size,
}))
const total = (extension) => files
  .filter((item) => item.name.endsWith(extension))
  .reduce((sum, item) => sum + item.bytes, 0)
const jsBytes = total('.js')
const cssBytes = total('.css')

console.log(`Renderer budget: JS ${(jsBytes / 1024 / 1024).toFixed(2)} MiB; CSS ${(cssBytes / 1024).toFixed(1)} KiB.`)

const failures = []
if (jsBytes > maxJsBytes) failures.push(`JS ${jsBytes} > batas ${maxJsBytes} byte`)
if (cssBytes > maxCssBytes) failures.push(`CSS ${cssBytes} > batas ${maxCssBytes} byte`)
if (failures.length > 0) {
  throw new Error(`Performance budget terlampaui: ${failures.join('; ')}`)
}
