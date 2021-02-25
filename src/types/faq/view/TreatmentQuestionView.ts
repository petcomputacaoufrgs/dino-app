import TreatmentEntity from "../../treatment/database/TreatmentEntity"
import TreatmentQuestionEntity from "../database/TreatmentQuestionEntity"

export default interface TreatmentQuestionView {
	treatment?: TreatmentEntity
	treatmentQuestions: Array<TreatmentQuestionEntity>
	numberOfQuestions: number
}