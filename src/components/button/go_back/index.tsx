import React from 'react'
import IconButton from '../icon_button'
import GoBackButtonProps from './props'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go-back-arrow.svg'
import HistoryService from '../../../services/history/HistoryService'
import './styles.css'

const GoBackButton: React.FC<GoBackButtonProps> = ({ className, path }) => (
	<IconButton
		icon={GoBackSVG}
		className={className ? className : 'go_back_button'}
		onClick={() => HistoryService.push(path)}
	/>
)

export default GoBackButton
