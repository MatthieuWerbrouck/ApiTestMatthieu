# Budget & Coloc

Application web de gestion de budget personnel : suivi des revenus/dépenses,
catégories personnalisables, budgets mensuels, et un module de
dettes/remboursements partagés avec un·e coloc. Installable comme PWA pour
un usage confortable sur mobile.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Prisma](https://www.prisma.io) + SQLite
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) pour le support PWA

## Démarrage

```bash
npm install
npx prisma migrate dev
npm run dev
```

L'application est servie sur [http://localhost:3000](http://localhost:3000).
La première migration crée la base SQLite (`dev.db`) et y insère des
catégories par défaut (Salaire, Loyer, Courses, Transport).

## Build de production

Le service worker (offline + installation PWA) n'est généré que par le
build webpack, car le plugin PWA ne supporte pas encore Turbopack :

```bash
npm run build
npm start
```

## Fonctionnalités

- **Transactions** : ajout/édition/suppression de revenus et dépenses, filtrage par mois et par catégorie.
- **Catégories** : gestion des catégories de revenus/dépenses, avec budget mensuel optionnel sur les dépenses.
- **Tableau de bord** : totaux du mois (revenus, dépenses, solde), barres de progression par budget, solde avec le/la coloc.
- **Coloc** : journal des paiements faits pour le/la coloc et des remboursements reçus, avec solde calculé automatiquement.
- **PWA** : installable sur l'écran d'accueil mobile, fonctionne hors-ligne pour le shell de l'application.
