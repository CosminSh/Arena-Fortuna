# 🎬 Arena Fortuna — Evaluator Demo & Presentation Guide

> **Live Application URL:** [https://cosminsh.github.io/Arena-Fortuna/](https://cosminsh.github.io/Arena-Fortuna/)  
> **Game Design Document:** [Arena Fortuna GDD (Part A & Part B)](./Arena_Fortuna_GDD.md)

---

## ⏱️ 60–90 Second Interactive Evaluation Script

Follow this step-by-step walkthrough script to experience all core combat mechanics, mathematical models, and presentation details in under 90 seconds.

### 1. Home Hub & House War Context (0:00 – 0:15)
- Open the application at [cosminsh.github.io/Arena-Fortuna/](https://cosminsh.github.io/Arena-Fortuna/).
- **What to observe:**
  - **Visual Presentation**: Dark fantasy Roman arena glassmorphic design, dynamic background particle canvas, and Web Audio sound effects.
  - **House War Scoreboard**: Displays daily House War standing (`Legio Invicta` vs `House of the Golden Falcon`).
  - **Queen Fortuna Guidance**: Click **Queen Fortuna Tutorial** in the top bar to inspect interactive guidance cards.

### 2. Rival Scouting & Monte Carlo Simulations (0:15 – 0:30)
- Click **ENTER WAR** on the home screen to access the **Scout Rival Targets** view.
- **What to observe:**
  - **30+ Rival Roster**: Samples 4 gladiators across 6 Ludus houses (*Blood Sands Syndicate*, *Imperial Vanguard*, etc.). Click `Refresh List` to sample new opponents.
  - **Monte Carlo Win Rate Badges**: Each card displays real-time predicted win probabilities (`% Sim Win Rate`) calculated via 500+ Monte Carlo combat simulations.

### 3. Pre-Battle Gear Loadouts & Live Odds Recalculation (0:30 – 0:45)
- Click the green **CHANGE GEAR** button in the scouting header.
- Swap your weapon (e.g., to *Hooked Sica of the Viper*) or crest (e.g., *Warhorn Crest of Mars*).
- **What to observe:**
  - As you equip or unequip gear items, your Monte Carlo win probabilities against all 4 scouted rivals **recalculate live in real-time**!
  - Demonstrates tactical build preparation before committing to battle.

### 4. Slot Combat Cabinet & Turn Resolution (0:45 – 1:15)
- Click **CHALLENGE** on any rival gladiator to enter the Arena Stage.
- **What to observe:**
  - **🔒 Gear Locked Indicator**: Player card displays `🔒 GEAR LOCKED`, enforcing tactical commitment once combat begins.
  - **Reel Roll Matrix**: Click **SPIN REELS** or press `SPACEBAR`. Reels roll 4 symbol types (Sword 35%, Shield 30%, Class Ability 25%, Wild 10%).
  - **Archetype Soft Triangle**: Observe +15% counter damage callouts (e.g. *Thraex* vs *Murmillo*).
  - **Streak Multiplier**: Consecutive winning spins accumulate a `🔥 STREAK x2+` multiplier granting +5% damage per streak level.
  - **Paytable & EV Modal**: Click **PAYTABLE & EV** on the slot cabinet to view exact mathematical expected values (`24.5 HP/spin` base output).

### 5. Battle Result & Stats Comparison (1:15 – 1:30)
- Finish the 8-turn match or reduce the rival HP to 0.
- **What to observe:**
  - **Result Modal**: Inspect match analytics comparing total damage dealt, shield absorbed, jackpot frequency, and XP earned.
  - **LocalStorage Persistence**: Return home to see your persistent Player Level, EXP bar, and War Points update automatically.

---

## 🎯 Game Design Document (GDD) Alignment

This vertical slice is built strictly according to the specifications in the [Arena Fortuna Game Design Document](./Arena_Fortuna_GDD.md):

| Feature / System | GDD Section | Vertical Slice Implementation |
| :--- | :--- | :--- |
| **Probability Matrix** | Section A6 & A7 | Exact 19.60% Jackpot / 64.65% Common / 15.75% Fumble probability weights |
| **Archetype Triangle** | Section A5 | Murmillo > Retiarius > Thraex > Murmillo soft-counter (+15% damage) |
| **Pre-Battle Loadouts** | Section A8 | Pre-fight equipment customization with live win-rate recalculations |
| **Monte Carlo Scouting** | Section A11 | Real-time 500+ simulation engine evaluating opponent builds |
| **Full Game Vision** | Part B | Asynchronous House Wars, ELO matchmaking, and fair monetization safeguards |

---

## 💻 Developer & Engineering Highlights

- **Pure TypeScript Math Engine**: `src/engine/mathEngine.ts` implements deterministic combat resolution, symbol evaluation, and `getGearStats()` property aggregation.
- **Automated Unit Test Suite**: `npm test` runs automated assertions validating probabilities, combination tiers, gear stats, and matchup simulations.
- **Continuous Integration**: GitHub Action workflow (`.github/workflows/test.yml`) automates build and test verification on every push.
- **Web Audio API Engine**: Custom synthesized sound effects (spins, clicks, hits, shield blocks, jackpots) with background music toggle.
