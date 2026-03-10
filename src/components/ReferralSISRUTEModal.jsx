/**
 * @reflection
 * [IDENTITY]: ReferralSISRUTEModal
 * [PURPOSE]: React UI component: ReferralSISRUTEModal.
 * [STATE]: Experimental
 * [ANCHOR]: ReferralSISRUTEModal
 * [DEPENDS_ON]: GameContext, HospitalDB, FKTP144Diseases
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React, { useState } from 'react';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import { HOSPITALS, AMBULANCES } from '../data/HospitalDB.js';
import {
    X, AlertTriangle, Send, Truck, Building2, ClipboardList,
    ArrowRight, ArrowLeft, CheckCircle, Info, Activity, MapPin
} from 'lucide-react';
import { isFKTPMandatory, getFKTPDiseaseByCode } from '../data/FKTP144Diseases.js';

export default function ReferralSISRUTEModal({ activeReferral, onClose }) {
    const modalRef = useModalA11y(onClose);
    const { dischargePatient, dischargeEmergencyPatient, time, playerProfile: _playerProfile, busyAmbulanceIds } = useGame();
    const [step, setStep] = useState(1);
    const [referralResult, setReferralResult] = useState(null);

    // Step 1: SBAR State
    const [sbar, setSbar] = useState({
        situation: '',
        background: '',
        assessment: '',
        recommendation: ''
    });

    // Step 2: Hospital selection
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);

    // Step 3: Ambulance selection
    const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(AMBULANCES[0].id);

    if (!activeReferral) return null;

    const { patient, decisionData, isEmergency } = activeReferral;
    const hospital = HOSPITALS.find(h => h.id === selectedHospitalId);
    const ambulance = AMBULANCES.find(a => a.id === selectedAmbulanceId);

    const handleFinalize = () => {
        // === Validation Data ===
        const patientCategory = (patient.hidden?.category || patient.medicalData?.category || '').toLowerCase();
        const isCorrectSpecialty = hospital.specialties.some(s =>
            patientCategory.includes(s)
        ) || hospital.id === 'rsup_nasional'; // Class A is catch-all

        const isLowRes = hospital.bedCapacity.available === 0;

        // 1. Check for 144 FKTP Mandatory diseases (Non-Specialistic Referral)
        const diagnosisCodes = decisionData.diagnoses || [];
        const fktpMandatoryCases = diagnosisCodes.filter(code => isFKTPMandatory(code));
        const isFKTPCase = fktpMandatoryCases.length > 0;

        // 2. Check if patient actually NEEDS referral (via case data)
        //    Regular patients: hidden.requiredAction === 'refer' (from CaseLibrary referralRequired)
        //    Emergency patients: hidden.referralRequired === true
        const needsReferral = patient.hidden?.referralRequired === true
            || patient.hidden?.requiredAction === 'refer'
            || patient.hidden?.risk === 'emergency';
        // Check SKDI level — 4A cases MUST be handled at FKTP
        const skdiLevel = patient.hidden?.skdi || patient.medicalData?.skdi || '';
        const isSKDI4A = skdiLevel === '4A';

        // 3. Check for Stabilization (specifically for Emergency)
        let isUnstable = false;
        if (isEmergency) {
            const actions = decisionData.actionsPerformed || [];
            const hasBasicLifeSupport = actions.some(a =>
                ['o2', 'infus', 'stabilize', 'emergency_kit', 'pasang infus', 'pemberian o2'].includes(a.toLowerCase())
            );
            if (!hasBasicLifeSupport && patient.triage && patient.triage !== 'Green') {
                isUnstable = true;
            }
        }

        // === Calculate Result ===
        let repBonus = 5;
        let satisfaction = 85;
        let status = 'ACCEPTED';
        let feedback = 'Rujukan Anda telah diterima oleh sistem rumah sakit tujuan.';

        // Rejection Logic - Order of priority (most severe first)
        if (isFKTPCase && !isEmergency) {
            // REJECTION: Referring a disease that MUST be handled at FKTP
            status = 'REJECTED';
            repBonus = -10;
            satisfaction = 40;
            feedback = `Rujukan Ditolak (Audit BPJS): Kasus ${getFKTPDiseaseByCode(fktpMandatoryCases[0])?.name || 'Non-Spesialistik'} harus tuntas di FKTP sesuai regulasi 144 diagnosa. Reputasi menurun drastis!`;
        } else if (!isEmergency && !needsReferral && isSKDI4A) {
            // REJECTION: SKDI 4A case that doesn't require referral — unnecessary referral
            status = 'REJECTED';
            repBonus = -8;
            satisfaction = 45;
            feedback = 'Rujukan Ditolak (Audit BPJS): Penyakit ini termasuk kompetensi 4A (tuntas di FKTP). Merujuk kasus yang bisa ditangani sendiri menurunkan skor BPJS Anda!';
        } else if (!isEmergency && !needsReferral) {
            // REJECTION: Non-emergency case that doesn't require referral
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 50;
            feedback = 'Rujukan Ditolak: RS tujuan menilai kondisi pasien tidak memerlukan penanganan spesialistik. Tangani di FKTP atau rujuk hanya jika ada komplikasi.';
        } else if (isUnstable) {
            // REJECTION: Emergency patient not stabilized before referral
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 50;
            feedback = 'Rujukan Ditolak: RS tujuan mencatat pasien belum dilakukan tindakan stabilisasi dasar (O2/Infus). Stabilkan pasien sebelum merujuk!';
        } else if (isLowRes) {
            // REJECTION: Hospital at full capacity
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 15;
            feedback = 'Rumah sakit tujuan menolak karena kapasitas bed penuh. Pasien terpaksa mencari RS lain. Penalti reputasi!';
        } else if (!isCorrectSpecialty) {
            // WARNING: Accepted but with specialty mismatch
            repBonus = 2;
            satisfaction = 70;
            feedback = 'RS tujuan menerima rujukan namun mencatat ketidaksesuaian spesialisasi. Pasien mungkin akan dikonsultasikan ulang.';
        }

        if (ambulance.type === 'Advance' && status === 'ACCEPTED') {
            repBonus += 2;
        }

        setReferralResult({
            status,
            repBonus,
            satisfaction,
            feedback
        });

        setStep(4);
    };

    const handleComplete = () => {
        const finalizeData = {
            ...decisionData,
            action: 'refer',
            isSISRUTE: true,
            referralDetails: {
                sbar,
                hospitalId: selectedHospitalId,
                ambulanceId: selectedAmbulanceId,
                timeSent: time,
                result: referralResult
            },
            repBonus: referralResult.repBonus,
            satisfaction: referralResult.satisfaction
        };

        // Finalize discharge in context based on type
        if (isEmergency) {
            dischargeEmergencyPatient(patient, finalizeData);
        } else {
            dischargePatient(patient, finalizeData);
        }

        onClose();
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="sisrute-title" className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                {/* Header */}
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <Send size={24} />
                        </div>
                        <div>
                            <h2 id="sisrute-title" className="text-2xl font-bold tracking-tight">SISRUTE</h2>
                            <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest">Sistem Rujukan Terpadu Nasional</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Tutup SISRUTE">
                        <X size={24} />
                    </button>
                </div>

                {/* Stepper */}
                <div className="flex px-10 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
                    {[
                        { step: 1, label: 'SBAR Form', icon: ClipboardList },
                        { step: 2, label: 'Rumah Sakit', icon: Building2 },
                        { step: 3, label: 'Transportasi', icon: Truck },
                        { step: 4, label: 'Feedback', icon: CheckCircle }
                    ].map((item, idx) => (
                        <React.Fragment key={item.step}>
                            <div className={`flex items-center gap-3 transition-opacity ${step === item.step ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${step >= item.step ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                                    {step > item.step ? <CheckCircle size={16} /> : <item.icon size={16} />}
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap uppercase tracking-wider">{item.label}</span>
                            </div>
                            {idx < 3 && <div className={`flex-1 mx-2 h-0.5 mt-4 ${step > item.step ? 'bg-emerald-600' : 'bg-slate-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Upfront Warning: Patient doesn't need referral */}
                            {(() => {
                                const needsRef = patient.hidden?.referralRequired === true
                                    || patient.hidden?.requiredAction === 'refer'
                                    || patient.hidden?.risk === 'emergency';
                                const skdi = patient.hidden?.skdi || '';
                                if (!needsRef && !isEmergency) {
                                    return (
                                        <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-200 flex gap-3 text-rose-800">
                                            <AlertTriangle size={24} className="shrink-0 text-rose-500" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold">⚠️ Pasien Ini Kemungkinan Besar Akan DITOLAK</p>
                                                <p className="text-xs leading-relaxed">
                                                    {skdi === '4A'
                                                        ? `Kasus ini SKDI ${skdi} — wajib tuntas di FKTP sesuai KMK 1186/2022. RS tujuan akan menolak rujukan dan Anda akan menerima penalti audit BPJS.`
                                                        : 'Kondisi pasien tidak memerlukan penanganan spesialistik. RS tujuan kemungkinan besar akan menolak rujukan ini.'}
                                                </p>
                                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1">Rekomendasi: Rawat di FKTP / Pulangkan dengan edukasi</p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-blue-800">
                                <Info size={20} className="shrink-0" />
                                <div className="text-xs leading-relaxed italic">
                                    Lengkapi ringkasan kondisi klinis pasien untuk memudahkan tim Rumah Sakit melakukan skrining awal.
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <Activity size={12} /> Situation (Kondisi Saat Ini)
                                        </label>
                                        <textarea
                                            value={sbar.situation}
                                            onChange={(e) => setSbar({ ...sbar, situation: e.target.value })}
                                            placeholder="Gunakan ringkasan singkat (misal: Pasien sesak nafas berat, curiga pneumonia)"
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <ClipboardList size={12} /> Background (Riwayat Medis)
                                        </label>
                                        <textarea
                                            value={sbar.background}
                                            onChange={(e) => setSbar({ ...sbar, background: e.target.value })}
                                            placeholder="Riwayat penyakit terdahulu, alergi, atau obat rutin..."
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <CheckCircle size={12} /> Assessment (Analisis Dokter)
                                        </label>
                                        <textarea
                                            value={sbar.assessment}
                                            onChange={(e) => setSbar({ ...sbar, assessment: e.target.value })}
                                            placeholder="Hasil pemeriksaan fisik atau lab kunci yang mendukung rujukan..."
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <Activity size={12} /> Recommendation
                                        </label>
                                        <textarea
                                            value={sbar.recommendation}
                                            onChange={(e) => setSbar({ ...sbar, recommendation: e.target.value })}
                                            placeholder="APA yang diminta dari RS (misal: PICU, tindakan bedah segera)..."
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {HOSPITALS.map(h => (
                                    <button
                                        key={h.id}
                                        onClick={() => setSelectedHospitalId(h.id)}
                                        className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${selectedHospitalId === h.id ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider ${selectedHospitalId === h.id ? 'bg-emerald-600 text-white' : ''}`}>Kelas {h.class}</span>
                                                <h4 className="font-bold text-slate-800 mt-1">{h.name}</h4>
                                            </div>
                                            <Building2 className={`transition-colors ${selectedHospitalId === h.id ? 'text-emerald-600' : 'text-slate-300'}`} size={24} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-600">
                                            <div className="flex items-center gap-1"><MapPin size={12} /> {h.distance} KM</div>
                                            <div className="flex items-center gap-1"><Activity size={12} /> {h.type}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {h.specialties.map(s => (
                                                <span key={s} className="bg-slate-100 text-[10px] font-bold text-slate-500 px-1.5 py-0.5 rounded capitalize">{s.replace('_', ' ')}</span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest pt-3 border-t border-slate-100">
                                            <span className="text-slate-400">Kapasitas Bed:</span>
                                            <span className={h.bedCapacity.available === 0 ? 'text-rose-500' : 'text-emerald-600'}>
                                                {h.bedCapacity.available} / {h.bedCapacity.total} TERSEDIA
                                            </span>
                                        </div>
                                        {selectedHospitalId === h.id && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 rounded-bl-3xl flex items-center justify-center text-white"><CheckCircle size={16} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Pilih Moda Transportasi</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {AMBULANCES.map(a => {
                                        const isBusy = a.isAmbulance !== false && (busyAmbulanceIds || []).some(item => item.id === a.id);
                                        return (
                                            <button
                                                key={a.id}
                                                onClick={() => !isBusy && setSelectedAmbulanceId(a.id)}
                                                disabled={isBusy}
                                                className={`relative p-5 rounded-3xl border-2 text-left transition-all ${selectedAmbulanceId === a.id ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100' : isBusy ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                                            >
                                                {isBusy && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-[22px]">
                                                        <Truck size={24} className="text-slate-400 animate-pulse" />
                                                        <span className="text-[8px] font-black text-slate-500 uppercase mt-1">Merujuk...</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                                                        <Truck size={24} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{a.type}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-800 text-lg">{a.name}</h5>
                                                <div className="mt-3 space-y-2 text-xs text-slate-600">
                                                    <div className="flex justify-between">
                                                        <span>Kecepatan:</span>
                                                        <span className="font-bold">x{a.speedBoost}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Bonus Stabilisasi:</span>
                                                        <span className="font-bold text-emerald-600">+{a.stabilizationBonus}%</span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t font-bold text-slate-800">
                                                        <span>Biaya:</span>
                                                        <span>{a.cost === 0 ? 'GRATIS' : `Rp ${a.cost.toLocaleString('id-ID')}`}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex gap-4">
                                <div className="p-3 bg-amber-500 rounded-2xl text-white shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-amber-800">Pemberitahuan Sistem</h4>
                                    <p className="text-xs text-amber-700 leading-relaxed italic">
                                        "Setelah rujukan dikirim, kami akan memberikan feedback real-time dari Rumah Sakit tujuan. Pastikan kondisi pasien sudah distabilkan di pusat layanan kami sebelum dikirim."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-300 flex flex-col items-center py-10 text-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${referralResult.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-rose-100 text-rose-600 shadow-rose-100'}`}>
                                {referralResult.status === 'ACCEPTED' ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
                            </div>

                            <div className="space-y-2">
                                <h3 className={`text-3xl font-black tracking-tight ${referralResult.status === 'ACCEPTED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    RUJUKAN {referralResult.status === 'ACCEPTED' ? 'DITERIMA' : 'DITOLAK'}
                                </h3>
                                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                    {referralResult.feedback}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dampak Reputasi</p>
                                    <p className={`text-xl font-black ${referralResult.repBonus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {referralResult.repBonus >= 0 ? '+' : ''}{referralResult.repBonus} Poin
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kepuasan Pasien</p>
                                    <p className="text-xl font-black text-indigo-600">
                                        {referralResult.satisfaction}%
                                    </p>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 w-full max-w-md">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Building2 size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">RS Tujuan</p>
                                        <p className="text-sm font-bold text-slate-700">{hospital.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100 shrink-0">
                    <div>
                        {step > 1 && step < 4 ? (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Kembali
                            </button>
                        ) : (
                            <div className="text-xs text-slate-400 font-medium">
                                {step === 4 ? 'Proses SISRUTE selesai' : 'Mohon teliti dalam pengisian data'}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                disabled={step === 2 && !selectedHospitalId}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                            >
                                Lanjut <ArrowRight size={18} />
                            </button>
                        ) : step === 3 ? (
                            <button
                                onClick={handleFinalize}
                                className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                Kirim Rujukan Ke RS <Send size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="px-12 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                Selesai & Tutup <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
