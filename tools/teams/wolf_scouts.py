PLASMA_PISTOL = [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
BLADE5 = ("Combat blade", 5, "3+", "4/5", "-")
BLADE4 = ("Combat blade", 4, "3+", "4/5", "-")

def scout(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 3, "move": '7"', "save": "3+", "wounds": 13, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "wolfscouts", "source": "wolf_scouts", "name": "Wolf Scouts", "badge": "SPACE WOLVES", "color": "#7A9AB5",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Fenrisian Wolf", "desc": "1 Fenrisian Wolf", "min": 1, "max": 1, "ids": ["fenrisian_wolf"]},
            {"name": "Wolf Scouts", "desc": "5 Wolf Scouts from the list below", "min": 5, "max": 5,
             "ids": ["pack_leader", "fangbearer", "frosteye", "gunner", "trapmaster", "skjald", "hunter"]},
        ],
        "repeatable": ["hunter"],
        "rules": [
            "Select 1 Fenrisian Wolf.",
            "Select 5 Wolf Scouts. Other than Hunters, each only once (the Pack Leader is optional).",
        ],
    },
    "factionRules": [
        ("Hunting Astartes", "Two Shoot or two Fight per activation. Two Shoots: +1AP for the second if both use a plasma gun/pistol; can't pick two PSYCHIC ranged weapons. Counteract regardless of order; counteracting wholly within your STORM, can change order first (or instead of an action)."),
        ("Elemental Storm", "STRATEGIC GAMBIT: (re)place your Storm marker. Operatives wholly within 6\" horizontally of it are wholly within your STORM. Wolf Scouts can Charge on Conceal if they end wholly within your STORM."),
    ],
    "ploys": {
        "strategy": [
            ("Storm's Bite", "Fighting an enemy wholly within your STORM: its melee Atk -1 (min 3)."),
            ("Savage Fighters", "After retaliating, if alive and still in its control range: inflict D3+1 dmg on that enemy."),
            ("Cloaked by the Storm", "Shot while wholly within your STORM: re-roll one defence die."),
            ("Tempestuous Wrath", "Fighting/retaliating while (or after starting the activation) wholly within your STORM: melee weapons gain Balanced."),
        ],
        "firefight": [
            ("Touched by Lokyar", "After rolling attack dice for a Wolf Scout (not the Wolf) fighting >5\" from other friendlies: re-roll any."),
            ("Transhuman Physiology", "A Wolf Scout (not the Wolf) is shot: retain one normal defence success as a crit."),
            ("Acute Senses", "On Shoot: ranged weapons gain Range 6\" and Seek Light; enemies can't be obscured."),
            ("Counterattack", "End of an enemy's activation, or after it Fights: one Wolf Scout makes a free Fight against that enemy only."),
        ],
    },
    "equipment": [
        {"id": "wolfteeth", "name": "Wolfteeth Necklaces", "desc": "Once/TP attacking (not the Wolf): with 2+ fails, discard one to retain another as normal.", "ex": ["fenrisian_wolf"]},
        {"id": "trophies", "name": "Talismanic Trophies", "desc": "Fighting/retaliating wholly within your STORM (not the Wolf): -1 dmg from one normal success.", "ex": ["fenrisian_wolf"]},
        {"id": "frost_weapons", "name": "Frost Weapons", "desc": "Wholly within your STORM: combat blades gain Lethal 5+."},
        {"id": "runic_charms", "name": "Runic Charms", "desc": "Once/TP, shot wholly within your STORM (not the Wolf): attacker's Piercing worsened by 1.", "ex": ["fenrisian_wolf"]},
    ],
    "operatives": [
        {"id": "fenrisian_wolf", "name": "Fenrisian Wolf", "apl": 2, "move": '8"', "save": "5+", "wounds": 9, "pts": "60x35",
         "ranged": [], "melee": [("Fangs", 4, "3+", "4/5", "Rending")],
         "abilities": ["Instinctive Predator: Only Charge, Dash, Fall Back, Fight, Guard, Reposition. Only its own weapons. Can Charge while Concealed.",
                       "Pounce: Once/battle STRATEGIC GAMBIT, if APL 2+: free Charge, Fall Back or Reposition; then -1 APL and none of those actions until end of its next activation."],
         "kw": "FENRISIAN WOLF"},
        scout("pack_leader", "Pack Leader", PLASMA_PISTOL, [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
              ["Lupine Guile: Once/battle, after the initiative roll-off (if in killzone): re-roll your dice.",
               "Grizzled Veteran: First time it would be incapacitated: stays on 1 wound, can't be incapacitated that action; all remaining attack dice discarded (no Counterattack or Savage Fighters damage after)."],
              "PACK, LEADER"),
        scout("fangbearer", "Fangbearer", [("Absolvor bolt pistol", 4, "3+", "4/5", 'Range 8", Piercing Crits 1')], [BLADE5],
              ["Spiritual Chirurgy: Wolf Scouts (not the Wolf) ignore injured stat changes (incl. weapons) if this was selected, even after it's incapacitated.",
               "Healing Balms (1AP): Wolf Scout in control range regains up to D3+3 wounds. Once/TP; not within enemy control range."],
              "FANGBEARER"),
        scout("frosteye", "Frosteye", [("Instigator bolt carbine", 4, "3+", "3/4", "Piercing Crits 1, Silent")], [BLADE4],
              ["Storm-veiled Execution: Wholly within your STORM: can Guard in any killzone, even on Conceal.",
               "Hunter's Senses (1AP): Until its next activation, its carbine gains Severe, or Saturate + enemies can't be obscured. Not within enemy control range."],
              "FROSTEYE"),
        scout("gunner", "Gunner", [("Plasma gun (std)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (super)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [BLADE4],
              ["Tempest's Fury: Wholly within your STORM: plasma gun gains Punishing and supercharge loses Hot."],
              "GUNNER"),
        scout("trapmaster", "Trapmaster", PLASMA_PISTOL, [BLADE5],
              ["Haywire Mine: Carries your Haywire Mine marker; can Pick Up it, but can't place it in another operative's control range.",
               "Proximity Mine: First time the mine is in another operative's control range: remove it, that operative -1 APL until end of its next activation and takes 2D3+3 dmg (D3+6 within 6\" of your Storm marker); if it survives, its action ends. The Trapmaster is ignored."],
              "TRAPMASTER"),
        scout("skjald", "Rune Priest Skjald", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Jaws of the World Wolf", 4, "3+", "3/5", 'PSYCHIC, Blast 2", Severe'),
                                               ("Thunderclap", 5, "2+", "2/2", 'PSYCHIC, Range 6", Saturate, Seek Light, Stun, Torrent 2"')],
              [("Runic stave", 5, "3+", "4/6", "PSYCHIC, Shock")],
              ["Cast the Runes: Before the battle roll 3D6. Each 1-4: one 0CP Command Re-roll in that TP. Any 5-6: gain 1CP.",
               "Call the Storm (1AP): PSYCHIC. Re-place your Storm marker, OR pick a Wolf Scout: until this one's next activation, while wholly within your STORM and >3\" from the active operative, it's obscured. Not within enemy control range."],
              "PSYKER, RUNE PRIEST SKJALD"),
        scout("hunter", "Hunter", PLASMA_PISTOL, [BLADE5],
              ["Fierce Temperament: Wholly within your STORM: weapons gain Severe."],
              "HUNTER"),
    ],
}
