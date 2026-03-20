/**
 * @reflection
 * [IDENTITY]: LeaderboardPanel
 * [PURPOSE]: Real-time leaderboard display with live ranking updates.
 * [STATE]: Production
 * [ANCHOR]: LEADERBOARD_PANEL
 * [DEPENDS_ON]: LeaderboardService
 * [LAST_UPDATE]: 2026-03-20
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardService } from '../services/LeaderboardService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];
const ACCREDITATION_COLORS = {
    Dasar: '#94a3b8',
    Madya: '#10b981',
    Utama: '#3b82f6',
    Paripurna: '#f59e0b',
};

const LeaderboardPanel = ({ isOpen, onClose }) => {
    const [entries, setEntries] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data } = await LeaderboardService.getLeaderboard();
        setEntries(data);

        const { rank } = await LeaderboardService.getMyRank();
        setMyRank(rank);

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!isOpen || !isSupabaseConfigured) return;

        fetchData();

        const unsubscribe = LeaderboardService.subscribeToLeaderboard((updated) => {
            setEntries(updated);
        });

        return unsubscribe;
    }, [isOpen, fetchData]);

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>🏆 Leaderboard</h2>
                        <p style={styles.subtitle}>
                            {myRank
                                ? `Ranking kamu: #${myRank}`
                                : 'Ranking belum tersedia'}
                        </p>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* Body */}
                {!isSupabaseConfigured ? (
                    <div style={styles.offlineMsg}>
                        📡 Leaderboard membutuhkan koneksi cloud.
                        <br />
                        Aktifkan Supabase untuk melihat ranking.
                    </div>
                ) : loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner} />
                        <p style={styles.loadingText}>Memuat ranking...</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div style={styles.emptyMsg}>
                        Belum ada data. Mulai bermain untuk masuk leaderboard!
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>#</th>
                                    <th style={{ ...styles.th, textAlign: 'left' }}>Nama</th>
                                    <th style={styles.th}>Skor</th>
                                    <th style={styles.th}>Hari</th>
                                    <th style={styles.th}>Level</th>
                                    <th style={styles.th}>Akreditasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, i) => (
                                    <tr
                                        key={entry.nim || i}
                                        style={{
                                            ...styles.row,
                                            ...(i < 3 ? styles.topRow : {}),
                                            ...(myRank === i + 1 ? styles.myRow : {}),
                                        }}
                                    >
                                        <td style={styles.rankCell}>
                                            {RANK_MEDALS[i] || (i + 1)}
                                        </td>
                                        <td style={styles.nameCell}>
                                            <div style={styles.nameText}>{entry.nama}</div>
                                            <div style={styles.nimText}>{entry.nim}</div>
                                        </td>
                                        <td style={styles.scoreCell}>
                                            {entry.score.toLocaleString()}
                                        </td>
                                        <td style={styles.cell}>{entry.day_reached}</td>
                                        <td style={styles.cell}>{entry.level}</td>
                                        <td style={styles.cell}>
                                            <span style={{
                                                ...styles.badge,
                                                color: ACCREDITATION_COLORS[entry.accreditation] || '#94a3b8',
                                                borderColor: ACCREDITATION_COLORS[entry.accreditation] || '#94a3b8',
                                            }}>
                                                {entry.accreditation}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease',
    },
    panel: {
        width: '100%',
        maxWidth: '700px',
        maxHeight: '80vh',
        borderRadius: '16px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
    },
    title: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#f8fafc',
        margin: 0,
    },
    subtitle: {
        fontSize: '13px',
        color: '#10b981',
        marginTop: '4px',
    },
    closeBtn: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1px solid rgba(148,163,184,0.2)',
        background: 'transparent',
        color: '#94a3b8',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 8px 8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '10px 12px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        position: 'sticky',
        top: 0,
        background: '#1e293b',
    },
    row: {
        transition: 'background 0.15s',
    },
    topRow: {
        background: 'rgba(16,185,129,0.05)',
    },
    myRow: {
        background: 'rgba(59,130,246,0.1)',
        boxShadow: 'inset 3px 0 0 #3b82f6',
    },
    rankCell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 700,
        color: '#e2e8f0',
    },
    nameCell: {
        padding: '12px',
    },
    nameText: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#f1f5f9',
    },
    nimText: {
        fontSize: '11px',
        color: '#64748b',
        marginTop: '2px',
    },
    scoreCell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '15px',
        fontWeight: 700,
        color: '#10b981',
    },
    cell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#cbd5e1',
    },
    badge: {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '6px',
        border: '1px solid',
        fontSize: '11px',
        fontWeight: 600,
    },
    loadingContainer: {
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    spinner: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid rgba(16,185,129,0.2)',
        borderTopColor: '#10b981',
        animation: 'spin 0.8s linear infinite',
    },
    loadingText: {
        fontSize: '13px',
        color: '#64748b',
    },
    offlineMsg: {
        padding: '32px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#94a3b8',
        lineHeight: 1.6,
    },
    emptyMsg: {
        padding: '48px 32px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748b',
    },
};

export default LeaderboardPanel;
