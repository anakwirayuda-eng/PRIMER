/**
 * @reflection
 * [IDENTITY]: MetricCard
 * [PURPOSE]: React UI component: MetricCard.
 * [STATE]: Experimental
 * [ANCHOR]: MetricCard
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';

export default function MetricCard({ icon, label, value, trend: _trend }) {
    return (
        <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-xs font-semibold text-slate-500 uppercase">{label}</span>
            </div>
            <div className="text-lg font-bold">
                {value}
            </div>
        </div>
    );
}
