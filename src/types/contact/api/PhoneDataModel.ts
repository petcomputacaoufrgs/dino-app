import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface PhoneDataModel
  extends SynchronizableDataLocalIdModel<number> {
  contactId: number
  number: string
  type: number
}
