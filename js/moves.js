import Piece from './piece.js';

/*
    acordate: [1,-1] seria abajo izq 
    ya esta con eso te acordas los otroas xd
*/

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
        /*console.log(piece.parentElement);*/ //devuelve donde se encuentra la pieza

        //click en una pieza
        if (piece) {
            const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
            if (color !== this.game.currentPlayer)
                return; //nos aseguramos que el jugador solo pueda seleccionar sus propias piezas

            this.clearHighlights();
            this.selectedPiece = piece;

            //mostrar las capturas obligatorias si las hay
            const allPieces = this.board.getPiecesByColor(this.game.currentPlayer);
            let mandatoryCaptures = [];

            allPieces.forEach(piece => {
                const moves = this.getValidMoves(piece);
                const captures = moves.filter(move => move.capture !== null);
                if (captures.length > 0) {
                    mandatoryCaptures.push({ piece: piece, moves: captures });
                }
            });

            //si hay capturas obligatorias, solo muestra esas
            if (mandatoryCaptures.length > 0) {
                //solo muestra los movimientos de captura para la pieza seleccionada
                const canThisPieceCapture = mandatoryCaptures.find(capture => capture.piece === piece);
                if (canThisPieceCapture) {
                    this.highlightMoves(canThisPieceCapture.moves);
                }
            } else {
                //si no hay capturas obligatorias, muestra todos los movimientos validos
                const moves = this.getValidMoves(piece);
                this.highlightMoves(moves);
            }

            // click en una casilla valida
        } else if (this.selectedPiece && square.classList.contains('highlight')) {
            const captureAttr = square.getAttribute('data-capture'); //captureAttr es el numero de la casilla de la pieza capturada
            const captureNum = captureAttr ? captureAttr : null;

            const didCapture = this.movePiece(this.selectedPiece, square, captureNum);

            this.clearHighlights();

            //si comio, verificamos si puede seguir comiendo
            if (didCapture) {
                const nextMoves = this.getValidMoves(this.selectedPiece).filter(move => move.capture !== null); //con el .filter le doy la condicion de que solo me traiga los movimientos que sean capturas
                if (nextMoves.length > 0) {
                    this.highlightMoves(nextMoves);
                    return; //no cambia turno todavia
                }
            }

            //si no hay mas capturas, termina el turno
            this.selectedPiece = null;
            this.game.switchTurn();
            this.counter++; //contador de turnos
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

        directions.forEach(([changeRow, changeCol]) => {
            const adjRow = row + changeRow; //calcula la fila adyacente
            const adjCol = col + changeCol; //calcula la columna adyacente

            if (this.isOnBoard(adjRow, adjCol)) { //si la casilla adyacente este dentro del tablero...
                const targetNum = adjRow * 8 + adjCol; //calcula el numero de la casilla adyacente 
                const targetSquare = this.board.fieldsByNum[targetNum]; //lo targetea
                const hasPiece = targetSquare.querySelector('.checkers-piece');

                if (!hasPiece) { //si no tiene pieza, es un movimiento valido
                    moves.push({ square: targetSquare, capture: null }); //si en el target square no hay pieza, es un movimiento normal
                } else { //si tiene pieza, verificamos si es del oponente y si se puede saltar
                    const adjPiece = hasPiece;
                    const adjColor = adjPiece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
                    if (adjColor !== color) {
                        const jumpRow = row + changeRow * 2; //saltamos la fila
                        const jumpCol = col + changeCol * 2;//saltamos la columna
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

    getAllPossibleMoves(color) { //agarramos todos los movimientos posibles para un color dado
        const pieces = this.board.getPiecesByColor(color);
        let allMoves = [];

        pieces.forEach(piece => {
            const pieceMoves = this.getValidMoves(piece);
            allMoves = allMoves.concat(pieceMoves);
        });

        return allMoves;
    }

    isOnBoard(row, col) { //checkeamos si la casilla esta dentro del tablero
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

    clearHighlights() { //sacamos los highlights de las casillas
        Object.values(this.board.fieldsByNum).forEach(square => {
            square.classList.remove('highlight');
            square.removeAttribute('data-capture');
        });
    }

    movePiece(piece, targetSquare, captureNum = null) {
        let didCapture = false;

        //borramos pieza capturada
        if (captureNum !== null && !Number.isNaN(captureNum)) {
            const middleSquare = this.board.fieldsByNum[captureNum];
            const pieceToEat = middleSquare.querySelector('.checkers-piece');
            if (pieceToEat) {
                pieceToEat.remove();
                didCapture = true;
            }
        }

        //posicion para la animacion
        const squareSize = piece.parentElement.getBoundingClientRect().width //esto era lo q decia fran
        const fromNum = parseInt(piece.parentElement.dataset.num);
        const toNum = parseInt(targetSquare.dataset.num);
        const fromRow = Math.floor(fromNum / 8);
        const fromCol = fromNum % 8;
        const toRow = Math.floor(toNum / 8);
        const toCol = toNum % 8;

        const jumpX = (fromCol - toCol) * squareSize;
        const jumpY = (fromRow - toRow) * squareSize;

        //le ponemos hacia donde y la animacion a transition
        piece.style.zIndex = '99';
        piece.style.transform = `translate(${jumpX}px, ${jumpY}px)`;
        piece.style.transition = 'transform 0.3s ease-in-out';

        //en el dom movemos la pieza
        targetSquare.appendChild(piece);

        requestAnimationFrame(() => { //requestAnimationFrame() hace que lo pedido se ejecute justo antes del proximo frame, lo uso para activar la animacion
            piece.style.transform = 'translate(0, 0)';
        });

        //sacamos el transform y transition dsp de la animacion
        setTimeout(() => {
            piece.style.transform = '';
            piece.style.transition = '';
            piece.style.zIndex = '';
        }, 300);

        //coronaacion
        const targetNum = parseInt(targetSquare.getAttribute('data-num'));
        const row = Math.floor(targetNum / 8);
        const color = piece.classList.contains('checkers-piece-red') ? 'red' : 'blue';
        if ((color === 'red' && row === 7) || (color === 'blue' && row === 0)) {
            piece.classList.add('king');
            piece.innerHTML = '👑';
        }

        return didCapture;
    }
}

