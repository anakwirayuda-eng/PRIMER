/**
 * @reflection
 * [IDENTITY]: LoginPage
 * [PURPOSE]: Email + password authentication screen for PRIMER game.
 * [STATE]: Production
 * [ANCHOR]: LOGIN_PAGE
 * [DEPENDS_ON]: AuthService
 * [LAST_UPDATE]: 2026-03-25
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AlertTriangle, HeartPulse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGE_OPTIONS } from '../config/languages.js';
import { AuthService } from '../services/AuthService';

const LOGIN_QUOTE_FALLBACKS = {
    tony_iton: {
        text: 'Your ZIP code is a better predictor of your health than your genetic code.',
        author: 'Dr. Tony Iton',
        field: 'Spatial Epidemiology'
    },
    virchow: {
        text: 'Medicine is a social science, and politics is nothing but medicine on a grand scale.',
        author: 'Rudolf Virchow',
        field: 'Father of Social Medicine, 1848'
    },
    john_snow: {
        text: 'On proceeding to the spot, I found that nearly all the deaths had taken place within a short distance of the Broad Street pump.',
        author: 'John Snow',
        field: 'Father of Epidemiology, 1854'
    },
    hippocrates: {
        text: 'Whoever wishes to investigate medicine properly should consider the seasons, the winds, the water, and the soil.',
        author: 'Hippocrates',
        field: 'Airs, Waters, and Places, 400 BC'
    },
    winslow: {
        text: 'Public health is the science and art of preventing disease, prolonging life, and promoting health through the organized efforts of society.',
        author: 'C.-E.A. Winslow',
        field: 'Definition of Public Health, 1920'
    },
    primer: {
        text: 'You cannot heal patients made sick by poverty. You have to heal the poverty first.',
        author: 'PRIMER',
        field: 'Sukamaju Village, 2026'
    }
};

const LoginPage = ({ onLoginSuccess }) => {
    const { t, i18n } = useTranslation();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [quoteFade, setQuoteFade] = useState(true);
    const readTranslation = useCallback((key, fallback) => {
        const value = t(key, { defaultValue: fallback });
        return value === key ? fallback : value;
    }, [t]);
    const primerQuotes = useMemo(
        () => Object.entries(LOGIN_QUOTE_FALLBACKS).map(([quoteId, fallback]) => ({
            text: readTranslation(`login.quotes.${quoteId}.text`, fallback.text),
            author: readTranslation(`login.quotes.${quoteId}.author`, fallback.author),
            field: readTranslation(`login.quotes.${quoteId}.field`, fallback.field)
        })),
        [readTranslation]
    );

    useEffect(() => {
        let fadeTimerId;
        const interval = setInterval(() => {
            setQuoteFade(false);
            clearTimeout(fadeTimerId);
            fadeTimerId = setTimeout(() => {
                setQuoteIndex(prev => (prev + 1) % primerQuotes.length);
                setQuoteFade(true);
            }, 500);
        }, 6000);
        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimerId);
        };
    }, [primerQuotes.length]);

    const translateError = useCallback((msg) => {
        if (!msg) return t('login.errors.generic');
        const lower = msg.toLowerCase();
        if (lower.includes('signups') && lower.includes('disabled')) return t('login.errors.signup_disabled');
        if (lower.includes('signup') && lower.includes('disabled')) return t('login.errors.signup_disabled');
        if (lower.includes('email') && lower.includes('invalid')) return t('login.errors.email_invalid');
        if (lower.includes('rate limit')) return t('login.errors.rate_limit');
        if (lower.includes('invalid login')) return t('login.errors.invalid_login');
        if (lower.includes('already registered') || lower.includes('already been registered')) return t('login.errors.already_registered');
        if (lower.includes('password') && lower.includes('6')) return t('login.errors.password_short');
        return msg;
    }, [t]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                if (!nama.trim()) {
                    setError(t('login.errors.name_required'));
                    setLoading(false);
                    return;
                }
                const { user, error: authError } = await AuthService.signUp(
                    email.trim(),
                    password,
                    nama.trim(),
                    angkatan ? parseInt(angkatan, 10) : null
                );
                if (authError) {
                    setError(translateError(authError.message));
                    setLoading(false);
                    return;
                }
                onLoginSuccess(user);
            } else {
                const { user, error: authError } = await AuthService.signIn(email.trim(), password);
                if (authError) {
                    setError(translateError(authError.message));
                    setLoading(false);
                    return;
                }
                onLoginSuccess(user);
            }
        } catch (err) {
            setError(t('login.errors.generic'));
            console.error('[Login]', err);
        } finally {
            setLoading(false);
        }
    }, [isRegister, email, password, nama, angkatan, onLoginSuccess, t, translateError]);

    const handleSkipOffline = useCallback(() => {
        onLoginSuccess(null);
    }, [onLoginSuccess]);

    const currentLanguage = i18n.resolvedLanguage || i18n.language || 'id';
    const handleLanguageChange = useCallback(async (languageId) => {
        if (languageId === currentLanguage) return;
        await i18n.changeLanguage(languageId);
    }, [currentLanguage, i18n]);

    return (
        <div style={styles.container}>
            {/* Animated background */}
            <div style={styles.bgGlow} />
            <div style={styles.bgGrid} />

            <div style={styles.card}>
                <div style={styles.languageSwitcher} aria-label={t('login.language.label')}>
                    {SUPPORTED_LANGUAGE_OPTIONS.map((language) => {
                        const isActive = currentLanguage === language.id;
                        return (
                            <button
                                key={language.id}
                                type="button"
                                onClick={() => handleLanguageChange(language.id)}
                                style={{
                                    ...styles.languageButton,
                                    ...(isActive ? styles.languageButtonActive : {})
                                }}
                                aria-pressed={isActive}
                                aria-label={t('login.language.switch_to', { language: language.label })}
                            >
                                {language.id.toUpperCase()}
                            </button>
                        );
                    })}
                </div>

                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>
                        <HeartPulse size={42} strokeWidth={2.4} />
                    </div>
                    <h1 style={styles.title}>PRIMER</h1>
                    <p style={styles.subtitle}>{t('login.subtitle')}</p>
                    <div style={{ ...styles.quoteContainer, opacity: quoteFade ? 1 : 0 }}>
                        <p style={styles.quoteText}>"{primerQuotes[quoteIndex].text}"</p>
                        <p style={styles.quoteAuthor}>- {primerQuotes[quoteIndex].author} <span style={styles.quoteField}>({primerQuotes[quoteIndex].field})</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t('login.labels.email')}</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('login.placeholders.email')}
                            required
                            autoComplete="username"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t('login.labels.password')}</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('login.placeholders.password')}
                            required
                            minLength={6}
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            style={styles.input}
                        />
                    </div>

                    {isRegister && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{t('login.labels.full_name')}</label>
                                <input
                                    id="login-nama"
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder={t('login.placeholders.full_name')}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{t('login.labels.class_year_optional')}</label>
                                <input
                                    id="login-angkatan"
                                    type="number"
                                    value={angkatan}
                                    onChange={(e) => setAngkatan(e.target.value)}
                                    placeholder={t('login.placeholders.class_year')}
                                    style={styles.input}
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <div style={styles.error}>
                            <AlertTriangle size={16} style={styles.errorIcon} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading || !email || !password}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                    >
                        {loading
                            ? t('login.actions.processing')
                            : isRegister
                                ? t('login.actions.register')
                                : t('login.actions.login')}
                    </button>
                </form>

                <button
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    style={styles.toggleLink}
                >
                    {isRegister
                        ? t('login.actions.have_account')
                        : t('login.actions.need_account')}
                </button>

                <button
                    onClick={handleSkipOffline}
                    style={styles.offlineLink}
                >
                    {t('login.actions.play_offline')}
                </button>
            </div>

            <p style={styles.footer}>
                {t('login.footer', { year: 2026 })}
            </p>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    bgGlow: {
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    bgGrid: {
        position: 'absolute',
        inset: 0,
        backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        borderRadius: '20px',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.08)',
    },
    languageSwitcher: {
        position: 'absolute',
        top: '18px',
        right: '18px',
        display: 'flex',
        gap: '6px',
        padding: '4px',
        borderRadius: '999px',
        background: 'rgba(15, 23, 42, 0.72)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
    },
    languageButton: {
        border: 'none',
        borderRadius: '999px',
        padding: '5px 9px',
        background: 'transparent',
        color: '#94a3b8',
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.08em',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
    },
    languageButtonActive: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#ecfdf5',
        boxShadow: '0 6px 18px rgba(16,185,129,0.28)',
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoIcon: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '8px',
        color: '#34d399',
    },
    title: {
        fontSize: '28px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #10b981, #06d6a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '3px',
        margin: 0,
    },
    subtitle: {
        fontSize: '13px',
        color: '#94a3b8',
        letterSpacing: '1px',
        marginTop: '4px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: 'rgba(15, 23, 42, 0.6)',
        color: '#e2e8f0',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    button: {
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
        marginTop: '8px',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
    },
    toggleLink: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        marginTop: '16px',
        padding: '8px',
        background: 'none',
        border: 'none',
        color: '#10b981',
        fontSize: '13px',
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
    },
    offlineLink: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        marginTop: '8px',
        padding: '8px',
        background: 'none',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '8px',
        color: '#94a3b8',
        fontSize: '13px',
        cursor: 'pointer',
    },
    error: {
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#fca5a5',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    errorIcon: {
        flexShrink: 0,
    },
    quoteContainer: {
        marginTop: '16px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.12)',
        transition: 'opacity 0.5s ease',
        minHeight: '72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    quoteText: {
        fontSize: '12px',
        color: '#cbd5e1',
        lineHeight: 1.5,
        margin: 0,
        fontStyle: 'italic',
    },
    quoteAuthor: {
        fontSize: '11px',
        color: '#10b981',
        marginTop: '6px',
        fontWeight: 600,
    },
    quoteField: {
        color: '#64748b',
        fontWeight: 400,
    },
    footer: {
        marginTop: '24px',
        fontSize: '11px',
        color: '#475569',
        letterSpacing: '0.5px',
    },
};

export default LoginPage;
