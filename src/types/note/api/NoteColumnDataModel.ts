import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface NoteColumnDataModel
  extends SynchronizableDataLocalIdModel<number> {
  order: number
  title: string
}
