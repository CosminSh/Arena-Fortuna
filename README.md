# Arena Fortuna — Tactical Gladiator Slot Combat

**Arena Fortuna** is an innovative hybrid vertical slice combining **Casino Slot Machine Mechanics** with a **Tactical RPG Gladiator Combat Engine**. Players customize gladiator archetypes, equip armory gear, scout rival house targets using Monte Carlo win-rate simulations, and spin combat reels to execute battle strikes and shield tactics.

---

## 🎯 Game Design & Math Model

### 1. Reel Symbol Frequencies & Probabilities
Each spin rolls 3 independent reels containing 4 distinct symbol types:

| Symbol | Type | Weight / Chance | Function / Effect |
| :--- | :--- | :--- | :--- |
| 🗡️ **Sword** | Offense | **35%** | Deals direct physical damage to rival |
| 🛡️ **Shield** | Defense | **30%** | Grants shield armor absorbing incoming attacks |
| ⭐ **Class Ability** | Perk | **25%** | Triggers archetype signature skill (Scutum, Sica, Net) |
| 🃏 **Wild** | Special | **10%** | Player chooses target symbol to complete combination |

### 2. Combination Payout Tier Structure
- **3-of-a-Kind (Jackpot)**: ~5.8% probability per spin. High raw output (40 Damage / +22 Shield Armor / Ultimate Perk).
- **2-of-a-Kind (Common Hit)**: ~42.3% probability per spin. Solid baseline output (25 Damage / +14 Shield Armor).
- **0-Match (Fumble)**: ~51.9% probability per spin. Low output baseline.

### 3. Expected Value (EV) & Win Rates
- **Expected Damage Output**: `24.5 HP / Spin`
- **Baseline Win Return to Player (RTP)**: `96.2%` against standard target builds.

### 4. Archetype Soft Triangle (+15% Damage Perk)
The 3 gladiator archetypes form a dynamic soft-triangle counter system:
- 🛡️ **Murmillo (The Shield)** ➔ Favored against **Retiarius** (Resists net entangle & mitigates attrition)
- 🗡️ **Thraex (The Hooked Blade)** ➔ Favored against **Murmillo** (Ignore shield armor & pierces Scutum)
- 🕸️ **Retiarius (The Net)** ➔ Favored against **Thraex** (Entangles fast strikers and forces free rerolls)

---

## 🎮 Key Features

- **30+ Enemy Gladiator Database & Scouting**: Scout gladiators across 6 Ludus houses (*Blood Sands Syndicate*, *Imperial Vanguard*, *Crimson Colosseum*, etc.). Click `Refresh List` to sample 4 random rivals.
- **Monte Carlo Win Rate Simulator**: Runs 500-1,000 real-time combat simulations for every scouted opponent to display predicted win probabilities before entering battle.
- **In-Battle Paytable & EV Drawer**: On-demand payout table and math breakdown available right on the slot machine frame.
- **Streak / Momentum Combo Multiplier**: Successive winning spins build a `🔥 STREAK x2` combo boost.
- **Local Storage Session Persistence**: Player EXP, Level, Total War Points, and Win/Loss records persist across browser reloads.
- **Mobile Responsive Design**: Optimized for small resolution viewports (including iPhone 13 mini) with single-row formatting and non-scrolling modal action controls.
- **Canvas Particle VFX**: Dynamic gold/emerald victory sparkles and crimson/ash embers.

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS with HSL design system, metallic gold glassmorphism, and keyframe animations
- **Icons & Visuals**: Lucide React, HTML5 Canvas Particle Engine
- **Audio Engine**: Web Audio API with synthesized sound effects & background music

```text
src/
├── components/
│   ├── ArchetypeSelectView.tsx  # Archetype picker
│   ├── BackgroundParticles.tsx # Ambient background particles
│   ├── BattleView.tsx           # Slot cabinet & turn resolution stage
│   ├── GladiatorHubView.tsx     # Armory & gear equipment
│   ├── HeaderNav.tsx            # Header & audio/music controls
│   ├── HomeView.tsx             # Landing hero view
│   ├── ProbabilityModal.tsx     # Math & odds modal
│   ├── ResultModal.tsx          # End battle stats comparison modal
│   ├── ResultParticles.tsx      # Victory/Defeat canvas particles
│   └── TargetSelectView.tsx     # Target scouting with Monte Carlo simulation
├── engine/
│   ├── arenaParticles.ts        # Arena spark trigger
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

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open browser at:
# http://localhost:5173
```

### Production Build
```bash
npm run build
```
