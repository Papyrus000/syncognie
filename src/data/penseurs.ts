export type Domaine =
  | 'cerveau'
  | 'construction'
  | 'relations'
  | 'sens'
  | 'systemes'
  | 'pouvoir'
  | 'philosophie';

export interface Penseur {
  id: string;
  nom: string;
  dates?: string;
  concept: string;
  description: string;
  domaine: Domaine;
  niveau: 1 | 2 | 3;
  validite: 'très haute' | 'haute' | 'bonne' | 'philosophique' | 'clinique';
}

export const DOMAINES: Record<Domaine, { label: string; couleur: string }> = {
  cerveau:      { label: 'Cerveau & pensée',     couleur: '#c07040' },
  construction: { label: 'Se construire',         couleur: '#7a9e6e' },
  relations:    { label: 'Relations',             couleur: '#8a70b0' },
  sens:         { label: 'Sens & motivation',     couleur: '#c09040' },
  systemes:     { label: 'Systèmes & complexité', couleur: '#5090a0' },
  pouvoir:      { label: 'Pouvoir & société',     couleur: '#a06060' },
  philosophie:  { label: 'Philosophie pratique',  couleur: '#708060' },
};

export const PENSEURS: Penseur[] = [
  // ── Niveau 1 · Cerveau ──
  {
    id: 'kahneman',
    nom: 'Daniel Kahneman',
    dates: '1934–2024',
    concept: 'Système 1 / Système 2',
    description: 'Deux modes de pensée : automatique/intuitif et délibéré/lent. Le premier domine presque tout. Les biais cognitifs ne sont pas des défauts — ils sont la structure normale de notre pensée.',
    domaine: 'cerveau',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'barrett',
    nom: 'Lisa Feldman Barrett',
    concept: 'Les émotions sont construites',
    description: 'Les émotions ne t\'arrivent pas dessus. Ton cerveau les fabrique à partir du contexte, de tes attentes, et du vocabulaire émotionnel que tu possèdes. Plus ce vocabulaire est précis, plus tes émotions sont gérables.',
    domaine: 'cerveau',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'damasio',
    nom: 'Antonio Damasio',
    concept: 'Le corps dans la décision',
    description: 'La raison sans émotion ne fonctionne pas. Les émotions sont de l\'information corporelle qui guide la décision avant que la raison intervienne. Déconstruit le mythe de la décision purement rationnelle.',
    domaine: 'cerveau',
    niveau: 1,
    validite: 'haute',
  },
  {
    id: 'sapolsky',
    nom: 'Robert Sapolsky',
    concept: 'La biologie du comportement',
    description: 'Pourquoi faisons-nous ce que nous faisons ? Hormones, contexte social, enfance, évolution — tout s\'accumule et détermine l\'acte. Rend lucide sur les vrais déterminants du comportement sans être fataliste.',
    domaine: 'cerveau',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'lembke',
    nom: 'Anna Lembke',
    concept: 'La dopamine et le plaisir',
    description: 'L\'économie plaisir/douleur dans le cerveau. Dans un monde d\'abondance de stimuli, le cerveau bascule en mode déficit chronique — ce qui explique l\'addiction au sens large : écrans, validation, urgence.',
    domaine: 'cerveau',
    niveau: 1,
    validite: 'haute',
  },

  // ── Niveau 1 · Construction ──
  {
    id: 'bowlby-ainsworth',
    nom: 'Bowlby & Ainsworth',
    dates: '1907–1990 / 1913–1999',
    concept: 'La théorie de l\'attachement',
    description: 'Le lien formé dans l\'enfance crée un modèle interne de ce qu\'est une relation. Ce modèle filtre tout ce qui vient ensuite — comment on cherche ou fuit la proximité, comment on réagit au conflit.',
    domaine: 'construction',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'dweck',
    nom: 'Carol Dweck',
    concept: 'État d\'esprit fixe vs de développement',
    description: 'Croire que ses capacités sont fixes ou développables change tout : la façon d\'affronter les défis, d\'interpréter les échecs, de se parler à soi-même. Simple en apparence, profond dans les implications.',
    domaine: 'construction',
    niveau: 1,
    validite: 'haute',
  },
  {
    id: 'kegan',
    nom: 'Robert Kegan',
    concept: 'Le développement adulte',
    description: 'Le développement psychologique ne s\'arrête pas à 20 ans. Des stades de conscience — non d\'intelligence, mais de la façon dont on construit la réalité. La plupart des souffrances adultes naissent d\'un écart entre la complexité du monde et le stade depuis lequel on le regarde.',
    domaine: 'construction',
    niveau: 1,
    validite: 'haute',
  },
  {
    id: 'ellis-beck',
    nom: 'Ellis & Beck',
    concept: 'La thérapie cognitive (TCC)',
    description: 'Nos souffrances ne viennent pas des événements mais de ce qu\'on en pense. Les croyances irrationnelles sont repérables et modifiables. Base de toute la psychothérapie moderne evidence-based.',
    domaine: 'construction',
    niveau: 1,
    validite: 'très haute',
  },

  // ── Niveau 1 · Relations ──
  {
    id: 'gottman',
    nom: 'John Gottman',
    concept: 'La science du conflit relationnel',
    description: 'Quarante ans de recherche. Les Quatre Cavaliers — mépris, critique, défensivité, mur de pierre — prédisent la rupture. Le mépris est le plus destructeur. La qualité d\'une relation se mesure au ratio positif/négatif dans les échanges ordinaires.',
    domaine: 'relations',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'watzlawick',
    nom: 'Paul Watzlawick',
    dates: '1921–2007',
    concept: 'On ne peut pas ne pas communiquer',
    description: 'Tout message a deux niveaux : le contenu et la relation. La plupart des conflits se jouent au niveau relationnel sans qu\'on le nomme. La réalité est construite dans l\'interaction.',
    domaine: 'relations',
    niveau: 1,
    validite: 'haute',
  },
  {
    id: 'rosenberg',
    nom: 'Marshall Rosenberg',
    dates: '1934–2015',
    concept: 'Communication NonViolente',
    description: 'Tout comportement est une tentative de satisfaire un besoin. Passer des jugements aux besoins — pour soi et pour l\'autre — change la nature des échanges. Pont direct entre théorie et pratique quotidienne.',
    domaine: 'relations',
    niveau: 1,
    validite: 'bonne',
  },
  {
    id: 'perel',
    nom: 'Esther Perel',
    concept: 'Le désir dans la durée',
    description: 'La sécurité et le désir tirent dans des directions opposées. La proximité nourrit le lien mais tue le désir. Ce paradoxe est au cœur de la vie amoureuse longue — il ne se résout pas, il se gère consciemment.',
    domaine: 'relations',
    niveau: 1,
    validite: 'clinique',
  },
  {
    id: 'buber',
    nom: 'Martin Buber',
    dates: '1878–1965',
    concept: 'Je-Tu / Je-Cela',
    description: 'Deux façons d\'être en relation : traiter l\'autre comme un objet ou moyen (Je-Cela), ou le rencontrer vraiment comme un sujet (Je-Tu). Simple à comprendre, difficile à pratiquer, fondateur en philosophie du dialogue.',
    domaine: 'relations',
    niveau: 1,
    validite: 'philosophique',
  },

  // ── Niveau 1 · Sens ──
  {
    id: 'frankl',
    nom: 'Viktor Frankl',
    dates: '1905–1997',
    concept: 'La volonté de sens',
    description: 'L\'être humain peut supporter presque tout s\'il a un pourquoi. Le sens n\'est pas donné — il est trouvé ou construit. Issu de l\'expérience des camps de concentration, validé par la clinique.',
    domaine: 'sens',
    niveau: 1,
    validite: 'clinique',
  },
  {
    id: 'deci-ryan',
    nom: 'Deci & Ryan',
    concept: 'Théorie de l\'autodétermination',
    description: 'Trois besoins fondamentaux : autonomie, compétence, appartenance. La motivation externe détruit systématiquement la motivation interne. La théorie de la motivation la mieux validée empiriquement.',
    domaine: 'sens',
    niveau: 1,
    validite: 'très haute',
  },
  {
    id: 'csikszentmihalyi',
    nom: 'Mihaly Csikszentmihalyi',
    dates: '1934–2021',
    concept: 'Le flow',
    description: 'L\'état optimal d\'expérience — quand défi et compétence s\'équilibrent exactement. Ni trop facile, ni trop difficile. La vie bonne n\'est pas une vie sans effort mais une vie structurée autour de ces états d\'absorption totale.',
    domaine: 'sens',
    niveau: 1,
    validite: 'haute',
  },
  {
    id: 'seligman',
    nom: 'Martin Seligman',
    concept: 'Psychologie positive — PERMA',
    description: 'Fondateur de la psychologie positive : l\'étude scientifique de ce qui fait qu\'une vie humaine s\'épanouit. Le modèle PERMA — Émotions positives, Engagement, Relations, Sens, Accomplissement.',
    domaine: 'sens',
    niveau: 1,
    validite: 'haute',
  },

  // ── Niveau 2 · Systèmes ──
  {
    id: 'bateson',
    nom: 'Gregory Bateson',
    dates: '1904–1980',
    concept: 'Les niveaux logiques',
    description: 'Père intellectuel de toute la pensée systémique moderne. On confond constamment les niveaux logiques — on traite comme un problème de comportement ce qui est un problème d\'identité, ou comme un problème personnel ce qui est structurel.',
    domaine: 'systemes',
    niveau: 2,
    validite: 'haute',
  },
  {
    id: 'meadows',
    nom: 'Donella Meadows',
    dates: '1941–2001',
    concept: 'Penser en systèmes',
    description: 'Les systèmes ont des points de levier contre-intuitifs. On agit presque toujours au mauvais endroit. Elle donne les outils pour identifier où intervenir vraiment — applicable à une organisation, une relation ou une habitude.',
    domaine: 'systemes',
    niveau: 2,
    validite: 'très haute',
  },
  {
    id: 'taleb',
    nom: 'Nassim Taleb',
    concept: 'Antifragilité & Cygne Noir',
    description: 'Les événements rares et imprévisibles dominent l\'histoire. L\'obsession du contrôle rend fragile. Certains systèmes s\'améliorent grâce aux chocs : c\'est l\'antifragilité. Renverse l\'intuition sur le risque et la stabilité.',
    domaine: 'systemes',
    niveau: 2,
    validite: 'haute',
  },
  {
    id: 'kuhn',
    nom: 'Thomas Kuhn',
    dates: '1922–1996',
    concept: 'Les paradigmes',
    description: 'On ne voit pas la réalité directement — on la voit à travers un paradigme, un cadre invisible d\'hypothèses implicites. Changer de vie, c\'est souvent changer de paradigme, pas juste de comportement.',
    domaine: 'systemes',
    niveau: 2,
    validite: 'très haute',
  },
  {
    id: 'argyris',
    nom: 'Chris Argyris',
    dates: '1923–2013',
    concept: 'Théories déclarées vs théories d\'usage',
    description: 'On a tous deux théories : celle qu\'on déclare et celle qu\'on pratique réellement sous pression. L\'écart entre les deux est la source principale des dysfonctionnements — organisationnels et personnels.',
    domaine: 'systemes',
    niveau: 2,
    validite: 'haute',
  },

  // ── Niveau 2 · Pouvoir ──
  {
    id: 'arendt',
    nom: 'Hannah Arendt',
    dates: '1906–1975',
    concept: 'La banalité du mal & le pouvoir',
    description: 'Comment des gens ordinaires participent à des systèmes destructeurs — non par malveillance mais par absence de pensée. La distinction entre pouvoir (action collective) et violence (substitut à l\'absence de pouvoir).',
    domaine: 'pouvoir',
    niveau: 2,
    validite: 'philosophique',
  },
  {
    id: 'foucault',
    nom: 'Michel Foucault',
    dates: '1926–1984',
    concept: 'Le pouvoir comme réseau',
    description: 'Le pouvoir n\'est pas dans les mains de quelques-uns — il est dans les normes, les institutions, le discours, les corps. Ce qui compte comme vrai, normal, sain est produit par des rapports de pouvoir invisibles.',
    domaine: 'pouvoir',
    niveau: 2,
    validite: 'philosophique',
  },
  {
    id: 'girard',
    nom: 'René Girard',
    dates: '1923–2015',
    concept: 'Le désir mimétique',
    description: 'On ne désire pas les choses pour elles-mêmes — on les désire parce qu\'un autre les désire. La rivalité, la jalousie, la mode, le bouc émissaire : tout s\'y lit. D\'une puissance explicative rare sur les dynamiques sociales.',
    domaine: 'pouvoir',
    niveau: 2,
    validite: 'philosophique',
  },

  // ── Niveau 3 · Philosophie ──
  {
    id: 'stoiciens',
    nom: 'Les Stoïciens',
    dates: 'IIIe s. av. J.-C. – IIe s.',
    concept: 'Ce qui dépend de nous',
    description: 'La distinction fondamentale : ce qui dépend de nous (jugements, intentions, réactions) et ce qui n\'en dépend pas (événements, autres, corps). Toute la sagesse stoïcienne en découle. La thérapie cognitive en est directement issue.',
    domaine: 'philosophie',
    niveau: 3,
    validite: 'philosophique',
  },
  {
    id: 'aristote',
    nom: 'Aristote',
    dates: '384–322 av. J.-C.',
    concept: 'L\'éthique de la vertu & l\'eudaimonia',
    description: 'Le bonheur n\'est pas un état — c\'est une activité. Il vient de l\'exercice de ses capacités propres en direction du bien. Les vertus ne sont pas des règles mais des habitudes cultivées.',
    domaine: 'philosophie',
    niveau: 3,
    validite: 'philosophique',
  },
  {
    id: 'kabat-zinn',
    nom: 'Jon Kabat-Zinn',
    concept: 'La pleine conscience (MBSR)',
    description: 'Ce n\'est pas une spiritualité — c\'est une compétence d\'attention validée par des centaines d\'études. La capacité à observer ses états internes sans s\'y identifier change profondément la relation à l\'anxiété et aux émotions réactives.',
    domaine: 'philosophie',
    niveau: 3,
    validite: 'très haute',
  },
];
