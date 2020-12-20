import FaqEntity from '../database/FaqEntity'
import FaqItemEntity from '../database/FaqItemEntity'

export default interface FaqView {
    faq: FaqEntity
    items: Array<FaqItemEntity> 
}