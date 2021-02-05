import React, { useEffect, useState } from "react"
import { Dialog } from "@material-ui/core"
import TransitionSlide from "../../../components/slide_transition"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import {startGame} from './engine'
import { DinoDialogContent } from "../../../components/dino_dialog"
import TextButton from '../../../components/button/text_button/index'
import { useLanguage } from "../../../context/language"
import './styles.css'
import '../variables.css'

const DinoRunner: React.FC = () => {
    const language = useLanguage()
    const [openDialog, setOpenDialog] = useState(false)

    function handleClose() {

    }

    function handleRestart() {
        
    }

    return(
        <div className="dino_runner_game">  
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
            <div id='grid'>
                <div id='dino'>
                </div>
            </div>
            <button id='start_game_button' onClick={startGame}> Iniciar o jogo </button>
        </div>
    )
}

export default DinoRunner