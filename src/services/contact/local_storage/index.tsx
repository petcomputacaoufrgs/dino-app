import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../BaseLocalStorage'
import ContactModel from '../api_model/ContactModel'
import StrUtils from '../../../utils/StringUtils'

class ContactsLocalStorage extends BaseLocalStorage {

    getItems = (): Array<ContactModel> => {
        let items = this.get(LS_Constants.CONTACTS)
        let result = Array<ContactModel>()
        if (items) 
            result = JSON.parse(items)
        return result
    }

    setItems = (items: ContactModel[]) => {
        this.set(LS_Constants.CONTACTS, JSON.stringify(StrUtils.sortByAttr(items, "name")))
    }

    setShouldSyncItems = (items: Array<number>) => {
        this.set(LS_Constants.SHOULD_SYNC_CONTACTS, items.toString())
    }

    getShouldSyncItems = (): number[] => {
        const items = this.get(LS_Constants.SHOULD_SYNC_CONTACTS)?.split(',').map(x => +x)
        console.log(items)
        return items || []
    }

    addShouldSyncItem = (id: number) => {
        let items = this.getShouldSyncItems()
        items.push(id)
        this.setShouldSyncItems(items)
    }

    cleanShouldSync = () => {
        localStorage.removeItem(LS_Constants.SHOULD_SYNC_CONTACTS)
    }
}

export default new ContactsLocalStorage()
