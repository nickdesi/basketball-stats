import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

interface CounterInputProps {
    label: string;
    value: number;
    onIncrement: (e: React.MouseEvent) => void;
    onDecrement: (e: React.MouseEvent) => void;
    color?: string; // Hex or CSS var
    min?: number;
}

const CounterInput = React.memo(({ label, value, onIncrement, onDecrement, color = 'white', min = 0, orientation = 'vertical', labelTop = false }: CounterInputProps & { orientation?: 'vertical' | 'horizontal', labelTop?: boolean }) => {

    const handleAction = (e: React.MouseEvent, action: (e: React.MouseEvent) => void) => {
        if (navigator.vibrate) navigator.vibrate(10);
        action(e);
    };

    if (orientation === 'horizontal') {
        return (
            <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2 bg-[var(--color-bg-elevated)] rounded-full p-1 border border-[var(--color-glass-border)]">
                    <button onClick={(e) => handleAction(e, onDecrement)} disabled={value <= min} className="p-2 rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-nav-bg-hover)] active:scale-90 transition-all disabled:opacity-30">
                        <ChevronDown size={20} className="rotate-90" strokeWidth={3} />
                    </button>

                    <div className="font-numeric text-xl font-bold w-8 text-center" style={{ color }}>
                        {value}
                    </div>

                    <button onClick={(e) => handleAction(e, onIncrement)} className="p-2 rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-nav-bg-hover)] active:scale-90 transition-all">
                        <ChevronUp size={20} className="rotate-90" strokeWidth={3} />
                    </button>
                </div>
                <span className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] tracking-wider truncate max-w-[80px]">{label}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-1 group">
            {/* Top Label */}
            {labelTop && (
                <span className="text-xs font-bold uppercase text-[var(--color-text-dim)] tracking-wider text-center leading-tight max-w-[80px] mb-1">
                    {label}
                </span>
            )}

            {/* Value Circle/Display (NOW CLICKABLE FOR INCREMENT) */}
            <button
                onClick={(e) => handleAction(e, onIncrement)}
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 text-3xl font-bold font-numeric shadow-lg transition-all active:scale-90 hover:scale-105 bg-[var(--color-card)]"
                style={{
                    borderColor: color,
                    // backgroundColor: `${color}15`, // Removed to use var(--color-card) for better contrast
                    color: 'var(--color-text)', // Use theme text color instead of white
                    boxShadow: `0 0 15px ${color}30` // Glow
                }}
            >
                {value}
            </button>

            {/* Down Button (Smaller / Less prominent) */}
            <button onClick={(e) => handleAction(e, onDecrement)} disabled={value <= min} className="p-2 -mt-1 rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-text)] active:scale-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed">
                <ChevronDown size={24} strokeWidth={3} />
            </button>

            {/* Bottom Label (Default) */}
            {!labelTop && (
                <span className="text-xs font-bold uppercase text-[var(--color-text-dim)] tracking-wider text-center leading-tight max-w-[80px] mt-1">
                    {label}
                </span>
            )}
        </div>
    );
});

CounterInput.displayName = 'CounterInput';

export default CounterInput;
