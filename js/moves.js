import Piece from './piece.js';

export default class Moves {
    constructor(board, game) {
        this.board = board;
        this.game = game;
        this.selectedPiece = null;
        this.addClickEvents();
        this.counter = 0;
    }

    addClickEvents() {
        const squares = Object.values(this.board.fieldsByNum);
        squares.forEach(square => {
            square.addEventListener('click', () => this.handleClick(square));
        });
    }

    handleClick(square) {
    if (this.game.isGameEnded()) {
        console.log('Game is ended, no more moves allowed');
        return;
    }

    const piece = square.querySelector('.checkers-piece');

    // click en una pieza
    if (piece) {
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
        if (color !== this.game.currentPlayer) return;

        this.clearHighlights();
        this.selectedPiece = piece;

        // mostrar las capturas obligatorias si las hay
        const allPieces = this.board.getPiecesByColor(this.game.currentPlayer);
        let mandatoryCaptures = [];
        
        allPieces.forEach(p => {
            const moves = this.getValidMoves(p);
            const captures = moves.filter(m => m.capture !== null);
            if (captures.length > 0) {
                mandatoryCaptures.push({ piece: p, moves: captures });
            }
        });

        // Si hay capturas obligatorias, solo muestra esas
        if (mandatoryCaptures.length > 0) {
            // Solo muestra los movimientos de captura para la pieza seleccionada
            const canThisPieceCapture = mandatoryCaptures.find(m => m.piece === piece);
            if (canThisPieceCapture) {
                this.highlightMoves(canThisPieceCapture.moves);
            }
        } else {
            // Si no hay capturas obligatorias, muestra todos los movimientos válidos
            const moves = this.getValidMoves(piece);
            this.highlightMoves(moves);
        }

    // click en una casilla valida
    } else if (this.selectedPiece && square.classList.contains('highlight')) {
        const captureAttr = square.getAttribute('data-capture');
        const captureNum = captureAttr ? parseInt(captureAttr) : null;

        const didCapture = this.movePiece(this.selectedPiece, square, captureNum);

        this.clearHighlights();

        // si comio, verificamos si puede seguir comiendo
        if (didCapture) {
            const nextMoves = this.getValidMoves(this.selectedPiece).filter(m => m.capture !== null);
            if (nextMoves.length > 0) {
                this.highlightMoves(nextMoves);
                return; // no cambia turno todavia
            }
        }

        // si no hay mas capturas, termina el turno
        this.selectedPiece = null;
        this.game.switchTurn();
        this.counter++; // contador de turnos
    }
}

    getValidMoves(piece) {
    const fieldNum = parseInt(piece.parentElement.getAttribute('data-num'));
    const row = Math.floor(fieldNum / 8); //creo la fila
    const col = fieldNum % 8; //creo la columna
    const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue'; //si no es rojo es azul
    const isKing = piece.classList.contains('king'); //chequea si es un rey

    const directions = []; //direcciones cambia dependiendo si es rey o no
    if (isKing) {
        directions.push([1, -1], [1, 1], [-1, -1], [-1, 1]); //se puede mover para todas las diagonales
    } else if (color === 'red') { //se mueve hacia abajo si es red
        directions.push([1, -1], [1, 1]);
    } else {
        directions.push([-1, -1], [-1, 1]); //se mueve hacia arriba si es blue
    }

    const moves = []; //en este array guardamos los movimientos validos

    directions.forEach(([dr, dc]) => {
        const adjRow = row + dr; //calcula la fila adyacente
        const adjCol = col + dc; //calcula la columna adyacente

        if (this.isOnBoard(adjRow, adjCol)) { //si la casilla adyacente este dentro del tablero...
            const targetNum = adjRow * 8 + adjCol; //calcula el numero de la casilla adyacente 
            const targetSquare = this.board.fieldsByNum[targetNum]; //lo targetea
            const hasPiece = targetSquare.querySelector('.checkers-piece');

            if (!hasPiece) { //si no tiene pieza, es un movimiento valido
                moves.push({ square: targetSquare, capture: null }); // si en el target square no hay pieza, es un movimiento normal
            } else { //si tiene pieza, verificamos si es del oponente y si se puede saltar
                const adjPiece = hasPiece;
                const adjColor = adjPiece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
                if (adjColor !== color) {
                    const jumpRow = row + dr * 2; //saltamos la fila
                    const jumpCol = col + dc * 2;// saltamos la columna
                    if (this.isOnBoard(jumpRow, jumpCol)) {
                        const jumpNum = jumpRow * 8 + jumpCol;
                        const jumpSquare = this.board.fieldsByNum[jumpNum];
                        if (!jumpSquare.querySelector('.checkers-piece')) {
                            moves.push({ square: jumpSquare, capture: targetNum });
                        }
                    }
                }
            }
        }
    });

    return moves;
}

    getAllPossibleMoves(color) { // obtiene todos los movimientos posibles para un color dado
    const pieces = this.board.getPiecesByColor(color);
    let allMoves = [];

    pieces.forEach(piece => {
        const pieceMoves = this.getValidMoves(piece);
        allMoves = allMoves.concat(pieceMoves);
    });

    return allMoves;
}

    isOnBoard(row, col) { //verifica si la casilla esta dentro del tablero
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    highlightMoves(moves) { //higlightea los movimientos validos
        moves.forEach(move => {
            const square = move.square;
            square.classList.add('highlight');
            if (move.capture !== null) {
                square.setAttribute('data-capture', move.capture);
            } else {
                square.removeAttribute('data-capture');
            }
        });
    }

    clearHighlights() { //remueve los highlights de las casillas
        Object.values(this.board.fieldsByNum).forEach(square => {
            square.classList.remove('highlight');
            square.removeAttribute('data-capture');
        });
    }

    movePiece(piece, targetSquare, captureNum = null) {
        let didCapture = false;

        // eliminar pieza capturada
        if (captureNum !== null && !Number.isNaN(captureNum)) {
            const middleSquare = this.board.fieldsByNum[captureNum];
            const pieceToEat = middleSquare.querySelector('.checkers-piece');
            if (pieceToEat) {
                pieceToEat.remove();
                didCapture = true;
            }
        }

        // mover la pieza
        targetSquare.appendChild(piece);

        // coronar
        const targetNum = parseInt(targetSquare.getAttribute('data-num'));
        const row = Math.floor(targetNum / 8);
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
        if ((color === 'red' && row === 7) || (color === 'blue' && row === 0)) { //si llega al fondo del tablero (acordate que funciona de 0 a 7 no de 1 a 8) corona
            piece.classList.add('king'); //le agrega la clase king que le permite moverse libremente
            piece.innerHTML = '👑';
        }

        return didCapture;
    }
}

