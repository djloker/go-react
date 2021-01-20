// see https://github.com/nikzaugg/Go-Game/blob/master/game_model.py for logic implementation

// go-logic.jsx
// Handles game logic
// Board info is passed in and treated as immutable.

export function canPlace(board, i, color) {
    // can't replace existing piece
    if (board[i]) return false;
    // TODO: check we aren't doing a self-removal by placing here.
    return true;
}

export function placePiece(board, i, color) {
    const squares = board.slice();
    squares[i] = color;
    const enemy = color === 'white' ? 'black' : 'white';
    // TODO: removals of enemy pieces.
    return squares;
}

export function calculateScores(squares) {
    // TODO: calculate scores
    return {white:0, black:0};
}