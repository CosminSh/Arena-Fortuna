# Arena Reels — Prototype Vertical Slice

> **Live GitHub Pages Demo**: [https://cosminsh.github.io/Arena-Reels/](https://cosminsh.github.io/Arena-Reels/)  
> **Game Design Document**: [Arena_Reels_GDD.md](./Arena_Reels_GDD.md)

---

## 🏛️ What the Prototype Is

**Arena Reels** is a static, self-contained vertical slice prototype demonstrating a **slot-machine combat mechanic** set inside an asynchronous PvP gladiator guild war context.

This prototype represents **Part A** of the attached [Game Design Document (GDD)](./Arena_Reels_GDD.md). It delivers a complete, playable slice of battle:
- **No Backend / No Firebase / No Login**: Client-side React + TypeScript application engineered for static deployment on GitHub Pages.
- **Gladiator Archetypes**: Choose between the defensive **Murmillo**, the shield-bypassing **Thraex**, or the disruptive **Retiarius**.
- **Armory Build System**: Equip Weapons, Armor, and Crests to customize combat stats. *(All prototype gear is 100% free and unlocked to demonstrate build depth without pay-to-win mechanics).*
- **Analytical Scouting & Monte Carlo Win Rates**: Inspect rival gladiators with real **1,000-battle Monte Carlo win rate simulations** computed dynamically against your exact player build.
- **Player Agency on Wild Rolls**: When a Wild symbol is rolled, players actively choose tactical resolution (**Sword Damage**, **Shield Armor**, or **Class Ability**).
- **Interactive 3-Reel Slot Combat**: Spin reels each turn to execute attacks, shields, and unique class abilities, backed by a soft matchup triangle, auto-battle spectator mode, and Web Audio procedural sound effects.

---

## 🗺️ Application Architecture & Core User Flow

```text
┌─────────────────────────┐
│     1. HOME BRIEFING    │  Daily Guild War Roster & House Standing
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    2. GLADIATOR HUB     │  Select Archetype & Customize Free Armory Loadout
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   3. TARGET SCOUTING    │  Inspect 4 Rivals with 1,000-Battle Monte Carlo Win Rates
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    4. SLOT COMBAT       │  3-Reel Spins, Wild Tactical Choice, Auto-Battle Toggle
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   5. MATCH RESULT RECAP │  Damage & Shield Absorption Breakdown + War Points
└─────────────────────────┘
```

---

## 🎮 How to Play

1. **Enter House War**: From the home screen, click **ENTER ARENA WAR** to view the daily war briefing.
2. **Choose Archetype & Customize Gear**:
   - **Murmillo (The Shield)**: High damage mitigation; Scutum Wall boosts shield protection by +25% and reduces incoming Net disruption by 50%.
   - **Thraex (The Hooked Blade)**: Precision offense; Hooked Blade bypasses 25%–40% of enemy shields and strips enemy shield charges.
   - **Retiarius (The Net)**: Disruption & control; Entangling Net applies -30% damage reduction onto the enemy, and 3 Net symbols grant a **Free Reroll**.
3. **Scout Target via Monte Carlo Simulation**: Inspect rival gladiators in the scouting grid. See real simulated win odds calculated from 1,000 turn-by-turn combat simulations.
4. **Spin the Reels & Choose Wild Resolution**: Alternate turns against the enemy over up to **8 turns**. Use `Spacebar`, click **SPIN REELS**, or toggle **AUTO BATTLE**. When a Wild appears, choose whether it becomes **Sword**, **Shield**, or **Class**.
5. **Review Match Outcome**: Analyze side-by-side damage, shield block attribution, and tactical recaps to claim House War points.

---

## 🎲 Reel Symbols & Win Outcomes

The combat slot machine features 3 reels with 4 symbol types:

| Symbol | Name | Primary Function |
| :---: | :--- | :--- |
| 🗡️ | **Sword** | Deals direct combat damage to the target. |
| 🛡️ | **Shield** | Gains protective block charges that absorb incoming damage. |
| ⭐ | **Class Symbol** | Triggers your selected gladiator's unique archetype ability. |
| 🃏 | **Wild** | Substitutes into player-selected matching combination. |

---

## 📊 Symbol Weights & Exact Probability Math

Each reel independently samples symbols using the following weighted distribution:

| Symbol | Weight | Single-Reel Probability | 3-Reel Combination Probability |
| :--- | :---: | :---: | :---: |
| 🗡️ **Sword** | 35 | **35.0%** | **3-of-a-Kind (Jackpot)**: **19.60%** *(Exact 3 Swords: 4.29%)* |
| 🛡️ **Shield** | 30 | **30.0%** | **2-of-a-Kind (Standard)**: **64.65%** |
| ⭐ **Class Symbol** | 25 | **25.0%** | **No Match (Fumble)**: **15.75%** |
| 🃏 **Wild** | 10 | **10.0%** | *Wilds substitute into player-chosen tier* |

> 💡 **Empirical Verification**: Run `npm run simulate` in the terminal to execute a 100,000-spin Monte Carlo simulation verifying these theoretical values.

### Soft Archetype Triangle (15% Modifier)
- **Murmillo beats Retiarius**: Scutum shield reduces trident damage and cuts first Net disruption by 50%.
- **Retiarius beats Thraex**: Entangling Net (-30% debuff) locks down Thraex's high-tempo damage.
- **Thraex beats Murmillo**: Hooked Sica blade ignores 25%–40% of Murmillo's shield block.

---

## ⚡ Performance & Mobile Optimization

- **Asset Optimization**: Compressed all artwork assets down from ~9.8 MB to **~1.3 MB** (87% bundle size reduction).
- **Dynamic Mobile Layout**: Engineered with `100dvh` viewport scaling and a compact 50px Versus Header strip for small mobile screens (iPhone 13 Mini).
- **Procedural Web Audio Engine**: Real-time synthesized sound cues with zero external audio assets.

---

## 👤 My Design Decisions vs. 🤖 AI Assistance

To ensure full transparency regarding human game design judgment vs AI execution tooling:

### 👤 Designed & Engineered by Me
- **Game Concept & Scope**: Conceived the slot-machine combat mechanic within asynchronous PvP Guild Wars.
- **Gladiator Archetypes & Math Model**: Designed Murmillo, Thraex, and Retiarius stats, abilities, and the 15% soft matchup triangle.
- **Exact Probability Math**: Calculated the 19.60% / 64.65% / 15.75% exact combination matrix with Wild substitution rules.
- **Analytical Monte Carlo Scouting**: Formulated the 1,000-battle Monte Carlo simulation engine to display real win rates on target selection.
- **Player Agency & Tactical Choice**: Added player-controlled Wild resolution and shield capacity caps to eliminate stalemates.
- **Fair Monetization Vision**: Designed the Armory as a free strategy preview, keeping competitive battle fair.
- **UX & Balance Tuning**: Directed mobile responsiveness (iPhone 13 Mini layouts), typography (Cinzel Decorative / Marcellus), and Auto Battle spectator mode.

### 🤖 AI-Assisted Work (Antigravity AI / Gemini 3.6 Flash)
- **Code Generation & Scaffolding**: Generated TypeScript component structures, React hooks, and CSS styling.
- **Web Audio Synth**: Implemented procedural oscillator sound effects (ticks, stop thuds, impacts, victory chimes).
- **Generative Art Exploration**: Produced gladiator character portraits and banner graphics via latent text-to-image synthesis.
- **Refactoring & Debugging**: Assisted in responsive CSS refactoring and simulation script creation.

---

## 📄 Link to GDD

Read the full design document detailing both Part A (Prototype) and Part B (Full PvP Guild War Vision):  
👉 [Arena_Reels_GDD.md](./Arena_Reels_GDD.md)

---

## 🚀 Deployment & CI/CD Notes

### Automated GitHub Pages Workflow
Deployments are automatically handled on every push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Troubleshooting Deployment Failures
1. **Transient GitHub Actions Outages (`Failed to resolve action download info` / `500 Internal Server Error` / `503 Service Unavailable`)**:
   - **Cause**: GitHub Actions infrastructure transient API/download endpoint outage during the runner initialization phase (`Prepare all required actions`). This occurs *before* any repository code or build step executes.
   - **Resolution**: No code changes required. Navigate to **Actions** in GitHub → Select the failed workflow run → Click **Re-run all jobs** (or trigger `workflow_dispatch`).
2. **Local Build Pre-Flight Check**:
   - Always run local compilation check before pushing to ensure zero TypeScript or Vite bundle errors:
     ```bash
     npm run build
     ```

