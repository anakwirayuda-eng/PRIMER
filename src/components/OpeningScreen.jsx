/**
 * @reflection
 * [IDENTITY]: OpeningScreen
 * [PURPOSE]: Cinematic console-game-style opening with dramatic logo reveals and smooth transitions.
 * [STATE]: Stable
 * [ANCHOR]: OpeningScreen
 * [DEPENDS_ON]: AppMetadata, SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { APP_METADATA } from '../data/AppMetadata.js';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { soundManager } from '../utils/SoundManager.js';

// ═══════════════════════════════════════════════════════
// Pre-generated cinematic particle data
// ═══════════════════════════════════════════════════════
const AMBIENT_PARTICLES = [...Array(40)].map((_, i) => ({
    size: 1 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: i % 3 === 0 ? '16,185,129' : i % 3 === 1 ? '99,102,241' : '139,92,246',
    alpha: 0.05 + Math.random() * 0.25,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 15,
}));

// Burst particles for logo reveal
const BURST_PARTICLES = [...Array(30)].map(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 200;
    return {
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 2 + Math.random() * 4,
        duration: 0.8 + Math.random() * 1.2,
        delay: Math.random() * 0.3,
    };
});

// Letter-by-letter animation for "PRIMER"
const PRIMER_LETTERS = 'PRIMER'.split('');

/**
 * OpeningScreen — Cinematic console-game opening.
 * 
 * Flow:
 *   1. Black screen → light beam sweeps → ITS logo assembles from glow
 *   2. ITS dissolves → particles scatter → FKK logo materializes
 *   3. FKK explodes outward → PRIMER title types in letter-by-letter
 *   4. Auto-advances to SaveSlotSelector via onComplete()
 * 
 * After cinematic: goes directly to SaveSlotSelector (no intermediate menu).
 */
export default function OpeningScreen({ onComplete }) {
    // Phases: 'black' → 'beam' → 'its_build' → 'its_hold' → 'its_dissolve' → 
    //         'fkk_build' → 'fkk_hold' → 'fkk_burst' → 'title_type' → 'title_hold' → 'done'
    const [phase, setPhase] = useState('black');
    const [letterIndex, setLetterIndex] = useState(-1);
    const timersRef = useRef([]);
    const skippedRef = useRef(false);

    const particles = useMemo(() => AMBIENT_PARTICLES, []);
    const burstParticles = useMemo(() => BURST_PARTICLES, []);

    // ─── Phase Timeline ───────────────────────────────────
    useEffect(() => {
        const schedule = (fn, ms) => {
            const id = setTimeout(() => {
                if (!skippedRef.current) fn();
            }, ms);
            timersRef.current.push(id);
        };

        let t = 0;

        // Phase 0: Pure black (500ms)
        t += 500;
        schedule(() => setPhase('beam'), t);

        // Phase 1: Light beam sweeps (800ms)
        t += 800;
        schedule(() => setPhase('its_build'), t);

        // Phase 2: ITS logo assembles from glow (1200ms)
        t += 1200;
        schedule(() => setPhase('its_hold'), t);

        // Phase 3: ITS hold (2000ms)
        t += 2000;
        schedule(() => setPhase('its_dissolve'), t);

        // Phase 4: ITS dissolves (800ms)
        t += 800;
        schedule(() => setPhase('fkk_build'), t);

        // Phase 5: FKK materializes (1200ms)
        t += 1200;
        schedule(() => setPhase('fkk_hold'), t);

        // Phase 6: FKK hold (2000ms)
        t += 2000;
        schedule(() => setPhase('fkk_burst'), t);

        // Phase 7: FKK burst/explode (600ms)
        t += 600;
        schedule(() => setPhase('title_type'), t);

        // Phase 8: Title types in — each letter appears
        for (let i = 0; i < PRIMER_LETTERS.length; i++) {
            t += 150;
            const idx = i;
            schedule(() => setLetterIndex(idx), t);
        }

        // Phase 9: Hold title (2500ms), then auto-advance
        t += 2500;
        schedule(() => setPhase('title_hold'), t);

        t += 1500;
        schedule(() => {
            setPhase('done');
            soundManager.init();
            onComplete();
        }, t);

        return () => {
            timersRef.current.forEach(id => clearTimeout(id));
            timersRef.current = [];
        };
    }, [onComplete]);

    // ─── Skip Handler ─────────────────────────────────────
    const skipToEnd = useCallback(() => {
        if (skippedRef.current) return;
        skippedRef.current = true;
        timersRef.current.forEach(id => clearTimeout(id));
        timersRef.current = [];
        soundManager.init();
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        const handleKey = (e) => {
            if (['Escape', 'Enter', ' '].includes(e.key)) {
                skipToEnd();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [skipToEnd]);

    // ─── Phase Helpers ────────────────────────────────────
    const isBeam = phase === 'beam';
    const isITSBuild = phase === 'its_build';
    const isITSVisible = ['its_build', 'its_hold'].includes(phase);
    const isITSDissolve = phase === 'its_dissolve';
    const isFKKBuild = phase === 'fkk_build';
    const isFKKVisible = ['fkk_build', 'fkk_hold'].includes(phase);
    const isFKKBurst = phase === 'fkk_burst';
    const isTitleTyping = phase === 'title_type' || phase === 'title_hold' || phase === 'done';
    const isTitleReady = phase === 'title_hold' || phase === 'done';

    return (
        <div
            className="fixed inset-0 bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-pointer"
            onClick={skipToEnd}
            role="button"
            aria-label="Lewati animasi pembuka — klik atau tekan Escape"
            tabIndex={0}
        >
            {/* ═══ Ambient Floating Particles ═══ */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: p.size, height: p.size,
                            left: p.x + '%', top: p.y + '%',
                            background: `rgba(${p.color}, ${p.alpha})`,
                            animation: `cinematic-float ${p.duration}s ease-in-out infinite`,
                            animationDelay: `-${p.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* ═══ Light Beam Sweep ═══ */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: isBeam ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <div
                    className="absolute top-0 bottom-0 w-[2px]"
                    style={{
                        background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.8), rgba(99,102,241,0.8), transparent)',
                        boxShadow: '0 0 40px 20px rgba(16,185,129,0.3), 0 0 80px 40px rgba(99,102,241,0.15)',
                        animation: isBeam ? 'beam-sweep 0.8s ease-in-out forwards' : 'none',
                    }}
                />
            </div>

            {/* ═══ ITS Logo — Dramatic Build-Up ═══ */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                style={{
                    opacity: isITSVisible ? 1 : isITSDissolve ? 0 : 0,
                    transform: isITSBuild ? 'scale(0.85)' : isITSVisible ? 'scale(1)' : isITSDissolve ? 'scale(1.15)' : 'scale(0.8)',
                    transition: isITSDissolve ? 'all 0.8s ease-in' : 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: isITSBuild ? 'blur(8px) brightness(2)' : isITSVisible ? 'blur(0) brightness(1)' : 'blur(12px) brightness(0.5)',
                }}
            >
                {/* Boom glow behind logo */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 400, height: 400,
                        background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.1) 40%, transparent 70%)',
                        opacity: isITSVisible ? 1 : 0,
                        transition: 'opacity 1.5s ease',
                        animation: isITSVisible ? 'bloom-pulse 2s ease-in-out infinite' : 'none',
                    }}
                />
                <img
                    src={getAssetUrl(ASSET_KEY.ITS_LOGO)}
                    alt="ITS"
                    className="h-40 w-40 object-contain relative z-10"
                    style={{
                        filter: 'drop-shadow(0 0 30px rgba(16,185,129,0.5)) drop-shadow(0 0 60px rgba(16,185,129,0.2))',
                    }}
                />
                <p
                    className="mt-8 text-slate-300 text-sm tracking-[0.4em] uppercase font-light relative z-10"
                    style={{
                        opacity: isITSVisible ? 1 : 0,
                        transform: isITSVisible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'all 0.8s ease 0.3s',
                    }}
                >
                    Institut Teknologi Sepuluh Nopember
                </p>
            </div>

            {/* ═══ Dissolve Particles (ITS→FKK transition) ═══ */}
            {isITSDissolve && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {burstParticles.map((p, i) => (
                        <div
                            key={`dissolve-${i}`}
                            className="absolute rounded-full bg-emerald-400"
                            style={{
                                width: p.size, height: p.size,
                                animation: `particle-scatter ${p.duration}s ease-out forwards`,
                                animationDelay: `${p.delay}s`,
                                '--tx': `${p.tx}px`,
                                '--ty': `${p.ty}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ═══ FKK Logo — Materialization ═══ */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                style={{
                    opacity: isFKKVisible ? 1 : isFKKBurst ? 0 : 0,
                    transform: isFKKBuild ? 'scale(0.85)' : isFKKVisible ? 'scale(1)' : isFKKBurst ? 'scale(1.3)' : 'scale(0.8)',
                    transition: isFKKBurst ? 'all 0.6s ease-in' : 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: isFKKBuild ? 'blur(6px) brightness(1.5)' : isFKKVisible ? 'blur(0) brightness(1)' : 'blur(16px) brightness(0.3)',
                }}
            >
                {/* Glow ring */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 450, height: 450,
                        background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
                        opacity: isFKKVisible ? 1 : 0,
                        transition: 'opacity 1.5s ease',
                        animation: isFKKVisible ? 'bloom-pulse 2.5s ease-in-out infinite' : 'none',
                    }}
                />
                <img
                    src={getAssetUrl(ASSET_KEY.FKK_LOGO)}
                    alt="Fakultas Kedokteran ITS"
                    className="h-56 w-56 object-contain relative z-10"
                    style={{
                        filter: 'brightness(0) invert(1) drop-shadow(0 0 30px rgba(99,102,241,0.5)) drop-shadow(0 0 60px rgba(99,102,241,0.2))',
                        mixBlendMode: 'screen',
                    }}
                />
            </div>

            {/* ═══ FKK Burst Ring (on exit) ═══ */}
            {isFKKBurst && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="rounded-full border-2 border-indigo-400/60"
                        style={{
                            animation: 'burst-ring 0.8s ease-out forwards',
                        }}
                    />
                    {burstParticles.map((p, i) => (
                        <div
                            key={`burst-${i}`}
                            className="absolute rounded-full bg-indigo-400"
                            style={{
                                width: p.size, height: p.size,
                                animation: `particle-scatter ${p.duration}s ease-out forwards`,
                                animationDelay: `${p.delay}s`,
                                '--tx': `${p.tx * 1.5}px`,
                                '--ty': `${p.ty * 1.5}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ═══ PRIMER Title — Letter-by-Letter Typing ═══ */}
            <div
                className="relative z-10 flex flex-col items-center"
                style={{
                    opacity: isTitleTyping ? 1 : 0,
                    transform: isTitleTyping ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease',
                    pointerEvents: 'none',
                }}
            >
                {/* Title glow backdrop */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 600, height: 300,
                        background: 'radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)',
                        opacity: isTitleReady ? 1 : 0,
                        transition: 'opacity 1.5s ease',
                    }}
                />

                {/* Letter-by-letter PRIMER */}
                <div className="relative z-10 flex items-baseline gap-1">
                    {PRIMER_LETTERS.map((letter, i) => (
                        <span
                            key={i}
                            className="font-display font-black text-transparent bg-clip-text"
                            style={{
                                fontSize: 'clamp(4rem, 10vw, 7rem)',
                                letterSpacing: '0.15em',
                                backgroundImage: 'linear-gradient(135deg, #10B981 0%, #6366F1 50%, #10B981 100%)',
                                backgroundSize: '200% 200%',
                                animation: i <= letterIndex ? 'gradient-shift 4s ease infinite' : 'none',
                                opacity: i <= letterIndex ? 1 : 0,
                                transform: i <= letterIndex ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(1.2)',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                textShadow: i <= letterIndex ? '0 0 40px rgba(16,185,129,0.4)' : 'none',
                                WebkitTextStroke: '1px rgba(16,185,129,0.1)',
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Subtitle */}
                <p
                    className="text-slate-500 text-xs tracking-[0.4em] uppercase font-light mt-2"
                    style={{
                        opacity: isTitleReady ? 1 : 0,
                        transform: isTitleReady ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'all 0.8s ease 0.2s',
                    }}
                >
                    {APP_METADATA.fullName}
                </p>

                {/* Version badge */}
                <div
                    className="flex items-center gap-3 mt-4"
                    style={{
                        opacity: isTitleReady ? 1 : 0,
                        transition: 'opacity 0.8s ease 0.4s',
                    }}
                >
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/40" />
                    <p className="text-emerald-500/60 text-[10px] tracking-[0.3em] uppercase">v{APP_METADATA.version}</p>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500/40" />
                </div>

                {/* Loading indicator during title hold */}
                <div
                    className="mt-10 flex items-center gap-2"
                    role="status"
                    aria-label="Memuat permainan"
                    style={{
                        opacity: isTitleReady ? 1 : 0,
                        transition: 'opacity 0.8s ease 0.8s',
                    }}
                >
                    <div className="w-5 h-5 border-2 border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin" aria-hidden="true" />
                    <span className="text-emerald-400/50 text-xs tracking-widest uppercase animate-pulse" aria-hidden="true">Memuat...</span>
                </div>

                {/* Footer */}
                <div
                    className="mt-12 flex flex-col items-center"
                    style={{
                        opacity: isTitleReady ? 1 : 0,
                        transition: 'opacity 0.8s ease 0.6s',
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-5 w-5 object-contain opacity-60" />
                        <div className="h-3 w-px bg-slate-700" />
                        <span className="text-slate-600 text-[9px] tracking-[0.2em] uppercase font-bold">{APP_METADATA.organization}</span>
                    </div>
                    <p className="text-slate-700 text-[8px] tracking-wider">{APP_METADATA.copyright}</p>
                </div>
            </div>

            {/* ═══ Skip Prompt ═══ */}
            {phase !== 'done' && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-600 text-[11px] tracking-[0.3em] uppercase"
                    aria-label="Klik atau tekan Escape untuk lewati animasi"
                    style={{
                        animation: 'skip-pulse 2s ease-in-out infinite',
                    }}
                >
                    Klik untuk lewati
                </div>
            )}

        </div>
    );
}
