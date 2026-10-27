## 🏁 Checkers AI

A fully playable Checkers game built with JavaScript, HTML and CSS, implementing an AI opponent using Minimax and Depth-First Search (DFS).
Developed as a university project focused on search algorithms and object-oriented programming.

## 🎮 Overview

This project implements the classic Checkers game with a modular, OOP-based structure.
Players can face an AI that simulates move trees, evaluates board states, and selects optimal decisions using Minimax.

The UI is built with native web technologies and dynamically rendered through JavaScript.

## ✨ Features

✔ Object-Oriented Architecture (Board, Game, Piece, AI, etc.)

✔ AI opponent using Minimax + DFS search

✔ Forced captures, multi-jumps, king promotion

✔ Move highlighting and clear visual cues

✔ Win/loss detection and turn management

✔ 100% browser-based — no dependencies or frameworks

✔ Deployed in Vercel

## 🚀 Technologies Used

- JavaScript
- HTML
- CSS
- Vercel

## Local preview

Serve the project directory with any static HTTP server (ES modules require HTTP):

```sh
python -m http.server 4173
```

Open `http://localhost:4173`. No build step or dependencies are required.

## Checkers Club design

The interface uses an illustrated blue-and-cream board, yellow player pieces, a peach background, and responsive layouts. The sidebar shows the current turn, piece counts, and move journal. Rules are included below the game. Squares are keyboard-operable buttons, and status changes are announced to assistive technology. Reduced-motion preferences are respected. Google Fonts are optional; system fallbacks keep the game usable without them.
