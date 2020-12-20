import ContactService from "../../services/contact/ContactService"
import { ContactRepositoryImpl } from "../../storage/database/contact/ContactRepository"
import ContactDataModel from "../../types/contact/api/ContactDataModel"
import ContactEntity from "../../types/contact/database/ContactEntity"
import SynchronizableSync from "../synchronizable/SynchronizableSync"

class ContactSync extends SynchronizableSync<
  number,
  number,
  ContactDataModel,
  ContactEntity,
  ContactRepositoryImpl
> {}

export default new ContactSync(ContactService)