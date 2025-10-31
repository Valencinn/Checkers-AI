/*Como funciona esto?
minimax es un algoritmo que se usa en juegos de dos jugadores para determinar el mejor movimiento posible.
El algoritmo simula todos los movimientos posibles hasta una cierta profundidad (depth) y evalua el resultado de cada movimiento.
Luego, el algoritmo elige el movimiento que maximiza la ganancia del jugador que esta tomando la decision (max_player) y minimiza la ganancia del oponente.


El algoritmo funciona de la siguiente manera:1. Si la profundidad es 0 o el juego ha terminado (victoria, derrota o empate), se evalua el tablero y se devuelve un puntaje.
2. Si es el turno del jugador maximizador (max_player es true), se inicializa el mejor puntaje a un valor muy bajo (-infinito). En este caso el jugador maximizador es la IA.
   Luego, para cada movimiento posible, se simula el movimiento, se llama recursivamente a minimax con profundidad -1 y max_player como false, y se actualiza el mejor puntaje si el puntaje devuelto es mayor que el mejor puntaje actual.
3. Si es el turno del jugador minimizador (max_player es false), se inicializa el mejor puntaje a un valor muy alto (+infinito). En este caso el jugador minimizador es el humano.
   Luego, para cada movimiento posible, se simula el movimiento, se llama recursivamente a minimax con profundidad -1 y max_player como true, y se actualiza el mejor puntaje si el puntaje devuelto es menor que el mejor puntaje actual.
4. Finalmente, se devuelve el mejor puntaje encontrado.

el terminal state es un posible fin de juego, como una victoria, derrota o empate.

(consultar mis notas)
*/

class AIEngine {
    constructor() {
        this.color = 'red';

        this.pieceValues = {
            'player': { man: -1, king: -2 },
            'ai': { man: 1, king: 2 }
        }
    }

    evaluateBoard(boardArray) { //calculo facil que hace la suma y resta de las piezas en el tablero asi dandole X valor a los dos jugadores
        let score = 0;
        for (let row of boardArray) {
            for (let cell of row) score += cell;
        }
        return score;
    };

    isTerminalState(boardArray) {
        //verifica si el juego ha llegado a estado terminal
        let reds = 0;
        let blues = 0;
        for (let row of boardArray) {
            for (let cell of row) {
                if (cell > 0) reds++;
                else if (cell < 0) blues++;
            }
        }
        if (reds === 0 || blues === 0) {
            console.log("[AI] Terminal state reached, game ended");
            return true;
        }
        return false;
    };

    isOnBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    getValidMovesForArray(boardArray, color) {
        //aca voy a hacer que a traves de la currentPosition me devuelva los movimientos validos para el color rojo aka la IA
        const moves = [];
        const playerPieces = (color === 'red') ? [1, 2] : [-1, -2];
        const direction = (color === 'red') ? 1 : -1; // red moves down, blue moves up

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardArray[row][col];
                if (!playerPieces.includes(piece)) continue;

                const isKing = Math.abs(piece) === 2;
                const directions = [];

                if (isKing) {
                    directions.push([1, -1], [1, 1], [-1, -1], [-1, 1]);
                } else {
                    directions.push([direction, -1], [direction, 1]);
                }

                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    // Normal move
                    if (this.isOnBoard(newRow, newCol) && boardArray[newRow][newCol] === 0) {
                        moves.push({
                            from: [row, col],
                            to: [newRow, newCol],
                            capture: null
                        });
                    }

                    // Capture move
                    const jumpRow = row + dr * 2;
                    const jumpCol = col + dc * 2;
                    if (this.isOnBoard(jumpRow, jumpCol) && boardArray[jumpRow][jumpCol] === 0) {
                        const midPiece = boardArray[row + dr][col + dc];
                        if (midPiece !== 0 && Math.sign(midPiece) !== Math.sign(piece)) {
                            moves.push({
                                from: [row, col],
                                to: [jumpRow, jumpCol],
                                capture: [row + dr, col + dc]
                            });
                        }
                    }
                }
            }
        }

        return moves;
    };

    applyMoveToArray(boardArray, move) {
        const newBoard = boardArray.map(row => [...row]);
        const { from, to, capture } = move;

        const piece = newBoard[from[0]][from[1]];
        newBoard[from[0]][from[1]] = 0;
        newBoard[to[0]][to[1]] = piece;

        if (capture) newBoard[capture[0]][capture[1]] = 0;

        return newBoard;
    }

    minimax(boardArray, depth, maxPlayer) {

        //caso terminal base: juego terminado o profundidad alcanzada
        if (depth === 0 || this.isTerminalState(boardArray)) {
            return this.evaluateBoard(boardArray);
        }

        if (maxPlayer) { //maxPlayer es la IA (busca maximizar)
            let maxEval = -Infinity;

            //buscamos los movimientos posibles para el maxPlayer que es la IA (por eso rojo)
            const allMoves = this.getValidMovesForArray(boardArray, 'red');

            for (const move of allMoves) {
                //simula el movimiento
                const newBoardArray = this.applyMoveToArray(boardArray, move);

                //recursión
                const evaluation = this.minimax(newBoardArray, depth - 1, false);
                maxEval = Math.max(maxEval, evaluation);
            }
            return maxEval;

        } else { //minPlayer es el jugador humano (busca minimizar)
            let minEval = Infinity;

            //movimientos posibles del jugador humano
            const allMoves = this.getValidMovesForArray(boardArray, 'blue');

            for (const move of allMoves) {
                //esto simula el movimiento
                const newBoardArray = this.applyMoveToArray(boardArray, move);

                const evaluation = this.minimax(newBoardArray, depth - 1, true);
                minEval = Math.min(minEval, evaluation);
            }
            return minEval;
        }
    }
}

export default AIEngine;
