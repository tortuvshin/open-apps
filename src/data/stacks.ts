export type Stack = {
  slug: string;
  name: string;
  blurb: string;
  status: "live" | "expanding" | "planned";
};

// Static taxonomy. Counts are NOT stored here — they are computed at
// build time from data/generated/apps.json. See src/lib/stack-counts.ts.
export const stacks: Stack[] = [
  {
    slug: "flutter",
    name: "Flutter",
    blurb: "Dart-based, cross-platform mobile apps.",
    status: "live",
  },
  {
    slug: "tauri",
    name: "Tauri",
    blurb: "Rust-based, cross-platform desktop apps using web frontends.",
    status: "expanding",
  },
  {
    slug: "react-native",
    name: "React Native",
    blurb: "JavaScript / TypeScript mobile apps using React.",
    status: "expanding",
  },
  {
    slug: "ios",
    name: "iOS",
    blurb: "Native Swift apps from the App Store and the open-source community.",
    status: "expanding",
  },
  {
    slug: "android",
    name: "Android",
    blurb: "Native Kotlin / Java apps with a long, mature history.",
    status: "expanding",
  },
  {
    slug: "kmp",
    name: "Kotlin Multiplatform",
    blurb: "Shared Kotlin codebases targeting iOS and Android.",
    status: "planned",
  },
  {
    slug: "capacitor",
    name: "Capacitor",
    blurb: "Hybrid mobile apps built on web standards.",
    status: "planned",
  },
];
