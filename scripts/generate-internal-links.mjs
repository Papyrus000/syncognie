import fs from "node:fs/promises";

const index = JSON.parse(
  await fs.readFile("site-intelligence/site-index.json", "utf8")
);

const entries = index.entries;

function normalizeRoute(route) {
  if (!route) return null;

  return route
    .replace(/\/index$/, "/")
    .replace(/\/$/, "") || "/";
}

const routeMap = new Map();

for (const entry of entries) {
  if (entry.route) {
    routeMap.set(normalizeRoute(entry.route), entry);
  }
}

const internalLinks = [];
const orphanPages = [];

for (const entry of entries) {
  if (!entry.route) continue;

  const sourceRoute = normalizeRoute(entry.route);

  const links = (entry.links || [])
    .map(link => normalizeRoute(link))
    .filter(link =>
      link &&
      link.startsWith("/") &&
      !link.startsWith("//")
    );

  const resolvedLinks = [];

  for (const target of links) {
    const targetEntry = routeMap.get(target);

    resolvedLinks.push({
      target,
      exists: Boolean(targetEntry),
      kind: targetEntry?.kind || null,
      section: targetEntry?.section || null
    });

    internalLinks.push({
      source: sourceRoute,
      target,
      exists: Boolean(targetEntry)
    });
  }

  entry.resolvedLinks = resolvedLinks;
}

const incomingCount = {};

for (const link of internalLinks) {
  incomingCount[link.target] =
    (incomingCount[link.target] || 0) + 1;
}

for (const entry of entries) {
  if (!entry.route) continue;

  const route = normalizeRoute(entry.route);

  const incoming = incomingCount[route] || 0;

  if (incoming === 0) {
    orphanPages.push({
      route,
      title: entry.title,
      section: entry.section,
      kind: entry.kind
    });
  }
}

await fs.writeFile(
  "site-intelligence/internal-links.json",
  JSON.stringify(internalLinks, null, 2)
);

await fs.writeFile(
  "site-intelligence/orphan-pages.json",
  JSON.stringify(orphanPages, null, 2)
);

console.log("Generated:");
console.log("- internal-links.json");
console.log("- orphan-pages.json");
console.log(`Links: ${internalLinks.length}`);
console.log(`Orphans: ${orphanPages.length}`);