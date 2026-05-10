# Syncognie — SESSION.md
> Coller ce fichier seul en debut de nouvelle discussion. Il contient tout.

---

## Projet

Laboratoire de modeles humains incomplets.
Stack : Astro + Cloudflare Pages. Route V2 : `/entree?v=2`

---

## Architecture

```
src/
├── engine/
│   ├── types.ts              → types partages (Prior, Informateur, OrientationLabel...)
│   ├── engine.ts             → evaluerAvecInformateurs(prior, anglesInit, infos, idsActifs)
│   ├── situation-melanie.ts  → Melanie 17h00, prior + 12 informateurs
│   └── rules.ts              → ancien moteur EtatVariables (conserve, non utilise en V2)
└── components/entry/
    ├── LabMelanie.astro       → composant interactif V2 (Melanie)
    └── EntryGatewayExperimental.astro → prototype V1 (Johan, conserve)
```

---

## Architecture intellectuelle V2

```
Situation (titre, contexte, question)
  → Prior situationnelle (orientation de base AVANT tout informateur)
  → Informateurs (faits revelables sur la personne)
     chacun : couche + effet {vers, poids} + forces + concepts + anglesMortsLeves
  → evaluerAvecInformateurs(idsActifs)
     → forces, concepts, anglesMorts
     → couches couvertes/faibles/absentes
     → lisibilite (0-100%)
     → orientation qualitative + confiance
     → hypothese textuelle
```

## Distinction cle

- **Lisibilite** = ce que le modele SAIT sur la personne (0 -> 100%, jamais atteint)
- **Orientation** = ce que le modele ESTIME sur la decision (prior + effets informateurs)
- Ce n'est PAS une probabilite chiffree : c'est une direction qualitative avec confiance explicite

## Prior

La situation seule cree deja un signal. Ex : "fin de journee, sport ou repos" = prior -1 (legere tendance repos). Ce n'est pas 0%.

## Vecteur d'orientation

Score interne : -6 (repos fort) a +6 (sport fort)
Labels : "repos probable" | "legere tendance repos" | "incertain" | "legere tendance sport" | "sport probable"
Confiance : "tres faible" (0 inf) | "faible" (1-2) | "moderee" (3-4) | "elevee" (5+)

---

## Conventions de code

- Strings TS/JS contenant une apostrophe francaise → double quotes obligatoires
  Exemple : `name: "cout d'activation"` et NON `name: 'cout d'activation'`
- Pas d'apostrophes typographiques dans les fichiers TS
- Pas d'accents dans les identifiants TypeScript (interfaces, types, enums)
  Exemple : `emotionnelle` et non `émotionnelle` dans les union types

---

## Etat actuel

- [x] types.ts etendu : Prior, Informateur, OrientationLabel, ResultatMoteur complet
- [x] engine.ts : evaluerAvecInformateurs() avec lisibilite + orientation + hypothese
- [x] situation-melanie.ts : prior definie, 12 informateurs sur 6 couches
- [x] LabMelanie.astro : composant interactif complet (moteur inline cote client)
- [x] Moteur rejoue a chaque clic informateur
- [x] Vecteur d'orientation avec curseur anime
- [x] Angles morts mis a jour dynamiquement
- [x] Couches mises a jour dynamiquement
- [ ] Integrer LabMelanie dans index.astro
- [ ] Situations multiples
- [ ] Phase 2 : actions simulees (aller a la salle, scroller...)

---

## Roadmap

### Phase 1 — Moteur stable (en cours)
- [x] Prior situationnelle
- [x] Informateurs avec effets ponderes
- [x] Orientation qualitative calculee
- [ ] Integrer LabMelanie dans /entree?v=2
- [ ] 2e situation (Johan ou autre)
- [ ] Tests des regles

### Phase 2 — Actions simulees
- [ ] Apres informateurs : simuler une action (scroller, sport, marcher)
- [ ] L'action modifie l'etat -> moteur rejoue
- [ ] Delta visible avant/apres action
- [ ] Concept revele par le choix

### Phase 3 — Profondeur
- [ ] Niveau de confiance par informateur (fort | speculatif | experimental)
- [ ] Angles morts enrichis (ce qu'il faudrait savoir)
- [ ] Couche biologique etendue (cortisol, cycle)

### Phase 4 — Navigation
- [ ] Plusieurs situations accessibles
- [ ] Situation ouverte (visiteur entre ses variables)

---

## Decisions actees

| Session | Decision |
|---|---|
| moteur-initial | Pas de scoring scientifique — lisibilite = info disponible, pas probabilite |
| moteur-initial | Moteur reste TS pur, sans dependance Astro |
| apostrophes | Strings avec apostrophe francaise → double quotes obligatoires |
| apostrophes | Pas d'accents dans les identifiants TS |
| prior | La situation seule cree un signal — 0% lisibilite != 0% signal |
| prior | Lisibilite et orientation sont deux variables separees |
| informateurs | Un informateur peut lever des angles morts ET en creer de nouveaux |
