/**
 * @reflection
 * [IDENTITY]: OnboardingHints
 * [PURPOSE]: Floating hint panel di pojok kanan-bawah untuk mahasiswa baru
 *            (Day 1-2). Step-by-step guidance pedagogis tanpa menyembunyikan
 *            UI utama (non-blocking). Auto-dismiss saat Day > 2 atau user
 *            klik tutup.
 *
 *            Berbeda dengan tutorial modal traditional: hint ini tidak
 *            mengintervensi flow gameplay — pemain tetap bisa eksplorasi
 *            sendiri. Tujuan: kurangi cognitive load 15 menit pertama lab.
 *
 * [STATE]: Experimental
 * [ANCHOR]: OnboardingHints
 * [DEPENDS_ON]: useGame
 * [LAST_UPDATE]: 2026-04-26
 */

import React from 'react';
import { GraduationCap, ChevronRight, X } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { useGameStore } from '../store/useGameStore.js';
import { useShallow } from 'zustand/react/shallow';

const ONBOARDING_STEPS = [
    {
        day: 1,
        title: 'Selamat datang, Dokter!',
        body: 'Anda baru ditugaskan sebagai Kepala Puskesmas Sukamaju. Klik tombol Klinik di sidebar, lalu mulai memeriksa pasien pertama dari antrean poli.',
    },
    {
        day: 1,
        title: 'Anamnesis & Diagnosis',
        body: 'Lakukan anamnesis sistematis (KU-RPS-RPD-RPK-Sosial), pemeriksaan fisik, lalu pilih diagnosis ICD-10. Ingat: kasus SKDI 4A wajib dituntaskan di FKTP, jangan dirujuk.',
    },
    {
        day: 1,
        title: 'Resep & Pulangkan',
        body: 'Pilih obat dari inventaris, periksa MAIA Sidebar untuk validasi, lalu klik Pulangkan. Pasien gawat darurat bisa dirujuk via SISRUTE — tombol selalu tersedia.',
    },
    {
        day: 2,
        title: 'Buka Peta Wilayah',
        body: 'Klik tab Wilayah di sidebar. Anda akan lihat 30 keluarga RW 01-02. Klik salah satu rumah untuk melihat 12 indikator PIS-PK keluarga itu.',
    },
    {
        day: 2,
        title: 'Kunjungan Rumah',
        body: 'Pilih intervensi (Edukasi KB, Pantau Tumbuh Kembang, dll) untuk meningkatkan IKS keluarga. Posyandu & Prolanis terbuka di Hari 15 dan Hari 30.',
    },
    {
        day: 2,
        title: 'Selamat mengabdi!',
        body: 'Stase berlangsung 90 hari. Skor akhir dihitung dari 4 dimensi: Klinis, Komunitas, Manajemen, Ketahanan. Laporan bulanan akan muncul di Hari 30 & 60.',
    },
];

export default function OnboardingHints() {
    const { day } = useGame();
    const onboarding = useGameStore(useShallow((s) => s.meta?.onboarding));
    const advanceOnboardingStep = useGameStore((s) => s.metaActions?.advanceOnboardingStep);
    const dismissOnboarding = useGameStore((s) => s.metaActions?.dismissOnboarding);

    if (!onboarding || onboarding.dismissed || onboarding.enabled === false) return null;

    const currentStep = onboarding.currentStep ?? 0;
    if (currentStep >= ONBOARDING_STEPS.length) return null;

    const step = ONBOARDING_STEPS[currentStep];
    if (!step) return null;

    // Hide saat day melewati Day 2 — relevant onboarding only.
    if (day > 2) return null;

    // Hide juga kalau current step adalah Day 2 step tapi pemain masih Day 1
    // (jangan beberkan step Day 2 sebelum waktunya).
    if (step.day > day) return null;

    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
    const totalForDay = ONBOARDING_STEPS.filter((s) => s.day === day).length;
    const indexOfDay = ONBOARDING_STEPS.slice(0, currentStep + 1).filter((s) => s.day === day).length;

    return (
        <div
            className="fixed bottom-5 right-5 z-hud max-w-sm pointer-events-auto"
            data-testid="onboarding-hints"
            role="status"
            aria-live="polite"
        >
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 backdrop-blur-md">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500/15 to-transparent flex items-center gap-2 border-b border-amber-400/20">
                    <GraduationCap size={16} className="text-amber-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200">
                        Tutorial — Hari {step.day}
                    </span>
                    <span className="ml-auto text-[10px] text-white/40 tabular-nums">
                        {indexOfDay}/{totalForDay}
                    </span>
                    <button
                        type="button"
                        onClick={() => dismissOnboarding?.()}
                        className="text-white/40 hover:text-white p-0.5 -mr-1"
                        aria-label="Tutup tutorial"
                    >
                        <X size={14} />
                    </button>
                </div>
                <div className="p-4 space-y-2">
                    <h4 className="font-black text-white text-sm leading-tight">
                        {step.title}
                    </h4>
                    <p className="text-[12px] text-white/70 leading-relaxed">
                        {step.body}
                    </p>
                </div>
                <div className="px-4 pb-4 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => dismissOnboarding?.()}
                        className="text-[11px] font-bold text-white/40 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        Lewati
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (isLastStep) {
                                dismissOnboarding?.();
                            } else {
                                advanceOnboardingStep?.();
                            }
                        }}
                        className="bg-amber-500/90 hover:bg-amber-400 text-slate-900 font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                        {isLastStep ? 'Mulai Bertugas' : 'Lanjut'}
                        <ChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
