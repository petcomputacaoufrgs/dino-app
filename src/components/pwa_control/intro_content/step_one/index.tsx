import React from 'react'
import { useLanguage } from '../../../../context/language'

const PWAControlIntroContentStepOne: React.FC = () => {
  const language = useLanguage()

  return (
    <div className='pwa_control__intro_content__step_one'>
      <p>{language.data.PWA_INTRO_1_TEXT_1}</p>
      <p>{language.data.PWA_INTRO_1_TEXT_2}</p>
    </div>
  )
}

export default PWAControlIntroContentStepOne