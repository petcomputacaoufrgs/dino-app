import BaseSync from '../BaseSync'
import Service from './ContactService'
import ServerService from './ContactServerService'
import ContactsUpdater from './ContactUpdater'

class ContactSync implements BaseSync {

  sync = async (): Promise<boolean> => { //fazer primeiro o local na base do sync, tirar o if de versoes

    const serverVersion = await ServerService.getVersion()

      const localVersion = Service.getVersion()

      if (serverVersion === localVersion) { //LOCAL -> SERVER
        if(Service.shouldSync())
          ContactsUpdater.updateServer()
        return true
      }
      return false
  }
}


export default new ContactSync()
