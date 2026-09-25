Orbit is a keyboard-first web application for issues, boards, projects, sprints, documents and files. Teams can use the free hosted application or inspect and run the Apache-2.0 source.

The application combines a Next.js interface with workspace packages for shared policy, realtime updates and MCP tools. It is useful for studying server-enforced permissions, typed application boundaries and collaborative task workflows.

AI clients connect to [the hosted MCP endpoint](https://orbit.noveum.ai/mcp) over Streamable HTTP with workspace-scoped OAuth. The [GitHub repository](https://github.com/Noveum/orbit) contains the complete application; its URL is not an MCP connection target.

Self-hosting is still in preview. The Docker path requires PostgreSQL, Redis and S3-compatible object storage, plus the application services. Operators need to configure public origins, backups and email delivery and validate their chosen provider. See the [documentation](https://orbit.noveum.ai/docs) for setup and current limitations.
