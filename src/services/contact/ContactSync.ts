import Service from './ContactService'
import ServerService from './ContactServerService'
import BaseSync from '../../sync/BaseSync'

class ContactSync implements BaseSync {
  receive = async (): Promise<void> => {
    //fazer primeiro o local na base do sync, tirar o if de versoes

    const serverVersion = await ServerService.getVersion()

    const localVersion = Service.getVersion()

    if (serverVersion === localVersion) {
      //LOCAL -> SERVER
      if (Service.shouldSync()) {
      }
    }
  }

  send = async (): Promise<void> => {}
}

export default new ContactSync()
