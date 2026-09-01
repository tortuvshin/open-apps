# Authier

Authier is an open-source password manager for login credentials and time-based one-time password (TOTP) secrets. Its public user-facing clients are a web vault and extensions for Chrome, Firefox, and Microsoft Edge; the Firefox extension also runs on Firefox for Android.

## What the codebase includes

- A React browser extension with Manifest V2 and Manifest V3 builds, vault management, password autofill, and TOTP support.
- A separate React web vault for viewing and editing credentials, TOTP records, devices, and account settings.
- A React Native mobile client in the monorepo, although native mobile builds are not currently listed as supported public downloads.
- An Elysia API deployed through a Cloudflare Worker adapter, plus shared TypeScript schemas and cryptographic code used across clients.
- An Astro marketing and documentation site that publishes the current security model, download routes, privacy policy, and practical security caveats.

## Security model in the repository

Authier derives the client encryption key from the master password and a per-account salt using PBKDF2 with SHA-512 and 600,000 iterations. Vault items are encrypted with AES-256-GCM and a fresh initialization vector before synchronization, so the API receives encrypted credential and TOTP payloads rather than those secrets in plaintext.

Accounts can be configured to require approval from an existing trusted device before a new client enrolls and begins vault synchronization. TOTP synchronization can also be disabled per device. These controls are useful code to inspect, but they do not remove the need to protect every unlocked client and keep independent recovery options.

## Why it is useful to study

The repository shows how one TypeScript monorepo coordinates browser-extension, web, React Native, API, schema-generation, and encryption concerns for a security-sensitive product. It also exposes the practical edges that simpler examples often omit: multi-step-login autofill, device enrollment, encrypted synchronization, TOTP import/export, and separate Manifest V2 and V3 builds.

The [security architecture](https://www.authier.pm/security) documents the intended cryptographic flow, while the [official download page](https://www.authier.pm/download) identifies the currently supported clients.

## Caveats

Authier is a young, experimental password manager and has not published an independent third-party security audit. Public source makes the implementation inspectable, but it is not a substitute for a professional audit, a long operating history, or broad real-world review. For important secrets, an established audited password manager is the more conservative default.

The native mobile clients remain source code rather than a current supported store release, and the project does not currently document self-hosting as a supported deployment route. Evaluate the repository and its limitations before using it beyond a low-risk test vault.
