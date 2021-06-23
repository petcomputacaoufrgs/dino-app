export default interface HandleSwipeProps {
  isOffline: (piece: number, iterator: number) => boolean,
  selectLinePieces: (pieces: number[], iterator?: number) => void,
  nextPieceFrom: (pieces: number[]) => void
}
