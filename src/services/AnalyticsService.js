/**
 * @reflection
 * [IDENTITY]: AnalyticsService
 * [PURPOSE]: Event tracking for triangulasi dossier and gameplay telemetry.
 * [STATE]: Production
 * [ANCHOR]: ANALYTICS_SERVICE
 * [DEPENDS_ON]: supabaseClient
 * [LAST_UPDATE]: 2026-03-20
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

let _sessionId = null;

function getSessionId() {
    if (!_sessionId) {
        _sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
    return _sessionId;
}

/** Buffer for batching analytics events */
const eventBuffer = [];
let flushTimer = null;
const FLUSH_INTERVAL_MS = 10_000; // Flush every 10 seconds
const MAX_BUFFER_SIZE = 20;

async function flushBuffer() {
    if (!isSupabaseConfigured || eventBuffer.length === 0) return;

    const batch = eventBuffer.splice(0, eventBuffer.length);

    const { error } = await supabase
        .from('analytics')
        .insert(batch);

    if (error) {
        console.warn('[Analytics] Batch insert failed:', error.message);
        // Put events back if insert failed (best-effort)
        eventBuffer.unshift(...batch);
    }
}

export const AnalyticsService = {
    /**
     * Track a gameplay event. Events are buffered and batch-inserted.
     * @param {string} eventType - e.g. 'clinical_decision', 'case_completed', 'day_ended'
     * @param {object} eventData - Arbitrary JSON payload
     */
    async trackEvent(eventType, eventData = {}) {
        if (!isSupabaseConfigured) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        eventBuffer.push({
            user_id: user.id,
            session_id: getSessionId(),
            event_type: eventType,
            event_data: eventData,
            created_at: new Date().toISOString(),
        });

        // Flush if buffer is full
        if (eventBuffer.length >= MAX_BUFFER_SIZE) {
            await flushBuffer();
        }

        // Set up periodic flush
        if (!flushTimer) {
            flushTimer = setInterval(flushBuffer, FLUSH_INTERVAL_MS);
        }
    },

    /** Pre-defined event helpers for common gameplay moments */

    trackClinicalDecision(caseId, decision, outcome) {
        return this.trackEvent('clinical_decision', { caseId, decision, outcome });
    },

    trackCaseCompleted(caseId, score, timeSpent) {
        return this.trackEvent('case_completed', { caseId, score, timeSpent });
    },

    trackDayEnded(day, stats) {
        return this.trackEvent('day_ended', { day, ...stats });
    },

    trackGameStarted() {
        return this.trackEvent('game_started', { timestamp: Date.now() });
    },

    trackGameSaved(slotId) {
        return this.trackEvent('game_saved', { slotId });
    },

    trackSkillUnlocked(skillId) {
        return this.trackEvent('skill_unlocked', { skillId });
    },

    trackAccreditationChanged(from, to) {
        return this.trackEvent('accreditation_changed', { from, to });
    },

    /**
     * Force-flush all buffered events. Call on logout/page unload.
     */
    async flush() {
        clearInterval(flushTimer);
        flushTimer = null;
        await flushBuffer();
    },

    /**
     * Reset session ID (e.g. on new game).
     */
    resetSession() {
        _sessionId = null;
    },
};

// Flush on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        AnalyticsService.flush();
    });
}
