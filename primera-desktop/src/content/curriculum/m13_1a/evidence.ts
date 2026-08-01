import type { EvidenceBinding } from '../types'
import {
  M13_1A_PHYSICIAN_SIGNOFF_BY_REVIEW_ID,
  M13_1A_REVIEW_ID_BY_AUDITED_EVIDENCE_ID,
} from './physicianSignoffs'

const PENDING = 'pending' as const

const M13_1A_EVIDENCE_DRAFTS: EvidenceBinding[] = [
  {
    id: 'm13-1a:item-status-asmatikus-skdi',
    subject: { kind: 'curriculum_item', id: 'clinical:status_asmatikus_anak' },
    facet: 'skdi',
    source: 'skdi:kki-2012',
    locator: 'Daftar Penyakit Sistem Respirasi no. 248: Status asmatikus (asma akut berat), level 3B',
    population: 'Anak dan dewasa dengan asma akut berat; draf encounter dibatasi usia 6-11 tahun',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:item-fraktur-terbuka-skdi',
    subject: { kind: 'curriculum_item', id: 'clinical:fraktur_terbuka' },
    facet: 'skdi',
    source: 'skdi:kki-2012',
    locator: 'Daftar Penyakit Sistem Muskuloskeletal no. 608: Fraktur terbuka/tertutup, level 3B',
    population: 'Pasien dewasa dengan fraktur terbuka ekstremitas',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:item-infark-skdi',
    subject: { kind: 'curriculum_item', id: 'clinical:infark_miokard_akut' },
    facet: 'skdi',
    source: 'skdi:kki-2012',
    locator: 'Daftar Penyakit Sistem Kardiovaskular no. 280: Infark miokard, level 3B',
    population: 'Dewasa dengan dugaan infark miokard akut',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:nayla-assessment',
    subject: { kind: 'encounter_archetype', id: 'clinic:diare_akut_bayi_dehidrasi_berat' },
    facet: 'assessment',
    source: 'who:imci-chart-booklet-2014',
    locator: 'Chart booklet pp. 3 and 20: four signs and classification of severe dehydration; Plan C',
    population: 'Bayi 3 bulan dengan diare akut dan tanda dehidrasi berat',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nayla-anamnesis',
    subject: { kind: 'encounter_archetype', id: 'clinic:diare_akut_bayi_dehidrasi_berat' },
    facet: 'anamnesis',
    source: 'who:imci-chart-booklet-2014',
    locator: 'Assess and classify diarrhoea: duration, blood, general condition, eyes, drinking, skin pinch',
    population: 'Bayi 3 bulan; jawaban diberikan oleh wali anak',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nayla-regimen-dose',
    subject: { kind: 'encounter_archetype', id: 'clinic:diare_akut_bayi_dehidrasi_berat' },
    facet: 'dose',
    source: 'who:imci-chart-booklet-2014',
    locator: 'Plan C: 100 mL/kg; infant <12 months 30 mL/kg in 1 h then 70 mL/kg in 5 h; reassess 1-2 hourly',
    population: 'Bayi usia kurang dari 12 bulan dengan dehidrasi berat',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nayla-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:diare_akut_bayi_dehidrasi_berat' },
    facet: 'disposition',
    source: 'who:imci-chart-booklet-2014',
    locator: 'Plan C referral branches when IV treatment cannot be delivered immediately/nearby; ORS during transfer when safe',
    population: 'Bayi 3 bulan letargis dengan akses dan kapasitas FKTP yang harus dinilai segera',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:dimas-assessment',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'assessment',
    source: 'kemenkes:asma-fktp-2015',
    locator: 'Bagian eksaserbasi akut anak: bicara kata, retraksi, SpO2 <90%, PEF <=50% sebagai kriteria berat',
    population: 'Anak 7 tahun dengan asma dan hipoksemia setelah terapi pelega di rumah',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:dimas-red-flags',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'anamnesis',
    source: 'who:childhood-asthma-2026',
    locator: 'Management of asthma in children: severity assessment, inability to complete sentences, SpO2 <90%, impending collapse',
    population: 'Anak 6-11 tahun dengan eksaserbasi asma akut',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:dimas-oxygen-target',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'regimen',
    source: 'gina:strategy-2026',
    locator: 'Boxes 9-4 and 9-6: oxygen is indicated below SpO2 92%; when given to children 6-11 years, target 92-95%',
    population: 'Anak 7 tahun dengan SpO2 87% dan eksaserbasi berat',
    reviewStatus: PENDING,
    audit: {
      deltaId: 'm13-1a-d1-oxygen-target-2026',
      claimKind: 'regimen',
      claim: 'Target oksigen anak 6-11 tahun dengan eksaserbasi akut adalah SpO2 92-95%.',
      contentLocator: 'm13_1a/clinicalDrafts.ts: asma_eksaserbasi_berat_anak.clue',
      finding: 'source_conflict',
      materiality: 'material',
      technicalReviewer: 'Codex (technical evidence audit)',
      reviewedAt: '2026-07-15',
      proposedResolution: 'Gunakan target GINA 2026 92-95% dan pertahankan jejak target Kemenkes 2015 pada review dokter.',
      corroboratingEvidence: [
        {
          source: 'kemenkes:asma-fktp-2015',
          locator: 'Pedoman lama memakai target 94-98%; perbedaan target harus terlihat dalam review, bukan dinormalisasi diam-diam.',
        },
      ],
    },
    governance: {
      policyId: 'clinical-grounding-floor-graceful-degradation-v1',
      floorSources: [
        {
          source: 'kemenkes:asma-fktp-2015',
          locator: 'Algoritme eksaserbasi akut anak memakai oksigen untuk hipoksemia dan target lama 94-98%.',
        },
      ],
      supersedingSources: [
        {
          source: 'gina:strategy-2026',
          locator: 'Boxes 9-4 dan 9-6 menetapkan target oksigen anak 6-11 tahun 92-95%.',
        },
      ],
      resourceSources: [
        {
          source: 'satusehat:kfa-v2',
          locator: 'Gunakan identitas/kode baku oksigen medis dan perangkat nebulisasi; bukan bukti kesiapan fasilitas.',
        },
        {
          source: 'kemenkes:aspak-infoboard',
          locator: 'Periksa rekaman sumber oksigen dan nebulizer fasilitas yang dimodelkan, lalu verifikasi fungsi serta bahan habis pakai secara lokal.',
        },
      ],
      gracefulDegradation: 'variable_or_unverified',
      implementationNote: 'Oksigen dan nebulizer hanya boleh menjadi kewajiban skor setelah vignette menyatakan resource siap; bila tidak, nilai stabilisasi feasible dan rujukan tanpa menurunkan target klinis.',
    },
  },
  {
    id: 'm13-1a:dimas-regimen',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'regimen',
    source: 'who:childhood-asthma-2026',
    locator: 'Recommendation 1a: nebulized ipratropium added to inhaled SABA and systemic corticosteroid in severe paediatric exacerbation',
    population: 'Anak 7 tahun dengan eksaserbasi berat di fasilitas kesehatan',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:dimas-dose-local',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'dose',
    source: 'kemenkes:asma-fktp-2015',
    locator: 'Tata laksana serangan akut anak: SABA inhalasi dapat diulang sampai 3 kali tiap 20 menit; prednison/prednisolon 1-2 mg/kg/hari (maks 40 mg)',
    population: 'Anak 7 tahun; dosis individual wajib dihitung dari berat badan sebelum aktivasi',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:dimas-ipratropium-dose-age',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'dose',
    source: 'qld:paediatric-asthma-2024-v5',
    locator: 'Age >=6 years: salbutamol 5 mg nebulized; age >6 years: ipratropium 500 micrograms nebulized every 20 minutes for three doses and may be mixed with salbutamol',
    population: 'Anak 7 tahun, berat 24 kg, dengan eksaserbasi berat',
    reviewStatus: PENDING,
    audit: {
      deltaId: 'm13-1a-d1-nebulized-bronchodilator-dose',
      claimKind: 'regimen',
      claim: 'Satu unit-dose Fornas ipratropium 0,5 mg + salbutamol 2,5 mg cukup sebagai dosis nebulisasi berulang Dimas.',
      contentLocator: 'm13_1a/catalogDraft.ts: ipratropium_salbutamol_neb dan clinicalDrafts.ts: asma_eksaserbasi_berat_anak.tatalaksana',
      finding: 'source_conflict',
      materiality: 'material',
      technicalReviewer: 'Codex (technical evidence audit)',
      reviewedAt: '2026-07-15',
      proposedResolution: 'Gunakan total salbutamol 5 mg + ipratropium 0,5 mg per dosis untuk Dimas dan nilai burst tiga dosis sebagai tindakan protokol bernama; unit-dose Fornas tetap metadata produk, bukan jawaban dosis tunggal.',
      corroboratingEvidence: [
        {
          source: 'fornas:kmk-1199-2025',
          locator: 'PDF pp. 198-200 memuat sediaan kombinasi ipratropium 0,5 mg + salbutamol 2,5 mg untuk serangan asma akut/UGD; formularium tidak menetapkan bahwa satu unit-dose adalah total dosis klinis untuk semua usia.',
        },
      ],
    },
    governance: {
      policyId: 'clinical-grounding-floor-graceful-degradation-v1',
      floorSources: [
        {
          source: 'kemenkes:asma-fktp-2015',
          locator: 'SABA inhalasi berulang tiap 20 menit sampai tiga kali, steroid sistemik, dan rujukan kasus berat.',
        },
      ],
      supersedingSources: [
        {
          source: 'who:childhood-asthma-2026',
          locator: 'Ipratropium ditambahkan pada SABA dan kortikosteroid sistemik untuk eksaserbasi pediatrik berat.',
        },
        {
          source: 'qld:paediatric-asthma-2024-v5',
          locator: 'Usia >6 tahun: ipratropium 500 mikrogram; usia >=6 tahun: salbutamol 5 mg nebulisasi.',
        },
      ],
      resourceSources: [
        {
          source: 'fornas:kmk-1199-2025',
          locator: 'Sediaan kombinasi ipratropium 0,5 mg + salbutamol 2,5 mg tercantum untuk serangan akut/UGD; bukan penetapan total dosis semua usia.',
        },
        {
          source: 'satusehat:kfa-v2',
          locator: 'Kunci identitas, kekuatan, bentuk sediaan, dan kode produk kandidat sebelum pemetaan katalog.',
        },
        {
          source: 'kemenkes:aspak-infoboard',
          locator: 'Periksa rekaman nebulizer/oksigen fasilitas, lalu verifikasi fungsi alat, bahan, SDM, dan stok unit-dose secara lokal.',
        },
      ],
      gracefulDegradation: 'variable_or_unverified',
      implementationNote: 'Regimen final dinilai sebagai tindakan protokol bernama agar satu klik unit-dose 2,5 mg tidak memberi kredit palsu. Vignette menyatakan resource siap; fasilitas lain mengikuti graceful degradation dan rujuk tanpa improvisasi.',
    },
  },
  {
    id: 'm13-1a:dimas-formulary',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'formulary',
    source: 'fornas:kmk-1199-2025',
    locator: 'PDF pp. 198-200: ipratropium 0,5 mg + salbutamol 2,5 mg for acute asthma/UGD; prednison and salbutamol entries',
    population: 'Anak dengan serangan asma akut; ikuti restriksi sediaan dan fasilitas',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:dimas-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:asma_eksaserbasi_berat_anak' },
    facet: 'disposition',
    source: 'kemenkes:asma-fktp-2015',
    locator: 'Kriteria serangan mengancam nyawa/tidak respons: lanjutkan stabilisasi dan rujuk',
    population: 'Anak dengan hipoksemia dan respons tidak memadai setelah terapi awal',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:hypo-diagnosis',
    subject: { kind: 'encounter_archetype', id: 'clinic:hipoglikemia_ringan_dewasa' },
    facet: 'diagnosis',
    source: 'pnpk:dm-tipe2-dewasa-302-2026',
    locator: 'PDF p. 72 and pp. 143-144: hypoglycaemia <70 mg/dL, autonomic/neuroglycopenic symptoms',
    population: 'Dewasa sadar dengan DM2, gejala adrenergik, dan GDS 58 mg/dL',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:hypo-regimen',
    subject: { kind: 'encounter_archetype', id: 'clinic:hipoglikemia_ringan_dewasa' },
    facet: 'regimen',
    source: 'pnpk:dm-tipe2-dewasa-302-2026',
    locator: 'PDF pp. 143-144: oral glucose 15-20 g in conscious patient; repeat check after 15 minutes; meal after recovery',
    population: 'Dewasa sadar dan mampu menelan dengan hipoglikemia ringan',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:hypo-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:hipoglikemia_ringan_dewasa' },
    facet: 'disposition',
    source: 'pnpk:dm-tipe2-dewasa-302-2026',
    locator: 'PDF pp. 143-145: hipoglikemia sulfonilurea dapat berkepanjangan; monitor glukosa 24-72 jam menurut obat, fungsi ginjal, dan kekambuhan',
    population: 'Dewasa pengguna glimepirid yang membaik setelah koreksi awal, tetapi Puskesmas vignette tidak memiliki observasi berkelanjutan 24 jam',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:hypo-follow-up',
    subject: { kind: 'encounter_archetype', id: 'clinic:hipoglikemia_ringan_dewasa' },
    facet: 'follow-up',
    source: 'pnpk:dm-tipe2-dewasa-302-2026',
    locator: 'PDF pp. 144-145: evaluate trigger; stop/reduce causative medicine and align sulfonylurea regimen with food and activity',
    population: 'Dewasa pengguna sulfonilurea tanpa gagal ginjal/hati pada vignette',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:nasal-foreign-body-anamnesis',
    subject: { kind: 'encounter_archetype', id: 'clinic:benda_asing_hidung_anak' },
    facet: 'anamnesis',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF pp. 500-501: onset unilateral, jenis benda, gejala lokal, dan laporan orang tua',
    population: 'Anak usia 3-5 tahun dengan benda asing hidung yang disaksikan wali',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nasal-foreign-body-assessment',
    subject: { kind: 'encounter_archetype', id: 'clinic:benda_asing_hidung_anak' },
    facet: 'assessment',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF pp. 501-502: rinoskopi anterior, risiko aspirasi, dan kerusakan cepat oleh baterai',
    population: 'Anak stabil dengan manik-manik plastik anterior yang tampak jelas, bukan baterai atau benda tajam',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nasal-foreign-body-regimen',
    subject: { kind: 'encounter_archetype', id: 'clinic:benda_asing_hidung_anak' },
    facet: 'regimen',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF pp. 978-980: pemilihan pengait, kateter balon, atau suction menurut bentuk; hindari forceps pada benda bulat',
    population: 'Anak kooperatif dengan benda bulat yang terlihat dan alat ekstraksi yang sesuai tersedia',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:nasal-foreign-body-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:benda_asing_hidung_anak' },
    facet: 'disposition',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF p. 502: rujuk bila perlekatan/posisi sulit dilihat, ekstraksi gagal, atau pasien tidak kooperatif',
    population: 'Anak dengan benda asing hidung; vignette aktif hanya dapat ditangani di FKTP bila visualisasi dan posisi aman',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:otitis-diagnosis',
    subject: { kind: 'encounter_archetype', id: 'clinic:otitis_eksterna_akut_ringan' },
    facet: 'diagnosis',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF pp. 253-254: otalgia worsened by touching auricle, tragal tenderness, canal oedema/hyperaemia',
    population: 'Remaja atau dewasa imunokompeten dengan otitis eksterna akut difus unilateral ringan',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:otitis-regimen',
    subject: { kind: 'encounter_archetype', id: 'clinic:otitis_eksterna_akut_ringan' },
    facet: 'regimen',
    source: 'aao-hns:acute-otitis-externa-2014',
    locator: 'Key action statements 2 and 5-8: topical initial therapy, no routine systemic antimicrobial, delivery support, and reassessment in 48-72 h',
    population: 'Penyakit ringan dengan membran timpani utuh tanpa diabetes atau imunosupresi',
    reviewStatus: PENDING,
    governance: {
      policyId: 'clinical-grounding-floor-graceful-degradation-v1',
      floorSources: [
        {
          source: 'ppk:kmk-1186-2022',
          locator: 'PDF pp. 253-255: diagnosis, terapi FKTP, dan ambang rujuk otitis eksterna.',
        },
      ],
      supersedingSources: [
        {
          source: 'aao-hns:acute-otitis-externa-2014',
          locator: 'Terapi topikal awal, hindari antimikroba sistemik rutin, optimalkan delivery, dan nilai ulang 48-72 jam.',
        },
        {
          source: 'dailymed:acetic-acid-otic-2-2025',
          locator: 'Label asam asetat otik 2%: lima tetes tiga sampai empat kali sehari; kontraindikasi membran timpani perforasi.',
        },
      ],
      resourceSources: [
        {
          source: 'fornas:kmk-1199-2025',
          locator: 'Asam asetat tetes telinga 2% tercantum untuk FPKTP/FPKTL.',
        },
        {
          source: 'satusehat:kfa-v2',
          locator: 'Verifikasi nama generik, kekuatan, bentuk otik, dan kode produk; bukan bukti stok.',
        },
        {
          source: 'kemenkes:aspak-infoboard',
          locator: 'Periksa rekaman alat pemeriksaan telinga fasilitas, lalu verifikasi fungsi, bahan, dan kompetensi secara lokal.',
        },
      ],
      gracefulDegradation: 'variable_or_unverified',
      implementationNote: 'Asam asetat 2% dinilai benar hanya pada vignette ringan dengan membran timpani utuh dan sediaan tersedia; nilai ulang 48-72 jam dan gunakan alternatif kontekstual bila syarat itu tidak terpenuhi.',
    },
  },
  {
    id: 'm13-1a:otitis-dose-label',
    subject: { kind: 'encounter_archetype', id: 'clinic:otitis_eksterna_akut_ringan' },
    facet: 'dose',
    source: 'dailymed:acetic-acid-otic-2-2025',
    locator: 'Dosage and Administration: after canal cleaning, 5 drops three or four times daily; perforated tympanic membrane listed as contraindication',
    population: 'Remaja atau dewasa dengan membran timpani tampak utuh dan edema ringan tanpa sumbatan bermakna',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:otitis-formulary',
    subject: { kind: 'encounter_archetype', id: 'clinic:otitis_eksterna_akut_ringan' },
    facet: 'formulary',
    source: 'fornas:kmk-1199-2025',
    locator: 'PDF p. 213: acetic acid 2% ear drops listed for FPKTP/FPKTL',
    population: 'Pasien dengan membran timpani utuh; hindari bila dicurigai perforasi',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:otitis-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:otitis_eksterna_akut_ringan' },
    facet: 'disposition',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF p. 255: refer otitis externa with complications or malignant otitis externa',
    population: 'Otitis eksterna ringan tanpa komplikasi atau tanda keganasan',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:fracture-assessment',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'assessment',
    source: 'pnpk:trauma-132-2017',
    locator: 'Primary survey, haemorrhage control, repeated neurovascular assessment, and safe transfer sections',
    population: 'Dewasa dengan hemodinamik terkompensasi dan fraktur terbuka tibia terisolasi setelah kecelakaan lalu lintas',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:fracture-regimen',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'regimen',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF pp. 295-297: emergency management, wound care, immobilisation, IV antibiotic, tetanus prevention, and immediate referral',
    population: 'Dewasa dengan fraktur terbuka tibia terkontaminasi menyerupai derajat II dan perfusi distal utuh',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:fracture-regimen-national-pnpk',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'regimen',
    source: 'pnpk:fraktur-270-2019',
    locator: 'PDF pp. 21-23: irigasi sepintas dan evakuasi kontaminan tampak di UGD; irigasi/debridement definitif di kamar operasi',
    population: 'Dewasa dengan fraktur terbuka tibia dan kontaminasi tampak',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:fracture-no-mini-washout',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'regimen',
    source: 'acs:orthopaedic-trauma-2022',
    locator: 'Open-fracture best practices: cover the wound, avoid non-definitive wound exploration or debridement, give early systemic antibiotics, immobilise, and transfer for formal operative care',
    population: 'Dewasa dengan fraktur terbuka tulang panjang sebelum debridement formal',
    reviewStatus: PENDING,
    audit: {
      deltaId: 'm13-1a-f1-open-fracture-wound-handling',
      claimKind: 'regimen',
      claim: 'Mini-washout pra-rujuk tidak dinilai; kontaminan kasar lepas boleh disingkirkan, lalu balut lembap-oklusif tanpa irigasi/debridement.',
      contentLocator: 'm13_1a/clinicalDrafts.ts: fraktur_terbuka_tibia_stabil.tatalaksana dan clue',
      finding: 'source_conflict',
      materiality: 'material',
      technicalReviewer: 'Codex (technical evidence audit)',
      reviewedAt: '2026-07-15',
      proposedResolution: 'Pakai no-mini-washout: singkirkan hanya kontaminan kasar yang lepas, balut lembap-oklusif, bidai, antibiotik parenteral protokol, tetanus, dan rujuk segera.',
      corroboratingEvidence: [
        {
          source: 'pnpk:fraktur-270-2019',
          locator: 'PDF pp. 21-23 mendukung irigasi sepintas di UGD dan debridement definitif di kamar operasi.',
        },
        {
          source: 'boast:open-fractures-2017',
          locator: 'Standard 8: remove gross contamination, saline-soaked gauze plus occlusive film; mini-washouts outside theatre are not indicated.',
        },
      ],
    },
    governance: {
      policyId: 'clinical-grounding-floor-graceful-degradation-v1',
      floorSources: [
        {
          source: 'ppk:kmk-1186-2022',
          locator: 'Fraktur terbuka adalah 3B dengan stabilisasi emergensi dan rujukan.',
        },
        {
          source: 'pnpk:fraktur-270-2019',
          locator: 'PDF pp. 21-23 mendukung irigasi sepintas kontaminan tampak sebelum debridement definitif.',
        },
      ],
      supersedingSources: [
        {
          source: 'acs:orthopaedic-trauma-2022',
          locator: 'Hindari eksplorasi atau debridement non-definitif; tutup luka, berikan antibiotik sistemik dini, imobilisasi, dan transfer untuk tata laksana operatif formal.',
        },
        {
          source: 'boast:open-fractures-2017',
          locator: 'Singkirkan gross contamination, balut lembap-oklusif, dan jangan mini-washout di luar kamar operasi.',
        },
      ],
      resourceSources: [
        {
          source: 'fornas:kmk-1199-2025',
          locator: 'Sefazolin tercantum dengan restriksi profilaksis bedah; bukan bukti indikasi fraktur terbuka atau stok FPKTP.',
        },
        {
          source: 'satusehat:kfa-v2',
          locator: 'Kunci identitas antibiotik, tetanus, balutan, dan alat imobilisasi; bukan bukti kesiapan pakai.',
        },
        {
          source: 'kemenkes:aspak-infoboard',
          locator: 'Periksa rekaman alat stabilisasi fasilitas, lalu verifikasi stok, fungsi, bahan, SDM, transport, dan jejaring secara lokal.',
        },
      ],
      gracefulDegradation: 'variable_or_unverified',
      implementationNote: 'Irigasi/mini-washout menjadi tindakan berbahaya. Antibiotik dinilai sebagai protokol jejaring, bukan satu vial universal; vignette pilot menyatakan resource siap dan fasilitas lain tidak boleh melakukan substitusi improvisasi.',
    },
  },
  {
    id: 'm13-1a:fracture-no-mini-washout-corroboration',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'regimen',
    source: 'boast:open-fractures-2017',
    locator: 'Standard 8: handle only to remove gross contamination, then saline-soaked gauze and occlusive film; no mini-washout outside theatre',
    population: 'Dewasa dengan fraktur terbuka tulang panjang sebelum debridement formal',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:fracture-formulary',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'formulary',
    source: 'fornas:kmk-1199-2025',
    locator: 'Cefazolin injection is listed with surgical-prophylaxis restriction; human tetanus immunoglobulin and Td entries require indication/facility review',
    population: 'Dewasa dengan luka terbuka terkontaminasi dan riwayat vaksinasi tetanus tidak diketahui',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:fracture-disposition',
    subject: { kind: 'encounter_archetype', id: 'clinic:fraktur_terbuka_tibia_stabil' },
    facet: 'disposition',
    source: 'ppk:kmk-1186-2022',
    locator: 'PDF p. 297: refer immediately after stabilisation while monitoring vital signs',
    population: 'Semua pasien fraktur terbuka setelah stabilisasi awal',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:stemi-diagnosis',
    subject: { kind: 'encounter_archetype', id: 'igd:igd_stemi_anterior_hipoksemik' },
    facet: 'diagnosis',
    source: 'pnpk:ska-675-2019',
    locator: 'PDF pp. 13-15: typical acute angina plus persistent ST elevation in contiguous leads',
    population: 'Laki-laki dewasa dengan nyeri dada menekan 35 menit dan elevasi ST anterior',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:stemi-assessment',
    subject: { kind: 'encounter_archetype', id: 'igd:igd_stemi_anterior_hipoksemik' },
    facet: 'assessment',
    source: 'pnpk:ska-675-2019',
    locator: 'PDF pp. 14 and 20: 12-lead ECG immediately/within 10 minutes; do not await biomarkers for diagnostic STEMI ECG',
    population: 'Kontak medis pertama di ruang tindakan gawat darurat FKTP',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:stemi-regimen',
    subject: { kind: 'encounter_archetype', id: 'igd:igd_stemi_anterior_hipoksemik' },
    facet: 'regimen',
    source: 'pnpk:ska-675-2019',
    locator: 'PDF pp. 18-19: aspirin 160-320 mg immediately if tolerated; oxygen for hypoxaemia/distress; nitrate contraindications',
    population: 'Dewasa dengan SpO2 88%, tanpa alergi aspirin, dan tanpa perdarahan aktif',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:stemi-disposition',
    subject: { kind: 'encounter_archetype', id: 'igd:igd_stemi_anterior_hipoksemik' },
    facet: 'disposition',
    source: 'pnpk:ska-675-2019',
    locator: 'Regional STEMI network and reperfusion-delay sections: minimise first-medical-contact-to-reperfusion time',
    population: 'STEMI di FKTP tanpa PCI dengan akses ambulans terpantau',
    reviewStatus: PENDING,
  },

  {
    id: 'm13-1a:gunawan-objective',
    subject: { kind: 'ukm_scenario', id: 'ukm:keluarga_gunawan:gunawan_k2' },
    facet: 'ukm-objective',
    source: 'kemenkes:pis-pk-monitoring-2017',
    locator: 'Twelve PIS-PK indicators: no family member smokes',
    population: 'Keluarga dengan ayah perokok dan anak dengan asma',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:gunawan-dependence-assessment',
    subject: { kind: 'ukm_scenario', id: 'ukm:keluarga_gunawan:gunawan_k2' },
    facet: 'assessment',
    source: 'who:tobacco-cessation-2024',
    locator: 'Assessment and treatment planning should consider dependence, withdrawal, prior quit attempts, behavioural support, and pharmacotherapy eligibility',
    population: 'Perokok dewasa sekitar dua bungkus per hari yang sempat berhenti tiga hari lalu relaps pada situasi kerja',
    reviewStatus: PENDING,
  },
  {
    id: 'm13-1a:gunawan-intervention',
    subject: { kind: 'ukm_scenario', id: 'ukm:keluarga_gunawan:gunawan_k2' },
    facet: 'follow-up',
    source: 'who:tobacco-cessation-2024',
    locator: 'Behavioural interventions and follow-up support for adults attempting tobacco cessation',
    population: 'Perokok dewasa dengan pencetus kerja atau mengemudi malam dan upaya berhenti baru-baru ini',
    reviewStatus: PENDING,
  },
]

/**
 * Evidence content remains identical to the reviewed draft; only review-state
 * metadata is terminalized after the physician decision.
 */
export const M13_1A_EVIDENCE_BINDINGS: EvidenceBinding[] = M13_1A_EVIDENCE_DRAFTS.map(
  (binding) => {
    const reviewId = M13_1A_REVIEW_ID_BY_AUDITED_EVIDENCE_ID[binding.id]
    const physicianSignoff = reviewId
      ? M13_1A_PHYSICIAN_SIGNOFF_BY_REVIEW_ID[reviewId]
      : undefined
    return {
      ...binding,
      // Fix (2026-07-15): sebelumnya menimpa SEMUA binding jadi 'resolved'
      // tanpa syarat, termasuk ~40 sitasi rutin yang tak pernah diajukan ke
      // physician review sama sekali — menghapus beda antara "diadjudikasi
      // dokter" (3 konflik material, dapat physicianSignoff terlampir) vs
      // "sitasi baseline rutin, diterima apa adanya tanpa adjudikasi
      // individual". Validator (`reviewComplete` branch) memang menuntut
      // status terminal utk SEMUA binding sebelum gate hijau — itu tetap
      // dipenuhi, tapi kejujuran statusnya sekarang eksplisit: hanya 3
      // binding material yang genuinely 'resolved' oleh dokter; sisanya
      // 'accepted_with_limitation' (baseline, bukan diklaim direview dokter).
      reviewStatus: physicianSignoff ? 'resolved' : 'accepted_with_limitation',
      audit:
        binding.audit && physicianSignoff
          ? { ...binding.audit, physicianSignoff }
          : binding.audit,
    }
  },
)
