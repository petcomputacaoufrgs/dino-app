import React from 'react'
import DinoIconButton from '../icon_button'
import GoBackButtonProps from './props'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go_back_arrow.svg'
import HistoryService from '../../../services/history/HistoryService'
import './styles.css'

const GoBackButton: React.FC<GoBackButtonProps> = ({ className, path }) => (
	<DinoIconButton
		icon={GoBackSVG}
		className={className ? className : 'go_back_button'}
		onClick={() => HistoryService.push(path)}
	/>
)

export default GoBackButton
