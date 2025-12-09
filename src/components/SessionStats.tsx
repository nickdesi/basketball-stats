import type { GameStats } from '../store/gameStore';
import StatBox from './StatBox';

interface SessionStatsProps {
    stats: GameStats;
    playerLevel?: 'U11' | 'U13' | 'U15' | 'U18';
}

const SessionStats = ({ stats, playerLevel }: SessionStatsProps) => {

    // --- CALCULATIONS ---
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

    // 4. TS% (True Shooting Percentage) = PTS / (2 * (FGA + 0.44 * FTA))
    const totalPoints = (stats.points1 * 1) + (stats.points2 * 2) + (stats.points3 * 3);
    const tsDenominator = 2 * (fgAttempts + (0.44 * ftAttempts));
    const tsPercent = tsDenominator > 0 ? Math.round((totalPoints / tsDenominator) * 100) : 0;

    // 5. eFG% (Effective Field Goal Percentage) = (FG + 0.5 * 3P) / FGA
    const efgPercent = fgAttempts > 0 ? Math.round(((fgMakes + 0.5 * p3Makes) / fgAttempts) * 100) : 0;

    // 6. Game Score / Evaluation (Approximate)
    // Formula: PTS + REB + AST + STL + BLK - Missed FG - Missed FT - TO
    const evaluation = totalPoints
        + stats.rebounds + stats.offensiveRebounds + stats.defensiveRebounds // Note: rebounds might be Double Counted if 'rebounds' stores sum? Let's assume rebounds = total for now or calculate sum.
        // Actually, let's use sum of off+def if available, or just use what we have.
        // Legacy: 'rebounds' variable might be unused. Best to use (off + def).
        + stats.assists + stats.steals + stats.blocks
        - fgMisses - stats.missedPoints1 - stats.turnovers;

    // Note for efficiency: In our store, we have rebounds (legacy) AND off/def.
    // We should rely on Off + Def.
    const totalReb = stats.offensiveRebounds + stats.defensiveRebounds;


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header omitted to keep it clean like the screenshot, just the grid */}

            {/* MAIN STATS GRID - Mimicking the Reference Image */}
            <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                {/* Row 1: Shooting */}
                <div className={`grid ${playerLevel === 'U11' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-white/10 border-b border-white/10 bg-white/[0.02]`}>
                    <StatBox label="FG" value={`${fgMakes}/${fgAttempts}`} color="white" />
                    <StatBox label="FG%" value={fgPercent} isPercent color={fgPercent >= 50 ? 'var(--color-neon-green)' : 'white'} />
                    {playerLevel !== 'U11' && (
                        <>
                            <StatBox label="3P" value={`${p3Makes}/${p3Attempts}`} color="white" />
                            <StatBox label="3P%" value={p3Percent} isPercent />
                        </>
                    )}
                </div>

                {/* Row 2: FT & Rebounds */}
                <div className="grid grid-cols-4 divide-x divide-white/10 border-b border-white/10">
                    <StatBox label="FT%" value={ftPercent} isPercent />
                    <StatBox label="REB OFF" value={stats.offensiveRebounds} />
                    <StatBox label="REB DEF" value={stats.defensiveRebounds} />
                    <StatBox label="REB TOT" value={totalReb} color="var(--color-neon-purple)" />
                </div>

                {/* Row 3: Playmaking & Defense */}
                <div className="grid grid-cols-4 divide-x divide-white/10">
                    <StatBox label="PASSES" value={stats.assists} color="var(--color-neon-blue)" />
                    <StatBox label="CONTRES" value={stats.blocks} />
                    <StatBox label="INTERCEP" value={stats.steals} />
                    <StatBox label="MIN" value="-" />
                </div>
            </div>

            {/* ADVANCED STATS SECTION */}
            <div>
                <h4 className="text-[var(--color-neon-orange)] font-bold text-lg mb-3 flex items-center gap-2">
                    Statistiques avancées
                </h4>
                <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-4 divide-x divide-white/10">
                        <StatBox label="POINTS" value={totalPoints} color="var(--color-neon-blue)" />
                        <StatBox label="eFG%" value={efgPercent} isPercent />
                        <StatBox label="TS%" value={tsPercent} isPercent />
                        <StatBox label="EVAL" value={evaluation} color={evaluation > 15 ? 'var(--color-neon-green)' : 'white'} />
                    </div>
                </div>
            </div>

            {/* NEGATIVE STATS (Optional but good to have) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-between px-6">
                    <span className="text-red-400 font-bold text-xs uppercase">BALLES PERDUES</span>
                    <span className="text-2xl font-black text-red-500">{stats.turnovers}</span>
                </div>
                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-between px-6">
                    <span className="text-red-400 font-bold text-xs uppercase">FAUTES</span>
                    <span className="text-2xl font-black text-red-500">{stats.fouls}</span>
                </div>
            </div>
        </div>
    );
};

export default SessionStats;
