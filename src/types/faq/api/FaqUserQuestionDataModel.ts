import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface FaqUserQuestionDataModel
  extends SynchronizableDataLocalIdModel<number, number> {
  faqId: number
  question: string
}
