# Arena Reels — Prototype Vertical Slice

> **Live GitHub Pages Demo**: [https://cosminsh.github.io/arena-reels-prototype/](https://cosminsh.github.io/arena-reels-prototype/)  
> **Game Design Document**: [Arena_Reels_GDD.md](./Arena_Reels_GDD.md)

---

## 🏛️ What the Prototype Is

**Arena Reels** is a static, self-contained vertical slice prototype demonstrating a **slot-machine combat mechanic** set inside an asynchronous PvP gladiator guild war context.

This prototype represents **Part A** of the attached [Game Design Document (GDD)](./Arena_Reels_GDD.md). It delivers a complete, playable slice of battle:
- **No Backend / No Firebase / No Login**: Pure client-side React + TypeScript application engineered for static deployment on GitHub Pages.
- **Gladiator Archetypes**: Choose between the defensive **Murmillo**, the shield-bypassing **Thraex**, or the disruptive **Retiarius**.
- **Scouting & Matchups**: Inspect enemy builds, win record, and predicted win odds before challenging rival gladiators from the opposing House (*House of the Golden Falcon*).
- **Interactive 3-Reel Slot Combat**: Spin the reels each turn to execute attacks, shields, and unique class abilities, backed by a soft matchup triangle and Web Audio procedural sound effects.

---

## 🎮 How to Play

1. **Enter House War**: From the home screen, click **ENTER WAR & SELECT GLADIATOR** to view the daily war briefing.
2. **Choose Archetype**: Select one of the 3 gladiator classes:
   - **Murmillo (The Shield)**: High damage mitigation; Scutum Wall boosts shield protection by +25% and reduces incoming Net disruption by 50%.
   - **Thraex (The Hooked Blade)**: Precision offense; Hooked Blade bypasses 25%–40% of enemy shields and strips enemy shield charges.
   - **Retiarius (The Net)**: Disruption & control; Entangling Net applies -30% damage reduction onto the enemy, and 3 Net symbols grant a **Free Reroll**.
3. **Scout & Select Target**: Inspect the 4 rival gladiators in the scouting grid. Note their archetype matchups and predicted win probability.
4. **Spin the Reels**: Alternate turns against the enemy over up to **8 turns**. Spin the slot machine to trigger combat outcomes.
5. **Review Match Outcome**: On defeat or victory, analyze the damage composition breakdown and return to claim House War points.

---

## 🎲 Reel Symbols & Win Outcomes

The combat slot machine features 3 reels with 4 symbol types:

| Symbol | Name | Primary Function |
| :---: | :--- | :--- |
| 🗡️ | **Sword** | Deals direct combat damage to the target. |
| 🛡️ | **Shield** | Gains protective block charges that absorb incoming damage. |
| ⭐ | **Class Symbol** | Triggers your selected gladiator's unique archetype ability. |
| 🃏 | **Wild** | Substitutes into the highest available matching combination. |

### Win Outcomes Table
- **3-of-a-Kind (Jackpot)**: Maximum power outcome (e.g., 40–45 direct damage, 45 shield block, or full archetype ability trigger with reflect / free rerolls).
- **2-of-a-Kind (Standard Success)**: Expected common success state (20–28 damage or 20 shield block).
- **No Pair (Fumble)**: Weak roll outcome; minimal damage (8–10 HP). A bad roll weakens the turn rather than causing an instant loss.

---

## 📊 Symbol Weights & Probability Logic

Each reel independently samples symbols using the following weighted distribution:

| Symbol | Weight | Single-Reel Probability | 3-Reel Combination Probability |
| :--- | :---: | :---: | :---: |
| 🗡️ **Sword** | 35 | **35.0%** | **3-of-a-Kind (Jackpot)**: ~14.8% *(Exact 3 Swords: 4.29%)* |
| 🛡️ **Shield** | 30 | **30.0%** | **2-of-a-Kind (Standard)**: ~68.4% |
| ⭐ **Class Symbol** | 25 | **25.0%** | **No Match (Fumble)**: ~16.8% |
| 🃏 **Wild** | 10 | **10.0%** | *Wilds substitute to raise match tier* |

### Soft Archetype Triangle (15% Modifier)
- **Murmillo beats Retiarius**: Scutum shield reduces trident damage and cuts first Net disruption by 50%.
- **Retiarius beats Thraex**: Entangling Net (-30% debuff) locks down Thraex's high-tempo damage.
- **Thraex beats Murmillo**: Hooked Sica blade ignores 25%–40% of Murmillo's shield block.

---

## 🤖 AI Tools Used

- **Antigravity AI (Gemini 3.6 Flash High)**: Architected the application structure, combat math engine, state management, and UI component hierarchy.
- **Latent Text-to-Image Synthesis (`generate_image`)**: Created custom Roman arena banner artwork and gladiator character portraits (`murmillo.png`, `thraex.png`, `retiarius.png`).
- **Web Audio API Synth Engine**: Synthesized real-time sound effects (spin ticks, reel stop thuds, hit impacts, jackpot chimes, victory fanfare) procedurally without external audio dependencies.

---

## 💡 Key Design Decisions

1. **Legible Fairness**: Every turn's math calculation (base damage, triangle bonus, shield absorption, debuff reduction) is clearly output in a live scrollable combat log.
2. **Agency Within Randomness**: Rather than pure luck, players exert agency by choosing advantageous archetype matchups, using Retiarius rerolls, and optimizing target selection.
3. **Zero Backend Complexity**: By keeping the vertical slice 100% static, evaluators can immediately test and play the demo on GitHub Pages without server deployment delays or auth barriers.
4. **Embedded Math Inspector**: Added a dedicated **"Math & Odds"** drawer directly inside the UI so reviewers can inspect probabilities in real time.

---

## 📄 Link to GDD

Read the full design document detailing both Part A (Prototype) and Part B (Full PvP Guild War Vision):  
👉 [Arena_Reels_GDD.md](./Arena_Reels_GDD.md)
