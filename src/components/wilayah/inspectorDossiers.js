import { BUILDING_TYPES } from './constants.js';

const BUILDING_INSPECTOR_DOSSIERS = {
    [BUILDING_TYPES.RTK]: {
        eyebrow: 'Maternal Hub',
        title: 'RTK menjadi buffer terakhir sebelum rujukan obstetri berjalan.',
        summary: 'Node ini dipakai untuk mengunci triage, tas siaga, donor darah, dan negosiasi keluarga sebelum ibu risiko tinggi bergerak ke RS.',
        shellClassName: 'border-rose-500/20 bg-gradient-to-br from-rose-500/12 via-fuchsia-500/10 to-slate-950/70',
        eyebrowClassName: 'border-rose-400/35 bg-rose-500/18 text-rose-200',
        metricClassName: 'border-rose-500/15 bg-black/20',
        metricValueClassName: 'text-rose-100',
        focusBulletClassName: 'bg-rose-300',
        focusPoints: [
            'Jangan biarkan ibu risiko tinggi pulang lagi ke rumah ketika tanda bahaya sudah muncul.',
            'Dokumen, JKN, donor darah, dan jalur malam harus beres sebelum kontraksi aktif.',
            'Gunakan RTK sebagai ruang briefing keluarga agar rujukan tidak telat oleh negosiasi yang berulang.'
        ],
        metrics: [
            { label: 'Loop', value: 'Triage -> Tas Siaga -> Transport' },
            { label: 'Tekanan', value: 'SC ulang / preeklampsia / keluarga ragu' },
            { label: 'Bridge', value: 'Rumah -> RTK -> RS' }
        ],
        caseHint: 'Kasus terkait di bawah cocok untuk menguji delay rujukan maternal dan dilema keputusan keluarga.'
    },
    [BUILDING_TYPES.PADEPOKAN_DUKUN]: {
        eyebrow: 'Budaya + Evidence',
        title: 'Padepokan adalah titik mediasi, bukan sekadar sumber masalah.',
        summary: 'Node ini penting ketika keyakinan, pantangan, dan otoritas budaya menentukan apakah warga mau menerima bidan, obat, atau rujukan.',
        shellClassName: 'border-violet-500/20 bg-gradient-to-br from-violet-500/12 via-fuchsia-500/10 to-slate-950/70',
        eyebrowClassName: 'border-violet-400/35 bg-violet-500/18 text-violet-200',
        metricClassName: 'border-violet-500/15 bg-black/20',
        metricValueClassName: 'text-violet-100',
        focusBulletClassName: 'bg-violet-300',
        focusPoints: [
            'Baca mitos dan pantangan yang membuat tanda bahaya terlihat normal atau dianggap urusan gaib.',
            'Pisahkan herbal pendamping yang aman dari racikan yang menunda terapi inti dan rujukan.',
            'Bangun kemitraan bidan-dukun agar warga tidak mendapat dua pesan yang saling bertolak belakang.'
        ],
        metrics: [
            { label: 'Loop', value: 'Ritual -> Herbal -> Mediasi' },
            { label: 'Tekanan', value: 'Mitos / pantangan / delay rujukan' },
            { label: 'Bridge', value: 'Tradisi -> Bidan / RS' }
        ],
        caseHint: 'Kasus terkait di bawah cocok untuk konflik tradisi vs evidence, terutama saat warga datang lebih dulu ke otoritas budaya.'
    }
};

export function getBuildingInspectorDossier(buildingType) {
    if (!buildingType) return null;
    return BUILDING_INSPECTOR_DOSSIERS[buildingType] || null;
}
