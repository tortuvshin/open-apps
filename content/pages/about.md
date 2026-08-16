# About Open App Scout

Open App Scout is a directory of real open-source applications you can
run, study, compare, and contribute to. It started from the
public-domain Open Source Flutter Apps collection and has grown into a
multi-stack directory of mobile, web, and desktop apps.

## Why Open App Scout

GitHub search and README lists optimise for repository names and short
descriptions. They rarely tell you whether a project is a real app or
a demo, what stack and platforms it uses, how active it is, or whether
the license is clear. Open App Scout turns that flat list into a
structured index, so those questions are answered by data rather than
by a star count.

Coverage is uneven and stated plainly. Most records today carry
verified identity, license, stack, platform, and activity metadata.
A smaller reviewed set adds the editorial layer — what an app is best
for, where it falls short, and what to use instead. Records say which
of the two they are; a listing is not an endorsement.

## Why real apps

Tutorials and generated prototypes can look complete at first glance.
Real applications survive releases, contributors, edge cases,
migrations, and years of product decisions. That history makes a real
codebase useful both to developers and to AI tools that need grounded
implementation examples instead of another blank-slate prompt.

## Mobile first

The directory began with Flutter and now includes React Native, native
iOS, and other mobile or cross-platform stacks. Category, primary
stack, platform, license, and tags stay separate so broader coverage
does not make discovery vague. The goal is not to index every
repository — it is to keep a useful collection of applications worth
running, studying, comparing, or contributing to.

## Open data

Each app is plain YAML under `data/records/`. Taxonomy, product pages,
analytics, and deployment configuration also live in this repository.
Grove supplies reusable contracts, UI, and maintenance commands
without owning the Open App Scout product. Anyone can suggest an app,
fix incorrect metadata, or improve curation through a pull request.
There is no proprietary backend and no opaque database.

## How to contribute

- **Suggest a new app** — open the [submission page](/submit) or send
  a pull request that adds a `data/records/<slug>.yml` file.
- **Fix incorrect metadata** — every YAML carries human-curated and
  automation-synced fields; the GitHub sync opens reviewable PRs when
  upstream data changes.
- **Improve the directory** — page copy, taxonomy, and styling all
  live in this repository.

See [CONTRIBUTING.md](https://github.com/tortuvshin/open-apps/blob/main/CONTRIBUTING.md)
for the full curation rules and PR workflow.
