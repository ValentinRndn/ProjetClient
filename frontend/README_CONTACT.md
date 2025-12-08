# Page Contact - Vizion Academy

## 📋 Vue d'ensemble

Page "Nous Contacter" complète et professionnelle avec formulaire de contact, informations de l'entreprise et présentation de l'équipe. Layout 2 colonnes responsive.

## 🚀 Accès

La page est accessible via :
- Navigation principale : **Bouton "Contact"** dans MainNav
- URL directe : `/contact`
- Liens footer de toutes les pages

## 🎨 Design

### Palette de couleurs
- `dark-blue`: #272757
- `lavender-gray`: #8686AC
- `mid-purple`: #505081 - Accent principal
- `night-blue`: #0F0E47 - Bouton primaire

### Règle typographique stricte
**TOUS les textes sont soit `#000` (body-black) soit `#fff` (body-white)** selon le contraste.

## 📦 Structure des fichiers

```
web/
├── src/
│   ├── pages/
│   │   └── ContactPage.jsx                # Page principale
│   ├── components/
│   │   ├── MainNav.jsx                    # Navigation principale
│   │   └── contact/
│   │       ├── ContactForm.jsx            # Formulaire avec validation
│   │       ├── ContactInfo.jsx            # Bloc infos (adresse/email/tel)
│   │       └── TeamCard.jsx               # Carte membre équipe
└── README_CONTACT.md                      # Cette documentation
```

## 🧩 Composants

### 1. **ContactPage** (Page principale)
Page complète avec layout 2 colonnes :
- Hero section (titre + intro)
- Colonne gauche : Formulaire de contact
- Colonne droite : Infos contact + équipe
- Bloc logo & baseline
- Footer complet

**Responsive** :
- Desktop : 2 colonnes (lg:grid-cols-2)
- Mobile : 1 colonne empilée

### 2. **ContactForm**
Formulaire complet avec validation côté client

**Champs** :
- Nom * (required)
- Prénom * (required)
- Email * (required, format validation)
- Téléphone (optional)
- Message * (required, textarea)

**Validation** :
- Champs requis vérifié
- Format email validé (regex)
- Affichage erreurs sous champs
- Border rouge si erreur

**Soumission** :
- Console.log des données
- Animation CheckCircle verte
- Message "Message envoyé !"
- Reset automatique après 3s

**État** :
- `formData` (object) - Données du formulaire
- `errors` (object) - Erreurs de validation
- `submitted` (boolean) - État post-soumission

### 3. **ContactInfo**
Bloc d'informations de contact avec icônes

**Contenu** :
- **Adresse** : H7, 70 quai Perrache, 69002 Lyon, France
- **Email** : secretariat@vizionacademy.fr (cliquable mailto:)
- **Téléphone** : +33 6 59 19 65 50 (cliquable tel:)

**Style** :
- Icônes dans badges mid-purple/10
- Titres en gras
- Liens hover avec transition

### 4. **TeamCard**
Carte membre de l'équipe réutilisable

**Props** :
- `member` (object) - { initial, name, role, phone, email }

**Structure** :
- Avatar circulaire avec initiale (gradient mid-purple → dark-blue)
- Nom en gras
- Rôle en gris
- Téléphone cliquable (tel:)
- Email cliquable (mailto:) si présent

**Équipe** (3 membres) :
1. **Mickael NOGUEIRA** - Gestion des intervenants - 06 84 88 96 94
2. **Guillaume ROURE** - Gestion des écoles et planification des challenges - 06 59 19 65 50
3. **Narjesse MALKI** - Facturation et gestion administrative - 06 50 71 77 42

## 📝 Texte intégré (exact)

### Hero
- **Titre** : NOUS CONTACTER
- **Sous-titre** : Vous avez des questions ?
- **Description** : "Que vous ayez une question, une suggestion ou que vous souhaitiez simplement nous dire bonjour, nous sommes là pour vous aider. N'hésitez pas à nous contacter."

### Formulaire
- Labels : Nom *, Prénom *, Email *, Téléphone, Message *
- Mentions : "Les données ci-dessus sont nécessaires pour répondre à votre demande de contact. Elles sont traitées conformément à notre politique de confidentialité."
- Bouton : **ENVOYER**

### Informations contact
- Titre section : "Informations contact"
- Adresse, Email, Téléphone

### Équipe
- Titre section : "Notre équipe à votre service"
- 3 cartes avec initiale, nom, rôle, téléphone

### Footer
- Logo Vizion Academy
- Baseline : "Mise en relation entre experts et établissements d'enseignement."
- Navigation complète (4 colonnes)
- Contact : secretariat@vizionacademy.fr, 06 59 19 65 50
- Légal : Mentions Légales, Politique de confidentialité
- Copyright : "© 2025 Vizion Academy. Développé sur base44."

## ✅ Validation du formulaire

### Règles
1. **Nom** : Required, non vide
2. **Prénom** : Required, non vide
3. **Email** : Required, format valide (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
4. **Téléphone** : Optional
5. **Message** : Required, non vide

### Comportement
- Validation au submit
- Erreurs affichées sous champs concernés
- Border rouge si erreur
- Clear erreur au changement de champ
- Empêche submit si erreurs

### Messages d'erreur
- "Le nom est obligatoire"
- "Le prénom est obligatoire"
- "L'email est obligatoire"
- "Email invalide"
- "Le message est obligatoire"

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 1024px) : 1 colonne, formulaire + infos empilés
- **Desktop** (> 1024px) : 2 colonnes côte à côte

### Adaptations mobile
- Hero : Titre réduit si nécessaire
- Grid : `grid-cols-1` → `lg:grid-cols-2`
- Footer : 2 cols → 4 cols (md:grid-cols-4)
- Espacements ajustés

## ♿ Accessibilité

### Sémantique HTML
- `<header>`, `<main>`, `<footer>`
- `<form>` avec labels explicites
- Headings hiérarchiques (h1 → h4)

### Labels et inputs
- Tous les inputs ont des labels associés
- Icônes décoratives (lucide-react)
- Placeholders informatifs

### Interactions
- Focus visible sur tous les inputs
- Enter key submit form
- Liens cliquables (mailto:, tel:)
- Navigation clavier complète

### Contraste
- Strict #000 / #fff pour textes
- Erreurs en rouge visible
- Success en vert visible

## 🎯 Fonctionnalités

### 1. Formulaire de contact
- Validation complète
- Animation de succès
- Reset automatique
- Console log des données

### 2. Informations de contact
- Adresse complète
- Email cliquable (mailto:)
- Téléphone cliquable (tel:)

### 3. Présentation équipe
- 3 membres avec rôles
- Contacts directs (tel: / mailto:)
- Avatars avec initiales

### 4. Footer complet
- Navigation vers toutes les pages
- Contact et légal
- Logo + baseline

## 🔧 État et gestion

### État formulaire
```javascript
const [formData, setFormData] = useState({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  message: ''
});

const [errors, setErrors] = useState({});
const [submitted, setSubmitted] = useState(false);
```

### Workflow soumission
1. User remplit formulaire
2. Click "ENVOYER"
3. Validation (client-side)
4. Si erreurs : affichage sous champs
5. Si OK :
   - Console.log données
   - `submitted = true`
   - Affichage CheckCircle + message
   - Timeout 3s
   - Reset + `submitted = false`

## 🧪 Tests à effectuer

### Validation
- [ ] Soumettre form vide → erreurs affichées
- [ ] Email invalide → erreur "Email invalide"
- [ ] Remplir tous requis → submit OK
- [ ] Téléphone optionnel → submit OK sans
- [ ] Erreur disparaît au changement de champ

### Soumission
- [ ] Submit réussi → animation succès
- [ ] Message "Message envoyé !"
- [ ] Reset automatique après 3s
- [ ] Console.log contient données

### Liens
- [ ] Email cliquable ouvre client mail
- [ ] Téléphones cliquables ouvrent dialer
- [ ] Équipe : tel: et mailto: fonctionnent

### Responsive
- [ ] Desktop : 2 colonnes
- [ ] Mobile : 1 colonne empilée
- [ ] Footer adapté
- [ ] Formulaire lisible sur mobile

### Navigation
- [ ] Bouton "Contact" dans MainNav → /contact
- [ ] Footer liens fonctionnent
- [ ] Logo cliquable → retour home

## 🎨 Styling spécifique

### Formulaire
- Cards blanches avec shadow-lg
- Inputs border-2 gray-200
- Focus : border-mid-purple
- Error : border-red-500
- Bouton : bg-night-blue, text-body-white

### Équipe
- Avatars circulaires gradient (mid-purple → dark-blue)
- Initiales blanches bold 2xl
- Cards hover shadow-xl

### Infos contact
- Badges icônes mid-purple/10
- Liens mid-purple hover dark-blue

## 📊 Données équipe

```javascript
const teamMembers = [
  {
    initial: 'M',
    name: 'Mickael NOGUEIRA',
    role: 'Gestion des intervenants',
    phone: '06 84 88 96 94',
    email: 'mickael.nogueira@vizionacademy.fr'
  },
  {
    initial: 'G',
    name: 'Guillaume ROURE',
    role: 'Gestion des écoles et planification des challenges',
    phone: '06 59 19 65 50',
    email: 'guillaume.roure@vizionacademy.fr'
  },
  {
    initial: 'N',
    name: 'Narjesse MALKI',
    role: 'Facturation et gestion administrative',
    phone: '06 50 71 77 42',
    email: 'narjesse.malki@vizionacademy.fr'
  }
];
```

## 🔄 Workflow utilisateur

1. User clique "Contact" dans navigation
2. Arrive sur page /contact
3. Voit hero + formulaire + infos
4. Remplit formulaire
5. Click "ENVOYER"
6. Si erreurs : correction
7. Si OK : confirmation visuelle
8. Auto-reset après 3s
9. Peut contacter équipe directement via tel/email

## 🔧 Améliorations futures

- [ ] Backend API pour envoi réel des messages
- [ ] Captcha anti-spam
- [ ] Upload fichiers (CV, devis, etc.)
- [ ] Confirmation par email
- [ ] Tracking des demandes (CRM)
- [ ] Chatbot intégré
- [ ] Horaires d'ouverture
- [ ] Carte Google Maps intégrée
- [ ] FAQ inline
- [ ] Formulaires multiples (partenariat, recrutement, etc.)

## 📞 Contact

### Email
secretariat@vizionacademy.fr

### Téléphone
+33 6 59 19 65 50

### Adresse
H7, 70 quai Perrache
69002 Lyon, France

## 📝 Notes techniques

### Performance
- Components légers et réutilisables
- Validation client-side (pas de fetch)
- State local minimal
- Pas de re-renders inutiles

### Maintenabilité
- Components séparés et isolés
- Props bien définies
- Code commenté
- Structure modulaire

### Sécurité
- Validation format email
- Pas d'injection HTML
- Links externes avec rel="noopener noreferrer"
- Console.log uniquement (pas de backend exposé)

---

**Développé pour Vizion Academy** | © 2025 | [base44](https://base44.com)
