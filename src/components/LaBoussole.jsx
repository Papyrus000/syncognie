import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────

const MODELES = [
  {
    id: "godel",
    nom: "Incomplétude des systèmes formels",
    auteur: "Kurt Gödel",
    annee: "1931",
    domaine_principal: "mathematiques",
    domaines_secondaires: ["epistemologie", "philosophie"],
    resume: "Tout système formel suffisamment puissant contient des vérités qu'il ne peut pas démontrer.",
    territoire: [
      "Les limites internes de tout système axiomatique",
      "La distinction entre vérité et prouvabilité",
      "L'impossibilité de la complétude et de la cohérence simultanées",
      "Les fondements logiques des mathématiques"
    ],
    limites: [
      "Ne s'applique qu'aux systèmes formels suffisamment expressifs",
      "Ne dit rien sur la vérité des énoncés indécidables",
      "N'est pas directement transposable aux systèmes humains ou sociaux",
      "Reste silencieux sur ce qu'on devrait faire face à l'incomplétude"
    ],
    zones_risquees: [
      "Être utilisé pour justifier le relativisme général (\"rien n'est prouvable\")",
      "Être confondu avec de l'incertitude empirique ou épistémique ordinaire",
      "Servir de prétexte à l'abandon de la rigueur logique"
    ],
    connexions: {
      complementaires: ["korzybski", "kuhn"],
      contradictoires: [],
      synergie: [
        { avec: "korzybski", texte: "Ensemble, ils montrent que ni les cartes formelles ni les cartes linguistiques ne peuvent épuiser leur territoire." },
        { avec: "kuhn", texte: "Gödel montre l'incomplétude interne ; Kuhn montre l'incomplétude historique — la science bute sur ses propres bords." }
      ]
    }
  },
  {
    id: "newton",
    nom: "Mécanique classique",
    auteur: "Isaac Newton",
    annee: "1687",
    domaine_principal: "physique",
    domaines_secondaires: ["mathematiques"],
    resume: "Le mouvement des corps obéit à des lois précises, déterministes et universelles.",
    territoire: [
      "Les mouvements à faible vitesse et grande échelle",
      "La gravitation terrestre et céleste",
      "La prédiction des trajectoires et des forces",
      "L'ingénierie, l'architecture, la balistique"
    ],
    limites: [
      "Inapplicable aux vitesses proches de celle de la lumière",
      "Aveugle à l'échelle quantique",
      "Ne traite pas la courbure de l'espace-temps",
      "Suppose un temps et un espace absolus qui n'existent pas"
    ],
    zones_risquees: [
      "Croire que l'univers entier est déterministe et prédictible",
      "Appliquer la logique mécanique aux systèmes vivants ou sociaux",
      "Confondre modèle avec réalité — la trajectoire calculée n'est pas la trajectoire vécue"
    ],
    connexions: {
      complementaires: ["einstein", "darwin"],
      contradictoires: ["einstein"],
      synergie: [
        { avec: "einstein", texte: "Newton reste valide dans ses domaines — Einstein ne l'abolit pas, il le contient comme cas limite." }
      ]
    }
  },
  {
    id: "einstein",
    nom: "Relativité restreinte et générale",
    auteur: "Albert Einstein",
    annee: "1905–1915",
    domaine_principal: "physique",
    domaines_secondaires: ["mathematiques", "philosophie"],
    resume: "L'espace, le temps et la masse sont relatifs à l'observateur ; la gravité est courbure de l'espace-temps.",
    territoire: [
      "Les vitesses élevées et les champs gravitationnels intenses",
      "La cosmologie et la structure de l'univers",
      "Le GPS, les technologies de précision temporelle",
      "L'unification de l'espace et du temps"
    ],
    limites: [
      "Incompatible avec la mécanique quantique à certaines échelles",
      "Ne décrit pas les phénomènes quantiques",
      "Les équations deviennent singulières dans les trous noirs",
      "Inutile pour les vitesses ordinaires — Newton suffit"
    ],
    zones_risquees: [
      "Inférer que \"tout est relatif\" au sens moral ou épistémique",
      "Croire que la relativité supprime toute objectivité",
      "Oublier que la relativité est elle-même une théorie absolue des transformations"
    ],
    connexions: {
      complementaires: ["newton", "godel"],
      contradictoires: ["newton"],
      synergie: [
        { avec: "newton", texte: "Newton est Einstein au repos — deux modèles valides dans des régimes différents." }
      ]
    }
  },
  {
    id: "darwin",
    nom: "Sélection naturelle",
    auteur: "Charles Darwin",
    annee: "1859",
    domaine_principal: "biologie",
    domaines_secondaires: ["sciences_sociales", "philosophie"],
    resume: "Les organismes qui s'adaptent le mieux à leur environnement survivent et se reproduisent davantage.",
    territoire: [
      "L'origine et la diversification des espèces",
      "Les adaptations morphologiques et comportementales",
      "L'évolution sur des milliers de générations",
      "La phylogénétique et la biologie comparative"
    ],
    limites: [
      "N'explique pas la conscience ou l'expérience subjective",
      "Aveugle aux dynamiques culturelles et symboliques humaines",
      "Ne prescrit rien — il décrit sans valider ni invalider",
      "Lent — ne rend pas compte des adaptations rapides"
    ],
    zones_risquees: [
      "Le darwinisme social — confondre description et prescription",
      "Réduire le comportement humain à la \"survie du plus fort\"",
      "Croire que ce qui existe est nécessairement adaptatif"
    ],
    connexions: {
      complementaires: ["mcgilchrist", "freud"],
      contradictoires: [],
      synergie: [
        { avec: "mcgilchrist", texte: "Darwin donne le substrat évolutif ; McGilchrist montre ce que la sélection a construit dans le cerveau humain." }
      ]
    }
  },
  {
    id: "freud",
    nom: "Psychanalyse",
    auteur: "Sigmund Freud",
    annee: "1895–1939",
    domaine_principal: "psychologie",
    domaines_secondaires: ["philosophie", "sciences_sociales"],
    resume: "Le comportement humain est largement déterminé par des forces inconscientes, des conflits et des désirs refoulés.",
    territoire: [
      "Les symptômes névrotiques et leurs origines",
      "Le rôle de l'inconscient dans la vie psychique",
      "Les mécanismes de défense",
      "Le transfert dans la relation thérapeutique"
    ],
    limites: [
      "Difficilement falsifiable empiriquement",
      "Peu efficace sur les troubles sévères ou biologiques",
      "Biais culturel fort — ancré dans la Vienne bourgeoise du XIXe",
      "Sous-estime les facteurs cognitifs et comportementaux"
    ],
    zones_risquees: [
      "Attribuer tout comportement à un refoulement sexuel",
      "Confondre interprétation narrative et explication causale",
      "Utiliser la psychanalyse comme modèle universel de la psyché"
    ],
    connexions: {
      complementaires: ["beck", "darwin"],
      contradictoires: ["beck"],
      synergie: [
        { avec: "beck", texte: "Freud illumine l'origine ; Beck intervient sur la structure actuelle. Les deux ensemble évitent l'impasse de chacun." }
      ]
    }
  },
  {
    id: "beck",
    nom: "Thérapie Cognitive et Comportementale",
    auteur: "Aaron Beck",
    annee: "1960s",
    domaine_principal: "psychologie",
    domaines_secondaires: [],
    resume: "Les pensées automatiques et les schémas cognitifs façonnent les émotions et les comportements — et peuvent être modifiés.",
    territoire: [
      "Les troubles anxieux, dépressifs, phobiques",
      "Les distorsions cognitives identifiables",
      "Les interventions brèves et ciblées",
      "La mesure des effets thérapeutiques"
    ],
    limites: [
      "Moins adapté aux troubles de la personnalité profonds",
      "Peut négliger la dimension relationnelle et inconsciente",
      "Centré sur le présent — silence sur les causes historiques",
      "Risque de technicisation de la souffrance"
    ],
    zones_risquees: [
      "Croire que toute souffrance est une distorsion cognitive à corriger",
      "Ignorer les dimensions corporelles et sociales de la détresse",
      "Réduire la thérapie à un protocole technique"
    ],
    connexions: {
      complementaires: ["freud", "mcgilchrist"],
      contradictoires: ["freud"],
      synergie: [
        { avec: "freud", texte: "Beck structure et mesure ; Freud explore les profondeurs. Aucun ne couvre seul l'espace de la psyché." }
      ]
    }
  },
  {
    id: "mcgilchrist",
    nom: "Hémisphères et modes d'attention",
    auteur: "Iain McGilchrist",
    annee: "2009",
    domaine_principal: "biologie",
    domaines_secondaires: ["philosophie", "psychologie", "histoire"],
    resume: "Les deux hémisphères cérébraux offrent deux modes d'attention fondamentalement différents qui façonnent notre rapport au monde.",
    territoire: [
      "La neurologie fonctionnelle des hémisphères",
      "La distinction entre attention focale et attention ouverte",
      "L'impact du déséquilibre hémisphérique sur la civilisation",
      "La relation entre cerveau, culture et représentation du monde"
    ],
    limites: [
      "Critiqué pour des généralisations sur la latéralisation",
      "Difficile à tester empiriquement dans ses claims civilisationnels",
      "Ne couvre pas les troubles neurologiques et psychiatriques précis",
      "Peut sembler spéculatif dans ses thèses historiques"
    ],
    zones_risquees: [
      "Réduire chaque individu à un mode hémisphérique dominant",
      "Confondre métaphore neurologique et anatomie littérale",
      "Utiliser le modèle comme grille de jugement moral"
    ],
    connexions: {
      complementaires: ["darwin", "beck", "korzybski"],
      contradictoires: [],
      synergie: [
        { avec: "korzybski", texte: "McGilchrist montre comment le cerveau gauche produit des cartes ; Korzybski rappelle qu'elles ne sont pas le territoire." }
      ]
    }
  },
  {
    id: "korzybski",
    nom: "Carte et territoire",
    auteur: "Alfred Korzybski",
    annee: "1933",
    domaine_principal: "linguistique",
    domaines_secondaires: ["epistemologie", "philosophie", "psychologie"],
    resume: "La carte n'est pas le territoire. Nos représentations du monde ne sont pas le monde — et confondre les deux est source d'erreurs systématiques.",
    territoire: [
      "La relation entre langage et réalité",
      "Les distorsions produites par la généralisation et l'abstraction",
      "La conscience des présuppositions dans la communication",
      "La réflexivité comme outil de pensée"
    ],
    limites: [
      "Peu opérationnel sans méthode complémentaire",
      "Peut mener à un scepticisme paralysant",
      "Ne dit pas quelle carte préférer — seulement qu'elles sont des cartes",
      "Difficile à appliquer en temps réel"
    ],
    zones_risquees: [
      "Conclure que toutes les cartes se valent",
      "Utiliser le principe pour esquiver tout engagement",
      "Devenir tellement meta qu'on ne peut plus agir"
    ],
    connexions: {
      complementaires: ["godel", "kuhn", "mcgilchrist"],
      contradictoires: [],
      synergie: [
        { avec: "godel", texte: "Gödel montre que les cartes formelles ont des trous ; Korzybski montre que toutes les cartes ont des bords." },
        { avec: "kuhn", texte: "Kuhn décrit comment les cartes scientifiques changent collectivement ; Korzybski pourquoi elles changent nécessairement." }
      ]
    }
  },
  {
    id: "kuhn",
    nom: "Paradigmes scientifiques",
    auteur: "Thomas Kuhn",
    annee: "1962",
    domaine_principal: "epistemologie",
    domaines_secondaires: ["histoire", "philosophie", "sciences_sociales"],
    resume: "La science ne progresse pas linéairement, mais par révolutions — des changements de paradigme qui réorganisent entièrement ce qu'on croit savoir.",
    territoire: [
      "L'histoire et la sociologie de la science",
      "Les changements de paradigme et les révolutions scientifiques",
      "La distinction entre science normale et science extraordinaire",
      "L'incommensurabilité des paradigmes"
    ],
    limites: [
      "Peut être lu comme relativisme scientifique",
      "Moins applicable aux sciences formelles et aux mathématiques",
      "Ne donne pas de critère pour choisir entre paradigmes",
      "Difficile à appliquer en temps réel dans une discipline"
    ],
    zones_risquees: [
      "Conclure que la science est purement sociale et arbitraire",
      "Nier la réalité du progrès scientifique",
      "Utiliser Kuhn pour légitimer n'importe quelle alternative aux sciences"
    ],
    connexions: {
      complementaires: ["korzybski", "godel"],
      contradictoires: [],
      synergie: [
        { avec: "korzybski", texte: "Kuhn montre quand les cartes collectives changent ; Korzybski pourquoi elles ne peuvent pas être définitives." },
        { avec: "godel", texte: "Gödel prouve les limites de l'intérieur ; Kuhn observe les limites de l'extérieur, dans l'histoire." }
      ]
    }
  }
];

const DOMAINES = [
  { id: "mathematiques", label: "Mathématiques" },
  { id: "physique", label: "Physique" },
  { id: "biologie", label: "Biologie" },
  { id: "psychologie", label: "Psychologie" },
  { id: "linguistique", label: "Linguistique · Sémiotique" },
  { id: "epistemologie", label: "Épistémologie" },
  { id: "philosophie", label: "Philosophie" },
  { id: "sciences_sociales", label: "Sciences sociales" },
  { id: "histoire", label: "Histoire" },
  { id: "economie", label: "Économie" },
];

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function LaBoussole() {
  const [domaineActif, setDomaineActif] = useState("mathematiques");
  const [modeleActif, setModeleActif] = useState(null);
  const [rechercheMode, setRechercheMode] = useState(false);
  const [question, setQuestion] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const detailRef = useRef(null);

  const modelesDomaine = MODELES.filter(m => m.domaine_principal === domaineActif);
  const domainesAvecModeles = DOMAINES.filter(d =>
    MODELES.some(m => m.domaine_principal === d.id)
  );

  function ouvrirModele(m) {
    setModeleActif(m);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function fermerDetail() {
    setModeleActif(null);
  }

  function naviguerVers(id) {
    const m = MODELES.find(x => x.id === id);
    if (!m) return;
    setDomaineActif(m.domaine_principal);
    setModeleActif(m);
    setRechercheMode(false);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function lancerRecherche() {
    if (!question.trim()) return;
    setLoadingIA(true);
    setSuggestions(null);

    const modelesResume = MODELES.map(m => ({
      id: m.id,
      nom: m.nom,
      auteur: m.auteur,
      domaine: m.domaine_principal,
      territoire: m.territoire,
      limites: m.limites,
      zones_risquees: m.zones_risquees
    }));

    const prompt = `Tu es un assistant de navigation épistémique pour l'outil "La Boussole".
L'utilisateur pose cette question ou décrit cette situation :
"${question}"

Voici les modèles disponibles :
${JSON.stringify(modelesResume, null, 2)}

Réponds UNIQUEMENT avec un objet JSON valide, sans balises markdown, avec cette structure exacte :
{
  "utiles": [
    { "id": "godel", "raison": "..." }
  ],
  "eviter": [
    { "id": "newton", "raison": "..." }
  ],
  "note": "une phrase d'ensemble sobre et utile"
}

Sélectionne 2-4 modèles utiles et 1-2 à éviter. Les raisons doivent être courtes et précises (1-2 phrases max).`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const texte = data.content?.[0]?.text || "";
      const parsed = JSON.parse(texte);
      setSuggestions(parsed);
    } catch (e) {
      setSuggestions({ erreur: true });
    } finally {
      setLoadingIA(false);
    }
  }

  return (
    <div style={s.wrap}>

      {/* ── HEADER ── */}
      <div style={s.header}>
        <p style={s.surtitre}>Outil · Épistémologie</p>
        <h1 style={s.titre}>La <em style={{ fontStyle: "italic" }}>Boussole</em></h1>
        <p style={s.sousTitre}>
          Chaque modèle de pensée répond à certaines questions et reste aveugle à d'autres.
          La compétence clé n'est pas de maîtriser un modèle — c'est de savoir naviguer entre eux.
        </p>
        <div style={s.metaRow}>
          <span style={s.metaBadge}>v1.0</span>
          <span style={s.metaSep}>·</span>
          <span style={s.metaInfo}>9 modèles · 10 domaines</span>
          <span style={s.metaSep}>·</span>
          <button
            style={{ ...s.metaBtn, ...(rechercheMode ? s.metaBtnActif : {}) }}
            onClick={() => { setRechercheMode(r => !r); setSuggestions(null); setQuestion(""); }}
          >
            {rechercheMode ? "← Revenir à la navigation" : "Quelle question je me pose ?"}
          </button>
        </div>
      </div>

      {/* ── MODE QUESTION ── */}
      {rechercheMode && (
        <div style={s.rechercheZone}>
          <p style={s.rechercheLabel}>Décrivez votre question ou situation :</p>
          <div style={s.rechercheRow}>
            <textarea
              style={s.rechercheInput}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ex : Je dois prendre une décision importante sous incertitude. Ou : Je cherche à comprendre pourquoi mon équipe résiste au changement…"
              rows={3}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); lancerRecherche(); } }}
            />
          </div>
          <button style={s.rechercheBtn} onClick={lancerRecherche} disabled={loadingIA || !question.trim()}>
            {loadingIA ? "Analyse en cours…" : "Trouver les modèles pertinents →"}
          </button>

          {suggestions && !suggestions.erreur && (
            <div style={s.suggestionsZone}>
              {suggestions.note && (
                <p style={s.suggestNote}>{suggestions.note}</p>
              )}

              {suggestions.utiles?.length > 0 && (
                <div>
                  <p style={s.suggestTitreSec}>
                    <span style={{ ...s.indicPuce, background: "#2e7d4e" }}></span>
                    Modèles à mobiliser
                  </p>
                  <div style={s.suggestGrid}>
                    {suggestions.utiles.map(item => {
                      const m = MODELES.find(x => x.id === item.id);
                      if (!m) return null;
                      return (
                        <div key={item.id} style={s.suggestCard} onClick={() => naviguerVers(item.id)}>
                          <div style={s.suggestCardTop}>
                            <span style={s.suggestNom}>{m.nom}</span>
                            <span style={s.suggestAuteur}>{m.auteur}</span>
                          </div>
                          <p style={s.suggestRaison}>{item.raison}</p>
                          <span style={s.suggestLien}>Voir le détail →</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {suggestions.eviter?.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <p style={s.suggestTitreSec}>
                    <span style={{ ...s.indicPuce, background: "#8b3a2a" }}></span>
                    Modèles à utiliser avec précaution
                  </p>
                  <div style={s.suggestGrid}>
                    {suggestions.eviter.map(item => {
                      const m = MODELES.find(x => x.id === item.id);
                      if (!m) return null;
                      return (
                        <div key={item.id} style={{ ...s.suggestCard, ...s.suggestCardEviter }} onClick={() => naviguerVers(item.id)}>
                          <div style={s.suggestCardTop}>
                            <span style={s.suggestNom}>{m.nom}</span>
                            <span style={s.suggestAuteur}>{m.auteur}</span>
                          </div>
                          <p style={s.suggestRaison}>{item.raison}</p>
                          <span style={s.suggestLien}>Voir ses zones risquées →</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {suggestions?.erreur && (
            <p style={{ ...s.suggestNote, color: "#8b3a2a" }}>
              Une erreur est survenue lors de l'analyse. Réessayez.
            </p>
          )}
        </div>
      )}

      {/* ── NAVIGATION PRINCIPALE ── */}
      {!rechercheMode && (
        <div style={s.layout}>

          {/* COLONNE DOMAINES */}
          <nav style={s.colonneNav}>
            <p style={s.navLabel}>Domaines</p>
            {domainesAvecModeles.map(d => (
              <button
                key={d.id}
                style={{
                  ...s.navItem,
                  ...(domaineActif === d.id ? s.navItemActif : {})
                }}
                onClick={() => { setDomaineActif(d.id); setModeleActif(null); }}
              >
                {d.label}
              </button>
            ))}
            <div style={s.navAutresLabel}>
              <p style={s.navLabel} >À venir</p>
              {DOMAINES.filter(d => !MODELES.some(m => m.domaine_principal === d.id)).map(d => (
                <span key={d.id} style={s.navItemDisabled}>{d.label}</span>
              ))}
            </div>
          </nav>

          {/* ZONE MODÈLES */}
          <div style={s.zoneModeles}>
            {!modeleActif && (
              <>
                <div style={s.domaineHeader}>
                  <h2 style={s.domaineNom}>{DOMAINES.find(d => d.id === domaineActif)?.label}</h2>
                  <span style={s.domaineCount}>{modelesDomaine.length} modèle{modelesDomaine.length > 1 ? "s" : ""}</span>
                </div>
                {modelesDomaine.length === 0 ? (
                  <p style={s.vide}>Aucun modèle pour ce domaine pour l'instant.</p>
                ) : (
                  <div style={s.grille}>
                    {modelesDomaine.map(m => (
                      <CarteModele key={m.id} modele={m} onClick={() => ouvrirModele(m)} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* DÉTAIL MODÈLE */}
            {modeleActif && (
              <div ref={detailRef}>
                <DetailModele
                  modele={modeleActif}
                  onFermer={fermerDetail}
                  onNaviguer={naviguerVers}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NOTE MÉTA ── */}
      <div style={s.noteMeta}>
        <p style={s.noteMetaTexte}>
          Cette boussole est elle-même une carte.
          Elle a ses domaines d'origine, ses limites, ses angles morts.
        </p>
        <p style={s.noteMetaCitation}>La carte n'est pas le territoire — Korzybski</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CARTE MODÈLE
// ─────────────────────────────────────────────

function CarteModele({ modele, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        ...s.carte,
        ...(hovered ? s.carteHover : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={s.carteBordGauche}></div>
      <div style={s.carteContenu}>
        <div style={s.carteTop}>
          <span style={s.carteAuteur}>{modele.auteur}</span>
          <span style={s.carteAnnee}>{modele.annee}</span>
        </div>
        <h3 style={s.carteNom}>{modele.nom}</h3>
        <p style={s.carteResume}>{modele.resume}</p>
        <div style={s.indicateurs}>
          <Indicateur type="vert" count={modele.territoire.length} label="territoire" />
          <Indicateur type="orange" count={modele.limites.length} label="limites" />
          <Indicateur type="rouge" count={modele.zones_risquees.length} label="zones risquées" />
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// INDICATEUR
// ─────────────────────────────────────────────

function Indicateur({ type, count, label }) {
  const couleurs = { vert: "#2e7d4e", orange: "#c4993a", rouge: "#8b3a2a" };
  return (
    <div style={s.indicItem}>
      <span style={{ ...s.indicDot, background: couleurs[type] }}></span>
      <span style={s.indicLabel}>{count} {label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// DÉTAIL MODÈLE
// ─────────────────────────────────────────────

function DetailModele({ modele, onFermer, onNaviguer }) {
  const [onglet, setOnglet] = useState("territoire");

  const onglets = [
    { id: "territoire", label: "Territoire", couleur: "#2e7d4e" },
    { id: "limites", label: "Limites", couleur: "#c4993a" },
    { id: "risques", label: "Zones risquées", couleur: "#8b3a2a" },
    { id: "connexions", label: "Connexions", couleur: "#1a1714" },
  ];

  const contenu = {
    territoire: modele.territoire,
    limites: modele.limites,
    risques: modele.zones_risquees,
  };

  const ongletActif = onglets.find(o => o.id === onglet);

  return (
    <div style={s.detail}>

      {/* RETOUR */}
      <button style={s.detailRetour} onClick={onFermer}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Retour aux modèles
      </button>

      {/* EN-TÊTE */}
      <div style={s.detailHeader}>
        <div style={s.detailDomaineBadge}>
          {DOMAINES.find(d => d.id === modele.domaine_principal)?.label}
        </div>
        <h2 style={s.detailNom}>{modele.nom}</h2>
        <p style={s.detailAuteurAnnee}>{modele.auteur} · {modele.annee}</p>
        <p style={s.detailResume}>{modele.resume}</p>

        {/* INDICATEURS RÉSUMÉ */}
        <div style={s.detailIndicateurs}>
          {[
            { label: "Territoire", count: modele.territoire.length, couleur: "#2e7d4e" },
            { label: "Limites", count: modele.limites.length, couleur: "#c4993a" },
            { label: "Zones risquées", count: modele.zones_risquees.length, couleur: "#8b3a2a" },
          ].map(i => (
            <div key={i.label} style={s.detailIndicItem}>
              <span style={{ ...s.detailIndicDot, background: i.couleur }}></span>
              <span style={s.detailIndicLabel}>{i.count} {i.label.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ONGLETS */}
      <div style={s.onglets}>
        {onglets.map(o => (
          <button
            key={o.id}
            style={{
              ...s.ongletBtn,
              ...(onglet === o.id ? { ...s.ongletBtnActif, borderBottomColor: o.couleur, color: o.couleur } : {})
            }}
            onClick={() => setOnglet(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* CONTENU ONGLET */}
      <div style={s.ongletContenu}>
        {onglet !== "connexions" && (
          <div>
            <div style={{ ...s.ongletFilet, background: ongletActif.couleur }}></div>
            <ul style={s.liste}>
              {contenu[onglet].map((item, i) => (
                <li key={i} style={s.listeItem}>
                  <span style={{ ...s.listePuce, background: ongletActif.couleur }}></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {onglet === "connexions" && (
          <div style={s.connexionsZone}>

            {modele.connexions.complementaires.length > 0 && (
              <div style={s.connexGroupe}>
                <p style={s.connexTitre}>
                  <span style={{ ...s.connexPuce, background: "#2e7d4e" }}></span>
                  Modèles complémentaires
                </p>
                <div style={s.connexGrille}>
                  {modele.connexions.complementaires.map(id => {
                    const m = MODELES.find(x => x.id === id);
                    if (!m) return null;
                    const syn = modele.connexions.synergie?.find(s => s.avec === id);
                    return (
                      <div key={id} style={s.connexCard}>
                        <div style={s.connexCardTop}>
                          <span style={s.connexNom}>{m.nom}</span>
                          <button style={s.connexLien} onClick={() => onNaviguer(id)}>
                            {m.auteur} →
                          </button>
                        </div>
                        {syn && <p style={s.connexSynergie}>{syn.texte}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {modele.connexions.contradictoires.length > 0 && (
              <div style={s.connexGroupe}>
                <p style={s.connexTitre}>
                  <span style={{ ...s.connexPuce, background: "#8b3a2a" }}></span>
                  Modèles en tension
                </p>
                <div style={s.connexGrille}>
                  {modele.connexions.contradictoires.map(id => {
                    const m = MODELES.find(x => x.id === id);
                    if (!m) return null;
                    return (
                      <div key={id} style={{ ...s.connexCard, ...s.connexCardTension }}>
                        <div style={s.connexCardTop}>
                          <span style={s.connexNom}>{m.nom}</span>
                          <button style={s.connexLien} onClick={() => onNaviguer(id)}>
                            {m.auteur} →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {modele.domaines_secondaires.length > 0 && (
              <div style={s.connexGroupe}>
                <p style={s.connexTitre}>
                  <span style={{ ...s.connexPuce, background: "#c4993a" }}></span>
                  Domaines secondaires touchés
                </p>
                <div style={s.domSecsRow}>
                  {modele.domaines_secondaires.map(d => (
                    <span key={d} style={s.domSecBadge}>
                      {DOMAINES.find(x => x.id === d)?.label || d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const FOND = "#f5f0e8";
const ENCRE = "#1a1714";
const OR = "#c4993a";
const TERRE = "#8b5e3c";
const REGLE = "rgba(26,23,20,0.1)";

const s = {
  wrap: {
    fontFamily: "'Mulish', sans-serif",
    color: ENCRE,
    background: FOND,
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 1.5rem 5rem",
  },

  // HEADER
  header: { paddingTop: "2.5rem", paddingBottom: "2rem", borderBottom: `1px solid ${REGLE}`, marginBottom: "2rem" },
  surtitre: { fontFamily: "'Mulish', sans-serif", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: OR, marginBottom: ".5rem" },
  titre: { fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: ".8rem", color: ENCRE },
  sousTitre: { fontFamily: "'Libre Baskerville', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(26,23,20,.7)", lineHeight: 1.6, maxWidth: "600px", marginBottom: "1.2rem" },
  metaRow: { display: "flex", alignItems: "center", gap: ".6rem", flexWrap: "wrap" },
  metaBadge: { fontSize: ".65rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: OR, border: `1px solid ${OR}`, borderRadius: "2px", padding: ".15rem .4rem" },
  metaSep: { color: REGLE, fontSize: ".9rem" },
  metaInfo: { fontSize: ".72rem", fontWeight: 600, letterSpacing: ".08em", color: "rgba(26,23,20,.5)", textTransform: "uppercase" },
  metaBtn: { fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ENCRE, background: "none", border: `1px solid ${REGLE}`, borderRadius: "2px", padding: ".3rem .7rem", cursor: "pointer", transition: "all .15s" },
  metaBtnActif: { background: ENCRE, color: FOND, borderColor: ENCRE },

  // RECHERCHE
  rechercheZone: { padding: "2rem 0" },
  rechercheLabel: { fontFamily: "'Libre Baskerville', serif", fontSize: ".95rem", fontStyle: "italic", marginBottom: "1rem", color: "rgba(26,23,20,.75)" },
  rechercheRow: { marginBottom: "1rem" },
  rechercheInput: { width: "100%", fontFamily: "'Mulish', sans-serif", fontSize: ".9rem", color: ENCRE, background: "rgba(255,255,255,.5)", border: `1px solid ${REGLE}`, borderRadius: "3px", padding: ".8rem 1rem", resize: "vertical", boxSizing: "border-box", outline: "none" },
  rechercheBtn: { fontFamily: "'Mulish', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: FOND, background: ENCRE, border: "none", borderRadius: "2px", padding: ".6rem 1.2rem", cursor: "pointer" },
  suggestionsZone: { marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${REGLE}` },
  suggestNote: { fontFamily: "'Libre Baskerville', serif", fontSize: ".9rem", fontStyle: "italic", color: "rgba(26,23,20,.7)", marginBottom: "1.5rem", lineHeight: 1.6 },
  suggestTitreSec: { display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(26,23,20,.5)", marginBottom: "1rem" },
  indicPuce: { display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  suggestGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" },
  suggestCard: { background: "rgba(255,255,255,.45)", border: `1px solid ${REGLE}`, borderLeft: `3px solid #2e7d4e`, borderRadius: "3px", padding: "1rem", cursor: "pointer", transition: "all .15s" },
  suggestCardEviter: { borderLeftColor: "#8b3a2a" },
  suggestCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".4rem" },
  suggestNom: { fontFamily: "'Libre Baskerville', serif", fontSize: ".85rem", fontWeight: 700, color: ENCRE },
  suggestAuteur: { fontSize: ".68rem", fontWeight: 600, letterSpacing: ".08em", color: "rgba(26,23,20,.45)", textTransform: "uppercase" },
  suggestRaison: { fontSize: ".82rem", color: "rgba(26,23,20,.7)", lineHeight: 1.5, marginBottom: ".6rem" },
  suggestLien: { fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: OR },

  // LAYOUT NAVIGATION
  layout: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "3rem", alignItems: "start" },

  // COLONNE NAV
  colonneNav: { position: "sticky", top: "80px" },
  navLabel: { fontSize: ".6rem", fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(26,23,20,.35)", marginBottom: ".6rem", marginTop: "0" },
  navItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderLeft: "2px solid transparent", padding: ".4rem .75rem", fontSize: ".8rem", fontWeight: 600, color: "rgba(26,23,20,.6)", cursor: "pointer", letterSpacing: ".02em", marginBottom: ".1rem", transition: "all .12s", borderRadius: "0 2px 2px 0" },
  navItemActif: { borderLeftColor: OR, color: ENCRE, background: "rgba(196,153,58,.07)" },
  navAutresLabel: { marginTop: "1.5rem" },
  navItemDisabled: { display: "block", padding: ".3rem .75rem", fontSize: ".75rem", color: "rgba(26,23,20,.25)", cursor: "default", letterSpacing: ".02em", marginBottom: ".1rem" },

  // ZONE MODELES
  zoneModeles: { minHeight: "400px" },
  domaineHeader: { display: "flex", alignItems: "baseline", gap: ".8rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${REGLE}` },
  domaineNom: { fontFamily: "'Libre Baskerville', serif", fontSize: "1.3rem", fontWeight: 400, color: ENCRE, margin: 0 },
  domaineCount: { fontSize: ".68rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(26,23,20,.4)" },
  vide: { fontSize: ".85rem", color: "rgba(26,23,20,.4)", fontStyle: "italic" },
  grille: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" },

  // CARTE
  carte: { position: "relative", background: "rgba(255,255,255,.4)", border: `1px solid ${REGLE}`, borderRadius: "4px", padding: "0", cursor: "pointer", textAlign: "left", overflow: "hidden", transition: "all .15s", display: "flex" },
  carteHover: { background: "rgba(255,255,255,.7)", transform: "translateY(-2px)", boxShadow: "0 4px 16px rgba(26,23,20,.08)" },
  carteBordGauche: { width: "3px", background: OR, flexShrink: 0 },
  carteContenu: { padding: "1.1rem 1.1rem 1rem", flex: 1 },
  carteTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem" },
  carteAuteur: { fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(26,23,20,.45)" },
  carteAnnee: { fontSize: ".65rem", color: "rgba(26,23,20,.3)", fontWeight: 600 },
  carteNom: { fontFamily: "'Libre Baskerville', serif", fontSize: ".95rem", fontWeight: 700, color: ENCRE, marginBottom: ".5rem", lineHeight: 1.3 },
  carteResume: { fontSize: ".78rem", color: "rgba(26,23,20,.65)", lineHeight: 1.5, marginBottom: ".8rem" },
  indicateurs: { display: "flex", gap: ".8rem", flexWrap: "wrap" },
  indicItem: { display: "flex", alignItems: "center", gap: ".3rem" },
  indicDot: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },
  indicLabel: { fontSize: ".63rem", fontWeight: 600, letterSpacing: ".06em", color: "rgba(26,23,20,.45)" },

  // DÉTAIL
  detail: { paddingTop: ".5rem" },
  detailRetour: { display: "flex", alignItems: "center", gap: ".4rem", background: "none", border: "none", color: "rgba(26,23,20,.5)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", padding: "0", marginBottom: "1.5rem" },
  detailHeader: { paddingBottom: "1.5rem", borderBottom: `1px solid ${REGLE}`, marginBottom: "0" },
  detailDomaineBadge: { fontSize: ".62rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: OR, border: `1px solid ${OR}`, borderRadius: "2px", padding: ".15rem .45rem", display: "inline-block", marginBottom: ".7rem" },
  detailNom: { fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 700, color: ENCRE, marginBottom: ".3rem", lineHeight: 1.2 },
  detailAuteurAnnee: { fontSize: ".72rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(26,23,20,.4)", marginBottom: ".9rem" },
  detailResume: { fontFamily: "'Libre Baskerville', serif", fontSize: ".95rem", fontStyle: "italic", color: "rgba(26,23,20,.75)", lineHeight: 1.65, marginBottom: "1rem" },
  detailIndicateurs: { display: "flex", gap: "1.2rem", flexWrap: "wrap" },
  detailIndicItem: { display: "flex", alignItems: "center", gap: ".35rem" },
  detailIndicDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  detailIndicLabel: { fontSize: ".7rem", fontWeight: 600, letterSpacing: ".07em", color: "rgba(26,23,20,.5)" },

  // ONGLETS
  onglets: { display: "flex", borderBottom: `1px solid ${REGLE}`, marginBottom: "0" },
  ongletBtn: { fontFamily: "'Mulish', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", background: "none", border: "none", borderBottom: "2px solid transparent", padding: ".8rem 1rem", cursor: "pointer", color: "rgba(26,23,20,.4)", transition: "all .12s", marginRight: ".2rem" },
  ongletBtnActif: { fontWeight: 800 },
  ongletContenu: { padding: "1.5rem 0" },
  ongletFilet: { width: "28px", height: "2px", marginBottom: "1rem", borderRadius: "1px" },

  // LISTE
  liste: { listStyle: "none", padding: 0, margin: 0 },
  listeItem: { display: "flex", alignItems: "flex-start", gap: ".6rem", marginBottom: ".75rem", fontSize: ".88rem", lineHeight: 1.55, color: "rgba(26,23,20,.8)" },
  listePuce: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, marginTop: ".45rem" },

  // CONNEXIONS
  connexionsZone: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  connexGroupe: {},
  connexTitre: { display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(26,23,20,.4)", marginBottom: ".8rem" },
  connexPuce: { display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
  connexGrille: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: ".75rem" },
  connexCard: { background: "rgba(255,255,255,.4)", border: `1px solid ${REGLE}`, borderLeft: `2px solid #2e7d4e`, borderRadius: "3px", padding: ".9rem 1rem" },
  connexCardTension: { borderLeftColor: "#8b3a2a" },
  connexCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem", marginBottom: ".4rem" },
  connexNom: { fontFamily: "'Libre Baskerville', serif", fontSize: ".82rem", fontWeight: 700, color: ENCRE, lineHeight: 1.3 },
  connexLien: { background: "none", border: "none", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: OR, cursor: "pointer", padding: 0, whiteSpace: "nowrap" },
  connexSynergie: { fontSize: ".78rem", color: "rgba(26,23,20,.62)", lineHeight: 1.5, margin: 0 },
  domSecsRow: { display: "flex", flexWrap: "wrap", gap: ".5rem" },
  domSecBadge: { fontSize: ".68rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(26,23,20,.5)", border: `1px solid ${REGLE}`, borderRadius: "2px", padding: ".2rem .55rem" },

  // NOTE META
  noteMeta: { marginTop: "4rem", paddingTop: "1.5rem", borderTop: `1px solid ${REGLE}`, textAlign: "center" },
  noteMetaTexte: { fontSize: ".78rem", fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", color: "rgba(26,23,20,.4)", marginBottom: ".3rem" },
  noteMetaCitation: { fontSize: ".65rem", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(196,153,58,.6)" },
};
