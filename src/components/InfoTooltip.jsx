/**
 * @reflection
 * [IDENTITY]: InfoTooltip
 * [PURPOSE]: Module: InfoTooltip
 * [STATE]: Experimental
 * [ANCHOR]: InfoTooltip
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { Info } from 'lucide-react';

const InfoTooltip = ({ title, content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1 align-middle">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help text-slate-400 hover:text-indigo-500 transition-colors"
            >
                <Info size={14} />
            </div>

            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {title && <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-indigo-400">{title}</h4>}
                    <p className="text-[10px] leading-relaxed font-medium text-slate-300">{content}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
