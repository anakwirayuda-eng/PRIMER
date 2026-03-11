/**
 * @reflection
 * [IDENTITY]: OpeningScreen
 * [PURPOSE]: Cinematic opening — ITS logo reveal, dissolve, PRIMER title + CTA.
 *            Clean, minimal text, maximum atmosphere.
 * [STATE]: Stable
 * [ANCHOR]: OpeningScreen
 * [DEPENDS_ON]: AppMetadata, assets
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-11
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APP_METADATA } from '../data/AppMetadata.js';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';

// ═══ PRE-GENERATED (outside render) ═══
const AMBIENT_PARTICLES = [...Array(24)].map((_, i) => ({
    id: i, size: 1 + Math.random() * 3,
    x: Math.random() * 100, y: Math.random() * 100,
    color: i % 3 === 0 ? '16,185,129' : i % 3 === 1 ? '6,182,212' : '99,102,241',
    alpha: 0.08 + Math.random() * 0.2,
    duration: 12 + Math.random() * 16, delay: Math.random() * 10,
}));

const BURST_PARTICLES = [...Array(36)].map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 280;
    return {
        id: i, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist,
        size: 2 + Math.random() * 4, duration: 0.6 + Math.random() * 1.2, delay: Math.random() * 0.2,
    };
});

const PRIMER_LETTERS = 'PRIMER'.split('');

/**
 * Flow (first-time):
 *   black → its_build → its_hold → its_dissolve → title_type → title_ready → exit
 *
 * Flow (veteran): title_ready instantly
 */
export default function OpeningScreen({ onComplete }) {
    const [phase, setPhase] = useState('black');
    const [letterIndex, setLetterIndex] = useState(-1);
    const [isExiting, setIsExiting] = useState(false);

    const timersRef = useRef([]);
    const skippedRef = useRef(false);

    // ─── Preload ───
    useEffect(() => {
        [ASSET_KEY.ITS_LOGO].forEach(k => {
            try { const img = new Image(); img.src = getAssetUrl(k); } catch {}
        });
    }, []);

    // ─── Director's Timeline ───
    useEffect(() => {
        const schedule = (fn, ms) => {
            const id = setTimeout(() => { if (!skippedRef.current) fn(); }, ms);
            timersRef.current.push(id);
        };

        let t = 600;
        schedule(() => setPhase('its_build'), t);      // logo materializes
        t += 1200;
        schedule(() => setPhase('its_hold'), t);        // logo clean
        t += 2500;
        schedule(() => setPhase('its_dissolve'), t);    // logo fades + burst
        t += 1200;
        schedule(() => setPhase('title_type'), t);      // PRIMER letters
        for (let i = 0; i < PRIMER_LETTERS.length; i++) {
            t += 100;
            const idx = i;
            schedule(() => setLetterIndex(idx), t);
        }
        t += 800;
        schedule(() => setPhase('title_ready'), t);     // CTA appears

        return () => timersRef.current.forEach(clearTimeout);
    }, []);

    // ─── Exit ───
    const triggerExit = useCallback(() => {
        if (isExiting) return;
        setIsExiting(true);
        setTimeout(() => onComplete(), 800);
    }, [isExiting, onComplete]);

    // ─── Interaction ───
    const handleInteraction = useCallback((e) => {
        if (isExiting) return;
        if (e.type === 'click' || ['Escape', 'Enter', ' '].includes(e.key)) {
            if (phase === 'title_ready') {
                triggerExit();
            } else {
                skippedRef.current = true;
                timersRef.current.forEach(clearTimeout);
                setPhase('title_ready');
                setLetterIndex(PRIMER_LETTERS.length);
            }
        }
    }, [phase, isExiting, triggerExit]);

    useEffect(() => {
        window.addEventListener('keydown', handleInteraction);
        return () => window.removeEventListener('keydown', handleInteraction);
    }, [handleInteraction]);

    // ─── Phase helpers ───
    const itsVisible = ['its_build', 'its_hold', 'its_dissolve'].includes(phase);
    const itsReady = phase === 'its_hold';
    const itsFading = phase === 'its_dissolve';
    const showTitle = ['title_type', 'title_ready'].includes(phase);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-hidden select-none cursor-pointer"
            onClick={handleInteraction}
            role="button" aria-label="Layar Pembuka" tabIndex={0}
            style={{
                backgroundColor: '#020617',
                backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        >
            {/* Self-contained CSS */}
            <style>{`
                @keyframes os-glow-pulse { 0%, 100% { box-shadow: 0 0 60px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 120px rgba(16,185,129,0.6), 0 0 200px rgba(6,182,212,0.2); } }
                @keyframes os-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
            `}</style>

            {/* CRT Scanline */}
            <div className="absolute inset-0 z-50 pointer-events-none" style={{
                background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.2) 50%)',
                backgroundSize: '100% 4px',
            }} />

            {/* Exit flash */}
            {isExiting && (
                <div className="absolute inset-0 bg-white z-[100] pointer-events-none"
                     style={{ animation: 'sss-auth-flash 0.8s ease-out forwards' }} />
            )}

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {AMBIENT_PARTICLES.map(p => (
                    <div key={p.id} className="absolute rounded-full"
                        style={{
                            width: p.size, height: p.size,
                            left: p.x + '%', top: p.y + '%',
                            background: `rgba(${p.color}, ${p.alpha})`,
                            boxShadow: `0 0 ${p.size * 3}px rgba(${p.color}, ${p.alpha})`,
                            animation: `os-float ${p.duration}s ease-in-out infinite`,
                            animationDelay: `-${p.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* ═══ ITS LOGO REVEAL ═══ */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
                 style={{
                     opacity: itsVisible && !itsFading ? 1 : itsFading ? 0 : 0,
                     transform: phase === 'its_build' ? 'scale(0.85)' : itsReady ? 'scale(1)' : itsFading ? 'scale(1.15)' : 'scale(0.8)',
                     transition: itsFading ? 'all 1s ease-in' : 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                     filter: phase === 'its_build' ? 'blur(8px) brightness(2)' : itsReady ? 'blur(0) brightness(1)' : 'blur(12px) brightness(0.5)',
                 }}>
                {/* Glow ring */}
                <div className="absolute rounded-full" style={{
                    width: 500, height: 500,
                    background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)',
                    opacity: itsReady ? 1 : 0,
                    transition: 'opacity 1.5s ease',
                    animation: itsReady ? 'os-glow-pulse 3s ease-in-out infinite' : 'none',
                }} />

                {/* Logo */}
                <img
                    src={getAssetUrl(ASSET_KEY.ITS_LOGO)}
                    alt="Institut Teknologi Sepuluh Nopember"
                    className="relative z-10 object-contain"
                    style={{
                        width: 'clamp(140px, 20vw, 220px)',
                        height: 'clamp(140px, 20vw, 220px)',
                        filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.5)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
                    }}
                />

                {/* University name */}
                <p className="relative z-10 text-slate-400 text-[10px] tracking-[0.5em] uppercase font-bold mt-6"
                   style={{ opacity: itsReady ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
                    Institut Teknologi Sepuluh Nopember
                </p>
            </div>

            {/* Burst particles (ITS dissolve) */}
            {itsFading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    {BURST_PARTICLES.map(p => (
                        <div key={`burst-${p.id}`} className="absolute rounded-full bg-emerald-400"
                            style={{
                                width: p.size, height: p.size,
                                animation: `particle-scatter ${p.duration}s ease-out forwards ${p.delay}s`,
                                '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                                boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ═══ PRIMER TITLE ═══ */}
            <div className="relative z-20 flex flex-col items-center pointer-events-none"
                 style={{
                     opacity: showTitle ? 1 : 0,
                     transform: showTitle ? 'translateY(0)' : 'translateY(30px)',
                     transition: 'all 0.8s ease',
                 }}>
                {/* Glow */}
                <div className="absolute rounded-full" style={{
                    width: '100vw', height: 400,
                    background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 60%)',
                    opacity: phase === 'title_ready' ? 1 : 0, transition: 'opacity 2s ease',
                }} />

                {/* Letters */}
                <div className="relative z-10 flex items-baseline gap-1 md:gap-2">
                    {PRIMER_LETTERS.map((letter, i) => (
                        <span key={`let-${i}`} className="font-display font-black text-transparent bg-clip-text"
                            style={{
                                fontSize: 'clamp(4rem, 12vw, 8rem)', letterSpacing: '0.12em',
                                backgroundImage: 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #10B981 100%)',
                                backgroundSize: '200% 200%',
                                animation: i <= letterIndex ? 'gradient-shift 4s ease infinite' : 'none',
                                opacity: i <= letterIndex ? 1 : 0,
                                transform: i <= letterIndex ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(1.3)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                textShadow: i <= letterIndex ? '0 10px 40px rgba(16,185,129,0.5)' : 'none',
                                WebkitTextStroke: '1px rgba(16,185,129,0.2)',
                            }}>
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Subtitle */}
                <p className="text-emerald-400/70 text-[10px] sm:text-xs tracking-[0.5em] uppercase font-bold mt-3"
                   style={{ opacity: phase === 'title_ready' ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
                    {APP_METADATA.fullName}
                </p>

                {/* CTA */}
                <div className="mt-14 pointer-events-auto">
                    {phase === 'title_ready' && (
                        <button
                            className="text-white text-[10px] md:text-xs font-black tracking-[0.4em] uppercase px-10 py-4 border border-emerald-500/50 bg-emerald-950/40 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-800/60 hover:scale-105 transition-all"
                            style={{ animation: 'skip-pulse 2s ease-in-out infinite' }}
                        >
                            [ MULAI ]
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-[-18vh] flex flex-col items-center"
                     style={{ opacity: phase === 'title_ready' ? 1 : 0, transition: 'opacity 1s ease 0.6s' }}>
                    <div className="flex items-center gap-3 mb-2 opacity-40">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-5 w-5 object-contain" />
                        <div className="h-3 w-px bg-slate-700" />
                        <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-mono">{APP_METADATA.tagline}</span>
                    </div>
                    <p className="text-slate-600 text-[8px] tracking-[0.3em] uppercase">
                        {APP_METADATA.copyright} &bull; v{APP_METADATA.version}
                    </p>
                </div>
            </div>

            {/* Skip hint */}
            {!['title_ready', 'black'].includes(phase) && !isExiting && (
                <div className="absolute bottom-8 right-8 text-slate-600 font-mono text-[9px] tracking-[0.3em] uppercase z-40">
                    [ ESC / KLIK ]
                </div>
            )}
        </div>
    );
}
