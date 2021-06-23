import React, { useEffect, useState } from 'react'
import { useEvent } from '..'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import Utils from '../../../../../utils/Utils'
import Piece from '../piece'
import HandleSwipeProps from './props'
import './styles.css'

const SliderBoard = () => {
    
  const SQUARES = 16
  const LINES = SQUARES/4 
  const TO = 0
  const FROM = 1

  const addNumber = (grid: number[]) => {
    let freeIndexes = new Array<number>()

    grid.forEach((p, index) => {
      if(p === 0) freeIndexes.push(index)
    })
    
    if(Utils.isNotEmpty(freeIndexes)) {
      let randomIndex = ArrayUtils.randomItem(freeIndexes)
      grid[randomIndex] = Math.random() >= 0.2 ? 2 : 4
    }
  }

  const initialize = () => {
    let newGrid = new Array(SQUARES).fill(0)
    addNumber(newGrid)
    addNumber(newGrid)
    return newGrid
  }

  const [gameState, setGameState] = useState([] as number[])

  useEffect(() => setGameState(initialize()), [])

  const handleKeyDown = (event: KeyboardEvent) => {

    const move = {
      ArrowUp: handleSwipeUp,
      ArrowDown: handleSwipeDown,
      ArrowLeft: handleSwipeLeft,
      ArrowRight: handleSwipeRight,
    }

    const moveFunction: () => void | undefined = move[event.key]

    if(moveFunction) moveFunction()
  }

  const handleSwipe = ({isOffline, selectLinePieces, nextPieceFrom}: HandleSwipeProps) => {

    const transfer = (array: number[], pieceTo: number, pieceFrom: number) => {
      array[pieceTo] += array[pieceFrom]
      array[pieceFrom] = 0
    }

    let newArray = [...gameState]
    let pieces = [0,1]
    
    for(let i = 0; i < LINES; i++) {
      selectLinePieces(pieces, i)
      while (!isOffline(pieces[TO], i)) {
        if(isOffline(pieces[FROM], i)) {
          selectLinePieces(pieces)
        }
        else if(newArray[pieces[FROM]] === 0) {
          nextPieceFrom(pieces)
        } 
        else if(newArray[pieces[TO]] === 0 || newArray[pieces[TO]] === newArray[pieces[FROM]]) {
          transfer(newArray, pieces[TO], pieces[FROM])
          nextPieceFrom(pieces)
        } 
        else selectLinePieces(pieces)
      }
    }

    addNumber(newArray)
    setGameState([...newArray])
  }

  const handleSwipeLeft = () => {

    const isOffline = (piece: number, iterator: number) => piece > (iterator * LINES) + LINES - 1
    
    const selectLinePieces = (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES) : (pieces[TO] + 1)
      pieces[FROM] = pieces[TO] + 1
    }

    const nextPieceFrom = (pieces: number[]) => pieces[FROM]++

    handleSwipe({isOffline, selectLinePieces, nextPieceFrom})
}

  const handleSwipeUp = () => {

    const isOffline = (piece: number, iterator: number) => piece > iterator + (LINES * (LINES - 1)) 

    const selectLinePieces = (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? iterator : (pieces[TO] + LINES)
      pieces[FROM] = pieces[TO] + LINES
    }

    const nextPieceFrom = (pieces: number[]) => pieces[FROM] += LINES
    
    handleSwipe({isOffline, selectLinePieces, nextPieceFrom})	
  }

    const handleSwipeDown = () => {

      const isOffline = (piece: number, iterator: number) => piece < iterator 

      const selectLinePieces = (pieces: number[], iterator?: number) => {
        pieces[TO] = iterator !== undefined ? (iterator + LINES * (LINES - 1)) : (pieces[TO] - LINES)
        pieces[FROM] = pieces[TO] - LINES
      }
  
      const nextPieceFrom = (pieces: number[]) => pieces[FROM] -= LINES
      
      handleSwipe({isOffline, selectLinePieces, nextPieceFrom})	
  }

  const handleSwipeRight = () => {

    const isOffline = (piece: number, iterator: number) => piece < (iterator * LINES) 

    const selectLinePieces = (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES + (LINES - 1)) : (pieces[TO] - 1)
      pieces[FROM] = pieces[TO] - 1
    }

    const nextPieceFrom = (pieces: number[]) => pieces[FROM]--
    
    handleSwipe({isOffline, selectLinePieces, nextPieceFrom})
  }
  
  useEvent("keydown", handleKeyDown)

  return (
      <div className="board">
          {gameState.map(
              (number, index) => <Piece num={number} key={index}/>
          )}
      </div>
  )
}

export default SliderBoard