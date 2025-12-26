import { memo } from 'react';
import type { Player } from '../../store/gameStore';

interface ScoringButtonsProps {
    playerLevel?: Player['level'];
    isFouledOut: boolean;
    onScore: (type: 'make' | 'miss', points: 1 | 2 | 3, e: React.MouseEvent | React.TouchEvent) => void;
}

const SHOT_TYPES = [
    { val: 1 as const, label: 'Lancer Franc', short: '1 PT', color: 'var(--color-neon-blue)' },
    { val: 2 as const, label: 'Tir', short: '2 PTS', color: 'var(--color-neon-green)' },
    { val: 3 as const, label: '3 Points', short: '3 PTS', color: 'var(--color-neon-orange)' }
];

const ScoringButtons = memo(({ playerLevel, isFouledOut, onScore }: ScoringButtonsProps) => {
    const visibleShots = SHOT_TYPES.filter(shot => {
        // U11 Rule: No 3 Pointers
        if (playerLevel === 'U11' && shot.val === 3) return false;
        return true;
    });

    return (
        <div className="grid grid-rows-3 gap-2 shrink-0">
            {visibleShots.map((shot) => (
                <div key={shot.val} className="flex gap-2 h-full">
                    {/* SCORED BUTTON */}
                    <button
                        onClick={(e) => !isFouledOut && onScore('make', shot.val, e)}
                        disabled={isFouledOut}
                        className="flex-[2] rounded-xl flex items-center justify-between px-4 relative overflow-hidden active:scale-[0.98] transition-all border border-[var(--color-glass-border)] disabled:opacity-50"
                        style={{
                            background: `linear-gradient(90deg, ${shot.color}15 0%, transparent 100%)`,
                            borderColor: `${shot.color}30`
                        }}
                    >
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-black text-2xl text-[var(--color-text)] drop-shadow-md">MARQUÉ</span>
                            <span className="text-xs font-bold uppercase opacity-80 text-[var(--color-text-dim)]">{shot.label}</span>
                        </div>
                        <span className="font-black text-3xl tabular-nums drop-shadow-md" style={{ color: shot.color }}>+{shot.val}</span>
                    </button>

                    {/* MISSED BUTTON */}
                    <button
                        onClick={(e) => !isFouledOut && onScore('miss', shot.val, e)}
                        disabled={isFouledOut}
                        className="flex-1 rounded-xl flex flex-col items-center justify-center bg-red-500/10 border border-red-500/20 active:scale-[0.98] transition-all hover:bg-red-500/20 disabled:opacity-50"
                    >
                        <span className="text-xl font-bold text-red-500">MISS</span>
                        <span className="text-[9px] uppercase text-red-400/60 font-medium">Manqué</span>
                    </button>
                </div>
            ))}
        </div>
    );
});

ScoringButtons.displayName = 'ScoringButtons';

export default ScoringButtons;
