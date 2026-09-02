# Posnic POS

Posnic POS is a desktop point-of-sale and billing app for retail shops and restaurants. The local edition runs the till and its database on hardware the shop controls, while the public source also includes setup, support, update, backup, and optional cloud-activation surfaces around that local workflow.

## What the codebase includes

- An Electron desktop shell with a local Node.js API and a MongoDB-backed data store.
- Checkout and billing flows for sales, returns, held bills, part payments, receipts, and reports.
- Inventory and purchasing screens for item stock, suppliers, purchase entries, and stock-aware selling.
- Restaurant-oriented support such as kitchen order ticket handling and receipt printer integration.
- Backup, restore, update, startup, hardware, and log-management surfaces that are part of the packaged desktop app rather than separate examples.
- Release packaging for Windows, macOS, and Linux through GitHub Releases.

## Why it is useful to study

Open-source POS codebases are often narrow web demos or inventory samples. Posnic is useful because it shows the messier desktop concerns that real shop software has to handle: local database startup, first-run setup, retail hardware, offline checkout, update safety, backup safety, receipts, and support context.

The repository also keeps operational documents next to the code. The README, self-hosting notes, hardware matrix, privacy page, governance policy, release verification guide, and third-party notices make it possible to review both the application behavior and the packaging boundary.

## Caveats

Posnic-owned source is AGPL-3.0-only. Release packages include separately licensed components, including MongoDB Community Server under SSPL-1.0, so downstream packagers should read the third-party notices and package evidence before redistributing binaries.

Windows is the best-tested retail-hardware target. macOS and Linux builds are published, but hardware validation is thinner there. Operators should also expect normal first-launch trust warnings while signing and notarization mature.

The project is young and low-star. Treat it as a codebase worth inspecting, not as a popularity signal.

## How to run it

```bash
git clone https://github.com/Posnic/POS
cd POS
npm install
npm start
```

The development app downloads and runs its local database during setup. For packaged users, the current downloads live on the v1.6.1 GitHub release.

## Verified sources

- Posnic POS repository: <https://github.com/Posnic/POS>
- Posnic website: <https://posnic.io/>
- Latest release: <https://github.com/Posnic/POS/releases/tag/v1.6.1>
- User guide: <https://github.com/Posnic/POS/blob/develop/docs/USER_GUIDE.md>
- Self-hosting guide: <https://github.com/Posnic/POS/blob/develop/docs/SELF_HOSTING.md>
- Hardware matrix: <https://github.com/Posnic/POS/blob/develop/docs/HARDWARE_MATRIX.md>
- Release verification: <https://github.com/Posnic/POS/blob/develop/docs/VERIFY_RELEASE.md>
- Third-party notices: <https://github.com/Posnic/POS/blob/develop/THIRD-PARTY-NOTICES.md>
