---
name: Cortex
repoUrl: https://github.com/cortex-docs/cortex
projectType: real-app
category: developer-tools
stack: javascript
summary: A TypeScript CLI for generating static API documentation, client SDKs, and MCP servers from
  OpenAPI, AsyncAPI, GraphQL, gRPC, OpenRPC, and Markdown.
description: Cortex is an open-source CLI that turns API specifications and Markdown into
  interactive documentation, typed SDKs, and MCP servers.
sourceDescription: Cortex - Generate interactive docs, typed SDKs from OpenAPI, AsyncAPI, GraphQL,
  gRPC, OpenRPC and MCP servers enriched with custom Markdown.
platforms:
  - linux
  - macos
  - windows
licenses:
  - mit
links:
  github: https://github.com/cortex-docs/cortex
  website: https://cortexdocs.dev
  docs: https://docs.cortexdocs.dev
tags:
  - developer-tools
  - open-source
  - cross-platform
  - cli
  - documentation
  - real-app
  - api-documentation
  - code-generation
  - mcp
bestFor:
  - Publishing interactive documentation from several API specification formats and Markdown.
  - Generating typed client SDKs alongside API documentation from the same source files.
  - Exposing API operations as MCP tools for compatible clients.
whyListed:
  - A usable MIT-licensed developer tool with a published npm package and static HTML output.
  - Supports OpenAPI, AsyncAPI, GraphQL, gRPC, and OpenRPC in one documentation workflow.
caveats:
  - Requires Node.js 20 or newer and npm 10 or newer.
seo:
  title: Cortex - Open Source API Documentation and SDK Generator
addedAt: 2026-09-23
source:
  type: submit
  provider: github
  owner: cortex-docs
  repo: cortex
  url: https://github.com/cortex-docs/cortex
curation:
  reviewed: false
  labels: []
  lenses: []
visibility: keep
---
# Cortex

Cortex is an open-source command-line tool for turning API specifications and Markdown into interactive documentation, typed SDKs, and MCP servers.

## What it does

The same project can combine OpenAPI, AsyncAPI, GraphQL, Protocol Buffer, OpenRPC, and Markdown sources. Cortex uses those inputs to build a static documentation site, generate typed client SDKs, and expose API operations through an MCP server.

Generated documentation includes API explorers, code samples, search, diagrams, and reusable Markdown content. The static output can be deployed to any web host without a dedicated application server.

## Caveats

- Requires Node.js 20 or newer and npm 10 or newer.
- Generated output depends on the quality and completeness of the source specifications.

## Links

- [GitHub repository](https://github.com/cortex-docs/cortex)
- [Official website](https://cortexdocs.dev)
- [Documentation](https://docs.cortexdocs.dev)
- [Live demo](https://demo.cortexdocs.dev)
