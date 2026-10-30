# Darna Market — Frontend (Angular 19)

## Démarrage
```bash
npm install
npm start          # ou : npm run dev   → http://localhost:4200
```

## Mode démo (sans backend)
`src/environments/environment.ts` → `useMock: true`.
Les données (utilisateurs, catégories, produits, commandes) sont stockées dans le localStorage
par `DataService` et initialisées depuis `src/app/core/mock/mock-db.ts`.
Comptes de test : voir `../USERS.md` (ou la page de connexion).
Bouton « Réinitialiser les données de démo » dans le dashboard admin.

## Structure
- `core/` : modèles, services (auth, data, cart, language), guards (auth, rôle), interceptors (JWT, erreurs)
- `shared/` : navbar, footer, product-card, image-gallery, status-badge, pipe `localized`
- `features/` : auth, shop, vendor, admin (lazy loading)
- `public/i18n/` : fr.json, en.json, ar.json (changement de langue à chaud, RTL automatique pour l'arabe)

## Brancher le vrai backend
Les méthodes de `DataService` / `AuthService` correspondent une à une aux routes de l'API Express
(`environment.apiUrl`). Le `jwtInterceptor` ajoute déjà le header `Authorization: Bearer <token>`
sur les requêtes vers cette URL.
