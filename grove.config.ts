import { defineConfig } from "@grove-dev/core";

/** Open App Scout is a Grove-powered directory of production open-source apps. */
export default defineConfig({
  blueprint: "project-directory",

  site: {
    name: "Open App Scout",
    tagline: "Open-source apps and production codebases to run, study and learn from.",
    description:
      "Discover real open-source apps built with Flutter, React Native, Swift, React, Tauri and more. Browse production codebases by stack, category and license.",
    url: "https://openappscout.com",
    repoUrl: "https://github.com/tortuvshin/open-apps",
    // Both files carry their own `prefers-color-scheme` swap: an SVG
    // served through `<img src>` is a separate document, so page CSS
    // cannot repaint it. That is correct for the favicon (browser
    // chrome follows the OS) and a known tradeoff for the header mark.
    logo: "/logo.svg",
    favicon: "/favicon.svg",
  },

  analytics: {
    googleAnalyticsId: "G-MB9GWW1LVX",
  },

  // Index only what a person wrote or reviewed. Most records are
  // imported GitHub metadata; indexing a page per record is the
  // scaled-content pattern search engines discount. Excluded pages
  // still render (noindex,follow), stay in quick-find and leave the
  // sitemap. A record needs a Markdown body and `curation.reviewed`;
  // a collection an `editorial.introduction`; a category or stack a
  // `description` in data/taxonomy.
  seo: {
    recordIndexPolicy: "editorial-and-reviewed",
    collectionIndexPolicy: "editorial",
    taxonomyIndexPolicy: "editorial",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Browse", href: "/apps/" },
    { label: "Collections", href: "/collections/" },
    { label: "Community", href: "/contributors/" },
    { label: "About", href: "/about/" },
  ],

  footer: {
    // Grove caps the footer at three columns. The stack, category and
    // licence pages had no inbound links from anywhere but a record's
    // sidebar; these columns put them one click from every page.
    columns: [
      {
        heading: "Discover",
        items: [
          { label: "Browse apps", href: "/apps/" },
          { label: "Collections", href: "/collections/" },
          { label: "Stacks", href: "/stacks/" },
          { label: "Categories", href: "/categories/" },
          { label: "Contributors", href: "/contributors/" },
        ],
      },
      {
        heading: "By license",
        items: [
          { label: "MIT", href: "/licenses/mit/" },
          { label: "AGPL-3.0", href: "/licenses/agpl-3.0/" },
          { label: "GPL-3.0", href: "/licenses/gpl-3.0/" },
          { label: "Apache-2.0", href: "/licenses/apache-2.0/" },
        ],
      },
      {
        heading: "Project",
        items: [
          { label: "Submit an app", href: "/submit/" },
          { label: "About", href: "/about/" },
          {
            label: "Source on GitHub",
            href: "https://github.com/tortuvshin/open-apps",
            external: true,
          },
          {
            label: "Report an issue",
            href: "https://github.com/tortuvshin/open-apps/issues",
            external: true,
          },
        ],
      },
    ],
    copyright: "Open App Scout contributors",
    license: "Code is MIT licensed. The legacy seed collection remains CC0.",
  },

  submission: {
    eyebrow: "Open app submission",
    title: "Add an open-source app",
    description:
      "Generate a Grove record from a public GitHub repository, review the app taxonomy, then open a pull request.",
    good: [
      "A usable application that people can install or run",
      "A public repository with a clear license and enough documentation to evaluate",
      "A category, primary stack, and platforms chosen from this directory's taxonomy",
    ],
    avoid: [
      "Closed-source products or marketing-only landing pages",
      "Libraries, tutorials, snippets, or duplicate entries",
      "Abandoned experiments without documentation or a verifiable license",
    ],
  },

  // The contributors grid is a community wall, not a leaderboard —
  // per-user counts are a GitHub commit tally, not curation or review
  // credit, so only the avatar and handle are shown.
  contributors: { showContributionCount: false },

  browse: {
    facets: ["category", "stack", "platform", "license", "tags"],
  },
  routes: { directory: "apps", item: "app" },
  labels: { singular: "app", plural: "apps" },

  integrations: { github: true },

  // No `primaryColor`: buttons and accents fall through to
  // `--grove-foreground`, the neutral treatment the design system
  // ships. Set one only to deliberately brand away from that.
  theme: {
    radius: "soft",
    density: "comfortable",
    containerWidth: "72rem",
  },

  audit: {
    baseUrl: "http://127.0.0.1:4321",
    pages: [
      { path: "/", type: "home", label: "Homepage" },
      { path: "/apps/", type: "directory", label: "Directory index" },
      {
        path: "/collections/top-flutter-apps/",
        type: "collection",
        label: "Top Flutter Apps collection",
      },
      {
        path: "/collections/trending-open-source-apps/",
        type: "collection",
        label: "Trending collection",
      },
      { path: "/apps/immich/", type: "record", label: "Record detail" },
      { path: "/about/", type: "content", label: "About page" },
      { path: "/empty/", type: "empty", label: "Empty state" },
      { path: "/this-page-does-not-exist/", type: "404", label: "404 page" },
    ],
  },

  readme: {
    title: "Open Apps",
    tagline:
      "A hand-picked directory of real open-source applications — apps worth running, studying, and extending.",
    url: "https://openappscout.com",
    browseLabel: "Browse the directory →",
    // Entries link to the app's page here; the repository follows as
    // a "Source" link.
    entryLinkTarget: "detail",
    intro: [
      "## Why this list",
      "",
      "GitHub search works when you already know what you are looking for.",
      "This list is for the other case: discovering **real, production-grade",
      "apps** — not tutorials, boilerplates, or package-only libraries — and",
      "understanding what each one is worth your time for.",
      "",
      "Every entry is a human-curated YAML record in `data/records/`, kept",
      "fresh by weekly GitHub metadata syncs. To add an app, use the",
      "[submission form](https://openappscout.com/submit) or open a pull",
      "request — see [CONTRIBUTING.md](CONTRIBUTING.md).",
    ].join("\n"),
  },
});
