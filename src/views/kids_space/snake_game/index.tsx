import React, { useEffect, useState } from "react"
import { Dialog } from "@material-ui/core"
import TransitionSlide from "../../../components/slide_transition"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import {starGame} from './engine'
import { DinoDialogContent } from "../../../components/dino_dialog"
import TextButton from '../../../components/button/text_button/index'
import { useLanguage } from "../../../context/language"
import './styles.css'

const SnakeGame: React.FC = () => {
	const language = useLanguage()
    const [openDialog, setOpenDialog] = useState(false) 

    useEffect(() => {
        starGame(handleGameOver)
    }, [])

    const handleClose = () => {
        setOpenDialog(false)
        HistoryService.push(PathConstants.GAME_MENU)
    }

    const handleRestart = () => {
        setOpenDialog(false)
        starGame(handleGameOver)
    }
    
    const handleGameOver = () => {
        setOpenDialog(true)
    }

    return(
        <div className="snake_game">  
            <Dialog
                TransitionComponent={TransitionSlide}
                open={openDialog}
                onClose={handleClose}
                className="snake_game__dialog"
            >
				<DinoDialogContent>
					<p>{language.data.SNAKE_GAME_GAME_OVER_MSG_1}</p>
                    <p>{language.data.SNAKE_GAME_GAME_OVER_MSG_2}</p>
				</DinoDialogContent>
                <div className="snake_game__dialog__buttons">
                    <TextButton onClick={handleClose}>{language.data.DISAGREEMENT_OPTION_TEXT}</TextButton>
                    <TextButton className="snake_game__dialog__buttons__accept_button" onClick={handleRestart}>{language.data.AGREEMENT_OPTION_TEXT}</TextButton>
                </div>
            </Dialog>
            <div id="snake_game__score_board"></div>
            <div id="snake_game__game_board"></div>
        </div>
    )
}

export default SnakeGame
