/**
 * @reflection
 * [IDENTITY]: InitialComplaintSelection
 * [PURPOSE]: React UI component: compact tag-pill format for initial complaint questions.
 * [STATE]: Experimental
 * [ANCHOR]: InitialComplaintSelection
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-19
 */

import React from 'react';
import { getInformantMode, getPrefix, getInitialComplaintResponse, getDoctorAcknowledgment } from '../../../game/AnamnesisEngine.js';

export default function InitialComplaintSelection({ patient, isDark, anamnesisHistory, setAnamnesisHistory, setHasAskedComplaint, updatePatient, onComplaintAsked }) {
    const infoMode = getInformantMode(patient);
    const prefix = getPrefix(patient, infoMode);

    const complaintQuestions = infoMode.isInformant && infoMode.reason === 'pediatric'
        ? [
            { id: 'complaint_1', text: `Ada keluhan apa untuk anaknya, ${prefix}?`, tag: 'Keluhan anak' },
            { id: 'complaint_2', text: `${prefix}, apa yang terjadi dengan adiknya?`, tag: 'Apa yang terjadi' },
            { id: 'complaint_3', text: `Ceritakan kondisi anak ${prefix} saat ini.`, tag: 'Kondisi saat ini' }
        ]
        : infoMode.isInformant
            ? [
                { id: 'complaint_1', text: `Ada keluhan apa, ${prefix}?`, tag: 'Keluhan' },
                { id: 'complaint_2', text: `Bisa ceritakan apa yang dirasakan beliau?`, tag: 'Apa yang dirasakan' }
            ]
            : [
                { id: 'complaint_1', text: `Apa yang bisa saya bantu, ${prefix}?`, tag: 'Ada yang bisa dibantu' },
                { id: 'complaint_2', text: `Ada keluhan apa ${prefix} hari ini?`, tag: 'Keluhan hari ini' },
                { id: 'complaint_3', text: `Bagaimana kondisi ${prefix} saat ini?`, tag: 'Kondisi saat ini' }
            ];

    return (
        <div className={`mb-2 p-1.5 border-2 rounded-lg ${isDark ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className={`text-tag mb-1.5 font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>📋 Tanyakan keluhan utama:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {complaintQuestions.map((q) => (
                    <button
                        key={q.id}
                        title={q.text}
                        onClick={() => {
                            const { response, speaker } = getInitialComplaintResponse(patient, patient.complaint);
                            const complaintEntry = {
                                text: q.text,
                                response: response,
                                id: 'initial_complaint',
                                auto: false,
                                speaker: speaker,
                                category: 'keluhan_utama'
                            };
                            const ack = getDoctorAcknowledgment(patient.complaint, patient);
                            const ackEntry = {
                                text: ack.text,
                                response: ack.response,
                                id: 'doctor_acknowledgment',
                                auto: true,
                                isAcknowledgment: true,
                                category: 'keluhan_utama'
                            };
                            const newHistory = [...anamnesisHistory, complaintEntry, ackEntry];
                            setAnamnesisHistory(newHistory);
                            setHasAskedComplaint(true);
                            updatePatient(patient.id, {
                                anamnesisState: { askedQuestions: newHistory, lastCategory: 'keluhan_utama' }
                            });
                            // BUG-2 FIX: Trigger clinical pipeline (emotion + scoring)
                            if (onComplaintAsked) onComplaintAsked(newHistory, complaintEntry);
                        }}
                        className={`px-2 py-1.5 rounded-full border-2 text-tag text-center truncate transition-all ${isDark ? 'bg-slate-800 text-emerald-400 border-emerald-900/50 hover:bg-slate-700' : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'} hover:border-emerald-500 hover:shadow-md font-medium`}
                    >
                        💬 {q.tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
