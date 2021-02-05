import React, { useEffect } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import IconButton from '../../../components/button/icon_button'
import CircularButton from '../../../components/button/circular_button'
import { ReactComponent as Dino } from '../../../assets/kids_space/dinogotchi/doctor.svg'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go-back-arrow.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/kids_space/dinogotchi/exit.svg'
import { ReactComponent as GameSVG } from '../../../assets/kids_space/dinogotchi/gamepad.svg'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { start } from './engine/clouds'
import './styles.css'

const Dinogotchi: React.FC = () => {
	useEffect(() => {
		return start()
	}, [])
	
	const renderBackground = (): JSX.Element => {
		const currentHour = new Date().getHours()
		if (currentHour > 19) {
			return <OutsideSVG className='dinogotchi_screen__background night'/>
		}
		return <OutsideSVG className='dinogotchi_screen__background day'/>
	}

	return (
		<div className='dinogotchi_screen'>
			{renderBackground()}
			<div className='dinogotchi_screen__header'>
				<IconButton
					icon={GoBackSVG}
					onClick={() => {
						HistoryService.push(PathConstants.HOME)
					}}
				/>
			</div>
			<div className='dinogotchi_screen__options'>
				<CircularButton
					icon={GameSVG}
					onClick={() => {
						HistoryService.push(PathConstants.GAME_MENU)
					}}
				/>
				<CircularButton icon={GoOutSVG} onClick={() => console.log('oizi')} />
			</div>
			<Dino className='dinogotchi_screen__dino_pet' />
		</div>
	)
}

export default Dinogotchi
