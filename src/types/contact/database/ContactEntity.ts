import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface ContactEntity
  extends SynchronizableEntity<number, number> {
  name: string
  description?: string
  color?: number
}
