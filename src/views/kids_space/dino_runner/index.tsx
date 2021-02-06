import React, { useState, useRef, useEffect } from "react"
import { Dialog } from "@material-ui/core"
import TransitionSlide from "../../../components/slide_transition"
import { startDinoRunnerGame } from './engine/game'
import { DinoDialogContent } from "../../../components/dino_dialog"
import TextButton from '../../../components/button/text_button/index'
import { useLanguage } from "../../../context/language"
import HistoryService from '../../../services/history/HistoryService'
import PathConstants from "../../../constants/app/PathConstants"
import { ReactComponent as BackgroundSVG } from '../../../assets/kids_space/dino_runner/background.svg'
import './styles.css'

const DinoRunner: React.FC = () => {
    const language = useLanguage()

    const dinoRunnerGameContainer = useRef<HTMLDivElement>(null)
    const dinoRunnerGameGrid = useRef<HTMLDivElement>(null)
    const dinoRunnerGameCharacter = useRef<HTMLDivElement>(null)
    const dinoRunnerGameScoreBoard = useRef<HTMLDivElement>(null)

    const [openDialog, setOpenDialog] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [startGame, setStartGame] = useState<(() => void)>(() => {})

    useEffect(() => {
        const container = dinoRunnerGameContainer.current
        const grid = dinoRunnerGameGrid.current
        const character = dinoRunnerGameCharacter.current
        const scoreBoard = dinoRunnerGameScoreBoard.current

        if (container && grid && character && scoreBoard) {
            const [handleStopBackgroundEngine, handleStartGame] = 
                startDinoRunnerGame(handleGameEnd, container, grid, character, scoreBoard)
            setStartGame(() => handleStartGame)
            return handleStopBackgroundEngine
        }
    }, [])

    function handleClose() {
        setOpenDialog(false)
        HistoryService.push(PathConstants.GAME_MENU)
    }

    function handleRestart() {
        setOpenDialog(false)
        handleStartGame()
    }

    function handleStartGame() {
        setGameStarted(true)
        startGame()
    }

    function handleGameEnd() {
        setOpenDialog(true)
        setGameStarted(false)
    }

    return(
        <div ref={dinoRunnerGameContainer} className="dino_runner_game">
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
            <div ref={dinoRunnerGameGrid} className='dino_runner_game__grid'>
                <div ref={dinoRunnerGameCharacter} className='dino_runner_game__grid__character'></div>
            </div>
            <div className="dino_runner_game__score_board_container">
                <div ref={dinoRunnerGameScoreBoard} className="dino_runner_game__score_board" /> 
            </div>
            <BackgroundSVG className='dino_runner_game__grid__background' />  
            {!gameStarted && <button className='dino_runner_game__start_game_button' onClick={handleStartGame}> Iniciar o jogo </button>}
        </div>
    )
}

export default DinoRunner