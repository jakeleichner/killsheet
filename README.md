# KillSheet — Project Handoff

Context document for continuing development. Read this first.

---

## What KillSheet is

A single-file web app that acts as a companion for **Kill Team** (Games Workshop's tabletop skirmish game). It's a practical tool used *during* games: build a roster, reference rules, track wounds/command points/turning points, roll dice, and play against an opponent over a peer-to-peer connection. Tagline: **"Build • Play • Track • Conquer."**

The name and branding were deliberately kept generic ("KillSheet," not "Kill Team Companion") to avoid Games Workshop trademark issues. The app references GW game mechanics and stats (which are rules, not protected expression) but uses no GW logos, names-as-branding, artwork, or lore text.

**Current factions implemented:** 48 teams, every kill team on Warhammer Community's downloads page (Ctesiphus Expedition, filed alongside them, is a map-based campaign system, not a team). See `FACTIONS` in `killsheet.html`. The Builder's team picker sorts teams A-Z under three tabs (Imperium, Chaos, Xenos, set by each team's badge in `IMPERIUM_BADGES` / `CHAOS_BADGES`) with a search box, and shrinks to a one-line bar once a team is picked. Search matches team name, badge, group (Imperium/Chaos/Xenos) and the nicknames in `BADGE_SEARCH_WORDS` / `TEAM_SEARCH_WORDS` (e.g. "space marine", "imperial guard", "tau", "nurgle"); add new teams' nicknames there. All teams were entered from the official online rules PDFs (Aug '26 errata); Angels of Death, Kommandos and Plague Marines were re-entered from their newer PDFs. Inquisitorial Agents has all six requisition groups. Abilities, ploys and equipment are condensed summaries, not GW's full text. Operatives with a weapon choice ("with one of the following options") are separate entries, e.g. "Navis Gunner (meltagun)", so caps like "max 2 Gunners" can be enforced.

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
- **Build:** run `python3 tools/build_deploy.py` to make `deploy/` (pre-compiled page + maps). Don't copy `killsheet.html` there by hand.
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
The logo is a die showing five with a crosshair for the centre pip, beside a "KILLSHEET" wordmark in Rajdhani Bold (KILL in white, SHEET in rust #C9772E), on dark. It's drawn in code by the `Logo` component (`<Logo size={...} />`; below 28px it drops the crosshair ticks). Icons live in `icons/`: `favicon.svg` (the source, also inlined as the SVG favicon in `<head>`), `favicon-32.png`, `apple-touch-icon.svg` and `apple-touch-icon.png` (180px). `tools/build_deploy.py` copies `icons/` into `deploy/`. To redraw the PNGs after editing an SVG: `qlmanage -t -s 180 -o <dir> icons/apple-touch-icon.svg` (and `-s 128` for the favicon, then `sips -z 32 32`). Avoid Games Workshop marks (aquila, their skulls, Kill Team lettering).

### IMPORTANT design caveat
The gold→rust bulk swap was done globally, which flattened the "look here" signal moments to rust. Gold (`#FFB627`) has since been restored for the TURNING POINT label, active TP box, and COMMAND POINTS label/value. VP panels stay green (you) / red (opponent) on purpose.

---

## Feature inventory (what's built and working)

**Army Builder**
- Faction selection, operative selection with composition validation (count limits, unique vs unlimited operatives, half-slot logic for Bomb Squig + Grot, mandatory leader).
- Per-operative weapon options (dropdowns), including full Angels of Death options (plasma pistols, all bolt-rifle modes, etc.).
- Faction equipment + universal equipment selection (all 12 universal options selectable; equipment count enforced, default 3).
- Equipment effects are data-driven via a `mod` field: `remove_range` (Kommando Collapsible Stocks), `poison_bolts` (Plague Rounds), `ignore_injured` (Plague Bells). All three are handled in the effect-application logic.
- Roster lock/unlock. Import/export via base64 codes (own roster vs opponent roster).
- Datacards: v2 design, bold 4-up stat block, interactive wound counter (+/−), activation toggle, injured/incapacitated states, collapse/expand, equipment effects surfaced.

**Missions in the Builder**: pick a mission at Mission Setup; the game screen then shows a mission panel (how to win, plus details on tap) and, for packs with NPOs, an enemy tracker with wound counters.

**Missions** (Missions tab): Games Workshop's 12 free mission packs (40 missions): Terror on Devlan, Typhon, Tomb World, Shadowhunt, Deadly Sniper, Ambull, The Archivist, Volkus Compound, Lieutenant Titus, The Great Gun Fires, Blood and Zeal, and Killzone: Tomb World. Each pack page has its rules, enemy (NPO) datacards with behaviours, card decks with a Draw button, and map pages; each mission page has its map, rules, actions, victory conditions, an NPO activation table with Draw card / Reshuffle, and campaign next-mission links. The standard head-to-head Approved Ops missions aren't free, so they aren't included.

**Rules reference** (Rules tab): five tabs (How to Play, Moving & Terrain, Combat, Equipment, Glossary) plus a search box across everything. Every rule is a `RuleItem` card: name, one-line summary, and an arrow if it opens for more detail. Data lives in `GAME_SEQUENCE`, `CORE_CONCEPTS`, `CORE_ACTIONS`, `MOVEMENT_RULES`, `VISIBILITY_RULES`, `SHOOTING_RULES`, `FIGHTING_RULES`, `TERRAIN_TYPES`, `WR`, `UNIV_EQUIPMENT` and `GLOSSARY`, all using `{ name, tag?, summary, detail?, steps? }` (or mapped into it in `RULE_SECTIONS`). Core rules come from GW's free Kill Team Lite Rules (Jul '25) and the core rules update log (Jun '26). Markers and objectives (Pick Up Marker, Place Marker, marker control) aren't in any free GW PDF (checked the Lite rules, Approved Ops Tournament Companion and Hivestorm); they were written from the Core Book text on Wahapedia (Jun '26 version).

**Tutorial** — 11-step walkthrough of one turning point against a bot with real datacards and dice: initiative, Strategy phase, choosing an order, shooting (attack, defence, blocking), a charge, and an interactive strike-or-block fight.

**Dice Roller** — opens from any weapon row. Rolls attack/defence, handles crits, command re-roll (costs CP). Auto-detects and applies/annotates weapon rules: Lethal, Accurate, Balanced, Ceaseless, Relentless, Severe, Rending, Punishing, Brutal, Saturate, Devastating (mechanical bonus damage), Piercing, Piercing Crits, Hot (auto self-damage), Stun, Poison, Toxic, Limited 1 (informational). Computes a FINAL DMG estimate accounting for crit/normal blocking and pair-blocks. "Apply to target" button opens a picker (both teams) and deducts wounds.

**Game tracking** — CP/VP/TP, large fonts, command point auto-gain on turning point advance, ploy usage tracking, combat doctrine, initiative toggle.

**Multiplayer (PeerJS)** — 6-char room codes (`KS-` prefix). Host/join. Each player owns their roster and broadcasts it; opponent's roster appears live (including live edits, even from an empty starting roster). Shared state (turning point, initiative) syncs last-write-wins; CP/VP intentionally NOT synced (each player tracks their own). Wound sync is bidirectional with remote-apply messages. In-modal chat (50 messages, 500-char limit). Connection banner visible across all tabs. ICE config has 4 STUN servers + ExpressTURN TURN relay (UDP/TCP/TCP-443) for NAT traversal.

**Print system** — generates physical-style datacards + a reference sheet.

**Persistence** — game state survives reload. Named rosters can be saved to the device and reloaded from the team picker (no login; logins would come with the Community Rosters backend). "Wipe all saved data" button on the setup screen.

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

1. **No build step. Run `python3 tools/check.py` and validate by parsing.** Before shipping any change, extract the `<script type="text/babel">` content and parse it with `@babel/parser` (JSX plugin) to catch syntax errors. A clean parse does NOT guarantee runtime correctness — see #2.

2. **Rules of Hooks violations don't show up at parse time.** They only crash at runtime (React error #310 = "rendered more hooks than previous render"). The classic trap here: the `Builder` component has an early `if (!gameConfig) return ...` for the setup screen. **ALL hooks (useState/useEffect/useLocalStorage/useRef) must be declared BEFORE that early return.** This already caused a production crash once. When adding hooks to Builder, put them up top.

3. **TAB_ICONS must have an entry for every tab id.** The nav renders `<img src={TAB_ICONS[id]}>`. A missing entry = broken/invisible tab. There's no runtime guard. (This bit us twice — once with a Preview tab, once when the Sequence deletion accidentally ate the whole TAB_ICONS const because it sat between the Sequence component and App.)

4. **The Sequence tab/component was deleted.** Replaced by `CommunityRosters`. A migration guard in `App` bounces any user whose persisted `tab === "sequence"` to "builder". Don't reintroduce Sequence.

5. **Bulk edits via Python, scoped carefully.** The palette/font sweeps were done with Python string replacement on the file. When doing this, be careful about substring collisions (e.g. replacing `#FFD700` also correctly transforms `#FFD70010` alpha variants — verify intent). Always re-parse after.

6. **localStorage keys are prefixed `ks_` and must be unique.** Managed through `useLocalStorage` — don't call `localStorage` directly except in that hook and `clearKillSheetStorage`.

7. **ExpressTURN credentials are hardcoded in the file** (public, accepted tradeoff). 1000 GB/month free tier. If abused, regenerate at expressturn.com and replace in the `ICE_CONFIG` object. Username `000000002093370707`, server `free.expressturn.com`.

8. **Print uses a `datacard-print` className.** Preserve it when editing Datacard.

9. **Repeat operatives are numbered copies.** Taking an operative twice adds a copy whose `id` is `base~2` (name "Kommando Boy 2") with `baseId: "base"`. Wounds, activation, collapse and multiplayer all key on `id`, so each copy is tracked separately. Anything that needs the datacard's identity (composition rules, equipment `ex` lists, export codes) must use `baseOf(op)`, not `op.id`. Roster codes store base ids; `makeInstances()` rebuilds the copies on import.

10. **Team-building rules live in `composition`** (see the comment above `baseOf` for the full shape): `groups` (required/optional pick groups, optionally gated by a faction equipment id), `repeatable`, `maxCount`, `caps` (combined limits like "max 2 Gunners"), `requires` ("X needs Y"), and `cost` (½ or ×2 selections). `compCheck()` / `compCanAdd()` enforce them.

11. **Team data is generated.** Don't hand-edit the `FACTIONS` block. Each team lives in `tools/teams/<team>.py` (a `TEAM` dict); `tools/teams/ORDER.txt` sets the picker order (Deathwatch last). Run `python3 tools/teams/build.py killsheet.html` to rewrite `FACTIONS`. The build validates ids, groups, caps and stat formats, and checks every weapon's ranged/melee type against `tools/text/<source>.wtypes.json` (read from the PDF's weapon icons).
12. **Mission data is generated too.** Don't hand-edit the `MISSION_PACKS` block (between the `MISSION_PACKS:BEGIN/END` markers). Each pack lives in `tools/missions/<pack>.py` (a `PACK` dict built with the helpers in `_lib.py`); `ORDER.txt` sets the order. Run `python3 tools/missions/build.py killsheet.html`. Map images are whole PDF pages in `maps/<pack>-pNN.jpg`, made by `tools/missions/render_maps.py` from GW's PDFs (needs pypdf and macOS `sips`). The `Missions` component itself is normal hand-written code.

13. **How team text is written.** Full sentences that a player can read once at the table, as short as the rule allows. Keep the "Name: text" shape for abilities (the datacard bolds the part before the colon, and `STRATEGY_HINT` reads it). Keep `Loadout:` at the start of loadout lines. Write "once per battle" only for single-use rules: `isOncePerBattle` adds a single "used" box for those, and skips "once per battle each", "each option/ploy/weapon once per battle" and "for each". "Each operative once per battle" on a ploy gives one chip per operative. Use the game's own terms (APL, CP, D6, Normal Dmg, Critical Dmg, kill op, tac op, control range, Conceal/Engage order) and spell the rest out: no slashes, "+" for "and", "TP", "dmg", "crit" or "max". `{}` and `{x}` in a few team files are template slots; keep them.

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

### Done recently
- Install on phone and offline mode: `manifest.webmanifest` (name, standalone display, 192 and 512px icons) and a service worker. `tools/build_deploy.py` writes `deploy/sw.js` from `tools/sw.js`, filling in the file list (the page, manifest, icons, all maps, React, ReactDOM, PeerJS, and the Google Fonts stylesheets plus the font files they point to) and a version hash that changes every build, so phones pick up updates. The page is network-first (updates arrive when online, the saved copy is used offline); everything else is cache-first. PeerJS signalling isn't intercepted. The worker only registers on https, or locally with `?sw=1` for testing: serve `deploy/` (not killsheet.html), load `?sw=1`, stop the server and reload. Afterwards unregister it in the browser (`navigator.serviceWorker.getRegistrations()` then `unregister()`, and delete caches) so it doesn't serve stale files during development. The game menu shows "Install app" when Chrome offers it, and "Add to Home Screen" instructions on iPhone. The unused Cinzel font was removed.
- Nav tab icons are now line icons from `ICON_PATHS` (rulebook, map, swords, people), drawn with `Icon` at 18px so they take the tab's colour (rust when selected). They replace the white base64 images shown at half opacity. `TAB_ICONS` maps each tab id to an icon name. Community uses two people instead of the crosshair, which now belongs to the logo. The tab is "Community" at every width; "Community Rosters" wrapped to two lines and pulled away from its icon.
- New logo and favicon: a die showing five with a crosshair for the centre pip, plus the Rajdhani wordmark (`Logo` component), replacing the 3D image (`LOGO_SRC` removed, about 17 KB smaller). Tab icon: SVG inline in `<head>` plus `icons/favicon-32.png`; iPhone home screen: `icons/apple-touch-icon.png`. The deploy build now copies `icons/`.
- Datacards in play: Start game collapses every card (`collapseAll`). Opening a card closes the others (`toggleCardCollapse`), while collapse all and expand all still work. Collapsed cards have wound −/+ (`woundsInline`; on the name row on phones, next to the stats on desktop) and are tighter (101px on phones, keyword line hidden). APL, Move and Save stay unlabelled when collapsed, since their formats tell them apart (5+, 6", bare number).
- Battle tab decluttered (each control shows when it's useful; nothing removed). While building: no score bar, turning point guide or ploys (all appear at Start game; sticky offsets use `barH`, which is 0 while building). Universal equipment folds into one section (`showUniv`), with picked items still shown. Play online moved into the ⋯ game menu while not connected. Share code, Print and Import a roster are in a labelled ⋯ menu on the datacards bar (`cardsMenu`), and on phones the import section only shows when opened or when an opponent is loaded. "Pick weapons" is an inline link, not an orange box. Below 1000px wide the score bar uses the compact layout (`compactBar`); the full bar overflowed at laptop widths. Fixed a leftover `setTeamIntro` call on the Continue button, and `tools/check.py` now flags any `setX(...)` call with no matching definition.
- The Builder tab is now called **Battle** in the app (the code and the saved `tab` value still say `builder`). Its heading reads "Your kill team" while building and the team's name once the game starts (it said "Army Builder"; Kill Team doesn't use "army"). App text that pointed to "the Builder" now says "the Battle tab". In this README, "Builder" still means that tab.
- Tutorial moved out of the nav into Rules: a "New to Kill Team? Play the tutorial" card at the top of How to Play opens it in place (`tutorialOpen` in App, `<Tutorial onExit>` with a back button to Rules). New players see a one-time "First game?" banner on the team list (`ks_tutorialSeen`, set when they open the tutorial or close the banner). The nav is now four tabs: Rules, Missions, Builder, Community. A saved `tab` of "tutorial" opens Rules with the tutorial showing.
- Arrows unified, one shape per meaning: `Arrow` (down chevron, flips up and turns orange when open) for anything that opens in place, including datacards, Team composition, Import and the VP toggle; `Fwd` (right chevron) for going forward (Build my roster, Start game, Continue, next page or turning point); `Back` (left chevron) for going back. No typed arrow characters (› ‹ ← ▸) remain; use these components for new arrows.
- Phone fixes: the Undo bar and the green notice no longer squeeze to half the screen. They used `left: 50%` + `translateX(-50%)`, which caps a fixed box at half the viewport; they now use `left/right: 16`, `margin: 0 auto`, `width: fit-content`. Use that pattern for centred fixed boxes. Expand arrows are a 20px `chevronRight` icon (`Arrow`, also on Rules cards) instead of a 12px text triangle; collapse chevrons are 20-22px.
- Phone roster building: the Builder opens on the operative list while building (effect on `rosterLocked`/`fid` sets `mobilePanel`), so picking the first operative no longer jumps to the datacards. Nothing above the list appears or changes height mid-build: the Build roster/Datacards switch always shows while building, the turn guide only shows on phones in play mode, and the roster check sits below the list on phones (`order`). Phone rows are 52px+ with 15px names and a 22px checkbox; +/- buttons are 40px. This stopped taps landing on the row above.
- Fixed: the map viewer was stuck under the header and couldn't scroll. The fade-in animation kept a transform on each tab panel, which traps `position: fixed` overlays inside the panel. `.ks-appear` now uses `animation-fill-mode: backwards`, and the map viewer renders through `ReactDOM.createPortal` to `document.body`. Use a portal for any new full-screen overlay.
- Rules text rewrite for all 48 teams: every faction rule, ploy, equipment item, ability and composition note is now written as full sentences (about 13% longer overall, median line 91 characters). Checked unclear rules against the official PDFs. Fixed the Exodite pivot (45°, not 45 inches). Datacards show ability names in bold (`abilityText`). `isOncePerBattle` also skips multi-use wording like "each option once per battle". See convention 13.
- Plain-words pass on rules text: `tools/teams/plain_words.py` spelled out shorthand in all 48 team files (TP, Once/TP, Once/battle, dmg, vs, excl./incl., Crit Dmg, "both Dmg") and the universal equipment and sequence text. "3+ dmg: D6, on 4+ subtract 1" rules now use the official wording. Astartes rules (Angels of Death, Deathwatch, Murderwing, Plague Marines, Wolf Scouts) and Plague Marines Poison rewritten as full sentences. Dice roller notes, equipment effects and the grenade note end with periods. `isOncePerBattle` skips "once per battle each" abilities, which have several separate uses. Keep "kill op", "tac op" and "Normal/Critical Dmg": they are the game's own terms. Write new team text in full words; re-run the script if shorthand slips in.
- Team picker opens teams in place: tapping a team opens a panel right under its row (the grid uses `gridAutoFlow: "row dense"` so the rest of that row stays put), with archetypes, a box for each team rule plus Building the team, and Build my roster. Tapping a box shows that rule's full text, one at a time (`peek`, `peekRule`). This replaced the separate team overview page (`teamIntro`). Screens fade in (`.ks-appear`, 0.24s, off for reduced-motion). Game settings has a Roster validation switch (applies right away); its back button is now Cancel.
- Faster loading: `tools/build_deploy.py` compiles the JSX once with macOS `jsc` + `tools/vendor/babel.min.js` (7.23.9, same version the page used) and writes `deploy/index.html` without Babel. First paint went from ~1.66s to ~0.12s on a Mac. `killsheet.html` keeps `type="text/babel"` so the preview workflow is unchanged.
- Design round 2: slim header (desktop: logo inside the tab bar, `LOGO_SRC`; phones: small logo above the tabs), taglines and decorative crosses removed, plain two-line footer. Ready/Expended chip replaces the unlabeled activation box (on phones the chips sit on a second row under the name). Dice roller, import panel, opponent column and Play online window restyled (13px text, bigger buttons and dice, Cover/Obscured toggle buttons). Undo toast for Reset game, switching team, loading and deleting saved rosters (`withUndo` snapshots `ks_` storage via `snapshotKillSheetStorage`; Undo restores and reloads); those actions no longer ask for confirmation. Dim text colours brightened (#5A6470/#4A5563 to #8B95A1, red text #E0664A, green text #5A9C3A). Keyboard: focus ring, clickable divs have `role="button"` + `tabIndex`, and Enter/Space activates them (App-level listener).
- Tutorial rebuilt in the new style with current rules and real datacards (Intercessor Sergeant/Warrior vs Kommando Boss Nob/Boy): order chosen on activation, bolt rifle 4/3+/3/4 Piercing Crits 1 (one fewer defence die on a crit), optimal blocking including two normal saves on a crit (`tutBlock`), and an interactive fight where you pick Strike or Block each turn against the Nob. Removed the old-edition content (Accurate/Balanced/Heavy bolt rifle, orders in the Strategy phase, primary-objective scoring) and the unused `TUT` data.
- Community tab redesigned: clear Coming soon note, a 4-step "Share a roster today" guide using saved rosters and codes, and a non-interactive preview of the board.
- Datacard stat labels (APL, Move, Save, Wounds) 14px with 30px values; weapon ATK/HIT/DMG labels 13px; collapsed-card stats 16px.
- UI pass (from a design review): no text under 11px anywhere (ploys 15/13px, weapon names 15px); phone buttons are at least 40px via a CSS rule (`button:not(.compact-btn):not(.link-btn)`; mark deliberately small controls `compact-btn`, inline text links `link-btn`). Builder opens on the team list with a standard game; Mission Setup is now "Game settings" behind the summary line's Change link and the new ⋯ game menu (Game settings, validation, Reset game). Play online stays visible. Slim score bar sticks under the nav (`navH`, `BAR_H`; full scoring opens below it). "Start game" / "Edit roster" replace Lock / Unlock; playing hides the team bar, and phones get three panels (Datacards, Ploys & rules, Turn & mission). Turning point guide starts collapsed; the enemy tracker starts collapsed until it has enemies. Weapon rows are one compact line with a dice icon Roll button. Datacards for operatives with a loadout get a "Pick weapons" picker (`ks_carried`, saved with rosters as `cw`) that hides the weapons the model doesn't carry. Symbol characters in the Builder were replaced by the `Icon` line set. Smaller header on phones.
- Fixed: `useIsMobile` only updated the first component on resize; every component now listens.
- Dice roller keeps the last 10 rolls (attack, defence and re-rolls, with weapon, dice and result) in `ks_rollHistory`, shown under "Recent rolls" in any weapon's roller.
- Once-per-battle ploys get a use box; "each operative once per battle" ploys (Wyrmblade, XV26) get a Used on: chip per operative. Stored in `ks_battleUses` like the other limited uses.
- Table helpers: Engage/Conceal order chip on each datacard (`ks_orders`, everyone starts Conceal); use boxes under Limited x weapons, once-per-battle abilities and a shared 2-use explosive grenade pool (`ks_battleUses`); Turning point guide card (Strategy and Firefight steps, team ploys and strategy-phase rules, counteract helper, next-TP button; `ks_guideChecks`, `ks_counteracted` clear each TP). All of these clear on Reset, new team and new setup.
- Fixed: turning point 1 started at 2CP; it now starts at 3CP (2 to start + 1 for the first Strategy phase), with `lastCpTp` = 1.
- Saved rosters (this device only): a Save button on the datacards bar stores the roster as `{name, f, o, fe, ue, cp, cs, cv}` in `ks_savedRosters`; the team picker lists them with Load, Rename, Copy code and Delete. Loading rebuilds operatives with `makeInstances`, so saved rosters pick up later team data fixes. "Clear current game data" (was "Wipe all saved data") keeps saved rosters.
- Builder now opens on the team list every time (`pickerOpen` starts true). If a team is saved, a "Continue with <team>" button at the top resumes the game; picking a different team while a roster exists asks before clearing it.
- Fixed: Tutorial buttons and unit cards showed raw `\u25B6` / `\u2022` text (escape codes in JSX attribute strings aren't converted; wrap them in `{"..."}`).
- Missions step 2: Mission Setup has a pack/mission picker that fills in turning points, killzone, equipment and tac ops (`gameConfig.mission` = `{pack, idx}`; per-mission overrides are `kz`, `tps`, `equip`, `tacOps` in the pack data). In a game, `MissionPanel` shows how to win, with the map, rules, actions, activation deck and event cards one tap away, and `NpoTracker` tracks enemy NPOs with wound counters (saved in `ks_npoUnits`, cleared by Reset, new setup and team change). Map pages open in a pop-out viewer (tap to zoom, arrows to flip, Esc or X to close) instead of a new tab.
- Missions tab added (step 1): all 12 free mission packs, 40 missions, 64 map pages, enemy datacards, Draw card buttons for activation and event decks. The nav now has five tabs; on phones the icons stack above the labels so they fit.
- Rules tab redesigned: 5 tabs instead of 10, search, one card style with an arrow on cards that open. New How to Play section (setup, turning points, Strategy and Firefight phases, CP, orders, stats, dice, damage). Fixed: Fighting listed the old-edition Assists rule; Counteract now says once per operative per turning point; Visibility cards looked tappable but did nothing. Added markers and objectives (Pick Up Marker, Place Marker, marker control).
- Team picker reorganized: Imperium / Chaos / Xenos tabs, A-Z, a search box, and it collapses to a "Change team" bar after you pick. Picking your current team again no longer wipes the roster.
- Batch 2 done: 30 more teams (Blades of Khaine through XV26 Stealth Battlesuits), for 48 in total. Updated Angels of Death, Kommandos, Plague Marines; added Death Korps, Exaction Squad, Kasrkin; Inquisitorial Agents now has every requisition group. Murderwing fix: a plasma-pistol Chaos Lord counts toward the max-2 plasma/melta limit.
- Team source files moved into the repo (`tools/teams/`, `tools/text/`) so they can't be lost with a temp folder.
- Multiplayer now uses drawn line icons with words (Play online, Hosting, Joining, Online, Host a new game, Join, Disconnect) instead of symbol characters.
- Builder validation toggle reads "Validate" (was "Valid").
- Phone fixes: the team picker and the CP/VP counters no longer push the page wider than the screen.
- 12 new teams added (see Current factions). Builder rules engine rebuilt to support them: repeat operatives, required groups, equipment-unlocked groups (Gellerpox Mutoid Vermin), per-operative and combined caps, "requires" pairs, ½ and ×2 selections, shared totals across groups, and borrowed-operative groups (Inquisitorial requisitions).
- Fixed: multiplayer never showed the opponent's roster (`FACTIONS.find` on an object).
- Print sheet now labels the base size as "mm base" (it said "pts").
- Gold restored for CP/TP signal indicators.
- Locked roster now shows only the selected faction/universal equipment, with a "LOCKED — N SELECTED" header.
- Community tab label shortens to "Community" on phones (under 700px) so the nav stays on one line.
- Pre-ship checker added: `python3 tools/check.py` (hooks before early returns, every tab has an icon and panel, unique localStorage keys, no direct localStorage use, print class, JSX script tag).

### Other open tasks (rough priority order)
- **Game history**: at the end of a game, save team, opponent team, mission, VP and result; a simple stats page per team.
- **Legion of the Damned**: previewed in the Big Autumn Preview; add once its rules are published.
- **Campaign tracking (Ctesiphus Expedition)**: track a map-based campaign across games. Needs the campaign PDF from the owner first, to see what it tracks (map territory, requisition points, operative experience, injuries and so on). Likely a new tab with its own saved state, and it may later need the same backend as Community Rosters if players want to share one campaign.

### Lower-priority backlog
- More factions: see convention 11. Add `tools/teams/<team>.py`, list it in `ORDER.txt`, run the build, then `python3 tools/check.py` and build a full roster in the preview.
- Functional mission scoring (primary objectives, tac-op tracking).
- Make killzone rules functional (currently cosmetic).
- Multiplayer reconnect path.
- Verify mp.send() under heavy load (race conditions / double-fires).

---

## QA approach

A running QA checklist exists (`QA_CHECKLIST.md`) covering automated checks (parse, key uniqueness, hook conventions, mod handling, tag balance) and manual checks (multiplayer end-to-end needs two browsers; persistence needs reload testing; dice roller has a per-weapon-rule test matrix; mobile needs real-device testing). Multiplayer and persistence are the highest-risk areas to re-test after any change to App-level state or the PeerJS hook. The whole thing should be treated as a living document — add tests as features ship, log bugs as found.

The big honest caveat: automated checks confirm the code parses and is internally consistent. They cannot confirm React rendering correctness, event wiring, layout, or anything network-dependent. Those require a real browser and, for multiplayer, two of them.

