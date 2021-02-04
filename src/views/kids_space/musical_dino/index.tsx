import React, { useEffect } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { startGame } from './engine/index.js'
import {ReactComponent as DinoSVG} from '../../../assets/kids_space/dinogotchi/dino.svg'
import './styles.css'

const MusicalDino: React.FC = () => {
	return (
		<>
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
                <button className='start_game__button' id="start" onClick = {startGame}>Iniciar jogo</button>
            </div>
		</>
	)
}

export default MusicalDino