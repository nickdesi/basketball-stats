import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    /** Lucide icon component */
    icon: LucideIcon;
    /** Value to display (string or number) */
    value: string | number;
    /** Label text below the value */
    label: string;
    /** Color variant for the icon background */
    color: 'blue' | 'neon-blue' | 'neon-green' | 'neon-purple';
}

const colorMap: Record<StatCardProps['color'], string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    'neon-blue': 'bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)]',
    'neon-green': 'bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]',
    'neon-purple': 'bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]',
};

/**
 * Reusable stat card component for dashboard metrics.
 * Displays an icon, value, and label in a glass-effect card.
 */
export const StatCard = ({ icon: Icon, value, label, color }: StatCardProps) => (
    <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
            <Icon size={24} />
        </div>
        <div>
            <div className="font-stats text-2xl text-[var(--color-text)]">{value}</div>
            <div className="label-stat">{label}</div>
        </div>
    </div>
);

export default StatCard;
