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
    }

    gameDraw() {
        this.gameStatus = 'ended'; // Add this line to end the game
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

    playAITurn() { //este es el manejo de la IA
        const ai = new AIEngine();
        const boardArray = this.board.boardArray();
        const bestMove = ai.getBestMove(boardArray, 3);

        if (!bestMove) {
            console.log('[AI] No hay movimientos disponibles');
            this.checkGameStatus();
            return;
        }

    //que hace esto? convierte el tablero virtual que estaba muy atado al DOM a coordenadas asi la IA puede mover las piezas en el mismo
        const [fromRow, fromCol] = bestMove.from; //coordenadas de origen
        const [toRow, toCol] = bestMove.to; //coordenadas de destino
        const fromNum = fromRow * 8 + fromCol; //convertir coordenadas a numero de casilla
        const toNum = toRow * 8 + toCol;

        const fromSquare = this.board.fieldsByNum[fromNum]; //casilla de origen
        const toSquare = this.board.fieldsByNum[toNum]; //casilla de destino
        const piece = fromSquare.querySelector('.checkers-piece-red'); //red porque la IA es roja

        if (piece) { //este if es para verificar que la pieza exista en la casilla de origen antes de moverla, sino me tira error (no se xq)
            fromSquare.removeChild(piece);
            toSquare.appendChild(piece);
            if (bestMove.capture) { //si la mejor opcion fue capturar una pieza
                const [cr, cc] = bestMove.capture;
                const captureNum = cr * 8 + cc; //convertir coordenadas de captura a numero de casilla
                const captured = this.board.fieldsByNum[captureNum].querySelector('.checkers-piece');
                if (captured) captured.remove();
            }
        }

    console.log('[AI] Movimiento completado:', bestMove);
    this.switchTurn();
}


    checkGameStatus() {
        const possibleMoves = this.moves.getAllPossibleMoves(this.currentPlayer);
        const bluePieces = this.board.getPiecesByColor('blue');
        const redPieces = this.board.getPiecesByColor('red');

        // checkea si el jugador actual no tiene movimientos posibles
        if (possibleMoves.length === 0) {
            this.gameStatus = 'ended';
            this.winner = this.currentPlayer === 'red' ? 'blue' : 'red';
            console.log(`[Game] Game Over! ${this.winner} wins!`);
            return;
        }

        // Empate si hay 40 turnos o solo quedan 2 piezas
        if (bluePieces.length === 1 && redPieces.length === 1) {
            this.gameDraw();
            return;
        }
    }

    clear() { //limpia el tablero
        this.container.innerHTML = '';
    }

    isGameEnded() { // verifica si el juego termino
        return this.gameStatus === 'ended';
    }

    getWinner() { //devuelve quien gano
        return this.winner;
    }
}

export default Game;