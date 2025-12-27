import { useMemo, memo } from 'react';
import type { GameStats } from '../store/gameStore';
import { getAdvancedStats } from '../store/gameStore';
import StatBox from './StatBox';

interface SessionStatsProps {
    stats: GameStats;
    playerLevel?: 'U11' | 'U13' | 'U15' | 'U18';
    liveDuration?: number; // Live game duration in seconds (for MatchRecorder)
}

const SessionStats = memo(({ stats, playerLevel, liveDuration }: SessionStatsProps) => {

    // --- CALCULATIONS ---
    const computedStats = useMemo(() => {
        // 1. FG (2PT + 3PT) - Field Goals
        const fgMakes = stats.points2 + stats.points3;
        const fgMisses = stats.missedPoints2 + stats.missedPoints3;
        const fgAttempts = fgMakes + fgMisses;
        const fgPercent = fgAttempts > 0 ? Math.round((fgMakes / fgAttempts) * 100) : 0;

        // 2. 3PT
        const p3Makes = stats.points3;
        const p3Attempts = stats.points3 + stats.missedPoints3;
        const p3Percent = p3Attempts > 0 ? Math.round((p3Makes / p3Attempts) * 100) : 0;

        // 3. FT (1PT) - Free Throws
        const ftMakes = stats.points1;
        const ftAttempts = stats.points1 + stats.missedPoints1;
        const ftPercent = ftAttempts > 0 ? Math.round((ftMakes / ftAttempts) * 100) : 0;

        // Use centralized advanced stats for consistency
        const advancedStats = getAdvancedStats(stats);
        const { trueShooting: tsPercent, effectiveFg: efgPercent, evaluation } = advancedStats;

        const totalPoints = stats.points1 + (stats.points2 * 2) + (stats.points3 * 3);
        const totalReb = (stats.offensiveRebounds + stats.defensiveRebounds) || stats.rebounds;

        // Seconds: use live duration if provided, otherwise use saved playTimeSeconds
        const totalSeconds = liveDuration !== undefined
            ? liveDuration
            : (stats.playTimeSeconds || 0);

        // Format as MM:SS
        const formatTime = (secs: number) => {
            const mins = Math.floor(secs / 60);
            const remaining = secs % 60;
            return `${mins}:${remaining.toString().padStart(2, '0')}`;
        };
        const playTimeFormatted = totalSeconds > 0 ? formatTime(totalSeconds) : '-';

        // PIR per minute (FIBA standard normalization) - convert seconds to minutes
        const minutesPlayed = totalSeconds / 60;
        const pirPerMin = minutesPlayed > 0.5 ? (evaluation / minutesPlayed).toFixed(1) : null; // Only show if > 30s

        return {
            fgMakes, fgAttempts, fgPercent,
            p3Makes, p3Attempts, p3Percent,
            ftMakes, ftAttempts, ftPercent,
            totalPoints, tsPercent, efgPercent,
            evaluation, totalReb, playTimeFormatted, pirPerMin
        };
    }, [stats, liveDuration]);

    const {
        fgMakes, fgAttempts, fgPercent,
        p3Makes, p3Attempts, p3Percent,
        ftMakes, ftAttempts,
        tsPercent, efgPercent,
        evaluation, totalReb, playTimeFormatted, pirPerMin
    } = computedStats;


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header omitted to keep it clean like the screenshot, just the grid */}

            {/* MAIN STATS GRID - Mimicking the Reference Image */}
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-glass-border)] shadow-sm">
                {/* Row 1: Shooting */}
                <div className={`grid ${playerLevel === 'U11' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-[var(--color-glass-border)] border-b border-[var(--color-glass-border)] bg-[var(--color-bg)]/50`}>
                    <StatBox label="FG" value={`${fgMakes}/${fgAttempts}`} tooltip="Tirs de champ (2 pts + 3 pts)" />
                    <StatBox label="FG%" value={fgPercent} isPercent color={fgPercent >= 50 ? 'var(--color-neon-green)' : 'var(--color-text)'} tooltip="% Réussite aux tirs (hors lancers-francs)" />
                    {playerLevel !== 'U11' && (
                        <>
                            <StatBox label="3P" value={`${p3Makes}/${p3Attempts}`} />
                            <StatBox label="3P%" value={p3Percent} isPercent />
                        </>
                    )}
                </div>

                {/* Row 2: FT & Rebounds */}
                <div className="grid grid-cols-4 divide-x divide-[var(--color-glass-border)] border-b border-[var(--color-glass-border)]">
                    <StatBox label="LF" value={`${ftMakes}/${ftAttempts}`} tooltip="Lancers-Francs réussis / tentés" />
                    <StatBox label="RB OFF" value={stats.offensiveRebounds} />
                    <StatBox label="RB DEF" value={stats.defensiveRebounds} />
                    <StatBox label="RB TOT" value={totalReb} color="var(--color-neon-purple)" />
                </div>

                {/* Row 3: Playmaking & Defense */}
                <div className="grid grid-cols-4 divide-x divide-[var(--color-glass-border)]">
                    <StatBox label="PD" value={stats.assists} color="var(--color-neon-blue)" tooltip="Passes Décisives" />
                    <StatBox label="CTR" value={stats.blocks} tooltip="Contres" />
                    <StatBox label="INT" value={stats.steals} tooltip="Interceptions" />
                    <StatBox label="TEMPS" value={playTimeFormatted} tooltip="Temps de jeu sur le terrain (MM:SS)" />
                </div>
            </div>

            {/* ADVANCED STATS SECTION */}
            <div>
                <h4 className="text-[var(--color-neon-orange)] font-bold text-lg mb-3 flex items-center gap-2">
                    Statistiques avancées
                </h4>
                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-glass-border)] shadow-sm">
                    <div className={`grid ${playerLevel === 'U11' ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-[var(--color-glass-border)]`}>
                        {playerLevel !== 'U11' && (
                            <StatBox label="eFG%" value={efgPercent} isPercent tooltip="Efficacité aux tirs : mesure la précision en valorisant les tirs à 3 points. Plus c'est haut, mieux c'est !" />
                        )}
                        <StatBox label="TS%" value={tsPercent} isPercent color={tsPercent >= 50 ? 'var(--color-neon-green)' : 'var(--color-text)'} tooltip="True Shooting : efficacité réelle aux tirs. Un bon score est au-dessus de 50%." />
                        <StatBox label="EVAL" value={evaluation} color={evaluation > 15 ? 'var(--color-neon-green)' : 'var(--color-text)'} tooltip="Évaluation globale du match (formule FIBA). Plus c'est haut, meilleur est le match !" />
                    </div>
                    {/* PIR/min row if we have minutes */}
                    {pirPerMin && (
                        <div className="border-t border-[var(--color-glass-border)] p-3 flex justify-center">
                            <div className="text-center">
                                <div className="text-xl font-stats text-[var(--color-neon-orange)]">{pirPerMin}</div>
                                <div className="text-[10px] text-[var(--color-text-dim)] font-bold">EVAL/MIN</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* NEGATIVE STATS (Optional but good to have) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-between px-6">
                    <span className="text-red-400 font-bold text-xs uppercase">BP</span>
                    <span className="text-2xl font-black text-red-500">{stats.turnovers}</span>
                </div>
                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-between px-6">
                    <span className="text-red-400 font-bold text-xs uppercase">F</span>
                    <span className="text-2xl font-black text-red-500">{stats.fouls}</span>
                </div>
            </div>
        </div>
    );
});

SessionStats.displayName = 'SessionStats';

export default SessionStats;

