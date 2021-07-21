import React, { useEffect, useState } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import Button from '../../../../components/button'
import { ReactComponent as Dino } from '../../../../assets/new/dino+expressoes+acessorios/dino_empé_neutro.svg'
import { ReactComponent as SleepDino } from '../../../../assets/new/dino+expressoes+acessorios/dino_dormindo.svg'
import { ReactComponent as GoOutSVG } from '../../../../assets/new/game_elements/sairdecasa.svg'
import { ReactComponent as GameSVG } from '../../../../assets/new/game_elements/jogo.svg'
import { ReactComponent as GoToSleepSVG } from '../../../../assets/new/game_elements/dormir.svg'
import { ReactComponent as Cap } from '../../../../assets/new/acessories/bone.svg'
import { ReactComponent as Hat } from '../../../../assets/new/acessories/gorro.svg'
import { ReactComponent as Lace } from '../../../../assets/new/acessories/laco.svg'
import { ReactComponent as Mohawk} from '../../../../assets/new/acessories/moicano.svg' 
import { ReactComponent as Headscarf} from '../../../../assets/new/acessories/pano.svg'
import DinoColorConstants from '../../../../constants/dinogotchi/DinoColorConstants'
import KidsSpaceSettingsService from '../../../../services/kids_space/KidsSpaceSettingsService'
import { KidsSpaceSettingsEntity } from '../../../../types/kids_space/database/KidsSpaceSettingsEntity'
import DinoIconButton from '../../../../components/button/icon_button'
import DinoEnum from '../../../../types/enum/DinoEnum'
import { useLanguage } from '../../../../context/language'
import Loader from '../../../../components/loader'
import '../styles.css'

const DinogotchiInterior: React.FC = () => {
    const language = useLanguage()
	const [state, setState] = useState(DinoEnum.ASLEEP)
	const [kidsSpaceSettings, setKidsSpaceSettings] = useState<KidsSpaceSettingsEntity | undefined>()
	const [isLoading, setIsLoading] = useState(true)
	const [selectedColor, setSelectedColor] = useState('default')
	const [selectedHat, setSelectedHat] = useState('none')
	const [colorSelected, setColorSelected] = useState(false)


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
			setSelectedHat(kidsSpaceSettings.hat)
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
	}, [isLoading, selectedHat])

	const handleCustomization = () => {
		if (kidsSpaceSettings) {
			kidsSpaceSettings.color = selectedColor
			kidsSpaceSettings.hat = selectedHat
			kidsSpaceSettings.firstSettingsDone = true
			setKidsSpaceSettings(kidsSpaceSettings)
			KidsSpaceSettingsService.save(kidsSpaceSettings)
		}
	}

	const renderAwakeDino = () => {
		return (
			<>
				<Dino className={`dinogotchi_screen__dino_pet has_${selectedHat}`}/>
				<div className='dinogotchi_screen__options'>
					<DinoIconButton 
						circular
						ariaLabel={language.data.GO_TO_GAME_MENU}
						icon={GameSVG}
						onClick={() => HistoryService.push(PathConstants.GAME_MENU)}
					/>
					<DinoIconButton 
						circular
						ariaLabel={state !== DinoEnum.OUTSIDE ? language.data.GO_OUTSIDE : language.data.RETURN_INSIDE}
						icon={GoOutSVG} 
						onClick={() => setState(state !== DinoEnum.OUTSIDE ? DinoEnum.OUTSIDE : DinoEnum.INSIDE)}
					/>
					{state !== DinoEnum.OUTSIDE &&
						<DinoIconButton 
							circular
							ariaLabel={language.data.GO_TO_SLEEP}
							icon={GoToSleepSVG} 
							onClick={() => setState(DinoEnum.ASLEEP)} 
						/>
					}
				</div>
			</>
		)
	}

	const renderSleepDino = () => <SleepDino className={`dinogotchi_screen__dino_pet sleep_dino has_${selectedHat}`} onClick={() => setState(DinoEnum.INSIDE)}/>

	const renderDinogotchiScreen = () => {
		const firstSettingsNotDone = !kidsSpaceSettings || !kidsSpaceSettings.firstSettingsDone

		return firstSettingsNotDone 
		? customizeDino()
		: renderDino()
	}

	const customizeDino = () => {
		if(colorSelected) {
			return chooseDinoHat()
		} else {
			return chooseDinoColor()
		}
	}

	const renderDino = () => {
		if (state === DinoEnum.ASLEEP) {
			return renderSleepDino()
		} else {
			return renderAwakeDino()
		}
	}

	const chooseDinoColor = () => {
		return (
			<div className='color_selection'>
				<div className='speech_bubble'>
					<div className='speech_bubble__square'>
						<p>{language.data.CHOOSE_COLOR_DINO_MESSAGE}</p>
					</div>
					<div className='speech_bubble__triangle'></div>
				</div>
				<Dino className='dinogotchi_screen__dino_pet first_login' />
				<div className='dialog_chooser'>
					<button className='dialog_chooser__button green' onClick={() => selectColor(DinoColorConstants.DEFAULT)}></button>
					<button className='dialog_chooser__button pink' onClick={() => selectColor(DinoColorConstants.PINK)}></button>
					<button className='dialog_chooser__button blue' onClick={() => selectColor(DinoColorConstants.BLUE)}></button>
					<button className='dialog_chooser__button red' onClick={() => selectColor(DinoColorConstants.RED)}></button>
				</div>

				<Button className='selection_button' onClick={() => setColorSelected(true)}> Escolher </Button>
			</div>
		)
	}

	const chooseDinoHat = () => {
		return (
			<div className='hat_selection'>
				<div className='speech_bubble'>
					<div className='speech_bubble__square'>
						<p>{language.data.CHOOSE_ACESSORY_DINO_MESSAGE}</p>
					</div>
					<div className='speech_bubble__triangle'></div>
				</div>
				<div className="dialog_chooser">
					<Cap onClick={() => {setSelectedHat('bone')}}/>
					<Hat onClick={() => setSelectedHat('gorro')}/>
					<Lace onClick={() => setSelectedHat('laco')}/>
					<Mohawk onClick={() => setSelectedHat('moicano')}/>
					<Headscarf onClick={() => setSelectedHat('lenco')}/>
					<div onClick={() => setSelectedHat('none')}> X </div>
				</div>
				<Dino className={`dinogotchi_screen__dino_pet first_login has_${selectedHat}`} />
				<Button className='selection_button' onClick={handleCustomization}> {language.data.CHOOSE} </Button>
			</div>
		)
	}

	const selectColor = (color: string) => {
		setSelectedColor(color)
		document.documentElement.setAttribute('data-dino-color', color)
	}

    return (
        <Loader isLoading={isLoading} className='dinogotchi_loader' hideChildren>
            {renderDinogotchiScreen()}
        </Loader>
    )
}
export default DinogotchiInterior