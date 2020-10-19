import Service from '../../services/contact/ContactService'
import ServerService from '../../services/contact/ContactServerService'
import BaseSync from '../BaseSync'

class ContactSync implements BaseSync {
  send = async (): Promise<void> => {
    if (Service.shouldSync()) {
      await ServerService.updateServer()
    }
  }

  receive = async (): Promise<void> => {
    const serverVersion = await ServerService.getVersion()
    if (serverVersion !== undefined) {
      await Service.updateLocal(serverVersion)
    }
  }
}

export default new ContactSync()
