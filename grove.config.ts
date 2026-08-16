import { defineConfig } from "@grove-dev/core";

/** Open App Scout is a Grove-powered directory of production open-source apps. */
export default defineConfig({
  blueprint: "project-directory",

  site: {
    name: "Open App Scout",
    tagline:
      "Evidence-backed reviews of open-source apps: how they work, where they fail, and what to choose instead.",
    description:
      "A searchable directory of real open-source applications, organized by stack, category, platform, activity, and maturity.",
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

  nav: [
    { label: "Home", href: "/" },
    { label: "Browse", href: "/apps" },
    { label: "Collections", href: "/collections" },
    { label: "Community", href: "/contributors" },
    { label: "About", href: "/about" },
  ],

  footer: {
    columns: [
      {
        heading: "Discover",
        items: [
          { label: "Browse apps", href: "/apps" },
          { label: "Contributors", href: "/contributors" },
        ],
      },
      {
        heading: "Contribute",
        items: [
          { label: "Submit an app", href: "/submit" },
          { label: "Report an issue", href: "https://github.com/tortuvshin/open-apps/issues", external: true },
        ],
      },
      {
        heading: "Project",
        items: [
          { label: "Source on GitHub", href: "https://github.com/tortuvshin/open-apps", external: true },
          { label: "About", href: "/about" },
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
  // per-user contribution counts are noisy here, so only the avatar
  // and handle are shown.
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
      { path: "/collections/top-flutter-apps/", type: "collection", label: "Top Flutter Apps collection" },
      { path: "/apps/immich/", type: "record", label: "Record detail" },
      { path: "/about/", type: "content", label: "About page" },
      { path: "/empty/", type: "empty", label: "Empty state" },
      { path: "/this-page-does-not-exist/", type: "404", label: "404 page" },
    ],
  },

  readme: {
    title: "Open App Scout — evidence-backed reviews of open-source apps",
    tagline: "Apps worth running, studying, and extending — with the caveats.",
    url: "https://openappscout.com",
    browseLabel: "Browse the directory →",
    intro: [
      "## Why this list",
      "",
      "Every entry is a real application with a public repository and an",
      "identifiable license. Listing is not an endorsement: maintenance,",
      "licensing, and fitness vary, and each record states what is verified",
      "and what is not. Submit a new entry via the web form or by opening a",
      "pull request against `data/records/`.",
    ].join("\n"),
  },
});
