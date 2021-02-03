import TreatmentEntity from "../../../../types/treatment/database/TreatmentEntity"

export default interface QuestionDialogFormProps {
	dialogOpen: boolean
	treatment: TreatmentEntity
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
