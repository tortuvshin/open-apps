---
name: OSTUM Desktop
repoUrl: https://github.com/Ranis2023/ostum-desktop
category: productivity
projectType: real-app
description: Read photographs, compare Excel workbooks and transcribe recordings with local models on Windows.
platforms:
  - windows
licenses:
  - mit
links:
  website: https://ranis2023.github.io/ostum-desktop/en/
  github: https://github.com/Ranis2023/ostum-desktop
distribution:
  channels:
    - type: github-releases
      label: Windows x64 installer and checksum
      url: https://github.com/Ranis2023/ostum-desktop/releases/latest
      verified: false
tags:
  - offline-first
  - local-ai
  - spreadsheets
bestFor:
  - Preparing a Windows laptop to use its own model away from the network.
  - Checking spreadsheet changes against the original cells.
whyListed:
  - Two downloadable workbooks let readers reproduce a price change, a missing product and a new product.
  - A separate folder permission determines whether the local assistant may use a document for analysis or training.
caveats:
  - The Windows interface and in-app help are Russian. Setup and worked examples are available in English.
  - The standard first installation downloads 13.38 GB of models. Offline installation requires a prepared kit.
  - Office workspaces unlock for free after a one-time Telegram channel membership check.
seo:
  title: OSTUM Desktop – Open Source Windows AI Assistant
addedAt: 2026-11-22
submittedBy: Ranis2023
---

The desktop application is built with C# and WPF. A local llama.cpp process serves a Qwen3.5-based model. Basic chat and photo reading work without an account once the models have been installed. The MIT licence covers the application, and separate licences apply to its runtimes and models.

To inspect an example, compare the two sample price lists using the product-code column. A17 goes from 90 to 100 RUB, D42 disappears and E53 appears. Two other products move rows while keeping their prices. The separate report links each difference back to cells in the source workbooks. [Workbook downloads and expected results](https://ranis2023.github.io/ostum-desktop/en/excel/)
