import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../BaseLocalStorage'
import ContactModel from '../../../types/contact/ContactModel'
import StrU from '../../../utils/StringUtils'

class ContactsLocalStorage extends BaseLocalStorage {

  getShouldSync = () : boolean => {
    const shouldSync = this.get(LS_Constants.CONTACTS_SHOULD_SYNC)
    return shouldSync ? JSON.parse(shouldSync) : true 
  }

  setShouldSync = (shouldSync : boolean) => {
    this.set(LS_Constants.CONTACTS_SHOULD_SYNC, JSON.stringify(shouldSync))
  }

  getVersion = (): number => {
    const version = this.get(LS_Constants.CONTACTS_VERSION)
    return version ? JSON.parse(version) : 0 
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

  shouldSync = (): boolean => {
    return this.get(LS_Constants.CONTACTS_ADD) != null 
    //|| this.get(LS_Constants.EDIT_CONTACTS) != null 
    //|| this.get(LS_Constants.DELETE_CONTACTS) != null
  }

  setOpIDs = (LSkey: string, ids: Array<number>) => {
    this.set(LSkey, ids.toString())
  }

  getOpIDs = (LSkey: string): number[] => {
    const items = this.get(LSkey)
      ?.split(',')
      .map((x) => +x)
    return items || []
  }

  pushToStack = (id: number, ids: Array<number>): Array<number> => {
    const index = ids.findIndex((stackId) => stackId === id)
    if (index > -1) ids.splice(index, 1)
    ids.push(id)
    return ids
  }

  pushAddOp = (id: number) => {
    const ids = this.getOpIDs(LS_Constants.CONTACTS_ADD)
    this.setOpIDs(LS_Constants.CONTACTS_ADD, this.pushToStack(id, ids))
  }

  pushEditOp = (id: number) => {
    let ids = this.getOpIDs(LS_Constants.CONTACTS_EDIT)
    this.setOpIDs(LS_Constants.CONTACTS_EDIT, this.pushToStack(id, ids))
  }

  pushDeleteOp = (id: number) => {
    let ids = this.getOpIDs(LS_Constants.CONTACTS_DEL)
    this.setOpIDs(LS_Constants.CONTACTS_DEL, this.pushToStack(id, ids))
  }

  cleanOpIDs = (LSkey: string) => {
    localStorage.removeItem(LSkey)
  }

  getLastId = (): number => {
    const id = localStorage.getItem(LS_Constants.CONTACTS_LAST_ID)
    return id ? JSON.parse(id) : this.getLastItemId()
  }

  getLastItemId = (): number => {
    let items: Array<ContactModel> = this.getItems()
    if (items.length) {
      items.sort((a, b) => a.frontId - b.frontId)
      return items[items.length - 1].frontId
    }
    return 0
  }

  updateLastId = (): number => {
    const lastId = this.getLastId() + 1
    localStorage.setItem(LS_Constants.CONTACTS_LAST_ID, JSON.stringify(lastId))
    return lastId
  }
}

export default new ContactsLocalStorage()
