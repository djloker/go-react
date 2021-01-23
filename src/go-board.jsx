// go-board.jsx
// Handles rendering of the board state
// Does NOT handle any game logic!!!

import React, {Component} from 'react';

class Board extends Component {
    render() {
        const rows = [];
        for (let row=0; row<this.props.size; row++)
            rows.push(this.renderRow(row));
        return <div className="game-board" key="game-board">{rows}</div>;
    }

    renderRow(y) {
        const rowSquares = [];
        for (let x=0; x<this.props.size; x++)
            rowSquares.push(this.renderSquare(x,y));
        return <div className="board-row" key={'row-'+y}>{rowSquares}</div>;
    }

    renderSquare(x,y) {
        const edge = determineEdge(this.props.size, x, y)
        let img_src = "./img/cross_32.png";
        let altText = "empty";
        if (this.props.squares[x][y] != null)
        {
            altText = this.props.squares[x][y].color;
            img_src = "./img/"+altText+"_32.png";
        }
        else if (edge != null)
            img_src = "./img/cross_"+edge+"_32.png";
        
        return (
            <button className="square" onClick= {() => this.props.onClick(x,y)}>
                {<img src={img_src} alt={altText} draggable="false"/>}
            </button>
        );
    }
}

// Helper functions //
function determineEdge(size, x, y) {
    if (x===0 && y===0)                 return 'TL';
    else if (x===0 && y===size-1)       return 'BL';
    else if (x===size-1 && y===0)       return 'TR';
    else if (x===size-1 && y===size-1)  return 'BR';
    else if (x===0)                     return 'L';
    else if (x===size-1)                return 'R';
    else if (y===0)                     return 'T';
    else if (y===size-1)                return 'B';
    else return null;
}

export default Board;