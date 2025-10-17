// moves.js
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

            //Calculamos movimientos válidos (ahora retorna objetos {square, capture})
            const moves = this.getValidMoves(piece);

            //Mostramos los movimientos resaltando casillas
            this.highlightMoves(moves);

        //si clickeamos una casilla válida
        } else if (this.selectedPiece && square.classList.contains('highlight')) {
            // obtenemos si esta casilla tiene data-capture (num de casilla capturada)
            const captureData = square.getAttribute('data-capture');
            const captureNum = captureData !== null ? parseInt(captureData) : null;

            this.movePiece(this.selectedPiece, square, captureNum);

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

        // direcciones diagonales relativas según color (las "normales")
        if (color === 'red') directions.push([1, -1], [1, 1]); //avanza hacia filas + (hacia "abajo" visual)
        else directions.push([-1, -1], [-1, 1]); //azul hacia filas - (hacia "arriba")

        // si en el futuro agregás coronas, podés permitir todas las direcciones

        const moves = [];

        directions.forEach(([dr, dc]) => {
            const adjRow = row + dr;
            const adjCol = col + dc;

            // movimiento simple (una casilla diagonal)
            if (this.isOnBoard(adjRow, adjCol)) {
                const targetNum = adjRow * 8 + adjCol;
                const targetSquare = this.board.fieldsByNum[targetNum];
                const hasPiece = targetSquare.querySelector('.checkers-piece');
                if (!hasPiece) {
                    moves.push({ square: targetSquare, capture: null });
                } else {
                    // si hay una pieza en la casilla adyacente, comprobamos si es rival
                    const adjPiece = hasPiece;
                    const adjColor = adjPiece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
                    if (adjColor !== color) {
                        // casilla mas alla para salto
                        const jumpRow = row + dr * 2;
                        const jumpCol = col + dc * 2;
                        if (this.isOnBoard(jumpRow, jumpCol)) { //este if es para comer la pieza
                            const jumpNum = jumpRow * 8 + jumpCol;
                            const jumpSquare = this.board.fieldsByNum[jumpNum];
                            const hasPieceAtJump = jumpSquare.querySelector('.checkers-piece');
                            if (!hasPieceAtJump) {
                                // movimiento de captura: guardamos cual es la casilla intermedia (adyacente)
                                moves.push({ square: jumpSquare, capture: targetNum });
                            }
                        }
                    }
                }
            }
        });

        return moves;
    }

    isOnBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    highlightMoves(moves) {
        moves.forEach(move => {
            const square = move.square;
            square.classList.add('highlight');
            if (move.capture !== null) {
                // guardamos el número de casilla capturada para usarlo luego
                square.setAttribute('data-capture', move.capture);
            } else {
                square.removeAttribute('data-capture');
            }
        });
    }

    clearHighlights() {
        Object.values(this.board.fieldsByNum).forEach(square => {
            square.classList.remove('highlight');
            square.removeAttribute('data-capture');
        });
    }

    movePiece(piece, targetSquare, captureNum = null) {
        // elimina pieza capturada si corresponde
        if (captureNum !== null && !Number.isNaN(captureNum)) {
            const middleSquare = this.board.fieldsByNum[captureNum];
            const pieceToEat = middleSquare.querySelector('.checkers-piece');
            if (pieceToEat) pieceToEat.remove();
        }

        // Mueve la pieza visualmente
        targetSquare.appendChild(piece);

        // (Opcional) si quieres, podrías comprobar aquí promoción a rey, o turno contrario, etc.
    }
}
