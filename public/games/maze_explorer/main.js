import { Game } from './core/Game.js';

window.addEventListener('DOMContentLoaded', () => {
    new Game({
        width: 25,
        height: 25,
        tileSize: 4,
        wallHeight: 4
    });
});