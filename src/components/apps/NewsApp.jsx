/**
 * @reflection
 * [IDENTITY]: NewsApp
 * [PURPOSE]: Module: NewsApp
 * [STATE]: Experimental
 * [ANCHOR]: NewsApp
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';

const NewsApp = () => {
    const [category, setCategory] = useState('all');

    const news = [
        { id: 1, title: 'Wabah Flu di Musim Pancaroba', category: 'nasional', date: '1h ago', source: 'DetikSehat' },
        { id: 2, title: 'Tips Menghadapi Pasien Rewel', category: 'tips', date: '3h ago', source: 'DokterGaul' },
        { id: 3, title: 'Harga Obat Generik Turun!', category: 'nasional', date: '5h ago', source: 'FarmasiNews' },
        { id: 4, title: 'Sapi Pak Kades Lepas, Masuk Puskesmas', category: 'lokal', date: '1d ago', source: 'WargaNet' },
        { id: 5, title: 'Studi Baru: Kopi Mencegah Kantuk (Ya iyalah)', category: 'intl', date: '2d ago', source: 'ScienceDaily' },
    ];

    const filteredNews = category === 'all' ? news : news.filter(n => n.category === category);

    return (
        <div className="bg-slate-50 min-h-full">
            {/* Categories */}
            <div className="flex overflow-x-auto p-2 gap-2 bg-white border-b sticky top-0 z-10 no-scrollbar">
                {['all', 'lokal', 'nasional', 'intl', 'tips'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${category === cat ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* News Feed */}
            <div className="p-2 space-y-3">
                {/* Ads Placeholder */}
                <div className="bg-yellow-100 border border-yellow-200 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-yellow-300 w-10 h-10 rounded flex items-center justify-center text-xs font-bold">ADS</div>
                    <div>
                        <h4 className="font-bold text-xs text-slate-800">Promo Alat Kesehatan!</h4>
                        <p className="text-[10px] text-slate-600">Diskon 50% Stetoskop Sultan</p>
                    </div>
                </div>

                {filteredNews.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{item.category}</span>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{item.title}</h3>
                        <p className="text-[10px] text-slate-500">Source: {item.source}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsApp;
