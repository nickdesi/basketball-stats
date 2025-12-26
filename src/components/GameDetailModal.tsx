import { memo, useCallback, useState } from 'react';
import { Trash2, Share2, Download, Image } from 'lucide-react';
import type { CompletedGame, GameStats, Player } from '../store/gameStore';
import SessionStats from './SessionStats';
import ShareableStats from './ShareableStats';
import BadgeList from './badges/BadgeList';
import { calculateBadges } from './badges/badgeUtils';

interface GameDetailModalProps {
    game: CompletedGame;
    players: Player[];
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (gameId: string, stats: GameStats, date?: string, playerId?: string, opponent?: string) => void;
    initialIsEditing?: boolean;
}

const GameDetailModal = memo(({ game, players, onClose, onDelete, onUpdate, initialIsEditing = false }: GameDetailModalProps) => {
    const [isEditing, setIsEditing] = useState(initialIsEditing);

    // Pre-compute initial values for edit mode
    const getInitialDate = () => {
        const date = new Date(game.date);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    const [editStats, setEditStats] = useState<GameStats | null>(initialIsEditing ? { ...game.stats } : null);
    const [editDate, setEditDate] = useState<string>(initialIsEditing ? getInitialDate() : '');
    const [editPlayerId, setEditPlayerId] = useState<string>(initialIsEditing ? game.playerId : '');
    const [editOpponent, setEditOpponent] = useState<string>(initialIsEditing ? (game.opponent || '') : '');
    const [showShareCard, setShowShareCard] = useState(false);

    const startEditing = useCallback(() => {
        setEditStats({ ...game.stats });
        const date = new Date(game.date);
        const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setEditDate(localISOTime);
        setEditPlayerId(game.playerId);
        setEditOpponent(game.opponent || '');
        setIsEditing(true);
    }, [game]);

    const cancelEditing = () => {
        setIsEditing(false);
        setEditStats(null);
        setEditDate('');
        setEditPlayerId('');
        setEditOpponent('');
    };

    const saveEditing = useCallback(() => {
        if (editStats) {
            // Date is optional - only update if changed
            const newDate = editDate ? new Date(editDate).toISOString() : undefined;
            const newPlayerId = editPlayerId !== game.playerId ? editPlayerId : undefined;
            const newOpponent = editOpponent !== game.opponent ? editOpponent : undefined;
            onUpdate(game.id, editStats, newDate, newPlayerId, newOpponent);
            setIsEditing(false);
            setEditStats(null);
            setEditDate('');
            setEditPlayerId('');
            setEditOpponent('');
        }
    }, [editStats, editDate, editPlayerId, editOpponent, game.id, game.playerId, game.opponent, onUpdate]);

    const handleEditStatChange = useCallback((stat: string, value: number) => {
        setEditStats((prev) => {
            if (!prev) return null;
            return { ...prev, [stat]: Math.max(0, value) };
        });
    }, []);

    const handleShareGame = async () => {
        const pts = game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3);
        const reb = (game.stats.offensiveRebounds + game.stats.defensiveRebounds) || game.stats.rebounds;
        const player = players.find(p => p.id === game.playerId);

        const text = `🏀 MATCH HISTORY\n\n👤 ${player?.name || 'Joueur'}\n🆚 ${game.opponent || 'Adversaire'}\n📅 ${new Date(game.date).toLocaleDateString()}\n\n📊 STATS:\n- Points: ${pts}\n- Rebonds: ${reb}\n- Passes: ${game.stats.assists}\n- Interceptions: ${game.stats.steals}\n- Contres: ${game.stats.blocks}\n\n#HoopStats`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'Statistiques du Match', text: text });
            } catch {
                // Share cancelled
            }
        } else {
            await navigator.clipboard.writeText(text);
            alert("Résumé copié dans le presse-papier !");
        }
    };

    const handleExportGame = () => {
        const dataStr = JSON.stringify(game, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const player = players.find(p => p.id === game.playerId);
        link.download = `match-${player?.name || 'stats'}-${new Date(game.date).toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible.")) {
            onDelete(game.id);
            onClose();
        }
    };

    const player = players.find(p => p.id === game.playerId);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200" onClick={onClose}>
            <div className="bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="p-6 border-b border-[var(--color-glass-border)] bg-[var(--color-bg)]/50 flex justify-between items-start">
                    <div>
                        <div className="text-xs text-[var(--color-neon-blue)] font-bold uppercase tracking-wider mb-1">
                            {isEditing ? 'Modification du Match' : 'Détails du Match'}
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                            {game.opponent || "Match d'entraînement"}
                        </h3>
                        <div className="text-[var(--color-text-dim)] text-sm mt-1">
                            {new Date(game.date).toLocaleDateString()} • {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <>
                                <button onClick={startEditing} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[#facc15]" title="Modifier">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button onClick={handleDelete} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-[#ef4444]" title="Supprimer">
                                    <Trash2 size={20} />
                                </button>
                                <button onClick={handleShareGame} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-neon-blue)]" title="Partager texte">
                                    <Share2 size={20} />
                                </button>
                                <button onClick={() => setShowShareCard(true)} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-neon-purple)]" title="Partager image">
                                    <Image size={20} />
                                </button>
                                <button onClick={handleExportGame} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-text)]" title="Exporter JSON">
                                    <Download size={20} />
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors ml-2 text-[var(--color-text)]">
                                    <span className="text-2xl leading-none">&times;</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={cancelEditing} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors ml-2 text-[var(--color-text)]">
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm mb-4">
                                Vous modifiez les statistiques de ce match.
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Joueur</label>
                                <select
                                    value={editPlayerId}
                                    onChange={(e) => setEditPlayerId(e.target.value)}
                                    className="bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-glass-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-neon-blue)]"
                                >
                                    {players.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Adversaire</label>
                                <input
                                    type="text"
                                    value={editOpponent}
                                    onChange={(e) => setEditOpponent(e.target.value)}
                                    placeholder="Nom de l'équipe adverse"
                                    className="bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-glass-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-neon-blue)]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Date et Heure <span className="text-[var(--color-text-dim)]/50">(optionnel)</span></label>
                                <input
                                    type="datetime-local"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-glass-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-neon-blue)]"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(editStats || {}).map(([key, value]) => {
                                    const labels: Record<string, string> = {
                                        points1: "1 Point",
                                        points2: "2 Points",
                                        points3: "3 Points",
                                        offensiveRebounds: "RB OFF",
                                        defensiveRebounds: "RB DEF",
                                        assists: "PD",
                                        steals: "INT",
                                        blocks: "CTR",
                                        turnovers: "BP",
                                        fouls: "F"
                                    };
                                    if (!labels[key]) return null;

                                    if (player?.level === 'U11' && key === 'points3') return null;

                                    return (
                                        <div key={key} className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-glass-border)] flex flex-col items-center">
                                            <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold mb-2">{labels[key]}</label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleEditStatChange(key, (value as number) - 1)}
                                                    className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-glass-border)] hover:bg-[var(--color-glass-bg)] flex items-center justify-center text-[var(--color-text)] transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-mono font-bold w-8 text-center text-[var(--color-text)]">{value as number}</span>
                                                <button
                                                    onClick={() => handleEditStatChange(key, (value as number) + 1)}
                                                    className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-glass-border)] hover:bg-[var(--color-glass-bg)] flex items-center justify-center text-[var(--color-text)] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Score Recap */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)]">
                                <div>
                                    <div className="text-sm text-[var(--color-text-dim)] uppercase font-bold">Joueur</div>
                                    <div className="text-xl font-bold text-[var(--color-neon-blue)]">
                                        {player?.name || 'Inconnu'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black font-mono text-[var(--color-text)]">
                                        {game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3)}
                                    </div>
                                    <div className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase">Points Totaux</div>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="mb-2">
                                <BadgeList badges={calculateBadges(game.stats)} />
                            </div>

                            <SessionStats stats={game.stats} playerLevel={player?.level} />
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-[var(--color-glass-border)] bg-[var(--color-bg)]/50 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={cancelEditing} className="px-6 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-glass-border)] text-[var(--color-text)] rounded-lg font-bold transition-colors">
                                Annuler
                            </button>
                            <button onClick={saveEditing} className="px-6 py-2 bg-[var(--color-neon-green)] hover:brightness-110 text-white rounded-lg font-bold transition-colors">
                                Terminer
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-6 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-glass-border)] text-[var(--color-text)] rounded-lg font-bold transition-colors">
                            Fermer
                        </button>
                    )}
                </div>
            </div>
            {/* Shareable Stats Card */}
            {showShareCard && (
                <ShareableStats
                    game={game}
                    player={player}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </div>
    );
});

GameDetailModal.displayName = 'GameDetailModal';

export default GameDetailModal;
