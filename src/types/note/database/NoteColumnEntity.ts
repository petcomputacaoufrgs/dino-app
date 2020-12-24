import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface NoteColumnEntity
  extends SynchronizableEntity<number, number> {
  order: number
  title: string
}
