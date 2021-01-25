import React from "react"
import PathConstants from "../../../../constants/app/PathConstants"
import HistoryService from "../../../../services/history/HistoryService"

const GameMenu: React.FC = () => {
    return(
        <>  
            <div>
                Menu
            </div>
            <button onClick = {() => {HistoryService.push(PathConstants.SNAKE_GAME)}}> Clica ae </button>
            <button onClick = {() => {}}> Clica pra voltar </button>
        </>
    )
}

export default GameMenu