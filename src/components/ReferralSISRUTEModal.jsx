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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import { HOSPITALS, AMBULANCES } from '../data/HospitalDB.js';
import { getEmergencyCasePresentation } from '../game/emergency/emergencyPresentation.js';
import {
    X, AlertTriangle, Send, Truck, Building2, ClipboardList,
    ArrowRight, ArrowLeft, CheckCircle, Info, Activity, MapPin
} from 'lucide-react';
import { isFKTPMandatory, getFKTPDiseaseByCode } from '../data/FKTP144Diseases.js';

export default function ReferralSISRUTEModal({ activeReferral, onClose }) {
    const { t, i18n } = useTranslation();
    const modalRef = useModalA11y(onClose);
    const {
        dischargePatient,
        dischargeEmergencyPatient,
        time,
        playerProfile: _playerProfile,
        busyAmbulanceIds,
        hospitalBedUsage
    } = useGame();
    const emergencyCaseView = activeReferral?.isEmergency
        ? getEmergencyCasePresentation(activeReferral.patient, t, i18n)
        : null;
    const emergencySisruteData = emergencyCaseView?.sisruteData || null;
    const [step, setStep] = useState(1);
    const [referralResult, setReferralResult] = useState(null);
    const [sbar, setSbar] = useState({
        situation: emergencySisruteData?.situation || '',
        background: emergencySisruteData?.background || '',
        assessment: emergencySisruteData?.assessment || '',
        recommendation: emergencySisruteData?.recommendation || ''
    });
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);
    const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(AMBULANCES[0].id);
    const currencyLocale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'id-ID';

    const { patient = null, decisionData = {}, isEmergency = false } = activeReferral || {};
    const hospital = HOSPITALS.find((entry) => entry.id === selectedHospitalId);
    const ambulance = AMBULANCES.find((entry) => entry.id === selectedAmbulanceId);
    const previewNeedsReferral = patient?.hidden?.referralRequired === true
        || patient?.hidden?.requiredAction === 'refer'
        || patient?.hidden?.risk === 'emergency';
    const previewSkdi = patient?.hidden?.skdi || '';
    const likelyRejectedWithoutReferral = !previewNeedsReferral && !isEmergency;
    const steps = [
        { step: 1, label: t('referral.steps.sbar'), icon: ClipboardList },
        { step: 2, label: t('referral.steps.hospital'), icon: Building2 },
        { step: 3, label: t('referral.steps.transport'), icon: Truck },
        { step: 4, label: t('referral.steps.feedback'), icon: CheckCircle }
    ];

    useEffect(() => {
        if (!isEmergency || !emergencySisruteData) return;
        const resetId = setTimeout(() => {
            setSbar({
                situation: emergencySisruteData.situation || '',
                background: emergencySisruteData.background || '',
                assessment: emergencySisruteData.assessment || '',
                recommendation: emergencySisruteData.recommendation || ''
            });
        }, 0);
        return () => clearTimeout(resetId);
    }, [emergencySisruteData, i18n.resolvedLanguage, isEmergency, patient?.id]);

    if (!activeReferral || !patient) return null;

    const handleFinalize = () => {
        const patientCategory = (patient.hidden?.category || patient.medicalData?.category || '').toLowerCase();
        const isCorrectSpecialty = hospital.specialties.some((specialty) =>
            patientCategory.includes(specialty)
        ) || hospital.id === 'rsup_nasional';

        const usedBeds = (hospitalBedUsage || {})[hospital.id] || 0;
        const effectiveAvailable = Math.max(0, hospital.bedCapacity.available - usedBeds);
        const isLowRes = effectiveAvailable === 0;

        const diagnosisCodes = decisionData.diagnoses || [];
        const fktpMandatoryCases = diagnosisCodes.filter((code) => isFKTPMandatory(code));
        const isFKTPCase = fktpMandatoryCases.length > 0;

        const needsReferral = patient.hidden?.referralRequired === true
            || patient.hidden?.requiredAction === 'refer'
            || patient.hidden?.risk === 'emergency';
        const skdiLevel = patient.hidden?.skdi || patient.medicalData?.skdi || '';
        const isSKDI4A = skdiLevel === '4A';

        let isUnstable = false;
        if (isEmergency) {
            const actions = decisionData.actionsPerformed || [];
            const hasBasicLifeSupport = actions.some((actionId) =>
                ['oxygen', 'iv_line', 'iv_fluid_rl', 'nacl_resus', 'rehydration_bolus', 'protect_airway', 'cpr', 'rescue_breathing'].includes(actionId)
            );
            if (!hasBasicLifeSupport && patient.triageLevel && patient.triageLevel <= 2) {
                isUnstable = true;
            }
        }

        let repBonus = 5;
        let satisfaction = 85;
        let status = 'ACCEPTED';
        let feedback = t('referral.feedback.accepted');

        if (isFKTPCase && !isEmergency) {
            status = 'REJECTED';
            repBonus = -10;
            satisfaction = 40;
            feedback = t('referral.feedback.rejected_fktp', {
                disease: getFKTPDiseaseByCode(fktpMandatoryCases[0])?.name || t('referral.feedback.non_specialistic')
            });
        } else if (!isEmergency && !needsReferral && isSKDI4A) {
            status = 'REJECTED';
            repBonus = -8;
            satisfaction = 45;
            feedback = t('referral.feedback.rejected_skdi4a');
        } else if (!isEmergency && !needsReferral) {
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 50;
            feedback = t('referral.feedback.rejected_unnecessary');
        } else if (isUnstable) {
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 50;
            feedback = t('referral.feedback.rejected_unstable');
        } else if (isLowRes) {
            status = 'REJECTED';
            repBonus = -5;
            satisfaction = 15;
            feedback = t('referral.feedback.rejected_capacity');
        } else if (!isCorrectSpecialty) {
            repBonus = 2;
            satisfaction = 70;
            feedback = t('referral.feedback.accepted_mismatch');
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
        if (referralResult.status !== 'ACCEPTED') {
            onClose();
            return;
        }

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

        if (isEmergency) {
            dischargeEmergencyPatient(patient, finalizeData);
        } else {
            dischargePatient(patient, finalizeData);
        }

        onClose();
    };

    const nextStep = () => setStep((currentStep) => currentStep + 1);
    const prevStep = () => setStep((currentStep) => currentStep - 1);

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sisrute-title"
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <Send size={24} />
                        </div>
                        <div>
                            <h2 id="sisrute-title" className="text-2xl font-bold tracking-tight">{t('referral.title')}</h2>
                            <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest">{t('referral.subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label={t('referral.close_aria')}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex px-10 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
                    {steps.map((item, idx) => (
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

                <div className="flex-1 overflow-y-auto p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {likelyRejectedWithoutReferral && (
                                <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-200 flex gap-3 text-rose-800">
                                    <AlertTriangle size={24} className="shrink-0 text-rose-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{t('referral.warning_title')}</p>
                                        <p className="text-xs leading-relaxed">
                                            {previewSkdi === '4A'
                                                ? t('referral.warning_skdi', { skdi: previewSkdi })
                                                : t('referral.warning_general')}
                                        </p>
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1">{t('referral.warning_recommendation')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-blue-800">
                                <Info size={20} className="shrink-0" />
                                <div className="text-xs leading-relaxed italic">
                                    {t('referral.intro')}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <Activity size={12} /> {t('referral.sbar.situation_label')}
                                        </label>
                                        <textarea
                                            value={sbar.situation}
                                            onChange={(event) => setSbar({ ...sbar, situation: event.target.value })}
                                            placeholder={t('referral.sbar.situation_placeholder')}
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <ClipboardList size={12} /> {t('referral.sbar.background_label')}
                                        </label>
                                        <textarea
                                            value={sbar.background}
                                            onChange={(event) => setSbar({ ...sbar, background: event.target.value })}
                                            placeholder={t('referral.sbar.background_placeholder')}
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <CheckCircle size={12} /> {t('referral.sbar.assessment_label')}
                                        </label>
                                        <textarea
                                            value={sbar.assessment}
                                            onChange={(event) => setSbar({ ...sbar, assessment: event.target.value })}
                                            placeholder={t('referral.sbar.assessment_placeholder')}
                                            className="w-full h-24 p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                                            <Activity size={12} /> {t('referral.sbar.recommendation_label')}
                                        </label>
                                        <textarea
                                            value={sbar.recommendation}
                                            onChange={(event) => setSbar({ ...sbar, recommendation: event.target.value })}
                                            placeholder={t('referral.sbar.recommendation_placeholder')}
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
                                {HOSPITALS.map((entry) => {
                                    const availableBeds = Math.max(0, entry.bedCapacity.available - ((hospitalBedUsage || {})[entry.id] || 0));

                                    return (
                                        <button
                                            key={entry.id}
                                            onClick={() => setSelectedHospitalId(entry.id)}
                                            className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${selectedHospitalId === entry.id ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider ${selectedHospitalId === entry.id ? 'bg-emerald-600 text-white' : ''}`}>
                                                        {t('referral.hospital.class', { value: entry.class })}
                                                    </span>
                                                    <h4 className="font-bold text-slate-800 mt-1">{entry.name}</h4>
                                                </div>
                                                <Building2 className={`transition-colors ${selectedHospitalId === entry.id ? 'text-emerald-600' : 'text-slate-300'}`} size={24} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {t('referral.hospital.distance', { value: entry.distance })}
                                                </div>
                                                <div className="flex items-center gap-1"><Activity size={12} /> {entry.type}</div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {entry.specialties.map((specialty) => (
                                                    <span key={specialty} className="bg-slate-100 text-[10px] font-bold text-slate-500 px-1.5 py-0.5 rounded capitalize">
                                                        {specialty.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest pt-3 border-t border-slate-100">
                                                <span className="text-slate-400">{t('referral.hospital.capacity')}</span>
                                                <span className={availableBeds === 0 ? 'text-rose-500' : 'text-emerald-600'}>
                                                    {t('referral.hospital.available', { available: availableBeds, total: entry.bedCapacity.total })}
                                                </span>
                                            </div>
                                            {selectedHospitalId === entry.id && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 rounded-bl-3xl flex items-center justify-center text-white">
                                                    <CheckCircle size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-700 border-b pb-2">{t('referral.transport.title')}</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {AMBULANCES.map((entry) => {
                                        const isBusy = entry.isAmbulance !== false && (busyAmbulanceIds || []).some((item) => item.id === entry.id);

                                        return (
                                            <button
                                                key={entry.id}
                                                onClick={() => !isBusy && setSelectedAmbulanceId(entry.id)}
                                                disabled={isBusy}
                                                className={`relative p-5 rounded-3xl border-2 text-left transition-all ${selectedAmbulanceId === entry.id ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100' : isBusy ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                                            >
                                                {isBusy && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-[22px]">
                                                        <Truck size={24} className="text-slate-400 animate-pulse" />
                                                        <span className="text-[8px] font-black text-slate-500 uppercase mt-1">{t('referral.transport.busy')}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                                                        <Truck size={24} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{entry.type}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-800 text-lg">{entry.name}</h5>
                                                <div className="mt-3 space-y-2 text-xs text-slate-600">
                                                    <div className="flex justify-between">
                                                        <span>{t('referral.transport.speed')}</span>
                                                        <span className="font-bold">x{entry.speedBoost}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>{t('referral.transport.stabilization_bonus')}</span>
                                                        <span className="font-bold text-emerald-600">+{entry.stabilizationBonus}%</span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t font-bold text-slate-800">
                                                        <span>{t('referral.transport.cost')}</span>
                                                        <span>{entry.cost === 0 ? t('referral.transport.free') : `Rp ${entry.cost.toLocaleString(currencyLocale)}`}</span>
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
                                    <h4 className="font-bold text-amber-800">{t('referral.transport.system_notice_title')}</h4>
                                    <p className="text-xs text-amber-700 leading-relaxed italic">
                                        "{t('referral.transport.system_notice_body')}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && referralResult && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-300 flex flex-col items-center py-10 text-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${referralResult.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-rose-100 text-rose-600 shadow-rose-100'}`}>
                                {referralResult.status === 'ACCEPTED' ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
                            </div>

                            <div className="space-y-2">
                                <h3 className={`text-3xl font-black tracking-tight ${referralResult.status === 'ACCEPTED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {referralResult.status === 'ACCEPTED'
                                        ? t('referral.result.accepted_title')
                                        : t('referral.result.rejected_title')}
                                </h3>
                                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                    {referralResult.feedback}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('referral.result.reputation')}</p>
                                    <p className={`text-xl font-black ${referralResult.repBonus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {referralResult.repBonus >= 0 ? '+' : ''}{referralResult.repBonus} {t('referral.result.points')}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('referral.result.satisfaction')}</p>
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
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{t('referral.result.destination')}</p>
                                        <p className="text-sm font-bold text-slate-700">{hospital?.name || t('referral.hud.hospital_fallback')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100 shrink-0">
                    <div>
                        {step > 1 && step < 4 ? (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> {t('referral.footer.back')}
                            </button>
                        ) : (
                            <div className="text-xs text-slate-400 font-medium">
                                {step === 4 ? t('referral.footer.done') : t('referral.footer.careful')}
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
                                {t('referral.footer.next')} <ArrowRight size={18} />
                            </button>
                        ) : step === 3 ? (
                            <button
                                onClick={handleFinalize}
                                className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                {t('referral.footer.send')} <Send size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="px-12 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                {t('referral.footer.finish')} <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
