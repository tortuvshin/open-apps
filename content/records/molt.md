# molt

molt is an open-source coding agent for developers. It has a terminal UI and an Electron desktop app, supports OpenAI-compatible and Anthropic providers, and refuses to accept “done” until checks pass against the real state on disk.

## What makes it different

Every write is recorded with before-and-after hashes. Each attempt produces a receipt, including refusals, and the journal is hash-chained so it can be recomputed with `molt verify`. A project’s `.molt/done.yml` defines the bar: tests, type checks, coverage, mutation checks, or other commands and built-ins.

## Links

- [GitHub repository](https://github.com/solvyxtech/molt)
- [Project page](https://solvyx.xyz/work/molt)
- [npm package](https://www.npmjs.com/package/@solvyx/molt)
