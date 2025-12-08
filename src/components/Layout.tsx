import { LayoutDashboard, Play, Users } from 'lucide-react';

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

    const isMobileMatch = currentView === 'match';

    return (
        <div className="min-h-screen bg-[var(--color-dark-bg)] text-white font-sans selection:bg-[var(--color-neon-blue)] selection:text-black pb-20 md:pb-0">
            {/* Header - Hidden on Mobile Match View to save space */}
            <header className={`fixed top-0 left-0 w-full z-50 glass-panel border-b border-[var(--color-glass-border)] px-6 py-4 flex items-center justify-between transition-transform duration-300 ${isMobileMatch ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
                <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
                    HOOP.STATS
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-4">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-[var(--color-neon-blue)] text-black font-bold shadow-[0_0_15px_var(--color-neon-blue)]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <LayoutDashboard size={18} />
                        Tableau de Bord
                    </button>
                    <button
                        onClick={() => onNavigate('players')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'players' ? 'bg-[var(--color-neon-green)] text-black font-bold shadow-[0_0_15px_var(--color-neon-green)]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Users size={18} />
                        Joueurs
                    </button>
                    <button
                        onClick={() => onNavigate('match')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'match' ? 'bg-[var(--color-neon-purple)] text-white font-bold shadow-[0_0_15px_var(--color-neon-purple)]' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Play size={18} />
                        Nouveau Match
                    </button>
                </nav>
            </header>

            <main className={`transition-all duration-300 px-4 md:px-8 max-w-7xl mx-auto ${isMobileMatch ? 'pt-4 md:pt-24' : 'pt-24'}`}>
                {children}
            </main>

            {/* Mobile Navigation */}
            <nav className="fixed bottom-0 left-0 w-full glass-panel border-t border-[var(--color-glass-border)] p-4 flex justify-around md:hidden z-50">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'text-[var(--color-neon-blue)]' : 'text-gray-400'}`}
                >
                    <LayoutDashboard size={24} />
                    <span className="text-xs">Stats</span>
                </button>
                <button
                    onClick={() => onNavigate('players')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${currentView === 'players' ? 'text-[var(--color-neon-green)]' : 'text-gray-400'}`}
                >
                    <Users size={24} />
                    <span className="text-xs">Joueurs</span>
                </button>
                <button
                    onClick={() => onNavigate('match')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${currentView === 'match' ? 'text-[var(--color-neon-purple)]' : 'text-gray-400'}`}
                >
                    <Play size={24} />
                    <span className="text-xs">Match</span>
                </button>
            </nav>
        </div>
    );
};

export default Layout;
