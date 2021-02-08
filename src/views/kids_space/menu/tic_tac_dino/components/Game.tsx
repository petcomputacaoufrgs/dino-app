import React, { useState, useEffect } from "react";
import Board from "./Board";
import { calculateWinner } from "../helper";
import { useLanguage } from "../../../../../context/language"

interface GameProps {
  onEndGame : () => void
  gameStarted : boolean
}

const Game : React.FC <GameProps> = ({onEndGame, gameStarted}) => { 
    const language = useLanguage()
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(true);
    const winner = calculateWinner(history[stepNumber]);    
    const player = xIsNext ? "Queridino" : "Amigossauro";

    const handleClick = (i : number) => {
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[stepNumber];
        const squares = [...current];

        // return if won or occupied
        if (winner || squares[i]) return;
        // select square
        squares[i] = player;
        setHistory([...historyPoint, squares]);
        setStepNumber(historyPoint.length);
        setXisNext(!xIsNext);
    };

    useEffect(() => {
      if(gameStarted) {
        setHistory([Array(9).fill(null)])
        setStepNumber(0)
        setXisNext(true)
      }

      if(winner && gameStarted) {
        onEndGame()
      }
    }, [gameStarted, winner, onEndGame])

  return (
    <>
      <Board squares={history[stepNumber]} onClick={handleClick} />
      <div className='tic_tac_dino_game__display'>
        {winner ? language.data.WINNER + winner : language.data.NEXT_PLAYER + player}
      </div>
    </>
  )
}
export default Game