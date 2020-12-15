import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import ContactEntity from '../../../types/contact/database/ContactEntity'

export class ContactRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  ContactEntity
> {
  async getByLocalId(localId: number): Promise<ContactEntity | undefined> {
    return this.table.where('localId').equals(localId).first()
  }

  async getById(id: number): Promise<ContactEntity | undefined> {
    return this.table.where('id').equals(id).first()
  }
}

export default new ContactRepositoryImpl(Database.contact)