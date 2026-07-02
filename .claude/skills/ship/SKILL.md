---
name: ship
description: Build, commit, push, and verify a Roll Call deploy — typecheck, vite build, commit with this repo's conventions, push with retry to main and the working branch, then poll gh-pages until the new commit is live. Use to publish any change.
---

# Ship a change

The exact release sequence for this repo. GitHub Pages deploys from a workflow
that triggers ONLY on pushes to `main` (`.github/workflows/deploy.yml` →
`gh-pages` branch via peaceiris).

## 1. Verify before committing

```bash
npx tsc --noEmit          # must be clean
npx vite build            # dist/ is committed in this repo — build BEFORE commit
```

If the change is visual, screenshot the affected page from `dist` first
(see the site-review skill for the playwright recipe).

## 2. Commit conventions

- `git add -A` then commit with an imperative subject + wrapped body
  explaining what and why.
- Do NOT add `Co-Authored-By` or `Claude-Session` trailers, and never put a
  model identifier in commits — repo owner's standing rule.

## 3. Push with retry, to BOTH branches

Pushes go through the sandbox proxy; transient failures happen. Retry with
backoff. The working branch `claude/repo-editing-k2sn4r` is kept in lockstep
with `main`.

```bash
REMOTE=$(git remote get-url origin)   # or an authenticated https URL if provided this session
for i in 1 2 3 4; do
  GIT_SSL_CAINFO=/root/.ccr/ca-bundle.crt git push "$REMOTE" main && break || sleep $((2**i))
done
git branch -f claude/repo-editing-k2sn4r main
for i in 1 2 3 4; do
  GIT_SSL_CAINFO=/root/.ccr/ca-bundle.crt git push "$REMOTE" claude/repo-editing-k2sn4r && break || sleep $((2**i))
done
git update-ref refs/remotes/origin/main main   # keeps the stop-hook quiet
```

Never embed credentials in files or output; if a token is used it lives only
in the session, and the user should be reminded to revoke it when work ends.

## 4. Confirm the deploy actually landed

The gh-pages deploy commit message is `deploy: <full-sha>`. Poll until it
references the commit just pushed (typically 60–90 s):

```bash
until GIT_SSL_CAINFO=/root/.ccr/ca-bundle.crt git fetch "$REMOTE" gh-pages >/dev/null 2>&1 \
  && git log -1 --format="%s" FETCH_HEAD | grep -q "$(git rev-parse HEAD)"; do sleep 5; done
echo "DEPLOYED: $(git log -1 --format='%ci %s' FETCH_HEAD)"
```

Note: `https://hydrogenbondss.github.io/Rollcall/` is not reachable from the
sandbox (proxy allowlist) — verify via the gh-pages ref as above, never by
curling the live URL. Report the deployed commit to the user; if the user
uploaded files as part of the change, `git merge --ff-only origin/main` BEFORE
committing local work so histories don't diverge.
