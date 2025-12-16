import { memo } from 'react';
import { CalendarDays, History } from 'lucide-react';
import type { CompletedGame, Player } from '../store/gameStore';

interface HistoryListProps {
    filteredHistory: CompletedGame[];
    players: Player[];
    onSelectGame: (game: CompletedGame) => void;
}

const HistoryList = memo(({ filteredHistory, players, onSelectGame }: HistoryListProps) => {
    return (
        <>
            <h3 className="text-xl font-bold mt-8 flex items-center gap-2 text-[var(--color-text)]">
                <History size={20} className="text-[var(--color-neon-blue)]" />
                Historique Récent
            </h3>

            <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-10 text-[var(--color-text-dim)] glass-panel rounded-xl">
                        Aucun match trouvé pour ce filtre.
                    </div>
                ) : (
                    filteredHistory.slice().reverse().map((game) => {
                        const pts = (game.stats.points1 * 1) + (game.stats.points2 * 2) + (game.stats.points3 * 3);
                        const player = players.find(p => p.id === game.playerId);
                        return (
                            <div
                                key={game.id}
                                onClick={() => onSelectGame(game)}
                                className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] hover:border-[var(--color-neon-blue)] hover:bg-[var(--color-bg)]/50 cursor-pointer transition-all flex justify-between items-center group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-[var(--color-bg)] group-hover:bg-[var(--color-neon-blue)] group-hover:text-black transition-colors text-[var(--color-text)]">
                                        <CalendarDays size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg flex items-center gap-2 text-[var(--color-text)]">
                                            {game.opponent || "Match d'entraînement"}
                                            <span className="text-xs bg-[var(--color-bg)] px-2 py-0.5 rounded text-[var(--color-text-dim)] font-normal border border-[var(--color-glass-border)]">
                                                {player?.name || 'Inconnu'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[var(--color-text-dim)]">{new Date(game.date).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 md:gap-8 text-right">
                                    <div>
                                        <div className="text-xl font-bold font-mono text-[var(--color-neon-blue)]">{pts}</div>
                                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">PTS</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold font-mono text-[var(--color-neon-green)]">
                                        {game.stats.offensiveRebounds + game.stats.defensiveRebounds || game.stats.rebounds}
                                    </div>
                                    <div className="text-[10px] text-[var(--color-text-dim)] font-bold">REB</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold font-mono text-[var(--color-neon-purple)]">{game.stats.assists}</div>
                                    <div className="text-[10px] text-[var(--color-text-dim)] font-bold">PAS</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
});

HistoryList.displayName = 'HistoryList';

export default HistoryList;
