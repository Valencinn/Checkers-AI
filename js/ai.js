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
        const moves = []; //array para registrar los movimientos
        const captures = []; //array para registrar las capturas
        const playerPieces = (color === 'red') ? [1, 2] : [-1, -2]; //definir las piezas del jugador
        const direction = (color === 'red') ? 1 : -1;

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

                    //captura
                    const jumpRow = row + dr * 2;
                    const jumpCol = col + dc * 2;
                    if (this.isOnBoard(jumpRow, jumpCol) && boardArray[jumpRow][jumpCol] === 0) {
                        const midPiece = boardArray[row + dr][col + dc];
                        if (midPiece !== 0 && Math.sign(midPiece) !== Math.sign(piece)) { //math.sign devuelve el signo asi sabiendo si es enemigo o no
                            //encontrada una captura
                            captures.push({
                                from: [row, col],
                                to: [jumpRow, jumpCol],
                                capture: [row + dr, col + dc]
                            });
                        }
                    }

                    //movimiento base (en el caso de si no es captura)
                    if (this.isOnBoard(newRow, newCol) && boardArray[newRow][newCol] === 0) {
                        moves.push({
                            from: [row, col],
                            to: [newRow, newCol],
                            capture: null
                        });
                    }
                }
            }
        }

        return captures.length > 0 ? captures : moves; //si hay capturas, son obligatorias!
    };

    applyMoveToArray(boardArray, move) {
        const newBoard = boardArray.map(row => [...row]); //que significa esto? crea una copia del array asi no modifica el original hasta que se haga el movimiento
        const { from, to, capture } = move; //extrae las coordenadas de from, to y capture del objeto move

        const piece = newBoard[from[0]][from[1]]; //obtiene la pieza que se va a mover
        newBoard[from[0]][from[1]] = 0; //vacia la casilla de origen
        newBoard[to[0]][to[1]] = piece; //coloca la pieza en la casilla de destino

        if (capture) newBoard[capture[0]][capture[1]] = 0; //si hay pieza capturada que pase el array a 0 (vacia la casilla)

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

                const evaluation = this.minimax(newBoardArray, depth - 1, true);//no me tomaba la palabra eval creo que funciona como keyword?
                minEval = Math.min(minEval, evaluation);
            }
            return minEval;
        }
    }

    getBestMove(boardArray, depth = 3) { //devuelve el mejor movimiento posible para la IA usando minimax que creamos antes
        const allMoves = this.getValidMovesForArray(boardArray, 'red'); //le pasamos los movimientos posibles con la funcion anterior
        let bestMove = null; //ponemos esto hasta que defina cual es el mejor movimiento
        let bestValue = -Infinity; //igual a minimax (esto es para maximizar)

        for (const move of allMoves) {
            const newBoard = this.applyMoveToArray(boardArray, move); //simulamos el movimiento
            const evalValue = this.minimax(newBoard, depth - 1, false); //llamamos a minimax para evaluar el movimiento

            if (evalValue > bestValue) {
                bestValue = evalValue; //si el eval es mejor que el best actual decide que el eval = best
                bestMove = move;
            }
        }

        console.log("[AI] Mejor movimiento:", bestMove, "Score:", bestValue); //log para ver cual es e mejor movimiento
        return bestMove;
    }
}

export default AIEngine;
