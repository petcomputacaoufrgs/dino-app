import LS_Constants from '../../constants/local_storage/LocalStorageKeysConstants'
import BaseLocalStorage from '../BaseLocalStorage'

// Só a classe de Serviços do Contatos manipula!
class ContactsLocalStorage extends BaseLocalStorage {
  getVersion = (): string | null => {
    return this.get(LS_Constants.CONTACTS_VERSION)
  }

  setVersion = (version: string) => {
    this.set(LS_Constants.CONTACTS_VERSION, version)
  }

  getItems = (): string | null => {
    return this.get(LS_Constants.CONTACTS)
  }

  setItems = (items: string) => {
    this.set(LS_Constants.CONTACTS, items)
  }

  removeAllItems = () => {
    this.remove(LS_Constants.CONTACTS)
    this.remove(LS_Constants.CONTACTS_LAST_ID)
    this.remove(LS_Constants.CONTACTS_UPDATE)
    this.remove(LS_Constants.CONTACTS_DEL)
    this.remove(LS_Constants.CONTACTS_VERSION)
    this.remove(LS_Constants.CONTACTS_SHOULD_SYNC)
  }

  setIdsToDelete = (ids: string) => {
    this.set(LS_Constants.CONTACTS_DEL, ids)
  }

  setIdsToUpdate = (ids: string) => {
    this.set(LS_Constants.CONTACTS_UPDATE, ids)
  }

  setResourceNamesToDelete = (resourceNames: string) => {
    this.set(LS_Constants.CONTACTS_RESOURCE_NAMES_DEL, resourceNames)
  }

  getIdsToDelete = (): string | null => {
    return this.get(LS_Constants.CONTACTS_DEL)
  }

  getIdsToUpdate = (): string | null => {
    return this.get(LS_Constants.CONTACTS_UPDATE)
  }

  getResourceNamesToDelete = (): string | null => {
    return this.get(LS_Constants.CONTACTS_RESOURCE_NAMES_DEL)
  }

  cleanUpdateQueue = () => {
    localStorage.removeItem(LS_Constants.CONTACTS_UPDATE)
  }

  cleanDeleteQueue = () => {
    localStorage.removeItem(LS_Constants.CONTACTS_DEL)
  }

  cleanDeleteGoogleQueue = () => {
    localStorage.removeItem(LS_Constants.CONTACTS_RESOURCE_NAMES_DEL)
  }

  getLastId = (): string | null => {
    return localStorage.getItem(LS_Constants.CONTACTS_LAST_ID)
  }

  setLastId = (lastId: number) => {
    return localStorage.setItem(
      LS_Constants.CONTACTS_LAST_ID,
      JSON.stringify(lastId)
    )
  }
}

export default new ContactsLocalStorage()
