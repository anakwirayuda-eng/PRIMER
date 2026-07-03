/**
 * EndOfDayModal - Reflective debrief after daily operations.
 */
import React, { useState } from 'react';
import { Moon, Users, TrendingUp, Star, AlertTriangle, BookOpen, MessageSquare, ArrowRight, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import useModalA11y from '../hooks/useModalA11y.js';
import StatCard from './shared/StatCard';
import ExpandableCard from './shared/ExpandableCard';
import GuidelineBadge from './shared/GuidelineBadge';

export default function EndOfDayModal({ debriefData, onComplete, onDismiss }) {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const modalRef = useModalA11y(onDismiss);
    const [reflectionText, setReflectionText] = useState('');
    const [showReflection, setShowReflection] = useState(false);

    if (!debriefData) return null;

    const {
        day,
        summary,
        criticalCases = [],
        reflectionPrompts = [],
        consequencePreview = [],
        grade = { grade: 'B', label: 'Baik', stars: 3 },
        xpEarned,
        reflectionXpBonus
    } = debriefData;

    const handleComplete = () => {
        onComplete?.({
            reflectionText: reflectionText.trim() || null,
            xpBonus: reflectionText.trim().length > 10 ? reflectionXpBonus : 0,
        });
    };

    const translateGradeLabel = (gradeData) => (
        t(`endOfDay.grades.${gradeData.grade}`, { defaultValue: gradeData.label })
    );

    const localizePatientName = (name) => {
        if (!name || name === 'Pasien' || name === 'Pasien Follow-up') {
            return t('endOfDay.patientFallback');
        }
        return name;
    };

    const translateReflectionPrompt = (prompt) => {
        if (!prompt?.type) return prompt?.text || '';
        return t(`endOfDay.reflectionPrompts.${prompt.type}`, {
            patientName: localizePatientName(prompt.patientName),
            condition: prompt.condition,
            defaultValue: prompt.text || ''
        });
    };

    const translateKeyLearning = (caseData) => {
        if (!caseData?.keyLearningKey) return caseData?.keyLearning || '';
        return t(caseData.keyLearningKey, {
            ...(caseData.keyLearningParams || {}),
            defaultValue: caseData.keyLearning || ''
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="debrief-title"
                className={`w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'
                    }`}
            >
                <div className="bg-gradient-to-r from-slate-600 to-indigo-800 text-white p-5 relative overflow-hidden">
                    <div className="absolute top-2 right-8 w-1 h-1 bg-white/60 rounded-full" />
                    <div className="absolute top-5 right-16 w-1.5 h-1.5 bg-white/40 rounded-full" />
                    <div className="absolute top-3 right-24 w-1 h-1 bg-white/50 rounded-full" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                                <Moon size={24} />
                            </div>
                            <div>
                                <h2 id="debrief-title" className="text-lg font-black tracking-tight">
                                    {t('endOfDay.title', { day })}
                                </h2>
                                <p className="text-xs text-white/60 font-medium">
                                    {translateGradeLabel(grade)}
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black">{grade.grade}</div>
                            <div className="flex gap-0.5 justify-center mt-0.5">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        key={i}
                                        size={10}
                                        className={i < grade.stars ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                    <div className="grid grid-cols-4 gap-2">
                        <StatCard
                            icon={<Users size={16} />}
                            value={summary.patientsServed}
                            label={t('endOfDay.stats.served')}
                            colorClass="bg-blue-50 text-blue-600"
                        />
                        <StatCard
                            icon={<TrendingUp size={16} />}
                            value={summary.avgDiagnosisScore}
                            label={t('endOfDay.stats.accuracy')}
                            colorClass="bg-emerald-50 text-emerald-600"
                            suffix="%"
                        />
                        <StatCard
                            icon={<Star size={16} />}
                            value={summary.reputation}
                            label={t('endOfDay.stats.reputation')}
                            colorClass={`${summary.reputationDelta >= 0 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}
                        />
                        <StatCard
                            icon={<Wallet size={16} />}
                            value={Math.round(summary.todayRevenue / 1000)}
                            label={t('endOfDay.stats.netService')}
                            colorClass="bg-purple-50 text-purple-600"
                            suffix={t('endOfDay.currencyThousandSuffix')}
                        />
                    </div>

                    {(summary.correctDiagnoses > 0 || summary.incorrectDiagnoses > 0) && (
                        <div className="flex gap-3">
                            <DiagnosisPill
                                count={summary.correctDiagnoses}
                                label={t('endOfDay.diagnosis.correct')}
                                isDark={isDark}
                                isGood
                            />
                            <DiagnosisPill
                                count={summary.incorrectDiagnoses}
                                label={t('endOfDay.diagnosis.inaccurate')}
                                isDark={isDark}
                            />
                            {summary.referralsMade > 0 && (
                                <DiagnosisPill
                                    count={summary.referralsMade}
                                    label={t('endOfDay.diagnosis.referral')}
                                    isDark={isDark}
                                    isNeutral
                                />
                            )}
                        </div>
                    )}

                    {criticalCases.length > 0 && (
                        <div className="space-y-2">
                            <SectionLabel isDark={isDark}>{t('endOfDay.sections.criticalCases')}</SectionLabel>
                            {criticalCases.map((c, i) => (
                                <ExpandableCard
                                    key={i}
                                    title={`${localizePatientName(c.patientName)}, ${t('endOfDay.ageShort', { age: c.age })}`}
                                    subtitle={c.wasCorrect
                                        ? t('endOfDay.critical.correct', { diagnosis: c.diagnosis })
                                        : t('endOfDay.critical.expected', { diagnosis: c.correctDiagnosis })
                                    }
                                    icon={c.wasCorrect ? 'OK' : '!'}
                                    badge={c.wasCorrect
                                        ? { text: `${c.diagnosisScore}%`, color: 'bg-emerald-100 text-emerald-700' }
                                        : { text: `${c.diagnosisScore}%`, color: 'bg-red-100 text-red-700' }
                                    }
                                >
                                    <div className="space-y-2 text-xs">
                                        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                                            {translateKeyLearning(c)}
                                        </p>
                                        {c.guidelineRef && (
                                            <div className="flex items-start gap-1">
                                                <GuidelineBadge
                                                    source={c.guidelineRef.source || 'permenkes'}
                                                    text={c.guidelineRef.text}
                                                    reference={c.guidelineRef.reference}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </ExpandableCard>
                            ))}
                        </div>
                    )}

                    {consequencePreview.length > 0 && (
                        <div className="space-y-2">
                            <SectionLabel isDark={isDark}>{t('endOfDay.sections.upcoming')}</SectionLabel>
                            {consequencePreview.map((c, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-xl text-xs flex items-start gap-2 ${c.severity === 'critical'
                                            ? isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'
                                            : c.severity === 'positive'
                                                ? isDark ? 'bg-emerald-900/20 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                                                : isDark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-800'
                                        }`}
                                >
                                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold">{localizePatientName(c.patientName)}</span>
                                        {' '}{c.narrative}
                                        <span className="ml-1 opacity-60">{t('endOfDay.returnDay', { day: c.returnDay })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <SectionLabel isDark={isDark}>{t('endOfDay.sections.reflection')}</SectionLabel>

                        {reflectionPrompts.map((prompt, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-xl text-xs leading-relaxed italic ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <BookOpen size={12} className="inline mr-1 opacity-50" />
                                {translateReflectionPrompt(prompt)}
                            </div>
                        ))}

                        {!showReflection ? (
                            <button
                                onClick={() => setShowReflection(true)}
                                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${isDark
                                        ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                    }`}
                            >
                                <MessageSquare size={14} />
                                {t('endOfDay.writeReflection', { xp: reflectionXpBonus })}
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    placeholder={t('endOfDay.reflectionPlaceholder')}
                                    rows={3}
                                    className={`w-full p-3 rounded-xl text-xs resize-none border transition-all focus:ring-2 focus:ring-indigo-500/30 ${isDark
                                            ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
                                            : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                                        }`}
                                    autoFocus
                                />
                                {reflectionText.trim().length > 10 && (
                                    <div className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        {t('endOfDay.reflectionBonus', { xp: reflectionXpBonus })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40' : 'bg-gradient-to-r from-indigo-50 to-purple-50'
                        }`}>
                        <div className={`text-2xl font-black ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                            +{xpEarned + (reflectionText.trim().length > 10 ? reflectionXpBonus : 0)} XP
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-indigo-400/60' : 'text-indigo-400'}`}>
                            {t('endOfDay.earnedToday')}
                        </div>
                    </div>
                </div>

                <div className={`border-t p-4 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                    <button
                        onClick={handleComplete}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-slate-600 to-indigo-700 hover:from-slate-700 hover:to-indigo-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Moon size={16} /> {t('endOfDay.rest', { day: day + 1 })}
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionLabel({ children, isDark }) {
    return (
        <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
            {children}
        </h3>
    );
}

function DiagnosisPill({ count, label, isDark, isGood = false, isNeutral = false }) {
    let colorClass;
    if (isGood) {
        colorClass = isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
    } else if (isNeutral) {
        colorClass = isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700';
    } else {
        colorClass = isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700';
    }

    return (
        <div className={`flex-1 text-center p-2 rounded-lg ${colorClass}`}>
            <div className="text-lg font-black">{count}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider">{label}</div>
        </div>
    );
}
