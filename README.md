# HabitLab

Application web de suivi d'habitudes (sujet B du module Full Stack JS, EFREI). Chaque utilisateur crée un compte, gère sa liste d'habitudes quotidiennes ou hebdomadaires, les active ou les désactive, et coche ce qu'il a fait chaque jour. Les données de chaque compte sont privées.

**Fonctionnalités**
- Obligatoires (MVP) : inscription, connexion, liste, détail, ajout, modification, suppression et activation/désactivation des habitudes.
- Bonus réalisés (non couverts par les tests) : journal des jours validés, calendrier mensuel, série de jours consécutifs, barre de progression, couleur par habitude.

## Stack et versions

| Couche | Technologie | Version testée |
|---|---|---|
| Interface | React + Vite | React 19.3, Vite 7.3 |
| API | Node.js + Express | Node 20.19, Express 5.2 |
| Données | MongoDB + Mongoose | MongoDB 8.0, Mongoose 9.11 |
| Auth | bcryptjs + JWT (jsonwebtoken) | |
| Qualité | ESLint, Jest + Supertest | ESLint 10, Jest 30 |
| Docs | OpenAPI / Swagger UI | |

## Prérequis

- Node.js 20 ou plus, npm 10 ou plus ;
- MongoDB en local (par défaut sur `127.0.0.1:27017`).

## Installation

```bash
npm install
cp backend/.env.example backend/.env
```

Puis éditer `backend/.env` :

| Variable | Rôle | Exemple |
|---|---|---|
| `PORT` | Port de l'API | `3000` |
| `MONGODB_URI` | Base de développement | `mongodb://127.0.0.1:27017/habitflow` |
| `JWT_SECRET` | Clé de signature des JWT (à changer, jamais versionnée) | une longue chaîne aléatoire |

`.env` est ignoré par Git ; `.env.example` ne contient que des valeurs fictives.

## Lancement

Démarrer MongoDB (par exemple `mongod`, ou le service installé par Homebrew), puis :

```bash
npm run dev
```

Cela lance l'API et le front en parallèle.

- Interface : http://localhost:5173 (Vite choisit un autre port si 5173 est pris)
- API : http://localhost:3000
- Santé : http://localhost:3000/api/health
- Documentation Swagger : http://localhost:3000/api/docs (fichier source : `backend/openapi.json`)

En développement, Vite transmet toute requête `/api/...` à l'API (proxy), le front n'a donc pas d'URL en dur.

## Tests, lint et build

```bash
npm test          # Jest + Supertest (MongoDB doit tourner)
npm run lint      # ESLint sur tout le dépôt
npm run build     # build de production du front (frontend/dist)
npm start         # lance uniquement l'API
```

Les tests utilisent une base séparée, `habitflow_test` (surchargeable avec `MONGODB_TEST_URI`), vidée au début de chaque exécution : la base de développement n'est jamais touchée. Ils couvrent le parcours CRUD nominal, une donnée invalide (400), l'absence de JWT (401) et l'isolation entre deux comptes A et B (404).

## Architecture

```text
frontend/src
  App.jsx               routes ; RequireAuth protège les pages privées
  components/           Login, Register, Habits, HabitDetail, Calendar, Header...
  habits.js             appels API et hook useHabits (partagés par les pages)
backend/src
  app.js                application Express importable sans ouvrir de port (tests)
  server.js             connexion MongoDB et démarrage
  routes/               chemins et middlewares
  controllers/          lecture de la requête, réponse HTTP
  services/             règles métier et accès aux données
  validators/           validation côté serveur
  models/               schémas Mongoose (User, Habit)
  middlewares/          requireAuth (JWT Bearer)
  errors.js             erreurs applicatives {"error":{"code","message"}}
backend/openapi.json    description OpenAPI de l'API
backend/test/           tests Jest
```

Trajet d'une requête : `React (fetch + Bearer) -> route -> requireAuth -> contrôleur -> validation -> service -> modèle Mongoose -> MongoDB`.

## API

Contrat détaillé dans Swagger. Résumé : `/api/habits` (GET liste, POST), `/api/habits/:id` (GET, PATCH, DELETE), `/api/auth/register`, `/api/auth/login`, `/api/health`. Une route supplémentaire, `POST /api/habits/:id/toggle`, coche ou décoche un jour (bonus).

Une habitude : `title` (1 à 120 caractères), `frequency` (`daily` ou `weekly`), `active` (booléen). Les erreurs ont toujours la forme `{"error":{"code","message"}}` avec les codes `INVALID_INPUT` (400), `UNAUTHORIZED` (401), `NOT_FOUND` (404) et `EMAIL_ALREADY_USED` (409).

## Choix techniques et sécurité

- **Mots de passe** : hachés avec bcrypt, jamais renvoyés par l'API.
- **JWT** : signé avec `JWT_SECRET`, expire après 7 jours. Il est stocké dans le `localStorage` du navigateur : simple, mais lisible par du JavaScript injecté (faille XSS). Un cookie `HttpOnly` serait plus sûr, au prix d'une protection CSRF à gérer.
- **Isolation des comptes** : le propriétaire (`ownerId`) vient uniquement du JWT vérifié. Chaque requête filtre dessus, donc l'objet d'un autre compte renvoie 404, comme un objet absent (on ne révèle pas son existence). Masquer un bouton dans React ne protège rien : l'autorisation est dans Express.
- **Validation** : faite à la main côté serveur, y compris pour les types, les champs inconnus et les identifiants interdits dans le corps des requêtes.
- **401 / 404** : 401 = « qui es-tu ? » (jeton absent ou invalide) ; 404 = l'objet n'existe pas pour toi.
- **Après un redémarrage** : les données restent, car elles sont dans MongoDB et non en mémoire.

## Vite, Babel, Webpack et CI/CD

- **Babel** transforme du JavaScript récent ou du JSX en code compris par les navigateurs.
- **Webpack** est un bundler : il assemble les modules du projet en quelques fichiers. Il est configurable et plutôt lent à démarrer.
- **Vite** sert le code en modules natifs pendant le développement (démarrage rapide, rechargement à chaud) et empaquette pour la production. C'est l'outil utilisé ici.
- **CI/CD** : les commandes `npm run lint`, `npm test` puis `npm run build` formeraient les étapes d'une chaîne d'intégration continue à chaque push. Le déploiement ne se ferait qu'après leur succès.

## Limites connues

- Pas de réinitialisation de mot de passe ni de déconnexion côté serveur : le JWT reste valide jusqu'à son expiration.
- Les jours cochés sont enregistrés avec la date locale du navigateur : pas de gestion des fuseaux horaires.
- La fréquence hebdomadaire est enregistrée mais ne change pas encore le calcul de la série.
- Les bonus (journal, calendrier, série) ne sont pas couverts par les tests automatisés.
- Aucun déploiement cloud n'est fourni.
