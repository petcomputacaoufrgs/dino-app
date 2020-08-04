import Service from './ContactService'
import ServerService from './ContactServerService'
import ContactsUpdater from './ContactUpdater'
import BaseSync from '../../types/services/BaseSync'

class ContactSync implements BaseSync {

  sync = async (): Promise<void> => { //fazer primeiro o local na base do sync, tirar o if de versoes

    const serverVersion = await ServerService.getVersion()

      const localVersion = Service.getVersion()

      if (serverVersion === localVersion) { //LOCAL -> SERVER
        if(Service.shouldSync())
          ContactsUpdater.updateServer()
      }
  }
}


export default new ContactSync()
