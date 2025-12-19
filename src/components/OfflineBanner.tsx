import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Displays a banner when the user is offline.
 * Auto-hides when connection is restored.
 */
const OfflineBanner = () => {
    const { isOnline } = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-black py-2 px-4 flex items-center justify-center gap-2 text-sm font-bold animate-in slide-in-from-top duration-300">
            <WifiOff size={16} />
            <span>Mode hors-ligne – Données locales</span>
        </div>
    );
};

export default OfflineBanner;
