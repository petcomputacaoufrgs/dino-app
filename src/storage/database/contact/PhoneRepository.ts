import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import PhoneEntity from '../../../types/contact/database/PhoneEntity'

export class PhoneRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  PhoneEntity
> {
  constructor() {
    super(Database.phone)
  }
  
  async getAllByContactLocalId(localContactId: number): Promise<PhoneEntity[]> {
    return this.table.where('localContactId').equals(localContactId).toArray()
  }
}

export default new PhoneRepositoryImpl()
