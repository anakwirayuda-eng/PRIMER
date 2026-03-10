/**
 * @reflection
 * [IDENTITY]: CPPTCard
 * [PURPOSE]: CPPTCard.jsx Reusable component for rendering a CPPT (Catatan Perkembangan Pasien Terintegrasi) record. Used in both Pat
 * [STATE]: Experimental
 * [ANCHOR]: CPPTCard
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * CPPTCard.jsx
 * Reusable component for rendering a CPPT (Catatan Perkembangan Pasien Terintegrasi) record.
 * Used in both PatientEMR Riwayat tab and ArsipPage family folders.
 */
import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, FileText, Stethoscope, Brain, Pill,
    Scissors, BookOpen, Activity, Info, AlertCircle, CheckCircle,
    ArrowUpRight, Clock, User
} from 'lucide-react';
import { findWikiKey } from '../data/WikiData.js';

const EDUCATION_LABELS = {
    diet_nutrition: 'Diet & Nutrisi',
    medication_adherence: 'Kepatuhan Obat',
    wound_care: 'Perawatan Luka',
    hygiene: 'Kebersihan / PHBS',
    follow_up: 'Kontrol Ulang',
    lifestyle: 'Gaya Hidup Sehat',
    danger_signs: 'Tanda Bahaya',
    stop_smoking: 'Berhenti Merokok',
    breastfeeding: 'ASI Eksklusif',
    family_planning: 'KB / Keluarga Berencana',
    exercise: 'Aktivitas Fisik',
    ors_zinc: 'Oralit + Zinc',
    vaccination: 'Imunisasi',
    mental_health: 'Kesehatan Jiwa'
};

const ACTION_LABELS = {
    treat: { label: 'RAWAT JALAN', color: 'emerald' },
    refer: { label: 'DIRUJUK', color: 'rose' },
    stabilize: { label: 'STABILISASI', color: 'amber' }
};

export default function CPPTCard({ record, isDark, openWiki, defaultExpanded = false, showPatientName = false }) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    if (!record) return null;

    const { timestamp, subjective, objective, assessment, planning, outcome, isEmergency, handledBy } = record;
    const actionInfo = ACTION_LABELS[planning?.action] || ACTION_LABELS.treat;

    // Status color for left bar
    const statusColor = outcome?.status === 'pulih' || outcome?.status === 'Sembuh'
        ? 'bg-emerald-500'
        : outcome?.status === 'membaik' || outcome?.status === 'Membaik'
            ? 'bg-blue-500'
            : planning?.action === 'refer'
                ? 'bg-rose-500'
                : 'bg-amber-500';

    return (
        <div
            className={`rounded-xl border relative overflow-hidden transition-all duration-200 ${expanded ? 'ring-1' : 'hover:translate-x-0.5'} 
                ${isDark
                    ? `bg-slate-900/50 border-slate-800 ${expanded ? 'ring-emerald-500/30' : 'hover:border-emerald-500/30'}`
                    : `bg-white border-slate-100 shadow-sm ${expanded ? 'ring-emerald-300' : 'hover:shadow-md'}`
                }`}
        >
            {/* Color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor}`}></div>

            {/* Collapsed Header — always visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left p-3 pl-5 flex justify-between items-start gap-2"
            >
                <div className="flex-1 min-w-0">
                    {/* Top row: Day + Time + Emergency badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            Hari ke-{timestamp?.day}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                            {timestamp?.timeFormatted || '??:??'}
                        </span>
                        {isEmergency && (
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                IGD
                            </span>
                        )}
                        {handledBy === 'Dr. MAIA' && (
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                MAIA
                            </span>
                        )}
                    </div>

                    {/* Patient name (when shown in Arsip) */}
                    {showPatientName && record.patientName && (
                        <p className={`text-xs font-bold mb-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            <User size={10} className="inline mr-1 opacity-50" />{record.patientName}
                            {record.patientAge ? `, ${record.patientAge} th` : ''}
                        </p>
                    )}

                    {/* Chief complaint */}
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span className="font-bold text-emerald-500 mr-1">S:</span>
                        {subjective?.chiefComplaint || '-'}
                    </p>

                    {/* Primary diagnosis */}
                    {assessment?.diagnoses?.length > 0 && (
                        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="font-bold text-emerald-500 mr-1">A:</span>
                            <span className="font-mono font-bold text-emerald-500 mr-1">{assessment.diagnoses[0].code}</span>
                            {assessment.diagnoses[0].name}
                            {assessment.diagnoses.length > 1 && (
                                <span className="opacity-50 ml-1">(+{assessment.diagnoses.length - 1})</span>
                            )}
                        </p>
                    )}
                </div>

                {/* Right side: action pill + expand icon */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border
                        ${isDark
                            ? `bg-${actionInfo.color}-500/10 text-${actionInfo.color}-400 border-${actionInfo.color}-500/20`
                            : `bg-${actionInfo.color}-50 text-${actionInfo.color}-700 border-${actionInfo.color}-100`
                        }`}
                    >
                        {actionInfo.label}
                    </span>
                    {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
            </button>

            {/* Expanded SOAP Content */}
            {expanded && (
                <div className={`px-4 pb-4 pl-5 space-y-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} animate-fadeIn`}>

                    {/* S: Subjective */}
                    <div className="pt-3">
                        <h5 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span className="text-emerald-500">S</span>UBJECTIVE
                        </h5>
                        <div className={`p-2 rounded-lg border text-xs ${isDark ? 'bg-slate-950/30 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                            <p className="font-semibold mb-1">{subjective?.chiefComplaint || '-'}</p>
                            {/* Anamnesis checklist */}
                            {subjective?.anamnesisSynthesis?.categories && (
                                <div className="space-y-1.5 mt-2">
                                    {Object.entries(subjective.anamnesisSynthesis.categories).map(([catKey, catData]) => {
                                        const items = catData?.findings || (Array.isArray(catData) ? catData : []);
                                        if (!items || items.length === 0) return null;
                                        return (
                                            <div key={catKey}>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{catData?.label || catKey}</span>
                                                <div className="ml-1">
                                                    {items.map((f, i) => (
                                                        <div key={i} className="flex items-center gap-1 text-[10px]">
                                                            <span className="shrink-0">{f.status === 'confirmed' ? '✅' : f.status === 'denied' ? '❌' : '⚪'}</span>
                                                            <span className={f.status === 'denied' ? 'line-through opacity-50' : ''}>{f.keyword}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {!subjective?.anamnesisSynthesis?.categories && (
                                <p className="text-[10px] opacity-50 italic">Anamnesis tidak tersedia</p>
                            )}
                        </div>
                    </div>

                    {/* O: Objective */}
                    <div>
                        <h5 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span className="text-emerald-500">O</span>BJECTIVE
                        </h5>
                        <div className={`p-2 rounded-lg border text-xs space-y-1.5 ${isDark ? 'bg-slate-950/30 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                            {/* Physical exam */}
                            {Object.keys(objective?.physicalFindings || {}).length > 0 ? (
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Pemeriksaan Fisik</span>
                                    {Object.entries(objective.physicalFindings).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-[10px] ml-1">
                                            <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] opacity-50 italic">
                                    <Stethoscope size={10} className="inline mr-1" />Pemeriksaan fisik tidak dicatat
                                </p>
                            )}

                            {/* Lab results */}
                            {Object.keys(objective?.labResults || {}).length > 0 && (
                                <div className="pt-1 border-t border-dashed border-slate-700/30">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Laboratorium</span>
                                    {Object.entries(objective.labResults).map(([key, lab]) => (
                                        <div key={key} className="flex justify-between text-[10px] ml-1">
                                            <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className={`font-mono ${lab.flag === 'abnormal' ? 'text-amber-400 font-bold' : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>
                                                {lab.result}{lab.unit ? ` ${lab.unit}` : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* A: Assessment */}
                    <div>
                        <h5 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span className="text-emerald-500">A</span>SSESSMENT
                        </h5>
                        <div className={`p-2 rounded-lg border text-xs space-y-1 ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                            {assessment?.diagnoses?.length > 0 ? (
                                assessment.diagnoses.map((d, i) => (
                                    <div key={i} className="flex items-center gap-1.5 group">
                                        <span className="font-mono font-black text-emerald-500">{d.code}</span>
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{d.name}</span>
                                        {openWiki && findWikiKey('prob', d.code) && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openWiki(findWikiKey('prob', d.code)); }}
                                                className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity"
                                            >
                                                <Info size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="opacity-50 italic">Belum ada diagnosis</p>
                            )}
                        </div>
                    </div>

                    {/* P: Planning */}
                    <div>
                        <h5 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span className="text-emerald-500">P</span>LANNING
                        </h5>
                        <div className={`space-y-1.5`}>
                            {/* Medications */}
                            {planning?.medications?.length > 0 && (
                                <div className={`p-2 rounded-lg border flex items-start gap-2 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-white'}`}>
                                    <Pill size={11} className="mt-0.5 opacity-50 shrink-0" />
                                    <div className="flex-1 text-[10px] space-y-0.5">
                                        {planning.medications.map((m, i) => {
                                            const medName = typeof m === 'string' ? m : m.name;
                                            return (
                                                <div key={i} className={`flex justify-between group ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                                                    <span className="capitalize">{medName.replace(/_/g, ' ')}</span>
                                                    {openWiki && findWikiKey('med', medName) && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openWiki(findWikiKey('med', medName)); }}
                                                            className="opacity-0 group-hover:opacity-100 text-emerald-500"
                                                        ><Info size={9} /></button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Procedures */}
                            {planning?.procedures?.length > 0 && (
                                <div className={`p-2 rounded-lg border flex items-start gap-2 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-white'}`}>
                                    <Scissors size={11} className="mt-0.5 opacity-50 shrink-0" />
                                    <div className="flex-1 text-[10px] space-y-0.5">
                                        {planning.procedures.map((p, i) => (
                                            <div key={i} className={isDark ? 'text-slate-400' : 'text-slate-700'}>{p}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {planning?.education?.length > 0 && (
                                <div className={`p-2 rounded-lg border flex items-start gap-2 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-white'}`}>
                                    <BookOpen size={11} className="mt-0.5 opacity-50 shrink-0" />
                                    <div className="flex-1 flex flex-wrap gap-1">
                                        {planning.education.map((e, i) => (
                                            <span key={i} className={`px-1.5 py-0.5 rounded text-[9px] ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                                {EDUCATION_LABELS[e] || e}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Referral target */}
                            {planning?.action === 'refer' && (
                                <div className={`p-2 rounded-lg border flex items-center gap-2 ${isDark ? 'border-rose-500/20 bg-rose-500/5 text-rose-300' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
                                    <ArrowUpRight size={11} className="shrink-0" />
                                    <span className="text-[10px] font-bold">Rujuk ke: {planning.referralTarget || 'RS Rujukan'}</span>
                                </div>
                            )}

                            {/* No treatment */}
                            {(!planning?.medications?.length && !planning?.procedures?.length && !planning?.education?.length && planning?.action !== 'refer') && (
                                <p className={`text-[10px] opacity-50 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tidak ada terapi dicatat</p>
                            )}
                        </div>
                    </div>

                    {/* Outcome footer */}
                    <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Outcome:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize
                                ${outcome?.status === 'pulih' || outcome?.status === 'Sembuh'
                                    ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                                    : outcome?.status === 'membaik' || outcome?.status === 'Membaik'
                                        ? (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700')
                                        : (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700')
                                }`}>
                                {outcome?.status || 'N/A'}
                            </span>
                        </div>
                        {handledBy && (
                            <span className={`text-[9px] italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                oleh: {handledBy}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
