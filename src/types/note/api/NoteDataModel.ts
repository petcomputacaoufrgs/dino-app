import SynchronizableDataModel from '../../synchronizable/api/SynchronizableDataModel'

export default interface NoteDataModel extends SynchronizableDataModel<number> {
  order: number
  question: string
  answer: string
  tags: string
  columnId: number
}
