/* ═══ SELF-TEST (open the app with ?selftest) ═══ */
// Clicks through the whole app and reports anything that breaks. It saves your data first,
// runs on a clean slate, then puts your data back. Results appear in a panel over the app.
async function runSelfTest(hooks) {
  const results = [];
  const errors = [];
  const saved = window.__ksSaved || snapshotKillSheetStorage();
  const orig = { prompt: window.prompt, confirm: window.confirm, alert: window.alert, error: console.error, createObjectURL: URL.createObjectURL, aClick: HTMLAnchorElement.prototype.click };
  const onError = (e) => errors.push(String(e.message || e));
  window.addEventListener("error", onError);
  console.error = (...a) => { const t = a.map(String).join(" "); if (!/BABEL|Babel|deoptimised/.test(t)) errors.push(t.slice(0, 300)); orig.error.apply(console, a); };
  window.prompt = (msg, def) => def || "Self-test";
  window.confirm = () => true;
  window.alert = () => {};
  let lastBlob = null;
  URL.createObjectURL = (b) => { lastBlob = b; return orig.createObjectURL.call(URL, b); };
  HTMLAnchorElement.prototype.click = function () { if (!this.download) orig.aClick.call(this); };
  window.__ksNoShare = true; // backups download instead of opening the share sheet

  const tick = () => new Promise(r => { const ch = new MessageChannel(); ch.port1.onmessage = r; ch.port2.postMessage(0); });
  const settle = async (n = 12) => { for (let i = 0; i < n; i++) await tick(); };
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const vis = (e) => e && e.offsetParent !== null;
  const all = (sel) => [...document.querySelectorAll(sel)].filter(vis);
  const btn = (text, exact) => all("button,[role=button]").filter(e => !e.closest("nav")).find(e => exact ? e.textContent.trim() === text : e.textContent.trim().startsWith(text));
  const click = async (el, what) => { if (!el) throw new Error("couldn't find " + what); el.click(); await settle(); };
  const nav = async (label) => click([...document.querySelectorAll("nav button")].find(b => b.textContent.trim() === label), label + " tab");
  const typeInto = async (el, text) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, text); el.dispatchEvent(new Event("input", { bubbles: true })); await settle(); };
  const store = (k) => { try { return JSON.parse(snapshotKillSheetStorage()[LS_PREFIX + k] || "null"); } catch (e) { return null; } };
  const step = async (name, fn) => {
    const before = errors.length, t0 = performance.now();
    try { const note = await fn(); results.push({ name, ok: errors.length === before, note: errors.length > before ? errors.slice(before).join(" / ") : (note || ""), ms: Math.round(performance.now() - t0) }); }
    catch (e) { results.push({ name, ok: false, note: String(e.message || e) + (errors.length > before ? " / " + errors.slice(before).join(" / ") : ""), ms: Math.round(performance.now() - t0) }); }
  };
  const panel = document.createElement("div");
  panel.setAttribute("role", "status");
  panel.style.cssText = "position:fixed;left:8px;right:8px;top:8px;z-index:100000;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:12px;color:var(--text);font:13px Inter,sans-serif;max-height:85vh;overflow:auto;box-shadow:0 8px 24px rgba(0,0,0,.6)";
  panel.textContent = "Self-test running...";
  document.body.appendChild(panel);
  const progress = (t) => { panel.textContent = "Self-test running: " + t; };

  restoreKillSheetStorage({});
  await settle(20);

  // Runs first: answers the first-time question as a new player, tries the switches, then turns everything on for the rest.
  await step("Your KillSheet: first question and switches", async () => {
    if (!hooks) throw new Error("the self-test wasn't given the settings");
    hooks.setReturning(false); hooks.setFeatures(null); await settle(20);
    const welcome = document.querySelector("[role=dialog][aria-label='New to Kill Team?']");
    if (!welcome) throw new Error("the first-time question didn't appear");
    await click([...welcome.querySelectorAll("button")].find(b => b.textContent.startsWith("I'm learning")), "I'm learning");
    if (document.querySelector("[role=dialog][aria-label='New to Kill Team?']")) throw new Error("the question didn't close");
    const f = store("features") || {};
    if (featureMode(f) !== "learning") throw new Error("Learning wasn't saved: " + JSON.stringify(f));
    await nav("Missions");
    if (!btn("Add mission packs")) throw new Error("the Missions tab doesn't offer mission packs as an extra");
    if (/switched off/i.test(document.body.innerText)) throw new Error("the Missions tab still says something is switched off");
    await click(all("button").find(b => b.textContent.trim() === "What is it?"), "campaign hint");
    const hinted = document.querySelector("[role=dialog][aria-label='Settings']");
    if (!hinted || !/What you need/.test((document.getElementById("feat-campaign") || {}).textContent || "")) throw new Error("the campaign hint didn't open its explainer");
    await click(hinted.querySelector("[aria-label='Close']"), "close button");
    await nav("Battle");
    await click(document.querySelector("[aria-label='Game menu']"), "game menu");
    if (!btn("Play online")) throw new Error("Play online doesn't show for a learning player");
    await click(document.querySelector("[aria-label='Game menu']"), "game menu (close)");
    const cog = () => all("button[aria-label='Settings']")[0];
    for (const t of ["Rules", "Missions", "Community", "Battle"]) { await nav(t); if (!cog()) throw new Error("the Settings cog doesn't show on " + t); }
    await click(cog(), "Settings cog");
    const page = document.querySelector("[role=dialog][aria-label='Settings']");
    if (!page) throw new Error("the Settings page didn't open");
    const what = [...document.getElementById("feat-scoring").querySelectorAll("button")].find(b => b.textContent === "What is this?");
    await click(what, "What is this? under Detailed scoring");
    if (!/Approved Ops/.test(document.getElementById("feat-scoring").textContent)) throw new Error("the detailed scoring explainer didn't open");
    await click(page.querySelector("[role=switch][aria-label='Mission packs']"), "Mission packs switch");
    if (!(store("features") || {}).missions) throw new Error("the Mission packs switch didn't save");
    if (!/Custom/.test(page.innerText)) throw new Error("the page doesn't say Custom after changing one switch");
    await click([...page.querySelectorAll("button")].find(b => b.textContent.startsWith("I know the game")), "I know the game");
    if (featureMode(store("features") || {}) !== "expert") throw new Error("I know the game didn't switch everything on");
    await click(page.querySelector("[aria-label='Close']"), "close button");
    if (document.querySelector("[role=dialog][aria-label='Settings']")) throw new Error("the page didn't close");
    return "learning, one switch, then everything on";
  });

  await step("Every tab opens", async () => {
    for (const t of ["Rules", "Missions", "Battle", "Community"]) { await nav(t); if (!all("h1,h2,div").length) throw new Error(t + " is empty"); }
    if (document.documentElement.scrollWidth > window.innerWidth + 1) throw new Error("the page scrolls sideways (" + document.documentElement.scrollWidth + "px wide in a " + window.innerWidth + "px window)");
    // The tabs and the online banner are pinned together, so the banner can't slide over the tabs.
    const bar = document.querySelector("nav");
    if (getComputedStyle(bar).position === "sticky" || getComputedStyle(bar.parentElement).position !== "sticky") throw new Error("the tab bar isn't pinned together with the online banner");
  });
  await step("Rules: sections, search and tutorial", async () => {
    await nav("Rules");
    for (const s of ["How to Play", "Moving & Terrain", "Combat", "Equipment", "Glossary"]) await click(btn(s, true), s);
    const search = all("input").find(i => /Search all rules/.test(i.placeholder));
    await typeInto(search, "cover");
    if (!/cover/i.test(document.body.innerText)) throw new Error("search found nothing for 'cover'");
    // Opening a rule with a diagram shows it.
    for (const [rule, key] of [["Obscured", "obscured"], ["Charge", "charge"], ["Control range", "control"]]) {
      await typeInto(search, rule.toLowerCase());
      const item = all("[role=button][aria-expanded]").find(el => el.querySelector("span") && el.querySelector("span").textContent.trim() === rule);
      if (!item) throw new Error("couldn't find the " + rule + " rule");
      if (item.getAttribute("aria-expanded") !== "true") await click(item, rule);
      if (!document.querySelector("[data-diagram='" + key + "']")) throw new Error("the " + rule + " rule has no diagram when opened");
    }
    await typeInto(search, "");
    await click(btn("How to Play", true), "How to Play");
    await click(btn("New to Kill Team"), "tutorial card");
    if (tutBlock(1, 1, 0, 2, 3, 4).damage !== 3) throw new Error("tutorial blocking: two saves should block the crit, letting 3 through");
    // Play the whole tutorial: try Conceal first, then Engage; keep striking until the fight ends.
    const seen = new Set();
    for (let i = 0; i < 80 && !btn("Play again"); i++) {
      const card = document.body.innerText;
      if (/Orders: Engage or Conceal/.test(card) && !document.querySelector("[role=img][aria-label^='An Engage operative']")) throw new Error("the Engage/Conceal diagram is missing");
      if (/Step 5 of/.test(card) && !seen.has("conceal")) { seen.add("conceal"); await click(btn("Conceal"), "Conceal order"); if (!/can't Shoot. Pick Engage/.test(document.body.innerText)) throw new Error("picking Conceal didn't explain why he can't shoot"); await click(btn("Engage"), "Engage order"); }
      const map = document.querySelector("[role=img][aria-label^='Map:']");
      if (map) seen.add(map.getAttribute("aria-label").slice(5, 30));
      const b = all("button").find(x => /^(Start|Continue|Begin|Take the shot|Roll|The Ork|Fight|Both roll|Resolve|The Nob's turn|Strike)/.test(x.textContent.trim()));
      if (!b) throw new Error("the tutorial got stuck at: " + (card.match(/Step \d+ of \d+/) || ["?"])[0]);
      b.click(); await settle();
    }
    if (!btn("Play again")) throw new Error("the tutorial didn't reach the end");
    if (seen.size < 5) throw new Error("only " + (seen.size - 1) + " map pictures showed");
    // Part 2: CP, a strategy ploy, the objective quiz (answered right), Balanced and Command Re-roll, then scoring.
    const text = () => document.body.innerText;
    await click(btn("Part 2: objectives"), "Part 2");
    await click(btn("Start turning point 2"), "Start turning point 2");
    await click(btn("Gain 1CP"), "Gain 1CP");
    if (!document.querySelector("[data-tut-cp='4']")) throw new Error("part 2: gaining CP didn't make 4CP");
    await click(btn("Gambits"), "Gambits");
    if (!/Pick one doctrine/.test(text())) throw new Error("part 2: Combat Doctrine's text is missing");
    await click(btn("Use Combat Doctrine"), "Combat Doctrine");
    await click(btn("Pass", true), "Pass");
    await click(btn("Begin the Firefight phase"), "Begin the Firefight phase");
    for (const ids of TUT2_QUIZ) {
      const want = { you: "You", them: "The bot", nobody: "Nobody" }[tut2Control(ids).who];
      await click(btn(want, true), want);
      if (!/Right\./.test(text())) throw new Error("part 2: the right answer (" + want + ") was marked wrong");
      await click(btn("Next question") || btn("See how you did"), "next question");
    }
    if (!/You got 4 of 4/.test(text())) throw new Error("part 2: the quiz score is wrong");
    await click(btn("Next", true), "Next");
    await click(btn("Roll 4 attack dice"), "Roll 4 attack dice");
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still && !all("[data-die^='t2:']").some(d => d.getAnimations().length)) throw new Error("part 2: the tutorial's dice don't tumble when rolled");
    await click(document.querySelector("[data-tut-die='0']"), "Balanced re-roll");
    if (!still && !document.querySelector("[data-tut-die='0']").getAnimations().length) throw new Error("part 2: a re-rolled die doesn't tumble");
    if (!document.querySelector("[data-tut-die='0']").disabled) throw new Error("part 2: a re-rolled die can be re-rolled again");
    await click(document.querySelector("[data-tut-die='1']"), "Command Re-roll");
    if (!document.querySelector("[data-tut-cp='2']")) throw new Error("part 2: Command Re-roll didn't cost 1CP");
    await click(btn("End the turning point"), "End the turning point");
    await click(btn("Score the turning point"), "Score");
    if (!/You score 1VP/.test(text()) || !/The bot scores 1VP/.test(text())) throw new Error("part 2: scoring didn't give 1VP each");
    await click(btn("Next", true), "Next");
    if (!btn("Play part 2 again")) throw new Error("part 2 didn't reach the end");
    await click(btn("Back to part 1"), "Back to part 1");
    await click(btn("Rules", true), "tutorial back button");
    await click(all("[role=button]").find(e => e.textContent.trim().startsWith("Orders")), "Orders rule");
    if (!document.querySelector("[role=img][aria-label^='An Engage operative']")) throw new Error("the Orders rule doesn't show the Engage/Conceal diagram");
    return "parts 1 and 2 played through, " + (seen.size - 1) + " map pictures";
  });
  await step("Missions: every pack, mission and map", async () => {
    await nav("Missions");
    const packs = MISSION_PACKS.length; let missions = 0, maps = 0;
    for (const p of MISSION_PACKS) {
      progress("mission pack " + p.name);
      await click(all("[role=button]").find(e => e.textContent.trim().startsWith(p.name)), "pack " + p.name);
      for (let mi = 0; mi < p.missions.length; mi++) {
        const m = p.missions[mi];
        const card = all("[role=button],button").find(e => e.textContent.includes(m.name));
        if (!card) continue;
        card.click(); await settle(); missions++;
        for (let w = 0; w < 40 && all("[aria-label='Mission map']").length < m.maps.length && m.maps.length; w++) await wait(25);
        const thumb = all("button[aria-label='Enlarge map']")[0] || all("button").find(b => b.querySelector("img[alt='Mission map page']"));
        if (thumb) {
          thumb.click(); await settle(); maps++;
          if (m.maps.length && !document.querySelector(".km-fit svg")) throw new Error(p.name + " " + m.name + ": map didn't draw");
          const orig = all("button").find(b => b.textContent.trim() === "Original");
          if (orig) { orig.click(); await settle(); if (!document.querySelector("img[alt='Mission map page']")) throw new Error(m.name + ": original page missing"); }
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); await settle();
        }
        const back = all("button").find(b => b.textContent.trim() === p.name); if (back) { back.click(); await settle(); }
      }
      const toPacks = all("button").find(b => b.textContent.trim() === "All packs"); if (toPacks) { toPacks.click(); await settle(); }
    }
    return packs + " packs, " + missions + " missions, " + maps + " maps opened";
  });
  await step("Every team: pick, build, play, end game", async () => {
    await nav("Battle");
    let done = 0; const problems = [];
    for (const fc of Object.values(FACTIONS)) {
      progress("team " + fc.name + " (" + (done + 1) + "/" + Object.keys(FACTIONS).length + ")");
      try {
        const change = btn("Change team", true); if (change) await click(change, "Change team");
        const search = all("input").find(i => i.placeholder === "Search teams or factions");
        await typeInto(search, fc.name);
        await click(all("[role=button]").find(e => e.textContent.trim().endsWith(fc.name)), "team card");
        await click(btn("Build my roster") || btn("Continue with this team"), "Build my roster");
        const rows = all("[role=button]").filter(e => /W\s*•/.test(e.textContent) && e.textContent.length < 120).slice(0, 4);
        for (const r of rows) { r.click(); await settle(); }
        const plus = all("button[aria-label^='Add ']")[0]; if (plus) { plus.click(); await settle(); }
        if (!(store("roster") || []).length) throw new Error("no operatives added");
        await click(btn("Start game"), "Start game");
        const cards = all(".datacard-print");
        if (!cards.length) throw new Error("no datacards shown");
        cards[0].querySelector("[role=button]").click(); await settle();
        const minus = all("button[aria-label^='Remove a wound']")[0] || all("button").find(b => b.textContent.trim() === "−"); if (minus) { minus.click(); await settle(); }
        await click(document.querySelector("[aria-label='Game menu']"), "game menu");
        await click(btn("End game"), "End game");
        await click(btn("Save result", true), "Save result");
        await click(btn("Edit roster") || btn("Ploys & rules") , "back to roster");
        const edit = btn("Edit roster"); if (edit) await click(edit, "Edit roster");
        if (done === 0) {
          // A finished game with no backup yet: the Battle tab offers one (iPhone Safari first suggests the Home Screen).
          const note = () => all("[role=note]").find(n => /Back up your rosters|Keep your data safe/.test(n.textContent));
          if (!note()) throw new Error("no backup reminder after the first finished game");
          if (/Keep your data safe/.test(note().textContent)) await click([...note().querySelectorAll("button")].find(b => b.textContent.trim() === "Got it"), "Got it");
          if (!note() || !/Back up your rosters/.test(note().textContent)) throw new Error("no backup reminder after the Home Screen note");
          await click([...note().querySelectorAll("button")].find(b => b.textContent.trim() === "Later"), "Later");
          if (note()) throw new Error("the backup reminder didn't go away after Later");
        }
      } catch (e) { problems.push(fc.name + ": " + e.message); }
      done++;
    }
    const games = (store("gameHistory") || []).length;
    if (problems.length) throw new Error(problems.join("; "));
    return done + " teams played, " + games + " games recorded";
  });
  await step("Game history stats", async () => {
    await nav("Battle");
    const change = btn("Change team", true); if (change) await click(change, "Change team");
    const head = all("[role=button]").find(e => /^Game history/.test(e.textContent.trim()));
    if (!head) throw new Error("no Game history card on the team list");
    if (!/\d+% wins/.test(head.textContent)) throw new Error("no win rate in the Game history heading");
    if (head.getAttribute("aria-expanded") !== "true") await click(head, "Game history");
    const card = head.parentElement.textContent;
    if (!/Average score: You [\d.]+ · Opponents [\d.]+/.test(card)) throw new Error("no average score");
    if (!/YOUR TEAMS|Your teams/.test(card) || !/RECENT GAMES|Recent games/.test(card)) throw new Error("team records or recent games missing");
    await click(head, "Game history");
    return head.textContent.replace(/^Game history/, "").trim();
  });
  await step("Save a roster and back up", async () => {
    await nav("Battle");
    const dc = btn("Datacards", true); if (dc) await click(dc, "Datacards");
    const save = btn("Save", true) || all("button").find(b => b.textContent.trim() === "Save"); if (save) await click(save, "Save");
    await click(document.querySelector("[aria-label='Game menu']"), "game menu");
    await click(btn("Back up"), "Back up");
    if (!lastBlob) throw new Error("no backup file was made");
    const data = JSON.parse(await lastBlob.text());
    if (data.app !== "KillSheet" || !Object.keys(data.data || {}).length) throw new Error("backup file is empty");
    return Object.keys(data.data).length + " items in the backup";
  });
  await step("Campaign: set up and play a round", async () => {
    await nav("Missions");
    await click(btn("Start a campaign") || btn("Continue your campaign"), "Start a campaign");
    const hexes = () => [...document.querySelectorAll("g[role=button]")].filter(g => g.closest("svg").getBoundingClientRect().width > 0);
    for (let w = 0; w < 40 && !hexes().length; w++) await wait(25);
    const base = hexes().find(g => / surface/.test(g.getAttribute("aria-label")));
    if (!base) throw new Error("campaign map didn't appear (" + document.querySelectorAll("g[role=button]").length + " hexes in the page)");
    base.dispatchEvent(new MouseEvent("click", { bubbles: true })); await settle();
    await click(btn("Start campaign", true), "Start campaign");
    const target = hexes().find(g => [...g.querySelectorAll("text")].some(t => / SP$/.test(t.textContent)));
    target.dispatchEvent(new MouseEvent("click", { bubbles: true })); await settle();
    await click(btn("Move here"), "Move here");
    await click(btn("Won", true), "Won");
    await click(btn("Skip", true), "Skip");
    await click(btn("End round"), "End round");
    const c = store("campaign");
    if (!c || c.round !== 2) throw new Error("campaign didn't reach round 2");
    return "round 2, " + c.stats.explored + " hex(es) explored";
  });

  // Runs last: it leaves a game in progress, which shrinks the campaign card on the Battle tab.
  await step("Mission scoring checklist", async () => {
    await nav("Battle");
    const change = btn("Change team", true); if (change) await click(change, "Change team");
    await typeInto(all("input").find(i => i.placeholder === "Search teams or factions"), "Kasrkin");
    await click(all("[role=button]").find(e => e.textContent.trim().endsWith("Kasrkin")), "Kasrkin");
    await click(btn("Build my roster") || btn("Continue with this team"), "Build my roster");
    for (const r of all("[role=button]").filter(e => /W\s*•/.test(e.textContent) && e.textContent.length < 120).slice(0, 3)) { r.click(); await settle(); }
    await click(btn("Start game"), "Start game");
    await click(all("button").find(b => /turning points/.test(b.textContent) && /Change/.test(b.textContent)), "game setup");
    const pick = async (i, v) => { const sel = all("select")[i]; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(sel, v); sel.dispatchEvent(new Event("change", { bubbles: true })); await settle(); };
    await pick(0, "hivestorm"); await pick(1, "0");
    await click(btn("Use these settings", true), "Use these settings");
    const show = all("button[aria-label='Show scoring']")[0]; if (show) await click(show, "scoring panel");
    await click(all("button[aria-label='Turning point 2']")[0], "turning point 2");
    await click(all("button[aria-label='You: Your operatives control a transmitting objective marker']")[0], "first scoring tick");
    await click(all("button[aria-label='Opponent: You control more transmitting objective markers than the enemy']")[0], "second scoring tick");
    const sc = store("missionScore") || {};
    if (!(sc["2|any"] && sc["2|any"].you === 1 && sc["2|more"] && sc["2|more"].opp === 1)) throw new Error("ticks weren't saved: " + JSON.stringify(sc));
    if (!/You: 1 mission/.test(document.body.innerText)) throw new Error("ticks didn't add VP");
    return "2 ticks, 1VP each side";
  });

  // Uses the game the scoring step left running. Everything is switched on ("I know the game"), so no learning labels.
  await step("Rule tips", async () => {
    await nav("Battle");
    const dc = btn("Datacards", true); if (dc) await click(dc, "Datacards");
    const statNames = new Set(Object.values(TERM_TIPS).map(t => "What is " + t[0] + "?"));
    let apl = all("[aria-label='What is APL (action point limit)?']")[0];
    if (!apl) { await click(all(".datacard-print [role=button]")[0], "a datacard"); apl = all("[aria-label='What is APL (action point limit)?']")[0]; }
    if (!apl) throw new Error("no APL tip on an open datacard");
    if (getComputedStyle(apl).textDecorationLine !== "none") throw new Error("tips are underlined with learning help off");
    if (all("[aria-label='What does Ready and orders mean?']").length) throw new Error("the order (i) shows with learning help off");
    await click(apl, "APL tip");
    const tip = () => document.querySelector("[role=tooltip]");
    if (!tip() || !/action points/.test(tip().textContent)) throw new Error("the APL tip didn't open");
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await settle();
    if (tip()) throw new Error("the tip didn't close when tapping elsewhere");
    // A word inside a tip ("critical success", "cover"...) opens in the same card, with Back.
    let inner = null;
    for (const t of all(".datacard-print [aria-label^='What is ']").slice(0, 30)) {
      await click(t, "a tip");
      inner = tip() && [...tip().querySelectorAll("button")].find(b => !/More information in Rules|Back to/.test(b.textContent));
      if (inner) break;
    }
    if (!inner) throw new Error("no tip with a linked word inside it");
    const word = inner.textContent;
    await click(inner, "linked word " + word);
    if (!tip() || !/Back to/.test(tip().textContent)) throw new Error(word + " didn't open in the tip with a Back link");
    await click([...tip().querySelectorAll("button")].find(b => /Back to/.test(b.textContent)), "Back");
    if (/Back to/.test(tip().textContent)) throw new Error("Back didn't return to the first tip");
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await settle();
    const rule = all(".datacard-print [aria-label^='What is ']").find(e => !statNames.has(e.getAttribute("aria-label")));
    if (!rule) throw new Error("no weapon rule tip on the datacard");
    await click(rule, "weapon rule tip");
    if (!tip()) throw new Error(rule.textContent + ": tip didn't open");
    const more = [...tip().querySelectorAll("button")].find(b => /More information in Rules/.test(b.textContent));
    if (more) {
      await click(more, "More information in Rules");
      const q = all("input").find(i => /Search all rules/.test(i.placeholder));
      if (!q || !q.value) throw new Error("More information in Rules didn't search the Rules tab");
      await typeInto(q, "");
    }
    // The turning point guide's ploy chips open the ploy's text.
    await nav("Battle");
    const turn = btn("Turn & mission", true); if (turn) await click(turn, "Turn & mission");
    let ploy = all("[aria-label$='ploy, 1CP)?']")[0];
    if (!ploy) { const g = all("button").find(b => /Turning point guide/.test(b.textContent)); if (g) await click(g, "turning point guide"); ploy = all("[aria-label$='ploy, 1CP)?']")[0]; }
    if (!ploy) throw new Error("no ploy tips in the turning point guide");
    await click(ploy, "ploy chip");
    if (!tip() || tip().textContent.length < 20) throw new Error("the ploy tip didn't open");
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await settle();
    // Rule names inside rule text are tips too (a ploy that says "Fall Back" or names another ploy).
    const hc = refMatches("You can use Command Override for 0CP, then Fall Back.", teamRefs(FACTIONS.hunterclade));
    if (hc.map(x => x.entry.key).join() !== "team:Command Override,act:Fall Back") throw new Error("rule names in text: found " + hc.map(x => x.m).join(", "));
    if (refMatches("with Heavy or Light terrain intervening, or an Astartes shotgun", teamRefs(FACTIONS.scouts)).length) throw new Error("terrain or a weapon name was linked as a rule");
    const ploysTab = btn("Ploys & rules", true); if (ploysTab) await click(ploysTab, "Ploys & rules");
    const refTip = all("[aria-label^='What is ']").find(e => /\((\dAP|strategy ploy, 1CP|firefight ploy, 1CP|equipment|universal equipment)\)\?$|What is (Counteract|Strategic gambit|SUPPORT|Balanced|Ceaseless|Severe|Relentless)\?/.test(e.getAttribute("aria-label")));
    if (!refTip) throw new Error("no rule names linked in the team's ploys and rules");
    await click(refTip, "rule name in rule text");
    if (!tip() || tip().textContent.length < 20) throw new Error(refTip.textContent + ": the linked rule's tip didn't open");
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await settle();
    return "APL, " + rule.textContent.trim() + (more ? " with the Rules link" : "") + ", \"" + word + "\" inside a tip, the " + ploy.textContent.trim() + " ploy, and \"" + refTip.textContent.trim() + "\" in rule text";
  });

  // Dice damage goes to the side that was shot at. With no opponent team loaded, it says to tell them instead.
  await step("Shooting: rules, one device and online", async () => {
    // 1. The rules, with fixed dice.
    const W = (atk, hit, dmg, wr) => ({ name: "gun", atk, hit, dmg, wr: wr || "-" });
    const op = (id, save) => ({ id, name: id, max: 12, start: 12, injured: false, save: save || "4+" });
    const go = (w, ad, dd, opts) => {
      let x = reduceShot(newShot("t", false, "A", op("shooter"), w), { type: "target", target: newShotTarget("B", op("target", (opts || {}).save)) });
      if (x.stage === "more") x = reduceShot(x, { type: "more", targets: [] });
      if ((opts || {}).obscured) x = reduceShot(x, { type: "obscured", v: true });
      x = reduceShot(reduceShot(x, { type: "roll", who: "a", dice: ad }), { type: "ready", who: "a" });
      if (x.stage === "defense") {
        if ((opts || {}).cover) x = reduceShot(x, { type: "cover", v: true });
        if (dd) x = reduceShot(x, { type: "roll", who: "d", dice: dd });
        x = reduceShot(x, { type: "ready", who: "d" });
      }
      return x;
    };
    const bad = [];
    let x = go(W(4, "3+", "3/4", "Piercing 1"), [6, 4, 3, 1], [6], { cover: true });
    if (x.stage !== "result" || x.targets[0].dmg !== 3 || x.targets[0].d.kept !== 1) bad.push("Piercing 1 in cover: expected 3 damage with one cover save, got " + x.targets[0].dmg);
    if (go(W(4, "3+", "3/4"), [1, 2, 1, 2]).targets[0].dmg !== 0) bad.push("no hits should skip defense with 0 damage");
    if (go(W(4, "3+", "3/4", "Saturate"), [6, 4, 3, 1], [1, 1, 1], { cover: true }).targets[0].d.kept !== 0) bad.push("Saturate still gave a cover save");
    if (shotAttack(go(W(2, "3+", "3/4"), [6, 6], null, { obscured: true }), { a: { dice: [6, 6] }, obscured: true }).hits !== 1) bad.push("obscured");
    if (reduceShot(newShot("t", false, "A", op("s"), W(4, "3+", "2/4", "Blast 2\"")), { type: "target", target: newShotTarget("B", op("t")) }).stage !== "more") bad.push("Blast doesn't ask for extra targets");
    let h = { ...go(W(4, "3+", "3/4", "Hot"), [1, 1, 1, 1]) }; h = reduceShot(reduceShot(h, { type: "next" }), { type: "hot", v: 1 });
    if (!h.hot || h.hot.dmg !== 2) bad.push("Hot: a 1 under Hit 3+ should deal 2");
    if (bad.length) throw new Error(bad.join("; "));
    // 2. On one device, against an opponent's team (sent as if they'd connected).
    const K = FACTIONS.kommandos, theirOps = K.operatives.slice(0, 3).map(o => ({ ...o }));
    hooks.mpMessage({ type: "snapshot", payload: { fid: "kommandos", roster: theirOps, wounds: {} } }); await settle(20);
    await nav("Battle");
    const dc = btn("Datacards", true); if (dc) await click(dc, "Datacards");
    const dlg = () => document.querySelector("[role=dialog][aria-label='Shoot']");
    const inDlg = (re) => dlg() && [...dlg().querySelectorAll("button")].find(b => re.test(b.textContent.trim()) && !b.disabled);
    const openShot = async () => {
      const mineShoot = () => all(".datacard-print[data-side='mine'] [aria-label^='Shoot with ']")[0];
      let sb = mineShoot();
      if (!sb) { await click(all(".datacard-print[data-side='mine'] [role=button]")[0], "a datacard"); sb = mineShoot(); }
      if (!sb) throw new Error("no Shoot button on an open datacard");
      await click(sb, "Shoot");
      if (!dlg()) throw new Error("the Shoot screen didn't open");
      if (!dlg().querySelector("[data-vs='shoot']")) throw new Error("the Shoot screen has no marker between shooter and target");
    };
    const pickEnemy = async () => {
      await click([...dlg().querySelectorAll("button")].find(b => theirOps.some(o => b.textContent.startsWith(o.name))), "an enemy");
      if (inDlg(/^Start shooting/)) await click(inDlg(/^Start shooting/), "Start shooting");
    };
    // Plays every step this device controls; theirStep handles a step waiting on the other player.
    const playOut = async (theirStep) => {
      for (let i = 0; i < 40 && dlg() && !/Shooting done/.test(dlg().innerText); i++) {
        if (inDlg(/^(Send to defender|Done: defense next)$/)) throw new Error("there's still a step to send the attack to the defender");
        const next = inDlg(/^Roll \d+ (attack|defense) (die|dice)$/) || inDlg(/^(No hits: done|Done: see the damage|Continue|Next target|Finish)$/);
        const rolling = next && /^Roll/.test(next.textContent.trim());
        if (next) {
          await click(next, next.textContent.trim());
          if (rolling && dlg() && !dlg().querySelector("[data-die] svg circle")) throw new Error("rolled dice show no pips");
        }
        else if (theirStep && /Waiting for your opponent/.test(dlg().innerText)) await theirStep();
        else throw new Error("shooting got stuck: " + dlg().innerText.slice(0, 160));
      }
      if (!dlg() || !/Shooting done/.test(dlg().innerText)) throw new Error("shooting didn't finish");
      if (inDlg(/^Roll for Hot$/)) await click(inDlg(/^Roll for Hot$/), "Roll for Hot");
    };
    await openShot();
    if (!/Who is .* shooting\?/.test(dlg().innerText)) throw new Error("the Shoot screen doesn't ask for a target first");
    await click(dlg().parentElement, "outside the Shoot screen");
    if (dlg()) throw new Error("tapping outside didn't close the Shoot screen before anything was rolled");
    await openShot();
    await pickEnemy();
    if (!inDlg(/^Enter real dice$/)) throw new Error("no way to enter real dice");
    await playOut();
    await click(dlg().parentElement, "outside the finished Shoot screen");
    if (dlg()) throw new Error("tapping outside didn't close the finished Shoot screen");
    await openShot(); await pickEnemy(); await playOut();
    const logText = () => (store("battleLog") || []).map(e => e.target + " by " + e.by + " with " + e.weapon).join("; ");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); await settle();
    if (dlg()) throw new Error("Escape didn't close the finished Shoot screen");
    const sent = []; window.__ksMpTestSend = (m) => sent.push(m);
    try {
      // 3. Online, defending: their attack card opens here, then we roll our own saves.
      const mineOp = (store("roster") || []).find(o => ((store("wounds") || {})[o.id] ?? o.wounds) > 0);
      const before = (store("wounds") || {})[mineOp.id] ?? mineOp.wounds;
      const gun = theirOps.find(o => o.ranged.length).ranged[0];
      hooks.mpMessage({ type: "shootStart", id: "ss1", n: 1, atk: { opId: theirOps.find(o => o.ranged.length).id, weapon: gun }, targets: [{ owner: "B", opId: mineOp.id }] }); await settle(20);
      if (!dlg() || !/Waiting for your opponent to roll attack dice/.test(dlg().innerText)) throw new Error("their attack card didn't open here, waiting for their roll");
      await click(dlg().parentElement, "outside their attack card");
      if (!dlg()) throw new Error("tapping outside closed an attack the other player started");
      // A lost message: their "ready" (3) arrives without the roll (2). We wait and ask them to send everything again.
      hooks.mpMessage({ type: "shot", id: "ss1", n: 3, action: { type: "ready", who: "a" } }); await settle(20);
      if (!sent.some(m => m.type === "shotResync" && m.id === "ss1")) throw new Error("a gap in their moves didn't ask for a resend");
      if (/is shooting your/.test(dlg().innerText)) throw new Error("a move was applied out of order");
      if (!store("shot") || store("shot").id !== "ss1") throw new Error("the shot in progress isn't saved for a reload");
      hooks.mpMessage({ type: "shootStart", id: "ss1", n: 1, atk: { opId: theirOps.find(o => o.ranged.length).id, weapon: gun }, targets: [{ owner: "B", opId: mineOp.id }] });
      hooks.mpMessage({ type: "shot", id: "ss1", n: 2, action: { type: "roll", who: "a", dice: [6, 6, 6, 6] } });
      hooks.mpMessage({ type: "shot", id: "ss1", n: 3, action: { type: "ready", who: "a" } });
      hooks.mpMessage({ type: "shot", id: "ss1", n: 2, action: { type: "roll", who: "a", dice: [1, 1, 1, 1] } }); await settle(20); // a repeat: skipped
      if (!/is shooting your/.test(dlg().innerText)) throw new Error("no defense prompt after their resent roll");
      if (!/4 crits/.test(dlg().innerText)) throw new Error("a repeated message changed their dice");
      await playOut(async () => { hooks.mpMessage({ type: "shot", id: "ss1", n: 4, action: { type: "next" } }); await settle(20); });
      // They ask us to resend (they lost something): our moves go again with the same numbers.
      const ours = sent.filter(m => m.type === "shot").length;
      hooks.mpMessage({ type: "shotResync", id: "ss1" }); await settle(20);
      const again = sent.filter(m => m.type === "shot").slice(ours);
      if (!again.length || again[0].n !== 1) throw new Error("a resend request didn't send our moves again from the start");
      const after = (store("wounds") || {})[mineOp.id];
      if (!(after < before)) throw new Error("four crits didn't take wounds off " + mineOp.name + " (" + before + " to " + after + ")");
      const ourRoll = sent.find(m => m.type === "shot" && m.action.type === "roll" && m.action.who === "d");
      if (!ourRoll) throw new Error("our defense roll wasn't sent");
      if (!Array.isArray(ourRoll.action.atk) || ourRoll.action.atk.join() !== "6,6,6,6") throw new Error("our defense roll doesn't carry the attack dice we saw");
      if (sent.some(m => m.type === "shot" && m.action.who === "a")) throw new Error("we sent a move for their side");
      if (!/by .* with /.test(logText())) throw new Error("their hit isn't in the battle log");
      await click(inDlg(/^Close$/), "Close");
      // 4. Online, attacking: our card goes to them once the targets are picked; their saves come back.
      sent.length = 0;
      const oppBefore = JSON.stringify(store("oppWounds") || {});
      await openShot();
      if (!/ONLINE/.test(dlg().innerText)) throw new Error("the shot isn't marked online");
      await pickEnemy();
      const start = sent.find(m => m.type === "shootStart");
      if (!start || !start.targets.length) throw new Error("no shootStart was sent");
      let rolled = false;
      const firstWait = () => { const r = sent.find(m => m.type === "shot" && m.action.type === "roll" && m.action.who === "a"); if (r && sent.some(m => m.type === "shot" && m.action.type === "ready" && m.action.who === "a") && /hits?\b/.test(dlg().innerText) && !/No hits/.test(dlg().innerText)) throw new Error("a ready step was sent after an attack with hits"); };
      await playOut(async () => {
        firstWait();
        if (rolled) throw new Error("still waiting on them");
        hooks.mpMessage({ type: "shot", id: start.id, action: { type: "roll", who: "d", dice: [1, 1, 1] } });
        hooks.mpMessage({ type: "shot", id: start.id, action: { type: "ready", who: "d" } }); await settle(20);
        rolled = !/Waiting for your opponent to roll defense/.test(dlg().innerText) ? false : true;
      });
      if (JSON.stringify(store("oppWounds") || {}) !== oppBefore) throw new Error("online, we changed their wounds ourselves (their device owns them)");
      await click(inDlg(/^Close$/), "Close");
      await openShot(); await pickEnemy();
      const start2 = sent.filter(m => m.type === "shootStart").slice(-1)[0];
      hooks.mpMessage({ type: "shot", id: start2.id, action: { type: "cancel" } }); await settle(20);
      if (dlg()) throw new Error("their cancel didn't close the Shoot screen");
    } finally { delete window.__ksMpTestSend; }
    return "rules with fixed dice, one device with Escape, and both sides online";
  });

  // The dice maths with fixed dice: each weapon rule, cover, obscured and blocking.
  await step("Fights: rules, one device and online", async () => {
    // 1. The rules, with fixed dice.
    const W = (atk, hit, dmg, wr) => ({ name: "w", atk, hit, dmg, wr: wr || "-" });
    const S = (sd, dice, weapon, start) => ({ side: sd, op: { id: sd, name: sd, max: start || 12, start: start || 12, injured: false }, weapon, dice, rr: dice.map(() => false), ready: false });
    const ready = (f) => reduceFight(reduceFight(f, { type: "ready", role: "atk" }), { type: "ready", role: "def" });
    const act = (f, role, kind, use, hit) => reduceFight(f, { type: "act", role, kind, use, hit });
    const base = (aw, ad, dw, dd) => ({ ...newFight("t", false, ["atk", "def"], S("mine", ad, aw)), atk: S("mine", ad, aw), def: S("opp", dd, dw), stage: "roll" });
    let f = ready(base(W(4, "3+", "4/5"), [6, 4, 2, 1], W(3, "4+", "3/4"), [5, 6, 3]));
    const bad = [];
    const kinds = (x, r) => x.left[r].map(i => x.slots[r][i].kind).join();
    if (f.stage !== "resolve" || kinds(f, "atk") !== "crit,norm" || kinds(f, "def") !== "crit,norm" || f.turn !== "atk") bad.push("successes or first turn");
    f = act(f, "atk", "strike", "crit");
    if (f.dmg.def !== 5 || f.turn !== "def") bad.push("strike damage or turn order");
    if (f.used.atk[0] !== "Strike") bad.push("the die that struck isn't marked (the 6 is die 1)");
    f = act(f, "def", "block", "norm", "norm");
    if (f.left.atk.length || f.turn !== "def") bad.push("block, then the other side resolves the rest");
    if (f.used.def[0] !== "Block" || f.used.atk[1] !== "Lost") bad.push("the blocking die and the blocked die aren't marked");
    f = act(f, "def", "strike", "crit");
    if (f.dmg.atk !== 4 || f.stage !== "done") bad.push("fight ends when both run out");
    const br = ready(base(W(4, "3+", "4/5"), [4], W(3, "3+", "3/4", "Brutal"), [5, 6]));
    if (act(br, "atk", "block", "norm", "norm") !== br) bad.push("Brutal: a normal blocked it");
    const sh = act(ready(base(W(4, "3+", "4/5", "Shock"), [6], W(3, "3+", "3/4"), [6, 5])), "atk", "strike", "crit");
    if (kinds(sh, "def") !== "crit" || sh.used.def[1] !== "Lost") bad.push("Shock didn't discard (and mark) a normal success");
    const rend = ready(base(W(4, "3+", "3/4", "Rending"), [6, 4], W(3, "3+", "3/4"), [1]));
    if (kinds(rend, "atk") !== "crit,crit" || rend.slots.atk[1].rule !== "Rending") bad.push("Rending didn't turn the right die into a crit");
    if (fightSuccesses({ dice: [3], weapon: W(4, "3+", "3/4"), op: { injured: true } }).length) bad.push("injured: still hits on 3+");
    if (fightSuccesses({ dice: [5], weapon: W(4, "3+", "3/4", "Lethal 5+"), op: {} }).join() !== "crit") bad.push("Lethal 5+");
    if (ready(base(W(4, "3+", "4/5"), [1, 2], W(3, "3+", "3/4"), [4])).turn !== "def") bad.push("attacker with no successes still goes first");
    if (bad.length) throw new Error("fight rules: " + bad.join("; "));
    // 2. On one device, against an opponent's team (sent as if they'd connected).
    const K = FACTIONS.kommandos, theirOps = K.operatives.slice(0, 3).map(o => ({ ...o }));
    hooks.mpMessage({ type: "snapshot", payload: { fid: "kommandos", roster: theirOps, wounds: {} } }); await settle(20);
    await nav("Battle");
    if (document.documentElement.scrollWidth > window.innerWidth + 1) throw new Error("with their team showing, the Battle page scrolls sideways (" + document.documentElement.scrollWidth + "px in a " + window.innerWidth + "px window)");
    const dlg = () => document.querySelector("[role=dialog][aria-label='Fight']");
    const inDlg = (re) => dlg() && [...dlg().querySelectorAll("button")].find(b => re.test(b.textContent.trim()) && !b.disabled);
    const openFight = async () => {
      const mineFight = () => all(".datacard-print[data-side='mine'] [aria-label^='Fight with ']")[0];
      let fb = mineFight();
      if (!fb) { await click(all(".datacard-print[data-side='mine'] [role=button]")[0], "a datacard"); fb = mineFight(); }
      await click(fb, "Fight");
      if (!dlg()) throw new Error("the Fight screen didn't open");
      if (!dlg().querySelector("[data-vs='fight']")) throw new Error("the Fight screen has no crossed blades between the fighters");
    };
    const weaponBtn = () => dlg() && [...dlg().querySelectorAll("button")].find(b => /\d+ · \d\+ · \d+\/\d+/.test(b.textContent));
    const fightOut = async (theirTurn) => {
      for (let i = 0; i < 30 && dlg() && !/Fight over/.test(dlg().innerText); i++) {
        if (inDlg(/^Strike/)) await click(inDlg(/^Strike/), "Strike");
        else if (theirTurn && /Waiting for your opponent: /.test(dlg().innerText)) await theirTurn();
        else throw new Error("the fight got stuck: " + dlg().innerText.slice(0, 120));
      }
      if (!dlg() || !/Fight over/.test(dlg().innerText)) throw new Error("the fight didn't end");
    };
    await openFight();
    await click(dlg().querySelector("button[style*='border-left']") || [...dlg().querySelectorAll("button")].find(b => theirOps.some(o => b.textContent.startsWith(o.name))), "an enemy");
    await click(weaponBtn(), "their weapon");
    await click(inDlg(/^Roll \d+ dice for/), "attacker's roll");
    await click(dlg().parentElement, "outside the Fight screen mid-roll");
    if (!dlg()) throw new Error("tapping outside closed the Fight screen after dice were rolled");
    await click(inDlg(/^Roll \d+ dice for/), "defender's roll");
    await click(inDlg(/^Done rolling/), "attacker done"); await click(inDlg(/^Done rolling/), "defender done");
    await fightOut();
    const states = [...dlg().querySelectorAll("button[aria-label^='Die ']")].map(b => b.getAttribute("aria-label"));
    if (dlg().innerText.match(/struck with/) && !states.some(l => /, strike$/.test(l))) throw new Error("after the fight, no die is marked as the one that struck");
    await click(dlg().querySelector("[aria-label='How this works']"), "the ⓘ");
    if (!/Block cancels one of the opponent's successes/.test(dlg().innerText)) throw new Error("the ⓘ didn't explain the fight");
    await click(inDlg(/^Close$/), "Close");
    // 3. Online, defending: the other player starts a fight against one of ours.
    const sent = []; window.__ksMpTestSend = (m) => sent.push(m);
    try {
      const mineOp = (store("roster") || []).find(o => (store("wounds") || {})[o.id] !== 0);
      const before = ((store("wounds") || {})[mineOp.id]) ?? mineOp.wounds;
      hooks.mpMessage({ type: "fightStart", id: "st1", atk: { opId: theirOps[0].id, weapon: theirOps[0].melee[0] }, def: { opId: mineOp.id } }); await settle(20);
      if (!dlg() || !/is fighting your/.test(dlg().innerText)) throw new Error("an incoming fight didn't open the Fight screen");
      await click(weaponBtn(), "our weapon");
      if (!sent.some(m => m.type === "fight" && m.action.type === "weapon")) throw new Error("our weapon choice wasn't sent");
      await click(inDlg(/^Roll \d+ dice for/), "our roll"); await click(inDlg(/^Done rolling/), "our done");
      hooks.mpMessage({ type: "fight", id: "st1", action: { type: "roll", role: "atk", dice: [6, 1, 1] } });
      hooks.mpMessage({ type: "fight", id: "st1", action: { type: "ready", role: "atk" } }); await settle(20);
      let theirs = 1;
      await fightOut(async () => { if (!theirs--) throw new Error("waiting on them with nothing left"); hooks.mpMessage({ type: "fight", id: "st1", action: { type: "act", role: "atk", kind: "strike", use: "crit" } }); await settle(20); });
      const crit = parseInt(String(theirOps[0].melee[0].dmg).split("/")[1], 10);
      const after = (store("wounds") || {})[mineOp.id];
      if (after !== Math.max(0, before - crit)) throw new Error("their strike didn't take " + crit + " wounds off " + mineOp.name + " (" + before + " to " + after + ")");
      if (!(store("battleLog") || []).some(e => e.by === theirOps[0].name && e.target === mineOp.name)) throw new Error("their strike isn't in the battle log");
      if (sent.filter(m => m.type === "fight" && m.action.type === "act").length !== sent.filter(m => m.type === "fight" && m.action.type === "act" && m.action.role === "def").length) throw new Error("we sent an action for their side");
      await click(inDlg(/^Close$/), "Close");
      // 4. Online, attacking: our Fight sends a fightStart; their cancel closes our screen.
      sent.length = 0;
      const oppBefore = JSON.stringify(store("oppWounds") || {});
      await openFight();
      if (!/ONLINE/.test(dlg().innerText)) throw new Error("the fight isn't marked online");
      await click([...dlg().querySelectorAll("button")].find(b => theirOps.some(o => b.textContent.startsWith(o.name))), "an enemy");
      const start = sent.find(m => m.type === "fightStart");
      if (!start || !start.def.opId) throw new Error("no fightStart was sent");
      hooks.mpMessage({ type: "fight", id: start.id, action: { type: "weapon", weapon: theirOps[0].melee[0] } }); await settle(20);
      await click(inDlg(/^Roll \d+ dice for/), "our roll"); await click(inDlg(/^Done rolling/), "our done");
      hooks.mpMessage({ type: "fight", id: start.id, action: { type: "roll", role: "def", dice: [1, 1, 1] } });
      hooks.mpMessage({ type: "fight", id: start.id, action: { type: "ready", role: "def" } }); await settle(20);
      await fightOut();
      if (JSON.stringify(store("oppWounds") || {}) !== oppBefore) throw new Error("online, we changed their wounds ourselves (their device owns them)");
      await click(inDlg(/^Close$/), "Close");
      await openFight();
      await click([...dlg().querySelectorAll("button")].find(b => theirOps.some(o => b.textContent.startsWith(o.name))), "an enemy");
      const start2 = sent.filter(m => m.type === "fightStart").slice(-1)[0];
      hooks.mpMessage({ type: "fight", id: start2.id, action: { type: "cancel" } }); await settle(20);
      if (dlg()) throw new Error("their cancel didn't close the Fight screen");
    } finally { delete window.__ksMpTestSend; }
    return "rules with fixed dice, a fight on one device, and both sides of an online fight";
  });
  await step("Screen stays on, crash screen", async () => {
    // Uses the game the earlier steps left running.
    if (!store("rosterLocked")) throw new Error("no game in progress to test with");
    const ok = "wakeLock" in navigator ? ["on", "requested", "refused", "hidden"] : ["unsupported"];
    if (!ok.includes(window.__ksAwake)) throw new Error("during a game the screen lock is '" + window.__ksAwake + "'");
    await click(all("button[aria-label='Settings']")[0], "Settings cog");
    const page = document.querySelector("[role=dialog][aria-label='Settings']");
    const sw = page.querySelector("[role=switch][aria-label='Keep the screen on']");
    await click(sw, "Keep the screen on (off)");
    if (window.__ksAwake !== "off") throw new Error("switching it off didn't release the screen");
    await click(sw, "Keep the screen on");
    await click(page.querySelector("[aria-label='Close']"), "close Settings");
    // A crash in one tab shows the safety screen there, with Reload, Back up and Try again; the rest of the app keeps working.
    const before = errors.length;
    window.__ksCrashTest = true;
    await nav("Community"); await settle(20);
    window.__ksCrashTest = false;
    const alert = all("[role=alert]").find(a => /Something went wrong/.test(a.textContent));
    errors.splice(before); // React reports the test crash as an error; that one is expected
    if (!alert) throw new Error("a crash didn't show the safety screen");
    for (const t of ["Reload", "Back up my data", "Try again"]) if (![...alert.querySelectorAll("button")].some(b => b.textContent.trim() === t)) throw new Error("the safety screen has no " + t + " button");
    await nav("Rules");
    if (!btn("New to Kill Team")) throw new Error("the other tabs stopped working after a crash");
    await nav("Community");
    await click([...alert.querySelectorAll("button")].find(b => b.textContent.trim() === "Try again"), "Try again");
    if (all("[role=alert]").some(a => /Something went wrong/.test(a.textContent))) throw new Error("Try again didn't bring the tab back");
    return "screen lock " + window.__ksAwake + "; crash screen shows and recovers";
  });
  await step("Tabs slide away when scrolling on phones", async () => {
    await nav("Battle");
    const bar = document.querySelector("[data-pinned]");
    const pinned = () => getComputedStyle(document.documentElement).getPropertyValue("--pinned-h").trim();
    // Scroll events only arrive with a drawn frame, which a hidden preview may not draw, so send one after each move.
    const go = async (y) => { window.scrollTo(0, y); window.dispatchEvent(new Event("scroll")); await wait(60); await settle(); };
    await go(0);
    if (document.documentElement.scrollHeight - window.innerHeight < 800) return "page too short to scroll here, skipped";
    for (const y of [200, 400, 700]) await go(y);
    const phone = window.innerWidth < 700;
    if (phone && (bar.dataset.pinned !== "hidden" || pinned() !== "0px")) throw new Error("scrolling down on a phone didn't hide the tabs");
    if (!phone && bar.dataset.pinned !== "shown") throw new Error("the tabs hid on a computer");
    await go(650);
    if (bar.dataset.pinned !== "shown" || pinned() === "0px") throw new Error("scrolling up didn't bring the tabs back");
    await go(0);
    return phone ? "hide on scroll down, back on scroll up" : "stay pinned on a computer";
  });
  await step("Appearance: themes and Match my team", async () => {
    const rgb = (h) => "rgb(" + hexRgb(h).join(", ") + ")";
    await click(all("button[aria-label='Settings']")[0], "Settings cog");
    const page = document.querySelector("[role=dialog][aria-label='Settings']");
    if (!page) throw new Error("Settings didn't open");
    const crosshair = () => document.querySelector("nav [role=img][aria-label='KillSheet'] circle:not([fill]), [role=img][aria-label='KillSheet'] g circle");
    for (const [k, t] of Object.entries(THEMES)) {
      await click(page.querySelector("[role=radio][aria-label='" + t.name + "']"), t.name + " theme");
      const body = getComputedStyle(document.body).backgroundColor;
      if (body !== rgb(t.vars.bg)) throw new Error(t.name + ": page background is " + body);
      const c = crosshair();
      if (c && getComputedStyle(c).stroke !== rgb(t.vars.accent)) throw new Error(t.name + ": the logo didn't take the accent (" + getComputedStyle(c).stroke + ")");
      if (contrast(t.vars.text, t.vars.card) < 7 || contrast(t.vars.muted, t.vars.card) < 4.5 || contrast(t.vars.accent, t.vars.card) < 4.5) throw new Error(t.name + ": text colors are too faint on its panels");
      ["hit", "miss", "gold"].forEach(k => { if (contrast(t.vars[k], t.vars.raised) < 3.5) throw new Error(t.name + ": the " + k + " dice color is too faint on its dice"); });
    }
    if ((store("appearance") || {}).theme !== Object.keys(THEMES).slice(-1)[0]) throw new Error("the theme choice wasn't saved");
    // Match my team: every team color, in every theme, is readable and doesn't look like a dice or damage color.
    const bad = [];
    Object.values(FACTIONS).forEach(f => Object.values(THEMES).forEach(t => {
      const c = teamAccent(f.color, t);
      if (contrast(c, t.vars.card) < 4.5) bad.push(f.name + " in " + t.name + " is too faint");
      MEANING_COLORS.forEach(m => { if (Math.hypot(...hexRgb(c).map((v, i) => v - hexRgb(m)[i])) < 40) bad.push(f.name + " in " + t.name + " looks like " + m); });
    }));
    if (bad.length) throw new Error(bad.slice(0, 4).join("; "));
    const sw = page.querySelector("[role=switch][aria-label='Match my team']");
    // The setting says what it does with your team, and its sample button changes color with the switch.
    const preview = () => page.querySelector("[data-match-preview]");
    const sampleCol = () => getComputedStyle(preview().querySelector("span")).color;
    const teamName = store("fid") && FACTIONS[store("fid")] ? FACTIONS[store("fid")].name : null;
    const offCol = sampleCol();
    if (teamName && !preview().textContent.includes("Off: the Battle tab uses your theme's color")) throw new Error("Match my team (off) doesn't say what it does: " + preview().textContent);
    await click(sw, "Match my team");
    if (teamName) {
      if (!preview().textContent.includes("On: the Battle tab uses the " + teamName + " color")) throw new Error("Match my team (on) doesn't name the team: " + preview().textContent);
      if (sampleCol() === offCol) throw new Error("the sample button didn't change color with Match my team");
    } else if (!/Pick a team in Battle/.test(preview().textContent)) throw new Error("Match my team doesn't say to pick a team first");
    if (!(store("appearance") || {}).matchTeam) throw new Error("Match my team didn't save");
    // It colors the Battle tab only: the logo and the root keep the theme's accent.
    const fid = store("fid"), t = Object.values(THEMES).slice(-1)[0];
    if (fid && FACTIONS[fid]) {
      const panel = document.getElementById("panel-builder"), want = teamAccent(FACTIONS[fid].color, t);
      if (getComputedStyle(panel).getPropertyValue("--accent").trim().toUpperCase() !== want) throw new Error("the Battle tab didn't take the team color");
      if (getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().toUpperCase() !== t.vars.accent.toUpperCase()) throw new Error("the team color leaked outside the Battle tab");
      const c = crosshair(); if (c && getComputedStyle(c).stroke !== rgb(t.vars.accent)) throw new Error("the logo took the team color");
    }
    await click(sw, "Match my team (off)");
    // Text size: Larger scales every screen's text by 1.25 and is saved; Normal puts it back.
    const title = () => [...document.querySelectorAll("[role=dialog][aria-label='Settings'] div")].find(d => d.textContent.trim() === "Text size");
    const px = () => parseFloat(getComputedStyle(title()).fontSize);
    const normal = px();
    await click(document.querySelector("[role=radio][aria-label='Larger']"), "Larger text");
    if ((store("appearance") || {}).text !== "larger") throw new Error("the text size wasn't saved");
    if (Math.abs(px() - normal * 1.25) > 0.6) throw new Error("Larger text is " + px() + "px, want " + normal * 1.25);
    if (getComputedStyle(document.documentElement).getPropertyValue("--ts").trim() !== "1.25") throw new Error("the page's own text sizes didn't follow");
    await click(document.querySelector("[role=radio][aria-label='Normal']"), "Normal text");
    if (px() !== normal) throw new Error("Normal didn't put the text back");
    await click(page.querySelector("[role=radio][aria-label='Default']"), "Default theme");
    await click(page.querySelector("[aria-label='Close']"), "close Settings");
    return Object.keys(THEMES).length + " themes, " + Object.keys(FACTIONS).length + " team colors checked in each, text size scales";
  });
  await step("Attack effects", async () => {
    // Every weapon on every datacard gets an effect, and each kind of effect actually draws and marks the target.
    const all = Object.values(FACTIONS).flatMap(f => f.operatives.flatMap(o => [...o.ranged.map(w => ({ ...w, type: "ranged" })), ...o.melee.map(w => ({ ...w, type: "melee" }))]));
    const byKind = {};
    all.forEach(w => { const k = fxProfile(w).kind; (byKind[k] = byKind[k] || []).push(w); });
    const box = (top) => { const d = document.createElement("div"); d.style.cssText = "position:fixed;left:20px;top:" + top + "px;width:240px;height:60px"; document.body.appendChild(d); return d; };
    const screen = document.createElement("div"); screen.setAttribute("role", "dialog"); screen.style.cssText = "position:fixed;left:0;top:0;width:300px;height:400px"; document.body.appendChild(screen);
    const a = box(40), b = box(260); screen.appendChild(a); screen.appendChild(b);
    const bad = [];
    try {
      for (const [k, ws] of Object.entries(byKind)) {
        FX.clear();
        const hit = playAttackFx(ws[0], a, b, { screen });
        if (!(hit > 0 && hit < 4000)) bad.push(k + ": hit time " + hit);
        if (!FX.count()) bad.push(k + ": nothing drawn");
      }
      FX.clear(); playBlockFx({ name: "Chainsword", wr: "-" }, b, a, { screen });
      if (!FX.count("shield") || !FX.count("spark")) bad.push("a block draws no shield or clash");
      FX.clear(); playAttackFx({ name: "Power fist", type: "melee", wr: "Brutal, Shock" }, a, b, { shock: true, screen });
      if (!FX.count("bolt")) bad.push("Shock: no lightning");
      if (!screen.getAnimations().length) bad.push("the screen doesn't shake or flash");
      await wait(1800);
      if (!b.querySelector("[data-decal]")) bad.push("no damage marks on the target");
      // Grenades scorch and crack; they don't leave bullet holes.
      const g = box(140); screen.appendChild(g);
      playAttackFx({ name: "Frag grenade", type: "ranged", wr: 'Range 6", Blast 2", Saturate' }, a, g, { screen });
      await wait(1800);
      if (!g.querySelector("[data-decal]")) bad.push("the frag grenade left no marks");
      if (g.querySelector("[data-decal='hole']")) bad.push("the frag grenade left a bullet hole");
      // The versus intro: both names move, and fire runs round the border.
      FX.clear();
      const n1 = document.createElement("div"), n2 = document.createElement("div"); a.appendChild(n1); b.appendChild(n2);
      playVersusFx(screen, [n1, n2], null);
      if (!n1.getAnimations().length || !n2.getAnimations().length) bad.push("the versus intro doesn't move the names");
      const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!calm && FX.count("fire") < 100) bad.push("the versus intro has no fire round the border");
      if (calm && FX.count("fire")) bad.push("the versus intro shows fire with Reduce Motion on");
      FX.clear();
      playHotFx(a, a);
      if (!document.querySelector("[data-fx='hot']")) bad.push("no red glow for Hot self-damage");
    } finally { screen.remove(); FX.clear(); }
    if (bad.length) throw new Error(bad.join("; "));
    // Hits earlier in the self-test left battle damage on the datacards.
    const hits = (store("battleLog") || []).filter(e => e.how === "dice").length;
    if (hits && !Object.keys(store("scars") || {}).length) throw new Error("hits didn't leave battle damage on the datacards");
    // Saved marks redraw the same each time, and on datacards they sit behind the text and buttons; the gauze stays left of the name.
    ["hole", "burn", "scorch", "melt", "slash", "crack"].forEach(k => { if (decalSvg(k, 24, 50) !== decalSvg(k, 24, 50)) throw new Error("the " + k + " mark changes every time it's drawn"); });
    document.querySelectorAll("[data-scars]").forEach(layer => {
      const content = layer.parentElement.lastElementChild;
      if (getComputedStyle(layer).zIndex !== "0" || getComputedStyle(content).zIndex !== "1") throw new Error("battle damage sits on top of a datacard's buttons");
    });
    document.querySelectorAll("[data-bandage]").forEach(g => {
      const name = g.parentElement.querySelector("[role=button] div div div");
      if (name && g.getBoundingClientRect().right > name.getBoundingClientRect().left + 1) throw new Error("the bandage covers the operative's name");
    });
    return Object.entries(byKind).map(([k, ws]) => ws.length + " " + k).join(", ");
  });
  await step("Dice faces, health bars and rolls in rules", async () => {
    const host = document.createElement("div"); document.body.appendChild(host);
    const root = ReactDOM.createRoot(host), e = React.createElement, bad = [];
    try {
      // Each face has its number of pips.
      root.render(e("div", null, [1, 2, 3, 4, 5, 6].map(v => e("span", { key: v, "data-face": v }, dieFace(v, "hit", 30)))));
      await settle();
      [1, 2, 3, 4, 5, 6].forEach(v => { const n = host.querySelectorAll("[data-face='" + v + "'] circle").length; if (n !== v) bad.push("a " + v + " shows " + n + " pips"); });
      // The health bar: full, then red when nearly out, and the card folds shut when the operative goes out of action.
      const A = FACTIONS.angels, op = A.operatives[0];
      let folds = 0;
      const card = (w) => e(FeatureCtx.Provider, { value: { feat: { fx: true } } }, e(Datacard, { op, f: A, fc: A.color, equipWeapons: [], equipEffects: [], curWounds: w, onWound() {}, collapsed: false, onToggle: () => folds++, cp: 3, setCp() {}, scars: [] }));
      root.render(card(op.wounds)); await settle();
      const meter = () => host.querySelector("[role=meter]");
      if (!meter() || meter().getAttribute("aria-valuenow") !== String(op.wounds) || meter().getAttribute("data-health") !== "100") bad.push("the health bar isn't full at full wounds");
      root.render(card(1)); await settle();
      if (!/184, 52, 28|#b8341c/i.test(meter().innerHTML)) bad.push("the health bar isn't red when nearly out");
      root.render(card(0)); await settle();
      if (folds !== 1) bad.push("an out-of-action card didn't fold shut");
      // Rolls in rule text: what each one finds, then tapping one rolls it.
      const read = (t) => ruleDiceMatches(t).map(d => d.m + (d.checks ? "[" + d.checks.map(c => c.label + (c.each ? " each" : "")).join(",") + "]" : "")).join(" ");
      [["roll one D6: on a 5+, subtract 1 from that damage.", "D6[5+]"],
       ["regains up to D3+3 wounds.", "D3+3"],
       ["roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't.", "2D6[4+ each] 1D6[4+ each]"],
       ["roll a D6. On a 1-2, try another marker (each once per turning point). On a 3+, it's reanimated.", "D6[1-2,3+]"],
       ["Roll a D3. On a 1, you lose 1CP. On a 2, you gain 1CP. On a 3, your opponent loses 1CP.", "D3[1,2,3]"],
       ["Roll 2D6. On a 7+, remove one.", "2D6[7+]"],
       ["roll 3D6. For each result of 1 to 4, you get a re-roll.", "3D6[1-4 each]"],
       ["HD6 and D60 aren't rolls.", ""],
      ].forEach(([t, want]) => { const got = read(t); if (got !== want) bad.push("\"" + t.slice(0, 30) + "\" reads as " + (got || "nothing") + ", want " + (want || "nothing")); });
      let rolls = 0;
      Object.values(FACTIONS).forEach(fc => [...(fc.factionRules || []).map(r => r.desc), ...["strategy", "firefight"].flatMap(k => ((fc.ploys || {})[k] || []).map(p => p.desc)), ...(fc.equipment || []).map(q => q.desc), ...fc.operatives.flatMap(o => o.abilities || [])].forEach(t => { if (t) rolls += ruleDiceMatches(t).length; }));
      if (rolls < 150) bad.push("only " + rolls + " rolls found in the team rules");
      root.render(e(FeatureCtx.Provider, { value: { feat: { dice: true, tips: false } } }, e(RefText, { text: "Roll 2D6. On a 7+, remove one." })));
      await settle();
      await click(host.querySelector("button[aria-label='Roll 2D6']"), "the 2D6 in a rule");
      const out = host.querySelector("[role=status]");
      if (!out || out.querySelectorAll("circle").length < 2 || !/= \d+/.test(out.textContent) || !/7\+: (yes|no)/.test(out.textContent)) bad.push("tapping a roll in a rule shows no dice, total or result: " + (out ? out.textContent : "nothing"));
      root.render(e(FeatureCtx.Provider, { value: { feat: { dice: false, tips: false } } }, e(RefText, { text: "Roll 2D6. On a 7+, remove one." })));
      await settle();
      if (host.querySelector("button")) bad.push("rolls in rules are tappable with the Dice roller off");
    } finally { root.unmount(); host.remove(); }
    if (bad.length) throw new Error(bad.join("; "));
    return "pips 1 to 6, health bar colors, out-of-action cards fold, rolls in rules read and roll";
  });
  await step("Dice maths", async () => {
    const R = (hit, wr) => diceRules({ hit, wr: wr || "" });
    const A = (dice, r, obscured) => { const x = attackResult(dice, r, obscured); return x.crits + "c " + x.hits + "h " + x.fails + "f" + (x.devastatingDmg ? " dev" + x.devastatingDmg : ""); };
    const D = (r, crits, cover) => { const d = defenceDiceCount(r, { crits }, cover); return d.roll + "+" + d.coverSave; };
    const T = (ac, ah, dc, ds, n, c, melee, brutal, dev) => damageThrough({ crits: ac, hits: ah, devastatingDmg: dev || 0 }, { crits: dc, saves: ds }, n, c, melee, brutal);
    const cases = [
      ["plain dice, Hit 3+", A([1, 2, 3, 5, 6], R("3+")), "1c 2h 2f"],
      ["Lethal 5+", A([5, 4, 2], R("3+", "Lethal 5+")), "1c 1h 1f"],
      ["Lethal 4+", A([4, 3], R("4+", "Lethal 4+")), "1c 0h 1f"],
      ["Accurate 1 sets a die aside", A([2, 6, 3], R("3+", "Accurate 1")), "1c 2h 1f"],
      ["Accurate 1 rolls one die fewer", String(R("3+", "Accurate 1").accurate), "1"],
      ["Severe", A([3, 4, 2], R("3+", "Severe")), "1c 1h 1f"],
      ["Severe's crit doesn't trigger Rending", A([3, 4], R("3+", "Severe, Rending")), "1c 1h 0f"],
      ["Rending", A([6, 3, 4], R("3+", "Rending")), "2c 1h 0f"],
      ["Punishing", A([6, 2, 1], R("3+", "Punishing")), "1c 1h 1f"],
      ["Devastating 4", A([6, 6, 2], R("3+", "Devastating 4")), "2c 0h 1f dev8"],
      ["Devastating with a distance", String(R("3+", '1" Devastating 2').devastating), "2"],
      ["Obscured: crits become normal, one lost, no Devastating", A([6, 6, 3], R("3+", "Devastating 3"), true), "0c 2h 0f"],
      ["3 defense dice", D(R("3+"), 0, false), "3+0"],
      ["Piercing 2", D(R("3+", "Piercing 2"), 0, false), "1+0"],
      ["Piercing Crits 2 with a crit", D(R("3+", "Piercing Crits 2"), 1, false), "1+0"],
      ["Piercing Crits 2 without a crit", D(R("3+", "Piercing Crits 2"), 0, false), "3+0"],
      ["cover: roll 2, keep 1", D(R("3+"), 0, true), "2+1"],
      ["Saturate ignores cover", D(R("3+", "Saturate"), 0, true), "3+0"],
      ["Piercing 1 in cover", D(R("3+", "Piercing 1"), 0, true), "1+1"],
      ["block two hits rather than pair on the crit (3/4)", String(T(1, 2, 0, 2, 3, 4)), "4"],
      ["pair two saves on a big crit (2/5)", String(T(1, 1, 0, 2, 2, 5)), "2"],
      ["crit save on the crit", String(T(1, 1, 1, 0, 3, 4)), "3"],
      ["fight: normals can't block a crit", String(T(1, 0, 0, 2, 3, 4, true)), "4"],
      ["shooting: two normals block a crit", String(T(1, 0, 0, 2, 3, 4)), "0"],
      ["fight with Brutal: only crits block", String(T(0, 2, 1, 2, 3, 4, true, true)), "3"],
      ["Devastating damage gets through a blocked crit", String(T(1, 0, 1, 0, 3, 4, false, false, 3)), "3"],
    ];
    const wrong = cases.filter(([, got, want]) => got !== want).map(([name, got, want]) => name + ": got " + got + ", want " + want);
    if (wrong.length) throw new Error(wrong.join("; "));
    return cases.length + " cases";
  });

  // Teams saved by older versions get today's datacards, keep their ids, and repeats with one id get numbered.
  await step("Add enemy roster without a code", async () => {
    await nav("Battle");
    const menu = async () => click(document.querySelector("[aria-label='More roster options']"), "the ⋯ menu");
    await menu();
    if (btn("Remove opponent's team")) { await click(btn("Remove opponent's team"), "Remove opponent's team"); await menu(); }
    await click(btn("Add enemy roster"), "Add enemy roster");
    const dlg = () => document.querySelector("[role=dialog][aria-label='Add enemy roster']");
    if (!dlg()) throw new Error("the Add enemy roster screen didn't open");
    await typeInto(dlg().querySelector("input"), "plague");
    await click([...dlg().querySelectorAll("button")].find(b => b.textContent.includes("Plague Marines")), "Plague Marines");
    const plus = (name) => dlg().querySelector("[aria-label='Add " + name + "']");
    // Team limits (on to start): one Champion, and the Fighter isn't one you can repeat.
    const lim = dlg().querySelector("[role=switch][aria-label='Team limits']");
    if (!lim || lim.getAttribute("aria-checked") !== "true") throw new Error("Team limits isn't on to start");
    await click(plus("Plague Marine Champion"), "+ Champion");
    if (!plus("Plague Marine Champion").disabled) throw new Error("team limits let a second Champion in");
    await click(plus("Plague Marine Fighter"), "+ Fighter");
    if (!plus("Plague Marine Fighter").disabled) throw new Error("team limits let a second Fighter in");
    if (!/need 4 more/.test(dlg().textContent)) throw new Error("the screen doesn't say how many more they need");
    // Off: any number of anything.
    await click(lim, "Team limits off");
    await click(plus("Plague Marine Fighter"), "+ Fighter again");
    await click([...dlg().querySelectorAll("button")].find(b => b.textContent.trim() === "Add 3 operatives"), "Add 3 operatives");
    if (dlg()) throw new Error("the screen didn't close after adding");
    const opp = store("oppRoster") || {};
    const ids = (opp.operatives || []).map(o => o.id).sort().join(",");
    if (opp.factionId !== "plaguemarines" || ids !== "champion,fighter,fighter~2") throw new Error("their roster is " + opp.factionId + ": " + ids);
    if (!document.body.textContent.includes("Plague Marine Fighter 2")) throw new Error("their second Fighter's datacard isn't showing");
    return "limits stop a second Champion or Fighter; with them off, Plague Marines with 3 operatives, repeats numbered";
  });
  await step("Hit notifications", async () => {
    await nav("Battle");
    const mineOp = (store("roster") || []).find(o => (store("wounds") || {})[o.id] !== 0);
    if (!mineOp) throw new Error("no operative of yours to hit");
    const bubbles = () => all("[data-hit-note]");
    const badge = () => { const b = document.querySelector("[data-unread]"); return b ? b.getAttribute("data-unread") : "0"; };
    hooks.mpMessage({ type: "applyRemoteDamage", opId: mineOp.id, amount: 1, by: "Boss Nob", weapon: "Big choppa" }); await settle(20);
    if (bubbles().length !== 1 || !/Boss Nob hit your .* with Big choppa: 1 damage/.test(bubbles()[0].textContent)) throw new Error("no bubble for the hit: " + bubbles().map(b => b.textContent).join(" / "));
    if (badge() !== "1") throw new Error("the Log button doesn't count the new hit (" + badge() + ")");
    hooks.mpMessage({ type: "applyRemoteDamage", opId: mineOp.id, amount: 1, by: "Kommando Boy", weapon: "Slugga" }); await settle(20);
    if (bubbles().length !== 2 || !/Kommando Boy/.test(bubbles()[0].textContent)) throw new Error("a second hit doesn't stack on top");
    if (badge() !== "2") throw new Error("the count didn't go to 2");
    const second = bubbles()[1].getAttribute("data-hit-note");
    await click(bubbles()[1], "the Boss Nob bubble");
    const log = document.querySelector("[role=dialog][aria-label='Battle log']");
    if (!log) throw new Error("tapping a bubble didn't open the battle log");
    const at = log.querySelector("[data-focus='true']");
    if (!at || at.getAttribute("data-note") !== second || !/Boss Nob/.test(at.textContent)) throw new Error("the log didn't open at that hit");
    if (document.querySelector("[data-unread]") || bubbles().length) throw new Error("opening the log didn't clear the count and bubbles");
    await click(btn("Close", true) || [...log.querySelectorAll("button")].find(b => /Close/.test(b.textContent)), "close the log");
    return "two hits stacked, counted, and the log opened at the one tapped";
  });
  await step("End-of-game recap", async () => {
    // The sums, from a made-up game.
    const log = [
      { side: "opp", target: "Boss Nob", before: 14, after: 6, how: "dice", by: "Sergeant", tp: 1 },
      { side: "opp", target: "Boss Nob", before: 6, after: 0, how: "dice", by: "Sergeant", tp: 2 },
      { side: "mine", target: "Gunner", before: 14, after: 0, how: "dice", by: "Boss Nob", tp: 2 },
      { side: "opp", target: "Boy", before: 10, after: 7, how: "dice", by: "Gunner", tp: 2 },
      { side: "mine", target: "Sergeant", before: 15, after: 12, how: "hand", tp: 3 },
    ];
    const r = gameRecap(log, { 1: { you: 2, them: 0 }, 2: { you: 2, them: 3 }, 3: { you: 6, them: 4 } });
    const vp = r.vp.map(v => v.you + "/" + v.them).join(" "), kills = r.kills.map(k => (k.theirs ? "their " : "your ") + k.target + (k.by ? " by " + k.by : "")).join(", ");
    if (vp !== "2/0 0/3 4/1") throw new Error("VP by turning point: " + vp);
    if (kills !== "their Boss Nob by Sergeant, your Gunner by Boss Nob") throw new Error("taken out: " + kills);
    if (!r.best.you || r.best.you.name !== "Sergeant" || r.best.you.dmg !== 14 || !r.best.them || r.best.them.name !== "Boss Nob") throw new Error("best operative: " + JSON.stringify(r.best));
    // On screen: the End game panel shows it, and games saved earlier in the self-test carry it.
    await nav("Battle");
    await click(document.querySelector("[aria-label='Game menu']"), "game menu");
    await click(btn("End game"), "End game");
    const panel = document.querySelector("[role=dialog][aria-label='End game']");
    if (!panel || !panel.querySelector("[data-recap]") || !/VP by turning point/.test(panel.textContent)) throw new Error("the End game panel has no recap");
    await click([...panel.querySelectorAll("button")].find(b => b.textContent.trim() === "Cancel"), "Cancel");
    const saved = (store("gameHistory") || []).find(g => g.recap);
    if (!saved || !Array.isArray(saved.recap.vp)) throw new Error("saved games don't carry a recap");
    return "VP by turning point, who took out whom, most damage; shown at the end and saved with the game";
  });
  await step("Updates and what's new", async () => {
    // The change log: newest first, every entry a known kind; nothing shows as new for a first-time player.
    const dates = CHANGELOG.map(e => e.date);
    if (dates.join() !== [...dates].sort().reverse().join()) throw new Error("the change log isn't newest first");
    if (CHANGELOG.some(e => !e.items.length || e.items.some(([k, t]) => !NEWS_KIND[k] || !t))) throw new Error("a change log entry has an unknown kind or no text");
    if (newsSince(null).length || newsSince(dates[0]).length || newsSince("2000-01-01").length !== CHANGELOG.length) throw new Error("newsSince picks the wrong entries");
    if (all("[data-notice]").length) throw new Error("a notice bar shows with nothing new");
    // The update bar: shows for a new version, Later hides it for that version only.
    const bar = () => all("[data-notice]").find(b => /A new version of KillSheet is ready/.test(b.textContent));
    window.__ksShowUpdate("selftest-a"); await settle();
    if (!bar() || ![...bar().querySelectorAll("button")].some(b => b.textContent.trim() === "Update")) throw new Error("no update bar with an Update button");
    await click(bar().querySelector("[aria-label='Later']"), "Later");
    if (bar()) throw new Error("Later didn't hide the update bar");
    window.__ksShowUpdate("selftest-a"); await settle();
    if (bar()) throw new Error("the same version came back after Later");
    window.__ksShowUpdate(null); await settle();
    // What's new, from Settings.
    await click(document.querySelector("[aria-label='Settings']"), "Settings");
    await click(btn("What's new"), "What's new");
    const page = document.querySelector("[role=dialog][aria-label=\"What's new\"]");
    if (!page || !page.textContent.includes(CHANGELOG[0].items[0][1])) throw new Error("What's new doesn't list the latest changes");
    await click(page.querySelector("[aria-label='Close']"), "close What's new");
    await click(document.querySelector("[role=dialog][aria-label='Settings'] [aria-label='Close']"), "close Settings");
    // Online: a newer opponent says so and shows the update bar; the Play online box keeps the note.
    await nav("Battle");
    const had = [window.KS_VERSION, window.KS_BUILT];
    window.KS_VERSION = "selftest-mine"; window.KS_BUILT = "2026-01-01T00:00:00Z";
    try {
      hooks.mpMessage({ type: "snapshot", payload: { v: "selftest-theirs", built: "2027-01-01T00:00:00Z" } }); await settle(20);
      if (!/Your opponent has a newer KillSheet/.test(document.body.innerText)) throw new Error("no message when the opponent's KillSheet is newer");
      if (!bar()) throw new Error("a newer opponent didn't bring up the update bar");
      hooks.mpMessage({ type: "snapshot", payload: { v: "selftest-theirs", built: "2025-01-01T00:00:00Z" } }); await settle(20);
      if (!/Your opponent's KillSheet is older/.test(document.body.innerText)) throw new Error("no message when the opponent's KillSheet is older");
    } finally {
      window.KS_VERSION = had[0]; window.KS_BUILT = had[1];
      if (had[0] === undefined) { delete window.KS_VERSION; delete window.KS_BUILT; }
      window.__ksShowUpdate(null); await settle();
    }
    return CHANGELOG.length + " change log entries; update bar and Later; What's new in Settings; online version check both ways";
  });
  await step("End game: discard", async () => {
    await nav("Battle");
    if (!store("rosterLocked")) throw new Error("no game in progress to discard");
    const games = (store("gameHistory") || []).length;
    await click(document.querySelector("[aria-label='Game menu']"), "game menu");
    await click(btn("End game"), "End game");
    await click(btn("Discard game", true), "Discard game");
    if (store("rosterLocked")) throw new Error("the game is still in progress after Discard");
    if ((store("gameHistory") || []).length !== games) throw new Error("Discard recorded the game in the history");
    if (!all("input").some(i => i.placeholder === "Search teams or factions")) throw new Error("Discard didn't go back to the team picker");
    if (!btn("Undo")) throw new Error("no Undo after discarding a game");
    return "not recorded, back at the team picker, with Undo";
  });
  await step("Old saves get current datacards", async () => {
    const pm = FACTIONS.plaguemarines;
    const old = [{ id: "champion", name: "Plague Champion", wounds: 1 }, { id: "fighter", name: "PM Fighter" }, { id: "fighter", name: "PM Fighter" }, { id: "gone_op", name: "Removed" }];
    const got = freshOps(pm, old).map(o => o.id + "/" + o.name + (o.id === "champion" ? "/" + o.wounds : "")).join(", ");
    const want = "champion/" + pm.operatives.find(o => o.id === "champion").name + "/" + pm.operatives.find(o => o.id === "champion").wounds + ", fighter/" + pm.operatives.find(o => o.id === "fighter").name + ", fighter~2/" + pm.operatives.find(o => o.id === "fighter").name + " 2, gone_op/Removed";
    if (got !== want) throw new Error("got " + got + "; want " + want);
    const today = makeInstances(pm, ["fighter", "fighter", "champion"]);
    if (JSON.stringify(freshOps(pm, today)) !== JSON.stringify(today)) throw new Error("a current roster changed when refreshed");
    return "old names and stats replaced, ids kept, repeats numbered";
  });

  // Put everything back the way it was, and stop the app saving its test state over it until reload.
  window.__ksFrozen = true;
  window.removeEventListener("error", onError);
  console.error = orig.error; window.prompt = orig.prompt; window.confirm = orig.confirm; window.alert = orig.alert;
  URL.createObjectURL = orig.createObjectURL; HTMLAnchorElement.prototype.click = orig.aClick;
  delete window.__ksNoShare;
  restoreKillSheetStorage(saved);
  selfTestBackup(null); // finished: the player's data is back, so the safety copy goes

  const passed = results.filter(r => r.ok).length;
  window.__ksSelfTest = { passed, failed: results.length - passed, results };
  panel.innerHTML = "";
  const head = document.createElement("div");
  head.style.cssText = "font:700 16px Rajdhani,sans-serif;margin-bottom:8px;color:" + (passed === results.length ? "#5A9C3A" : "#E0664A");
  head.textContent = "Self-test: " + passed + " of " + results.length + " passed";
  panel.appendChild(head);
  results.forEach(r => {
    const line = document.createElement("div");
    line.style.cssText = "padding:4px 0;border-top:1px solid var(--raised);color:" + (r.ok ? "var(--text2)" : "#E0664A");
    line.textContent = (r.ok ? "PASS  " : "FAIL  ") + r.name + (r.note ? ": " + r.note : "") + " (" + (r.ms / 1000).toFixed(1) + "s)";
    panel.appendChild(line);
  });
  const back = document.createElement("button");
  back.textContent = "Back to the app";
  back.style.cssText = "margin-top:10px;padding:8px 14px;background:transparent;color:var(--accent);border:1px solid color-mix(in srgb, var(--accent) 38%, transparent);border-radius:4px;cursor:pointer";
  back.onclick = () => { window.location.href = window.location.pathname; };
  panel.appendChild(back);
}

