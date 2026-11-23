---
name: Quock
repoUrl: https://github.com/matteocelani/quock
projectType: real-app
category: productivity
stack: react-native
summary: An iPhone client for Ollama Cloud. Sign in with an ollama.com account, pick a cloud model
  such as Gemma, Qwen, Llama, GPT-OSS or DeepSeek, and chat with streamed replies. It supports
  thinking and web search toggles per chat, photo and PDF attachments with on-device OCR, and keeps
  chat history in a local database on the phone. Inference runs on Ollama Cloud, not on the device.
description: iPhone chat client for Ollama Cloud models, with streaming replies, web search and photo
  and PDF attachments.
sourceDescription: "Native iOS & Android client for Ollama Cloud — streaming chat, image & file
  attachments, and web search"
platforms:
  - ios
licenses:
  - mit
links:
  github: https://github.com/matteocelani/quock
  download: https://apps.apple.com/app/quock/id6785608333
distribution:
  channels:
    - type: app-store
      platform: ios
      label: App Store
      url: https://apps.apple.com/app/quock/id6785608333
tags:
  - mobile-app
  - ai-chat
  - llm-client
  - ollama
  - react-native
  - expo
bestFor:
  - Chatting with Ollama Cloud models from an iPhone.
  - Asking questions about a PDF or a screenshot on the go.
whyListed:
  - A complete React Native / Expo chat app with streaming responses, a local chat database, PDF text extraction with on-device OCR fallback and image attachments.
  - Small, focused codebase with a documented feature-first architecture in AGENTS.md and CONTRIBUTING.md.
caveats:
  - Needs an ollama.com account; inference runs on Ollama Cloud, so it does not work offline.
  - iPhone only for now; the Android build is not published yet.
  - Young project, public since June 2026. Unofficial, not affiliated with Ollama.
seo:
  title: "Quock – Open Source iPhone Client for Ollama Cloud"
  description: Quock is an open-source iPhone app for chatting with Ollama Cloud models, with streaming
    replies, web search and photo and PDF attachments. MIT.
addedAt: 2026-11-23
submittedBy: matteocelani
---

## Why it's listed

Quock is a small iPhone app I built to use Ollama Cloud models from my phone. You sign in once with an ollama.com account, tap a model and type, and the reply streams back word by word. Thinking and web search are per-chat toggles, and you can long-press a paragraph of an answer to ask a follow-up about just that part. Photos work with vision models, and PDFs are read from their text layer or with on-device OCR when there is none. Chat history stays in a local database on the phone; inference runs on Ollama Cloud. It's built with React Native and Expo, MIT licensed, and free on the App Store.
