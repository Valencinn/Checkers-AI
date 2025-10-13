import Board from './board.js';

class Game {
    constructor(container) {
        this.container = container;

        this.board = new Board(); //crea el tablero
        this.board.appendTo(this.container); //lo agrega al contenedor

        this.board.fillWithPieces(); //llena el tablero con piezas
    }

    clear() {
        this.container.innerHTML = '';
    }
}

export default Game;