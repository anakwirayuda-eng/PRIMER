/**
 * @reflection
 * [IDENTITY]: SoundManager
 * [PURPOSE]: SoundManager - FF8 Junction Style Implementation Uses FM Synthesis (Frequency Modulation) to create glassy, metallic, and sci-fi UI sounds.
 * [STATE]: Experimental
 * [ANCHOR]: soundManager
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-13
 */

/**
 * SoundManager - FF8 Junction Style Implementation
 * Uses FM Synthesis (Frequency Modulation) to create glassy, metallic, and sci-fi UI sounds.
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
        if (this.bgmAudio?.paused) {
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

    // BGM track list
    bgmTracks = [
        '/audio/balamb_garden.mp3',
        '/audio/blue_fields.mp3',
        '/audio/fishermans_horizon.mp3',
        '/audio/guldove_home.mp3',
        '/audio/guldove_another.mp3',
        '/audio/arni_home.mp3',
        '/audio/arni_another.mp3'
    ];

    playBGM(day) {
        if (this.muted || this.isLoading) return;

        // Calculate which track should play
        const trackIndex = (day - 1) % this.bgmTracks.length;

        // If same track is already playing, don't restart
        if (this.bgmAudio && this.currentTrackIndex === trackIndex && !this.bgmAudio.paused) {
            return;
        }

        this.isLoading = true;

        // Store for later if autoplay is blocked
        this.pendingBGMDay = day;

        // Stop existing BGM completely
        this.stopBGM();

        const trackPath = this.bgmTracks[trackIndex];
        this.currentTrackIndex = trackIndex;

        // Create audio element for selected track
        this.bgmAudio = new Audio(trackPath);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.bgmVolume;

        // Play with promise handling for autoplay restrictions
        this.bgmAudio.play().then(() => {
            this.bgmStarted = true;
            this.isLoading = false;
        }).catch(() => {
            console.debug('BGM autoplay blocked, will play on user interaction');
            this.bgmStarted = false;
            this.isLoading = false;
        });
    }

    // Call this when user clicks anywhere to resume BGM
    resumeBGM() {
        // Case 1: Was playing and paused manually
        if (this.isPaused) {
            this.resumeFromPause();
            return;
        }

        // Case 2: Autoplay was blocked initially
        if (this.bgmAudio && !this.bgmStarted && !this.muted && this.bgmAudio.paused) {
            this.bgmAudio.play().then(() => {
                this.bgmStarted = true;
            }).catch(() => {
                console.debug('BGM still blocked');
            });
        }
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio.src = ''; // Clear source to fully release
            this.bgmAudio = null;
            this.bgmStarted = false;
            this.currentTrackIndex = -1;
            this.isPaused = false;
            this.isLoading = false; // Reset lock if force stopped
        }
    }

    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.bgmVolume;
        }
    }

    setVolume(volume) {
        // Set Master Gain (SFX)
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), 0);
        }

        // Set BGM Volume
        this.setBGMVolume(volume);
    }

    playRandomBGM() {
        if (this.muted || this.isLoading) return;

        // Cleanup existing
        this.stopBGM();
        this.isLoading = true;

        let trackIndex;
        // Keep checking random indices until we find one not in last 3 played
        let attempts = 0;
        do {
            trackIndex = Math.floor(Math.random() * this.bgmTracks.length);
            attempts++;
        } while (this.lastPlayedIndices.includes(trackIndex) && attempts < 10);

        // Update history
        this.lastPlayedIndices.push(trackIndex);
        if (this.lastPlayedIndices.length > 3) {
            this.lastPlayedIndices.shift();
        }

        const trackPath = this.bgmTracks[trackIndex];
        this.currentTrackIndex = trackIndex;

        // Create audio element
        this.bgmAudio = new Audio(trackPath);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.bgmVolume;

        // Play
        this.bgmAudio.play().then(() => {
            this.bgmStarted = true;
            this.isLoading = false;
        }).catch(() => {
            console.debug('BGM autoplay blocked');
            this.bgmStarted = false;
            this.isLoading = false;
        });
    }

    pauseBGM() {
        if (this.bgmAudio && !this.bgmAudio.paused) {
            this.bgmAudio.pause();
            this.isPaused = true;
        }
    }

    resumeFromPause() {
        if (this.bgmAudio && this.isPaused && !this.muted) {
            this.bgmAudio.play().catch(() => console.debug('Resume blocked'));
            this.isPaused = false;
        }
    }

    // Generic resume that handles both initial autoplay block and manual pause
    tryResume() {
        this.resumeFromPause();
        // Also try the initial start resume
        if (this.bgmAudio && !this.bgmStarted && !this.muted && this.bgmAudio.paused) {
            this.bgmAudio.play().then(() => {
                this.bgmStarted = true;
            }).catch(() => console.debug('Resume still blocked'));
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
            if (this.masterGain) this.masterGain.gain.cancelScheduledValues(0);
            if (this.masterGain) this.masterGain.gain.setValueAtTime(0, 0);
        } else {
            if (this.masterGain) this.masterGain.gain.setValueAtTime(0.4, 0);
        }
        return this.muted;
    }
}

const soundManager = new SoundManager();

export { soundManager };
