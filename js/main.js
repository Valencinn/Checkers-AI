import Game from './game.js';
const boardContainer = document.getElementById('board');
let game = new Game(boardContainer);
document.getElementById('new-game').addEventListener('click', () => {
    game.clear();
    game = new Game(boardContainer);
});
