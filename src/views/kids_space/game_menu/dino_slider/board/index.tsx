import React, { useEffect, useState } from 'react'
import { useEvent } from '..'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import Piece from '../piece'
import HandleSwipeProps from './props'
import './styles.css'

const SliderBoard: React.FC<{ restart: boolean, onGameOver: () => void }> = ({restart, onGameOver}) => {
    
  const SQUARES = 16
  const LINES = SQUARES / 4 
  const TO = 0
  const FROM = 1

  const [gameState, setGameState] = useState([] as number[])

  const addNumber = (grid: number[]) => {
    let freeIndexes = new Array<number>()

    grid.forEach((p, index) => { 
      if(p === 0) freeIndexes.push(index) 
    })
    
    if(ArrayUtils.isNotEmpty(freeIndexes)) {
      let randomIndex = ArrayUtils.randomItem(freeIndexes)
      grid[randomIndex] = Math.random() >= 0.2 ? 2 : 4
    } else if(isGameOver()) onGameOver()
  }

  const isGameOver = () => {
    const hasMoveLeft = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].some(move => handleKeyDown(move, true))
    return !hasMoveLeft
  }

  const handleKeyDown = (key: string, accessMove?: boolean) => {

    const moveProps: HandleSwipeProps | undefined = moveFunctions[key]

    return moveProps ? handleSwipe(moveProps, accessMove) : false
  }

  const initialize = () => {
    let newGrid = new Array(SQUARES).fill(0)
    addNumber(newGrid)
    addNumber(newGrid)
    return newGrid
  }

  useEffect(() => setGameState(initialize()), [restart])
  
  useEvent("keydown", (event: KeyboardEvent) => handleKeyDown(event.key))

  const handleSwipe = ({isOffline, selectLinePieces, nextPieceFrom}: HandleSwipeProps, accessMove?: boolean) => {

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
          if(accessMove) return true
          transfer(newArray, pieces[TO], pieces[FROM])
          nextPieceFrom(pieces)
        } 
        else selectLinePieces(pieces)
      }
    }

    if(!accessMove) {
      addNumber(newArray)
      setGameState([...newArray])
    }
    
    return false
  }

  const handleSwipeLeft: HandleSwipeProps = {
    isOffline: (piece: number, iterator: number) => piece > (iterator * LINES) + LINES - 1,    
    selectLinePieces: (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES) : (pieces[TO] + 1)
      pieces[FROM] = pieces[TO] + 1
    },
    nextPieceFrom: (pieces: number[]) => pieces[FROM]++
}

  const handleSwipeUp: HandleSwipeProps = {
    isOffline: (piece: number, iterator: number) => piece > iterator + (LINES * (LINES - 1)),
    selectLinePieces: (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? iterator : (pieces[TO] + LINES)
      pieces[FROM] = pieces[TO] + LINES
    },
    nextPieceFrom: (pieces: number[]) => pieces[FROM] += LINES    
  }

  const handleSwipeDown: HandleSwipeProps = {
    isOffline: (piece: number, iterator: number) => piece < iterator,
    selectLinePieces: (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? (iterator + LINES * (LINES - 1)) : (pieces[TO] - LINES)
      pieces[FROM] = pieces[TO] - LINES
    },
    nextPieceFrom: (pieces: number[]) => pieces[FROM] -= LINES
  }

  const handleSwipeRight: HandleSwipeProps = {
    isOffline: (piece: number, iterator: number) => piece < (iterator * LINES),
    selectLinePieces: (pieces: number[], iterator?: number) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES + (LINES - 1)) : (pieces[TO] - 1)
      pieces[FROM] = pieces[TO] - 1
    },
    nextPieceFrom: (pieces: number[]) => pieces[FROM]--
  }

  const moveFunctions = {
    ArrowUp: handleSwipeUp,
    ArrowDown: handleSwipeDown,
    ArrowLeft: handleSwipeLeft,
    ArrowRight: handleSwipeRight,
  }

  return (
      <div className="board">
          {gameState.map((number, index) => <Piece num={number} key={index}/>)}
      </div>
  )
}

export default SliderBoard