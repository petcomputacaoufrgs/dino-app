import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import ContactEntity from '../../../types/contact/database/ContactEntity'

export class ContactRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  ContactEntity
> {}

export default new ContactRepositoryImpl(Database.contact)