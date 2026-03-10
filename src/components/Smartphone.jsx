/**
 * @reflection
 * [IDENTITY]: Smartphone
 * [PURPOSE]: Module: Smartphone
 * [STATE]: Experimental
 * [ANCHOR]: Smartphone
 * [DEPENDS_ON]: GameContext, BankApp, ChatApp, ShopApp, NewsApp
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { X, Battery, Wifi, Signal, CreditCard, ShoppingBag, MessageCircle, Newspaper, ArrowLeft, Home } from 'lucide-react';
import { formatTime } from '../utils/formatTime.js';

// Apps import (will create these next)
import BankApp from './apps/BankApp.jsx';
import ChatApp from './apps/ChatApp.jsx';
import ShopApp from './apps/ShopApp.jsx';
import NewsApp from './apps/NewsApp.jsx';

const Smartphone = ({ onClose }) => {
    const { time, day, playerProfile: _playerProfile } = useGame();
    const [currentApp, setCurrentApp] = useState(null); // null = homescreen
    const [_notification, _setNotification] = useState(null);

    const apps = [
        { id: 'chat', name: 'Watsap', icon: MessageCircle, color: 'bg-green-500', component: ChatApp },
        { id: 'bank', name: 'Bank Desa', icon: CreditCard, color: 'bg-blue-600', component: BankApp },
        { id: 'shop', name: 'Toko Oren', icon: ShoppingBag, color: 'bg-orange-500', component: ShopApp },
        { id: 'news', name: 'Berita', icon: Newspaper, color: 'bg-red-500', component: NewsApp },
    ];



    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            {/* Phone Bezel */}
            <div className="bg-slate-900 w-[320px] h-[640px] rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700 relative">
                {/* Notch/Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20"></div>

                {/* Screen */}
                <div className="bg-slate-100 w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col relative">

                    {/* Status Bar */}
                    <div className="h-8 bg-slate-100 flex justify-between items-center px-6 text-[10px] font-bold text-slate-800 z-10 pt-2">
                        <span>{formatTime(time)}</span>
                        <div className="flex gap-1.5">
                            <Signal size={12} />
                            <Wifi size={12} />
                            <Battery size={12} />
                        </div>
                    </div>

                    {/* App Content or Home Screen */}
                    <div className="flex-1 overflow-hidden relative">
                        {currentApp ? (
                            <div className="h-full flex flex-col animate-fade-in">
                                {/* App Header */}
                                {currentApp !== 'home' && (
                                    <div className="h-12 bg-white border-b flex items-center px-4 gap-2 shadow-sm shrink-0">
                                        <button onClick={() => setCurrentApp(null)} className="p-1 hover:bg-slate-100 rounded-full" aria-label="Kembali ke homescreen">
                                            <ArrowLeft size={20} />
                                        </button>
                                        <span className="font-bold">{apps.find(a => a.id === currentApp)?.name}</span>
                                    </div>
                                )}
                                {/* App Body */}
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {(() => {
                                        const AppComp = apps.find(a => a.id === currentApp)?.component;
                                        return AppComp ? <AppComp /> : null;
                                    })()}
                                </div>
                            </div>
                        ) : (
                            /* Home Screen */
                            <div className="h-full p-4 flex flex-col">
                                <div className="flex-1">
                                    {/* Clock & Widget */}
                                    <div className="mt-8 mb-8 text-center">
                                        <div className="text-5xl font-thin text-slate-700">{formatTime(time)}</div>
                                        <div className="text-sm text-slate-400 font-medium">Hari ke-{day}</div>
                                    </div>

                                    {/* App Grid */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {apps.map(app => (
                                            <button
                                                key={app.id}
                                                onClick={() => setCurrentApp(app.id)}
                                                className="flex flex-col items-center gap-1 group"
                                                aria-label={`Buka aplikasi ${app.name}`}
                                            >
                                                <div className={`${app.color} w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                                                    <app.icon size={26} />
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-600">{app.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dock */}
                                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-3xl grid grid-cols-4 gap-4 mb-2">
                                    {apps.slice(0, 4).map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => setCurrentApp(app.id)}
                                            className={`${app.color} w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm mx-auto`}
                                            aria-label={`Buka ${app.name} dari dock`}
                                        >
                                            <app.icon size={20} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Home Bar */}
                    <div className="h-1 bg-slate-800 w-1/3 mx-auto mb-1 rounded-full opacity-20"></div>
                </div>

                {/* Close Button (Physical) */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-red-600 transition"
                    aria-label="Tutup smartphone"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Smartphone;
