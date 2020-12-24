import PhoneService from '../../services/contact/PhoneService'
import { PhoneRepositoryImpl } from '../../storage/database/contact/PhoneRepository'
import PhoneModel from '../../types/contact/api/PhoneModel'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class PhoneSync extends SynchronizableSync<
  number,
  number,
  PhoneModel,
  PhoneEntity,
  PhoneRepositoryImpl
> {}

export default new PhoneSync(PhoneService)
