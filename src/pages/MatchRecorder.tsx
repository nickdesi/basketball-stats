import { useState } from 'react';
import { useGameStore, type GameStats } from '../store/gameStore';
import { UserCircle, GripHorizontal, BarChart3, Undo2 } from 'lucide-react';
import SessionStats from '../components/SessionStats';
import CounterInput from '../components/CounterInput';

interface MatchRecorderProps {
    onNavigate?: (view: 'dashboard' | 'match' | 'players') => void;
}

const MatchRecorder = ({ onNavigate }: MatchRecorderProps) => {
    const {
        currentStats,
        isGameActive,
        players,
        activePlayerId,
        setupGame,
        startGame,
        incrementStat,
        decrementStat,
        finishGame,
        resetGame
    } = useGameStore();

    const [viewMode, setViewMode] = useState<'input' | 'stats'>('input');
    const [animations, setAnimations] = useState<{ id: string, text: string, x: number, y: number, color: string, rot: number }[]>([]);

    // Setup selection
    const activePlayer = players.find(p => p.id === activePlayerId);
    const [selectedPlayer, setSelectedPlayer] = useState<string>(activePlayerId || '');
    const [opponentName, setOpponentName] = useState('');

    const isFouledOut = currentStats.fouls >= 5;

    // --- ANIMATION LOGIC ---
    const triggerAnimation = (e: React.MouseEvent | React.TouchEvent, text: string, color: string) => {
        // Get coordinates - handle both touch and mouse
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const id = Date.now().toString() + Math.random();
        const rot = (Math.random() - 0.5) * 30; // Tilt
        setAnimations(prev => [...prev, { id, text, x: clientX, y: clientY, color, rot }]);

        // Vibration
        if (navigator.vibrate) navigator.vibrate(50);

        // Cleanup
        setTimeout(() => {
            setAnimations(prev => prev.filter(a => a.id !== id));
        }, 800);
    };

    // --- ACTIONS ---

    // Scoring logic
    const handleScore = (type: 'make' | 'miss', points: 1 | 2 | 3, e: React.MouseEvent | React.TouchEvent) => {
        if (isFouledOut) return;

        if (type === 'make') {
            incrementStat(`points${points}` as keyof GameStats);
            triggerAnimation(e, `+ ${points}`, 'var(--color-neon-green)');
        } else {
            incrementStat(`missedPoints${points}` as keyof GameStats);
            // Also log missed free throw specifically if needed, but missedPoints1 covers it
            triggerAnimation(e, 'MISS', 'var(--color-neon-red)');
        }
    };

    const [showFoulConfirm, setShowFoulConfirm] = useState(false);

    // Stat logic
    const handleStat = (stat: keyof GameStats, label: string, color: string, e: React.MouseEvent | React.TouchEvent) => {
        if (isFouledOut && stat !== 'fouls') return;

        // Check for 5th foul
        if (stat === 'fouls' && currentStats.fouls === 4) {
            setShowFoulConfirm(true);
            return;
        }

        incrementStat(stat);
        triggerAnimation(e, label, color);
    };

    const confirmFoulOut = () => {
        incrementStat('fouls');
        setShowFoulConfirm(false);
        // Ensure finishGame is called and redirection happens
        handleConfirmFinish();
    };

    const [isCorrectionMode, setIsCorrectionMode] = useState(false);
    const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);

    const handleConfirmFinish = () => {
        finishGame();
        setShowEndMatchConfirm(false);
        if (onNavigate) {
            onNavigate('dashboard');
        }
    };


    const totalPoints = (currentStats.points1 * 1) + (currentStats.points2 * 2) + (currentStats.points3 * 3);


    // --- RENDER ---
    if (!isGameActive) {
        // (Keep Setup Screen mostly same but ensure no scroll)
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] p-4 animate-in fade-in zoom-in">
                <div className="glass-panel p-6 rounded-3xl w-full max-w-sm space-y-6 text-center">
                    <UserCircle size={48} className="mx-auto text-[var(--color-neon-blue)]" />
                    <h2 className="text-2xl font-black">NOUVEAU MATCH</h2>
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        className="w-full bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-xl p-3 font-bold text-[var(--color-text)]"
                    >
                        <option value="">Sélectionner Joueur</option>
                        {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>

                    <input
                        type="text"
                        placeholder="Nom de l'adversaire (Optionnel)"
                        value={opponentName}
                        onChange={(e) => setOpponentName(e.target.value)}
                        className="w-full bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-xl p-3 font-bold placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-neon-blue)] text-[var(--color-text)]"
                    />

                    <button
                        onClick={() => { setupGame(selectedPlayer, opponentName || 'Opponent'); startGame(); }}
                        disabled={!selectedPlayer}
                        className="w-full py-4 bg-[var(--color-text)] text-[var(--color-bg)] font-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        START
                    </button>
                    {players.length === 0 && <div className="text-red-400 text-xs">Créez un joueur d'abord</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col relative overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between p-2 glass-panel rounded-b-2xl mb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="font-numeric text-3xl font-black text-[var(--color-neon-blue)] leading-none">
                        {totalPoints}
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xs text-[var(--color-text-dim)] font-bold uppercase">Points</span>
                        <span className="text-xs font-bold truncate max-w-[100px]">
                            {activePlayer?.name}
                            <span className="ml-1 text-[var(--color-neon-blue)] opacity-70 text-[10px]">
                                {activePlayer?.level || '(N/A)'}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="flex bg-[var(--color-card)] rounded-full p-1.5 border border-[var(--color-glass-border)] gap-1">
                    <button onClick={() => setViewMode('input')} className={`p-2 rounded-full transition-all ${viewMode === 'input' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-white/5'} `}><GripHorizontal size={18} /></button>
                    <button onClick={() => setViewMode('stats')} className={`p-2 rounded-full transition-all ${viewMode === 'stats' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-white/5'} `}><BarChart3 size={18} /></button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-h-0 flex flex-col">
                {viewMode === 'stats' ? (
                    <div className="overflow-y-auto p-2"><SessionStats stats={currentStats} playerLevel={activePlayer?.level} /></div>
                ) : (
                    <div className="flex flex-col h-full p-2 gap-4">

                        {/* SCORING SECTION - Split by Value */}
                        {/* Designed to be clearer: Left side = Make, Right side = Miss (smaller) */}
                        <div className="grid grid-rows-3 gap-2 shrink-0">
                            {[
                                { val: 1, label: 'Lancer Franc', short: '1 PT', color: 'var(--color-neon-blue)' },
                                { val: 2, label: 'Tir', short: '2 PTS', color: 'var(--color-neon-green)' },
                                { val: 3, label: '3 Points', short: '3 PTS', color: 'var(--color-neon-orange)' }
                            ].filter(shot => {
                                // U11 Rule: No 3 Pointers
                                if (activePlayer?.level === 'U11' && shot.val === 3) return false;
                                return true;
                            }).map((shot) => (
                                <div key={shot.val} className="flex gap-2 h-full">
                                    {/* SCORED BUTTON */}
                                    <button
                                        onClick={(e) => handleScore('make', shot.val as 1 | 2 | 3, e)}
                                        className="flex-[2] rounded-xl flex items-center justify-between px-4 relative overflow-hidden active:scale-[0.98] transition-all border border-[var(--color-glass-border)]"
                                        style={{ background: `linear-gradient(90deg, ${shot.color}15 0%, transparent 100%)`, borderColor: `${shot.color}30` }}
                                    >
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="font-black text-2xl text-[var(--color-text)] drop-shadow-md">MARQUÉ</span>
                                            <span className="text-xs font-bold uppercase opacity-80 text-[var(--color-text-dim)]">{shot.label}</span>
                                        </div>
                                        <span className="font-black text-3xl tabular-nums drop-shadow-md" style={{ color: shot.color }}>+{shot.val}</span>
                                    </button>

                                    {/* MISSED BUTTON */}
                                    <button
                                        onClick={(e) => handleScore('miss', shot.val as 1 | 2 | 3, e)}
                                        className="flex-1 rounded-xl flex flex-col items-center justify-center bg-red-500/10 border border-red-500/20 active:scale-[0.98] transition-all hover:bg-red-500/20"
                                    >
                                        <span className="text-xl font-bold text-red-500">MISS</span>
                                        <span className="text-[9px] uppercase text-red-400/60 font-medium">Manqué</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* STATS GRID - Corrected Layout */}
                        <div className="grid grid-cols-4 gap-2 flex-1 min-h-0 content-start">
                            {/* Rebounds */}
                            <CounterInput
                                label="Reb. OFF"
                                value={currentStats.offensiveRebounds}
                                onIncrement={(e) => handleStat('offensiveRebounds', 'REB OFF', '#a855f7', e)}
                                onDecrement={() => decrementStat('offensiveRebounds')}
                                color="#a855f7"
                                labelTop={true}
                            />
                            <CounterInput
                                label="Reb. DEF"
                                value={currentStats.defensiveRebounds}
                                onIncrement={(e) => handleStat('defensiveRebounds', 'REB DEF', '#c084fc', e)}
                                onDecrement={() => decrementStat('defensiveRebounds')}
                                color="#c084fc"
                                labelTop={true}
                            />

                            {/* Standard Stats */}
                            <CounterInput
                                label="Passe"
                                value={currentStats.assists}
                                onIncrement={(e) => handleStat('assists', 'PASSE', '#22c55e', e)}
                                onDecrement={() => decrementStat('assists')}
                                color="#22c55e"
                                labelTop={true}
                            />
                            <CounterInput
                                label="Intercep"
                                value={currentStats.steals}
                                onIncrement={(e) => handleStat('steals', 'INTER', '#3b82f6', e)}
                                onDecrement={() => decrementStat('steals')}
                                color="#3b82f6"
                                labelTop={true}
                            />
                            <CounterInput
                                label="Contre"
                                value={currentStats.blocks}
                                onIncrement={(e) => handleStat('blocks', 'CONTRE', '#eab308', e)}
                                onDecrement={() => decrementStat('blocks')}
                                color="#eab308"
                            />
                            <CounterInput
                                label="Faute"
                                value={currentStats.fouls}
                                onIncrement={(e) => handleStat('fouls', 'FAUTE', '#ef4444', e)}
                                onDecrement={() => decrementStat('fouls')}
                                color="#ef4444"
                            />
                            <CounterInput
                                label="Perte"
                                value={currentStats.turnovers}
                                onIncrement={(e) => handleStat('turnovers', 'PERTE', '#f97316', e)}
                                onDecrement={() => decrementStat('turnovers')}
                                color="#f97316"
                            />

                            {/* Empty slot or other stat? Maybe a generic Undo? */}
                            <button
                                onClick={() => { setIsCorrectionMode(!isCorrectionMode); if (navigator.vibrate) navigator.vibrate(50); }}
                                className={`flex flex-col items-center justify-center rounded-xl border active:scale-95 transition-all ${isCorrectionMode ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                            >
                                <Undo2 size={24} />
                                <span className="text-[9px] font-bold uppercase mt-1">CORR.</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="grid grid-cols-2 gap-2 mt-2 shrink-0">
                <button onClick={resetGame} className="py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-glass-border)] text-xs font-bold text-[var(--color-text-dim)] hover:bg-[var(--color-bg)] transition-colors">RESET</button>
                <button onClick={() => setShowEndMatchConfirm(true)} className="py-3 rounded-xl bg-[var(--color-text)] text-[var(--color-bg)] text-xs font-black hover:scale-[1.02] transition-transform">TERMINER</button>
            </div>

            {/* ANIMATIONS LAYER */}
            {animations.map(anim => (
                <div
                    key={anim.id}
                    className="fixed pointer-events-none z-[100] animate-arcade-pop font-black text-4xl tracking-tighter stroke-black"
                    style={{
                        left: anim.x,
                        top: anim.y,
                        color: anim.color,
                        '--rot': `${anim.rot} deg`,
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(255,255,255,0.2)'
                    } as React.CSSProperties}
                >
                    {anim.text}
                </div>
            ))}

            {/* CORRECTION OVERLAY */}
            {isCorrectionMode && (
                <div className="absolute top-0 left-0 right-0 p-1 bg-yellow-500 text-black text-[10px] font-black uppercase text-center tracking-widest z-50 animate-pulse">
                    MODE CORRECTION ACTIVÉ
                </div>
            )}

            {/* 5-FOUL CONFIRMATION MODAL */}
            {showFoulConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#1a1a1a] border border-red-500 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <span className="text-3xl font-black">5</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">5ème Faute !</h3>
                            <p className="text-gray-400 text-sm">
                                Attention, cette action va valider la 5ème faute et <span className="text-white font-bold">terminer le match</span> pour ce joueur.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => setShowFoulConfirm(false)}
                                className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={confirmFoulOut}
                                className="py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                            >
                                CONFIRMER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* END MATCH CONFIRMATION MODAL */}
            {showEndMatchConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="glass-panel rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center border-2 border-[var(--color-neon-blue)]">
                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-[var(--color-neon-blue)]">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Terminer le match ?</h3>
                            <p className="text-[var(--color-text-dim)] text-sm">
                                Les statistiques seront sauvegardées dans l'historique et vous serez redirigé vers le tableau de bord.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => setShowEndMatchConfirm(false)}
                                className="py-3 bg-[var(--color-card)] hover:bg-[var(--color-bg)] text-[var(--color-text)] font-bold rounded-xl transition-colors border border-[var(--color-glass-border)]"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={handleConfirmFinish}
                                className="py-3 bg-[var(--color-neon-blue)] hover:brightness-110 text-black font-black rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                            >
                                CONFIRMER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchRecorder;
