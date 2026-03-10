/**
 * ExpandableCard — Tap-to-expand accordion card with smooth animation.
 * 
 * Features:
 * - Smooth max-height transition on expand/collapse
 * - Optional status badge (color-coded)
 * - Dark mode aware
 * - Hover lift effect
 * 
 * @param {{ title: string, subtitle?: string, icon?: React.ReactNode, badge?: { text: string, color: string }, children: React.ReactNode, defaultOpen?: boolean }} props
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ExpandableCard({ title, subtitle, icon, badge, children, defaultOpen = false }) {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [children, isOpen]);

    return (
        <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isDark
                ? 'bg-slate-800/80 border border-slate-700 hover:border-slate-600'
                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
            } ${isOpen ? 'ring-1 ring-amber-500/20' : ''}`}>
            {/* Header — always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                aria-expanded={isOpen}
            >
                {/* Icon */}
                {icon && (
                    <div className={`text-lg flex-shrink-0 ${isDark ? 'opacity-80' : ''}`}>
                        {icon}
                    </div>
                )}

                {/* Title + subtitle */}
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {title}
                    </div>
                    {subtitle && (
                        <div className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {subtitle}
                        </div>
                    )}
                </div>

                {/* Badge */}
                {badge && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 ${badge.color}`}>
                        {badge.text}
                    </span>
                )}

                {/* Chevron */}
                <ChevronDown
                    size={16}
                    className={`flex-shrink-0 transition-transform duration-300 ${isDark ? 'text-slate-500' : 'text-slate-400'
                        } ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expandable content */}
            <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{ maxHeight: isOpen ? `${contentHeight + 16}px` : '0px' }}
            >
                <div ref={contentRef} className={`px-3.5 pb-3.5 pt-0 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'
                    }`}>
                    <div className="pt-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
