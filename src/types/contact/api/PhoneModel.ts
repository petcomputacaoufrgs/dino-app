import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface PhoneModel
  extends SynchronizableDataLocalIdModel<number, number> {
  contactId: number
  number: string
  type: number
}
