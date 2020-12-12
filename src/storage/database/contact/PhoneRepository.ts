import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import PhoneEntity from '../../../types/contact/database/PhoneEntity'

export class PhoneRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  PhoneEntity
> {}

export default new PhoneRepositoryImpl(Database.phone)