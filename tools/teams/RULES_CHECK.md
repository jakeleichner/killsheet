# Rules wording check (October 2026)

Every team's faction rules, ploys, equipment, operative abilities and team-building rules in
`tools/teams/<team>.py` were compared with the official team PDFs, including each PDF's update log.
The app rewrites rules in plain words on purpose, so only changes of meaning were fixed: numbers,
distances, timing, who a rule affects, and missing conditions.

## How card text and errata were weighed
- The newest dated errata section (for example "ERRATA AUGUST '26") beats the card text. Where the
  card text in the PDF hadn't caught up yet, the app follows the errata and the item is listed below.
- An older "PREVIOUS ERRATAS" entry that the card text doesn't show was left as the app had it and
  listed below. We can't tell from the PDF which one Games Workshop means to be current.

## Wording used for repeated rules
- Medic!-type rules end with: "It can't be used if this operative is incapacitated, or if it's a
  Shoot action and this operative would be a primary or secondary target."
- Breach-type rules: operatives within 1" of the marker treat parts of that terrain feature up to 1"
  thick as Accessible.
- "(or vice versa)" action limits read "(before or after)".

## Fixes
- Angels of Death: Stealthy needs a cover save and doesn't stack with Vantage; Tilting Shields is used before re-rolls.
- Battleclade: Breach wording; Mechanosuture Array exclusions.
- Blades of Khaine: The Woe can't follow other actions.
- Blooded: Glory Kill target must be visible to a Blooded (April '26 errata).
- Breachers: Breach Point wording; Close Assault covers heavy shotguns; Deck Hand covers welded-shut hatches.
- Brood Brothers: Crossfire is shooting or fighting, not retaliating; Medic! exclusions; Mind Control control-range condition; Explosives before or after.
- Canoptek Circle: the matrix is the nodes plus 20mm lines between them; Reanimate exclusions.
- Celestian Insidiants: declining Zealous Ultimatum is melee only.
- Chaos Cult: the secondary gift must differ from the first.
- Corsair Voidscarred: Pistol Barrage before or after; Slicing Attack line wording.
- Death Korps: Medic! exclusions (also used by the Inquisitorial requisition).
- Elucidian Starstriders: ship weapons are Heavy (Reposition only); Reputation to Maintain has 5 uses; Medic! exclusions; Uncompromising Fire before or after.
- Exaction Squad: Medic! exclusions.
- Exodite Dragon Masters: Sprint and Turn can't be used while counteracting.
- Fellgor Ravagers: Uncompromising Attack must target an enemy in its control range if it shoots while in one.
- Gellerpox: Rust Emanations is Nightmare Hulks only (August '26 errata).
- Goremongers: Rake only works on a Charge in the operative's own activation.
- Hearthkyn Salvagers: Medic! exclusions.
- Hernkyn: Bonds That Bind can't pick the Bombast either way.
- Hunter Clade: Protector and Conqueror deprecations don't stack with being injured; Scrapcode Overload needs one contesting enemy within 3" of the Infiltrator, not the marker.
- Inquisitorial: Irrefutable Report uses your mission markers; Pistol Barrage before or after; Scion Medic! exclusions; Quarry lasts the turning point.
- Kasrkin: Medic! exclusions; Melta Mine can't be placed in enemy control range.
- Kommandos: Breach wording; Grappling Hook (no Charge or Fall Back after); Sneaky Zogger beats Seek and Vantage.
- Novitiates: Whip Into Frenzy makes one Fight free and doesn't stack (August '26 errata); Medic! exclusions.
- Pathfinders: Drone pick-ups are objective markers only; Medic! exclusions.
- Phobos Strike Team: Medic! exclusions.
- Plague Marines: Grandfather's Blessing heals the Champion; Virulent Poison also works in a counteraction; Poisonous Demise also deals 1 damage to newly poisoned enemies.
- Ratlings: Slingshot before or after; Survival Instincts doesn't work when retaliating.
- Raveners: Tunnel markers are placed in the first four turning points only (0 to 4); Death from Below is melee weapons only.
- Sanctifiers: Commanding Declamation is only used up when the roll works.
- Scout Squad: Ambush checks "hidden from all enemies" at the start of the activation.
- Spectre Squad: Medic! exclusions; Scout Terrain is within 3" of the Guide; Load Weapon before or after.
- Tempestus Aquilons: Maintain Momentum doesn't work when retaliating.
- Vespid: Communion targeting wording.
- Void-dancer Troupe: Luck of the Laughing God is once per turning point across all Players.
- Wolf Scouts: Cast the Runes costs 1CP in total.
- Wrecka Krew: Demolition Job excludes Bomb Squigs and works with no Wrecka points.
- Wyrmblade: Divert and Disappear's 3" limit is only on the Charge.
- XV26 Stealth Battlesuits: Bonds of Unity picks Move or Hit, not both; Patient Hunters doesn't work when retaliating.

No changes needed: Farstalker Kinband, Hand of the Archon, Hierotek Circle, Legionaries, Mandrakes,
Murderwing, Nemesis Claw, Warpcoven and Deathwatch.

## Owner decisions (Oct 30, 2026)
- Newest errata: apply them. Gellerpox Rust Emanations (Nightmare Hulks only), Novitiates Whip Into Frenzy and Blooded Glory Kill were already applied and stay; Brood Brothers Telepathic Overload now follows the August '26 errata ("until the end of that operative's activation").
- Older errata the printed card doesn't show: keep following the card (the cards were printed after that errata). The list below stays for reference.

Older errata the card text doesn't show (the app follows the card unless noted):
- Breachers: two Gunners allowed (errata) vs up to two Gunners each different (card).
- Battleclade Reserve Cells; Wolf Scouts Frost Weapons and Spiritual Chirurgy; Pathfinders Art of War and Photon Grenade.
- Gellerpox: Mutoid Vermin equipment twice. Novitiates: Defenders of the Faith.
- Hierotek Chronometron: app uses shooting, fighting and retaliating (errata); card says shooting.
- Vespid: leftover Communion points removed each Ready step.
- Murderwing: Carving Blow counts as a Fight action; Slice the Veil 2AP.
- Exaction Squad: Revelatum Spot is SUPPORT, shooters within 3" only.
- Kasrkin: Cover Retreat "another ready Kasrkin"; Long-range Scope limits.
- Blades of Khaine: Rain of Tears can Dash or Fall Back.
- Canoptek Circle: Aggressive Defence deals D3.
- Elucidian Starstriders: Survivalist and Uncompromising Fire range limits.
- Legionaries: Quicksilver Speed when retaliating; Fickle Fates Relentless; Soul Gorge on Critical Dmg.
- Nemesis Claw: Vox Scream costs 1 more CP each use.
- Ratlings: Target Designation needs line of sight; Purloined Rations not with Lucky Round.
- Scout Squad: Ambush ranged only; Stealth Relocation can change order; Track Enemy expended enemies only; Combat Blades knife (app follows the errata).
- Void-dancer Troupe: The Curtain Falls can Dash.
- Warpcoven: Capricious Plan Dash and/or change order; Arcane Robes once per Sorcerer.
- Deathwatch: The Shield That Slays covers Critical Dmg; Special Issue Ammunition list has Rending instead of Saturate.
