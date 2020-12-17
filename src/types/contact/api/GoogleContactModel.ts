import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface ContactGoogleResourceNameModel extends SynchronizableDataLocalIdModel<number, number> {
  resourceName: string
  contactId: number
}
