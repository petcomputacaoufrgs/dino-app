import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface FaqUserQuestionDataModel
  extends SynchronizableDataLocalIdModel<number> {
  faqId: number
  question: string
}
