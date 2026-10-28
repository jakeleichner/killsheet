# KillSheet — notes for Claude

Read `README.md` first: it has the project context, design system, gotchas, and the work queue (to-do list).

## Workflow
- The owner is non-technical. Explain things plainly and drive the work.
- Commit and push straight to `main`. No feature branches or PRs.
- Keep the README's "Work queue" current: remove items as they're finished.
- `gh` is at `/opt/homebrew/bin/gh` (Homebrew isn't on Claude's shell PATH).
- Text shown in the app is US English (color, defense, behavior); `tools/check.py` flags British spellings, and `tools/us_spelling.py` has the list. Team names stay as Games Workshop prints them.
- Text shown in the app must read like a person wrote it: no em dashes, no hype ("extremely powerful", "game-changer"), no filler ("This means", "Essentially"), no tacked-on slogans ("Make it count."), no ALL-CAPS emphasis. Plain, direct rules language.

## Before every push
1. Run `python3 tools/check.py`. It must end with "All checks passed." It catches hooks after an early return (React #310 crash), tabs missing an icon or panel, duplicate/direct localStorage use, a missing print class or JSX script tag, British spellings, and JavaScript that doesn't compile (a blank page).
2. Load the change in the preview and check the console for errors (runtime errors only show up there).
3. Run the self-test: load the preview with `?selftest` (e.g. `http://localhost:3456/?selftest`). It clicks through every tab, all mission packs and maps, all 48 teams (build, start, end game), backup and a campaign round, then shows a PASS/FAIL panel. Results are also in `window.__ksSelfTest`. It saves the browser's KillSheet data first and puts it back after (saving is frozen until reload, so the test game can't overwrite it). Extend `runSelfTest` when you add a feature.

## Previewing changes
The repo lives in iCloud Drive, which the sandboxed Python server can't read. To preview:
1. Copy `killsheet.html` to `/tmp/killsheet-preview/index.html`. Also copy `maps/`, `icons/` and `manifest.webmanifest` into `/tmp/killsheet-preview/` (the Missions tab loads its map images from there).
2. Serve that folder with `python3 -m http.server 3456` (via `.claude/launch.json`).
3. Re-copy after every edit, then load a new URL (e.g. `?v=2`, `?v=3`). A plain reload can show a cached old copy.

## Deploying
Deploys are manual: the owner drags the `deploy/` folder into Cloudflare Pages (`killsheet.pages.dev`). Pushing to GitHub does not deploy.
After every push, rebuild it: `python3 tools/build_deploy.py`. That pre-compiles `killsheet.html` (with macOS's built-in `jsc` and the vendored `tools/vendor/babel.min.js`) into a fast-loading `deploy/index.html` and copies `maps/`, `icons/` and the manifest beside it, and writes `deploy/sw.js` (offline mode) from `tools/sw.js`. Never copy `killsheet.html` into `deploy/` directly: it works, but loads about 13x slower. `deploy/` is git-ignored.

## Offline mode
The service worker only runs on the live https site, or locally with `?sw=1`. To test it, serve `deploy/` (not killsheet.html), load `?sw=1`, then stop the server and reload. Unregister it in the preview browser afterwards so it doesn't serve stale files.

## Mission map diagrams
`maps/*.svg` are generated: `python3 -I tools/missions/draw_maps.py ~/Downloads <pypdf lib dir>` (about 2.5 minutes for all). Don't hand-edit them. After regenerating, open the preview with `?maps` and look at every diagram beside its original page.

## Bulk edits
Long base64 strings (TAB_ICONS, logos) are easier to replace with a Python regex script than with Edit.
