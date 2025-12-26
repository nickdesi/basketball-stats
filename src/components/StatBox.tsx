import { memo, useState, useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

interface StatBoxProps {
    label: string;
    value: string | number;
    subLabel?: string;
    color?: string;
    isPercent?: boolean;
    tooltip?: string;
}

const StatBox = memo(({ label, value, subLabel, color, isPercent = false, tooltip }: StatBoxProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showTooltip) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        };

        // Use mousedown and touchstart for better mobile responsiveness
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showTooltip]);

    return (
        <div
            ref={boxRef}
            className="flex flex-col items-center justify-center p-3 relative group"
            onClick={tooltip ? () => setShowTooltip(!showTooltip) : undefined}
        >
            <div className={`text-2xl font-black font-numeric tracking-tight ${isPercent ? 'flex items-baseline' : ''}`} style={{ color: color || 'var(--color-text)' }}>
                {value}
                {isPercent && <span className="text-sm ml-0.5 opacity-[0.6]">%</span>}
            </div>
            <div className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest text-center leading-tight mt-1 flex items-center gap-1">
                {label}
                {tooltip && <HelpCircle size={10} className="opacity-50" />}
            </div>
            {subLabel && <div className="text-[9px] text-[var(--color-text-dim)] font-bold uppercase">{subLabel}</div>}

            {/* Tooltip */}
            {tooltip && showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-lg shadow-xl z-50 text-xs text-[var(--color-text)] text-center animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--color-glass-border)]" />
                </div>
            )}
        </div>
    );
});

StatBox.displayName = 'StatBox';

export default StatBox;

