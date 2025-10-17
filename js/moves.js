import Piece from './piece.js';

export default class Moves {
    constructor(board) {
        this.board = board;
        this.selectedPiece = null;

        this.addClickEvents();
    }

    addClickEvents() {
        const squares = Object.values(this.board.fieldsByNum); //obtiene todas las casillas del tablero

        squares.forEach(square => {
            square.addEventListener('click', (e) => this.handleClick(square)); //le agrega clic a la casilla
        });
    }

    handleClick(square) {
        const piece = square.querySelector('.checkers-piece');

        // si clickeamos una pieza
        if (piece) {
            //si hay otra seleccionada, limpiamos
            this.clearHighlights();

            //Guardamos la ficha seleccionada
            this.selectedPiece = piece;

            //Calculamos movimientos válidos
            const moves = this.getValidMoves(piece);

            //Mostramos los movimientos resaltando casillas
            this.highlightMoves(moves);

            //si clickeamos una casilla válida
        } else if (this.selectedPiece && square.classList.contains('highlight')) {
            this.movePiece(this.selectedPiece, square);
            this.clearHighlights();
            this.selectedPiece = null;
        }
    }

    getValidMoves(piece) {
        const fieldNum = parseInt(piece.parentElement.getAttribute('data-num')); //obtenemos el numero de la casilla cuando clickea la pieza
        const num = fieldNum;
        const row = Math.floor(num / 8);
        const col = num % 8;
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';

        const directions = [];

        if (color === 'red') directions.push([1, -1], [1, 1]); //si el color eso rojo, puede moverse hacia adelante
        else directions.push([-1, -1], [-1, 1]); //si es azul, puede moverse hacia atras

        const moves = [];

        directions.forEach(([dr, dc]) => { 
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetNum = newRow * 8 + newCol; // calcula el numero de la casilla target
                const targetSquare = this.board.fieldsByNum[targetNum]; //obtiene la casilla target
                const hasPiece = targetSquare.querySelector('.checkers-piece'); //verifica si hay una pieza en la casilla destino
                if (!hasPiece) moves.push(targetSquare); //si no hay pieza, es un movimiento valido
            }
        });

        return moves;
    }

    highlightMoves(moves) {
        moves.forEach(square => {
            square.classList.add('highlight');
        });
    }

    clearHighlights() {
        Object.values(this.board.fieldsByNum).forEach(square => {
            square.classList.remove('highlight');
        });
    }

    movePiece(piece, targetSquare) { //le pasamos como parametros la pieza y la casilla target!
        targetSquare.appendChild(piece);
    }

    eatPiece(){}; //funcion para comer piezas, cy comer 
}