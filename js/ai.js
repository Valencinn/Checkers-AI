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

    minimax(board, depth, maxPlayer) {

        //caso base en el que llegamos a la profunidad maxima o a un estado terminal (gameStatus = ended en game.js)
        if (depth === 0 || board.isGameOver()) {
            return this.evaluateBoard(board);
        }

        if (maxPlayer) {
            let maxEval = -Infinity;
        } else {
            let minEval = Infinity;
        }

    }
} 