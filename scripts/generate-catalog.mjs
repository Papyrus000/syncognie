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
- Outils : ${index.totals.tools}
- Fichiers data : ${index.totals.dataFiles}

`;

for (const [section, items] of Object.entries(sections)) {
  md += `\n# ${section}\n\n`;
  md += items.map(formatEntry).join("\n");
}

await fs.writeFile("site-intelligence/catalog.md", md);

console.log("Catalogue généré : site-intelligence/catalog.md");