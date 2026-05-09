import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const files = await fg([
  "src/content/**/*.{md,mdx}",
  "src/pages/**/*.astro",
  "src/data/**/*.{ts,js,json}"
]);

function routeFromContent(file) {
  return file
    .replace("src/content/", "/")
    .replace(/\.(md|mdx)$/, "")
    .replace(/\/index$/, "");
}

function routeFromPage(file) {
  return file
    .replace("src/pages", "")
    .replace(/\.(astro)$/, "")
    .replace(/\/index$/, "/")
    .replace(/\[\.{3}slug\]/, ":slug")
    .replace(/\[slug\]/, ":slug")
    .replace(/\[id\]/, ":id");
}

function getKind(file) {
  if (file.startsWith("src/content/")) return "content";
  if (file.startsWith("src/pages/outils/")) return "tool-page";
  if (file.startsWith("src/pages/")) return "page";
  if (file.startsWith("src/data/")) return "data";
  return "other";
}

function getSection(file) {
  const parts = file.split("/");
  if (file.startsWith("src/content/")) return parts[2] || null;
  if (file.startsWith("src/pages/")) return parts[2]?.replace(".astro", "") || "root";
  if (file.startsWith("src/data/")) return "data";
  return null;
}

function extractHeadings(text) {
  return [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match => match[1].trim());
}

function extractMarkdownLinks(text) {
  return [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map(match => match[1])
    .filter(Boolean);
}

function extractInternalRefs(text) {
  const refs = new Set();

  const patterns = [
    /href=["'`]([^"'`]+)["'`]/g,
    /src=["'`]([^"'`]+)["'`]/g,
    /(?:lien|href|route|url|src)\s*:\s*["'`]([^"'`]+)["'`]/g,
    /\[[^\]]+\]\(([^)]+)\)/g,
    /url\(["']?([^)"']+)["']?\)/g
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[1]?.trim();
      if (value && value.startsWith("/")) {
        refs.add(value);
      }
    }
  }

  return [...refs].sort();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function normalizeRoute(route) {
  if (!route) return null;

  return route
    .split("#")[0]
    .split("?")[0]
    .replace(/\/$/, "") || "/";
}

function normalizeTitle(value) {
  return String(value || "")
    .replace(/["'`]/g, "")
    .trim();
}

function extractObjectsFromDataFile(file, raw) {
  const resources = [];

  const objectBlocks = raw.match(/\{[\s\S]*?\}/g) || [];

  for (const block of objectBlocks) {
    const id = block.match(/\bid\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;
    const slug = block.match(/\bslug\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;
    const route = block.match(/\broute\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;
    const href = block.match(/\bhref\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;
    const lien = block.match(/\blien\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;
    const url = block.match(/\burl\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] || null;

    const titre =
      block.match(/\btitre\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
      block.match(/\btitle\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
      block.match(/\bnom\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
      null;

    const statut =
      block.match(/\bstatut\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
      block.match(/\bstatus\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ||
      null;

    const foundRoute = route || href || lien || url || null;

    if (id || slug || foundRoute) {
      resources.push({
        file,
        kind: "declared-resource",
        section: file.includes("/outils") ? "outils" : "data",
        route: foundRoute?.startsWith("/") ? foundRoute : null,
        id,
        slug,
        title: normalizeTitle(titre || id || slug || foundRoute),
        status: statut,
        source: file
      });
    }
  }

  return resources;
}

async function scanDeclaredResources(dataFiles) {
  const declared = [];

  for (const file of dataFiles) {
    const raw = await fs.readFile(file, "utf8");

    if (file.endsWith(".json")) {
      try {
        const json = JSON.parse(raw);
        const items = Array.isArray(json) ? json : Object.values(json).flat();

        for (const item of items) {
          if (!item || typeof item !== "object") continue;

          const route = item.route || item.href || item.lien || item.url || null;
          const id = item.id || item.slug || null;

          if (id || route) {
            declared.push({
              file,
              kind: "declared-resource",
              section: "data",
              route: typeof route === "string" && route.startsWith("/") ? route : null,
              id: item.id || null,
              slug: item.slug || null,
              title: item.titre || item.title || item.nom || item.label || id || route,
              status: item.statut || item.status || null,
              source: file
            });
          }
        }
      } catch {
        // JSON invalide ou structure non standard : ignoré sans casser l’audit.
      }

      continue;
    }

    declared.push(...extractObjectsFromDataFile(file, raw));
  }

  return declared;
}

const entries = [];

for (const file of files.sort()) {
  const raw = await fs.readFile(file, "utf8");
  const isMarkdown = file.endsWith(".md") || file.endsWith(".mdx");
  const parsed = isMarkdown ? matter(raw) : { data: {}, content: raw };

  const kind = getKind(file);
  const section = getSection(file);

  entries.push({
    file,
    kind,
    section,
    route: file.startsWith("src/pages/")
      ? routeFromPage(file)
      : file.startsWith("src/content/")
        ? routeFromContent(file)
        : null,
    title:
      parsed.data.title ||
      extractHeadings(parsed.content)[0] ||
      path.basename(file),
    description: parsed.data.description || null,
    tags: parsed.data.tags || [],
    date: parsed.data.date || parsed.data.pubDate || null,
    draft: Boolean(parsed.data.draft),
    headings: extractHeadings(parsed.content),
    links: extractMarkdownLinks(parsed.content),
    internalRefs: extractInternalRefs(raw),
    wordCount: isMarkdown ? wordCount(parsed.content) : null,
    frontmatter: parsed.data
  });
}

const dataFiles = files.filter(file => file.startsWith("src/data/"));
const declaredResources = await scanDeclaredResources(dataFiles);

const physicalRoutes = new Set(
  entries
    .map(entry => normalizeRoute(entry.route))
    .filter(Boolean)
);

const declaredRoutes = new Set(
  declaredResources
    .map(entry => normalizeRoute(entry.route))
    .filter(Boolean)
);

const referencedRoutes = new Set(
  entries
    .flatMap(entry => entry.internalRefs || [])
    .map(normalizeRoute)
    .filter(ref => ref && ref.startsWith("/") && !ref.includes("."))
);

function isCoveredByDynamicRoute(route) {
  route = normalizeRoute(route);

  return [...physicalRoutes].some(physicalRoute => {
    physicalRoute = normalizeRoute(physicalRoute);

    if (!physicalRoute.includes(":")) return false;

    const pattern = "^" + physicalRoute
      .replace(/\/$/, "")
      .replace(/:[^/]+/g, "[^/]+") + "$";

    return new RegExp(pattern).test(route.replace(/\/$/, ""));
  });
}

function isPlannedResource(resource) {
  return ["bientot", "idee", "draft", "planned"]
    .includes(resource.status);
}

const declaredWithoutPhysicalPage = [...declaredRoutes]
  .filter(route => !physicalRoutes.has(route))
  .filter(route => !isCoveredByDynamicRoute(route))
  .filter(route => {
    const declarations = declaredResources.filter(
      resource => resource.route === route
    );

    return !declarations.every(isPlannedResource);
  })
  .map(route => ({
    route,
    coveredByDynamicRoute: isCoveredByDynamicRoute(route),
    declarations: declaredResources.filter(
      resource => resource.route === route
    )
  }));

const plannedRoutes = declaredResources
  .filter(resource =>
    resource.route &&
    isPlannedResource(resource)
  )
  .map(resource => ({
    route: resource.route,
    status: resource.status,
    title: resource.title
  }));

const referencedWithoutPhysicalPage = [...referencedRoutes]
  .filter(route => !physicalRoutes.has(route))
  .filter(route => !plannedRoutes.some(planned => planned.route === route))
  .filter(route => !isCoveredByDynamicRoute(route))
  .map(route => ({
    route,
    coveredByDynamicRoute: isCoveredByDynamicRoute(route)
  }));

const index = {
  generatedAt: new Date().toISOString(),
  totals: {
    entries: entries.length,
    contents: entries.filter(e => e.kind === "content").length,
    pages: entries.filter(e => e.kind === "page").length,
    tools: entries.filter(e => e.kind === "tool-page").length,
    dataFiles: entries.filter(e => e.kind === "data").length,
    declaredResources: declaredResources.length,
    declaredRoutes: declaredRoutes.size,
    declaredWithoutPhysicalPage: declaredWithoutPhysicalPage.length,
    referencedWithoutPhysicalPage: referencedWithoutPhysicalPage.length
  },
  sections: Object.fromEntries(
    Object.entries(
      entries.reduce((acc, entry) => {
        acc[entry.section] = (acc[entry.section] || 0) + 1;
        return acc;
      }, {})
    ).sort()
  ),
  entries,
  declaredResources,
  audits: {
    declaredWithoutPhysicalPage,
    plannedRoutes,
    referencedWithoutPhysicalPage
  }
};

await fs.mkdir("site-intelligence", { recursive: true });

await fs.writeFile(
  "site-intelligence/site-index.json",
  JSON.stringify(index, null, 2)
);

await fs.writeFile(
  "site-intelligence/declared-resources.json",
  JSON.stringify(declaredResources, null, 2)
);

await fs.writeFile(
  "site-intelligence/missing-routes.json",
  JSON.stringify(index.audits, null, 2)
);

console.log("Index généré : site-intelligence/site-index.json");
console.log("Ressources déclarées : site-intelligence/declared-resources.json");
console.log("Routes manquantes : site-intelligence/missing-routes.json");
console.log(index.totals);