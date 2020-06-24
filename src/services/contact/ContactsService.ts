import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from './api_model/PhoneModel'
import ContactModel from './api_model/ContactModel'
import LS from './local_storage'
import ArrayUtils from '../../utils/ArrayUtils'

class ContactsService {
  
  getItems = (): ContactModel[] => LS.getItems()
  setItems = (items: ContactModel[]) => LS.setItems(items)
  addShouldSyncItem = (id: number) => LS.addShouldSyncItem(id)
  getShouldSyncItems = (): Array<number> => LS.getShouldSyncItems()
  makeId = () => LS.updateLastId() 
  
  
  addContact = (item: ContactModel) => {
    const items = this.getItems()
    items.push(item)
    this.setItems(items)
    this.addShouldSyncItem(item.id)
    console.log(item)
  }

  deleteContact = (deletedID: number): ContactModel[] => {
    const items = this.getItems()
    const index = items.findIndex(item => item.id === deletedID)
    this.addShouldSyncItem(items.splice(index, 1)[0].id)
    this.setItems(items)
    return items
  }

  deletePhone = (fromItem: ContactModel, deletedNumber: string): PhoneModel[] => {
    const items = this.getItems()
    const index = items.findIndex(item => item.id === fromItem.id)
    let indexPhone = -1
    if(index > -1) {
      indexPhone = items[index].phones.findIndex(phone => phone.number === deletedNumber)
      items[index].phones.splice(indexPhone, 1)
      this.addShouldSyncItem(items[index].id)
      this.setItems(items)
    }
    return items[index].phones
  }

  editContact = (edited: ContactModel) => {
    const items = this.getItems()

    const index = items.findIndex((item: ContactModel) => {
      return item.id === edited.id
    })
    
    if(index > -1) 
      if(this.checkChanges(items[index], edited)){
        items.splice(index, 1, edited)
        this.setItems(items)
        this.addShouldSyncItem(items[index].id)
      }
      else console.log("não mudou")
    else console.log("item não existe")
  }

  findPhone = (newPhones:Array<PhoneModel>): ContactModel | undefined => {
    const items = this.getItems()
    return items.find(item => {
      return item.phones.some(phone => newPhones.some(newPhone => newPhone.number === phone.number))
      /*const itemPhones = item.phones.map(phone => phone.number)
      const phone = newPhones.find(newPhone => itemPhones.includes(newPhone.number))
      if(phone) existsNumber = phone.number
      return Boolean(phone)
      */
    })
  }

  checkChanges = (item: ContactModel, edited: ContactModel): boolean => {
    
    let changed = false

    if(item.phones.length === edited.phones.length) {
      changed = item.phones.some((phone, index) => 
        phone.number !== edited.phones[index].number 
        || phone.type !== edited.phones[index].type 
      )
    }
    else changed = true

    if (item.name !== edited.name) changed = true

    if (item.description !== edited.description) changed = true
    
    if (item.color !== edited.color) changed = true

    return changed
  }


  getPhoneTypes = (phones: Array<PhoneModel>): string => {
    if (phones.length === 1) return this.getPhoneType(phones[0].type)

    const types = ArrayUtils.removeRepeatedValues(phones.map((phone) => phone.type))
    let result = this.getPhoneType(types[0])
    types.forEach((type, index) => {
      if (index > 0) result += ', ' + this.getPhoneType(type)
    })

    return result
  }

  getPhoneType = (type: number): string => {
    const language = useLanguage().current

    switch (type) {
      case ContactsConsts.PUBLIC_SERVICE:
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
      case ContactsConsts.RESIDENTIAL:
        return language.CONTACTS_RESIDENTIAL_PHONE
      default:
        return language.CONTACTS_MOBILE_PHONE
    }
  }
}
export default new ContactsService()
