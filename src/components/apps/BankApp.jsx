/**
 * @reflection
 * [IDENTITY]: BankApp
 * [PURPOSE]: Module: BankApp
 * [STATE]: Experimental
 * [ANCHOR]: BankApp
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext.jsx';
import { CreditCard, Wallet, TrendingUp, History } from 'lucide-react';
import { buildPersonalBankSnapshot } from '../../utils/financeDisplay.js';

const BankApp = () => {
    const { t, i18n } = useTranslation();
    const { stats, playerStats, monthlyArchive } = useGame();
    const locale = i18n.resolvedLanguage || 'id';

    const {
        monthlySalary,
        jasaPelayanan,
        personalSavings
    } = buildPersonalBankSnapshot(stats, monthlyArchive);

    return (
        <div className="p-4 bg-blue-50 h-full">
            {/* Card Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 text-white shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard size={120} />
                </div>
                <div className="relative z-10">
                    <div className="text-sm opacity-80 mb-1">{t('bankApp.bank_name')}</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] opacity-70 mb-1">{t('bankApp.account_simulation')}</div>
                    <div className="text-2xl font-bold mb-4">{t('bankApp.currency_prefix')} {personalSavings.toLocaleString(locale)}</div>
                    <div className="flex justify-between items-end">
                        <div className="text-xs font-mono opacity-75">**** **** **** 8899</div>
                        <div className="text-xs">{t('bankApp.doctor_prefix')} {playerStats.name || t('bankApp.doctor_fallback')}</div>
                    </div>
                    <div className="mt-3 text-[10px] opacity-75">{t('bankApp.note')}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-blue-50 transition">
                    <Wallet className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">{t('bankApp.actions.top_up')}</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-blue-50 transition">
                    <TrendingUp className="text-green-600" />
                    <span className="text-xs font-bold text-slate-700">{t('bankApp.actions.invest')}</span>
                </button>
            </div>

            {/* Transaction History */}
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <History size={16} />
                {t('bankApp.history_title')}
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">{t('bankApp.transactions.salary')}</div>
                        <div className="text-[10px] text-slate-400">{t('bankApp.transactions.salary_date')}</div>
                    </div>
                    <div className="text-green-600 font-bold text-sm">+{t('bankApp.currency_prefix')} {monthlySalary.toLocaleString(locale)}</div>
                </div>
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">{t('bankApp.transactions.service_fee')}</div>
                        <div className="text-[10px] text-slate-400">{t('bankApp.transactions.service_fee_date')}</div>
                    </div>
                    <div className="text-green-600 font-bold text-sm">+{t('bankApp.currency_prefix')} {jasaPelayanan.toLocaleString(locale)}</div>
                </div>
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">{t('bankApp.transactions.snack')}</div>
                        <div className="text-[10px] text-slate-400">{t('bankApp.transactions.yesterday')}</div>
                    </div>
                    <div className="text-red-600 font-bold text-sm">-{t('bankApp.currency_prefix')} {(15000).toLocaleString(locale)}</div>
                </div>
            </div>
        </div>
    );
};

export default BankApp;
