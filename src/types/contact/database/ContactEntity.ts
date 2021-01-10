import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface ContactEntity
  extends SynchronizableEntity<number> {
  name: string
  description?: string
  color?: number
  isEssential?: 0 | 1
}
