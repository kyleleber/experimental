# X3PLORER - 3D Browser Arena Shooter

**X3PLORER** is a lightweight, high-performance 3D browser-based arena shooter built with vanilla JavaScript, Tailwind CSS, and X3DOM.

The game is part of a larger collection of experimental browser-based projects and is served through the project's main application at:

```text
/games/x3plorer
```

X3PLORER explores the use of declarative 3D graphics, procedural world generation, custom organic modeling, and lightweight game AI directly in the browser.

## Features

* Procedural world generation
* Custom low-poly organic creature models
* Active tactical radar system
* Hostile creature AI
* First-person movement and mouse aiming
* Raycast-based weapon mechanics
* Projectile simulation
* Enemy pursuit and flanking behaviors
* Dynamic combat and scoring
* Browser-based WebGL rendering

## Tech Stack

| Technology             | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| **X3DOM / WebGL**      | Declarative 3D rendering and scene management |
| **Vanilla JavaScript** | Game logic, AI, combat, and interaction       |
| **Tailwind CSS**       | Game UI and HUD styling                       |
| **ES Modules**         | Modular JavaScript architecture               |

## Game Structure

The game is organized into focused, object-oriented modules:

```text
├── index.html                  # Game entry point and X3D scene
├── game.js                     # Main entry point, wires systems together
├── config.js                   # Configuration, constants, and shared state
├── modules/
│   └── core/
│       ├── GameEngine.js       # Core animation loop and system management
│       ├── Player.js           # First-person controls and movement
│       ├── EntityManager.js    # Entity spawning, AI, and collection logic
│       ├── CombatSystem.js     # Weapons, raycasting, and scoring
│       └── UIManager.js        # HUD, radar, and UI state management
├── world/                      # Procedural world generation modules
│   ├── forest.js               # Tree and obstacle generation
│   ├── wildlife.js             # Bird and squirrel population
│   └── ...                     # Mountains, sky, water
└── models/                     # External X3D models (tree.x3d, etc.)
```

## Features

* **OO Architecture**: Resilient and extensible system-based design.
* **Procedural World**: Dynamic generation of terrain, forests, and wildlife.
* **Scary AI**: Hostile creatures with pursuit, flanking, and terrifying visual designs.
* **Objectives**: Collectible Target objects scattered across the arena.
* **Tactical Radar**: Real-time tracking of threats.
* **Animated Wildlife**: Procedural birds and squirrels with improved detail.

## Controls

| Input          | Action           |
| -------------- | ---------------- |
| **W**          | Move forward     |
| **A**          | Move left        |
| **S**          | Move backward    |
| **D**          | Move right       |
| **Mouse**      | Look / Aim       |
| **Left Click** | Fire weapon      |
| **Q**          | Tactical reload  |
| **R**          | Reset simulation |

## 3D Rendering

X3PLORER uses **X3DOM** to provide declarative 3D scene rendering through X3D markup and WebGL.

Rather than relying on a traditional game engine, the project keeps the rendering and game systems relatively lightweight, allowing the game to run directly in a modern browser.

The creatures and environment use custom low-poly geometry designed specifically for the project.

## Project Context

X3PLORER is one of several experimental projects contained within the larger sandbox application.

The parent application is responsible for discovering and presenting the individual games, while each game maintains its own implementation and supporting assets.

This separation allows individual experiments to explore different technologies, rendering approaches, gameplay mechanics, and ideas without turning each experiment into a completely separate application.

## Status

**Experimental / In Development**

X3PLORER is an ongoing browser game experiment. Gameplay systems, creature behavior, 3D models, environments, and visual effects may continue to evolve as the project develops.
