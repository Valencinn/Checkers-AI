class Piece {
    constructor(color) {
        this.color = color;
        this.el = document.createElement('div');


        this.el.className = 'checkers-piece '; //le ponemos la clase base
        this.el.className += `checkers-piece-${color}`; //le ponemos la clase del color
    }

    setField(field) {
        this.field = field;
        this.field.appendChild(this.el);
    }
}

export default Piece;