// see https://github.com/nikzaugg/Go-Game/blob/master/game_model.py for logic implementation

// go-logic.jsx
// Handles game logic
// Board info is passed in and treated as immutable.

import { Group } from './go-classes';

function validatePosition(size, x, y) {
    return x >= 0 && y >= 0 && x < size && y < size;
}

function getAdjacent(x,y) {
    return [
        [x-1,y], [x+1,y], //  left & right
        [x,y-1], [x,y+1], // above & below
    ];
}

export function placePiece(board, x, y, color) {
    // cannot replace existing pieces
    if (board.squares[x][y]) return false;
    // cannot break the ko rule
    if ([x, y] === board.ko_block) return false;

    const board_size = board.squares.length;

    // Trackers for cleanup after placement
    const groups_to_capture = [];
    const groups_to_remove = [];

    // We create a new group at placement point but do not store it, yet
    // - we must determine whether it is a valid placement first.
    let valid_move = false;
    const new_group = new Group([ [x, y], ], color);

    // Check directly adjacent groups to placement point so that we can
    // - establish move validity (can't self-kill)
    // - merge with same-colored groups
    // - remove enemy-colored groups
    const adjacencies = getAdjacent(x, y);
    for (const adj of adjacencies) {
        const u = adj[0]; // x-pos of current adjacency
        const v = adj[1]; // y-pos of current adjacency
        if (!validatePosition(board_size, u, v)) continue; // verify (u,v) is inside board
        
        new_group.border.push([u,v]); // add adjacency to border of new group

        // Now we perform checks against any adjacent group.
        const adj_group = board.squares[u][v];
        if (adj_group === null) {
            valid_move = true;
            continue;
        } else if (adj_group.color === new_group.color) {
            new_group.mergeWith(adj_group);   // merge placement group with adjacent group
            groups_to_remove.push(adj_group); // flag neighboring group for deletion (if move determined valid)
        } else if (adj_group.numLiberties(board) === 1) {
            // since placement removes final liberty of enemy group, this is a killing move
            valid_move = true;
            if (!groups_to_capture.includes(adj_group))
                groups_to_capture.push(adj_group);
        }
    }

    // Must have at least one liberty for a valid move (can't self-kill)
    // we OR this check against any previous checks on valid_move.
    if (new_group.numLiberties(board) >= 1) {
        valid_move = true;
    }

    // We have finalized valid_move, so if invalid proceed no futher
    if (!valid_move) {
        return false;
    }

    // Perform scheduled captures && removals
    for (const to_remove of groups_to_remove) {
        to_remove.remove(board);
    }
    for (const to_capture of groups_to_capture) {
        to_capture.capture(board);
    }
    // Actually execute the move
    new_group.place(board);

    // Determine if there is a ko block to store, and store it.
    board.ko_block = null;
    if (new_group.stones.length === 1               // 1. new group has only one stone
    && groups_to_capture.length === 1               // 2. only one group to be captured
    && groups_to_capture[0].stones.length === 1) {  // 3. captured group has only one stone
        board.ko_block = groups_to_capture[0].stones[0].slice(); // store ko block
    }

    return true;
}

function checkAndCountEmpty(board, x, y, checked, count) {
    if (count === null) {
        count = {white: 0, black: 0,};
    }
    // base case for recursion (position is empty or has been checked)
    if (board.squares[x][y] || checked.includes(JSON.stringify([x,y]))) {
        return count;
    }
    // add current position to checked list
    checked.push(JSON.stringify([x,y]));
    // check all neighbors
    const adjacencies = getAdjacent(x, y);
    for (const adj of adjacencies) {
        const u = adj[0]; // x-pos of current adjacency
        const v = adj[1]; // y-pos of current adjacency
        // skip out-of-map adjacencies
        if (!validatePosition(board.squares.length, u, v)) {
            continue;
        }
        // ignore adjacencies which have been checked
        if (!checked.includes(JSON.stringify([u,v]))) {
            // recurse on empty squares
            if (board.squares[u][v] === null) {
                checkAndCountEmpty(board, u, v, checked, count);
            } else { // count on non-empty adjacency
                if (board.squares[u][v].color === 'white') {
                    count.white++;
                } else {
                    count.black++;
                }
            }
        }
    }
    return count;
}

export function calculateScores(board) {
    const board_size = board.squares.length;

    let score_w = board.captured.white;
    let score_b = board.captured.black;
    const checked = [];
    // calculate owned territories
    for (let x=0; x<board_size; x++) {
        for (let y=0; y<board_size; y++) {
            if (checked.includes(JSON.stringify([x,y]))) {
                continue;
            }
            // only check empty squares
            if (board.squares[x][y] === null) {
                // find empty fields starting at [x,y]
                const count = checkAndCountEmpty(board, x, y, checked, null);
                // increment scores
                if (count.black === 0 && count.white > 0) {
                    score_w++;
                } else if (count.black > 0 && count.white === 0) {
                    score_b++;
                }
            }
        }
    }
    return { white: score_w, black: score_b, };
}