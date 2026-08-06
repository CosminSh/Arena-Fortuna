# Arena Reels — Game Design Document

## Document Overview
This document covers two scopes:
1. **Part A — Vertical Slice / Assignment Prototype**: the small, self-contained demo to build now for the job assignment.
2. **Part B — Full Game Vision**: the complete PvP guild-war game this prototype could become.

---

# PART A: Vertical Slice

## A1. Purpose
Demonstrate a working slot-machine combat mechanic inside a believable PvP gladiator-war context, without building real multiplayer, guild systems, or persistence. This is a **presentation demo**, not a functional backend.

## A2. Scope Boundaries
**In scope:**
- One playable slot-machine combat encounter.
- Simple gladiator archetype selection before battle.
- A premade player House and premade enemy House.
- Target selection among 3–5 premade enemy gladiators.
- Clear win/loss feedback and win-condition explanation.

**Out of scope:**
- Real multiplayer or networking.
- Guild creation and management.
- Real ELO or matchmaking.
- Gear inventory, shops, or currencies.
- Energy systems.
- Daily reset logic.
- Persistence/save systems.
- Multiple game modes.

## A3. Core Loop
1. Home screen shows the player's premade House and today's enemy House.
2. Player chooses one gladiator archetype.
3. Player views 3–5 enemy gladiators and chooses one to fight.
4. Battle plays out over several turns using the slot machine.
5. Result screen explains the outcome, important rolls, and archetype interactions.

## A4. Gladiator Archetypes

### Murmillo — The Shield
The defensive gladiator equipped with a gladius and large scutum shield.

**Ability — Scutum Wall:** Shield symbols block 25% more damage. The first Net effect received in a battle is reduced by half.

**Gameplay identity:** Reliable defense, damage reduction, and attrition.

### Thraex — The Hooked Blade
The technical duelist equipped with a curved sica and smaller shield.

**Ability — Hooked Blade:** 25% of Sword damage ignores Shields. Two Sword symbols remove one enemy Shield charge.

**Gameplay identity:** Precision offense and shield-piercing attacks.

### Retiarius — The Net
The mobile disruptor equipped with a net and trident.

**Ability — Entangling Net:** Matching two Net symbols applies Entangled, reducing the enemy's next damage by 30%. Matching three Net symbols also grants a free reroll.

**Gameplay identity:** Disruption, control, reach, and high-risk attacks.

## A5. Archetype Triangle
The prototype uses a soft matchup triangle:

- **Murmillo beats Retiarius**: the large shield reduces trident damage and resists net disruption.
- **Retiarius beats Thraex**: disruption prevents the Thraex from building offensive momentum.
- **Thraex beats Murmillo**: Hooked Blade attacks partially bypass the Murmillo's shield.

The matchup advantage should be noticeable but not decisive. It should influence the odds rather than guarantee victory.

## A6. Slot Machine
Use three reels and four symbol types:

| Symbol | Meaning |
|---|---|
| Sword | Deal direct damage |
| Shield | Reduce incoming damage or gain protection |
| Class symbol | Trigger the selected gladiator's ability |
| Wild | Counts as any symbol |

For the prototype, the class symbols can be represented by simple icons:
- Scutum for Murmillo.
- Sica for Thraex.
- Net for Retiarius.

## A7. Win Conditions
- **Three matching symbols**: powerful outcome such as high damage, a strong block, or a major class ability. This is the exciting jackpot moment.
- **Two matching symbols**: standard successful outcome such as normal damage, partial defense, or a weaker ability. This is the expected common success state.
- **No pair**: weak outcome, such as minimal damage or no useful effect. A bad roll should weaken the turn rather than automatically lose the battle.
- **Wild symbol**: substitutes for another symbol and reduces the frustration of an unlucky roll.

The player wins the battle by reducing the enemy's health to zero before their own health reaches zero. The slot result determines the immediate action, while archetype abilities and matchup bonuses influence the effectiveness of that action.

## A8. Suggested Combat Rules
- Each character starts with 100 HP.
- Each turn, the active player spins three reels.
- The player and enemy alternate turns.
- Sword results deal damage.
- Shield results reduce damage on the following turn.
- Class-symbol results activate the selected archetype ability.
- A Wild substitutes into the best available match.
- Battle ends when one gladiator reaches 0 HP or after a maximum of 8 turns.
- If the turn limit is reached, the gladiator with more HP wins.

## A9. Screens
1. **Home** — player House, enemy House, and “Enter War” button.
2. **Gladiator Select** — choose Murmillo, Thraex, or Retiarius.
3. **Target Select** — choose one of 3–5 enemy gladiators showing name, archetype, and short build description.
4. **Battle** — reel display, class icons, HP bars, ability text, and combat log.
5. **Result** — victory/defeat, winning rolls, damage breakdown, and return button.

## A10. Static Data
- One player House name.
- One enemy House name.
- Three to five premade enemy gladiators.
- Archetype, HP, and ability for each enemy.
- Symbol table and win-condition rules.
- Static daily war score or rank display.

## A11. Presentation Notes
Label the build clearly as **“Arena Reels — PvP Guild War Concept Demo.”** Explain that the enemy is a premade or recorded opponent representing what would be another real player's async gladiator in the full game.

The prototype should demonstrate this experience:

> Choose a gladiator, inspect enemy builds, pick the matchup you believe you can win, spin the reels through a short battle, and see whether your build and luck were enough.

## A12. Timebox
- 30 minutes: symbols, combat rules, abilities, and enemy data.
- 60–90 minutes: reel logic and outcome resolution.
- 30–60 minutes: battle UI and damage feedback.
- 30–60 minutes: archetype and target-selection screens.
- 30–60 minutes: polish, testing, and assignment explanation.

---

# PART B: Full Game Vision

## B1. Concept
**Arena Reels** is a PvP-only, asynchronous, guild-vs-guild RPG. Players join a **Gladiator House**, build a single gladiator, and fight in daily House Wars. Battles are resolved by a slot-machine combat system layered with archetype identity and light build customization. There is no PvE; the community itself is the difficulty curve.

## B2. Design Pillars
- **Agency within randomness:** builds and choices shape the odds; the slot decides the moment.
- **Community-driven difficulty:** every opponent is a real player's build rather than a scripted enemy.
- **Legible fairness:** players should understand why they won or lost.
- **One strong mode:** initial depth comes from builds, matchups, and social structure rather than many modes.
- **Arena identity:** every character, ability, and reward reinforces gladiatorial competition.

## B3. Full Core Loop
1. Player joins or forms a Gladiator House.
2. Houses are matched daily against similarly ranked rival Houses.
3. Each player receives a limited number of attacks, such as 3–5.
4. Players inspect enemy builds and select targets strategically.
5. Battles resolve asynchronously against saved opponent builds.
6. Individual wins contribute to House War score.
7. The winning House gains rank and shared resources.
8. Players use resources to improve gear and specialize their gladiators.
9. The next daily war begins against a new rival House.

## B4. Full Combat System

### Battle Structure
- Turn-based combat.
- Three-reel slot resolution for every action.
- Players can influence reel results through gear, talents, locks, and rerolls.
- One symbol may be locked between turns, subject to limits.
- Combat remains readable: the player sees what each symbol and ability does.

### Expanded Symbols
| Symbol | Function |
|---|---|
| Sword | Direct damage |
| Shield | Block or damage reduction |
| Class symbol | Activates archetype-specific ability |
| Trident | High damage or reach effects for Retiarius |
| Net | Disruption and control for Retiarius |
| Sica | Shield-piercing effects for Thraex |
| Scutum | Strong defensive effects for Murmillo |
| Wild | Flexible symbol |

For clarity, the full game may use a shared Sword/Shield/Wild set plus archetype-specific symbols, rather than putting every symbol on every reel.

## B5. Archetypes and Matchups

| Archetype | Strength | Weakness | Ability |
|---|---|---|---|
| Murmillo — The Shield | Defense, consistency, attrition | Shield-piercing attacks | **Scutum Wall:** Shield symbols block 25% more damage; first Net effect is reduced by half |
| Thraex — The Hooked Blade | Precision offense, shield bypass | Disruption and control | **Hooked Blade:** 25% of Sword damage ignores Shields; two Sword symbols remove one Shield charge |
| Retiarius — The Net | Disruption, reach, tempo control | Direct pressure against heavy defense | **Entangling Net:** two Net symbols apply Entangled, reducing next enemy damage by 30%; three Net symbols grant a free reroll |

The intended matchup cycle is:

```text
Murmillo beats Retiarius
Retiarius beats Thraex
Thraex beats Murmillo
```

These are soft advantages. Matchup bonuses should generally create a 5–20% effective swing, not an automatic win.

## B6. Player Builds
Players customize their gladiator through:
- Archetype selection.
- Passive ability upgrades.
- Gear that changes symbol weights or effects.
- Limited reel locks and rerolls.
- Talents that convert symbols into specialized outcomes.
- Cosmetic equipment, banners, armor, and House colors.

Example builds:
- **Murmillo Bulwark:** stronger Shield results and counter-damage after blocking.
- **Thraex Executioner:** more Sword symbols and increased damage against shielded targets.
- **Retiarius Controller:** stronger Net effects and additional reroll opportunities.

## B7. Gladiator Houses
Players belong to Houses that function as guilds.

House features:
- House name, banner, colors, and description.
- Member roster and individual contributions.
- Daily rival House.
- House rank and seasonal leaderboard.
- Shared war rewards.
- Optional House roles and recruitment tools.

“House” is preferable to a generic guild label because it supports the gladiator fantasy: members fight for reputation, glory, and the status of their arena House.

## B8. Daily House War
- One House is matched against another each day.
- Matching uses an ELO-style House rating.
- Each player receives a limited number of attacks.
- Players choose which rival gladiators to challenge.
- Each successful attack contributes points to the House score.
- The House with the higher score wins the war.
- Rank changes at the end of the war cycle.
- Both sides receive rewards, with the winning side receiving more.

### Target Selection Safeguards
To prevent easy farming:
- Rival rosters can be visible but may show limited build information.
- High-value targets may have attack limits.
- Players may have a limited number of scouting actions.
- A target may provide reduced points after being defeated repeatedly.
- Matchmaking should consider active roster size and participation, not only House rating.

## B9. Progression
Progression is entirely PvP-focused.

Players improve through:
- War rewards.
- House participation rewards.
- Gear upgrades.
- Archetype talent choices.
- Alternate loadouts.
- Seasonal cosmetic rewards.

The design should avoid requiring a PvE campaign or artificial enemy ladder. The player community supplies the changing challenge.

## B10. Monetization
The recommended model protects ranked competition.

**Appropriate monetization:**
- Cosmetics.
- House banners and arena presentation.
- Extra build or loadout slots.
- Battle pass rewards.
- Convenience features.
- Faster but not exclusive progression.

**Avoid in ranked House Wars:**
- Buying extra battle rolls.
- Buying additional attacks.
- Purchasing rerolls that directly affect a live war result.
- Selling stronger symbols or guaranteed jackpots.
- Energy purchases that let a paying player overcome bad luck through repeated attempts.

Gear can be the RPG progression layer, but competitive power should be earnable through play and carefully capped. Monetization should primarily sell identity, customization, and time savings rather than direct victory.

## B11. Matchmaking and Rating
- Each House has an ELO-style rating.
- Daily opponents are selected within a rating band.
- Rating changes depend mainly on House War result and opponent strength.
- Individual performance can affect contribution rewards without replacing the House rating.
- Seasonal resets should compress ratings rather than fully erase them.

## B12. Async Battle Presentation
An attack uses the opponent's saved character data and defense configuration. The attacker sees a battle replay after the result is generated.

The replay should show:
- Opponent name and House.
- Archetype and visible build information.
- Reel results turn by turn.
- Ability activations.
- Damage and mitigation breakdown.
- Final result and rating impact.

This makes a premade-looking battle feel like a real encounter with another player's custom gladiator.

## B13. Risks and Mitigations
| Risk | Mitigation |
|---|---|
| Slot results feel too random | Let builds influence symbol weights and provide limited locks/rerolls |
| Matchups become automatic victories | Keep archetype bonuses moderate and preserve counterplay |
| Strong Houses dominate permanently | Use ELO matching, seasonal compression, and participation balancing |
| Target selection becomes obvious | Limit scouting, protect high-value targets, and vary scoring |
| Async PvP feels lifeless | Add detailed replays, House identity, notifications, and meaningful war outcomes |
| Game feels pay-to-win | Remove paid extra rolls and paid competitive rerolls from ranked wars |
| Game loses gladiator identity | Use arena language, historical-inspired equipment, House presentation, and crowd feedback |

## B14. Possible Post-Launch Additions
These are deliberately excluded from the first release:
- Additional gladiator archetypes such as Secutor, Hoplomachus, Provocator, or Dimachaerus.
- Seasonal House tournaments.
- House territories or arena prestige.
- Replay sharing and spectator features.
- Cosmetic arena themes.
- Rivalry events between Houses.
- Archetype-specific seasonal rule variations.

The first full release should still focus on one mode: daily asynchronous Gladiator House Wars.
