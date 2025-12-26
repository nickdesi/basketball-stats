import { memo } from 'react';
import { GripHorizontal, BarChart3 } from 'lucide-react';
import type { Player } from '../../store/gameStore';

interface MatchHeaderProps {
    totalPoints: number;
    activePlayer?: Player;
    viewMode: 'input' | 'stats';
    onViewModeChange: (mode: 'input' | 'stats') => void;
    evaluation?: number;
}

const MatchHeader = memo(({ totalPoints, activePlayer, viewMode, onViewModeChange, evaluation }: MatchHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-3 floating-island rounded-2xl mb-2 shrink-0">
            <div className="flex items-center gap-4">
                {/* Score */}
                <div className="flex items-center gap-2">
                    <div className="font-stats text-4xl text-[var(--color-neon-blue)] leading-none">
                        {totalPoints}
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="label-stat">Points</span>
                        <span className="text-xs font-bold truncate max-w-[100px] text-[var(--color-text)]">
                            {activePlayer?.name}
                            <span className="ml-1 text-[var(--color-neon-blue)] opacity-70 text-[10px]">
                                {activePlayer?.level || '(N/A)'}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Evaluation Badge */}
                {evaluation !== undefined && (
                    <div className="flex items-center gap-2 border-l border-[var(--color-glass-border)] pl-4">
                        <div className="font-stats text-3xl text-[var(--color-neon-orange)] leading-none">
                            {evaluation}
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="label-stat">EVAL</span>
                            <span className="text-[9px] opacity-60 text-[var(--color-text-muted)]">PIR</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex bg-[var(--color-card)] rounded-full p-1.5 border border-[var(--color-glass-border)] gap-1">
                <button
                    onClick={() => onViewModeChange('input')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'input' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-[var(--color-bg-elevated)]'}`}
                >
                    <GripHorizontal size={18} />
                </button>
                <button
                    onClick={() => onViewModeChange('stats')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'stats' ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm' : 'text-[var(--color-text-dim)] hover:bg-[var(--color-bg-elevated)]'}`}
                >
                    <BarChart3 size={18} />
                </button>
            </div>
        </div>
    );
});

MatchHeader.displayName = 'MatchHeader';

export default MatchHeader;
