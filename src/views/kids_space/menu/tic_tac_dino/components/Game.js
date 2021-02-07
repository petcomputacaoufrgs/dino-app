import React, { useState } from "react";
import Board from "./Board";
import { calculateWinner } from "../helper";

const Game = () => { 
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(history[stepNumber]);
    const player = xIsNext ? "Queridino" : "Amigossauro";

    const handleClick = (i) => {
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[stepNumber];
        const squares = [...current];
        // return if won or occupied
        if (winner) {
            console.log('ganhou')
        }
        if (winner || squares[i]) return;
        // select square
        squares[i] = player;
        setHistory([...historyPoint, squares]);
        setStepNumber(historyPoint.length);
        setXisNext(!xIsNext);
    };

  return (
    <>
      <Board squares={history[stepNumber]} onClick={handleClick} />
      <div className='tic_tac_dino_game__display'>
        {winner ? 'Winner: ' + winner : "Next Player: " + player}
      </div>
    </>
  );
}
export default Game