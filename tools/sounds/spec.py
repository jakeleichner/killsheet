# Round 3 audition: recorded sounds from the Sonniss GDC 2016 and 2026 bundles.
# Each option: len (seconds), layers [{file, at (seconds or ("on", k) = k-th shot), len, rate (<1 deeper), gain, off, lp}], note.
def L(file, **k): return dict(file=file, **k)
def O(note, length, *layers, fade=0.4): return dict(note=note, len=length, layers=list(layers), fade=fade)

def VALLEY(file, rate, echoes):
    # the shot, a low rolling rumble under it, then quieter, duller copies bouncing back
    out = [L(file, at=0.0, len=2.0, rate=rate), L(file, at=0.0, len=2.5, rate=rate * 0.5, lp=300, gain=0.5, off=0.05)]
    for off, gain, lp in echoes: out.append(L(file, at=0.0, len=1.6, rate=rate, gain=gain, lp=lp, off=off))
    return out
BOOM = "Impact_Boom_Distorted_02"
SOUNDS = [
 dict(group="Guns", n=1, name="Bolt guns", eg="Boltgun, bolt pistol", opts=[
  O("Battle rifle shot, deepened, with a distorted boom under it", 1.8, L("FN_FAL_7.62x51mm_1.5m", len=1.8, rate=0.78), L(BOOM, len=1.6, gain=0.55, lp=900, off=0.01)),
  O("Heavy sniper rifle, deepened", 2.0, L("Barrett_M98B_.338_Lapua_2m", at=0.0, len=2.0, rate=0.82)),
  O("Two heavy rifle rounds with an explosive kick", 1.9, L("M1918_Browning_Automatic_Rifle_.30cal_0.1m", len=1.9, rate=0.85), L("Explosives - Sweetners_07", len=1.6, gain=0.45, off=0.02)),
 ]),
 dict(group="Guns", n=2, name="Automatic fire", eg="Autogun, heavy stubber, shoota", opts=[
  O("Light machine gun burst", 2.2, L("HK_MG4_5.56mm_1m", len=2.2, rate=0.92)),
  O(".50 cal machine gun in a warehouse", 2.5, L("Browning_M2_.50_Machine_Gun", len=2.5)),
  O("Submachine gun burst, deepened", 1.7, L("M1928A1_Thompson_Submachine_Gun_.45cal_0.3m", len=1.7, rate=0.85)),
 ]),
 dict(group="Guns", n=3, name="Single shot", eg="Pistols and rifles that fit no other group", opts=[
  O(".44 Magnum revolver", 1.4, L("Smith_&_Wesson_M29_.44_Magnum_1.5m", len=1.4)),
  O(".45 pistol in a big warehouse", 2.0, L("Colt_M1911", len=2.0)),
  O("Hunting rifle", 1.6, L("Remington_700_7.62x51mm_1m", len=1.6)),
 ]),
 dict(group="Guns", n=4, name="Shotguns", eg="Shotgun, scattergun, blunderbuss", opts=[
  O("Pump shotgun in a warehouse", 2.2, L("Remington_870", len=2.2)),
  O("Shotgun blast and pump", 2.0, L("Shotgun_Fire_Round Eject_01", len=2.0)),
  O("Combat shotgun slug, deepened", 1.5, L("SPAS-12_12g_solid_slug_1m", len=1.5, rate=0.88)),
 ]),
 dict(group="Guns", n=5, name="Sniper rifles", eg="Long-las, sniper rifle, marksman rifle", opts=[
  O("Heavy sniper shot rolling back off valley walls", 4.5, *VALLEY("Barrett_M98B_.338_Lapua_2m", 1.0, [(0.45, .45, 3000), (0.95, .30, 1800), (1.6, .20, 1200), (2.4, .12, 800)]), fade=0.35),
  O("Sniper shot echoing between two far ridges", 5.0, *VALLEY("Sako_TRG_22_TRG_1m", 1.0, [(0.6, .42, 2500), (1.1, .30, 1800), (1.9, .22, 1100), (2.9, .13, 700), (3.6, .07, 500)]), fade=0.35),
  O("Deeper sniper shot, valley echo and a real outdoor echo tail", 4.5, *VALLEY("Barrett_M98B_.338_Lapua_2m", 0.88, [(0.5, .40, 2500), (1.2, .25, 1400), (2.1, .15, 900)]), L("Slapbacks_13", at=1.0, len=3.5, gain=0.45, lp=1200, off=0.3), fade=0.35),
 ]),
 dict(group="Guns", n=6, name="Las weapons", eg="Lasgun, hot-shot lasgun, laspistol", opts=[
  O("Energy rifle shot", 1.4, L("Energy Gun - shot_single_2", len=1.4)),
  O("Blaster shot", 1.6, L("CK_Blaster_Shot-226", len=1.6)),
  O("Energy shot over a real rifle crack", 1.4, L("Energy Gun - shot_single_2", len=1.4), L("Heckler_&_Koch_G36C_5.56mm_1m", len=0.6, gain=0.5)),
 ]),
 dict(group="Guns", n=7, name="Plasma and pulse", eg="Plasma gun, pulse rifle, volkite", opts=[
  O("Heavy energy shot", 2.1, L("DS_Heavy_03_NoReverb_Shot-2", len=2.1)),
  O("Sci-fi impact blast", 2.4, L("Signum_source_composite_impact_2", len=2.4)),
  O("Energy shot slowed right down, with a boom", 2.2, L("Energy Gun - shot_single_2", len=2.2, rate=0.6), L(BOOM, len=2.0, gain=0.5, lp=600)),
 ]),
 dict(group="Guns", n=8, name="Melta", eg="Meltagun, fusion blaster, blaster", opts=[
  O("Metal vaporizing and cracking", 2.5, L("vaporizing metal, cracking", len=2.5)),
  O("Metal buckling and melting", 2.5, L("deformation, buckling and melting", at=2.0, len=2.5)),
  O("Deep fire roar with an electric crackle", 2.5, L("FIREWhsh_Whoosh Fire Deep Growl", len=2.5), L("ELECArc_ArcDesign15", len=1.0, gain=0.4)),
 ]),
 dict(group="Guns", n=9, name="Flamers", eg="Flamer, burna, plague spewer", opts=[
  O("Deep fire roar", 2.5, L("FIREWhsh_Whoosh Fire Deep Growl", len=2.5)),
  O("Jet of flame (rocket blast-off)", 2.5, L("AEROJet_Blast Off Clean", at=5.5, len=2.5), fade=0.5),
  O("Burning roar with crackling fire", 2.5, L("Tension - warbley burning tone 1", at=0.0, len=2.5), L("24 Campfire", at=12.0, len=2.5, gain=0.5)),
 ]),
 dict(group="Explosives and powers", n=10, name="Frag grenade", eg="Frag grenade, mines, charges", opts=[
  O("Close explosion, deepened", 2.8, L("13 Fireworks_powerful", len=2.8, rate=0.8)),
  O("Cinematic boom", 3.5, L("EffectiveTrailer_Booms_Vol2_011", len=3.5)),
  O("Single blast with debris, deepened", 2.6, L("FIREWORKS_DR05_01", len=2.6, rate=0.75)),
 ]),
 dict(group="Explosives and powers", n=11, name="Krak grenade", eg="Krak, melta and haywire grenades", opts=[
  O("Heavy cinematic boom", 3.5, L("EffectiveTrailer_Booms_Vol2_075", len=3.5)),
  O("Distorted boom", 3.0, L(BOOM, len=3.0)),
  O("Huge hammer impact over a low boom", 3.0, L("Hammer Impact, huge", len=2.5, rate=0.7), L(BOOM, len=3.0, gain=0.6, lp=400)),
 ]),
 dict(group="Explosives and powers", n=12, name="Launchers", eg="Grenade launcher, missile launcher", opts=[
  O("Autocannon shot with its echo", 3.0, L("Automatic Cannon - MK44", len=3.0)),
  O("Cinematic boom", 3.5, L("EffectiveTrailer_Booms_Vol2_214", len=3.5)),
  O("Launch thump, then the blast", 3.0, L("Shotgun_Fire_Slug_01", len=0.8, rate=0.6), L("13 Fireworks_powerful", at=("on", 2), len=2.6, rate=0.8, off=0.4)),
 ]),
 dict(group="Explosives and powers", n=13, name="Electric and gauss", eg="Gauss blaster, arc rifle, tesla", opts=[
  O("Electric arc snap", 1.2, L("ELECArc_ArcDesign15", len=1.2)),
  O("Deep electric impact", 2.5, L("ELECMisc_Impact Electric Tonal Deep", len=2.5)),
  O("Arc charging up and discharging", 2.5, L("ELECArc_ArcPowerUpDesign04", at=4.0, len=2.5)),
 ]),
 dict(group="Explosives and powers", n=14, name="Psychic powers", eg="Any weapon with the Psychic rule", opts=[
  O("Evil presence surging", 3.0, L("onslaught-004", at=9.5, len=3.0)),
  O("Dark, creepy swell", 3.5, L("Transition Braam Slow Dark Creepy", len=3.5)),
  O("Death whistle scream over a bass drop", 2.2, L("Death Whistle Distortion_02", len=1.7), L("Bass Drop & Downer Fast 16", len=2.1, gain=0.6)),
 ]),
 dict(group="Melee", n=15, name="Blades", eg="Combat knife, sword, claws", opts=[
  O("Long blade swing and scrape", 1.5, L("METLFric_SWING SCRAPE", len=1.5)),
  O("Sword slice", 1.5, L("DSGNStngr_Action Deploy Units Sword Slice", len=1.5)),
  O("Metal sword cut", 1.6, L("WEAPSwrd_Sword Slide Cuts", len=1.6)),
 ]),
 dict(group="Melee", n=16, name="Power blades", eg="Power sword, force sword, power knife", opts=[
  O("Blade swing with an electric snap", 1.6, L("METLFric_SWING SCRAPE", len=1.5), L("ELECArc_ArcDesign15", len=1.0, gain=0.6, off=0.15)),
  O("Ringing metal hit with a hum", 2.0, L("METLImpt_METAL SWING HIT", len=2.0), L("ELECBuzz_Buzz27", at=1.0, len=1.5, gain=0.35)),
  O("Sharp sci-fi impact", 2.0, L("Signum_source_synth_impact_high-pitched_5", len=2.0)),
 ]),
 dict(group="Melee", n=17, name="Chainswords", eg="Chainsword, eviscerator", opts=[
  O("Chainsaw cutting at full revs", 1.6, L("chainsaw gas small engine gas pressing", at=10.0, len=1.6), fade=0.5),
  O("Big chainsaw revving", 2.2, L("chainsaw gas big engine turn on", at=0.75, len=2.2)),
  O("Saw blade biting, deepened", 2.0, L("Table Saw_Starts and Stops", len=2.0, rate=0.8)),
 ]),
 dict(group="Melee", n=18, name="Heavy blows", eg="Hammer, maul, axe, great weapons", opts=[
  O("Heavy swing to a thud, deepened", 1.8, L("SWSH_SWING IMPACTS Quick Heavy", len=1.8, rate=0.85)),
  O("Huge hammer impact", 2.0, L("Hammer Impact, huge", len=2.0)),
  O("Low metal thud with a ring", 2.5, L("Metal Hit Thud Thump Low Ring", len=2.5)),
 ]),
 dict(group="Melee", n=19, name="Power hammers and fists", eg="Thunder hammer, power fist", opts=[
  O("Huge hammer impact with an electric snap", 2.2, L("Hammer Impact, huge", len=2.2), L("ELECArc_ArcDesign15", len=1.0, gain=0.6, off=0.03)),
  O("Drum-like impact with an electric crash", 2.5, L("Impact_Drum Hit_03", len=2.5), L("ELECMisc_Impact Electric Tonal Deep", len=2.5, gain=0.5)),
  O("Low steel bulkhead hit", 2.5, L("steel bulkhead hit, low", len=2.5)),
 ]),
 dict(group="Melee", n=20, name="Punch", eg="Fists, gun butt", opts=[
  O("Body punch", 0.9, L("FGHTImpt_4 x Punch", len=0.9)),
  O("Short hard punch", 0.6, L("Stab_Punch_Hit_136", len=0.6)),
  O("Body punch, deepened", 1.0, L("FGHTImpt_4 x Punch", at=("on", 2), len=1.0, rate=0.8)),
 ]),
 dict(group="Game moments", n=21, name="Hit lands", eg="A normal hit", opts=[
  O("Punch hit, deepened", 0.7, L("Stab_Punch_Hit_136", len=0.7, rate=0.8)),
  O("Rock impact", 1.2, L("rock impact medium 26", len=1.2)),
  O("Concrete impact", 1.4, L("Rupture - Concrete_Impact_B02", len=1.4)),
 ]),
 dict(group="Game moments", n=22, name="Critical hit", eg="A critical hit", opts=[
  O("Bone crunch over a low boom", 1.6, L("Crunch_Rip_024", len=1.6), L(BOOM, len=1.6, gain=0.5, lp=500)),
  O("Cinematic hit", 3.5, L("CHT2_Cinematic_Hit_096", at=0.8, len=3.5)),
  O("Hit with a ringing chord", 3.0, L("Impact Hit Rapid Chord Reverb", len=3.0)),
 ]),
 dict(group="Game moments", n=23, name="Save", eg="A defense die saves the hit", opts=[
  O("Hit on rusty armor", 1.5, L("dry hard metal impact with rust debris", len=1.5)),
  O("Tap on hard metal", 1.2, L("Metal Old File Impact Tap", len=1.2)),
  O("Heavy metal footstep (armor clank)", 1.5, L("Robot_Footstep_Metallic_Large_03", len=1.5)),
 ]),
 dict(group="Game moments", n=24, name="Block", eg="A fight die blocks the other", opts=[
  O("Swords clashing", 1.4, L("WEAPSwrd_Sword Slide Cuts", at=("on", 2), len=1.4)),
  O("Weapon striking metal, ringing", 1.6, L("METLImpt_METAL SWING HIT", len=1.6)),
  O("Swords clashing, deepened", 1.6, L("WEAPSwrd_Sword Slide Cuts", at=("on", 4), len=1.6, rate=0.8)),
 ]),
 dict(group="Game moments", n=25, name="Hot", eg="A Hot weapon overheats", opts=[
  O("Electric buzz", 1.8, L("ELECBuzz_Buzz27", at=0.0, len=1.8)),
  O("Sizzling", 2.0, L("Tension - sizzle drips 1", at=0.0, len=2.0)),
  O("Malfunction glitch", 2.0, L("Malfunction Glitch Short", len=2.0)),
 ]),
 dict(group="Game moments", n=26, name="Operative down", eg="An operative is incapacitated", opts=[
  O("Bass drop", 2.1, L("Bass Drop & Downer Fast 16", len=2.1)),
  O("Death cry, then a heavy thud", 2.5, L("Monster_Pain_Death_121", len=1.8), L("Metal Hit Thud Thump Low Ring", len=2.0, gain=0.6, off=0.5)),
  O("Metal collapsing", 3.0, L("rusty metal impact with collapse", len=3.0)),
 ]),
 dict(group="Game moments", n=27, name="Versus", eg="The attack screen opens", opts=[
  O("Huge dark horn", 5.0, L("Huge-32", at=4.0, len=5.0)),
  O("Huge dark horn, second take", 5.0, L("Huge-67", at=1.0, len=5.0)),
  O("Dark horn with war drums", 5.0, L("Huge-67", at=1.0, len=5.0), L("Impact_Drum Hit_03", len=2.5, gain=0.8), L("Impact_Drum Hit_03", len=3.5, gain=1.0, off=1.4)),
 ]),
]
