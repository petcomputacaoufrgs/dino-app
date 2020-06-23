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

  deleteContact = (deletedID: number) => {
    const items = this.getItems()
    this.setItems(
      items.filter(function (item: ContactModel) {
        return item.id !== deletedID
      })
    )
    this.addShouldSyncItem(deletedID)
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
    })
  }

  checkChanges = (item: ContactModel, edited: ContactModel): boolean => {
    
    let changed = false

    if (item.name !== edited.name) changed = true

    if (item.description !== edited.description) changed = true

    if(item.phones.length === edited.phones.length){
      item.phones.forEach((phone, index) => {
        if (phone.number !== edited.phones[index].number || 
            phone.type !== edited.phones[index].type) 
          changed = true
      })
    }
    else changed = true

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
