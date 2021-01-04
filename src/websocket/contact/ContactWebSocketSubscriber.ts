import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import ContactDataModel from '../../types/contact/api/ContactDataModel'
import ContactEntity from '../../types/contact/database/ContactEntity'
import { ContactRepositoryImpl } from '../../storage/database/contact/ContactRepository'
import ContactService from '../../services/contact/ContactService'

class ContactWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  ContactDataModel,
  ContactEntity,
  ContactRepositoryImpl
> {
  constructor() {
    super(ContactService)
  }
}

export default new ContactWebSocketSubscriber()
