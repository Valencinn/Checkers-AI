// moves.js
import Piece from './piece.js';

export default class Moves {
    constructor(board, game) {
        this.board = board;
        this.game = game;
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

        // Si clickeamos una pieza
        if (piece) {
            const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
            // solo puede mover si es su turno (si el color de la pieza es igual al jugador actual)
            if (color !== this.game.currentPlayer) return;

            this.clearHighlights();
            this.selectedPiece = piece;
            const moves = this.getValidMoves(piece);
            this.highlightMoves(moves);

        } else if (this.selectedPiece && square.classList.contains('highlight')) {
            // obtenemos el numero de la pieza capturada (si lo hay)
            const captureAttr = square.getAttribute('data-capture');
            const captureNum = captureAttr ? parseInt(captureAttr) : null;

            this.movePiece(this.selectedPiece, square, captureNum);

            this.clearHighlights();
            this.selectedPiece = null;

            // cambiar el turno cuando termina el movimiento
            this.game.switchTurn();
        }
    }

    getValidMoves(piece) {
        const fieldNum = parseInt(piece.parentElement.getAttribute('data-num')); //obtenemos el numero de la casilla cuando clickea la pieza
        const num = fieldNum;
        const row = Math.floor(num / 8);
        const col = num % 8;
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';

        const directions = [];

        if (color === 'red') directions.push([1, -1], [1, 1]); //avanza hacia filas + (hacia "abajo")
        else directions.push([-1, -1], [-1, 1]); //azul hacia filas - (hacia "arriba")

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
                        if (this.isOnBoard(jumpRow, jumpCol)) {
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
            const pieceToEat = middleSquare.querySelector('.checkers-piece'); //come la pieza que esta en el adyacente definido arriba
            if (pieceToEat) pieceToEat.remove();
        }

        //mueve la pieza visualmente
        targetSquare.appendChild(piece);
    }
}
