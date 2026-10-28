# Device tests (for the owner)

Claude tests KillSheet in a Chrome-based browser on one computer. These checks need your own phone, or
two devices, so they can't be automated. Do them after you've dragged `deploy/` into Cloudflare Pages.
Each part takes a few minutes. Tell Claude what happened at any step that doesn't match.

## 1. The self-test on your iPhone (Safari)

1. On your iPhone, open `https://killsheet.pages.dev/?selftest`.
2. Wait about a minute. Don't tap anything. It clicks through the whole app by itself.
3. A panel shows PASS or FAIL for each step. Take a screenshot of it.

Your saved KillSheet data is put back afterwards. Close the tab and open KillSheet again before you play,
because saving is paused on that page.

## 2. Online play on two devices

You need a phone and a second device (another phone or a computer). For one round, put the phone on
mobile data instead of Wi-Fi, so the two are on different networks.

| Step | What to do | What should happen |
|---|---|---|
| 1 | On device A, pick a team, start the game, then ⋯ > Play online > Host a new game. | A room code appears. |
| 2 | On device B, pick a different team, then Play online, type the code, Join. | Both say Connected, and each shows the other's team in the opponent column. |
| 3 | On A, open a datacard, tap Shoot on a ranged weapon and pick one of B's operatives. Roll and tap Send to defender. | B switches to the Battle tab and shows the attack card with A's dice, then asks B to roll defense (with Cover and Save). After B rolls and taps Done, both screens show the damage with the attack effect, and B's operative loses the wounds on both screens. |
| 4 | On both, tap Log on the team bar. | A has the hit on the right, B has it on the left. |
| 5 | Lock the phone for one minute, then unlock it and go back to KillSheet. | It reconnects by itself, or shows "Your online game dropped" with a Rejoin button. Rejoin works. |
| 6 | On B, while disconnected, tap − on one of A's operatives twice. | B's bar says "2 changes to send". After rejoining, A's operative has lost those 2 wounds. |
| 7 | Close KillSheet completely on the host (A), then open it again. | A shows a Rejoin bar; after tapping it, both are connected in the same room. |
| 8 | On A, open a datacard and tap Fight on a melee weapon, then pick one of B's operatives. | B switches to the Battle tab and shows the Fight screen asking which weapon fights back. |
| 9 | On B, pick a weapon. Each roll on your own device and tap Done rolling. Then take turns: Strike or Block. | Both screens show both sets of dice, whose turn it is, and the slash and damage number on every strike. Wounds drop on both screens. |
| 10 | Start another fight, and on B don't answer for a minute. | A shows "Do it for them"; tapping it lets A finish the fight, and B's screen closes. |
| 11 | On A, tap Disconnect. | B says "Your opponent ended the online game" and doesn't keep trying. |

## 3. Screen and saved data on your phone

1. Start a game in KillSheet (Battle tab, Start game). Put the phone down and don't touch it for 3 minutes. The screen should stay on. End the game: the phone should dim and lock normally again.
2. In Safari (not the Home Screen app), with at least one saved roster or finished game, open the Battle tab while not in a game. A "Keep your data safe" note should suggest adding KillSheet to your Home Screen. Tap Got it; next comes a "Back up your rosters and games" note.

## 4. Offline

1. Open KillSheet on your phone once while online and let it load fully.
2. Turn on Airplane Mode and close Safari.
3. Open KillSheet again from the home screen or Safari.

It should open normally, including a mission map on the Missions tab.
