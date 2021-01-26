import React from "react"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import IconButton from '../../../components/button/icon_button'
import CircularButton from '../../../components/button/circular_button'
import Menu from "./menu"
import { ReactComponent as Dino } from '../../../assets/kids_space/dinogotchi/doctor.svg'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go-back-arrow.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/kids_space/dinogotchi/exit.svg'
import { ReactComponent as GameSVG } from '../../../assets/kids_space/dinogotchi/gamepad.svg'
import './styles.css'

// Adicionar <Menu> e tirar o resto depois

const Dinogotchi: React.FC = () => {
    return(
        <div className='dinogotchi_screen'>
            <Menu />
            <div className = 'dinogotchi_screen__header'>
                <IconButton icon = {GoBackSVG} onClick = {() => {HistoryService.push(PathConstants.HOME)}}/>
            </div>
            <div className='dinogotchi_screen__options'>
                <CircularButton icon = {GameSVG} onClick = {() => console.log('oizi')} />
                <CircularButton icon = {GoOutSVG} onClick = {() => console.log('oizi')} />
            </div>
            <Dino className='dinogotchi_screen__dino_pet'/>
        </div>
    )
}

export default Dinogotchi