import SynchronizableEntity from "../../synchronizable/database/SynchronizableEntity"

export default interface ContactGoogleResourceNameModel extends SynchronizableEntity<number, number> {
  contactId: number
  resourceName: string
}
