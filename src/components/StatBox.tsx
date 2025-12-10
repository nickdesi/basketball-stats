import React from 'react';

interface StatBoxProps {
    label: string;
    value: string | number;
    subLabel?: string;
    color?: string;
    isPercent?: boolean;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, subLabel, color, isPercent = false }) => (
    <div className="flex flex-col items-center justify-center p-3 relative group">
        <div className={`text-2xl font-black font-numeric tracking-tight ${isPercent ? 'flex items-baseline' : ''}`} style={{ color: color || 'white' }}>
            {value}
            {isPercent && <span className="text-sm ml-0.5 opacity-[0.6]">%</span>}
        </div>
        <div className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-widest text-center leading-tight mt-1">
            {label}
        </div>
        {subLabel && <div className="text-[9px] text-[#4b5563] font-bold uppercase">{subLabel}</div>}
    </div>
);

export default StatBox;
