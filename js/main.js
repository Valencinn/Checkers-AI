import Game from './game.js';
import AIEngine from './ai.js';

const boardContainer = document.getElementById('board');
const game = new Game(boardContainer);
console.log('[Game] Game initialized:', game);
const ai = new AIEngine();
const currentPosition = game.board.boardArray();

ai.minimax(currentPosition, 1, true); //le paso la currentPosition, depth y true = maxPlayer! (cambiar depth si queres que piense mas o menos)

document.getElementById('new-game').addEventListener('click', () => {
    game.clear();
    let newGame = new Game(boardContainer);
    console.log('[Game]New game started:', newGame);
});