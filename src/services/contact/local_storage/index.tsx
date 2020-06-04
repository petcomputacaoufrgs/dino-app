import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../BaseLocalStorage'
import ContactModel from '../api_model/ContactModel'
//import PhoneModel from '../api_model/PhoneModel'
import StringUtils from '../../../utils/StringUtils'

class ContactsLocalStorage extends BaseLocalStorage {
    getVersion = (): number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1
    }

    getItems = (): Array<ContactModel> => {
        let items = this.get(LS_Constants.CONTACTS)
        let result = Array<ContactModel>()
        if (items) {
            result = JSON.parse(items).sort((a, b) =>
                StringUtils.normalizer(a.name) < StringUtils.normalizer(b.name) ? -1 : 1
            )
        }
        return result
    }

    setVersion = (version: number) => {
        this.set(LS_Constants.CONTACTS_VERSION, JSON.stringify(version))
    }

    setItems = (items: ContactModel[]) => {
        this.set(LS_Constants.CONTACTS, JSON.stringify(items))
    }
}

export default new ContactsLocalStorage()
