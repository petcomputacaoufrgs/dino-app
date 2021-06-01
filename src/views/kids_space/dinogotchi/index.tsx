import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import CircularButton from '../../../components/button/circular_button'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go_back_arrow.svg'
import { ReactComponent as AngryDinoSVG } from '../../../assets/kids_space/dinogotchi/angry.svg'
import { ReactComponent as Dino } from '../../../assets/kids_space/dinogotchi/neutrop.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/kids_space/dinogotchi/exit.svg'
import { ReactComponent as GameSVG } from '../../../assets/kids_space/dinogotchi/gamepad.svg'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/dinogotchi/inside.svg'
import { startCloudEngine } from './engine/clouds'
import { startPaitingEngine } from './engine/painting'
import GoBackButton from '../../../components/button/icon_button'
import AccessDialog from '../../../components/kids_space_dialog/access_dialog'
import './styles.css'

const Dinogotchi: React.FC = () => {
	const [isInside, setInside] = useState(true)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		return startCloudEngine()
	}, [isInside])

	useEffect(() => {
		if (isInside) {
			return startPaitingEngine()
		}
	}, [isInside])

	const handleChangeLocation = () => {
		setInside(!isInside)
	}

	const renderBackground = (): JSX.Element => {
		const currentHour = new Date().getHours()
		if (isInside) {
			return renderInsideBackground(currentHour)
		}

		return renderOusideBackground(currentHour)
	}

	const renderInsideBackground = (currentHour: number): JSX.Element => {
		if (currentHour > 19) {
			return <InsideSVG className='dinogotchi_screen__background night' />
		}
		return <InsideSVG className='dinogotchi_screen__background day' />
	}

	const renderOusideBackground = (currentHour: number): JSX.Element => {
		if (currentHour > 19) {
			return <OutsideSVG className='dinogotchi_screen__background night' />
		}
		return <OutsideSVG className='dinogotchi_screen__background day' />
	}

	return (
		<div className={`dinogotchi_screen ${isInside ? 'inside' : 'outside'}`}>
			{renderBackground()}
			<AccessDialog open={open} icon={AngryDinoSVG} onClose={() => {setOpen(false)}} onConfirm = {() => {HistoryService.push(PathConstants.HOME)}}/>
			<GoBackButton icon={GoBackSVG} onClick={() => {setOpen(true)}} />
			<div className='dinogotchi_screen__options'>
				<CircularButton
					icon={GameSVG}
					onClick={() => {
						HistoryService.push(PathConstants.GAME_MENU)
					}}
				/>
				<CircularButton icon={GoOutSVG} onClick={handleChangeLocation} />
			</div>
			<Dino className='dinogotchi_screen__dino_pet' />
		</div>
	)
}

export default Dinogotchi
