/**
 * @reflection
 * [IDENTITY]: BodyMapWidget (v14 — 3D Rendered Edition)
 * [PURPOSE]: Gender/age-specific 3D rendered body images with precise node mapping.
 *            Clean circle nodes, hover tooltips. No SVG mismatch.
 * [STATE]: Production — Stable
 * [ANCHOR]: BodyMapWidget
 * [DEPENDS_ON]: body-{male,female,child,infant}-{front,back}.png, Web Audio API
 * [LAST_UPDATE]: 2026-03-15
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
    Activity, Zap, Info, ShieldAlert, Crosshair, Fingerprint,
    BrainCircuit, HeartPulse, ScanEye, Stethoscope, AlertTriangle,
    CheckCircle2, RotateCcw, Volume2, VolumeX
} from 'lucide-react';
import {
    getCanonicalPhysicalExamKeys,
    normalizePhysicalExamFindings,
} from '../utils/physicalExam.js';

// ==========================================
// 🧠 MODULE CONSTANTS
// ==========================================
const ABNORMAL_WORDS = [
    'nyeri', 'bengkak', 'abnormal', 'lesi', 'massa', 'krepitasi',
    'ronkhi', 'wheezing', 'pucat', 'kemerahan', 'luka', 'fraktur',
    'takikardi', 'deformitas', 'kaku', 'sesak', 'sianosis', 'menurun',
    'murmur', 'gallop', 'edema', 'retraksi', 'defans', 'rigiditas',
    'darah', 'jejas', 'perdarahan', 'henti', 'koma', 'apnea'
];
const analyzeSeverity = (text) => {
    if (!text) return 'unexamined';
    const t = (typeof text === 'string' ? text : String(text)).toLowerCase();
    return ABNORMAL_WORDS.some(w => t.includes(w)) ? 'abnormal' : 'normal';
};

const BODY_IMAGES = {
    MALE:   { front: '/body-male-front.png',   back: '/body-male-back.png' },
    FEMALE: { front: '/body-female-front.png', back: '/body-female-back.png' },
    CHILD:  { front: '/body-child-front.png',  back: '/body-child-back.png' },
    INFANT: { front: '/body-infant-front.png', back: '/body-infant-back.png' },
};

// Body zone: the region within the PNG where the body sits
const BODY_ZONE = { top: '6%', left: '20%', width: '60%', height: '88%' };

// 12 exam nodes — coordinates are % within BODY_ZONE
const EXAM_NODES = [
    { id: 'general',     label: 'Keadaan Umum',icon: ScanEye,     x: '50%', y: '3%',  side: 'front', tel: 'SYS' },
    { id: 'heent',       label: 'Kepala/THT',  icon: BrainCircuit,x: '50%', y: '10%', side: 'front', tel: 'CRN' },
    { id: 'neck',        label: 'Leher',       icon: Crosshair,   x: '50%', y: '17%', side: 'front', tel: 'THY' },
    { id: 'vitals',      label: 'Tanda Vital', icon: Activity,    x: '18%', y: '28%', side: 'front', tel: 'BIO' },
    { id: 'thorax',      label: 'Thorax',      icon: Stethoscope, x: '50%', y: '30%', side: 'front', tel: 'PUL' },
    { id: 'breast',      label: 'Mammae',      icon: HeartPulse,  x: '82%', y: '28%', side: 'front', tel: 'MAM' },
    { id: 'abdomen',     label: 'Abdomen',     icon: ShieldAlert, x: '50%', y: '48%', side: 'front', tel: 'GST' },
    { id: 'genitalia',   label: 'Genitalia',   icon: Fingerprint, x: '50%', y: '60%', side: 'front', tel: 'REP' },
    { id: 'extremities', label: 'Ekstremitas', icon: Crosshair,   x: '35%', y: '85%', side: 'front', tel: 'EXT' },
    { id: 'neuro',  label: 'Spinal',     icon: Zap,  x: '50%', y: '30%', side: 'back', tel: 'SPN' },
    { id: 'skin',   label: 'Kulit/Lesi', icon: Info, x: '30%', y: '48%', side: 'back', tel: 'DER' },
    { id: 'rectal', label: 'Rectal',     icon: Info, x: '50%', y: '62%', side: 'back', tel: 'RCT' },
];

// Terminal decrypt
function TerminalText({ text }) {
    const [displayed, setDisplayed] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    useEffect(() => {
        if (!text) { setDisplayed(''); return; }
        let i = 0;
        const id = setInterval(() => {
            setDisplayed(text.split('').map((c, j) => j < i ? text[j] : chars[Math.floor(Math.random() * chars.length)]).join(''));
            if (i >= text.length) clearInterval(id);
            i++;
        }, 25);
        return () => clearInterval(id);
    }, [text]);
    return <>{displayed}</>;
}

// ==========================================
// 🚀 THE WIDGET
// ==========================================
export default function BodyMapWidget({ patient, examsPerformed = {}, onExam, isDark }) {
    const [isPosterior, setIsPosterior] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);
    const [sonarPulse, setSonarPulse] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [backLoaded, setBackLoaded] = useState(false);
    const stageRef = useRef(null);
    const audioCtxRef = useRef(null);

    const normalizedExams = useMemo(() => normalizePhysicalExamFindings(examsPerformed), [examsPerformed]);

    const { hr, rr, isCritical } = useMemo(() => {
        let hrVal = 75, rrVal = 16, crit = false;
        const v = normalizedExams.vitals || '';
        const hm = v.match(/(?:HR|Nadi|Pulse)\s*[:=]?\s*(\d+)/i);
        const rm = v.match(/(?:RR|Napas|Resp)\s*[:=]?\s*(\d+)/i);
        if (hm) hrVal = Math.min(Math.max(+hm[1], 30), 220);
        if (rm) rrVal = Math.min(Math.max(+rm[1], 8), 60);
        crit = Object.values(normalizedExams).some(val => {
            const t = String(val).toLowerCase();
            return t.includes('henti jantung') || t.includes('koma') || t.includes('apnea');
        });
        if (hrVal > 120 || hrVal < 50 || rrVal > 26 || rrVal < 10) crit = true;
        return { hr: hrVal, rr: rrVal, isCritical: crit };
    }, [normalizedExams]);

    const { archName, images, invScale } = useMemo(() => {
        const age = patient?.age || 25;
        const g = (patient?.gender || 'male').toLowerCase().trim();
        const isFemale = g === 'p' || g === 'f' || g.includes('female') || g.includes('perempuan') || g.includes('wanita');
        if (age <= 3) return { archName: 'INFANT', images: BODY_IMAGES.INFANT, invScale: 1.4 };
        if (age <= 12) return { archName: 'CHILD', images: BODY_IMAGES.CHILD, invScale: 1.2 };
        if (isFemale) return { archName: 'FEMALE', images: BODY_IMAGES.FEMALE, invScale: 1 };
        return { archName: 'MALE', images: BODY_IMAGES.MALE, invScale: 1 };
    }, [patient]);

    const examNodeIds = useMemo(() => new Set(EXAM_NODES.map(n => n.id)), []);
    const progressCount = getCanonicalPhysicalExamKeys(Object.keys(normalizedExams)).filter(k => examNodeIds.has(k)).length;
    const progressPct = Math.round((progressCount / examNodeIds.size) * 100);

    const handlePointerMove = useCallback((e) => {
        if (!stageRef.current || isFlipping) return;
        const r = stageRef.current.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        const x = ((cx - r.left) / r.width) * 2 - 1;
        const y = ((cy - r.top) / r.height) * 2 - 1;
        setTilt({ x: isPosterior ? x * -10 : x * 10, y: y * -8 });
    }, [isPosterior, isFlipping]);

    const handleFlip = useCallback((e) => {
        e.stopPropagation();
        if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
        if (!backLoaded) setBackLoaded(true);
        setIsFlipping(true);
        setIsPosterior(p => !p);
        setTimeout(() => setIsFlipping(false), 800);
    }, [backLoaded]);

    const handleExamClick = useCallback((id, e) => {
        e.stopPropagation();
        if (navigator.vibrate) navigator.vibrate(25);
        if (!normalizedExams[id]) { setSonarPulse(id); setTimeout(() => setSonarPulse(null), 800); }
        onExam(id);
    }, [normalizedExams, onExam]);

    // Sub-Bass Auscultation
    const toggleAudio = useCallback((e) => {
        e.stopPropagation();
        if (!audioEnabled) {
            if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            audioCtxRef.current.resume(); setAudioEnabled(true);
        } else {
            if (audioCtxRef.current) audioCtxRef.current.suspend(); setAudioEnabled(false);
        }
    }, [audioEnabled]);

    useEffect(() => {
        if (!audioEnabled || !audioCtxRef.current) return;
        const ms = (60 / hr) * 1000;
        const beat = () => {
            const ctx = audioCtxRef.current;
            if (!ctx || ctx.state !== 'running') return;
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(65, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(isCritical ? 0.35 : 0.15, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.2);
            if (navigator.vibrate) navigator.vibrate(isCritical ? [40, 50, 40] : 25);
        };
        const t = setInterval(beat, ms);
        return () => clearInterval(t);
    }, [hr, audioEnabled, isCritical]);

    const tipAlign = (x) => {
        const n = parseFloat(x);
        return n <= 30 ? 'left-0' : n >= 70 ? 'right-0' : 'left-1/2 -translate-x-1/2';
    };

    function renderNode(node, isBack) {
        const finding = normalizedExams[node.id];
        const sev = analyzeSeverity(finding);
        const done = !!finding;

        const colors = done
            ? sev === 'abnormal'
                ? 'border-rose-500 text-rose-400 bg-rose-950/90 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : isDark ? 'border-emerald-500/60 text-emerald-400 bg-emerald-950/90' : 'border-emerald-500 text-emerald-600 bg-emerald-50/90'
            : isBack
                ? isDark ? 'border-cyan-500/40 text-cyan-400 bg-[#0d1117]/90' : 'border-blue-400 text-blue-500 bg-white/90'
                : isDark ? 'border-slate-600/60 text-slate-400 bg-[#0d1117]/90' : 'border-slate-300 text-slate-500 bg-white/90';

        return (
            <div key={node.id}
                className="absolute group pointer-events-auto cursor-pointer z-20"
                style={{
                    left: node.x, top: node.y,
                    padding: '10px', margin: '-10px',
                    transform: `translate(-50%, -50%) scale(${invScale})`,
                }}
                onPointerEnter={() => setHoveredNode(node.id)}
                onPointerLeave={() => setHoveredNode(null)}
                onClick={(e) => handleExamClick(node.id, e)}
            >
                <button className={`flex items-center justify-center w-6 h-6 rounded-full border backdrop-blur-md transition-all duration-300 outline-none group-hover:scale-[1.35] group-hover:shadow-[0_0_16px_currentColor] ${colors}`}>
                    {!done ? <node.icon size={10} strokeWidth={2.5} className={isCritical ? 'animate-pulse' : ''} />
                        : sev === 'abnormal' ? <AlertTriangle size={10} strokeWidth={2.5} className="animate-pulse" />
                        : <CheckCircle2 size={10} strokeWidth={2.5} />}
                </button>

                <div className={`absolute top-full mt-2 ${tipAlign(node.x)} pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 w-max px-2.5 py-1.5 rounded-lg border backdrop-blur-xl z-[60] ${isDark ? 'bg-[#0d1117]/95 border-slate-700 text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]' : 'bg-white/95 border-slate-300 text-slate-800 shadow-lg'}`}>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[6px] font-mono px-1 rounded border ${sev === 'abnormal' ? 'text-rose-400 border-rose-500/30' : 'text-blue-400 border-blue-500/30'}`}>{node.tel}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${sev === 'abnormal' ? 'text-rose-400' : ''}`}>{node.label}</span>
                    </div>
                    {done && (
                        <div className={`text-[8px] font-mono mt-1 max-w-[140px] whitespace-normal leading-relaxed border-t pt-1 ${sev === 'abnormal' ? 'text-rose-300 border-rose-500/20' : 'text-emerald-300 border-emerald-500/20'}`}>
                            <TerminalText text={finding} />
                        </div>
                    )}
                </div>

                {sonarPulse === node.id && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 rounded-full pointer-events-none ${isDark ? 'border-emerald-400' : 'border-blue-400'}`}
                        style={{ animation: 'bodymap-sonar-ripple 0.8s cubic-bezier(0.16,1,0.3,1) forwards' }} />
                )}
            </div>
        );
    }

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <div className={`relative w-full h-full min-h-[480px] rounded-2xl flex flex-col overflow-hidden select-none ${
            isDark ? 'bg-gradient-to-b from-[#030810] to-[#0a1020]' : 'bg-slate-50 border border-slate-200'
        }`} style={{ '--beat-dur': `${60 / hr}s`, '--breathe-dur': `${60 / rr}s` }}>

            {/* TOP BAR */}
            <div className="flex justify-between items-center px-4 pt-3 pb-1 z-30 pointer-events-none shrink-0">
                <div>
                    <div className={`text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-1.5 ${isCritical ? 'text-rose-500' : (isDark ? 'text-emerald-400/80' : 'text-blue-600')}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isCritical ? 'bg-rose-500' : (isPosterior ? 'bg-cyan-400' : 'bg-emerald-400')}`} />
                        {isPosterior ? 'Posterior' : 'Anterior'}
                    </div>
                    <div className={`text-[7px] font-mono mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <HeartPulse size={7} className={isCritical ? 'text-rose-500' : 'text-rose-400'} /> {hr}
                        <span className="opacity-30">·</span>
                        <Activity size={7} className={isCritical ? 'text-rose-500' : 'text-cyan-400'} /> {rr}
                        <span className="opacity-30">·</span>
                        <span className="opacity-60">{archName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={toggleAudio}
                        className={`pointer-events-auto w-6 h-6 flex items-center justify-center rounded-md border transition-all active:scale-90 ${audioEnabled ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : (isDark ? 'border-slate-700 text-slate-600 bg-slate-900/50' : 'border-slate-300 text-slate-400 bg-white')}`}>
                        {audioEnabled ? <Volume2 size={10} className="animate-pulse" /> : <VolumeX size={10} />}
                    </button>
                    <button onClick={handleFlip}
                        className={`pointer-events-auto flex items-center gap-1 px-2 py-1 rounded-md border transition-all active:scale-90 text-[7px] font-bold uppercase tracking-widest ${
                            isPosterior
                                ? (isDark ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' : 'border-blue-400 text-blue-600 bg-blue-50')
                                : (isDark ? 'border-slate-700 text-slate-500 bg-slate-900/50 hover:text-white' : 'border-slate-300 text-slate-500 bg-white')
                        }`}>
                        <RotateCcw size={9} className={`transition-transform duration-700 ${isPosterior ? 'rotate-[-180deg]' : ''}`} />
                        {isPosterior ? 'Depan' : 'Punggung'}
                    </button>
                </div>
            </div>

            {/* BODY STAGE */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center" style={{ perspective: '1000px' }}>
                <div
                    ref={stageRef}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => setTilt({ x: 0, y: 0 })}
                    className={`relative h-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isFlipping ? 'scale-[0.93]' : ''}`}
                    style={{
                        maxWidth: '100%',
                        aspectRatio: '1 / 1',
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${(isPosterior ? 180 : 0) + tilt.x}deg) rotateX(${tilt.y}deg)`,
                    }}
                >
                    {/* FRONT FACE */}
                    <div className={`absolute inset-0 rounded-xl ${isDark ? 'bg-[#030810]' : 'bg-slate-50'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        <img src={images.front} alt={`${archName} anterior`}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                            style={{ filter: isDark ? 'drop-shadow(0 0 12px rgba(16,185,129,0.05))' : 'contrast(1.1)' }}
                        />
                        <div className="absolute" style={{ top: BODY_ZONE.top, left: BODY_ZONE.left, width: BODY_ZONE.width, height: BODY_ZONE.height }}>
                            {EXAM_NODES.filter(n => n.side === 'front').map(n => renderNode(n, false))}
                        </div>
                        {progressCount < examNodeIds.size && !isFlipping && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                                <div className={`absolute w-full h-6 ${isDark ? 'bg-gradient-to-b from-transparent via-emerald-500/8 to-transparent' : 'bg-gradient-to-b from-transparent via-blue-500/8 to-transparent'}`}
                                    style={{ animation: `bodymap-scan-sweep-3d ${isCritical ? '2s' : '4s'} linear infinite` }} />
                            </div>
                        )}
                    </div>

                    {/* BACK FACE */}
                    <div className={`absolute inset-0 rounded-xl ${isDark ? 'bg-[#050d1a]' : 'bg-slate-100'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        {(backLoaded || isPosterior) && (
                            <img src={images.back} alt={`${archName} posterior`}
                                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                style={{ filter: isDark ? 'drop-shadow(0 0 10px rgba(56,189,248,0.06)) brightness(0.85)' : 'contrast(1.05) brightness(0.9)' }}
                            />
                        )}
                        <div className="absolute" style={{ top: BODY_ZONE.top, left: BODY_ZONE.left, width: BODY_ZONE.width, height: BODY_ZONE.height }}>
                            {EXAM_NODES.filter(n => n.side === 'back').map(n => renderNode(n, true))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="px-5 pb-3 z-30 pointer-events-none shrink-0">
                <div className="flex justify-between items-end mb-1">
                    <span className={`text-[7px] font-mono tracking-wider uppercase ${isDark ? 'text-emerald-500/50' : 'text-slate-400'}`}>
                        {progressCount >= examNodeIds.size ? '✓ Complete' : `${progressCount}/${examNodeIds.size}`}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-slate-700'}`}>
                        {progressPct}%
                    </span>
                </div>
                <div className={`w-full flex gap-px h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-200'}`}>
                    {EXAM_NODES.map((n, i) => {
                        const d = !!normalizedExams[n.id];
                        const s = analyzeSeverity(normalizedExams[n.id]);
                        const c = d ? (s === 'abnormal' ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : (isDark ? 'bg-emerald-500' : 'bg-blue-500')) : 'bg-transparent';
                        return <div key={i} className={`flex-1 rounded-sm transition-all duration-700 ${c}`} />;
                    })}
                </div>
            </div>
        </div>
    );
}
