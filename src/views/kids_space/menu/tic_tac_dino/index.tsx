import React, { useState } from "react"
import { useLanguage } from "../../../../context/language"
import HistoryService from "../../../../services/history/HistoryService"
import PathConstants from "../../../../constants/app/PathConstants"
import GameOverDialog from "../../../../components/kids_space_dialog/game_over_dialog"
import Game from './components/Game'
import '../../variables.css'
import './styles.css'
import GoBackButton from "../../../../components/button/go_back"

const TicTacDino: React.FC = () => {
  const language = useLanguage()
  const [openDialog, setOpenDialog] = useState(false)
  const [gameStarted, setGameStarted] = useState(true)
  const [message, setMessage] = useState('')

  function handleClose() {
    setOpenDialog(false)
    HistoryService.push(PathConstants.GAME_MENU)
  }

  function handleRestart() {
    setOpenDialog(false)
    setGameStarted(true)
  }

  function handleEndGame(winner : string | null) {
    if(winner) {
      setMessage(`${language.data.TIC_TAC_DINO_GAME_OVER_MSG_1} ${winner}!`)
    } else {
      setMessage(language.data.TIC_TAC_DINO_TIE)
    }
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
				<p>{message}</p>
        <p>{language.data.PLAY_AGAIN_MESSAGE}</p>
      </GameOverDialog>
      <GoBackButton path={PathConstants.GAME_MENU} />
      <Game onEndGame={handleEndGame} gameStarted={gameStarted}/>
    </div>
  );
}
export default TicTacDino