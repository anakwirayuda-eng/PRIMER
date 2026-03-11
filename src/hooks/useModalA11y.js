/**
 * @reflection
 * [IDENTITY]: useModalA11y
 * [PURPOSE]: Custom hook providing focus trapping, Escape-to-close, and focus restoration for modals.
 * [STATE]: Stable
 * [ANCHOR]: useModalA11y
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Provides focus trap, Escape-to-close, and focus restoration for modal dialogs.
 *
 * @param {Function|null} onClose - Callback to close the modal. Pass null to disable Escape-to-close.
 * @returns {React.RefObject} ref - Attach this to the modal's content panel element.
 *
 * @example
 * function MyModal({ onClose }) {
 *     const modalRef = useModalA11y(onClose);
 *     return (
 *         <div className="overlay">
 *             <div ref={modalRef} role="dialog" aria-modal="true">
 *                 ...
 *             </div>
 *         </div>
 *     );
 * }
 */
export default function useModalA11y(onClose) {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Stable reference to onClose
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Handle Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && onCloseRef.current) {
            e.preventDefault();
            e.stopPropagation();
            onCloseRef.current();
            return;
        }

        // Focus trap: intercept Tab / Shift+Tab
        if (e.key === 'Tab' && modalRef.current) {
            const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }, []);

    useEffect(() => {
        // Save the element that had focus before the modal opened
        previousFocusRef.current = document.activeElement;

        // Focus the first focusable element inside the modal
        const timer = setTimeout(() => {
            if (modalRef.current) {
                const focusable = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
                if (focusable.length > 0) {
                    focusable[0].focus();
                } else {
                    // If no focusable children, make the panel itself focusable
                    modalRef.current.setAttribute('tabindex', '-1');
                    modalRef.current.focus();
                }
            }
        }, 50); // Small delay to ensure DOM is painted

        // Attach keydown listener
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);

            // Restore focus to the element that opened the modal
            if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
                previousFocusRef.current.focus();
            }
        };
    }, [handleKeyDown]);

    return modalRef;
}
