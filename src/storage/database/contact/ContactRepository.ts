import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import ContactEntity from '../../../types/contact/database/ContactEntity'

export class ContactRepositoryImpl extends SynchronizableRepository<
  number,
  ContactEntity
> {
  constructor() {
    super(Database.contact)
  }
}

export default new ContactRepositoryImpl()
