const fs = require('fs');
const path = require('path');
const cases = ['gerd_erosive','gastritis_erosive','diare_akut_non_spesifik','demam_tifoid','lbp_mechanical','gout_arthritis','gout_akut','contact_dermatitis','scabies','tinea_corporis','scabies_infeksi','tinea_corporis_extensive','dermatitis_kontak_iritan','tension_headache','vertigo_bppv','migraine','kejang_demam','migrain','tension_headache_chronic','alzheimers_early','asma_bronkiale_akut','bronkhitis_akut','pneumonia_bakterial','anemia_deficiency','anemia_defisiensi_besi_simptomatik','dbd_grade_1','konjungtivitas_bakterial','hordeolum_eksternum','presbyopia','faringitis_akut','tonsilitis_akut','otitis_media_akut','furunkel_hidung','faringitis_streptokokus','insomnia','isk_uncomplicated','sifilis_stadium_1','gonore_uncomplicated','normal_pregnancy','stomatitis_aftosa','diabetes_melitus_tipe_2','general_checkup','heart_failure_congestive','leukemia_suspicion'];
function searchDir(dir) {
  const files = fs.readdirSync(dir);
  let results = {};
  for (const f of files) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) { Object.assign(results, searchDir(fp)); continue; }
    if (!f.endsWith('.js')) continue;
    const content = fs.readFileSync(fp, 'utf8');
    for (const c of cases) {
      if (content.includes("id: '" + c + "'")) {
        if (!results[fp]) results[fp] = [];
        results[fp].push(c);
      }
    }
  }
  return results;
}
const r = searchDir(path.join(__dirname, 'src', 'content', 'cases'));
for (const [file, ids] of Object.entries(r)) {
  console.log(path.relative(__dirname, file) + ': ' + ids.join(', '));
}
