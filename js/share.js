// ============================================
// MODULE: PARTAGE SOCIAL
// ============================================

const ShareModule = {
    // Générer et partager l'image du match
    async shareMatch(match) {
        if (!match) return;

        try {
            // 1. Créer le visuel
            const element = this.createShareCard(match);
            document.getElementById('share-container').appendChild(element);

            // Attendre que les images/fonts chargent (court délai)
            await new Promise(resolve => setTimeout(resolve, 100));

            // 2. Convertir en image
            const canvas = await html2canvas(element, {
                backgroundColor: '#0f172a', // Couleur de fond sombre
                scale: 2, // Meilleure qualité
                logging: false,
                useCORS: true
            });

            // Nettoyer
            document.getElementById('share-container').innerHTML = '';

            // 3. Partager
            canvas.toBlob(async (blob) => {
                const file = new File([blob], `match-${match.id}.png`, { type: 'image/png' });

                // Vérifier si le partage natif est supporté
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'Mon Match Basketball Stats Pro',
                            text: `🔥 Match terminé : ${match.playerName} vs ${match.opponent} ! \n${match.stats.totalPoints} points marqués ! 🏀`,
                            files: [file]
                        });
                        if (window.HapticModule) HapticModule.success();
                    } catch (err) {
                        console.log('Erreur partage ou annulation:', err);
                    }
                } else {
                    // Fallback : Téléchargement direct
                    const link = document.createElement('a');
                    link.download = `match-${match.id}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    alert('Image téléchargée ! Vous pouvez maintenant la partager. 📸');
                }
            }, 'image/png');

        } catch (err) {
            console.error('Erreur génération image:', err);
            alert('Impossible de générer l\'image de partage.');
        }
    },

    // Créer le HTML de la carte à partager
    createShareCard(match) {
        const div = document.createElement('div');
        div.style.width = '600px';
        div.style.padding = '40px';
        div.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
        div.style.color = 'white';
        div.style.fontFamily = "'Inter', sans-serif";
        div.style.borderRadius = '20px';
        div.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
        div.style.position = 'relative';
        div.style.overflow = 'hidden';

        const matchDate = new Date(match.date).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        // Calculer le pourcentage de réussite (fictif pour l'instant car on n'a pas les tentatives)
        // On va mettre des stats clés

        div.innerHTML = `
            <!-- Background decoration -->
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: #FF6B35; filter: blur(100px); opacity: 0.2;"></div>
            <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: #3B82F6; filter: blur(100px); opacity: 0.2;"></div>

            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div>
                    <h2 style="margin: 0; font-size: 1.5rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Match Result</h2>
                    <p style="margin: 5px 0 0; color: #64748b;">${matchDate}</p>
                </div>
                <div style="background: rgba(255, 107, 53, 0.2); color: #FF6B35; padding: 5px 15px; border-radius: 50px; font-weight: bold;">
                    Basketball Stats Pro
                </div>
            </div>

            <!-- Main Score -->
            <div style="text-align: center; margin-bottom: 40px; position: relative; z-index: 1;">
                <h1 style="margin: 0; font-size: 3rem; font-weight: 800; background: linear-gradient(to right, #fff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ${match.playerName}
                </h1>
                <p style="margin: 10px 0; font-size: 1.5rem; color: #94a3b8;">VS</p>
                <h2 style="margin: 0; font-size: 2rem; color: #cbd5e1;">${match.opponent}</h2>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #FF6B35;">${match.stats.totalPoints}</div>
                    <div style="color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-top: 5px;">Points</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #3B82F6;">${match.stats.rebounds}</div>
                    <div style="color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-top: 5px;">Rebonds</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #10B981;">${match.stats.assists}</div>
                    <div style="color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-top: 5px;">Passes</div>
                </div>
            </div>

            <!-- Footer Stats -->
            <div style="display: flex; justify-content: space-around; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <div style="text-align: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; display: block;">${match.stats.steals}</span>
                    <span style="color: #64748b; font-size: 0.8rem;">INTERCEPT.</span>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; display: block;">${match.stats.blocks}</span>
                    <span style="color: #64748b; font-size: 0.8rem;">CONTRES</span>
                </div>
                <div style="text-align: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; display: block;">${match.stats.points3}</span>
                    <span style="color: #64748b; font-size: 0.8rem;">3 POINTS</span>
                </div>
            </div>
        `;

        return div;
    }
};

// Exposer globalement
window.ShareModule = ShareModule;
