import React, { useEffect, useState } from 'react'
import KidsSpaceGoBackButton from '../../../../components/button/go_back'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import PathConstants from '../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../context/language'
import HistoryService from '../../../../services/history/HistoryService'
import SliderBoard from './board'

export const useEvent = (event: any, handler: {(this: Window, ev: any): any; (this: Window, ev: any): any;}, passive = false) => {
  useEffect(() => {
      window.addEventListener(event, handler, passive)
      return () => window.removeEventListener(event, handler)
  })
}

const DinoSlider: React.FC = () => {

  const language = useLanguage()

  const [openDialog, setOpenDialog] = useState(false)
  const [restart, setRestart] = useState(false)

  const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
    setOpenDialog(false)
    setRestart(true)
	}

	const handleGameOver = () => {
    setRestart(false)
    setOpenDialog(true)
  }

  return (
    <div className="minigame slider_dino">
      <GameOverDialog
        onAgree={handleRestart}
        onDisagree={handleClose}
        open={openDialog}
      >
        <p>{language.data.MEMORY_GAME_GAME_OVER}</p>
      </GameOverDialog>
      <KidsSpaceGoBackButton />
      <SliderBoard 
        onGameOver={handleGameOver} 
        restart={restart}
      />
    </div>
  )}

export default DinoSlider