class Piece {
    constructor(row, col, color) {
        this.color = color;
        this.row = row;
        this.col = col;
        this.el = document.createElement('div');


        this.el.className = 'checkers-piece '; //le ponemos la clase base
        this.el.className += `checkers-piece-${color}`; //le ponemos la clase del color
    }

    setField(field) { //asigna la pieza a una casilla
        this.field = field;
        this.field.appendChild(this.el);
    }

    place(row, col) {
        const squareSize = 62.5; // 500px / 8 squares
        this.el.style.position = 'absolute';
        this.el.style.top = `${row * squareSize}px`;
        this.el.style.left = `${col * squareSize}px`;
    }

    moveAnimation(nextRow, nextCol) {
        const squareSize = 62.5 //500/8

        //calculamos la posicion en pixeles como dijo fran
        const nextTop = nextRow * squareSize;
        const nextLeft = nextCol * squareSize;

        //actualizo el dom con la nueva posicion
        this.el.style.top = nextTop + 'px';
        this.el.style.left = nextLeft + 'px';

        this.row = nextRow;
        this.col = nextCol;
    }
}

export default Piece;