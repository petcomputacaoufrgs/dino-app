export default interface DinoStepperProps {
	steps: number
	activeStep: number
	endMessage: string
	onEnd: () => void
	onCancel?: () => void
	onBack: () => void
	onNext: () => void
}
