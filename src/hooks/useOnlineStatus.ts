import { useState, useEffect } from 'react';

/**
 * Hook to track online/offline status.
 * Returns { isOnline: boolean }
 */
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(() => {
        // SSR safety: default to true if navigator not available
        return typeof navigator !== 'undefined' ? navigator.onLine : true;
    });

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline };
}
