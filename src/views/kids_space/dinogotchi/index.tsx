import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import Button from '../../../components/button'
import { ReactComponent as AngryDinoSVG } from '../../../assets/kids_space/dinogotchi/angry.svg'
import { ReactComponent as Dino } from '../../../assets/new/dino_expressions/neutrop.svg'
import { ReactComponent as SleepDino } from '../../../assets/kids_space/dinogotchi/dormindo.svg'
import { ReactComponent as GoOutSVG } from '../../../assets/new/game_elements/sairdecasa.svg'
import { ReactComponent as GameSVG } from '../../../assets/new/game_elements/jogo.svg'
import { ReactComponent as GoToSleepSVG } from '../../../assets/new/game_elements/dormir.svg'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/dinogotchi/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/dinogotchi/inside.svg'
import { startCloudEngine } from './engine/clouds'
import { startPaitingEngine } from './engine/painting'
import AccessDialog from '../../../components/dialogs/kids_space_dialog/access_dialog'
import DinoColorConstants from '../../../constants/dinogotchi/DinoColorConstants'
import KidsSpaceSettingsService from '../../../services/kids_space/KidsSpaceSettingsService'
import { KidsSpaceSettingsEntity } from '../../../types/kids_space/database/KidsSpaceSettingsEntity'
import Loader from '../../../components/loader'
import './styles.css'
import ArrowBack from '../../../components/arrow_back'
import DinoIconButton from '../../../components/button/icon_button'

const Dinogotchi: React.FC = () => {
	const [isInside, setInside] = useState(true)
	const [open, setOpen] = useState(false)
	const [kidsSpaceSettings, setKidsSpaceSettings] = useState<KidsSpaceSettingsEntity | undefined>()
	const [openChildArea, setOpenChildArea] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [selectedColor, setSelectedColor] = useState('default')

	useEffect(() => {
		const loadData = async () => {
			const kidsSpaceSettings = await KidsSpaceSettingsService.getFirst()
			if (kidsSpaceSettings) {
				updateDate(kidsSpaceSettings)
			}
		}

		let updateDate = (kidsSpaceSettings: KidsSpaceSettingsEntity) => {
			setKidsSpaceSettings(kidsSpaceSettings)
			selectColor(kidsSpaceSettings.color)
			finishLoading()
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		KidsSpaceSettingsService.addUpdateEventListenner(loadData)
		
		if (isLoading) {
			loadData()
		}

		return () => {
			updateDate = () => {}
			finishLoading = () => {}
			KidsSpaceSettingsService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

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

	const handleChooseColor = () => {
		if (kidsSpaceSettings) {
			kidsSpaceSettings.color = selectedColor
			kidsSpaceSettings.firstSettingsDone = true
			setKidsSpaceSettings(kidsSpaceSettings)
			KidsSpaceSettingsService.save(kidsSpaceSettings)
		}
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

	const renderAwakeDino = () => {
		return (
			<>
				<Dino className='dinogotchi_screen__dino_pet' />
				<div className='dinogotchi_screen__options'>
					<DinoIconButton 
						circular
						ariaLabel={"teste"}
						icon={GameSVG}
						onClick={() => HistoryService.push(PathConstants.GAME_MENU)}
					/>
					<DinoIconButton 
						circular
						ariaLabel={"teste"}
						icon={GoOutSVG} 
						onClick={handleChangeLocation}
					/>
					<DinoIconButton 
						circular
						ariaLabel={"teste"}
 						icon={GoToSleepSVG} 
						onClick={() => {}} 
					/>
				</div>
			</>
		)
	}

	const renderSleepDino = () => <SleepDino className='dinogotchi_screen__dino_pet' onClick={() => setOpenChildArea(false)}/>

	const renderDino = () => {
		const firstSettingsNotDone = !kidsSpaceSettings || !kidsSpaceSettings.firstSettingsDone

		return firstSettingsNotDone ? meetDino() : openChildArea ? renderSleepDino() : renderAwakeDino()
	}

	const meetDino = () => {
		return (
			<>
				<div className='speech_bubble'> Olá, eu sou o Dino! Vamos escolher a cor das minhas escamas? </div>
				<Dino className='dinogotchi_screen__dino_pet first_login' />
				<div className='color_chooser'>
					<button className='color_chooser__color_button green' onClick={() => selectColor(DinoColorConstants.DEFAULT)}></button>
					<button className='color_chooser__color_button pink' onClick={() => selectColor(DinoColorConstants.PINK)}></button>
					<button className='color_chooser__color_button blue' onClick={() => selectColor(DinoColorConstants.BLUE)}></button>
					<button className='color_chooser__color_button red' onClick={() => selectColor(DinoColorConstants.RED)}></button>
				</div>

				<Button className='selection_button' onClick={handleChooseColor}> Escolher </Button>
			</>
		)
	}

	const selectColor = (color: string) => {
		setSelectedColor(color)
		document.documentElement.setAttribute('data-dino-color', color)
	}

	return (
		<Loader isLoading={isLoading} className='dinogotchi_loader' hideChildren>
			<div className={`dinogotchi_screen ${isInside ? 'inside' : 'outside'}`}>
				{renderBackground()}
				{renderDino()}
				<AccessDialog 
					open={open} 
					icon={AngryDinoSVG} 
					onClose={() => setOpen(false)} 
					onConfirm = {() => HistoryService.push(PathConstants.HOME)} 
				/>
				<ArrowBack kids onClick={() => setOpen(true)} />
			</div>
		</Loader>
	)
}

export default Dinogotchi
