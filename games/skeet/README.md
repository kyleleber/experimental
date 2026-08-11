# X3D Skeet & Trap Shooting Simulation

An immersive 3D clay pigeon shooting browser game built with **X3DOM**, **Tailwind CSS**, and **Vanilla JavaScript**.

Test your reflexes and accuracy across multiple shooting disciplines with customizable ballistics, target speeds, and shotgun loadouts.

## Features

### 🎯 Multiple Game Modes

* **Trap Shooting**

  * Targets launch from a single bunker directly in front of the shooter.
  * Targets fly toward (or away if configured) at randomized angles and elevations.
  * Each launch creates a different shooting challenge.

* **Skeet Shooting**

  * Targets cross laterally through the shooter's field of view.
  * Targets launch from opposing high and low houses.
  * Designed to challenge timing, tracking, and reaction speed.

### 🔫 Custom Ballistics & Loadouts

Choose your shooting configuration before stepping onto the range.

* **Cylinder Choke**

  * Wide pellet spread.
  * More forgiving at shorter ranges.

* **Modified Choke**

  * Balanced spread and precision.
  * General-purpose configuration.

* **Full Choke**

  * Tight pellet pattern.
  * Greater precision required to hit targets.

### ⚡ Target Velocity

Adjust the difficulty by changing target speed:

* **Standard Match**

  * Normal target velocity for a more traditional shooting experience.

* **Hyper-Velocity**

  * Significantly faster targets.
  * Designed for a greater reflex and tracking challenge.

### 🌐 Interactive 3D Engine

The simulation uses **X3DOM** to render and interact with the 3D shooting environment.

Features include:

* Interactive 3D shooting range
* Custom crosshair overlay
* Recoil effects
* Muzzle/recoil flashes
* Procedural clay target launching
* Procedural target shattering
* Real-time pellet physics
* Ray-based shooting calculations
* Collision and hit detection
* Dynamic target trajectories
* HUD and score tracking

## Technology Stack

| Technology             | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| **X3DOM**              | 3D scene rendering and interaction            |
| **X3D**                | Scene graph and 3D environment                |
| **Vanilla JavaScript** | Game logic, state management, and interaction |
| **Tailwind CSS**       | Interface and HUD styling                     |
| **HTML5**              | Application structure                         |
| **WebGL**              | Hardware-accelerated 3D rendering             |

## Project Structure

The game is organized into separate files to keep the 3D scene, visual styling, game logic, and ballistics calculations manageable and easier to extend.

```text
/
├── index.html
│
├── css/
│   └── styles.css
│
└── js/
    ├── ballistics.js
    └── game.js
```

### `index.html`

The main application entry point.

It is responsible for:

* Loading Tailwind CSS
* Loading the X3DOM runtime
* Defining the game's UI
* Providing the configuration modal
* Defining the X3D scene
* Setting up cameras and lighting
* Defining the ground/range environment
* Providing the initial target nodes
* Hosting the game canvas and HUD

### `css/styles.css`

Contains custom styling that supplements the Tailwind UI.

Responsibilities include:

* Custom gameplay cursor/crosshair
* Orange shooting crosshair
* Touch interaction rules
* Overflow prevention
* Gameplay-specific visual overrides
* Custom UI behavior not handled directly by Tailwind

### `js/ballistics.js`

Contains the shotgun and projectile calculations used by the simulation.

Responsibilities include:

* Converting screen coordinates into 3D shooting vectors
* Calculating pellet trajectories
* Generating multi-pellet shotgun patterns
* Applying choke-specific spread values
* Handling projectile deployment
* Performing target intersection tests
* Determining pellet/target collisions
* Supporting different ballistic configurations

The selected choke determines the resulting pellet spread:

```text
Cylinder  → Wide spread
Modified  → Balanced spread
Full      → Tight spread
```

### `js/game.js`

Contains the core game engine and application state.

Responsibilities include:

* Game initialization
* Game mode selection
* Score tracking
* Miss tracking
* HUD updates
* Target spawning
* Target launching
* Target trajectory generation
* Trap mode logic
* Skeet mode logic
* Target velocity scaling
* Difficulty management
* Firing events
* Window resize handling
* Context-menu suppression
* Game lifecycle management

Target speed can be modified using the selected difficulty:

```text
Standard Match → Normal target velocity
Hyper-Velocity → Increased target velocity
```

## How the Shooting System Works

When the player fires, the game converts the screen position of the crosshair into a corresponding 3D shooting vector.

The ballistics system then generates a series of individual pellet trajectories based on the selected choke.

Conceptually, the process is:

```text
Player fires
     │
     ▼
Screen coordinates
     │
     ▼
3D shooting vector
     │
     ▼
Generate pellet pattern
     │
     ├── Cylinder
     ├── Modified
     └── Full
     │
     ▼
Calculate pellet trajectories
     │
     ▼
Check target intersections
     │
     ▼
Register hits / misses
     │
     ▼
Target shatters
```

This allows the simulation to model the difference between a wide, forgiving pattern and a tighter precision-oriented pattern.

## Game Modes

### Trap

In Trap mode, the player shoots at targets moving away from the firing position.

Targets are generated with randomized:

* Horizontal launch angles
* Vertical launch angles
* Flight trajectories
* Target velocities

This creates a different target presentation for each launch while maintaining the basic characteristics of trap shooting.

### Skeet

Skeet mode focuses on crossing targets.

Targets are launched from opposing sides of the shooting range and travel laterally across the player's field of view.

The player must track the target and fire at the appropriate moment.

## Development Notes

The project intentionally keeps the game engine lightweight and browser-based.

The X3D scene handles the 3D environment while JavaScript controls the simulation and interaction layer.

The separation between `ballistics.js` and `game.js` allows the shooting calculations to evolve independently from the game state and target-generation logic.

This also makes it easier to add future features such as:

* Additional shooting disciplines
* New target types
* More choke configurations
* Different shotgun configurations
* Ammunition/loadout variations
* Wind effects
* Environmental conditions
* More advanced target trajectories
* Multiplayer or competitive scoring
* Additional range environments
* Sound effects and environmental audio
* More detailed target destruction

## Browser Compatibility

The game requires a modern browser with support for:

* JavaScript
* WebGL
* X3DOM
* HTML5
* CSS3

For development, running the project through a local HTTP server is recommended rather than relying exclusively on `file://` loading.

## Project Goal

The goal of this project is to create a lightweight, interactive shooting simulation that demonstrates what can be accomplished with browser-based 3D technologies without requiring a traditional game engine.

It combines **X3D/X3DOM scene rendering**, **JavaScript gameplay logic**, and **procedural ballistics** into a self-contained browser game.

## License

This project is licensed under the MIT License.

---

**X3D Skeet & Trap Shooting Simulation**

*A browser-based 3D clay shooting experience built with X3DOM and JavaScript.*
