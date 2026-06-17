# Budget & Coloc

Application web de gestion de budget personnel : suivi des revenus/dépenses,
catégories personnalisables, budgets mensuels, et un module de
dettes/remboursements partagés avec un·e coloc. Installable comme PWA pour
un usage confortable sur mobile.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Prisma](https://www.prisma.io) + [Supabase](https://supabase.com) (Postgres)
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) pour le support PWA

## Configuration de la base (Supabase)

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **Project Settings → Database → Connection string**, récupérer :
   - la connexion **Transaction pooler** (port `6543`) → `DATABASE_URL`
   - la connexion **directe** (port `5432`) → `DIRECT_URL`
3. Copier `.env.example` vers `.env` et y coller ces deux URLs.

```bash
cp .env.example .env
```

## Démarrage

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

L'application est servie sur [http://localhost:3000](http://localhost:3000).
La première migration crée les tables sur Supabase et y insère des
catégories par défaut (Salaire, Loyer, Courses, Transport).

## Build de production

Le service worker (offline + installation PWA) n'est généré que par le
build webpack, car le plugin PWA ne supporte pas encore Turbopack :

```bash
npm run build
npm start
```

## Déploiement (Vercel + Supabase)

1. Pousser le dépôt sur GitHub, puis l'importer dans [Vercel](https://vercel.com).
2. Dans les *Environment Variables* du projet Vercel, ajouter `DATABASE_URL`
   et `DIRECT_URL` avec les mêmes valeurs que dans `.env`.
3. Lancer le déploiement (Vercel exécute `npm run build`, qui inclut déjà le
   flag `--webpack` nécessaire au plugin PWA).
4. Les pages `/`, `/categories` et `/coloc` sont marquées `force-dynamic` :
   elles ne sont jamais mises en cache statique par Vercel et reflètent
   toujours les données actuelles de la base.

## Fonctionnalités

- **Transactions** : ajout/édition/suppression de revenus et dépenses, filtrage par mois et par catégorie.
- **Catégories** : gestion des catégories de revenus/dépenses, avec budget mensuel optionnel sur les dépenses.
- **Tableau de bord** : totaux du mois (revenus, dépenses, solde), barres de progression par budget, solde avec le/la coloc.
- **Coloc** : journal des paiements faits pour le/la coloc et des remboursements reçus, avec solde calculé automatiquement.
- **PWA** : installable sur l'écran d'accueil mobile, fonctionne hors-ligne pour le shell de l'application.
