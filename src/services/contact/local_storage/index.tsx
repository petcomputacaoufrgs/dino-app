import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../../local_storage/BaseLocalStorage'
import ContactModel from '../../../types/contact/ContactModel'
import StrU from '../../../utils/StringUtils'

class ContactsLocalStorage extends BaseLocalStorage {
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
    const ids = this.getOpIDs(LS_Constants.ADD_CONTACTS)
    this.setOpIDs(LS_Constants.ADD_CONTACTS, this.pushToStack(id, ids))
  }

  pushEditOp = (id: number) => {
    let ids = this.getOpIDs(LS_Constants.EDIT_CONTACTS)
    this.setOpIDs(LS_Constants.EDIT_CONTACTS, this.pushToStack(id, ids))
  }

  pushDeleteOp = (id: number) => {
    let ids = this.getOpIDs(LS_Constants.DELETE_CONTACTS)
    this.setOpIDs(LS_Constants.DELETE_CONTACTS, this.pushToStack(id, ids))
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
      items.sort((a, b) => a.localID - b.localID)
      return items[items.length - 1].localID
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
