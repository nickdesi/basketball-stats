import { useState, useEffect } from 'react';
import { useGameStore, type GameStats } from '../store/gameStore';
import { Undo2, Save, RotateCcw, UserCircle, Play, Share2, AlertTriangle } from 'lucide-react';

const MatchRecorder = () => {
    const {
        currentStats,
        quarter,
        isGameActive,
        players,
        activePlayerId,
        activeOpponent,
        setupGame,
        startGame,
        incrementStat,
        decrementStat,
        nextQuarter,
        finishGame,
        resetGame
    } = useGameStore();

    const [lastAction, setLastAction] = useState<string | null>(null);
    const [clickEffect, setClickEffect] = useState<{ id: string, stat: string } | null>(null);

    // Setup State
    const [selectedPlayer, setSelectedPlayer] = useState<string>(activePlayerId || '');
    const [opponentName, setOpponentName] = useState('');

    const isFouledOut = currentStats.fouls >= 5;

    // Clear action message
    useEffect(() => {
        if (lastAction) {
            const timer = setTimeout(() => setLastAction(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [lastAction]);

    // Clear click effect
    useEffect(() => {
        if (clickEffect) {
            const timer = setTimeout(() => setClickEffect(null), 200);
            return () => clearTimeout(timer);
        }
    }, [clickEffect]);

    // 5 Foul Limit Check (Vibration Only, UI handles blocking)
    useEffect(() => {
        if (currentStats.fouls === 5) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
        }
    }, [currentStats.fouls]);

    const handleStart = () => {
        if (selectedPlayer) {
            setupGame(selectedPlayer, opponentName);
            startGame();
        }
    };

    const handleStat = (stat: keyof GameStats, label: string) => {
        if (isFouledOut && stat !== 'fouls') return; // Block input if fouled out (except maybe undoing fouls)

        incrementStat(stat);
        setLastAction(`${label} +1`);
        setClickEffect({ id: Date.now().toString(), stat });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleShare = async () => {
        const totalPoints = (currentStats.points1 * 1) + (currentStats.points2 * 2) + (currentStats.points3 * 3);
        const activePlayerName = players.find(p => p.id === activePlayerId)?.name || 'Joueur';

        const text = `🏀 MATCH TERMINÉ\n\n👤 ${activePlayerName}\n🆚 ${activeOpponent || 'Adversaire'}\n\n📊 STATS:\n- Points: ${totalPoints}\n- Rebonds: ${currentStats.rebounds}\n- Passes: ${currentStats.assists}\n- Interceptions: ${currentStats.steals}\n- Contres: ${currentStats.blocks}\n\n#HoopStats`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Résultat du Match',
                    text: text,
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            await navigator.clipboard.writeText(text);
            setLastAction("Stats copiées !");
        }
    };

    const handleUndo = (stat: keyof GameStats, label: string) => {
        decrementStat(stat);
        setLastAction(`Annulation: ${label}`);
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    };

    const ActionButton = ({ stat, label, colorClass, emoji }: { stat: keyof GameStats, label: string, colorClass: string, emoji: string }) => {
        const isClicked = clickEffect?.stat === stat;

        return (
            <button
                onClick={() => handleStat(stat, label)}
                onContextMenu={(e) => { e.preventDefault(); handleUndo(stat, label); }}
                disabled={isFouledOut}
                className={`
                    relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-75 touch-none select-none disabled:opacity-30 disabled:grayscale ${colorClass}
                    active:scale-90 active:brightness-125
                    ${isClicked ? 'scale-90 brightness-150 shadow-[0_0_30px_currentColor] z-10' : 'hover:scale-[1.02]'}
                `}
            >
                <div className="text-2xl mb-1 filter drop-shadow-lg transform transition-transform duration-75">{emoji}</div>
                <div className="text-3xl font-bold mb-1 leading-none">{currentStats[stat]}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">{label}</div>
            </button>
        );
    };

    const totalPoints = (currentStats.points1 * 1) + (currentStats.points2 * 2) + (currentStats.points3 * 3);
    const activePlayerName = players.find(p => p.id === activePlayerId)?.name || 'Joueur';

    // --- RENDER SETUP IF GAME NOT ACTIVE ---
    if (!isGameActive) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] animate-in fade-in zoom-in duration-300">
                <div className="glass-panel p-8 rounded-2xl border border-[var(--color-glass-border)] w-full max-w-md space-y-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-[var(--color-neon-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play size={40} className="text-[var(--color-neon-blue)] ml-1" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Configurez le Match</h2>
                        <p className="text-gray-400 text-sm">Sélectionnez un joueur pour commencer</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase font-bold">Joueur</label>
                            <select
                                value={selectedPlayer}
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none appearance-none"
                            >
                                <option value="">-- Choisir un joueur --</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (#{p.number})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase font-bold">Adversaire (Optionnel)</label>
                            <input
                                type="text"
                                value={opponentName}
                                onChange={(e) => setOpponentName(e.target.value)}
                                placeholder="Nom de l'équipe adverse"
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={!selectedPlayer}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${selectedPlayer ? 'bg-[var(--color-neon-blue)] hover:bg-blue-500 text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        LANCER LE MATCH
                    </button>

                    {players.length === 0 && (
                        <p className="text-center text-xs text-red-400">
                            ⚠️ Ajoutez d'abord un joueur dans l'onglet "Joueurs"
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- RENDER GAME RECORDER ---
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4 animate-in fade-in zoom-in duration-300 relative">

            {/* FOULED OUT OVERLAY */}
            {isFouledOut && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300 border border-red-500/50">
                    <AlertTriangle size={64} className="text-red-500 mb-4 animate-bounce" />
                    <h2 className="text-4xl font-black text-white mb-2">5 FAUTES !</h2>
                    <p className="text-gray-300 mb-8 max-w-[200px]">Le joueur est exclu. Le match est terminé pour lui.</p>

                    <button
                        onClick={() => finishGame()}
                        className="w-full py-4 bg-[var(--color-neon-green)] text-black font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-3"
                    >
                        <Save size={24} />
                        TERMINER LE MATCH
                    </button>

                    <button
                        onClick={() => handleUndo('fouls', 'Faute')}
                        className="mt-6 text-sm text-gray-400 underline hover:text-white"
                    >
                        Je me suis trompé (Annuler Faute)
                    </button>
                </div>
            )}

            {/* Header Stats */}
            <div className="flex gap-4 glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <UserCircle className="text-gray-300" size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase font-bold">{activePlayerName}</div>
                        <div className="text-xs text-[var(--color-neon-blue)] font-mono">{totalPoints} PTS</div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-xs text-gray-400">FAUTES</div>
                    <div className={`text-3xl font-bold font-mono ${isFouledOut ? 'text-red-500' : 'text-gray-200'}`}>
                        {currentStats.fouls}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <button onClick={handleShare} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-[var(--color-neon-blue)]">
                            <Share2 size={16} />
                        </button>
                        <div className="text-4xl font-bold text-[var(--color-neon-purple)] font-mono leading-none">Q{quarter}</div>
                    </div>
                    <button onClick={nextQuarter} disabled={isFouledOut} className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold uppercase transition-colors">
                        Suivant
                    </button>
                </div>
            </div>

            {/* Main Action Grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-3 flex-1">
                {/* Scoring Row */}
                <ActionButton
                    stat="points1"
                    label="1 PT"
                    emoji="🎯"
                    colorClass="bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/30 hover:bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                />
                <ActionButton
                    stat="points2"
                    label="2 PTS"
                    emoji="🏀"
                    colorClass="bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/30 hover:bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                />
                <ActionButton
                    stat="points3"
                    label="3 PTS"
                    emoji="🔥"
                    colorClass="bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/30 hover:bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                />

                {/* Core Stats Row 1 */}
                <ActionButton
                    stat="rebounds"
                    label="REBOND"
                    emoji="⛹️‍♂️"
                    colorClass="bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)]/30 hover:bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]"
                />
                <ActionButton
                    stat="assists"
                    label="PASSE D."
                    emoji="🎁"
                    colorClass="bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)]/30 hover:bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]"
                />
                <ActionButton
                    stat="steals"
                    label="INTERCEP."
                    emoji="🧤"
                    colorClass="bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)]/30 hover:bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]"
                />

                {/* Defense/Errors Row */}
                <ActionButton
                    stat="blocks"
                    label="CONTRE"
                    emoji="🧱"
                    colorClass="bg-[var(--color-neon-purple)]/10 border-[var(--color-neon-purple)]/30 hover:bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)]"
                />
                <ActionButton
                    stat="turnovers"
                    label="BALLE P."
                    emoji="🥔"
                    colorClass="bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 text-orange-500"
                />
                <ActionButton
                    stat="fouls"
                    label="FAUTE"
                    emoji="👮"
                    colorClass="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-500"
                />
            </div>

            {/* Footer Controls */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
                <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-2 py-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl font-bold active:scale-95 transition-colors"
                >
                    <RotateCcw size={18} />
                    <span className="text-sm">ANNULER</span>
                </button>
                <button
                    onClick={() => finishGame()}
                    className="flex items-center justify-center gap-2 py-3 bg-[var(--color-neon-green)]/20 border border-[var(--color-neon-green)]/30 text-[var(--color-neon-green)] rounded-xl font-bold active:scale-95 transition-colors"
                >
                    <Save size={18} />
                    <span className="text-sm">TERMINER</span>
                </button>
            </div>

            {/* Overlay Feedback */}
            {lastAction && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="glass-panel px-6 py-3 rounded-xl border border-white/20 text-2xl font-black shadow-[0_0_50px_rgba(0,0,0,0.5)] whitespace-nowrap bg-black/80 backdrop-blur-md">
                        {lastAction}
                    </div>
                </div>
            )}

            {/* Undo Hint */}
            <div className="text-center text-xs text-gray-500 mt-[-8px]">
                <Undo2 size={12} className="inline mr-1" />
                Clic droit pour annuler
            </div>
        </div>
    );
};

export default MatchRecorder;
