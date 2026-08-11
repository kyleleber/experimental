# Sandbox Projects

A collection of experimental browser-based projects, games, prototypes, and technical experiments.

This repository serves as a sandbox for exploring ideas, technologies, and interactions that don't necessarily belong in a traditional production application.

## Projects

Each project is built and served through the main application and can be accessed through its own route.

### Games

| Game              | Description                                                                                               | Route                  |
|-------------------|-----------------------------------------------------------------------------------------------------------|------------------------|
| **X3PLORER**      | 3D browser-based arena shooter featuring procedural environments, creature AI, and X3DOM/WebGL rendering. | `/games/x3plorer`      |
| **Skeet Shoot**   | 3D browser-based skeet / trap shooting simulator.                                                         | `/games/skeet`         |
| **Maze Explorer** | 3D browser-based maze generator and explorer.                                                             | `/games/maze_explorer` |

## Architecture

The project uses a central React application to organize and present the individual sandbox projects.

```text
public/
└── games/
    ├── x3plorer/
    │   ├── README.md
    │   ├──index.html
    │   ├── js/
    |   ├── css/
    └── ...

src/
├── App.jsx                 # Main application and project routing
├── ...
```

The main application handles the overall project experience, while individual games and experiments remain isolated within their respective project directories.

Each project can therefore have its own:

* Game logic
* Components
* Assets
* Styles
* Documentation
* Experimental systems

## Development

Install the project dependencies:

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The development server provides the sandbox application and its individual project routes.

### Production Build

```bash
npm run build
```

The application and its projects are compiled into the `dist` directory.

### Preview

To preview the production build locally:

```bash
npm run preview
```

## Project Philosophy

This is a sandbox.

Not every experiment needs to become a polished application, and not every idea needs to justify its existence beyond being interesting to build.

The projects here are opportunities to experiment with technologies, interactions, graphics, game mechanics, architecture, and ideas that are fun to explore.

Some projects may be rough.

Some may be weird.

Some may turn into something bigger.

That's kind of the point.

Use AI responsibly.

## Documentation

Individual projects contain their own README files with project-specific information, including architecture, technologies, gameplay mechanics, controls, and implementation details.

## Current projects
* [`X3PLORER`](./src/games/x3plorer/README.md) — 3D browser arena shooter
* [`X3D Skeet Shoot`](./src/games/skeet/README.md) — 3D browser trap/skeet simulator.
* [`Maze Explorer`](./src/games/maze_explorer/README.md) — 3D browser maze generator and explorer

## Contributing
Feel free to shoot me a message or put in a pull request for anything you're working on
or want to collaborate on! Always happy to have a chat about things. Cheers!

kyleleber2014@gmail.com
