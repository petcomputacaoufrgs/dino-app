import React from 'react'
import './styles.css'

const Piece: React.FC<{num: number}> = ({num}) => 
    <div className={`piece piece_${num}`}>
        {num !== 0 ? num : <></>}
    </div>

export default Piece