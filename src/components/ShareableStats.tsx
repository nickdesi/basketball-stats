import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, X } from 'lucide-react';
import { getAdvancedStats, type CompletedGame, type Player } from '../store/gameStore';
import BadgeList from './badges/BadgeList';
import { calculateBadges } from './badges/badgeUtils';

interface ShareableStatsProps {
    game: CompletedGame;
    player: Player | undefined;
    onClose: () => void;
}

const ShareableStats = ({ game, player, onClose }: ShareableStatsProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const totalPoints = game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3);
    const totalRebounds = (game.stats.offensiveRebounds + game.stats.defensiveRebounds) || game.stats.rebounds;

    // Advanced Stats
    const advancedStats = getAdvancedStats(game.stats);

    const generateImage = useCallback(async () => {
        if (!cardRef.current) return null;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#0a0a0a'
            });
            return dataUrl;
        } catch (err) {
            console.error('Failed to generate image:', err);
            return null;
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const handleDownload = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.download = `match-${player?.name || 'stats'}-${new Date(game.date).toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
    };

    const handleShare = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        // Convert data URL to Blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'match-stats.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Statistiques du Match',
                    text: `🏀 ${player?.name || 'Joueur'} vs ${game.opponent || 'Adversaire'}`
                });
            } catch {
                // Fallback to download
                handleDownload();
            }
        } else {
            handleDownload();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
            <div className="flex flex-col gap-4 max-w-md w-full" onClick={e => e.stopPropagation()}>

                {/* The Shareable Card */}
                <div
                    ref={cardRef}
                    className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                    }}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                        {/* Header */}
                        <div className="text-center mb-2">
                            <div className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-1">Match Statistics</div>
                            <div className="text-white/60 text-sm">
                                {new Date(game.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>

                        {/* Player Info */}
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-lg">
                                    {player?.number || '#'}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-white text-lg">{player?.name || 'Joueur'}</div>
                                    <div className="text-white/50 text-xs">{player?.position} • {player?.level}</div>
                                </div>
                            </div>
                        </div>

                        {/* Opponent */}
                        <div className="text-center text-white/40 text-sm mb-2">
                            vs <span className="text-white font-medium">{game.opponent || 'Adversaire'}</span>
                        </div>

                        {/* Main Stats - Dual Display */}
                        <div className="flex items-center justify-center gap-6 my-2">
                            {/* Points */}
                            <div className="text-center">
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 leading-none">
                                    {totalPoints}
                                </div>
                                <div className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mt-1">Points</div>
                            </div>

                            {/* Evaluation Badge */}
                            <div className="text-center border-l border-white/20 pl-6">
                                <div className="text-5xl font-black text-orange-400 leading-none">
                                    {advancedStats.evaluation}
                                </div>
                                <div className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mt-1">EVAL</div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                                <div className="text-2xl font-bold text-white">{totalRebounds}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">RB</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                                <div className="text-2xl font-bold text-white">{game.stats.assists}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">PD</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                                <div className="text-2xl font-bold text-white">{game.stats.steals}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">INT</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
                                <div className="text-2xl font-bold text-cyan-400">{advancedStats.trueShooting}%</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">TS%</div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="mt-4">
                            <BadgeList badges={calculateBadges(game.stats)} size="sm" />
                        </div>

                        {/* Branding */}
                        <div className="text-center mt-4 text-white/20 text-xs font-bold tracking-widest">
                            HOOP.STATS
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <X size={20} />
                        Fermer
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Download size={20} />
                        {isGenerating ? '...' : 'Télécharger'}
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={isGenerating}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:brightness-110 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/20"
                    >
                        <Share2 size={20} />
                        {isGenerating ? '...' : 'Partager'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareableStats;
