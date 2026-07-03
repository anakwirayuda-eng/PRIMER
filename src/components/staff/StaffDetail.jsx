/**
 * @reflection
 * [IDENTITY]: StaffDetail
 * [PURPOSE]: Detailed panel for a selected staff member, showing effects and management actions.
 * [STATE]: Experimental
 * [ANCHOR]: StaffDetail
 * [DEPENDS_ON]: ThemeContext
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

const StaffDetail = ({ staff, isHired, isLocked, playerLevel: _playerLevel, onHire, onFire, isDark }) => {
    const { t } = useTranslation();
    const staffName = t(`staffData.${staff.id}.name`, { defaultValue: staff.name });
    const staffType = t(`staffData.${staff.id}.type`, { defaultValue: staff.type });
    const description = t(`staffData.${staff.id}.description`, { defaultValue: staff.description });
    const effectLabel = (key) => t(`staffPage.effects.${key}`, {
        defaultValue: key.replace(/([A-Z])/g, ' $1')
    });

    return (
        <div className={`w-80 p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} sticky top-0`}>
            <div className="text-center mb-4">
                <div className="text-5xl mb-2">{staff.icon}</div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {staffName}
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {staffType}
                </p>
            </div>

            <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {description}
            </p>

            <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {t('staffPage.detail.effectsTitle')}
                </h4>
                {Object.entries(staff.effects).map(([key, val]) => (
                    <div key={key} className={`flex justify-between text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="capitalize">{effectLabel(key)}</span>
                        <span className={val > 0 ? 'text-green-500' : 'text-red-500'}>
                            {typeof val === 'boolean' ? 'OK' : (val > 0 ? '+' : '')}{typeof val === 'number' ? val + '%' : ''}
                        </span>
                    </div>
                ))}
            </div>

            <div className={`text-center p-3 rounded-lg mb-4 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                <p className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{t('staffPage.detail.monthlySalary')}</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Rp {staff.salary.toLocaleString()}
                </p>
                {!isHired && (
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('staffPage.detail.recruitCost', { cost: (staff.salary * 3).toLocaleString() })}
                    </p>
                )}
            </div>

            {isHired ? (
                <button
                    onClick={() => onFire(staff.id)}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                    aria-label={t('staffPage.detail.fireAria', { name: staffName })}
                >
                    {t('staffPage.detail.fire')}
                </button>
            ) : (
                <button
                    onClick={() => onHire(staff)}
                    disabled={isLocked}
                    aria-label={!isLocked
                        ? t('staffPage.detail.hireAria', { name: staffName })
                        : t('staffPage.detail.needLevelAria', { level: staff.unlockLevel })}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${!isLocked
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {!isLocked ? t('staffPage.detail.hire') : t('staffPage.detail.needLevel', { level: staff.unlockLevel })}
                </button>
            )}
        </div>
    );
};

export default StaffDetail;
