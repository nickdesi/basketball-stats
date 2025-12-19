import { Undo2 } from 'lucide-react';
import type { GameStats } from '../../store/gameStore';
import CounterInput from '../CounterInput';

interface StatGridProps {
    currentStats: GameStats;
    isFouledOut: boolean;
    onStat: (stat: keyof GameStats, label: string, color: string, e: React.MouseEvent | React.TouchEvent) => void;
    onDecrement: (stat: keyof GameStats) => void;
    onUndo: () => void;
    canUndo: boolean;
}

const STAT_CONFIG = [
    { key: 'offensiveRebounds' as const, label: 'Reb. OFF', animLabel: 'REB OFF', color: '#a855f7', labelTop: true },
    { key: 'defensiveRebounds' as const, label: 'Reb. DEF', animLabel: 'REB DEF', color: '#c084fc', labelTop: true },
    { key: 'assists' as const, label: 'Passe', animLabel: 'PASSE', color: '#22c55e', labelTop: true },
    { key: 'steals' as const, label: 'Intercep', animLabel: 'INTER', color: '#3b82f6', labelTop: true },
    { key: 'blocks' as const, label: 'Contre', animLabel: 'CONTRE', color: '#eab308', labelTop: false },
    { key: 'fouls' as const, label: 'Faute', animLabel: 'FAUTE', color: '#ef4444', labelTop: false },
    { key: 'turnovers' as const, label: 'Perte', animLabel: 'PERTE', color: '#f97316', labelTop: false },
];

const StatGrid = ({ currentStats, onStat, onDecrement, onUndo, canUndo }: StatGridProps) => {
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
                onClick={() => { onUndo(); if (navigator.vibrate) navigator.vibrate(50); }}
                disabled={!canUndo}
                className={`flex flex-col items-center justify-center rounded-xl border active:scale-95 transition-all ${canUndo ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-white/5 opacity-30 cursor-not-allowed'}`}
            >
                <Undo2 size={24} />
                <span className="text-[9px] font-bold uppercase mt-1">UNDO</span>
            </button>
        </div>
    );
};

export default StatGrid;
