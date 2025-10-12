import Board from './board.js';

class Game {
    constructor(container) {
        this.container = container;

        this.board = new Board();
        this.board.appendTo(this.container);
    }

    clear() {
        this.container.innerHTML = '';
    }
}

export default Game;