import { useState, useMemo, useCallback } from 'react';
import { useGameStore, type CompletedGame, type GameStats } from '../store/gameStore';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useThemeStore } from '../store/themeStore';
import { Trophy, Activity, Download } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';

// Import extracted components
import DashboardCharts from '../components/DashboardCharts';
import HistoryList from '../components/HistoryList';
import GameDetailModal from '../components/GameDetailModal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

interface DashboardProps {
    onNavigate?: (view: 'dashboard' | 'match' | 'players') => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
    const { history, players } = useGameStore();
    const { deleteGameFromFirestore, updateGameInFirestore, saveGameToFirestore } = useFirebaseSync();
    const theme = useThemeStore((state) => state.theme);

    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
    const [selectedGame, setSelectedGame] = useState<CompletedGame | null>(null);
    const [initialModalEditMode, setInitialModalEditMode] = useState(false);

    const handleSelectGame = useCallback((game: CompletedGame, editMode: boolean = false) => {
        setInitialModalEditMode(editMode);
        setSelectedGame(game);
    }, []);

    // --- FILTER ---
    const filteredHistory = useMemo(() => {
        return selectedPlayerId === 'all'
            ? history
            : history.filter(game => game.playerId === selectedPlayerId);
    }, [history, selectedPlayerId]);

    // --- STATS CALCULATION ---
    const { totalGames, totalRebounds, totalAssists, avgPoints, avgRebounds, avgAssists } = useMemo(() => {
        const totalGames = filteredHistory.length;
        const totalPoints = filteredHistory.reduce((acc, game) =>
            acc + game.stats.points1 + (game.stats.points2 * 2) + (game.stats.points3 * 3), 0);
        const totalRebounds = filteredHistory.reduce((acc, game) => acc + ((game.stats.offensiveRebounds + game.stats.defensiveRebounds) || game.stats.rebounds), 0);
        const totalAssists = filteredHistory.reduce((acc, game) => acc + game.stats.assists, 0);

        const avgPoints = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : '0.0';
        const avgRebounds = totalGames > 0 ? (totalRebounds / totalGames).toFixed(1) : '0.0';
        const avgAssists = totalGames > 0 ? (totalAssists / totalGames).toFixed(1) : '0.0';

        return { totalGames, totalPoints, totalRebounds, totalAssists, avgPoints, avgRebounds, avgAssists };
    }, [filteredHistory]);

    // --- CHART DATA ---
    const lineData = useMemo(() => {
        const sortedHistory = [...filteredHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return {
            labels: sortedHistory.map((_, i) => `Match ${i + 1}`),
            datasets: [{
                label: 'Points',
                data: sortedHistory.map(g => (g.stats.points1) + (g.stats.points2 * 2) + (g.stats.points3 * 3)),
                borderColor: '#00F3FF',
                backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { top: number; bottom: number } } }) => {
                    const ctx = context.chart.ctx;
                    const area = context.chart.chartArea;
                    if (!area) return 'rgba(0, 243, 255, 0.1)';
                    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
                    gradient.addColorStop(0, 'rgba(0, 243, 255, 0.4)');
                    gradient.addColorStop(0.5, 'rgba(0, 243, 255, 0.1)');
                    gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00F3FF',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00F3FF',
            }],
        };
    }, [filteredHistory]);

    const doughnutData = useMemo(() => {
        const totalP1 = filteredHistory.reduce((acc, g) => acc + g.stats.points1, 0);
        const totalP2 = filteredHistory.reduce((acc, g) => acc + (g.stats.points2 * 2), 0);
        const totalP3 = filteredHistory.reduce((acc, g) => acc + (g.stats.points3 * 3), 0);

        const activeFilterPlayer = players.find(p => p.id === selectedPlayerId);
        const isU11Filter = activeFilterPlayer?.level === 'U11';

        return {
            labels: isU11Filter ? ['1 Point', '2 Points'] : ['1 Point', '2 Points', '3 Points'],
            datasets: [{
                data: isU11Filter ? [totalP1, totalP2] : [totalP1, totalP2, totalP3],
                backgroundColor: isU11Filter ? ['#00F3FF', '#BC13FE'] : ['#00F3FF', '#BC13FE', '#0aff68'],
                borderColor: '#030303',
                borderWidth: 2,
                hoverBackgroundColor: isU11Filter ? ['#66F8FF', '#D946FF'] : ['#66F8FF', '#D946FF', '#66FF9D'],
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 2,
                // No hoverOffset to keep chart within bounds
            }],
        };
    }, [filteredHistory, players, selectedPlayerId]);

    const barData = useMemo(() => {
        return {
            labels: ['Rebonds', 'Passes', 'Interc.', 'Contres'],
            datasets: [{
                label: 'Moyenne',
                data: [
                    totalGames ? (totalRebounds / totalGames) : 0,
                    totalGames ? (totalAssists / totalGames) : 0,
                    totalGames ? (filteredHistory.reduce((a, g) => a + g.stats.steals, 0) / totalGames) : 0,
                    totalGames ? (filteredHistory.reduce((a, g) => a + g.stats.blocks, 0) / totalGames) : 0,
                ],
                backgroundColor: ['#0aff68', '#bc13fe', '#00f3ff', '#ff3344'],
                hoverBackgroundColor: ['#33FF85', '#D946FF', '#33F6FF', '#FF5566'],
                borderRadius: 8,
                borderSkipped: false, // Rounded on all corners
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff',
            }],
        };
    }, [filteredHistory, totalGames, totalRebounds, totalAssists]);

    // Chart colors - Only 'light' theme uses dark text, all others use white
    const textColor = theme === 'light' ? '#1a1a1a' : '#ffffff';
    const gridColor = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';

    // Memoized chart options for performance
    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        // Snappy animations
        animation: {
            duration: 800, // Faster, snappier
            easing: 'easeOutCubic' as const,
            delay: (context: { type: string; dataIndex: number }) => {
                if (context.type === 'data') {
                    return context.dataIndex * 60; // Faster stagger
                }
                return 0;
            },
        },
        transitions: {
            active: { animation: { duration: 150 } } // Instant feedback
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    font: { family: 'var(--font-mono)', weight: 600, size: 11 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    padding: 12,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(3, 3, 3, 0.95)',
                titleFont: { family: 'var(--font-mono)', weight: 700, size: 12 },
                bodyFont: { family: 'var(--font-sans)', size: 11 },
                padding: 10,
                cornerRadius: 6,
                displayColors: true,
                animation: { duration: 100 } // Instant tooltips
            }
        },
        scales: {
            y: {
                ticks: {
                    color: textColor,
                    font: { family: 'var(--font-mono)', size: 10 },
                    padding: 8,
                },
                grid: { color: gridColor, lineWidth: 1, drawTicks: false },
                border: { display: false },
            },
            x: {
                ticks: {
                    color: textColor,
                    font: { family: 'var(--font-mono)', size: 10 },
                    padding: 4,
                },
                grid: { display: false },
                border: { display: false },
            },
        },
        elements: {
            point: {
                radius: 5,
                hoverRadius: 9,
                hitRadius: 16,
                hoverBorderWidth: 2,
                borderWidth: 2,
            },
            line: {
                tension: 0.35, // Slightly less curved for cleaner look
                borderWidth: 2.5,
            },
            bar: {
                borderRadius: 6,
            }
        }
    }), [textColor, gridColor]);

    // --- HANDLERS ---
    const handleExport = () => {
        const dataStr = JSON.stringify(history, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hoop-stats-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportGame = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                // Helper to validate a single game
                const isValidGame = (g: unknown): g is CompletedGame => {
                    return typeof g === 'object' && g !== null &&
                        'stats' in g && 'playerId' in g && 'date' in g;
                };

                // Handle single game or array of games
                const games: CompletedGame[] = Array.isArray(json) ? json : [json];

                // Validate all games
                if (!games.every(isValidGame)) {
                    alert("Fichier invalide : structure incorrecte.");
                    return;
                }

                // Import each game to Firebase
                let imported = 0;
                for (const game of games) {
                    try {
                        await saveGameToFirestore({
                            ...game,
                            id: game.id || crypto.randomUUID()
                        });
                        imported++;
                    } catch (err) {
                        console.error("Error importing game:", err);
                    }
                }

                alert(`${imported} match(s) importé(s) avec succès !`);
            } catch (err) {
                console.error("Import error", err);
                alert("Erreur lors de l'importation du fichier.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleUpdateGame = useCallback(async (gameId: string, updatedStats: GameStats, date?: string, playerId?: string) => {
        try {
            await updateGameInFirestore(gameId, updatedStats, date, playerId);
            // Update local state to reflect changes immediately
            if (selectedGame && selectedGame.id === gameId) {
                setSelectedGame({
                    ...selectedGame,
                    stats: { ...updatedStats },
                    ...(date ? { date } : {}),
                    ...(playerId ? { playerId } : {})
                });
            }
        } catch (error) {
            console.error('Error updating game:', error);
        }
    }, [updateGameInFirestore, selectedGame]);

    const handleDeleteGame = useCallback(async (gameId: string) => {
        try {
            await deleteGameFromFirestore(gameId);
            setSelectedGame(null);
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    }, [deleteGameFromFirestore]);

    return (
        <div className="space-y-6 pb-24 relative">

            {/* MATCH DETAILS MODAL */}
            {selectedGame && (
                <GameDetailModal
                    game={selectedGame}
                    players={players}
                    onClose={() => { setSelectedGame(null); setInitialModalEditMode(false); }}
                    onDelete={handleDeleteGame}
                    onUpdate={handleUpdateGame}
                    initialIsEditing={initialModalEditMode}
                />
            )}

            {/* Header & Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--color-text)] flex items-center gap-3">
                            <Activity className="text-[var(--color-neon-blue)]" />
                            Tableau de Bord
                        </h2>
                        <p className="text-[var(--color-text-dim)]">Suivi des performances</p>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] hover:bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl cursor-pointer transition-colors shadow-sm text-[var(--color-text)]">
                        <Download className="rotate-180" size={18} />
                        <span className="text-sm font-bold">Importer</span>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportGame}
                            className="hidden"
                        />
                    </label>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="bg-[var(--color-card)] hover:bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-2 text-[var(--color-text)] transition-colors shadow-sm"
                            title="Exporter les données (JSON)"
                        >
                            <Download size={20} />
                        </button>
                        <select
                            value={selectedPlayerId}
                            onChange={(e) => setSelectedPlayerId(e.target.value)}
                            className="bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-lg p-2 text-[var(--color-text)] min-w-[200px] focus:outline-none focus:border-[var(--color-neon-blue)] shadow-sm"
                        >
                            <option value="all">Tous les joueurs</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Stats Cards - Only show when a specific player is selected */}
            {selectedPlayerId !== 'all' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <div className="font-stats text-2xl text-[var(--color-text)]">{totalGames}</div>
                            <div className="label-stat">Matchs</div>
                        </div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)]">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="font-stats text-2xl text-[var(--color-neon-blue)]">{avgPoints}</div>
                            <div className="label-stat">PTS / M</div>
                        </div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="font-stats text-2xl text-[var(--color-neon-green)]">{avgRebounds}</div>
                            <div className="label-stat">REB / M</div>
                        </div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="font-stats text-2xl text-[var(--color-neon-purple)]">{avgAssists}</div>
                            <div className="label-stat">PAS / M</div>
                        </div>
                    </div>
                </div>
            )}

            {/* CHARTS SECTION */}
            {selectedPlayerId !== 'all' && totalGames > 0 ? (
                <DashboardCharts
                    lineData={lineData}
                    doughnutData={doughnutData}
                    barData={barData}
                    chartOptions={chartOptions}
                    textColor={textColor}
                    selectedPlayerId={selectedPlayerId}
                />
            ) : selectedPlayerId === 'all' && totalGames > 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl text-[var(--color-text-dim)]">
                    <div className="text-3xl mb-3">📊</div>
                    Sélectionnez un joueur pour afficher ses graphiques de performance.
                </div>
            ) : (
                <div className="text-center py-12 glass-card rounded-2xl text-[var(--color-text-dim)]">
                    Enregistrez des matchs pour voir apparaître les graphiques.
                </div>
            )}

            {/* Recent History */}
            <HistoryList
                filteredHistory={filteredHistory}
                players={players}
                onSelectGame={handleSelectGame}
                onDeleteGame={handleDeleteGame}
                onNavigateToMatch={() => onNavigate?.('match')}
            />
        </div>
    );
};

export default Dashboard;
