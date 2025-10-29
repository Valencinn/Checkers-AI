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

        this.color = color;

        this.piece_values = {
            'player': { man: -1, king: -2 },
            'ai': { man: 1, king: 2 }
        }
    }

    minimax(boardArray, depth, maxPlayer) {

        //caso terminal base: juego terminado.
        if (depth === 0) {
            return this.evaluateBoard(boardArray); // evaluateBoard también debe leer el array
        }

        if (maxPlayer) { //maxPlayer es la IA (busca maximizar)
            let maxEval = -Infinity;

            //buscamos los movimientos posibles para el maxPlayer que es la IA (por eso rojo)
            const allMoves = getValidMovesForArray(boardArray, 'red');

            for (const move of allMoves) {

                //con este forof simula el movimiento de la IA
                const newBoardArray = applyMoveToArray(boardArray, move);

                //la recursividad es clave en minimax porque al llamarse a si mismo permite explorar todas las posibles secuencias de movimientos futuros
                let recEval = this.minimax(newBoardArray, depth - 1, false); //false = turno minPlayer. Depth -1 es porque ya se hizo un movimiento entonces se reduce la profundidad de busqueda
                maxEval = Math.max(maxEval, recEval); //en el caso que recEval sea mayor que maxEval, actualizamos maxEval asi determinando que esa jugada es mejor que la anterior
            }
            return maxEval;

        } else { //minPlayer es el jugador humano (busca minimizar). Porque se hace esto? porque el jugador humano va a mover entonces la IA tiene que buscar cual seria el movimiento que haria si estuviese en su lugar
            let minEval = Infinity;

            //en este caso allMoves son los movimientos pero del jugador humano
            const allMoves = getValidMovesForArray(boardArray, 'blue');

            for (const move of allMoves) {

                //aca es donde simula el movimiento del jugador humano asi la IA puede evaluar las posibles respuestas
                const newBoardArray = applyMoveToArray(boardArray, move);

                let recEval = this.minimax(newBoardArray, depth - 1, true); //true = turno maxPlayer
                minEval = Math.min(minEval, recEval);
            }
            return minEval;
        }
    }

    evaluateBoard() {

    };

    getValidMovesForArray(boardArray, color) { };

    applyMoveToArray(boardArray, move) { };

}

export default AIEngine;
