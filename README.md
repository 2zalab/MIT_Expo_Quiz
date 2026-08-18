# 🚀 MIT Expo Quiz

Application web de quiz interactif développée pour **Maroua Innovation Technology (MIT)** afin d'animer les stands lors des expositions, salons, concours et événements technologiques.

Les visiteurs scannent un **QR code**, entrent leur nom et participent à un quiz rapide. Le score est enregistré dans **Supabase** et le classement est affiché en temps réel sur un écran TV ou un vidéoprojecteur.

---

## 🎯 Objectif

MIT Expo Quiz a été conçu pour transformer un stand d'exposition en espace interactif et ludique.

Le fonctionnement est simple :

```text
📱 Scanner le QR Code
        ↓
👤 Entrer son nom
        ↓
🎮 Commencer le quiz
        ↓
❓ Répondre aux questions
        ↓
🏆 Calcul du score
        ↓
☁️ Enregistrement dans Supabase
        ↓
📺 Classement en temps réel
````

L'application permet notamment de :

* présenter MIT et ses solutions ;
* sensibiliser les visiteurs à l'intelligence artificielle ;
* faire découvrir NDEMRI ;
* faire découvrir Malloum ;
* tester les connaissances informatiques ;
* proposer des défis numériques ;
* créer une animation autour du stand ;
* organiser de petits concours avec des lots ;
* afficher les meilleurs joueurs en temps réel.

---

# 🧩 Technologies utilisées

## Frontend

* Next.js
* React
* TypeScript
* CSS
* Next.js App Router

## Backend / Database

* Supabase
* PostgreSQL
* Supabase Realtime
* Supabase RPC

## Déploiement

* Vercel
* GitHub

## QR Codes

Chaque QR code peut pointer vers une URL différente :

```text
https://votre-domaine.vercel.app/play/STAND-A
```

---

# 📚 Banque de questions

L'application utilise une banque de questions destinée aux animations MIT.

La banque principale contient :

**5 000 QCM**

répartis dans 10 catégories :

| Catégorie                                |    Nombre |
| ---------------------------------------- | --------: |
| MIT                                      |       500 |
| NDEMRI                                   |       500 |
| Malloum                                  |       500 |
| Intelligence artificielle                |       500 |
| Informatique générale                    |       500 |
| Développement Web & Mobile               |       500 |
| Cybersécurité                            |       500 |
| Culture numérique                        |       500 |
| Innovation & entrepreneuriat au Cameroun |       500 |
| Logique & culture générale               |       500 |
| **TOTAL**                                | **5 000** |

Une banque complémentaire de **50 questions sur les fondateurs et l'histoire de MIT** peut également être importée dans la même table.

---

# 📁 Structure du projet

```text
MIT_Expo_Quiz/
│
├── app/
│   │
│   ├── admin/
│   │   └── page.tsx
│   │
│   ├── live/
│   │   └── page.tsx
│   │
│   ├── play/
│   │   └── [code]/
│   │       └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── supabase.ts
│
├── supabase/
│   └── schema.sql
│
├── public/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
├── .env.local
└── README.md
```

---

# ⚙️ Prérequis

Avant de commencer, installer :

* Node.js 20 LTS ou version plus récente
* npm
* Git
* un compte GitHub
* un compte Supabase
* un compte Vercel

Vérifier Node.js :

```bash
node -v
```

Vérifier npm :

```bash
npm -v
```

Vérifier Git :

```bash
git --version
```

---

# 💻 Installation locale

Cloner le dépôt :

```bash
git clone https://github.com/VOTRE-COMPTE/MIT_Expo_Quiz.git
```

Entrer dans le projet :

```bash
cd MIT_Expo_Quiz
```

Installer les dépendances :

```bash
npm install
```

---

# 🔐 Configuration Supabase

Créer un projet sur :

[https://supabase.com/](https://supabase.com/)

Une fois le projet créé, récupérer :

```text
Project URL
Publishable key
```

ou, selon l'interface Supabase :

```text
Project URL
anon public key
```

---

# 🔑 Variables d'environnement

Créer un fichier :

```text
.env.local
```

à la racine du projet.

Contenu :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

Exemple :

```env
NEXT_PUBLIC_SUPABASE_URL=https://cprjvbwgyvbcoqzstfme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY
```

⚠️ Ne jamais publier `.env.local`.

Ne jamais mettre une clé :

```text
service_role
```

ou :

```text
secret
```

dans une variable `NEXT_PUBLIC_*`.

---

# 🚫 .gitignore

Le fichier `.gitignore` doit notamment contenir :

```gitignore
node_modules/
.next/
.vercel/

.env
.env.local
.env.*.local

*.log

.DS_Store
Thumbs.db

.vscode/
.idea/

*.tsbuildinfo
```

Les éléments suivants ne doivent jamais être envoyés sur GitHub :

```text
node_modules/
.next/
.vercel/
.env.local
```

---

# 🗄️ Configuration de Supabase

Dans Supabase :

```text
SQL Editor
    ↓
New query
```

Exécuter le contenu du fichier :

```text
supabase/schema.sql
```

La base contient notamment une table :

```text
players
```

et une table :

```text
questions
```

---

# 📝 Table questions

La table `questions` contient :

```text
id
category
question
option_a
option_b
option_c
option_d
answer_index
points
difficulty
created_at
```

Exemple :

```text
id: Q00001

category:
NDEMRI

question:
Quel est le secteur principal de NDEMRI ?

option_a:
Agriculture

option_b:
Banque

option_c:
Transport

option_d:
Tourisme

answer_index:
0

points:
10

difficulty:
facile
```

---

# 📥 Importer les 5 000 questions

Le fichier CSV doit avoir les colonnes :

```text
id
category
question
option_a
option_b
option_c
option_d
answer_index
points
difficulty
```

Dans Supabase :

```text
Table Editor
    ↓
questions
    ↓
Import Data
    ↓
CSV
```

Sélectionner :

```text
qcm_500_par_categorie_supabase.csv
```

Après l'importation, vérifier :

```sql
SELECT COUNT(*)
FROM questions;
```

Résultat attendu :

```text
5000
```

---

# 🔎 Vérifier les catégories

Exécuter :

```sql
SELECT category, COUNT(*)
FROM questions
GROUP BY category
ORDER BY category;
```

Chaque catégorie principale doit contenir environ :

```text
500 questions
```

---

# 🎲 Questions aléatoires

L'application utilise une fonction PostgreSQL/Supabase permettant de récupérer des questions aléatoires.

Exemple :

```sql
create or replace function get_random_questions(
    question_limit integer default 10
)
returns table (
    id text,
    category text,
    question text,
    option_a text,
    option_b text,
    option_c text,
    option_d text,
    answer_index integer,
    points integer,
    difficulty text
)
language sql
as $$
    select
        q.id,
        q.category,
        q.question,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.answer_index,
        q.points,
        q.difficulty
    from public.questions q
    order by random()
    limit question_limit;
$$;
```

Une partie peut ainsi utiliser :

```text
5 000 questions
      ↓
sélection aléatoire
      ↓
10 questions
```

---

# 🎮 Fonctionnement du joueur

Le joueur accède à :

```text
/play/[code]
```

Exemple :

```text
/play/STAND-A
```

Il :

1. scanne le QR code ;
2. entre son nom ;
3. démarre la partie ;
4. reçoit 10 questions ;
5. répond aux questions ;
6. obtient son score ;
7. apparaît dans le classement.

---

# 🏆 Système de score

Le système de base utilise :

```text
Bonne réponse = +10 points
Mauvaise réponse = 0 point
```

Le système peut être amélioré avec un bonus de rapidité :

```text
Bonne réponse       +10
Réponse très rapide +5
Réponse rapide      +2
Mauvaise réponse     0
```

Score maximal possible avec 10 questions :

```text
100 points
```

ou davantage si les bonus de rapidité sont activés.

---

# 📺 Classement en temps réel

La page :

```text
/live
```

est destinée à être affichée sur :

* une télévision ;
* un vidéoprojecteur ;
* un écran LED ;
* un ordinateur de supervision.

Exemple :

```text
🏆 MIT EXPO QUIZ

🥇 Ibrahim ........ 145 pts
🥈 Amina .......... 130 pts
🥉 Paul ........... 120 pts
4️⃣ Abdou .......... 110 pts
5️⃣ Marie .......... 100 pts
```

Le classement est synchronisé avec Supabase Realtime.

---

# 👨‍💼 Administration

La page :

```text
/admin
```

permet de consulter les résultats.

Fonctions prévues :

* consulter les joueurs ;
* consulter les scores ;
* voir le classement ;
* réinitialiser les résultats ;
* préparer une nouvelle session.

⚠️ La page `/admin` doit être protégée avant une utilisation publique.

---

# 📱 QR Codes

Chaque QR code peut utiliser un code différent.

Exemple :

```text
STAND-A
STAND-B
STAND-C
STAND-D
```

URLs :

```text
https://mit-expo-quiz.vercel.app/play/STAND-A

https://mit-expo-quiz.vercel.app/play/STAND-B

https://mit-expo-quiz.vercel.app/play/STAND-C

https://mit-expo-quiz.vercel.app/play/STAND-D
```

Le QR code peut être imprimé sur :

* affiches ;
* flyers ;
* kakemonos ;
* badges ;
* tables du stand ;
* panneaux MIT.

---

# 🧪 Lancement en local

Après avoir configuré `.env.local` :

```bash
npm run dev
```

L'application est disponible à :

```text
http://localhost:3000
```

---

# 🔗 URLs locales

Accueil :

```text
http://localhost:3000
```

Joueur :

```text
http://localhost:3000/play/DEMO
```

Classement :

```text
http://localhost:3000/live
```

Administration :

```text
http://localhost:3000/admin
```

---

# 📦 Build de production

Tester le build :

```bash
npm run build
```

Puis :

```bash
npm start
```

---

# 🐙 GitHub

Initialiser Git :

```bash
git init
```

Ajouter les fichiers :

```bash
git add .
```

Créer le premier commit :

```bash
git commit -m "Initial MIT Expo Quiz"
```

Renommer la branche :

```bash
git branch -M main
```

Ajouter le dépôt distant :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/MIT_Expo_Quiz.git
```

Envoyer le projet :

```bash
git push -u origin main
```

---

# ☁️ Déploiement sur Vercel

Le projet est conçu pour être déployé sur Vercel.

Accéder à :

[https://vercel.com/](https://vercel.com/)

Puis :

```text
Add New Project
        ↓
Import Git Repository
        ↓
MIT_Expo_Quiz
```

Vercel détecte automatiquement Next.js.

---

# 🔐 Variables d'environnement sur Vercel

Dans :

```text
Project
  ↓
Settings
  ↓
Environment Variables
```

Ajouter :

```text
NEXT_PUBLIC_SUPABASE_URL
```

Valeur :

```text
https://xxxxxxxx.supabase.co
```

Puis :

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Valeur :

```text
YOUR_PUBLIC_SUPABASE_KEY
```

Sélectionner :

```text
Production
Preview
Development
```

Puis redéployer.

---

# 🌍 URLs après déploiement

Après déploiement, Vercel fournit une URL similaire à :

```text
https://mit-expo-quiz.vercel.app
```

Les pages deviennent :

```text
https://mit-expo-quiz.vercel.app/play/STAND-A
```

```text
https://mit-expo-quiz.vercel.app/live
```

```text
https://mit-expo-quiz.vercel.app/admin
```

---

# 🏗️ Architecture

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │     VERCEL      │
              │     Next.js     │
              └────────┬────────┘
                       │
                       │ Supabase API
                       ▼
              ┌─────────────────┐
              │    SUPABASE     │
              │                 │
              │ PostgreSQL      │
              │ Questions       │
              │ Players         │
              │ Scores          │
              │ Realtime        │
              └───────┬─────────┘
                      │
              ┌───────┴─────────┐
              │                 │
              ▼                 ▼
       📱 JOUEURS          📺 ÉCRAN LIVE
       QR Codes            Classement
```

---

# 🎪 Utilisation pendant une exposition

Configuration recommandée :

```text
                     📺 TV / PROJECTEUR
                           │
                           │
                    https://.../live
                           │
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
     📱 Joueur 1                          📱 Joueur 2
        │                                     │
     QR Code                              QR Code
        │                                     │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                       SUPABASE
```

Le stand peut avoir plusieurs QR codes.

Tous les joueurs utilisent la même application.

---

# 🎁 Organisation des lots

Pour une animation simple :

```text
🥇 1er score
→ Gros lot

🥈 2e score
→ Lot moyen

🥉 3e score
→ Petit lot
```

Une autre possibilité :

```text
Chaque joueur ayant ≥ 80 points
→ participe au tirage final
```

Cela évite que les mêmes joueurs gagnent systématiquement tous les lots.

---

# 🛡️ Sécurité

## Ne jamais publier `.env.local`

Le fichier :

```text
.env.local
```

doit rester local.

Il doit être présent dans :

```text
.gitignore
```

---

## Ne jamais publier une clé secrète

Ne jamais mettre :

```text
service_role
```

ou :

```text
sb_secret_...
```

dans :

```text
NEXT_PUBLIC_...
```

Les clés secrètes doivent uniquement être utilisées côté serveur.

---

# ⚠️ Sécurité des réponses

Pour une version de démonstration, la réponse correcte peut être récupérée avec la question.

Pour un concours réel avec lots, il est préférable de ne pas envoyer :

```text
answer_index
```

au navigateur.

Architecture recommandée :

```text
Joueur
   │
   │ réponse A/B/C/D
   ▼
Serveur
   │
   ▼
Validation de la réponse
   │
   ▼
Calcul du score
   │
   ▼
Supabase
```

Cela réduit les possibilités de triche.

---

# 🔒 Administration

Avant l'utilisation publique, `/admin` doit être protégé.

Architecture recommandée :

```text
/admin
   ↓
Authentification
   ↓
Dashboard
```

Ne pas laisser une fonction de réinitialisation des scores accessible publiquement.

---

# 🚀 Évolutions prévues

## Version 1

* [x] Quiz
* [x] QR codes
* [x] Supabase
* [x] Banque de questions
* [x] Score
* [x] Classement
* [x] Déploiement Vercel

## Version 2

* [ ] Chronomètre
* [ ] Bonus de rapidité
* [ ] Animation du classement
* [ ] Top 10
* [ ] Sons
* [ ] Effets visuels
* [ ] Écran de fin
* [ ] Statistiques

## Version 3

* [ ] Authentification administrateur
* [ ] Validation serveur des réponses
* [ ] Anti-triche
* [ ] Sessions de jeu
* [ ] Historique des parties
* [ ] Export Excel/CSV
* [ ] Gestion des gagnants
* [ ] Gestion des lots
* [ ] Tableau de bord statistique

---

# 📊 Statistiques futures

Le dashboard pourra afficher :

```text
Nombre de joueurs
        ↓
Nombre de parties
        ↓
Score moyen
        ↓
Meilleur score
        ↓
Question la plus difficile
        ↓
Catégorie la plus jouée
        ↓
Taux moyen de réussite
```

---

# 🧠 Catégories de quiz

Les catégories principales sont :

```text
MIT
NDEMRI
Malloum
Intelligence artificielle
Informatique générale
Développement Web & Mobile
Cybersécurité
Culture numérique
Innovation & entrepreneuriat au Cameroun
Logique & culture générale
MIT – Fondateurs & historique
```

---

# 👥 Public cible

L'application peut être utilisée par :

* élèves ;
* étudiants ;
* enseignants ;
* développeurs ;
* entrepreneurs ;
* agriculteurs ;
* visiteurs de salons ;
* participants à des conférences ;
* passionnés de technologie ;
* grand public.

---

# 📍 Contexte

MIT Expo Quiz est développé pour accompagner les activités de **Maroua Innovation Technology**, avec une orientation particulière vers :

* l'innovation technologique ;
* l'intelligence artificielle ;
* l'éducation numérique ;
* l'agriculture intelligente ;
* l'inclusion numérique ;
* les solutions adaptées au contexte africain.

---

# 👨‍💻 Développement

Projet :

```text
MIT Expo Quiz
```

Organisation :

```text
Maroua Innovation Technology
```

Technologies :

```text
Next.js
React
TypeScript
Supabase
PostgreSQL
Vercel
```

---

# 📄 Licence

Le code et les contenus de ce projet sont destinés à l'utilisation de Maroua Innovation Technology.

La réutilisation, redistribution ou commercialisation du contenu propriétaire doit être autorisée par les responsables du projet.

---

# 🚀 Quick Start

Pour lancer rapidement le projet :

```bash
git clone https://github.com/VOTRE-COMPTE/MIT_Expo_Quiz.git

cd MIT_Expo_Quiz

npm install
```

Créer `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

Puis :

```bash
npm run dev
```

Ouvrir :

```text
http://localhost:3000
```

---

# 🎮 Résumé

```text
        SCAN QR CODE
              ↓
        ENTRER SON NOM
              ↓
       10 QUESTIONS
              ↓
        SCORE / BONUS
              ↓
           SUPABASE
              ↓
       CLASSEMENT LIVE
              ↓
       🏆 GAGNANTS 🏆
```

**MIT Expo Quiz — Learn, Play, Compete & Win 🚀**

```
```
