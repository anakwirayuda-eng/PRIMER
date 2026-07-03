/**
 * @reflection
 * [IDENTITY]: ChatApp
 * [PURPOSE]: Module: ChatApp
 * [STATE]: Experimental
 * [ANCHOR]: ChatApp
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const ChatApp = () => {
    const { t } = useTranslation();
    const chats = useMemo(() => [
        { id: 1, name: t('chatApp.items.1.name'), msg: t('chatApp.items.1.message'), time: '08:00', unread: 2, isGroup: true, avatar: '🏛️' },
        { id: 2, name: t('chatApp.items.2.name'), msg: t('chatApp.items.2.message'), time: t('chatApp.time.yesterday'), unread: 0, isGroup: true, avatar: '👨‍⚕️' },
        { id: 3, name: t('chatApp.items.3.name'), msg: t('chatApp.items.3.message'), time: t('chatApp.time.yesterday'), unread: 5, isGroup: true, avatar: '🏥' },
        { id: 4, name: t('chatApp.items.4.name'), msg: t('chatApp.items.4.message'), time: t('chatApp.time.yesterday'), unread: 0, isGroup: false, avatar: '👩' },
        { id: 5, name: t('chatApp.items.5.name'), msg: t('chatApp.items.5.message'), time: t('chatApp.time.two_days_ago'), unread: 0, isGroup: false, avatar: '😠' }
    ], [t]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {chats.map(chat => (
                <div key={chat.id} className="flex items-center gap-3 p-3 border-b border-slate-100 hover:bg-white cursor-pointer transition">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-2xl relative">
                        {chat.avatar}
                        {chat.isGroup && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                <Users size={12} className="text-slate-500" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm text-slate-800 truncate">{chat.name}</h3>
                            <span className="text-[10px] text-slate-400">{chat.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{chat.msg}</p>
                    </div>
                    {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                            {chat.unread}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatApp;
