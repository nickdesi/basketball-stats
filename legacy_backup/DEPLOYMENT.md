# 🚀 Guide de Publication sur GitHub Pages

## Étape 1 : Créer un Repository GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **"New repository"** (bouton vert)
3. Nommez-le : `basketball-stats`
4. Laissez-le **Public**
5. Ne cochez RIEN (pas de README, pas de .gitignore)
6. Cliquez **"Create repository"**

## Étape 2 : Initialiser Git et Pousser le Code

Ouvrez un terminal dans le dossier `basketball-stats` et exécutez :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "🏀 Initial commit - Basketball Stats Pro"

# Lier au repository GitHub (remplacez VOTRE-USERNAME)
git remote add origin https://github.com/VOTRE-USERNAME/basketball-stats.git

# Renommer la branche en main (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

## Étape 3 : Activer GitHub Pages

1. Sur GitHub, allez dans votre repository `basketball-stats`
2. Cliquez sur **"Settings"** (⚙️)
3. Dans le menu latéral, cliquez sur **"Pages"**
4. Sous **"Source"**, sélectionnez :
   - Branch : `main`
   - Folder : `/ (root)`
5. Cliquez **"Save"**

## Étape 4 : Accéder à votre Application

Après 1-2 minutes, votre app sera disponible à :

```
https://VOTRE-USERNAME.github.io/basketball-stats/
```

GitHub affichera l'URL exacte en haut de la page Settings > Pages.

## 🎉 C'est Terminé !

Votre application est maintenant **publique** et accessible à tous !

## 🔄 Mettre à Jour l'Application

Pour publier des modifications :

```bash
git add .
git commit -m "Description des changements"
git push
```

GitHub Pages se mettra à jour automatiquement en 1-2 minutes.

## 📝 Notes Importantes

- ✅ L'application fonctionne 100% côté client (pas de serveur nécessaire)
- ✅ Les données sont stockées localement (LocalStorage) chez chaque utilisateur
- ✅ Rapide et gratuit
- ✅ HTTPS automatique
- ✅ Pas de limite de bande passante pour les petits projets

## 🌟 Bonus : Personnaliser l'URL

Si vous avez un domaine personnalisé, vous pouvez configurer un CNAME dans Settings > Pages.

---

**Besoin d'aide ?** Consultez la [documentation officielle GitHub Pages](https://docs.github.com/en/pages)
