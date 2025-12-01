// ============================================
// MODULE: STATISTIQUES ET GRAPHIQUES
// ============================================

const StatsModule = {
    charts: {
        pointsChart: null,
        distributionChart: null,
        comparisonChart: null
    },

    // Initialiser ou mettre à jour les graphiques
    initCharts(matches = null) {
        // Si les graphiques existent déjà, on met juste à jour les données
        if (this.charts.pointsChart) {
            this.updatePointsEvolutionChart(matches);
            this.updatePointsDistributionChart(matches);
            this.updateStatsComparisonChart(matches);
        } else {
            // Sinon on les crée
            this.createPointsEvolutionChart(matches);
            this.createPointsDistributionChart(matches);
            this.createStatsComparisonChart(matches);
        }
    },

    // Graphique d'évolution des points
    createPointsEvolutionChart(preFilteredMatches = null) {
        const ctx = document.getElementById('points-chart');
        if (!ctx) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        // Cloner pour ne pas affecter l'ordre original si on trie
        matches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = matches.map((m, i) => `Match ${i + 1}`);
        const data = matches.map(m => m.stats.totalPoints);

        this.charts.pointsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Points par match',
                    data: data,
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#FF6B35',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#F9FAFB', font: { size: 14, family: 'Inter' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#D1D5DB',
                        borderColor: '#FF6B35',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#D1D5DB', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#D1D5DB', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    },

    // Mettre à jour le graphique d'évolution
    updatePointsEvolutionChart(preFilteredMatches = null) {
        if (!this.charts.pointsChart) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        matches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = matches.map((m, i) => `Match ${i + 1}`);
        const data = matches.map(m => m.stats.totalPoints);

        this.charts.pointsChart.data.labels = labels;
        this.charts.pointsChart.data.datasets[0].data = data;
        this.charts.pointsChart.update();
    },

    // Graphique de répartition des points
    createPointsDistributionChart(preFilteredMatches = null) {
        const ctx = document.getElementById('points-distribution-chart');
        if (!ctx) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        let total1 = 0, total2 = 0, total3 = 0;
        matches.forEach(m => {
            total1 += m.stats.points1 || 0;
            total2 += (m.stats.points2 || 0) * 2;
            total3 += (m.stats.points3 || 0) * 3;
        });

        this.charts.distributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Lancers Francs (1pt)', '2 Points', '3 Points'],
                datasets: [{
                    data: [total1, total2, total3],
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
                    borderColor: '#0A0E1A',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#F9FAFB',
                            font: { size: 14, family: 'Inter' },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#D1D5DB',
                        borderColor: '#FF6B35',
                        borderWidth: 1
                    }
                }
            }
        });
    },

    // Mettre à jour le graphique de répartition
    updatePointsDistributionChart(preFilteredMatches = null) {
        if (!this.charts.distributionChart) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        let total1 = 0, total2 = 0, total3 = 0;
        matches.forEach(m => {
            total1 += m.stats.points1 || 0;
            total2 += (m.stats.points2 || 0) * 2;
            total3 += (m.stats.points3 || 0) * 3;
        });

        this.charts.distributionChart.data.datasets[0].data = [total1, total2, total3];
        this.charts.distributionChart.update();
    },

    // Graphique de comparaison des stats
    createStatsComparisonChart(preFilteredMatches = null) {
        const ctx = document.getElementById('stats-comparison-chart');
        if (!ctx) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        if (matches.length === 0) return;

        const totals = {
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            fouls: 0
        };

        matches.forEach(m => {
            totals.rebounds += m.stats.rebounds || 0;
            totals.assists += m.stats.assists || 0;
            totals.steals += m.stats.steals || 0;
            totals.blocks += m.stats.blocks || 0;
            totals.turnovers += m.stats.turnovers || 0;
            totals.fouls += m.stats.fouls || 0;
        });

        const avgMatches = matches.length;
        const averages = Object.keys(totals).map(key => (totals[key] / avgMatches).toFixed(1));

        this.charts.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Rebonds', 'Passes D.', 'Interceptions', 'Contres', 'Balles Perdues', 'Fautes'],
                datasets: [{
                    label: 'Moyenne par match',
                    data: averages,
                    backgroundColor: [
                        '#8B5CF6',
                        '#06B6D4',
                        '#EC4899',
                        '#EF4444',
                        '#F97316',
                        '#DC2626'
                    ],
                    borderColor: '#0A0E1A',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#F9FAFB', font: { size: 14, family: 'Inter' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#D1D5DB',
                        borderColor: '#FF6B35',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#D1D5DB', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#D1D5DB', font: { size: 12 } },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // Mettre à jour le graphique de comparaison
    updateStatsComparisonChart(preFilteredMatches = null) {
        if (!this.charts.comparisonChart) return;

        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        if (matches.length === 0) {
            this.charts.comparisonChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
            this.charts.comparisonChart.update();
            return;
        }

        const totals = {
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            fouls: 0
        };

        matches.forEach(m => {
            totals.rebounds += m.stats.rebounds || 0;
            totals.assists += m.stats.assists || 0;
            totals.steals += m.stats.steals || 0;
            totals.blocks += m.stats.blocks || 0;
            totals.turnovers += m.stats.turnovers || 0;
            totals.fouls += m.stats.fouls || 0;
        });

        const avgMatches = matches.length;
        const averages = Object.keys(totals).map(key => (totals[key] / avgMatches).toFixed(1));

        this.charts.comparisonChart.data.datasets[0].data = averages;
        this.charts.comparisonChart.update();
    },

    // Filtrer les matchs
    getFilteredMatches(playerFilter, periodFilter) {
        let matches = MatchesModule.getAllMatches();

        // Filtrer par joueur
        if (playerFilter !== 'all') {
            matches = matches.filter(m => m.playerId === playerFilter);
        }

        // Filtrer par période
        if (periodFilter === 'last5') {
            matches = matches.slice(-5);
        } else if (periodFilter === 'last10') {
            matches = matches.slice(-10);
        }

        return matches;
    },

    // Mettre à jour les cartes de stats
    updateDashboardCards(preFilteredMatches = null) {
        let matches = preFilteredMatches;
        if (!matches) {
            const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
            const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
            matches = this.getFilteredMatches(playerFilter, periodFilter);
        }

        if (matches.length === 0) {
            document.getElementById('avg-points').textContent = '0.0';
            document.getElementById('avg-rebounds').textContent = '0.0';
            document.getElementById('avg-assists').textContent = '0.0';
            document.getElementById('total-matches').textContent = '0';
            return;
        }

        const totals = {
            points: 0,
            rebounds: 0,
            assists: 0
        };

        matches.forEach(m => {
            totals.points += m.stats.totalPoints || 0;
            totals.rebounds += m.stats.rebounds || 0;
            totals.assists += m.stats.assists || 0;
        });

        document.getElementById('avg-points').textContent = (totals.points / matches.length).toFixed(1);
        document.getElementById('avg-rebounds').textContent = (totals.rebounds / matches.length).toFixed(1);
        document.getElementById('avg-assists').textContent = (totals.assists / matches.length).toFixed(1);
        document.getElementById('total-matches').textContent = matches.length;
    },

    // Mettre à jour tout le dashboard
    updateDashboard() {
        // Optimisation : on récupère les matchs filtrés UNE SEULE FOIS
        const playerFilter = document.getElementById('dashboard-player-filter')?.value || 'all';
        const periodFilter = document.getElementById('dashboard-period-filter')?.value || 'all';
        const matches = this.getFilteredMatches(playerFilter, periodFilter);

        this.updateDashboardCards(matches);
        this.initCharts(matches);
    },

    // Afficher les stats de la saison (page d'accueil)
    renderSeasonStats() {
        const container = document.getElementById('season-stats-preview');
        if (!container) return;

        const matches = MatchesModule.getAllMatches();

        if (matches.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Aucune statistique disponible</p>';
            return;
        }

        let totalPoints = 0, totalRebounds = 0, totalAssists = 0, totalMatches = matches.length;

        matches.forEach(m => {
            totalPoints += m.stats.totalPoints || 0;
            totalRebounds += m.stats.rebounds || 0;
            totalAssists += m.stats.assists || 0;
        });

        container.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${(totalPoints / totalMatches).toFixed(1)}</div>
        <div class="stat-label">Moy. Points</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${(totalRebounds / totalMatches).toFixed(1)}</div>
        <div class="stat-label">Moy. Rebonds</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${(totalAssists / totalMatches).toFixed(1)}</div>
        <div class="stat-label">Moy. Passes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalMatches}</div>
        <div class="stat-label">Matchs Joués</div>
      </div>
    `;
    },

    // Afficher les derniers matchs (page d'accueil)
    renderRecentMatches() {
        const container = document.getElementById('recent-matches');
        if (!container) return;

        let matches = MatchesModule.getAllMatches();
        matches.sort((a, b) => new Date(b.date) - new Date(a.date));
        matches = matches.slice(0, 3);

        if (matches.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Aucun match récent</p>';
            return;
        }

        container.innerHTML = matches.map(match => {
            const matchDate = new Date(match.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });

            return `
        <div class="flex flex-between mb-md" style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div>
            <strong>${match.playerName}</strong> vs ${match.opponent}
            <div class="text-muted" style="font-size: 0.85rem;">${matchDate}</div>
          </div>
          <div class="text-right">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-orange);">${match.stats.totalPoints} pts</div>
            <div class="text-muted" style="font-size: 0.85rem;">${match.stats.rebounds} reb  •  ${match.stats.assists} ast</div>
          </div>
        </div>
      `;
        }).join('');
    }
};

// Exposer globalement
window.StatsModule = StatsModule;
