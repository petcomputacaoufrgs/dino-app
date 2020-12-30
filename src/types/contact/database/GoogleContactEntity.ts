import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface ContactGoogleResourceNameModel
  extends SynchronizableEntity<number, number> {
  resourceName?: string
  localContactId?: number
}
