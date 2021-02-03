import TreatmentEntity from '../../treatment/database/TreatmentEntity'
import FaqItemEntity from '../database/FaqItemEntity'

export default interface TreatmentView {
	treatment: TreatmentEntity
	faqItems: Array<FaqItemEntity>
}
