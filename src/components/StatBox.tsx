import { memo } from 'react';

interface StatBoxProps {
    label: string;
    value: string | number;
    subLabel?: string;
    color?: string;
    isPercent?: boolean;
}

const StatBox = memo(({ label, value, subLabel, color, isPercent = false }: StatBoxProps) => (
    <div className="flex flex-col items-center justify-center p-3 relative group">
        <div className={`text-2xl font-black font-numeric tracking-tight ${isPercent ? 'flex items-baseline' : ''}`} style={{ color: color || 'var(--color-text)' }}>
            {value}
            {isPercent && <span className="text-sm ml-0.5 opacity-[0.6]">%</span>}
        </div>
        <div className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest text-center leading-tight mt-1">
            {label}
        </div>
        {subLabel && <div className="text-[9px] text-[var(--color-text-dim)] font-bold uppercase">{subLabel}</div>}
    </div>
));

StatBox.displayName = 'StatBox';

export default StatBox;
