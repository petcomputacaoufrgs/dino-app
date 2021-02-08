import React, { useState } from "react"
import { useLanguage } from "../../../../context/language"
import HistoryService from "../../../../services/history/HistoryService"
import PathConstants from "../../../../constants/app/PathConstants"
import GameOverDialog from "../../../../components/game_over_dialog"
import Game from './components/Game'
import '../../variables.css'
import './styles.css'

const TicTacDino: React.FC = () => {
  const language = useLanguage()
  const [openDialog, setOpenDialog] = useState(false)
  const [gameStarted, setGameStarted] = useState(true)

  function handleClose() {
    setOpenDialog(false)
    HistoryService.push(PathConstants.GAME_MENU)
  }

  function handleRestart() {
    setOpenDialog(false)
    setGameStarted(true)
  }

  function handleEndGame() {
    setOpenDialog(true)
    setGameStarted(false)
  }

  return (
    <div className='tic_tac_dino_game'>
      <GameOverDialog
        onAgree={handleRestart}
        onDisagree={handleClose}
        open={openDialog}
      >
				<p>{language.data.TIC_TAC_DINO_GAME_OVER_MSG_1}</p>
        <p>{language.data.PLAY_AGAIN_MESSAGE}</p>
      </GameOverDialog>
      <Game onEndGame={handleEndGame} gameStarted={gameStarted}/>
    </div>
  );
}
export default TicTacDino