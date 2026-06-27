# GitHub Repo Audit

Use this skill when you need to inspect a GitHub repository for issues, PRs, file contents, or commit history while working on a project.

## When to use

- The user gives you a GitHub URL and a personal access token.
- You need to check the remote repo for open issues, recent commits, or file versions.
- You want to compare local files against the remote default branch.

## How to use

1. Read the token from the user's message or from the `GITHUB_TOKEN` environment variable.
2. Make authenticated calls to `https://api.github.com` with the token in the `Authorization` header.
3. Do **not** write the token literal into config files. Use `bearerTokenEnvVar: "GITHUB_TOKEN"` if configuring an MCP server.

## Common curl patterns

```bash
export GITHUB_TOKEN="ghp_xxxx"

# List issues (open + closed)
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/{owner}/{repo}/issues?state=all&per_page=30"

# Get a file's content from the default branch
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/{owner}/{repo}/contents/{path}"

# Get commit history for a path
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/{owner}/{repo}/commits?path={path}&per_page=10"
```

## MCP server config (optional)

For repeated use, add to the project-root `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

Tell the user to set `GITHUB_TOKEN` in their shell/environment; the literal token must not be saved in `mcp.json`.
