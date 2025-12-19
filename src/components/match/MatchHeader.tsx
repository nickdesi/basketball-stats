import { GripHorizontal, BarChart3 } from 'lucide-react';
import type { Player } from '../../store/gameStore';

interface MatchHeaderProps {
    totalPoints: number;
    activePlayer?: Player;
    viewMode: 'input' | 'stats';
    onViewModeChange: (mode: 'input' | 'stats') => void;
}

const MatchHeader = ({ totalPoints, activePlayer, viewMode, onViewModeChange }: MatchHeaderProps) => {
    return (
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
                <button
                    onClick={() => onViewModeChange('input')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'input' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-white/5'}`}
                >
                    <GripHorizontal size={18} />
                </button>
                <button
                    onClick={() => onViewModeChange('stats')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'stats' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-white/5'}`}
                >
                    <BarChart3 size={18} />
                </button>
            </div>
        </div>
    );
};

export default MatchHeader;
