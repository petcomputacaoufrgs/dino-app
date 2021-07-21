import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/dinogotchi/inside.svg'
import { startCloudEngine } from './engine/clouds'
import { startPaitingEngine } from './engine/painting'
import Loader from '../../../components/loader'
import ArrowBack from '../../../components/arrow_back'
import DinoEnum from '../../../types/enum/DinoEnum'
import DinogotchiInterior from './dinogotchi_interior'
import './styles.css'

const Dinogotchi: React.FC = () => {
	const [state, setState] = useState(DinoEnum.ASLEEP)

	useEffect(() => {
		if (state === DinoEnum.OUTSIDE)
			return startCloudEngine()
		startPaitingEngine()
	}, [state])

	const renderBackground = (): JSX.Element => {
		const currentHour = new Date().getHours()
		return state === DinoEnum.OUTSIDE 
		? renderOusideBackground(currentHour)
		: renderInsideBackground(currentHour)
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
		<div className={`dinogotchi_screen ${state === DinoEnum.OUTSIDE ? 'outside' : 'inside'}`}>
			{renderBackground()}
			<DinogotchiInterior/>
			{/* <AccessDialog 
				open={open} 
				icon={AngryDinoSVG} 
				onClose={() => setOpen(false)} 
				onConfirm = {() => HistoryService.push(PathConstants.HOME)} 
			/> */}
			<ArrowBack kids onClick={() => HistoryService.push(PathConstants.USER_HOME)} />
		</div>
	)
}

export default Dinogotchi
