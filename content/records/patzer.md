---
name: Patzer
repoUrl: https://github.com/SikamikanikoBG/patzer
category: games
stack: react
description: "Self-hosted Chess.com alternative: game review for your Chess.com and Lichess games, play vs Stockfish or a friend, AI coach on your own Ollama or vLLM, in one Docker container."
platforms:
  - web
tags:
  - chess
  - self-hosted
  - stockfish
  - ai-coach
bestFor:
  - "A family or homelab that wants a private, ad-free Chess.com: review your games, play a bot or a friend, and get coaching from your own local LLM."
whyListed:
  - "A complete self-hosted Chess.com alternative in one Docker container: game review of Chess.com and Lichess games (or pasted PGN) with bundled Stockfish, play vs bot or a friend in real time, and an AI coach on your own Ollama/vLLM."
  - "The LLM never analyses — the server computes the facts (what a move allows, hangs or wins, your recurring mistakes) and the model only turns them into coaching, so a small local model is enough and a hallucinated piece is impossible."
  - "Family-ready: multi-user with an admin console, per-profile language, kid mode and piece names for the youngest; English-first with Bulgarian, Spanish, German and Russian out of the box."
caveats:
  - "41 stars as of 2026-10-17 (below the 50-star guideline): exception requested — actively maintained (v7.18.1, pushed 2026-10-16), MIT-licensed, Docker one-click, five languages, and a distinctive 'LLM never analyses' design that makes local AI coaching reliable."
addedAt: 2026-10-17
submittedBy: SikamikanikoBG
---

## Why it's listed

A self-hosted, MIT-licensed alternative to Chess.com that runs in a single Docker container on a Pi, NAS or old laptop. Game review pulls your public Chess.com or Lichess games (or a pasted PGN) and classifies every move with bundled Stockfish — brilliant to blunder — plus accuracy, estimated Elo and an eval graph.

Play against Stockfish at seven named tiers, or play a friend in real time over WebSocket with draw offers, takebacks and one-click rematch. Point the AI coach at your own Ollama or vLLM host: it explains why a move works or fails and connects mistakes to your recent games, without ever contradicting the engine.

Family-ready: multi-user with an admin console, per-profile language, kid mode and piece names for the youngest. English-first, with Bulgarian, Spanish, German and Russian out of the box.
