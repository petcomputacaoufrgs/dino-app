import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import PhoneModel from '../../types/contact/api/GoogleContactModel'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import { PhoneRepositoryImpl } from '../../storage/database/contact/PhoneRepository'
import PhoneService from '../../services/contact/PhoneService'

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
