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
        const fieldNum = parseInt(piece.parentElement.getAttribute('data-num'));
        const num = fieldNum;
        const row = Math.floor(num / 8);
        const col = num % 8;
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';

        const directions = [];

        if (color === 'red') directions.push([1, -1], [1, 1]);
        else directions.push([-1, -1], [-1, 1]);

        const moves = [];

        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetNum = newRow * 8 + newCol;
                const targetSquare = this.board.fieldsByNum[targetNum];
                const hasPiece = targetSquare.querySelector('.checkers-piece');
                if (!hasPiece) moves.push(targetSquare);
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

    movePiece(piece, targetSquare) {
        targetSquare.appendChild(piece);
    }
}