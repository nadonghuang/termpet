<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Deps"/>
  <img src="https://img.shields.io/badge/Platform-Terminal-informational?style=for-the-badge" alt="Platform"/>
</p>

<h1 align="center">🐾 termpet</h1>

<p align="center">
  <strong>Your Tamagotchi lives in the terminal. Feed, play, and care for your ASCII companion.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-pet-types">Pet Types</a> •
  <a href="#-license">License</a>
</p>

---

```
  ╭────────────────────────────────────────╮
  │                                        │
  │   Mochi the cat (刚出生)                │
  │                                        │
  │     /\_/\                              │
  │    ( ^.^ )                             │
  │     > ω <                              │
  │    /|   |\                             │
  │   (_|   |_)                            │
  │                                        │
  │   心情: 😊 非常开心！                    │
  │                                        │
  │   HP    ████████████████████  100/100  │
  │   快乐  ████████████████████  100/100  │
  │   饱食  ████████████████████   95/100  │
  │   精力  █████████████████░░░   85/100  │
  │   清洁  ████████████████████   95/100  │
  │                                        │
  ╰────────────────────────────────────────╯
```

## ✨ Features

- 🐾 **6 Pet Types** — Choose from cat, dog, dragon, bunny, penguin, or fox
- 🎮 **7 Actions** — Feed, play, sleep, pet, clean, walk, and heal your companion
- 🎨 **ASCII Art** — Each pet has unique art for every mood (happy, sad, eating, sleeping, sick...)
- ⏱️ **Time-Based Decay** — Your pet's stats change over time. Neglect it and it gets sad!
- 📊 **Colored Status Bars** — Beautiful real-time stat visualization in your terminal
- 💾 **Persistent State** — Your pet survives between sessions via `~/.termpet/pet.json`
- ⭐ **XP & Leveling** — Perform actions to earn XP. Level up for bonus healing!
- 📜 **Activity Log** — Track every interaction with timestamps
- 🌈 **Zero Dependencies** — Pure Node.js, no external packages needed
- 🚫 **NO_COLOR Support** — Respects the [NO_COLOR](https://no-color.org/) standard

## 🚀 Quick Start

```bash
# Clone and run
git clone https://github.com/nadonghuang/termpet.git
cd termpet

# Create your first pet
node bin/termpet.js new cat Mochi

# Check on it
node bin/termpet.js status
```

Or install globally:

```bash
npm install -g .
termpet new dragon Blaze
```

## 📖 Usage

```bash
# Create a new pet (type required, name optional — random name if omitted)
termpet new cat Mochi
termpet new dragon         # gets a random name!

# View your pet's status
termpet status

# Care for your pet
termpet feed               # 🍖 Restore hunger
termpet play               # 🎾 Boost happiness (costs energy)
termpet sleep               # 💤 Restore energy
termpet pet                 # 🤗 Gentle happiness boost
termpet clean               # 🛁 Improve cleanliness
termpet walk                # 🚶 Overall boost (costs energy)
termpet heal                # 💊 Restore health

# Other commands
termpet rename Luna         # Rename your pet
termpet log 20              # View last 20 actions
termpet release             # Say goodbye 💔
termpet --help              # Show all commands
termpet --version           # Show version
```

## 🐾 Pet Types

| Type | Emoji | Personality |
|------|-------|-------------|
| cat | 🐱 | Independent yet affectionate |
| dog | 🐶 | Loyal and energetic |
| dragon | 🐲 | Majestic and powerful |
| bunny | 🐰 | Cute and gentle |
| penguin | 🐧 | Charming and resilient |
| fox | 🦊 | Clever and playful |

Each pet type has **7 unique ASCII art poses** that change based on their mood!

## 🧠 How It Works

### Stats System

Your pet has 5 core stats that change over time:

| Stat | Decay Rate | Affected By |
|------|-----------|-------------|
| 🍖 Hunger | -2/min | Feed (+30) |
| 😊 Happiness | -1/min | Play (+20), Pet (+10), Walk (+15) |
| ⚡ Energy | +0.5/min | Sleep (+40), Play (-15), Walk (-20) |
| 🛁 Cleanliness | -0.5/min | Clean (+40), Play (-5), Walk (-8) |
| ❤️ Health | Conditional | Heal (+25), neglect decays it |

### Warnings

When stats drop critically low, termpet warns you:

```
  ⚠️  Mochi 快饿坏了！赶紧喂食！
  ⚠️  Mochi 健康状况很差，需要治疗！
```

### Leveling

Every action earns XP. When you accumulate enough XP (level × 20), you level up and get bonus stat restoration!

## 📁 Project Structure

```
termpet/
├── bin/
│   └── termpet.js        # CLI entry point
├── lib/
│   ├── index.js          # Module exports
│   ├── pet.js            # Pet class & game logic
│   ├── renderer.js       # Terminal UI rendering
│   ├── art.js            # ASCII art definitions
│   ├── storage.js        # File persistence
│   └── actions.js        # Action definitions
├── examples/
│   └── demo.js           # Quick demo script
├── README.md
├── LICENSE
├── package.json
└── .gitignore
```

## 🤝 Contributing

Contributions welcome! Ideas:

- More pet types (hamster, turtle, owl...)
- New actions (train, teach tricks)
- Multi-pet support
- Battle system
- Network sharing

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If this made you smile, please give it a ⭐!</sub>
</p>
