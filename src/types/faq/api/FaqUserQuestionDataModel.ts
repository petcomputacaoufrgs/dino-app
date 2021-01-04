import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface FaqUserQuestionDataModel
  extends SynchronizableDataLocalIdModel<number> {
  faqId: number
  question: string
}
