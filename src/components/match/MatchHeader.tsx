import { memo } from 'react';
import { GripHorizontal, BarChart3 } from 'lucide-react';
import type { Player } from '../../store/gameStore';

interface MatchHeaderProps {
    totalPoints: number;
    activePlayer?: Player;
    viewMode: 'input' | 'stats';
    onViewModeChange: (mode: 'input' | 'stats') => void;
    evaluation?: number;
    gameDuration: number;
    isTimerRunning: boolean;
    onToggleTimer: () => void;
}

const MatchHeader = memo(({ totalPoints, activePlayer, viewMode, onViewModeChange, evaluation, gameDuration, isTimerRunning, onToggleTimer }: MatchHeaderProps) => {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

                {/* Timer (New) */}
                <button
                    onClick={onToggleTimer}
                    className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg border transition-all ${isTimerRunning ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10' : 'border-[var(--color-text-dim)] bg-[var(--color-bg-elevated)]'}`}
                >
                    <div className={`font-stats text-xl leading-none ${isTimerRunning ? 'text-[var(--color-neon-green)]' : 'text-[var(--color-text-dim)]'}`}>
                        {formatTime(gameDuration)}
                    </div>
                    <div className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-text-dim)]">
                        {isTimerRunning ? 'EN COURS' : 'PAUSE'}
                    </div>
                </button>

                {/* Evaluation Badge */}
                {evaluation !== undefined && (
                    <div className="flex items-center gap-2 border-l border-[var(--color-glass-border)] pl-3 hidden md:flex">
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
