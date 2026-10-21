# Team data check (2026-10-21)

Every team in `tools/teams/` was compared with the official team rules PDF it came from
(Games Workshop's free downloads, including their errata, which the online PDFs already contain).
Inquisitorial Agents' requisitioned operatives were checked against their own teams' PDFs.

## What was checked
- Every operative's APL, Move, Save, Wounds and base size against its datacard: all 48 teams match.
- Every weapon profile (Atk, Hit, Dmg and weapon rules) against the profiles of that name in the PDF: all match.
- Every strategy ploy, firefight ploy and equipment name appears in the PDF: all found.
- The reverse: weapons in the PDF missing from our data. All 18 hits are expected
  (weapons that live in rule text, such as the Starstriders' ship weapons and Earthen Wrath;
  leader-only gear that requisitioned agents can't take; naming and footnote differences).

## Changes made
- Scout Squad, Combat Blades equipment: description now follows the PDF wording. Hunters and
  Warriors who already carry a combat blade get a combat knife (4 Atk, 3+, 4/5) instead of the
  3 Atk blade. No change in play: their own blade already has those stats.

## Looked like mistakes but aren't
- Tzaangor Warrior (blade & shield) shows Save 4+ although the datacard prints 5+. The shield's own
  rule says "This operative has a 4+ Save stat", so 4+ is what applies in play.
- Flags from the PDF text itself: weapon rules that wrap onto a second line (melta bomb, EMP bomb,
  plasma cannon), footnote marks (transuranic arquebus, twin torrent), non-breaking hyphens
  (hot-shot long-las), damage shown as "*" or "-" (tankhammer, pulsa rokkit), and words split by
  the text extraction ("KINL YNK", "ACOL YTE").

## Not checked
- Rule and ability wording (it's rewritten in plain words on purpose), ploy CP costs, and
  composition limits.

Rerun with `python3 tools/teams/pdfcheck.py <folder>` (see its docstring) when GW updates a team.
