import React from 'react'
import { useLanguage } from '../../../../context/language'

const PWAControlIntroContentStepZero: React.FC = () => {
	const language = useLanguage()

	return (
		<div className='pwa_control__intro_content__step_zero'>
			<p>{language.data.PWA_INTRO_0_TEXT_1}</p>
			<p>{language.data.PWA_INTRO_0_TEXT_2}</p>
		</div>
	)
}

export default PWAControlIntroContentStepZero
