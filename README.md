# 🏀 HoopStats - Suivi de Stats de Basket

<p align="center">
  <img src="public/pwa-512x512.png" alt="HoopStats Logo" width="150" />
</p>

Une application web moderne et futuriste pour suivre les statistiques de matchs de basket-ball, conçue pour les parents et les coachs. Créez des joueurs, choisissez votre équipe, et enregistrez les performances en temps réel !

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://basket.desimone.fr)
[![Deploy with Coolify](https://img.shields.io/badge/Deploy%20with-Coolify-purple?style=flat&logo=rocket)](https://coolify.io)

## ✨ Fonctionnalités

### ☁️ Synchronisation Cloud (Firebase)

- **Données Privées :** Chaque utilisateur a ses propres joueurs et matchs isolés.
- **Multi-Appareils :** Synchronisation en temps réel entre tous vos appareils.
- **Authentification :** Inscription par email/mot de passe ou connexion Google.
- **Mode Hors-Ligne :** Les données sont mises en cache localement et synchronisées automatiquement au retour de la connexion.
- **Migration Automatique :** Les données locales existantes sont uploadées vers le cloud à la première connexion.

### 🎮 Enregistrement de Match (Mode Arcade)

- **Interface Intuitive & Ergonomique :** Saisie ultra-rapide avec un design "Zéro Scroll". Boutons compacts (cercle cliquable pour incrémenter) et labels positionnés intelligemment (en haut pour la ligne 1, en bas pour la ligne 2).
- **Suivi complet :** Rebonds (Off/Def), Passes, Interceptions, Contres, Balles Perdues, Fautes.
- **Règles U11 Intégrées :** Si un joueur est U11, les tirs à 3 points sont automatiquement masqués (Saisie & Stats).
- **Limite de Fautes :** Avertissement et exclusion automatique (fin de match) confirmée au bout de la 5ème faute.
- **Thème Clair/Sombre :** Interface adaptative avec un mode sombre (néon) et un mode clair (épuré), basculable en un clic.
- **Effets visuels :** Animations "Arcade" avec textes flottants et feedbacks visuels impactants.
- **Ultra-Rapide (Snappy) :** Navigation instantanée sans transitions superflues pour une efficacité maximale.
- **Mobile Optimisé :** Expérience "Native App" (PWA) :
  - **Zéro Zoom :** Saisie stable sans zoom intempestif sur iPhone.
  - **Plein Écran :** Support "Safe Area" (encoches) et masquage des barres navigateur.
  - **Icône :** Prêt à être ajouté sur l'écran d'accueil.
  - **Mode Hors-Ligne :** Bandeau indicateur quand vous êtes déconnecté, données locales préservées.

### 📊 Tableau de Bord (Dashboard)

- **Stats Détaillées :** Nouvelle grille de stats ultra-complète sur 4 colonnes (FG%, 3P%, eFG%, TS%, Eval), identique en live et en historique.
- **Graphiques Intelligents :** Courbes, Camemberts (adaptés U11 sans 3pts), et Barres de progression.
- **Historique :** Liste des matchs avec scores, dates, et accès rapide aux détails.
- **Import/Export :** Sauvegardez vos matchs en JSON pour les archiver (Export) ou rechargez-les depuis un fichier (Import), idéal pour transférer des données entre appareils.

### 📜 Gestion des Matchs & Joueurs

- **Match Setup :** Saisie du nom de l'adversaire.
- **Profils Joueurs :** Gestion complète (Nom, Numéro, Poste, Niveau U11-U18).
- **Partage Résumé :** Copiez un résumé texte complet du match à partager (WhatsApp, Notes, etc.).
- **Correction & Édition :** Mode correction pour annuler les erreurs de saisie et **possibilité de modifier la date** et les stats complètes après le match.

## 🛠 Technologies

- **Frontend :** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** [Tailwind CSS v4](https://tailwindcss.com/)
- **État :** [Zustand](https://github.com/pmndrs/zustand) (avec persistance locale)
- **Backend :** [Firebase](https://firebase.google.com/) (Firestore + Authentication)
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

5. **Déployer sur Coolify :**

    Ce projet est configuré pour **Coolify** (et tout autre hébergeur supportant Nixpacks) grâce aux fichiers `nixpacks.toml` et `Caddyfile`.
    - Créez une nouvelle ressource "Git Repository".
    - Sélectionnez ce repo.
    - Build Pack : **Nixpacks** (détecté automatiquement).
    - Port : **80** (configuré via Caddy).

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
