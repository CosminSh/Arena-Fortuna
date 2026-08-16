# Arena Fortuna — Game Design Document

> **Status**: Draft / exploratory design document.  
> **Part A** documents the delivered vertical slice. **Part B** captures the broader game direction and is intentionally not a production-complete GDD.

## Document Overview
This document covers two scopes:
1. **Part A — Vertical Slice / Assignment Prototype**: the self-contained prototype built for the job assignment.
2. **Part B — Draft Full Game Direction**: the broader PvP guild-war game direction this prototype could evolve into.

---

# PART A: Vertical Slice

## A1. Purpose
Demonstrate a working slot-machine combat mechanic inside a believable PvP gladiator-war context, without building real multiplayer, backend guild systems, or server-side persistence. This is a **presentation demo**, not a functional backend.

## A2. Scope Boundaries

### Core Assignment Scope:
- One playable slot-machine combat encounter.
- Gladiator archetype selection before battle.
- Premade player House and premade enemy House.
- Target selection among premade enemy gladiators.
- Clear win/loss feedback and win-condition explanation.

### Extended Vertical Slice Implementation (Delivered Prototype):
To demonstrate maximum fidelity, the delivered vertical slice extends beyond the minimum scope:
- **30+ Gladiator Database**: 30 unique opponents across 6 distinct Ludus Houses.
- **Pre-Battle Armory & Loadouts**: Equip Weapons, Armor, and Crests before combat (gear locks upon battle entry).
- **Real-Time Monte Carlo Simulator**: Live 500-iteration combat simulation per target for scouting; win rates update live as gear is swapped.
- **LocalStorage Session Persistence**: Profile EXP, Leveling, War Points, and Win/Loss records persist across browser reloads.
- **Queen Fortuna Guidance & Tutorial**: Interactive tutorial modal and tactical counter advice.
- **House Leaderboards & Roster Presentation**: Full House War rankings and roster UI.

> **Note on Simulated Presentation Data**: In this client-side vertical slice, House War scores, leaderboards, daily reset timers, and rival house rosters are simulated presentation data. This accurately demonstrates how async guild-war state will be rendered once connected to a live backend API.

### Out of Scope for Vertical Slice:
- Real multiplayer or backend networking.
- Live server guild creation and management.
- Real ELO backend matchmaking.
- Real-money purchases or microtransactions.
- Energy systems.

## A3. Core Loop
1. Home / Gladiator setup → configure archetype and gear loadout.
2. Scout four rival targets sampled from the active rival roster.
3. Compare matchup advantage and live simulated Monte Carlo win probability.
4. Select target gladiator and enter the slot-machine combat arena.
5. Result screen provides damage breakdown, battle analytics, and profile progression.

## A4. Gladiator Archetypes

### Murmillo — The Shield
The defensive gladiator equipped with a gladius and large scutum shield.

**Ability — Scutum Wall:** Shield symbols block 25% more damage. The first Net effect received in a battle is reduced by half.

**Gameplay identity:** Reliable defense, damage reduction, and attrition.

### Thraex — The Hooked Blade
The technical duelist equipped with a curved sica and smaller shield.

**Ability — Hooked Blade:** 25% of Sword damage ignores Shields.

**Gameplay identity:** Precision offense and shield-piercing attacks.

### Retiarius — The Net
The mobile disruptor equipped with a net and trident.

**Ability — Entangling Net:** Matching two Net symbols applies Entangled, reducing the enemy's next damage by 30%. Matching three Net symbols also grants a free reroll.

**Gameplay identity:** Disruption, control, reach, and high-risk attacks.

## A5. Archetype Triangle
The prototype uses a soft matchup triangle:

- **Murmillo beats Retiarius**: its defensive identity and partial resistance to the first Net effect give it an advantage against Retiarius disruption.
- **Retiarius beats Thraex**: disruption prevents the Thraex from building offensive momentum.
- **Thraex beats Murmillo**: Hooked Blade attacks partially bypass the Murmillo's shield.

The matchup advantage should be noticeable but not decisive. It should influence the odds rather than guarantee victory.

## A6. Slot Machine
Use three reels and four symbol types with weighted probability distributions:

| Symbol | Weight | Single Reel % | Combat Function |
|---|---|---|---|
| Sword | 35 | 35.0% | Deal direct damage |
| Shield | 30 | 30.0% | Gain Shield Armor protection |
| Class symbol | 25 | 25.0% | Trigger selected gladiator's ability |
| Wild | 10 | 10.0% | Flexible symbol |

- **Wild Symbol Mechanism**: During manual play, a Wild pauses resolution and lets the player choose whether it resolves as a Sword, Shield, or Class Ability. In autoplay, it resolves automatically into the best matching combination.

The Class Ability symbol resolves according to the selected archetype: Scutum Wall for Murmillo, Hooked Blade for Thraex, and Entangling Net for Retiarius.

## A7. Win Conditions
- **Three matching symbols (19.60%)**: powerful outcome such as high damage, a strong block, or a major class ability payload. This is the exciting jackpot moment.
- **Two matching symbols (64.65%)**: standard successful outcome such as normal damage, partial defense, or a standard ability action. This is the expected common success state.
- **No pair (15.75%)**: baseline/weak effect based on the resolved symbol. A bad roll weakens the turn rather than producing a complete whiff.
- **Wild symbol**: during manual play, pauses resolution and lets the player choose whether it resolves as a Sword, Shield, or Class Ability (resolves automatically in autoplay).

The player wins the battle by reducing the enemy's health to zero before their own health reaches zero, or by having higher HP after 8 turns.

## A8. Suggested Combat Rules
- Player base HP is 100 before gear bonuses; rival HP varies by build.
- Each turn, the active player spins three reels.
- The player and enemy alternate turns.
- Sword results deal damage.
- Shield results grant Shield Armor that absorbs future damage until depleted.
- Class-symbol results activate the selected archetype ability.
- A Wild during manual play lets the player choose its resolved symbol (Sword, Shield, or Class); in autoplay, it resolves automatically.
- Battle ends when one gladiator reaches 0 HP or after a maximum of 8 turns.
- If the turn limit is reached, the gladiator with more HP wins.
- **Armory Loadouts**: Players can experiment with free gear loadouts (Weapons, Armor, Crests) to test stat variations without pay-to-win mechanics.

## A9. Screens
1. **Home** — House War standing, daily rival house overview, and navigation.
2. **Gladiator Hub** — archetype selection, armory gear loadout configuration, and profile progression.
3. **Target Scouting** — sampling 4 targets from 30+ rival roster with live 500-iteration Monte Carlo win probabilities.
4. **Battle Stage** — slot cabinet, symbol reels, HP/Shield bars, streak multipliers, floating damage popups, and paytable EV drawer.
5. **Match Result** — victory/defeat feedback, battle stats comparison, and XP/War Point progression summary.

## A10. Delivered Roster & Static Data
- **Player House**: Premade *Legio Invicta* house.
- **30+ Rival Gladiators**: 30 unique opponents spanning 6 rival Ludus Houses (*Blood Sands Syndicate*, *Imperial Vanguard*, *Crimson Colosseum*, etc.).
- **Gear Database**: 9 collectible loadout items across Weapon, Armor, and Crest slots.
- **Simulation Engine**: Live 500-iteration Monte Carlo combat simulation per target.
- **Local Persistence**: Browser LocalStorage maintains profile level, EXP, War Points, and win/loss records.

## A11. Presentation Notes
Label the build clearly as **“Arena Fortuna — PvP Guild War Concept Demo.”** Explain that the enemy is a premade or recorded opponent representing what would be another real player's async gladiator in the full game.

The prototype should demonstrate this experience:

> Choose a gladiator, inspect enemy builds, pick the matchup you believe you can win, spin the reels through a short battle, and see whether your build and luck were enough.

---

# PART B: Draft Full Game Direction

## B1. Concept
**Arena Fortuna** is a PvP-only, asynchronous, guild-vs-guild RPG. Players join a **Gladiator House**, build a single gladiator, and fight in daily House Wars. Battles are resolved by a slot-machine combat system layered with archetype identity and light build customization. There is no PvE; the community itself is the difficulty curve.

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
| Wild | Flexible symbol allowing player choice (Sword, Shield, or Class) |

For clarity, the full game may use a shared Sword/Shield/Wild set plus archetype-specific symbols, rather than putting every symbol on every reel.

## B5. Archetypes and Matchups

| Archetype | Strength | Weakness | Ability |
|---|---|---|---|
| Murmillo — The Shield | Defense, consistency, attrition | Shield-piercing attacks | **Scutum Wall:** Shield symbols block 25% more damage; first Net effect is reduced by half |
| Thraex — The Hooked Blade | Precision offense, shield bypass | Disruption and control | **Hooked Blade:** 25% of Sword damage ignores Shields |
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

## B9.1 Forge Reels — Equipment Generation

Instead of distributing equipment through traditional, disconnected loot boxes, Arena Fortuna extends its core slot-machine mechanic into item progression.

A separate **Forge Reel** system generates equipment through a short multi-reel sequence where each reel determines one property of the resulting item:

$$\text{Equipment Slot} \longrightarrow \text{Archetype Affinity} \longrightarrow \text{Rarity} \longrightarrow \text{Primary Stat} \longrightarrow \text{Special Affix}$$

A sample Forge roll might resolve as:
> **Weapon** $\rightarrow$ **Thraex** $\rightarrow$ **Legendary** $\rightarrow$ **+Damage** $\rightarrow$ **Shield Pierce**

This keeps randomized rewards intrinsically connected to the game's central visual and mechanical design language rather than moving progression into a generic chest-opening interface.

### Player Agency & Forge Mechanics
Higher-tier progression introduces tactical controls to shape the odds:
- **Reel Locking**: Lock one property reel (e.g., Slot or Rarity) before rerolling remaining properties.
- **Single Property Rerolls**: Reroll a single item property using earned materials.
- **Catalysts**: Apply crafting catalysts to elevate minimum rarity thresholds.
- **Pity Protection**: Accumulate Forge resonance toward guaranteed Legendary/Mythic items.
- **Recycling**: Dismantle unwanted equipment into specialized Forge resources.

The design goal mirrors combat: **randomness creates the outcome space, while player decisions shape the odds.**

For competitive integrity, direct real-money purchases should not provide unrestricted randomized power in ranked House Wars. The Forge primarily functions as an earned progression system, with monetization focused on cosmetics, convenience, and non-decisive advantages.

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
