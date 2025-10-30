import Game from './game.js';
import AIEngine from './ai.js';

const boardContainer = document.getElementById('board');
const game = new Game(boardContainer);
console.log('[Game] Game initialized:', game);
const ai = new AIEngine();
/*game.clear() limpia el tablero*/