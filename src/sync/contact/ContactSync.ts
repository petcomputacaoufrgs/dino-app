import Service from '../../services/contact/ContactService'
import ServerService from '../../services/contact/ContactServerService'
import BaseSync from '../BaseSync'
import ContactService from '../../services/contact/ContactService'

class ContactSync implements BaseSync {
  send = async (): Promise<void> => {
    if (Service.shouldSync()) {
      await ServerService.updateServer()
    }
  }

  receive = async (): Promise<void> => {
    const serverVersion = await ServerService.getVersion()
    const localVersion = ContactService.getVersion()
    if (serverVersion !== undefined) {
      if (localVersion === undefined || serverVersion > localVersion) {
        await Service.updateLocal(serverVersion)
      }
    }
  }
}

export default new ContactSync()
