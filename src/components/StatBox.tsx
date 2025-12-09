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
            {isPercent && <span className="text-sm ml-0.5 opacity-60">%</span>}
        </div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-tight mt-1">
            {label}
        </div>
        {subLabel && <div className="text-[9px] text-gray-600 font-bold uppercase">{subLabel}</div>}
    </div>
);

export default StatBox;
