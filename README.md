# Spotlight Backend – Next.js + Supabase

Ce projet constitue le backend de l'application **Spotlight**, développé avec **Next.js** (App Router) et **Supabase**.\
Il sert d'API et de couche de gestion des utilisateurs, authentification, base de données et logique serveur.

> ⚠️ L'accès au fichier `.env` est requis pour faire fonctionner ce projet.\
> Contacte Tristan pour l'obtenir.

---

## 🚀 Démarrage rapide

### 1. Clone le repo

```bash
git clone https://github.com/W2P-connect/spotlight.git
cd spotlight
```

### 2. Installe les dépendances

```bash
npm install
```

### 3. Prépare les variables d’environnement

Demande le fichier `.env`, puis place-le à la racine du projet.\

### 4. Lance le serveur en local

```bash
npm run dev
```

Par défaut, l'app tourne sur : [http://localhost:3123](http://localhost:3123)

---

## 🛠 Stack technique

- [Next.js](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (auth, DB, API)
- [Prisma](https://www.prisma.io/) (ORM)

---

## 📁 Structure

Le projet suit la convention standard Next.js App Router avec les dossiers :

- `app/` : routes et pages de l'application
- `lib/` : fonctions liées à la gestion des données (requêtes, helpers, etc.)
- `prisma/` : schéma Prisma, client généré, et gestion des migrations vers la base de données
- `utils/` : fonctions utilitaires utilisées dans plusieurs parties du projet

---

## 📩 Feedback ou bugs

Envoie un message ou ouvre un ticket si tu rencontres un souci ou souhaites contribuer.

