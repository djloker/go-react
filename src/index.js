import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './go-board.jsx';
import {canPlace, placePiece, calculateScores} from './go-logic';
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

        // Stateful variables which trigger
        // re-renders upon value changes.
        this.state = {
            board: Array(this.props.size ** 2).fill(null),
            passed: false,
            gameOver: false,
        };
    }

    render() {
        let status;
        let scorecard = null;
        let passBtn = null;
        if (this.state.gameOver) {
            if (this.scores == null) this.scores = calculateScores();
            status = 'Both players passed their turn. Game is over.';
            scorecard = <div>{'White: '+this.scores.white+' Black: '+this.scores.black}</div>
        } else {
            passBtn = <button onClick = {() => this.passClick()}><p>Pass Turn</p></button>;
            if (this.state.passed) {
                status = this.nextPlayStrIC() + ' passed their turn. Next player: ' + this.nextPlayStrC();
            } else {
                status = 'Next player: ' + this.nextPlayStrC();
            }
        }
        return (
            <div className="game">
                <Board
                    size = {this.props.size}
                    squares = {this.state.board}
                    onClick = {(i) => this.handleClick(i)}
                />
                <div className="game-info">
                    <div>{status}</div>
                    {scorecard}
                    {passBtn}
                </div>
            </div>
        );
    }

    // Event handlers //
    handleClick(i) {
        const color = this.nextPlayStr();
        // do nothing if game is over
        if (this.state.gameOver) return;
        // must also attend to the ko-block rule
        else if (i === this.ko_block_pos) return;
        // can't replace a piece that exists
        else if (!canPlace(this.state.board, i, color)) return;

        // Place next game piece
        const squares = placePiece(this.state.board, i, color);
        // Update game trackers
        this.whiteIsNext = !this.whiteIsNext;
        // Update game state
        this.setState({
            board: squares,
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

// ========================================

ReactDOM.render(
    <Game size={9}/>,
    document.getElementById('root')
);