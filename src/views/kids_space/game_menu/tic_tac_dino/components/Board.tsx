import React from "react";
import Square from "./Square";

interface BoardProps {
  squares : number[]
  onClick : (index : number) => void
}

const Board : React.FC <BoardProps> = ({ squares, onClick }) => (
  <div className="board">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

export default Board;