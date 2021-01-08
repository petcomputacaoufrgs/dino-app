import { MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import React from 'react'
import DinoStepperProps from './props'
import TextButton from '../button/text_button/index'
import { useLanguage } from '../../context/language'
import './styles.css'

const DinoStepper: React.FC<DinoStepperProps> = ({
  steps,
  activeStep,
  onNext,
  onBack,
  onSave,
  onCancel,
}) => {
  const language = useLanguage()

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
            aria-label={language.data.DIALOG_SAVE_BUTTON_LABEL}
            onClick={onSave}
          >
            {language.data.DIALOG_SAVE_BUTTON_TEXT}
            <KeyboardArrowRight />
          </TextButton>
        ) : (
          <TextButton
            className="next__button"
            aria-label={language.data.NEXT_BUTTON_TEXT_LABEL}
            onClick={onNext}
          >
            {language.data.NEXT_BUTTON_TEXT}
            <KeyboardArrowRight />
          </TextButton>
        )
      }
      backButton={
        activeStep === 0 ? (
          <TextButton
            className="back__button"
            aria-label={language.data.DIALOG_CANCEL_BUTTON_LABEL}
            onClick={onCancel}
          >
            <KeyboardArrowLeft />
            <p></p>
            {language.data.DIALOG_CANCEL_BUTTON_TEXT}
          </TextButton>
        ) : (
          <TextButton
            className="back__button"
            aria-label={language.data.PREVIOUS_BUTTON_TEXT_LABEL}
            onClick={onBack}
          >
            <KeyboardArrowLeft />
            {language.data.PREVIOUS_BUTTON_TEXT}
          </TextButton>
        )
      }
    />
  )
}

export default DinoStepper
