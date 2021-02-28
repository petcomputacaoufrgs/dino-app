import React, { useEffect, useState } from 'react'
import BoardProps from './props'
import Piece from '../piece'
import './styles.css'

function sleep(ms:number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

const Board: React.FC<BoardProps> = ({
    pieceList
}) => {
    const [pieceState, setPieceState] = useState(pieceList)
    const [turnedPieceIndex, setTurnedPieceIndex] = useState<number>(-1)
    const [blocked, setBlocked] = useState<boolean>(false)
    const [score, setScore] = useState(0)
    const [turnBack, setTurnBack] = useState<boolean>(false)
    const [visibility, setVisibility] = useState(true)


    useEffect(() => {
        document.title = "Pontos: " + score
    }, [score])

    const handleOnClick = async(index: number) => {
        if(!pieceState[index].turned && !blocked) {
            pieceState[index].turned = true

            if(turnedPieceIndex === -1) {
                setTurnedPieceIndex(index)
            } else {
                setPieceState([...pieceState])
                setBlocked(true)
                
                await sleep(500)

                if (pieceState[turnedPieceIndex].image === pieceState[index].image) {
                    setScore(score + 1)
                    
                    setVisibility(false)

                    await sleep(1500)

                    setBlocked(false)
                    setVisibility(true)

                    pieceState[turnedPieceIndex].visible = false
                    pieceState[index].visible = false

                } else {
                    setTurnBack(true)

                    await sleep(1500)

                    setBlocked(false)
                    setTurnBack(false)

                    // desvirar as peças
                    pieceState[index].turned = false
                    pieceState[turnedPieceIndex].turned = false
                }

                setTurnedPieceIndex(-1)
            }

            setPieceState([...pieceState])
        }
    }

    return (
        <div className="Board">
            {pieceState.map((piece, index) => (
                <Piece piece={piece} key={index} turned={turnBack} visible={visibility} onClick={() => handleOnClick(index)} />
            ))}
        </div>
    )
}

export default Board