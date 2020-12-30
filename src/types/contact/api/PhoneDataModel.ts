import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface PhoneDataModel
  extends SynchronizableDataLocalIdModel<number, number> {
  contactId: number
  number: string
  type: number
}
