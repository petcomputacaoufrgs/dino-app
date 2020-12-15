import ContactService from "../../services/contact/ContactService"
import { ContactRepositoryImpl } from "../../storage/database/contact/ContactRepository"
import ContactModel from "../../types/contact/api/ContactModel"
import ContactEntity from "../../types/contact/database/ContactEntity"
import SynchronizableSync from "../synchronizable/SynchronizableSync"

class ContactSync extends SynchronizableSync<
  number,
  number,
  ContactModel,
  ContactEntity,
  ContactRepositoryImpl
> {}

export default new ContactSync(ContactService)