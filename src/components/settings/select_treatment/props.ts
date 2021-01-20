import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
export default interface SelectTreatmentProps {
	treatment: TreatmentEntity | undefined
	setTreatment: (treatment: TreatmentEntity) => void
	availableTreatments: TreatmentEntity[]
}
