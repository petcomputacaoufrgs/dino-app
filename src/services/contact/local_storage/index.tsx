import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../BaseLocalStorage'
import ContactModel from '../../../types/contact/ContactModel'
import StrU from '../../../utils/StringUtils'

class ContactsLocalStorage extends BaseLocalStorage {

  getVersion = (): number | undefined => {
    const version = this.get(LS_Constants.CONTACTS_VERSION)
    return version ? JSON.parse(version) : undefined 
  }

  setVersion = (version : number) => {
    this.set(LS_Constants.CONTACTS_VERSION, JSON.stringify(version))
  }
  
  getItems = (): Array<ContactModel> => {
    let items = this.get(LS_Constants.CONTACTS)
    let result = Array<ContactModel>()
    if (items) result = JSON.parse(items)
    return result
  }

  setItems = (items: ContactModel[]) => {
    this.set(
      LS_Constants.CONTACTS,
      JSON.stringify(StrU.sortByAttr(items, 'name'))
    )
  }

  removeAllItems = () => {
    this.remove(LS_Constants.CONTACTS)
    this.remove(LS_Constants.CONTACTS_LAST_ID)
    this.remove(LS_Constants.CONTACTS_UPDATE)
    this.remove(LS_Constants.CONTACTS_DEL)
    this.remove(LS_Constants.CONTACTS_VERSION)
    this.remove(LS_Constants.CONTACTS_SHOULD_SYNC)
  }

  setOpIDs = (LSkey: string, ids: Array<number>) => {
    this.set(LSkey, JSON.stringify(ids))
  }

  getOpIDs = (LSkey: typeof LS_Constants.CONTACTS_UPDATE | typeof LS_Constants.CONTACTS_DEL): number[] => {
    const items = this.get(LSkey)
    return items ? JSON.parse(items) as number[] : new Array<number>()
  }

  pushToQueue = (id: number, ids: Array<number>): Array<number> => {
    const newIds = ids.filter(queueId => queueId !== id)
    newIds.push(id)
    return newIds
  }

  pushUpdateOp = (id: number) => {
    const ids = this.getOpIDs(LS_Constants.CONTACTS_UPDATE)
    this.setOpIDs(LS_Constants.CONTACTS_UPDATE, this.pushToQueue(id, ids))
  }

  pushDeleteOp = (id: number) => {
    let ids = this.getOpIDs(LS_Constants.CONTACTS_DEL)    
    this.setOpIDs(LS_Constants.CONTACTS_DEL, this.pushToQueue(id, ids))
  }

  cleanOpQueue = (key: typeof LS_Constants.CONTACTS_UPDATE | typeof LS_Constants.CONTACTS_DEL) => {
    localStorage.removeItem(key)
  }

  getLastId = (): string | null => {
    return localStorage.getItem(LS_Constants.CONTACTS_LAST_ID)
  }

  setLastId = (lastId: number) => {
    return localStorage.setItem(LS_Constants.CONTACTS_LAST_ID, JSON.stringify(lastId))
  }
  
}

export default new ContactsLocalStorage()
