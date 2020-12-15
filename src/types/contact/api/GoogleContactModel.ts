import SynchronizableDataModel from "../../synchronizable/api/SynchronizableDataModel"

export default interface ContactGoogleResourceNameModel  extends SynchronizableDataModel<number> {
  resourceName: string
  contactId: number
}
