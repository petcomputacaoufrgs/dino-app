import BaseSync from '../BaseSync'
import Service from './ContactService'
import ServerService from './ContactServerService'
import ContactsUpdater from './ContactUpdater'
/*
import ContactModel from '../../types/contact/ContactModel'
import LS from './local_storage/index'
import LS_Constants from '../../constants/LocalStorageKeysConstants'
*/

class ContactSync implements BaseSync {

  sync = async (): Promise<boolean> => {
    const serverVersion = await ServerService.getVersion()

    if (serverVersion !== undefined) {
      /*
      const localVersion = Service.getVersion()

      if (serverVersion > localVersion) {
        ContactsUpdater.updateLocal(serverVersion) //SERVER -> LOCAL
        Service.setShouldSync(false)
      } else 
      */
      if (Service.shouldSync()) { //LOCAL -> SERVER
        console.log("checando")
        ContactsUpdater.updateServer()
        
      }
      
      return true
    }

    Service.setShouldSync(true)

    return false
  }
}


export default new ContactSync()
