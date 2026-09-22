# LoopTroop

LoopTroop is an open-source coding agent orchestrator that runs AI coding sessions inside isolated Git worktrees, uses multi-model councils for planning, and requires human approval before branch changes merge.

## What it does

Most coding agent tools run directly in the user's primary working directory and rely on a single model to plan and write code. LoopTroop changes that workflow in three ways:

1. **Multi-model planning councils.** Before writing code, the system can query several models (such as Claude, GPT-4o, Gemini, or local models via Ollama) to draft competing implementation plans. The models review each other's proposals, identify blind spots, and produce a refined plan.
2. **Isolated Git worktrees.** Each agent task executes in its own `git worktree`. Agents can install dependencies, run builds, and experiment with changes without dirtying the active checkout.
3. **Bounded feedback loops.** When an agent finishes edits, test runners and linters verify the build. If tests fail, the diagnostic logs are piped back to the agent in a bounded retry cycle (the "Ralph loop") until the task succeeds or hits a defined turn limit.
4. **Human approval gates.** Diffs, test results, and model rationales are shown in a web dashboard. Users review and approve changes before any code is committed or merged upstream.

## Architecture and codebase

The repository is structured as a full-stack TypeScript application:

- **Frontend:** Built with React 19, Vite, and Tailwind CSS. It provides a real-time dashboard for task queues, model council transcripts, diff inspections, and configuration.
- **Backend:** An Express server on Node.js that manages agent child processes, coordinates CLI tools, and supervises Git worktrees.
- **Data store:** A local SQLite database queried through Drizzle ORM, keeping task states, execution logs, and council deliberations on disk.
- **Agent runner:** Pluggable runners support coding agent CLIs (like OpenCode and Claude Code) as well as direct provider API calls.

## Caveats

- **API keys required:** LoopTroop orchestrates models; users supply their own API keys or configure local endpoints through tools like Ollama or vLLM.
- **Pre-1.0 velocity:** The codebase is in active 0.5.x development, with frequent updates to runner protocols and UI components.
- **System requirements:** Requires Node.js 20 or newer, Git 2.20+ (for worktree support), and adequate disk space for parallel worktree checkouts.

## Links

- [GitHub repository](https://github.com/looptroop-ai/LoopTroop)
- [Official website](https://www.looptroop.ovh)
- [Documentation](https://www.looptroop.ovh/docs/core-philosophy)
