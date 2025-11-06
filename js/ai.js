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
            'player': { man: -1, king: -2 }, //valor negativo porque minimiza el score y encima asi se diferencia de la IA
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

    //cloneBoard crea una copia del boardArray asi no modifica el original y puede simular movimientos
    cloneBoard(boardArray) {
        return boardArray.map(r => [...r]); //.map crea un nuevo array aplicando la funcion (boardArray) a cada elemento del array
    }

    /* 
    DFS: dfs (depth-first search) es un algoritmo de busqueda utilizado para recorrer o buscar en estructuras de datos como arboles o grafos.
    El algoritmo comienza en un nodo raiz y explora tan lejos como sea posible a lo largo de cada rama antes de retroceder.
    porque lo uso aca? para encontrar todas las secuencias de captura posibles para una pieza en particular.
    sino habia que hacer un calculo gigante para encontrar todas las capturas multiples posibles y encima no comia obligatoriamente porque se rompia ya que 
    podria haber varias opciones de captura en diferentes direcciones.
    */
    findCaptureSequences(boardArray, row, col) {
        const piece = boardArray[row][col];
        const isKing = piece === 2;
        const colorSign = Math.sign(piece); //.sign devuelve el signo de un numero (positivo, negativo o cero)
        const directions = [];

        if (isKing) {
            directions.push([1, -1], [1, 1], [-1, -1], [-1, 1]);
        } else if (colorSign > 0) { //rojo (IA)
            directions.push([1, -1], [1, 1]);
        } else { //azul (jugador)
            directions.push([-1, -1], [-1, 1]);
        }

        const sequences = []; //array para guardar las secuencias de captura encontradas

        for (const [dr, dc] of directions) { //para cada direccion posible
            const midR = row + dr; //pieza en el medio
            const midC = col + dc;
            const landR = row + dr * 2; //hacia que fila
            const landC = col + dc * 2;//hacia que columna

            if (!this.isOnBoard(midR, midC) || !this.isOnBoard(landR, landC)) continue; //continue saltea a la siguiente iteracion del loop asi skipea el codigo de abajo en el caso que no se cumpla la condicion

            const midPiece = boardArray[midR][midC];
            const landPiece = boardArray[landR][landC];

            if (midPiece !== 0 && Math.sign(midPiece) !== Math.sign(piece) && landPiece === 0) {
                //posible salto
                const copy = this.cloneBoard(boardArray);
                copy[row][col] = 0;
                copy[midR][midC] = 0;

                //esta es la coronacion durante secuencia si llega a fila final
                let movedPiece = piece;
                if (piece === 1) {
                    if (colorSign > 0 && landR === 7) movedPiece = 2; //rojo corona
                    if (colorSign < 0 && landR === 0) movedPiece = -2; //azul corona
                }

                copy[landR][landC] = movedPiece;

                const recCall = this.findCaptureSequences(copy, landR, landC); //recursividad

                if (recCall.length === 0) { //si la llamada recursiva no encuentra mas capturas directamente mueve las cosas dentro del array
                    sequences.push({
                        from: [row, col],
                        to: [landR, landC],
                        captures: [[midR, midC]]
                    });
                } else {
                    for (const seq of recCall) {
                        sequences.push({
                            from: [row, col],
                            to: seq.to, //seq.to es el destino final! 
                            captures: [[midR, midC], ...seq.captures] //esto une la captura inicial con las capturas de la secuencia recursiva
                        });
                    }
                }
            }
        }

        return sequences; //returneamos las secuencias encontradas
    }

    getValidMovesForArray(boardArray, color) {
        const moves = []; //array para registrar los movimientos
        const captures = []; //array para registrar las capturas
        const playerPieces = (color === 'red') ? [1, 2] : [-1, -2];
        const direction = (color === 'red') ? 1 : -1;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardArray[row][col];
                if (!playerPieces.includes(piece)) continue;

                //DFS para encontrar secuencias de captura
                const seqs = this.findCaptureSequences(boardArray, row, col);
                if (seqs.length > 0) {
                    seqs.forEach(s => captures.push(s)); //pusheo al array
                    continue;
                }

                const isKing = piece === 2;
                const directions = [];

                if (isKing) {
                    directions.push([1, -1], [1, 1], [-1, -1], [-1, 1]);
                } else {
                    directions.push([direction, -1], [direction, 1]);
                }

                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (this.isOnBoard(newRow, newCol) && boardArray[newRow][newCol] === 0) {
                        moves.push({
                            from: [row, col],
                            to: [newRow, newCol],
                            captures: []
                        });
                    }
                }
            }
        }

        return captures.length > 0 ? captures : moves; //si hay capturas, son obligatorias!
    };

    applyMoveToArray(boardArray, move) {
        const newBoard = boardArray.map(row => [...row]); //creamos una copia del array asi no modifica el original hasta que se haga el movimiento
        const { from, to, captures } = move; //desestructura el movimiento en las coordenadas de origen, destino y captura

        const piece = newBoard[from[0]][from[1]]; //obtiene la pieza que se va a mover
        newBoard[from[0]][from[1]] = 0; //vacia la casilla de origen

        if (captures && captures.length > 0) {
            for (const [cr, cc] of captures) {
                newBoard[cr][cc] = 0;
            }
        }

        let newPiece = piece;

        if (piece === 1) {
            if (piece > 0 && to[0] === 7) newPiece = 2;
            if (piece < 0 && to[0] === 0) newPiece = -2;
        }

        newBoard[to[0]][to[1]] = newPiece;
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

                const evaluation = this.minimax(newBoardArray, depth - 1, true);
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
