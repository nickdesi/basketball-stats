import { memo } from 'react';
import { History } from 'lucide-react';
import type { CompletedGame, Player } from '../store/gameStore';

import MatchCard from './MatchCard';

interface HistoryListProps {
    filteredHistory: CompletedGame[];
    players: Player[];
    onSelectGame: (game: CompletedGame, editMode?: boolean) => void;
    onDeleteGame?: (gameId: string) => void;
}

const HistoryList = memo(({ filteredHistory, players, onSelectGame, onDeleteGame }: HistoryListProps) => {
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
                        const player = players.find(p => p.id === game.playerId);
                        return (
                            <MatchCard
                                key={game.id}
                                game={game}
                                player={player}
                                onOpenDetails={onSelectGame}
                                onDelete={onDeleteGame}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
});

HistoryList.displayName = 'HistoryList';

export default HistoryList;
