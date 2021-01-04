import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface FaqEntity
  extends SynchronizableEntity<number> {
  title: string
  localTreatmentId?: number
}
