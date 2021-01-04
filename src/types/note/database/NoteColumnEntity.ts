import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface NoteColumnEntity
  extends SynchronizableEntity<number> {
  order: number
  title: string
}
