# Arena Fortuna — Tactical Gladiator Slot Combat

[![Live Demo](https://img.shields.io/badge/🎮%20Play%20Live%20Demo-Arena%20Fortuna-gold?style=for-the-badge&logo=github)](https://cosminsh.github.io/Arena-Fortuna/)

> 🎮 **Live Demo:** [Play Arena Fortuna Vertical Slice Online](https://cosminsh.github.io/Arena-Fortuna/)  
> 📜 **Game Design Document:** [Arena Fortuna GDD (Vertical Slice & Full Game Vision)](./Arena_Reels_GDD.md)

---

## 🏛️ Overview

**Arena Fortuna** is an innovative hybrid vertical slice combining **Casino Slot Machine Mechanics** with a **Tactical RPG Gladiator Combat Engine**. Players customize gladiator archetypes, optimize pre-battle armory gear loadouts, scout rival Ludus house targets using real-time Monte Carlo win-rate simulations, and spin combat reels to execute battle strikes and shield tactics.

For detailed game design specifications, mathematical models, and long-term feature roadmaps, check out the comprehensive [Arena Fortuna Game Design Document (GDD)](./Arena_Reels_GDD.md). The GDD includes both the **Vertical Slice Prototype** specification and **Part B: Full Game Vision**, which outlines how the prototype expands into a full-scale asynchronous PvP Guild-vs-Guild RPG featuring House Wars, ELO matchmaking, build progression, and fair monetization safeguards.

---

## 🎮 Key Features

- **🎮 Playable Web Demo**: Instant browser play with zero setup required at [cosminsh.github.io/Arena-Fortuna](https://cosminsh.github.io/Arena-Fortuna/).
- **⚔️ Pre-Battle Equipment Loadouts**: Equip weapons, armor, and crests before battle. Equipment is locked once combat begins to ensure tactical commitment.
- **📊 Real-Time Monte Carlo Simulator**: Runs 500+ combat simulations live during scouting. Changing your gear loadout instantly recalculates your simulated win probability against all scouted rivals!
- **🏟️ 30+ Rival Gladiator Roster**: Scout gladiators across 6 Ludus houses (*Blood Sands Syndicate*, *Imperial Vanguard*, *Crimson Colosseum*, etc.).
- **🎰 Casino Slot Combat Engine**: 3 independent reels with 4 symbol types (Sword, Shield, Class Ability, Wild) and instant combination evaluation.
- **⚡ Archetype Soft-Triangle**: Dynamic counter-system between *Murmillo (Shield)*, *Thraex (Sica)*, and *Retiarius (Net)* yielding +15% damage multipliers.
- **📈 In-Battle Paytable & EV Drawer**: On-demand expected value breakdown (`24.5 HP/spin`, `96.2% baseline RTP`) available directly on the slot frame.
- **🔥 Momentum Streak Combo**: Consecutive winning spins generate `STREAK x2` combo multipliers.
- **💾 Session Persistence**: LocalStorage tracks Player Level, EXP, War Points, and Win/Loss records across reloads.
- **📱 Fully Responsive Design**: Seamless layout scaling optimized for mobile devices (iPhone 13 mini viewport) up to 4K displays.

---

## 🎯 Game Design & Math Model

### 1. Reel Symbol Frequencies & Weights
Each spin rolls 3 independent reels containing 4 distinct symbol types:

| Symbol | Type | Weight / Chance | Function / Effect |
| :--- | :--- | :--- | :--- |
| 🗡️ **Sword** | Offense | **35%** | Deals direct physical damage to rival |
| 🛡️ **Shield** | Defense | **30%** | Grants shield armor absorbing incoming attacks |
| ⭐ **Class Ability** | Perk | **25%** | Triggers archetype signature skill (Scutum, Sica, Net) |
| 🃏 **Wild** | Special | **10%** | Player chooses target symbol match |

### 2. Combination Payout Tier Structure
- **3-of-a-Kind (Jackpot)**: ~5.8% probability per spin. High raw output (40 Damage / +22 Shield Armor / Ultimate Perk).
- **2-of-a-Kind (Common Hit)**: ~42.3% probability per spin. Solid baseline output (25 Damage / +14 Shield Armor).
- **0-Match (Fumble)**: ~51.9% probability per spin. Low output baseline.

### 3. Archetype Soft-Triangle Counter System
- 🛡️ **Murmillo (The Shield)** ➔ Counters **Retiarius** (Resists net entangle & mitigates attrition)
- 🗡️ **Thraex (The Hooked Blade)** ➔ Counters **Murmillo** (Ignores shield armor & pierces Scutum)
- 🕸️ **Retiarius (The Net)** ➔ Counters **Thraex** (Entangles fast strikers and forces free rerolls)

---

## 📖 Game Design Document & Future Evolution

Read the full [Arena Fortuna Game Design Document](./Arena_Reels_GDD.md) to explore:

- **Part A: Vertical Slice Specification**: The immediate presentation prototype, ruleset, reel weights, and scope boundaries.
- **Part B: Full Game Vision & Roadmap**: Details how Arena Fortuna expands into a live-service RPG:
  - **Asynchronous Guild-vs-Guild (House Wars)**: Daily House matchings, player attack limits, and shared guild scoring.
  - **ELO Matchmaking & Rating System**: Fair House rating algorithms preventing high-level farming.
  - **Gladiator Build Progression**: Gear slots, talent trees, reel lock modifiers, and cosmetic banners.
  - **Competitive Monetization Safeguards**: Strict anti-pay-to-win guidelines prohibiting purchased extra rolls or competitive advantages.

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS with HSL design system, metallic gold glassmorphism, and keyframe animations
- **Icons & Visuals**: Lucide React, HTML5 Canvas Particle Engine
- **Audio Engine**: Web Audio API with synthesized sound effects & ambient background music

```text
src/
├── components/
│   ├── ArchetypeSelectView.tsx  # Archetype class selector
│   ├── BackgroundParticles.tsx  # Ambient particle canvas
│   ├── BattleView.tsx           # Slot cabinet & turn resolution stage
│   ├── GladiatorHubView.tsx     # Armory & gear equipment manager
│   ├── HeaderNav.tsx            # Navigation & Web Audio controls
│   ├── HomeView.tsx             # Landing hero view
│   ├── ProbabilityModal.tsx     # Math EV & odds breakdown modal
│   ├── ResultModal.tsx          # Match stats comparison modal
│   ├── ResultParticles.tsx      # Victory/Defeat canvas particle VFX
│   └── TargetSelectView.tsx     # Target scouting with live Monte Carlo simulation
├── engine/
│   ├── arenaParticles.ts        # Arena spark particle triggers
│   ├── audioEngine.ts           # Web Audio API sound FX engine
│   ├── mathEngine.ts            # Reel logic, combat resolution, 30+ enemy roster
│   └── storageEngine.ts         # LocalStorage profile persistence
└── types/
    └── game.ts                  # TypeScript game state interfaces
```

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open browser at:
# http://localhost:5173
```

### Production Build & Probability Simulator
```bash
# Production bundle build
npm run build

# Run Monte Carlo 100,000-spin probability simulator script
npm run simulate
```
