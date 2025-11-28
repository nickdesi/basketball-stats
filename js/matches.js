// ============================================
// MODULE: GESTION DES MATCHS
// ============================================

const MatchesModule = {
    currentMatch: null,
    actionsHistory: [],
    longPressTimer: null,
    longPressAction: null,

    // Récupérer tous les matchs
    getAllMatches() {
        const matches = localStorage.getItem('basketball_matches');
        return matches ? JSON.parse(matches) : [];
    },

    // Sauvegarder les matchs
    saveMatches(matches) {
        localStorage.setItem('basketball_matches', JSON.stringify(matches));
    },

    // Démarrer un nouveau match
    startMatch(playerId, opponent, date) {
        const player = PlayersModule.getPlayerById(playerId);
        if (!player) {
            alert('Joueur introuvable !');
            return false;
        }

        this.currentMatch = {
            id: Date.now().toString(),
            playerId: playerId,
            playerName: player.name,
            opponent: opponent || 'Match amical',
            date: date || new Date().toISOString().split('T')[0],
            startTime: new Date().toISOString(),
            endTime: null,
            stats: {
                points1: 0,  // Lancers francs
                points2: 0,  // 2 points
                points3: 0,  // 3 points
                totalPoints: 0,
                rebounds: 0,
                assists: 0,
                steals: 0,
                blocks: 0,
                turnovers: 0,
                fouls: 0
            }
        };

        this.actionsHistory = [];
        return true;
    },

    // Ajouter une action
    addAction(actionType) {
        if (!this.currentMatch) return;

        // Retour haptique medium
        if (window.HapticModule) {
            HapticModule.medium();
        }

        const action = {
            type: actionType,
            timestamp: new Date().toISOString()
        };

        this.actionsHistory.push(action);

        // Mettre à jour les stats
        switch (actionType) {
            case 'freethrow':
                this.currentMatch.stats.points1++;
                this.currentMatch.stats.totalPoints += 1;
                break;
            case '2points':
                this.currentMatch.stats.points2++;
                this.currentMatch.stats.totalPoints += 2;
                break;
            case '3points':
                this.currentMatch.stats.points3++;
                this.currentMatch.stats.totalPoints += 3;
                break;
            case 'rebound':
                this.currentMatch.stats.rebounds++;
                break;
            case 'assist':
                this.currentMatch.stats.assists++;
                break;
            case 'steal':
                this.currentMatch.stats.steals++;
                break;
            case 'block':
                this.currentMatch.stats.blocks++;
                break;
            case 'turnover':
                this.currentMatch.stats.turnovers++;
                break;
            case 'foul':
                this.currentMatch.stats.fouls++;
                break;
        }

        this.updateLiveStats();
    },

    // Annuler la dernière action
    undoLastAction() {
        if (!this.currentMatch || this.actionsHistory.length === 0) return;

        const lastAction = this.actionsHistory.pop();

        // Inverser la stat
        switch (lastAction.type) {
            case 'freethrow':
                this.currentMatch.stats.points1--;
                this.currentMatch.stats.totalPoints -= 1;
                break;
            case '2points':
                this.currentMatch.stats.points2--;
                this.currentMatch.stats.totalPoints -= 2;
                break;
            case '3points':
                this.currentMatch.stats.points3--;
                this.currentMatch.stats.totalPoints -= 3;
                break;
            case 'rebound':
                this.currentMatch.stats.rebounds--;
                break;
            case 'assist':
                this.currentMatch.stats.assists--;
                break;
            case 'steal':
                this.currentMatch.stats.steals--;
                break;
            case 'block':
                this.currentMatch.stats.blocks--;
                break;
            case 'turnover':
                this.currentMatch.stats.turnovers--;
                break;
            case 'foul':
                this.currentMatch.stats.fouls--;
                break;
        }

        this.updateLiveStats();
    },

    // Mettre à jour l'affichage des stats en direct
    updateLiveStats() {
        if (!this.currentMatch) return;

        const stats = this.currentMatch.stats;

        // Mettre à jour les compteurs sur les boutons
        document.querySelector('[data-stat="points1"]').textContent = stats.points1;
        document.querySelector('[data-stat="points2"]').textContent = stats.points2;
        document.querySelector('[data-stat="points3"]').textContent = stats.points3;
        document.querySelector('[data-stat="rebounds"]').textContent = stats.rebounds;
        document.querySelector('[data-stat="assists"]').textContent = stats.assists;
        document.querySelector('[data-stat="steals"]').textContent = stats.steals;
        document.querySelector('[data-stat="blocks"]').textContent = stats.blocks;
        document.querySelector('[data-stat="turnovers"]').textContent = stats.turnovers;
        document.querySelector('[data-stat="fouls"]').textContent = stats.fouls;

        // Mettre à jour les cartes de stats
        const liveStatsContainer = document.getElementById('live-stats');
        if (liveStatsContainer) {
            liveStatsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-value">${stats.totalPoints}</div>
          <div class="stat-label">Points Totaux</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.rebounds}</div>
          <div class="stat-label">Rebonds</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.assists}</div>
          <div class="stat-label">Passes D.</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.steals}</div>
          <div class="stat-label">Interceptions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.blocks}</div>
          <div class="stat-label">Contres</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.fouls}</div>
          <div class="stat-label">Fautes</div>
        </div>
      `;
        }

        // Mettre à jour les graphiques si on est sur le dashboard
        if (window.StatsModule && window.StatsModule.updateDashboard) {
            window.StatsModule.updateDashboard();
        }
    },

    // Terminer le match
    endMatch() {
        if (!this.currentMatch) return;

        if (!confirm('Voulez-vous terminer ce match ?')) return;

        this.currentMatch.endTime = new Date().toISOString();

        // Sauvegarder le match
        const matches = this.getAllMatches();
        matches.push(this.currentMatch);
        this.saveMatches(matches);

        // Mettre à jour les stats du joueur
        PlayersModule.updatePlayerStats(this.currentMatch.playerId, this.currentMatch.stats);

        // Réinitialiser
        this.currentMatch = null;
        this.actionsHistory = [];

        // Vibration de confirmation
        if (window.HapticModule) {
            HapticModule.confirm();
        }

        // Confetti si bon match (> 10 points)
        if (this.currentMatch.stats.totalPoints >= 10 && window.ConfettiModule) {
            ConfettiModule.explode(150);
        }

        alert('Match terminé et sauvegardé ! 🎉');

        // Retourner à l'accueil
        if (window.AppModule && window.AppModule.showView) {
            window.AppModule.showView('home');
        }
    },

    // Récupérer le match actuel
    getCurrentMatch() {
        return this.currentMatch;
    },

    // Supprimer un match
    deleteMatch(matchId) {
        let matches = this.getAllMatches();
        const match = matches.find(m => m.id === matchId);

        if (match && confirm('Supprimer ce match ?')) {
            matches = matches.filter(m => m.id !== matchId);
            this.saveMatches(matches);
            return true;
        }
        return false;
    },

    // Afficher l'historique
    renderMatchHistory(playerFilter = 'all', sortBy = 'date-desc') {
        let matches = this.getAllMatches();

        // Filtrer par joueur
        if (playerFilter !== 'all') {
            matches = matches.filter(m => m.playerId === playerFilter);
        }

        // Trier
        matches.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'points-desc':
                    return b.stats.totalPoints - a.stats.totalPoints;
                default:
                    return 0;
            }
        });

        const container = document.getElementById('matches-list');
        if (!container) return;

        if (matches.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Aucun match enregistré.</p>';
            return;
        }

        container.innerHTML = matches.map(match => {
            const matchDate = new Date(match.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const isMVP = match.stats.totalPoints >= 20;
            const mvpBadge = isMVP ? '<span class="badge badge-gold" style="margin-right: 5px;">🏆 MVP</span>' : '';

            return `
        <div class="card mb-md" ${isMVP ? 'style="border: 1px solid #FFD700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);"' : ''}>
          <div class="card-header">
            <div>
              <h4 style="margin: 0;">${match.playerName}</h4>
              <p class="text-muted" style="margin: 0;">vs ${match.opponent}</p>
            </div>
            <div class="text-right">
              ${mvpBadge}
              <div class="badge badge-primary">${matchDate}</div>
              <button class="btn btn-danger mt-sm" onclick="MatchesModule.deleteMatchAndRefresh('${match.id}')">🗑️</button>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${match.stats.totalPoints}</div>
              <div class="stat-label">Points</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${match.stats.rebounds}</div>
              <div class="stat-label">Rebonds</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${match.stats.assists}</div>
              <div class="stat-label">Passes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${match.stats.steals}</div>
              <div class="stat-label">Interceptions</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${match.stats.blocks}</div>
              <div class="stat-label">Contres</div>
            </div>
          </div>
        </div>
      `;
        }).join('');
    },

    // Helper pour supprimer et rafraîchir
    deleteMatchAndRefresh(matchId) {
        if (this.deleteMatch(matchId)) {
            // Rafraîchir l'affichage
            const playerFilter = document.getElementById('history-player-filter')?.value || 'all';
            const sortBy = document.getElementById('history-sort')?.value || 'date-desc';
            this.renderMatchHistory(playerFilter, sortBy);
        }
    }
};

// Exposer globalement
window.MatchesModule = MatchesModule;
