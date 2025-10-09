// Wait for the DOM to be loaded
window.addEventListener("DOMContentLoaded", () => {
    const boardDiv = document.getElementById("board");
    const game = new Game(boardDiv);

    // Optional: If you need to clear the game when the page unloads
    window.addEventListener("beforeunload", () => {
        if (game && typeof game.clear === "function") {
            game.clear();
        }
    });
});