const fs = require('fs');

const targets = [
  { file: 'src/content/cases/modules/modules/neurology.js', cases: ['tension_headache','vertigo_bppv','migraine','kejang_demam','migrain','tension_headache_chronic','alzheimers_early'], dupeKey: 'symptoms' },
  { file: 'src/content/cases/modules/modules/hematology.js', cases: ['dbd_grade_1'], dupeKey: 'relevantLabs' }
];

let totalFixed = 0;

targets.forEach(({ file, cases, dupeKey }) => {
  let c = fs.readFileSync(file, 'utf8');
  const lines = c.split('\n');

  cases.forEach(caseId => {
    const marker = "id: '" + caseId + "'";
    // Find all lines with this key at indent=8
    const keyPattern = new RegExp('^\\s{8}' + dupeKey + ':');
    let caseStartLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(marker)) { caseStartLine = i; break; }
    }
    if (caseStartLine === -1) return;

    // Find next case boundary
    let caseEndLine = lines.length;
    for (let i = caseStartLine + 5; i < lines.length; i++) {
      if (/^\s{4}\{/.test(lines[i]) || /^\s{4}\]/.test(lines[i])) { caseEndLine = i; break; }
    }

    // Find all key occurrences within this case
    const keyLines = [];
    for (let i = caseStartLine; i < caseEndLine; i++) {
      if (keyPattern.test(lines[i])) keyLines.push(i);
    }

    if (keyLines.length > 1) {
      // Remove the SECOND occurrence (the original that was already there)
      const removeLine = keyLines[1];
      console.log(caseId + ': removing duplicate ' + dupeKey + ' at line ' + (removeLine + 1) + ': ' + lines[removeLine].trim().substring(0, 60));
      lines.splice(removeLine, 1);
      totalFixed++;
    }
  });

  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Saved ' + file);
});

console.log('\nFixed ' + totalFixed + ' duplicates');
