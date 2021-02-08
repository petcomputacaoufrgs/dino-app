import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import CircularButton from '../../../components/button/circular_button'
import { ReactComponent as Dino } from '../../../assets/kids_space/dinogotchi/doctor.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/kids_space/dinogotchi/exit.svg'
import { ReactComponent as GameSVG } from '../../../assets/kids_space/dinogotchi/gamepad.svg'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/dinogotchi/inside.svg'
import { startCloudEngine } from './engine/clouds'
import { startPaitingEngine } from './engine/painting'
import GoBackButton from '../../../components/button/go_back'
import './styles.css'

const Dinogotchi: React.FC = () => {
	const [isInside, setInside] = useState(true)

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
			<GoBackButton path={PathConstants.HOME} />
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
