import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface PhoneDataModel
  extends SynchronizableDataLocalIdModel<number> {
  contactId?: number
  essentialContactId?: number 
  number: string
  type: number
}
