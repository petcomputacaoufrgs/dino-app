import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface ContactGoogleResourceNameModel
  extends SynchronizableEntity<number> {
  resourceName?: string
  localContactId?: number
}
