// ============================================
// MODULE: GESTION DES MATCHS
// ============================================

const MatchesModule = {
    currentMatch: null,
    actionsHistory: [],
    longPressTimer: null,
    longPressAction: null,
    matchesCache: null, // Cache pour les données
    domCache: {}, // Cache pour les éléments DOM
    lastActionTime: 0, // Pour le debounce
    lastActionType: null, // Pour le debounce

    // Récupérer tous les matchs (avec cache)
    getAllMatches() {
        if (!this.matchesCache) {
            const matches = localStorage.getItem('basketball_matches');
            this.matchesCache = matches ? JSON.parse(matches) : [];
        }
        return this.matchesCache;
    },

    // Sauvegarder les matchs
    saveMatches(matches) {
        this.matchesCache = matches; // Mettre à jour le cache
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

        // Initialiser le cache DOM pour le match
        setTimeout(() => this.initLiveStatsUI(), 100);

        return true;
    },

    // Initialiser le cache des éléments DOM
    initLiveStatsUI() {
        this.domCache = {
            points1: document.querySelector('[data-stat="points1"]'),
            points2: document.querySelector('[data-stat="points2"]'),
            points3: document.querySelector('[data-stat="points3"]'),
            rebounds: document.querySelector('[data-stat="rebounds"]'),
            assists: document.querySelector('[data-stat="assists"]'),
            steals: document.querySelector('[data-stat="steals"]'),
            blocks: document.querySelector('[data-stat="blocks"]'),
            turnovers: document.querySelector('[data-stat="turnovers"]'),
            fouls: document.querySelector('[data-stat="fouls"]'),
            container: document.getElementById('live-stats')
        };
    },

    // Ajouter une action
    addAction(actionType) {
        if (!this.currentMatch) return;

        // Debounce : Empêcher la même action d'être ajoutée deux fois en moins de 500ms
        // Cela corrige définitivement le problème de "double tap" sur mobile
        const now = Date.now();
        if (actionType === this.lastActionType && (now - this.lastActionTime < 500)) {
            console.log('🚫 Double action prevented (Debounce)');
            return;
        }
        this.lastActionTime = now;
        this.lastActionType = actionType;

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
                if (this.currentMatch.stats.fouls >= 5) {
                    alert('⚠️ Maximum de 5 fautes atteint ! Le joueur est exclu.');
                    return; // Ne pas ajouter plus de 5 fautes
                }
                this.currentMatch.stats.fouls++;

                // Vérifier si on a atteint 5 fautes
                if (this.currentMatch.stats.fouls === 5) {
                    this.updateLiveStats(); // Mettre à jour l'affichage avant l'alerte
                    setTimeout(() => {
                        if (window.HapticModule) HapticModule.error();
                        if (confirm('🚫 5 Fautes atteintes ! Le joueur est exclu.\nVoulez-vous terminer le match maintenant ?')) {
                            this.endMatch();
                        }
                    }, 100);
                }
                break;
        }

        this.updateLiveStats();
    },

    // Annuler la dernière action
    undoLastAction() {
        if (!this.currentMatch || this.actionsHistory.length === 0) return;

        const lastAction = this.actionsHistory.pop();
        this.decrementStats(lastAction.type);
        this.updateLiveStats();
    },

    // Annuler une action spécifique (pour l'appui long)
    undoSpecificAction(actionType) {
        if (!this.currentMatch) return;

        // Trouver la dernière occurrence de ce type d'action
        let index = -1;
        for (let i = this.actionsHistory.length - 1; i >= 0; i--) {
            if (this.actionsHistory[i].type === actionType) {
                index = i;
                break;
            }
        }

        if (index === -1) return; // Pas d'action de ce type trouvée

        // Supprimer de l'historique
        this.actionsHistory.splice(index, 1);

        // Décrémenter les stats
        this.decrementStats(actionType);
        this.updateLiveStats();
    },

    // Helper pour décrémenter les stats
    decrementStats(actionType) {
        switch (actionType) {
            case 'freethrow':
                this.currentMatch.stats.points1 = Math.max(0, this.currentMatch.stats.points1 - 1);
                this.currentMatch.stats.totalPoints = Math.max(0, this.currentMatch.stats.totalPoints - 1);
                break;
            case '2points':
                this.currentMatch.stats.points2 = Math.max(0, this.currentMatch.stats.points2 - 1);
                this.currentMatch.stats.totalPoints = Math.max(0, this.currentMatch.stats.totalPoints - 2);
                break;
            case '3points':
                this.currentMatch.stats.points3 = Math.max(0, this.currentMatch.stats.points3 - 1);
                this.currentMatch.stats.totalPoints = Math.max(0, this.currentMatch.stats.totalPoints - 3);
                break;
            case 'rebound':
                this.currentMatch.stats.rebounds = Math.max(0, this.currentMatch.stats.rebounds - 1);
                break;
            case 'assist':
                this.currentMatch.stats.assists = Math.max(0, this.currentMatch.stats.assists - 1);
                break;
            case 'steal':
                this.currentMatch.stats.steals = Math.max(0, this.currentMatch.stats.steals - 1);
                break;
            case 'block':
                this.currentMatch.stats.blocks = Math.max(0, this.currentMatch.stats.blocks - 1);
                break;
            case 'turnover':
                this.currentMatch.stats.turnovers = Math.max(0, this.currentMatch.stats.turnovers - 1);
                break;
            case 'foul':
                this.currentMatch.stats.fouls = Math.max(0, this.currentMatch.stats.fouls - 1);
                break;
        }
    },

    // Mettre à jour l'affichage des stats en direct
    updateLiveStats() {
        if (!this.currentMatch) return;

        const stats = this.currentMatch.stats;

        // Si le cache DOM n'est pas initialisé (ex: rechargement de page), on l'initialise
        if (!this.domCache.points1) {
            this.initLiveStatsUI();
        }

        // Utiliser le cache pour mettre à jour les compteurs
        if (this.domCache.points1) this.domCache.points1.textContent = stats.points1;
        if (this.domCache.points2) this.domCache.points2.textContent = stats.points2;
        if (this.domCache.points3) this.domCache.points3.textContent = stats.points3;
        if (this.domCache.rebounds) this.domCache.rebounds.textContent = stats.rebounds;
        if (this.domCache.assists) this.domCache.assists.textContent = stats.assists;
        if (this.domCache.steals) this.domCache.steals.textContent = stats.steals;
        if (this.domCache.blocks) this.domCache.blocks.textContent = stats.blocks;
        if (this.domCache.turnovers) this.domCache.turnovers.textContent = stats.turnovers;
        if (this.domCache.fouls) this.domCache.fouls.textContent = stats.fouls;

        // Mettre à jour les cartes de stats
        if (this.domCache.container) {
            this.domCache.container.innerHTML = `
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

        const finishedMatch = this.currentMatch; // Garder une référence pour le partage

        // Réinitialiser
        this.currentMatch = null;
        this.actionsHistory = [];

        // Vibration de confirmation
        if (window.HapticModule) {
            HapticModule.confirm();
        }

        // Confetti si bon match (> 10 points)
        if (finishedMatch.stats.totalPoints >= 10 && window.ConfettiModule) {
            ConfettiModule.explode(150);
        }

        alert('Match terminé et sauvegardé ! 🎉');

        // Proposer le partage
        if (confirm('Voulez-vous partager le résultat du match ? 📤')) {
            if (window.ShareModule) {
                ShareModule.shareMatch(finishedMatch);
            }
        }

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
              <div class="flex gap-sm mt-sm justify-end">
                <button class="btn btn-secondary btn-sm" onclick="MatchesModule.shareMatch('${match.id}')">📤 Partager</button>
                <button class="btn btn-danger btn-sm" onclick="MatchesModule.deleteMatchAndRefresh('${match.id}')">🗑️</button>
              </div>
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

    // Helper pour partager un match
    shareMatch(matchId) {
        const match = this.getAllMatches().find(m => m.id === matchId);
        if (match && window.ShareModule) {
            ShareModule.shareMatch(match);
        }
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
