import Board from './board.js';
import Moves from './moves.js';

class Game {
    constructor(container) {
        this.container = container;
        this.gameStatus = 'playing'; // estado del juego comienza en ON porque el juego se esta jugando
        this.winner = null; // ganador = null hasta que se defina
        this.currentPlayer = 'blue';
        console.log('[Game] currentPlayer inicial:', this.currentPlayer);

        this.board = new Board();
        this.board.appendTo(this.container);
        this.board.fillWithPieces();

        this.moves = new Moves(this.board, this);
        console.log('[Game] Moves creado:', this.moves);
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
        console.log(`[Game] Ahora es el turno de: ${this.currentPlayer}`);
        this.checkGameStatus();
    }

    checkGameStatus() {
        const possibleMoves = this.moves.getAllPossibleMoves(this.currentPlayer);
        const bluePieces = this.board.getPiecesByColor('blue');
        const redPieces = this.board.getPiecesByColor('red');

        // checkea si el jugador actual no tiene movimientos posibles
        if (possibleMoves.length === 0) {
            this.gameStatus = 'ended';
            this.winner = this.currentPlayer === 'red' ? 'blue' : 'red';
            console.log(`[Game] Game Over! ${this.winner} wins by no possible moves!`);
            return;
        }

        // checkear si los jugadores se han quedado sin piezas
        if (bluePieces.length === 0) {
            this.gameStatus = 'ended';
            this.winner = 'red';
            console.log('[Game] Game Over! Red wins!');
        } else if (redPieces.length === 0) {
            this.gameStatus = 'ended';
            this.winner = 'blue';
            console.log('[Game] Game Over! Blue wins!');
        }
    }

    clear() {
        this.container.innerHTML = '';
    }

    isGameEnded() {
        return this.gameStatus === 'ended';
    }

    getWinner() {
        return this.winner;
    }
}

export default Game;