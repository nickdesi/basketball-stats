import { UserCircle } from 'lucide-react';
import { useMatchRecorder } from '../hooks/useMatchRecorder';
import SessionStats from '../components/SessionStats';
import ScoringButtons from '../components/match/ScoringButtons';
import StatGrid from '../components/match/StatGrid';
import MatchHeader from '../components/match/MatchHeader';
import MatchModals from '../components/match/MatchModals';

interface MatchRecorderProps {
    onNavigate?: (view: 'dashboard' | 'match' | 'players') => void;
}

const MatchRecorder = ({ onNavigate }: MatchRecorderProps) => {
    const {
        currentStats,
        isGameActive,
        players,
        activePlayer,
        canUndo,
        undoLastAction,
        decrementStat,
        state,
        totalPoints,
        isFouledOut,
        actions,
    } = useMatchRecorder(onNavigate);

    // --- RENDER: Setup Screen ---
    if (!isGameActive) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] p-4 animate-in fade-in zoom-in">
                <div className="glass-panel p-6 rounded-3xl w-full max-w-sm space-y-6 text-center">
                    <UserCircle size={48} className="mx-auto text-[var(--color-neon-blue)]" />
                    <h2 className="text-2xl font-black">NOUVEAU MATCH</h2>
                    <select
                        value={state.selectedPlayer}
                        onChange={(e) => actions.setSelectedPlayer(e.target.value)}
                        className="w-full bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-xl p-3 font-bold text-[var(--color-text)]"
                    >
                        <option value="">Sélectionner Joueur</option>
                        {players.map((p: { id: string; name: string }) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>

                    <input
                        type="text"
                        placeholder="Nom de l'adversaire (Optionnel)"
                        value={state.opponentName}
                        onChange={(e) => actions.setOpponentName(e.target.value)}
                        className="w-full bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-xl p-3 font-bold placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-neon-blue)] text-[var(--color-text)]"
                    />

                    <button
                        onClick={actions.startMatch}
                        disabled={!state.selectedPlayer}
                        className="w-full py-4 bg-[var(--color-text)] text-[var(--color-bg)] font-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        START
                    </button>
                    {players.length === 0 && <div className="text-red-400 text-xs">Créez un joueur d'abord</div>}
                </div>
            </div>
        );
    }

    // --- RENDER: Active Match ---
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col relative overflow-hidden">
            {/* HEADER */}
            <MatchHeader
                totalPoints={totalPoints}
                activePlayer={activePlayer}
                viewMode={state.viewMode}
                onViewModeChange={actions.setViewMode}
            />

            {/* CONTENT */}
            <div className="flex-1 min-h-0 flex flex-col">
                {state.viewMode === 'stats' ? (
                    <div className="overflow-y-auto p-2">
                        <SessionStats stats={currentStats} playerLevel={activePlayer?.level} />
                    </div>
                ) : (
                    <div className="flex flex-col h-full p-2 gap-4">
                        {/* SCORING SECTION */}
                        <ScoringButtons
                            playerLevel={activePlayer?.level}
                            isFouledOut={isFouledOut}
                            onScore={actions.handleScore}
                        />

                        {/* STATS GRID */}
                        <StatGrid
                            currentStats={currentStats}
                            isFouledOut={isFouledOut}
                            onStat={actions.handleStat}
                            onDecrement={decrementStat}
                            onUndo={undoLastAction}
                            canUndo={canUndo()}
                        />
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex gap-2 mt-2 shrink-0">
                <button
                    onClick={() => actions.setShowResetConfirm(true)}
                    className="px-4 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-glass-border)] text-xs font-bold text-[var(--color-text-dim)] hover:bg-[var(--color-bg)] transition-colors"
                    title="Réinitialiser le match"
                >
                    RESET
                </button>
                <button
                    onClick={() => actions.setShowEndMatchConfirm(true)}
                    className="flex-1 py-3 rounded-xl bg-[var(--color-neon-blue)] text-black text-sm font-black hover:brightness-110 transition-all shadow-lg shadow-blue-500/20"
                >
                    TERMINER LE MATCH
                </button>
            </div>

            {/* ANIMATIONS LAYER */}
            {state.animations.map(anim => (
                <div
                    key={anim.id}
                    className="fixed pointer-events-none z-[100] animate-arcade-pop font-black text-4xl tracking-tighter stroke-black"
                    style={{
                        left: anim.x,
                        top: anim.y,
                        color: anim.color,
                        '--rot': `${anim.rot}deg`,
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(255,255,255,0.2)'
                    } as React.CSSProperties}
                >
                    {anim.text}
                </div>
            ))}

            {/* MODALS */}
            <MatchModals
                showFoulConfirm={state.showFoulConfirm}
                showEndMatchConfirm={state.showEndMatchConfirm}
                showResetConfirm={state.showResetConfirm}
                onFoulConfirm={actions.confirmFoulOut}
                onFoulCancel={() => actions.setShowFoulConfirm(false)}
                onEndMatchConfirm={actions.handleConfirmFinish}
                onEndMatchCancel={() => actions.setShowEndMatchConfirm(false)}
                onResetConfirm={actions.handleReset}
                onResetCancel={() => actions.setShowResetConfirm(false)}
            />
        </div>
    );
};

export default MatchRecorder;
