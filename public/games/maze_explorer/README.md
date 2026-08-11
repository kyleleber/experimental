# 3D Procedural Maze Game

A browser-based 3D maze game built with JavaScript, Tailwind CSS, and X3DOM.

Every maze is generated on the fly, so you get a new layout whenever you start a new game. Find your way from the starting point to the glowing exit before the clock runs out — or take your time and see how fast you can escape.

## Features

### 🧩 Randomly Generated Mazes

Every game can generate a different maze, with customizable width and height.

The maze is built automatically and turned into a fully navigable 3D environment with walls, pathways, lighting, fog, and a glowing exit point.

### 🎮 First-Person Exploration

Move through the maze from a first-person perspective using your keyboard and mouse.

Mouse movement lets you look around while keyboard controls handle movement. The game also keeps you from walking through walls, so you'll need to actually find your way through the maze instead of taking the direct route.

### ⏱️ Two Ways to Play

Choose how much pressure you want.

**Stopwatch**

Take your time and see how quickly you can escape. Your best times are saved locally so you can try to beat your previous record.

**Countdown**

Set a time limit and try to make it out before the clock hits zero. When time starts running low, the HUD gives you a visual warning that you're running out of time.

### 🗺️ Built-In Minimap

Lost?

Press **H** to bring up a top-down map of the maze. The minimap shows where you are and which direction you're facing, making it easier to get your bearings when you've completely lost track of where you are.

### ⚙️ Customize Your Maze

The configuration panel lets you change things like:

* Maze width and height
* Tile size
* Wall height
* Player movement speed
* Timer mode
* Countdown time

**WARNING: Too large of a map can cause memory & performance issues. There is also a maximum stack size for nodes created. So be aware!**

You can experiment with smaller mazes for quick games or build something much larger when you're feeling ambitious.

### 💾 Save and Load Mazes

Want to keep a particular maze?

Export the current maze and its settings as a JSON file and load it again later.

This also makes it easy to share a specific maze with someone else and see who can escape it faster.

### 🏆 Best Times

Your best times are saved in your browser using local storage.

There's no account, server, or leaderboard involved. It's just there to keep track of your personal records while you play.

---

## Controls

| Key / Action   | What It Does                     |
|----------------|----------------------------------|
| **W**          | Move forward                     |
| **S**          | Move backward                    |
| **Mouse**      | Look around                      |
| **R**          | Reset your position              |
| **H**          | Toggle the minimap               |
| **Left Click** | Start exploring / lock the mouse |
| **ESC**        | Release the mouse                |

> **Tip:** Click inside the game to lock your mouse before you start looking around. Press **ESC** whenever you need to get your mouse back.

---

## How It Works

The game starts by creating a maze based on the settings you choose. That maze is then turned into a 3D environment that you can walk through.

As you explore, the game keeps track of your position, movement, collisions, timer, and whether you've reached the exit.

When you find the glowing gold target at the end of the maze, you've made it out.

Simple idea. Surprisingly easy to get turned around.

---

## Project Structure

The project is split into a few pieces, with each one handling a specific part of the game:

* **`index.html`** — The main game page, including the controls, HUD, minimap, and 3D game area.
* **`main.js`** — Starts the game.
* **`Game.js`** — Handles the overall game state, timers, controls, saved times, and importing/exporting mazes.
* **`MazeGenerator.js`** — Creates the maze and determines where the exit goes.
* **`Player.js`** — Handles player movement, looking around, collisions, and reaching the exit.
* **`Renderer.js`** — Builds the 3D maze and puts the walls, paths, lighting, fog, and exit into the scene.
