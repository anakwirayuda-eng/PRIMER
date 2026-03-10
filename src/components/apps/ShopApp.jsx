/**
 * @reflection
 * [IDENTITY]: ShopApp
 * [PURPOSE]: Module: ShopApp
 * [STATE]: Experimental
 * [ANCHOR]: ShopApp
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const ShopApp = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50 items-center justify-center text-center p-6">
            <ShoppingBag size={64} className="text-orange-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Toko Oren</h2>
            <p className="text-sm text-slate-500 mb-6">Belanja online kebutuhan gaya hidup Anda. Segera Hadir!</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-orange-600 transition">
                Cek Flash Sale
            </button>
        </div>
    );
};

export default ShopApp;
