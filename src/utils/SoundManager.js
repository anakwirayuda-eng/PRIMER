/**
 * @reflection
 * [IDENTITY]: SoundManager
 * [PURPOSE]: 3-channel mixer (master/BGM/SFX) + FM-synth UI SFX + Howler-backed BGM playback. Includes IEC 60601-1-8 clinical alarms, Respectful Silence sequence, diegetic EMR SFX, and environmental stingers.
 * [STATE]: Production
 * [ANCHOR]: soundManager
 * [DEPENDS_ON]: howler
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-04-26
 */

import { Howl } from 'howler';

/**
 * SoundManager — FM-synth UI SFX + Howler-backed BGM.
 * See docs/AUDIO_DESIGN.md and docs/AUDIO_DOSSIER.md for the full design.
 */
class SoundManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.initialized = false;
        this.muted = false;
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.4; // Slightly louder master

            // Simple reverb impulse response (optional, but adds "space")
            // For now, we'll just connect directly, or add a simple delay later if needed.
            this.masterGain.connect(this.context.destination);

            this.initialized = true;

            if (this.pendingBGMDay) {
                this.playBGM(this.pendingBGMDay);
                this.pendingBGMDay = null;
            }
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    // --- Core Synthesis Methods ---

    /**
     * Creates an FM synthesized sound
     * @param {number} carrierFreq - Frequency of the main tone
     * @param {number} modulatorFreq - Frequency of the modulator
     * @param {number} modIndex - Amount of modulation (richness)
     * @param {number} duration - Length of sound
     * @param {string} type - Waveform type for carrier ('sine', 'triangle', etc.)
     */
    playFMTone(carrierFreq, modulatorFreq, modIndex, duration, type = 'sine') {
        if (!this.initialized || this.muted) {
            if (!this.initialized) this.init();
            if (this.muted) return;
        }

        // Guard: If context exists but is suspended (common in autoplay blocks), try to resume or abort
        if (this.context?.state === 'suspended') {
            this.context.resume().catch(() => { });
            // Check again after simple resume attempt provided 
            // Note: If strictly suspended, we might skip this SFX to avoid queuing glitches
        }

        if (!this.context) return;

        const now = this.context.currentTime;

        // Nodes
        const carrier = this.context.createOscillator();
        const modulator = this.context.createOscillator();
        const modGain = this.context.createGain();
        const masterMsgGain = this.context.createGain();

        // Configuration
        carrier.type = type;
        carrier.frequency.setValueAtTime(carrierFreq, now);

        modulator.type = 'sine'; // Modulator is usually sine
        modulator.frequency.setValueAtTime(modulatorFreq, now);

        modGain.gain.setValueAtTime(modIndex * modulatorFreq, now); // FM depth

        // Envelope for the sound volume (Percussive envelope)
        masterMsgGain.gain.setValueAtTime(0, now);
        masterMsgGain.gain.linearRampToValueAtTime(0.5, now + 0.01); // Fast attack
        masterMsgGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay

        // Connections: Modulator -> ModGain -> Carrier.frequency
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(masterMsgGain);
        masterMsgGain.connect(this.masterGain);

        // Start/Stop
        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + duration);
        modulator.stop(now + duration);
    }

    // --- Sound Effects Palette ---

    // 1. Cursor Move: The classic "blip" or "tick" when moving selection
    // FF8 Cursor is high pitched, short, distinct. E.g. ~1000Hz - 2000Hz
    playCursor() {
        // High pitched sine/triangle with very short decay
        this.playFMTone(1200, 400, 0.5, 0.08, 'triangle');
    }

    // 2. Confirm / Junction: Characteristics "Glassy", "Chime", "Shimmer"
    // Requires high harmonic content (FM)
    playConfirm() {
        // Try to resume BGM on user interaction (safe-guarded from autoplay blocks)
        if (this.bgmAudio && !this.bgmAudio.playing() && !this.bgmStarted) {
            this.resumeBGM();
        }

        // Play two tones slightly detuned for chorus effect
        // Carrier: 880Hz (A5), Modulator: 1760Hz (2:1 Ratio -> Harmonic)
        this.playFMTone(880, 1760, 2, 0.4, 'sine');

        // Secondary tone for shimmer (slight delay)
        setTimeout(() => {
            this.playFMTone(1760, 880, 1.5, 0.3, 'sine');
        }, 50);
    }

    playClick() {
        this.playConfirm();
    }

    // 3. Cancel / Back: Lower pitch, "zip" or "woosh"
    playCancel() {
        if (!this.initialized || this.muted) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Pitch drop
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // 4. New Patient / Event: A "Draw" sound or "Scan" sound.
    // Digital rising tone
    playNotification() {
        if (!this.initialized || this.muted) return;

        // Arpeggio
        this.playFMTone(523.25, 1046, 1, 0.2, 'sine'); // C
        setTimeout(() => this.playFMTone(659.25, 1318, 1, 0.2, 'sine'), 100); // E
        setTimeout(() => this.playFMTone(783.99, 1567, 1, 0.4, 'sine'), 200); // G
    }

    // 5. Success / Level Up / Correct Referral
    // The "Fanfare" energy
    playSuccess() {
        // Major chord stab
        this.playFMTone(523.25, 523, 1.5, 0.6, 'sine');
        this.playFMTone(659.25, 659, 1.5, 0.6, 'sine');
        this.playFMTone(783.99, 783, 1.5, 0.6, 'sine');
        this.playFMTone(1046.50, 1046, 2, 0.8, 'sine'); // High C
    }

    // 6. Error / Invalid / Bad Referral
    // A disharmonic buzzer
    playError() {
        // Non-integer ratio FM produces metallic noise/clang
        this.playFMTone(150, 217, 15, 0.4, 'sawtooth');
    }

    // 7. Emergency / Danger
    // Siren-like
    playEmergency() {
        if (!this.initialized || this.muted) return;
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.5);
        osc.frequency.linearRampToValueAtTime(440, now + 1.0);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        osc.start(now);
        osc.stop(now + 1.2);
    }

    // --- BGM System (MP3 Playback) ---
    bgmAudio = null;
    bgmVolume = 0.3;
    pendingBGMDay = null;
    bgmStarted = false;
    currentTrackIndex = -1;
    isPaused = false;
    isLoading = false; // Lock to prevent double playback
    lastPlayedIndices = [];

    // --- Mixer state (3-channel + focus mode + ducking). See docs/AUDIO_DESIGN.md §3 ---
    masterVolume = 1.0;
    sfxVolume = 1.0;
    focusMode = false;
    ducked = false;  // Tunnel-vision hack: BGM @ 50% when EMR panel active

    // BGM tracks — cleared 2026-04-24 after legal audit.
    // Previously held 7 copyrighted Square Enix tracks (FF8/Chrono Cross).
    // Pending royalty-free replacement per docs/AUDIO_DESIGN.md:
    //   target 3-4 CC0 ambient soundscape (Freesound.org) — not melody.
    bgmTracks = [];

    // Build a Howl instance for BGM playback. Howler handles autoplay policy,
    // iOS audio unlock, and HTML5 streaming for large music files.
    _createBgmHowl(trackSrc) {
        return new Howl({
            src: Array.isArray(trackSrc) ? trackSrc : [trackSrc],
            loop: true,
            html5: true, // Stream — keeps BGM out of decoded buffer (avoids RAM bomb)
            volume: this._computeBgmVolume(),
            onplay: () => { this.bgmStarted = true; this.isLoading = false; },
            onplayerror: () => {
                console.debug('BGM autoplay blocked, will play on user interaction');
                this.bgmStarted = false;
                this.isLoading = false;
                // Howler emits 'unlock' on first user gesture (mobile-friendly)
                this.bgmAudio?.once('unlock', () => this.bgmAudio?.play());
            },
            onloaderror: (_id, err) => {
                console.warn('BGM load error:', trackSrc, err);
                this.isLoading = false;
            }
        });
    }

    playBGM(day) {
        if (this.muted || this.isLoading) return;
        if (this.bgmTracks.length === 0) return;

        // Calculate which track should play
        const trackIndex = (day - 1) % this.bgmTracks.length;

        // If same track is already playing, don't restart
        if (this.bgmAudio && this.currentTrackIndex === trackIndex && this.bgmAudio.playing()) {
            return;
        }

        this.isLoading = true;
        this.pendingBGMDay = day;
        this.stopBGM();

        const trackSrc = this.bgmTracks[trackIndex];
        this.currentTrackIndex = trackIndex;

        this.bgmAudio = this._createBgmHowl(trackSrc);
        this.bgmAudio.play();
    }

    // Call this when user clicks anywhere to resume BGM
    resumeBGM() {
        if (this.isPaused) {
            this.resumeFromPause();
            return;
        }
        if (this.bgmAudio && !this.bgmStarted && !this.muted && !this.bgmAudio.playing()) {
            this.bgmAudio.play();
        }
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.stop();
            this.bgmAudio.unload(); // Release Howler resources
            this.bgmAudio = null;
            this.bgmStarted = false;
            this.currentTrackIndex = -1;
            this.isPaused = false;
            this.isLoading = false;
        }
    }

    // --- Mixer helpers (3-channel routing) ---

    _clamp01(v) { return Math.max(0, Math.min(1, Number(v) || 0)); }

    _computeBgmVolume() {
        if (this.muted || this.focusMode) return 0;
        const duck = this.ducked ? 0.5 : 1;
        return this.masterVolume * this.bgmVolume * duck;
    }

    _applySfxGain() {
        if (!this.masterGain) return;
        const effective = this.muted ? 0 : this.masterVolume * this.sfxVolume * 0.4;
        this.masterGain.gain.setValueAtTime(effective, 0);
    }

    _applyBgmVolume() {
        if (this.bgmAudio) this.bgmAudio.volume(this._computeBgmVolume());
    }

    setMasterVolume(v) {
        this.masterVolume = this._clamp01(v);
        this._applySfxGain();
        this._applyBgmVolume();
    }

    setBGMVolume(v) {
        this.bgmVolume = this._clamp01(v);
        this._applyBgmVolume();
    }

    setSfxVolume(v) {
        this.sfxVolume = this._clamp01(v);
        this._applySfxGain();
    }

    setFocusMode(enabled) {
        this.focusMode = !!enabled;
        this._applyBgmVolume();
    }

    // Ducking — reduce BGM to 50% when EMR panel active (tunnel-vision sim).
    setDucked(ducked) {
        this.ducked = !!ducked;
        this._applyBgmVolume();
    }

    setMuted(muted) {
        const next = !!muted;
        if (this.muted === next) return;
        this.muted = next;
        this._applySfxGain();
        if (this.bgmAudio) {
            if (next) this.bgmAudio.pause();
            else if (!this.isPaused) this.bgmAudio.play();
        }
        this._applyBgmVolume();
    }

    // Legacy alias — single master knob
    setVolume(volume) { this.setMasterVolume(volume); }

    playRandomBGM() {
        if (this.muted || this.isLoading) return;
        if (this.bgmTracks.length === 0) return;

        this.stopBGM();
        this.isLoading = true;

        let trackIndex;
        let attempts = 0;
        do {
            trackIndex = Math.floor(Math.random() * this.bgmTracks.length);
            attempts++;
        } while (this.lastPlayedIndices.includes(trackIndex) && attempts < 10);

        this.lastPlayedIndices.push(trackIndex);
        if (this.lastPlayedIndices.length > 3) this.lastPlayedIndices.shift();

        const trackSrc = this.bgmTracks[trackIndex];
        this.currentTrackIndex = trackIndex;

        this.bgmAudio = this._createBgmHowl(trackSrc);
        this.bgmAudio.play();
    }

    pauseBGM() {
        if (this.bgmAudio && this.bgmAudio.playing()) {
            this.bgmAudio.pause();
            this.isPaused = true;
        }
    }

    resumeFromPause() {
        if (this.bgmAudio && this.isPaused && !this.muted) {
            this.bgmAudio.play();
            this.isPaused = false;
        }
    }

    // Generic resume that handles both initial autoplay block and manual pause
    tryResume() {
        this.resumeFromPause();
        if (this.bgmAudio && !this.bgmStarted && !this.muted && !this.bgmAudio.playing()) {
            this.bgmAudio.play();
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    // --- IEC 60601-1-8 Clinical Alarms (safety audio P0) ---
    // Medical device alarm standard — mahasiswa FK auto-asosiasi ICU/IGD.
    // Docs: docs/AUDIO_DESIGN.md § Kategori 1.

    _playTone(freq, duration, startTime, type = 'sine', volume = 0.5) {
        if (!this.context || !this.masterGain) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.setValueAtTime(volume, startTime + Math.max(0, duration - 0.05));
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }

    // High-priority: 2 bursts × 5 pulses @ 1 kHz, pulse 180ms, gap 120ms.
    // Use for life-threatening events: allergy violation, critical contraindication.
    playCriticalAlarm() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const now = this.context.currentTime;
        const pulse = 0.18;
        const gap = 0.12;
        const burstPause = 0.4;
        let t = now;
        for (let b = 0; b < 2; b++) {
            for (let p = 0; p < 5; p++) {
                this._playTone(1000, pulse, t, 'sine', 0.5);
                t += pulse + gap;
            }
            t += burstPause;
        }
    }

    // Medium-priority: single burst of 3 pulses @ 800 Hz.
    // Use for: wrong ICD, deterioration worsening, near-miss events.
    playMediumAlarm() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const now = this.context.currentTime;
        const pulse = 0.22;
        const gap = 0.14;
        let t = now;
        for (let p = 0; p < 3; p++) {
            this._playTone(800, pulse, t, 'sine', 0.45);
            t += pulse + gap;
        }
    }

    // Flatline tone — continuous 800 Hz sine. Used inside Respectful Silence.
    playFlatline(duration = 3) {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        this._playTone(800, duration, this.context.currentTime, 'sine', 0.35);
    }

    // Respectful Silence sequence — patient death (deterioration ≥ 100).
    // t=0..1s   fade BGM to 0
    // t=1..4s   flatline 800 Hz
    // t=4..7s   total silence (gravitas moment)
    // t=7s      resume BGM at 30% of effective volume
    // See docs/AUDIO_DESIGN.md § Kategori 3.
    playRespectfulSilence() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;

        // Stage 1 — fade BGM to 0 over 1s via Howler's smooth fade
        if (this.bgmAudio && this.bgmAudio.playing()) {
            const startVol = this.bgmAudio.volume();
            this.bgmAudio.fade(startVol, 0, 1000);
            this.bgmAudio.once('fade', () => this.bgmAudio?.pause());
        }

        // Stage 2 — flatline at t=1s
        this._playTone(800, 3, this.context.currentTime + 1, 'sine', 0.35);

        // Stage 3+4 — silence, then resume at 30% after t=7s
        setTimeout(() => {
            if (this.bgmAudio && !this.muted && !this.focusMode) {
                this.bgmAudio.volume(this._computeBgmVolume() * 0.3);
                this.bgmAudio.play();
            }
        }, 7000);
    }

    // --- Diegetic Clinical UI SFX ---
    // FM-synth approximations — swap for field recordings when sourced.
    // Docs: docs/AUDIO_DESIGN.md § Kategori 2.

    // Paper rustle — highpass noise burst (EMR tab open).
    playPaperRustle() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const ctx = this.context;
        const now = ctx.currentTime;
        const duration = 0.28;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2200;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start(now);
        source.stop(now + duration);
    }

    // Pen scratch — bandpass noise ~1.5 kHz (writing EMR note).
    playPenScratch() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const ctx = this.context;
        const now = ctx.currentTime;
        const duration = 0.2;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start(now);
        source.stop(now + duration);
    }

    // --- Environmental Stingers (Phase 3 polish) ---
    // Docs: docs/AUDIO_DESIGN.md § Kategori 5.

    // Day start — ascending C5-E5-G5 arpeggio + high sparkle (MorningBriefing).
    playDayStart() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const now = this.context.currentTime;
        this._playTone(523.25, 0.25, now, 'sine', 0.35);           // C5
        this._playTone(659.25, 0.25, now + 0.18, 'sine', 0.35);    // E5
        this._playTone(783.99, 0.4, now + 0.36, 'sine', 0.4);      // G5
        this._playTone(1567.98, 0.5, now + 0.6, 'triangle', 0.15); // G6 sparkle
    }

    // Day end — descending G4-E4-C4 with low pad (EndOfDay debrief, twilight).
    playDayEnd() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const now = this.context.currentTime;
        this._playTone(392.00, 0.3, now, 'sine', 0.3);             // G4
        this._playTone(329.63, 0.3, now + 0.22, 'sine', 0.3);      // E4
        this._playTone(261.63, 0.7, now + 0.44, 'sine', 0.4);      // C4
        this._playTone(130.81, 1.0, now + 0.6, 'sine', 0.15);      // C3 settling pad
    }

    // Level up — gamelan-ish glissando (skill unlock, accreditation upgrade).
    // FM synth with non-integer modulator for metallic bell character.
    playLevelUp() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const ctx = this.context;
        const now = ctx.currentTime;
        const duration = 0.8;

        const osc = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + duration * 0.7); // C6

        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(440, now);
        modulator.frequency.exponentialRampToValueAtTime(1760, now + duration);

        modGain.gain.setValueAtTime(800, now);
        modGain.gain.linearRampToValueAtTime(200, now + duration);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gain.gain.setValueAtTime(0.4, now + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        modulator.connect(modGain);
        modGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(this.masterGain);

        modulator.start(now);
        osc.start(now);
        modulator.stop(now + duration);
        osc.stop(now + duration);

        // Sparkle at +400ms
        this._playTone(1975.53, 0.3, now + 0.4, 'triangle', 0.2);
    }

    // Scene enter — low woosh + high chime (navigation to new page/location).
    playSceneEnter() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const ctx = this.context;
        const now = ctx.currentTime;

        const woosh = ctx.createOscillator();
        const wooshGain = ctx.createGain();
        woosh.type = 'sine';
        woosh.frequency.setValueAtTime(200, now);
        woosh.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        wooshGain.gain.setValueAtTime(0, now);
        wooshGain.gain.linearRampToValueAtTime(0.22, now + 0.02);
        wooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        woosh.connect(wooshGain);
        wooshGain.connect(this.masterGain);
        woosh.start(now);
        woosh.stop(now + 0.35);

        // High chime at +100ms
        this._playTone(1200, 0.25, now + 0.1, 'triangle', 0.15);
    }

    // Stamp confirm — low thud + high tick (prescription sign / discharge final).
    playStampConfirm() {
        if (!this.initialized || this.muted) return;
        if (!this.context) return;
        const ctx = this.context;
        const now = ctx.currentTime;

        // Low thud 120 → 50 Hz
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(120, now);
        thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        thudGain.gain.setValueAtTime(0, now);
        thudGain.gain.linearRampToValueAtTime(0.55, now + 0.005);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        thudOsc.connect(thudGain);
        thudGain.connect(this.masterGain);
        thudOsc.start(now);
        thudOsc.stop(now + 0.22);

        // High tick @ 3 kHz
        const tickOsc = ctx.createOscillator();
        const tickGain = ctx.createGain();
        tickOsc.type = 'triangle';
        tickOsc.frequency.setValueAtTime(3000, now);
        tickGain.gain.setValueAtTime(0, now);
        tickGain.gain.linearRampToValueAtTime(0.12, now + 0.002);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        tickOsc.connect(tickGain);
        tickGain.connect(this.masterGain);
        tickOsc.start(now);
        tickOsc.stop(now + 0.06);
    }
}

const soundManager = new SoundManager();

export { soundManager };
