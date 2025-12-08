import { useState } from 'react';
import { useGameStore, type CompletedGame } from '../store/gameStore';
import { Trophy, Activity, CalendarDays, History, TrendingUp, PieChart as PieIcon, BarChart3, Download, Share2, Trash2 } from 'lucide-react';
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
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { history, players, deleteGame, updateGame } = useGameStore();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
    const [selectedGame, setSelectedGame] = useState<CompletedGame | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editStats, setEditStats] = useState<any>(null);

    const startEditing = () => {
        if (selectedGame) {
            setEditStats({ ...selectedGame.stats });
            setIsEditing(true);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditStats(null);
    };

    const saveEditing = () => {
        if (selectedGame && editStats) {
            updateGame(selectedGame.id, editStats);

            // Update the locally selected game to reflect changes immediately in the modal
            setSelectedGame({
                ...selectedGame,
                stats: { ...editStats }
            });

            setIsEditing(false);
            setEditStats(null);
        }
    };

    const handleEditStatChange = (stat: string, value: number) => {
        setEditStats((prev: any) => ({
            ...prev,
            [stat]: Math.max(0, value)
        }));
    };

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

    // ... (rest of helper functions) ...

    const handleDeleteGame = (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible.")) {
            deleteGame(id);
            setSelectedGame(null);
        }
    };

    // ...


    // Filter History
    const filteredHistory = selectedPlayerId === 'all'
        ? history
        : history.filter(game => game.playerId === selectedPlayerId);

    // --- STATS CALCULATION ---
    const totalGames = filteredHistory.length;
    const totalPoints = filteredHistory.reduce((acc, game) =>
        acc + (game.stats.points1 * 1) + (game.stats.points2 * 2) + (game.stats.points3 * 3), 0);
    const totalRebounds = filteredHistory.reduce((acc, game) => acc + game.stats.rebounds, 0);
    const totalAssists = filteredHistory.reduce((acc, game) => acc + game.stats.assists, 0);

    const avgPoints = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : '0.0';
    const avgRebounds = totalGames > 0 ? (totalRebounds / totalGames).toFixed(1) : '0.0';
    const avgAssists = totalGames > 0 ? (totalAssists / totalGames).toFixed(1) : '0.0';

    // --- CHART DATA ---

    // 1. Line Chart: Points Evolution
    const sortedHistory = [...filteredHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lineData = {
        labels: sortedHistory.map((_, i) => `Match ${i + 1}`),
        datasets: [
            {
                label: 'Points',
                data: sortedHistory.map(g => (g.stats.points1) + (g.stats.points2 * 2) + (g.stats.points3 * 3)),
                borderColor: '#00F3FF',
                backgroundColor: 'rgba(0, 243, 255, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // 2. Doughnut Chart: Scoring Distribution
    const totalP1 = filteredHistory.reduce((acc, g) => acc + g.stats.points1, 0);
    const totalP2 = filteredHistory.reduce((acc, g) => acc + (g.stats.points2 * 2), 0);
    const totalP3 = filteredHistory.reduce((acc, g) => acc + (g.stats.points3 * 3), 0);

    const doughnutData = {
        labels: ['1 Point', '2 Points', '3 Points'],
        datasets: [
            {
                data: [totalP1, totalP2, totalP3],
                backgroundColor: ['#00F3FF', '#BC13FE', '#00FF9D'],
                borderColor: '#111',
                borderWidth: 2,
            },
        ],
    };

    // 3. Bar Chart: Stats Comparison
    const barData = {
        labels: ['Rebonds', 'Passes', 'Interc.', 'Contres'],
        datasets: [
            {
                label: 'Moyenne',
                data: [
                    totalGames ? (totalRebounds / totalGames) : 0,
                    totalGames ? (totalAssists / totalGames) : 0,
                    totalGames ? (filteredHistory.reduce((a, g) => a + g.stats.steals, 0) / totalGames) : 0,
                    totalGames ? (filteredHistory.reduce((a, g) => a + g.stats.blocks, 0) / totalGames) : 0,
                ],
                backgroundColor: ['#00FF9D', '#BC13FE', '#00F3FF', '#FF0055'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#ccc', font: { family: 'ui-monospace, monospace' } }
            }
        },
        scales: {
            y: { ticks: { color: '#888' }, grid: { color: '#333' } },
            x: { ticks: { color: '#888' }, grid: { color: '#333' } },
        }
    };

    const handleShareGame = async (game: CompletedGame) => {
        const pts = (game.stats.points1 * 1) + (game.stats.points2 * 2) + (game.stats.points3 * 3);
        const player = players.find(p => p.id === game.playerId);

        const text = `🏀 MATCH HISTORY\n\n👤 ${player?.name || 'Joueur'}\n🆚 ${game.opponent || 'Adversaire'}\n📅 ${new Date(game.date).toLocaleDateString()}\n\n📊 STATS:\n- Points: ${pts}\n- Rebonds: ${game.stats.rebounds}\n- Passes: ${game.stats.assists}\n- Interceptions: ${game.stats.steals}\n- Contres: ${game.stats.blocks}\n\n#HoopStats`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'Statistiques du Match', text: text });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            await navigator.clipboard.writeText(text);
            alert("Résumé copié dans le presse-papier !");
        }
    };

    const handleExportGame = (game: CompletedGame) => {
        const dataStr = JSON.stringify(game, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `match-${new Date(game.date).toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    // ... (rest of the component) ...

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24 relative">

            {/* MATCH DETAILS MODAL */}
            {selectedGame && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200" onClick={() => setSelectedGame(null)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-start">
                            <div>
                                <div className="text-xs text-[var(--color-neon-blue)] font-bold uppercase tracking-wider mb-1">
                                    {isEditing ? 'Modification du Match' : 'Détails du Match'}
                                </div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {selectedGame.opponent || "Match d'entraînement"}
                                </h3>
                                <div className="text-gray-400 text-sm mt-1">
                                    {new Date(selectedGame.date).toLocaleDateString()} • {new Date(selectedGame.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <>
                                        <button onClick={startEditing} className="p-2 hover:bg-white/10 rounded-full transition-colors text-yellow-400" title="Modifier">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDeleteGame(selectedGame.id)} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500" title="Supprimer">
                                            <Trash2 size={20} />
                                        </button>
                                        <button onClick={() => handleShareGame(selectedGame)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[var(--color-neon-blue)]" title="Partager">
                                            <Share2 size={20} />
                                        </button>
                                        <button onClick={() => handleExportGame(selectedGame)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white" title="Exporter JSON">
                                            <Download size={20} />
                                        </button>
                                        <button onClick={() => setSelectedGame(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2">
                                            <span className="text-2xl leading-none">&times;</span>
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={cancelEditing} className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2">
                                        <span className="text-2xl leading-none">&times;</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {isEditing ? (
                                // --- EDIT MODE ---
                                <div className="space-y-6">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200 text-sm mb-4">
                                        Vous modifiez les statistiques de ce match.
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(editStats || {}).map(([key, value]) => {
                                            const labels: Record<string, string> = {
                                                points1: "1 Point",
                                                points2: "2 Points",
                                                points3: "3 Points",
                                                rebounds: "Rebonds",
                                                assists: "Passes",
                                                steals: "Interceptions",
                                                blocks: "Contres",
                                                turnovers: "Balles Perdues",
                                                fouls: "Fautes"
                                            };
                                            if (!labels[key]) return null;

                                            return (
                                                <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center">
                                                    <label className="text-xs text-gray-400 uppercase font-bold mb-2">{labels[key]}</label>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleEditStatChange(key, (value as number) - 1)}
                                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-xl font-mono font-bold w-8 text-center">{value as number}</span>
                                                        <button
                                                            onClick={() => handleEditStatChange(key, (value as number) + 1)}
                                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // --- VIEW MODE ---
                                <>
                                    {/* Score Recap */}
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <div className="text-sm text-gray-400 uppercase font-bold">Joueur</div>
                                            <div className="text-xl font-bold text-[var(--color-neon-blue)]">
                                                {players.find(p => p.id === selectedGame.playerId)?.name || 'Inconnu'}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-black font-mono text-white">
                                                {(selectedGame.stats.points1 * 1) + (selectedGame.stats.points2 * 2) + (selectedGame.stats.points3 * 3)}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">Points Totaux</div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Statistiques Complètes</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                                <div className="text-2xl mb-1">🎯</div>
                                                <div className="font-bold text-xl">{selectedGame.stats.points1}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">1 Pt</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                                <div className="text-2xl mb-1">🏀</div>
                                                <div className="font-bold text-xl">{selectedGame.stats.points2}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">2 Pts</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                                <div className="text-2xl mb-1">🔥</div>
                                                <div className="font-bold text-xl">{selectedGame.stats.points3}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">3 Pts</div>
                                            </div>

                                            <div className="p-3 rounded-lg bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/20 text-center">
                                                <div className="text-2xl mb-1">⛹️‍♂️</div>
                                                <div className="font-bold text-xl text-[var(--color-neon-green)]">{selectedGame.stats.rebounds}</div>
                                                <div className="text-[10px] text-[var(--color-neon-green)]/70 uppercase">Rebonds</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/20 text-center">
                                                <div className="text-2xl mb-1">🎁</div>
                                                <div className="font-bold text-xl text-[var(--color-neon-green)]">{selectedGame.stats.assists}</div>
                                                <div className="text-[10px] text-[var(--color-neon-green)]/70 uppercase">Passes</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/20 text-center">
                                                <div className="text-2xl mb-1">🧤</div>
                                                <div className="font-bold text-xl text-[var(--color-neon-green)]">{selectedGame.stats.steals}</div>
                                                <div className="text-[10px] text-[var(--color-neon-green)]/70 uppercase">Intercep.</div>
                                            </div>

                                            <div className="p-3 rounded-lg bg-[var(--color-neon-purple)]/10 border border-[var(--color-neon-purple)]/20 text-center">
                                                <div className="text-2xl mb-1">🧱</div>
                                                <div className="font-bold text-xl text-[var(--color-neon-purple)]">{selectedGame.stats.blocks}</div>
                                                <div className="text-[10px] text-[var(--color-neon-purple)]/70 uppercase">Contres</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                                                <div className="text-2xl mb-1">🥔</div>
                                                <div className="font-bold text-xl text-orange-500">{selectedGame.stats.turnovers}</div>
                                                <div className="text-[10px] text-orange-500/70 uppercase">Balles P.</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                                <div className="text-2xl mb-1">👮</div>
                                                <div className="font-bold text-xl text-red-500">{selectedGame.stats.fouls}</div>
                                                <div className="text-[10px] text-red-500/70 uppercase">Fautes</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={cancelEditing} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
                                        Annuler
                                    </button>
                                    <button onClick={saveEditing} className="px-6 py-2 bg-[var(--color-neon-green)] hover:bg-green-400 text-black rounded-lg font-bold transition-colors">
                                        Terminer
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setSelectedGame(null)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
                                    Fermer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Tableau de Bord</h2>
                    <p className="text-gray-400">Statistiques avancées</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg p-2 text-white transition-colors"
                        title="Exporter les données (JSON)"
                    >
                        <Download size={20} />
                    </button>
                    <select
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-white min-w-[200px] focus:outline-none focus:border-[var(--color-neon-blue)]"
                    >
                        <option value="all">Tous les joueurs</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono">{totalGames}</div>
                        <div className="text-xs text-gray-400 uppercase font-bold">Matchs</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono">{avgPoints}</div>
                        <div className="text-xs text-gray-400 uppercase font-bold">PTS / M</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono">{avgRebounds}</div>
                        <div className="text-xs text-gray-400 uppercase font-bold">REB / M</div>
                    </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono">{avgAssists}</div>
                        <div className="text-xs text-gray-400 uppercase font-bold">PAS / M</div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            {totalGames > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)] md:col-span-2">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-[var(--color-neon-blue)]" />
                            Évolution des Points
                        </h3>
                        <div className="h-[250px]">
                            <Line options={chartOptions} data={lineData} />
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)]">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <PieIcon size={20} className="text-[var(--color-neon-purple)]" />
                            Répartition des Points
                        </h3>
                        <div className="h-[200px] flex justify-center">
                            <Doughnut options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#ccc' } } } }} data={doughnutData} />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)]">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <BarChart3 size={20} className="text-[var(--color-neon-green)]" />
                            Performance Moyenne
                        </h3>
                        <div className="h-[200px]">
                            <Bar options={chartOptions} data={barData} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 glass-panel rounded-xl text-gray-500">
                    Enregistrez des matchs pour voir apparaître les graphiques.
                </div>
            )}

            {/* Recent History */}
            <h3 className="text-xl font-bold mt-8 flex items-center gap-2">
                <History size={20} className="text-[var(--color-neon-blue)]" />
                Historique Récent
            </h3>

            <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 glass-panel rounded-xl">
                        Aucun match trouvé pour ce filtre.
                    </div>
                ) : (
                    filteredHistory.slice().reverse().map((game) => {
                        const pts = (game.stats.points1 * 1) + (game.stats.points2 * 2) + (game.stats.points3 * 3);
                        const player = players.find(p => p.id === game.playerId);
                        return (
                            <div
                                key={game.id}
                                onClick={() => setSelectedGame(game)}
                                className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] hover:border-[var(--color-neon-blue)] hover:bg-white/5 cursor-pointer transition-all flex justify-between items-center group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-[var(--color-neon-blue)] group-hover:text-black transition-colors">
                                        <CalendarDays size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg flex items-center gap-2">
                                            {game.opponent || "Match d'entraînement"}
                                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400 font-normal">
                                                {player?.name || 'Inconnu'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">{new Date(game.date).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 md:gap-8 text-right">
                                    <div>
                                        <div className="text-xl font-bold font-mono text-[var(--color-neon-blue)]">{pts}</div>
                                        <div className="text-[10px] text-gray-500 font-bold">PTS</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold font-mono text-[var(--color-neon-green)]">{game.stats.rebounds}</div>
                                        <div className="text-[10px] text-gray-500 font-bold">REB</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold font-mono text-[var(--color-neon-purple)]">{game.stats.assists}</div>
                                        <div className="text-[10px] text-gray-500 font-bold">PAS</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Dashboard;
