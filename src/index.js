import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from './go-game';
import './index.css';

/*
Extended from Tic-Tac-Toe tutorial @ https://reactjs.org/tutorial/tutorial.html
Host locally using "npm start"
*/

ReactDOM.render(
    <Game size={9}/>,
    document.getElementById('root')
);