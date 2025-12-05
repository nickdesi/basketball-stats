// ============================================
// MODULE: EXPORT & IMPORT DE DONNÉES
// ============================================

const ExportModule = {
    // Exporter toutes les données en JSON
    exportAllDataJSON() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            players: PlayersModule.getAllPlayers(),
            matches: MatchesModule.getAllMatches()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `basketball-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Exporter en CSV - Matchs
    exportMatchesCSV() {
        const matches = MatchesModule.getAllMatches();

        if (matches.length === 0) {
            alert('Aucun match à exporter !');
            return;
        }

        const headers = [
            'Date',
            'Joueur',
            'Adversaire',
            'Points Totaux',
            'Lancers Francs',
            '2 Points',
            '3 Points',
            'Rebonds',
            'Passes Décisives',
            'Interceptions',
            'Contres',
            'Balles Perdues',
            'Fautes'
        ];

        const rows = matches.map(m => [
            m.date,
            m.playerName,
            m.opponent,
            m.stats.totalPoints,
            m.stats.points1,
            m.stats.points2,
            m.stats.points3,
            m.stats.rebounds,
            m.stats.assists,
            m.stats.steals,
            m.stats.blocks,
            m.stats.turnovers,
            m.stats.fouls
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `matchs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Exporter en CSV - Joueurs
    exportPlayersCSV() {
        const players = PlayersModule.getAllPlayers();

        if (players.length === 0) {
            alert('Aucun joueur à exporter !');
            return;
        }

        const headers = [
            'Nom',
            'Numéro',
            'Position',
            'Matchs Joués',
            'Total Points',
            'Total Rebonds',
            'Total Passes',
            'Total Interceptions',
            'Total Contres',
            'Moy. Points',
            'Moy. Rebonds',
            'Moy. Passes'
        ];

        const rows = players.map(p => {
            const avg = PlayersModule.getPlayerAverages(p.id);
            return [
                p.name,
                p.number || '',
                PlayersModule.getPositionLabel(p.position),
                p.stats.matchesPlayed,
                p.stats.totalPoints,
                p.stats.totalRebonds,
                p.stats.totalAssists,
                p.stats.totalSteals,
                p.stats.totalBlocks,
                avg.points,
                avg.rebounds,
                avg.assists
            ];
        });

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `joueurs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Importer des données JSON
    importDataJSON(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.players || !data.matches) {
                    alert('Format de fichier invalide !');
                    return;
                }

                if (confirm('Cette action va remplacer toutes vos données actuelles. Continuer ?')) {
                    PlayersModule.savePlayers(data.players);
                    MatchesModule.saveMatches(data.matches);
                    alert('Données importées avec succès ! 🎉');
                    location.reload();
                }
            } catch (error) {
                alert('Erreur lors de l\'import : ' + error.message);
            }
        };

        reader.readAsText(file);
    },

    // Ajouter les boutons d'export dans l'interface
    addExportButtons() {
        // Ajouter un bouton export dans le menu de navigation
        const nav = document.querySelector('.nav-menu');
        if (nav && !document.getElementById('export-dropdown')) {
            const exportLi = document.createElement('li');
            exportLi.className = 'nav-item';
            exportLi.innerHTML = `
        <button class="nav-btn" id="export-btn">
          <span class="icon">💾</span>
          Exporter
        </button>
      `;
            nav.appendChild(exportLi);

            // Menu dropdown pour export
            document.getElementById('export-btn').addEventListener('click', () => {
                const dropdown = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center;" id="export-modal">
            <div class="card" style="max-width: 500px; width: 90%;">
              <div class="card-header">
                <h3 class="card-title">📤 Exporter les Données</h3>
                <button onclick="document.getElementById('export-modal').remove()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
              </div>
              <div class="flex flex-column gap-md">
                <button class="btn btn-primary w-full" onclick="ExportModule.exportAllDataJSON(); document.getElementById('export-modal').remove();">
                  📦 Export Complet (JSON)
                </button>
                <button class="btn btn-secondary w-full" onclick="ExportModule.exportMatchesCSV(); document.getElementById('export-modal').remove();">
                  📊 Export Matchs (CSV)
                </button>
                <button class="btn btn-secondary w-full" onclick="ExportModule.exportPlayersCSV(); document.getElementById('export-modal').remove();">
                  👥 Export Joueurs (CSV)
                </button>
                <hr style="border-color: var(--border-color);">
                <h4>📥 Importer des Données</h4>
                <input type="file" accept=".json" id="import-file-input" class="form-input">
                <button class="btn btn-success w-full" onclick="
                  const file = document.getElementById('import-file-input').files[0];
                  if (file) {
                    ExportModule.importDataJSON(file);
                    document.getElementById('export-modal').remove();
                  } else {
                    alert('Veuillez sélectionner un fichier');
                  }
                ">
                  Importer JSON
                </button>
              </div>
            </div>
          </div>
        `;
                document.body.insertAdjacentHTML('beforeend', dropdown);
            });
        }
    }
};

// Exposer globalement
window.ExportModule = ExportModule;
