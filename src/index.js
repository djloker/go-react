import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './go-board.jsx';
import {placePiece, calculateScores} from './go-logic';
import './index.css';

/*
Extended from Tic-Tac-Toe tutorial @ https://reactjs.org/tutorial/tutorial.html
Host locally using "npm start"
*/

class Game extends Component {
    constructor(props) {
        super(props);

        // Non-stateful tracker variables
        this.scores = null;
        this.whiteIsNext = false;
        this.ko_block_pos = null;
        
        // Construct 2D board
        const squares = new Array(this.props.size);
        for (let i=0; i<this.props.size; i++)
            squares[i] = new Array(this.props.size).fill(null);
        // Stateful variables which trigger
        // re-renders upon value changes.
        this.state = {
            board: {
                squares: squares,
                territories: null,
                removals: {white: 0, black: 0},
            },
            passed: false,
            gameOver: false,
        };
    }

    render() {
        let status;
        let scorecard = null;
        let passBtn = null;
        if (this.state.gameOver) {
            if (this.scores === null) this.scores = calculateScores(this.state.board);
            if (this.state.passed) status = 'Both players passed their turn. Game is over.';
            else status = 'Board is full. Game is over.'
            scorecard = 'SCORE- White: '+this.scores.white+' Black: '+this.scores.black;
            if (this.scores.white > this.scores.black)      scorecard += ' (White wins!)'
            else if (this.scores.white < this.scores.black) scorecard += ' (Black wins!)'
            else                                            scorecard += ' (Draw!)'
        } else {
            passBtn = <button onClick = {() => this.passClick()}><p>Pass Turn</p></button>;
            if (this.state.passed) {
                status = this.nextPlayStrIC() + ' passed their turn. Next player: ' + this.nextPlayStrC();
            } else {
                status = 'Next player: ' + this.nextPlayStrC();
            }
            scorecard = 'Captures: White ('+this.state.board.removals.white+') Black ('+this.state.board.removals.black+')';
        }
        return (
            <div className="game">
                <Board
                    size = {this.props.size}
                    squares = {this.state.board.squares}
                    onClick = {(x,y) => this.handleClick(x,y)}
                />
                <div className="game-info">
                    <div>{status}</div>
                    <div>{scorecard}</div>
                    {passBtn}
                </div>
            </div>
        );
    }

    // Event handlers //
    handleClick(x,y) {
        const color = this.nextPlayStr();
        // do nothing if game is over
        if (this.state.gameOver) return;
        // must also attend to the ko-block rule
        else if ([x,y] === this.ko_block_pos) return;

        // Place next game piece
        const new_board = placePiece(this.state.board, x, y, color);
        if (!new_board) return; // if invalid placement, placePiece returns null
        // Update game trackers
        this.whiteIsNext = !this.whiteIsNext;
        // Update game state
        this.setState({
            board: new_board,
            passed: false,
            gameOver: false,
        })
    }

    passClick() {
        this.whiteIsNext = !this.whiteIsNext;
        this.ko_block_pos = null;

        const prevPassed = this.state.passed;
        this.setState({
            board: this.state.board,
            passed: true,
            gameOver: this.state.gameOver || prevPassed, // if both players pass the game is declared over
        });
    }

    // Helper functions
    nextPlayStr()   { return this.whiteIsNext ? 'white' : 'black'; }
    nextPlayStrI()  { return this.whiteIsNext ? 'black' : 'white'; }
    nextPlayStrC()  { return this.whiteIsNext ? 'White' : 'Black'; }
    nextPlayStrIC() { return this.whiteIsNext ? 'Black' : 'White'; }
}

// ========================================

ReactDOM.render(
    <Game size={9}/>,
    document.getElementById('root')
);