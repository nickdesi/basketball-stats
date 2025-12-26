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
    { key: 'offensiveRebounds' as const, label: 'Reb. OFF', animLabel: 'REB OFF', color: 'var(--color-neon-purple)', labelTop: true }, // was #a855f7
    { key: 'defensiveRebounds' as const, label: 'Reb. DEF', animLabel: 'REB DEF', color: 'var(--color-neon-purple)', labelTop: true }, // was #c084fc
    { key: 'assists' as const, label: 'Passe', animLabel: 'PASSE', color: 'var(--color-neon-green)', labelTop: true }, // was #22c55e
    { key: 'steals' as const, label: 'Intercep', animLabel: 'INTER', color: 'var(--color-neon-blue)', labelTop: true }, // was #3b82f6
    { key: 'blocks' as const, label: 'Contre', animLabel: 'CONTRE', color: 'var(--color-neon-orange)', labelTop: false }, // was #eab308
    { key: 'fouls' as const, label: 'Faute', animLabel: 'FAUTE', color: '#ef4444', labelTop: false }, // Keep red for faults
    { key: 'turnovers' as const, label: 'Perte', animLabel: 'PERTE', color: '#f97316', labelTop: false }, // Keep orange for turnovers
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
