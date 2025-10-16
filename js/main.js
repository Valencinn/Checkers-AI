import Game from './game.js';

const boardContainer = document.getElementById('board');
const game = new Game(boardContainer);
console.log('Game initialized:', game);

/*game.clear() limpia el tablero*/