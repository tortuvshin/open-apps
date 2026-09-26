---
name: Twenty
repoUrl: https://github.com/twentyhq/twenty
projectType: real-app
category: business
stack: react
summary: A modern open-source CRM where the schema, the apps, and the AI agents all share one
  metadata-driven data model — version-controlled in code, exposed to AI tooling via a native MCP
  server, and runnable as a 4-service Docker stack.
description: Twenty is an open-source CRM whose data model is a runtime artifact — every custom
  object, field, view, role, and AI agent is a row in metadata tables, with the GraphQL schema and
  SQL queries rebuilt per workspace on demand. Written in TypeScript with NestJS, React, PostgreSQL,
  and a native MCP server for Claude/ChatGPT/Cursor.
platforms:
  - web
  - linux
licenses:
  - agpl-3.0
  - mit
links:
  github: https://github.com/twentyhq/twenty
  website: https://twenty.com
  docs: https://docs.twenty.com
distribution:
  channels:
    - type: self-host
      label: Self-host with Docker Compose
      url: https://github.com/twentyhq/twenty/blob/main/packages/twenty-docker/docker-compose.yml
      verified: true
    - type: web-app
      label: Twenty Cloud
      url: https://app.twenty.com
      verified: true
    - type: github-releases
      label: GitHub Releases
      url: https://github.com/twentyhq/twenty/releases
      verified: true
tags:
  - ai
  - ai-agents
  - crm
  - docker-compose
  - foss-alternative
  - gpt-integration
  - graphql
  - mcp
  - mcp-server
  - nestjs
  - open-source
  - postgres
  - postgresql
  - react
  - sales
  - self-hosted
  - typescript
  - web-app
  - workflow
bestFor:
  - Engineering-led teams (5–200 people) who want to version their CRM schema in git
  - Replacing Salesforce Sales/Service clouds with a self-hostable, programmable alternative
  - B2B SaaS, partnerships, and agencies where the data model is the moat
  - Privacy-conscious teams (defense-adjacent, EU public sector, regulated industries)
  - Workflows that AI agents drive via the native MCP server
  - Studying a metadata-driven CRM architecture in production
whyListed:
  - The Open App space lacks a real, modern OSS CRM alternative to Salesforce — Twenty is the
    most-funded, most-starred, and most actively developed option in the category
  - The architecture is a textbook case study of metadata-as-rows cascading into a runtime GraphQL
    pipeline, a custom ORM, and an apps framework
  - The native MCP server is the most defensible AI integration in any open-source CRM today
  - $5M seed + YC S23 + 280+ contributors + weekly releases through Aug 2026 shows real engineering
    velocity
  - Licensed AGPLv3 with a Section 7 "Application Exception" that protects app developers from
    copyleft — a deliberate, well-documented licensing stance
caveats:
  - No native CPQ / line-item editor for multi-product quotes — the biggest credibility gap, GitHub
    Discussion
  - No native mobile app; web-only mobile is white-screen on iPhone and rich-text is unusable with a
    soft keyboard
  - No email compose-and-send from inside the CRM as of the latest review
  - Workflow builder is still a work-in-progress — missing NOT logic, undo/redo, "IS" operator on
    text/link fields
  - "Self-hosting is rough: first-boot migration wedge (#24432), v2.31 upgrade failure on instances
    with apps but no workspaces (#24273), ≥4 GB RAM recommended"
  - AGPLv3 with a Section 7 Application Exception + Contributor License Agreement — read the LICENSE
    before forking
  - Cloud AI features require supplying your own provider key (OpenAI, Anthropic, Google, etc.) — no
    model ships with the OSS binary
  - Customer logos (Bayer, PwC, République Française) appear in the trusted-by bar but are not
    individually documented in case studies; verified case studies are all SMB
  - Multiple maintainers self-reported 7 security advisories in 2026 (2 critical, 2 high, 3
    moderate), including SQL injection and SSRF
relations:
  - type: alternative-to
    to: salesforce
    evidence:
      type: self-described
      url: https://github.com/twentyhq/twenty
      quote: The open alternative to Salesforce, designed for AI.
      checkedAt: 2026-09-22
seo:
  title: Twenty – Open Source CRM & Salesforce Alternative
addedAt: 2026-09-01
source:
  type: github-topic
  owner: twentyhq
  repo: twenty
  url: https://github.com/twentyhq/twenty
curation:
  reviewed: true
  reviewedAt: 2026-08-21
  reviewedBy: Open Apps curators
  labels:
    - hot
    - mature
  lenses:
    - good-to-learn
    - production-like
visibility: keep
---
Twenty is an open-source CRM where the schema is a runtime artifact, not a database. Every custom object, field, view, role, agent, and skill is a row in PostgreSQL metadata tables; the GraphQL schema, resolvers, and SQL queries are rebuilt per workspace on demand. That single choice — metadata-as-rows — is what makes the platform cohere: code-defined apps that publish into the same data model, an MCP server that exposes the same data model to Claude and Cursor, and a 4-service Docker stack that inherits the same model. The closest comparison isn't SuiteCRM or EspoCRM — it's a values-level cousin of Directus or Strapi, wearing a CRM-shaped UI.

The headline numbers are real and they set the tone: **55.2k stars, 8.6k forks, 14,574 commits, three releases on a single day in August 2026**, $5M seed (led by Runa Capital, with angels from Front, HubSpot, Strapi, and the ex-Pipedrive CEO), YC S23, and 280+ contributors. The project is the most-funded, most-starred, and most actively shipped open-source CRM. The interesting question is whether the engineering matches the velocity.

## The architecture is one decision, properly cascaded

Look at `packages/twenty-server/src/engine/metadata-modules/object-metadata/object-metadata.entity.ts` and the metadata is unsurprising: an `ObjectMetadataEntity` is a row with `nameSingular`, `description`, `icon`, `isActive`, `isRemote`, `targetTableName` (now deprecated), `duplicateCriteria` (JSONB), and a `OneToMany` to `FieldMetadataEntity`, `IndexMetadataEntity`, `SearchFieldMetadataEntity`, permissions, and views. Anything a user can define in the UI is a row in this table, and `FieldMetadataEntity` rows hang off it the same way.

What matters is what cascades from that decision. Because schemas are rows, no per-tenant migrations are needed. Because schemas are rows, the GraphQL pipeline can't be static — Twenty substitutes a four-layer runtime pipeline: `workspace-schema-builder/` produces SDL strings, `workspace-graphql-schema-sdl/` caches them per workspace, `workspace-resolver-builder/` builds the resolver tree, and `workspace-query-builder/` + `workspace-query-runner/` translate and execute the queries. They're stitched together by `workspace-schema.factory.ts` using `@graphql-tools/schema`'s `makeExecutableSchema`. This is the central learning: a metadata-driven product has to invent a runtime GraphQL pipeline before it has a CRM.

The cascade continues. A custom ORM at `engine/twenty-orm/` introspects per-workspace tables created from metadata and routes queries to the right physical table. There's a dual representation — every metadata entity has a parallel `flat-*` module (e.g. `flat-object-metadata`, `flat-view`) holding a denormalized key→entity map for cache lookup. The frontend at `packages/twenty-front/src/modules/` is feature-sliced into 50+ domain modules (`object-record`, `views`, `workflow`, `ai`, `auth`, `apollo`, `metadata-store`, …) and renders dynamic objects/fields through view components (`record-table`, `record-board`, `record-calendar`, `record-list`, `record-show`, `record-card`, `record-inline-cell`) all driven by runtime metadata. State is Jotai with the Apollo cache as source of truth.

The cost is real. The custom ORM gives up Drizzle/Prisma ergonomics; the query planner has more moving parts; debugging a runtime-built GraphQL schema is harder than reading a static `.graphql` file. Twenty's version is **v2.30.0** at the time of writing (Aug 11, 2026), and the GitHub search tag history shows the team has been paying that cost, fix-by-fix, since launch. The trade was the right one.

## The apps framework is honest about being code

The SDK at `packages/twenty-sdk/src/sdk/define/index.ts` exposes a paired `define*` + `*Config` function for every entity type a user can create: `defineObject`, `defineField`, `defineView`, `defineViewField`, `defineRole`, `defineApplicationRole`, `defineSkill`, `defineAgent`, `defineApplication`, `defineConnectionProvider`, `defineNavigationMenuItem`, `defineIndex`, `definePermissionFlag`, `defineLogicFunction`, `defineFrontComponent`, `defineSettingsFrontComponent`, `definePageLayout`, `definePageLayoutTab`, `defineCommandMenuItem`. Each is paired with install/uninstall/pre/post lifecycle variants. Field types include `ActorField`, `AddressField`, `CurrencyField`, `EmailsField`, `FullNameField`, `LinksField`, `PhonesField`, `RichTextField`. The validation result is `createValidationResult({ config, errors, warnings })` — meaning validation happens at build time, not at deploy time.

The scaffolding is `npx create-twenty-app@latest my-app`. Publishing is `npx twenty app:publish --private`. The bundle works across runtimes because the SDK ships separate Vite configs for browser/node/front-component/logic-function/billing (`vite.config.billing.ts`, `vite.config.browser.ts`, `vite.config.define.ts`, `vite.config.front-component.ts`, `vite.config.logic-function.ts`, `vite.config.node.ts`, `vite.config.utils.ts`). Server-side user code runs via three drivers selected by `LOGIC_FUNCTION_TYPE` — `disabled`, `local` (in-process), or `lambda` (AWS Lambda). Apps are resolved across workspaces by a `universalIdentifier`, which is the feature that makes "publish to your workspace" mean the same thing as "publish to someone else's workspace" without a per-tenant ID migration.

The honesty is in the cost. A non-developer cannot reasonably build a Twenty app today. A Reddit r/selfhosted commenter summed it up: *"love the layout but it doesn't customize nearly as much or as easily and managed to break it trying."* That's the documented trade-off — Twenty is for engineering teams who want their CRM schema in a PR.

## The MCP server is the most defensible AI integration in any OSS CRM

`packages/twenty-server/src/engine/api/mcp/mcp.module.ts` is small enough to read end-to-end. One controller (`McpCoreController`), three guards (`JwtAuthGuard`, `McpAuthGuard` for API keys, `WorkspaceAuthGuard`), three services (`McpProtocolService` for protocol parsing, `McpInstructionBuilderService` for model context, `McpToolExecutorService` for tool invocation). The module imports include `ApiKeyModule`, `SkillModule`, `UserRoleModule`, `WorkspaceCacheModule`, `WorkspaceManyOrAllFlatEntityMapsCacheModule`, and `MetricsModule`. The tool-calling surface plugs in through `engine/core-modules/tool-provider/` with `providers/`, `tools/`, `output-transforms/`, and `resolvers/` — a textbook pluggable provider pattern.

The MCP server ships with every paid tier, including the $9/user Pro plan. It supports OAuth and works with Claude, ChatGPT, and Cursor. A code interpreter for AI agents runs on either a local sandboxed subprocess or the E2B managed cloud sandbox, switched by `CODE_INTERPRETER_TYPE` with `E2B_API_KEY`. Folk and Attio describe "AI" features; Attio documents an MCP-compatible developer platform. Twenty exposes the data model directly to a standard protocol, with workspace RBAC enforced. This is the closest thing to a real *AI-native* open-source CRM in production today.

The marketing claim is "built for agents." The code says "AI features require supplying your own provider key" — no model ships with the OSS binary, and operation requires at least one of `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / Google (and others). That's the realistic framing.

## The license looks like three licenses

The LICENSE file is **AGPLv3 with a Section 7 "Twenty Application Exception" appended**. Copyright Twenty.com, PBC (2023-present). The Application Exception is the load-bearing detail: developing, conveying, or making available an Application that interacts with Twenty through Application Interfaces does not, by itself, cause the Application to be governed by AGPLv3. Bundling Applications with libraries via official build tooling for the Twenty platform does not extend AGPLv3 to the Application. In plain terms, apps you write using the Twenty SDK can be proprietary — that's the legal bridge that makes the apps framework worth building on.

Files tagged `/* @license Enterprise */` are under a separate **Twenty.com Commercial License** (proprietary). These include SSO/SAML, row-level permissions, audit logs, encryption key rotation, single-tenant isolation, SCIM, and IP allow-listing. The Enterprise code ships in the OSS repo but is gated at runtime by `ENTERPRISE_KEY` and `ENTERPRISE_VALIDITY_TOKEN` env vars. The SDK packages — `twenty-sdk`, `twenty-client-sdk`, `create-twenty-app`, `twenty-shared`, `twenty-ui`, `packages/twenty-apps` — are **MIT**.

The "commercial-friendly" framing from a 2024 blog post is interpretive, not a license change. The Oct 2024 post is widely cited as a switch from AGPL to a friendlier license; the actual LICENSE file is still AGPLv3, and the friendliness lives in the Section 7 exception. Add a **Contributor License Agreement** to the stack, and the question "is Twenty really open source?" is a real one for organizations that need to fork and rebrand. It is, but the long-term commitment is conditional.

Cloud pricing is competitive: **Pro $9/user/month** (yearly), **Organization $19/user/month** (adds SSO, row-level permissions, audit logs, custom domain), **Enterprise from $50k/year** (single-tenant, SCIM, IP allow-list, SLA). The MatrixCloud free self-host path is real but rough: the README and the GitHub issue list tell different stories.

## Self-hosting is real, but rough

The 4-service Docker Compose (`packages/twenty-docker/docker-compose.yml`) is the whole stack: `server`, `worker`, `db` (PostgreSQL 16), `redis` (with `--maxmemory-policy noeviction`). Required env vars: `SERVER_URL`, `APP_SECRET`, `ENCRYPTION_KEY`, `FALLBACK_ENCRYPTION_KEY`, `PG_DATABASE_URL`, `REDIS_URL`, `NODE_PORT`, `FRONTEND_URL`. Healthchecks: `curl --fail http://localhost:3000/healthz` on the server, `pg_isready` on the database, `redis-cli ping` on Redis.

The rough parts live in the issue tracker. **#24432 (sonarly:high, Aug 20 2026):** `/healthz` returns 200 while migrations run; an interrupted first-boot migration can wedge the database. **#24273 (sonarly:high):** the v2.31 upgrade fails on instances with apps installed but no workspaces yet. **#24240:** workspace invitation emails are never enqueued in self-hosted mode. **#16205 (open since Dec 2025):** deleted avatars/attachments are not removed from disk on local-storage self-host. RAM floor is ≥4 GB recommended. The README's "one-command Docker Compose" framing undersells the operational basics; plan to operate behind a reverse proxy with proper `X-Forwarded-For` / `X-Forwarded-Proto` headers.

The 7 security advisories reported in 2026 (2 critical, 2 high, 3 moderate) are all reported by Twenty maintainers themselves — `FelixMalfait` and `prastoin` — which is a transparency signal as much as a vulnerability one. Two critical SQL injections (GHSA-mm7j-q9q3-qqwj, GHSA-jgx4-6mr9-9573), cross-workspace IDOR, two stored XSS, and two SSRF bypasses via IPv4-mapped IPv6 and HTTP redirect following. The `resolutions` block in `package.json` pins ~50 transitive dependencies to specific patched versions — a deliberate "carry the fix ourselves" pattern. Self-hosters must monitor advisories and update regularly.

## What's missing, and what the community keeps saying

The 10–50-user tech-savvy team is the convergence point across independent reviewers — SentiSight (Mar 19 2026), TaskRhino (Apr 2 2026), ShipGarden (Jun 21 2026), Hyteck (Aug 2025). The reviewer-verifiable gaps:

- **No native CPQ / line-item editor.** The single most-cited credibility gap. A Reddit r/selfhosted thread titled "Save yourself time - Twenty CRM is missing a crucial sales/quoting feature" closes the case in two words: "currently unviable." GitHub Discussion #21682 was closed without resolution.
- **No email compose-and-send from inside the CRM.** Hyteck's Aug 2025 review: "composing/sending emails not yet available."
- **No native mobile app.** Issue #23259 was closed without delivery. Issues #20945 (iPhone white screen) and #20874 (rich-text unusable with soft keyboard) remain open.
- **Workflow builder is a work-in-progress.** #24428 (missing "IS" operator on text/link fields), #24431 (wrong activation status), #24420 (destructive picker action without undo). The Code node — serverless JS — is the documented workaround. No NOT logic, no undo/redo, no multi-select node movement.
- **No native CSV import UI.** Migration requires writing scripts or using n8n.
- **No webhook event filtering.** All event types go to the webhook URL. Cloud webhooks use a fixed IP range.

The customer logos — République Française, Bayer, PwC, Windmill, Fora, Wazoku, CivicActions, OTIIMA, NIC Industries, Shiawase Home — appear in the trusted-by bar, but the six documented case studies are all SMBs (Nine Dots Ventures, Alternative Partners, NetZero, AC&T Education Migration, W3villa Technologies, Elevate Consulting). The "90% CRM cost reduction" claim from AC&T is vendor-supplied; no independent verification.

## When to choose Twenty, and when not to

**Choose Twenty when** you are an engineering-led team of 5–200 people who want to version your CRM schema in git, self-host (or vendor-host) on your own infrastructure, and wire Claude and Cursor into the live data model via MCP. The lab notebook, the regulated-industry deployment, and the YC-shaped startup are the canonical fits.

**Choose EspoCRM** when you want the smallest possible free admin surface, a PHP heritage you can keep forever, and zero AI features to govern.

**Choose SuiteCRM** when you need a broad out-of-the-box catalog (cases, contracts, quotes, portal) and your team is comfortable with SugarCRM-era PHP.

**Choose Frappe CRM / ERPNext** when you also need accounting, manufacturing, inventory, or HR on the same database. Twenty is not an ERP.

**Choose Folk** when your sales motion runs on LinkedIn, you want AI assist on day one, and you don't want to operate infrastructure.

**Choose Attio** when the data is the moat and you can pay $35–$99/user/mo to skip engineering work. Attio is the hosted-only incumbent with the slickest developer API.

**Choose Pipedrive** when the buying decision sits with non-technical sales managers who optimize the pipeline UI above all else.

**Choose Salesforce / HubSpot** when you need the full Salesforce platform (Marketing Cloud, Service Cloud, AppExchange, Einstein, sandbox orgs, territory management, industry clouds) or HubSpot's free CRM with marketing automation. Twenty is not a credible replacement for the full Salesforce platform.

## Developer lessons worth borrowing

- **Metadata-as-rows is the right abstraction when "users define their own schema."** Twenty's `ObjectMetadataEntity` is a row in PostgreSQL; the GraphQL schema is rebuilt per workspace; the ORM introspects per-tenant tables. The price is a custom ORM and a four-layer runtime GraphQL pipeline. The cost is unavoidable.
- **Apps as validated code, not point-and-click.** Paired `define*` + `*Config` functions return `createValidationResult` at build time. The right call if you want to ship customization as a library your developers read in PRs.
- **Multiple runtime drivers for user-submitted code.** Logic functions run as `disabled`, `local`, or `lambda` switched by `LOGIC_FUNCTION_TYPE`. The same SDK works locally and in production. The Code interpreter matches the pattern with `local` vs `E2B`.
- **Pluggable tool-calling for AI agents.** `engine/core-modules/tool-provider/` with `providers/` + `tools/` + `output-transforms/` is the cleanest MCP-tool surface in any open-source CRM. Worth studying if you're building an MCP integration.
- **Plan license tiers in parallel with the architecture.** AGPLv3 + Section 7 Application Exception + dual-licensed Enterprise + MIT SDK packages is a deliberate structure, not a workaround. Pick which packages get which license and which features gate behind a key before writing the first line.

## How to run it

```bash
git clone https://github.com/twentyhq/twenty
cd twenty/packages/twenty-docker
cp .env.example .env  # set SERVER_URL, APP_SECRET, ENCRYPTION_KEY, FALLBACK_ENCRYPTION_KEY, PG_DATABASE_URL, REDIS_URL
docker compose up -d
```

Open `http://localhost:3000`. The first boot runs migrations, then seeds the workspace. **Watch for the migration wedge** (#24432) — wait for `/healthz` to return 200 *after* the migration step (the docker-compose healthcheck races the migration). Allocate ≥4 GB RAM. For production, switch `STORAGE_TYPE` to `S_3` and back the upload paths with S3-presigned URLs. For AI features, supply at least one of `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` (or any other supported provider); for the code interpreter, supply `E2B_API_KEY`.

To build an app:

```bash
npx create-twenty-app@latest my-app
cd my-app
npx twenty app:publish --private
```

Anything you `defineObject` in the app becomes a row in `object-metadata` for the workspace; `defineLogicFunction` becomes a server-side function registered with the runtime driver; the universal identifier lets it ship across workspaces without ID churn.

## Verified sources

- Twenty repository: <https://github.com/twentyhq/twenty>
- LICENSE (AGPLv3 + Section 7 Application Exception): <https://github.com/twentyhq/twenty/blob/main/LICENSE>
- Latest release v2.30.0: <https://github.com/twentyhq/twenty/releases>
- Pricing: <https://twenty.com/pricing>
- Customers: <https://twenty.com/customers>
- Docker Compose: <https://github.com/twentyhq/twenty/blob/main/packages/twenty-docker/docker-compose.yml>
- Generic GraphQL runtime schema factory: <https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/engine/api/graphql/workspace-schema.factory.ts>
- MCP server module: <https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/engine/api/mcp/mcp.module.ts>
- Object metadata entity: <https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/engine/metadata-modules/object-metadata/object-metadata.entity.ts>
- Auth module: <https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/engine/core-modules/auth/auth.module.ts>
- SDK define folder: <https://github.com/twentyhq/twenty/tree/main/packages/twenty-sdk/src/sdk/define>
- Security advisories: <https://github.com/twentyhq/twenty/security/advisories>
- Funding coverage: <https://tech.eu/2024/11/19/twenty-secures-5m-to-challenge-crm-giants-with-open-source/>, <https://techcrunch.com/2024/11/18/twenty-is-building-an-open-source-alternative-to-salesforce/>
- HN Launch Jul 2023: <https://news.ycombinator.com/item?id=36791434>
- HN follow-up Jun 2024: <https://news.ycombinator.com/item?id=40648082>
- Independent reviews: <https://www.sentisight.ai/twenty-crm-review-is-this-open-source-salesforce-alternative-ready-for-production/> (Mar 19 2026), <https://www.taskrhino.ca/blog/is-twenty-crm-right-for-your-business/> (Apr 2 2026), <https://www.shipgarden.com/gallery/twenty-crm-review-open-source-salesforce-alternative-solo-founders-2026> (Jun 21 2026), <https://hyteck.de/post/trying-twenty/> (Aug 2025), <https://prospeo.io/s/twenty-pricing-reviews-pros-and-cons> (2026)
- Direct comparison alternatives: <https://github.com/espocrm/espocrm>, <https://github.com/salesagility/SuiteCRM>, <https://github.com/frappe/erpnext>, <https://frappe.io/crm>, <https://www.folk.app/pricing>, <https://www.attio.com/pricing>, <https://www.pipedrive.com/en/pricing>
