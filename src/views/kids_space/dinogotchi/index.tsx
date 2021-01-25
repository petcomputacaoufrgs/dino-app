import React from "react"
import PathConstants from "../../../constants/app/PathConstants"
import HistoryService from "../../../services/history/HistoryService"
import IconButton from '../../../components/button/icon_button'
//import Menu from "./menu"
import { ReactComponent as Dino } from '../../../assets/doctor.svg'
import { ReactComponent as GoBackSVG } from '../../../assets/go-back-arrow.svg'
import './styles.css'

// Adicionar <Menu> e tirar o resto depois

const Dinogotchi: React.FC = () => {
    return(
        <div className='classe_qualquer'> 
            <div className = 'dinogotchi_header'>
                <IconButton icon = {GoBackSVG} onClick = {() => {HistoryService.push(PathConstants.HOME)}}/>
            </div>
            <Dino className='dino_pet'/>
        </div>
    )
}

export default Dinogotchi