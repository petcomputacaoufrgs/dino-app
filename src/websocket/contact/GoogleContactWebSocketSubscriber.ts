import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import GoogleContactModel from '../../types/contact/api/GoogleContactDataModel'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import { GoogleContactRepositoryImpl } from '../../storage/database/contact/GoogleContactRepository'
import GoogleContactService from '../../services/contact/GoogleContactService'

class GoogleContactWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  GoogleContactModel,
  GoogleContactEntity,
  GoogleContactRepositoryImpl
> {
  constructor() {
    super(GoogleContactService)
  }
}

export default new GoogleContactWebSocketSubscriber()