import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/dinogotchi/inside.svg'
import { ReactComponent as AngryDinoSVG } from '../../../assets/kids_space/dinogotchi/angry.svg'
import { ReactComponent as GoBackSVG } from '../../../assets/kids_space/dinogotchi/go_back_arrow.svg'
import { ReactComponent as GameSVG } from '../../../assets/kids_space/dinogotchi/gamepad.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/kids_space/dinogotchi/exit.svg'
import { startCloudEngine } from './engine/clouds'
import { startPaitingEngine } from './engine/painting'
import GoBackButton from '../../../components/button/icon_button'
import RecoverPasswordDialog from '../../../components/responsible_dialog/recover_password_dialog'
import ArrowBack from '../../../components/arrow_back'
import DinoEnum from '../../../types/enum/DinoEnum'
import DinogotchiInterior from './dinogotchi_interior'
import AccessDialog from '../../../components/dialogs/kids_space_dialog/access_dialog'
import './styles.css'

const Dinogotchi: React.FC = () => {
	const [background, setBackground] = useState(DinoEnum.INSIDE)
	const [isInside, setInside] = useState(true)
	const [open, setOpen] = useState(false)
	const [openRecover, setOpenRecover] = useState(false)

	useEffect(() => {
		startCloudEngine()
		startPaitingEngine()
	}, [])

	const handleRecoverPassword = () => {
		setOpen(false)
		setOpenRecover(true)
	}

	const handleChangeLocation = () => {
		setBackground(background === DinoEnum.INSIDE ? DinoEnum.OUTSIDE : DinoEnum.INSIDE)
	}

	const renderBackground = (): JSX.Element => {
		const currentHour = new Date().getHours()
		return background === DinoEnum.OUTSIDE 
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
		<div className={`dinogotchi_screen ${background === DinoEnum.OUTSIDE ? 'outside' : 'inside'}`}>
			{renderBackground()}
			<AccessDialog 
				open={open} 
				icon={AngryDinoSVG} 
				onRecoverPassword={handleRecoverPassword}
				onClose={() => setOpen(false)} 
				onConfirm = {() => HistoryService.push(PathConstants.RESPONSIBLE_HOME)}
			/>
			<RecoverPasswordDialog open={openRecover} onClose={() => setOpenRecover(false)}/>
			<GoBackButton icon={GoBackSVG} onClick={() => {setOpen(true)}} />
			<div className='dinogotchi_screen__options'>
				<CircularButton
					icon={GameSVG}
					onClick={() => HistoryService.push(PathConstants.GAME_MENU)}
				/>
				<CircularButton icon={GoOutSVG} onClick={handleChangeLocation} />
			</div>
			<Dino className='dinogotchi_screen__dino_pet' />
			<DinogotchiInterior handleBackgroundChange={handleChangeLocation}/>
			<ArrowBack kids onClick={() => HistoryService.push(PathConstants.USER_HOME)} />
		</div>
	)
}

export default Dinogotchi
