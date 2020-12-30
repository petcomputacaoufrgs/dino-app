import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface GoogleContactDataModel
  extends SynchronizableDataLocalIdModel<number, number> {
  resourceName?: string
  contactId: number
}
