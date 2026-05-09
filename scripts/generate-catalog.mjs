import fs from "node:fs/promises";

const index = JSON.parse(
  await fs.readFile("site-intelligence/site-index.json", "utf8")
);

const entries = index.entries
  .filter(e => e.route)
  .sort((a, b) => {
    if (a.section === b.section) return a.title.localeCompare(b.title);
    return String(a.section).localeCompare(String(b.section));
  });

const plannedRoutes = index.audits?.plannedRoutes || [];
const declaredMissing = index.audits?.declaredWithoutPhysicalPage || [];
const referencedMissing = index.audits?.referencedWithoutPhysicalPage || [];

function formatEntry(entry) {
  const tags = entry.tags?.length ? `\n  - Tags : ${entry.tags.join(", ")}` : "";
  const description = entry.description ? `\n  - Description : ${entry.description}` : "";
  const words = entry.wordCount ? `\n  - Mots : ${entry.wordCount}` : "";

  return `### ${entry.title}

- Route : \`${entry.route}\`
- Type : ${entry.kind}
- Fichier : \`${entry.file}\`${description}${tags}${words}
`;
}

function formatPlannedRoute(item) {
  return `- \`${item.route}\` — ${item.title || "Sans titre"} (${item.status || "statut inconnu"})`;
}

function formatMissingRoute(item) {
  return `- \`${item.route}\`${item.coveredByDynamicRoute ? " — couverte par une route dynamique" : ""}`;
}

const sections = {};

for (const entry of entries) {
  const section = entry.section || "autres";
  if (!sections[section]) sections[section] = [];
  sections[section].push(entry);
}

let md = `# Catalogue du site

Généré le : ${new Date().toLocaleString("fr-FR")}

## Résumé

- Entrées : ${index.totals.entries}
- Contenus : ${index.totals.contents}
- Pages : ${index.totals.pages}
- Outils publiés : ${index.totals.tools}
- Fichiers data : ${index.totals.dataFiles}
- Ressources déclarées : ${index.totals.declaredResources}
- Routes déclarées : ${index.totals.declaredRoutes}
- Routes actives déclarées sans page : ${index.totals.declaredWithoutPhysicalPage}
- Liens internes actifs sans page : ${index.totals.referencedWithoutPhysicalPage}

## État de l’audit

`;

if (declaredMissing.length === 0 && referencedMissing.length === 0) {
  md += `Aucune route active manquante détectée.\n\n`;
} else {
  if (declaredMissing.length) {
    md += `### Routes déclarées sans page\n\n`;
    md += declaredMissing.map(formatMissingRoute).join("\n") + "\n\n";
  }

  if (referencedMissing.length) {
    md += `### Liens internes sans page\n\n`;
    md += referencedMissing.map(formatMissingRoute).join("\n") + "\n\n";
  }
}

if (plannedRoutes.length) {
  md += `## Ressources planifiées\n\n`;
  md += plannedRoutes.map(formatPlannedRoute).join("\n") + "\n\n";
}

for (const [section, items] of Object.entries(sections)) {
  md += `\n# ${section}\n\n`;
  md += items.map(formatEntry).join("\n");
}

await fs.writeFile("site-intelligence/catalog.md", md);

console.log("Catalogue généré : site-intelligence/catalog.md");