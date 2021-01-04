import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface TreatmentEntity
  extends SynchronizableEntity<number> {
  name: string
}
