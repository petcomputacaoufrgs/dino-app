import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import ContactModel from '../../types/contact/api/ContactModel'
import ContactEntity from '../../types/contact/database/ContactEntity'
import { ContactRepositoryImpl } from '../../storage/database/contact/ContactRepository'
import ContactService from '../../services/contact/ContactService'

class ContactWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  number,
  ContactModel,
  ContactEntity,
  ContactRepositoryImpl
> {
  constructor() {
    super(ContactService)
  }
}

export default new ContactWebSocketSubscriber()
