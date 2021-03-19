import BoardPiece from "../types/BoardPiece"

export default interface BoardProps {
    pieceList: BoardPiece[]
    onGameOver: () => void
    restart: boolean
}