# KillSheet — notes for Claude

Read `README.md` first: it has the project context, design system, gotchas, and the work queue (to-do list).

## Workflow
- The owner is non-technical. Explain things plainly and drive the work.
- Commit and push straight to `main`. No feature branches or PRs.
- Keep the README's "Work queue" current: remove items as they're finished.
- `gh` is at `/opt/homebrew/bin/gh` (Homebrew isn't on Claude's shell PATH).

## Before every push
1. Run `python3 tools/check.py`. It must end with "All checks passed." It catches hooks after an early return (React #310 crash), tabs missing an icon or panel, duplicate/direct localStorage use, and a missing print class or JSX script tag.
2. Load the change in the preview and check the console for errors. The checker doesn't parse JavaScript, so syntax errors only show up there.

## Previewing changes
The repo lives in iCloud Drive, which the sandboxed Python server can't read. To preview:
1. Copy `killsheet.html` to `/tmp/killsheet-preview/index.html`.
2. Serve that folder with `python3 -m http.server 3456` (via `.claude/launch.json`).
3. Re-copy after every edit, then load a new URL (e.g. `?v=2`, `?v=3`). A plain reload can show a cached old copy.

## Deploying
Deploys are manual: the owner drags the `deploy/` folder into Cloudflare Pages (`killsheet.pages.dev`). Pushing to GitHub does not deploy.
After every push, refresh it: `cp killsheet.html deploy/index.html`. `deploy/` is git-ignored.

## Bulk edits
Long base64 strings (TAB_ICONS, logos) are easier to replace with a Python regex script than with Edit.
