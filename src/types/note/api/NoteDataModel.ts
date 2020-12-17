import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface NoteDataModel extends SynchronizableDataLocalIdModel<number, number> {
  order: number
  question: string
  answer: string
  tags: string
  columnId: number
}
