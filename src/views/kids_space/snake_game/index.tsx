import React, { useEffect } from "react"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import StartGame from './inner_game/index.js'
import './inner_game/styles.css'

const SnakeGame: React.FC = () => {
    useEffect(() => {
        window.addEventListener('load', StartGame)
    }, [])
    return(
        <>  
            <dialog open id="restart-dialog">
                <p> Oh não! Sua cobra bateu!</p>
                <p> Deseja jogar novamente? </p>
                <button id="cancel" type="reset" onClick = {() => {HistoryService.push(PathConstants.GAME_MENU)}}>Não</button>
                <button id="confirm">Sim!</button>
            </dialog>

            <div id="score-board"></div>
            <div id="game-board"></div>
        </>
    )
}

export default SnakeGame