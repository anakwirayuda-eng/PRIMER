import type { AdjudicationDataset } from './build-data'

function embeddedJson(data: unknown): string {
  return JSON.stringify(data).replace(/<\/script/gi, '<\\/script')
}

export function renderAdjudicationHtml(data: AdjudicationDataset): string {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${data.title}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f6f5;
      --surface: #ffffff;
      --surface-2: #eef2f0;
      --ink: #17211d;
      --muted: #53635c;
      --line: #cbd5d0;
      --accent: #08785c;
      --accent-strong: #075d48;
      --accent-soft: #dcefe8;
      --warn: #9b5d00;
      --warn-soft: #fff1d7;
      --danger: #a23333;
      --danger-soft: #fbe5e5;
      --info: #245f87;
      --info-soft: #e4f0f8;
      --shadow: 0 2px 8px rgb(23 33 29 / 8%);
      --font-size: 16px;
    }
    :root[data-theme="dark"] {
      color-scheme: dark;
      --bg: #111815;
      --surface: #1b2521;
      --surface-2: #24312c;
      --ink: #edf5f1;
      --muted: #b5c4bd;
      --line: #405048;
      --accent: #5de0b5;
      --accent-strong: #9aecd0;
      --accent-soft: #173d31;
      --warn: #ffd07a;
      --warn-soft: #493718;
      --danger: #ff9b9b;
      --danger-soft: #492626;
      --info: #9fd4f5;
      --info-soft: #213d4e;
      --shadow: 0 2px 10px rgb(0 0 0 / 28%);
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        color-scheme: dark;
        --bg: #111815; --surface: #1b2521; --surface-2: #24312c;
        --ink: #edf5f1; --muted: #b5c4bd; --line: #405048;
        --accent: #5de0b5; --accent-strong: #9aecd0; --accent-soft: #173d31;
        --warn: #ffd07a; --warn-soft: #493718; --danger: #ff9b9b;
        --danger-soft: #492626; --info: #9fd4f5; --info-soft: #213d4e;
        --shadow: 0 2px 10px rgb(0 0 0 / 28%);
      }
    }
    * { box-sizing: border-box; }
    html { font-size: var(--font-size); scroll-behavior: smooth; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-family: "Segoe UI", Arial, sans-serif; line-height: 1.55; }
    button, input, select, textarea { font: inherit; }
    button, .file-label { min-height: 2.75rem; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible, a:focus-visible {
      outline: 3px solid var(--accent); outline-offset: 2px;
    }
    a { color: var(--accent-strong); text-underline-offset: .15em; }
    .skip { position: fixed; left: .75rem; top: -5rem; z-index: 100; background: var(--surface); color: var(--ink); padding: .7rem 1rem; border: 2px solid var(--accent); }
    .skip:focus { top: .75rem; }
    .masthead { background: var(--surface); border-bottom: 1px solid var(--line); }
    .masthead-inner, .workspace { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
    .masthead-inner { padding: 1.5rem 0 1.25rem; }
    h1 { margin: 0; font-size: clamp(1.65rem, 4vw, 2.35rem); line-height: 1.2; letter-spacing: 0; }
    h2, h3 { letter-spacing: 0; }
    .lede { max-width: 84ch; color: var(--muted); margin: .55rem 0 0; }
    .scope-alert { margin-top: 1rem; padding: .85rem 1rem; background: var(--info-soft); border-left: 5px solid var(--info); }
    .summary-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .65rem; margin-top: 1rem; }
    .metric { min-width: 0; background: var(--surface-2); border: 1px solid var(--line); padding: .7rem .8rem; }
    .metric strong { display: block; font-size: 1.35rem; line-height: 1.2; }
    .metric span { display: block; color: var(--muted); font-size: .78rem; margin-top: .2rem; }
    .toolbar-wrap { position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--bg) 94%, transparent); border-bottom: 1px solid var(--line); backdrop-filter: blur(8px); }
    .toolbar { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; padding: .75rem 0; display: grid; gap: .65rem; }
    .filters { display: grid; grid-template-columns: minmax(13rem, 2fr) repeat(4, minmax(8rem, 1fr)); gap: .55rem; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
    input, select, textarea { width: 100%; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: .65rem .75rem; }
    button, .file-label { display: inline-flex; align-items: center; justify-content: center; gap: .35rem; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: .55rem .8rem; cursor: pointer; text-decoration: none; }
    button:hover, .file-label:hover { border-color: var(--accent); background: var(--accent-soft); }
    .primary { background: var(--accent); color: #fff; border-color: var(--accent); }
    :root[data-theme="dark"] .primary { color: #07150f; }
    .danger { color: var(--danger); }
    .hidden { display: none !important; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    .reviewer { display: grid; grid-template-columns: 1.3fr 1fr .8fr; gap: .55rem; }
    .workspace { padding: 1.25rem 0 4rem; }
    .progress-row { display: grid; grid-template-columns: minmax(14rem, 1fr) auto; align-items: center; gap: 1rem; margin-bottom: .9rem; }
    .progress-track { height: .65rem; border: 1px solid var(--line); background: var(--surface); overflow: hidden; }
    .progress-fill { height: 100%; background: var(--accent); width: 0; transition: width .2s ease; }
    .progress-label { color: var(--muted); font-size: .9rem; margin-top: .25rem; }
    .result-count { color: var(--muted); font-size: .9rem; text-align: right; }
    .case-card { background: var(--surface); border: 1px solid var(--line); border-left: 6px solid var(--accent); box-shadow: var(--shadow); margin-bottom: 1rem; padding: 1rem 1.1rem; scroll-margin-top: 15rem; }
    .case-card[data-suggestion="perlu-koreksi"] { border-left-color: var(--warn); }
    .case-card[data-suggestion="tak-ada-sumber"] { border-left-color: var(--danger); }
    .case-head { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: start; }
    .case-head h2 { font-size: 1.12rem; margin: 0 0 .25rem; line-height: 1.35; }
    .case-id { color: var(--muted); font: .78rem ui-monospace, Consolas, monospace; overflow-wrap: anywhere; }
    .badges { display: flex; flex-wrap: wrap; gap: .35rem; justify-content: flex-end; }
    .badge { display: inline-flex; align-items: center; min-height: 1.65rem; border: 1px solid var(--line); border-radius: 999px; padding: .18rem .55rem; color: var(--muted); background: var(--surface-2); font-size: .75rem; font-weight: 600; }
    .badge.good { color: var(--accent-strong); background: var(--accent-soft); border-color: var(--accent); }
    .badge.warn { color: var(--warn); background: var(--warn-soft); border-color: var(--warn); }
    .badge.bad { color: var(--danger); background: var(--danger-soft); border-color: var(--danger); }
    .case-meta { color: var(--muted); font-size: .88rem; margin: .55rem 0; }
    .complaint { margin: .6rem 0 0; padding: .7rem .8rem; background: var(--surface-2); border-left: 3px solid var(--line); }
    .finding { margin: .8rem 0; padding: .75rem .85rem; background: var(--warn-soft); border: 1px solid color-mix(in srgb, var(--warn) 45%, var(--line)); }
    .finding.good { background: var(--accent-soft); border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
    .finding.bad { background: var(--danger-soft); border-color: color-mix(in srgb, var(--danger) 45%, var(--line)); }
    .finding strong { display: block; margin-bottom: .25rem; }
    .finding ul { margin: .25rem 0 0; padding-left: 1.2rem; }
    details { border-top: 1px solid var(--line); padding: .65rem 0 .1rem; }
    details:last-of-type { border-bottom: 1px solid var(--line); padding-bottom: .65rem; }
    summary { cursor: pointer; color: var(--accent-strong); font-weight: 700; }
    .detail-body { padding: .75rem .2rem .25rem; }
    .columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .section h3 { font-size: .92rem; margin: 0 0 .35rem; }
    .section p, .section ul { margin: .35rem 0; }
    .section ul { padding-left: 1.15rem; }
    .plain-list { list-style: none; padding: 0 !important; }
    .plain-list li { padding: .35rem 0; border-bottom: 1px dotted var(--line); }
    .source { margin: .65rem 0; padding-left: .8rem; border-left: 3px solid var(--info); }
    .source-title { font-weight: 700; }
    .quote { margin: .55rem 0; padding: .6rem .7rem; background: var(--surface-2); font-family: Georgia, serif; }
    .locator { display: block; color: var(--muted); font: .75rem ui-monospace, Consolas, monospace; margin-top: .3rem; overflow-wrap: anywhere; }
    .limitation { color: var(--muted); font-size: .85rem; }
    table { width: 100%; border-collapse: collapse; margin: .55rem 0; font-size: .86rem; }
    th, td { text-align: left; vertical-align: top; padding: .5rem; border: 1px solid var(--line); }
    th { background: var(--surface-2); }
    .decision { margin-top: .9rem; padding-top: .8rem; border-top: 2px solid var(--line); }
    fieldset { border: 0; padding: 0; margin: 0; }
    legend { font-weight: 800; margin-bottom: .5rem; }
    .decision-options { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .45rem; }
    .decision-option { position: relative; }
    .decision-option input { position: absolute; opacity: 0; pointer-events: none; }
    .decision-option label { display: flex; min-height: 2.75rem; align-items: center; justify-content: center; text-align: center; border: 1px solid var(--line); background: var(--surface-2); padding: .5rem; cursor: pointer; }
    .decision-option input:focus-visible + label { outline: 3px solid var(--accent); outline-offset: 2px; }
    .decision-option input:checked + label { border: 2px solid var(--accent); background: var(--accent-soft); color: var(--accent-strong); font-weight: 800; }
    .decision textarea { min-height: 5.5rem; margin-top: .55rem; resize: vertical; }
    .saved { color: var(--muted); font-size: .78rem; min-height: 1.2rem; margin-top: .25rem; }
    .pagination { display: flex; justify-content: space-between; align-items: center; gap: .75rem; margin: 1rem 0; }
    .pagination-buttons { display: flex; gap: .45rem; }
    .empty { padding: 2rem; text-align: center; background: var(--surface); border: 1px solid var(--line); }
    .method { margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--line); }
    .method code { overflow-wrap: anywhere; }
    @media (max-width: 900px) {
      .summary-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .filters .search { grid-column: 1 / -1; }
      .reviewer { grid-template-columns: 1fr; }
    }
    @media (max-width: 650px) {
      .masthead-inner, .workspace, .toolbar { width: min(100% - 1rem, 1180px); }
      .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .filters { grid-template-columns: 1fr; }
      .filters .search { grid-column: auto; }
      .columns { grid-template-columns: 1fr; }
      .case-head { grid-template-columns: 1fr; }
      .badges { justify-content: flex-start; }
      .decision-options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .progress-row { grid-template-columns: 1fr; }
      .result-count { text-align: left; }
      .pagination { align-items: flex-start; flex-direction: column; }
    }
    @media print {
      .toolbar-wrap, .actions, .pagination, .skip { display: none !important; }
      body { background: #fff; color: #000; }
      .case-card { box-shadow: none; break-inside: avoid; }
      details > * { display: block !important; }
      details summary { list-style: none; }
    }
    @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; transition: none !important; } }
  </style>
</head>
<body>
  <a class="skip" href="#case-list">Lewati ke daftar kasus</a>
  <header class="masthead">
    <div class="masthead-inner">
      <h1>PRIMERA M13-137</h1>
      <p class="lede">Paket adjudikasi 137 prototipe klinis laboratorium. Artefak ini mengompilasi konten runtime, PPK/PNPK, Fornas 1199, baseline ASPAK M13-RP1, dan nomenklatur KFA. Saran kompilator adalah triase bukti, bukan keputusan medis.</p>
      <div class="scope-alert"><strong>Rekonsiliasi lingkup:</strong> ${data.scope.reconciliation}</div>
      <div class="summary-grid" aria-label="Ringkasan inventaris">
        <div class="metric"><strong>${data.scope.actualCaseCount}</strong><span>kasus aktual</span></div>
        <div class="metric"><strong>${data.summary.ppkDirect}</strong><span>PPK langsung</span></div>
        <div class="metric"><strong>${data.summary.ppkRelated}</strong><span>PPK terkait</span></div>
        <div class="metric"><strong>${data.summary.ppkAbsent}</strong><span>tanpa crosswalk PPK</span></div>
        <div class="metric"><strong>${data.summary.pnpkDirect}</strong><span>PNPK langsung</span></div>
        <div class="metric"><strong>${data.summary.resourceTierCOrD}</strong><span>kasus resource C/D</span></div>
        <div class="metric"><strong>${data.summary.resourceGrounded}</strong><span>resource C/D terjelaskan</span></div>
        <div class="metric"><strong>${data.summary.resourceUnresolved}</strong><span>resource belum terjelaskan</span></div>
      </div>
    </div>
  </header>

  <div class="toolbar-wrap">
    <div class="toolbar" aria-label="Kontrol review">
      <div class="filters">
        <input class="search" id="search" type="search" placeholder="Cari nama, ICD-10, id, obat..." aria-label="Cari kasus">
        <select id="category" aria-label="Filter kategori"><option value="">Semua kategori</option></select>
        <select id="skdi" aria-label="Filter SKDI"><option value="">Semua SKDI</option></select>
        <select id="suggestion" aria-label="Filter saran kompilator"><option value="">Semua saran</option><option value="cocok">Cocok</option><option value="perlu-koreksi">Perlu koreksi</option><option value="tak-ada-sumber">Tak ada sumber</option></select>
        <select id="decision-filter" aria-label="Filter keputusan dokter"><option value="">Semua keputusan</option><option value="belum">Belum diputuskan</option><option value="setuju">Setuju</option><option value="perlu-edit">Perlu edit</option><option value="tolak">Tolak</option><option value="nanti">Nanti</option></select>
      </div>
      <div class="reviewer" aria-label="Identitas reviewer">
        <input id="reviewer-name" type="text" placeholder="Nama reviewer" aria-label="Nama reviewer">
        <input id="reviewer-credential" type="text" placeholder="Kredensial" aria-label="Kredensial reviewer">
        <input id="review-date" type="date" aria-label="Tanggal review">
      </div>
      <div class="actions">
        <button class="primary" type="button" id="next-undecided">Kasus belum diputuskan berikutnya</button>
        <button type="button" id="export-json">Ekspor JSON</button>
        <label class="file-label" for="import-json">Impor JSON</label>
        <input class="visually-hidden" id="import-json" type="file" accept="application/json,.json">
        <button type="button" id="print">Cetak halaman</button>
        <button type="button" id="theme">Tema: otomatis</button>
        <button type="button" id="font-minus" aria-label="Perkecil teks">A-</button>
        <button type="button" id="font-plus" aria-label="Perbesar teks">A+</button>
        <button class="danger" type="button" id="reset">Reset keputusan</button>
      </div>
    </div>
  </div>

  <main class="workspace">
    <div class="progress-row">
      <div>
        <div class="progress-track" role="progressbar" aria-label="Kemajuan adjudikasi" aria-valuemin="0" aria-valuemax="${data.scope.actualCaseCount}" aria-valuenow="0"><div class="progress-fill" id="progress-fill"></div></div>
        <div class="progress-label" id="progress-label" aria-live="polite"></div>
      </div>
      <div class="result-count" id="result-count"></div>
    </div>
    <div id="case-list" tabindex="-1"></div>
    <nav class="pagination" aria-label="Navigasi halaman kasus">
      <div id="page-label"></div>
      <div class="pagination-buttons"><button type="button" id="prev-page">Sebelumnya</button><button type="button" id="next-page">Berikutnya</button></div>
    </nav>
    <section class="method">
      <h2>Metode dan batas penggunaan</h2>
      <ul>${data.globalLimitations.map((item) => `<li>${item}</li>`).join('')}</ul>
      <p class="limitation">Artefak <code>${data.artifactFingerprint}</code> · pack <code>${data.packFingerprint}</code> · content release <code>${data.contentRelease}</code> · REVISI_ENGINE ${data.engineRevision} · sumber commit <code>${data.sourceCommit}</code> · data dibuat ${data.generatedAt}</p>
    </section>
  </main>

  <script id="dataset" type="application/json">${embeddedJson(data)}</script>
  <script>
  (() => {
    'use strict'
    const DATA = JSON.parse(document.getElementById('dataset').textContent)
    const STORAGE_KEY = 'primera.m13-137.review.' + DATA.artifactFingerprint
    const PAGE_SIZE = 18
    const LABEL = { cocok: 'Cocok', 'perlu-koreksi': 'Perlu koreksi', 'tak-ada-sumber': 'Tak ada sumber' }
    const DECISION_LABEL = { setuju: 'Setuju', 'perlu-edit': 'Perlu edit', tolak: 'Tolak', nanti: 'Nanti' }
    const el = (id) => document.getElementById(id)
    let page = 1
    let state = loadState()

    function emptyState() {
      return { schema: 'primera.m13-137-review-state.v1', reviewer: { name: '', credential: '', date: '' }, decisions: {}, theme: 'auto', fontSize: 16 }
    }
    function loadState() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return parsed && parsed.schema === 'primera.m13-137-review-state.v1' ? parsed : emptyState()
      } catch (_) { return emptyState() }
    }
    function persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      updateProgress()
    }
    function esc(value) {
      return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
    }
    function fmtStatus(status) {
      const cls = status === 'cocok' ? 'good' : status === 'perlu-koreksi' ? 'warn' : 'bad'
      return '<span class="badge ' + cls + '">' + esc(LABEL[status]) + '</span>'
    }
    function drugRows(drugs) {
      if (!drugs.length) return '<p class="limitation">Tidak ada obat pada slot ini.</p>'
      return '<table><thead><tr><th>Obat</th><th>Fornas 1199</th><th>KFA active substance</th></tr></thead><tbody>' + drugs.map((drug) => {
        const fornasLocators = drug.fornas.excerpts.map((q) => '<span class="locator">' + esc(q.locator) + '</span>').join('')
        const kfa = drug.kfa.components.map((component) => esc(component.query) + ': ' + (component.matches.length ? component.matches.map((match) => '<code>' + esc(match.code) + '</code> ' + esc(match.name)).join(', ') : 'tidak ditemukan')).join('<br>')
        const availability = drug.fornas.caseAvailabilityGrounded
          ? '<div class="limitation"><strong>Graceful degradation kasus:</strong> jalur non-Fornas dinyatakan eksplisit pada catatan realita.</div>'
          : ''
        return '<tr><td><strong>' + esc(drug.name) + '</strong><span class="locator">' + esc(drug.id) + ' · ' + esc(drug.dosageForm) + '</span></td><td>' + fmtStatus(drug.fornas.status) + '<div class="limitation">' + esc(drug.fornas.note) + '</div>' + availability + fornasLocators + '</td><td>' + fmtStatus(drug.kfa.status) + '<div>' + kfa + '</div></td></tr>'
      }).join('') + '</tbody></table>'
    }
    function excerpts(items) {
      if (!items.length) return '<p class="limitation">Belum tersedia cuplikan literal ber-locator.</p>'
      return items.map((item) => '<blockquote class="quote"><strong>' + esc(item.label) + ':</strong> ' + esc(item.text) + '<span class="locator">' + esc(item.locator) + '</span></blockquote>').join('')
    }
    function ppkBlock(item) {
      const ppk = item.evidence.ppk
      if (!ppk.relation) return '<p>' + fmtStatus(ppk.status) + '</p><p class="limitation">' + esc(ppk.limitation) + '</p>'
      return '<p>' + fmtStatus(ppk.status) + ' <strong>' + esc(ppk.sourceTitle) + '</strong> · ' + esc(ppk.relation.toUpperCase()) + ' · PDF p.' + esc(ppk.pdfPage) + '</p>' +
        '<p class="limitation">ICD sumber: ' + esc(ppk.sourceIcd10.join('; ') || 'tidak tercantum') + '</p>' + excerpts(ppk.excerpts) + (ppk.limitation ? '<p class="limitation">' + esc(ppk.limitation) + '</p>' : '')
    }
    function pnpkBlock(item) {
      const group = item.evidence.pnpk
      if (!group.sources.length) return '<p>' + fmtStatus(group.status) + '</p><p class="limitation">' + esc(group.limitation) + '</p>'
      return '<p>' + fmtStatus(group.status) + '</p>' + group.sources.map((source) => '<div class="source"><div class="source-title">' + esc(source.title) + ' · ' + esc(source.relation.toUpperCase()) + '</div>' +
        (source.documentNumber ? '<div class="limitation">' + esc(source.documentNumber) + '</div>' : '') +
        (source.officialUrl ? '<a href="' + esc(source.officialUrl) + '" target="_blank" rel="noreferrer">Buka sumber resmi</a>' : '<span class="limitation">Tautan resmi belum tersimpan</span>') +
        excerpts(source.excerpts) + (source.limitation ? '<p class="limitation">' + esc(source.limitation) + '</p>' : '') + '</div>').join('')
    }
    function ebmBlock(item) {
      const group = item.evidence.ebm
      if (!group.sources.length) return '<p>' + fmtStatus(group.status) + '</p><p class="limitation">' + esc(group.limitation) + '</p>'
      return '<p>' + fmtStatus(group.status) + '</p>' + group.sources.map((source) => '<div class="source"><div class="source-title">' + esc(source.title) + ' Â· ' + esc(source.relation.toUpperCase()) + '</div>' +
        '<div class="limitation">' + esc(source.authority + ' Â· ' + source.year) + '</div>' +
        '<a href="' + esc(source.officialUrl) + '" target="_blank" rel="noreferrer">Buka sumber primer</a>' +
        '<p><strong>Locator:</strong> ' + esc(source.locator) + '</p>' +
        '<p class="limitation">' + esc(source.population + '. ' + source.facilityScope) + '</p>' +
        (source.limitation ? '<p class="limitation">' + esc(source.limitation) + '</p>' : '') + '</div>').join('') +
        (group.limitation ? '<p class="limitation">' + esc(group.limitation) + '</p>' : '')
    }
    function resourceBlock(item) {
      const r = item.evidence.aspak
      const groundingLabel = { baseline: 'Baseline A/B', declared: 'Dinyatakan kasus', unresolved: 'Belum terjelaskan' }
      return '<p>' + fmtStatus(r.status) + ' <span class="badge">Tier tertinggi ' + esc(r.highestTier) + '</span></p>' +
        (r.resources.length ? '<table><thead><tr><th>Resource</th><th>Tier</th><th>Grounding</th><th>Catatan</th></tr></thead><tbody>' + r.resources.map((resource) => '<tr><td>' + esc(resource.name) + '<span class="locator">' + esc(resource.kind + ':' + resource.id) + '</span></td><td><strong>' + esc(resource.tier) + '</strong></td><td>' + esc(groundingLabel[resource.grounding] || resource.grounding) + '</td><td>' + esc(resource.note) + '</td></tr>').join('') + '</tbody></table>' : '<p class="limitation">Tidak ada resource khusus yang dideklarasikan.</p>') + '<p class="limitation">' + esc(r.profile + '. ' + r.limitation) + '</p>'
    }
    function list(items, render) {
      return items.length ? '<ul>' + items.map((item) => '<li>' + render(item) + '</li>').join('') + '</ul>' : '<p class="limitation">Tidak ada.</p>'
    }
    function caseHtml(item) {
      const decision = state.decisions[item.id] || {}
      const findingClass = item.compiler.suggestion === 'cocok' ? 'good' : item.compiler.suggestion === 'tak-ada-sumber' ? 'bad' : ''
      const drugs = [...item.currentManagement.requiredDrugs, ...item.currentManagement.alternativeDrugs.flat(), ...item.currentManagement.optionalDrugs]
      const choices = ['setuju', 'perlu-edit', 'tolak', 'nanti'].map((value) => '<div class="decision-option"><input type="radio" name="decision-' + esc(item.id) + '" id="decision-' + esc(item.id) + '-' + value + '" value="' + value + '" ' + (decision.value === value ? 'checked' : '') + '><label for="decision-' + esc(item.id) + '-' + value + '">' + DECISION_LABEL[value] + '</label></div>').join('')
      return '<article class="case-card" id="case-' + esc(item.id) + '" data-suggestion="' + esc(item.compiler.suggestion) + '">' +
        '<div class="case-head"><div><h2>' + item.ordinal + '. ' + esc(item.name) + '</h2><div class="case-id">' + esc(item.id) + '</div></div><div class="badges"><span class="badge">' + esc(item.icd10) + '</span><span class="badge">SKDI ' + esc(item.skdi) + '</span><span class="badge">' + esc(item.category) + '</span>' + (item.mustRefer ? '<span class="badge warn">Rujuk</span>' : '<span class="badge good">Kelola FKTP</span>') + '</div></div>' +
        '<p class="case-meta">' + esc(item.demographics) + ' · fktp144=' + esc(item.fktp144) + '</p><p class="complaint"><strong>Pembuka:</strong> ' + esc(item.openingComplaint) + '</p>' +
        '<div class="finding ' + findingClass + '"><strong>Saran kompilator: ' + esc(LABEL[item.compiler.suggestion]) + '</strong>' + (item.compiler.reasons.length ? '<ul>' + item.compiler.reasons.map((reason) => '<li>' + esc(reason) + '</li>').join('') + '</ul>' : '<span>Tidak ada red flag provenance otomatis. Ini belum merupakan persetujuan klinis.</span>') + '</div>' +
        '<details><summary>Tatalaksana runtime saat ini</summary><div class="detail-body columns"><section class="section"><h3>Obat</h3>' + drugRows(drugs) + '</section><section class="section"><h3>Tindakan</h3>' + list(item.currentManagement.procedures, (x) => '<strong>' + esc(x.name) + '</strong><span class="locator">' + esc(x.id) + '</span>') + '<h3>Edukasi</h3>' + list(item.currentManagement.education, (x) => esc(x.name) + (x.critical ? ' <strong>(kritis)</strong>' : '') + '<span class="locator">' + esc(x.id) + '</span>') + '<h3>Lab relevan</h3>' + list(item.currentManagement.relevantLabs, (x) => '<strong>' + esc(x.name) + ':</strong> ' + esc(x.result) + '<span class="locator">' + esc(x.id) + '</span>') + '</section></div></details>' +
        '<details><summary>PPK 1186/2022</summary><div class="detail-body">' + ppkBlock(item) + '</div></details>' +
        '<details><summary>PNPK/pedoman program</summary><div class="detail-body">' + pnpkBlock(item) + '</div></details>' +
        '<details><summary>Pedoman EBM diagnosis-spesifik</summary><div class="detail-body">' + ebmBlock(item) + '</div></details>' +
        '<details><summary>Fornas 1199 dan KFA</summary><div class="detail-body">' + drugRows(drugs) + '<p class="limitation">' + esc(item.evidence.fornas.limitation) + ' ' + esc(item.evidence.kfa.limitation) + '</p></div></details>' +
        '<details><summary>ASPAK dan realitas resource</summary><div class="detail-body">' + resourceBlock(item) + '</div></details>' +
        '<details><summary>Teks pedagogis yang sekarang ada</summary><div class="detail-body"><div class="section"><h3>Clue</h3><p>' + esc(item.currentEditorial.clue) + '</p>' + (item.currentEditorial.officialGuidance ? '<h3>Panduan resmi</h3><p>' + esc(item.currentEditorial.officialGuidance) + '</p>' : '') + (item.currentEditorial.realityNote ? '<h3>Catatan realita</h3><p>' + esc(item.currentEditorial.realityNote) + '</p>' : '') + (item.currentEditorial.ebmPearl ? '<h3>Mutiara EBM</h3><p>' + esc(item.currentEditorial.ebmPearl) + '</p>' : '') + '</div></div></details>' +
        '<section class="decision"><fieldset><legend>Keputusan dokter untuk kasus ini</legend><div class="decision-options">' + choices + '</div></fieldset><label class="visually-hidden" for="note-' + esc(item.id) + '">Catatan keputusan ' + esc(item.name) + '</label><textarea id="note-' + esc(item.id) + '" placeholder="Catatan, koreksi, sumber tambahan, atau syarat waiver...">' + esc(decision.note || '') + '</textarea><div class="saved" id="saved-' + esc(item.id) + '">' + (decision.updatedAt ? 'Tersimpan ' + esc(decision.updatedAt) : '') + '</div></section></article>'
    }
    function searchable(item) {
      return [item.id, item.name, item.icd10, item.category, item.skdi, item.openingComplaint, ...item.currentManagement.requiredDrugs.map((x) => x.name), ...item.currentManagement.optionalDrugs.map((x) => x.name)].join(' ').toLowerCase()
    }
    function filteredCases() {
      const query = el('search').value.trim().toLowerCase()
      const category = el('category').value
      const skdi = el('skdi').value
      const suggestion = el('suggestion').value
      const decision = el('decision-filter').value
      return DATA.cases.filter((item) => {
        const current = state.decisions[item.id]?.value || 'belum'
        return (!query || searchable(item).includes(query)) && (!category || item.category === category) && (!skdi || item.skdi === skdi) && (!suggestion || item.compiler.suggestion === suggestion) && (!decision || current === decision)
      })
    }
    function render() {
      const filtered = filteredCases()
      const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
      page = Math.min(page, maxPage)
      const start = (page - 1) * PAGE_SIZE
      const visible = filtered.slice(start, start + PAGE_SIZE)
      el('case-list').innerHTML = visible.length ? visible.map(caseHtml).join('') : '<div class="empty">Tidak ada kasus yang cocok dengan filter.</div>'
      el('result-count').textContent = filtered.length + ' kasus cocok filter'
      el('page-label').textContent = 'Halaman ' + page + ' dari ' + maxPage + ' · menampilkan ' + (visible.length ? (start + 1) + '-' + (start + visible.length) : '0')
      el('prev-page').disabled = page <= 1
      el('next-page').disabled = page >= maxPage
      bindCaseInputs(visible)
      updateProgress()
    }
    function bindCaseInputs(visible) {
      visible.forEach((item) => {
        document.querySelectorAll('input[name="decision-' + CSS.escape(item.id) + '"]').forEach((radio) => radio.addEventListener('change', (event) => {
          const current = state.decisions[item.id] || {}
          state.decisions[item.id] = { ...current, value: event.target.value, updatedAt: new Date().toISOString() }
          persist()
          el('saved-' + item.id).textContent = 'Tersimpan ' + state.decisions[item.id].updatedAt
        }))
        el('note-' + item.id).addEventListener('input', (event) => {
          const current = state.decisions[item.id] || {}
          state.decisions[item.id] = { ...current, note: event.target.value, updatedAt: new Date().toISOString() }
          persist()
          el('saved-' + item.id).textContent = 'Tersimpan ' + state.decisions[item.id].updatedAt
        })
      })
    }
    function updateProgress() {
      const decided = DATA.cases.filter((item) => state.decisions[item.id]?.value).length
      const percent = Math.round(decided / DATA.cases.length * 100)
      el('progress-fill').style.width = percent + '%'
      el('progress-label').textContent = decided + '/' + DATA.cases.length + ' diputuskan (' + percent + '%)'
      el('progress-fill').parentElement.setAttribute('aria-valuenow', String(decided))
    }
    function fillFilters() {
      const categories = [...new Set(DATA.cases.map((item) => item.category))].sort()
      const skdis = [...new Set(DATA.cases.map((item) => item.skdi))].sort()
      categories.forEach((value) => el('category').insertAdjacentHTML('beforeend', '<option value="' + esc(value) + '">' + esc(value) + '</option>'))
      skdis.forEach((value) => el('skdi').insertAdjacentHTML('beforeend', '<option value="' + esc(value) + '">SKDI ' + esc(value) + '</option>'))
    }
    function applyPreferences() {
      document.documentElement.dataset.theme = state.theme === 'auto' ? '' : state.theme
      document.documentElement.style.setProperty('--font-size', state.fontSize + 'px')
      el('theme').textContent = 'Tema: ' + (state.theme === 'auto' ? 'otomatis' : state.theme === 'dark' ? 'gelap' : 'terang')
      el('reviewer-name').value = state.reviewer.name || ''
      el('reviewer-credential').value = state.reviewer.credential || ''
      el('review-date').value = state.reviewer.date || ''
    }
    function exportJson() {
      const payload = {
        schema: 'primera.m13-137-physician-decisions.v1',
        exportedAt: new Date().toISOString(),
        dataset: { artifactFingerprint: DATA.artifactFingerprint, packFingerprint: DATA.packFingerprint, contentRelease: DATA.contentRelease, engineRevision: DATA.engineRevision, sourceCommit: DATA.sourceCommit, caseCount: DATA.cases.length },
        reviewer: state.reviewer,
        summary: Object.fromEntries(['setuju', 'perlu-edit', 'tolak', 'nanti', 'belum'].map((value) => [value, DATA.cases.filter((item) => (state.decisions[item.id]?.value || 'belum') === value).length])),
        decisions: DATA.cases.map((item) => ({ caseId: item.id, decision: state.decisions[item.id]?.value || null, note: state.decisions[item.id]?.note || '', updatedAt: state.decisions[item.id]?.updatedAt || null })),
      }
      const blob = new Blob([JSON.stringify(payload, null, 2) + '\\n'], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'M13_137_KEPUTUSAN_' + (state.reviewer.name || 'reviewer').replace(/[^a-z0-9]+/gi, '_') + '.json'
      anchor.click()
      URL.revokeObjectURL(url)
    }
    async function importJson(file) {
      const payload = JSON.parse(await file.text())
      if (payload.schema !== 'primera.m13-137-physician-decisions.v1') throw new Error('Schema impor tidak dikenali.')
      if (payload.dataset?.artifactFingerprint !== DATA.artifactFingerprint || payload.dataset?.caseCount !== DATA.cases.length) throw new Error('Fingerprint artefak/jumlah kasus berbeda; impor ditolak agar keputusan tidak bergeser ke sumber atau kasus lain.')
      const validIds = new Set(DATA.cases.map((item) => item.id))
      if (!Array.isArray(payload.decisions) || payload.decisions.some((item) => !validIds.has(item.caseId))) throw new Error('Daftar caseId impor tidak cocok.')
      state.reviewer = payload.reviewer || state.reviewer
      state.decisions = Object.fromEntries(payload.decisions.filter((item) => item.decision || item.note).map((item) => [item.caseId, { value: item.decision, note: item.note, updatedAt: item.updatedAt }]))
      persist(); applyPreferences(); render()
    }
    fillFilters(); applyPreferences(); render()
    ;['search', 'category', 'skdi', 'suggestion', 'decision-filter'].forEach((id) => el(id).addEventListener(id === 'search' ? 'input' : 'change', () => { page = 1; render() }))
    ;['reviewer-name', 'reviewer-credential', 'review-date'].forEach((id) => el(id).addEventListener('input', () => {
      state.reviewer = { name: el('reviewer-name').value, credential: el('reviewer-credential').value, date: el('review-date').value }
      persist()
    }))
    el('prev-page').addEventListener('click', () => { page--; render(); el('case-list').focus() })
    el('next-page').addEventListener('click', () => { page++; render(); el('case-list').focus() })
    el('next-undecided').addEventListener('click', () => {
      el('decision-filter').value = 'belum'; el('search').value = ''; page = 1
      const cases = filteredCases(); const first = cases[0]
      render(); if (first) document.getElementById('case-' + first.id)?.scrollIntoView({ block: 'start' })
    })
    el('theme').addEventListener('click', () => { state.theme = state.theme === 'auto' ? 'light' : state.theme === 'light' ? 'dark' : 'auto'; persist(); applyPreferences() })
    el('font-minus').addEventListener('click', () => { state.fontSize = Math.max(14, state.fontSize - 1); persist(); applyPreferences() })
    el('font-plus').addEventListener('click', () => { state.fontSize = Math.min(24, state.fontSize + 1); persist(); applyPreferences() })
    el('export-json').addEventListener('click', exportJson)
    el('import-json').addEventListener('change', async (event) => { try { if (event.target.files[0]) await importJson(event.target.files[0]) } catch (error) { alert(error.message) } finally { event.target.value = '' } })
    el('print').addEventListener('click', () => window.print())
    el('reset').addEventListener('click', () => { if (confirm('Hapus seluruh keputusan dan catatan lokal untuk fingerprint ini?')) { state = emptyState(); persist(); applyPreferences(); render() } })
  })()
  </script>
</body>
</html>`
}
