import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import { PhoneRepositoryImpl } from '../../storage/database/contact/PhoneRepository'
import PhoneService from '../../services/contact/PhoneService'
import PhoneModel from '../../types/contact/api/PhoneModel'

class PhoneWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  number,
  PhoneModel,
  PhoneEntity,
  PhoneRepositoryImpl
> {
  constructor() {
    super(PhoneService)
  }
}

export default new PhoneWebSocketSubscriber()
