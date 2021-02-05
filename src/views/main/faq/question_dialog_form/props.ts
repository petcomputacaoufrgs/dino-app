import TreatmentEntity from "../../../../types/treatment/database/TreatmentEntity"

export default interface QuestionDialogFormProps {
	treatment: TreatmentEntity
	dialogOpen: boolean
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
