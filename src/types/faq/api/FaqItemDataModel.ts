import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface FaqItemDataModel
  extends SynchronizableDataLocalIdModel<number> {
  question: string
  answer: string
  faqId: number
}
