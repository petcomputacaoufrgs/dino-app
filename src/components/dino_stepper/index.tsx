import { Button, MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import React from 'react'
import { useCurrentLanguage } from '../../context/provider/app_settings'
import DinoStepperProps from './props'
import './styles.css'

const DinoStepper: React.FC<DinoStepperProps> = ({ steps, 
  activeStep, 
  setActiveStep, 
  onSave, 
  onCancel 
}) => {
  
  const language = useCurrentLanguage()

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  return (
    <MobileStepper
      className="dino_stepper"
      variant="dots"
      steps={steps}
      position="static"
      activeStep={activeStep}
      nextButton={
        activeStep === steps - 1 ?
        <Button 
          className="next__button"
          aria-label={language.DIALOG_SAVE_BUTTON_LABEL} 
          onClick={onSave}
          >
            {language.DIALOG_SAVE_BUTTON_TEXT}
            <KeyboardArrowRight />
        </Button> 
        :
        <Button 
          className="next__button"
          aria-label={language.NEXT_BUTTON_TEXT_LABEL}  
          onClick={handleNext}
          >
            {language.NEXT_BUTTON_TEXT}
            <KeyboardArrowRight />
        </Button>
      }
      backButton={
        activeStep === 0 ?
        <Button 
          className="back__button" 
          aria-label={language.DIALOG_CANCEL_BUTTON_LABEL} 
          onClick={onCancel}
          >
            <KeyboardArrowLeft />
            {language.DIALOG_CANCEL_BUTTON_TEXT}
        </Button> 
        :
        <Button 
          className="back__button" 
          aria-label={language.PREVIOUS_BUTTON_TEXT_LABEL} 
          onClick={handleBack}
          >
            <KeyboardArrowLeft />
            {language.PREVIOUS_BUTTON_TEXT}
        </Button>
      }
    />
  )
}

export default DinoStepper