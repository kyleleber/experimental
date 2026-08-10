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

The game is organized into focused modules responsible for the major systems within X3PLORER:

```text
├── index.html        # Game entry point and X3D scene
├── game.js           # Game state, game loop, and initialization
├── config.js         # Configuration, constants, and shared state
├── player.js         # First-person controls, aiming, and movement
├── monsters.js       # Creature spawning, AI, flanking, and combat behavior
├── combat.js         # Weapons, raycasting, projectiles, and scoring
├── world.js          # Procedural terrain, environment, lighting, and sky
└── ui.js             # HUD, radar, reload indicators, and game UI
```

## Gameplay

X3PLORER drops the player into a procedurally generated 3D arena populated by hostile creatures.

The player must move through the environment, identify threats using the tactical radar, and engage enemies using the game's weapon systems.

Creatures use several AI behaviors to make encounters more dynamic, including:

* Procedural spawning
* Player pursuit
* Flanking
* Combat engagement
* Movement and positioning

The goal is to create an active arena environment without relying on a heavyweight game engine.

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
