import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const files = await fg([
  "src/content/**/*.{md,mdx}",
  "src/pages/**/*.astro",
  "src/data/**/*.{ts,js}"
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

function extractLinks(text) {
  return [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map(match => match[1])
    .filter(Boolean);
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
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
    links: extractLinks(parsed.content),
    wordCount: isMarkdown ? wordCount(parsed.content) : null,
    frontmatter: parsed.data
  });
}

const index = {
  generatedAt: new Date().toISOString(),
  totals: {
    entries: entries.length,
    contents: entries.filter(e => e.kind === "content").length,
    pages: entries.filter(e => e.kind === "page").length,
    tools: entries.filter(e => e.kind === "tool-page").length,
    dataFiles: entries.filter(e => e.kind === "data").length
  },
  sections: Object.fromEntries(
    Object.entries(
      entries.reduce((acc, entry) => {
        acc[entry.section] = (acc[entry.section] || 0) + 1;
        return acc;
      }, {})
    ).sort()
  ),
  entries
};

await fs.mkdir("site-intelligence", { recursive: true });

await fs.writeFile(
  "site-intelligence/site-index.json",
  JSON.stringify(index, null, 2)
);

console.log("Index généré : site-intelligence/site-index.json");
console.log(index.totals);