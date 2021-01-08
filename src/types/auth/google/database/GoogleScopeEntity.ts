import SynchronizableEntity from '../../../sync/database/SynchronizableEntity'

export default interface GoogleScopeEntity
  extends SynchronizableEntity<number> {
  name: string
}
