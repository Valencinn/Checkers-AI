import Game from './game.js';
import AIEngine from './ai.js';

const boardContainer = document.getElementById('board');
const game = new Game(boardContainer);
console.log('[Game] Game initialized:', game);
const ai = new AIEngine();
const currentPosition = game.board.boardArray();

ai.minimax(currentPosition, 3, true); //le paso la currentPosition, depth y true = maxPlayer!
/*game.clear() limpia el tablero*/