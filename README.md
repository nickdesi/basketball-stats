# 🏀 HoopStats - Suivi de Stats de Basket

Une application web moderne et futuriste pour suivre les statistiques de matchs de basket-ball, conçue pour les parents et les coachs. Créez des joueurs, choisissez votre équipe, et enregistrez les performances en temps réel !

![Basketball Stats Preview](https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop)

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://basket.desimone.fr)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnickdesi%2Fbasketball-stats)

## ✨ Fonctionnalités

### 🎮 Enregistrement de Match (Mode Arcade)

- **Interface Intuitive & Ergonomique :** Saisie ultra-rapide avec un design "Zéro Scroll". Boutons compacts (cercle cliquable pour incrémenter) et labels positionnés intelligemment (en haut pour la ligne 1, en bas pour la ligne 2).
- **Suivi complet :** Rebonds (Off/Def), Passes, Interceptions, Contres, Balles Perdues, Fautes.
- **Règles U11 Intégrées :** Si un joueur est U11, les tirs à 3 points sont automatiquement masqués (Saisie & Stats match/historique).
- **Limite de Fautes :** Avertissement et exclusion automatique (fin de match) confirmée au bout de la 5ème faute.
- **Effets visuels :** Animations "Arcade" avec textes flottants et feedbacks visuels impactants.
- **Mobile Optimisé :** Expérience "Native App" (PWA) :
  - **Zéro Zoom :** Saisie stable sans zoom intempestif sur iPhone.
  - **Plein Écran :** Support "Safe Area" (encoches) et masquage des barres navigateur.
  - **Icône :** Prêt à être ajouté sur l'écran d'accueil.

### 📊 Tableau de Bord (Dashboard)

- **Stats Détaillées :** Nouvelle grille de stats ultra-complète sur 4 colonnes (FG%, 3P%, eFG%, TS%, Eval), identique en live et en historique.
- **Graphiques Intelligents :** Courbes, Camemberts (adaptés U11 sans 3pts), et Barres de progression.
- **Historique :** Liste des matchs avec scores, dates, et accès rapide aux détails.
- **Import/Export :** Sauvegardez vos matchs en JSON (Export) ou rechargez-les depuis un fichier (Import).

### 📜 Gestion des Matchs & Joueurs

- **Match Setup :** Saisie du nom de l'adversaire.
- **Profils Joueurs :** Gestion complète (Nom, Numéro, Poste, Niveau U11-U18).
- **Partage Résumé :** Copiez un résumé texte complet du match à partager (WhatsApp, Notes, etc.).
- **Correction :** Mode correction pour annuler les erreurs de saisie.

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
    git clone https://github.com/nickdesi/basketball-stats.git
    cd basketball-stats
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
