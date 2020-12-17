export default interface DinoStepperProps {
  steps: number
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  onSave: () => void
  onCancel: () => void
}
