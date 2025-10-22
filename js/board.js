//importamos piezas
import Piece from './piece.js';

//creamos tablero

class Board {
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'checkers-board';
        this.fieldsByNum = {}; //objeto para guardar las casillas por su numero

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
        el.className = "checkers-grid ";

        const dark = Boolean((row + col) % 2); //para que se alternen los colores
        if (dark) {
            el.className += 'dark-square'; 
        } else {
            el.className += 'light-square';
        }

        let num = row * 8 + col; //numero de casillas del 0 al 63, es lo mismo que decir 1 al 64

        el.setAttribute('data-num', num); //le asignamos un numero a cada casilla
        this.fieldsByNum[num] = el; //guardamos las casillas en un array para despues tener acceso a estas

        return el;
    }

    //llena el tablero con piezas
    fillWithPieces() {

        for (let i = 0; i < 3; i+=1) { //para las rojas
            for (let j = 0; j < 4; j+= 1) {
                let piece = new Piece("red");
                const field = this.fieldsByNum[i * 8 + (j * 2) + ((i + 1) % 2)]; // el calculo es: fila * 8 + (columna * 2) + ((fila + 1) % 2).
                piece.setField(field);

            }
        }

        for (let i = 5; i < 8; i+=1) { //para las negras/azules 
            for (let j = 0; j < 4; j+= 1) {
                let piece = new Piece("blue");
                const field = this.fieldsByNum[i * 8 + (j * 2) + ((i + 1) % 2)];
                piece.setField(field);
            }
        }
    }

    getPiecesByColor(color) {
        const pieces = [];
        Object.values(this.fieldsByNum).forEach(square => {
            const piece = square.querySelector('.checkers-piece');
            if (piece && piece.classList.contains(`checkers-piece-${color}`)) {
                pieces.push(piece);
            }
        });
        return pieces;
    }

    //mete el tablero en el contenedor
    appendTo(container) {
        container.appendChild(this.el);
    }
}

export default Board;