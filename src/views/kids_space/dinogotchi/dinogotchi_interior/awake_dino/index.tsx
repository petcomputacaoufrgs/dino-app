import React, { useEffect, useState } from 'react'
import PathConstants from '../../../../../constants/app/PathConstants'
import HistoryService from '../../../../../services/history/HistoryService'
import { ReactComponent as Dino } from '../../../../../assets/kids_space/dinos/dino_empé_neutro.svg'
import { ReactComponent as GoOutSVG } from '../../../../../assets/kids_space/game_elements/sairdecasa.svg'
import { ReactComponent as GameSVG } from '../../../../../assets/kids_space/game_elements/jogo.svg'
import { ReactComponent as GoToSleepSVG } from '../../../../../assets/kids_space/game_elements/dormir.svg'
import { ReactComponent as HeartsSVG } from '../../../../../assets/kids_space/dinogotchi/hearts.svg'
import { ReactComponent as HeartSVG } from '../../../../../assets/kids_space/dinogotchi/heart.svg'
import DinoIconButton from '../../../../../components/button/icon_button'
import DinoEnum from '../../../../../types/enum/DinoEnum'
import { useLanguage } from '../../../../../context/language'
import { startPettingEngine } from '../../engine/petting'
import './styles.css'

interface AwakeDinoProps {
	hat: string
	state: DinoEnum
	onChangeState: (state: DinoEnum) => void
	onChangeCustomizeState: (state: DinoEnum) => void
	onBackgroundChange: () => void
}

const AwakeDino: React.FC<AwakeDinoProps> = ({
	hat,
	state,
	onChangeState,
	onChangeCustomizeState,
	onBackgroundChange,
}) => {
	const language = useLanguage()

	useEffect(() => {
		startPettingEngine()
	}, [])

	return (
		<>
			<Dino
				className={`dinogotchi_screen__dino_pet has_${hat}`}
				id='dino_pet'
			/>
			<HeartsSVG
				className='dinogotchi_screen__hearts'
				id='dinogotchi_screen__hearts'
			/>
			<div className='dinogotchi_screen__options'>
				<DinoIconButton
					circular
					ariaLabel={language.data.GO_TO_GAME_MENU}
					icon={GameSVG}
					onClick={() => HistoryService.push(PathConstants.GAME_MENU)}
				/>
				<DinoIconButton
					circular
					ariaLabel={language.data.CUSTOMIZE}
					icon={HeartSVG}
					onClick={() => onChangeCustomizeState(DinoEnum.CUSTOMIZE_COLOR)}
				/>
				<DinoIconButton
					circular
					ariaLabel={
						state !== DinoEnum.OUTSIDE
							? language.data.GO_OUTSIDE
							: language.data.RETURN_INSIDE
					}
					icon={GoOutSVG}
					onClick={onBackgroundChange}
				/>
				{state !== DinoEnum.OUTSIDE && (
					<DinoIconButton
						circular
						ariaLabel={language.data.GO_TO_SLEEP}
						icon={GoToSleepSVG}
						onClick={() => onChangeState(DinoEnum.ASLEEP)}
					/>
				)}
			</div>
		</>
	)
}
export default AwakeDino
