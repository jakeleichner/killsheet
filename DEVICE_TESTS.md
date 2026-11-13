# Device tests (for the owner)

Claude tests KillSheet in a Chrome-based browser on one computer. These checks need your own phone, or
two devices, so they can't be automated. Do them once a push has gone live (GitHub shows a green tick).
Each part takes a few minutes. Tell Claude what happened at any step that doesn't match.

## 1. The self-test on your iPhone (Safari)

1. On your iPhone, open `https://killsheet.app/?selftest`.
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
| 3 | On A, open a datacard, tap Shoot on a ranged weapon, pick one of B's operatives and roll. | As soon as A's dice show a hit, B switches to the Battle tab and asks B to roll defense (with Cover and Save); A can still re-roll until then. After B rolls and taps Done, both screens play the attack effect and show the damage, and B's operative loses the wounds on both screens. If a phone has Reduce Motion on (Settings, Accessibility, Motion), it shows a red glow instead. |
| 4 | On both, tap Log on the team bar. | A has the hit on the right, B has it on the left. |
| 5 | Lock the phone for one minute, then unlock it and go back to KillSheet. | It reconnects by itself, or shows "Your online game dropped" with a Rejoin button. Rejoin works. |
| 6 | On B, while disconnected, tap − on one of A's operatives twice. | B's bar says "2 changes to send". After rejoining, A's operative has lost those 2 wounds. |
| 7 | Close KillSheet completely on the host (A), then open it again. | A shows a Rejoin bar; after tapping it, both are connected in the same room. |
| 8 | On A, open a datacard and tap Fight on a melee weapon, then pick one of B's operatives. | B switches to the Battle tab and shows the Fight screen asking which weapon fights back. |
| 9 | On B, pick a weapon. Each roll on your own device and tap Done rolling. Then take turns: Strike or Block. | Both screens show both sets of dice, whose turn it is, and the slash and damage number on every strike. Wounds drop on both screens. |
| 10 | Start another fight, and on B don't answer for a minute. | A shows "Do it for them"; tapping it lets A finish the fight, and B's screen closes. |
| 11 | Start a shot on A and roll the attack dice. Before B rolls defense, put B on Airplane Mode for 20 seconds (or lock it for a minute), then reconnect and rejoin. | B's attack card is still there with A's dice; B can roll defense and A gets the result. Same if A's phone reloads the page: the screen comes back with its dice. |
| 12 | On A, tap Disconnect. | B says "Your opponent ended the online game" and doesn't keep trying. |

## 3. Screen and saved data on your phone

1. Start a game in KillSheet (Battle tab, Start game). Put the phone down and don't touch it for 3 minutes. The screen should stay on. End the game: the phone should dim and lock normally again.
2. In Safari (not the Home Screen app), with at least one saved roster or finished game, open the Battle tab while not in a game. A "Keep your data safe" note should suggest adding KillSheet to your Home Screen. Tap Got it; next comes a "Back up your rosters and games" note.

## 4. Offline

1. Open KillSheet on your phone once while online and let it load fully.
2. Turn on Airplane Mode and close Safari.
3. Open KillSheet again from the home screen or Safari.

It should open normally, including a mission map on the Missions tab.

## 5. Accounts and cloud backup (passed Nov 14; repeat after big changes to sign-in or backup)

These need your real email and Google account, so Claude can't do them. While accounts are hidden, opening `killsheet.app/?accounts` turns on the Account button in that browser. The Home Screen app has no address bar, so check it right after going live.

| Step | What to do | What should happen |
|---|---|---|
| 1 | On your computer, open `killsheet.app/?accounts`. Cog, Account, Continue with Google. Pick the Google account listed as a test user. | You land back on KillSheet with "You're signed in." |
| 2 | On your phone, in Safari, open `killsheet.app/?accounts`. Cog, Account, type the same email, Email me a code. | A code arrives within a minute (check spam). |
| 3 | Type the code and tap Sign in. | You're on the same account. Rosters saved on the computer appear on the phone. |
| 4 | Save a roster on one device. Account, Back up now on that device, then again on the other. | The roster shows up on both. |
| 5 | Delete that roster on one device. Back up now on both, as in step 4. | It's gone from both. |
| 6 | Read `killsheet.app/privacy` and `killsheet.app/terms`. | Tell Claude anything to change. Check the line saying feedback is deleted once it's been dealt with: you'd delete messages on the admin page after handling them. |
| 7 | After going live: open the Home Screen app. Cog, Account, email code. | Signs in with the code. Continue with Google isn't offered there. |

## 6. Back gesture and online hits (Nov 13)

| Step | What to do | What should happen |
|---|---|---|
| 1 | On an Android phone, open Settings, then What's new. Swipe back (or press Back). | What's new closes, Settings stays. Swipe back again: Settings closes. Once more: you leave KillSheet as usual. |
| 2 | On Android, open the ⋯ game menu and swipe back. Then open Shoot on a datacard and swipe back. | Each closes, and you stay on the Battle tab. |
| 3 | Online on two phones: turn on Airplane Mode on phone B for 20 seconds while phone A shoots one of B's operatives. Turn it off. | When B reconnects, the hit lands once, not twice, and A's "changes to send" count goes back to none. |

