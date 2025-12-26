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
                    <div className="text-center py-10 text-[var(--color-text-dim)] glass-card rounded-2xl">
                        Aucun match trouvé pour ce filtre.
                    </div>
                ) : (
                    filteredHistory.slice().reverse().map((game) => {
                        const pts = game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3);
                        const player = players.find(p => p.id === game.playerId);
                        return (
                            <div
                                key={game.id}
                                onClick={() => onSelectGame(game)}
                                className="glass-card p-4 rounded-2xl cursor-pointer transition-all flex justify-between items-center group animate-float-in"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-[var(--color-bg-elevated)] group-hover:bg-[var(--color-neon-blue)]/20 transition-colors text-[var(--color-text-dim)] group-hover:text-[var(--color-neon-blue)]">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-base flex items-center gap-2 text-[var(--color-text)]">
                                            {game.opponent || "Entraînement"}
                                            <span className="text-[10px] bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded-md text-[var(--color-text-dim)] font-medium">
                                                {player?.name || 'Inconnu'}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-[var(--color-text-muted)]">{new Date(game.date).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 sm:gap-4 md:gap-6 text-center flex-shrink-0">
                                    <div className="w-10 sm:w-12 md:w-14">
                                        <div className="font-stats text-lg sm:text-xl text-[var(--color-neon-blue)]">{pts}</div>
                                        <div className="label-stat">PTS</div>
                                    </div>
                                    <div className="w-10 sm:w-12 md:w-14">
                                        <div className="font-stats text-lg sm:text-xl text-[var(--color-neon-green)]">
                                            {(game.stats.offensiveRebounds + game.stats.defensiveRebounds) || game.stats.rebounds}
                                        </div>
                                        <div className="label-stat">REB</div>
                                    </div>
                                    <div className="w-10 sm:w-12 md:w-14">
                                        <div className="font-stats text-lg sm:text-xl text-[var(--color-neon-purple)]">{game.stats.assists}</div>
                                        <div className="label-stat">PAS</div>
                                    </div>
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
