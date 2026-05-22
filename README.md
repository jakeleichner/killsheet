# KillSheet — Project Handoff

Context document for continuing development. Read this first.

---

## What KillSheet is

A single-file web app that acts as a companion for **Kill Team** (Games Workshop's tabletop skirmish game). It's a practical tool used *during* games: build a roster, reference rules, track wounds/command points/turning points, roll dice, and play against an opponent over a peer-to-peer connection. Tagline: **"Build • Play • Track • Conquer."**

The name and branding were deliberately kept generic ("KillSheet," not "Kill Team Companion") to avoid Games Workshop trademark issues. The app references GW game mechanics and stats (which are rules, not protected expression) but uses no GW logos, names-as-branding, artwork, or lore text.

**Current factions implemented:** Angels of Death (Space Marines), Ork Kommandos, Plague Marines. The data shape is well-tested across these three; adding more is data-entry work against official PDFs.

---

## Tech stack & architecture

- **Single HTML file.** Everything — markup, styles, all React components, all game data — lives in one file (`killsheet.html`, ~3,900 lines, ~308 KB). There is **no build step** and **no toolchain**.
- **React 18 + Babel Standalone**, both loaded from CDN. JSX is transpiled in-browser at runtime via `<script type="text/babel">`. This is why there's no build process — the browser compiles the JSX on load.
- **PeerJS 1.5.4** (CDN) for peer-to-peer multiplayer over WebRTC.
- **Persistence** via `localStorage`, wrapped in a custom `useLocalStorage` hook. ~28 state values persist across reloads under the `ks_` key prefix.
- **No backend currently exists.** The app is 100% client-side static. (This changes with the Community Rosters feature — see "Work queue.")

### File structure (top to bottom)
1. `<head>` — meta, `<style>` block (global CSS + mobile media query), Google Fonts links (Rajdhani + Inter for the v2 design; Cinzel still loaded but now unused outside legacy spots), CDN script tags.
2. Game data constants — `WR` (weapon rules dictionary), `CORE_CONCEPTS`, `CORE_ACTIONS`, `UNIV_EQUIP` (builder equipment selection list), `UNIV_EQUIPMENT` (rules-tab equipment reference), `FACTIONS` (the big one — all operatives, weapons, abilities, ploys, composition rules per faction).
3. Design system tokens — `DS` object (palette + fonts), style helper functions (`cd`, `mu`, `h3`, `dv`, `pl`, `bg()`, `bs()`).
4. Hooks & utilities — `useLocalStorage`, `useIsMobile`, `clearKillSheetStorage`, multiplayer hook, dice helpers.
5. Components — `Datacard`, `WeaponBox`, `DiceRoller`, `Tip`, `RuleCard`, `Builder` (the largest), `Rules`, `Tutorial`, `CommunityRosters` (placeholder), `App`.
6. `TAB_ICONS` const (base64 PNG icons for nav tabs) — **sits right before `App`**, watch out for this (see Gotchas).
7. `App` — top-level: holds `tab` and `tp` state, the multiplayer hook, renders header/nav/tab-content.
8. Final `ReactDOM` render call.

---

## Hosting & deployment

- **Live at:** `https://killsheet.pages.dev` (Cloudflare Pages, free tier, no card).
- **Deploy method:** Direct upload. The file must be named `index.html`, zipped or in a folder, then dragged into the Cloudflare Pages dashboard ("Create deployment").
- **Cache:** Browsers cache aggressively. After deploying, a hard refresh (Cmd/Ctrl+Shift+R) is needed to see changes.
- **Rollback:** Every deployment is retained; you can roll back to any prior one from the dashboard.
- The owner is non-technical for HTML purposes — they rely on the dev (you) to produce the file; they handle the drag-and-drop deploy.

---

## Design system (v2)

A full visual redesign was completed recently. The app moved from a gold-gilded, Cinzel-serif "grimdark" look to a cleaner industrial-tactical aesthetic. **40K flavor level target: 6-7 out of 10** — visibly themed but with modern UI discipline.

### Palette (the `DS` object is the source of truth)
- Backgrounds: `#0E0F13` base, `#1A1D24` card, `#262A33` elevated, `#3A4150` divider/hairline
- Text: `#F1F2F5` primary, `#9AA5B1` secondary, `#5A6470` tertiary
- Accents: `#C9772E` **rust** (primary accent — replaced gold-as-decoration), `#FFB627` **gold** (reserved for signal moments only — see note), `#B8341C` **threat/damage**, `#3D6B3F` **success/health**
- Faction colors (UI-tuned, live in `FACTIONS[].color`): Angels `#3B6FD4`, Kommandos `#5A9C3A`, Plague Marines `#848A66`

### Typography
- **Rajdhani** (display) — headers, buttons, datacard names, stat numbers, labels. Condensed, angular, tactical.
- **Inter** (body) — descriptions, weapon rules, paragraphs.
- Type scale floor is 11px (no 8/9px text anywhere). Datacard stats are 26-28px (bold 4-up block). Body 13-14px.

### Key design principles in force
- Cards use elevation (lighter fill on darker bg) + a 3px **faction-color left-edge stripe**, not heavy borders.
- **Faction color cascades through the Builder** once a faction is selected — operative card stripes, etc. The opponent's datacards use *their* faction color (not a hardcoded enemy red), which matters in multiplayer.
- Hairline dividers (`#3A4150`, 1px) inside cards instead of boxes-within-boxes.
- 8px spacing base; 6px corner radius; 44px min tap targets on mobile.

### Logo / brand
A proper logo package exists (targeting reticle mark + "KILLSHEET" wordmark, rust + white on dark). Variants: app icon, horizontal lockup, stacked lockup, mark-only SVG, favicon. **These are NOT yet wired into the app** — the header still uses an older embedded base64 logo. Wiring in the new logo package (header lockup + favicon + apple-touch-icon) is an open task.

### IMPORTANT design caveat
The gold→rust bulk swap was done globally outside the (now-deleted) Sequence component. As a side effect, **CP/VP/TP indicators are currently rust like everything else** — but these are genuinely "look here" signal moments that should arguably be gold (`#FFB627`). Re-introducing selective gold for scoring/turn indicators is a known pending polish item.

---

## Feature inventory (what's built and working)

**Army Builder**
- Faction selection, operative selection with composition validation (count limits, unique vs unlimited operatives, half-slot logic for Bomb Squig + Grot, mandatory leader).
- Per-operative weapon options (dropdowns), including full Angels of Death options (plasma pistols, all bolt-rifle modes, etc.).
- Faction equipment + universal equipment selection (all 12 universal options selectable; equipment count enforced, default 3).
- Equipment effects are data-driven via a `mod` field: `remove_range` (Kommando Collapsible Stocks), `poison_bolts` (Plague Rounds), `ignore_injured` (Plague Bells). All three are handled in the effect-application logic.
- Roster lock/unlock. Import/export via base64 codes (own roster vs opponent roster).
- Datacards: v2 design, bold 4-up stat block, interactive wound counter (+/−), activation toggle, injured/incapacitated states, collapse/expand, equipment effects surfaced.

**Rules reference** (Rules tab) — Core concepts, actions, terrain, movement, visibility, weapon rules, shooting, fighting, equipment (all 13 universal equipment entries documented), glossary. Sourced from official GW PDFs.

**Tutorial** — step-by-step interactive walkthrough of a turning point against a bot, with real dice rolls.

**Dice Roller** — opens from any weapon row. Rolls attack/defence, handles crits, command re-roll (costs CP). Auto-detects and applies/annotates weapon rules: Lethal, Accurate, Balanced, Ceaseless, Relentless, Severe, Rending, Punishing, Brutal, Saturate, Devastating (mechanical bonus damage), Piercing, Piercing Crits, Hot (auto self-damage), Stun, Poison, Toxic, Limited 1 (informational). Computes a FINAL DMG estimate accounting for crit/normal blocking and pair-blocks. "Apply to target" button opens a picker (both teams) and deducts wounds.

**Game tracking** — CP/VP/TP, large fonts, command point auto-gain on turning point advance, ploy usage tracking, combat doctrine, initiative toggle.

**Multiplayer (PeerJS)** — 6-char room codes (`KS-` prefix). Host/join. Each player owns their roster and broadcasts it; opponent's roster appears live (including live edits, even from an empty starting roster). Shared state (turning point, initiative) syncs last-write-wins; CP/VP intentionally NOT synced (each player tracks their own). Wound sync is bidirectional with remote-apply messages. In-modal chat (50 messages, 500-char limit). Connection banner visible across all tabs. ICE config has 4 STUN servers + ExpressTURN TURN relay (UDP/TCP/TCP-443) for NAT traversal.

**Print system** — generates physical-style datacards + a reference sheet.

**Persistence** — game state survives reload. "Wipe all saved data" button on the setup screen.

---

## Known issues / bugs

| Severity | Where | Status |
|---|---|---|
| High | Builder "Begin Roster Building" → React error #310 (hooks-after-early-return) | ✅ Fixed |
| Medium | Multiplayer "Negotiation failed" on some networks (symmetric NAT) | 🟡 Mitigated with ExpressTURN; deeply restrictive networks may still fail — fallback is import/export codes |
| Medium | Multiplayer dropped empty-roster sync (couldn't see opponent until they added an op) | ✅ Fixed |
| High | Preview/Community tab invisible (missing TAB_ICONS entry) | ✅ Fixed |

### Limitations (intentional / documented, not bugs)
- Limited 1 weapons: informational only, not usage-tracked.
- CP/VP and tac-op picks not synced in multiplayer (private per player).
- WebRTC may fail on ~15% of restrictive networks.
- Closing a tab disconnects multiplayer (no auto-reconnect path).
- Killzone selector is cosmetic (doesn't apply terrain rules).
- Mission scoring is manual (no enforced primary/tac-op effects).

---

## Critical conventions & gotchas

These will bite you if you don't know them:

1. **No build step. Validate by parsing.** Before shipping any change, extract the `<script type="text/babel">` content and parse it with `@babel/parser` (JSX plugin) to catch syntax errors. A clean parse does NOT guarantee runtime correctness — see #2.

2. **Rules of Hooks violations don't show up at parse time.** They only crash at runtime (React error #310 = "rendered more hooks than previous render"). The classic trap here: the `Builder` component has an early `if (!gameConfig) return ...` for the setup screen. **ALL hooks (useState/useEffect/useLocalStorage/useRef) must be declared BEFORE that early return.** This already caused a production crash once. When adding hooks to Builder, put them up top.

3. **TAB_ICONS must have an entry for every tab id.** The nav renders `<img src={TAB_ICONS[id]}>`. A missing entry = broken/invisible tab. There's no runtime guard. (This bit us twice — once with a Preview tab, once when the Sequence deletion accidentally ate the whole TAB_ICONS const because it sat between the Sequence component and App.)

4. **The Sequence tab/component was deleted.** Replaced by `CommunityRosters`. A migration guard in `App` bounces any user whose persisted `tab === "sequence"` to "builder". Don't reintroduce Sequence.

5. **Bulk edits via Python, scoped carefully.** The palette/font sweeps were done with Python string replacement on the file. When doing this, be careful about substring collisions (e.g. replacing `#FFD700` also correctly transforms `#FFD70010` alpha variants — verify intent). Always re-parse after.

6. **localStorage keys are prefixed `ks_` and must be unique.** Managed through `useLocalStorage` — don't call `localStorage` directly except in that hook and `clearKillSheetStorage`.

7. **ExpressTURN credentials are hardcoded in the file** (public, accepted tradeoff). 1000 GB/month free tier. If abused, regenerate at expressturn.com and replace in the `ICE_CONFIG` object. Username `000000002093370707`, server `free.expressturn.com`.

8. **Print uses a `datacard-print` className.** Preserve it when editing Datacard.

---

## Work queue (what's left to do)

### Immediate / next session: Community Rosters backend
The Community Rosters tab is currently a **visual placeholder only** (a "coming soon" mock). The feature: visitors post a named roster, organized by faction, others upvote/downvote and browse. This requires a backend (the app currently has none).

Planned implementation:
1. **Cloudflare D1** (SQLite) database — same Cloudflare account as Pages. Free tier ample.
2. Schema: `rosters` table (id, name, faction_id, payload_json, description, created_at, anon_id) + `votes` table (roster_id, anon_id, direction, unique constraint on roster_id+anon_id).
3. **Cloudflare Worker** exposing: `GET /api/rosters?faction=X&sort=top|new`, `POST /api/rosters`, `POST /api/rosters/:id/vote`, `DELETE /api/rosters/:id`.
4. Wire the `CommunityRosters` component to fetch/post against the Worker. Replace the placeholder mock cards with live data.
5. Add a "Post to Community" action in the Builder (when a roster is locked) that serializes the roster (reuse the existing base64 export logic) and POSTs it.
6. **Identity:** anonymous browser-based ID stored in localStorage (`ks_anon_id`). Used for vote dedup and post ownership/deletion. Not bulletproof (multi-device = multi-vote) but fine for a hobby tool.
7. **Moderation:** at minimum a profanity filter on names/descriptions; consider a simple report flag. Owner is OK seeding the first 5-10 example rosters to avoid an empty-board cold start.
8. Sort default: "Top" (net votes); also "New" and "Trending" (recent + votes).

Estimated 2-3 hours. Should be its own focused session with its own QA pass (mixing infra + UI changes tends to combine bugs confusingly).

### Other open tasks (rough priority order)
- **Wire in the new logo package** — header horizontal lockup (mark-only on mobile fallback), favicon, apple-touch-icon for installable PWA. Assets exist; not yet integrated.
- **Re-introduce selective gold** (`#FFB627`) for CP/VP/TP/ready-state signal moments (the global rust sweep flattened these).
- **Swap the Community tab icon** — currently reuses the old sequence (clock) icon; a reticle-mark version would fit the brand.
- **Minimize unselected equipment when roster is locked** — locked Builder still shows full equipment lists; should collapse to only selected items with a "Locked — N selections" header. Touch points around the FACTION EQUIPMENT / UNIVERSAL EQUIPMENT render in Builder.
- **Mobile check on the longer "Community Rosters" tab label** — may need to shorten to "Community" on mobile.
- Add automated pre-ship checks for: hooks-after-early-return pattern, and "every tab id has a TAB_ICONS entry."

### Lower-priority backlog
- Roll history/log in the dice roller (last 5-10 rolls).
- Limited 1 actual per-operative usage tracking.
- More factions (data entry against official PDFs).
- Functional mission scoring (primary objectives, tac-op tracking).
- Make killzone rules functional (currently cosmetic).
- Multiplayer reconnect path.
- Verify mp.send() under heavy load (race conditions / double-fires).

---

## QA approach

A running QA checklist exists (`QA_CHECKLIST.md`) covering automated checks (parse, key uniqueness, hook conventions, mod handling, tag balance) and manual checks (multiplayer end-to-end needs two browsers; persistence needs reload testing; dice roller has a per-weapon-rule test matrix; mobile needs real-device testing). Multiplayer and persistence are the highest-risk areas to re-test after any change to App-level state or the PeerJS hook. The whole thing should be treated as a living document — add tests as features ship, log bugs as found.

The big honest caveat: automated checks confirm the code parses and is internally consistent. They cannot confirm React rendering correctness, event wiring, layout, or anything network-dependent. Those require a real browser and, for multiplayer, two of them.

