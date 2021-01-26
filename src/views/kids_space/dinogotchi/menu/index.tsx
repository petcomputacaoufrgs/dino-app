import React from "react"
import PathConstants from "../../../../constants/app/PathConstants"
import HistoryService from "../../../../services/history/HistoryService"
import IconButton from '../../../../components/button/icon_button'
import { ReactComponent as GoBackSVG } from '../../../../assets/kids_space/dinogotchi/go-back-arrow.svg'
import GameCard from '../../../../components/game_card'
import CardBackground1 from '../../../../assets/kids_space/game_menu/1.png'
import CardBackground2 from '../../../../assets/kids_space/game_menu/2.png'
import CardBackground3 from '../../../../assets/kids_space/game_menu/3.png'
import CardBackground4 from '../../../../assets/kids_space/game_menu/4.png'
import CardBackground5 from '../../../../assets/kids_space/game_menu/5.png'
import './styles.css'

const GameMenu: React.FC = () => {
    return(
        <div className='game_menu'>  
            <IconButton icon = {GoBackSVG} className = 'go_back' onClick = {() => {}} />
            <GameCard onClick = {() => console.log('jogo da memória')} text = 'Jogo da Memória' background = {CardBackground3}></GameCard>
            <GameCard onClick = {() => {HistoryService.push(PathConstants.SNAKE_GAME)}} text = 'Jogo da Cobra' background = {CardBackground4}></GameCard>
            <GameCard onClick = {() => console.log('food drop')} text = 'Food Drop' background = {CardBackground5}></GameCard>
            <GameCard onClick = {() => console.log('dino jump')} text = 'Dino Jump' background = {CardBackground1}></GameCard>
            <GameCard onClick = {() => console.log('1010')} text = '1010' background = {CardBackground2}></GameCard>
        </div>
    )
}

export default GameMenu