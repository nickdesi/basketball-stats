# 🏀 HoopStats - Suivi de Stats de Basket

Une application web moderne et futuriste pour suivre les statistiques de matchs de basket-ball, conçue pour les parents et les coachs. Créez des joueurs, choisissez votre équipe, et enregistrez les performances en temps réel !

![Basketball Stats Preview](https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnickdesi%2Fbasketball-stats)

## ✨ Fonctionnalités

### 🎮 Enregistrement de Match (Mode Arcade)

- **Interface intuitive :** Gros boutons pour ajouter des points (1pt, 2pts, 3pts) sans regarder l'écran.
- **Suivi complet :** Rebonds, Passes, Interceptions, Contres, Balles Perdues.
- **Fautes :** Gestion des fautes avec exclusion automatique (ou stricte) au bout de 5 fautes.
- **Annulation :** Possibilité d'annuler la dernière action en cas d'erreur.
- **Effets visuels :** Animations "Arcade" pour chaque panier marqué.

### 📊 Tableau de Bord (Dashboard)

- **Vue d'ensemble :** Statistiques globales (Points, Rebonds, Passes par match).
- **Graphiques interactifs :**
  - Évolution des points au fil des matchs (Courbe).
  - Répartition des points (Camembert 1pt/2pts/3pts).
  - Comparaison des performances moyennes (Barres).
- **Historique détaillé :** Liste de tous les matchs passés avec scores et dates.

### 📜 Gestion des Matchs

- **Détails du match :** Cliquez sur un match pour voir la feuille de stats complète.
- **Partage :** Partagez un résumé textuel du match (WhatsApp, SMS, etc.).
- **Export JSON :** Téléchargez les données brutes d'un match spécifique ou de tout l'historique.
- **Suppression :** Supprimez un match de l'historique en cas d'erreur.

### 👥 Gestion des Joueurs

- **Profils multiples :** Créez et gérez plusieurs joueurs.
- **Sélection rapide :** Changez de joueur actif à la volée.
- **Stats individualisées :** Le tableau de bord s'adapte au joueur sélectionné.

## 🛠 Technologies

- **Frontend :** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** [Tailwind CSS v4](https://tailwindcss.com/)
- **État :** [Zustand](https://github.com/pmndrs/zustand) (avec persistance locale)
- **Graphiques :** [Chart.js](https://www.chartjs.org/) + [React-Chartjs-2](https://react-chartjs-2.js.org/)
- **Icônes :** [Lucide React](https://lucide.dev/)

## 🚀 Installation

1. **Cloner le projet :**

    ```bash
    git clone https://github.com/votre-username/basketball-stats-1.git
    cd basketball-stats-1
    ```

2. **Installer les dépendances :**

    ```bash
    npm install
    ```

3. **Lancer le serveur de développement :**

    ```bash
    npm run dev
    ```

4. **Construire pour la production :**

    ```bash
    npm run build
    ```

## 📱 Utilisation

1. Allez dans l'onglet **Joueurs** pour créer le profil de votre enfant/joueur.
2. Dans **Nouveau Match**, sélectionnez le joueur et le nom de l'adversaire.
3. Pendant le match, cliquez sur les boutons pour ajouter des stats.
4. À la fin du match, cliquez sur "Terminer le match" pour sauvegarder.
5. Consultez les progrès dans le **Tableau de Bord**.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une Pull Request.

## 📄 Licence

MIT License.
