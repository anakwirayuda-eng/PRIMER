/**
 * @reflection
 * [IDENTITY]: LoginPage
 * [PURPOSE]: NIM + password authentication screen for PRIMER game.
 * [STATE]: Production
 * [ANCHOR]: LOGIN_PAGE
 * [DEPENDS_ON]: AuthService
 * [LAST_UPDATE]: 2026-03-20
 */

import React, { useState, useCallback } from 'react';
import { AuthService } from '../services/AuthService';

const LoginPage = ({ onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Translate Supabase email errors to NIM-friendly messages
    const translateError = (msg) => {
        if (!msg) return 'Terjadi kesalahan. Coba lagi.';
        const lower = msg.toLowerCase();
        if (lower.includes('email') && lower.includes('invalid')) return 'NIM tidak valid. Gunakan angka saja.';
        if (lower.includes('rate limit')) return 'Terlalu banyak percobaan. Tunggu 2-3 menit.';
        if (lower.includes('invalid login')) return 'NIM atau password salah.';
        if (lower.includes('already registered') || lower.includes('already been registered')) return 'NIM sudah terdaftar. Silakan login.';
        if (lower.includes('password') && lower.includes('6')) return 'Password minimal 6 karakter.';
        if (lower.includes('email')) return 'NIM tidak valid.'; // catch-all for any email leak
        return msg;
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                if (!nama.trim()) {
                    setError('Nama harus diisi.');
                    setLoading(false);
                    return;
                }
                const { user, error: authError } = await AuthService.signUp(
                    nim.trim(),
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
                const { user, error: authError } = await AuthService.signIn(nim.trim(), password);
                if (authError) {
                    setError(translateError(authError.message));
                    setLoading(false);
                    return;
                }
                onLoginSuccess(user);
            }
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
            console.error('[Login]', err);
        } finally {
            setLoading(false);
        }
    }, [isRegister, nim, password, nama, angkatan, onLoginSuccess]);

    const handleSkipOffline = useCallback(() => {
        onLoginSuccess(null);
    }, [onLoginSuccess]);

    return (
        <div style={styles.container}>
            {/* Animated background */}
            <div style={styles.bgGlow} />
            <div style={styles.bgGrid} />

            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>🏥</div>
                    <h1 style={styles.title}>PRIMER</h1>
                    <p style={styles.subtitle}>Primary Care Simulator</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>NIM</label>
                        <input
                            id="login-nim"
                            type="text"
                            value={nim}
                            onChange={(e) => setNim(e.target.value)}
                            placeholder="Masukkan NIM"
                            required
                            autoComplete="username"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                            minLength={6}
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            style={styles.input}
                        />
                    </div>

                    {isRegister && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nama Lengkap</label>
                                <input
                                    id="login-nama"
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Nama lengkap"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Angkatan (opsional)</label>
                                <input
                                    id="login-angkatan"
                                    type="number"
                                    value={angkatan}
                                    onChange={(e) => setAngkatan(e.target.value)}
                                    placeholder="2023"
                                    style={styles.input}
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <div style={styles.error}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading || !nim || !password}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                    >
                        {loading
                            ? '⏳ Memproses...'
                            : isRegister
                                ? '📝 Daftar'
                                : '🎮 Masuk'}
                    </button>
                </form>

                <button
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    style={styles.toggleLink}
                >
                    {isRegister
                        ? 'Sudah punya akun? Masuk di sini'
                        : 'Belum punya akun? Daftar di sini'}
                </button>

                <button
                    onClick={handleSkipOffline}
                    style={styles.offlineLink}
                >
                    ⚡ Main Offline (tanpa cloud save)
                </button>
            </div>

            <p style={styles.footer}>
                PRIMER © 2026 — Medical Education Simulator
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
    logoContainer: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoIcon: {
        fontSize: '48px',
        marginBottom: '8px',
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
    },
    footer: {
        marginTop: '24px',
        fontSize: '11px',
        color: '#475569',
        letterSpacing: '0.5px',
    },
};

export default LoginPage;
