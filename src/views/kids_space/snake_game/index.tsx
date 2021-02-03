import React, { useEffect, useState } from "react"
import { Dialog, DialogActions, DialogContent, DialogContentText } from "@material-ui/core"
import TransitionSlide from "../../../components/slide_transition"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import {starGame} from './engine/index.js'
import Button from "../../../components/button"
import './styles.css'

const SnakeGame: React.FC = () => {
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
        <>  
            <Dialog
                TransitionComponent={TransitionSlide}
                open={openDialog}
                onClose={handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Oh não! Sua cobra bateu!
                        Deseja jogar novamente?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Não</Button>
                    <Button onClick={handleRestart}>Sim!</Button>
                </DialogActions>
            </Dialog>
            <div id="score-board"></div>
            <div id="game-board"></div>
        </>
    )
}

export default SnakeGame