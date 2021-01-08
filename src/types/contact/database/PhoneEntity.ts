import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface PhoneModel
  extends SynchronizableEntity<number> {
  localContactId?: number
  number: string
  type: number
}
