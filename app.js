// ============================================
// APPLICATION PRINCIPALE - BASKETBALL STATS PRO
// ============================================

const AppModule = {
    // Initialiser l'application
    init() {
        console.log('🏀 Basketball Stats Pro - Initialisation...');

        // Configurer la navigation
        this.setupNavigation();

        // Configurer les événements
        this.setupEventListeners();

        // Charger les données initiales
        this.loadInitialData();

        // Ajouter les boutons d'export
        ExportModule.addExportButtons();

        // Afficher la vue d'accueil
        this.showView('home');

        console.log('✅ Application prête !');
    },

    // Configuration de la navigation
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewName = btn.getAttribute('data-view');
                if (viewName) {
                    this.showView(viewName);
                }
            });
        });
    },

    // Afficher une vue
    showView(viewName) {
        // Cacher toutes les vues
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Désactiver tous les boutons de nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Activer la vue sélectionnée
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Activer le bouton de nav correspondant
        const targetBtn = document.querySelector(`[data-view="${viewName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Actions spécifiques par vue
        switch (viewName) {
            case 'home':
                this.refreshHomePage();
                break;
            case 'live-match':
                this.checkActiveLiveMatch();
                break;
            case 'dashboard':
                this.refreshDashboard();
                break;
            case 'history':
                this.refreshHistory();
                break;
            case 'players':
                PlayersModule.renderPlayersList();
                break;
        }
    },

    // Configuration des événements
    setupEventListeners() {
        // === PAGE JOUEURS ===
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                const name = document.getElementById('player-name-input').value;
                const number = document.getElementById('player-number-input').value;
                const position = document.getElementById('player-position-input').value;

                if (!name.trim()) {
                    HapticModule.error();
                    alert('Veuillez entrer un nom de joueur !');
                    return;
                }

                PlayersModule.addPlayer(name, number, position);

                // Réinitialiser le formulaire
                document.getElementById('player-name-input').value = '';
                document.getElementById('player-number-input').value = '';
                document.getElementById('player-position-input').value = '';

                // Rafraîchir l'affichage
                PlayersModule.renderPlayersList();
                this.updatePlayerSelects();

                // Feedback visuel et haptique
                HapticModule.success();
                addPlayerBtn.classList.add('success-feedback');
                setTimeout(() => addPlayerBtn.classList.remove('success-feedback'), 500);
            });
        }

        // === PAGE ACCUEIL - Démarrer un match ===
        const startMatchBtn = document.getElementById('start-match-btn');
        if (startMatchBtn) {
            startMatchBtn.addEventListener('click', () => {
                const playerId = document.getElementById('player-select').value;
                const opponent = document.getElementById('opponent-input').value;
                const matchDate = document.getElementById('match-date').value;

                if (!playerId) {
                    HapticModule.error();
                    alert('Veuillez sélectionner un joueur !');
                    return;
                }

                if (MatchesModule.startMatch(playerId, opponent, matchDate)) {
                    HapticModule.success();
                    // Aller à la vue match en direct
                    this.showView('live-match');
                    this.initializeLiveMatch();
                }
            });
        }

        // === PAGE MATCH EN DIRECT - Boutons d'actions ===
        const actionButtons = document.querySelectorAll('.action-btn');
        let lastTouchTime = 0; // Variable pour éviter les doubles clics (ghost clicks)

        actionButtons.forEach(btn => {
            let longPressTimer;
            let longPressTriggered = false;

            // Touch start / Mouse down
            const startPress = (e) => {
                // Ignorer les événements souris qui suivent immédiatement un touch (ghost clicks)
                if (e.type === 'mousedown' && Date.now() - lastTouchTime < 800) {
                    return;
                }

                // Empêcher le comportement par défaut pour le touch
                if (e.type === 'touchstart') {
                    lastTouchTime = Date.now();
                    // IMPORTANT: preventDefault ici empêche souvent la génération du mousedown/click
                    // mais certains navigateurs mobiles peuvent être capricieux.
                    // Le debounce dans MatchesModule.addAction est la sécurité finale.
                    e.preventDefault();
                }

                longPressTriggered = false;
                const action = btn.getAttribute('data-action');

                // Ajouter classe visuelle
                btn.classList.add('long-pressing');

                longPressTimer = setTimeout(() => {
                    // Appui long = annuler la dernière action de CE type
                    longPressTriggered = true;
                    if (MatchesModule.getCurrentMatch()) {
                        MatchesModule.undoSpecificAction(action);
                        HapticModule.heavy();
                        btn.style.transform = 'scale(0.9)';
                        setTimeout(() => btn.style.transform = '', 200);
                    }
                }, 500); // 500ms pour activer l'appui long
            };

            // Touch end / Mouse up
            const endPress = (e) => {
                // Ignorer les événements souris qui suivent immédiatement un touch
                if (e.type === 'mouseup' && Date.now() - lastTouchTime < 800) {
                    return;
                }

                if (e.type === 'touchend') {
                    lastTouchTime = Date.now();
                    e.preventDefault();
                }

                clearTimeout(longPressTimer);
                btn.classList.remove('long-pressing');

                if (!longPressTriggered) {
                    // Appui court = ajouter l'action
                    const action = btn.getAttribute('data-action');
                    if (action && MatchesModule.getCurrentMatch()) {
                        MatchesModule.addAction(action);

                        // Feedback visuel
                        btn.classList.add('success-feedback');
                        setTimeout(() => btn.classList.remove('success-feedback'), 500);
                    }
                }
            };

            // Annuler si on quitte le bouton
            const cancelPress = (e) => {
                if (e.type === 'touchcancel') {
                    e.preventDefault();
                }
                clearTimeout(longPressTimer);
                btn.classList.remove('long-pressing');
            };

            // Evénements touch (mobile)
            // Utiliser { passive: false } pour pouvoir utiliser preventDefault
            btn.addEventListener('touchstart', startPress, { passive: false });
            btn.addEventListener('touchend', endPress);
            btn.addEventListener('touchcancel', cancelPress);

            // Événements mouse (desktop)
            btn.addEventListener('mousedown', startPress);
            btn.addEventListener('mouseup', endPress);
            btn.addEventListener('mouseleave', cancelPress);
        });

        // Bouton Annuler (Undo)
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                MatchesModule.undoLastAction();
                HapticModule.heavy();
            });
        }

        // Bouton Terminer le match
        const endMatchBtn = document.getElementById('end-match-btn');
        if (endMatchBtn) {
            endMatchBtn.addEventListener('click', () => {
                MatchesModule.endMatch();
            });
        }

        // === PAGE DASHBOARD - Filtres ===
        const dashPlayerFilter = document.getElementById('dashboard-player-filter');
        const dashPeriodFilter = document.getElementById('dashboard-period-filter');

        if (dashPlayerFilter) {
            dashPlayerFilter.addEventListener('change', () => {
                StatsModule.updateDashboard();
            });
        }

        if (dashPeriodFilter) {
            dashPeriodFilter.addEventListener('change', () => {
                StatsModule.updateDashboard();
            });
        }

        // === PAGE HISTORIQUE - Filtres ===
        const histPlayerFilter = document.getElementById('history-player-filter');
        const histSort = document.getElementById('history-sort');

        if (histPlayerFilter) {
            histPlayerFilter.addEventListener('change', () => {
                const playerFilter = histPlayerFilter.value;
                const sortBy = histSort?.value || 'date-desc';
                MatchesModule.renderMatchHistory(playerFilter, sortBy);
            });
        }

        if (histSort) {
            histSort.addEventListener('change', () => {
                const playerFilter = histPlayerFilter?.value || 'all';
                const sortBy = histSort.value;
                MatchesModule.renderMatchHistory(playerFilter, sortBy);
            });
        }
    },

    // Charger les données initiales
    loadInitialData() {
        // Peupler les selects de joueurs
        this.updatePlayerSelects();

        // Définir la date du jour par défaut
        const matchDateInput = document.getElementById('match-date');
        if (matchDateInput) {
            matchDateInput.value = new Date().toISOString().split('T')[0];
        }
    },

    // Mettre à jour tous les selects de joueurs
    updatePlayerSelects() {
        PlayersModule.populatePlayerSelect('player-select');
        PlayersModule.populatePlayerSelect('dashboard-player-filter');
        PlayersModule.populatePlayerSelect('history-player-filter');
    },

    // Rafraîchir la page d'accueil
    refreshHomePage() {
        StatsModule.renderSeasonStats();
        StatsModule.renderRecentMatches();
        this.updatePlayerSelects();
    },

    // Vérifier s'il y a un match en cours
    checkActiveLiveMatch() {
        const currentMatch = MatchesModule.getCurrentMatch();

        if (!currentMatch) {
            alert('Aucun match en cours. Démarrez un match depuis l\'accueil !');
            this.showView('home');
            return;
        }

        this.initializeLiveMatch();
    },

    // Initialiser l'affichage du match en direct
    initializeLiveMatch() {
        const currentMatch = MatchesModule.getCurrentMatch();
        if (!currentMatch) return;

        // Afficher le nom du joueur
        const playerNameEl = document.getElementById('current-player-name');
        if (playerNameEl) {
            playerNameEl.textContent = `${currentMatch.playerName} vs ${currentMatch.opponent}`;
        }

        // Initialiser les stats à 0
        MatchesModule.updateLiveStats();
    },

    // Rafraîchir le dashboard
    refreshDashboard() {
        this.updatePlayerSelects();
        StatsModule.updateDashboard();
    },

    // Rafraîchir l'historique
    refreshHistory() {
        this.updatePlayerSelects();
        const playerFilter = document.getElementById('history-player-filter')?.value || 'all';
        const sortBy = document.getElementById('history-sort')?.value || 'date-desc';
        MatchesModule.renderMatchHistory(playerFilter, sortBy);
    }
};

// Fonction globale pour mettre à jour les selects (utilisée par les modules)
window.updatePlayerSelects = () => {
    AppModule.updatePlayerSelects();
};

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    AppModule.init();
});

// Exposer globalement
window.AppModule = AppModule;
