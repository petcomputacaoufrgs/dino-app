import React from 'react'
import { useLanguage } from '../../../context/language'
import {DinoDialogHeader, DinoDialogContent } from '../../dialogs/dino_dialog'
import PWAControlIntroContentProps from './props'
import PWAControlIntroContentStepOne from './step_one'
import PWAControlIntroContentStepThree from './step_three'
import PWAControlIntroContentStepTwo from './step_two/index'
import PWAControlIntroContentStepZero from './step_zero'

interface Content {
	title: string
	Component: React.FC
}

const PWAControlIntroContent: React.FC<PWAControlIntroContentProps> = ({
	step,
}) => {
	const language = useLanguage()

	const contents: Content[] = [
		{
			title: language.data.PWA_INTRO_TITLE_0,
			Component: PWAControlIntroContentStepZero,
		},
		{
			title: language.data.PWA_INTRO_TITLE_1,
			Component: PWAControlIntroContentStepOne,
		},
		{
			title: language.data.PWA_INTRO_TITLE_2,
			Component: PWAControlIntroContentStepTwo,
		},
		{
			title: language.data.PWA_INTRO_TITLE_3,
			Component: PWAControlIntroContentStepThree,
		},
	]

	const getCurrentDialog = () => {
		if (step < contents.length) {
			return contents[step]
		}
		return contents[contents.length - 1]
	}

	const dialog = getCurrentDialog()

	return (
		<>
			<DinoDialogHeader>
				<h5>{dialog.title}</h5>
			</DinoDialogHeader>
			<DinoDialogContent>
				<dialog.Component />
			</DinoDialogContent>
		</>
	)
}

export default PWAControlIntroContent
