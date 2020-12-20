export default interface DinoStepperProps {
  steps: number
  activeStep: number
  onSave: () => void
  onCancel: () => void
  onBack: () => void
  onNext: () => void
}
