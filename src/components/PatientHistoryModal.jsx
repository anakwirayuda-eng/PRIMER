/**
 * @reflection
 * [IDENTITY]: PatientHistoryModal
 * [PURPOSE]: React UI component: PatientHistoryModal.
 * [STATE]: Experimental
 * [ANCHOR]: PatientHistoryModal
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import useModalA11y from '../hooks/useModalA11y.js';
import { X, Heart, HeartCrack, Ambulance, AlertTriangle, ThumbsDown, UserCheck } from 'lucide-react';

const outcomeConfig = {
    pulih: { label: 'Pulih', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    memburuk: { label: 'Memburuk', icon: HeartCrack, color: 'text-amber-600', bg: 'bg-amber-50' },
    meninggal: { label: 'Meninggal', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    komplain: { label: 'Komplain', icon: ThumbsDown, color: 'text-orange-600', bg: 'bg-orange-50' },
    rujuk_stabil: { label: 'Rujuk (Stabil)', icon: Ambulance, color: 'text-blue-600', bg: 'bg-blue-50' },
    rujuk_tidak_perlu: { label: 'Rujuk (Tidak Perlu)', icon: Ambulance, color: 'text-purple-600', bg: 'bg-purple-50' },
    default: { label: 'Selesai', icon: UserCheck, color: 'text-slate-600', bg: 'bg-slate-50' }
};

export default function PatientHistoryModal({ patients, filter, onClose, title }) {
    const modalRef = useModalA11y(onClose);
    const filteredPatients = patients.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'bpjs') return p.social?.hasBPJS;
        if (filter === 'umum') return !p.social?.hasBPJS;
        if (filter === 'rujukan') return p.decision?.action === 'refer';
        return true;
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="patient-history-title" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                    <h2 id="patient-history-title" className="text-lg font-bold text-slate-800">{title || 'Riwayat Pasien'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        aria-label="Tutup riwayat pasien"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredPatients.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">
                            <UserCheck size={48} className="mx-auto mb-3 opacity-30" />
                            <p>Belum ada pasien dalam kategori ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredPatients.map((patient, idx) => {
                                const outcome = outcomeConfig[patient.outcomeStatus] || outcomeConfig.default;
                                const OutcomeIcon = outcome.icon;

                                return (
                                    <div
                                        key={patient.id || idx}
                                        className={`p-3 rounded-lg border ${outcome.bg} border-slate-200`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-800">{patient.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {patient.age} tahun, {patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 mt-1">
                                                    <span className="font-medium">Dx:</span> {patient.decision?.diagnoses?.[0] || patient.medicalData?.trueDiagnosisCode || '-'}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    <span className="font-medium">Keputusan:</span>{' '}
                                                    {patient.decision?.action === 'treat' ? 'Rawat Jalan' : 'Rujuk'}
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${outcome.color} ${outcome.bg}`}>
                                                <OutcomeIcon size={14} />
                                                {outcome.label}
                                            </div>
                                        </div>
                                        {/* Insurance Badge */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${patient.social?.hasBPJS ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {patient.social?.hasBPJS ? 'BPJS' : 'Umum'}
                                            </span>
                                            {patient.satisfactionScore && (
                                                <span className={`text-xs px-2 py-0.5 rounded ${patient.satisfactionScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    Kepuasan: {patient.satisfactionScore}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <p className="text-xs text-slate-500 text-center">
                        Total: {filteredPatients.length} pasien
                    </p>
                </div>
            </div>
        </div>
    );
}
