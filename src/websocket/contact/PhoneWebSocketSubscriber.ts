import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import { PhoneRepositoryImpl } from '../../storage/database/contact/PhoneRepository'
import PhoneService from '../../services/contact/PhoneService'
import PhoneDataModel from '../../types/contact/api/PhoneDataModel'

class PhoneWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  PhoneDataModel,
  PhoneEntity,
  PhoneRepositoryImpl
> {
  constructor() {
    super(PhoneService)
  }
}

export default new PhoneWebSocketSubscriber()
