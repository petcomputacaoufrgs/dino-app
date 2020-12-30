import GoogleContactService from '../../services/contact/GoogleContactService'
import { GoogleContactRepositoryImpl } from '../../storage/database/contact/GoogleContactRepository'
import GoogleContactModel from '../../types/contact/api/GoogleContactDataModel'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class GoogleContactSync extends SynchronizableSync<
  number,
  number,
  GoogleContactModel,
  GoogleContactEntity,
  GoogleContactRepositoryImpl
> {
  constructor() {
    super(GoogleContactService)
  }
}

export default new GoogleContactSync()
