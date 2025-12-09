interface StatsCardProps {
    label: string;
    value: string | number;
    subLabel?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string; // Optional indicator color
    highlight?: boolean; // If true, makes the text larger/ bolder
}

const StatsCard = ({ label, value, subLabel, color, highlight = false }: StatsCardProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-3">
            <div
                className={`font-bold font-numeric leading-none mb-1 text-center ${highlight ? 'text-3xl' : 'text-2xl'}`}
                style={{ color: color || 'white' }}
            >
                {value}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">
                {label}
            </div>
            {subLabel && (
                <div className="text-[9px] text-gray-500 mt-1 font-medium">
                    {subLabel}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
