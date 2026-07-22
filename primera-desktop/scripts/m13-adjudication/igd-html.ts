import type { IgdAdjudicationDataset } from './igd-data'

const esc = (value: unknown): string => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

function renderCase(item: IgdAdjudicationDataset['cases'][number], index: number, total: number, questions: string[]): string {
  const vital = Object.entries(item.initialVitals).map(([key, value]) => `<span><b>${esc(key.toUpperCase())}</b> ${esc(value)}</span>`).join('')
  const steps = item.steps.map((step, stepIndex) => `
    <section class="step">
      <h3>Langkah ${stepIndex + 1}</h3>
      <p class="step-narrative">${esc(step.narrative)}</p>
      <div class="choices">
        ${step.choices.map((choice) => `
          <article class="choice ${choice.correct ? 'correct' : 'wrong'}">
            <div class="choice-head"><strong>${esc(choice.id.toUpperCase())}. ${esc(choice.label)}</strong><span>${choice.correct ? 'BENAR' : 'SALAH'} · ${choice.stabilityEffect > 0 ? '+' : ''}${choice.stabilityEffect}</span></div>
            <p>${esc(choice.feedback)}</p>
          </article>`).join('')}
      </div>
    </section>`).join('')
  const sources = item.sources.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)}</a> <span>${esc(source.kind)} · ${source.year}</span></li>`).join('')
  const resourceGroup = (label: string, values: string[]) => values.length
    ? `<h4>${esc(label)}</h4><ul>${values.map((value) => `<li>${esc(value)}</li>`).join('')}</ul>`
    : ''
  const warnings = item.compiler.warnings.length
    ? `<div class="warning"><strong>Flag kompilator, bukan vonis klinis</strong><ul>${item.compiler.warnings.map((warning) => `<li>${esc(warning)}</li>`).join('')}</ul></div>`
    : '<div class="ok"><strong>Invariant struktur otomatis lulus.</strong> Akurasi klinis tetap perlu keputusan dokter.</div>'

  return `<article class="case" data-case-id="${esc(item.id)}" data-index="${index}" hidden>
    <header class="case-head">
      <div><p class="eyebrow">Kasus ${index + 1} dari ${total}</p><h2>${esc(item.name)}</h2><p class="meta"><code>${esc(item.id)}</code> · ICD-10 ${esc(item.icd10)} · SKDI ${esc(item.skdi)}</p></div>
      <span class="status-pill">DISETUJUI - KARIER</span>
    </header>
    <section class="snapshot">
      <blockquote>${esc(item.opening)}</blockquote>
      <div class="vitals">${vital}<span><b>STABILITAS</b> ${item.initialStability}/100</span></div>
      <p><b>Demografi:</b> usia ${item.demography.ageMin}-${item.demography.ageMax} tahun${item.demography.sex ? ` · ${esc(item.demography.sex)}` : ''}${item.demography.ageMonthsMin !== undefined ? ` · ${item.demography.ageMonthsMin}-${item.demography.ageMonthsMax} bulan` : ''}</p>
      <p><b>Disposisi benar:</b> ${esc(item.correctDisposition)}${item.referralSpecialty ? ` → ${esc(item.referralSpecialty)}` : ''}${item.referralCapabilities.length ? ` · kapabilitas: ${item.referralCapabilities.map(esc).join(', ')}` : ''}</p>
    </section>
    ${warnings}
    <details open><summary>Algoritma langkah demi langkah</summary><div class="details-body">${steps}</div></details>
    <details><summary>Mutiara klinis dan realita FKTP</summary><div class="details-body"><h3>Mutiara klinis</h3><p>${esc(item.teachingPearl)}</p><h3>Panduan resmi/FKTP</h3><p>${esc(item.officialGuidance)}</p></div></details>
    <details><summary>Debrief, kelanjutan, dan bridge UKM</summary><div class="details-body"><h3>Poin kunci</h3><ul>${item.debrief.keyPoints.map((point) => `<li>${esc(point)}</li>`).join('')}</ul><h3>Realita FKTP</h3><p>${esc(item.debrief.fktpReality)}</p><div class="resource-grid"><section>${resourceGroup('Siap di Sukamaju', item.debrief.resources.ready)}</section><section>${resourceGroup('Melalui jejaring', item.debrief.resources.networked)}</section><section>${resourceGroup('Tidak ready', item.debrief.resources.notReady)}</section></div><h3>Kelanjutan perawatan</h3><p>${esc(item.debrief.continuity)}</p><h3>${esc(item.debrief.ukmBridge.title)}</h3><p>${esc(item.debrief.ukmBridge.summary)}</p></div></details>
    <details><summary>Sumber yang saat ini terikat ke kasus (${item.sources.length})</summary><div class="details-body"><ul class="sources">${sources}</ul><p class="caveat">Tautan membuktikan provenance, bukan otomatis membuktikan setiap kalimat. Reviewer tetap perlu mencocokkan keputusan material ke bagian sumber yang relevan.</p></div></details>
    <section class="review">
      <h3>Re-audit opsional</h3>
      <p>Keputusan resmi sudah tercatat. Gunakan formulir ini hanya bila audit ulang menghasilkan koreksi baru.</p>
      <ol>${questions.map((question) => `<li>${esc(question)}</li>`).join('')}</ol>
      <fieldset><legend>Keputusan untuk ${esc(item.name)}</legend>
        <div class="decision-options">
          ${[['setuju', 'Setuju'], ['perlu-edit', 'Perlu edit'], ['tolak', 'Tolak'], ['nanti', 'Nanti']].map(([value, label]) => `<label><input type="radio" name="decision-${esc(item.id)}" value="${value}"><span>${label}</span></label>`).join('')}
        </div>
      </fieldset>
      <label class="notes">Catatan/rumusan koreksi<textarea data-notes-for="${esc(item.id)}" placeholder="Wajib diisi bila Perlu edit atau Tolak; boleh mencatat alasan waiver bila Setuju."></textarea></label>
      <p class="saved" aria-live="polite"></p>
    </section>
  </article>`
}

export function renderIgdAdjudicationHtml(data: IgdAdjudicationDataset): string {
  const embedded = JSON.stringify(data).replaceAll('<', '\\u003c')
  const cards = data.cases.map((item, index) => renderCase(item, index, data.cases.length, data.reviewQuestions)).join('\n')
  return `<!doctype html>
<html lang="id" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>M13-14 IGD - Snapshot Pasca-Adjudikasi PRIMERA</title>
<style>
:root{color-scheme:light;--bg:#eef2ee;--surface:#fff;--surface2:#f4f7f4;--ink:#18241f;--muted:#52645b;--line:#c6d2ca;--accent:#086b50;--accent2:#dcefe8;--warn:#87510a;--warn2:#fff3d7;--danger:#a12f26;--danger2:#fae4e1;--ok:#0c6a4e;--shadow:0 8px 28px rgba(20,35,28,.1)}
[data-theme=dark]{color-scheme:dark;--bg:#0d1512;--surface:#14201c;--surface2:#1e2f28;--ink:#edf4ef;--muted:#a9bbb0;--line:#3b5147;--accent:#59dfb9;--accent2:#183c31;--warn:#f3bd6c;--warn2:#3a2d19;--danger:#ff958a;--danger2:#442521;--ok:#63dfbc;--shadow:0 10px 30px rgba(0,0,0,.35)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Inter,Segoe UI,sans-serif}button,input,textarea,select{font:inherit}a{color:var(--accent)}button{border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:.65rem .9rem;border-radius:6px;cursor:pointer}button:hover{border-color:var(--accent)}button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.masthead{background:var(--surface);border-bottom:1px solid var(--line)}.masthead-inner,.toolbar,.workspace{width:min(1180px,calc(100% - 2rem));margin:auto}.masthead-inner{padding:1.5rem 0}.masthead h1{margin:0;font-size:1.8rem}.masthead p{margin:.35rem 0;color:var(--muted)}.warning-banner{margin-top:1rem;border-left:4px solid var(--warn);background:var(--warn2);padding:.75rem 1rem;color:var(--ink)}
.toolbar-wrap{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}.toolbar{padding:.75rem 0;display:grid;grid-template-columns:minmax(15rem,1fr) auto;gap:.6rem;align-items:center}.toolbar-left,.toolbar-right{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}.toolbar select{min-width:15rem;border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:.65rem;border-radius:6px}.progress{font-weight:800}.primary{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.workspace{padding:1.2rem 0 3rem}.case{background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow);border-radius:8px;padding:1.25rem}.case-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}.case h2{margin:.1rem 0;font-size:1.65rem}.eyebrow,.meta{margin:0;color:var(--muted)}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;font-weight:800}.status-pill{border:1px solid var(--ok);color:var(--ok);background:var(--accent2);padding:.35rem .55rem;border-radius:999px;font-size:.76rem;font-weight:800}.snapshot{margin:1rem 0;background:var(--surface2);border-left:4px solid var(--accent);padding:.85rem 1rem}.snapshot blockquote{margin:0 0 .8rem;font-size:1.05rem}.vitals{display:flex;gap:.45rem;flex-wrap:wrap}.vitals span{border:1px solid var(--line);background:var(--surface);padding:.3rem .5rem;border-radius:4px}.warning,.ok{margin:1rem 0;padding:.8rem 1rem;border:1px solid}.warning{background:var(--warn2);border-color:var(--warn)}.ok{background:var(--accent2);border-color:var(--ok)}
details{border-top:1px solid var(--line);padding:.8rem 0}summary{cursor:pointer;color:var(--accent);font-weight:800}.details-body{padding:.7rem .1rem}.resource-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem}.resource-grid section{background:var(--surface2);padding:.7rem}.resource-grid h4{margin:0 0 .35rem}.resource-grid ul{margin:.25rem 0;padding-left:1.2rem}.step{margin:0 0 1.2rem}.step h3{margin:.2rem 0}.step-narrative{font-weight:700}.choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}.choice{border:1px solid var(--line);border-left:4px solid;padding:.7rem .8rem;background:var(--surface2)}.choice.correct{border-left-color:var(--ok)}.choice.wrong{border-left-color:var(--danger)}.choice-head{display:flex;justify-content:space-between;gap:.8rem}.choice-head span{white-space:nowrap;font-size:.76rem;font-weight:800;color:var(--muted)}.choice p{margin:.45rem 0 0}.sources li{margin:.45rem 0}.sources span,.caveat{color:var(--muted);font-size:.88rem}
.review{margin-top:1rem;border-top:3px solid var(--accent);padding-top:1rem}.review ol{padding-left:1.3rem}.decision-options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.5rem}.decision-options input{position:absolute;opacity:0}.decision-options span{display:flex;justify-content:center;border:1px solid var(--line);padding:.7rem;cursor:pointer}.decision-options input:checked+span{border:2px solid var(--accent);background:var(--accent2);font-weight:800}.decision-options input:focus-visible+span{outline:3px solid var(--accent);outline-offset:2px}.notes{display:block;margin-top:.8rem;font-weight:700}.notes textarea{display:block;width:100%;min-height:6rem;margin-top:.35rem;padding:.65rem;border:1px solid var(--line);background:var(--surface2);color:var(--ink);border-radius:4px}.saved{min-height:1.2rem;color:var(--muted);font-size:.82rem}.case-nav{display:flex;justify-content:space-between;gap:.6rem;margin-top:1rem}.case-nav button{min-width:9rem}.empty{text-align:center;padding:3rem;background:var(--surface);border:1px solid var(--line)}
@media(max-width:760px){.toolbar{grid-template-columns:1fr}.toolbar-right{justify-content:flex-start}.case-head{display:block}.status-pill{display:inline-block;margin-top:.5rem}.choices,.resource-grid{grid-template-columns:1fr}.decision-options{grid-template-columns:repeat(2,1fr)}.choice-head{display:block}.choice-head span{display:block;margin-top:.3rem}.case{padding:.85rem}}
@media print{.toolbar-wrap,.case-nav{display:none}.case{box-shadow:none;border:0}.case[hidden]{display:block!important;page-break-before:always}details>*{display:block!important}}
</style></head>
<body>
<header class="masthead"><div class="masthead-inner"><h1>M13-14 IGD - Snapshot Pasca-Adjudikasi</h1><p>Empat belas kasus IGD mode Karier. Snapshot <code>${esc(data.sourceCommit)}</code> · release <code>${esc(data.contentRelease)}</code> · engine ${data.engineRevision} · fingerprint <code>${data.artifactFingerprint.slice(0, 16)}…</code></p><div class="warning-banner"><strong>14/14 keputusan dokter telah diterapkan.</strong> Snapshot ini memudahkan audit ulang atas algoritma, sumber, realita FKTP, kelanjutan perawatan, dan bridge UKM. Mode Ujian tetap terisolasi.</div></div></header>
<div class="toolbar-wrap"><div class="toolbar"><div class="toolbar-left"><select id="case-select" aria-label="Pilih kasus">${data.cases.map((item, index) => `<option value="${esc(item.id)}">${index + 1}. ${esc(item.name)}</option>`).join('')}</select><span class="progress" id="progress" aria-live="polite"></span></div><div class="toolbar-right"><button id="previous" type="button">← Sebelumnya</button><button id="next-undecided" class="primary" type="button">Re-audit berikutnya</button><button id="export" type="button">Ekspor JSON</button><label><span class="primary" style="display:inline-block;padding:.65rem .9rem;border-radius:6px;cursor:pointer">Impor JSON</span><input id="import" type="file" accept="application/json,.json" hidden></label><button id="theme" type="button">Tema gelap</button></div></div></div>
<main class="workspace" id="cases">${cards}<div class="empty" id="empty" hidden>Tidak ada kasus.</div><nav class="case-nav"><button id="bottom-previous" type="button">← Sebelumnya</button><button id="bottom-next" type="button">Berikutnya →</button></nav></main>
<script id="dataset" type="application/json">${embedded}</script>
<script>
(() => {
  const data = JSON.parse(document.querySelector('#dataset').textContent)
  const key = 'primera.m13-14-igd-review.' + data.artifactFingerprint
  const blank = { schema: 'primera.m13-14-igd-decisions.v1', artifactFingerprint: data.artifactFingerprint, reviewer: { name: '', credential: '', date: '' }, decisions: {} }
  let review
  try { review = Object.assign({}, blank, JSON.parse(localStorage.getItem(key) || '{}')) } catch { review = structuredClone(blank) }
  let index = 0
  const cards = [...document.querySelectorAll('.case')]
  const select = document.querySelector('#case-select')
  const progress = document.querySelector('#progress')
  const save = () => { localStorage.setItem(key, JSON.stringify(review)); updateProgress() }
  const updateProgress = () => { const n = Object.values(review.decisions).filter(x => x && x.decision).length; progress.textContent = n + '/' + data.cases.length + ' diputuskan' }
  const hydrate = (card) => {
    const id = card.dataset.caseId
    const decision = review.decisions[id] || {}
    card.querySelectorAll('input[type=radio]').forEach(input => { input.checked = input.value === decision.decision })
    card.querySelector('textarea').value = decision.notes || ''
  }
  const show = (nextIndex) => {
    index = (nextIndex + cards.length) % cards.length
    cards.forEach((card, i) => { card.hidden = i !== index })
    hydrate(cards[index]); select.value = cards[index].dataset.caseId; window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  cards.forEach(card => {
    const id = card.dataset.caseId
    card.querySelectorAll('input[type=radio]').forEach(input => input.addEventListener('change', () => {
      const notes = card.querySelector('textarea').value
      review.decisions[id] = { decision: input.value, notes, updatedAt: new Date().toISOString() }
      save(); card.querySelector('.saved').textContent = 'Tersimpan lokal.'
    }))
    card.querySelector('textarea').addEventListener('input', event => {
      const prior = review.decisions[id] || {}
      review.decisions[id] = { ...prior, notes: event.target.value, updatedAt: new Date().toISOString() }
      save(); card.querySelector('.saved').textContent = 'Catatan tersimpan lokal.'
    })
  })
  select.addEventListener('change', () => show(cards.findIndex(card => card.dataset.caseId === select.value)))
  const move = delta => show(index + delta)
  document.querySelector('#previous').onclick = () => move(-1)
  document.querySelector('#bottom-previous').onclick = () => move(-1)
  document.querySelector('#bottom-next').onclick = () => move(1)
  document.querySelector('#next-undecided').onclick = () => {
    const next = cards.findIndex((card, i) => i > index && !review.decisions[card.dataset.caseId]?.decision)
    const wrapped = next >= 0 ? next : cards.findIndex(card => !review.decisions[card.dataset.caseId]?.decision)
    if (wrapped >= 0) show(wrapped)
  }
  document.querySelector('#theme').onclick = event => {
    const dark = document.documentElement.dataset.theme !== 'dark'
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    event.currentTarget.textContent = dark ? 'Tema terang' : 'Tema gelap'
  }
  document.querySelector('#export').onclick = () => {
    const blob = new Blob([JSON.stringify({ ...review, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'M13_14_IGD_DECISIONS.json'; link.click(); URL.revokeObjectURL(link.href)
  }
  document.querySelector('#import').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return
    const incoming = JSON.parse(await file.text())
    if (incoming.artifactFingerprint !== data.artifactFingerprint) return alert('Fingerprint artefak berbeda; impor dibatalkan.')
    review = { ...blank, ...incoming }; save(); show(index)
  })
  updateProgress(); show(0)
})()
</script></body></html>`.replace(/[ \t]+$/gm, '')
}
