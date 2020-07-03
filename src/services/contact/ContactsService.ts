import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from '../../types/contact/PhoneModel'
import ContactModel from '../../types/contact/ContactModel'
import LS from './local_storage'
import ArrayUtils from '../../utils/ArrayUtils'

class ContactsService {
  
  getItems = (): ContactModel[] => LS.getItems()
  setItems = (items: ContactModel[]) => LS.setItems(items)
  makeId = (): number => LS.updateLastId() 
  
  addContact = (item: ContactModel) => {
    const items = this.getItems()
    items.push(item)
    this.setItems(items)
    LS.pushAddOp(item.localID)
  }

  deleteContact = (deletedID: number): ContactModel[] => {
    const items = this.getItems()
    const index = items.findIndex(item => item.localID === deletedID)
    LS.pushDeleteOp(items.splice(index, 1)[0].localID)
    this.setItems(items)
    return items
  }

  editContact = (edited: ContactModel) => {
    const items = this.getItems()

    const index = items.findIndex((item: ContactModel) => {
      return item.localID === edited.localID
    })
    
    if(index > -1) 
      if(this.checkChanges(items[index], edited)){
        items.splice(index, 1, edited)
        this.setItems(items)
        LS.pushEditOp(items[index].localID)
      }
  }

  findPhone = (newPhones:Array<PhoneModel>): ContactModel | undefined => {
    const items = this.getItems()
    return items.find(item => {
      return item.phones.some(phone => newPhones.some(newPhone => newPhone.number === phone.number))
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
