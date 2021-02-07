import React, { useState } from "react";
import { Dialog } from "@material-ui/core"
import TransitionSlide from "../../../../components/slide_transition"
import { DinoDialogContent } from "../../../../components/dino_dialog";
import TextButton from "../../../../components/button/text_button";
import { useLanguage } from "../../../../context/language"
import HistoryService from "../../../../services/history/HistoryService";
import PathConstants from "../../../../constants/app/PathConstants";
import Game from './components/Game'
import './styles.css'

const TicTacDino: React.FC = () => {
  const language = useLanguage()
  const [openDialog, setOpenDialog] = useState(false)

  function handleClose() {
    setOpenDialog(false)
    HistoryService.push(PathConstants.GAME_MENU)
  }

  function handleRestart() {
    setOpenDialog(false)
    handleStartGame()
  }

  function handleStartGame() {
    console.log('bora reiniciar')
  }

  return (
    <div className= 'tic_tac_dino_game'>
      <Dialog
        TransitionComponent={TransitionSlide}
        open={openDialog}
        onClose={handleClose}
      >
				<DinoDialogContent>
					<p>{language.data.SNAKE_GAME_GAME_OVER_MSG_1}</p>
                    <p>{language.data.SNAKE_GAME_GAME_OVER_MSG_2}</p>
				</DinoDialogContent>
                <div>
                    <TextButton onClick={handleClose}>{language.data.DISAGREEMENT_OPTION_TEXT}</TextButton>
                    <TextButton onClick={handleRestart}>{language.data.AGREEMENT_OPTION_TEXT}</TextButton>
                </div>
      </Dialog>

      <Game/>
    </div>
  );
}
export default TicTacDino