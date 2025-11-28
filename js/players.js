// ============================================
// MODULE: GESTION DES JOUEURS
// ============================================

const PlayersModule = {
  // Récupérer tous les joueurs
  getAllPlayers() {
    const players = localStorage.getItem('basketball_players');
    return players ? JSON.parse(players) : [];
  },

  // Sauvegarder les joueurs
  savePlayers(players) {
    localStorage.setItem('basketball_players', JSON.stringify(players));
  },

  // Ajouter un nouveau joueur
  addPlayer(name, number, position) {
    const players = this.getAllPlayers();
    
    const newPlayer = {
      id: Date.now().toString(),
      name: name.trim(),
      number: parseInt(number) || null,
      position: position || '',
      createdAt: new Date().toISOString(),
      stats: {
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        totalSteals: 0,
        totalBlocks: 0,
        totalTurnovers: 0,
        totalFouls: 0,
        matchesPlayed: 0
      }
    };

    players.push(newPlayer);
    this.savePlayers(players);
    return newPlayer;
  },

  // Récupérer un joueur par ID
  getPlayerById(id) {
    const players = this.getAllPlayers();
    return players.find(p => p.id === id);
  },

  // Mettre à jour les stats d'un joueur
  updatePlayerStats(playerId, matchStats) {
    const players = this.getAllPlayers();
    const player = players.find(p => p.id === playerId);
    
    if (player) {
      player.stats.totalPoints += matchStats.totalPoints || 0;
      player.stats.totalRebounds += matchStats.rebounds || 0;
      player.stats.totalAssists += matchStats.assists || 0;
      player.stats.totalSteals += matchStats.steals || 0;
      player.stats.totalBlocks += matchStats.blocks || 0;
      player.stats.totalTurnovers += matchStats.turnovers || 0;
      player.stats.totalFouls += matchStats.fouls || 0;
      player.stats.matchesPlayed += 1;
      
      this.savePlayers(players);
    }
  },

  // Supprimer un joueur
  deletePlayer(id) {
    let players = this.getAllPlayers();
    players = players.filter(p => p.id !== id);
    this.savePlayers(players);
  },

  // Calculer les moyennes d'un joueur
  getPlayerAverages(playerId) {
    const player = this.getPlayerById(playerId);
    if (!player || player.stats.matchesPlayed === 0) {
      return {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0
      };
    }

    const matches = player.stats.matchesPlayed;
    return {
      points: (player.stats.totalPoints / matches).toFixed(1),
      rebounds: (player.stats.totalRebounds / matches).toFixed(1),
      assists: (player.stats.totalAssists / matches).toFixed(1),
      steals: (player.stats.totalSteals / matches).toFixed(1),
      blocks: (player.stats.totalBlocks / matches).toFixed(1)
    };
  },

  // Afficher la liste des joueurs
  renderPlayersList() {
    const players = this.getAllPlayers();
    const container = document.getElementById('players-list');
    
    if (!container) return;

    if (players.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">Aucun joueur ajouté. Commencez par ajouter un joueur !</p>';
      return;
    }

    container.innerHTML = players.map(player => {
      const averages = this.getPlayerAverages(player.id);
      return `
        <div class="card mb-md">
          <div class="flex flex-between">
            <div style="flex: 1;">
              <h4 style="margin-bottom: 0.5rem;">
                ${player.name}
                ${player.number ? `<span class="badge badge-gold">#${player.number}</span>` : ''}
              </h4>
              ${player.position ? `<p class="text-muted" style="margin: 0;">${this.getPositionLabel(player.position)}</p>` : ''}
              <div class="stats-grid mt-md" style="grid-template-columns: repeat(3, 1fr);">
                <div>
                  <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-orange);">${averages.points}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">PTS/M</div>
                </div>
                <div>
                  <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-purple);">${averages.rebounds}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">REB/M</div>
                </div>
                <div>
                  <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan);">${averages.assists}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">AST/M</div>
                </div>
              </div>
            </div>
            <div>
              <button class="btn btn-danger" onclick="PlayersModule.confirmDeletePlayer('${player.id}')">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // Labels pour les positions
  getPositionLabel(position) {
    const positions = {
      'meneur': 'Meneur (PG)',
      'arriere': 'Arrière (SG)',
      'ailier': 'Ailier (SF)',
      'ailier-fort': 'Ailier Fort (PF)',
      'pivot': 'Pivot (C)'
    };
    return positions[position] || position;
  },

  // Confirmation de suppression
  confirmDeletePlayer(id) {
    const player = this.getPlayerById(id);
    if (player && confirm(`Êtes-vous sûr de vouloir supprimer ${player.name} ?`)) {
      this.deletePlayer(id);
      this.renderPlayersList();
      // Mettre à jour les selects
      window.updatePlayerSelects && window.updatePlayerSelects();
    }
  },

  // Populate les selects de joueurs
  populatePlayerSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const players = this.getAllPlayers();
    const currentValue = select.value;

    // Garder la première option (placeholder ou "tous")
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);

    players.forEach(player => {
      const option = document.createElement('option');
      option.value = player.id;
      option.textContent = `${player.name}${player.number ? ` (#${player.number})` : ''}`;
      select.appendChild(option);
    });

    // Restaurer la valeur si elle existe toujours
    if (currentValue && players.some(p => p.id === currentValue)) {
      select.value = currentValue;
    }
  }
};

// Exposer globalement
window.PlayersModule = PlayersModule;
