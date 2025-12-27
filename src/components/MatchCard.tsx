import { useState, memo, useRef, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Share2, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import type { CompletedGame, Player } from '../store/gameStore';
import { getAdvancedStats } from '../store/gameStore';
import { calculateBadges } from './badges/badgeUtils';
import BadgeList from './badges/BadgeList';
import ShareableStats from './ShareableStats';
import StatBox from './StatBox';

interface MatchCardProps {
    game: CompletedGame;
    player?: Player;
    onOpenDetails: (game: CompletedGame, editMode?: boolean) => void;
    onDelete?: (gameId: string) => void;
}

const MatchCard = memo(({ game, player, onOpenDetails, onDelete }: MatchCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Core Stats
    const totalPoints = game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3);
    const totalRebounds = (game.stats.offensiveRebounds + game.stats.defensiveRebounds) || game.stats.rebounds;
    const totalAssists = game.stats.assists;

    // Use centralized advanced stats calculation for consistency
    const advancedStats = getAdvancedStats(game.stats);
    const { evaluation, trueShooting: tsPercent, fieldGoalPercentage: fgPercent } = advancedStats;

    const badges = calculateBadges(game.stats);

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShareModal(true);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <>
            <div
                className={`glass-card rounded-2xl transition-all duration-300 border border-[var(--color-glass-border)] overflow-hidden ${isExpanded ? 'bg-[var(--color-bg-elevated)] ring-1 ring-[var(--color-neon-blue)]/30' : 'hover:bg-[var(--color-bg-elevated)]'}`}
                onClick={() => onOpenDetails(game, false)}
            >
                {/* 1. Header Row (Compact) */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Date Icon */}
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] flex flex-col items-center justify-center text-[var(--color-text-dim)] border border-[var(--color-glass-border)] shadow-inner">
                            <span className="text-[10px] font-bold uppercase">{new Date(game.date).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span>
                            <span className="text-xl font-black text-[var(--color-text)]">{new Date(game.date).getDate()}</span>
                        </div>

                        {/* Match Info */}
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                                {game.opponent || "Match"}
                                {player && (
                                    <span className="text-[10px] bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] px-2 py-0.5 rounded-full border border-[var(--color-neon-blue)]/20 font-medium">
                                        {player.name}
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                {badges.slice(0, 3).length > 0 ? (
                                    <div className="flex -space-x-1">
                                        <BadgeList badges={badges.slice(0, 3)} size="sm" />
                                    </div>
                                ) : (
                                    <span className="text-xs text-[var(--color-text-dim)] flex items-center gap-1">
                                        <CalendarDays size={12} /> {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions & Core Stat */}
                    <div className="flex items-center gap-3">
                        {/* Core Stat: Eval or Points */}
                        <div className="text-right hidden sm:block">
                            <div className="text-2xl font-black font-stats text-[var(--color-neon-green)]">{evaluation}</div>
                            <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider font-bold">ÉVAL</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 pl-2 border-l border-[var(--color-glass-border)]">
                            <button
                                onClick={handleShareClick}
                                className="p-2 text-[var(--color-text-dim)] hover:text-[var(--color-neon-blue)] hover:bg-[var(--color-bg-elevated)] rounded-full transition-colors"
                                aria-label="Partager les stats"
                            >
                                <Share2 size={18} />
                            </button>
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] rounded-full transition-colors"
                                    aria-label="Ouvrir le menu"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                {/* Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-xl shadow-2xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center gap-2"
                                            onClick={(e) => { e.stopPropagation(); onOpenDetails(game, false); setShowMenu(false); }}
                                        >
                                            <Eye size={16} /> Voir les détails
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center gap-2"
                                            onClick={(e) => { e.stopPropagation(); onOpenDetails(game, true); setShowMenu(false); }}
                                        >
                                            <Edit size={16} /> Corriger stats
                                        </button>
                                        <div className="h-px bg-[var(--color-glass-border)] my-1" />
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                            onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(game.id); setShowMenu(false); }}
                                        >
                                            <Trash2 size={16} /> Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Grid (Always Visible) */}
                <div className="grid grid-cols-6 border-t border-[var(--color-glass-border)] bg-[var(--color-bg)]/30 backdrop-blur-sm divide-x divide-[var(--color-glass-border)]">
                    <div className="p-3 text-center">
                        <div className="text-xl font-black font-stats text-[var(--color-neon-blue)]">{totalPoints}</div>
                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">PTS</div>
                    </div>
                    <div className="p-3 text-center hidden active-metric">
                        <div className={`text-xl font-black font-stats ${fgPercent >= 50 ? 'text-[var(--color-neon-green)]' : 'text-white'}`}>{fgPercent}<span className="text-xs ml-0.5 opacity-60">%</span></div>
                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">FG%</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xl font-black font-stats text-[var(--color-neon-green)]">{totalRebounds}</div>
                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">RB</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xl font-black font-stats text-[var(--color-neon-purple)]">{totalAssists}</div>
                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">PD</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xl font-black font-stats text-[var(--color-neon-orange)]">{game.stats.steals}</div>
                        <div className="text-[10px] text-[var(--color-text-dim)] font-bold">INT</div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-3 text-center hover:bg-[var(--color-bg-elevated)] transition-colors flex flex-col items-center justify-center gap-1 group"
                    >
                        {isExpanded ? <ChevronUp size={16} className="text-[var(--color-neon-blue)]" /> : <ChevronDown size={16} className="text-[var(--color-text-dim)] group-hover:text-[var(--color-text)]" />}
                        <span className="text-[9px] text-[var(--color-text-dim)] font-bold uppercase">{isExpanded ? 'Moins' : 'Avançé'}</span>
                    </button>
                </div>

                {/* 3. Expanded View (Advanced Stats) */}
                {isExpanded && (() => {
                    // Helper to format seconds as MM:SS
                    const formatTime = (secs: number) => {
                        const mins = Math.floor(secs / 60);
                        const remaining = secs % 60;
                        return `${mins}:${remaining.toString().padStart(2, '0')}`;
                    };
                    const playTime = game.stats.playTimeSeconds
                        ? formatTime(game.stats.playTimeSeconds)
                        : '-';
                    // Calculate FT stats
                    const ftMade = game.stats.points1;
                    const ftAttempted = game.stats.points1 + game.stats.missedPoints1;

                    return (
                        <div className="p-3 grid grid-cols-5 gap-2 bg-[var(--color-bg)]/50 border-t border-[var(--color-glass-border)] animate-in slide-in-from-top-2 duration-200">
                            {/* Time Played */}
                            <div className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-glass-border)]">
                                <StatBox
                                    label="TEMPS"
                                    value={playTime}
                                    tooltip="Temps de jeu sur le terrain (MM:SS)."
                                />
                            </div>
                            {/* Free Throws XX/XX */}
                            <div className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-glass-border)]">
                                <StatBox
                                    label="LF"
                                    value={`${ftMade}/${ftAttempted}`}
                                    tooltip="Lancers-Francs réussis / tentés."
                                />
                            </div>
                            {/* TS% */}
                            <div className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-glass-border)]">
                                <StatBox
                                    label="TS%"
                                    value={tsPercent}
                                    isPercent
                                    color={tsPercent >= 50 ? 'var(--color-neon-green)' : 'var(--color-text)'}
                                    tooltip="True Shooting : efficacité réelle aux tirs. Un bon score est au-dessus de 50%."
                                />
                            </div>
                            {/* BP */}
                            <div className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-glass-border)]">
                                <StatBox
                                    label="BP"
                                    value={game.stats.turnovers}
                                    color="var(--color-error)"
                                    tooltip="Balles Perdues : pertes de balle (passe interceptée, sortie, etc.)."
                                />
                            </div>
                            {/* Fouls */}
                            <div className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-glass-border)]">
                                <StatBox
                                    label="F"
                                    value={game.stats.fouls}
                                    color="#facc15"
                                    tooltip="Fautes personnelles. 5 fautes = exclusion."
                                />
                            </div>
                        </div>
                    );
                })()}
            </div>

            {showShareModal && (
                <ShareableStats game={game} player={player} onClose={() => setShowShareModal(false)} />
            )}
        </>
    );
});

MatchCard.displayName = 'MatchCard';

export default MatchCard;
