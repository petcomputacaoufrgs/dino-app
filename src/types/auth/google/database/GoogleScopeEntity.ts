import SynchronizableEntity from '../../../synchronizable/database/SynchronizableEntity'

export default interface GoogleScopeEntity
  extends SynchronizableEntity<number, number> {
  name: string
}
