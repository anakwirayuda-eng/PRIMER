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

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewsApp = () => {
    const { t } = useTranslation();
    const [category, setCategory] = useState('all');

    const categories = useMemo(() => ['all', 'lokal', 'nasional', 'intl', 'tips'], []);
    const news = useMemo(() => [
        { id: 1, title: t('newsApp.items.1.title'), category: 'nasional', date: t('newsApp.time.1h'), source: 'DetikSehat' },
        { id: 2, title: t('newsApp.items.2.title'), category: 'tips', date: t('newsApp.time.3h'), source: 'DokterGaul' },
        { id: 3, title: t('newsApp.items.3.title'), category: 'nasional', date: t('newsApp.time.5h'), source: 'FarmasiNews' },
        { id: 4, title: t('newsApp.items.4.title'), category: 'lokal', date: t('newsApp.time.1d'), source: 'WargaNet' },
        { id: 5, title: t('newsApp.items.5.title'), category: 'intl', date: t('newsApp.time.2d'), source: 'ScienceDaily' }
    ], [t]);

    const filteredNews = category === 'all' ? news : news.filter(n => n.category === category);

    return (
        <div className="bg-slate-50 min-h-full">
            {/* Categories */}
            <div className="flex overflow-x-auto p-2 gap-2 bg-white border-b sticky top-0 z-10 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${category === cat ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                        {t(`newsApp.categories.${cat}`)}
                    </button>
                ))}
            </div>

            {/* News Feed */}
            <div className="p-2 space-y-3">
                {/* Ads Placeholder */}
                <div className="bg-yellow-100 border border-yellow-200 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-yellow-300 w-10 h-10 rounded flex items-center justify-center text-xs font-bold">
                        {t('newsApp.ad.badge')}
                    </div>
                    <div>
                        <h4 className="font-bold text-xs text-slate-800">{t('newsApp.ad.title')}</h4>
                        <p className="text-[10px] text-slate-600">{t('newsApp.ad.subtitle')}</p>
                    </div>
                </div>

                {filteredNews.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{t(`newsApp.categories.${item.category}`)}</span>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{item.title}</h3>
                        <p className="text-[10px] text-slate-500">{t('newsApp.source', { source: item.source })}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsApp;
