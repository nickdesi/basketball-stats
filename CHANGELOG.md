# Changelog

## [1.8.1] - 2025-12-26

### ✨ Nouvelles Fonctionnalités

- **Standardisation FFBB** : Adoption des abréviations officielles (RB, PD, INT, CTR, BP, F) sur toute l'application.
- **Tooltips Éducatifs** : Ajout d'infobulles pour eFG%, TS%, Eval, et FT% (Lancers-Francs).
- **Logique U11** : Masquage automatique de l'eFG% (non pertinent sans 3 points) pour les joueurs U11.
- **Soft-Delete & Undo** : Suppression non-destructive avec possibilité d'annuler (Toast) pendant 5 secondes.
- **Carte de Partage V2** : Nouvelle disposition en 5 colonnes incluant désormais les Contres (CTR).

### 🎨 UX & UI Polish

- **Toast System** : Nouveau système de notifications non-intrusives (Succès, Info, Erreur).
- **Empty States** : Illustrations animées pour les écrans vides (zéro match, zéro joueur).
- **Haptic Feedback** : Retours tactiles sur les actions clés (création match, scoring).
- **Animations** : Transitions "Pop" et micro-interactions améliorées.

### ♿ Accessibilité

- **Mode Contraste Élevé** : Meilleure lisibilité en extérieur.
- **Conformité RGAA/WCAG** : Indicateurs de focus visibles, labels ARIA, et contrastes ajustés.
- **Réduction de Mouvement** : Support de `prefers-reduced-motion`.

### 🔧 Technique

- **Sécurité** : Audit de dépendances (0 vulnérabilité).
- **Compatibilité** : Alignement du moteur Node (v20) pour déploiement Coolify fluide.
- **Optimisation** : Suppression des dépendances dépréciées (`sourcemap-codec`).
