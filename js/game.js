import Board from './board.js';
import Moves from './moves.js';

class Game {
    constructor(container) {
        this.container = container;
        this.currentPlayer = 'blue'; //en las damas siempre comienza el jugador con las piezas mas oscuras en el tablero
        console.log('[Game] currentPlayer inicial:', this.currentPlayer);

        this.board = new Board();
        this.board.appendTo(this.container);
        this.board.fillWithPieces();

        // pasa la referencia del game al constructor de Moves
        this.moves = new Moves(this.board, this);
        console.log('[Game] Moves creado:', this.moves);
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red'; //simplemente define el turno del jugador actual alternando entre los colores siendo que definimos por default el azul
        console.log(`[Game] Ahora es el turno de: ${this.currentPlayer}`); //console.log para debuggear el turno actual
    }

    clear() {
        this.container.innerHTML = '';
    }
}

export default Game;