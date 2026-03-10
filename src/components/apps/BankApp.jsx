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
import { useGame } from '../../context/GameContext.jsx';
import { CreditCard, Wallet, TrendingUp, History } from 'lucide-react';

const BankApp = () => {
    const { stats, playerStats } = useGame();

    // Simulate personal savings (separate from clinic money for now, or just mirror it as 'Gaji' portion)
    // For MVP, Personal Money = Pendapatan Umum (Clinic Profit) for now as requested in previous turn
    // But ideally split. Let's use playerStats.reputation to calc a mock 'salary'

    const personalSavings = stats.pendapatanUmum;
    const monthlySalary = 4500000; // Basic salary
    const jasaPelayanan = Math.floor(stats.pendapatanJkn * 0.4); // 40% of JKN capitation

    return (
        <div className="p-4 bg-blue-50 h-full">
            {/* Card Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 text-white shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard size={120} />
                </div>
                <div className="relative z-10">
                    <div className="text-sm opacity-80 mb-1">Bank Desa Syariah</div>
                    <div className="text-2xl font-bold mb-4">Rp {personalSavings.toLocaleString('id-ID')}</div>
                    <div className="flex justify-between items-end">
                        <div className="text-xs font-mono opacity-75">**** **** **** 8899</div>
                        <div className="text-xs">Dr. {playerStats.name || 'Dokter'}</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-blue-50 transition">
                    <Wallet className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">Top Up E-Wallet</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:bg-blue-50 transition">
                    <TrendingUp className="text-green-600" />
                    <span className="text-xs font-bold text-slate-700">Investasi</span>
                </button>
            </div>

            {/* Transaction History */}
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <History size={16} />
                Mutasi Rekening
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">Transfer Masuk (Gaji)</div>
                        <div className="text-[10px] text-slate-400">01 Jan 2026</div>
                    </div>
                    <div className="text-green-600 font-bold text-sm">+Rp {monthlySalary.toLocaleString('id-ID')}</div>
                </div>
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">Jasa Pelayanan (Jaspel)</div>
                        <div className="text-[10px] text-slate-400">15 Jan 2026</div>
                    </div>
                    <div className="text-green-600 font-bold text-sm">+Rp {jasaPelayanan.toLocaleString('id-ID')}</div>
                </div>
                <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-xs text-slate-700">Beli Bakso</div>
                        <div className="text-[10px] text-slate-400">Yesterday</div>
                    </div>
                    <div className="text-red-600 font-bold text-sm">-Rp 15.000</div>
                </div>
            </div>
        </div>
    );
};

export default BankApp;
