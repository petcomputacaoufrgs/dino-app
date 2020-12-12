import SynchronizableEntity from "../../synchronizable/database/SynchronizableEntity"

export default interface PhoneModel extends SynchronizableEntity<number, number> {
  contactId: number
  number: string
  type: number
}