import React from 'react'
import { useLanguage } from '../../../../context/language'

const PWAControlIntroContentStepTwo: React.FC = () => {
	const language = useLanguage()

	return (
		<div className='pwa_control__intro_content__step_two'>
			<p>{language.data.PWA_INTRO_2_TEXT_1}</p>
			<p>{language.data.PWA_INTRO_2_TEXT_2}</p>
		</div>
	)
}

export default PWAControlIntroContentStepTwo
