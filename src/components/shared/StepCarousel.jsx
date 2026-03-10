/**
 * StepCarousel — Swipeable multi-step container with dot indicators.
 * 
 * Features:
 * - Touch swipe support (mobile-first)
 * - Step indicator dots at bottom
 * - Smooth CSS transition between steps
 * - Optional auto-advance timer
 * - Dark mode aware
 * 
 * @param {{ children: React.ReactNode[], onComplete?: () => void, completeLabel?: string }} props
 */
import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function StepCarousel({ children, onComplete, completeLabel = 'Selesai' }) {
    const { isDark } = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const touchRef = useRef({ startX: 0, startY: 0 });
    const containerRef = useRef(null);

    const steps = React.Children.toArray(children);
    const totalSteps = steps.length;
    const isLast = activeStep === totalSteps - 1;
    const isFirst = activeStep === 0;

    const goNext = useCallback(() => {
        if (isLast) {
            onComplete?.();
        } else {
            setActiveStep(s => Math.min(s + 1, totalSteps - 1));
        }
    }, [isLast, onComplete, totalSteps]);

    const goPrev = useCallback(() => {
        setActiveStep(s => Math.max(s - 1, 0));
    }, []);

    // Touch handlers for swipe
    const handleTouchStart = useCallback((e) => {
        touchRef.current.startX = e.touches[0].clientX;
        touchRef.current.startY = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const diffX = touchRef.current.startX - e.changedTouches[0].clientX;
        const diffY = Math.abs(touchRef.current.startY - e.changedTouches[0].clientY);

        // Only register horizontal swipes (not vertical scroll)
        if (Math.abs(diffX) > 50 && diffY < 100) {
            if (diffX > 0) goNext();
            else goPrev();
        }
    }, [goNext, goPrev]);

    return (
        <div className="flex flex-col h-full">
            {/* Step content area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeStep * 100}%)` }}
                >
                    {steps.map((step, i) => (
                        <div key={i} className="w-full flex-shrink-0 overflow-y-auto p-5">
                            {step}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation footer */}
            <div className={`flex items-center justify-between px-5 py-3 border-t ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                {/* Previous button */}
                <button
                    onClick={goPrev}
                    disabled={isFirst}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isFirst
                            ? 'opacity-0 pointer-events-none'
                            : isDark
                                ? 'text-slate-400 hover:bg-slate-700'
                                : 'text-slate-500 hover:bg-slate-200'
                        }`}
                >
                    <ChevronLeft size={14} /> Kembali
                </button>

                {/* Step dots */}
                <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveStep(i)}
                            className={`rounded-full transition-all duration-300 ${i === activeStep
                                    ? 'w-6 h-2 bg-amber-500'
                                    : i < activeStep
                                        ? `w-2 h-2 ${isDark ? 'bg-amber-700' : 'bg-amber-300'}`
                                        : `w-2 h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`
                                }`}
                            aria-label={`Step ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Next / Complete button */}
                <button
                    onClick={goNext}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isLast
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            : isDark
                                ? 'text-amber-400 hover:bg-slate-700'
                                : 'text-amber-600 hover:bg-amber-50'
                        }`}
                >
                    {isLast ? completeLabel : <>Lanjut <ChevronRight size={14} /></>}
                </button>
            </div>
        </div>
    );
}
