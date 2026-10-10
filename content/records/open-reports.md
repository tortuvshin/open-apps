---
name: Open Reports
repoUrl: https://github.com/varaprasadreddy9676/open-reports
projectType: real-app
category: developer-tools
stack: react
summary: A self-hostable visual report designer and rendering engine for operational documents, with JSON report definitions, an embeddable designer and an HTTP rendering API.
description: Open Reports is an MIT-licensed web report designer and rendering engine for creating and rendering invoices, statements and other operational documents from JSON definitions.
platforms:
  - web
licenses:
  - mit
links:
  github: https://github.com/varaprasadreddy9676/open-reports
  website: https://open-reports-demo.onrender.com
  docs: https://github.com/varaprasadreddy9676/open-reports/tree/main/docs
distribution:
  channels:
    - type: web-app
      label: Live demo
      url: https://open-reports-demo.onrender.com
      verified: true
    - type: self-host
      label: Source and self-hosting instructions
      url: https://github.com/varaprasadreddy9676/open-reports
      verified: true
tags:
  - report-designer
  - report-generation
  - document-generation
  - self-hosted
  - invoice
  - pdf-generation
bestFor:
  - Developers who want a visual editor for operational report templates.
  - Applications that prefer to own report definitions and provide them to a rendering API.
whyListed:
  - It is a usable browser-based application with a public source repository and live demo.
  - The repository documents both embedding the designer and rendering host-owned JSON definitions through an API.
  - The design-to-render workflow is a useful example for developers comparing open-source reporting tools.
  - Although the repository is new and has little adoption history, it is a runnable MIT-licensed application with documentation, a working demo, and a concrete host-owned JSON rendering and embedding workflow to evaluate.
caveats:
  - Early-stage project; verify the current feature set and deployment instructions before adopting it for production.
  - JRXML import creates drafts and is partial; this is not a drop-in JasperReports or `.jasper` runtime replacement, and output parity is not guaranteed.
seo:
  title: Open Reports – Open Source Report Designer and Engine
  description: Design operational reports in a browser and render host-owned JSON definitions through an API. MIT-licensed, self-hostable, with a live demo.
addedAt: 2026-10-11
submittedBy: varaprasadreddy9676
source:
  type: manual
  provider: github
  owner: varaprasadreddy9676
  repo: open-reports
  url: https://github.com/varaprasadreddy9676/open-reports
curation:
  reviewed: false
  labels:
    - new
  lenses: []
visibility: keep
---
Open Reports is a browser-based designer and rendering engine for operational documents such as invoices and statements. The host application can keep the report definition and send it with the data to the rendering API, or embed the designer for template editing. The repository includes a live demo and integration documentation.

This is an early-stage project. Its JRXML importer produces partial, reviewable drafts; it does not execute `.jasper` files or provide complete JasperReports compatibility. Check the repository and demo against your requirements before adopting it.
