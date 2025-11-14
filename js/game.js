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
        return JSON.stringify /7asi se pasaria la key
    }

    recordPosition() {


    TODO ESTO VA A SER PARA LA NOTACION!
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

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)); //esto para q se vean los movimientos en el medio
    }

    async playAITurn() {
        const ai = new AIEngine();
        const boardArray = this.board.boardArray();
        const bestMove = ai.getBestMove(boardArray, 3);

        if (!bestMove) {
            console.log('[AI] No hay movimientos disponibles');
            this.checkGameStatus();
            return;
        }

        const { path, captures } = bestMove;
        const [startRow, startCol] = path[0];
        const startNum = startRow * 8 + startCol;
        const startSquare = this.board.fieldsByNum[startNum];
        const squareSize = startSquare.getBoundingClientRect().width;
        const piece = startSquare.querySelector('.checkers-piece-red');

        if (!piece) {
            console.log('[AI] No se encontró la pieza en la casilla de origen');
            this.switchTurn();
            return;
        }

        //(path.length - 1) es el numero de saltos.[A, B, C] tiene 2 saltos (A>B, B->C)
        for (let i = 0; i < path.length - 1; i++) {
            const [fromRow, fromCol] = path[i];
            const [toRow, toCol] = path[i + 1];

            const toNum = toRow * 8 + toCol;
            const toSquare = this.board.fieldsByNum[toNum];

            if (captures && captures[i]) {
                const [captureRow, captureCol] = captures[i];
                const captureNum = captureRow * 8 + captureCol;
                const captured = this.board.fieldsByNum[captureNum].querySelector('.checkers-piece');
                if (captured) captured.remove();
            }

            //hacia donde
            const jumpX = (fromCol - toCol) * squareSize;
            const jumpY = (fromRow - toRow) * squareSize;

            piece.style.zIndex = '99';
            piece.style.transform = `translate(${jumpX}px, ${jumpY}px)`;
            piece.style.transition = 'transform 0.3s ease-in-out';

            //movemos pieza en DOM
            toSquare.appendChild(piece);

            requestAnimationFrame(() => {
                piece.style.transform = 'translate(0, 0)';
            });

            //para q se vea todo
            await this.wait(300);
            piece.style.transform = '';
            piece.style.transition = '';
            piece.style.zIndex = '';
        }

        const [finalRow] = path[path.length - 1];
        if (!piece.classList.contains('king')) {
            if (piece.classList.contains('checkers-piece-red') && finalRow === 7) {
                piece.classList.add('king');
                piece.innerHTML = '👑';
            }
        }

        console.log('[AI] Movimiento completado:', bestMove);
        this.switchTurn(); //el cambio de turno es siempre post animacion!
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