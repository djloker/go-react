// see https://github.com/nikzaugg/Go-Game/blob/master/game_model.py for logic implementation

// go-logic.jsx
// Handles game logic
// Board info is passed in and treated as immutable.

class Group {
    constructor(stones, color) {
        if (stones) this.stones = stones;
        else this.stones = [];
        this.border = [];
        this.color = color;
    }
}

export function placePiece(board, x, y, color) {
    // cannot replace existing pieces
    if (board.squares[x][y]) return null;

    const enemy = color === 'white' ? 'black' : 'white';
    const removed = {
        white: board.removals.white,
        black: board.removals.black,
    };
    /*
    const new_group = new Group([row, col], color); // create new group at placement point
    const groups_to_capture = [];
    const groups_to_disable = [];

    const new_squares = board.squares.slice();
    new_squares[i] = color;

    // check we aren't doing a self-removal by placing here.
    const adjacencies = [
        [row-1,col],
        [row+1,col],
        [row,col-1],
        [row,col+1],
    ];
    for (let adj_i=0; adj_i<4; adj_i++)
    {
        const u = adjacencies[adj_i][0]; // x-pos of current adjacency
        const v = adjacencies[adj_i][1]; // y-pos of current adjacency
        if (u < 0 || v < 0 || u >= board.size || v >= board.size) continue; // verify (u,v) is inside board
        new_group.border = new_group.border.concat([u,v]);
    }
    alert(new_group.border);

    // TODO: removals of enemy pieces.
    */
    const new_squares = board.squares.slice();
    new_squares[x][y] = color;
    return {
        size: board.size,
        squares: new_squares,
        territories: null,
        removals: removed,
    };
}

export function calculateScores(board) {
    // TODO: calculate scores
    let score_w = board.removals.white;
    let score_b = board.removals.black;
    return {
        white: score_w,
        black: score_b,
    };
}