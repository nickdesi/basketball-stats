import { memo } from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: 'basketball' | 'player' | 'stats';
}

const EmptyState = memo(({ title, message, actionLabel, onAction, icon = 'basketball' }: EmptyStateProps) => {
    // Basketball SVG icons for different contexts
    const icons = {
        basketball: (
            <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-neon-orange)" strokeWidth="3" opacity="0.3" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#orangeGradient)" strokeWidth="2" strokeDasharray="10 5" className="animate-spin" style={{ animationDuration: '20s' }} />
                <path d="M50 5 Q 80 50, 50 95" fill="none" stroke="var(--color-neon-orange)" strokeWidth="2" opacity="0.5" />
                <path d="M5 50 Q 50 20, 95 50" fill="none" stroke="var(--color-neon-orange)" strokeWidth="2" opacity="0.5" />
                <circle cx="50" cy="50" r="8" fill="var(--color-neon-orange)" opacity="0.6" />
                <defs>
                    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-neon-orange)" />
                        <stop offset="100%" stopColor="var(--color-neon-purple)" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        player: (
            <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                <circle cx="50" cy="30" r="20" fill="none" stroke="var(--color-neon-blue)" strokeWidth="2" opacity="0.5" />
                <path d="M20 90 Q 50 60, 80 90" fill="none" stroke="var(--color-neon-blue)" strokeWidth="2" opacity="0.5" />
                <circle cx="50" cy="30" r="12" fill="var(--color-neon-blue)" opacity="0.3" />
                <text x="50" y="35" textAnchor="middle" fill="var(--color-neon-blue)" fontSize="12" fontWeight="bold">#</text>
            </svg>
        ),
        stats: (
            <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4">
                <rect x="15" y="60" width="15" height="30" rx="2" fill="var(--color-neon-blue)" opacity="0.4" />
                <rect x="35" y="40" width="15" height="50" rx="2" fill="var(--color-neon-green)" opacity="0.5" />
                <rect x="55" y="25" width="15" height="65" rx="2" fill="var(--color-neon-purple)" opacity="0.6" />
                <rect x="75" y="50" width="15" height="40" rx="2" fill="var(--color-neon-orange)" opacity="0.4" />
            </svg>
        ),
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 px-6 text-center animate-float-in">
            {/* Decorative Glow */}
            <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-[var(--color-neon-purple)]/10 blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10">
                {icons[icon]}
            </div>

            {/* Text Content */}
            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-2 relative z-10">
                {title}
            </h3>
            <p className="text-sm md:text-base text-[var(--color-text-dim)] max-w-xs mb-6 relative z-10">
                {message}
            </p>

            {/* CTA Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="relative z-10 flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-blue)] text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-purple-500/30"
                >
                    <Plus size={20} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
