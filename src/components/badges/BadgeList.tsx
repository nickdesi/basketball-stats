import { memo } from 'react';
import type { Badge } from './badgeUtils';

interface BadgeListProps {
    badges: Badge[];
    size?: 'sm' | 'md' | 'lg';
}

const BadgeList = memo(({ badges, size = 'md' }: BadgeListProps) => {
    if (badges.length === 0) return null;

    // Size mapping
    const containerSize = size === 'sm' ? 'px-2 py-1' : size === 'lg' ? 'px-4 py-2' : 'px-3 py-2';
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
    const textSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {badges.map((badge, index) => {
                const Icon = badge.icon;

                return (
                    <div
                        key={badge.id}
                        className={`
                            flex items-center gap-2 rounded-full border border-white/10
                            ${badge.bgColor} ${badge.color}
                            ${containerSize}
                            animate-in zoom-in duration-300 slide-in-from-bottom-2 fill-mode-backwards
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                        title={badge.description}
                    >
                        <Icon size={iconSize} strokeWidth={2.5} />
                        <span className={`${textSize} font-bold uppercase tracking-wide`}>
                            {badge.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

BadgeList.displayName = 'BadgeList';

export default BadgeList;
