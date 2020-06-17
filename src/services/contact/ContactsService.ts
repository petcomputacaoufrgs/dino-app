import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from './api_model/PhoneModel'
import ContactModel from './api_model/ContactModel'
import LS from './local_storage'
import StrUtils from '../../utils/StringUtils'
import ArrayUtils from '../../utils/ArrayUtils'

class ContactsService {
  
  getItems = (): ContactModel[] => LS.getItems()
  setItems = (items: ContactModel[]) => LS.setItems(items)
  addShouldSyncItem = (id: number) => LS.addShouldSyncItem(id) 
  
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

    if(index && this.checkChanges(items[index], edited)) {
      items[index] = edited
      this.setItems(items)
      this.addShouldSyncItem(items[index].id)
    }
    else console.log("item não encontrado")

  }

  checkUniquePhone = (newPhone:PhoneModel): ContactModel | undefined => {
    const items = this.getItems()
    return items.find((item) => {
      return Boolean(
        item.phones.find((phone) => { 
          return phone.number === newPhone.number 
        })
      )
    })
  }

  //@TO-DO, verificação back-end pra ver se o id é o mesmo que o primeiro fone
  checkChanges = (item: ContactModel, edited: ContactModel): boolean => {
    
    let changed = false

    if (item.name !== edited.name)
      changed = true

    if (item.description !== edited.description){
      changed = true
    }

    if(item.phones.length === edited.phones.length){
      item.phones.forEach((phone, index) => {
        if (phone.number !== edited.phones[index].number){
          changed = true
        }
      })
    }
    else changed = true

    if (edited.color !== edited.color){
      console.log(changed)
      changed = true
    }

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
