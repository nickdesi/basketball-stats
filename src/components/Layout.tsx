import { LayoutDashboard, Play, Users, Moon, Sun, LogOut, Eye } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import OfflineBanner from './OfflineBanner';

interface LayoutProps {
    // children removed as it handles view switching internally now/or we revert to external control?
    // The previous error showed App.tsx trying to pass `currentView` and `onNavigate`.
    // BUT the Layout.tsx code I wrote *internally* manages state.
    // I should probably revert Layout to be a "dumb" wrapper if App.tsx is controlling it, OR update App.tsx to just use Layout.
    // Looking at App.tsx, it tries to control state.
    // Let's make Layout Controlled again to match App.tsx expectation OR change App.tsx.
    // Actually, simpler: App.tsx wraps everything. Layout should receive currentView and onNavigate.
    currentView: 'dashboard' | 'match' | 'players';
    onNavigate: (view: 'dashboard' | 'match' | 'players') => void;
    children: React.ReactNode;
}

const Layout = ({ currentView, onNavigate, children }: LayoutProps) => {
    const { theme, toggleTheme, contrastMode, toggleContrastMode } = useThemeStore();
    const { logout } = useAuthStore();
    const { isOnline } = useOnlineStatus();
    const isMobileMatch = currentView === 'match';

    // Banner height for offsetting fixed elements
    const bannerOffset = isOnline ? '' : 'top-10';

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-[var(--color-neon-blue)] selection:text-black pb-20 md:pb-0 transition-colors duration-300">
            {/* Offline Banner */}
            <OfflineBanner />

            {/* Header - Hidden on Mobile Match View to save space */}
            <header className={`fixed ${bannerOffset || 'top-0'} left-0 w-full z-50 glass-panel border-b border-[var(--color-glass-border)] px-6 py-4 flex items-center justify-between transition-all duration-300 ${isMobileMatch ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
                <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
                    HOOP.STATS
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-[var(--color-neon-blue)] text-white font-bold shadow-[0_0_15px_var(--color-neon-blue)]' : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)] hover:bg-[var(--color-nav-bg-hover)]'}`}
                    >
                        <LayoutDashboard size={18} />
                        Tableau de Bord
                    </button>
                    <button
                        onClick={() => onNavigate('players')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'players' ? 'bg-[var(--color-neon-green)] text-white font-bold shadow-[0_0_15px_var(--color-neon-green)]' : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)] hover:bg-[var(--color-nav-bg-hover)]'}`}
                    >
                        <Users size={18} />
                        Joueurs
                    </button>
                    <button
                        onClick={() => onNavigate('match')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'match' ? 'bg-[var(--color-neon-purple)] text-white font-bold shadow-[0_0_15px_var(--color-neon-purple)]' : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)] hover:bg-[var(--color-nav-bg-hover)]'}`}
                    >
                        <Play size={18} />
                        Nouveau Match
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)] hover:bg-[var(--color-nav-bg-hover)] transition-all"
                        aria-label="Changer de thème"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={toggleContrastMode}
                        className={`p-2 rounded-lg transition-all ${contrastMode === 'high' ? 'bg-yellow-500/20 text-yellow-400' : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)] hover:bg-[var(--color-nav-bg-hover)]'}`}
                        aria-label="Mode contraste élevé"
                        title="Mode contraste élevé (extérieur)"
                    >
                        <Eye size={20} />
                    </button>

                    <button
                        onClick={logout}
                        className="p-2 rounded-lg text-[var(--color-nav-text)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        aria-label="Déconnexion"
                        title="Déconnexion"
                    >
                        <LogOut size={20} />
                    </button>
                </nav>

                {/* Mobile Theme Toggle (Absolute Top Right if Header hidden?) or in Nav? */}
                {/* Let's put it in the header for mobile too, since header is only hidden in Match view */}
                <button
                    onClick={toggleTheme}
                    className="md:hidden p-2 text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </header>

            <main className={`transition-all duration-300 px-4 md:px-8 max-w-7xl mx-auto ${isMobileMatch ? 'pt-4 md:pt-24' : 'pt-24'} ${!isOnline ? 'mt-10' : ''}`}>
                {children}
            </main>

            {/* Mobile Navigation - Floating Island */}
            <nav className="fixed bottom-4 left-4 right-4 floating-island rounded-full flex items-center justify-around md:hidden z-50 py-2 px-1">
                {/* Left Navigation Items */}
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`flex flex-col items-center gap-0.5 p-3 rounded-full transition-all ${currentView === 'dashboard' ? 'text-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10' : 'text-[var(--color-nav-text)]'}`}
                    aria-label="Statistiques"
                >
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-medium">Stats</span>
                </button>

                <button
                    onClick={() => onNavigate('players')}
                    className={`flex flex-col items-center gap-0.5 p-3 rounded-full transition-all ${currentView === 'players' ? 'text-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10' : 'text-[var(--color-nav-text)]'}`}
                    aria-label="Joueurs"
                >
                    <Users size={22} />
                    <span className="text-[10px] font-medium">Joueurs</span>
                </button>

                {/* Central FAB - New Match */}
                <button
                    onClick={() => onNavigate('match')}
                    className={`relative -mt-8 flex items-center justify-center w-16 h-16 rounded-full transition-all ${currentView === 'match'
                        ? 'bg-[var(--color-neon-purple)] text-white shadow-[var(--glow-purple)]'
                        : 'bg-[var(--color-neon-purple)]/80 text-white animate-pulse-glow'
                        }`}
                    aria-label="Nouveau Match"
                >
                    <Play size={28} fill="currentColor" />
                </button>

                {/* Right Navigation Items */}
                <button
                    onClick={toggleContrastMode}
                    className={`flex flex-col items-center gap-0.5 p-3 rounded-full transition-all active:scale-90 ${contrastMode === 'high' ? 'text-yellow-400 bg-yellow-500/10' : 'text-[var(--color-nav-text)]'}`}
                    aria-label="Contraste"
                >
                    <Eye size={22} />
                    <span className="text-[10px] font-medium">Contraste</span>
                </button>

                <button
                    onClick={toggleTheme}
                    className="flex flex-col items-center gap-0.5 p-3 rounded-full transition-all text-[var(--color-nav-text)] active:scale-90"
                    aria-label="Thème"
                >
                    {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    <span className="text-[10px] font-medium">Thème</span>
                </button>

                <button
                    onClick={logout}
                    className="flex flex-col items-center gap-0.5 p-3 rounded-full transition-all text-[var(--color-nav-text)] active:scale-90 hover:text-red-400"
                    aria-label="Déconnexion"
                >
                    <LogOut size={22} />
                    <span className="text-[10px] font-medium">Sortir</span>
                </button>
            </nav>
        </div>
    );
};

export default Layout;
