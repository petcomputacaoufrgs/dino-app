import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface PhoneModel
  extends SynchronizableEntity<number> {
  localContactId?: number
  localEssentialContactId?: number
  number: string
  type: number
}
