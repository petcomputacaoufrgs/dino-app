import ContactsConstants from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from './api_model/PhoneModel'
import ContactModel from './api_model/ContactModel'
import ContactsLocalStorage from './local_storage'

class ContactsService {
  addContact = (item: ContactModel) => {
    const items = this.getItems()
    items.push(item)
    this.setItems(items)
  }

  deleteContact = (id: number) => {
    const items = this.getItems()
    this.setItems(
      items.filter(function (item: ContactModel) {
        return item.id !== id
      })
    )
  }

  editContact = (edited: ContactModel) => {
    const items = this.getItems()

    const index = items.findIndex(function (item: ContactModel) {
      return item.id === edited.id
    })

    items[index].name = edited.name
    items[index].description = edited.description
    items[index].phones = edited.phones
    if (edited.color) items[index].color = edited.color

    this.setItems(items)
  }

  setItems = (items: ContactModel[]) => {
    ContactsLocalStorage.setItems(items)
  }

  getItems = (): ContactModel[] => ContactsLocalStorage.getItems()

  getVersion = (): number => ContactsLocalStorage.getVersion()

  setVersion = (version: number) => {
    ContactsLocalStorage.setVersion(version)
  }

  getPhoneTypes = (phones: Array<PhoneModel>): string => {
    if (phones.length === 1) return this.getPhoneType(phones[0])

    let strings = new Array<string>()

    phones.forEach((phone) => {
      strings.push(this.getPhoneType(phone))
    })

    let result = strings[0]

    strings.forEach((str, index) => {
      if (index > 0) result += ', ' + str
    })

    return result
  }

  getPhoneType = (phone: PhoneModel): string => {
    const language = useLanguage().current

    switch (phone.type) {
      case ContactsConstants.PUBLIC_SERVICE:
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
      case ContactsConstants.RESIDENTIAL:
        return language.CONTACTS_RESIDENTIAL_PHONE
      default:
        return language.CONTACTS_MOBILE_PHONE
    }
  }
}
export default new ContactsService()
