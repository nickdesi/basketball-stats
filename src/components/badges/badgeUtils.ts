import type { LucideIcon } from 'lucide-react';
import { Shield, Hand, Brain, Magnet, Zap, Crosshair, Award } from 'lucide-react';
import { type GameStats, getAdvancedStats } from '../../store/gameStore';

export interface Badge {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export const BADGES_CONFIG: Record<string, Omit<Badge, 'id'>> = {
    sharpshooter: {
        label: "Sniper",
        description: "TS% > 60% (min 8 pts)",
        icon: Crosshair,
        color: "text-red-400",
        bgColor: "bg-red-400/20"
    },
    wall: {
        label: "The Wall",
        description: "2+ Contres",
        icon: Shield,
        color: "text-blue-400",
        bgColor: "bg-blue-400/20"
    },
    thief: {
        label: "Pickpocket",
        description: "4+ Interceptions",
        icon: Hand,
        color: "text-purple-400",
        bgColor: "bg-purple-400/20"
    },
    facilitator: {
        label: "Maestro",
        description: "5+ Passes D.",
        icon: Brain,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20"
    },
    rebounder: {
        label: "Cleaner",
        description: "8+ Rebonds",
        icon: Magnet,
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/20"
    },
    mvp: {
        label: "MVP Perf",
        description: "Eval (PIR) > 15",
        icon: Award,
        color: "text-amber-300",
        bgColor: "bg-amber-300/20"
    },
    hustle: {
        label: "Energizer",
        description: "No Turnovers (min 4 pts)",
        icon: Zap,
        color: "text-pink-400",
        bgColor: "bg-pink-400/20"
    }
};

export const calculateBadges = (stats: GameStats): Badge[] => {
    const earnedBadges: Badge[] = [];
    const adv = getAdvancedStats(stats);
    const totalPoints = stats.points1 + (stats.points2 * 2) + (stats.points3 * 3);
    const totalRebounds = (stats.offensiveRebounds + stats.defensiveRebounds) || stats.rebounds;

    // 1. Sniper: High Efficiency
    if (adv.trueShooting >= 60 && totalPoints >= 8) {
        earnedBadges.push({ id: 'sharpshooter', ...BADGES_CONFIG.sharpshooter });
    }

    // 2. The Wall: Blocks
    if (stats.blocks >= 2) {
        earnedBadges.push({ id: 'wall', ...BADGES_CONFIG.wall });
    }

    // 3. Pickpocket: Steals
    if (stats.steals >= 4) {
        earnedBadges.push({ id: 'thief', ...BADGES_CONFIG.thief });
    }

    // 4. Maestro: Assists
    if (stats.assists >= 5) {
        earnedBadges.push({ id: 'facilitator', ...BADGES_CONFIG.facilitator });
    }

    // 5. Cleaner: Rebounds
    if (totalRebounds >= 8) {
        earnedBadges.push({ id: 'rebounder', ...BADGES_CONFIG.rebounder });
    }

    // 6. MVP: High Eval
    if (adv.evaluation >= 15) {
        earnedBadges.push({ id: 'mvp', ...BADGES_CONFIG.mvp });
    }

    // 7. Hustle: Low Turnovers
    if (stats.turnovers === 0 && totalPoints >= 4) {
        earnedBadges.push({ id: 'hustle', ...BADGES_CONFIG.hustle });
    }

    return earnedBadges;
};
