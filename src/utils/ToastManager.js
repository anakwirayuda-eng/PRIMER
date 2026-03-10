/**
 * @reflection
 * [IDENTITY]: ToastManager
 * [PURPOSE]: Lightweight global toast/notification bus. Any module can call showToast()
 *            and any React component can subscribe via useToast() to render them.
 * [STATE]: Stable
 * [ANCHOR]: showToast, useToast
 * [DEPENDS_ON]: React
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// EVENT BUS — works outside React (hooks, engines, callbacks)
// ═══════════════════════════════════════════════════════════════

const listeners = new Set();
let _nextId = 0;

/**
 * Show a toast from anywhere (hooks, callbacks, engines).
 * @param {string} message - Text to display
 * @param {'info'|'success'|'error'|'warning'} type - Toast style
 * @param {number} [duration=3000] - Auto-dismiss in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
    const id = ++_nextId;
    const toast = { id, message, type, duration };
    listeners.forEach(fn => fn(toast));
}

/**
 * Show a confirm-style toast that resolves a promise.
 * Returns a Promise<boolean>. Renders two buttons (confirm/cancel).
 * @param {string} message - Question to ask
 * @param {'warning'|'error'} type - Toast style
 * @returns {Promise<boolean>}
 */
export function confirmToast(message, type = 'warning') {
    return new Promise(resolve => {
        const id = ++_nextId;
        const toast = { id, message, type, isConfirm: true, resolve, duration: 0 };
        listeners.forEach(fn => fn(toast));
    });
}

// ═══════════════════════════════════════════════════════════════
// REACT HOOK — subscribe to the event bus
// ═══════════════════════════════════════════════════════════════

/**
 * useToast() — React hook that subscribes to global toast events.
 * @returns {{ toasts: Array, dismissToast: Function }}
 */
export function useToast() {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    useEffect(() => {
        const handler = (toast) => {
            setToasts(prev => [...prev, toast]);
            if (toast.duration > 0) {
                timersRef.current[toast.id] = setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                    delete timersRef.current[toast.id];
                }, toast.duration);
            }
        };
        listeners.add(handler);
        return () => {
            listeners.delete(handler);
            Object.values(timersRef.current).forEach(clearTimeout);
        };
    }, []);

    const dismissToast = useCallback((id, result) => {
        setToasts(prev => {
            const toast = prev.find(t => t.id === id);
            if (toast?.isConfirm && toast.resolve) {
                toast.resolve(result);
            }
            return prev.filter(t => t.id !== id);
        });
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    return { toasts, dismissToast };
}
