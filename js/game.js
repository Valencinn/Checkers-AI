import Board from './board.js';
import Moves from './moves.js';
import AIEngine from './ai.js';

class Game {
    constructor(container) {
        this.container = container;
        this.gameStatus = 'playing'; // estado del juego comienza en ON porque el juego se esta jugando
        this.winner = null; // ganador = null hasta que se defina
        this.currentPlayer = 'blue'; //en las damas siempre comienza el color mas oscuro
        console.log('[Game] Jugador inicial:', this.currentPlayer);

        this.board = new Board();
        this.board.appendTo(this.container);
        this.board.fillWithPieces();
        const currentPosition = this.board.boardArray();
        console.table('[Game] Tablero a modo matriz:', currentPosition);

        this.moves = new Moves(this.board, this);
        console.log('moves inicializados'); //verificacion del setteo de moves

        /*this.positionMemory = new Map();
        this.moveHistory = []; //aca guardamos los movimientos
        this.positionCounter = 0; //para la repeticion
        this.recordPosition();*/
    }

    /*positionKey() {
        return JSON.stringify({ //asi la pasamos a la key!
            board: this.board.boardArray(),
            player: this.currentPlayer
        });
    }

    recordPosition() {
    }*/

    gameDraw() {
        this.gameStatus = 'ended';
        this.winner = 'draw';
        console.log('[Game] Game Over! Empate!');
    }

    switchTurn() { //cambia el turno entre los jugadores
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
        console.log(`[Game] Ahora es el turno de: ${this.currentPlayer}`);
        this.checkGameStatus();

        if (this.currentPlayer === 'red' && !this.isGameEnded()) {
            setTimeout(() => this.playAITurn(), 500);
        }
    }

    playAITurn() {
        const ai = new AIEngine();
        const boardArray = this.board.boardArray();
        const bestMove = ai.getBestMove(boardArray, 3);

        if (!bestMove) {
            console.log('[AI] No hay movimientos disponibles');
            this.checkGameStatus();
            return;
        }

        const [fromRow, fromCol] = bestMove.from;
        const [toRow, toCol] = bestMove.to;
        const fromNum = fromRow * 8 + fromCol;
        const toNum = toRow * 8 + toCol;

        const fromSquare = this.board.fieldsByNum[fromNum];
        const toSquare = this.board.fieldsByNum[toNum];
        const piece = fromSquare.querySelector('.checkers-piece-red');

        if (piece) {
            //sacamos las piezas capturadas
            if (bestMove.captures && bestMove.captures.length > 0) {
                for (const [cr, cc] of bestMove.captures) {
                    const captureNum = cr * 8 + cc;
                    const captured = this.board.fieldsByNum[captureNum].querySelector('.checkers-piece');
                    if (captured) captured.remove();
                }
            }

            const squareSize = 62.5;
            const deltaX = (fromCol - toCol) * squareSize;
            const deltaY = (fromRow - toRow) * squareSize;

            //le ponemos hacia donde y la animacion a transition
            piece.style.zIndex = '99';
            piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            piece.style.transition = 'transform 0.3s ease-in-out';

            //en el dom movemos la pieza
            fromSquare.removeChild(piece);
            toSquare.appendChild(piece);

            requestAnimationFrame(() => {
                piece.style.transform = 'translate(0, 0)';
            });

            //sacamos el transform y transition dsp de la animacion
            setTimeout(() => {
                piece.style.transform = '';
                piece.style.transition = '';
                piece.style.zIndex = '';
                console.log('[AI] Movimiento completado:', bestMove);
                this.switchTurn();
            }, 300);

            //coronaacion
            if (!piece.classList.contains('king')) {
                if (piece.classList.contains('checkers-piece-red') && toRow === 7) {
                    setTimeout(() => {
                        piece.classList.add('king');
                        piece.innerHTML = '👑';
                    }, 300);
                }
            }

        } else {
            console.log('[AI] No se encontró la pieza en la casilla de origen');
            this.switchTurn();
        }
    }


    checkGameStatus() {
        const possibleMoves = this.moves.getAllPossibleMoves(this.currentPlayer);
        const bluePieces = this.board.getPiecesByColor('blue');
        const redPieces = this.board.getPiecesByColor('red');

        //checkea si el jugador actual no tiene movimientos posibles
        if (possibleMoves.length === 0) {
            this.gameStatus = 'ended';
            this.winner = this.currentPlayer === 'red' ? 'blue' : 'red';
            console.log(`[Game] Game Over! ${this.winner} wins!`);
            return;
        }

        //empate
        if (bluePieces.length === 1 && redPieces.length === 1) {
            this.gameDraw();
            return;
        }
    }

    clear() { //limpia el tablero
        this.container.innerHTML = '';
    }

    isGameEnded() { //verifica si el juego termino
        return this.gameStatus === 'ended';
    }

    getWinner() { //devuelve quien gano
        return this.winner;
    }
}

export default Game;