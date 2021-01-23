// go-classes.jsx
// Contains class definitions used across the project

import { array_union, array_difference } from './helpers';

export class Group {
    constructor(stones, color) {
        if (stones) this.stones = stones;
        else this.stones = [];
        this.border = [];
        this.color = color;
    }

    // Merge this group with another
    mergeWith(other) {
        if (this.color !== other.color)
            throw new Error("Groups of differing colors cannot be merged.");
        this.stones = array_union(this.stones, other.stones);
        this.border = array_difference(array_union(this.border, other.border), this.stones);
    }

    numLiberties(board) {
        return this.border.reduce((sum, uv) => {
            return board.squares[uv[0]][uv[1]] === null ? sum+1 : sum;
        }, 0);
    }

    // Places pieces onto board
    place(board) {
        for (let stone of this.stones) {
            board.squares[stone[0]][stone[1]] = this;
        }
    }

    // Removes pieces without updating board.removals
    remove(board) {
        for (let stone of this.stones) {
            board.squares[stone[0]][stone[1]] = null;
        }
    }

    // Removes pieces and updates board.removals
    capture(board) {
        if (this.color === 'white')
            board.captured.black += this.stones.length;
        else
            board.captured.white += this.stones.length;
        this.remove(board);
    }
}