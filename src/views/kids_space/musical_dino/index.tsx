import React, { useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { startGame } from './engine/index.js'
import { ReactComponent as DinoSVG } from '../../../assets/kids_space/dinogotchi/dino.svg'
import { Dialog } from "@material-ui/core"
import TransitionSlide from "../../../components/slide_transition"
import { DinoDialogContent } from "../../../components/dino_dialog"
import { useLanguage } from "../../../context/language"
import './styles.css'
import TextButton from '../../../components/button/text_button'

const MusicalDino: React.FC = () => {
    const language = useLanguage()
    const [openDialog, setOpenDialog] = useState(false)
    
    function handleWin() {
        setOpenDialog(true)
    }

    function handleClose() {
        setOpenDialog(false)
        HistoryService.push(PathConstants.GAME_MENU)
    }

    function handleRestart() {
        setOpenDialog(false)
        startGame(handleWin)
    }

	return (
		<>
            <Dialog
                TransitionComponent={TransitionSlide}
                open={openDialog}
                onClose={handleClose}
            >
				<DinoDialogContent>
					<p>{language.data.MUSICAL_DINO_GAME_MSG_1}</p>
                    <p>{language.data.MUSICAL_DINO_GAME_MSG_2}</p>
				</DinoDialogContent>
                <div>
                    <TextButton onClick={handleClose}>{language.data.DISAGREEMENT_OPTION_TEXT}</TextButton>
                    <TextButton onClick={handleRestart}>{language.data.AGREEMENT_OPTION_TEXT}</TextButton>
                </div>
            </Dialog>
            <div className='header'>
                <button
                    onClick={() => {
                        HistoryService.push(PathConstants.GAME_MENU)
                    }}
                >
                    Clica ae
                </button>
                <div id='turn'> 0 </div>
            </div>
            <div className="dino_song_board">
                <div className='top'>
                    <div id="topleft" className='dino dino_green'>
                        <DinoSVG />
                    </div>
                    <div id="topright" className='dino dino_red'>
                        <DinoSVG />
                    </div>
                </div>
                <div className='bottom'>
                    <div id="bottomleft" className='dino dino_yellow'>
                        <DinoSVG />
                    </div>
                    <div id="bottomright" className='dino dino_blue'>
                        <DinoSVG />
                    </div>
                </div>
            </div>
			<div className='start_game'>
                <button className='start_game__button' id="start" onClick = {() => {startGame(handleWin)}}>Iniciar jogo</button>
            </div>
		</>
	)
}

export default MusicalDino