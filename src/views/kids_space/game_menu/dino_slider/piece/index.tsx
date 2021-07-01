import React from 'react'
import './styles.css'

const SliderPiece: React.FC<{num: number, reduced?: boolean}> = ({num, reduced}) => 
    <div className={`piece piece_${num}` + (reduced ? ' reduced' : '')}>
        {num !== 0 
            ? reduced 
                ? Math.log2(num) 
                : num 
            : <></>}
    </div>

export default SliderPiece