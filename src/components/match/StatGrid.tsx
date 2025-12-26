import { memo } from 'react';
import { Undo2 } from 'lucide-react';
import type { GameStats } from '../../store/gameStore';
import CounterInput from '../CounterInput';
import { useHaptics } from '../../hooks/useHaptics';

interface StatGridProps {
    currentStats: GameStats;
    isFouledOut: boolean;
    onStat: (stat: keyof GameStats, label: string, color: string, e: React.MouseEvent | React.TouchEvent) => void;
    onDecrement: (stat: keyof GameStats) => void;
    onUndo: () => void;
    canUndo: boolean;
}

const STAT_CONFIG = [
    { key: 'offensiveRebounds' as const, label: 'RB OFF', animLabel: 'RB OFF', color: 'var(--color-neon-purple)', labelTop: true },
    { key: 'defensiveRebounds' as const, label: 'RB DEF', animLabel: 'RB DEF', color: 'var(--color-neon-purple)', labelTop: true },
    { key: 'assists' as const, label: 'PD', animLabel: 'PD', color: 'var(--color-neon-green)', labelTop: true },
    { key: 'steals' as const, label: 'INT', animLabel: 'INT', color: 'var(--color-neon-blue)', labelTop: true },
    { key: 'blocks' as const, label: 'CTR', animLabel: 'CTR', color: 'var(--color-neon-orange)', labelTop: false },
    { key: 'fouls' as const, label: 'Faute', animLabel: 'FAUTE', color: '#ef4444', labelTop: false }, // "Faute" is clearer than "F" for a button
    { key: 'turnovers' as const, label: 'BP', animLabel: 'BP', color: '#f97316', labelTop: false },
];

const StatGrid = memo(({ currentStats, onStat, onDecrement, onUndo, canUndo }: StatGridProps) => {
    const { mediumHaptic } = useHaptics();

    return (
        <div className="grid grid-cols-4 gap-2 flex-1 min-h-0 content-start">
            {STAT_CONFIG.map((stat) => (
                <CounterInput
                    key={stat.key}
                    label={stat.label}
                    value={currentStats[stat.key]}
                    onIncrement={(e) => onStat(stat.key, stat.animLabel, stat.color, e)}
                    onDecrement={() => onDecrement(stat.key)}
                    color={stat.color}
                    labelTop={stat.labelTop}
                />
            ))}

            {/* Undo Button */}
            <button
                onClick={() => { onUndo(); mediumHaptic(); }}
                disabled={!canUndo}
                className={`flex flex-col items-center justify-center rounded-xl border active:scale-95 transition-all ${canUndo ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-[var(--color-glass-border)] opacity-30 cursor-not-allowed'}`}
            >
                <Undo2 size={24} />
                <span className="text-[9px] font-bold uppercase mt-1">UNDO</span>
            </button>
        </div>
    );
});

StatGrid.displayName = 'StatGrid';

export default StatGrid;
