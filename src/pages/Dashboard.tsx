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

const Dashboard = () => {
    const { history, players, importGame } = useGameStore();
    const { deleteGameFromFirestore, updateGameInFirestore } = useFirebaseSync();
    const theme = useThemeStore((state) => state.theme);

    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
    const [selectedGame, setSelectedGame] = useState<CompletedGame | null>(null);

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
            acc + (game.stats.points1 * 1) + (game.stats.points2 * 2) + (game.stats.points3 * 3), 0);
        const totalRebounds = filteredHistory.reduce((acc, game) => acc + (game.stats.offensiveRebounds + game.stats.defensiveRebounds || game.stats.rebounds), 0);
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
                backgroundColor: 'rgba(0, 243, 255, 0.2)',
                tension: 0.4,
                fill: true,
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
                backgroundColor: isU11Filter ? ['#00F3FF', '#BC13FE'] : ['#00F3FF', '#BC13FE', '#00FF9D'],
                borderColor: '#111',
                borderWidth: 2,
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
                backgroundColor: ['#00FF9D', '#BC13FE', '#00F3FF', '#FF0055'],
            }],
        };
    }, [filteredHistory, totalGames, totalRebounds, totalAssists]);

    const textColor = theme === 'dark' ? '#ffffff' : '#1a1a1a';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: textColor, font: { family: 'ui-monospace, monospace' } } }
        },
        scales: {
            y: { ticks: { color: textColor }, grid: { color: gridColor } },
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
        }
    };

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

    const handleImportGame = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (!json.stats || !json.playerId || !json.date) {
                    alert("Fichier invalide : structure incorrecte.");
                    return;
                }
                importGame(json as CompletedGame);
                alert("Match importé avec succès !");
            } catch (err) {
                console.error("Import error", err);
                alert("Erreur lors de l'importation du fichier.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleUpdateGame = useCallback(async (gameId: string, updatedStats: GameStats, date?: string) => {
        try {
            await updateGameInFirestore(gameId, updatedStats, date);
            // Update local state to reflect changes immediately
            if (selectedGame && selectedGame.id === gameId) {
                setSelectedGame({
                    ...selectedGame,
                    stats: { ...updatedStats },
                    ...(date ? { date } : {})
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
                    onClose={() => setSelectedGame(null)}
                    onDelete={handleDeleteGame}
                    onUpdate={handleUpdateGame}
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

            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-[var(--color-text)]">{totalGames}</div>
                        <div className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Matchs</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-[var(--color-text)]">{avgPoints}</div>
                        <div className="text-xs text-[var(--color-text-dim)] uppercase font-bold">PTS / M</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-[var(--color-text)]">{avgRebounds}</div>
                        <div className="text-xs text-[var(--color-text-dim)] uppercase font-bold">REB / M</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-[var(--color-text)]">{avgAssists}</div>
                        <div className="text-xs text-[var(--color-text-dim)] uppercase font-bold">PAS / M</div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            {totalGames > 0 ? (
                <DashboardCharts
                    lineData={lineData}
                    doughnutData={doughnutData}
                    barData={barData}
                    chartOptions={chartOptions}
                    textColor={textColor}
                    selectedPlayerId={selectedPlayerId}
                />
            ) : (
                <div className="text-center py-12 glass-panel rounded-xl text-[var(--color-text-dim)]">
                    Enregistrez des matchs pour voir apparaître les graphiques.
                </div>
            )}

            {/* Recent History */}
            <HistoryList
                filteredHistory={filteredHistory}
                players={players}
                onSelectGame={setSelectedGame}
            />
        </div>
    );
};

export default Dashboard;
