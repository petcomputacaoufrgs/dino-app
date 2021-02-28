import React from 'react'
import './styles.css'
import PieceProps from './props'

const Piece: React.FC<PieceProps> = ({
    piece,
    onClick,
    turned: turnedBack,
    visible
}) => {
    const Image = piece.image
    
    const renderPiece = (turned:boolean) => (
        <div className={turned? (turnedBack? "piece_container reverse" : (visible? "piece_container turned" : "piece_container scored")) : "piece_container"}>
            <Image className="piece piece__front" />
            <div className="piece piece__back" />
        </div>
    )

    return (
        <div className="piece" onClick={onClick}>
        { piece.turned && piece.visible
            ? renderPiece(piece.turned) 
            : piece.visible
                ? renderPiece(piece.turned)
                : <div className="piece__invisible_piece" />
        }
        </div>
    )
}

export default Piece