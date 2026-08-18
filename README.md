MIT EXPO QUIZ — MVP RAPIDE

1. Créer un projet Supabase.
2. SQL Editor -> exécuter supabase/schema.sql.
3. Copier .env.example vers .env.local et renseigner les variables Supabase.
4. npm install
5. npm run dev
6. Déployer le dépôt sur Vercel et renseigner les mêmes variables dans Project Settings > Environment Variables.

QR CODES
- Générer un QR contenant https://VOTRE-DOMAINE.vercel.app/play/STAND-A
- Autres QR: /play/STAND-B, /play/STAND-C, etc.
- L'écran maître: /live
- Administration: /admin

IMPORTANT
Le jeu récupère les questions depuis la table Supabase `questions` via la fonction `get_random_questions(question_limit, category_filter)`.
Importer qcm_500_par_categorie_supabase.csv dans la table `questions` (SQL Editor -> Table Editor -> Import data) après avoir exécuté supabase/schema.sql.
Le joueur choisit lui-même la catégorie (ou "Toutes les catégories") et le nombre de questions (5/10/15/20) avant de démarrer.
