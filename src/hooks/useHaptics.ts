import { useCallback } from 'react';

/**
 * Hook for haptic feedback on mobile devices.
 * Falls back gracefully on desktop (no-op).
 */
export const useHaptics = () => {
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

    const lightHaptic = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(10);
        }
    }, [isSupported]);

    const mediumHaptic = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(25);
        }
    }, [isSupported]);

    const heavyHaptic = useCallback(() => {
        if (isSupported) {
            navigator.vibrate(50);
        }
    }, [isSupported]);

    const successHaptic = useCallback(() => {
        if (isSupported) {
            // Double pulse pattern for success
            navigator.vibrate([15, 50, 30]);
        }
    }, [isSupported]);

    const errorHaptic = useCallback(() => {
        if (isSupported) {
            // Triple short pulse for error
            navigator.vibrate([50, 30, 50, 30, 50]);
        }
    }, [isSupported]);

    return {
        isSupported,
        lightHaptic,
        mediumHaptic,
        heavyHaptic,
        successHaptic,
        errorHaptic,
    };
};

export default useHaptics;
