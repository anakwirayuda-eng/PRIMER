/**
 * @reflection
 * [IDENTITY]: ProlanisConsultation
 * [PURPOSE]: Module: ProlanisConsultation
 * [STATE]: Experimental
 * [ANCHOR]: ProlanisConsultation
 * [DEPENDS_ON]: GameContext, ProlanisDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { PROLANIS_EVENTS, PROLANIS_EDUCATION, MEDICATION_ACTIONS, getParameterTrend, getParameterStatus } from '../data/ProlanisDB.js';
import { Play, TrendingUp, TrendingDown, Minus, AlertTriangle, Battery, User } from 'lucide-react';

const ProlanisConsultation = ({ patient, onClose, onComplete }) => {
    const { time: _time, energy } = useGame();
    const [activeTab, setActiveTab] = useState('parameters');

    // Consultation State
    const [decisions, setDecisions] = useState({
        medicationAction: null,
        education: [],
        notes: ''
    });

    // Random event happening?
    const [_event] = useState(() => {
        // Simple logic: 20% chance of random event appearing during consultation
        // NOTE: Real simulation happens in Engine, this is just for "flavor" text if we want pre-consult events
        return null;
    });

    const isDM = patient.medicalData.diagnosisCode === 'E11';
    const currentParams = patient.prolanisData?.parameters || {};
    const history = patient.prolanisData?.history || [];

    const handleComplete = () => {
        onComplete({
            patientId: patient.id,
            doctorDecisions: decisions
        });
    };

    const toggleEducation = (eduId) => {
        setDecisions(prev => {
            const exists = prev.education.includes(eduId);
            return {
                ...prev,
                education: exists
                    ? prev.education.filter(id => id !== eduId)
                    : [...prev.education, eduId]
            };
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-2 rounded-full">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{patient.name}</h2>
                            <p className="text-indigo-100 text-sm flex items-center gap-2">
                                <span className="bg-indigo-500/50 px-2 py-0.5 rounded text-xs">{patient.age} th</span>
                                <span>{patient.medicalData.diagnosisName}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-sm">
                            <Battery size={16} className={energy < 30 ? "text-red-300" : "text-emerald-300"} />
                            <span>Dokter Energy: {Math.round(energy)}%</span>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Patient Status & History */}
                    <div className="w-1/3 bg-slate-50 border-r p-4 overflow-y-auto">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <ActivityIcon /> Status Terkini
                        </h3>

                        {/* Parameter Cards */}
                        <div className="space-y-3 mb-6">
                            {isDM ? (
                                <>
                                    <ParamCard
                                        label="HbA1c"
                                        value={currentParams.hba1c}
                                        unit="%"
                                        status={getParameterStatus('dm_type2', 'hba1c', currentParams.hba1c)}
                                        trend={getParameterTrend(history, 'hba1c')}
                                    />
                                    <ParamCard
                                        label="Gula Darah Sewaktu"
                                        value={currentParams.gds}
                                        unit="mg/dL"
                                        status={getParameterStatus('dm_type2', 'gds', currentParams.gds)}
                                        trend={getParameterTrend(history, 'gds')}
                                    />
                                </>
                            ) : (
                                <>
                                    <ParamCard
                                        label="Tekanan Darah"
                                        value={`${Math.round(currentParams.systolic)}/${Math.round(currentParams.diastolic)}`}
                                        unit="mmHg"
                                        status={getParameterStatus('hypertension', 'systolic', currentParams.systolic)}
                                        trend={getParameterTrend(history, 'systolic')}
                                    />
                                </>
                            )}
                        </div>

                        {/* Risk Indicator */}
                        <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Risiko Komplikasi</span>
                                <span className="font-bold">{patient.complicationRisk || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${(patient.complicationRisk || 0) > 70 ? 'bg-red-500' :
                                        (patient.complicationRisk || 0) > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                                        }`}
                                    style={{ width: `${patient.complicationRisk || 0}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Risiko naik jika parameter tidak terkontrol atau pasien absen kontrol.
                            </p>
                        </div>
                    </div>

                    {/* Right: Intervention */}
                    <div className="w-2/3 flex flex-col">
                        {/* Tabs */}
                        <div className="flex border-b bg-white px-4 pt-4 gap-4">
                            <TabButton active={activeTab === 'parameters'} onClick={() => setActiveTab('parameters')}>
                                💊 Pengobatan
                            </TabButton>
                            <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')}>
                                🗣️ Edukasi & Lifestyle
                            </TabButton>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {activeTab === 'parameters' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-bold text-blue-800 mb-2">Rencana Terapi Bulan Ini</h4>
                                        <p className="text-sm text-blue-600 mb-4">
                                            Pilih penyesuaian dosis obat berdasarkan kondisi pasien saat ini.
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(MEDICATION_ACTIONS).map(([key, action]) => {
                                                if (action.isReferral) return null; // Skip referral here
                                                const selected = decisions.medicationAction === action;
                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => setDecisions({ ...decisions, medicationAction: action })}
                                                        className={`p-3 rounded-lg border-2 text-left transition-all ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-200'
                                                            }`}
                                                    >
                                                        <div className="font-bold text-sm">{action.label}</div>
                                                        <div className="text-xs opacity-70 mt-1">Efek: {action.effect.paramChange > 0 ? '+' : ''}{action.effect.paramChange}% Parameter</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Warnings if aggressive treatment */}
                                    {decisions.medicationAction?.riskIncrease > 0 && (
                                        <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded text-sm">
                                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                            <p>Tindakan ini meningkatkan risiko efek samping sebesar {decisions.medicationAction.riskIncrease}%.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'education' && (
                                <div>
                                    <h4 className="font-bold text-slate-700 mb-4">Materi Edukasi Tambahan</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {PROLANIS_EDUCATION
                                            .filter(e => e.disease === 'all' || e.disease === (isDM ? 'dm_type2' : 'hypertension'))
                                            .map(edu => (
                                                <button
                                                    key={edu.id}
                                                    onClick={() => toggleEducation(edu.id)}
                                                    className={`p-3 rounded-lg border flex items-center gap-3 text-left transition-all ${decisions.education.includes(edu.id)
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                                        : 'bg-white border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${decisions.education.includes(edu.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                                                        }`}>
                                                        {decisions.education.includes(edu.id) && "✓"}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{edu.label}</div>
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-4 text-center">
                                        Tips: Edukasi yang tepat memberikan bonus penurunan parameter jangka panjang.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t bg-slate-50 flex justify-between items-center shrink-0">
                            <div className="text-sm text-slate-500">
                                {decisions.medicationAction ? (
                                    <span>Tindakan: <span className="font-bold text-indigo-600">{decisions.medicationAction.label}</span></span>
                                ) : (
                                    <span className="text-red-500">⚠ Belum ada tindakan medis dipilih</span>
                                )}
                            </div>
                            <button
                                onClick={handleComplete}
                                disabled={!decisions.medicationAction}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Play size={18} fill="currentColor" /> Selesaikan Kontrol
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const TabButton = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
    >
        {children}
    </button>
);

const ParamCard = ({ label, value, unit, status, trend }) => {
    const statusColors = {
        controlled: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        critical: 'bg-red-100 text-red-800 border-red-200',
        unknown: 'bg-slate-100 text-slate-600 border-slate-200'
    };

    const StatusIcon = status === 'controlled' ? TrendingUp : AlertTriangle; // Just loose icons

    return (
        <div className={`p-3 rounded-lg border ${statusColors[status] || statusColors.unknown}`}>
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold uppercase opacity-70">{label}</span>
                {status !== 'unknown' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/50 rounded uppercase">
                        {status}
                    </span>
                )}
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-mono font-bold">{typeof value === 'number' ? value.toFixed(0) : value}</span>
                <span className="text-xs mb-1 opacity-80">{unit}</span>

                {trend === 'improving' && <TrendingDown size={14} className="text-emerald-600 mb-1.5" />}
                {trend === 'worsening' && <TrendingUp size={14} className="text-red-600 mb-1.5" />}
                {trend === 'stable' && <Minus size={14} className="text-slate-500 mb-1.5" />}
            </div>
        </div>
    );
};

// Placeholder icon
const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default ProlanisConsultation;
