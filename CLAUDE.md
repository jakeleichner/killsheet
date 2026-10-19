# KillSheet — notes for Claude

Read `README.md` first: it has the project context, design system, gotchas, and the work queue (to-do list).

## Workflow
- The owner is non-technical. Explain things plainly and drive the work.
- Commit and push straight to `main`. No feature branches or PRs.
- Keep the README's "Work queue" current: remove items as they're finished.
- `gh` is at `/opt/homebrew/bin/gh` (Homebrew isn't on Claude's shell PATH).

## Previewing changes
The repo lives in iCloud Drive, which the sandboxed Python server can't read. To preview:
1. Copy `killsheet.html` to `/tmp/killsheet-preview/index.html`.
2. Serve that folder with `python3 -m http.server 3456` (via `.claude/launch.json`).
3. Re-copy after every edit, then load a new URL (e.g. `?v=2`, `?v=3`). A plain reload can show a cached old copy.

## Deploying
Deploys are manual: the owner renames `killsheet.html` to `index.html` and drags it into Cloudflare Pages (`killsheet.pages.dev`). Pushing to GitHub does not deploy.

## Bulk edits
Long base64 strings (TAB_ICONS, logos) are easier to replace with a Python regex script than with Edit.
