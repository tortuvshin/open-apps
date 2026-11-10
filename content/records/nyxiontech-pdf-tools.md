---
name: Nyxiontech PDF Tools
repoUrl: https://github.com/jurecki007/nyxiontech-tools
category: tools
stack: react
projectType: real-app
summary: A static site with no backend that runs twenty-five PDF and image operations in the browser
  tab through WebAssembly, so documents are never uploaded and no account is needed. The same tools
  ship as a Tauri desktop build for Windows that works with no network at all.
description: 25 PDF and image tools that run in your browser tab or in a Windows app, with no upload and no account.
platforms:
  - web
  - windows
licenses:
  - agpl-3.0
links:
  github: https://github.com/jurecki007/nyxiontech-tools
  website: https://tools.nyxiontech.com
distribution:
  channels:
    - type: web-app
      url: https://tools.nyxiontech.com
      platform: web
      label: Open in the browser
    - type: github-releases
      url: https://github.com/jurecki007/nyxiontech-tools/releases/latest
      platform: windows
      label: Windows installer (.exe and .msi)
      notes: Not yet code-signed, so Windows SmartScreen shows a warning on first run.
    - type: self-host
      url: https://github.com/jurecki007/nyxiontech-tools#self-hosting
      label: Self-host the static build
tags:
  - pdf
  - ocr
  - privacy
  - self-hosted
bestFor:
  - Merging, splitting, compressing, signing, redacting and converting PDFs without sending files to a server.
  - Reading a React and TypeScript app that drives pdf.js, Tesseract and an ONNX model in WebAssembly.
whyListed:
  - Every operation runs on the device, and the Content-Security-Policy restricts connections to the site's own origin, so the no-upload claim is checkable in the network panel.
  - One codebase ships both the browser app and a Tauri desktop build, with the WebAssembly pipeline shared between them.
caveats:
  - The browser version needs the network to load the page; its service worker caches nothing. Only the Windows build runs with no network.
  - Young project, first published in November 2026, with one main contributor and no stars yet.
  - The desktop build is Windows only; there is no macOS or Linux binary, and the installers are not yet code-signed.
seo:
  title: "Nyxiontech PDF Tools – Open Source PDF Toolkit"
  description: Nyxiontech PDF Tools is a free browser PDF and image toolkit that merges, splits, signs, redacts, converts and OCRs files on your own device. Open source under AGPL-3.0.
addedAt: 2026-11-10
submittedBy: jurecki007
---
Twenty-five tools for PDFs and images in one place: merge, split, rotate and
reorder pages, compress, sign, fill forms, redact, add page numbers and
watermarks, protect with a password, convert to and from Word, JPG, PNG and
text, HEIC to JPG, strip metadata, remove image backgrounds, and OCR.

The architecture is the point of interest. There is no backend: the site is
static files, and every operation runs in the tab through WebAssembly. The
pdf.js JBIG2 and OpenJPEG decoders handle scanned and JPEG 2000 documents,
Tesseract does OCR in Polish and English, and ONNX Runtime Web runs a U2-Net
model for background removal. Because nothing is sent anywhere, there is no
server holding anyone's documents, and the Content-Security-Policy limits
connections to the site's own origin, so the claim can be checked rather than
believed.

The same codebase produces a Tauri desktop build for Windows, which runs the
identical tools with no network. The web interface is in six languages. The
project is self-hostable under AGPL-3.0.

On the directory's star guidance: this repository has no stars, because it was
first published in November 2026. What is there instead is a tagged v1.1.0
release with Windows installers, an end-to-end test suite,
documentation for self-hosting, and a licence that is unambiguous. The caveats
above are the honest limits, including the one that matters most to this
directory's readers: the browser version is not offline-capable, only the
desktop build is.

Submitted by the project maintainer. These notes describe the documented
architecture and the shipped releases; they do not claim an independent
benchmark or a curator's endorsement.
