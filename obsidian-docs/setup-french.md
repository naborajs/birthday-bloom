---
tags: [localization, french, francais, i18n, setup, european]
aliases: [setup-french, french-setup, francais-guide]
---

# 🌍 Guide de Localisation Multilingue : Configuration en Français (Français)

[[DOCUMENTATION_INDEX|Back to Home]] | [[quick-start|Quick Start]] | [[setup-hindi|Hindi Setup]] | [[setup-bengali|Bengali Setup]] | [[ENV_GUIDE|Env Customization Guide]] | [[architecture-env|Env Architecture]]

Birthday Bloom propose une **localisation française intégrale (Français)** avec une grande élégance poétique, une profondeur émotionnelle authentique, des tournures affectueuses adaptées à chaque membre de la famille et des templates relationnels sur mesure.

---

## 🚀 Configuration Rapide (Activer le Français)

Pour basculer l'intégralité du site en français, définissez `VITE_LANGUAGE` (ou `VITE_LANG`) dans votre fichier `.env.local` ou dans les variables d'environnement de votre hébergeur :

```env
VITE_LANGUAGE=fr
```

### Alias Acceptés
Le store réactif Zustand et le répartiteur i18n normalisent automatiquement les alias suivants vers le français (`fr`) :
- `fr`
- `french`
- `francais`
- `française`
- `francaise`

*(Insensible à la casse et nettoyé automatiquement)*

### ⚡ Test Instantané par URL (Sans Configuration)

Testez l'expérience magique en français immédiatement dans votre navigateur :
👉 [https://birthday-bloom.vercel.app/?name=Camille&rel=partner&lang=fr&color=%23FF2A6D&sender=Alexandre](https://birthday-bloom.vercel.app/?name=Camille&rel=partner&lang=fr&color=%23FF2A6D&sender=Alexandre)

---

### Basculer entre les Langues
```env
# Basculer vers le Français
VITE_LANGUAGE=fr

# Basculer vers l'Anglais (par défaut)
VITE_LANGUAGE=en

# Basculer vers l'Hindi
VITE_LANGUAGE=hi

# Basculer vers le Bengali
VITE_LANGUAGE=bn
```

> **Garantie de Secours (Fallback)** : Si `VITE_LANGUAGE` est omis, mal orthographié ou défini sur une langue non reconnue, l'application bascule automatiquement et de manière transparente sur l'anglais (`en`) sans lever d'erreur ni interrompre l'expérience utilisateur.

---

## ✍️ Typographie Française & Diacritiques

Le moteur d'écriture cinétique prend en charge l'ensemble des caractères accentués et ligatures françaises (`é`, `è`, `ê`, `ë`, `à`, `ç`, `œ`, `î`, `ï`, `ô`, `ù`) sans coupure de mots ni décalage de curseur.

---

## 📦 Ce qui Change en Mode Français

Lorsque `VITE_LANGUAGE=fr` est activé, l'ensemble des scènes et des composants s'adapte en français :

### 1. Écran de Bienvenue (`SplashScreen.tsx`)
- Invite tactile : *"Touchez n'importe où pour commencer ✨"*
- Accroche : *"Une surprise d'anniversaire magique vous attend"*

### 2. Écran de Déverrouillage par Code (`PasswordUnlock.tsx`)
- En-tête : *"Déverrouiller la Magie 🔐"*
- Sous-titre : *"Entrez le code secret pour révéler votre surprise"*
- Indices dynamiques de format de date traduits en français (ex. `MMDD` $\rightarrow$ *"Indice : La date spéciale d'aujourd'hui (Format : MMDD, ex. 0424 pour le 24 avril) 📅"*).
- Messages de validation :
  - Erreur : *"Code incorrect ! Veuillez réessayer ✨"*
  - Succès : *"Vérification réussie ! Préparation de votre surprise magique..."*

### 3. Histoire & Révélation Cinématographique (`CinematicIntro.tsx` & `FakeChatScene.tsx`)
- Scénario narratif adapté au type de relation (`partner`, `friend`, `family`, `colleague`, `mentor`).
- Faux écran de chat avec frappe simulée et retapage poétique ou humoristique :
  - *Partenaire* : *"Pour l'homme qui fait battre mon cœur..."* / *"Pour la femme de mes rêves..."*
  - *Ami(e)* : *"Attends, un simple message texte ? Ce n'est pas notre genre ! 😂"*
- Révélation du prénom avec typographie cinétique fluide : *"Ceci est tout spécialement pour vous..."* $\rightarrow$ `[Prénom]`.

### 4. Découpe du Gâteau 3D (`CakeCutting.tsx` & `CakeTypes.ts`)
- Saveurs de gâteaux traduites en français :
  - `chocolate` $\rightarrow$ *"Rêve Chocolaté"* 🍫
  - `strawberry` $\rightarrow$ *"Délice Fraise"* 🍓
  - `royal` $\rightarrow$ *"Velours Royal"* 👑
  - `nature` $\rightarrow$ *"Jardin Floral"* 🌸
- Vœux soufflés : *"✨ Faites un vœu et soufflez les bougies ✨"*
- Animation de cuisson : *"Préparation de votre gâteau..."*
- Citations finales et bouton d'action : *"✕ Terminer l'expérience"*.

### 5. Galerie & Arbre des Cœurs (`HeartTree.tsx` & `PhotoGallery.tsx`)
- Messages poétiques et bienveillants sur chaque cœur cliquable.
- Citations spéciales françaises selon la relation (`FRENCH_SPECIAL_QUOTES`).
- Légendes de photos automatiques (`FRENCH_HEART_MESSAGES`).

### 6. Quiz d'Anniversaire Personnalisé (`BirthdayQuiz.tsx`)
- Questions interactives en français adaptées aux passions (voitures, code, etc.) et aux relations.
- Écran de score final : *"SCORE LÉGENDAIRE ! 🏆"*, *"Vous avez obtenu X/Y au Quiz d'Anniversaire !"*, *"Rejouer 🔄"*.

### 7. Lettre & Grands Vœux (`MainBirthday.tsx` & `frenchTemplates.ts`)
- Génération automatique de lettres émotionnelles riches selon le membre de la famille ou le rôle (`partner`, `friend`, `brother`, `sister`, `father`, `mother`, `colleague`, `mentor`, `family`).
- Remplacement élégant de la signature `[Votre Nom]` par `VITE_BIRTHDAY_WISHER_NAME`.

---

## 🛠️ Exemple Complet de Configuration `.env.local`

```env
# Identité
VITE_BIRTHDAY_NAME=Camille
VITE_BIRTHDAY_AGE=28
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_WISHER_NAME=Julien
VITE_BIRTHDAY_DATE=2026-06-15T00:00:00

# Langue : Français
VITE_LANGUAGE=fr

# Personnalisation
VITE_BIRTHDAY_CUSTOM_MESSAGE=Joyeux Anniversaire mon amour ! Que cette journée soit aussi lumineuse que toi.
VITE_BIRTHDAY_LETTER_TITLE=À l'amour de ma vie 💌
VITE_BIRTHDAY_COLOR=#FF4D6D
VITE_BIRTHDAY_INTERESTS=Travel,Photography,Music
VITE_PASSWORD_FORMAT=DDMM
```

---

## 🧪 Vérification & Tests

La localisation française est entièrement couverte par la suite de tests automatisés :

```bash
# Lancer les tests unitaires
npm run test

# Vérifier la compilation TypeScript
npx tsc --noEmit

# Vérifier le linting
npm run lint

# Compiler pour la production
npm run build
```
