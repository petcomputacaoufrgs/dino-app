import React from 'react'
import './styles.css'

const SliderPiece: React.FC<{num: number, reduced?: boolean}> = ({num, reduced}) => 
    <div className={`dino_slider__piece piece_${num}` + (reduced ? ' reduced' : '')}>
        {num !== 0 
            ? reduced 
                ? Math.log2(num) 
                : num 
            : <></>}
    </div>

export default SliderPiece