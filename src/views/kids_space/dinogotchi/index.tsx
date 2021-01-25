import React from "react"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"

const Dinogotchi: React.FC = () => {
    return(
        <>  
            <div>
                Eu sou o Dinogotchi :p
            </div>
            <button onClick = {() => {HistoryService.push(PathConstants.SNAKE_GAME)}}> Clica ae </button>
            <button onClick = {() => {HistoryService.push(PathConstants.HOME)}}> Clica pra voltar </button>
        </>
    )
}

export default Dinogotchi