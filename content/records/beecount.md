BeeCount (蜜蜂记账) is a local-first bookkeeping app for iOS, Android, and Web
written in Flutter. Entries live in a Drift/SQLite database on the device,
and the user chooses between five sync backends without changing a line of
code: the self-hosted BeeCount Cloud, iCloud Drive, Supabase, WebDAV, and any
S3-compatible store (Cloudflare R2, AWS S3, MinIO). The same binary that
talks to iCloud on your iPhone can be repointed at a Dockerised BeeCount
Cloud on a NAS and keep syncing.

## Why it matters

- **Five interchangeable sync layers.** Sync is implemented as separate
  packages under `packages/flutter_cloud_sync_*` (`supabase`, `webdav`,
  `icloud`, `s3`) plus `flutter_cloud_sync` for the self-hosted BeeCount
  Cloud. A user can move from a zero-config iCloud flow to a fully
  self-hosted deployment without rebuilding the binary or losing history.
- **AI-assisted capture.** A dual-engine OCR pipeline — on-device TFLite
  plus Zhipu GLM-4 in the cloud — recognises Alipay, WeChat, and UnionPay
  screenshots. Android uses an accessibility service to capture them
  automatically; iOS uses a Shortcuts back-tap. Voice entry and a chat
  assistant (`flutter_ai_kit` + `flutter_ai_kit_zhipu`) round out the
  capture surface.
- **Multi-ledger as a first-class concept.** Each ledger has its own
  currency, its own accounts, and its own budget. BeeCount Cloud adds
  shared ledgers with Owner/Editor roles and AES-256-encrypted backups
  that fan out to R2/S3/WebDAV/B2 in parallel.
- **MCP support.** Pair the app with BeeCount Cloud and any Model
  Context Protocol client can read or write the ledger, turning the
  bookkeeping data into a tool for AI assistants rather than a silo.

## How it works

The app is a single Flutter project that pulls in `flutter_ai_kit`,
`flutter_ai_kit_zhipu`, and `flutter_ai_kit_openai` for the LLM surface,
and the four `flutter_cloud_sync_*` packages for the sync surface.
Local persistence is `drift` (^2.20.2) over `sqlite3_flutter_libs`, with
state exposed as `flutter_riverpod` (^2.5.1) providers. `fl_chart`
(^0.68.0) powers the analytics screens, `table_calendar` (^3.1.0)
drives the date picker, and `home_widget` (^0.9.2) publishes the
6 content-type × 12 variant widget matrix to the launcher. CSV import
and YAML config export handle migrations from Alipay/WeChat bills,
`fl_chart` powers the trend views, and `archive` plus `crypto` handle
the encrypted-backup pipeline.

Build flavours separate dev from production (`--flavor dev` /
`--flavor prod --release`), and `build_runner` codegen is run once per
pull to refresh the Drift schema and Riverpod adapters. The
`packages/` folder is a small monorepo inside the repo — the four sync
backends plus three AI kits are local-path dependencies declared in
`pubspec.yaml`.

## Caveats

- **Business Source License.** Free for personal use, learning,
  research, and open-source contributions. Commercial deployments
  require a paid licence — see `COMMERCIAL_LICENSE.md` and contact
  `sunxiaoyes@outlook.com`.
- **AI features need a key.** OCR cloud mode and the chat assistant
  require a Zhipu API key; the on-device TFLite OCR works offline but
  with a smaller model and lower accuracy on edge-case receipts.
- **Self-hosted Cloud adds ops surface.** The Dockerised BeeCount
  Cloud (FastAPI + React + WebSocket) needs PostgreSQL, Redis, and a
  reverse proxy; small deployments may be happier on iCloud or Supabase.
- **No HarmonyOS build.** A community port exists but is marked
  discontinued; the supported matrix is iOS, Android, and Web.

## Deployment notes

Pick a sync backend during first-run onboarding. For the self-hosted
option, deploy BeeCount Cloud (FastAPI + React + WebSocket) via the
provided `docker-compose.yml`, then point the app at its URL. The iOS
build expects Xcode 15+ and a minimum iOS 15.5; Android targets API 21+.
The repo publishes signed APKs (universal, armeabi-v7a, x86_64), an
AAB, and a TestFlight slot at every release — see the latest tag under
`/releases` for downloads.

```bash
git clone https://github.com/TNT-Likely/BeeCount.git
cd BeeCount
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run --flavor dev
```