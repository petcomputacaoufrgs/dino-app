export interface HandleSwipeProps {
  isOffline: (piece: number, iterator: number) => boolean,
  selectLinePieces: (pieces: number[], iterator?: number) => void,
  nextPieceFrom: (pieces: number[]) => void
}

export interface SliderPieceProps {
  reduced: boolean,
  value: number,
}

export default interface SliderBoardProps { 
  restart: boolean, onGameOver: () => void 
  reduced: boolean
}