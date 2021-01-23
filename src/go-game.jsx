import React, {Component} from 'react';
import Board from './go-board.jsx';
import {placePiece, calculateScores} from './go-logic';

export class Game extends Component {
    constructor(props) {
        super(props);

        // Non-stateful tracker variables
        this.scores = null;
        this.whiteIsNext = false;
        
        // Construct initial 2D board array
        const squares = new Array(this.props.size);
        for (let i=0; i<this.props.size; i++)
            squares[i] = new Array(this.props.size).fill(null);
        
        // Stateful variables which trigger
        // re-renders upon value changes.
        this.state = {
            board: {
                squares: squares,
                territories: null,
                captured: {white: 0, black: 0},
                ko_block: null,
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
            scorecard = 'Captures: White ('+this.state.board.captured.white+') Black ('+this.state.board.captured.black+')';
        }
        return (
            <div className="game" key="game">
                <Board
                    size = {this.props.size}
                    squares = {this.state.board.squares}
                    onClick = {(x,y) => this.handleClick(x,y)}
                />
                <div className="game-info" key="game-info">
                    <div key="status-text">{status}</div>
                    <div key="score-text">{scorecard}</div>
                    {passBtn}
                </div>
            </div>
        );
    }

    // Event handlers //
    handleClick(x, y) {
        // do nothing if game is over
        if (this.state.gameOver) return;

        // Place next game piece (mutates this.state.board)
        const is_valid = placePiece(this.state.board, x, y, this.nextPlayStr());
        if (!is_valid) return;

        // Update game trackers
        this.whiteIsNext = !this.whiteIsNext;
        // Update game state
        this.setState({
            board: this.state.board,
            passed: false,
            gameOver: false,
        })
    }

    passClick() {
        this.whiteIsNext = !this.whiteIsNext;
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