// go-board.jsx
// Handles rendering of the board state
// Does NOT handle any game logic!!!

import React, {Component} from 'react';
import {toRowCol, toIndex} from './helpers';

class Board extends Component {
    render() {
        const rows = [];
        for (let row=0; row<this.props.size; row++)
            rows.push(this.renderRow(row));
        return ( <div className="game-board">{rows}</div> );
    }

    renderRow(row) {
        const rowSquares = [];
        for (let col=0; col<this.props.size; col++)
        {
            const i = toIndex(row, col, this.props.size);
            rowSquares.push(this.renderSquare(i));
        }
        return <div className="board-row">{rowSquares}</div>;
    }

    renderSquare(i) {
        const edge = determineEdge(this.props.size, toRowCol(i, this.props.size))
        let img_src = "./img/cross_32.png";
        if (this.props.squares[i] != null)
            img_src = "./img/"+this.props.squares[i]+"_32.png";
        else if (edge != null)
            img_src = "./img/cross_"+edge+"_32.png";
        return (
            <button 
            className="square" 
            onClick= {() => this.props.onClick(i)}>
                {<img src={img_src} alt={this.props.squares[i]}/>}
            </button>
        );
    }
}

// Helper functions //
function determineEdge(size, rowCol) {
    const row = rowCol.row;
    const col = rowCol.col;
    if (col===0 && row===0)                 return 'TL';
    else if (col===0 && row===size-1)       return 'BL';
    else if (col===size-1 && row===0)       return 'TR';
    else if (col===size-1 && row===size-1)  return 'BR';
    else if (col===0)                       return 'L';
    else if (col===size-1)                  return 'R';
    else if (row===0)                       return 'T';
    else if (row===size-1)                  return 'B';
    else return null;
}

export default Board;