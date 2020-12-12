import SynchronizableDataModel from "../../synchronizable/api/SynchronizableDataModel"

export default interface PhoneModel  extends SynchronizableDataModel<number> {
  contactId: number
  number: string
  type: number
}
