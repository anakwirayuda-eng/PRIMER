/**
 * StatCard — Animated stat display with icon, value, and label.
 * 
 * Features:
 * - Count-up animation on mount (0 → value over 600ms)
 * - Configurable color via `colorClass` (Tailwind bg/text classes)
 * - Dark mode aware via parent `.dark` class
 * - Reduced motion: skips animation
 * 
 * @param {{ icon: React.ReactNode, value: number|string, label: string, colorClass?: string, prefix?: string, suffix?: string }} props
 */
import React, { useState, useEffect, useRef } from 'react';

export default function StatCard({ icon, value, label, colorClass = 'bg-blue-50 text-blue-600', prefix = '', suffix = '' }) {
    const [displayValue, setDisplayValue] = useState(0);
    const rafRef = useRef(null);
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const isNumeric = typeof value === 'number' || !isNaN(parseFloat(value));

    useEffect(() => {
        if (!isNumeric) {
            setDisplayValue(value);
            return;
        }

        // Check prefers-reduced-motion
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setDisplayValue(numericValue);
            return;
        }

        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericValue);
            setDisplayValue(current);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [numericValue, isNumeric, value]);

    // Extract bg and text color from colorClass
    const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-blue-50';
    const textClass = colorClass.split(' ').find(c => c.startsWith('text-')) || 'text-blue-600';

    return (
        <div className={`${bgClass} p-3 rounded-xl text-center transition-all duration-300 hover:scale-[1.03]`}>
            <div className={`${textClass} mx-auto mb-1.5 flex justify-center`}>
                {icon}
            </div>
            <div className={`text-xl font-black ${textClass} tabular-nums`}>
                {prefix}{isNumeric ? displayValue.toLocaleString('id-ID') : displayValue}{suffix}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-70 ${textClass}`}>
                {label}
            </div>
        </div>
    );
}
