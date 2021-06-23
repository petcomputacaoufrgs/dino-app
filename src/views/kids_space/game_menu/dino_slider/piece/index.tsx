import React from 'react'
import './styles.css'

interface PieceProps {
    num: number
}

const Piece: React.FC<PieceProps> = ({num}) => {
    return(
        <div className={`piece piece_${num}`}>
            {num}
        </div>
    )
}
export default Piece