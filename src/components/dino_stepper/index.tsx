import { MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import React from 'react'
import { useUserSettings } from '../../context/provider/user_settings'
import DinoStepperProps from './props'
import './styles.css'
import TextButton from '../button/text_button/index'

const DinoStepper: React.FC<DinoStepperProps> = ({
  steps,
  activeStep,
  onNext,
  onBack,
  onSave,
  onCancel,
}) => {
  const userSettings = useUserSettings()

  const language = userSettings.service.getLanguage(userSettings)

  return (
    <MobileStepper
      className="dino_stepper"
      variant="dots"
      steps={steps}
      position="static"
      activeStep={activeStep}
      nextButton={
        activeStep === steps - 1 ? (
          <TextButton
            className="next__button"
            aria-label={language.DIALOG_SAVE_BUTTON_LABEL}
            onClick={onSave}
          >
            {language.DIALOG_SAVE_BUTTON_TEXT}
            <KeyboardArrowRight />
          </TextButton>
        ) : (
          <TextButton
            className="next__button"
            aria-label={language.NEXT_BUTTON_TEXT_LABEL}
            onClick={onNext}
          >
            {language.NEXT_BUTTON_TEXT}
            <KeyboardArrowRight />
          </TextButton>
        )
      }
      backButton={
        activeStep === 0 ? (
          <TextButton
            className="back__button"
            aria-label={language.DIALOG_CANCEL_BUTTON_LABEL}
            onClick={onCancel}
          >
            <KeyboardArrowLeft />
            <p></p>
            {language.DIALOG_CANCEL_BUTTON_TEXT}
          </TextButton>
        ) : (
          <TextButton
            className="back__button"
            aria-label={language.PREVIOUS_BUTTON_TEXT_LABEL}
            onClick={onBack}
          >
            <KeyboardArrowLeft />
            {language.PREVIOUS_BUTTON_TEXT}
          </TextButton>
        )
      }
    />
  )
}

export default DinoStepper
