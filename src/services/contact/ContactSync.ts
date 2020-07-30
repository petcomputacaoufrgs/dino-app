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
