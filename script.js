const board = document.getElementById('checkers-board');

function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            // alternar los colores de las casillas
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
                // Poner piezas en las filas iniciales
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red');
                    square.appendChild(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black');
                    square.appendChild(piece);
                }
            }
            board.appendChild(square);
        }
    }
}

createBoard();

