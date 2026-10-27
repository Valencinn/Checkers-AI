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

        //notacion y deteccion de repeticiones
        this.positionMemory = new Map();
        this.moveHistory = [];
        this.positionCounter = 0;
        this.recordPosition();

        //notaciones para el html
        this.initializeNotationDisplay();
    }

    positionKey() {
        return JSON.stringify(this.board.boardArray());
    }

    recordPosition() {
        const key = this.positionKey();
        if (this.positionMemory.has(key)) {
            this.positionMemory.set(key, this.positionMemory.get(key) + 1);
        } else {
            this.positionMemory.set(key, 1);
        }
        this.positionCounter++;
    }

    recordMove(move, player) {
        const moveNotation = this.convertMoveToNotation(move, player);
        this.moveHistory.push(moveNotation);
        this.recordPosition();
        this.updateNotationDisplay();

        if (this.checkThreefoldRepetition()) {
            console.log('[Game] Threefold repetition detected!');
            this.gameDraw();
        }
    }

    convertMoveToNotation(move, player) {
        const { from, to, captures } = move;
        const fromSquare = this.coordinatesToNotation(from[0], from[1]);
        const toSquare = this.coordinatesToNotation(to[0], to[1]);

        let notation = `${fromSquare} → ${toSquare}`;

        // Add capture notation
        if (captures && captures.length > 0) {
            notation += `x${captures.length}`;
        }

        // Add king promotion notation
        const piece = this.board.fieldsByNum[from[0] * 8 + from[1]].querySelector('.checkers-piece');
        if (piece && !piece.classList.contains('king')) {
            if ((player === 'red' && to[0] === 7) || (player === 'blue' && to[0] === 0)) {
                notation += ' (K)';
            }
        }

        return {
            move: notation,
            fullMove: move,
            player: player,
            turn: Math.ceil(this.moveHistory.length / 2) + 1
        };
    }

    coordinatesToNotation(row, col) {
        const files = 'abcdefgh'; //el 0 es la columna a, el 7 es la columna h
        const ranks = '87654321'; //el 0 es la fila 8, el 7 es la fila 1
        return files[col] + ranks[row];
    }

    initializeNotationDisplay() {
        const gameInfo = document.querySelector('.game-info');
        if (!gameInfo) return;

        //LIMPIAR cualquier notation container existente antes de crear uno nuevo
        const existingNotation = gameInfo.querySelector('.notation-container');
        if (existingNotation) {
            existingNotation.remove();
        }

        const notationHTML = `
            <div class="notation-container">
                <div class="move-counter">Moves played <span id="position-counter">0</span></div>
                <div class="moves-list" id="moves-list" role="log" aria-label="Move history" aria-live="polite"></div>
                <div class="game-status" id="game-status" role="status"></div>
            </div>
        `;

        gameInfo.insertAdjacentHTML('beforeend', notationHTML);
        this.updateNotationDisplay();
    }

    updateNotationDisplay() {
        const movesList = document.getElementById('moves-list');
        const positionCounter = document.getElementById('position-counter');
        const gameStatus = document.getElementById('game-status');

        if (!movesList || !positionCounter || !gameStatus) return;

        positionCounter.textContent = this.moveHistory.length.toString().padStart(2, '0');

        movesList.innerHTML = '';
        if (!this.moveHistory.length) {
            movesList.innerHTML = '<div class="empty-journal"><span aria-hidden="true">↗</span>Your first move starts the story.</div>';
        }
        this.moveHistory.forEach((moveRecord, index) => {
            const moveElement = document.createElement('div');
            moveElement.className = `move-record ${moveRecord.player}`;
            moveElement.innerHTML = `
                <span class="move-number">${index + 1}.</span>
                <span class="move-notation">${moveRecord.move}</span>
            `;
            movesList.appendChild(moveElement);
        });

        const ended = this.isGameEnded();
        const yourTurn = this.currentPlayer === 'blue';
        gameStatus.textContent = ended ? (this.winner === 'draw' ? 'A well-matched draw.' : this.winner === 'blue' ? 'Yellow wins. Nicely played!' : 'Blue wins. Another round?') : yourTurn ? 'Your turn · Playing yellow' : 'AI is thinking · Playing blue';
        document.getElementById('turn-title').textContent = ended ? (this.winner === 'draw' ? 'A perfect tie.' : this.winner === 'blue' ? 'Well played!' : 'Clever moves!') : yourTurn ? 'Your move!' : 'Thinking…';
        document.getElementById('turn-description').textContent = ended ? 'Every game is a new possibility. Ready for another round?' : yourTurn ? 'Select a yellow piece, then choose one of the marked squares.' : 'A little strategy in the making. Your opponent is finding its next move.';
        document.getElementById('turn-tag').innerHTML = `<span></span> ${ended ? 'Game complete' : yourTurn ? 'Yellow · Your turn' : 'Blue · AI opponent'}`;
        document.getElementById('ai-count').textContent = `${this.board.getPiecesByColor('red').length} pieces`;
        document.getElementById('player-count').textContent = `${this.board.getPiecesByColor('blue').length} pieces`;

        movesList.scrollTop = movesList.scrollHeight;
    }

    checkThreefoldRepetition() {
        for (let count of this.positionMemory.values()) {
            if (count >= 3) {
                return true;
            }
        }
        return false;
    }


    gameDraw() {
        this.gameStatus = 'ended';
        this.winner = 'draw';
        this.updateNotationDisplay();
        console.log('[Game] Game Over! Empate!');
    }

    switchTurn() { //cambia el turno entre los jugadores
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
        console.log(`[Game] Ahora es el turno de: ${this.currentPlayer}`);
        this.checkGameStatus();
        this.updateNotationDisplay();

        if (this.currentPlayer === 'red' && !this.isGameEnded()) {
            this.aiTimer = setTimeout(() => this.playAITurn(), 500);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)); //esto para q se vean los movimientos en el medio
    }

    async playAITurn() {
        if (this.disposed || this.isGameEnded()) return;
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
            if (this.disposed) return;
            piece.style.transform = '';
            piece.style.transition = '';
            piece.style.zIndex = '';
        }

        const [finalRow] = path[path.length - 1];
        if (!piece.classList.contains('king')) {
            if (piece.classList.contains('checkers-piece-red') && finalRow === 7) {
                piece.classList.add('king');
            }
        }

        this.recordMove(bestMove, 'red');

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

    clear() {
        this.disposed = true;
        clearTimeout(this.aiTimer);
        this.container.innerHTML = '';

        const notationContainer = document.querySelector('.notation-container');
        if (notationContainer) {
            notationContainer.remove();
        }
    }

    isGameEnded() { //verifica si el juego termino
        return this.gameStatus === 'ended';
    }

    getWinner() { //devuelve quien gano
        return this.winner;
    }
}

export default Game;
