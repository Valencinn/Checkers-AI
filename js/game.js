import Board from './board.js';
import Moves from './moves.js';

class Game {
    constructor(container) {
        this.container = container;

        this.board = new Board(); //crea el tablero
        this.board.appendTo(this.container); //lo agrega al contenedor

        this.board.fillWithPieces(); //llena el tablero con piezas
        this.moves = new Moves(this.board); //gestiona los movimientos
    }

    clear() {
        this.container.innerHTML = '';
    }
}

export default Game;