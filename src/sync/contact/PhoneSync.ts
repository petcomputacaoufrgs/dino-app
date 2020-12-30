import PhoneService from '../../services/contact/PhoneService'
import { PhoneRepositoryImpl } from '../../storage/database/contact/PhoneRepository'
import PhoneDataModel from '../../types/contact/api/PhoneDataModel'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class PhoneSync extends SynchronizableSync<
  number,
  number,
  PhoneDataModel,
  PhoneEntity,
  PhoneRepositoryImpl
> {}

export default new PhoneSync(PhoneService)
