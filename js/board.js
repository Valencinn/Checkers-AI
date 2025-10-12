//creamos tablero

class Board {
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'checkers-board';

        this.initialize();
    }

    initialize() { //creamos las casillas
        for (let row = 0; row < 8; row += 1) {
            for (let col = 0; col < 8; col += 1) {
                const grid = this.createGrid(row, col);
                this.el.appendChild(grid); //las agregamos al tablero
            }
        }
    }

    createGrid(row, col) { //creamos el div de las casillas
        const el = document.createElement('div');
        el.className = "checkers-grid "; // here was the mistake

        const dark = Boolean((row + col) % 2); //para que se alternen los colores
        if (dark) {
            el.className += 'dark-square';
        } else {
            el.className += 'light-square';
        }

        return el;
    }

    appendTo(container) {
        container.appendChild(this.el);
    }
}

export default Board;